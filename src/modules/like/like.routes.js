import express from 'express';
import * as likeController from './like.controller.js';

const router = express.Router();

// POST /videos/:videoId/like → adiciona ou remove like
router.post('/videos/:videoId/like', likeController.toggle);

export default router;