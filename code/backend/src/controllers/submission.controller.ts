import { Request, Response } from 'express';
import Submission from '../models/submission.model';
import Project from '../models/project.model';
import User from '../models/user.model';

// Submit quiz answers - first step in project submission
export const submitQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'job_seeker') {
      res.status(403).json({ message: 'Only job seekers can submit quizzes' });
      return;
    }

    const { projectId, answers } = req.body;

    if (!projectId || !answers || !Array.isArray(answers)) {
      res.status(400).json({ message: 'Project ID and answers array are required' });
      return;
    }

    // Get the project to check the correct answers
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if user has already submitted a quiz for this project
    const existingSubmission = await Submission.findOne({
      projectId,
      userId: req.user.id,
    });

    let submission;
    let action = 'created';

    // Calculate quiz results
    const quizResults = answers.map((answer, index) => {
      const question = project.quiz[index];
      if (!question) {
        return {
          questionId: `invalid_${index}`,
          selectedOption: answer,
          isCorrect: false,
        };
      }
      
      return {
        questionId: `question_${index}`,
        selectedOption: answer,
        isCorrect: answer === question.correctOption,
      };
    });

    // Calculate quiz score (percentage)
    const correctAnswers = quizResults.filter(result => result.isCorrect).length;
    const totalQuestions = project.quiz.length;
    const quizScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Pass is 70% or higher
    const quizPassed = quizScore >= 70;

    if (existingSubmission) {
      // Update existing submission
      submission = await Submission.findByIdAndUpdate(
        existingSubmission._id,
        {
          quizResults,
          quizScore,
          quizPassed,
          status: 'pending',
        },
        { new: true }
      );
      action = 'updated';
    } else {
      // Create new submission
      const submissionData: any = {
        projectId,
        userId: req.user.id,
        userName: req.user.name,
        quizResults,
        quizScore,
        quizPassed,
        status: 'pending',
        // Set job application information if the project has job opportunity
        isJobApplication: project.jobOpportunity,
        applicationStatus: project.jobOpportunity ? 'pending' : undefined,
      };

      // Set payment information if the project is paid
      if (project.isPaid) {
        submissionData.isPaid = true;
        submissionData.paymentAmount = project.paymentAmount;
        submissionData.paymentStatus = 'pending';
      }

      submission = new Submission(submissionData);
      await submission.save();
    }

    res.status(200).json({
      message: `Quiz ${action} successfully`,
      passed: quizPassed,
      score: quizScore,
      submission,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit project (after passing quiz)
export const submitProject = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'job_seeker') {
      res.status(403).json({ message: 'Only job seekers can submit projects' });
      return;
    }

    const { 
      submissionId, 
      githubLink, 
      zipFileUrl, 
      resume, 
      coverLetter,
      paymentMethod
    } = req.body;

    if (!submissionId || (!githubLink && !zipFileUrl)) {
      res.status(400).json({ message: 'Submission ID and either GitHub link or zip file URL are required' });
      return;
    }

    // Get the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      res.status(404).json({ message: 'Submission not found' });
      return;
    }

    // Check if user owns this submission
    if (submission.userId.toString() !== req.user.id.toString()) {
      res.status(403).json({ message: 'You are not authorized to update this submission' });
      return;
    }

    // Check if quiz was passed
    if (!submission.quizPassed) {
      res.status(400).json({ message: 'You must pass the quiz before submitting the project' });
      return;
    }

    // Get the project to check if it's a job application
    const project = await Project.findById(submission.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // For job applications, require resume
    if (project.jobOpportunity && !resume && !submission.resume) {
      res.status(400).json({ message: 'Resume is required for job applications' });
      return;
    }

    // Update submission with project links and job application materials
    const updateData: any = {
      githubLink: githubLink || submission.githubLink,
      zipFileUrl: zipFileUrl || submission.zipFileUrl,
      status: 'submitted',
    };

    // Add job application materials if available
    if (project.jobOpportunity) {
      if (resume) updateData.resume = resume;
      if (coverLetter) updateData.coverLetter = coverLetter;
    }

    // Add payment method information if provided and this is a paid project
    if (project.isPaid && paymentMethod) {
      // Remove transaction ID if provided by user - this should be set by the company later
      if (paymentMethod.transactionId) {
        delete paymentMethod.transactionId;
      }
      updateData.paymentMethod = paymentMethod;
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: 'Project submitted successfully',
      submission: updatedSubmission,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get my submissions (for job seekers)
export const getMySubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'job_seeker') {
      res.status(403).json({ message: 'Only job seekers can access their submissions' });
      return;
    }

    console.log('Getting submissions for user ID:', req.user.id);
    
    // First, get all submissions for this user
    const submissions = await Submission.find({ userId: req.user.id })
      .populate({
        path: 'projectId', 
        select: 'title description companyName isPaid price status requirements courses quiz createdAt',
        match: { _id: { $exists: true } } // Only populate if project exists
      })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${submissions.length} submissions for user ${req.user.id}`);
    
    // Filter out submissions where project could not be populated (deleted projects)
    const validSubmissions = submissions.filter(sub => sub.projectId);
    
    if (validSubmissions.length !== submissions.length) {
      console.log(`Filtered out ${submissions.length - validSubmissions.length} submissions with missing projects`);
    }
    
    res.status(200).json({
      count: validSubmissions.length,
      submissions: validSubmissions,
      debug: {
        totalFound: submissions.length,
        filtered: submissions.length - validSubmissions.length,
        userInfo: {
          id: req.user.id,
          role: req.user.role
        }
      }
    });
  } catch (error: any) {
    console.error('Error in getMySubmissions:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get submissions for my projects (for industry users)
export const getProjectSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'industry') {
      res.status(403).json({ message: 'Only industry users can access project submissions' });
      return;
    }

    const { projectId } = req.params;
    
    // Verify that this project belongs to the industry user
    const project = await Project.findOne({
      _id: projectId,
      companyId: req.user.id,
    });
    
    if (!project) {
      res.status(404).json({ message: 'Project not found or you do not have access to it' });
      return;
    }

    const submissions = await Submission.find({ 
      projectId, 
      status: { $in: ['submitted', 'approved', 'rejected'] } 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: submissions.length,
      submissions,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Review submission (for industry users)
export const reviewSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'industry') {
      res.status(403).json({ message: 'Only industry users can review submissions' });
      return;
    }

    const { submissionId } = req.params;
    const { status, feedback, paymentStatus, transactionId, applicationStatus, interviewDate, interviewNotes } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      res.status(400).json({ message: 'Valid status (approved or rejected) is required' });
      return;
    }

    // Get the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      res.status(404).json({ message: 'Submission not found' });
      return;
    }

    // Verify that the submission is for a project owned by this industry user
    const project = await Project.findOne({
      _id: submission.projectId,
      companyId: req.user.id,
    });
    
    if (!project) {
      res.status(403).json({ message: 'You do not have permission to review this submission' });
      return;
    }

    // Prepare update data
    const updateData: any = { status, feedback };

    // Handle payment status update if this is a paid project
    if (project.isPaid) {
      // Always ensure the payment amount in the submission matches the current project payment amount
      updateData.paymentAmount = project.paymentAmount;

      if (paymentStatus && ['pending', 'paid', 'failed'].includes(paymentStatus)) {
        updateData.paymentStatus = paymentStatus;
        
        // If marked as paid, update payment date and transaction ID
        if (paymentStatus === 'paid') {
          updateData.paymentDate = new Date();
          
          // Check for transaction ID
          if (transactionId) {
            // If the submission already has a payment method
            if (submission.paymentMethod) {
              updateData['paymentMethod.transactionId'] = transactionId;
            } else {
              // Create a basic payment method object
              updateData.paymentMethod = { 
                type: 'direct',
                transactionId: transactionId,
                additionalInfo: 'Added during review' 
              };
            }
          } else if (status === 'approved') {
            // If no transaction ID is provided but status is being set to approved and paid,
            // require a transaction ID
            res.status(400).json({ 
              message: 'Transaction ID is required when marking a paid project as approved and paid' 
            });
            return;
          }
        }
      } else if (status === 'approved' && !submission.paymentStatus) {
        // If approving and no payment status set, default to pending
        updateData.paymentStatus = 'pending';
      }
    }

    // Handle job application status updates if this is a job opportunity
    if (project.jobOpportunity && applicationStatus && 
        ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].includes(applicationStatus)) {
      updateData.applicationStatus = applicationStatus;
      
      // Add interview details if provided
      if (interviewDate) {
        updateData.interviewDate = new Date(interviewDate);
      }
      
      if (interviewNotes) {
        updateData.interviewNotes = interviewNotes;
      }
    } else if (project.jobOpportunity && status === 'approved' && !submission.applicationStatus) {
      // If approving and no application status set, default to reviewed
      updateData.applicationStatus = 'reviewed';
    }

    // Update submission
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: `Submission ${status} successfully`,
      submission: updatedSubmission,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Process payment for a submission (for industry users)
export const processPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'industry') {
      res.status(403).json({ message: 'Only industry users can process payments' });
      return;
    }

    const { submissionId } = req.params;
    const { transactionId, paymentStatus, additionalInfo } = req.body;

    if (!paymentStatus || !['paid', 'failed', 'pending'].includes(paymentStatus)) {
      res.status(400).json({ message: 'Valid payment status is required' });
      return;
    }

    // Transaction ID is required if marking as paid
    if (paymentStatus === 'paid' && !transactionId) {
      res.status(400).json({ message: 'Transaction ID is required when marking payment as paid' });
      return;
    }

    // Get the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      res.status(404).json({ message: 'Submission not found' });
      return;
    }

    // Verify that the submission is for a project owned by this industry user
    const project = await Project.findOne({
      _id: submission.projectId,
      companyId: req.user.id,
    });
    
    if (!project) {
      res.status(403).json({ message: 'You do not have permission to process payment for this submission' });
      return;
    }

    // Verify this is a paid project
    if (!project.isPaid) {
      res.status(400).json({ message: 'This project is not marked as paid' });
      return;
    }

    // Verify the submission is approved
    if (submission.status !== 'approved') {
      res.status(400).json({ message: 'Only approved submissions can be paid' });
      return;
    }

    // Check if payment method info exists
    if (paymentStatus === 'paid' && !submission.paymentMethod) {
      res.status(400).json({ 
        message: 'Cannot process payment. Job seeker has not provided payment details yet.' 
      });
      return;
    }

    // Update payment status and add transaction details
    const updateData: any = {
      paymentStatus,
    };

    if (paymentStatus === 'paid') {
      updateData.paymentDate = new Date();
      
      // Update the transaction ID in the existing payment method
      updateData['paymentMethod.transactionId'] = transactionId;
      
      if (additionalInfo) {
        updateData['paymentMethod.additionalInfo'] = additionalInfo;
      }
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: `Payment ${paymentStatus === 'paid' ? 'processed' : paymentStatus} successfully`,
      submission: updatedSubmission,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update job application status (for industry users)
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'industry') {
      res.status(403).json({ message: 'Only industry users can update application status' });
      return;
    }

    const { submissionId } = req.params;
    const { applicationStatus, interviewDate, interviewNotes } = req.body;

    if (!applicationStatus || !['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].includes(applicationStatus)) {
      res.status(400).json({ message: 'Valid application status is required' });
      return;
    }

    // Get the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      res.status(404).json({ message: 'Submission not found' });
      return;
    }

    // Verify that the submission is for a project owned by this industry user
    const project = await Project.findOne({
      _id: submission.projectId,
      companyId: req.user.id,
    });
    
    if (!project) {
      res.status(403).json({ message: 'You do not have permission to update this application' });
      return;
    }

    // Verify this is a job opportunity project
    if (!project.jobOpportunity) {
      res.status(400).json({ message: 'This project is not marked as a job opportunity' });
      return;
    }

    // Update application status
    const updateData: any = { applicationStatus };
    
    if (interviewDate) {
      updateData.interviewDate = new Date(interviewDate);
    }
    
    if (interviewNotes) {
      updateData.interviewNotes = interviewNotes;
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: 'Application status updated successfully',
      submission: updatedSubmission,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update payment method (for job seekers)
export const updatePaymentMethod = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'job_seeker') {
      res.status(403).json({ message: 'Only job seekers can update payment methods' });
      return;
    }

    const { submissionId } = req.params;
    const { paymentMethod } = req.body;

    if (!paymentMethod || !paymentMethod.type) {
      res.status(400).json({ message: 'Valid payment method information is required' });
      return;
    }

    // Remove transaction ID if provided by user - this should be set by the company later
    if (paymentMethod.transactionId) {
      delete paymentMethod.transactionId;
    }

    // Get the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      res.status(404).json({ message: 'Submission not found' });
      return;
    }

    // Check if user owns this submission
    if (submission.userId.toString() !== req.user.id.toString()) {
      res.status(403).json({ message: 'You are not authorized to update this submission' });
      return;
    }

    // Get the project to verify it's a paid project
    const project = await Project.findById(submission.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (!project.isPaid) {
      res.status(400).json({ message: 'This project is not marked as paid' });
      return;
    }

    // Ensure required fields based on payment method type
    if (paymentMethod.type === 'bank_transfer' && 
        (!paymentMethod.accountNumber || !paymentMethod.accountName || !paymentMethod.bankName)) {
      res.status(400).json({ 
        message: 'Bank transfers require account number, account name, and bank name' 
      });
      return;
    }

    if (paymentMethod.type === 'mobile_banking' && 
        (!paymentMethod.mobileNumber || !paymentMethod.provider)) {
      res.status(400).json({ 
        message: 'Mobile banking requires mobile number and provider name' 
      });
      return;
    }

    // Update the payment method
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      { paymentMethod },
      { new: true }
    );

    res.status(200).json({
      message: 'Payment details updated successfully. The company will use these details to send your payment.',
      submission: updatedSubmission,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 