"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Async Pool (Concurrency Control)</h1>
    <p className="mb-2">
      Write a function <code>asyncPool(poolLimit, array, iteratorFn)</code> that runs async tasks with a concurrency limit, returning results in order.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const delay = ms => new Promise(res => setTimeout(res, ms));
asyncPool(2, [1,2,3,4], n => delay(100).then(() => n)); // Resolves to [1,2,3,4]`}</pre>
  </Card>
);

const starterCode = `/**
 * Async pool with concurrency control
 * @param {number} poolLimit
 * @param {Array} array
 * @param {Function} iteratorFn
 * @returns {Promise<Array>}
 */
function asyncPool(poolLimit, array, iteratorFn) {
  // Your code here
}

// Usage example:
const delay = ms => new Promise(res => setTimeout(res, ms));
asyncPool(2, [1,2,3,4], n => delay(100).then(() => n));
`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);
    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) await Promise.race(executing);
    }
  }
  return Promise.all(ret);
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Runs up to <code>poolLimit</code> tasks concurrently, starting new ones as others finish.</li>
      <li>Edge cases: Handles empty arrays, synchronous and asynchronous iterator functions.</li>
      <li><strong>Time Complexity:</strong> O(n). <strong>Space Complexity:</strong> O(poolLimit).</li>
      <li><strong>Real-world use:</strong> Useful for batching network requests or processing large datasets efficiently.</li>
    </ul>
  </Card>
);

export default function AsyncPoolPage() {
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
