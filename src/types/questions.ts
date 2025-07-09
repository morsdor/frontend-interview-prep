export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  answer: string;
  codeExample?: string;
  explanation?: string;
  followUpQuestions?: string[];
  resources?: {
    title: string;
    url: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
  levels: {
    [key in Difficulty]?: boolean;
  };
}

export const categories: Category[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Core JavaScript concepts and advanced topics',
    icon: 'javascript',
    color: 'yellow',
    count: 120,
    levels: {
      beginner: true,
      intermediate: true,
      advanced: true
    }
  },
  {
    id: 'react',
    name: 'React',
    description: 'React concepts and best practices',
    icon: 'react',
    color: 'blue',
    count: 80,
    levels: {
      intermediate: true,
      advanced: true
    }
  },
  {
    id: 'components',
    name: 'Component Design',
    description: 'Design and implement reusable components',
    icon: 'puzzle',
    color: 'purple',
    count: 15,
    levels: {
      advanced: true
    }
  },
  {
    id: 'architecture',
    name: 'Architecture',
    description: 'Frontend system design and architecture',
    icon: 'layout',
    color: 'green',
    count: 50,
    levels: {
      advanced: true
    }
  },
  {
    id: 'web',
    name: 'Web Fundamentals',
    description: 'How the web works, performance, and security',
    icon: 'globe',
    color: 'red',
    count: 60,
    levels: {
      intermediate: true,
      advanced: true
    }
  }
];
