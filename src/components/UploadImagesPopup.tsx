// components/UploadImagesPopup.tsx
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { uploadMultipleImagesToS3 } from "../utils/imageMethods.tsx";

const UploadImagesPopup = ({ folderId }: { folderId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Open File Input Dialog
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  // Handle Image Upload
  const handleUpload = async () => {
    if (!selectedFiles) return alert("No files selected!");

    try {
      await uploadMultipleImagesToS3(selectedFiles,folderId);
      // alert("Images uploaded successfully!");
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      alert("Image upload failed.");
    }
  };

  return (
    <>
      {/* Floating Upload Button */}
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 flex items-center px-4 py-2 bg-blue-500 text-white hover:bg-blue-400 rounded-full shadow-lg"
      >
        <Upload size={16} className="mr-2" />
        Upload Photos
      </Button>

      {/* Pop-up Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Upload Images</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* File Input */}
            <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="mt-4 w-full" />

            {/* Preview Selected Images */}
            {selectedFiles && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {Array.from(selectedFiles).map((file, index) => (
                  <div key={index} className="relative w-24 h-24 overflow-hidden rounded-md border">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <Button onClick={handleUpload} className="mt-4 w-full bg-green-500 text-white hover:bg-green-400">
              Upload
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadImagesPopup;
