"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Polyfill: Array.prototype.reduce</h1>
    <p className="mb-2">
      Implement a polyfill for <code>Array.prototype.reduce</code> that executes a reducer function on each element of the array, resulting in a single output value.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`[1,2,3].myReduce((acc, v) => acc + v, 0); // 6`}</pre>
  </Card>
);

const starterCode = `/**
 * Polyfill for Array.prototype.reduce
 * @param {Function} callback
 * @param {any} [initialValue]
 * @returns {any}
 */
Array.prototype.myReduce = function(callback, initialValue) {
  // Your code here
}

// Usage example:
[1,2,3].myReduce((acc, v) => acc + v, 0); // 6`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`Array.prototype.myReduce = function(callback, initialValue) {
  let acc = initialValue !== undefined ? initialValue : this[0];
  let i = initialValue !== undefined ? 0 : 1;
  for (; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Implements reduce logic with optional initial value.</li>
      <li>Edge cases: Handles empty arrays and no initial value (starts at index 1).</li>
      <li><strong>Time Complexity:</strong> O(n) for n elements. <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for custom array processing and functional programming.</li>
    </ul>
  </Card>
);

export default function ArrayReducePolyfillPage() {
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
