import { PageLayout } from '@/components/layout/PageLayout';
import { Sidebar } from '@/components/sidebar/Sidebar';

export default function WebFundamentalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For now, using empty arrays until we add actual questions
  const categories: string[] = [];
  const difficulties: ('beginner' | 'intermediate' | 'advanced')[] = [];

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        <Sidebar 
          title="Web Fundamentals" 
          questions={[]}
          basePath="/web-fundamentals"
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
