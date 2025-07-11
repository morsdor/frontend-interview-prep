// src/components/markdown/MarkdownRenderer.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Customize markdown components here
          code({ node, inline, className, children, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { node?: any; inline?: boolean }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <pre className="rounded-md p-4 bg-gray-900 overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">
                {children}
              </code>
            );
          },
          // Add custom styling for other elements as needed
          a({ node, ...props }) {
            return <a className="text-blue-600 hover:underline" {...props} />;
          },
          ul({ node, ...props }) {
            return <ul className="list-disc pl-6 my-2" {...props} />;
          },
          ol({ node, ...props }) {
            return <ol className="list-decimal pl-6 my-2" {...props} />;
          },
          blockquote({ node, ...props }) {
            return <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />;
          },
          table({ node, ...props }) {
            return <table className="min-w-full divide-y divide-gray-200" {...props} />;
          },
          th({ node, ...props }) {
            return <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />;
          },
          td({ node, ...props }) {
            return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}