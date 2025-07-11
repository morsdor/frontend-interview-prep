"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

// 1. Problem Statement & Example
const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Compose Functions</h1>
    <p className="mb-2">
      Write a <code>compose(...funcs)</code> function that composes multiple functions from right to left. Each function takes the output of the next as its input.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const add = x => x + 1;
const double = x => x * 2;
const composed = compose(add, double);
console.log(composed(3)); // 7 (double first, then add)`}</pre>
  </Card>
);

const starterCode = `/**
 * Compose functions from right to left.
 * @param  {...Function} funcs
 * @returns {Function}
 */
function compose(...funcs) {
  // Your code here
}

// Usage example:
const add = x => x + 1;
const double = x => x * 2;
const composed = compose(add, double);
console.log(composed(3)); // 7`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function compose(...funcs) {
  return function (input) {
    return funcs.reduceRight((acc, fn) => fn(acc), input);
  };
}`}</pre>
    <p>
      <code>compose</code> applies functions from right to left, passing the result of each to the next.
    </p>
  </Card>
);

export default function ComposeFunctionsPage() {
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
