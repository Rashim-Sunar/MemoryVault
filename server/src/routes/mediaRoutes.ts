import express from 'express';
import {
  getUploadSignature,
  saveMedia,
  getUserMedia,
  getUserMediaByDates,
  getUserMemoryDates,
  deleteMedia,
  getDashboardSummary,
  getDashboardDailyStats,
  toggleFavorite,
  getFavoriteMemories,
  getMemoriesByTag,
  updateTags,
  addActivity,
  getUserActivities
} from '../controllers/mediaController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/sign-upload', requireAuth, getUploadSignature);
router.post('/media', requireAuth, saveMedia);
router.get('/media', requireAuth, getUserMedia);
router.get('/mediaByDates', requireAuth, getUserMediaByDates);
router.get('/memorydates', requireAuth, getUserMemoryDates);
router.delete('/media/:id', requireAuth, deleteMedia);

router.patch('/media/:id/favorite', requireAuth, toggleFavorite);
router.get('/media/favorites', requireAuth, getFavoriteMemories);
router.get('/media/by-tag', requireAuth, getMemoriesByTag);
router.patch('/media/:id/tags', requireAuth, updateTags);

router.get('/media/stats/summary', requireAuth, getDashboardSummary);
router.get('/media/stats/daily', requireAuth, getDashboardDailyStats);

router.post('/activity/addActivity', requireAuth, addActivity);
router.get('/activity/getActivities', requireAuth, getUserActivities);

export default router;
