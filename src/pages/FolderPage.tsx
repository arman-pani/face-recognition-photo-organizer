import { Expand, Link, Pencil, QrCode, Trash, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Folder } from "../dataTypes";
import { getFolderById } from "../utils/folderMethods";

const FolderPage = () => {
    const { folderId } = useParams();

    const [folder, setFolder] = useState<Folder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
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
          <p className="text-xs text-gray-500">Created on {folder.createdAt.toLocaleString()}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-700 bg-blue-400 text-white hover:border-blue-400"><Pencil size={16} /></Button>
          <Button variant="outline" className="border-gray-700 bg-blue-400 text-white hover:border-blue-400"><Trash size={16} /></Button>
          <Button variant="outline" className="border-gray-700 bg-blue-400 text-white hover:border-blue-400"><Link size={16} /></Button>
          <Button variant="outline" className="border-gray-700 bg-blue-400 text-white hover:border-blue-400"><QrCode size={16} /></Button>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {folder.photos.map((photo, index) => (
          <Card key={index} className="relative bg-gray-800 border border-gray-700">
            <CardContent className="p-2 flex items-center justify-center">
              <img src={photo} alt="photo" className="w-full h-full object-cover rounded-md" />
            </CardContent>
            {/* Expand & Delete Buttons */}
            <div className="absolute top-2 right-2 flex gap-1">
              <Button size="icon" variant="outline" className="text-gray-100 border-gray-700 hover:border-blue-400"><Expand size={16} /></Button>
              <Button size="icon" variant="destructive" className="text-gray-100 border-gray-700 hover:border-red-400"><Trash size={16} /></Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Floating Upload Button */}
      <Button className="fixed bottom-6 right-6 px-4 py-2 bg-blue-400 text-white hover:bg-blue-300">
        <Upload size={16} className="mr-2" /> Upload Photos
      </Button>
    </div>
  );
};

export default FolderPage;
