import express from "express";
import { addFolder, addPhotoLinksOnFolder, deleteFolder, getFolderById, getUserFolders, matchSelfieWithFolderImages, updateFolderDetails } from "../controllers/folderController";

const router = express.Router();

router.get("/:userId", getUserFolders);
router.post("/create", addFolder);
router.delete("/delete/:folderId", deleteFolder);
router.get("/folder_info/:folderId", getFolderById);
router.post("/add-photos-links", addPhotoLinksOnFolder);
router.put("/update/:folderId", updateFolderDetails);
router.post("/compare/:folderId", matchSelfieWithFolderImages);

export default router;
