"use client";

/**
 * Markdown 渲染器 — 支援 GitHub Flavored Markdown。
 * Markdown renderer — supports GitHub Flavored Markdown.
 */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-base max-w-none dark:prose-invert ${className || ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeSanitize, { attributes: { "*": ["id", "className"] } }],
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
        components={{
          // 連結: 新分頁開啟
          a: ({ ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          // 圖片: 圓角 + 懶載入
          img: ({ ...props }) => (
            <img {...props} loading="lazy" className="rounded-xl" />
          ),
          // 代碼區塊: 圓角
          pre: ({ ...props }) => (
            <pre {...props} className="rounded-xl" />
          ),
          // 表格: 響應式
          table: ({ ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
