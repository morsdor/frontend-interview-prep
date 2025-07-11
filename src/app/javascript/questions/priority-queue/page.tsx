"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Priority Queue</h1>
    <p className="mb-2">
      Implement a <code>PriorityQueue</code> class with <code>enqueue(value, priority)</code> and <code>dequeue()</code> methods. The queue should always dequeue the item with the highest priority (lowest number).
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const pq = new PriorityQueue();
pq.enqueue("A", 2);
pq.enqueue("B", 1);
pq.enqueue("C", 3);
console.log(pq.dequeue()); // "B"
console.log(pq.dequeue()); // "A"`}</pre>
  </Card>
);

const starterCode = `/**
 * Priority Queue class.
 */
class PriorityQueue {
  constructor() {
    // Your code here
    this.items = [];
  }
  enqueue(value, priority) {
    // Your code here
  }
  dequeue() {
    // Your code here
  }
}

// Usage example:
const pq = new PriorityQueue();
pq.enqueue("A", 2);
pq.enqueue("B", 1);
pq.enqueue("C", 3);
console.log(pq.dequeue()); // "B"
console.log(pq.dequeue()); // "A"`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(value, priority) {
    this.items.push({ value, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }
  dequeue() {
    return this.items.shift()?.value;
  }
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Each item is stored as an object with <code>value</code> and <code>priority</code>.</li>
      <li>On enqueue, the array is sorted by priority (lowest number = highest priority).</li>
      <li>Dequeue removes and returns the value with the highest priority.</li>
      <li>Edge cases: If the queue is empty, dequeue returns <code>undefined</code>.</li>
      <li><strong>Time Complexity:</strong> O(n log n) for enqueue (due to sort), O(1) for dequeue. <strong>Space Complexity:</strong> O(n).</li>
      <li><strong>Real-world use:</strong> Used in scheduling, pathfinding (A*), and task management systems.</li>
    </ul>
  </Card>
);

export default function PriorityQueuePage() {
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
