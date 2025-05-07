import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { 
  ChevronLeft, 
  Plus, 
  X, 
  Book, 
  HelpCircle, 
  FileText 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema for form validation
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['active', 'inactive']),
  isPaid: z.boolean().default(false),
  price: z.number().nullable().optional(),
  requirements: z.array(z.string()).optional(),
});

// Project interfaces
interface Course {
  title: string;
  description: string;
  resources: string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctOption: number;
}

interface ProjectFormData {
  title: string;
  description: string;
  status: 'active' | 'inactive';
  isPaid: boolean;
  price?: number | null;
  requirements: string[];
}

const ProjectForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  
  // For adding new resources to courses
  const [newResource, setNewResource] = useState<string>('');
  
  // For adding new requirements
  const [newRequirement, setNewRequirement] = useState<string>('');
  
  // Form setup
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'active',
      isPaid: false,
      price: null,
      requirements: [],
    }
  });
  
  // Fetch project data if editing
  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);
  
  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('platformConnectToken');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const project = data.project;
        
        // Set form values
        form.reset({
          title: project.title,
          description: project.description,
          status: project.status,
          isPaid: project.isPaid,
          price: project.price,
          requirements: project.requirements || [],
        });
        
        // Set courses and quiz questions
        setCourses(project.courses || []);
        setQuizQuestions(project.quiz || []);
      } else {
        toast.error('Failed to fetch project');
        navigate('/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Error fetching project');
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Course management
  const addCourse = () => {
    setCourses([...courses, { title: '', description: '', resources: [] }]);
  };
  
  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };
  
  const updateCourse = (index: number, field: keyof Course, value: string) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCourses(updatedCourses);
  };
  
  const addResourceToCourse = (courseIndex: number) => {
    if (!newResource.trim()) return;
    
    const updatedCourses = [...courses];
    updatedCourses[courseIndex].resources.push(newResource.trim());
    setCourses(updatedCourses);
    setNewResource('');
  };
  
  const removeResourceFromCourse = (courseIndex: number, resourceIndex: number) => {
    const updatedCourses = [...courses];
    updatedCourses[courseIndex].resources.splice(resourceIndex, 1);
    setCourses(updatedCourses);
  };
  
  // Quiz management
  const addQuizQuestion = () => {
    setQuizQuestions([...quizQuestions, { 
      question: '', 
      options: ['', ''], 
      correctOption: 0 
    }]);
  };
  
  const removeQuizQuestion = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };
  
  const updateQuizQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuizQuestions(updatedQuestions);
  };
  
  const addOptionToQuestion = (questionIndex: number) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[questionIndex].options.push('');
    setQuizQuestions(updatedQuestions);
  };
  
  const removeOptionFromQuestion = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quizQuestions];
    
    // Ensure we always have at least 2 options
    if (updatedQuestions[questionIndex].options.length <= 2) {
      return;
    }
    
    // If removing the correct option, reset it to the first option
    if (updatedQuestions[questionIndex].correctOption === optionIndex) {
      updatedQuestions[questionIndex].correctOption = 0;
    }
    // If removing an option before the correct option, adjust the correct option index
    else if (updatedQuestions[questionIndex].correctOption > optionIndex) {
      updatedQuestions[questionIndex].correctOption -= 1;
    }
    
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuizQuestions(updatedQuestions);
  };
  
  const updateQuizOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizQuestions(updatedQuestions);
  };
  
  // Requirements management
  const addRequirement = () => {
    if (!newRequirement.trim()) return;
    
    const currentRequirements = form.getValues('requirements') || [];
    form.setValue('requirements', [...currentRequirements, newRequirement.trim()]);
    setNewRequirement('');
  };
  
  const removeRequirement = (index: number) => {
    const currentRequirements = form.getValues('requirements') || [];
    form.setValue('requirements', currentRequirements.filter((_, i) => i !== index));
  };
  
  // Submit form
  const onSubmit = async (data: ProjectFormData) => {
    console.log('Form submitted with data:', { ...data, courses, quiz: quizQuestions });
    
    // Validate courses and quiz questions
    const validCourses = courses.every(course => course.title.trim() && course.description.trim());
    if (!validCourses) {
      toast.error('All courses must have a title and description');
      return;
    }
    
    const validQuiz = quizQuestions.every(q => 
      q.question.trim() && 
      q.options.every(opt => opt.trim()) &&
      q.options.length >= 2
    );
    if (!validQuiz && quizQuestions.length > 0) {
      toast.error('All quiz questions must be complete with at least 2 options');
      return;
    }
    
    // Validate price for paid projects
    if (data.isPaid && (!data.price || data.price <= 0)) {
      toast.error('Paid projects must have a reward amount greater than zero');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('platformConnectToken');
      
      // Prepare data for API
      const projectData = {
        title: data.title,
        description: data.description,
        status: data.status,
        isPaid: data.isPaid,
        price: data.isPaid ? data.price : undefined,
        requirements: data.requirements,
        courses,
        quiz: quizQuestions,
      };
      
      const url = projectId 
        ? `http://localhost:5000/api/projects/${projectId}`
        : 'http://localhost:5000/api/projects';
      
      console.log('Submitting project to:', url);
      const method = projectId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });
      
      console.log('API response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Project created/updated successfully:', responseData);
        toast.success(`Project ${projectId ? 'updated' : 'created'} successfully`);
        
        // Add a small delay before redirecting to ensure the project has been created/updated
        setTimeout(() => {
          console.log('Redirecting to /projects');
          navigate('/projects');
        }, 500);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        toast.error(errorData.message || `Failed to ${projectId ? 'update' : 'create'} project`);
      }
    } catch (error) {
      console.error(`Error ${projectId ? 'updating' : 'creating'} project:`, error);
      toast.error(`Error ${projectId ? 'updating' : 'creating'} project`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const basicInfoTab = (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter project title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter a detailed description of your project" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Pricing Options */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium">Project Pricing</h3>
        
        <FormField
          control={form.control}
          name="isPaid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </FormControl>
              <FormLabel className="font-normal">This is a paid project</FormLabel>
            </FormItem>
          )}
        />
        
        {form.watch('isPaid') && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reward Amount ($)</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <span className="bg-muted px-3 py-2 rounded-l-md text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="rounded-l-none"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      value={field.value === null || field.value === undefined ? '' : field.value}
                    />
                  </div>
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the amount you will pay when a job seeker successfully completes this project.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/projects')}
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-3xl font-bold">{projectId ? 'Edit' : 'Create'} Project</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center">
                <Book className="h-4 w-4 mr-2" />
                Courses & Resources
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                Quiz Questions
              </TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Start by providing basic information about your project. Then navigate to the "Courses & Resources" and "Quiz Questions" tabs to complete your project.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {basicInfoTab}
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              className="form-radio h-4 w-4" 
                              checked={field.value === 'active'}
                              onChange={() => field.onChange('active')}
                            />
                            <span>Active</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              className="form-radio h-4 w-4" 
                              checked={field.value === 'inactive'}
                              onChange={() => field.onChange('inactive')}
                            />
                            <span>Inactive</span>
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Project Requirements */}
                  <div className="space-y-2">
                    <Label>Project Requirements</Label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="Add a project requirement" 
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                        />
                        <Button 
                          type="button" 
                          onClick={addRequirement}
                          disabled={!newRequirement.trim()}
                        >
                          Add
                        </Button>
                      </div>
                      
                      <div className="space-y-2 mt-2">
                        {form.watch('requirements')?.map((req, index) => (
                          <div key={index} className="flex items-center p-2 border rounded-md">
                            <span className="flex-1">{req}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeRequirement(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Courses & Learning Resources</CardTitle>
                    <CardDescription>
                      Add courses with learning materials that job seekers need to complete before submitting the project.
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addCourse}>
                    <Plus className="h-4 w-4 mr-1" /> Add Course
                  </Button>
                </CardHeader>
                <CardContent>
                  {courses.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No courses added yet. Click "Add Course" to create your first course.
                    </div>
                  ) : (
                    <Accordion type="multiple" className="space-y-4">
                      {courses.map((course, index) => (
                        <AccordionItem key={index} value={`course-${index}`} className="border rounded-lg p-2">
                          <AccordionTrigger className="py-2 px-4">
                            <div className="flex justify-between items-center w-full">
                              <span>{course.title || `Course ${index + 1}`}</span>
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCourse(index);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-4 space-y-4">
                            <div className="space-y-2">
                              <Label>Course Title</Label>
                              <Input 
                                placeholder="Enter course title" 
                                value={course.title}
                                onChange={(e) => updateCourse(index, 'title', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Course Description</Label>
                              <Textarea 
                                placeholder="Describe what this course covers..." 
                                className="min-h-24"
                                value={course.description}
                                onChange={(e) => updateCourse(index, 'description', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Resources</Label>
                              <div className="flex space-x-2">
                                <Input 
                                  placeholder="Add a resource URL" 
                                  value={newResource}
                                  onChange={(e) => setNewResource(e.target.value)}
                                />
                                <Button 
                                  type="button" 
                                  onClick={() => addResourceToCourse(index)}
                                  disabled={!newResource.trim()}
                                >
                                  Add
                                </Button>
                              </div>
                              
                              <div className="space-y-2 mt-2">
                                {course.resources.map((resource, resourceIndex) => (
                                  <div key={resourceIndex} className="flex items-center p-2 border rounded-md">
                                    <span className="flex-1 break-all">{resource}</span>
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => removeResourceFromCourse(index, resourceIndex)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Quiz Tab */}
            <TabsContent value="quiz" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Quiz Questions</CardTitle>
                    <CardDescription>
                      Create quiz questions to test job seekers' understanding. They must pass the quiz before submitting the project.
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addQuizQuestion}>
                    <Plus className="h-4 w-4 mr-1" /> Add Question
                  </Button>
                </CardHeader>
                <CardContent>
                  {quizQuestions.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No quiz questions added yet. Click "Add Question" to create your first question.
                    </div>
                  ) : (
                    <Accordion type="multiple" className="space-y-4">
                      {quizQuestions.map((question, qIndex) => (
                        <AccordionItem key={qIndex} value={`question-${qIndex}`} className="border rounded-lg p-2">
                          <AccordionTrigger className="py-2 px-4">
                            <div className="flex justify-between items-center w-full">
                              <span>{question.question || `Question ${qIndex + 1}`}</span>
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeQuizQuestion(qIndex);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-4 space-y-4">
                            <div className="space-y-2">
                              <Label>Question</Label>
                              <Input 
                                placeholder="Enter quiz question" 
                                value={question.question}
                                onChange={(e) => updateQuizQuestion(qIndex, 'question', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label>Options</Label>
                                <Button 
                                  type="button" 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addOptionToQuestion(qIndex)}
                                >
                                  <Plus className="h-3 w-3 mr-1" /> Add Option
                                </Button>
                              </div>
                              
                              <div className="space-y-2 mt-2">
                                {question.options.map((option, optIndex) => (
                                  <div key={optIndex} className="flex items-center space-x-2">
                                    <input 
                                      type="radio" 
                                      checked={question.correctOption === optIndex}
                                      onChange={() => updateQuizQuestion(qIndex, 'correctOption', optIndex)}
                                      className="form-radio h-4 w-4"
                                    />
                                    <Input 
                                      placeholder={`Option ${optIndex + 1}`} 
                                      value={option}
                                      onChange={(e) => updateQuizOption(qIndex, optIndex, e.target.value)}
                                      className="flex-1"
                                    />
                                    {question.options.length > 2 && (
                                      <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => removeOptionFromQuestion(qIndex, optIndex)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Select the radio button next to the correct answer.
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between space-x-2">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Important:</strong> Please complete all three tabs to create a comprehensive project.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/projects')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {projectId ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{projectId ? 'Update' : 'Create'} Project</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectForm;