import type { Document, Types } from 'mongoose';

export enum EmotionalTag {
  HAPPY = 'happy',
  SAD = 'sad',
  CELEBRATION = 'celebration',
  ADVENTURE = 'adventure',
  RELAXED = 'relaxed',
  LOVE = 'love',
  PEACEFUL = 'peaceful',
  FAMILY = 'family',
  FRIENDS = 'friends',
  TRAVEL = 'travel',
  NOSTALGIC = 'nostalgic',
  ROMANTIC = 'romantic'
}

export enum ActionType {
  UPLOAD_MEMORY = 'UPLOAD_MEMORY',
  EDIT_MEMORY = 'EDIT_MEMORY',
  DELETE_MEMORY = 'DELETE_MEMORY',
  ADD_TO_FAVORITES = 'ADD_TO_FAVORITES',
  REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES'
}

export interface IMediaAsset {
  url: string;
  publicId: string;
}

export interface IMedia extends Document {
  userId: string;
  title?: string;
  notes?: string;
  photos: IMediaAsset[];
  videos: IMediaAsset[];
  isFavorite: boolean;
  tags: EmotionalTag[];
  dateCaptured?: Date;
  createdAt: Date;
}

export interface IActivity extends Document {
  userId: string;
  actionType: ActionType;
  mediaTitle: string;
  media?: Types.ObjectId;
  createdAt: Date;
}
