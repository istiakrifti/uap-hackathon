import apiClient from './client';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements?: string[];
  postedBy: string | {
    _id: string;
    name: string;
    company: string;
  };
  applicants: string[] | {
    _id: string;
    name: string;
    email: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobDto {
  title: string;
  company?: string;
  location: string;
  salary: string;
  description: string;
  requirements?: string[];
}

// Get all jobs with optional filters
export const getAllJobs = async (filters?: { search?: string; location?: string; requirement?: string }) => {
  const response = await apiClient.get('/jobs', { params: filters });
  return response.data;
};

// Get a specific job by ID
export const getJobById = async (id: string) => {
  const response = await apiClient.get(`/jobs/${id}`);
  return response.data;
};

// Create a new job
export const createJob = async (jobData: CreateJobDto) => {
  const response = await apiClient.post('/jobs', jobData);
  return response.data;
};

// Update a job
export const updateJob = async (id: string, jobData: Partial<CreateJobDto>) => {
  const response = await apiClient.put(`/jobs/${id}`, jobData);
  return response.data;
};

// Delete a job
export const deleteJob = async (id: string) => {
  const response = await apiClient.delete(`/jobs/${id}`);
  return response.data;
};

// Get jobs posted by the current user
export const getMyJobs = async () => {
  const response = await apiClient.get('/jobs/user/myjobs');
  return response.data;
};

// Apply to a job
export const applyToJob = async (id: string) => {
  const response = await apiClient.post(`/jobs/${id}/apply`);
  return response.data;
};

// Get jobs the user has applied to
export const getAppliedJobs = async () => {
  const response = await apiClient.get('/jobs/user/applied');
  return response.data;
}; 