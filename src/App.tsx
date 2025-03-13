import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AddFolderPage from "./pages/AddFolder";
import DashboardPage from "./pages/Dashboard";
import HomePage from './pages/Home';
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/add_folder" element={<AddFolderPage />} />
      </Routes>
    </Router>
  );
}

export default App;