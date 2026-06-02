import express from 'express';
import * as userController from './user.controller.js';

const router = express.Router();

// POST /register → cria usuário
router.post('/register', userController.create);

// DELETE /users/:id → remove usuário
router.delete('/users/:id', userController.remove);

export default router;