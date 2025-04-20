// components/DeleteFolderPopup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Folder } from "../dataTypes";
import { deleteFolder } from "../utils/folderMethods"; // Create this function if not already

interface DeleteFolderPopupProps {
  folder: Folder;
  onClose: () => void;
}

const DeleteFolderPopup: React.FC<DeleteFolderPopupProps> = ({ folder, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();


  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteFolder(folder._id ?? "", user!.id);
      alert("Folder deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete folder:", error);
      alert("Failed to delete folder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl w-[360px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h2>
        <p className="text-gray-700 mb-6">Are you sure you want to delete <strong>{folder.name}</strong>?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderPopup;
