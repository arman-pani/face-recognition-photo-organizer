import { FaEllipsisV, FaFolder } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Sidebar = () => {
  return (
    <div className="w-60 h-screen bg-gray-800 text-white p-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-blue-400">LOGO</h1>
      <nav className="flex flex-col gap-4">
        <button className="text-left py-2 px-4 rounded-lg bg-gray-700">Folders</button>
        <button className="text-left py-2 px-4 rounded-lg hover:bg-gray-700">Settings</button>
      </nav>
    </div>
  );
};

const FolderCard = () => {
  return (
    <div className="relative bg-gray-700 p-5 rounded-lg flex flex-col text-white w-full max-w-md">
      <div className="absolute top-4 right-4 cursor-pointer">
        <FaEllipsisV />
      </div>
      <div className="mb-4">
        <FaFolder className="text-4xl text-yellow-400" />
      </div>
      <h3 className="text-lg font-semibold">Folder Name</h3>
      <p className="text-sm text-gray-400">Client Name | Folder Purpose</p>
      <p className="text-sm text-gray-400">120 Photos</p>
      <p className="text-xs text-gray-500">Created on 27th May, 2024</p>
    </div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FolderCard />
          <FolderCard />
        </div>
      </div>
      <div className="absolute bottom-8 right-8">
        <Button label="Add a Folder" onClick={() => navigate("/add_folder")} icon={<FaFolder />} size='medium' />
      </div>
    </div>
  );
};

export default DashboardPage;
