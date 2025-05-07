
import React from 'react';
import { FileQuestion, Clock, Award, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Quizzes: React.FC = () => {
  const quizzes = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics, including variables, functions, and control flow.',
      questions: 20,
      timeEstimate: '30 mins',
      category: 'Web Development',
      status: 'incomplete',
      progress: 0,
    },
    {
      id: '2',
      title: 'SQL Database Queries',
      description: 'Assess your understanding of SQL queries, joins, and database design principles.',
      questions: 15,
      timeEstimate: '25 mins',
      category: 'Database',
      status: 'in-progress',
      progress: 40,
    },
    {
      id: '3',
      title: 'React Components',
      description: 'Test your knowledge of React components, props, state, and hooks.',
      questions: 25,
      timeEstimate: '45 mins',
      category: 'Front-end Development',
      status: 'complete',
      progress: 100,
      score: 85,
    },
  ];
  
  const statusStyles = {
    incomplete: {
      badge: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      icon: null,
    },
    'in-progress': {
      badge: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      icon: <Clock className="h-4 w-4 mr-1" />,
    },
    complete: {
      badge: 'bg-green-100 text-green-700 hover:bg-green-200',
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
    },
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'incomplete': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'complete': return 'Completed';
      default: return status;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quizzes</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="border shadow-sm bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold">{quiz.title}</CardTitle>
                <Badge variant="outline" className={statusStyles[quiz.status as keyof typeof statusStyles].badge}>
                  <span className="flex items-center">
                    {statusStyles[quiz.status as keyof typeof statusStyles].icon}
                    {getStatusLabel(quiz.status)}
                  </span>
                </Badge>
              </div>
              <CardDescription className="text-sm text-muted-foreground">{quiz.category}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm mb-4">{quiz.description}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span className="flex items-center">
                  <FileQuestion className="h-3.5 w-3.5 mr-1" />
                  {quiz.questions} Questions
                </span>
                <span className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {quiz.timeEstimate}
                </span>
              </div>
              
              {quiz.status !== 'incomplete' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{quiz.progress}%</span>
                  </div>
                  <Progress value={quiz.progress} className="h-1.5" />
                </div>
              )}
              
              {quiz.status === 'complete' && (
                <div className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-md mb-3">
                  <div className="flex items-center text-green-700 font-medium">
                    <Award className="h-4 w-4 mr-2" />
                    Score
                  </div>
                  <span className="text-green-700 font-bold">{quiz.score}%</span>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="pt-0">
              {quiz.status === 'incomplete' && (
                <Button className="w-full">Start Quiz</Button>
              )}
              
              {quiz.status === 'in-progress' && (
                <Button className="w-full">Resume Quiz</Button>
              )}
              
              {quiz.status === 'complete' && (
                <Button variant="outline" className="w-full">View Results</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;
