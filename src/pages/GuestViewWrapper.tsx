import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { dummyImages } from '../utils/folderMethods';
import GuestViewPage from './GuestView';

const videoConstraints = {
  width: 300,
  height: 400,
  facingMode: 'user',
};

const GuestViewWrapperPage: React.FC = () => {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [matchedUrls, setMatchedUrls] = useState<string[] | null>(null);
  const webcamRef = React.useRef<Webcam>(null);
  const { folderId } = useParams();

  const captureSelfie = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setSelfie(imageSrc || null);
  };

  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const confirmSelfie = async () => {
    if (!selfie || !folderId) return;
  
    try {
      // const selfieFile = dataURLtoFile(selfie, 'selfie.jpg');
      const urls: string[] = await dummyImages();
      setMatchedUrls(urls);
      setConfirmed(true);
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    }
  };

  if (!selfie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Please Take a Selfie to Continue</h1>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="rounded-xl shadow-lg"
        />
        <button
          onClick={captureSelfie}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Capture
        </button>
      </div>
    );
  }

  if (!confirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Confirm Your Selfie</h1>
        <img src={selfie} alt="Selfie" className="rounded-xl shadow-lg mb-4" />
        <div className="flex space-x-4">
          <button
            onClick={() => setSelfie(null)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retake
          </button>
          <button
            onClick={confirmSelfie}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }

  return <GuestViewPage folderId={folderId!} matchedUrls={matchedUrls || []} />;
};

export default GuestViewWrapperPage;
