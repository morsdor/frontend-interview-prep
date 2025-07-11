"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Pub/Sub System</h1>
    <p className="mb-2">
      Implement a simple publish/subscribe system with <code>subscribe</code>, <code>unsubscribe</code>, and <code>publish</code> methods.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const pubsub = new PubSub();
const sub = pubsub.subscribe("event", msg => console.log(msg));
pubsub.publish("event", "hello"); // logs "hello"
pubsub.unsubscribe(sub);`}</pre>
  </Card>
);

const starterCode = `/**
 * Pub/Sub system.
 */
class PubSub {
  constructor() {
    // Your code here
  }
  subscribe(event, handler) {
    // Your code here
  }
  unsubscribe(token) {
    // Your code here
  }
  publish(event, ...args) {
    // Your code here
  }
}

// Usage example:
const pubsub = new PubSub();
const sub = pubsub.subscribe("event", msg => console.log(msg));
pubsub.publish("event", "hello");
pubsub.unsubscribe(sub);`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`class PubSub {
  constructor() {
    this.events = {};
    this.subId = 0;
  }
  subscribe(event, handler) {
    const token = ++this.subId;
    (this.events[event] ||= []).push({ handler, token });
    return token;
  }
  unsubscribe(token) {
    for (const event in this.events) {
      this.events[event] = this.events[event].filter(sub => sub.token !== token);
    }
  }
  publish(event, ...args) {
    (this.events[event] || []).forEach(sub => sub.handler(...args));
  }
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Keeps a registry of events and their subscribers with unique tokens.</li>
      <li>Edge cases: Handles multiple events, duplicate handlers, and unsubscribing.</li>
      <li><strong>Time Complexity:</strong> O(n) for n subscribers. <strong>Space Complexity:</strong> O(n).</li>
      <li><strong>Real-world use:</strong> Used in event-driven architectures, UI frameworks, and communication between modules.</li>
    </ul>
  </Card>
);

export default function PubSubPage() {
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
