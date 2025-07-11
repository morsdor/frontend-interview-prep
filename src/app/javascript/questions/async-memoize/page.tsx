"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Async Memoization Utility</h1>
    <p className="mb-2">
      Write an <code>asyncMemoize(fn)</code> utility that caches the result of async functions by arguments, returning the cached promise if called again with the same arguments.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const fetchUser = asyncMemoize(async id => fetch(`/api/user/${id}`));
fetchUser(1); // fetches
fetchUser(1); // returns cached promise`}</pre>
  </Card>
);

const starterCode = `/**
 * Async memoization utility
 * @param {Function} fn
 * @returns {Function}
 */
function asyncMemoize(fn) {
  // Your code here
}

// Usage example:
const fetchUser = asyncMemoize(async id => fetch(`/api/user/${id}`));
fetchUser(1);
fetchUser(1);`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function asyncMemoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key);
  };
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Uses a Map to cache promises by argument key.</li>
      <li>Edge cases: Handles repeated calls, async errors, and different argument sets.</li>
      <li><strong>Time Complexity:</strong> O(1) per call. <strong>Space Complexity:</strong> O(n) for n unique argument sets.</li>
      <li><strong>Real-world use:</strong> Useful for caching expensive async operations like API calls.</li>
    </ul>
  </Card>
);

export default function AsyncMemoizePage() {
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
