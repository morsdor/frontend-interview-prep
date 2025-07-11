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
  {
    id: 'data-grid-component',
    title: 'Data Grid Component',
    description: 'A high-performance, feature-rich DataGrid component designed to handle large datasets with virtual scrolling, sorting, filtering, and inline editing capabilities.',
    difficulty: 'advanced',
    category: 'Components',
    tags: ['components', 'data-grid', 'virtualization'],
  },
  {
    id: 'autocomplete-component',
    title: 'Autocomplete/Typeahead Component',
    description: 'A flexible, accessible autocomplete component that supports debounced search, keyboard navigation, multi-select capabilities, and custom rendering with proper loading states and error handling.',
    difficulty: 'advanced',
    category: 'Components',
    tags: ['components', 'autocomplete', 'debounce'],
  }
];

export const categories = Array.from(new Set(componentQuestions.map(q => q.category))).sort();
export const difficulties = Array.from(new Set(componentQuestions.map(q => q.difficulty)));