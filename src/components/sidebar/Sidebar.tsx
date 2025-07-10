'use client';

import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Question } from '@/types/questions';

interface SidebarProps {
  title: string;
  questions: Question[];
  basePath: string;
  categories: string[];
  difficulties: Array<Question['difficulty']>;
}

export function Sidebar({
  title,
  questions,
  basePath,
  categories = [],
  difficulties = [],
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const pathname = usePathname();

  const toggleCategory = (category: string) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  const toggleDifficulty = (difficulty: string) => {
    const newDifficulties = new Set(selectedDifficulties);
    if (newDifficulties.has(difficulty)) {
      newDifficulties.delete(difficulty);
    } else {
      newDifficulties.add(difficulty);
    }
    setSelectedDifficulties(newDifficulties);
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedDifficulties(new Set());
    setSearchTerm('');
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategories.size === 0 || 
      selectedCategories.has(q.category);
      
    const matchesDifficulty = selectedDifficulties.size === 0 ||
      selectedDifficulties.has(q.difficulty);

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const hasActiveFilters = selectedCategories.size > 0 || 
    selectedDifficulties.size > 0 || 
    searchTerm.length > 0;

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-screen overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-4">{title} Questions</h2>
        
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search questions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 flex items-center justify-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>

        {showFilters && (
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.has(category) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={selectedDifficulties.has(difficulty) ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer capitalize',
                      getDifficultyBadgeColor(difficulty)
                    )}
                    onClick={() => toggleDifficulty(difficulty)}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-sm"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <Link
                key={question.id}
                href={`${basePath}/${question.id}`}
                className={cn(
                  'block px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  pathname === `${basePath}/${question.id}`
                    ? 'bg-gray-100 dark:bg-gray-800 text-primary font-semibold'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{question.title}</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'ml-2 text-xs',
                      getDifficultyBadgeColor(question.difficulty)
                    )}
                  >
                    {question.difficulty}
                  </Badge>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No questions found matching your filters.
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
