import express from "express";
import { deleteImageFromFolder, generateMultiplePresignedUrls } from "../controllers/imageController";
const router = express.Router();
router.post("/generate-multiple-presigned-urls", generateMultiplePresignedUrls);
router.delete("/delete-image", deleteImageFromFolder); 

export default router;