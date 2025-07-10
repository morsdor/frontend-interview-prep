import { PageLayout } from '@/components/layout/PageLayout';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { reactQuestions as rawQuestions } from '@/data/react/questions';

interface QuestionData {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
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

const reactQuestions = rawQuestions as unknown as QuestionData[];

export default function ReactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = Array.from(
    new Set(reactQuestions.map((q: QuestionData) => q.category))
  ).sort();
  
  const difficulties = Array.from(
    new Set(reactQuestions.map((q: QuestionData) => q.difficulty))
  ) as Array<QuestionData['difficulty']>;

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        <Sidebar 
          title="React" 
          questions={reactQuestions.map(q => ({
            ...q,
            answer: q.code.solution,
            codeExample: q.code.initial
          }))}
          basePath="/react"
          categories={categories}
          difficulties={difficulties}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </PageLayout>
  );
}
