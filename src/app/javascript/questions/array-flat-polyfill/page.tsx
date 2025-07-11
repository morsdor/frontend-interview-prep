"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Polyfill: Array.prototype.flat</h1>
    <p className="mb-2">
      Implement a polyfill for <code>Array.prototype.flat</code> that flattens an array up to a specified depth.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`[1, [2, [3, 4]]].myFlat(2); // [1,2,3,4]`}</pre>
  </Card>
);

const starterCode = `/**
 * Polyfill for Array.prototype.flat
 * @param {number} [depth=1]
 * @returns {Array}
 */
Array.prototype.myFlat = function(depth = 1) {
  // Your code here
}

// Usage example:
[1, [2, [3, 4]]].myFlat(2); // [1,2,3,4]`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`Array.prototype.myFlat = function(depth = 1) {
  const res = [];
  (function flat(arr, d) {
    for (const item of arr) {
      if (Array.isArray(item) && d > 0) flat(item, d - 1);
      else res.push(item);
    }
  })(this, depth);
  return res;
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Recursively flattens the array up to the specified depth.</li>
      <li>Edge cases: Handles empty arrays, non-array elements, and depth = 0.</li>
      <li><strong>Time Complexity:</strong> O(n) for n elements. <strong>Space Complexity:</strong> O(n).</li>
      <li><strong>Real-world use:</strong> Useful for data transformation and working with deeply nested arrays.</li>
    </ul>
  </Card>
);

export default function ArrayFlatPolyfillPage() {
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
