"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Custom Iterator Implementation</h1>
    <p className="mb-2">
      Implement a custom iterator for an object that makes it iterable with <code>for...of</code>.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const obj = { start: 1, end: 3 };
obj[Symbol.iterator] = function* () {
  for (let i = this.start; i <= this.end; i++) yield i;
};
for (const n of obj) console.log(n); // 1, 2, 3`}</pre>
  </Card>
);

const starterCode = `/**
 * Make an object iterable
 */
const obj = { start: 1, end: 3 };
// Your code here

// Usage example:
// for (const n of obj) console.log(n); // 1, 2, 3
`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const obj = { start: 1, end: 3 };
obj[Symbol.iterator] = function* () {
  for (let i = this.start; i <= this.end; i++) yield i;
};`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Defines a generator on <code>Symbol.iterator</code> to make the object iterable.</li>
      <li>Edge cases: Handles any range, and works with <code>for...of</code>.</li>
      <li><strong>Time Complexity:</strong> O(n) for n in range. <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for custom data structures and advanced iteration patterns.</li>
    </ul>
  </Card>
);

export default function IteratorImplementPage() {
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
