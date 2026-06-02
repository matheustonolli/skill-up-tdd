import express from 'express';
import * as commentController from './comment.controller.js';

const router = express.Router();

// POST /videos/:videoId/comments → cria comentário
router.post('/videos/:videoId/comments', commentController.create);

// DELETE /comments/:id → remove comentário
router.delete('/comments/:id', commentController.remove);

export default router;