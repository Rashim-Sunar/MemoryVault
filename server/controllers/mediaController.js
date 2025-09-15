import cloudinary from "../config/cloudinary.js";
import Media from "../model/Media.js";

// Step 1: Create signed upload params
export const getUploadSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create signature" });
  }
};

// Step 2: Save uploaded metadata to MongoDB
export const saveMedia = async (req, res) => {
  try {
    const {title, notes, photos =[], videos = []} = req.body;
    // ✅ Get userId from Clerk (from Authorization: Bearer <token>)
    const userId = req.auth.userId;

    // console.log("Incoming media body:", req.body);
    // console.log("Authenticated Used: ", req.auth);


    // ✅ Ensure photos/videos are in correct format
    const formattedPhotos = photos.map((p) =>
      typeof p === "string" ? { url: p, publicId: "" } : p
    );
    const formattedVideos = videos.map((v) =>
      typeof v === "string" ? { url: v, publicId: "" } : v
    );
    
    const media = new Media({
      userId,
      title,
      notes,
      photos: formattedPhotos,
      videos: formattedVideos,
    });

    await media.save();
    res.status(201).json(media);
  } catch (err) {
    console.error("❌ Error saving media:", err);
    res.status(500).json({ error: "Failed to save media", details: err.message});
  }
};


// Get the logedIn user medias...
export const getUserMedia = async(req, res) => {
  try{
    const userId = req.auth.userId; // clerk provides this from token

    // Get pagination params from query (defaults: page=1, limit=3)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    // Count total documents for this user
    const total = await Media.countDocuments({userId});

    // Fetch paginated media
    const media = await Media.find({ userId })
      .sort({ createdAt: -1}) // newest first
      .skip( (page - 1) * limit)
      .limit(limit);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: media,
    });
    
  }catch(err){
    console.error("❌ Error fetching user media");
    res.status(500).json({
      error: "Failed to fetch user media", 
      details: err.message
    });
  }
}
