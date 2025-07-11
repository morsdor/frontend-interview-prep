"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Advanced Throttle (Leading & Trailing)</h1>
    <p className="mb-2">
      Write a <code>throttle</code> function that supports both leading and trailing edge execution via options.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const throttled = throttle(console.log, 100, { leading: true, trailing: true });
throttled(1); // runs immediately
setTimeout(() => throttled(2), 50); // ignored
setTimeout(() => throttled(3), 150); // runs at 150ms`}</pre>
  </Card>
);

const starterCode = `/**
 * Throttle with leading/trailing options
 * @param {Function} fn
 * @param {number} wait
 * @param {Object} options
 * @returns {Function}
 */
function throttle(fn, wait, options = { leading: true, trailing: true }) {
  // Your code here
}

// Usage example:
const throttled = throttle(console.log, 100, { leading: true, trailing: true });
throttled(1);
setTimeout(() => throttled(2), 50);
setTimeout(() => throttled(3), 150);
`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function throttle(fn, wait, options = { leading: true, trailing: true }) {
  let lastCall = 0, timeout, args, context;
  return function(...a) {
    const now = Date.now();
    if (!lastCall && options.leading === false) lastCall = now;
    const remaining = wait - (now - lastCall);
    context = this;
    args = a;
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      fn.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => {
        lastCall = options.leading === false ? 0 : Date.now();
        timeout = null;
        fn.apply(context, args);
      }, remaining);
    }
  };
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Supports both leading and trailing execution via options.</li>
      <li>Edge cases: Handles rapid calls, disables leading/trailing as needed.</li>
      <li><strong>Time Complexity:</strong> O(1) per call. <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for optimizing scroll, resize, and frequent event handlers.</li>
    </ul>
  </Card>
);

export default function AdvancedThrottlePage() {
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
