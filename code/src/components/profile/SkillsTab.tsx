import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skill } from '@/types/profile';

interface SkillsTabProps {
  skills: Skill[];
  onUpdate: (skills: Skill[]) => void;
}

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const skillCategories = ["Technical", "Soft Skills", "Languages", "Tools", "Other"];

export const SkillsTab: React.FC<SkillsTabProps> = ({ skills, onUpdate }) => {
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', category: 'Technical' });

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;

    const updatedSkills = [
      ...skills,
      {
        id: Date.now().toString(),
        name: newSkill.name.trim(),
        level: newSkill.level,
        category: newSkill.category
      }
    ];

    onUpdate(updatedSkills);
    setNewSkill({ name: '', level: 'Beginner', category: 'Technical' });
  };

  const handleRemoveSkill = (id: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== id);
    onUpdate(updatedSkills);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Add and manage your skills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add new skill form */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Skill name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              />
            </div>
            <div className="w-[150px]">
              <Select
                value={newSkill.level}
                onValueChange={(value) => setNewSkill({ ...newSkill, level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[150px]">
              <Select
                value={newSkill.category}
                onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddSkill}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>

          {/* Skills list */}
          <div className="grid grid-cols-2 gap-4">
            {skills.map(skill => (
              <div 
                key={skill.id} 
                className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{skill.name}</span>
                    <Badge variant="outline" className="bg-blue-50">
                      {skill.level}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {skill.category}
                  </span>
                </div>
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRemoveSkill(skill.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 