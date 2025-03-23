import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import { Folder } from "../dataTypes";
import {
  copyToClipboard,
  downloadQRCode,
  generateFolderLink,
  generateQRcode,
  handleBackgroundImageUpload
} from "../utils/folderLinkMethods";
import { addFolder } from "../utils/folderMethods";




const AddFolderPage = () => {
  const { user } = useAuth(); 
  const userId = user!.id ;
  const [step, setStep] = useState(1);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [folderName, setFolderName] = useState("");
  const [clientName, setClientName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [webLink, setWebLink] = useState(generateFolderLink());
  const [folderData, setFolderData] = useState<Folder | null>(null);



  const handleCreateFolder = async () => {
    const newFolder: Omit<Folder, "photoCount" | "createdAt"> = {
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
      <div className="border border-gray-600 rounded-lg p-8 w-96 text-center">
          <h2 className="text-2xl font-bold text-blue-400 mb-6">📂 Create a New Folder</h2>
          
          <InputField type="text" placeholder="Enter Folder Name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
          <div className="my-2" />
          <InputField type="text" placeholder="Enter Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <div className="my-2" />
          <InputField type="text" placeholder="Enter Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          <div className="my-4" />
          <Button label="Next" onClick={() => setStep(2)} disabled={!isFormValid} size="large" />
            
        </div>
        </div>

      )}

      {/* Step 2: QR Code Generation Page */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-400 mb-6">🔵 Generate QR Code</h2>

          
          <div className="flex items-center space-x-6">
          <div className="relative flex flex-col items-center p-4 border border-gray-500 rounded-md w-80 h-96">
      {/* Background Image Container */}
      <div
        className="absolute inset-0 w-full h-full rounded-md"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      
      {/* QR Code Container at the Top */}
      <div className="relative w-48 h-48 flex items-center justify-center bg-opacity-50 rounded-md mt-8">
        <QRCodeCanvas id="qrcode" value={webLink} size={150} />
      </div>
    </div>

            <div className="flex flex-col w-full">
              <label className="text-gray-400 mb-1">Attach a background image</label>
              <input type="file" onChange={(e) => handleBackgroundImageUpload(e, setBackgroundImage)} className="p-2 bg-gray-700 rounded-md mb-4" />

              <label className="text-gray-400 mb-1">Link:</label>
              <div className="flex items-center bg-gray-700 p-2 rounded-md">
                <span className="flex-grow truncate">{webLink}</span>
                <button onClick={() => copyToClipboard(webLink)} className="ml-2 bg-gray-600 px-3 py-1 rounded text-white">
                  Copy it
                </button>
              </div>
              <div className="flex justify-between mb-4">
              <Button label="Download" onClick={downloadQRCode} size="medium" />
          <Button label="Share" onClick={downloadQRCode} size="medium" />
          </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 mt-4">
            Using this QR code or web link, guests can download their photos when available.
            They need to submit their email and name to get notified first.
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-400">✅ Folder Created Successfully!</h2>
          <p><strong>Name:</strong> {folderData.name}</p>
          <p><strong>Client:</strong> {folderData.client}</p>
          <p><strong>Purpose:</strong> {folderData.purpose}</p>
          <p><strong>Photos:</strong> {folderData.photoCount}</p>
          <p><strong>Web Link:</strong> {folderData.webLink}</p>

          <div className="mt-4">
            {generateQRcode({ id: "finalQRCode", value: folderData.webLink, size: 150 })}
          </div>

          <button onClick={() => setStep(1)} className="mt-4 bg-blue-600 px-6 py-2 rounded-md">
            Create Another Folder
          </button>
        </div>
      )}
    </div>
  );
};

export default AddFolderPage;
