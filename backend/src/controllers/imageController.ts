import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import dotenv from "dotenv";
import { Request, Response } from "express";
import Folder from "../models/Folder";

dotenv.config();

// Ensure required environment variables are loaded
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION || !process.env.S3_BUCKET_NAME) {
  throw new Error("Missing required AWS environment variables");
}

const config = {
  aws: {
    bucket: process.env['S3_BUCKET_NAME'],
    region: process.env['AWS_REGION'],
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
  }
}
// Create an S3 client using AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const generateMultiplePresignedUrls = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileNames, fileTypes } = req.body;
    console.log("Request body:", req.body);
    console.log("Request params:", req.params);
    console.log("Request headers:", req.headers);

    if (!fileNames || !fileTypes || !Array.isArray(fileNames) || !Array.isArray(fileTypes) || fileNames.length !== fileTypes.length) {
      res.status(400).json({ message: "Invalid request. fileNames and fileTypes must be arrays of equal length." });
      return;
    }

    const presignedUrls = await Promise.all(
      fileNames.map(async (fileName, index) => {
        const fileType = fileTypes[index];
        const uniqueId = crypto.randomUUID();
        const filePath = `uploads/${uniqueId}-${fileName}`;

        // Create a command for S3
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: filePath,
          ContentType: fileType,
          // ACL: "public-read", // Optional: depends on your bucket settings
        });

        // Generate a presigned URL
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 5 minutes

        return { uploadUrl, filePath };
      })
    );



    res.status(200).json({ presignedUrls });
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};



export const deleteImageFromFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folderId, imageUrl } = req.body;

    // Validate required fields
    if (!folderId || !imageUrl) {
      res.status(400).json({ message: "folderId and imageUrl are required." });
      return;
    }

    // 1. Remove from MongoDB first
    const updatedFolder = await Folder.findOneAndUpdate(
      { _id: folderId },
      { $pull: { photos: imageUrl } },
      { new: true }
    );

    if (!updatedFolder) {
      res.status(404).json({ message: "Folder not found." });
      return;
    }

    // 2. Delete from S3
    const urlParts = imageUrl.split('/');
    const keyIndex = urlParts.indexOf('uploads') + 1;
    const keyParts = urlParts.slice(keyIndex);
    const decodedKey = decodeURIComponent(keyParts.join('/')).split('?')[0]; // Handle URL encoding and query params

    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: decodedKey,
    }));

    res.status(200).json({
      message: "Image deleted successfully",
      folder: updatedFolder
    });

  } catch (error) {
    console.error("Error deleting image:", error);
    
    // Handle specific AWS errors
    if (error instanceof Error && error.name === "NoSuchKey") {
      res.status(404).json({ message: "File not found in S3 bucket" });
    }
    
    res.status(500).json({ 
      message: "Failed to delete image",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};