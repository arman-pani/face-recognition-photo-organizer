import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import AddFolderPage from "./pages/AddFolder";
import DashboardPage from "./pages/Dashboard";
import FolderPage from "./pages/FolderPage";

import GuestViewWrapperPage from "./pages/GuestViewWrapper";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add_folder" element={<AddFolderPage />} />
          <Route path="/view_folder/:folderId" element={<FolderPage />} />
          <Route path="/guest_view/:folderId" element={<GuestViewWrapperPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
