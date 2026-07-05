/**
 * 關於頁 — 個人簡介、技能棧、聯繫方式。
 * About page — personal bio, skills stack, contact info.
 */
import { getLocale, getTranslations } from "next-intl/server";
import { getSiteConfig } from "@/lib/siteConfig";
import { MarkdownRenderer } from "@/components/notes/MarkdownRenderer";

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const config = await getSiteConfig();

  const skills = [
    { category: "Frontend", items: ["TypeScript", "React", "Next.js", "TailwindCSS", "Vue"] },
    { category: "Backend", items: ["Node.js", "PostgreSQL", "Prisma", "Redis", "Docker"] },
    { category: "Tools", items: ["Git", "VS Code", "Figma", "Linux"] },
  ];

  const contacts = [
    { label: "GitHub", value: "github.com/Vocaloid2048", href: "https://github.com/Vocaloid2048" },
    { label: "Email", value: "contact@voc2048.com", href: "mailto:contact@voc2048.com" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      {/* 個人簡介 */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-base-content/80">
          {t("bio")}
        </h2>
        <div className="rounded-2xl border border-base-300/30 bg-base-200/20 p-6">
          <MarkdownRenderer content={config.aboutBio} />
        </div>
      </section>
    </div>
  );
}
