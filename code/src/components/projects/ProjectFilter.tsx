
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ProjectFilterProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filter: string, value: string) => void;
  onSortChange: (value: string) => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  onSearch,
  onFilterChange,
  onSortChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <div>
          <Select onValueChange={(value) => onFilterChange('difficulty', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="easiest">Easiest First</SelectItem>
              <SelectItem value="hardest">Hardest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2 mt-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onFilterChange('industry', 'all')}
        >
          All Industries
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onFilterChange('industry', 'tech')}
        >
          Tech
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onFilterChange('industry', 'finance')}
        >
          Finance
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onFilterChange('industry', 'healthcare')}
        >
          Healthcare
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onFilterChange('industry', 'marketing')}
        >
          Marketing
        </Button>
      </div>
    </div>
  );
};

export default ProjectFilter;
