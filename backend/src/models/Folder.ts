import mongoose, { Document, Schema } from "mongoose";

// Folder Interface
export interface IFolder extends Document {
  name: string;
  client: string;
  purpose: string;
  photoCount: number;
  webLink: string;
  createdAt: Date;
  photos: { url: string; encoding: number[][] }[];
}

// Folder Schema
const FolderSchema = new Schema<IFolder>({
  name: { type: String, required: true },
  client: { type: String, required: true },
  purpose: { type: String, required: true },
  photoCount: { type: Number, default: 0 },
  webLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  photos: [
    {
      url: { type: String },
      encoding: { type: [[Number]], default: [] }, // Array of 128-dimensional arrays
    }
  ],
});

const Folder = mongoose.model<IFolder>("Folder", FolderSchema);
export default Folder;
