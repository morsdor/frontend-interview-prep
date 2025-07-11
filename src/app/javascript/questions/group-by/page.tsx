"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Group By Utility Function</h1>
    <p className="mb-2">
      Write a function <code>groupBy(arr, fn)</code> that groups items in an array by the result of <code>fn(item)</code>.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const arr = [6.1, 4.2, 6.3];
console.log(groupBy(arr, Math.floor)); // { 6: [6.1, 6.3], 4: [4.2] }`}</pre>
  </Card>
);

const starterCode = `/**
 * Group array items by a function.
 * @param {Array} arr
 * @param {Function} fn
 * @returns {Object}
 */
function groupBy(arr, fn) {
  // Your code here
}

// Usage example:
const arr = [6.1, 4.2, 6.3];
console.log(groupBy(arr, Math.floor)); // { 6: [6.1, 6.3], 4: [4.2] }`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function groupBy(arr, fn) {
  return arr.reduce((acc, item) => {
    const key = fn(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Uses <code>Array.prototype.reduce</code> to build a grouped object.</li>
      <li>Edge cases: Handles empty arrays and duplicate keys.</li>
      <li><strong>Time Complexity:</strong> O(n) for n items. <strong>Space Complexity:</strong> O(n).</li>
      <li><strong>Real-world use:</strong> Useful for data transformation, analytics, and grouping results by property or computed value.</li>
    </ul>
  </Card>
);

export default function GroupByPage() {
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
