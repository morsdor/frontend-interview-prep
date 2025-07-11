"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Flatten Nested Generator</h1>
    <p className="mb-2">
      Write a generator function <code>flattenGen(arr)</code> that yields all values from a deeply nested array.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const arr = [1, [2, [3, 4]], 5];
for (const v of flattenGen(arr)) console.log(v); // 1 2 3 4 5`}</pre>
  </Card>
);

const starterCode = `/**
 * Flatten nested array with generator
 * @param {Array} arr
 */
function* flattenGen(arr) {
  // Your code here
}

// Usage example:
const arr = [1, [2, [3, 4]], 5];
for (const v of flattenGen(arr)) console.log(v); // 1 2 3 4 5`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function* flattenGen(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) yield* flattenGen(item);
    else yield item;
  }
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Uses recursion and <code>yield*</code> to flatten nested arrays.</li>
      <li>Edge cases: Handles empty arrays, deeply nested structures.</li>
      <li><strong>Time Complexity:</strong> O(n) for n elements. <strong>Space Complexity:</strong> O(d) for depth d.</li>
      <li><strong>Real-world use:</strong> Useful for streaming or lazy flattening of large datasets.</li>
    </ul>
  </Card>
);

export default function FlattenGeneratorPage() {
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
