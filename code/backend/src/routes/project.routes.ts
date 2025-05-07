import express, { RequestHandler } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { 
  createProject, 
  getAllProjects, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  getMyProjects,
  getPaidProjects,
  getJobProjects
} from '../controllers/project.controller';
import {
  submitQuiz,
  submitProject,
  getMySubmissions,
  getProjectSubmissions,
  reviewSubmission,
  processPayment,
  updateApplicationStatus,
  updatePaymentMethod
} from '../controllers/submission.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticate as RequestHandler);

// Project routes for all users
router.get('/', getAllProjects as RequestHandler);
router.get('/filter/paid', getPaidProjects as RequestHandler);
router.get('/filter/jobs', getJobProjects as RequestHandler);

// Project routes for industry users
router.post('/', authorize(['industry']) as RequestHandler, createProject as RequestHandler);
router.get('/company/mine', authorize(['industry']) as RequestHandler, getMyProjects as RequestHandler);

// Project submission routes for job seekers
router.post('/submit/quiz', authorize(['job_seeker']) as RequestHandler, submitQuiz as RequestHandler);
router.post('/submit/project', authorize(['job_seeker']) as RequestHandler, submitProject as RequestHandler);
router.get('/submissions/mine', authorize(['job_seeker']) as RequestHandler, getMySubmissions as RequestHandler);
router.put('/submissions/:submissionId/payment-method', authorize(['job_seeker']) as RequestHandler, updatePaymentMethod as RequestHandler);

// Project submission routes for industry users
router.get('/:projectId/submissions', authorize(['industry']) as RequestHandler, getProjectSubmissions as RequestHandler);
router.put('/submissions/:submissionId/review', authorize(['industry']) as RequestHandler, reviewSubmission as RequestHandler);

// Payment routes for industry users
router.put('/submissions/:submissionId/payment', authorize(['industry']) as RequestHandler, processPayment as RequestHandler);

// Job application routes for industry users
router.put('/submissions/:submissionId/application', authorize(['industry']) as RequestHandler, updateApplicationStatus as RequestHandler);

// This route should be last to prevent path conflicts
router.get('/:id', getProjectById as RequestHandler);
router.put('/:id', authorize(['industry']) as RequestHandler, updateProject as RequestHandler);
router.delete('/:id', authorize(['industry']) as RequestHandler, deleteProject as RequestHandler);

export default router; 