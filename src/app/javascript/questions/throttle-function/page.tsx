"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

// 1. Problem Statement & Example
const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Implement a Throttle Function</h1>
    <p className="mb-2">
      Write a function <code>throttle(func, wait)</code> that returns a throttled version of <code>func</code>.
      The throttled function should only call <code>func</code> at most once every <code>wait</code> milliseconds, no matter how many times it is triggered.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const throttled = throttle(console.log, 1000);
throttled("A"); // prints "A"
throttled("B"); // ignored if called within 1s
// ...after 1s
throttled("C"); // prints "C"`}</pre>
  </Card>
);

// 2. Code Editor & Output
const starterCode = `/**
 * Throttle a function so it's called at most once every 'wait' ms.
 * @param {Function} func - The function to throttle
 * @param {number} wait - Milliseconds to wait
 * @returns {Function}
 */
function throttle(func, wait) {
  // Your code here
}

// Usage example:
const throttled = throttle(console.log, 1000);
throttled("A");
throttled("B"); // ignored if called within 1s
setTimeout(() => throttled("C"), 1100); // prints "C"`;

// 3. Solution & Explanation
const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function throttle(func, wait) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}`}</pre>
    <p>
      This implementation stores the timestamp of the last call and only allows <code>func</code> to run if enough time has passed.
      It ignores calls that happen within the <code>wait</code> window.
    </p>
  </Card>
);

export default function ThrottleFunctionPage() {
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
