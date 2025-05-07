import express, { RequestHandler } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register as RequestHandler);

// POST /api/auth/login
router.post('/login', login as RequestHandler);

// GET /api/auth/me
router.get('/me', authenticate as RequestHandler, getMe as RequestHandler);

export default router; 