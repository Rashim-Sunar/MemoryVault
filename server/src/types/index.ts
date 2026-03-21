import type { Request } from 'express';
import type { EmotionalTag } from './models.js';

export interface AuthShape {
  userId: string;
}

export interface AuthRequest extends Request {
  auth?: AuthShape;
}

export interface SaveMediaBody {
  title?: string;
  notes?: string;
  photos?: Array<string | { url: string; publicId: string }>;
  videos?: Array<string | { url: string; publicId: string }>;
  tags?: EmotionalTag[];
  dateCaptured?: string;
}

export interface SaveMediaRequest extends AuthRequest {
  body: SaveMediaBody;
}

export interface DeleteMediaRequest extends AuthRequest {
  params: { id: string };
}

export interface UpdateTagsRequest extends AuthRequest {
  params: { id: string };
  body: { tags: EmotionalTag[] };
}

export interface AddActivityRequest extends AuthRequest {
  body: {
    actionType: string;
    media?: string;
    mediaTitle?: string;
  };
}

export interface GetMediaByDatesRequest extends AuthRequest {
  query: Request['query'] & { dates?: string };
}

export interface GetMediaByTagRequest extends AuthRequest {
  query: Request['query'] & { tag?: string };
}

export interface UploadSignatureResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
}

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

export interface DashboardSummary {
  totalMemories: number;
  totalPhotos: number;
  totalVideos: number;
  currentMonthMemoriesLength: number;
}

export interface DailyStats {
  _id: string;
  count: number;
}
