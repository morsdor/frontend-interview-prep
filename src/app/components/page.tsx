import Link from "next/link";
import { componentQuestions } from "@/data/components/questions";

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
              Components Interview Questions
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Practice these common Components interview questions to ace your
              next interview.
            </p>
          </div>

          <div className="space-y-6">
            {componentQuestions.map((question) => (
              <Link
                key={question.id}
                href={`/components/${question.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {question.title}
                  </h2>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {question.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
