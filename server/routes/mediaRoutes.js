import express from "express";
import { 
    getUploadSignature, 
    saveMedia, 
    getUserMedia, 
    getUserMediaByDates, 
    getUserMemoryDates, 
    deleteMedia
} from "../controllers/mediaController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes (middleware "requireAuth" for protecting the routes)
router.get("/sign-upload", requireAuth, getUploadSignature);
router.post("/media", requireAuth, saveMedia);
router.get("/media", requireAuth, getUserMedia);
router.get("/mediaByDates", requireAuth, getUserMediaByDates);
router.get("/memorydates", requireAuth, getUserMemoryDates);
router.delete("/media/:id", requireAuth, deleteMedia);

export default router;
