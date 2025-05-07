import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Quizzes from "./pages/Quizzes";
import CareerPlanner from "./pages/CareerPlanner";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import IndustryProfile from "./components/profile/IndustryProfile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import Jobs from "./pages/jobs/Jobs";
import { Loader2 } from "lucide-react";
import ProjectForm from "./pages/IndustryProfile/ProjectForm";
import ProjectSubmissions from "./pages/IndustryProfile/ProjectSubmissions";
import MiniProjects from "./pages/IndustryProfile/MiniProjects";
import ProjectDetail from "./pages/ProjectDetail";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Role-based projects router
const ProjectsRouter = () => {
  const { user } = useAuth();
  
  // Add console logs to debug user role and routing
  console.log('ProjectsRouter - User:', user);
  
  if (!user) {
    console.log('ProjectsRouter - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProjectsRouter - User role:', user.role);
  
  // Only industry users see the custom MiniProjects component
  // Regular users see the Projects component with projects to apply to
  return user.role === 'industry' ? <MiniProjects /> : <Projects />;
};

// Role-based profile router
const ProfileRouter = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Always use the appropriate profile component regardless of role
  return user.role === 'industry' ? <IndustryProfile /> : <Profile />;
};

// App with auth context
const AppWithAuth = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsRouter />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="career-planner" element={<CareerPlanner />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="profile" element={<ProfileRouter />} />
              <Route path="profile/settings" element={<ProfileSettings />} />
              
              {/* Project detail page for job seekers */}
              <Route path="projects/:projectId" element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              } />
              
              {/* Nested routes for project management - only accessible to industry users */}
              <Route path="projects/create" element={
                <ProtectedRoute>
                  <ProjectForm />
                </ProtectedRoute>
              } />
              <Route path="projects/edit/:projectId" element={
                <ProtectedRoute>
                  <ProjectForm />
                </ProtectedRoute>
              } />
              <Route path="projects/submissions/:projectId" element={
                <ProtectedRoute>
                  <ProjectSubmissions />
                </ProtectedRoute>
              } />
              
              {/* Redirect old URL structure to new structure */}
              <Route path="profile/projects" element={<Navigate to="/projects" replace />} />
              <Route path="profile/projects/create" element={<Navigate to="/projects/create" replace />} />
              <Route path="profile/projects/edit/:projectId" element={<Navigate to="/projects" replace />} />
              <Route path="profile/projects/submissions/:projectId" element={<Navigate to="/projects" replace />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => (
  <BrowserRouter>
    <AppWithAuth />
  </BrowserRouter>
);

export default App;
