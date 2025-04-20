import { useEffect, useState } from "react";
import { FaEllipsisV, FaFolder } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { Folder } from "../dataTypes";
import { fetchUserFolders } from "../utils/folderMethods";

interface FolderCardProps {
  folder: Folder;
}

const Sidebar = () => (
  <div className="w-60 h-screen bg-gray-800 text-white p-5 flex flex-col">
    <h1 className="text-2xl font-bold mb-8 text-blue-400">LOGO</h1>
    <nav className="flex flex-col gap-4">
      <button className="text-left py-2 px-4 rounded-lg bg-gray-700">
        Folders
      </button>
      <button className="text-left py-2 px-4 rounded-lg hover:bg-gray-700">
        Settings
      </button>
    </nav>
  </div>
);

const FolderCard: React.FC<FolderCardProps> = ({ folder }) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative bg-gray-700 p-5 rounded-lg flex flex-col text-white w-full max-w-md"
      onClick={() => navigate(`/view_folder/${folder._id}`)}
    >
      <div className="absolute top-4 right-4 cursor-pointer">
        <FaEllipsisV />
      </div>
      <div className="mb-4">
        <FaFolder className="text-4xl text-yellow-400" />
      </div>
      <h3 className="text-lg font-semibold">{folder.name}</h3>
      <p className="text-sm text-gray-400">
        {folder.client} | {folder.purpose}
      </p>
      <p className="text-sm text-gray-400">{folder.photoCount} Photos</p>
      <p className="text-xs text-gray-500">
        Created on {new Date(folder.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFolders = async () => {
      if (!user) return;

      try {
        console.log("Fetching folders for user:", user.id);
        const fetchedFolders = await fetchUserFolders(user.id);
        console.log("Folders fetched:", fetchedFolders);

        setFolders(fetchedFolders || []); // Ensure it is always an array
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setLoading(false);
      }
    };

    getFolders();
  }, [user]); // Ensure we wait for user auth

  if (loading) {
    return <p className="text-black text-center">Loading...</p>;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {folders.length > 0 ? (
            folders.map((folder) => (
              <FolderCard key={folder._id.toString()} folder={folder} />
            ))
          ) : (
            <p className="text-white">
              No folders found. Start by adding a folder.
            </p>
          )}
        </div>
      </div>
      <div className="absolute bottom-8 right-8">
        <Button
          label="Add a Folder"
          onClick={() => navigate("/add_folder")}
          icon={<FaFolder />}
          size="medium"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
