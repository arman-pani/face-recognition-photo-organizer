import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import folderRoutes from "./routes/folderRoutes";

import imageRoutes from "./routes/imageRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());  // Enable CORS
app.use(express.json());  // Parse JSON requests

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Error:", error));

app.use("/api/auth", authRoutes);  // Routes for authentication
app.use("/api/folders", folderRoutes);  // Routes for folders
app.use("/api/images", imageRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
