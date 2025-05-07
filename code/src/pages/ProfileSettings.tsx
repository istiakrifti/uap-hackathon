import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PersonalInfoTab } from '@/components/profile/PersonalInfoTab';
import { SkillsTab } from '@/components/profile/SkillsTab';
import { ExperienceTab } from '@/components/profile/ExperienceTab';
import { EducationTab } from '@/components/profile/EducationTab';
import { DocumentsTab } from '@/components/profile/DocumentsTab';
import { ProjectsTab } from '@/components/profile/ProjectsTab';
import { ProfilePreview } from '@/components/profile/ProfilePreview';
import { Loader2 } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { profileData, isLoading, updateProfile, uploadAvatar, uploadDocument } = useProfile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [previewMode, setPreviewMode] = useState(false);

  if (isLoading || !profileData) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateProfile(profileData);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAvatar(file);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    }
  };

  const handleDocumentUpload = async (file: File) => {
    try {
      await uploadDocument(file);
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile information and visibility
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Edit Profile" : "Preview Profile"}
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      {previewMode ? (
        <ProfilePreview profileData={profileData} />
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <PersonalInfoTab
              profileData={profileData}
              onUpdate={updateProfile}
              onAvatarUpload={handleAvatarUpload}
            />
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <SkillsTab
              skills={profileData.skills}
              onUpdate={(skills) => updateProfile({ skills })}
            />
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <ExperienceTab
              experience={profileData.experience}
              onUpdate={(experience) => updateProfile({ experience })}
            />
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <EducationTab
              education={profileData.education}
              onUpdate={(education) => updateProfile({ education })}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <DocumentsTab
              documents={profileData.documents}
              onUpdate={(documents) => updateProfile({ documents })}
              onUpload={handleDocumentUpload}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <ProjectsTab
              projects={profileData.projects}
              onUpdate={(projects) => updateProfile({ projects })}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ProfileSettings; 