const API_URL = "http://localhost:5000/api";

interface PresignedUrl {
  uploadUrl: string;
  filePath: string;
}

export const uploadMultipleImagesToS3 = async (files: FileList, folderId: string) => {
  try {
    if (!folderId) {
      throw new Error("Folder ID is required to upload images.");
    }

    const fileNames = Array.from(files).map((file) => file.name);
    const fileTypes = Array.from(files).map((file) => file.type);

    // Step 1: Request pre-signed URLs from the backend using POST
    const response = await fetch(`${API_URL}/images/generate-multiple-presigned-urls`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileNames, fileTypes }), // Moved data to the request body
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pre-signed URLs.");
    }

    const { presignedUrls }: { presignedUrls: PresignedUrl[] } = await response.json();

    if (!presignedUrls || presignedUrls.length !== files.length) {
      throw new Error("Mismatch in the number of pre-signed URLs received.");
    }

    // Step 2: Upload each file to S3
    const uploadedImageUrls = await Promise.all(
      presignedUrls.map(async (urlObj, index) => {
        const file = files[index];
        await fetch(urlObj.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        // Construct the final S3 URL
        return `https://event-images-by-photographers.s3.us-east-1.amazonaws.com/${urlObj.filePath}`;
      })
    );

    console.log("Uploaded Image URLs:", uploadedImageUrls);

    // Step 3: Send the S3 URLs to the backend to store in the database
    const storeResponse = await fetch(`${API_URL}/folders/add-photos-links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId, imageUrls: uploadedImageUrls }),
    });

    if (!storeResponse.ok) {
      throw new Error("Failed to store image links in the database.");
    }

    alert("Images uploaded and stored successfully!");
  } catch (error) {
    console.error("Error uploading images:", error);
    alert("Image upload failed. Please try again.");
  }
};
export const deleteImage = async (folderId: string, imageUrl: string) => {
  try {
    await fetch(`${API_URL}/images/delete-image`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderId, imageUrl })
    });

    alert("Image deleted successfully!");
  } catch (error) {
    console.error('Delete failed:', error);
  }
};

