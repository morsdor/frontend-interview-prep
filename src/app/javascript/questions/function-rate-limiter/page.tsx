"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Function Rate Limiter</h1>
    <p className="mb-2">
      Implement a rate limiter for a function so it can only be called N times per M milliseconds.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const limited = rateLimit(console.log, 2, 1000);
limited(1); // prints
limited(2); // prints
limited(3); // ignored (limit reached)
setTimeout(() => limited(4), 1100); // prints (window reset)`}</pre>
  </Card>
);

const starterCode = `/**
 * Rate limit a function.
 * @param {Function} fn
 * @param {number} maxCalls
 * @param {number} windowMs
 * @returns {Function}
 */
function rateLimit(fn, maxCalls, windowMs) {
  // Your code here
}

// Usage example:
const limited = rateLimit(console.log, 2, 1000);
limited(1);
limited(2);
limited(3);
setTimeout(() => limited(4), 1100);`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function rateLimit(fn, maxCalls, windowMs) {
  let calls = 0;
  let windowStart = Date.now();
  return function (...args) {
    const now = Date.now();
    if (now - windowStart > windowMs) {
      windowStart = now;
      calls = 0;
    }
    if (calls < maxCalls) {
      calls++;
      fn.apply(this, args);
    }
  };
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>This function tracks the number of calls and the start of the time window.</li>
      <li>When the window expires, the count resets. Calls above the limit in the window are ignored.</li>
      <li>Edge cases: Handles rapid bursts and resets correctly after the window.</li>
      <li><strong>Time Complexity:</strong> O(1) per call. <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for API rate limiting, UI throttling, or controlling expensive operations.</li>
    </ul>
  </Card>
);

export default function FunctionRateLimiterPage() {
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
