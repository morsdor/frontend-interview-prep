"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/editor/CodeEditor";

const problem = (
  <Card className="mb-6 p-6">
    <h1 className="text-2xl font-bold mb-2">Find All Anagrams in a String</h1>
    <p className="mb-2">
      Write a function <code>findAnagrams(s, p)</code> that finds all start indices of <code>p</code>'s anagrams in string <code>s</code>.
    </p>
    <b>Example:</b>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`findAnagrams("cbaebabacd", "abc"); // [0,6]`}</pre>
  </Card>
);

const starterCode = `/**
 * Find all anagrams in a string.
 * @param {string} s
 * @param {string} p
 * @returns {number[]}
 */
function findAnagrams(s, p) {
  // Your code here
}

// Usage example:
console.log(findAnagrams("cbaebabacd", "abc")); // [0,6]`;

const solution = (
  <Card className="mt-8 p-6">
    <h2 className="text-xl font-semibold mb-2">Solution</h2>
    <pre className="bg-black text-green-200 rounded p-3 overflow-x-auto mt-2 mb-0 text-sm">{`function findAnagrams(s, p) {
  const res = [];
  const need = {};
  for (const c of p) need[c] = (need[c] || 0) + 1;
  let left = 0, right = 0, count = p.length;
  while (right < s.length) {
    if (need[s[right++]]-- > 0) count--;
    if (count === 0) res.push(left);
    if (right - left === p.length && need[s[left++]]++ >= 0) count++;
  }
  return res;
}`}</pre>
    <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>Uses a sliding window and hash map to track character counts.</li>
      <li>Edge cases: Handles repeated characters, empty strings, and overlapping matches.</li>
      <li><strong>Time Complexity:</strong> O(n) for n in s. <strong>Space Complexity:</strong> O(1) (fixed alphabet size).</li>
      <li><strong>Real-world use:</strong> Useful in text analysis, searching, and bioinformatics.</li>
    </ul>
  </Card>
);

export default function AnagramsInStringPage() {
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
