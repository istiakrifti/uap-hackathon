import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  BookOpen, 
  ChevronLeft, 
  ClipboardCheck, 
  ExternalLink, 
  Github, 
  FileArchive, 
  CheckCircle, 
  XCircle,
  Upload,
  FileText
} from 'lucide-react';

// Project interface
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
  isPaid: boolean;
  price?: number;
  status: 'active' | 'inactive';
}

// Submission interface
interface Submission {
  _id: string;
  projectId: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  quizPassed: boolean;
  quizScore: number;
  quizResults: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  paymentStatus?: 'not_required' | 'pending' | 'completed' | 'paid' | 'failed';
  paymentMethod?: {
    type: 'bank_transfer' | 'mobile_banking' | 'paypal' | 'stripe' | 'other';
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    mobileNumber?: string;
    provider?: string;
    transactionId?: string;
    additionalInfo?: string;
  };
  githubLink?: string;
  zipFileUrl?: string;
  feedback?: string;
}

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [currentTab, setCurrentTab] = useState('info');
  const [githubLink, setGithubLink] = useState('');
  const [zipFileUrl, setZipFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'mobile_banking',
    mobileNumber: '',
    provider: '',
    accountNumber: '',
    accountName: '',
    bankName: '',
    additionalInfo: ''
  });
  
  useEffect(() => {
    fetchProject();
    fetchSubmission();
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
        setProject(data.project);
        // Initialize quiz answers array with -1 (no answer selected)
        const initialAnswers = new Array(data.project.quiz.length).fill(-1);
        setQuizAnswers(initialAnswers);
      } else {
        toast.error('Failed to fetch project details');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Error fetching project details');
      navigate('/profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSubmission = async () => {
    try {
      const token = localStorage.getItem('platformConnectToken');
      const response = await fetch('http://localhost:5000/api/projects/submissions/mine', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const matchingSubmission = data.submissions.find(
          (sub: any) => sub.projectId === projectId
        );
        if (matchingSubmission) {
          setSubmission(matchingSubmission);
          
          // If the submission has quiz results, use them to pre-populate the answers
          if (matchingSubmission.quizResults && matchingSubmission.quizResults.length > 0) {
            const savedAnswers = matchingSubmission.quizResults.map(
              (result: any) => result.selectedOption
            );
            setQuizAnswers(savedAnswers);
          }
          
          // Set links if available
          if (matchingSubmission.githubLink) {
            setGithubLink(matchingSubmission.githubLink);
          }
          if (matchingSubmission.zipFileUrl) {
            setZipFileUrl(matchingSubmission.zipFileUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    }
  };
  
  const handleQuizAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = optionIndex;
    setQuizAnswers(newAnswers);
  };
  
  const handleSubmitQuiz = async () => {
    // Ensure all questions are answered
    if (quizAnswers.includes(-1)) {
      toast.error('Please answer all quiz questions');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('platformConnectToken');
      const response = await fetch('http://localhost:5000/api/projects/submit/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId,
          answers: quizAnswers
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.passed) {
          toast.success('Congratulations! You passed the quiz.');
          setSubmission(data.submission);
          setCurrentTab('submit');
        } else {
          toast.error(`Quiz score: ${data.score}%. You need 70% to pass.`);
          setSubmission(data.submission);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Error submitting quiz');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitPayment = async () => {
    if (!submission?._id) {
      toast.error('You need to complete and submit the project first');
      return;
    }
    
    // Validate payment method based on type
    if (paymentMethod.type === 'mobile_banking' && 
        (!paymentMethod.mobileNumber || !paymentMethod.provider)) {
      toast.error('Please provide your mobile number and provider name');
      return;
    }
    
    if (paymentMethod.type === 'bank_transfer' &&
        (!paymentMethod.accountNumber || !paymentMethod.accountName || !paymentMethod.bankName)) {
      toast.error('Please provide your account details for bank transfer');
      return;
    }
    
    if ((paymentMethod.type === 'paypal' || paymentMethod.type === 'other') && 
        !paymentMethod.additionalInfo) {
      toast.error('Please provide the required payment details');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('platformConnectToken');
      const response = await fetch(`http://localhost:5000/api/projects/submissions/${submission._id}/payment-method`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethod
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmission(data.submission);
        setShowPaymentForm(false);
        toast.success('Payment details submitted successfully. You will receive payment from the company soon.');
        
        // Redirect to profile page after a delay
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to submit payment details');
      }
    } catch (error) {
      console.error('Error submitting payment details:', error);
      toast.error('Error submitting payment details');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitProject = async () => {
    if (!submission?._id) {
      toast.error('You must complete and pass the quiz first');
      return;
    }
    
    if (!submission.quizPassed) {
      toast.error('You must pass the quiz before submitting your project');
      setCurrentTab('quiz');
      return;
    }

    if (!githubLink && !zipFileUrl) {
      toast.error('Please provide either a GitHub link or a file URL');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('platformConnectToken');
      const response = await fetch('http://localhost:5000/api/projects/submit/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          submissionId: submission._id,
          githubLink,
          zipFileUrl
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmission(data.submission);
        toast.success('Project submitted successfully');
        
        // Show payment form if it's a paid project
        if (project?.isPaid) {
          setShowPaymentForm(true);
        } else {
          // Redirect to profile page after a delay for free projects
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to submit project');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error('Error submitting project');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <p className="text-muted-foreground mt-2">The requested project does not exist or you don't have access to it.</p>
        <Button className="mt-4" onClick={() => navigate('/profile')}>Back to Profile</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/profile')}
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{project.title}</h1>
        {project.isPaid && (
          <Badge variant="outline" className="ml-3 bg-purple-100 text-purple-700">
            Paid Project (${project.price})
          </Badge>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Project Overview */}
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription>By {project.companyName}</CardDescription>
                </div>
                {submission && (
                  <div>
                    {submission.status === 'submitted' && (
                      <Badge className="bg-blue-100 text-blue-700">Submitted</Badge>
                    )}
                    {submission.status === 'approved' && project.isPaid && 
                     (submission.paymentStatus === 'pending' || submission.paymentStatus === 'failed') && (
                      <Badge className="bg-yellow-100 text-yellow-700">Payment Pending</Badge>
                    )}
                    {submission.status === 'approved' && project.isPaid && submission.paymentStatus === 'paid' && (
                      <Badge className="bg-green-100 text-green-700">Payment Received</Badge>
                    )}
                    {submission.status === 'approved' && !project.isPaid && (
                      <Badge className="bg-green-100 text-green-700">Approved</Badge>
                    )}
                    {submission.status === 'rejected' && (
                      <Badge className="bg-red-100 text-red-700">Rejected</Badge>
                    )}
                    {submission.status === 'pending' && submission.quizPassed && (
                      <Badge className="bg-yellow-100 text-yellow-700">Quiz Passed</Badge>
                    )}
                    {submission.status === 'pending' && !submission.quizPassed && (
                      <Badge className="bg-yellow-100 text-yellow-700">Quiz Failed</Badge>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-6">{project.description}</p>
              
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold">Requirements</h3>
                <ul className="list-disc pl-6 space-y-1">
                  {project.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              {/* Payment Information for Paid Projects */}
              {project.isPaid && (
                <div className="p-4 rounded-md bg-purple-50 mb-6">
                  <h3 className="font-semibold mb-2 flex items-center text-purple-800">
                    <FileText className="h-4 w-4 mr-2" /> Payment Details
                  </h3>
                  <p className="text-sm text-purple-700 mb-2">
                    This is a paid project with a reward of <span className="font-bold">${project.price}</span> upon approval.
                  </p>
                  {submission?.status === 'submitted' && (
                    <p className="text-sm text-purple-700">
                      Your project is awaiting approval. Payment will be processed after approval.
                    </p>
                  )}
                  {submission?.status === 'approved' && submission.paymentStatus === 'pending' && (
                    <div className="text-sm text-purple-700">
                      <p className="mb-2">Your project has been approved! Please provide payment details to receive your reward.</p>
                      <Button 
                        size="sm" 
                        onClick={() => setShowPaymentForm(true)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Enter Payment Details
                      </Button>
                    </div>
                  )}
                  {submission?.status === 'approved' && submission.paymentStatus === 'completed' && (
                    <div className="text-sm text-green-700">
                      <p className="flex items-center"><CheckCircle className="h-4 w-4 mr-1.5" /> Payment completed (Transaction ID: {submission.transactionId})</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Update payment information display for approved submissions */}
              {submission && submission.status === 'approved' && project.isPaid && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                  <h3 className="font-semibold text-blue-800">Payment Information</h3>
                  
                  {submission.paymentStatus === 'paid' ? (
                    <div className="mt-2">
                      <p className="flex items-center text-green-700">
                        <CheckCircle className="h-4 w-4 mr-1.5" /> 
                        Payment received! 
                        {submission.paymentMethod?.transactionId && 
                          ` (Transaction ID: ${submission.paymentMethod.transactionId})`
                        }
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="mt-2 text-sm text-blue-700">
                        {submission.paymentMethod ? (
                          "Your payment details have been submitted. You'll receive payment soon."
                        ) : (
                          "Please provide your payment details to receive your reward."
                        )}
                      </p>
                      
                      {submission.paymentMethod && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Your Payment Details:</h4>
                          <div className="mt-1 text-sm">
                            <p><span className="font-medium">Method:</span> {submission.paymentMethod.type.replace('_', ' ')}</p>
                            
                            {submission.paymentMethod.type === 'mobile_banking' && (
                              <>
                                <p><span className="font-medium">Mobile:</span> {submission.paymentMethod.mobileNumber}</p>
                                <p><span className="font-medium">Provider:</span> {submission.paymentMethod.provider}</p>
                              </>
                            )}
                            
                            {submission.paymentMethod.type === 'bank_transfer' && (
                              <>
                                <p><span className="font-medium">Bank:</span> {submission.paymentMethod.bankName}</p>
                                <p><span className="font-medium">Account:</span> {submission.paymentMethod.accountNumber}</p>
                                <p><span className="font-medium">Name:</span> {submission.paymentMethod.accountName}</p>
                              </>
                            )}
                            
                            {(submission.paymentMethod.type === 'paypal' || submission.paymentMethod.type === 'other') && 
                             submission.paymentMethod.additionalInfo && (
                              <p><span className="font-medium">Details:</span> {submission.paymentMethod.additionalInfo}</p>
                            )}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowPaymentForm(true)}
                            className="mt-2"
                          >
                            Update Payment Details
                          </Button>
                        </div>
                      )}
                      
                      {!submission.paymentMethod && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => setShowPaymentForm(true)}
                          className="mt-2"
                        >
                          Provide Payment Details
                        </Button>
                      )}
                    </>
                  )}
                </div>
              )}
              
              {submission?.feedback && (
                <div className={`p-4 rounded-md ${
                  submission.status === 'approved' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <h3 className="font-semibold mb-2 flex items-center">
                    {submission.status === 'approved' ? (
                      <><CheckCircle className="h-4 w-4 mr-2 text-green-700" /> Feedback</>
                    ) : (
                      <><XCircle className="h-4 w-4 mr-2 text-red-700" /> Feedback</>
                    )}
                  </h3>
                  <p>{submission.feedback}</p>
                </div>
              )}

              {/* Progress Tracker */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-3">Project Progress</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentTab === 'info' || submission ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    1
                  </div>
                  <div className={`h-0.5 flex-1 ${
                    submission?.quizPassed ? 'bg-blue-500' : 'bg-gray-200'
                  }`}></div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    submission?.status === 'submitted' || submission?.status === 'approved' ? 'bg-blue-500' : 'bg-gray-200'
                  }`}>
                    2
                  </div>
                  <div className={`h-0.5 flex-1 ${
                    submission?.status === 'submitted' || submission?.status === 'approved' ? 'bg-blue-500' : 'bg-gray-200'
                  }`}></div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    submission?.status === 'submitted' || submission?.status === 'approved' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    3
                  </div>
                  {project.isPaid && (
                    <>
                      <div className={`h-1 flex-1 ${
                        submission?.status === 'approved' ? 'bg-blue-500' : 'bg-gray-200'
                      }`}></div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        submission?.paymentStatus === 'paid' ? 'bg-green-500 text-white' : 
                        submission?.status === 'approved' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        4
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Learn</span>
                  <span>Quiz</span>
                  <span>Submit</span>
                  {project.isPaid && <span>Payment</span>}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Form Dialog */}
          {showPaymentForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">Enter Payment Details</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please provide your payment details to receive your reward of ${project.price}.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={paymentMethod.type}
                      onChange={(e) => setPaymentMethod({...paymentMethod, type: e.target.value as any})}
                      disabled={isSubmitting}
                    >
                      <option value="mobile_banking">Mobile Banking</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="paypal">PayPal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  {paymentMethod.type === 'mobile_banking' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="mobile-number">
                          Mobile Number
                        </label>
                        <Input
                          id="mobile-number"
                          placeholder="Enter your mobile number"
                          value={paymentMethod.mobileNumber}
                          onChange={(e) => setPaymentMethod({...paymentMethod, mobileNumber: e.target.value})}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="provider">
                          Provider
                        </label>
                        <Input
                          id="provider"
                          placeholder="E.g., bKash, Nagad, etc."
                          value={paymentMethod.provider}
                          onChange={(e) => setPaymentMethod({...paymentMethod, provider: e.target.value})}
                          disabled={isSubmitting}
                        />
                      </div>
                    </>
                  )}
                  
                  {paymentMethod.type === 'bank_transfer' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="account-number">
                          Account Number
                        </label>
                        <Input
                          id="account-number"
                          placeholder="Enter your bank account number"
                          value={paymentMethod.accountNumber}
                          onChange={(e) => setPaymentMethod({...paymentMethod, accountNumber: e.target.value})}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="account-name">
                          Account Holder Name
                        </label>
                        <Input
                          id="account-name"
                          placeholder="Enter account holder name"
                          value={paymentMethod.accountName}
                          onChange={(e) => setPaymentMethod({...paymentMethod, accountName: e.target.value})}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="bank-name">
                          Bank Name
                        </label>
                        <Input
                          id="bank-name"
                          placeholder="Enter bank name"
                          value={paymentMethod.bankName}
                          onChange={(e) => setPaymentMethod({...paymentMethod, bankName: e.target.value})}
                          disabled={isSubmitting}
                        />
                      </div>
                    </>
                  )}
                  
                  {paymentMethod.type === 'paypal' && (
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="paypal-email">
                        PayPal Email
                      </label>
                      <Input
                        id="paypal-email"
                        type="email"
                        placeholder="Enter your PayPal email"
                        value={paymentMethod.additionalInfo}
                        onChange={(e) => setPaymentMethod({...paymentMethod, additionalInfo: e.target.value})}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                  
                  {paymentMethod.type === 'other' && (
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="additional-info">
                        Payment Details
                      </label>
                      <textarea
                        id="additional-info"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        rows={4}
                        placeholder="Enter your payment details"
                        value={paymentMethod.additionalInfo}
                        onChange={(e) => setPaymentMethod({...paymentMethod, additionalInfo: e.target.value})}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPaymentForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitPayment}
                    disabled={isSubmitting || (
                      (paymentMethod.type === 'mobile_banking' && (!paymentMethod.mobileNumber || !paymentMethod.provider)) ||
                      (paymentMethod.type === 'bank_transfer' && (!paymentMethod.accountNumber || !paymentMethod.accountName || !paymentMethod.bankName)) ||
                      (paymentMethod.type === 'paypal' && !paymentMethod.additionalInfo) ||
                      (paymentMethod.type === 'other' && !paymentMethod.additionalInfo)
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Payment Details'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right column - Project Workflow */}
        <div className="w-full md:w-1/3">
          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">
                <BookOpen className="h-4 w-4 mr-1.5" />
                Learn
              </TabsTrigger>
              <TabsTrigger value="quiz" disabled={submission?.status === 'submitted' || submission?.status === 'approved'}>
                <ClipboardCheck className="h-4 w-4 mr-1.5" />
                Quiz
              </TabsTrigger>
              <TabsTrigger value="submit" disabled={!(submission?.quizPassed) || submission?.status === 'submitted' || submission?.status === 'approved'}>
                <Upload className="h-4 w-4 mr-1.5" />
                Submit
              </TabsTrigger>
            </TabsList>
            
            {/* Learning Content Tab */}
            <TabsContent value="info" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Courses & Resources</CardTitle>
                  <CardDescription>
                    Learn the necessary skills before taking the quiz
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Accordion type="single" collapsible className="w-full">
                    {project.courses.map((course, index) => (
                      <AccordionItem key={index} value={`course-${index}`}>
                        <AccordionTrigger className="px-6">
                          {course.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pt-2">
                          <p className="mb-4">{course.description}</p>
                          {course.resources.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Resources:</h4>
                              <ul className="space-y-2">
                                {course.resources.map((resource, resourceIndex) => (
                                  <li key={resourceIndex} className="flex items-center">
                                    <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                                    <a 
                                      href={resource} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline break-all"
                                    >
                                      {resource}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {submission?.quizPassed ? (
                    <div className="text-sm text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      Quiz passed with {submission.quizScore}%
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Complete the quiz to continue
                    </div>
                  )}
                  <Button 
                    variant={submission?.quizPassed ? "outline" : "default"}
                    onClick={() => setCurrentTab('quiz')}
                    disabled={submission?.status === 'submitted' || submission?.status === 'approved'}
                  >
                    {submission?.quizPassed ? 'Retake Quiz' : 'Take Quiz'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Quiz Tab */}
            <TabsContent value="quiz" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Project Quiz</CardTitle>
                  <CardDescription>
                    You must score at least 70% to proceed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {project.quiz.map((questionItem, questionIndex) => (
                      <div key={questionIndex} className="space-y-3">
                        <h3 className="font-medium">
                          {questionIndex + 1}. {questionItem.question}
                        </h3>
                        <div className="space-y-2 pl-6">
                          {questionItem.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center">
                              <input
                                type="radio"
                                id={`q${questionIndex}-o${optionIndex}`}
                                name={`question-${questionIndex}`}
                                className="h-4 w-4 rounded-full border-gray-300"
                                checked={quizAnswers[questionIndex] === optionIndex}
                                onChange={() => handleQuizAnswerSelect(questionIndex, optionIndex)}
                                disabled={isSubmitting}
                              />
                              <label
                                htmlFor={`q${questionIndex}-o${optionIndex}`}
                                className="ml-2 text-sm"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                        {questionIndex < project.quiz.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentTab('info')}
                    disabled={isSubmitting}
                  >
                    Back to Courses
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={isSubmitting || quizAnswers.includes(-1)}>
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Quiz'
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Submit Quiz Answers?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to submit your answers? You can retake the quiz later if needed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmitQuiz}>Submit</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Submit Project Tab */}
            <TabsContent value="submit" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Submit Your Work</CardTitle>
                  <CardDescription>
                    {submission?.status === 'submitted' 
                      ? 'Your submission is being reviewed'
                      : 'Provide a link to your project repository or upload files'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!submission?.quizPassed && (
                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
                      <p className="font-medium">Quiz Not Passed</p>
                      <p className="mt-1 text-sm">You must pass the quiz before submitting your project.</p>
                      <Button 
                        className="mt-2" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentTab('quiz')}
                      >
                        Go to Quiz
                      </Button>
                    </div>
                  )}
                  
                  {submission?.status === 'submitted' || submission?.status === 'approved' ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 text-blue-800 rounded-md">
                        <p className="font-medium">Submission Information</p>
                        <ul className="mt-2 space-y-2">
                          {submission.githubLink && (
                            <li className="flex items-center">
                              <Github className="h-4 w-4 mr-2" />
                              <a 
                                href={submission.githubLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                GitHub Repository
                              </a>
                            </li>
                          )}
                          {submission.zipFileUrl && (
                            <li className="flex items-center">
                              <FileArchive className="h-4 w-4 mr-2" />
                              <a 
                                href={submission.zipFileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Project Files
                              </a>
                            </li>
                          )}
                          {project.isPaid && submission.paymentStatus && (
                            <li className="flex items-center mt-3 pt-3 border-t">
                              {submission.paymentStatus === 'completed' ? (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Payment completed (Transaction ID: {submission.transactionId})
                                </div>
                              ) : submission.status === 'approved' ? (
                                <div>
                                  <p className="text-yellow-600 flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Payment pending
                                  </p>
                                  <Button 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => setShowPaymentForm(true)}
                                  >
                                    Enter Payment Details
                                  </Button>
                                </div>
                              ) : (
                                <p className="text-blue-600 flex items-center">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Payment will be processed after approval
                                </p>
                              )}
                            </li>
                          )}
                        </ul>
                      </div>
                      <p className="text-sm">
                        {submission.status === 'submitted' 
                          ? 'Your project has been submitted and is awaiting review.'
                          : 'Your project has been approved. Congratulations!'}
                      </p>
                    </div>
                  ) : submission?.quizPassed && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="github-link">
                          GitHub Repository URL
                        </label>
                        <Input
                          id="github-link"
                          placeholder="https://github.com/yourusername/repository"
                          value={githubLink}
                          onChange={(e) => setGithubLink(e.target.value)}
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Share a public GitHub repository with your project code
                        </p>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <span className="mx-4">OR</span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="file-url">
                          Project Files URL
                        </label>
                        <Input
                          id="file-url"
                          placeholder="https://drive.google.com/file/d/..."
                          value={zipFileUrl}
                          onChange={(e) => setZipFileUrl(e.target.value)}
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Share a link to your project files (Google Drive, Dropbox, etc.)
                        </p>
                      </div>
                      
                      {project.isPaid && (
                        <div className="p-3 bg-purple-50 text-purple-800 rounded-md mt-3">
                          <p className="text-sm font-medium">
                            This is a paid project (${project.price})
                          </p>
                          <p className="text-xs mt-1">
                            After submission and approval, you'll be prompted to provide payment details.
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">
                          Provide at least one of the above. Make sure your repository or files are publicly accessible.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentTab('quiz')}
                    disabled={isSubmitting || submission?.status === 'submitted' || submission?.status === 'approved'}
                  >
                    Back to Quiz
                  </Button>
                  
                  {submission?.quizPassed && submission?.status !== 'submitted' && submission?.status !== 'approved' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          disabled={isSubmitting || (!githubLink && !zipFileUrl)}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Project'
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Submit Your Project?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to submit your project? After submission, it will be reviewed by the company.
                            {project.isPaid && (
                              <div className="mt-2 p-2 bg-purple-50 text-purple-800 rounded">
                                This is a paid project. After approval, you'll need to provide payment details to receive your reward of ${project.price}.
                              </div>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleSubmitProject}>Submit</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 