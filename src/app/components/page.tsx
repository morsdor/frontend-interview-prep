import Link from 'next/link';

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/" 
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
            >
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
              UI Components
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Explore and practice building reusable UI components with React and TypeScript.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-300">
              This section will include component implementation challenges and best practices.
              Coming soon with interactive examples and code walkthroughs.
            </p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Button Component</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Create a reusable button with variants, sizes, and proper accessibility.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Modal Component</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Build an accessible modal with focus management and keyboard navigation.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Form Components</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Implement reusable form inputs with validation and error states.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Data Display</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Create tables, cards, and other data visualization components.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Navigation</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Build responsive navigation menus and tabs.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Feedback Components</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Create toast notifications, loaders, and other feedback elements.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Component Development Guidelines
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Follow the Single Responsibility Principle</li>
              <li>Use TypeScript for type safety</li>
              <li>Implement proper accessibility (a11y) features</li>
              <li>Write comprehensive unit tests</li>
              <li>Document props and usage examples</li>
              <li>Optimize for performance</li>
              <li>Support dark/light themes</li>
              <li>Make components responsive</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
