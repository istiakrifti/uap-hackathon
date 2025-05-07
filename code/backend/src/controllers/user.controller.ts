import { Request, Response } from 'express';
import User from '../models/user.model';

// Get user profile by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        position: user.position,
        experience: user.experience,
        skills: user.skills,
        industry: user.industry,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { name, company, position, experience, skills, industry } = req.body;

    // Find user and update
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        company,
        position,
        experience,
        skills,
        industry,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        position: user.position,
        experience: user.experience,
        skills: user.skills,
        industry: user.industry,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all industry profiles (for job seekers)
export const getAllIndustryProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const industries = await User.find({ role: 'industry' })
      .select('name company industry')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: industries.length,
      industries,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all job seekers (for industry users)
export const getAllJobSeekers = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobSeekers = await User.find({ role: 'job_seeker' })
      .select('name position experience skills')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: jobSeekers.length,
      jobSeekers,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 