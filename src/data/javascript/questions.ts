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
  },
  {
    id: 'deep-clone-object',
    title: 'Deep Clone Object',
    description: 'Write a function that deep clones an object. The function should handle nested objects and arrays.',
    difficulty: 'beginner',
    category: 'Objects',
    tags: ['objects', 'cloning', 'deep-copy'],
  },
  {
    id: 'memoization',
    title: 'Memoization',
    description: 'Implement memoization for a function to optimize repeated function calls with the same arguments.',
    difficulty: 'intermediate',
    category: 'Functions',
    tags: ['functions', 'performance', 'optimization'],
  },
  {
    id: 'promisify',
    title: 'Promisify',
    description: 'Implement a promisify function that converts a callback-based function to a function that returns a Promise.',
    difficulty: 'intermediate',
    category: 'Functions',
    tags: ['functions', 'promises', 'callback'],
  },
  {
    id: 'deep-equality',
    title: 'Deep Equality Check',
    description: 'Write a function that checks if two values are deeply equal. It should compare objects, arrays, primitives, and handle nested structures.',
    difficulty: 'beginner',
    category: 'Objects',
    tags: ['objects', 'equality', 'deep-comparison'],
  },
  {
    id: 'clone-graph',
    title: 'Clone Graph',
    description: 'Implement a function to clone a graph (handle cycles). Each node has a val and neighbors array.',
    difficulty: 'intermediate',
    category: 'Graphs',
    tags: ['graphs', 'cloning', 'cyclic-structure'],
  },
  {
    id: "throttle-function",
    title: "Throttle Function",
    description: "Implement a throttle function that limits the rate at which a function can be called.",
    difficulty: "intermediate",
    category: "Functions",
    tags: ["functions", "timing", "performance"],
  },
  {
    id:"currying",
    title:"Currying",
    description:"Implement a currying function that transforms a function with multiple arguments into a sequence of functions, each with a single argument.",
    difficulty:"intermediate",
    category:"Functions",
    tags:["functions","currying","functional-programming"],
  },
  {
    id:"compose-functions",
    title:"Compose Functions",
    description:"Implement a compose function that composes multiple functions into a single function.",
    difficulty:"intermediate",
    category:"Functions",
    tags:["functions","composition","functional-programming"],
  },
  {
    id:"event-emitter",
    title:"Event Emitter",
    description:"Implement an event emitter that allows for event registration, emission, and removal.",
    difficulty:"intermediate",
    category:"Events",
    tags:["events","emitter","event-handling"],
  },
  {
    id:'lru-cache',
    title:'LRU Cache',
    description:'Implement an LRU cache that stores a limited number of key-value pairs and evicts the least recently used items when the cache is full.',
    difficulty:'intermediate',
    category:'Caching',
    tags:['caching','lru-cache','data-structures'],
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
