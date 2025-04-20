import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";


dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadLocalImage = async (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const fileKey = `uploads/${Date.now()}-${fileName}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileKey,
      Body: fileContent,
      ContentType: "image/png",
    };

    // Upload file using SDK v3
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log("✅ File uploaded successfully");

    // Generate pre-signed URL
    const signedUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return { fileUrl: signedUrl, signedUrl };
  } catch (error) {
    console.error("❌ Upload error:", error);
    throw new Error("File upload failed");
  }
};




export const generatePreSignedUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📥 Request Body:", req.body); // Log incoming request
    const { fileName, contentType } = req.body;

    if (!fileName || !contentType) {
       res.status(400).json({ error: "Missing fileName or contentType" });
    }

    const fileKey = `uploads/${Date.now()}-${fileName}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileKey,
      ContentType: contentType,
    };

    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand(uploadParams),
      { expiresIn: 300 }
    );

    res.status(200).json({ message: "✅ URL generated", signedUrl, fileKey });
  } catch (error: any) {
    console.error("❌ Error generating pre-signed URL:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getDownloadUrl = async (fileKey: string) => {
  try {
    const downloadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileKey,
    };

    // Generate pre-signed URL for downloading
    const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(downloadParams), { expiresIn: 300 }); // 5 min expiry

    return signedUrl;
  } catch (error) {
    console.error("❌ Error generating download URL:", error);
    throw new Error("Failed to generate download URL");
  }
};
