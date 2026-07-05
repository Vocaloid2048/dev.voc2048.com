/**
 * 首頁 — Hero + 引言 + 置頂作品。
 * Homepage — Hero + quote + pinned works.
 *
 * 文案從資料庫 SiteConfig 讀取，非 i18n 翻譯。
 * Content read from database SiteConfig, not i18n translations.
 */
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/siteConfig";
import { MarkdownRenderer } from "@/components/notes/MarkdownRenderer";

export default async function HomePage() {
  const t = await getTranslations("home");
  const config = await getSiteConfig();

  // 處理文本替換
  const processText = (text: string) => {
    return text.replace(/\{name\}|<name_display>/g, config.nameDisplay);
  };

  // 取得管理員頭像
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { avatar: true },
  });

  // 取得置頂作品
  const pinnedWorks = await prisma.work
    .findMany({
      where: { isPinned: true, isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 5,
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* Hero 區域 - 左右佈局 */}
      <section className="flex min-h-[80vh] flex-col-reverse items-center justify-between gap-12 py-12 lg:flex-row lg:py-0">
        <div className="flex-1 text-left">
          <div className="hero-content">
            <MarkdownRenderer 
              content={processText(config.homeIntro)} 
              className="prose-h1:text-3xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:mb-2 sm:prose-h1:text-4xl md:prose-h1:text-5xl prose-h3:text-xl prose-h3:font-medium prose-h3:text-base-content/80 sm:prose-h3:text-2xl prose-p:text-lg prose-p:font-semibold prose-p:opacity-60"
            />
          </div>

          <div className="mt-16 max-w-lg border-l-2 border-primary/30 pl-6 italic text-base-content/50">
            <MarkdownRenderer 
              content={processText(config.siteQuote)} 
              className="prose-p:text-sm"
            />
          </div>
        </div>

        {/* 右側頭像 */}
        <div className="relative flex shrink-0 items-center justify-center">
          <div className="relative h-64 w-64 overflow-hidden rounded-full border-8 border-white/5 shadow-2xl sm:h-80 sm:w-80 lg:h-96 lg:w-96">
            <img
              src={admin?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Vocchi"}
              alt="Avatar"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          {/* 裝飾性光暈 */}
          <div className="absolute -inset-4 -z-10 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        </div>
      </section>

      {/* 置頂作品 */}
      {pinnedWorks.length > 0 && (
        <section className="my-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("pinnedWorks")}</h2>
            <Link
              href="/works"
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
                href="/works"
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
                {work.tags && Array.isArray(work.tags) && work.tags.length > 0 && (
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
