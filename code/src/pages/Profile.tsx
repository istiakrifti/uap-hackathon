
import React from 'react';
import { User, Award, BookOpen, FileText, Clock, Mail, Globe, MapPin, Briefcase } from 'lucide-react';
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

const Profile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Profile Card */}
        <div className="w-full md:w-80 flex-shrink-0">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-24 h-24 rounded-full bg-platformBlue text-white grid place-items-center mb-2">
                <span className="text-3xl font-semibold">JS</span>
              </div>
              <CardTitle>John Smith</CardTitle>
              <CardDescription>
                Front-End Developer
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>john.smith@example.com</span>
                </div>
                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>johnsmith.dev</span>
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
              <Button className="w-full">Edit Profile</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="badges">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="badges">
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4" />
                  <span>Badges</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="projects">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>Projects</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="activity">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Activity</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
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
            
            {/* Projects Tab */}
            <TabsContent value="projects">
              <h2 className="text-lg font-semibold mb-4">Project History</h2>
              <div className="space-y-4">
                {[
                  { 
                    title: "E-commerce Dashboard", 
                    status: "Completed", 
                    date: "Dec 2023", 
                    description: "Built a responsive admin dashboard with React and Chart.js" 
                  },
                  { 
                    title: "User Authentication System", 
                    status: "Completed", 
                    date: "Oct 2023",
                    description: "Implemented secure login with JWT and bcrypt" 
                  },
                  { 
                    title: "Real-time Chat App", 
                    status: "In Progress", 
                    date: "Current",
                    description: "Building a chat application with Socket.io and React" 
                  },
                ].map((project, index) => (
                  <div key={index} className="p-4 bg-white border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-xs text-muted-foreground">{project.date}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={project.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm">{project.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Activity Tab */}
            <TabsContent value="activity">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="bg-white border rounded-lg">
                <div className="p-4 border-b">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm">Earned Badge: CSS Wizard</h3>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Completed all CSS-related quizzes with 90%+ scores
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-b">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm">Started Project: Real-time Chat App</h3>
                        <span className="text-xs text-muted-foreground">5 days ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        New project focused on building a chat application with Socket.io
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-b">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm">Completed Quiz: Advanced JavaScript</h3>
                        <span className="text-xs text-muted-foreground">1 week ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Scored 85% on the Advanced JavaScript concepts quiz
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm">Completed Project: User Authentication</h3>
                        <span className="text-xs text-muted-foreground">2 weeks ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Successfully implemented and submitted the user authentication project
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
