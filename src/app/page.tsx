import Link from "next/link";

const categories = [
  {
    title: "JavaScript",
    description: "Master JavaScript fundamentals, closures, promises, and more",
    href: "/javascript",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "React",
    description: "Dive deep into React concepts, hooks, and performance",
    href: "/react",
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "System Design",
    description: "Learn to design scalable frontend architectures",
    href: "/system-design",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Algorithms",
    description: "Practice common frontend algorithms and data structures",
    href: "/algorithms",
    color: "from-green-500 to-teal-500",
  },
];

function CategoryCard({
  title,
  description,
  href,
  color,
}: {
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <div
        className={`bg-gradient-to-r ${color} p-1 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full`}
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg h-full">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Frontend Interview Prep
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Master your frontend development interview with hands-on coding
            challenges and in-depth explanations
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/javascript"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Frontend Interview Prep. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
