"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Polyfill: Promise.all</h1>
    <p className="mb-2">
      Implement a polyfill for <code>Promise.all</code>. The function should accept an array of promises and return a promise that resolves when all have resolved, or rejects if any reject.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);
PromiseAll([p1, p2, p3]).then(console.log); // [1,2,3]`}</pre>
  </Card>
);

const starterCode = `/**
 * Polyfill for Promise.all
 * @param {Array<Promise>} promises
 * @returns {Promise}
 */
function PromiseAll(promises) {
  // Your code here
}

// Usage example:
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);
PromiseAll([p1, p2, p3]).then(console.log); // [1,2,3]`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function PromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(val => {
          results[i] = val;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
    if (promises.length === 0) resolve([]);
  });
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>This implementation creates a new promise and tracks completion count and results array.</li>
      <li>Each input is resolved (in case it's already a value), and its result is stored at the correct index.</li>
      <li>If any promise rejects, the returned promise rejects immediately.</li>
      <li>If all complete, the results are resolved in order.</li>
      <li>Edge case: If the input array is empty, it resolves immediately with an empty array.</li>
      <li><strong>Time Complexity:</strong> O(n) for n promises. <strong>Space Complexity:</strong> O(n).</li>
      <li><strong>Real-world use:</strong> Useful for batching async operations and waiting for all to complete, e.g., fetching multiple APIs in parallel.</li>
    </ul>
  </Card>
);

export default function PromiseAllPolyfillPage() {
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
