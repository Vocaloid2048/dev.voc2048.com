/**
 * 隨筆列表頁 — 統一展示日記/長文/好句子，支援篩選與搜尋。
 * Notes list page — unified feed with filters and search.
 */
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { NotesListClient } from "@/components/notes/NotesListClient";

export default async function NotesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    type?: string;
    category?: string;
    tags?: string;
    mood?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  const t = await getTranslations("notes");

  const page = parseInt(search.page || "1", 10);
  const limit = 10;
  const offset = (page - 1) * limit;

  // 構建查詢條件
  const where: Record<string, unknown> = {
    isPublished: true,
  };

  if (search.type) where.type = search.type;
  if (search.category) where.category = { name: search.category };
  if (search.mood) where.mood = search.mood;
  if (search.tags) {
    where.tags = { some: { name: { in: search.tags.split(",") } } };
  }
  if (search.search) {
    where.OR = [
      { title: { contains: search.search, mode: "insensitive" } },
      { content: { contains: search.search, mode: "insensitive" } },
    ];
  }

  // 取得筆記
  const [notes, total] = await prisma.note
    .findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      skip: offset,
      take: limit,
      include: { tags: true, category: true },
    })
    .then(async (data) => {
      const count = await prisma.note.count({ where });
      return [data, count];
    })
    .catch(() => [[], 0]);

  // 取得所有分類、標籤、心情
  const [categories, tags] = await Promise.all([
    prisma.category.findMany().catch(() => []),
    prisma.tag.findMany().catch(() => []),
  ]);

  const moods = ["happy", "calm", "anxious", "sad", "excited", "thoughtful"];
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="mb-6 text-3xl font-bold">{t("title")}</h1>
      <NotesListClient
        notes={notes.map((n) => ({
          id: n.id,
          title: n.title,
          slug: n.slug,
          excerpt: n.excerpt || "",
          type: n.type,
          mood: n.mood,
          isPinned: n.isPinned,
          publishedAt: n.publishedAt.toISOString(),
          tags: n.tags.map((t) => t.name),
          categoryName: n.category?.name,
          viewCount: n.viewCount,
        }))}
        categories={categories.map((c) => c.name)}
        tags={tags.map((t) => ({ name: t.name, color: t.color }))}
        moods={moods}
        currentFilters={search}
        totalPages={totalPages}
        currentPage={page}
        locale={locale}
      />
    </div>
  );
}
