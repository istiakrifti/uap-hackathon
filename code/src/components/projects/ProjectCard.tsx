
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  industry: string;
  industryLogo?: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onApply: (id: string) => void;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  industry,
  industryLogo,
  difficulty,
  onApply,
  className,
}) => {
  // Define difficulty badge styles
  const difficultyStyles = {
    beginner: "bg-green-100 text-green-700 hover:bg-green-200",
    intermediate: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    advanced: "bg-red-100 text-red-700 hover:bg-red-200"
  };

  return (
    <div className={cn("card flex flex-col", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {industryLogo && (
            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
              {industryLogo}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <span className="text-xs text-muted-foreground">{industry}</span>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={difficultyStyles[difficulty]}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
      </div>
      
      <p className="text-muted-foreground text-sm flex-1 mb-4">
        {description.length > 120 ? `${description.substring(0, 120)}...` : description}
      </p>
      
      <div className="mt-auto">
        <Button 
          onClick={() => onApply(id)} 
          variant="default"
          className="w-full"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
