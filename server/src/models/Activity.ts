import mongoose, { Schema } from 'mongoose';
import { ActionType, type IActivity } from '../types/models.js';

const activitySchema = new Schema<IActivity>({
  userId: { type: String, required: true, index: true },
  actionType: { type: String, enum: Object.values(ActionType), required: true },
  mediaTitle: { type: String, required: true },
  media: { type: Schema.Types.ObjectId, ref: 'Media', required: false },
  createdAt: { type: Date, default: Date.now }
});

activitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IActivity>('Activity', activitySchema);
