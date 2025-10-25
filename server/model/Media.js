import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Clerk Id
  title: { type: String, trim: true },
  notes: { type: String, trim: true },
  photos: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  ],
  videos: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  ],

  isFavorite: {
    type: Boolean,
    default: false
  },

  // Only allow fixed emotional tags
  tags: [
    {
      type: String,
      enum: [
        "happy",
        "sad",
        "celebration",
        "adventure",
        "relaxed",
        "love",
        "peaceful",
        "family",
        "friends",
        "travel",
        "nostalgic",
        "romantic"
      ],
      trim: true,
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

// ✅ Make `photos` and `videos` optional
mediaSchema.path("photos").default([]);
mediaSchema.path("videos").default([]);
mediaSchema.path("tags").default([]);

export default mongoose.model("Media", mediaSchema);
