import Link from 'next/link';

export default function WebFundamentalsPage() {
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
              Web Fundamentals
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Master the core concepts of web development including HTML, CSS, and browser APIs.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-300">
              Content coming soon. This section will cover web fundamentals topics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
