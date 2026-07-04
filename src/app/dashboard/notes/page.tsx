"use client";

/**
 * 筆記管理列表頁 — 顯示所有筆記，支援搜尋、篩選、刪除。
 * Notes management list — all notes with search, filter, delete.
 */
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Pin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  slug: string;
  type: string;
  mood: string | null;
  isPinned: boolean;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  category: { name: string } | null;
  tags: { name: string }[];
}

const typeLabels: Record<string, string> = {
  DIARY: "日記",
  ARTICLE: "長文",
  SENTENCE: "好句子",
};

export default function DashboardNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeFilter) params.set("type", typeFilter);
    params.set("limit", "100");

    const res = await fetch(`/api/notes?${params}`);
    const data = await res.json();
    setNotes(data.notes || []);
    setLoading(false);
  }, [search, typeFilter]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這篇筆記嗎？")) return;
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  const handleTogglePin = async (note: Note) => {
    await fetch(`/api/notes/${note.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...note, isPinned: !note.isPinned }),
    });
    fetchNotes();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--db-text)]">筆記管理</h1>
        <Link
          href="/dashboard/notes/new"
          className="dashboard-btn-primary flex items-center gap-1.5 px-4 py-2 text-sm"
        >
          <Plus size={16} />
          新增筆記
        </Link>
      </div>

      {/* 搜尋與篩選 */}
      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋標題或內容..."
            suppressHydrationWarning
            className="dashboard-input w-full py-2 pl-10 pr-4 text-sm"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="dashboard-input px-3 py-2 text-sm"
        >
          <option value="">全部類型</option>
          <option value="DIARY">日記</option>
          <option value="ARTICLE">長文</option>
          <option value="SENTENCE">好句子</option>
        </select>
      </div>

      {/* 筆記列表 */}
      {loading ? (
        <p className="text-[var(--db-text-muted)]">載入中...</p>
      ) : notes.length === 0 ? (
        <div className="dashboard-card p-8 text-center text-[var(--db-text-muted)]">
          暫無筆記
        </div>
      ) : (
        <div className="dashboard-card overflow-hidden">
          <table className="dashboard-table w-full text-sm">
            <thead className="bg-[rgba(242,193,195,0.05)]">
              <tr>
                <th className="px-4 py-2 text-left">標題</th>
                <th className="px-4 py-2 text-left">類型</th>
                <th className="px-4 py-2 text-left">分類</th>
                <th className="px-4 py-2 text-left">狀態</th>
                <th className="px-4 py-2 text-left">瀏覽</th>
                <th className="px-4 py-2 text-left">更新時間</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-[var(--db-text)]">
              {notes.map((note) => (
                <tr key={note.id}>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      {note.isPinned && <Pin size={12} className="text-[var(--db-primary)]" />}
                      <span className={note.isPublished ? "" : "opacity-50"}>
                        {note.title || "(無標題)"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="rounded-full bg-[var(--db-primary-muted)] px-2 py-0.5 text-xs text-[var(--db-primary)]">
                      {typeLabels[note.type] || note.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-[var(--db-text-muted)]">
                    {note.category?.name || "—"}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`text-xs ${note.isPublished ? "text-[var(--db-success)]" : "text-[var(--db-text-muted)]"}`}>
                      {note.isPublished ? "已發佈" : "草稿"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-[var(--db-text-muted)]">{note.viewCount}</td>
                  <td className="px-4 py-2 text-[var(--db-text-muted)]">
                    {formatDate(note.updatedAt)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleTogglePin(note)}
                        className="rounded-lg p-1.5 text-[var(--db-text-muted)] hover:bg-[rgba(242,193,195,0.1)]"
                        title={note.isPinned ? "取消置頂" : "置頂"}
                      >
                        <Pin size={14} />
                      </button>
                      <Link
                        href={`/dashboard/notes/${note.id}`}
                        className="rounded-lg p-1.5 text-[var(--db-text-muted)] hover:bg-[rgba(242,193,195,0.1)]"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="rounded-lg p-1.5 text-[var(--db-error)] hover:bg-[rgba(201,122,122,0.1)]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
