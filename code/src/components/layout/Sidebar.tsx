
import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, BookOpen, LayoutDashboard, FileText, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
}

const navItems = [
  { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/' },
  { name: 'Mini-Projects', icon: <FileText className="h-5 w-5" />, path: '/projects' },
  { name: 'Quizzes', icon: <FileQuestion className="h-5 w-5" />, path: '/quizzes' },
  { name: 'Career Planner', icon: <BookOpen className="h-5 w-5" />, path: '/career-planner' },
  { name: 'Profile', icon: <User className="h-5 w-5" />, path: '/profile' },
];

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-20 transition-all duration-300 bg-white border-r border-border shadow-sm pt-14",
        open ? "w-64" : "w-0 lg:w-20"
      )}
    >
      <div className="flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-platformBlue text-white font-bold mb-1">
            PC
          </div>
          <h2 className={cn("font-semibold text-sm transition-opacity duration-200", 
            open ? "opacity-100" : "opacity-0 lg:opacity-0")}>
            Platform Connect
          </h2>
        </div>
      </div>

      <nav className="mt-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  cn(
                    "nav-link", 
                    isActive ? "active" : "",
                    !open && "justify-center lg:justify-center"
                  )
                }
              >
                {item.icon}
                <span className={cn("transition-opacity duration-200", 
                  open ? "opacity-100" : "opacity-0 w-0 lg:w-0")}>
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
