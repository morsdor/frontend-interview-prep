"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Safe Get Utility for Nested Objects</h1>
    <p className="mb-2">
      Write a function <code>safeGet(obj, path, defaultValue)</code> that safely accesses a nested value in an object or array, returning <code>defaultValue</code> if any part of the path is missing.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const obj = { a: { b: [{ c: 3 }] } };
console.log(safeGet(obj, ["a", "b", 0, "c"], null)); // 3
console.log(safeGet(obj, ["a", "x", 0, "c"], "not found")); // "not found"`}</pre>
  </Card>
);

const starterCode = `/**
 * Safely get a nested value.
 * @param {Object|Array} obj
 * @param {Array} path
 * @param {any} defaultValue
 * @returns {any}
 */
function safeGet(obj, path, defaultValue) {
  // Your code here
}

// Usage example:
const obj = { a: { b: [{ c: 3 }] } };
console.log(safeGet(obj, ["a", "b", 0, "c"], null)); // 3
console.log(safeGet(obj, ["a", "x", 0, "c"], "not found")); // "not found"`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function safeGet(obj, path, defaultValue) {
  return path.reduce((acc, key) =>
    acc && acc[key] !== undefined ? acc[key] : defaultValue, obj);
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Reduces the path, checking each key in turn. If any key is missing, returns <code>defaultValue</code>.</li>
      <li>Edge cases: Handles arrays, objects, and missing/null/undefined values.</li>
      <li><strong>Time Complexity:</strong> O(d) for d path length. <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for safely accessing deeply nested data from APIs, configs, or user input.</li>
    </ul>
  </Card>
);

export default function SafeGetNestedObjectPage() {
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
