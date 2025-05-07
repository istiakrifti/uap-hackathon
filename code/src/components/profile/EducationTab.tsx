import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Upload, CheckCircle2 } from 'lucide-react';
import { Education } from '@/types/profile';

interface EducationTabProps {
  education: Education[];
  onUpdate: (education: Education[]) => void;
}

export const EducationTab: React.FC<EducationTabProps> = ({ education, onUpdate }) => {
  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    degree: '',
    institution: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    verified: false
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddEducation = () => {
    if (!newEducation.degree || !newEducation.institution) return;

    const educationItem: Education = {
      id: Date.now().toString(),
      degree: newEducation.degree!,
      institution: newEducation.institution!,
      startDate: newEducation.startDate || new Date().toISOString().split('T')[0],
      endDate: newEducation.endDate || new Date().toISOString().split('T')[0],
      current: newEducation.current || false,
      description: newEducation.description || '',
      verified: false
    };

    onUpdate([...education, educationItem]);
    setNewEducation({
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      verified: false
    });
    setIsAddingNew(false);
  };

  const handleEducationChange = (id: string, field: keyof Education, value: any) => {
    const updatedEducation = education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdate(updatedEducation);
  };

  const handleRemoveEducation = (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id);
    onUpdate(updatedEducation);
  };

  const handleCertificateUpload = (id: string, file: File) => {
    // In a real application, you would upload the file to a server
    // and get back a URL for the file
    const fileUrl = URL.createObjectURL(file);
    
    const updatedEducation = education.map(edu => 
      edu.id === id ? { ...edu, certificateUrl: fileUrl } : edu
    );
    onUpdate(updatedEducation);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Education & Certification</CardTitle>
            <CardDescription>Add your degrees, certifications, and other educational credentials</CardDescription>
          </div>
          {!isAddingNew && (
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new education form */}
        {isAddingNew && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-degree">Degree/Certification</Label>
                <Input
                  id="new-degree"
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-institution">Institution</Label>
                <Input
                  id="new-institution"
                  placeholder="e.g. University of Technology"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-start-date">Start Date</Label>
                <Input
                  id="new-start-date"
                  type="date"
                  value={newEducation.startDate}
                  onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-end-date">End Date</Label>
                <div className="flex gap-4">
                  <Input
                    id="new-end-date"
                    type="date"
                    value={newEducation.endDate}
                    onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                    disabled={newEducation.current}
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      id="new-current"
                      checked={newEducation.current}
                      onCheckedChange={(checked) => setNewEducation({ ...newEducation, current: checked })}
                    />
                    <Label htmlFor="new-current" className="text-sm">Current</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                placeholder="Describe your degree, major, achievements, etc."
                value={newEducation.description}
                onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>Cancel</Button>
              <Button onClick={handleAddEducation}>Add Education</Button>
            </div>
          </div>
        )}

        {/* Education list */}
        {education.map(edu => (
          <div key={edu.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{edu.degree}</h3>
                  {edu.verified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveEducation(edu.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`start-date-${edu.id}`}>Start Date</Label>
                <Input
                  id={`start-date-${edu.id}`}
                  type="date"
                  value={edu.startDate}
                  onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`end-date-${edu.id}`}>End Date</Label>
                <div className="flex gap-4">
                  <Input
                    id={`end-date-${edu.id}`}
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                    disabled={edu.current}
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`current-${edu.id}`}
                      checked={edu.current}
                      onCheckedChange={(checked) => handleEducationChange(edu.id, 'current', checked)}
                    />
                    <Label htmlFor={`current-${edu.id}`} className="text-sm">Current</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${edu.id}`}>Description</Label>
              <Textarea
                id={`description-${edu.id}`}
                value={edu.description}
                onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Certificate</Label>
              <div className="flex items-center gap-4">
                {edu.certificateUrl ? (
                  <div className="flex gap-2 items-center">
                    <a
                      href={edu.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm hover:underline"
                    >
                      View Certificate
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEducationChange(edu.id, 'certificateUrl', '')}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`certificate-upload-${edu.id}`)?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Certificate
                    </Button>
                    <input
                      id={`certificate-upload-${edu.id}`}
                      type="file"
                      className="hidden"
                      accept="application/pdf,image/*"
                      onChange={(e) => e.target.files?.[0] && handleCertificateUpload(edu.id, e.target.files[0])}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {education.length === 0 && !isAddingNew && (
          <div className="text-center py-8 text-muted-foreground">
            No education or certifications added yet. Click "Add Education" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 