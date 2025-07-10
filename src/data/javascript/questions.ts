import { Question } from "@/types";


export const javascriptQuestions: Question[] = [
  {
    id: 'flatten-array',
    title: 'Flatten Array',
    description: 'Write a function that flattens a nested array. The function should handle multiple levels of nesting.',
    difficulty: 'beginner',
    category: 'Arrays',
    tags: ['arrays', 'recursion'],
  },
  {
    id: 'debounce-function',
    title: 'Debounce Function',
    description: 'Implement a debounce function that delays invoking a function until after wait milliseconds have elapsed since the last time the debounced function was invoked.',
    difficulty: 'intermediate',
    category: 'Functions',
    tags: ['functions', 'timing', 'performance'],
  }
];

// Create a map for easy lookup by ID
export const questionsMap = javascriptQuestions.reduce<Record<string, Question>>(
  (acc, question) => {
    acc[question.id] = question;
    return acc;
  },
  {}
);

// Export categories and difficulties for filtering
export const categories = Array.from(new Set(javascriptQuestions.map(q => q.category))).sort();
export const difficulties = Array.from(new Set(javascriptQuestions.map(q => q.difficulty)));
