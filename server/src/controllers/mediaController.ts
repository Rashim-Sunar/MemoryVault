import type { Response } from 'express';
import cloudinary from '../config/cloudinary.js';
import Media from '../models/Media.js';
import Activity from '../models/Activity.js';
import type {
  AddActivityRequest,
  AuthRequest,
  DailyStats,
  DeleteMediaRequest,
  GetMediaByDatesRequest,
  GetMediaByTagRequest,
  PaginatedResponse,
  SaveMediaRequest,
  UpdateTagsRequest,
  UploadSignatureResponse,
  DashboardSummary
} from '../types/index.js';
import { ActionType, EmotionalTag, type IMedia } from '../types/models.js';
import { NotFoundError, ValidationError } from '../types/errors.js';
import { handleApiError, validateRequired } from '../utils/errorHandler.js';

const ALLOWED_TAGS = Object.values(EmotionalTag);

export const getUploadSignature = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET as string
    );

    const response: UploadSignatureResponse = {
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY as string,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME as string
    };

    res.json(response);
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const saveMedia = async (req: SaveMediaRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const { title, notes, photos = [], videos = [], tags = [], dateCaptured } = req.body;

    const invalidTags = tags.filter((tag) => !ALLOWED_TAGS.includes(tag));
    if (invalidTags.length > 0) {
      throw new ValidationError('Invalid tags provided', { invalidTags });
    }

    const formattedPhotos = photos.map((photo) =>
      typeof photo === 'string' ? { url: photo, publicId: '' } : photo
    );
    const formattedVideos = videos.map((video) =>
      typeof video === 'string' ? { url: video, publicId: '' } : video
    );

    const media = new Media({
      userId,
      title,
      notes,
      photos: formattedPhotos,
      videos: formattedVideos,
      tags,
      dateCaptured
    });

    await media.save();
    res.status(201).json({ success: true, data: media });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const getUserMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const page = Number.parseInt(req.query.page as string, 10) || 1;
    const limit = Number.parseInt(req.query.limit as string, 10) || 3;
    const skip = (page - 1) * limit;

    const total = await Media.countDocuments({ userId });
    const media = await Media.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const response: PaginatedResponse<IMedia> = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: media
    };

    res.json({ success: true, data: response });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const getUserMediaByDates = async (
  req: GetMediaByDatesRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const rawDates = req.query.dates;
    if (!rawDates) throw new ValidationError('Dates array is required');

    let dates: string[] = [];
    try {
      dates = JSON.parse(rawDates);
    } catch {
      throw new ValidationError('Invalid dates format. Must be JSON array.');
    }

    const media = await Media.find({
      userId,
      $expr: {
        $in: [
          {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' }
          },
          dates
        ]
      }
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: media.length, data: media });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const getUserMemoryDates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const media = await Media.find({ userId }).select('createdAt -_id');
    const dates = media.map((m) => m.createdAt.toISOString().split('T')[0]);

    res.json({ success: true, dates });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const deleteMedia = async (req: DeleteMediaRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const { id } = req.params;
    const memory = await Media.findOne({ _id: id, userId });
    if (!memory) throw new NotFoundError('Memory not found');

    for (const photo of memory.photos ?? []) {
      if (photo.publicId) await cloudinary.uploader.destroy(photo.publicId);
    }

    for (const video of memory.videos ?? []) {
      if (video.publicId) {
        await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
      }
    }

    await Media.deleteOne({ _id: id, userId });
    res.json({ success: true, message: 'Memory and files deleted successfully' });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const getDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const memories = await Media.find({ userId });
    const totalMemories = memories.length;
    const totalPhotos = memories.reduce((sum, item) => sum + (item.photos?.length || 0), 0);
    const totalVideos = memories.reduce((sum, item) => sum + (item.videos?.length || 0), 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const currentMonthMemoriesLength = await Media.countDocuments({
      userId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const summary: DashboardSummary = {
      totalMemories,
      totalPhotos,
      totalVideos,
      currentMonthMemoriesLength
    };

    res.json({ success: true, data: summary });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const getDashboardDailyStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const dailyStats = await Media.aggregate<DailyStats>([
      { $match: { userId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: dailyStats });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const toggleFavorite = async (req: DeleteMediaRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const { id } = req.params;
    const memory = await Media.findOne({ _id: id, userId });
    if (!memory) throw new NotFoundError('Memory not found');

    memory.isFavorite = !memory.isFavorite;
    await memory.save();

    await Activity.create({
      userId,
      actionType: memory.isFavorite ? ActionType.ADD_TO_FAVORITES : ActionType.REMOVE_FROM_FAVORITES,
      mediaTitle: memory.title ?? 'Untitled',
      media: memory._id
    });

    res.json({
      success: true,
      message: `Memory ${memory.isFavorite ? 'added to' : 'removed from'} favorites`,
      memory
    });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const getFavoriteMemories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const favorites = await Media.find({ userId, isFavorite: true });
    res.json({ success: true, count: favorites.length, data: favorites });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const getMemoriesByTag = async (req: GetMediaByTagRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const { tag } = req.query;
    if (!tag) throw new ValidationError('Tag query parameter is required');

    const memories = await Media.find({
      userId,
      tags: { $regex: new RegExp(tag, 'i') }
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: memories.length, data: memories });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const updateTags = async (req: UpdateTagsRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const { id } = req.params;
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      throw new ValidationError('Tags must be an array of strings');
    }

    const invalidTags = tags.filter((tag) => !ALLOWED_TAGS.includes(tag));
    if (invalidTags.length > 0) {
      throw new ValidationError('Invalid tags provided', { invalidTags });
    }

    const memory = await Media.findOneAndUpdate({ _id: id, userId }, { $set: { tags } }, { new: true });
    if (!memory) throw new NotFoundError('Memory not found');

    res.json({ success: true, message: 'Tags updated successfully', data: memory });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const addActivity = async (req: AddActivityRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    validateRequired(req.body as Record<string, unknown>, ['actionType', 'mediaTitle']);

    const activity = await Activity.create({
      userId,
      actionType: req.body.actionType,
      media: req.body.media ?? null,
      mediaTitle: req.body.mediaTitle
    });

    res.status(201).json({ success: true, data: activity });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};

export const getUserActivities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new ValidationError('User not authenticated');

    const activities = await Activity.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: activities.length,
      data: activities
    });
  } catch (error: unknown) {
    handleApiError(error, res);
  }
};
