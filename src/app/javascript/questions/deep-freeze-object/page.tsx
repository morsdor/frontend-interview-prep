"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Deep Freeze an Object</h1>
    <p className="mb-2">
      Write a function <code>deepFreeze(obj)</code> that recursively freezes an object and all nested objects/arrays.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
deepFreeze(obj);
obj.a = 99; // fails silently or throws in strict mode
obj.b.c = 42; // fails
obj.d.push(5); // fails`}</pre>
  </Card>
);

const starterCode = `/**
 * Deep freeze an object.
 * @param {Object} obj
 * @returns {Object}
 */
function deepFreeze(obj) {
  // Your code here
}

// Usage example:
const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
deepFreeze(obj);`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function deepFreeze(obj) {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach(prop => {
    if (
      obj[prop] !== null &&
      (typeof obj[prop] === "object" || typeof obj[prop] === "function") &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>This function recursively freezes all nested objects and arrays using <code>Object.freeze</code>.</li>
      <li>Edge cases: Handles circular references by not re-freezing already frozen objects.</li>
      <li><strong>Time Complexity:</strong> O(n) for n properties. <strong>Space Complexity:</strong> O(d) for recursion depth.</li>
      <li><strong>Real-world use:</strong> Useful for enforcing immutability in Redux state, configuration objects, etc.</li>
    </ul>
  </Card>
);

export default function DeepFreezeObjectPage() {
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
