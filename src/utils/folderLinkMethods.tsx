import { QRCodeCanvas } from "qrcode.react";
import React from "react";


/**
 * Generates a unique folder link
 */

/**
 * Copies text to clipboard
 */
export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

/**
 * Generates a QR Code component
 */
export const generateQRcode = ({ id, value, size }: { id: string; value: string; size: number }) => (
  <QRCodeCanvas id={id} value={value} size={size} />
);

/**
 * Handles background image upload for QR code
 */
export const handleBackgroundImageUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  setBackgroundImage: React.Dispatch<React.SetStateAction<string | null>>
) => {
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

/**
 * Downloads QR code as an image
 */
export const downloadQRCode = () => {
  const canvas = document.getElementById("qrcode") as HTMLCanvasElement | null;
  if (!canvas) {
    console.error("QR Code canvas not found");
    return;
  }

  try {
    const imageURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "qr-code.png";

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Failed to download QR Code:", error);
  }
};
