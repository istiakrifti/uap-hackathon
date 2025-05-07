import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ExternalLink, CheckCircle, XCircle, DollarSign, CreditCard } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Project {
  _id: string;
  title: string;
  companyName: string;
  isPaid?: boolean;
  paymentAmount?: number;
  currency?: string;
}

interface Submission {
  _id: string;
  projectId: string;
  userId: string;
  userName: string;
  quizResults: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  quizScore: number;
  quizPassed: boolean;
  projectLink: string;
  githubLink?: string;
  zipFileUrl?: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  feedback?: string;
  isPaid?: boolean;
  paymentAmount?: number;
  paymentStatus?: 'pending' | 'paid' | 'failed';
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
  createdAt: string;
  updatedAt: string;
}

const ProjectSubmissions = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  // For review dialog
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected'>('approved');
  const [feedback, setFeedback] = useState('');
  const [reviewTransactionId, setReviewTransactionId] = useState('');
  
  // For payment dialog
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'failed' | 'pending'>('paid');
  const [paymentNote, setPaymentNote] = useState('');
  
  useEffect(() => {
    fetchProjectAndSubmissions();
  }, [projectId]);
  
  const fetchProjectAndSubmissions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('platformConnectToken');
      
      // Fetch project
      const projectResponse = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        setProject(projectData.project);
      } else {
        toast.error('Failed to fetch project');
        navigate('/projects');
        return;
      }
      
      // Fetch submissions
      const submissionsResponse = await fetch(`http://localhost:5000/api/projects/${projectId}/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (submissionsResponse.ok) {
        const data = await submissionsResponse.json();
        setSubmissions(data.submissions);
      } else {
        toast.error('Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReviewClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setReviewStatus(submission.status === 'approved' ? 'approved' : 'rejected');
    setFeedback(submission.feedback || '');
    setReviewTransactionId('');
    setIsReviewDialogOpen(true);
  };
  
  const handleReviewSubmit = async () => {
    if (!selectedSubmission) return;
    
    const isPaidProject = project?.isPaid;
    if (isPaidProject && reviewStatus === 'approved' && !reviewTransactionId) {
      toast.error('Transaction ID is required when approving paid projects');
      return;
    }
    
    try {
      const token = localStorage.getItem('platformConnectToken');
      const response = await fetch(`http://localhost:5000/api/projects/submissions/${selectedSubmission._id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: reviewStatus,
          feedback,
          ...(isPaidProject && reviewStatus === 'approved' && { 
            paymentStatus: 'paid',
            transactionId: reviewTransactionId 
          })
        })
      });
      
      if (response.ok) {
        toast.success(`Submission ${reviewStatus} successfully`);
        // Refresh submissions
        fetchProjectAndSubmissions();
        setIsReviewDialogOpen(false);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update submission');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Error updating submission');
    }
  };
  
  // Handler for opening payment dialog
  const handlePaymentClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setTransactionId('');
    setPaymentStatus('paid');
    setPaymentNote('');
    setIsPaymentDialogOpen(true);
  };
  
  // Handler for processing payment
  const handleProcessPayment = async () => {
    if (!selectedSubmission) return;
    
    if (paymentStatus === 'paid' && !transactionId) {
      toast.error('Transaction ID is required for completed payments');
      return;
    }
    
    try {
      const token = localStorage.getItem('platformConnectToken');
      const response = await fetch(`http://localhost:5000/api/projects/submissions/${selectedSubmission._id}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentStatus,
          transactionId,
          additionalInfo: paymentNote
        })
      });
      
      if (response.ok) {
        toast.success(`Payment ${paymentStatus === 'paid' ? 'processed' : 'status updated'} successfully`);
        // Refresh submissions
        fetchProjectAndSubmissions();
        setIsPaymentDialogOpen(false);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Error processing payment');
    }
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="outline">Submitted</Badge>;
      case 'approved':
        return <Badge variant="success" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };
  
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
          Back to Projects
        </Button>
      </div>
      
      {project && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{project.title} - Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Review and manage submissions for this project.
            </p>
          </CardContent>
        </Card>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No submissions found for this project yet.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableCaption>Project submissions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Quiz Score</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {submission.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{submission.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {submission.quizScore}% {submission.quizPassed && <CheckCircle className="h-4 w-4 inline text-green-500 ml-1" />}
                    </TableCell>
                    <TableCell>{new Date(submission.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      {project?.isPaid ? (
                        <>
                          {submission.paymentStatus === 'paid' ? (
                            <Badge className="bg-green-100 text-green-800">Paid</Badge>
                          ) : submission.paymentStatus === 'failed' ? (
                            <Badge className="bg-red-100 text-red-800">Failed</Badge>
                          ) : submission.status === 'approved' ? (
                            <Badge className="bg-yellow-100 text-yellow-800">Pending Payment</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Awaiting Approval</Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReviewClick(submission)}
                        >
                          Review
                        </Button>
                        
                        {project?.isPaid && submission.status === 'approved' && 
                         submission.paymentMethod && 
                         (submission.paymentStatus !== 'paid') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            onClick={() => handlePaymentClick(submission)}
                          >
                            <DollarSign className="h-3 w-3 mr-1" /> Process Payment
                          </Button>
                        )}
                        
                        {submission.githubLink && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(submission.githubLink, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" /> GitHub
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>
              Review the user's work and provide feedback.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Review Status</p>
              <Select value={reviewStatus} onValueChange={(value: 'approved' | 'rejected') => setReviewStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {project?.isPaid && reviewStatus === 'approved' && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Transaction ID</p>
                <Input
                  placeholder="Enter payment transaction ID"
                  value={reviewTransactionId}
                  onChange={(e) => setReviewTransactionId(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Required for paid projects to process payment automatically when approving.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Feedback</p>
              <Textarea 
                placeholder="Provide feedback to the user" 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleReviewSubmit}
              className={reviewStatus === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
              disabled={project?.isPaid && reviewStatus === 'approved' && !reviewTransactionId}
            >
              {reviewStatus === 'approved' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {reviewStatus === 'approved' ? 'Approve Submission' : 'Reject Submission'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Process payment for {selectedSubmission?.userName}'s submission.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Payment Method Information */}
            {selectedSubmission?.paymentMethod && (
              <div className="space-y-2 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800">Payment Details Provided:</p>
                <div className="text-sm space-y-1 text-blue-800">
                  <p><span className="font-medium">Method:</span> {selectedSubmission.paymentMethod.type.replace('_', ' ')}</p>
                  
                  {selectedSubmission.paymentMethod.type === 'mobile_banking' && (
                    <>
                      <p><span className="font-medium">Mobile:</span> {selectedSubmission.paymentMethod.mobileNumber}</p>
                      <p><span className="font-medium">Provider:</span> {selectedSubmission.paymentMethod.provider}</p>
                    </>
                  )}
                  
                  {selectedSubmission.paymentMethod.type === 'bank_transfer' && (
                    <>
                      <p><span className="font-medium">Bank:</span> {selectedSubmission.paymentMethod.bankName}</p>
                      <p><span className="font-medium">Account:</span> {selectedSubmission.paymentMethod.accountNumber}</p>
                      <p><span className="font-medium">Name:</span> {selectedSubmission.paymentMethod.accountName}</p>
                    </>
                  )}
                  
                  {(selectedSubmission.paymentMethod.type === 'paypal' || selectedSubmission.paymentMethod.type === 'other') && 
                   selectedSubmission.paymentMethod.additionalInfo && (
                    <p><span className="font-medium">Details:</span> {selectedSubmission.paymentMethod.additionalInfo}</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Status</p>
              <Select value={paymentStatus} onValueChange={(value: 'paid' | 'failed' | 'pending') => setPaymentStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Transaction ID</p>
              <p className="text-xs text-muted-foreground">Required when marking as paid</p>
              <Input 
                placeholder="Enter payment transaction ID" 
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Note (Optional)</p>
              <Textarea 
                placeholder="Add any additional payment notes" 
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleProcessPayment}
              className={paymentStatus === 'paid' ? 'bg-green-600 hover:bg-green-700' : ''}
              disabled={paymentStatus === 'paid' && !transactionId}
            >
              {paymentStatus === 'paid' ? (
                <><DollarSign className="h-4 w-4 mr-2" /> Process Payment</>
              ) : paymentStatus === 'failed' ? (
                <><XCircle className="h-4 w-4 mr-2" /> Mark as Failed</>
              ) : (
                <><CreditCard className="h-4 w-4 mr-2" /> Mark as Pending</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectSubmissions; 