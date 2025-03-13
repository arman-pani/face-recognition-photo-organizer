import { QRCodeCanvas } from "qrcode.react";
import React, { useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";

const AddFolderPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    folderName: "",
    clientName: "",
    purpose: "",
  });

  const [qrLink, setQrLink] = useState("wedlinker.com/" + Math.random().toString(36).substring(7));
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrLink);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload for QR background
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        setBackgroundImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // QR Code download
  const downloadQRCode = () => {
    const canvas = document.getElementById("qrcode") as HTMLCanvasElement | null;
    if (!canvas) {
      console.error("QR Code canvas not found");
      return;
    }
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "QRCode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

    const [folderName, setFolderName] = useState("");
    const [clientName, setClientName] = useState("");
    const [purpose, setPurpose] = useState("");



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
          <Button label="Next" onClick={nextStep} size="large" />
            
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
        <QRCodeCanvas id="qrcode" value={qrLink} size={150} />
      </div>
    </div>

            <div className="flex flex-col w-full">
              <label className="text-gray-400 mb-1">Attach a background image</label>
              <input type="file" onChange={handleImageUpload} className="p-2 bg-gray-700 rounded-md mb-4" />

              <label className="text-gray-400 mb-1">Link:</label>
              <div className="flex items-center bg-gray-700 p-2 rounded-md">
                <span className="flex-grow truncate">{qrLink}</span>
                <button onClick={copyToClipboard} className="ml-2 bg-gray-600 px-3 py-1 rounded text-white">
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
          <Button label="Back" onClick={prevStep} size="medium" />
          <Button label="Create" onClick={nextStep} size="medium" />

        </div>



        </div>
      )}

      {/* Step 3: Folder Created Page */}
      {step === 3 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-400">✅ Folder Created Successfully!</h2>
          <p>You have successfully created a new folder.</p>
          <button onClick={() => setStep(1)} className="mt-4 bg-blue-600 px-6 py-2 rounded-md">
            Create Another Folder
          </button>
        </div>
      )}
    </div>
  );
};

export default AddFolderPage;
