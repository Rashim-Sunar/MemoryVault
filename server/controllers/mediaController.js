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
// Get user media filtered by specific dates
export const getUserMediaByDates = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Dates come as a JSON string from query param
    let dates = [];
    if (req.query.dates) {
      try {
        dates = JSON.parse(req.query.dates);
      } catch (e) {
        return res.status(400).json({ error: "Invalid dates format. Must be JSON array." });
      }
    }

    if (!Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ error: "Dates array is required" });
    }

    // Convert to actual start/end of each day
    const dateFilters = dates.map((date) => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      return { createdAt: { $gte: start, $lte: end } };
    });

    // Find documents that match any of the date ranges
    const media = await Media.find({
      userId,
      $or: dateFilters,
    }).sort({ createdAt: -1 });

    res.json({ count: media.length, data: media });
  } catch (err) {
    console.error("❌ Error fetching media by dates:", err);
    res.status(500).json({ error: "Failed to fetch media by dates", details: err.message });
  }
};

// get all memory dates for the logged-in user
export const getUserMemoryDates = async(req, res) => {
  try{
    const userId = req.auth.userId;

    //fetch only createdAt field
    const media = await Media.find({userId}).select("createdAt -_id");

    //Map to YYYY-MM-DD strings for easier frontend use
    const dates = media.map((m) => m.createdAt.toISOString().split("T")[0]);

    res.json({dates});
  }catch(error){
    console.error("Error fetching memory dates:", error);
    res.status(500).json({error: "Failed to fetch the memory dates ", details: error.message});
  }
}

// DELETE a memory and remove assets from Cloudinary
export const deleteMedia = async (req, res) => {
  try {
    const userId = req.auth.userId; // Clerk authentication
    const { id } = req.params;

    // 1. Find the memory
    const memory = await Media.findOne({ _id: id, userId });
    if (!memory) {
      return res.status(404).json({ error: "Memory not found" });
    }

    // 2. Delete associated photos from Cloudinary
    if (memory.photos && memory.photos.length > 0) {
      for (const photo of memory.photos) {
        if (photo.publicId) {
          try {
            await cloudinary.uploader.destroy(photo.publicId);
          } catch (error) {
            console.error(`❌ Failed to delete photo: ${photo.publicId}`, error);
          }
        }
      }
    }

    // 3. Delete associated videos from Cloudinary
    if (memory.videos && memory.videos.length > 0) {
      for (const video of memory.videos) {
        if (video.publicId) {
          try {
            await cloudinary.uploader.destroy(video.publicId, {
              resource_type: "video",
            });
          } catch (error) {
            console.error(`❌ Failed to delete video: ${video.publicId}`, error);
          }
        }
      }
    }

    // 4. Delete the memory document from MongoDB
    await Media.deleteOne({ _id: id, userId });

    res.json({ message: "✅ Memory and files deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting memory:", err);
    res.status(500).json({ error: "Failed to delete memory", details: err.message });
  }
};

//-----------------Add Dashboard Stats Endpoints--------------------------------------------------------------
// GET /api/media/stats/summary
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const memories = await Media.find({ userId });
    const totalMemories = memories.length;
    const totalPhotos = memories.reduce((acc, m) => acc + (m.photos?.length || 0), 0);
    const totalVideos = memories.reduce((acc, m) => acc + (m.videos?.length || 0), 0);

    // 📅 Current month memories
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const currentMonthMemoriesLength = await Media.countDocuments({
      userId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.json({ totalMemories, totalPhotos, totalVideos, currentMonthMemoriesLength});
  } catch (err) {
    console.error("❌ Error fetching summary stats:", err);
    res.status(500).json({ error: "Failed to fetch summary stats", details: err.message });
  }
};

// GET /api/media/stats/daily  --> (for chart)
export const getDashboardDailyStats = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const dailyStats = await Media.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json(dailyStats); // [{ _id: '2025-10-01', count: 3 }, ...]
  } catch (err) {
    console.error("❌ Error fetching daily stats:", err);
    res.status(500).json({ error: "Failed to fetch daily stats", details: err.message });
  }
};

// Toggle favorite status for a memory...
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    const memory = await Media.findOne({ _id: id, userId });
    if(!memory) return res.status(404).json({ error: "Memory not found" });
    
    memory.isFavorite = !memory.isFavorite;
    await memory.save();

    res.json({
      message: `Memory ${memory.isFavorite ? "added to" : "removed from"} favorites.`,
      memory
    });

  } catch (error) {
      console.error("❌ Error toggling favorite:", err);
      res.status(500).json({ error: "Failed to toggle favorite", details: err.message });

  }
}

// Get all favorite memories
export const getFavoriteMemories = async(req, res) => {
  try {
    const userId = req.auth.userId;
    
    const favorites = await Media.find({ userId, isFavorite: true });

    res.json({
      count: favorites.length,
      data: favorites
    });

  } catch (error) {
    console.error("❌ Error fetching favorite memories:", err);
    res.status(500).json({ error: "Failed to fetch favorites", details: err.message });
  }
}

// Get Memories by Tag..
export const getMemoriesByTag = async(req, res) => {
  try {
    const userId = req.auth.userId;
    const { tag } = req.query;

    if (!tag) return res.status(400).json({ error: "Tag query parameter is required" });

    const memories = await Media.find({
      userId,
      tags: { $regex: new RegExp(tag, "i") }, // case-insensitive match
    }).sort({ createdAt: -1 });

    res.json({ count: memories.length, data: memories });
  } catch (err) {
    console.error("❌ Error fetching memories by tag:", err);
    res.status(500).json({ error: "Failed to fetch by tag", details: err.message });
  }
}

// Update tags for a memory
export const updateTags = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;
    const { tags } = req.body; // expect an array of tags

    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: "Tags must be an array of strings" });
    }

    const memory = await Media.findOneAndUpdate(
      { _id: id, userId },
      { $set: { tags } },
      { new: true }
    );

    if (!memory) return res.status(404).json({ error: "Memory not found" });

    res.json({ message: "Tags updated successfully", memory });
  } catch (err) {
    console.error("❌ Error updating tags:", err);
    res.status(500).json({ error: "Failed to update tags", details: err.message });
  }
};




