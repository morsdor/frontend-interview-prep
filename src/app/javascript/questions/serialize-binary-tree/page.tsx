"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Serialize/Deserialize Binary Tree</h1>
    <p className="mb-2">
      Implement <code>serialize(root)</code> and <code>deserialize(data)</code> for a binary tree. Use pre-order traversal and <code>null</code> for missing nodes.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`// Assume Node(val, left, right)
const root = new Node(1, new Node(2), new Node(3, null, new Node(4)));
const data = serialize(root);
const tree = deserialize(data);`}</pre>
  </Card>
);

const starterCode = `/**
 * Serialize and deserialize a binary tree
 */
function serialize(root) {
  // Your code here
}
function deserialize(data) {
  // Your code here
}

// Usage example:
function Node(val, left = null, right = null) {
  this.val = val;
  this.left = left;
  this.right = right;
}
const root = new Node(1, new Node(2), new Node(3, null, new Node(4)));
const data = serialize(root);
const tree = deserialize(data);`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function serialize(root) {
  const res = [];
  function dfs(node) {
    if (!node) {
      res.push("null");
      return;
    }
    res.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return res.join(",");
}
function deserialize(data) {
  const vals = data.split(",");
  function dfs() {
    const val = vals.shift();
    if (val === "null") return null;
    const node = { val: Number(val) };
    node.left = dfs();
    node.right = dfs();
    return node;
  }
  return dfs();
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Uses pre-order traversal to serialize the tree to a string.</li>
      <li><code>deserialize</code> reconstructs the tree recursively from the string.</li>
      <li>Edge cases: Handles null/empty trees, missing children.</li>
      <li><strong>Time Complexity:</strong> O(n) for n nodes. <strong>Space Complexity:</strong> O(n).</li>
      <li><strong>Real-world use:</strong> Useful for storing, transmitting, or cloning tree structures.</li>
    </ul>
  </Card>
);

export default function SerializeBinaryTreePage() {
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
