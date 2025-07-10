import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { CodeEditor } from '@/components/editor/CodeEditor';

export const metadata: Metadata = {
  title: 'Flatten Array - JavaScript Questions',
  description: 'Practice flattening arrays in JavaScript'
};

const initialCode = `/**
 * Write a function that flattens a nested array.
 * The function should handle multiple levels of nesting.
 * 
 * Example:
 * flatten([1, [2, [3, [4]], 5]]) => [1, 2, 3, 4, 5]
 */

function flatten(arr) {
  // Your code here
  return [];
}

// Test cases
console.log(flatten([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]
console.log(flatten([1, [2, [3, [4, [5]]]]])); // [1, 2, 3, 4, 5]
console.log(flatten([1, 2, 3, 4, 5])); // [1, 2, 3, 4, 5]
console.log(flatten([])); // []
`;

const solutionCode = `/**
 * Solution using recursion
 */
function flatten(arr) {
  return arr.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten(val) : val);
  }, []);
}

// Alternative solution using flat() (ES2019+)
// function flatten(arr) {
//   return arr.flat(Infinity);
// }
`;

export default function ArrayFlattenQuestion() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Flatten Array</h1>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Arrays
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Beginner
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem Statement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Write a function that takes a nested array and returns a new array with all values flattened.
            The function should handle multiple levels of nesting.
          </p>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Examples:</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              <code className="text-sm">
{`flatten([1, [2, [3, [4]], 5]]) // [1, 2, 3, 4, 5]
flatten([1, [2, [3, [4, [5]]]]]) // [1, 2, 3, 4, 5]
flatten([1, 2, 3, 4, 5]) // [1, 2, 3, 4, 5]
flatten([]) // []`}
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeEditor
            initialCode={initialCode}
            height={400}
            showConsole={true}
            showExecutionTime={true}
            language="javascript"
            theme="dark"
          />
        </CardContent>
      </Card>

      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle>Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeEditor
            initialCode={solutionCode}
            height={200}
            readOnly={true}
            showRunButton={false}
            language="javascript"
            theme="dark"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Explanation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            The solution uses a recursive approach to flatten the array. Here's how it works:
          </p>
          
          <ol className="list-decimal pl-6 space-y-2">
            <li>We use the <code>reduce</code> method to iterate through each element of the array.</li>
            <li>For each element, we check if it's an array using <code>Array.isArray()</code>.</li>
            <li>If it's an array, we recursively call <code>flatten</code> on it.</li>
            <li>If it's not an array, we add it directly to the accumulator.</li>
            <li>We use <code>concat</code> to combine the current accumulator with the current value (or flattened array).</li>
          </ol>
          
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Time Complexity:</strong> O(n) where n is the total number of elements in all nested arrays.
            <br />
            <strong>Space Complexity:</strong> O(d) where d is the maximum depth of the array due to the call stack.
          </p>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <h4 className="font-semibold mb-2">Alternative Solution (ES2019+):</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              In modern JavaScript, you can use the <code>flat()</code> method with <code>Infinity</code> 
              to flatten an array of any depth: <code>arr.flat(Infinity)</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
