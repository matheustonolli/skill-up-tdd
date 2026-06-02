import express from 'express';
import * as savedVideoController from './savedVideo.controller.js';

const router = express.Router();

// POST /videos/:videoId/save → salva vídeo
router.post('/videos/:videoId/save', savedVideoController.save);

// DELETE /videos/:videoId/save → remove dos salvos
router.delete('/videos/:videoId/save', savedVideoController.unsave);

export default router;