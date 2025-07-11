
"use client"

import React from "react";
import { Card } from '@/components/ui/Card';

// 1. Problem Statement & Example
const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Deep Clone an Object</h1>
    <p className="mb-2">
      Write a function <code>deepClone(obj)</code> that creates a deep copy of a given JavaScript object. The clone should recursively copy all nested objects and arrays, so that changes to the clone do not affect the original.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
const clone = deepClone(obj);
clone.b.c = 42;
console.log(obj.b.c); // 2 (should not change)`}</pre>
  </Card>
);

// 2. Code Editor & Output (uses project CodeEditor)
import { CodeEditor } from '@/components/editor/CodeEditor';

const starterCode = `/**
 * Deep clone a JavaScript object.
 * @param {any} obj
 * @returns {any}
 */
function deepClone(obj) {
  // Your code here
}

// Example test cases:
const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
const clone = deepClone(obj);
clone.b.c = 42;
console.log(obj.b.c); // 2 (should not change)
console.log(clone.b.c); // 42
`;

const codeEditor = (
  <Card className="mb-6 p-6">
    <h2 className="text-xl font-semibold mb-2">Code Editor</h2>
    <CodeEditor
      initialCode={`/**
 * Deep clone a JavaScript object.
 * @param {any} obj
 * @returns {any}
 */
function deepClone(obj) {
  // TODO: Implement deep clone logic
  // For now, return a shallow copy as a placeholder to avoid runtime errors
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return [...obj];
  return { ...obj };
}

// Example test cases (edit below to try your own):
try {
  const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
  const clone = deepClone(obj);
  clone.b.c = 42;
  console.log('Original:', obj.b.c); // 2 (should not change if deep clone)
  console.log('Clone:', clone.b.c); // 42
} catch (e) {
  console.error('Test error:', e);
}
`}
      language="javascript"
      theme="dark"
      showRunButton
      showResetButton
      showCopyButton
      showConsole
      showExecutionTime
    />
  </Card>
);

// 3. Solution & Explanation
const solution = (
  <Card className="mb-6 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution & Explanation</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-3 text-sm">{`function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}`}</pre>
    <p>
      This solution checks if the value is an array or object and recursively clones each property. It handles nested objects/arrays, but does not handle special cases like Dates, Maps, Sets, or circular references (those are advanced extensions).
    </p>
  </Card>
);

export default function DeepCloneObjectPage() {
  return (
    <main className="max-w-2xl mx-auto py-8 px-2 font-sans flex flex-col gap-6">
      {problem}
      {codeEditor}
      {solution}
    </main>
  );
}
