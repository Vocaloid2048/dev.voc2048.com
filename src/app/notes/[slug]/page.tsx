/**
 * 文章詳情頁 — Markdown 渲染 + TOC 側邊欄 + 閱讀進度條。
 * Note detail page — Markdown rendering + TOC sidebar + reading progress.
 */
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { MarkdownRenderer } from "@/components/notes/MarkdownRenderer";
import { TableOfContents } from "@/components/notes/TableOfContents";
import { ReadingProgress } from "@/components/notes/ReadingProgress";

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("notes");

  const note = await prisma.note
    .findFirst({
      where: { slug, isPublished: true },
      include: { tags: true, category: true, author: true },
    })
    .catch(() => null);

  if (!note) notFound();

  // 增加瀏覽數 (非阻塞)
  prisma.note
    .update({
      where: { id: note.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex gap-8">
          {/* 主內容 */}
          <article className="min-w-0 flex-1">
            {/* 標題區 */}
            <header className="mb-8">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-base-content/50">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                  {t(`types.${note.type}`)}
                </span>
                {note.mood && (
                  <span>· {t(`moods.${note.mood}`)}</span>
                )}
                {note.category && (
                  <span>· {note.category.name}</span>
                )}
                <span>
                  · {t("publishedOn")}{" "}
                  {new Date(note.publishedAt).toLocaleDateString()}
                </span>
                <span>· {note.viewCount} {t("views")}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {note.title}
              </h1>
            </header>

            {/* 封面圖 */}
            {note.coverImage && (
              <div className="mb-8 aspect-video overflow-hidden rounded-2xl">
                <img
                  src={note.coverImage}
                  alt={note.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Markdown 內容 */}
            <MarkdownRenderer content={note.content} />

            {/* 標籤 */}
            {note.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-base-200/50 px-3 py-1 text-xs text-base-content/60"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* 版權聲明 */}
            <div className="mt-8 rounded-2xl border border-base-300/30 bg-base-200/20 p-4 text-center text-xs text-base-content/50">
              CC BY-NC-ND 4.0 · {t("publishedOn")}{" "}
              {new Date(note.publishedAt).toLocaleDateString()}
            </div>
          </article>

          {/* 側邊欄 TOC */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </>
  );
}
