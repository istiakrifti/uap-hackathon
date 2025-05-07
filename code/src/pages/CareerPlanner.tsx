import React, { useState, useEffect } from 'react';
import { Brain, BookOpen, Award, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Skill {
  name: string;
  level: number;
}

interface RequiredSkill {
  name: string;
  current: number;
  required: number;
}

interface Recommendation {
  id: string;
  careerPath: string;
  match: number;
  description: string;
  currentSkills: RequiredSkill[];
  learningPath: LearningPath[];
}

interface LearningPath {
  title: string;
  description: string;
  priority: string;
  estimatedTime: string;
}

const CareerPlanner: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([
    
    { name: 'NodeJs', level: 80 },
    { name: 'ReactJs', level: 85 },
    { name: 'Oracle', level: 90 },
    { name: 'ExpressJs', level: 90 },
  ]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCareerData = async () => {
    try {
      setIsLoading(true);
      const API_KEY = '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';
      
      console.log('Current skills data:', JSON.stringify(skills, null, 2));
      
      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a career advisor specializing in software development career paths. Analyze the provided skills and suggest career paths along with required learning paths to achieve those career goals. Focus on career progression and skill development rather than specific job listings."
          },
          {
            role: "user",
            content: `Based on these programming skills, suggest career paths and learning recommendations:
            ${JSON.stringify(skills)}
            
            Return ONLY a JSON object with this exact structure:
            {
              "recommendations": [
                {
                  "id": "1",
                  "careerPath": "string (e.g., Full Stack Developer, AI Engineer, etc.)",
                  "match": number,
                  "description": "string (explaining why this path matches their skills)",
                  "currentSkills": [
                    {
                      "name": "string",
                      "current": number,
                      "required": number
                    }
                  ],
                  "learningPath": [
                    {
                      "title": "string",
                      "description": "string",
                      "priority": "high|medium|low",
                      "estimatedTime": "string (e.g., '2-3 months')"
                    }
                  ]
                }
              ]
            }`
          }
        ],
        temperature: 0.7
      };

      console.log('Sending request to OpenAI API:', requestBody);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('Parsed API Response:', data);

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      try {
        const parsedData = JSON.parse(data.choices[0].message.content);
        console.log('Parsed Recommendations:', parsedData);

        if (!parsedData.recommendations) {
          throw new Error('Invalid recommendations data structure');
        }

        setRecommendations(parsedData.recommendations);
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        throw new Error('Failed to parse API response as JSON');
      }
    } catch (error) {
      console.error('Detailed error:', error);
      // Fallback to dummy data in case of error
      setRecommendations([
        {
          id: '1',
          careerPath: 'AI/ML Engineer',
          match: 90,
          description: 'Your strong foundation in AI, ML, and Deep Learning makes you well-suited for an AI/ML Engineer career path.',
          currentSkills: [
            { name: 'AI', current: 80, required: 75 },
            { name: 'ML', current: 85, required: 80 },
            { name: 'Deep Learning', current: 90, required: 85 },
            { name: 'Algorithm', current: 90, required: 80 },
          ],
          learningPath: [
            {
              title: 'Advanced Deep Learning',
              description: 'Master advanced neural network architectures and training techniques',
              priority: 'high',
              estimatedTime: '3-4 months'
            },
            {
              title: 'MLOps',
              description: 'Learn to deploy and maintain ML models in production',
              priority: 'medium',
              estimatedTime: '2-3 months'
            },
            {
              title: 'Research Methods',
              description: 'Develop skills in ML research and paper implementation',
              priority: 'medium',
              estimatedTime: '3-4 months'
            }
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchCareerData when skills change
  useEffect(() => {
    if (skills.length > 0) {
      fetchCareerData();
    }
  }, [skills]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-platformBlue mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading career recommendations...</p>
        </div>
      </div>
    );
  }

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
      
      {/* Career Path Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-5 w-5 text-platformBlue" />
          <h2 className="text-lg font-semibold">Career Path Recommendations</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="border shadow-sm bg-white">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{recommendation.careerPath}</CardTitle>
                    <CardDescription>{recommendation.description}</CardDescription>
                  </div>
                  <Badge className="bg-platformBlue text-white">
                    {recommendation.match}% Match
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <h4 className="text-sm font-medium mb-3">Skill Comparison</h4>
                <div className="space-y-2.5">
                  {recommendation.currentSkills.map((skill) => (
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
            </Card>
          ))}
        </div>
      </div>
      
      {/* Learning Recommendations */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-platformBlue" />
          <h2 className="text-lg font-semibold">Recommended Learning Path</h2>
        </div>
        
        <div className="space-y-4">
          {recommendations[0]?.learningPath.map((learning) => (
            <div key={learning.title} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                  learning.priority === 'high' ? 'bg-red-100 text-red-600' :
                  learning.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{learning.title}</h3>
                  <p className="text-xs text-muted-foreground">{learning.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Priority: {learning.priority} • Time: {learning.estimatedTime}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerPlanner;
