// src/types/media.ts

export interface MediaPhoto {
  url: string;
  publicId: string;
}

export interface MediaVideo {
  url: string;
  publicId: string;
}

export interface MediaItem {
  _id: string;
  title: string;
  notes: string;
  photos: MediaPhoto[];
  videos: MediaVideo[];
  createdAt: string;
  isFavorite: boolean;
  tags: string[];
}

export interface PaginatedResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: MediaItem[];
}
