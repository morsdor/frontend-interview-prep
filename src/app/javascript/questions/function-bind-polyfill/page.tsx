"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Polyfill: Function.prototype.bind</h1>
    <p className="mb-2">
      Implement a polyfill for <code>Function.prototype.bind</code> that returns a new function with bound <code>this</code> and arguments.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function add(a, b) { return a + b; }
const add5 = add.myBind(null, 5);
console.log(add5(3)); // 8`}</pre>
  </Card>
);

const starterCode = `/**
 * Polyfill for Function.prototype.bind
 * @param {any} thisArg
 * @param {...any} args
 * @returns {Function}
 */
Function.prototype.myBind = function(thisArg, ...args) {
  // Your code here
}

// Usage example:
function add(a, b) { return a + b; }
const add5 = add.myBind(null, 5);
console.log(add5(3)); // 8`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`Function.prototype.myBind = function(thisArg, ...args) {
  const fn = this;
  return function(...a) {
    return fn.apply(thisArg, args.concat(a));
  };
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Returns a new function with <code>this</code> and arguments bound.</li>
      <li>Edge cases: Handles partial application and context binding.</li>
      <li><strong>Time Complexity:</strong> O(1) per call. <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for function context management and currying.</li>
    </ul>
  </Card>
);

export default function FunctionBindPolyfillPage() {
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
