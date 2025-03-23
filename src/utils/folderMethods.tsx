import axios from "axios";
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
    _id: string;
    name: string;
    client: string;
    purpose: string;
    photoCount: number;
    webLink: string;
    createdAt: Date;
  };
}

export const addFolder = async (userId: string, folderData: Omit<Folder, "photoCount" | "createdAt">): Promise<FolderResponse | null> => {
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
    await axios.delete(`${API_URL}/${folderId}`, { data: { userId } });
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