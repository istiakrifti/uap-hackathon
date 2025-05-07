import express, { RequestHandler } from 'express';
import { 
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  applyToJob,
  getAppliedJobs
} from '../controllers/job.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getAllJobs as RequestHandler);
router.get('/:id', getJobById as RequestHandler);

// Protected routes
router.post('/', authenticate as RequestHandler, createJob as RequestHandler);
router.put('/:id', authenticate as RequestHandler, updateJob as RequestHandler);
router.delete('/:id', authenticate as RequestHandler, deleteJob as RequestHandler);
router.get('/user/myjobs', authenticate as RequestHandler, getMyJobs as RequestHandler);
router.post('/:id/apply', authenticate as RequestHandler, applyToJob as RequestHandler);
router.get('/user/applied', authenticate as RequestHandler, getAppliedJobs as RequestHandler);

export default router; 