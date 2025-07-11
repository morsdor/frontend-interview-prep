"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Polyfill: Promise</h1>
    <p className="mb-2">
      Implement a polyfill for the <code>Promise</code> constructor supporting <code>then</code> and <code>catch</code> chaining. Support asynchronous resolution and rejection.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`const p = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve(42), 100);
});
p.then(val => console.log(val)); // 42`}</pre>
  </Card>
);

const starterCode = `/**
 * Polyfill for Promise (basic)
 * @param {Function} executor
 */
class MyPromise {
  constructor(executor) {
    // Your code here
  }
  then(onFulfilled, onRejected) {
    // Your code here
  }
  catch(onRejected) {
    // Your code here
  }
}

// Usage example:
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve(42), 100);
});
p.then(val => console.log(val)); // 42`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilled = [];
    this.onRejected = [];
    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onFulfilled.forEach(fn => fn(value));
      }
    };
    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejected.forEach(fn => fn(reason));
      }
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const fulfilled = (value) => {
        try {
          resolve(onFulfilled ? onFulfilled(value) : value);
        } catch (e) {
          reject(e);
        }
      };
      const rejected = (reason) => {
        try {
          if (onRejected) resolve(onRejected(reason));
          else reject(reason);
        } catch (e) {
          reject(e);
        }
      };
      if (this.state === "fulfilled") setTimeout(() => fulfilled(this.value), 0);
      else if (this.state === "rejected") setTimeout(() => rejected(this.reason), 0);
      else {
        this.onFulfilled.push(fulfilled);
        this.onRejected.push(rejected);
      }
    });
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Implements basic Promise state machine: <code>pending</code>, <code>fulfilled</code>, <code>rejected</code>.</li>
      <li>Supports chaining via <code>then</code> and <code>catch</code> methods.</li>
      <li>Asynchronous resolution is simulated with <code>setTimeout</code> in <code>then</code> for already settled promises.</li>
      <li>Edge cases: Handles executor errors, multiple <code>then</code> calls, and chaining.</li>
      <li><strong>Time Complexity:</strong> O(1) per then/catch. <strong>Space Complexity:</strong> O(n) for queued callbacks.</li>
      <li><strong>Real-world use:</strong> Useful for understanding how native Promises work and for interview questions on async primitives.</li>
    </ul>
  </Card>
);

export default function PromisePolyfillPage() {
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
