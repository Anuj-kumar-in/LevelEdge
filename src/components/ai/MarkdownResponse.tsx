import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownResponseProps = {
  content: string;
  className?: string;
};

export default function MarkdownResponse({ content, className = '' }: MarkdownResponseProps) {
  return (
    <div className={`prose prose-slate max-w-none text-slate-600 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="mb-3 text-lg font-black text-navy">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 text-base font-bold text-navy">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 text-sm font-bold text-navy">{children}</h3>,
          p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-extrabold text-navy">{children}</strong>,
          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-800">{children}</code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-sky-blue/50 pl-3 italic text-slate-500">{children}</blockquote>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}