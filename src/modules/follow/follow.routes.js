import express from 'express';
import * as followController from './follow.controller.js';

const router = express.Router();

// POST /users/:userId/follow → segue ou deixa de seguir
router.post('/users/:userId/follow', followController.toggle);

export default router;