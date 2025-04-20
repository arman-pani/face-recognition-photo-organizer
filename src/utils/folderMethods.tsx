import axios from "axios";
import { ObjectId } from "bson";
import { Folder } from "../dataTypes"; // Ensure you have this interface in a separate file

const API_URL = "http://localhost:5000/api/folders";


// ✅ Fetch User Folders
export const fetchUserFolders = async (userId: string): Promise<Folder[]> => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data.map((folder: any) => ({
      ...folder,
      id: folder._id, // ✅ Map `_id` to `id`
    }));
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
};


// ✅ Add a New Folder
export interface FolderResponse {
  message: string;
  folder: {
    _id: ObjectId;
    name: string;
    client: string;
    purpose: string;
    photoCount: number;
    webLink: string;
    createdAt: Date;
    photos: string[];
  };
}

export const addFolder = async (userId: string, folderData: Omit<Folder, "photoCount" | "createdAt" | "photos">): Promise<FolderResponse | null> => {
  try {
    const requestData = { ...folderData, userId }; // Merging userId into the request body

    const response = await axios.post<FolderResponse>(`${API_URL}/create`, requestData);
    return response.data;
  } catch (error) {
    console.error("Error adding folder:", error);
    return null;
  }
};

// ✅ Delete Folder
export const deleteFolder = async (folderId: string, userId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/delete/${folderId}`, { data: { userId } });
    return true;
  } catch (error) {
    console.error("Error deleting folder:", error);
    return false;
  }
};

// ✅ Fetch Folder Info
export const getFolderById = async (folderId: string) => {
  try {
    const response = await axios.get(`${API_URL}/folder_info/${folderId}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching folder:", error);
    throw error;
  }
};


export const updateFolderDetails = async (folderId: string, updates: Partial<Folder>) => {
  try {
    const response = await axios.put(`${API_URL}/update/${folderId}`, updates);
    return response.data;

  } catch (error) {
      console.error('Error updating folder:', error);
    throw error;
  }
};
export const matchSelfieWithFolder = async (folderId: string, selfieFile: File): Promise<string[]> => {
  try {
    const formData = new FormData();
    formData.append("selfie", selfieFile); // 👈 make sure this key matches multer config

    const response = await fetch(`${API_URL}/compare/${folderId}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to match selfie");
    }

    // ✅ Returns the matched image URLs
    return data.matchedUrls;
  } catch (error: any) {
    console.error("Error comparing selfie:", error.message || error);
    throw error;
  }
};

let callCount = 0;

export const dummyImages = (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      callCount += 1;

      if (callCount === 1) {
        resolve([
          "https://event-images-by-photographers.s3.us-east-1.amazonaws.com/uploads/06241852-45a4-486b-bf49-3200a953074f-10.jpg",
          "https://event-images-by-photographers.s3.us-east-1.amazonaws.com/uploads/1be627d0-a68b-4c53-87bc-f12d4cf98782-5.jpg",
          "https://event-images-by-photographers.s3.us-east-1.amazonaws.com/uploads/0b5de982-2de3-4b3d-9cb2-8f578402036f-1.jpg",
          "https://event-images-by-photographers.s3.us-east-1.amazonaws.com/uploads/24581fe1-b88f-4ad4-add9-8f691cef5f0c-8.jpg",
        ]);
      } else {
        resolve([
          "https://event-images-by-photographers.s3.us-east-1.amazonaws.com/uploads/06241852-45a4-486b-bf49-3200a953074f-10.jpg",
          "https://event-images-by-photographers.s3.us-east-1.amazonaws.com/uploads/1be627d0-a68b-4c53-87bc-f12d4cf98782-5.jpg",
          "https://event-images-by-photographers.s3.us-east-1.amazonaws.com/uploads/0b5de982-2de3-4b3d-9cb2-8f578402036f-1.jpg",
"https://event-images-by-photographers.s3.us-east-1.amazonaws.com/uploads/1fbad78a-f0a8-4108-bf49-f1cc4356142f-2.jpg"
        ]);
      }
    }, 20000); // 20 seconds
  });
};
