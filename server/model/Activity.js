import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true,
        index: true, // Clerk userId
    },

    // Type of action performed
    actionType: {
        type: String,
        enum: [
            "UPLOAD_MEMORY",
            "EDIT_MEMORY",
            "DELETE_MEMORY",
            "ADD_TO_FAVORITES",
            "REMOVE_FROM_FAVORITES"
        ],
        required: true,
    },

    mediaTitle: {
        type: String,
        required: true
    },

    // reference to memory/media
    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        required: false,
    },

    // when it happened..
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Index for fast queries(eg. show recent activities)
activitySchema.index({userId: 1, createdAt: -1});

export default mongoose.model("Activity", activitySchema);