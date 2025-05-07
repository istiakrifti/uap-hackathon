import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, Award, BookOpen, FileText, Clock, Mail, Globe, MapPin, Briefcase, BookMarked, CheckCircle, PlusCircle } from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';

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
  isPaid: boolean;
  price?: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Interface for Submission
interface Submission {
  _id: string;
  projectId: string | MiniProject;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  quizPassed: boolean;
  quizScore: number;
  paymentStatus?: 'not_required' | 'pending' | 'completed' | 'paid';
  paymentMethod?: {
    type: string;
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    mobileNumber?: string;
    provider?: string;
    transactionId?: string;
    additionalInfo?: string;
  };
  project?: MiniProject;
  createdAt: string;
  feedback?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [miniProjects, setMiniProjects] = useState<MiniProject[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState<{[key: string]: MiniProject}>({});
  const [debug, setDebug] = useState<{ 
    submissions: any, 
    projects: any,
    error: string | null
  }>({
    submissions: null,
    projects: null,
    error: null
  });

  useEffect(() => {
    if (user) {
      fetchMiniProjects();
      fetchMySubmissions();
    }
  }, [user]);

  const fetchMiniProjects = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('platformConnectToken');
      console.log('Fetching projects with token:', token ? 'Token exists' : 'No token');
      const response = await fetch('http://localhost:5000/api/projects?status=active', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Projects data received:', data);
        setMiniProjects(data.projects);
        setDebug(prev => ({ ...prev, projects: data }));
        
        // Create a lookup object for project details
        const projectLookup: {[key: string]: MiniProject} = {};
        data.projects.forEach((project: MiniProject) => {
          projectLookup[project._id] = project;
        });
        console.log('Project lookup created:', projectLookup);
        setProjectDetails(prevDetails => ({
          ...prevDetails,
          ...projectLookup
        }));
      } else {
        console.error('Failed to fetch mini projects, status:', response.status);
        // Try to get error message from response
        try {
          const errorData = await response.json();
          console.error('Error details:', errorData);
          setDebug(prev => ({
            ...prev,
            error: `Projects fetch failed: ${response.status} - ${JSON.stringify(errorData)}`
          }));
        } catch (e) {
          console.error('Could not parse error response');
          setDebug(prev => ({
            ...prev,
            error: `Projects fetch failed: ${response.status} - Could not parse error`
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching mini projects:', error);
      setDebug(prev => ({
        ...prev,
        error: `Error fetching projects: ${error instanceof Error ? error.message : String(error)}`
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDebug = () => {
    const debugElement = document.getElementById('debug-panel');
    if (debugElement) {
      debugElement.style.display = debugElement.style.display === 'none' ? 'block' : 'none';
    }
  };

  const fetchMySubmissions = async () => {
    try {
      const token = localStorage.getItem('platformConnectToken');
      console.log('Fetching submissions with token:', token ? 'Token exists' : 'No token');
      const response = await fetch('http://localhost:5000/api/projects/submissions/mine', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Submissions data received:', data);
        setMySubmissions(data.submissions);
        setDebug(prev => ({ ...prev, submissions: data }));
        
        // Ensure we have data to work with
        if (!data.submissions || !Array.isArray(data.submissions)) {
          console.error('Invalid submissions data format:', data);
          setDebug(prev => ({
            ...prev,
            error: `Invalid submissions data format: ${JSON.stringify(data)}`
          }));
          return;
        }
        
        // Extract populated project data from submissions
        const submissionProjects: {[key: string]: MiniProject} = {};
        data.submissions.forEach((submission: Submission) => {
          try {
            if (submission.projectId && typeof submission.projectId === 'object') {
              // If projectId is a populated object with project details
              const project = submission.projectId as unknown as MiniProject;
              if (project._id) {
                submissionProjects[project._id] = project;
              }
            }
          } catch (error) {
            console.error('Error processing submission project data:', error);
          }
        });
        
        // Update projectDetails with submission project data
        setProjectDetails(prevDetails => ({
          ...prevDetails,
          ...submissionProjects
        }));
      } else {
        console.error('Failed to fetch submissions, status:', response.status);
        // Try to get error message from response
        try {
          const errorData = await response.json();
          console.error('Error details:', errorData);
          setDebug(prev => ({
            ...prev,
            error: `Submissions fetch failed: ${response.status} - ${JSON.stringify(errorData)}`
          }));
        } catch (e) {
          console.error('Could not parse error response');
          setDebug(prev => ({
            ...prev,
            error: `Submissions fetch failed: ${response.status} - Could not parse error`
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setDebug(prev => ({
        ...prev,
        error: `Error fetching submissions: ${error instanceof Error ? error.message : String(error)}`
      }));
    }
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
        if (isPaid && (paymentStatus === 'pending' || !paymentStatus)) {
          return <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Payment Pending</Badge>;
        } else if (isPaid && (paymentStatus === 'completed' || paymentStatus === 'paid')) {
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

  // Filter submissions for completed (approved) projects
  const completedSubmissions = mySubmissions.filter(
    submission => submission.status === 'approved'
  );

  // Filter in-progress projects (excluding attempted and completed projects)
  const inProgressSubmissions = mySubmissions.filter(submission => 
    submission.status !== 'approved'
  );

  console.log('Completed submissions:', completedSubmissions.length);
  console.log('In-progress submissions:', inProgressSubmissions.length);
  console.log('projectDetails mapping:', Object.keys(projectDetails).length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Profile Card */}
        <div className="w-full md:w-80 flex-shrink-0">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-24 h-24 rounded-full bg-platformBlue text-white grid place-items-center mb-2">
                <span className="text-3xl font-semibold">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <CardTitle>{user?.name || 'User'}</CardTitle>
              <CardDescription>
                {user?.role === 'job_seeker' ? 'Job Seeker' : 'User'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user?.email || 'email@example.com'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>portfolio.dev</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center text-sm">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>2 years experience</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['JavaScript', 'React', 'HTML/CSS', 'TypeScript', 'Git', 'Node.js'].map(skill => (
                    <Badge key={skill} variant="outline" className="bg-blue-50">{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/profile/settings')}>Edit Profile</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="in-progress">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="in-progress">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>In Progress</span>
                  {inProgressSubmissions.length > 0 && (
                    <span className="ml-1.5 bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {inProgressSubmissions.length}
                    </span>
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="completed">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Completed</span>
                  {completedSubmissions.length > 0 && (
                    <span className="ml-1.5 bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {completedSubmissions.length}
                    </span>
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="badges">
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4" />
                  <span>Badges</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* In Progress Projects Tab */}
            <TabsContent value="in-progress">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">In Progress Projects</h2>
                <Button variant="outline" onClick={fetchMySubmissions} size="sm">
                  Refresh
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : inProgressSubmissions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Projects In Progress</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      You don't have any projects in progress. 
                      <Button 
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={() => navigate('/projects')}
                      >
                        Browse available projects
                      </Button> to start your learning journey.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {inProgressSubmissions.map((submission) => {
                    let project: MiniProject | null = null;
                    
                    try {
                      // Check if projectId is populated or just an ID
                      if (typeof submission.projectId === 'object' && submission.projectId !== null) {
                        // It's already populated
                        project = submission.projectId as unknown as MiniProject;
                      } else if (typeof submission.projectId === 'string') {
                        // It's an ID, lookup in projectDetails
                        project = projectDetails[submission.projectId];
                      }
                      
                      console.log('Rendering in-progress submission:', submission._id, 'Project found:', !!project);
                      if (!project) {
                        console.error('Project not found for submission:', submission._id, submission.projectId);
                        return null;
                      }
                    } catch (error) {
                      console.error('Error processing project for submission:', submission._id, error);
                      return null;
                    }
                    
                    return (
                      <Card key={submission._id}>
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
                            {getStatusBadge(submission.status, project.isPaid, submission.paymentStatus)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-3">{project.description}</p>
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
                          </div>
                          {submission && submission.quizPassed && (
                            <div className="bg-green-50 text-green-700 p-2 rounded-md text-sm mb-3">
                              Quiz Passed with {submission.quizScore}% Score
                            </div>
                          )}
                          
                          {submission?.feedback && (
                            <div className={`p-3 rounded-md mt-2 ${
                              submission.status === 'approved' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              <h4 className="font-medium text-sm mb-1 flex items-center">
                                {submission.status === 'approved' ? (
                                  <><CheckCircle className="h-4 w-4 mr-2 text-green-700" /> Feedback</>
                                ) : (
                                  <><CheckCircle className="h-4 w-4 mr-2 text-red-700" /> Feedback</>
                                )}
                              </h4>
                              <p className="text-sm">{submission.feedback}</p>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button onClick={() => handleStartProject(project._id)}>
                            Continue Project
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Completed Projects Tab */}
            <TabsContent value="completed">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Completed Projects</h2>
                <Button variant="outline" onClick={fetchMySubmissions} size="sm">
                  Refresh
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : completedSubmissions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Completed Projects</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      You haven't completed any projects yet. Complete projects to build your portfolio.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {completedSubmissions.map((submission) => {
                    let project: MiniProject | null = null;
                    
                    try {
                      // Check if projectId is populated or just an ID
                      if (typeof submission.projectId === 'object' && submission.projectId !== null) {
                        // It's already populated
                        project = submission.projectId as unknown as MiniProject;
                      } else if (typeof submission.projectId === 'string') {
                        // It's an ID, lookup in projectDetails
                        project = projectDetails[submission.projectId];
                      }
                      
                      console.log('Rendering completed submission:', submission._id, 'Project found:', !!project);
                      if (!project) {
                        console.error('Project not found for submission:', submission._id, submission.projectId);
                        return null;
                      }
                    } catch (error) {
                      console.error('Error processing project for submission:', submission._id, error);
                      return null;
                    }
                    
                    return (
                      <Card key={submission._id}>
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
                            {getStatusBadge(submission.status, project.isPaid, submission.paymentStatus)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <Badge variant="secondary">
                              Completion Date: {new Date(submission.createdAt).toLocaleDateString()}
                            </Badge>
                            <Badge variant="secondary">
                              Quiz Score: {submission.quizScore}%
                            </Badge>
                          </div>
                          
                          {submission?.feedback && (
                            <div className="p-3 rounded-md mt-2 bg-green-50 text-green-700 border border-green-200">
                              <h4 className="font-medium text-sm mb-1 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-700" /> Feedback
                              </h4>
                              <p className="text-sm">{submission.feedback}</p>
                            </div>
                          )}
                          
                          {/* For paid projects - display payment information */}
                          {project.isPaid && (
                            <div className={`p-3 rounded-md mt-3 ${
                              submission.paymentStatus === 'completed' || submission.paymentStatus === 'paid'
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            }`}>
                              <h4 className="font-medium text-sm mb-1">Payment Status</h4>
                              {submission.paymentStatus === 'completed' || submission.paymentStatus === 'paid' ? (
                                <div>
                                  <p className="text-sm flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-700" /> 
                                    Payment received
                                  </p>
                                  {submission.paymentMethod?.transactionId && (
                                    <p className="text-sm mt-1">
                                      Transaction ID: {submission.paymentMethod.transactionId}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <p className="text-sm flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-yellow-700" />
                                    Payment pending. Please complete the transaction.
                                  </p>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="mt-2"
                                    onClick={() => handleStartProject(project._id)}
                                  >
                                    Complete Payment
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button 
                            variant="outline" 
                            onClick={() => handleStartProject(project._id)}
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            
            {/* Badges Tab */}
            <TabsContent value="badges">
              <h2 className="text-lg font-semibold mb-4">Earned Badges</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "JavaScript Master", icon: "🏆", color: "bg-yellow-100 text-yellow-700" },
                  { name: "React Pioneer", icon: "⚛️", color: "bg-blue-100 text-blue-700" },
                  { name: "CSS Wizard", icon: "🎨", color: "bg-purple-100 text-purple-700" },
                  { name: "Git Expert", icon: "🔄", color: "bg-orange-100 text-orange-700" },
                  { name: "Quiz Champion", icon: "🧠", color: "bg-green-100 text-green-700" },
                  { name: "Team Player", icon: "👥", color: "bg-pink-100 text-pink-700" },
                ].map((badge, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg border flex flex-col items-center text-center bg-white"
                  >
                    <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center text-xl mb-2`}>
                      {badge.icon}
                    </div>
                    <h3 className="font-medium text-sm">{badge.name}</h3>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Debug Panel - hidden by default */}
      <div className="fixed bottom-4 right-4">
        <button 
          onClick={toggleDebug}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow"
        >
          Debug
        </button>
      </div>
      
      <div id="debug-panel" className="fixed inset-0 bg-black/80 text-white p-4 overflow-auto" style={{ display: 'none', zIndex: 9999 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Debug Panel</h2>
          <button 
            onClick={toggleDebug}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
          >
            Close
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Submissions</h3>
            <pre className="text-xs overflow-auto max-h-96">
              {debug.submissions ? JSON.stringify(debug.submissions, null, 2) : 'No data'}
            </pre>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Projects Lookup</h3>
            <pre className="text-xs overflow-auto max-h-96">
              {Object.keys(projectDetails).length > 0 
                ? JSON.stringify(projectDetails, null, 2) 
                : 'No data'}
            </pre>
          </div>
          
          <div className="bg-gray-800 p-4 rounded col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Rendering Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium">In Progress Submissions</h4>
                <p>Count: {inProgressSubmissions.length}</p>
                <ul className="text-xs">
                  {inProgressSubmissions.map(sub => (
                    <li key={sub._id}>
                      ID: {sub._id.slice(-6)}, Status: {sub.status}, 
                      Project Found: {typeof sub.projectId === 'object' || projectDetails[sub.projectId as string] ? 'Yes' : 'No'}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Completed Submissions</h4>
                <p>Count: {completedSubmissions.length}</p>
                <ul className="text-xs">
                  {completedSubmissions.map(sub => (
                    <li key={sub._id}>
                      ID: {sub._id.slice(-6)}, Status: {sub.status}, 
                      Project Found: {typeof sub.projectId === 'object' || projectDetails[sub.projectId as string] ? 'Yes' : 'No'}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Project Details Keys</h4>
                <p>Count: {Object.keys(projectDetails).length}</p>
                <ul className="text-xs overflow-auto max-h-40">
                  {Object.keys(projectDetails).map(key => (
                    <li key={key}>{key.slice(-6)}: {projectDetails[key]?.title || 'Unknown'}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {debug.error && (
            <div className="bg-red-800 p-4 rounded col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Error</h3>
              <pre className="text-xs">{debug.error}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
