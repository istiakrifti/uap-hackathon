import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from '@/types/profile';

interface ProjectsTabProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, onUpdate }) => {
  const [newTechnology, setNewTechnology] = useState('');

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      description: "",
      role: "",
      technologies: [],
      status: "In Progress",
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      featured: false
    };

    onUpdate([...projects, newProject]);
  };

  const handleProjectChange = (id: string, field: string, value: any) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    );
    onUpdate(updatedProjects);
  };

  const handleRemoveProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    onUpdate(updatedProjects);
  };

  const handleAddTechnology = (projectId: string) => {
    if (!newTechnology.trim()) return;

    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          technologies: [...project.technologies, newTechnology.trim()]
        };
      }
      return project;
    });

    onUpdate(updatedProjects);
    setNewTechnology('');
  };

  const handleRemoveTechnology = (projectId: string, technology: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          technologies: project.technologies.filter(tech => tech !== technology)
        };
      }
      return project;
    });
    onUpdate(updatedProjects);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Add and manage your projects</CardDescription>
          </div>
          <Button onClick={handleAddProject}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Input
                  placeholder="Project Title"
                  value={project.title}
                  onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
                />
                <Input
                  placeholder="Role"
                  value={project.role}
                  onChange={(e) => handleProjectChange(project.id, 'role', e.target.value)}
                />
              </div>
              <div className="flex gap-2 ml-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={project.featured}
                    onCheckedChange={(checked) => handleProjectChange(project.id, 'featured', checked)}
                  />
                  <span className="text-sm">Featured</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProject(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Textarea
              placeholder="Project Description"
              value={project.description}
              onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
            />

            <div className="flex gap-2">
              <Select
                value={project.status}
                onValueChange={(value) => handleProjectChange(project.id, 'status', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={project.date}
                onChange={(e) => handleProjectChange(project.id, 'date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                />
                <Button onClick={() => handleAddTechnology(project.id)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => handleRemoveTechnology(project.id, tech)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}; 