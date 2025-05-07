
import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  change?: {
    value: string | number;
    positive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  className,
  change
}) => {
  return (
    <div className={cn("card flex items-start", className)}>
      <div className="flex-1">
        <h3 className="text-muted-foreground font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-semibold">{value}</p>
          {change && (
            <span className={cn(
              "text-xs font-medium",
              change.positive ? "text-green-500" : "text-red-500"
            )}>
              {change.positive ? '+' : ''}{change.value}
            </span>
          )}
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-platformBlue/10 flex items-center justify-center text-platformBlue">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
