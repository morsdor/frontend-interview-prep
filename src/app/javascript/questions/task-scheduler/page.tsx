"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Task Scheduler (Concurrency Control)</h1>
    <p className="mb-2">
      Implement a <code>TaskScheduler</code> class that schedules async tasks with a concurrency limit (max N tasks running at a time).
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const scheduler = new TaskScheduler(2);
const delay = ms => new Promise(res => setTimeout(res, ms));
scheduler.add(() => delay(100).then(() => console.log("A")));
scheduler.add(() => delay(50).then(() => console.log("B")));
scheduler.add(() => delay(10).then(() => console.log("C")));
// Only 2 tasks run concurrently.`}</pre>
  </Card>
);

const starterCode = `/**
 * TaskScheduler with concurrency control
 */
class TaskScheduler {
  constructor(limit) {
    // Your code here
  }
  add(task) {
    // Your code here
  }
}

// Usage example:
const scheduler = new TaskScheduler(2);
const delay = ms => new Promise(res => setTimeout(res, ms));
scheduler.add(() => delay(100).then(() => console.log("A")));
scheduler.add(() => delay(50).then(() => console.log("B")));
scheduler.add(() => delay(10).then(() => console.log("C")));`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`class TaskScheduler {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }
  add(task) {
    this.queue.push(task);
    this.run();
  }
  run() {
    if (this.running >= this.limit || this.queue.length === 0) return;
    const task = this.queue.shift();
    this.running++;
    task().finally(() => {
      this.running--;
      this.run();
    });
    this.run();
  }
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Keeps a queue of tasks and a counter of currently running tasks.</li>
      <li>When a task finishes, it starts the next one in the queue.</li>
      <li>Edge cases: Handles empty queue, synchronous and asynchronous tasks, and respects the concurrency limit.</li>
      <li><strong>Time Complexity:</strong> O(1) per add/run. <strong>Space Complexity:</strong> O(n) for n queued tasks.</li>
      <li><strong>Real-world use:</strong> Used in API batching, download/upload managers, and job queues.</li>
    </ul>
  </Card>
);

export default function TaskSchedulerPage() {
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
