import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Database, LineChart, BadgeCheck, BookMarked, FileText } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ProjectFilter from '@/components/projects/ProjectFilter';

// Interface for Mini Project
interface MiniProject {
  _id: string;
  title: string;
  description: string;
  companyName: string;
  companyId: string;
  courses: {
    title: string;
    description: string;
    resources: string[];
  }[];
  quiz: {
    question: string;
    options: string[];
    correctOption: number;
  }[];
  requirements: string[];
  status: 'active' | 'inactive';
  isPaid: boolean;
  price?: number;
  createdAt: string;
}

// Interface for Submission
interface Submission {
  _id: string;
  projectId: string | {
    _id: string;
    title: string;
    description: string;
    [key: string]: any;
  };
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  quizPassed: boolean;
  quizScore: number;
  paymentStatus?: 'not_required' | 'pending' | 'completed' | 'paid';
  paymentMethod?: {
    type: string;
    transactionId?: string;
    [key: string]: any;
  };
  createdAt: string;
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [miniProjects, setMiniProjects] = useState<MiniProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<MiniProject[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // First fetch submissions, then fetch projects
    // This ensures we know which projects to filter out
    fetchMySubmissionsAndThenProjects();
  }, []);
  
  // Combined function to ensure submissions are loaded before projects
  const fetchMySubmissionsAndThenProjects = async () => {
    setIsLoading(true);
    try {
      // First get all user submissions
      const token = localStorage.getItem('platformConnectToken');
      const submissionsResponse = await fetch('http://localhost:5000/api/projects/submissions/mine', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      let attemptedProjectIds: string[] = [];
      
      if (submissionsResponse.ok) {
        const data = await submissionsResponse.json();
        setMySubmissions(data.submissions);
        
        // Extract all project IDs the user has attempted
        attemptedProjectIds = data.submissions.map(sub => 
          typeof sub.projectId === 'string' ? sub.projectId : sub.projectId._id
        );
        
        console.log('Projects user has attempted:', attemptedProjectIds);
      } else {
        console.error('Failed to fetch submissions');
      }
      
      // Then get all available projects and filter out attempted ones
      const projectsResponse = await fetch('http://localhost:5000/api/projects?status=active', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (projectsResponse.ok) {
        const data = await projectsResponse.json();
        setMiniProjects(data.projects);
        
        // Filter out all projects that have been attempted
        const filtered = data.projects.filter(project => 
          !attemptedProjectIds.includes(project._id)
        );
        
        setFilteredProjects(filtered);
        console.log(`Loaded ${data.projects.length} total projects, ${filtered.length} available to attempt`);
      } else {
        console.error('Failed to fetch mini projects');
        toast.error('Failed to fetch mini projects');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading projects');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Keep these functions for individual refresh actions
  const fetchMiniProjects = async () => {
    try {
      const token = localStorage.getItem('platformConnectToken');
      const response = await fetch('http://localhost:5000/api/projects?status=active', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMiniProjects(data.projects);
        
        // Get current attempted project IDs
        const attemptedProjectIds = mySubmissions.map(sub => 
          typeof sub.projectId === 'string' ? sub.projectId : sub.projectId._id
        );
        
        // Filter out attempted projects
        const filtered = data.projects.filter(project => 
          !attemptedProjectIds.includes(project._id)
        );
        
        setFilteredProjects(filtered);
      } else {
        console.error('Failed to fetch mini projects');
        toast.error('Failed to fetch mini projects');
      }
    } catch (error) {
      console.error('Error fetching mini projects:', error);
      toast.error('Error fetching mini projects');
    }
  };
  
  const fetchMySubmissions = async () => {
    try {
      const token = localStorage.getItem('platformConnectToken');
      const response = await fetch('http://localhost:5000/api/projects/submissions/mine', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMySubmissions(data.submissions);
        
        // After updating submissions, refresh project list to apply new filters
        fetchMiniProjects();
      } else {
        console.error('Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };
  
  const handleSearch = (searchTerm: string) => {
    // Get current attempted project IDs
    const attemptedProjectIds = mySubmissions.map(sub => 
      typeof sub.projectId === 'string' ? sub.projectId : sub.projectId._id
    );
    
    if (!searchTerm) {
      // Reset to all available projects (excluding attempted ones)
      setFilteredProjects(miniProjects.filter(project => 
        !attemptedProjectIds.includes(project._id)
      ));
      return;
    }
    
    // Filter by search term AND exclude attempted projects
    const filtered = miniProjects.filter(project => 
      !attemptedProjectIds.includes(project._id) && (
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    setFilteredProjects(filtered);
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    // Get current attempted project IDs
    const attemptedProjectIds = mySubmissions.map(sub => 
      typeof sub.projectId === 'string' ? sub.projectId : sub.projectId._id
    );
    
    if (value === 'all') {
      // Reset to all available projects (excluding attempted ones)
      setFilteredProjects(miniProjects.filter(project => 
        !attemptedProjectIds.includes(project._id)
      ));
      return;
    }
    
    // First exclude attempted projects
    let filtered = miniProjects.filter(project => 
      !attemptedProjectIds.includes(project._id)
    );
    
    // Then apply additional filters
    if (filter === 'industry') {
      filtered = filtered.filter(project => 
        project.companyName.toLowerCase().includes(value.toLowerCase())
      );
    } else if (filter === 'paid') {
      filtered = filtered.filter(project => 
        value === 'paid' ? project.isPaid : !project.isPaid
      );
    }
    
    setFilteredProjects(filtered);
  };
  
  const handleSortChange = (value: string) => {
    let sorted = [...filteredProjects];
    
    switch (value) {
      case 'newest':
        sorted = sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        sorted = sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
    }
    
    setFilteredProjects(sorted);
  };
  
  const handleStartProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };
  
  const getSubmissionForProject = (projectId: string) => {
    return mySubmissions.find(sub => sub.projectId === projectId);
  };
  
  const getStatusBadge = (status: string, isPaid: boolean = false, paymentStatus?: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">Submitted</Badge>;
      case 'approved':
        if (isPaid && paymentStatus === 'pending') {
          return <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Payment Pending</Badge>;
        } else if (isPaid && paymentStatus === 'completed') {
          return <Badge variant="outline" className="bg-green-100 text-green-700">Completed & Paid</Badge>;
        }
        return <Badge variant="outline" className="bg-green-100 text-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-700">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mini-Projects</h1>
      
      {/* Show attempted projects note */}
      {mySubmissions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-blue-800 text-sm flex items-center">
            <BadgeCheck className="h-4 w-4 mr-2" /> 
            {mySubmissions.length} {mySubmissions.length === 1 ? 'project has' : 'projects have'} been attempted or completed. 
            View your progress in the <a href="/profile" className="underline font-medium hover:text-blue-600">Profile page</a>.
          </p>
        </div>
      )}
      
      {/* Filter */}
      <ProjectFilter 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      
      {/* Project List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookMarked className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No Mini Projects Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are currently no mini projects available. Check back later for new opportunities to showcase your skills.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const submission = getSubmissionForProject(project._id);
            return (
              <Card key={project._id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {project.title}
                        {project.isPaid && (
                          <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-700">
                            Paid (${project.price})
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>By {project.companyName}</CardDescription>
                    </div>
                    {submission ? (
                      getStatusBadge(submission.status, project.isPaid, submission.paymentStatus)
                    ) : (
                      <Badge variant="outline">Not Started</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="mb-3 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge variant="secondary">
                      {project.courses.length} Course{project.courses.length !== 1 ? 's' : ''}
                    </Badge>
                    <Badge variant="secondary">
                      {project.quiz.length} Quiz Question{project.quiz.length !== 1 ? 's' : ''}
                    </Badge>
                    <Badge variant="secondary">
                      {project.requirements.length} Requirement{project.requirements.length !== 1 ? 's' : ''}
                    </Badge>
                    {project.isPaid ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        Paid Project
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Free Project
                      </Badge>
                    )}
                  </div>
                  {submission && submission.quizPassed && (
                    <div className="bg-green-50 text-green-700 p-2 rounded-md text-sm mb-3">
                      Quiz Passed with {submission.quizScore}% Score
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 mt-auto">
                  {submission && submission.status === 'approved' ? (
                    <Button variant="outline" disabled className="w-full">Project Approved</Button>
                  ) : submission && submission.status === 'rejected' ? (
                    <Button onClick={() => handleStartProject(project._id)} className="w-full">Try Again</Button>
                  ) : (
                    <Button onClick={() => handleStartProject(project._id)} className="w-full">
                      {submission ? 'Continue Project' : 'Start Project'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
