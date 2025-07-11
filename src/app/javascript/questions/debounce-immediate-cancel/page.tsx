"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Debounce: Immediate & Cancel</h1>
    <p className="mb-2">
      Enhance the debounce function to support immediate execution (leading edge) and a <code>cancel</code> method to cancel pending execution.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const debounced = debounce(console.log, 300, { immediate: true });
debounced(1); // runs immediately
setTimeout(() => debounced(2), 100); // ignored
setTimeout(() => debounced.cancel(), 150); // cancels any pending
`}</pre>
  </Card>
);

const starterCode = `/**
 * Debounce with immediate and cancel
 * @param {Function} fn
 * @param {number} delay
 * @param {Object} options
 * @returns {Function & { cancel: Function }}
 */
function debounce(fn, delay, { immediate = false } = {}) {
  // Your code here
}

// Usage example:
const debounced = debounce(console.log, 300, { immediate: true });
debounced(1);
setTimeout(() => debounced(2), 100);
setTimeout(() => debounced.cancel(), 150);`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function debounce(fn, delay, { immediate = false } = {}) {
  let timeoutId;
  let called = false;
  function debounced(...args) {
    if (immediate && !called) {
      fn.apply(this, args);
      called = true;
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (!immediate) fn.apply(this, args);
      called = false;
    }, delay);
  }
  debounced.cancel = () => {
    clearTimeout(timeoutId);
    called = false;
  };
  return debounced;
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>This debounce supports both immediate (leading) and trailing calls, and exposes a <code>cancel</code> method.</li>
      <li>On the first call (if <code>immediate</code>), the function runs immediately and blocks further calls until the delay passes.</li>
      <li>Any call to <code>cancel</code> clears the timeout and resets the state.</li>
      <li>Edge cases: If called rapidly, only the first (immediate) or last (trailing) call is executed. Cancel prevents any pending execution.</li>
      <li><strong>Time Complexity:</strong> O(1) per call. <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for search-as-you-type, form validation, or any UI event where you want to limit handler calls.</li>
    </ul>
  </Card>
);

export default function DebounceImmediateCancelPage() {
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
