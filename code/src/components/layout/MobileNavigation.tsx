
import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, BookOpen, LayoutDashboard, FileText, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/' },
  { name: 'Projects', icon: <FileText className="h-5 w-5" />, path: '/projects' },
  { name: 'Quizzes', icon: <FileQuestion className="h-5 w-5" />, path: '/quizzes' },
  { name: 'Career', icon: <BookOpen className="h-5 w-5" />, path: '/career-planner' },
  { name: 'Profile', icon: <User className="h-5 w-5" />, path: '/profile' },
];

const MobileNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-border lg:hidden">
      <nav className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              cn(
                "flex flex-col items-center py-3 px-4 text-xs",
                isActive ? "text-platformBlue" : "text-gray-500"
              )
            }
          >
            {item.icon}
            <span className="mt-1">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigation;
