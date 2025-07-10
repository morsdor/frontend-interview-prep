import Link from 'next/link';
import { reactQuestions } from '@/data/react/questions';

const mapDifficultyToText = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'Easy';
    case 'intermediate': return 'Medium';
    case 'advanced': return 'Hard';
    default: return difficulty;
  }
};

export default function ReactPage() {
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
              React Interview Questions
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Master React concepts and ace your frontend interviews with these practice questions.
            </p>
          </div>

          <div className="space-y-6">
            {reactQuestions.map((question) => (
              <Link 
                key={question.id}
                href={`/react/questions/${question.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {question.title}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    question.difficulty === 'beginner' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : question.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {mapDifficultyToText(question.difficulty)}
                  </span>
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
