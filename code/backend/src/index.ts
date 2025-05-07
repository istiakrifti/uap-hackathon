import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
<<<<<<< HEAD
import projectRoutes from './routes/project.routes';
=======
import jobRoutes from './routes/job.routes';
>>>>>>> 2c5e92d5e46935d9db74f5bd98fe008bef3abb55

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI as string;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
<<<<<<< HEAD
app.use('/api/projects', projectRoutes);
=======
app.use('/api/jobs', jobRoutes);
>>>>>>> 2c5e92d5e46935d9db74f5bd98fe008bef3abb55

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Debug route (only for development)
app.get('/api/debug/submission-count', async (req, res) => {
  try {
    const Submission = mongoose.model('Submission');
    const Project = mongoose.model('Project');
    
    const submissionCount = await Submission.countDocuments();
    const projectCount = await Project.countDocuments();
    
    res.status(200).json({
      status: 'ok', 
      submissionCount,
      projectCount,
      dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error',
      dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 