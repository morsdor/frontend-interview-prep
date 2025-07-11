"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Promisify a Callback Function</h1>
    <p className="mb-2">
      Write a function <code>promisify(fn)</code> that converts a Node.js-style callback function to a function that returns a Promise.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function legacyAdd(a, b, cb) { setTimeout(() => cb(null, a + b), 100); }
const addAsync = promisify(legacyAdd);
addAsync(2, 3).then(res => console.log(res)); // 5`}</pre>
  </Card>
);

const starterCode = `/**
 * Promisify a Node.js-style callback function.
 * @param {Function} fn
 * @returns {Function}
 */
function promisify(fn) {
  // Your code here
}

// Usage example:
function legacyAdd(a, b, cb) { setTimeout(() => cb(null, a + b), 100); }
const addAsync = promisify(legacyAdd);
addAsync(2, 3).then(res => console.log(res)); // 5`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}`}</pre>
    <p>
      This function wraps the callback-based function and returns a Promise, resolving or rejecting based on the callback result.
    </p>
  </Card>
);

export default function PromisifyPage() {
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
