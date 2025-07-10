export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  code: {
    initial: string;
    solution: string;
  };
  explanation: string;
  hints?: string[];
  followUpQuestions?: string[];
  resources?: {
    title: string;
    url: string;
  }[];
}

export const javascriptQuestions: Question[] = [
  {
    id: 'flatten-array',
    title: 'Flatten Array',
    description: 'Write a function that flattens a nested array. The function should handle multiple levels of nesting.',
    difficulty: 'beginner',
    category: 'Arrays',
    tags: ['arrays', 'recursion'],
    code: {
      initial: `/**
 * Flattens a nested array
 * @param {Array} arr - The array to flatten
 * @return {Array} - The flattened array
 */
function flatten(arr) {
  // Your code here
  return [];
}

// Test cases
console.log(flatten([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]
console.log(flatten([1, [2, [3, [4, [5]]]]])); // [1, 2, 3, 4, 5]
console.log(flatten([1, 2, 3, 4, 5])); // [1, 2, 3, 4, 5]
console.log(flatten([])); // []
`,
      solution: `/**
 * Flattens a nested array using recursion
 */
function flatten(arr) {
  return arr.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten(val) : val);
  }, []);
}

// Alternative solution using flat() (ES2019+)
// function flatten(arr) {
//   return arr.flat(Infinity);
// }
`
    },
    explanation: 'The solution uses a recursive approach to flatten the array. For each element in the array, it checks if the element is an array. If it is, it recursively flattens that array. If not, it adds the element to the accumulator. The base case is when all elements are primitives, at which point they are concatenated to the accumulator array.',
    hints: [
      'Consider using recursion to handle nested arrays',
      'You can use Array.isArray() to check if an element is an array',
      'Think about using Array.prototype.reduce() to build the result array'
    ],
    followUpQuestions: [
      'How would you handle very deep nesting levels?',
      'Can you solve this without using recursion?',
      'How would you handle circular references in the array?'
    ],
    resources: [
      {
        title: 'MDN: Array.prototype.flat()',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat'
      },
      {
        title: 'Understanding Recursion in JavaScript',
        url: 'https://www.freecodecamp.org/news/understanding-recursion-in-javascript-992e96449e03/'
      }
    ]
  },
  {
    id: 'debounce-function',
    title: 'Debounce Function',
    description: 'Implement a debounce function that delays invoking a function until after wait milliseconds have elapsed since the last time the debounced function was invoked.',
    difficulty: 'intermediate',
    category: 'Functions',
    tags: ['functions', 'timing', 'performance'],
    code: {
      initial: `/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @return {Function} - The debounced function
 */
function debounce(func, wait) {
  // Your code here
}

// Example usage:
// const debouncedFn = debounce(() => console.log('Hello'), 300);
// window.addEventListener('resize', debouncedFn);
`,
      solution: `/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 */
function debounce(func, wait) {
  let timeoutId;
  
  return function(...args) {
    const context = this;
    
    // Clear the previous timeout
    clearTimeout(timeoutId);
    
    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
`
    },
    explanation: 'The debounce function creates a closure around the timeout ID. Each time the debounced function is called, it clears the previous timeout and sets a new one. The actual function is only called after the specified wait time has elapsed since the last call to the debounced function.',
    hints: [
      'Use setTimeout to delay the function execution',
      'Clear the previous timeout before setting a new one',
      'Use closure to maintain the timeout ID between function calls'
    ],
    followUpQuestions: [
      'How would you implement a leading-edge version that triggers on the first call?',
      'How would you modify this to support immediate execution?',
      'How would you implement a throttle function?'
    ],
    resources: [
      {
        title: 'Debouncing and Throttling Explained Through Examples',
        url: 'https://css-tricks.com/debouncing-throttling-explained-examples/'
      },
      {
        title: 'Lodash debounce implementation',
        url: 'https://github.com/lodash/lodash/blob/master/debounce.js'
      }
    ]
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
