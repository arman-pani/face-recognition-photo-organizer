import { Request, Response } from "express";
import mongoose from "mongoose";
import Folder from "../models/Folder";
import User from "../models/User";


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
    const { userId, name, client, purpose, webLink } = req.body;

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