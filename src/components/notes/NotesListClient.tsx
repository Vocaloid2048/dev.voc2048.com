"use client";

/**
 * 隨筆列表客戶端元件 — 篩選、搜尋、分頁。
 * Notes list client component — filtering, search, pagination.
 */
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Pin } from "lucide-react";
import { useState, useTransition, useCallback } from "react";
import { formatDate } from "@/lib/utils";

interface NoteItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  type: string;
  mood: string | null;
  isPinned: boolean;
  publishedAt: string;
  tags: string[];
  categoryName: string | null;
  viewCount: number;
}

interface NotesListClientProps {
  notes: NoteItem[];
  categories: string[];
  tags: { name: string; color: string | null }[];
  moods: string[];
  currentFilters: Record<string, string | undefined>;
  totalPages: number;
  currentPage: number;
}

export function NotesListClient({
  notes,
  categories,
  tags,
  moods,
  currentFilters,
  totalPages,
  currentPage,
}: NotesListClientProps) {
  const t = useTranslations("notes");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(currentFilters.search || "");
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/notes?${params.toString()}`);
      });
    },
    [searchParams, router]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", searchValue || null);
  };

  const typeColors: Record<string, string> = {
    DIARY: "bg-blue-500/10 text-blue-600",
    ARTICLE: "bg-primary/10 text-primary",
    SENTENCE: "bg-amber-500/10 text-amber-600",
  };

  return (
    <div>
      {/* 搜尋欄 */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t("search")}
            suppressHydrationWarning
            className="w-full rounded-full border border-base-300/50 bg-base-200/30 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-base-200/50"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-content transition-opacity hover:opacity-90"
        >
          {t("search").replace("...", "")}
        </button>
      </form>

      {/* 篩選器 */}
      <div className="mb-8 space-y-3">
        {/* 類別篩選 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-base-content/50">
            {t("category")}
          </span>
          <button
            onClick={() => updateFilter("type", null)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${!currentFilters.type ? "bg-primary/15 text-primary" : "hover:bg-base-200/50"}`}
          >
            {t("all")}
          </button>
          {(["DIARY", "ARTICLE", "SENTENCE"] as const).map((type) => (
            <button
              key={type}
              onClick={() => updateFilter("type", type)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${currentFilters.type === type ? "bg-primary/15 text-primary" : "hover:bg-base-200/50"}`}
            >
              {t(`types.${type}`)}
            </button>
          ))}
        </div>

        {/* 心情篩選 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-base-content/50">
            {t("mood")}
          </span>
          <button
            onClick={() => updateFilter("mood", null)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${!currentFilters.mood ? "bg-primary/15 text-primary" : "hover:bg-base-200/50"}`}
          >
            {t("all")}
          </button>
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => updateFilter("mood", mood)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${currentFilters.mood === mood ? "bg-primary/15 text-primary" : "hover:bg-base-200/50"}`}
            >
              {t(`moods.${mood}`)}
            </button>
          ))}
        </div>

        {/* 標籤篩選 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-base-content/50">
              {t("tag")}
            </span>
            {tags.map((tag) => {
              const active = currentFilters.tags?.includes(tag.name);
              return (
                <button
                  key={tag.name}
                  onClick={() => updateFilter("tags", active ? null : tag.name)}
                  style={tag.color ? { backgroundColor: `${tag.color}20` } : undefined}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${active ? "bg-primary/15 text-primary font-medium" : "hover:bg-base-200/50"}`}
                >
                  #{tag.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 筆記列表 */}
      {notes.length === 0 ? (
        <p className="py-12 text-center text-base-content/50">{t("noResults")}</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.slug}`}
              className="group block rounded-2xl border border-base-300/30 bg-base-200/20 p-4 transition-all hover:border-primary/30 hover:bg-base-200/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {note.isPinned && <Pin size={14} className="text-primary" />}
                    {note.title && (
                      <h3 className="font-semibold transition-colors group-hover:text-primary">
                        {note.title}
                      </h3>
                    )}
                  </div>
                  {note.excerpt && (
                    <p className="mt-1 line-clamp-2 text-sm text-base-content/60">
                      {note.excerpt}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-base-content/40">
                    <span
                      className={`rounded-full px-2 py-0.5 ${typeColors[note.type] || ""}`}
                    >
                      {t(`types.${note.type as "DIARY" | "ARTICLE" | "SENTENCE"}`)}
                    </span>
                    {note.mood && (
                      <span>· {t(`moods.${note.mood}`)}</span>
                    )}
                    <span>· {formatDate(note.publishedAt)}</span>
                    {note.tags.length > 0 && (
                      <span>· {note.tags.map((t) => `#${t}`).join(" ")}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 分頁 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", String(page));
                router.push(`/notes?${params.toString()}`);
              }}
              className={`h-9 w-9 rounded-full text-sm transition-colors ${page === currentPage ? "bg-primary text-primary-content" : "hover:bg-base-200/50"}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
