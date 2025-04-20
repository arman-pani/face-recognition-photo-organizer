import { ObjectId } from "bson";

// User Interface
export interface User {
    id: string;
    name: string;
    email: string;
    folders: Folder[];
  }
  
  // Folder Interface
  export interface Folder {
    _id: ObjectId;
    name: string;
    client: string;
    purpose: string;
    photoCount: number;
    webLink: string;
    createdAt: Date;
    photos: { url: string; encoding: number[][] }[];
  }
  