export const siteConfig = {
  name: 'Frontend Interview Prep',
  description: 'Comprehensive preparation for senior frontend engineering interviews',
  url: 'https://frontend-interview-prep.vercel.app',
  ogImage: 'https://frontend-interview-prep.vercel.app/og-image.png',
  links: {
    twitter: 'https://twitter.com/yourhandle',
    github: 'https://github.com/yourusername/frontend-interview-prep',
  },
  author: 'Your Name',
  keywords: [
    'frontend',
    'interview',
    'preparation',
    'react',
    'javascript',
    'typescript',
    'senior developer',
  ],
} as const;

export const navItems = [
  {
    title: 'JavaScript',
    href: '/javascript',
    description: 'Core JavaScript concepts and advanced topics',
  },
  {
    title: 'React',
    href: '/react',
    description: 'React concepts and best practices',
  },
  {
    title: 'Components',
    href: '/components',
    description: 'Design and implement reusable components',
  },
  {
    title: 'Architecture',
    href: '/architecture',
    description: 'Frontend system design and architecture',
  },
  {
    title: 'Web Fundamentals',
    href: '/web-fundamentals',
    description: 'How the web works, performance, and security',
  },
] as const;

export const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', color: 'green' },
  { id: 'intermediate', name: 'Intermediate', color: 'yellow' },
  { id: 'advanced', name: 'Advanced', color: 'red' },
] as const;
