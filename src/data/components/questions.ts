import { Question } from "@/types";

export const componentQuestions: Question[] = [
  {
    id: 'chat-component',
    title: 'Chat Component',
    description: 'A comprehensive, scalable, and reusable chat component system designed for modern web applications. This system provides a complete chat experience with real-time messaging, user management, and extensible UI components.',
    difficulty: 'advanced',
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
  },
  {
    id: 'date-time-picker-component',
    title: 'Date/Time Picker Component',
    description: 'A production-ready Date/Time Picker component that handles complex state management, internationalization, accessibility, and various interaction patterns required for enterprise applications.',
    difficulty: 'advanced',
    category: 'Components',
    tags: ['components', 'date-time-picker', 'internationalization'],
  },
  {
    id: 'file-upload-component',
    title: 'File Upload Component',
    description: 'A production-ready File Upload component that handles complex state management, internationalization, accessibility, and various interaction patterns required for enterprise applications.',
    difficulty: 'advanced',
    category: 'Components',
    tags: ['components', 'file-upload', 'internationalization'],
  },
  {
    id: 'virtual-scroll-component',
    title: 'Virtual Scroll Component',
    description: 'A high-performance virtual scrolling list component that renders only visible items to handle large datasets efficiently. Supports dynamic item heights, bi-directional scrolling, search, and real-time updates.',
    difficulty: 'advanced',
    category: 'Components',
    tags: ['components', 'virtual-scroll', 'performance'],
  },
  {
    id: 'modals-component',
    title: 'Modals Component',
    description: 'A production-ready Modals component that handles complex state management, internationalization, accessibility, and various interaction patterns required for enterprise applications.',
    difficulty: 'advanced',
    category: 'Components',
    tags: ['components', 'modals', 'internationalization'],
  },
  {
    id: 'form-builder-component',
    title: 'Form Builder Component',
    description: 'A production-ready Form Builder component that handles complex state management, internationalization, accessibility, and various interaction patterns required for enterprise applications.',
    difficulty: 'advanced',
    category: 'Components',
    tags: ['components', 'form-builder', 'internationalization'],
  }
];

export const categories = Array.from(new Set(componentQuestions.map(q => q.category))).sort();
export const difficulties = Array.from(new Set(componentQuestions.map(q => q.difficulty)));