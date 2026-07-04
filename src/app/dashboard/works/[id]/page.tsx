"use client";

/**
 * 作品編輯頁 — 新增與編輯作品。
 * Work editor — create and edit works.
 */
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

export default function WorkEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [workId, setWorkId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    coverImage: "",
    demoUrl: "",
    repoUrl: "",
    tags: [] as string[],
    isPinned: false,
    isPublished: true,
    sortOrder: 0,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    params.then((p) => {
      if (p.id === "new") {
        setIsNew(true);
        setLoading(false);
      } else {
        setWorkId(p.id);
      }
    });
  }, [params]);

  const loadWork = useCallback(async () => {
    if (!workId) return;
    const res = await fetch(`/api/works/${workId}`);
    if (res.ok) {
      const data = await res.json();
      setForm({
        title: data.title || "",
        description: data.description || "",
        content: data.content || "",
        coverImage: data.coverImage || "",
        demoUrl: data.demoUrl || "",
        repoUrl: data.repoUrl || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        isPinned: data.isPinned || false,
        isPublished: data.isPublished ?? true,
        sortOrder: data.sortOrder ?? 0,
      });
    }
    setLoading(false);
  }, [workId]);

  useEffect(() => {
    if (workId) loadWork();
  }, [workId, loadWork]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setForm({ ...form, coverImage: data.url });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags };
      if (isNew) {
        const res = await fetch("/api/works", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) router.push("/dashboard/works");
      } else if (workId) {
        await fetch(`/api/works/${workId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        router.push("/dashboard/works");
      }
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput("");
    }
  };

  if (loading) return <p className="text-[var(--db-text-muted)]">載入中...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/dashboard/works" className="flex items-center gap-1.5 text-sm text-[var(--db-text-muted)] hover:text-[var(--db-text)]">
          <ArrowLeft size={16} /> 返回列表
        </Link>
        <button onClick={handleSave} disabled={saving} className="dashboard-btn-primary flex items-center gap-1.5 px-4 py-2 text-sm">
          <Save size={16} /> {saving ? "儲存中..." : "儲存"}
        </button>
      </div>

      <div className="space-y-4">
        {/* 封面圖 */}
        <div>
          <label className="mb-1 block text-xs text-[var(--db-text-muted)]">封面圖</label>
          <div className="flex items-center gap-3">
            {form.coverImage && (
              <img src={form.coverImage} alt="cover" className="h-20 w-32 rounded-lg object-cover" />
            )}
            <label className="dashboard-btn-ghost flex cursor-pointer items-center gap-1.5 px-4 py-2 text-sm">
              <Upload size={14} /> {uploading ? "上傳中..." : "上傳圖片"}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>
          <input
            type="text"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            placeholder="或直接輸入圖片 URL"
            className="dashboard-input mt-2 w-full px-4 py-2 text-sm"
          />
        </div>

        {/* 標題 */}
        <div>
          <label className="mb-1 block text-xs text-[var(--db-text-muted)]">標題 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="dashboard-input w-full px-4 py-2.5 text-sm"
            required
          />
        </div>

        {/* 簡述 */}
        <div>
          <label className="mb-1 block text-xs text-[var(--db-text-muted)]">簡述 *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="dashboard-input w-full px-4 py-2.5 text-sm"
            required
          />
        </div>

        {/* Demo / Repo URL */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-[var(--db-text-muted)]">Demo URL</label>
            <input
              type="url"
              value={form.demoUrl}
              onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
              placeholder="https://..."
              className="dashboard-input w-full px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--db-text-muted)]">Repo URL</label>
            <input
              type="url"
              value={form.repoUrl}
              onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
              placeholder="https://github.com/..."
              className="dashboard-input w-full px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        {/* 標籤 */}
        <div>
          <label className="mb-1 block text-xs text-[var(--db-text-muted)]">技術棧標籤</label>
          <div className="mb-2 flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="輸入標籤後按 Enter"
              className="dashboard-input flex-1 px-4 py-2 text-sm"
            />
            <button onClick={addTag} className="dashboard-btn-ghost px-4 py-2 text-sm">新增</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag, i) => (
              <button
                key={i}
                onClick={() => setForm({ ...form, tags: form.tags.filter((_, idx) => idx !== i) })}
                className="rounded-full bg-[var(--db-primary-muted)] px-3 py-1 text-xs text-[var(--db-primary)] hover:opacity-70"
              >
                {tag} ×
              </button>
            ))}
          </div>
        </div>

        {/* 排序 */}
        <div>
          <label className="mb-1 block text-xs text-[var(--db-text-muted)]">排序 (越小越前面)</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
            className="dashboard-input w-32 px-4 py-2.5 text-sm"
          />
        </div>

        {/* 開關 */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-[var(--db-text)]">
            <input type="checkbox" checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })} className="accent-[var(--db-primary)]" />
            置頂
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--db-text)]">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-[var(--db-primary)]" />
            發佈
          </label>
        </div>
      </div>
    </div>
  );
}
