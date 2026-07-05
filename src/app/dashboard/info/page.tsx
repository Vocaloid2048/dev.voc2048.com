"use client";

/**
 * 資訊設定頁 — 首頁簡介、個人簡介。
 * Information settings — home intro, personal bio.
 */
import { useState, useEffect, useCallback } from "react";
import { Save, Info, Plus, Trash2, ChevronUp, ChevronDown, Type, Heading1, Heading3, Tag, MousePointer2, FileText, MoveVertical } from "lucide-react";
import dynamic from "next/dynamic";
import { MarkdownRenderer } from "@/components/notes/MarkdownRenderer";

// 定義積木型別

interface HomeBlock {
  id: string;
  type: "heading" | "text" | "chips" | "button" | "spacer";
  content?: string;
  level?: number;
  items?: string[];
  label?: string;
  href?: string;
  height?: number;
}

// 動態載入 Markdown 編輯器
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const BIO_TEMPLATE = `
<a><p align="center">![yunli_banner](https://voc2048.com/yunli_banner.png)<br></a>*🎸 Vocchi the rock - in [Coding Band](https://discord.gg/uXatcbWKv2)*</p>
<br>
## 🏠 關於我 About Me 
🪁 安安~ 我是 \`Voc-夜芷冰\`，可以稱呼我 \`夜芷冰\` 或者 \`芷冰\`。<br>
🖥️ 一位來自香港的業餘跨平台應用程式開發者<br>
💡 擅長前端應用程式開發，尤其是 Android 原生開發<br>
<br>
\`\`\`
🪁 Hello~ I'm Voc-夜芷冰, you can call me Voc or Vocchi.
🖥️ I'm an amateur multiplatform app developer from Hong Kong.
💡 I'm good at front-end application development, especially native Android development.
\`\`\`
![Make With Passion](https://img.shields.io/badge/make_with_🔥-orange) [![wakatime](https://wakatime.com/badge/user/ca727ba5-9112-4612-b454-d5e407277a51.svg)](https://wakatime.com/@ca727ba5-9112-4612-b454-d5e407277a51)
<br>
### 🔮 座右銘 Motto
**\`「變量為何要羨慕常數？」\`** - 從一場不歡而散的合作而來的座右銘<br>
> \`"Why should variables envy constants?"\` - A motto born from an unpleasant collaboration
<br>
**\`「在擁有前就已經做好捨棄的準備。」\`** - 從一次單向的付出而來的座右銘<br>
> \`Be prepared to give it up before possessing it.\` - A motto derived from a one-way act of giving.
<br>
### 📫 聯絡我 Contact Me
<a href="https://discord.com/users/417665898548166678">![My Discord Account](https://dcbadge.limes.pink/api/shield/417665898548166678?compact=true)</a> <a href="https://discord.gg/uXatcbWKv2">![My Discord Server](https://dcbadge.limes.pink/api/server/https://discord.gg/uXatcbWKv2?theme=clean)</a>
`;

export default function DashboardInfoPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [blocks, setBlocks] = useState<HomeBlock[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchConfig = useCallback(async () => {
    const res = await fetch("/api/config");
    const data = await res.json();
    setConfig(data);
    try {
      const parsed = JSON.parse(data["home.blocks"] || "[]");
      setBlocks(Array.isArray(parsed) ? parsed : []);
    } catch {
      setBlocks([]);
    }

  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleSave = async () => {
    setSaving(true);
    const updatedConfig = { ...config, "home.blocks": JSON.stringify(blocks) };
    await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedConfig),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addBlock = (type: HomeBlock["type"]) => {
    const newBlock: HomeBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === "heading" ? "New Heading" : type === "text" ? "New Text" : "",
      level: type === "heading" ? 1 : undefined,
      items: type === "chips" ? ["New Tag"] : undefined,
      label: type === "button" ? "探索筆記" : undefined,
      href: type === "button" ? "/notes" : undefined,
      height: type === "spacer" ? 24 : undefined,
    };
    setBlocks([...blocks, newBlock]);
  };


  const updateBlock = (id: string, updates: Partial<HomeBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
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

      {/* 首頁積木式簡介區域 */}
      <section className="dashboard-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Info size={18} className="text-[var(--db-primary)]" />
          <h2 className="text-lg font-semibold text-[var(--db-text)]">首頁簡介</h2>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 編輯區 */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => addBlock("heading")} className="flex items-center gap-1 px-3 py-1.5 bg-base-200 hover:bg-base-300 rounded-lg text-xs font-medium transition-colors">
                <Heading1 size={14} /> 標題
              </button>
              <button onClick={() => addBlock("text")} className="flex items-center gap-1 px-3 py-1.5 bg-base-200 hover:bg-base-300 rounded-lg text-xs font-medium transition-colors">
                <Type size={14} /> 段落
              </button>
              <button onClick={() => addBlock("chips")} className="flex items-center gap-1 px-3 py-1.5 bg-base-200 hover:bg-base-300 rounded-lg text-xs font-medium transition-colors">
                <Tag size={14} /> 標籤組
              </button>
              <button onClick={() => addBlock("button")} className="flex items-center gap-1 px-3 py-1.5 bg-base-200 hover:bg-base-300 rounded-lg text-xs font-medium transition-colors">
                <MousePointer2 size={14} /> 按鈕
              </button>
              <button onClick={() => addBlock("spacer")} className="flex items-center gap-1 px-3 py-1.5 bg-base-200 hover:bg-base-300 rounded-lg text-xs font-medium transition-colors">
                <MoveVertical size={14} /> 間距
              </button>
            </div>


            <div className="space-y-3 min-h-[300px] border-2 border-dashed border-base-300 rounded-xl p-4">
              {blocks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-[var(--db-text-muted)] opacity-50">
                  <p className="text-sm italic">點擊上方按鈕新增積木...</p>
                </div>
              )}
              {blocks.map((block, index) => (
                <div key={block.id} className="group relative bg-base-200/50 border border-base-300 rounded-lg p-4 hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{block.type}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveBlock(index, "up")} className="p-1 hover:bg-base-300 rounded"><ChevronUp size={14} /></button>
                      <button onClick={() => moveBlock(index, "down")} className="p-1 hover:bg-base-300 rounded"><ChevronDown size={14} /></button>
                      <button onClick={() => removeBlock(block.id)} className="p-1 hover:bg-error/20 text-error rounded"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  {block.type === "heading" && (
                    <div className="flex gap-2">
                      <select 
                        value={block.level} 
                        onChange={(e) => updateBlock(block.id, { level: parseInt(e.target.value) })}
                        className="bg-base-100 border border-base-300 rounded px-2 py-1 text-xs"
                      >
                        <option value={1}>H1</option>
                        <option value={2}>H2</option>
                        <option value={3}>H3</option>
                      </select>
                      <input 
                        value={block.content} 
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="flex-1 bg-base-100 border border-base-300 rounded px-3 py-1 text-sm"
                        placeholder="輸入標題內容..."
                      />
                    </div>
                  )}

                  {block.type === "text" && (
                    <textarea 
                      value={block.content} 
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      className="w-full bg-base-100 border border-base-300 rounded px-3 py-2 text-sm min-h-[60px]"
                      placeholder="輸入段落文字..."
                    />
                  )}

                  {block.type === "chips" && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {block.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                            <input 
                              value={item} 
                              onChange={(e) => {
                                const newItems = [...(block.items || [])];
                                newItems[i] = e.target.value;
                                updateBlock(block.id, { items: newItems });
                              }}
                              className="bg-transparent border-none focus:outline-none w-20 text-center"
                            />
                            <button onClick={() => {
                              const newItems = block.items?.filter((_, idx) => idx !== i);
                              updateBlock(block.id, { items: newItems });
                            }}><Trash2 size={10} /></button>
                          </div>
                        ))}
                        <button onClick={() => updateBlock(block.id, { items: [...(block.items || []), "New"] })} className="px-2 py-1 bg-base-300 rounded-full text-xs">+</button>
                      </div>
                    </div>
                  )}

                  {block.type === "button" && (
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        value={block.label} 
                        onChange={(e) => updateBlock(block.id, { label: e.target.value })}
                        className="bg-base-100 border border-base-300 rounded px-3 py-1 text-sm"
                        placeholder="按鈕文字"
                      />
                      <input 
                        value={block.href} 
                        onChange={(e) => updateBlock(block.id, { href: e.target.value })}
                        className="bg-base-100 border border-base-300 rounded px-3 py-1 text-sm"
                        placeholder="連結網址 (如 /notes)"
                      />
                    </div>
                  )}

                  {block.type === "spacer" && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--db-text-muted)]">高度 (px):</span>
                      <input 
                        type="number"
                        value={block.height} 
                        onChange={(e) => updateBlock(block.id, { height: parseInt(e.target.value) || 0 })}
                        className="w-24 bg-base-100 border border-base-300 rounded px-3 py-1 text-sm"
                      />
                      <div className="flex-1 border-b border-dashed border-base-300 h-0" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 預覽區 */}
          <div className="flex flex-col rounded-xl border border-[var(--db-border)] bg-black/20 overflow-hidden">
            <div className="border-b border-[var(--db-border)] bg-white/5 px-4 py-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--db-text-muted)]">Live Preview</h4>
            </div>
            <div className="flex-1 p-8 bg-[#F2EFDF] dark:bg-[#2a1f1f] text-[#733232] dark:text-[#f2e0dc]">
              <div className="hero-preview">
                {blocks.map(block => (
                  <div key={block.id}>
                    {block.type === "heading" && (
                      block.level === 1 ? <h1 className="text-3xl font-bold mb-2">{block.content?.replace("{name}", config["site.name_display"] || "Name")}</h1> :
                      block.level === 2 ? <h2 className="text-2xl font-bold mb-2">{block.content}</h2> :
                      <h3 className="text-xl font-medium opacity-80 mb-2">{block.content}</h3>
                    )}
                    {block.type === "text" && <p className="text-lg opacity-60 leading-relaxed whitespace-pre-wrap mb-2">{block.content}</p>}
                    {block.type === "chips" && (
                      <div className="flex flex-wrap gap-2 mt-4 mb-2">
                        {block.items?.map((item, i) => (
                          <span key={i} className="inline-flex items-center rounded-full border border-[#733232]/20 bg-[#733232]/5 px-3 py-1 text-sm font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                    {block.type === "button" && (
                      <div className="mt-6 mb-2">
                        <span className="inline-flex items-center rounded-full bg-[#733232] text-white px-6 py-2 text-sm font-bold shadow-lg">
                          {block.label}
                        </span>
                      </div>
                    )}
                    {block.type === "spacer" && (
                      <div style={{ height: `${block.height}px` }} />
                    )}
                  </div>
                ))}
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

