"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Custom React Hook: usePrevious</h1>
    <p className="mb-2">
      Implement a custom React hook <code>usePrevious(value)</code> that returns the previous value of a variable after each render.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const [count, setCount] = useState(0);
const prev = usePrevious(count);`}</pre>
  </Card>
);

const starterCode = `/**
 * Custom React hook: usePrevious
 * @param {any} value
 * @returns {any}
 */
import { useRef, useEffect } from "react";
function usePrevious(value) {
  // Your code here
}

// Usage example:
// const prev = usePrevious(count);`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`import { useRef, useEffect } from "react";
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Uses a ref to persist value between renders without causing re-renders.</li>
      <li>Edge cases: Returns <code>undefined</code> on the first render.</li>
      <li><strong>Time Complexity:</strong> O(1). <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for comparing previous and current state in React components.</li>
    </ul>
  </Card>
);

export default function UsePreviousHookPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      {problem}
      <CodeEditor
        initialCode={starterCode}
        height={400}
        language="javascript"
        theme="dark"
      />
      {solution}
    </div>
  );
}
