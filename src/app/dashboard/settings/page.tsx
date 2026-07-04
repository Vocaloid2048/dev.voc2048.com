"use client";

/**
 * 系統設置頁 — 網站配置、背景圖、櫻花開關、備份管理。
 * System settings — site config, background, cherry blossom, backup management.
 */
import { useState, useEffect, useCallback } from "react";
import { Save, Upload, Download, RotateCcw, Trash2, Plus } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface Backup {
  id: string;
  filename: string;
  size: number;
  status: string;
  triggeredBy: string;
  createdAt: string;
}

export default function DashboardSettingsPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [backups, setBackups] = useState<Backup[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    const res = await fetch("/api/config");
    const data = await res.json();
    setConfig(data);
  }, []);

  const fetchBackups = useCallback(async () => {
    const res = await fetch("/api/backup");
    const data = await res.json();
    setBackups(Array.isArray(data) ? data : data.backups || []);
  }, []);

  useEffect(() => {
    fetchConfig();
    fetchBackups();
  }, [fetchConfig, fetchBackups]);

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

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setConfig({ ...config, "site.background": data.url });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleBackup = async () => {
    if (!confirm("確定要立即建立備份嗎？")) return;
    await fetch("/api/backup", { method: "POST" });
    fetchBackups();
  };

  const handleRestore = async (id: string) => {
    if (!confirm("復原將覆蓋目前資料，確定要繼續嗎？")) return;
    setRestoring(id);
    try {
      await fetch(`/api/backup/${id}/restore`, { method: "POST" });
      alert("復原完成");
    } finally {
      setRestoring(null);
      fetchBackups();
    }
  };

  const handleDeleteBackup = async (id: string) => {
    if (!confirm("確定要刪除此備份嗎？")) return;
    await fetch(`/api/backup/${id}`, { method: "DELETE" });
    fetchBackups();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[var(--db-text)]">系統設置</h1>

      {/* 網站基本配置 */}
      <section className="dashboard-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-[var(--db-text)]">網站配置</h2>
        <div className="space-y-4">
          <ConfigInput
            label="網站名稱"
            value={config["site.name"] || ""}
            onChange={(v) => setConfig({ ...config, "site.name": v })}
          />
          <ConfigInput
            label="網站標語"
            value={config["site.slogan"] || ""}
            onChange={(v) => setConfig({ ...config, "site.slogan": v })}
          />
          <ConfigInput
            label="首頁引言"
            value={config["site.quote"] || ""}
            onChange={(v) => setConfig({ ...config, "site.quote": v })}
          />
          <ConfigInput
            label="SEO 描述"
            value={config["site.seo_description"] || ""}
            onChange={(v) => setConfig({ ...config, "site.seo_description": v })}
          />
          <ConfigInput
            label="Favicon URL"
            value={config["site.favicon"] || ""}
            onChange={(v) => setConfig({ ...config, "site.favicon": v })}
          />
        </div>
      </section>

      {/* 背景與特效 */}
      <section className="dashboard-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-[var(--db-text)]">背景與特效</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--db-text-muted)]">自訂背景圖</label>
            <div className="flex items-center gap-3">
              {config["site.background"] && (
                <img
                  src={config["site.background"]}
                  alt="bg"
                  className="h-16 w-24 rounded-lg object-cover"
                />
              )}
              <label className="dashboard-btn-ghost flex cursor-pointer items-center gap-1.5 px-4 py-2 text-sm">
                <Upload size={14} /> {uploading ? "上傳中..." : "上傳背景圖"}
                <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
              </label>
            </div>
            <input
              type="text"
              value={config["site.background"] || ""}
              onChange={(e) => setConfig({ ...config, "site.background": e.target.value })}
              placeholder="或直接輸入圖片 URL"
              className="dashboard-input mt-2 w-full px-4 py-2 text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-[var(--db-text)]">
              <input
                type="checkbox"
                checked={config["effects.cherry_blossom"] === "true"}
                onChange={(e) => setConfig({ ...config, "effects.cherry_blossom": e.target.checked ? "true" : "false" })}
                className="accent-[var(--db-primary)]"
              />
              櫻花動畫
            </label>
          </div>

          <div>
            <label className="mb-1 block text-xs text-[var(--db-text-muted)]">櫻花花瓣數量</label>
            <input
              type="number"
              value={config["effects.cherry_blossom_count"] || "30"}
              onChange={(e) => setConfig({ ...config, "effects.cherry_blossom_count": e.target.value })}
              className="dashboard-input w-32 px-4 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* 儲存按鈕 */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="dashboard-btn-primary flex items-center gap-1.5 px-6 py-2.5 text-sm"
        >
          <Save size={16} /> {saving ? "儲存中..." : "儲存設置"}
        </button>
        {saved && <span className="text-sm text-[var(--db-success)]">已儲存</span>}
      </div>

      {/* 備份管理 */}
      <section className="dashboard-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--db-text)]">備份管理</h2>
          <button
            onClick={handleBackup}
            className="dashboard-btn-primary flex items-center gap-1.5 px-4 py-2 text-sm"
          >
            <Plus size={14} /> 立即備份
          </button>
        </div>

        {backups.length === 0 ? (
          <p className="py-4 text-center text-[var(--db-text-muted)]">暫無備份記錄</p>
        ) : (
          <div className="overflow-hidden">
            <table className="dashboard-table w-full text-sm">
              <thead className="bg-[rgba(242,193,195,0.05)]">
                <tr>
                  <th className="px-4 py-2 text-left">備份名稱</th>
                  <th className="px-4 py-2 text-left">大小</th>
                  <th className="px-4 py-2 text-left">狀態</th>
                  <th className="px-4 py-2 text-left">觸發</th>
                  <th className="px-4 py-2 text-left">時間</th>
                  <th className="px-4 py-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="text-[var(--db-text)]">
                {backups.map((backup) => (
                  <tr key={backup.id}>
                    <td className="px-4 py-2 font-mono text-xs">{backup.filename}</td>
                    <td className="px-4 py-2">{formatFileSize(backup.size)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          backup.status === "COMPLETED"
                            ? "bg-[rgba(140,185,154,0.15)] text-[var(--db-success)]"
                            : "bg-[rgba(201,122,122,0.15)] text-[var(--db-error)]"
                        }`}
                      >
                        {backup.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{backup.triggeredBy}</td>
                    <td className="px-4 py-2 text-[var(--db-text-muted)]">
                      {new Date(backup.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleRestore(backup.id)}
                          disabled={restoring === backup.id}
                          className="rounded-lg p-1.5 text-[var(--db-primary)] hover:bg-[rgba(242,193,195,0.1)] disabled:opacity-50"
                          title="復原"
                        >
                          <RotateCcw size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteBackup(backup.id)}
                          className="rounded-lg p-1.5 text-[var(--db-error)] hover:bg-[rgba(201,122,122,0.1)]"
                          title="刪除"
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
      </section>
    </div>
  );
}

/** 配置輸入欄位元件。 */
function ConfigInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-[var(--db-text-muted)]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="dashboard-input w-full px-4 py-2 text-sm"
      />
    </div>
  );
}
