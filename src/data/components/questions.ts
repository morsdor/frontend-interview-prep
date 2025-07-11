import { Question } from "@/types";

export const componentQuestions: Question[] = [
  {
    id: 'chat-component',
    title: 'Chat Component',
    description: 'A comprehensive, scalable, and reusable chat component system designed for modern web applications. This system provides a complete chat experience with real-time messaging, user management, and extensible UI components.',
    difficulty: 'intermediate',
    category: 'Components',
    tags: ['components', 'chat', 'real-time'],
  },
];

export const categories = Array.from(new Set(componentQuestions.map(q => q.category))).sort();
export const difficulties = Array.from(new Set(componentQuestions.map(q => q.difficulty)));