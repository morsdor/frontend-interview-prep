import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "@/components/editor/CodeEditor";

export const metadata: Metadata = {
  title: "Debounce Function - JavaScript Questions",
  description: "Implement a debounce function in JavaScript",
};

const initialCode = `/**
 * Creates a debounced function that delays invoking the provided function
 * until after 'delay' milliseconds have elapsed since the last time it was invoked.
 * @param {Function} func - The function to debounce
 * @param {number} delay - The number of milliseconds to delay
 * @param {Object} options - Optional configuration
 * @param {boolean} options.leading - Whether to invoke the function on the leading edge
 * @return {Function} - The debounced function
 */
function debounce(func, delay, { leading = false } = {}) {
  // Your implementation here
  return function() {
    // TODO: Implement debounce logic
  };
}

// Example usage:
const debouncedLog = debounce(console.log, 300);

// Test it in browser console:
// for (let i = 0; i < 5; i++) {
//   setTimeout(() => debouncedLog(i), i * 100);
// }
// Should only log: 4
`;

const solutionCode = `function debounce(func, delay, { leading = false } = {}) {
  let timeoutId;
  let lastExecuted = 0;
  
  return function(...args) {
    const context = this;
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted;
    
    const execute = () => {
      lastExecuted = Date.now();
      func.apply(context, args);
    };
    
    clearTimeout(timeoutId);
    
    if (leading && timeSinceLastExecution >= delay) {
      execute();
    }
    
    timeoutId = setTimeout(() => {
      if (!leading) {
        execute();
      }
    }, delay);
  };
}`;

export default function DebounceQuestion() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-8">
        <header className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Debounce Function
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-0"
              >
                Functions
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0"
              >
                Intermediate
              </Badge>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Learn how to implement a debounce function to optimize performance by limiting the rate at which a function can fire.
          </p>
        </header>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-xl flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Problem Statement
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Implement a debounce function that limits the rate at which a function can fire.
                A debounced function will only execute after a certain amount of time has passed
                since its last invocation. This is particularly useful for performance optimization
                in scenarios like window resizing, scroll events, or search input fields.
              </p>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Requirements
              </h3>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    The function should accept a function to debounce and a delay in milliseconds
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    It should return a new function that can be called multiple times
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    If the debounced function is called again before the delay has passed, the previous call should be canceled
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Support a <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">leading</code> option to trigger the function on the leading edge
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Maintain the correct <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">this</code> context and arguments
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Examples:</h3>
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-x-auto text-sm border border-gray-200 dark:border-gray-700">
                {`// Basic usage
const debounced = debounce(console.log, 300);
debounced('Hello'); // (after 300ms) logs: 'Hello'
debounced('World'); // cancels previous call, then (after 300ms) logs: 'World'

// With leading option
const leadingDebounced = debounce(console.log, 300, { leading: true });
leadingDebounced('First'); // logs: 'First' (immediately)
leadingDebounced('Second'); // (after 300ms) logs: 'Second'`}
              </pre>
            </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Your Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <CodeEditor 
                initialCode={initialCode}
                language="javascript"
                showLineNumbers
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Implementation:</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">{solutionCode}</pre>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Explanation:</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>We maintain a <code>timeoutId</code> to track the current timeout and <code>lastExecuted</code> timestamp to handle the leading edge case.</li>
                  <li>Each time the debounced function is called, we clear any existing timeout to cancel previous calls.</li>
                  <li>If <code>leading</code> is true and enough time has passed since the last execution, we execute the function immediately.</li>
                  <li>We then set a new timeout to execute the function after the delay if we're not in leading mode or if we're in leading mode but the function hasn't been executed yet.</li>
                  <li>The function maintains the correct <code>this</code> context and forwards all arguments to the original function.</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Time/Space Complexity:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  <li><strong>Time Complexity:</strong> O(1) for each function call, though the wrapped function's time complexity remains unchanged.</li>
                  <li><strong>Space Complexity:</strong> O(1) as we only store a few variables regardless of input size.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
