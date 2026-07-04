"use client";

/**
 * 筆記編輯頁 — Markdown 編輯器，支援新增與編輯。
 * Note editor — Markdown editor, supports create and edit.
 */
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// 動態載入 Markdown 編輯器（避免 SSR 問題）
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Tag { id: string; name: string; }
interface Category { id: string; name: string; }

export default function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [noteId, setNoteId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    type: "ARTICLE",
    mood: "",
    categoryId: "",
    isPinned: false,
    isPublished: true,
    tagIds: [] as string[],
  });

  useEffect(() => {
    params.then((p) => {
      if (p.id === "new") {
        setIsNew(true);
        setLoading(false);
      } else {
        setNoteId(p.id);
      }
    });
  }, [params]);

  // 載入筆記資料
  const loadNote = useCallback(async () => {
    if (!noteId) return;
    const res = await fetch(`/api/notes/${noteId}`);
    if (res.ok) {
      const data = await res.json();
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        content: data.content || "",
        excerpt: data.excerpt || "",
        type: data.type || "ARTICLE",
        mood: data.mood || "",
        categoryId: data.categoryId || "",
        isPinned: data.isPinned || false,
        isPublished: data.isPublished ?? true,
        tagIds: data.tags?.map((t: Tag) => t.id) || [],
      });
    }
    setLoading(false);
  }, [noteId]);

  // 載入標籤和分類
  useEffect(() => {
    Promise.all([
      fetch("/api/tags").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([t, c]) => {
      setTags(t);
      setCategories(c);
    });
  }, []);

  useEffect(() => {
    if (noteId) loadNote();
  }, [noteId, loadNote]);

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, tagIds: form.tagIds };
    try {
      if (isNew) {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          router.push("/dashboard/notes");
        }
      } else if (noteId) {
        await fetch(`/api/notes/${noteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        router.push("/dashboard/notes");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-[var(--db-text-muted)]">載入中...</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/dashboard/notes"
          className="flex items-center gap-1.5 text-sm text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
        >
          <ArrowLeft size={16} />
          返回列表
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="dashboard-btn-primary flex items-center gap-1.5 px-4 py-2 text-sm"
        >
          <Save size={16} />
          {saving ? "儲存中..." : "儲存"}
        </button>
      </div>

      <div className="space-y-4">
        {/* 標題 */}
        <div>
          <label className="mb-1 block text-xs text-[var(--db-text-muted)]">標題</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="輸入標題..."
            className="dashboard-input w-full px-4 py-2.5 text-sm"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-1 block text-xs text-[var(--db-text-muted)]">URL Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="auto-generated-if-empty"
            className="dashboard-input w-full px-4 py-2.5 text-sm"
          />
        </div>

        {/* 類型、心情、分類 */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs text-[var(--db-text-muted)]">類型</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="dashboard-input w-full px-3 py-2.5 text-sm"
            >
              <option value="ARTICLE">長文</option>
              <option value="DIARY">日記</option>
              <option value="SENTENCE">好句子</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--db-text-muted)]">心情</label>
            <select
              value={form.mood}
              onChange={(e) => setForm({ ...form, mood: e.target.value })}
              className="dashboard-input w-full px-3 py-2.5 text-sm"
            >
              <option value="">—</option>
              <option value="happy">開心</option>
              <option value="calm">平靜</option>
              <option value="anxious">焦慮</option>
              <option value="sad">難過</option>
              <option value="excited">興奮</option>
              <option value="thoughtful">沉思</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--db-text-muted)]">分類</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="dashboard-input w-full px-3 py-2.5 text-sm"
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 標籤 */}
        <div>
          <label className="mb-1 block text-xs text-[var(--db-text-muted)]">標籤</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  const tagIds = form.tagIds.includes(tag.id)
                    ? form.tagIds.filter((id) => id !== tag.id)
                    : [...form.tagIds, tag.id];
                  setForm({ ...form, tagIds });
                }}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                  form.tagIds.includes(tag.id)
                    ? "bg-[var(--db-primary)] text-[#2a1f1f]"
                    : "dashboard-btn-ghost"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Markdown 編輯器 */}
        <div>
          <label className="mb-1 block text-xs text-[var(--db-text-muted)]">內容 (Markdown)</label>
          <div data-color-mode="dark">
            <MDEditor
              value={form.content}
              onChange={(val) => setForm({ ...form, content: val || "" })}
              height={400}
            />
          </div>
        </div>

        {/* 摘要 */}
        <div>
          <label className="mb-1 block text-xs text-[var(--db-text-muted)]">摘要</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="文章摘要（可選）"
            rows={2}
            className="dashboard-input w-full px-4 py-2.5 text-sm"
          />
        </div>

        {/* 開關 */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-[var(--db-text)]">
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
              className="accent-[var(--db-primary)]"
            />
            置頂
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--db-text)]">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="accent-[var(--db-primary)]"
            />
            發佈
          </label>
        </div>
      </div>
    </div>
  );
}
