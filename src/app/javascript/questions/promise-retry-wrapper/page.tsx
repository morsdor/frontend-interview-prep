"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Promise Retry Wrapper</h1>
    <p className="mb-2">
      Write a function <code>retry(fn, attempts, delay)</code> that retries a promise-returning function up to <code>attempts</code> times with <code>delay</code> ms between attempts.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`let count = 0;
const unreliable = () => Promise.resolve(++count).then(n => n < 3 ? Promise.reject("fail") : n);
retry(unreliable, 5, 100).then(console.log); // 3`}</pre>
  </Card>
);

const starterCode = `/**
 * Retry a promise-returning function.
 * @param {Function} fn
 * @param {number} attempts
 * @param {number} delay
 * @returns {Promise}
 */
function retry(fn, attempts, delay) {
  // Your code here
}

// Usage example:
let count = 0;
const unreliable = () => Promise.resolve(++count).then(n => n < 3 ? Promise.reject("fail") : n);
retry(unreliable, 5, 100).then(console.log); // 3`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function retry(fn, attempts, delay) {
  return new Promise((resolve, reject) => {
    function attempt(n) {
      fn().then(resolve).catch(err => {
        if (n === 0) reject(err);
        else setTimeout(() => attempt(n - 1), delay);
      });
    }
    attempt(attempts);
  });
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Attempts to call <code>fn</code> up to <code>attempts</code> times, with <code>delay</code> ms between retries.</li>
      <li>Resolves on first success, rejects if all attempts fail.</li>
      <li>Edge cases: Handles synchronous and asynchronous errors, and 0 attempts.</li>
      <li><strong>Time Complexity:</strong> O(attempts). <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for network requests, flaky APIs, or any operation that may fail transiently.</li>
    </ul>
  </Card>
);

export default function PromiseRetryWrapperPage() {
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
