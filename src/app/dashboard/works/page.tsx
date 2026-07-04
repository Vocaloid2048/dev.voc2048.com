"use client";

/**
 * 作品管理列表頁 — 顯示所有作品，支援新增、編輯、刪除。
 * Works management list — all works with create, edit, delete.
 */
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Pin, ExternalLink, Github } from "lucide-react";

interface Work {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  tags: string[] | null;
  isPinned: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function DashboardWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorks = useCallback(async () => {
    setLoading(true);
    // 取得所有作品（包含未發佈）— 用管理端 API
    const res = await fetch("/api/works?all=true");
    const data = await res.json();
    setWorks(Array.isArray(data) ? data : data.works || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這個作品嗎？")) return;
    await fetch(`/api/works/${id}`, { method: "DELETE" });
    fetchWorks();
  };

  const handleTogglePin = async (work: Work) => {
    await fetch(`/api/works/${work.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...work, isPinned: !work.isPinned }),
    });
    fetchWorks();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--db-text)]">作品管理</h1>
        <Link
          href="/dashboard/works/new"
          className="dashboard-btn-primary flex items-center gap-1.5 px-4 py-2 text-sm"
        >
          <Plus size={16} />
          新增作品
        </Link>
      </div>

      {loading ? (
        <p className="text-[var(--db-text-muted)]">載入中...</p>
      ) : works.length === 0 ? (
        <div className="dashboard-card p-8 text-center text-[var(--db-text-muted)]">
          暫無作品
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <div key={work.id} className="dashboard-card overflow-hidden">
              {/* 封面圖 */}
              {work.coverImage && (
                <div className="aspect-video overflow-hidden bg-[rgba(242,193,195,0.05)]">
                  <img
                    src={work.coverImage}
                    alt={work.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="mb-1 flex items-center gap-1.5">
                  {work.isPinned && <Pin size={12} className="text-[var(--db-primary)]" />}
                  <h3 className="font-semibold text-[var(--db-text)]">{work.title}</h3>
                  {!work.isPublished && (
                    <span className="text-xs text-[var(--db-text-muted)]">(草稿)</span>
                  )}
                </div>
                <p className="mb-2 line-clamp-2 text-sm text-[var(--db-text-muted)]">
                  {work.description}
                </p>

                {/* 標籤 */}
                {work.tags && Array.isArray(work.tags) && work.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {work.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-[var(--db-primary-muted)] px-2 py-0.5 text-xs text-[var(--db-primary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 連結 */}
                <div className="mb-3 flex gap-2">
                  {work.demoUrl && (
                    <a
                      href={work.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
                    >
                      <ExternalLink size={12} /> Demo
                    </a>
                  )}
                  {work.repoUrl && (
                    <a
                      href={work.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
                    >
                      <Github size={12} /> Repo
                    </a>
                  )}
                </div>

                {/* 操作按鈕 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTogglePin(work)}
                    className="dashboard-btn-ghost flex-1 py-1.5 text-xs"
                  >
                    {work.isPinned ? "取消置頂" : "置頂"}
                  </button>
                  <Link
                    href={`/dashboard/works/${work.id}`}
                    className="dashboard-btn-ghost flex items-center gap-1 px-3 py-1.5 text-xs"
                  >
                    <Edit2 size={12} /> 編輯
                  </Link>
                  <button
                    onClick={() => handleDelete(work.id)}
                    className="rounded-lg px-3 py-1.5 text-xs text-[var(--db-error)] hover:bg-[rgba(201,122,122,0.1)]"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
