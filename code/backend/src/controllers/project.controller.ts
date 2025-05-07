import { Request, Response } from 'express';
import Project, { IProject } from '../models/project.model';
import Submission from '../models/submission.model';
import mongoose from 'mongoose';

// Create a new project (industry users only)
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'industry') {
      res.status(403).json({ message: 'Only industry users can create projects' });
      return;
    }

    const { 
      title, 
      description, 
      courses, 
      quiz, 
      requirements,
      isPaid,
      paymentAmount,
      currency,
      jobOpportunity,
      jobDetails
    } = req.body;

    // Convert payment amount to number 
    const numericPaymentAmount = isPaid && paymentAmount ? 
      (typeof paymentAmount === 'string' ? parseFloat(paymentAmount) : paymentAmount) : 
      undefined;

    const project = new Project({
      title,
      description,
      companyId: req.user.id,
      companyName: req.user.name,
      courses: courses || [],
      quiz: quiz || [],
      requirements: requirements || [],
      status: 'active',
      isPaid: isPaid || false,
      paymentAmount: numericPaymentAmount,
      currency: isPaid ? (currency || 'USD') : undefined,
      jobOpportunity: jobOpportunity || false,
      jobDetails: jobOpportunity ? jobDetails : undefined,
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all projects
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, isPaid, jobOpportunity } = req.query;
    const filter: { 
      status?: string;
      isPaid?: boolean;
      jobOpportunity?: boolean;
    } = {};
    
    if (status && ['active', 'inactive'].includes(status as string)) {
      filter.status = status as string;
    }

    if (isPaid !== undefined) {
      filter.isPaid = isPaid === 'true';
    }

    if (jobOpportunity !== undefined) {
      filter.jobOpportunity = jobOpportunity === 'true';
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single project by ID
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.status(200).json({ project });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a project (industry user who created it only)
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if the user is the creator of the project
    if (req.user?.role !== 'industry' || project.companyId.toString() !== req.user.id.toString()) {
      res.status(403).json({ message: 'You are not authorized to update this project' });
      return;
    }

    const { 
      title, 
      description, 
      courses, 
      quiz, 
      requirements, 
      status,
      isPaid,
      paymentAmount,
      currency,
      jobOpportunity,
      jobDetails
    } = req.body;

    // Convert payment amount to number 
    const numericPaymentAmount = isPaid && paymentAmount ? 
      (typeof paymentAmount === 'string' ? parseFloat(paymentAmount) : paymentAmount) : 
      undefined;

    const updateData: any = {
      title,
      description,
      courses,
      quiz,
      requirements,
      status,
      isPaid,
      jobOpportunity
    };

    // Only add payment fields if the project is paid
    if (isPaid) {
      updateData.paymentAmount = numericPaymentAmount;
      updateData.currency = currency || 'USD';
    } else {
      // If changing from paid to unpaid, remove payment fields
      updateData.paymentAmount = undefined;
      updateData.currency = undefined;
    }

    // Only add job details if job opportunity is enabled
    if (jobOpportunity) {
      updateData.jobDetails = jobDetails;
    } else {
      // If changing from job opportunity to regular project, remove job details
      updateData.jobDetails = undefined;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Project updated successfully',
      project: updatedProject,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a project (industry user who created it only)
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if the user is the creator of the project
    if (req.user?.role !== 'industry' || project.companyId.toString() !== req.user.id.toString()) {
      res.status(403).json({ message: 'You are not authorized to delete this project' });
      return;
    }

    // Check if there are any submissions for this project
    const submissionsCount = await Submission.countDocuments({ projectId: req.params.id });
    if (submissionsCount > 0) {
      // Instead of deleting, set project to inactive
      await Project.findByIdAndUpdate(req.params.id, { status: 'inactive' });
      res.status(200).json({ message: 'Project set to inactive due to existing submissions' });
      return;
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get projects by company (for industry users)
export const getMyProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'industry') {
      res.status(403).json({ message: 'Only industry users can access their projects' });
      return;
    }

    const projects = await Project.find({ companyId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get paid projects
export const getPaidProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({ 
      isPaid: true,
      status: 'active'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get job opportunity projects
export const getJobProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({ 
      jobOpportunity: true,
      status: 'active'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 