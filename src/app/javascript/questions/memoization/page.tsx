"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Memoization</h1>
    <p className="mb-2">
      Write a function <code>memoize(fn)</code> that caches the results of function calls. If the function is called again with the same arguments, return the cached result instead of computing it again.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const slowFn = x => { for (let i = 0; i < 1e6; i++); return x * 2; };
const fastFn = memoize(slowFn);
fastFn(5); // computed
fastFn(5); // cached`}</pre>
  </Card>
);

const starterCode = `/**
 * Memoize a function.
 * @param {Function} fn
 * @returns {Function}
 */
function memoize(fn) {
  // Your code here
}

// Usage example:
const slowFn = x => { for (let i = 0; i < 1e6; i++); return x * 2; };
const fastFn = memoize(slowFn);
console.log(fastFn(5)); // computed
console.log(fastFn(5)); // cached`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`}</pre>
    <p>
      This function uses a <code>Map</code> to cache results by argument signature, improving performance for repeated calls.
    </p>
  </Card>
);

export default function MemoizationPage() {
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
