"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Immutable Update of Nested Object</h1>
    <p className="mb-2">
      Write a function <code>updateIn(obj, path, value)</code> that immutably updates a nested value in an object or array at the given path.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const obj = { a: { b: [1, 2, { c: 3 }] } };
const updated = updateIn(obj, ["a", "b", 2, "c"], 99);
console.log(updated.a.b[2].c); // 99
console.log(obj.a.b[2].c); // 3 (original unchanged)`}</pre>
  </Card>
);

const starterCode = `/**
 * Immutably update a nested value.
 * @param {Object|Array} obj
 * @param {Array} path
 * @param {any} value
 * @returns {Object|Array}
 */
function updateIn(obj, path, value) {
  // Your code here
}

// Usage example:
const obj = { a: { b: [1, 2, { c: 3 }] } };
const updated = updateIn(obj, ["a", "b", 2, "c"], 99);
console.log(updated.a.b[2].c); // 99
console.log(obj.a.b[2].c); // 3`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function updateIn(obj, path, value) {
  if (!path.length) return value;
  const [key, ...rest] = path;
  if (Array.isArray(obj)) {
    const arr = obj.slice();
    arr[key] = updateIn(arr[key], rest, value);
    return arr;
  } else {
    return {
      ...obj,
      [key]: updateIn(obj[key], rest, value)
    };
  }
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>This function recursively copies the object/array and updates only the nested value at the given path.</li>
      <li>Edge cases: If the path is empty, it returns the new value. Works for both objects and arrays.</li>
      <li><strong>Time Complexity:</strong> O(d) where d is the depth of the path. <strong>Space Complexity:</strong> O(d).</li>
      <li><strong>Real-world use:</strong> Used in Redux reducers, state management, and functional programming for immutable updates.</li>
    </ul>
  </Card>
);

export default function ImmutableUpdateNestedObjectPage() {
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
