"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Unique ID Generator</h1>
    <p className="mb-2">
      Write a function <code>createIdGenerator()</code> that returns a function which generates unique, incrementing IDs each time it is called.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const nextId = createIdGenerator();
console.log(nextId()); // 1
console.log(nextId()); // 2`}</pre>
  </Card>
);

const starterCode = `/**
 * Unique ID generator
 * @returns {Function}
 */
function createIdGenerator() {
  // Your code here
}

// Usage example:
const nextId = createIdGenerator();
console.log(nextId()); // 1
console.log(nextId()); // 2`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function createIdGenerator() {
  let id = 0;
  return function() {
    return ++id;
  };
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Uses closure to persist and increment the ID across calls.</li>
      <li>Edge cases: Each generator is independent, always starts at 1.</li>
      <li><strong>Time Complexity:</strong> O(1) per call. <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for generating unique keys, IDs for DOM elements, or database records.</li>
    </ul>
  </Card>
);

export default function UniqueIdGeneratorPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      {problem}
      <CodeEditor
        initialCode={starterCode}
        height={420}
        language="javascript"
        theme="dark"
      />
      {solution}
    </div>
  );
}
