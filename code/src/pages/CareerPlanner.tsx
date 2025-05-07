
import React from 'react';
import { Brain, BookOpen, Award, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const CareerPlanner: React.FC = () => {
  const skills = [
    { name: 'JavaScript', level: 80 },
    { name: 'React', level: 75 },
    { name: 'Node.js', level: 60 },
    { name: 'HTML/CSS', level: 90 },
    { name: 'SQL', level: 65 },
    { name: 'Git', level: 70 },
    { name: 'TypeScript', level: 55 },
    { name: 'Testing', level: 40 },
  ];
  
  const recommendations = [
    {
      id: '1',
      role: 'Front-End Developer',
      company: 'Tech Innovators Inc.',
      match: 85,
      description: 'Based on your strong React and JavaScript skills, you\'d be a great fit for this front-end role.',
      requiredSkills: [
        { name: 'JavaScript', current: 80, required: 70 },
        { name: 'React', current: 75, required: 80 },
        { name: 'HTML/CSS', current: 90, required: 75 },
        { name: 'TypeScript', current: 55, required: 65 },
      ],
    },
    {
      id: '2',
      role: 'Full-Stack Developer',
      company: 'Growth Startup',
      match: 70,
      description: 'Your combination of front-end and back-end skills makes you a good candidate for this full-stack position.',
      requiredSkills: [
        { name: 'JavaScript', current: 80, required: 70 },
        { name: 'React', current: 75, required: 70 },
        { name: 'Node.js', current: 60, required: 75 },
        { name: 'SQL', current: 65, required: 70 },
      ],
    },
    {
      id: '3',
      role: 'React Developer',
      company: 'Established Enterprise',
      match: 80,
      description: 'Your React expertise and front-end skills align well with this specialized React developer position.',
      requiredSkills: [
        { name: 'React', current: 75, required: 80 },
        { name: 'JavaScript', current: 80, required: 75 },
        { name: 'TypeScript', current: 55, required: 70 },
        { name: 'Testing', current: 40, required: 60 },
      ],
    }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-6">Career Planner</h1>
      
      {/* Skills Summary */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-platformBlue" />
          <h2 className="text-lg font-semibold">Your Skills Profile</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <Badge key={skill.name} variant="outline" className="px-3 py-1 bg-platformBlue/5">
                  {skill.name}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              Based on your completed projects, quizzes, and self-assessment, we've identified these key skills in your profile.
            </p>
          </div>
          
          <div className="space-y-3">
            {skills.slice(0, 4).map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{skill.name}</span>
                  <span className="font-medium">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* AI Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-5 w-5 text-platformBlue" />
          <h2 className="text-lg font-semibold">AI Career Recommendations</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="border shadow-sm bg-white">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{recommendation.role}</CardTitle>
                    <CardDescription>{recommendation.company}</CardDescription>
                  </div>
                  <Badge className="bg-platformBlue text-white">
                    {recommendation.match}% Match
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground mb-4">{recommendation.description}</p>
                
                <h4 className="text-sm font-medium mb-3">Skill Comparison</h4>
                <div className="space-y-2.5">
                  {recommendation.requiredSkills.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>{skill.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={skill.current >= skill.required ? "text-green-600" : "text-amber-600"}>
                            You: {skill.current}%
                          </span>
                          <span className="text-muted-foreground">
                            Required: {skill.required}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-platformBlue"
                          style={{ width: `${skill.current}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <span className="flex items-center">
                    Add to Learning Path
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Learning Recommendations */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-platformBlue" />
          <h2 className="text-lg font-semibold">Recommended Learning</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">TypeScript Fundamentals</h3>
                <p className="text-xs text-muted-foreground">Improve your TypeScript skills to enhance job prospects</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">React Testing Library</h3>
                <p className="text-xs text-muted-foreground">Learn how to write effective tests for React components</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-green-100 text-green-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Node.js Advanced Concepts</h3>
                <p className="text-xs text-muted-foreground">Strengthen your back-end skills with advanced Node.js</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPlanner;
