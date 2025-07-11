"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Polyfill: Object.create</h1>
    <p className="mb-2">
      Implement a polyfill for <code>Object.create</code> that creates a new object with the specified prototype.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const proto = { greet() { return "hi"; } };
const obj = myCreate(proto);
console.log(obj.greet()); // "hi"`}</pre>
  </Card>
);

const starterCode = `/**
 * Polyfill for Object.create
 * @param {Object|null} proto
 * @returns {Object}
 */
function myCreate(proto) {
  // Your code here
}

// Usage example:
const proto = { greet() { return "hi"; } };
const obj = myCreate(proto);
console.log(obj.greet()); // "hi"`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function myCreate(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Creates a new object with the given prototype using a constructor function.</li>
      <li>Edge cases: Handles <code>null</code> prototype.</li>
      <li><strong>Time Complexity:</strong> O(1). <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for inheritance and prototype chain manipulation.</li>
    </ul>
  </Card>
);

export default function ObjectCreatePolyfillPage() {
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
