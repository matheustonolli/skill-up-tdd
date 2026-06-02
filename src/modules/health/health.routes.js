import express from 'express';
import * as healthController from './health.controller.js';

const router = express.Router();

// GET /health → verifica se a API está saudável
router.get('/health', healthController.check);

export default router;