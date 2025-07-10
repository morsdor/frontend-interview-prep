export const reactQuestions = [
  {
    id: 'react-hooks',
    title: 'React Hooks',
    description: 'Explain the differences between useState, useEffect, and useRef hooks.',
    difficulty: 'intermediate',
    category: 'Core Concepts',
    tags: ['Hooks', 'State Management', 'Side Effects'],
    code: {
      initial: '// Example usage of React hooks\nimport { useState, useEffect, useRef } from \'react\';\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n  const prevCountRef = useRef();\n  \n  useEffect(() => {\n    // Update the document title using the browser API\n    document.title = `You clicked ${count} times`;\n    \n    // This will run after every render\n    return () => {\n      // Cleanup function\n      document.title = \'React App\';\n    };\n  }, [count]); // Only re-run the effect if count changes\n  \n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}',
      solution: '// useState: A Hook that lets you add React state to function components.\n// - Returns a stateful value and a function to update it.\n// - The only argument is the initial state.\n\n// useEffect: A Hook that lets you perform side effects in function components.\n// - Runs after every render by default.\n// - Can be controlled by passing a second argument (dependency array).\n// - Can return a cleanup function that runs before the component is removed or before re-running the effect.\n\n// useRef: Returns a mutable ref object whose .current property is initialized to the passed argument.\n// - Persists for the full lifetime of the component.\n// - Changing .current doesn\'t cause a re-render.\n// - Commonly used to access DOM nodes directly.'
    },
    explanation: 'React Hooks are functions that let you use state and other React features in function components. They were introduced in React 16.8 to allow using state and side effects in function components without writing a class.\n\n- `useState` is used for adding local state to function components.\n- `useEffect` is used for side effects like data fetching, subscriptions, or manually changing the DOM.\n- `useRef` is used to create a mutable reference that persists across renders.',
    hints: [
      'useState returns the current state and a function to update it.',
      'useEffect runs after the render is committed to the screen.',
      'useRef can be used to store any mutable value, not just DOM nodes.'
    ],
    followUpQuestions: [
      'How does the dependency array in useEffect work?',
      'What is the difference between useRef and useState?',
      'How would you optimize a component that uses useEffect?'
    ],
    resources: [
      {
        title: 'React Hooks Documentation',
        url: 'https://reactjs.org/docs/hooks-intro.html'
      },
      {
        title: 'useEffect Complete Guide',
        url: 'https://overreacted.io/a-complete-guide-to-useeffect/'
      }
    ]
  },
  {
    id: 'virtual-dom',
    title: 'Virtual DOM',
    description: 'Explain how the Virtual DOM works in React and why it\'s beneficial.',
    difficulty: 'intermediate',
    category: 'Core Concepts',
    tags: ['Virtual DOM', 'Performance', 'Reconciliation'],
    code: {
      initial: '// Example showing Virtual DOM diffing\nfunction App() {\n  const [count, setCount] = React.useState(0);\n  \n  return (\n    <div>\n      <h1>Counter: {count}</h1>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}',
      solution: '// The Virtual DOM is a lightweight copy of the actual DOM.\n// When state changes in a React component:\n// 1. A new Virtual DOM tree is created\n// 2. This new tree is compared with the previous one (diffing)\n// 3. Only the differences are updated in the real DOM (reconciliation)\n\n// Benefits:\n// - Performance: Direct DOM manipulation is expensive. Virtual DOM minimizes DOM updates.\n// - Abstraction: Developers don\'t need to manually update the DOM.\n// - Cross-platform: The same concepts can be used for React Native (React Native uses native components instead of DOM).'
    },
    explanation: 'The Virtual DOM is a core concept in React that improves performance by minimizing direct manipulation of the real DOM. Instead of updating the DOM on every state change, React creates a virtual representation of the UI in memory and uses a diffing algorithm to determine the most efficient way to update the browser\'s DOM.\n\nThis approach is more efficient because:\n1. It batches multiple updates into a single render cycle\n2. It minimizes the number of expensive DOM operations\n3. It provides a declarative API that makes the code more predictable and easier to understand',
    hints: [
      'Virtual DOM is a JavaScript representation of the actual DOM',
      'React uses a diffing algorithm to compare Virtual DOM trees',
      'Only the necessary updates are applied to the real DOM'
    ],
    followUpQuestions: [
      'What is the difference between Shadow DOM and Virtual DOM?',
      'How does React Fiber improve the reconciliation process?',
      'What are keys in React and why are they important?'
    ],
    resources: [
      {
        title: 'Reconciliation in React',
        url: 'https://reactjs.org/docs/reconciliation.html'
      },
      {
        title: 'Virtual DOM and Internals',
        url: 'https://reactjs.org/docs/faq-internals.html'
      }
    ]
  }
];
