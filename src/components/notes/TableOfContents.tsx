"use client";

/**
 * 自動目錄 — 從文章標題 (h2, h3) 生成側邊欄目錄。
 * Auto table of contents — generates sidebar TOC from article headings.
 */
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const t = useTranslations("notes");
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // 從 DOM 取得所有標題
    const elements = Array.from(
      document.querySelectorAll("article h2, article h3")
    ) as HTMLElement[];

    const items: TocItem[] = elements.map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: el.tagName === "H2" ? 2 : 3,
    }));

    setHeadings(items);
  }, []);

  useEffect(() => {
    // 觀察標題可見性，高亮當前章節
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h4 className="mb-3 text-sm font-semibold text-base-content/70">
        {t("tableOfContents")}
      </h4>
      <ul className="space-y-1.5 border-l border-base-300/30 pl-3">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: heading.level === 3 ? "0.75rem" : 0 }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className={`block text-xs transition-colors ${
                activeId === heading.id
                  ? "font-medium text-primary"
                  : "text-base-content/50 hover:text-base-content/70"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
