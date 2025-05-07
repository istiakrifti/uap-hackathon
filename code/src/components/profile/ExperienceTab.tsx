import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus } from 'lucide-react';
import { Experience } from '@/types/profile';

interface ExperienceTabProps {
  experience: Experience[];
  onUpdate: (experience: Experience[]) => void;
}

export const ExperienceTab: React.FC<ExperienceTabProps> = ({ experience, onUpdate }) => {
  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };

    onUpdate([...experience, newExperience]);
  };

  const handleExperienceChange = (id: string, field: string, value: any) => {
    const updatedExperience = experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate(updatedExperience);
  };

  const handleRemoveExperience = (id: string) => {
    const updatedExperience = experience.filter(exp => exp.id !== id);
    onUpdate(updatedExperience);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Add and manage your work experience</CardDescription>
          </div>
          <Button onClick={handleAddExperience}>
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {experience.map(exp => (
          <div key={exp.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Input
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                />
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                />
              </div>
              <div className="flex gap-2 ml-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={exp.current}
                    onCheckedChange={(checked) => handleExperienceChange(exp.id, 'current', checked)}
                  />
                  <span className="text-sm">Current</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveExperience(exp.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Location"
                value={exp.location}
                onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                />
                <Input
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
              </div>
            </div>

            <Textarea
              placeholder="Job Description"
              value={exp.description}
              onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
            />
          </div>
        ))}

        {experience.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No work experience added yet. Click "Add Experience" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 