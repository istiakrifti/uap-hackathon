
import React from 'react';
import { BookOpen, FileText, FileQuestion, CheckCircle, AlertCircle, Brain } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed, { ActivityItem } from '@/components/dashboard/ActivityFeed';
import ActionCard from '@/components/dashboard/ActionCard';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock activity data
  const activityItems: ActivityItem[] = [
    {
      id: '1',
      title: 'Quiz Completed',
      description: 'You completed the "JavaScript Fundamentals" quiz with 85% score.',
      timestamp: '2 hours ago',
      icon: <CheckCircle className="h-5 w-5" />,
      type: 'success',
    },
    {
      id: '2',
      title: 'New Project Invitation',
      description: 'You received an invitation to join the "E-commerce API" project.',
      timestamp: 'Yesterday',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: '3',
      title: 'Badge Earned',
      description: 'You earned the "React Master" badge for completing 5 React projects.',
      timestamp: '2 days ago',
      icon: <CheckCircle className="h-5 w-5" />,
      type: 'success',
    },
    {
      id: '4',
      title: 'Career Path Update',
      description: 'Your career path has been updated with new recommendations.',
      timestamp: '3 days ago',
      icon: <AlertCircle className="h-5 w-5" />,
      type: 'warning',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Welcome back, John!</h1>
      
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Projects in Progress" 
          value="3" 
          icon={<FileText className="h-5 w-5" />} 
          change={{ value: "2", positive: true }}
        />
        <StatCard 
          title="Quizzes Pending" 
          value="5" 
          icon={<FileQuestion className="h-5 w-5" />}
        />
        <StatCard 
          title="Badges Earned" 
          value="12" 
          icon={<CheckCircle className="h-5 w-5" />}
          change={{ value: "3", positive: true }}
        />
      </div>
      
      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed items={activityItems} />
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-6">
          <ActionCard 
            title="Start a New Quiz" 
            description="Test your knowledge with our latest quizzes" 
            icon={<FileQuestion className="h-6 w-6" />}
            buttonText="Browse Quizzes"
            onClick={() => navigate('/quizzes')}
          />
          
          <ActionCard 
            title="Explore Career Path" 
            description="View AI-recommended career paths based on your skills" 
            icon={<Brain className="h-6 w-6" />}
            buttonText="View Recommendations"
            onClick={() => navigate('/career-planner')}
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
