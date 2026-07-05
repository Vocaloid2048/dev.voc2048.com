"use client";

/**
 * Markdown 渲染器 — 支援 GitHub Flavored Markdown。
 * Markdown renderer — supports GitHub Flavored Markdown.
 */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";

// 引入代碼高亮樣式 (Github Dark 主題)
import "highlight.js/styles/github-dark.css";

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
          rehypeRaw,
          rehypeSlug,
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              tagNames: [...(defaultSchema.tagNames || []), "chip", "row", "column"],
              attributes: {
                ...defaultSchema.attributes,
                "*": ["id", "className"],
              },
            },
          ],
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
          // 自定義標籤: Chip (藥丸型)
          // @ts-ignore
          chip: ({ children, className }) => (
            <span className={`inline-flex items-center rounded-full border border-base-300/40 bg-base-200/30 px-3 py-1 text-sm font-medium transition-all hover:border-primary/30 hover:bg-base-200/50 ${className || ""}`}>
              {children}
            </span>
          ),
          // 自定義標籤: Row (橫向佈局)
          // @ts-ignore
          row: ({ children, className }) => (
            <div className={`flex flex-wrap gap-4 ${className || ""}`}>
              {children}
            </div>
          ),
          // 自定義標籤: Column (縱向佈局)
          // @ts-ignore
          column: ({ children, className }) => (
            <div className={`flex flex-col gap-2 ${className || ""}`}>
              {children}
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
