import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileEdit, Trash2, Users, BookOpen, LineChart } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Project {
  _id: string;
  title: string;
  description: string;
  companyName: string;
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
  updatedAt: string;
}

const MiniProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('MiniProjects component mounted');
    console.log('Current user:', user);
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('platformConnectToken');
      console.log('Fetching projects from API');
      const response = await fetch('http://localhost:5000/api/projects/company/mine', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Projects received:', data);
        setProjects(data.projects);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        toast.error(errorData.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Error fetching projects');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateProject = () => {
    console.log('Create project button clicked');
    console.log('Navigating to /projects/create');
    navigate('/projects/create');
  };
  
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/edit/${projectId}`);
  };
  
  const handleViewSubmissions = (projectId: string) => {
    navigate(`/projects/submissions/${projectId}`);
  };
  
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('platformConnectToken');
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          toast.success('Project deleted successfully');
          // Refresh projects
          fetchProjects();
        } else {
          const data = await response.json();
          toast.error(data.message || 'Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Error deleting project');
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Mini-Projects Hub</h1>
      
      <Tabs defaultValue="projects" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="projects" className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1.5">
            <LineChart className="h-4 w-4" />
            <span>Talent Statistics</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted-foreground">
                Create mini projects for job seekers to demonstrate their skills. Each project can include courses, a quiz, and project requirements.
              </p>
            </div>
            <Button onClick={handleCreateProject}>
              <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </div>
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Projects</TabsTrigger>
              <TabsTrigger value="inactive">Inactive Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : projects.filter(p => p.status === 'active').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active projects found. Create your first project to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.filter(p => p.status === 'active').map(project => (
                    <Card key={project._id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              {project.title}
                              {project.isPaid && (
                                <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-700">
                                  Paid (${project.price})
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Created on {new Date(project.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <BookOpen className="mr-1 h-4 w-4" />
                            {project.courses.length} Course{project.courses.length !== 1 ? 's' : ''}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-1 h-4 w-4" />
                            0 Submissions
                          </div>
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
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditProject(project._id)}>
                            <FileEdit className="mr-1 h-4 w-4" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project._id)}>
                            <Trash2 className="mr-1 h-4 w-4" /> Delete
                          </Button>
                        </div>
                        <Button size="sm" onClick={() => handleViewSubmissions(project._id)}>
                          View Submissions
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="inactive" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : projects.filter(p => p.status === 'inactive').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No inactive projects found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.filter(p => p.status === 'inactive').map(project => (
                    <Card key={project._id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              {project.title}
                              {project.isPaid && (
                                <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-700">
                                  Paid (${project.price})
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Created on {new Date(project.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">Inactive</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <BookOpen className="mr-1 h-4 w-4" />
                            {project.courses.length} Course{project.courses.length !== 1 ? 's' : ''}
                          </div>
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
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => handleEditProject(project._id)}>
                          <FileEdit className="mr-1 h-4 w-4" /> Edit
                        </Button>
                        <Button size="sm" onClick={() => handleViewSubmissions(project._id)}>
                          View Submissions
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Stats Tab */}
        <TabsContent value="stats">
          <h2 className="text-lg font-semibold mb-4">Talent Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Applicant Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-muted-foreground">Demographics chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Skills Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-muted-foreground">Skills chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Job seekers who performed best in your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white grid place-items-center">
                      <span className="text-sm font-medium">JS</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">John Smith</h4>
                      <p className="text-xs text-muted-foreground">Frontend Developer</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">95%</p>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MiniProjects; 