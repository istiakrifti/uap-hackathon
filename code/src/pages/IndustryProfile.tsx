import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Building, Mail, Globe, MapPin, Users } from 'lucide-react';
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

const IndustryProfile = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log('IndustryProfile component mounted');
    console.log('User role:', user?.role);
  }, [user]);

  if (!user) {
    return <div>Loading profile...</div>;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Company Profile</h1>
      
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
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Account Type</p>
              <p className="text-sm text-muted-foreground">Industry / Employer</p>
            </div>
            <div>
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">January 2023</p>
            </div>
            <div>
              <p className="text-sm font-medium">Subscription</p>
              <p className="text-sm text-muted-foreground">Pro Plan</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Manage Subscription</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default IndustryProfile;
