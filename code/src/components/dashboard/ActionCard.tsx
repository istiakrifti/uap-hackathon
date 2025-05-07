
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'outline';
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  buttonText, 
  onClick,
  className,
  variant = 'default'
}) => {
  return (
    <div className={cn(
      "card flex flex-col",
      variant === 'outline' && "border border-border bg-white/50",
      className
    )}>
      <div className="mb-4">
        <div className="w-12 h-12 rounded-lg bg-platformBlue/10 flex items-center justify-center text-platformBlue mb-3">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      
      <div className="mt-auto pt-4">
        <Button 
          onClick={onClick} 
          className="w-full"
          variant={variant === 'outline' ? 'outline' : 'default'}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default ActionCard;
