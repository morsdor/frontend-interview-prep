"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Clone a Graph (Handle Cycles)</h1>
    <p className="mb-2">
      Write a function <code>cloneGraph(node)</code> that deep clones a graph, handling cycles. Each node has a <code>val</code> and <code>neighbors</code> array.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`// Node definition:
// function Node(val, neighbors) {
//   this.val = val;
//   this.neighbors = neighbors || [];
// }
const node1 = { val: 1, neighbors: [] };
const node2 = { val: 2, neighbors: [] };
node1.neighbors.push(node2);
node2.neighbors.push(node1);
const clone = cloneGraph(node1);
console.log(clone !== node1 && clone.val === 1); // true`}</pre>
  </Card>
);

const starterCode = `/**
 * Clone a graph (handle cycles).
 * @param {Node} node
 * @returns {Node}
 */
function cloneGraph(node) {
  // Your code here
}

// Usage example:
function Node(val, neighbors) {
  this.val = val;
  this.neighbors = neighbors || [];
}
const node1 = new Node(1);
const node2 = new Node(2);
node1.neighbors.push(node2);
node2.neighbors.push(node1);
const clone = cloneGraph(node1);
console.log(clone !== node1 && clone.val === 1); // true`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function cloneGraph(node, map = new Map()) {
  if (!node) return null;
  if (map.has(node)) return map.get(node);
  const clone = { val: node.val, neighbors: [] };
  map.set(node, clone);
  for (const neighbor of node.neighbors) {
    clone.neighbors.push(cloneGraph(neighbor, map));
  }
  return clone;
}`}</pre>
    <p>
      This recursive function uses a <code>Map</code> to avoid infinite loops and handle cycles when cloning graphs.
    </p>
  </Card>
);

export default function CloneGraphPage() {
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
