
import React, { useState } from 'react';
import { Code, Database, LineChart, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';
import ProjectFilter from '@/components/projects/ProjectFilter';
import ProjectCard, { ProjectCardProps } from '@/components/projects/ProjectCard';

// Omit methods and id from the Props to create a type for the data
type ProjectData = Omit<ProjectCardProps, 'onApply'>;

const Projects: React.FC = () => {
  // Mock project data
  const projectsData: ProjectData[] = [
    {
      id: '1',
      title: 'E-commerce API',
      description: 'Build a RESTful API for an e-commerce platform using Node.js and Express.',
      industry: 'Web Development',
      industryLogo: <Code className="h-5 w-5" />,
      difficulty: 'intermediate',
    },
    {
      id: '2',
      title: 'Customer Database',
      description: 'Design and implement a customer database schema with optimized queries.',
      industry: 'Database Management',
      industryLogo: <Database className="h-5 w-5" />,
      difficulty: 'advanced',
    },
    {
      id: '3',
      title: 'Analytics Dashboard',
      description: 'Create an interactive analytics dashboard using React and Chart.js.',
      industry: 'Front-end Development',
      industryLogo: <LineChart className="h-5 w-5" />,
      difficulty: 'intermediate',
    },
    {
      id: '4',
      title: 'Portfolio Website',
      description: 'Build a responsive portfolio website to showcase your projects and skills.',
      industry: 'Web Development',
      industryLogo: <Code className="h-5 w-5" />,
      difficulty: 'beginner',
    },
    {
      id: '5',
      title: 'User Authentication',
      description: 'Implement secure user authentication using JWT and bcrypt.',
      industry: 'Security',
      industryLogo: <BadgeCheck className="h-5 w-5" />,
      difficulty: 'intermediate',
    },
    {
      id: '6',
      title: 'Data Visualization',
      description: 'Create interactive data visualizations using D3.js.',
      industry: 'Data Science',
      industryLogo: <LineChart className="h-5 w-5" />,
      difficulty: 'advanced',
    },
  ];

  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>(projectsData);
  
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredProjects(projectsData);
      return;
    }
    
    const filtered = projectsData.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredProjects(filtered);
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    if (value === 'all') {
      setFilteredProjects(projectsData);
      return;
    }
    
    let filtered = [...projectsData];
    
    if (filter === 'difficulty') {
      filtered = projectsData.filter(project => project.difficulty === value);
    }
    
    if (filter === 'industry') {
      filtered = projectsData.filter(project => 
        project.industry.toLowerCase().includes(value.toLowerCase())
      );
    }
    
    setFilteredProjects(filtered);
  };
  
  const handleSortChange = (value: string) => {
    let sorted = [...filteredProjects];
    
    switch (value) {
      case 'newest':
        // In a real app, you'd sort by date
        // Here we're just using the ID as a proxy for "newest"
        sorted = sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'popular':
        // This would use a popularity metric in a real app
        // For mock data we're just randomly sorting
        sorted = sorted.sort(() => Math.random() - 0.5);
        break;
      case 'easiest':
        sorted = sorted.sort((a, b) => {
          const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
        break;
      case 'hardest':
        sorted = sorted.sort((a, b) => {
          const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
          return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
        });
        break;
    }
    
    setFilteredProjects(sorted);
  };
  
  const handleApply = (id: string) => {
    const project = projectsData.find(p => p.id === id);
    if (project) {
      toast.success(`Applied to project: ${project.title}`, {
        description: "Your application has been submitted successfully."
      });
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mini-Projects</h1>
      
      {/* Filter */}
      <ProjectFilter 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      
      {/* Project List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            {...project} 
            onApply={handleApply} 
          />
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="col-span-3 text-center py-10">
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
