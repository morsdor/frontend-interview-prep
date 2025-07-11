"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Deep Clone Object with Cycles</h1>
    <p className="mb-2">
      Write a function <code>deepClone(obj)</code> that deep clones an object, including handling cyclic references.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const a = { x: 1 };
a.self = a;
const b = deepClone(a);
console.log(b !== a && b.self === b); // true`}</pre>
  </Card>
);

const starterCode = `/**
 * Deep clone an object, handling cycles.
 * @param {Object} obj
 * @returns {Object}
 */
function deepClone(obj, map = new WeakMap()) {
  // Your code here
}

// Usage example:
const a = { x: 1 };
a.self = a;
const b = deepClone(a);
console.log(b !== a && b.self === b); // true`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function deepClone(obj, map = new WeakMap()) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (map.has(obj)) return map.get(obj);
  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], map);
    }
  }
  return clone;
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Uses a WeakMap to track already cloned objects and handle cycles.</li>
      <li>Edge cases: Handles primitives, arrays, objects, and cyclic references.</li>
      <li><strong>Time Complexity:</strong> O(n) for n properties. <strong>Space Complexity:</strong> O(n).</li>
      <li><strong>Real-world use:</strong> Useful for copying complex data structures and avoiding infinite loops.</li>
    </ul>
  </Card>
);

export default function DeepCloneWithCyclePage() {
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
