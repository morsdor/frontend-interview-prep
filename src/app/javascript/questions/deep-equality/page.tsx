"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

// 1. Problem Statement & Example
const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Deep Equality Check</h1>
    <p className="mb-2">
      Write a function <code>deepEqual(a, b)</code> that checks if two values are deeply equal. It should compare objects, arrays, primitives, and handle nested structures.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`deepEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] }) // true
deepEqual({ a: 1 }, { a: 1, b: 2 }) // false`}</pre>
  </Card>
);

const starterCode = `/**
 * Check if two values are deeply equal.
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
function deepEqual(a, b) {
  // Your code here
}

// Usage example:
console.log(deepEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] })); // true`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }
  return true;
}`}</pre>
    <p>
      This function recursively checks for equality of primitives, arrays, and objects, including nested structures.
    </p>
  </Card>
);

export default function DeepEqualityPage() {
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
