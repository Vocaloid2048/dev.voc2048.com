/**
 * 關於頁 — 個人簡介、技能棧、聯繫方式。
 * About page — personal bio, skills stack, contact info.
 */
import { getTranslations } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("about");

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
          <p className="leading-relaxed text-base-content/70">
            {locale === "zh-TW"
              ? "你好，我是夜芷冰。一名在程式碼星空下探索的開發者，相信好的軟體不只是冷冰冰的邏輯，更是傳遞溫度的媒介。在變量與常數之間，尋找讓世界更溫暖的解。"
              : "Hello, I'm Night Zhi Bing. A developer exploring under the starry sky of code, believing that good software is not just cold logic but a medium for conveying warmth. Finding solutions that make the world warmer, between variables and constants."}
          </p>
        </div>
      </section>

      {/* 技能棧 */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-base-content/80">
          {t("skills")}
        </h2>
        <div className="space-y-4">
          {skills.map((skillGroup) => (
            <div key={skillGroup.category}>
              <h3 className="mb-2 text-sm font-medium text-base-content/50">
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-base-300/40 bg-base-200/30 px-3 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 聯繫方式 */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-base-content/80">
          {t("contact")}
        </h2>
        <div className="space-y-2">
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center justify-between rounded-2xl border border-base-300/30 bg-base-200/20 px-5 py-3 transition-all hover:border-primary/30 hover:bg-base-200/40"
            >
              <span className="text-sm font-medium text-base-content/50">
                {contact.label}
              </span>
              <span className="text-sm text-primary">{contact.value}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
