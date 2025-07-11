"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useState } from 'react';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  allowRawHtml?: boolean;
  enableMath?: boolean;
}

export default function MarkdownRenderer({ 
  content, 
  className = '', 
  allowRawHtml = false,
  enableMath = true 
}: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const remarkPlugins = [remarkGfm];
  const rehypePlugins = [rehypeHighlight];

  if (enableMath) {
    remarkPlugins.push(remarkMath);
    rehypePlugins.push(rehypeKatex);
  }

  if (allowRawHtml) {
    rehypePlugins.push(rehypeRaw);
  }

  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          // Enhanced code blocks with copy functionality
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');
            
            if (!inline && match) {
              return (
                <div className="relative group">
                  <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 px-4 py-2 rounded-t-lg">
                    <span className="text-sm text-gray-300 font-medium">
                      {language}
                    </span>
                    <button
                      onClick={() => copyToClipboard(codeString)}
                      className="text-gray-400 hover:text-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      title="Copy code"
                    >
                      {copiedCode === codeString ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <pre className="rounded-t-none rounded-b-lg p-4 bg-gray-900 dark:bg-gray-950 overflow-x-auto border-t border-gray-700">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }
            
            return (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono border">
                {children}
              </code>
            );
          },

          // Enhanced headings with anchor links
          h1({ node, children, ...props }) {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return (
              <h1 id={id} className="group relative scroll-mt-20" {...props}>
                {children}
                <a 
                  href={`#${id}`}
                  className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Link to heading"
                >
                  #
                </a>
              </h1>
            );
          },

          h2({ node, children, ...props }) {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return (
              <h2 id={id} className="group relative scroll-mt-20" {...props}>
                {children}
                <a 
                  href={`#${id}`}
                  className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Link to heading"
                >
                  #
                </a>
              </h2>
            );
          },

          h3({ node, children, ...props }) {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return (
              <h3 id={id} className="group relative scroll-mt-20" {...props}>
                {children}
                <a 
                  href={`#${id}`}
                  className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Link to heading"
                >
                  #
                </a>
              </h3>
            );
          },

          // Enhanced links with external link indicators
          a({ node, href, children, ...props }) {
            const isExternal = href?.startsWith('http') && !href.includes(window.location.hostname);
            return (
              <a 
                href={href}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors duration-200"
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
                {isExternal && (
                  <svg className="inline w-3 h-3 ml-1 mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                )}
              </a>
            );
          },

          // Enhanced lists with proper spacing
          ul({ node, ordered, ...props }) {
            return (
              <ul className="list-disc pl-6 my-4 space-y-1 marker:text-gray-400" {...props} />
            );
          },

          ol({ node, ordered, ...props }) {
            return (
              <ol className="list-decimal pl-6 my-4 space-y-1 marker:text-gray-400 marker:font-medium" {...props} />
            );
          },

          li({ node, ...props }) {
            return <li className="pl-1" {...props} />;
          },

          // Enhanced blockquotes
          blockquote({ node, ...props }) {
            return (
              <blockquote className="border-l-4 border-blue-400 dark:border-blue-500 pl-6 pr-4 py-2 my-6 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg italic font-medium text-gray-700 dark:text-gray-300" {...props} />
            );
          },

          // Enhanced tables with better styling
          table({ node, ...props }) {
            return (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm" {...props} />
              </div>
            );
          },

          thead({ node, ...props }) {
            return <thead className="bg-gray-50 dark:bg-gray-800" {...props} />;
          },

          th({ node, ...props }) {
            return (
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700" {...props} />
            );
          },

          tbody({ node, ...props }) {
            return <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props} />;
          },

          td({ node, ...props }) {
            return (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700" {...props} />
            );
          },

          tr({ node, ...props }) {
            return <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150" {...props} />;
          },

          // Enhanced horizontal rules
          hr({ node, ...props }) {
            return <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" {...props} />;
          },

          // Enhanced paragraphs
          p({ node, ...props }) {
            return <p className="my-4 leading-relaxed" {...props} />;
          },

          // Task lists (checkboxes)
          input({ node, type, ...props }) {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                  disabled
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },

          // Enhanced images with lazy loading and captions
          img({ node, alt, src, title, ...props }) {
            return (
              <figure className="my-6">
                <img
                  src={src}
                  alt={alt}
                  title={title}
                  className="rounded-lg shadow-md max-w-full h-auto mx-auto"
                  loading="lazy"
                  {...props}
                />
                {(alt || title) && (
                  <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                    {alt || title}
                  </figcaption>
                )}
              </figure>
            );
          },

          // Enhanced emphasis
          em({ node, ...props }) {
            return <em className="italic font-medium" {...props} />;
          },

          strong({ node, ...props }) {
            return <strong className="font-bold text-gray-900 dark:text-gray-100" {...props} />;
          },

          // Strikethrough
          del({ node, ...props }) {
            return <del className="line-through text-gray-500 dark:text-gray-400" {...props} />;
          },

          // Keyboard shortcuts
          kbd({ node, ...props }) {
            return (
              <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm" {...props} />
            );
          },

          // Details/Summary (collapsible sections)
          details({ node, ...props }) {
            return (
              <details className="my-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" {...props} />
            );
          },

          summary({ node, ...props }) {
            return (
              <summary className="px-4 py-3 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 font-medium" {...props} />
            );
          },

          // Mark (highlight)
          mark({ node, ...props }) {
            return <mark className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded" {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}