import { Expand, Link, Pencil, QrCode, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteFolderPopup from "../components/DeleteFolderPopup";
import IconButton from "../components/IconButton";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import UpdateFolderDetailsPopup from "../components/UpdateFolderDetailsPopup"; // Adjust path
import UploadImagesPopup from "../components/UploadImagesPopup";
import { Folder } from "../dataTypes";
import { copyToClipboard, downloadQRCode } from "../utils/folderLinkMethods";
import { getFolderById } from "../utils/folderMethods";
import { deleteImage } from "../utils/imageMethods";

const FolderPage = () => {
  const { folderId} = useParams();

  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    if (!folderId) return;

    const fetchFolder = async () => {
      try {
        const data = await getFolderById(folderId);
        setFolder(data);
      } catch (err) {
        setError("Failed to load folder");
      } finally {
        setLoading(false);
      }
    };

    fetchFolder();
  }, [folderId]);

  if (loading) return <p className="text-gray-100">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!folder) return <p className="text-gray-100">Folder not found</p>;

  return (
    <div className="w-screen h-screen bg-gray-900 text-gray-100 p-6 flex flex-col items-center">
      {/* Folder Header */}
      <div className="w-full flex justify-between items-center border-b border-gray-800 pb-4 bg-gray-800 px-6 py-4 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">{folder.name}</h1>
          <p className="text-sm text-gray-400">
            {folder.client} | {folder.purpose} | {folder.photos.length} Photos
          </p>
          <p className="text-xs text-gray-500">
            Created on{" "}
            {new Date(folder.createdAt)
              .toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
              .replace(/(\d{1,2})/, (day) => {
                let suffix = "th";
                if (day.endsWith("1") && day !== "11") suffix = "st";
                if (day.endsWith("2") && day !== "12") suffix = "nd";
                if (day.endsWith("3") && day !== "13") suffix = "rd";
                return `${day}${suffix}`;
              })}
          </p>
        </div>
        <div className="flex gap-3">
          <IconButton
            icon={Pencil}
            variant="outline"
            onClick={() => setShowUpdatePopup(true)}
          />
          <IconButton
            icon={Trash}
            variant="outline"
            onClick={() => setShowDeletePopup(true)}
          />
          <IconButton
            icon={Link}
            variant="outline"
            onClick={() => copyToClipboard(folder.webLink)}
          />
          <IconButton
            icon={QrCode}
            variant="outline"
            onClick={downloadQRCode}
          />
        </div>
      </div>

      {/* Photos Grid */}
      {folder.photos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {folder.photos.map((photo, index) => (
            <Card
              key={index}
              className="relative bg-gray-800 border border-gray-700"
            >
              <CardContent className="p-2 flex items-center justify-center">
                <img
                  src={photo['url']}
                  alt="photo"
                  className="w-full h-full object-cover rounded-md"
                />
              </CardContent>
              {/* Expand & Delete Buttons */}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="text-gray-100 border-gray-700 hover:border-blue-400"
                >
                  <Expand size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="text-gray-100 border-gray-700 hover:border-red-400"
                  onClick={() => deleteImage(folder._id?.toString() ?? "", photo['url'])}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-6 text-center text-gray-400">
          <p>
            Photos are not uploaded.{" "}
            <span className="text-blue-400 cursor-pointer hover:underline">
              Upload Now.
            </span>
          </p>
        </div>
      )}

      <UploadImagesPopup folderId={folder._id?.toString() ?? ""}></UploadImagesPopup>
      {showDeletePopup && (
        <DeleteFolderPopup
          folder={folder}
          onClose={() => setShowDeletePopup(false)}
        />
      )}

      {showUpdatePopup && folder && (
        <UpdateFolderDetailsPopup
          folder={folder}
          onClose={() => setShowUpdatePopup(false)}
        />
      )}
    </div>
  );
};

export default FolderPage;
