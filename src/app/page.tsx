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

  // 處理積木數據
  let blocks: any[] = [];
  try {
    if (config.homeBlocks) {
      const parsed = JSON.parse(config.homeBlocks);
      blocks = Array.isArray(parsed) ? parsed : [];
    }
  } catch (err) {
    console.error("Failed to parse homeBlocks:", err);
    blocks = [];
  }


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
          <div className="flex flex-col gap-1">
            {blocks.map((block: any) => (
              <div key={block.id}>
                {block.type === "heading" && (
                  block.level === 1 ? (
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-4xl md:text-4xl mb-4">
                      {processText(block.content || "")}
                    </h1>
                  ) : block.level === 2 ? (
                    <h2 className="text-2xl font-bold mb-3">
                      {processText(block.content || "")}
                    </h2>
                  ) : (
                    <h3 className="text-xl font-bold text-base-content/90 sm:text-xl mb-2">
                      {processText(block.content || "")}
                    </h3>
                  )
                )}
                {block.type === "text" && (
                  <p className="text-lg font-medium opacity-70 leading-relaxed whitespace-pre-wrap mb-4">
                    {processText(block.content || "")}
                  </p>
                )}
                {block.type === "chips" && (
                  <div className="flex flex-wrap gap-2 mt-2 mb-4">
                    {block.items?.map((item: string, i: number) => (
                      <span key={i} className="inline-flex items-center rounded-full border border-base-300/30 bg-base-200/20 px-3 py-1 text-sm font-medium transition-all hover:border-primary/30">
                        {processText(item)}
                      </span>
                    ))}
                  </div>
                )}
                {block.type === "button" && (
                  <div className="mt-6 mb-4">
                    <Link 
                      href={block.href || "/notes"}
                      className="group flex w-fit items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-primary/90"
                    >
                      {block.label}
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                )}
                {block.type === "spacer" && (
                  <div style={{ height: `${block.height}px` }} />
                )}
              </div>
            ))}
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
