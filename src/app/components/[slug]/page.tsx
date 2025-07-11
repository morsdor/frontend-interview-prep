import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/data/components/markdown'));
  return files.map(filename => ({
    slug: filename.replace(/\.md$/, '')
  }));
}

export default async function ComponentPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const filePath = path.join(process.cwd(), 'src/data/components/markdown', `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    notFound();
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContents);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{frontmatter?.title || slug}</h1>
      <div className="prose max-w-none">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}