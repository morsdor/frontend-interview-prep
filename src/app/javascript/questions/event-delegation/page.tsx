"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Event Delegation Utility</h1>
    <p className="mb-2">
      Write a function <code>delegate(parent, selector, eventType, handler)</code> that attaches an event listener to a parent element and calls the handler when a child matching the selector triggers the event.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`// Usage: delegate(document.body, 'button', 'click', e => ...);`}</pre>
  </Card>
);

const starterCode = `/**
 * Event delegation utility
 * @param {Element} parent
 * @param {string} selector
 * @param {string} eventType
 * @param {Function} handler
 */
function delegate(parent, selector, eventType, handler) {
  // Your code here
}

// Usage example:
delegate(document.body, 'button', 'click', e => alert('Button clicked!'));
`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function delegate(parent, selector, eventType, handler) {
  parent.addEventListener(eventType, function(event) {
    let target = event.target;
    while (target && target !== parent) {
      if (target.matches(selector)) {
        handler.call(target, event);
        break;
      }
      target = target.parentElement;
    }
  });
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Attaches a single listener to the parent and checks if the event target matches the selector.</li>
      <li>Edge cases: Handles bubbling, dynamic children, and event propagation.</li>
      <li><strong>Time Complexity:</strong> O(h) where h is the DOM depth. <strong>Space Complexity:</strong> O(1).</li>
      <li><strong>Real-world use:</strong> Useful for efficiently handling events for many or dynamic child elements.</li>
    </ul>
  </Card>
);

export default function EventDelegationPage() {
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
