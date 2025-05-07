
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Building, Mail, Globe, MapPin, Briefcase, Plus, Users } from 'lucide-react';
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

// Mock data - in a real app this would come from API
const mockProjects = [
  {
    id: '1',
    title: 'E-commerce Product Recommendation Engine',
    description: 'Build a recommendation system for products using collaborative filtering',
    status: 'Active',
    domain: 'Machine Learning',
    applicants: 12,
    mentors: ['Jane Smith', 'Robert Johnson']
  },
  {
    id: '2',
    title: 'Mobile Payment Integration for iOS',
    description: 'Implement Apple Pay and Google Pay integrations for an existing app',
    status: 'Active',
    domain: 'Mobile Development',
    applicants: 8,
    mentors: ['Michael Chang']
  },
  {
    id: '3',
    title: 'API Gateway Implementation',
    description: 'Design and implement an API gateway using AWS API Gateway and Lambda',
    status: 'Completed',
    domain: 'Cloud Architecture',
    applicants: 15,
    mentors: ['Sarah Wilson', 'David Moore']
  },
];

const IndustryProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading profile...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Company Profile Card */}
        <div className="w-full md:w-80 flex-shrink-0">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-24 h-24 rounded-full bg-blue-100 text-platformBlue grid place-items-center mb-2">
                <Building className="h-12 w-12" />
              </div>
              <CardTitle>{user.company || 'Company Name'}</CardTitle>
              <CardDescription>
                {user.industry || 'Technology'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Contact: {user.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>company-website.com</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'Node.js', 'AWS', 'MongoDB', 'TypeScript'].map(tech => (
                    <Badge key={tech} variant="outline" className="bg-blue-50">{tech}</Badge>
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
          <Tabs defaultValue="projects">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="projects">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  <span>Mini-Projects</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="stats">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>Talent Statistics</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Mini-Projects</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add Project
                </Button>
              </div>
              
              <div className="space-y-4">
                {mockProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription>{project.domain}</CardDescription>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={project.status === "Active" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="font-medium">Applicants:</span> {project.applicants}
                        </div>
                        <div>
                          <span className="font-medium">Mentors:</span> {project.mentors.join(', ')}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button size="sm">Manage</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
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
                        <div className="w-10 h-10 rounded-full bg-platformBlue text-white grid place-items-center">
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
      </div>
    </div>
  );
};

export default IndustryProfile;
