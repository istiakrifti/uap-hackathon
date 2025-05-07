import express, { RequestHandler } from 'express';
import { getUserById, updateProfile, getAllIndustryProfiles, getAllJobSeekers } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate as RequestHandler);

// GET /api/users/:id
router.get('/:id', getUserById as RequestHandler);

// PUT /api/users/profile
router.put('/profile', updateProfile as RequestHandler);

// GET /api/users/industry/all
// Only job seekers can access all industry profiles
router.get('/industry/all', authorize(['job_seeker']) as RequestHandler, getAllIndustryProfiles as RequestHandler);

// GET /api/users/job-seekers/all
// Only industry users can access all job seekers
router.get('/job-seekers/all', authorize(['industry']) as RequestHandler, getAllJobSeekers as RequestHandler);

export default router; 