import express from "express";
import { addFolder, deleteFolder, getFolderById, getUserFolders } from "../controllers/folderController";

const router = express.Router();

router.get("/:userId", getUserFolders);
router.post("/create", addFolder);
router.delete("/delete/:folderId", deleteFolder);
router.get("/folder_info/:folderId", getFolderById);

export default router;
