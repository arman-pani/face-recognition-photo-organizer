import React, { useState } from "react";
import { Folder } from "../dataTypes";
import { updateFolderDetails } from "../utils/folderMethods"; // Adjust the path
import InputField from "./InputField";

interface UpdateFolderDetailsPopupProps {
  folder: Folder;
  onClose: () => void;

}

const UpdateFolderDetailsPopup: React.FC<UpdateFolderDetailsPopupProps> = ({ folder, onClose }) => {
  const [name, setFolderName] = useState(folder.name);
  const [client, setClientName] = useState(folder.client);
  const [purpose, setPurpose] = useState(folder.purpose);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateFolderDetails(folder._id ?? "", {
        name,
        client,
        purpose
      });
      alert("Folder updated successfully!");
    onClose();    
} catch (error) {
      alert("Failed to update folder.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg relative">
        <h2 className="text-xl text-blue-600 font-semibold mb-4">Update Folder Details</h2>

        <InputField type="text" placeholder="Enter Folder Name" value={name} onChange={(e) => setFolderName(e.target.value)} />
        <InputField type="text" placeholder="Enter Client Name" value={client} onChange={(e) => setClientName(e.target.value)} />
        <InputField type="text" placeholder="Enter Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
       

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateFolderDetailsPopup;
