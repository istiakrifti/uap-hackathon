import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, Briefcase, Search, MapPin, X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Job, 
  getAllJobs, 
  getMyJobs, 
  createJob, 
  deleteJob, 
  applyToJob 
} from "@/api/jobsApi";

const Jobs = () => {
  const { user } = useAuth();
  const isIndustry = user?.role === 'industry';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isIndustry ? "Manage Job Postings" : "Job Postings"}
        </h1>
        <p className="text-muted-foreground">
          {isIndustry 
            ? "Create and manage job postings for your organization" 
            : "Browse available job opportunities"}
        </p>
      </div>

      {isIndustry ? <IndustryJobsView /> : <JobSeekerView />}
    </div>
  );
};

const JobSeekerView = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [requirement, setRequirement] = useState('');
  const { toast } = useToast();

  const fetchJobs = async (filters?: { search?: string; location?: string; requirement?: string }) => {
    try {
      setIsLoading(true);
      const response = await getAllJobs(filters);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load job listings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs({ search, location, requirement });
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setRequirement('');
    fetchJobs();
  };

  const handleApply = async (jobId: string) => {
    try {
      await applyToJob(jobId);
      toast({
        title: "Success",
        description: "You have successfully applied to this job",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to apply for job";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Add a function to check if a requirement matches the search term
  const isMatchingRequirement = (req: string) => {
    if (!requirement) return false;
    return req.toLowerCase().includes(requirement.toLowerCase());
  };

  return (
    <>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search jobs by title, company, or keywords" 
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Location" 
                  className="pl-9"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by skill/requirement" 
                  className="pl-9"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <Button type="submit">Search Jobs</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No job postings found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <CardDescription className="flex flex-col gap-1">
                  <span className="font-medium text-primary">
                    {typeof job.postedBy === 'object' ? job.postedBy.company : job.company}
                  </span>
                  <span>{job.location}</span>
                  <span className="font-medium">{job.salary}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {job.description}
                </p>
                
                {job.requirements && job.requirements.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium mb-1">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.map((req, index) => (
                        <Badge 
                          key={index} 
                          variant={isMatchingRequirement(req) ? "default" : "outline"} 
                          className={`text-xs ${isMatchingRequirement(req) ? "bg-primary/20 text-primary border-primary" : ""}`}
                        >
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  className="mt-4 w-full"
                  onClick={() => handleApply(job._id)}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

const IndustryJobsView = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    salary: "",
    description: "",
    requirements: [] as string[]
  });
  
  const [newRequirement, setNewRequirement] = useState("");

  const fetchMyJobs = async () => {
    try {
      setIsLoading(true);
      const response = await getMyJobs();
      setMyJobs(response.data);
    } catch (error) {
      console.error('Error fetching my jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load your job postings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJob({
      ...newJob,
      [name]: value
    });
  };

  const addRequirement = () => {
    if (newRequirement.trim() === "") return;
    
    setNewJob({
      ...newJob,
      requirements: [...newJob.requirements, newRequirement.trim()]
    });
    setNewRequirement("");
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = [...newJob.requirements];
    updatedRequirements.splice(index, 1);
    
    setNewJob({
      ...newJob,
      requirements: updatedRequirements
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob(newJob);
      toast({
        title: "Success",
        description: "Job posting created successfully",
      });
      setNewJob({
        title: "",
        location: "",
        salary: "",
        description: "",
        requirements: []
      });
      setIsCreating(false);
      fetchMyJobs();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create job posting";
      toast({
        title: "Error",
        description: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      toast({
        title: "Success",
        description: "Job posting deleted successfully",
      });
      fetchMyJobs();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete job posting";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {!isCreating ? (
        <Button 
          className="flex items-center gap-2" 
          onClick={() => setIsCreating(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Post New Job
        </Button>
      ) : (
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Create Job Posting</CardTitle>
            <CardDescription>Fill out the details for your new job posting</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input 
                  id="title"
                  name="title"
                  placeholder="e.g., Software Engineer" 
                  value={newJob.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  name="location"
                  placeholder="e.g., Remote, New York, NY" 
                  value={newJob.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input 
                  id="salary"
                  name="salary"
                  placeholder="e.g., $80,000 - $100,000" 
                  value={newJob.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Describe the role, responsibilities, and requirements..." 
                  rows={5}
                  value={newJob.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Requirements</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a requirement"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addRequirement();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addRequirement}
                    className="flex-shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {newJob.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newJob.requirements.map((req, index) => (
                      <Badge key={index} variant="secondary" className="pr-1 flex items-center gap-1">
                        {req}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full"
                          onClick={() => removeRequirement(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button type="submit">Post Job</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Your Job Postings
        </h2>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : myJobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myJobs.map((job) => (
              <Card key={job._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{job.location}</p>
                      <p className="font-medium">{job.salary}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-sm">
                      {Array.isArray(job.applicants) ? job.applicants.length : 0} 
                      {Array.isArray(job.applicants) && job.applicants.length === 1 ? ' Applicant' : ' Applicants'}
                    </span>
                  </div>
                </div>
                
                <p className="mt-3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">{job.description}</p>
                
                {job.requirements && job.requirements.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteJob(job._id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;