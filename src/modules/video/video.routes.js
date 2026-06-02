import express from 'express';
import * as videoController from './video.controller.js';

const router = express.Router();

// GET /videos/new → formulário de upload
router.get('/videos/new', (req, res) => {
  res.render('videos/new', { title: 'Novo Vídeo' });
});

// POST /videos → cria o vídeo
router.post('/videos', videoController.create);

// DELETE /videos/:id → remove o vídeo
router.delete('/videos/:id', videoController.remove);

export default router;