/**
 * 作品頁 — 卡片式網格展示。
 * Works page — card-style grid showcase.
 */
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ExternalLink, Github } from "lucide-react";

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations("works");

  const works = await prisma.work
    .findMany({
      where: { isPublished: true },
      orderBy: [{ isPinned: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-5xl px-4">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      {works.length === 0 ? (
        <p className="py-12 text-center text-base-content/50">{t("noWorks")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <div
              key={work.id}
              className="group overflow-hidden rounded-2xl border border-base-300/30 bg-base-200/20 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              {/* 封面圖 */}
              {work.coverImage ? (
                <div className="aspect-video overflow-hidden bg-base-300/20">
                  <img
                    src={work.coverImage}
                    alt={work.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <span className="text-2xl font-bold text-primary/30">
                    {work.title.charAt(0)}
                  </span>
                </div>
              )}

              {/* 內容 */}
              <div className="p-5">
                <h3 className="font-semibold transition-colors group-hover:text-primary">
                  {work.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-base-content/60">
                  {work.description}
                </p>

                {/* 標籤 */}
                {work.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {work.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 連結 */}
                <div className="mt-4 flex gap-3">
                  {work.demoUrl && (
                    <a
                      href={work.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary transition-opacity hover:opacity-70"
                    >
                      <ExternalLink size={14} />
                      {t("demo")}
                    </a>
                  )}
                  {work.repoUrl && (
                    <a
                      href={work.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-base-content/50 transition-opacity hover:opacity-70"
                    >
                      <Github size={14} />
                      {t("repo")}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
