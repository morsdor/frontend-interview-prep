"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Compose Async Functions</h1>
    <p className="mb-2">
      Write a <code>composeAsync(...fns)</code> utility that composes async functions left-to-right, passing the result of each to the next.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const double = async x => x * 2;
const add3 = async x => x + 3;
const composed = composeAsync(double, add3);
composed(5).then(console.log); // 13`}</pre>
  </Card>
);

const starterCode = `/**
 * Compose async functions left-to-right
 * @param  {...Function} fns
 * @returns {Function}
 */
function composeAsync(...fns) {
  // Your code here
}

// Usage example:
const double = async x => x * 2;
const add3 = async x => x + 3;
const composed = composeAsync(double, add3);
composed(5).then(console.log); // 13`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function composeAsync(...fns) {
  return async function(initial) {
    let result = initial;
    for (const fn of fns) {
      result = await fn(result);
    }
    return result;
  };
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Sequentially awaits each function, passing the result to the next.</li>
      <li>Edge cases: Handles any number of functions, async or sync.</li>
      <li><strong>Time Complexity:</strong> O(n) for n functions. <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for building async pipelines and middleware.</li>
    </ul>
  </Card>
);

export default function ComposeAsyncPage() {
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
