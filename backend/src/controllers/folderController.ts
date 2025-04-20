import { spawn } from "child_process";
import { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import Folder from "../models/Folder";
import User from "../models/User";


async function getEncodingsFromPython(imageUrl: string): Promise<number[][]> {
  return new Promise((resolve, reject) => {
    const py = spawn("python", ["faceEncoding.py", imageUrl]);

    let data = "";
    let error = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    py.on("close", (code) => {
      if (code !== 0 || error) {
        reject(new Error(error || `Python script exited with code ${code}`));
        return;
      }

      try {
        const parsed = JSON.parse(data);
        if (parsed.error) reject(new Error(parsed.error));
        else resolve(parsed);
      } catch (err) {
        reject(new Error("Failed to parse Python output: " + err));
      }
    });
  });
}


export const matchSelfieWithFolderImages = async (req: Request, res: Response) => {
  try {
    const folderId = req.params.folderId;
    const selfieFile = req.file;

    if (!selfieFile) {
       res.status(400).json({ error: "Selfie is required." });
    }

    const selfiePath = selfieFile!.path;

    // Step 1: Get encoding for the selfie using Python
    const selfieEncoding: number[] = await new Promise((resolve, reject) => {
      const py = spawn("python", [
        path.join(__dirname, "../python/compare_selfie.py"),
        "encode",
        selfiePath,
      ]);

      let data = "";
      let error = "";

      py.stdout.on("data", (chunk) => (data += chunk.toString()));
      py.stderr.on("data", (chunk) => (error += chunk.toString()));

      py.on("close", (code) => {
        if (code !== 0 || error) {
          reject(new Error(error || `Python exited with code ${code}`));
          return;
        }

        try {
          const result = JSON.parse(data);
          if (!Array.isArray(result) || result.length === 0) {
            reject(new Error("No face encoding found in selfie."));
          } else {
            resolve(result[0]); // Only the first face encoding is used
          }
        } catch (err) {
          reject(new Error("Failed to parse Python encoding output: " + err));
        }
      });
    });

    // Step 2: Fetch folder and photos
    const folder = await Folder.findById(folderId);
    if (!folder) {
      fs.unlinkSync(selfiePath);
       res.status(404).json({ error: "Folder not found." });
    }

    const imageEncodings = folder?.photos.map((photo) => ({
      url: photo.url,
      encoding: photo.encoding,
    }));

    // Step 3: Compare encodings using Python
    const comparisonResult: string[] = await new Promise((resolve, reject) => {
      const py = spawn("python", [
        path.join(__dirname, "../python/compare_selfie.py"),
        "compare",
        JSON.stringify(selfieEncoding),
        JSON.stringify(imageEncodings),
      ]);

      let data = "";
      let error = "";

      py.stdout.on("data", (chunk) => (data += chunk.toString()));
      py.stderr.on("data", (chunk) => (error += chunk.toString()));

      py.on("close", (code) => {
        fs.unlinkSync(selfiePath); // Clean up after comparison

        if (code !== 0 || error) {
          reject(new Error(error || `Python exited with code ${code}`));
          return;
        }

        try {
          const result = JSON.parse(data);
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve(result.matched || []);
          }
        } catch (err) {
          reject(new Error("Failed to parse Python compare output: " + err));
        }
      });
    });

    // Step 4: Respond with matched image URLs
     res.status(200).json({ matchedUrls: comparisonResult });

  } catch (err: any) {
    console.error("Server Error:", err.message || err);
    if (req.file) fs.unlinkSync(req.file.path); // Cleanup in case of error
     res.status(500).json({ error: err.message || "Internal server error" });
  }
};




// ✅ Fetch folders associated with a user
export const getUserFolders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    // Find user and populate folders
    const user = await User.findById(userId).populate("folders");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user.folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : error });
  }
};

// ✅ Add a new folder for a user
export const addFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, _id, name, client, purpose, webLink } = req.body;

    // Validate required fields
    if (!userId || !name) {
      res.status(400).json({ message: "User ID and Folder Name are required" });
      return;
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Create a new folder
    const newFolder = new Folder({
      _id,
      name,
      client,
      purpose,
      photoCount: 0,
      webLink,
    });

    const savedFolder = await newFolder.save();

    // Add folder reference to user
    user.folders.push(savedFolder._id as mongoose.Types.ObjectId);
    await user.save();

    res.status(201).json({ message: "Folder created successfully", folder: savedFolder });
  } catch (error) {
    console.error("Error adding folder:", error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : error });
  }
};

// ✅ Delete a folder by ID for a user
export const deleteFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folderId } = req.params;
    const { userId } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(folderId) || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid folder ID or user ID format" });
      return;
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Ensure folder belongs to user
    if (!user.folders.includes(folderId as unknown as mongoose.Types.ObjectId)) {
      res.status(403).json({ message: "Folder does not belong to the user" });
      return;
    }

    // Delete folder
    await Folder.findByIdAndDelete(folderId);

    // Remove folder from user's folders array
    user.folders = user.folders.filter((id) => id.toString() !== folderId);
    await user.save();

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : error });
  }
};

// ✅ Update folder details (name, client, purpose)
// This function allows updating the folder's name, client, or purpose.

export const updateFolderDetails = async (req: Request, res: Response) => {
  const { folderId } = req.params;
  const { name, client, purpose } = req.body;

  try {
    // Validate input: ensure at least one field is provided
    if (!name && !client && !purpose) {
       res.status(400).json({ message: 'At least one field (name, client, or purpose) must be provided to update.' });
    }

    // Build the update object dynamically
    const updateFields: Partial<{ name: string; client: string; purpose: string }> = {};
    if (name) updateFields.name = name;
    if (client) updateFields.client = client;
    if (purpose) updateFields.purpose = purpose;

    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedFolder) {
       res.status(404).json({ message: 'Folder not found' });
    }

    res.status(200).json({
      message: 'Folder updated successfully',
      data: updatedFolder,
    });
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getFolderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folderId } = req.params;

    // Validate folderId
    if (!folderId) {
      res.status(400).json({ message: "Folder ID is required" });
      return;
    }

    // Find folder by ID
    const folder = await Folder.findById(folderId);

    if (!folder) {
      res.status(404).json({ message: "Folder not found" });
      return;
    }

    res.status(200).json(folder);
  } catch (error) {
    console.error("Error fetching folder:", error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : error });
  }
};


export const addPhotoLinksOnFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folderId, imageUrls } = req.body;
    console.log("Request body:", req.body);
    console.log("Request params:", req.params);
    console.log("Request headers:", req.headers);

    // Validate required fields
    if (!folderId || !imageUrls || !Array.isArray(imageUrls)) {
      res.status(400).json({ message: "Invalid request. folderId and imageUrls are required." });
      return;
    }

    const imageData = await Promise.all(
      imageUrls.map(async (url: string) => {
        const encodings = await getEncodingsFromPython(url); // array of arrays
        return { url, encoding: encodings };
      })
    );

    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { $addToSet: { photos: { $each: imageData } } },
      { new: true }
    );

    if (!updatedFolder) {
      res.status(404).json({ message: "Folder not found." });
      return;
    }

    res.status(200).json({
      message: "Photos added successfully.",
      folder: updatedFolder,
    });
  } catch (error) {
    console.error("Error adding photo links:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


