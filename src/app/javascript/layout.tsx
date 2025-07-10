import { PageLayout } from "@/components/layout/PageLayout";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { javascriptQuestions as rawQuestions } from "@/data/javascript/questions";
import type { Question, Question as QuestionType } from "@/types/questions";

// Create a type that matches the shape of our data
interface QuestionData {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  tags: string[];
  code: {
    initial: string;
    solution: string;
  };
  explanation?: string;
  hints?: string[];
  followUpQuestions?: string[];
  resources?: Array<{
    title: string;
    url: string;
  }>;
}

// Cast the imported questions to our local type
const javascriptQuestions = rawQuestions as unknown as Question[];

export default function JavaScriptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Extract categories and difficulties from questions
  const categories = Array.from(
    new Set(javascriptQuestions.map((q: Question) => q.category))
  ).sort();

  const difficulties = Array.from(
    new Set(javascriptQuestions.map((q: Question) => q.difficulty))
  ) as Array<Question["difficulty"]>;

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        <Sidebar
          title="JavaScript"
          questions={javascriptQuestions}
          basePath="/javascript/questions"
          categories={categories}
          difficulties={difficulties}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </PageLayout>
  );
}
