import express from "express";
import { getUploadSignature, saveMedia, getUserMedia } from "../controllers/mediaController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes (middleware "requireAuth" for protecting the routes)
router.get("/sign-upload", requireAuth, getUploadSignature);
router.post("/media", requireAuth, saveMedia);
router.get("/media", requireAuth, getUserMedia);

export default router;
