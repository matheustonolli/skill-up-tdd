import express from 'express';
import * as hashtagController from './hashtag.controller.js';

const router = express.Router();

// GET /videos/:videoId/hashtags → lista hashtags do vídeo
router.get('/videos/:videoId/hashtags', hashtagController.listByVideo);

// POST /videos/:videoId/hashtags → cria hashtag
router.post('/videos/:videoId/hashtags', hashtagController.create);

// DELETE /hashtags/:id → remove hashtag
router.delete('/hashtags/:id', hashtagController.remove);

export default router;