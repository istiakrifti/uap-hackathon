import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProfileData } from '@/types/profile';

interface ProfileContextType {
  profileData: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

const defaultProfileData: ProfileData = {
  personalInfo: {
    fullName: '',
    title: '',
    location: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    avatarUrl: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      other: ''
    }
  },
  skills: [],
  education: [],
  experience: [],
  documents: [],
  projects: []
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, this would be an API call
      // For now, we'll simulate a successful response
      setTimeout(() => {
        // Simulate getting user data from an API
        setProfileData(defaultProfileData);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      setError('Failed to fetch profile data');
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, this would be an API call
      // For now, we'll simulate a successful update
      setTimeout(() => {
        setProfileData(prev => {
          if (!prev) return { ...defaultProfileData, ...data };
          return { ...prev, ...data };
        });
        setIsLoading(false);
      }, 500);
    } catch (error) {
      setError('Failed to update profile data');
      setIsLoading(false);
      throw new Error('Failed to update profile data');
    }
  };

  const uploadDocument = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, this would upload the file to a server
      // For now, we'll simulate a successful upload
      setTimeout(() => {
        setProfileData(prev => {
          if (!prev) return defaultProfileData;
          
          return {
            ...prev,
            documents: [
              ...prev.documents,
              {
                id: Date.now().toString(),
                name: file.name,
                fileUrl: URL.createObjectURL(file),
                fileType: file.type,
                uploadDate: new Date().toISOString(),
                size: file.size,
                version: 1
              }
            ]
          };
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setError('Failed to upload document');
      setIsLoading(false);
      throw new Error('Failed to upload document');
    }
  };

  const uploadAvatar = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, this would upload the file to a server
      // For now, we'll simulate a successful upload
      setTimeout(() => {
        setProfileData(prev => {
          if (!prev) return defaultProfileData;
          
          return {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              avatarUrl: URL.createObjectURL(file)
            }
          };
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setError('Failed to upload avatar');
      setIsLoading(false);
      throw new Error('Failed to upload avatar');
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        isLoading,
        error,
        updateProfile,
        uploadDocument,
        uploadAvatar
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}; 