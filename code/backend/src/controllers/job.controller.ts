import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Job, { IJob } from '../models/job.model';
import User from '../models/user.model';

// Get all jobs with optional filters
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { search, location, requirement } = req.query;
    const filter: any = {};

    // Apply search filter if provided
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    // Apply location filter if provided
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Apply requirement filter if provided
    if (requirement) {
      filter.requirements = { 
        $elemMatch: { $regex: requirement, $options: 'i' } 
      };
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name company')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a specific job by ID
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name company email')
      .populate('applicants', 'name email');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create a new job
export const createJob = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'industry') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only industry users can post jobs' 
      });
    }

    const jobData = {
      ...req.body,
      postedBy: userId,
      company: req.body.company || user.company || '',
    };

    const job = await Job.create(jobData);
    res.status(201).json({ success: true, data: job });
  } catch (error: any) {
    console.error('Error creating job:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a job
export const updateJob = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Ensure the user owns the job
    if (job.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this job',
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedJob });
  } catch (error: any) {
    console.error('Error updating job:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a job
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Ensure the user owns the job
    if (job.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this job',
      });
    }

    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get jobs posted by the current user
export const getMyJobs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const jobs = await Job.find({ postedBy: userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching my jobs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Apply to a job
export const applyToJob = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const jobId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'job_seeker') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only job seekers can apply for jobs' 
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if user has already applied
    if (job.applicants.includes(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already applied to this job' 
      });
    }

    // Add user to applicants
    job.applicants.push(userId);
    await job.save();

    res.status(200).json({ 
      success: true, 
      message: 'Successfully applied to job',
      data: job 
    });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get jobs the user has applied to
export const getAppliedJobs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const jobs = await Job.find({ applicants: userId })
      .populate('postedBy', 'name company')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 