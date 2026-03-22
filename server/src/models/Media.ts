import mongoose, { Schema } from 'mongoose';
import { EmotionalTag, type IMedia } from '../types/models.js';

const mediaSchema = new Schema<IMedia>({
  userId: { type: String, required: true, index: true },
  title: { type: String, trim: true },
  notes: { type: String, trim: true },
  photos: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true }
    }
  ],
  videos: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true }
    }
  ],
  isFavorite: { type: Boolean, default: false },
  tags: [{ type: String, enum: Object.values(EmotionalTag), trim: true }],
  dateCaptured: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now }
});

mediaSchema.path('photos').default([]);
mediaSchema.path('videos').default([]);
mediaSchema.path('tags').default([]);

export default mongoose.model<IMedia>('Media', mediaSchema);
