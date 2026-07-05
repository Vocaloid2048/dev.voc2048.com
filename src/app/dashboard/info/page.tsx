"use client";

/**
 * 資訊設定頁 — 首頁簡介、個人簡介。
 * Information settings — home intro, personal bio.
 */
import { useState, useEffect, useCallback } from "react";
import { Save, Info } from "lucide-react";
import dynamic from "next/dynamic";
import { MarkdownRenderer } from "@/components/notes/MarkdownRenderer";

// 動態載入 Markdown 編輯器
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const BIO_TEMPLATE = `<a><p align="center">![yunli_banner](https://voc2048.com/yunli_banner.png)<br></a>*🎸 Vocchi the rock - in [Coding Band](https://discord.gg/uXatcbWKv2)*</p>

## 🏠 關於我 About Me 
🪁 安安~ 我是 \`Voc-夜芷冰\`，可以稱呼我 \`夜芷冰\` 或者 \`芷冰\`。<br>
🖥️ 一位來自香港的業餘跨平台應用程式開發者<br>
💡 擅長前端應用程式開發，尤其是 Android 原生開發<br>

\`\`\`
🪁 Hello~ I'm Voc-夜芷冰, you can call me Voc or Vocchi.
🖥️ I'm an amateur multiplatform app developer from Hong Kong.
💡 I'm good at front-end application development, especially native Android development.
\`\`\`
![Make With Passion](https://img.shields.io/badge/make_with_🔥-orange) [![wakatime](https://wakatime.com/badge/user/ca727ba5-9112-4612-b454-d5e407277a51.svg)](https://wakatime.com/@ca727ba5-9112-4612-b454-d5e407277a51)

### 🔮 座右銘 Motto
**\`「變量為何要羨慕常數？」\`** - 從一場不歡而散的合作而來的座右銘<br>
> \`"Why should variables envy constants?"\` - A motto born from an unpleasant collaboration

**\`「在擁有前就已經做好捨棄的準備。」\`** - 從一次單向的付出而來的座右銘<br>
> \`Be prepared to give it up before possessing it.\` - A motto derived from a one-way act of giving.

### 📫 聯絡我 Contact Me
<a href="https://discord.com/users/417665898548166678">![My Discord Account](https://dcbadge.limes.pink/api/shield/417665898548166678?compact=true)</a> <a href="https://discord.gg/uXatcbWKv2">![My Discord Server](https://dcbadge.limes.pink/api/server/https://discord.gg/uXatcbWKv2?theme=clean)</a>

## 🔥做過的專案 Projects
<row>
  <chip>PEAK 繁體中文翻譯模組</chip>
  <chip>Stargazer (星穹觀星者)</chip>
  <chip>Genshin Spirit (原神小幫手)</chip>
</row>

## 🛷 技術棧 Tech Stack
\`\`\`kotlin
Languages:
  ├─ Kotlin
  ├─ Java
  ├─ JavaScript
  ├─ TypeScript
  ├─ Python
  └─ C++
\`\`\`

[![Vocaloid2048's GitHub stats](https://github-readme-stats.vercel.app/api?username=Vocaloid2048&show_icons=true&theme=tokyonight)](https://github.com/anuraghazra/github-readme-stats)`;

export default function DashboardInfoPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchConfig = useCallback(async () => {
    const res = await fetch("/api/config");
    const data = await res.json();
    setConfig(data);
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--db-text)]">資訊設定</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="dashboard-btn-primary flex items-center gap-1.5 px-6 py-2.5 text-sm"
        >
          <Save size={16} /> {saving ? "儲存中..." : "儲存變更"}
        </button>
      </div>

      {saved && (
        <div className="rounded-lg bg-[var(--db-success)]/10 p-3 text-sm text-[var(--db-success)]">
          設置已儲存！
        </div>
      )}

      {/* 首頁簡介區域 */}
      <section className="dashboard-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Info size={18} className="text-[var(--db-primary)]" />
          <h2 className="text-lg font-semibold text-[var(--db-text)]">首頁簡介 (Hero)</h2>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--db-text-muted)] uppercase tracking-wider">
                Hero 標題
              </label>
              <div data-color-mode="dark">
                <MDEditor
                  value={config["home.hero_title"] || ""}
                  onChange={(v) => setConfig({ ...config, "home.hero_title": v || "" })}
                  preview="edit"
                  height={150}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--db-text-muted)] uppercase tracking-wider">
                Hero 副標題
              </label>
              <div data-color-mode="dark">
                <MDEditor
                  value={config["home.hero_subtitle"] || ""}
                  onChange={(v) => setConfig({ ...config, "home.hero_subtitle": v || "" })}
                  preview="edit"
                  height={120}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--db-text-muted)] uppercase tracking-wider">
                職業描述 (Hero Job)
              </label>
              <div data-color-mode="dark">
                <MDEditor
                  value={config["home.hero_job"] || ""}
                  onChange={(v) => setConfig({ ...config, "home.hero_job": v || "" })}
                  preview="edit"
                  height={120}
                />
              </div>
            </div>
          </div>

          {/* 預覽 */}
          <div className="flex flex-col rounded-xl border border-[var(--db-border)] bg-black/20 overflow-hidden">
            <div className="border-b border-[var(--db-border)] bg-white/5 px-4 py-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--db-text-muted)]">Live Preview</h4>
            </div>
            <div className="flex-1 p-8 bg-[#F2EFDF] dark:bg-[#2a1f1f] text-[#733232] dark:text-[#f2e0dc]">
              <div className="space-y-4">
                <MarkdownRenderer 
                  content={config["home.hero_title"] || ""} 
                  className="prose-h1:text-4xl prose-h1:font-bold prose-p:text-4xl prose-p:font-bold"
                />
                <MarkdownRenderer 
                  content={config["home.hero_job"] || ""} 
                  className="prose-p:text-2xl prose-p:font-medium opacity-80"
                />
                <div className="mt-8 opacity-60">
                  <MarkdownRenderer 
                    content={config["home.hero_subtitle"] || ""} 
                    className="prose-p:text-lg prose-p:font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 個人簡介區域 */}
      <section className="dashboard-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[var(--db-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--db-text)]">個人簡介 (About Bio)</h2>
          </div>
          <button
            onClick={() => {
              if (confirm("確定要載入模板嗎？這將覆蓋目前內容。")) {
                setConfig({ ...config, "about.bio": BIO_TEMPLATE });
              }
            }}
            className="text-xs text-[var(--db-primary)] hover:underline"
          >
            載入模板
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div data-color-mode="dark">
            <MDEditor
              value={config["about.bio"] || ""}
              onChange={(v) => setConfig({ ...config, "about.bio": v || "" })}
              height={600}
            />
          </div>

          <div className="flex flex-col rounded-xl border border-[var(--db-border)] bg-black/20 overflow-hidden">
            <div className="border-b border-[var(--db-border)] bg-white/5 px-4 py-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--db-text-muted)]">Live Preview</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-[#F2EFDF] dark:bg-[#2a1f1f] text-[#733232] dark:text-[#f2e0dc]">
              <MarkdownRenderer content={config["about.bio"] || ""} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { FileText } from "lucide-react";
