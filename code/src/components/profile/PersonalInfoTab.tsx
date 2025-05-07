import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { ProfileData } from '@/types/profile';

interface PersonalInfoTabProps {
  profileData: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
  onAvatarUpload: (file: File) => Promise<void>;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  profileData,
  onUpdate,
  onAvatarUpload
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your basic profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="w-24 h-24 mb-4">
            {profileData.personalInfo.avatarUrl ? (
              <AvatarImage src={profileData.personalInfo.avatarUrl} />
            ) : (
              <AvatarFallback>
                {profileData.personalInfo.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            )}
          </Avatar>
          <Button variant="outline" size="sm" onClick={() => document.getElementById('avatar-upload')?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
          <input
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onAvatarUpload(e.target.files[0])}
          />
        </div>
        <PersonalInfoForm
          data={profileData.personalInfo}
          onChange={(data) => onUpdate({ personalInfo: { ...profileData.personalInfo, ...data } })}
        />
      </CardContent>
    </Card>
  );
}; 