import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import mediaRoutes from "./routes/mediaRoutes.js";
import cors from 'cors'

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // frontend URL
    credentials: true, // allow cookies / auth headers
  })
);

// Routes
app.use("/api", mediaRoutes);

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
