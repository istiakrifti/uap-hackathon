import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, Plus, Upload, Link as LinkIcon,
  Star, StarOff, X
} from 'lucide-react';
import { Project } from '@/types/profile';

interface ProjectsTabProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, onUpdate }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    role: '',
    technologies: [],
    featured: false
  });
  const [tempTechnology, setTempTechnology] = useState('');

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) return;

    const projectItem: Project = {
      id: Date.now().toString(),
      title: newProject.title!,
      description: newProject.description!,
      role: newProject.role || '',
      technologies: newProject.technologies || [],
      featured: newProject.featured || false,
      link: newProject.link || '',
      imageUrl: newProject.imageUrl || ''
    };

    onUpdate([...projects, projectItem]);
    setNewProject({
      title: '',
      description: '',
      role: '',
      technologies: [],
      featured: false
    });
    setIsAddingNew(false);
  };

  const handleProjectChange = (id: string, field: keyof Project, value: any) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    );
    onUpdate(updatedProjects);
  };

  const handleRemoveProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    onUpdate(updatedProjects);
  };

  const handleAddTechnology = (projectId?: string) => {
    if (!tempTechnology.trim()) return;

    if (projectId) {
      // Add to existing project
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            technologies: [...project.technologies, tempTechnology.trim()]
          };
        }
        return project;
      });
      onUpdate(updatedProjects);
    } else {
      // Add to new project form
      setNewProject({
        ...newProject,
        technologies: [...(newProject.technologies || []), tempTechnology.trim()]
      });
    }

    setTempTechnology('');
  };

  const handleRemoveTechnology = (projectId: string | undefined, techIndex: number) => {
    if (projectId) {
      // Remove from existing project
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          const updatedTechnologies = [...project.technologies];
          updatedTechnologies.splice(techIndex, 1);
          return {
            ...project,
            technologies: updatedTechnologies
          };
        }
        return project;
      });
      onUpdate(updatedProjects);
    } else {
      // Remove from new project form
      const updatedTechnologies = [...(newProject.technologies || [])];
      updatedTechnologies.splice(techIndex, 1);
      setNewProject({
        ...newProject,
        technologies: updatedTechnologies
      });
    }
  };

  const handleImageUpload = (id: string, file: File) => {
    // In a real application, you would upload the file to a server
    // and get back a URL for the file
    const imageUrl = URL.createObjectURL(file);
    
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, imageUrl } : project
    );
    onUpdate(updatedProjects);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Projects & Portfolio</CardTitle>
            <CardDescription>Showcase your best projects and work</CardDescription>
          </div>
          {!isAddingNew && (
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new project form */}
        {isAddingNew && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-project-title">Project Title</Label>
                <Input
                  id="new-project-title"
                  placeholder="e.g. E-commerce Website"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-project-role">Your Role</Label>
                <Input
                  id="new-project-role"
                  placeholder="e.g. Lead Developer"
                  value={newProject.role}
                  onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-project-description">Description</Label>
              <Textarea
                id="new-project-description"
                placeholder="Describe the project and your contributions"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-project-link">Project Link (Optional)</Label>
              <Input
                id="new-project-link"
                placeholder="e.g. https://myproject.com"
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. React"
                  value={tempTechnology}
                  onChange={(e) => setTempTechnology(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                />
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => handleAddTechnology()}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newProject.technologies?.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleRemoveTechnology(undefined, index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="new-project-featured"
                checked={newProject.featured}
                onCheckedChange={(checked) => setNewProject({ ...newProject, featured: checked })}
              />
              <Label htmlFor="new-project-featured">Feature this project on your profile</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>Cancel</Button>
              <Button onClick={handleAddProject}>Add Project</Button>
            </div>
          </div>
        )}

        {/* Projects list */}
        <div className="grid grid-cols-1 gap-6">
          {projects.map(project => (
            <div key={project.id} className="border rounded-lg overflow-hidden">
              <div className="relative">
                {project.imageUrl ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById(`project-image-${project.id}`)?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <input
                      id={`project-image-${project.id}`}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(project.id, e.target.files[0])}
                    />
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  onClick={() => handleProjectChange(project.id, 'featured', !project.featured)}
                >
                  {project.featured ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveProject(project.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${project.id}`}>Description</Label>
                  <Textarea
                    id={`description-${project.id}`}
                    value={project.description}
                    onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`link-${project.id}`}>Project Link</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`link-${project.id}`}
                        className="pl-8"
                        value={project.link || ''}
                        onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                      >
                        Visit
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Technologies Used</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. React"
                      value={tempTechnology}
                      onChange={(e) => setTempTechnology(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology(project.id))}
                    />
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => handleAddTechnology(project.id)}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tech}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 p-0"
                          onClick={() => handleRemoveTechnology(project.id, index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`featured-${project.id}`}
                    checked={project.featured}
                    onCheckedChange={(checked) => handleProjectChange(project.id, 'featured', checked)}
                  />
                  <Label htmlFor={`featured-${project.id}`}>
                    Feature this project on your profile
                  </Label>
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && !isAddingNew && (
            <div className="text-center py-8 text-muted-foreground">
              No projects added yet. Click "Add Project" to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 