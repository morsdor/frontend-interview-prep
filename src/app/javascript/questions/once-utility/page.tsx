"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Once Utility</h1>
    <p className="mb-2">
      Write a function <code>once(fn)</code> that returns a function which can only be called once. Subsequent calls return the first result.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const init = once(() => Math.random());
console.log(init() === init()); // true`}</pre>
  </Card>
);

const starterCode = `/**
 * Once utility
 * @param {Function} fn
 * @returns {Function}
 */
function once(fn) {
  // Your code here
}

// Usage example:
const init = once(() => Math.random());
console.log(init() === init());`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function once(fn) {
  let called = false, result;
  return function(...args) {
    if (!called) {
      result = fn.apply(this, args);
      called = true;
    }
    return result;
  };
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Tracks if the function has been called and caches the result.</li>
      <li>Edge cases: Handles context and arguments, works with any function.</li>
      <li><strong>Time Complexity:</strong> O(1) per call. <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for initialization logic, event registration, and singleton patterns.</li>
    </ul>
  </Card>
);

export default function OnceUtilityPage() {
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
