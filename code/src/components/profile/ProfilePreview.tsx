import React from 'react';
import { ProfileData } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, Globe, MapPin, Briefcase, 
  FileText, GraduationCap, Calendar,
  Link as LinkIcon
} from 'lucide-react';

interface ProfilePreviewProps {
  profileData: ProfileData;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({ profileData }) => {
  const { personalInfo, skills, experience, education, projects, documents } = profileData;

  return (
    <div className="space-y-8">
      {/* Header Section with Avatar and Basic Info */}
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Avatar className="w-32 h-32">
          {personalInfo.avatarUrl ? (
            <AvatarImage src={personalInfo.avatarUrl} />
          ) : (
            <AvatarFallback>
              {personalInfo.fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">{personalInfo.fullName}</h2>
          <p className="text-lg text-muted-foreground mb-2">{personalInfo.title}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{personalInfo.email}</span>
            </div>
            {personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={personalInfo.website} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{personalInfo.location}</span>
            </div>
          </div>
          
          <p className="text-sm max-w-2xl">{personalInfo.bio}</p>
        </div>
      </div>
      
      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Technical', 'Soft Skills', 'Languages', 'Tools', 'Other'].map(category => {
              const categorySkills = skills.filter(skill => skill.category === category);
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category} className="space-y-2">
                  <h3 className="text-sm font-semibold">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map(skill => (
                      <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
                        {skill.name}
                        <span className="w-2 h-2 rounded-full bg-primary ml-1" 
                          title={`${skill.level}`}/>
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Experience Section */}
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {experience.map(exp => (
              <div key={exp.id} className="border-l-2 border-muted pl-4 pb-4 relative">
                <div className="w-3 h-3 rounded-full bg-primary absolute -left-[7px] top-0" />
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">
                  <h3 className="font-medium">{exp.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                      {exp.current ? ' Present' : 
                        new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm mb-2">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{exp.company}</span>
                  {exp.location && (
                    <>
                      <span className="mx-1">•</span>
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{exp.location}</span>
                    </>
                  )}
                </div>
                <p className="text-sm">{exp.description}</p>
              </div>
            ))}
            
            {experience.length === 0 && (
              <p className="text-sm text-muted-foreground">No experience added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Education Section */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {education.map(edu => (
              <div key={edu.id} className="border-l-2 border-muted pl-4 pb-4 relative">
                <div className="w-3 h-3 rounded-full bg-primary absolute -left-[7px] top-0" />
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">
                  <h3 className="font-medium">{edu.degree}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                      {edu.current ? ' Present' : 
                        new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm mb-2">
                  <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{edu.institution}</span>
                  {edu.verified && (
                    <Badge variant="outline" className="ml-2 text-xs py-0 h-5 bg-green-50 text-green-700">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm">{edu.description}</p>
                {edu.certificateUrl && (
                  <a 
                    href={edu.certificateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-2"
                  >
                    <FileText className="h-3 w-3" />
                    View Certificate
                  </a>
                )}
              </div>
            ))}
            
            {education.length === 0 && (
              <p className="text-sm text-muted-foreground">No education added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <div key={project.id} className="border rounded-lg overflow-hidden">
                {project.imageUrl && (
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{project.title}</h3>
                    {project.featured && (
                      <Badge variant="secondary" className="bg-primary/10">Featured</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.role}</p>
                  <p className="text-sm mb-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      View Project
                    </a>
                  )}
                </div>
              </div>
            ))}
            
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2">No projects added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.uploadDate).toLocaleDateString()} • 
                      {(doc.size / 1024 / 1024).toFixed(2)} MB • 
                      Version {doc.version}
                    </p>
                  </div>
                </div>
                <a 
                  href={doc.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View
                </a>
              </div>
            ))}
            
            {documents.length === 0 && (
              <p className="text-sm text-muted-foreground">No documents added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 