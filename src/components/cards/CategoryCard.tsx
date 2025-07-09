import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const variantColors = {
  javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  react: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  components: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  architecture: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  web: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
} as const;

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
} as const;

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  count: number;
  levels: {
    beginner?: boolean;
    intermediate?: boolean;
    advanced?: boolean;
  };
  className?: string;
}

export function CategoryCard({
  id,
  title,
  description,
  count,
  levels,
  className,
}: CategoryCardProps) {
  const availableLevels = Object.entries(levels)
    .filter(([_, value]) => value)
    .map(([level]) => level as keyof typeof difficultyColors);

  return (
    <Link href={`/${id}`} className={cn('block h-full', className)}>
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <Badge variant="outline" className={variantColors[id as keyof typeof variantColors]}>
              {count} {count === 1 ? 'Question' : 'Questions'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
          <div className="flex flex-wrap gap-2">
            {availableLevels.map((level) => (
              <Badge
                key={level}
                variant="outline"
                className={cn(
                  'capitalize',
                  difficultyColors[level as keyof typeof difficultyColors]
                )}
              >
                {level}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <div className="w-full flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {availableLevels.length} {availableLevels.length === 1 ? 'Level' : 'Levels'}
            </span>
            <span className="text-sm font-medium text-primary">Start Practicing →</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
