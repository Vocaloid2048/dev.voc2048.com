/**
 * 首頁 — Hero + 引言 + 置頂作品。
 * Homepage — Hero + quote + pinned works.
 */
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");

  // 取得置頂作品
  const pinnedWorks = await prisma.work
    .findMany({
      where: { isPinned: true, isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 5,
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* Hero 區域 */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
          {t("name")}
        </h1>
        <p className="mt-4 text-lg text-base-content/70 sm:text-xl">
          {t("slogan")}
        </p>
        <p className="mt-6 max-w-2xl text-base text-base-content/60">
          {t("intro")}
        </p>
      </section>

      {/* 引言 */}
      <section className="my-16 flex justify-center">
        <blockquote className="relative max-w-2xl rounded-2xl border border-base-300/30 bg-base-200/30 px-8 py-6 text-center backdrop-blur-sm">
          <p className="text-lg font-medium italic text-base-content/80">
            「{t("quote")}」
          </p>
        </blockquote>
      </section>

      {/* 置頂作品 */}
      {pinnedWorks.length > 0 && (
        <section className="my-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("pinnedWorks")}</h2>
            <Link
              href={`/${locale}/works`}
              className="flex items-center gap-1 text-sm text-primary transition-opacity hover:opacity-70"
            >
              {t("viewAll")}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedWorks.map((work) => (
              <Link
                key={work.id}
                href={`/${locale}/works`}
                className="group rounded-2xl border border-base-300/30 bg-base-200/30 p-5 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                {work.coverImage && (
                  <div className="mb-3 aspect-video overflow-hidden rounded-xl bg-base-300/20">
                    <img
                      src={work.coverImage}
                      alt={work.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="font-semibold transition-colors group-hover:text-primary">
                  {work.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-base-content/60">
                  {work.description}
                </p>
                {work.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {work.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
