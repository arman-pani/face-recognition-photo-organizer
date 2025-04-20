import { ObjectId } from "bson";
import { ArrowRight, Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import { Folder } from "../dataTypes";
import {
  copyToClipboard,
  downloadQRCode,
} from "../utils/folderLinkMethods";
import { addFolder } from "../utils/folderMethods";

const AddFolderPage = () => {
  const { user } = useAuth();
  const userId = user!.id;
  const [step, setStep] = useState(1);
  const [folderName, setFolderName] = useState("");
  const [clientName, setClientName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [folderData, setFolderData] = useState<Folder | null>(null);
  const navigate = useNavigate();
  const newFolderId = new ObjectId()
  const webLink = `${window.location.origin}/guest_view/${newFolderId}`;
  const handleCreateFolder = async () => {
    

    const newFolder: Omit<Folder, "photoCount" | "createdAt" | "photos"> = {
      _id: newFolderId,
      name: folderName,
      client: clientName,
      purpose,
      webLink,
    };

    const response = await addFolder(userId, newFolder);
    if (response) {
      setFolderData(response.folder);
      setStep(3);
    } else {
      alert("Failed to create folder. Please try again.");
    }
  };

  const isFormValid = folderName.trim() && clientName.trim() && purpose.trim();

  if (!userId) {
    return <p>Loading...</p>; // Handle case where userId is not available
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-900 text-white">
      {/* Step 1: Folder Information Form */}
      {step === 1 && (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
          <div className="border bg-white border-gray-600 rounded-lg p-8 w-96 text-center">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">
              📂 Create a New Folder
            </h2>

            <InputField
              type="text"
              placeholder="Enter Folder Name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <div className="my-2" />
            <InputField
              type="text"
              placeholder="Enter Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <div className="my-2" />
            <InputField
              type="text"
              placeholder="Enter Purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
            <div className="my-4" />
            <Button
              label="Next"
              onClick={() => setStep(2)}
              disabled={!isFormValid}
              size="large"
            />
          </div>
        </div>
      )}

      {/* Step 2: QR Code Generation Page */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-400 mb-6">
            🔵 Generate QR Code
          </h2>

          <div className="flex items-center space-x-6">
              {/* QR Code Container at the Top */}
              <div className="border border-zinc-700 rounded-xl p-6 aspect-square flex items-center justify-center bg-white">
                <QRCodeCanvas
                  id="qrcode"
                  value={webLink}
                  size={256}
                  level="H"
                />
              </div>
           

            <div className="flex flex-col justify-between w-full">
              <label className="text-gray-400 mb-1">Link:</label>
              <div className="flex items-center bg-gray-700 p-2 rounded-md">
                <span className="flex-grow truncate">{webLink}</span>
                <button
                  onClick={() => copyToClipboard(webLink)}
                  className="ml-2 bg-gray-600 px-3 py-1 rounded text-white"
                >
                  Copy it
                </button>
              </div>
              <div className="flex justify-between mt-10 mb-4">
                <Button
                  label="Download"
                  onClick={downloadQRCode}
                  size="medium"
                />
                <Button label="Share" onClick={downloadQRCode} size="medium" />
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 mt-4">
            Using this QR code or web link, guests can download their photos
            when available. They need to submit their email and name to get
            notified first.
          </p>

          {/* Buttons */}

          <div className="mt-4 flex w-full justify-between">
            <Button label="Back" onClick={() => setStep(1)} size="medium" />
            <Button label="Create" onClick={handleCreateFolder} size="medium" />
          </div>
        </div>
      )}

      {/* Step 3: Folder Created Page */}

      {step === 3 && folderData && (
        <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
            <h1 className="text-3xl font-light mb-12 text-center">
              The folder is created and the link is live!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* QR Code with Photo */}
              <div className="border border-zinc-700 rounded-xl p-6 aspect-square flex items-center justify-center bg-white">
                <QRCodeCanvas
                  value={folderData.webLink}
                  size={256}
                  level="H"
                  imageSettings={{
                    src: folderData.photos[0] || "",
                    width: 80,
                    height: 80,
                    excavate: true,
                  }}
                />
              </div>

              {/* Details Panel */}
              <div className="border border-zinc-700 rounded-xl p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm text-blue-400">
                    Folder Name
                  </label>
                  <div className="text-lg font-light">{folderData.name}</div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-blue-400">
                    Client Name
                  </label>
                  <div className="text-lg font-light">{folderData.client}</div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-blue-400">Purpose</label>
                  <div className="text-lg font-light">{folderData.purpose}</div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-blue-400">Link</label>
                  <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-3">
                    <span className="text-lg font-light flex-1">
                      {folderData.webLink}
                    </span>
                    <button
                      onClick={() => copyToClipboard(folderData.webLink)}
                      className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <Copy size={20} className="text-zinc-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors px-4 py-2 rounded-lg border border-blue-400 hover:border-blue-300">
                Go to Dashboard
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFolderPage;
