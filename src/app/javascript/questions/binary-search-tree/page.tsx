"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Binary Search Tree: Insert & Search</h1>
    <p className="mb-2">
      Implement a <code>BinarySearchTree</code> class with <code>insert(value)</code> and <code>search(value)</code> methods.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const bst = new BinarySearchTree();
bst.insert(5);
bst.insert(3);
bst.insert(7);
console.log(bst.search(3)); // true
console.log(bst.search(10)); // false`}</pre>
  </Card>
);

const starterCode = `/**
 * Binary Search Tree class.
 */
class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  insert(value) {
    // Your code here
  }
  search(value) {
    // Your code here
  }
}

// Usage example:
const bst = new BinarySearchTree();
bst.insert(5);
bst.insert(3);
bst.insert(7);
console.log(bst.search(3)); // true`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  insert(value) {
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    let curr = this.root;
    while (true) {
      if (value < curr.value) {
        if (!curr.left) {
          curr.left = newNode;
          return;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = newNode;
          return;
        }
        curr = curr.right;
      }
    }
  }
  search(value) {
    let curr = this.root;
    while (curr) {
      if (value === curr.value) return true;
      curr = value < curr.value ? curr.left : curr.right;
    }
    return false;
  }
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Each node has <code>value</code>, <code>left</code>, and <code>right</code> pointers.</li>
      <li><code>insert</code> walks down the tree and inserts at the correct position.</li>
      <li><code>search</code> traverses left or right based on comparison.</li>
      <li>Edge cases: Handles empty tree and duplicate values.</li>
      <li><strong>Time Complexity:</strong> O(h) where h is tree height (O(log n) if balanced). <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Used in searching, sorting, and range queries.</li>
    </ul>
  </Card>
);

export default function BinarySearchTreePage() {
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
