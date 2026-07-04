"use client";

/**
 * 檔案管理頁 — 上傳、列表、刪除、複製 URL。
 * File management — upload, list, delete, copy URL.
 */
import { useState, useEffect, useCallback } from "react";
import { Upload, Trash2, Copy, Check, FileText, Image as ImageIcon } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface FileItem {
  id: string;
  filename: string;
  storedName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export default function DashboardFilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/upload");
    const data = await res.json();
    setFiles(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append("file", file);
        await fetch("/api/upload", { method: "POST", body: formData });
      }
      fetchFiles();
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這個檔案嗎？")) return;
    await fetch(`/api/upload/${id}`, { method: "DELETE" });
    fetchFiles();
  };

  const copyUrl = async (file: FileItem) => {
    const fullUrl = `${window.location.origin}${file.url}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--db-text)]">檔案管理</h1>
        <label className="dashboard-btn-primary flex cursor-pointer items-center gap-1.5 px-4 py-2 text-sm">
          <Upload size={16} /> {uploading ? "上傳中..." : "上傳檔案"}
          <input
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
            accept="image/*,.pdf,.txt,.zip"
          />
        </label>
      </div>

      {loading ? (
        <p className="text-[var(--db-text-muted)]">載入中...</p>
      ) : files.length === 0 ? (
        <div className="dashboard-card p-8 text-center text-[var(--db-text-muted)]">
          暫無檔案
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => (
            <div key={file.id} className="dashboard-card overflow-hidden">
              {/* 預覽 */}
              <div className="flex h-32 items-center justify-center bg-[rgba(242,193,195,0.05)]">
                {isImage(file.mimeType) ? (
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FileText size={32} className="text-[var(--db-text-muted)]" />
                )}
              </div>

              <div className="p-3">
                <p className="truncate text-sm font-medium text-[var(--db-text)]" title={file.filename}>
                  {file.filename}
                </p>
                <p className="mt-0.5 text-xs text-[var(--db-text-muted)]">
                  {formatFileSize(file.size)} · {file.mimeType}
                </p>
                <p className="mt-0.5 text-xs text-[var(--db-text-muted)]">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </p>

                <div className="mt-2 flex gap-1">
                  <button
                    onClick={() => copyUrl(file)}
                    className="dashboard-btn-ghost flex flex-1 items-center justify-center gap-1 py-1.5 text-xs"
                  >
                    {copiedId === file.id ? <Check size={12} /> : <Copy size={12} />}
                    {copiedId === file.id ? "已複製" : "複製 URL"}
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
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
