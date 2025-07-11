"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Custom Event Emitter</h1>
    <p className="mb-2">
      Implement a class <code>EventEmitter</code> that allows subscribing to events with <code>on</code>, unsubscribing with <code>off</code>, and emitting events with <code>emit</code>.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const emitter = new EventEmitter();
const handler = msg => console.log(msg);
emitter.on("event", handler);
emitter.emit("event", "Hello"); // prints "Hello"
emitter.off("event", handler);
emitter.emit("event", "World"); // nothing happens`}</pre>
  </Card>
);

const starterCode = `/**
 * Custom EventEmitter class.
 */
class EventEmitter {
  // Your code here
}

// Usage example:
const emitter = new EventEmitter();
const handler = msg => console.log(msg);
emitter.on("event", handler);
emitter.emit("event", "Hello");
emitter.off("event", handler);
emitter.emit("event", "World");`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, handler) {
    (this.events[event] ||= []).push(handler);
  }
  off(event, handler) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(h => h !== handler);
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach(h => h(...args));
  }
}`}</pre>
    <p>
      This class manages event subscriptions in an object and provides <code>on</code>, <code>off</code>, and <code>emit</code> methods for event-driven programming.
    </p>
  </Card>
);

export default function EventEmitterPage() {
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
