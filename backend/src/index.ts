import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());  // Enable CORS
app.use(express.json());  // Parse JSON requests

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Error:", error));

app.use("/api/auth", authRoutes);  // Routes for authentication

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
