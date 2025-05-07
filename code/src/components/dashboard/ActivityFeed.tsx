
import React from 'react';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  type?: 'default' | 'success' | 'warning' | 'error';
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ items, className }) => {
  return (
    <div className={cn("card", className)}>
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex gap-3 animate-fade-in"
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              item.type === 'success' && "bg-green-100 text-green-600",
              item.type === 'warning' && "bg-yellow-100 text-yellow-600",
              item.type === 'error' && "bg-red-100 text-red-600",
              (!item.type || item.type === 'default') && "bg-blue-100 text-blue-600",
            )}>
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-medium">{item.title}</h3>
                <span className="text-xs text-muted-foreground">{item.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
