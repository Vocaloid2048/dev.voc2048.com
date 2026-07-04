"use client";

/**
 * 初始化設定頁 — 首次建立管理員帳號與網站配置。
 * Setup page — first-time admin account creation and site configuration.
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { User, Lock, Mail, Image as ImageIcon, Globe, Tag, FileImage, Sparkles, Plus, X, Upload } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [faviconError, setFaviconError] = useState("");

  // 檢查是否已有管理員帳號
  useEffect(() => {
    fetch("/api/auth/setup")
      .then((r) => r.json())
      .then((data) => {
        if (!data.needsSetup) {
          router.push("/dashboard");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  const [form, setForm] = useState({
    siteName: "夜芷冰的星空夜談",
    siteSlogan: "變量為何要羨慕常數？",
    favicon: "",
    avatar: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  /** 新增關鍵詞。 */
  const addKeyword = () => {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
      setKeywordInput("");
    }
  };

  /** 移除關鍵詞。 */
  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  /** Favicon 上傳 — 限制 500x500。 */
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaviconError("");

    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      if (img.width > 500 || img.height > 500) {
        setFaviconError(`圖片尺寸為 ${img.width}x${img.height}，超過 500x500 限制`);
        return;
      }
      setUploadingFavicon(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          setForm({ ...form, favicon: data.url });
        }
      } finally {
        setUploadingFavicon(false);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setFaviconError("無法讀取圖片檔案");
    };
    img.src = objectUrl;
  };

  /** 頭像上傳。 */
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setForm({ ...form, avatar: data.url });
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("兩次密碼不一致");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("密碼至少需要 6 個字元");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          seoKeywords: JSON.stringify(keywords),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "設定失敗");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("網路錯誤");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-base-content/50">檢查系統狀態...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-lg rounded-2xl border border-base-300/30 bg-base-200/30 p-8 backdrop-blur-xl"
      >
        <div className="mb-6 text-center">
          <Sparkles className="mx-auto mb-2 text-primary" size={28} />
          <h1 className="text-2xl font-bold">系統初始化設定</h1>
          <p className="mt-1 text-sm text-base-content/50">
            建立管理員帳號與網站基本配置
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 網站配置區 */}
          <div className="space-y-3 rounded-xl border border-base-300/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/40">
              網站設定
            </p>

            <Field
              icon={<Globe size={16} />}
              label="網站名稱"
              value={form.siteName}
              onChange={(v) => setForm({ ...form, siteName: v })}
              required
            />

            <Field
              icon={<Tag size={16} />}
              label="網站標語"
              value={form.siteSlogan}
              onChange={(v) => setForm({ ...form, siteSlogan: v })}
              required
            />

            {/* 搜尋關鍵詞 — Chip (+) */}
            <div>
              <label className="mb-1 block text-xs text-base-content/60">搜尋關鍵詞</label>
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                  placeholder="輸入關鍵詞後按 Enter"
                  className="w-full rounded-xl border border-base-300/50 bg-base-100/50 py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary/50"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="flex items-center gap-1 rounded-xl border border-base-300/50 px-3 py-2.5 text-sm transition-colors hover:border-primary/50"
                >
                  <Plus size={14} />
                </button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                    >
                      {kw}
                      <button type="button" onClick={() => removeKeyword(i)} className="hover:opacity-70">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Favicon 上傳 — 限制 500x500 */}
            <div>
              <label className="mb-1 block text-xs text-base-content/60">Favicon（限制 500x500）</label>
              <div className="flex items-center gap-3">
                {form.favicon && (
                  <img src={form.favicon} alt="favicon" className="h-10 w-10 rounded-lg border border-base-300/50 object-cover" />
                )}
                <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-base-300/50 px-4 py-2 text-sm transition-colors hover:border-primary/50">
                  <ImageIcon size={14} /> {uploadingFavicon ? "上傳中..." : "上傳"}
                  <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                </label>
              </div>
              {faviconError && (
                <p className="mt-1 text-xs text-error">{faviconError}</p>
              )}
            </div>
          </div>

          {/* 管理員帳號區 */}
          <div className="space-y-3 rounded-xl border border-base-300/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/40">
              管理員帳號
            </p>

            {/* 管理員頭像上傳 */}
            <div>
              <label className="mb-1 block text-xs text-base-content/60">管理員頭像</label>
              <div className="flex items-center gap-3">
                {form.avatar && (
                  <img src={form.avatar} alt="avatar" className="h-10 w-10 rounded-full border border-base-300/50 object-cover" />
                )}
                <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-base-300/50 px-4 py-2 text-sm transition-colors hover:border-primary/50">
                  <ImageIcon size={14} /> {uploadingAvatar ? "上傳中..." : "上傳"}
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
            </div>

            <Field
              icon={<User size={16} />}
              label="帳號名稱"
              value={form.username}
              onChange={(v) => setForm({ ...form, username: v })}
              required
            />

            <Field
              icon={<Mail size={16} />}
              label="電子郵件"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />

            <Field
              icon={<Lock size={16} />}
              label="密碼"
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              required
            />

            <Field
              icon={<Lock size={16} />}
              label="確認密碼"
              type="password"
              value={form.confirmPassword}
              onChange={(v) => setForm({ ...form, confirmPassword: v })}
              required
            />
          </div>

          {error && (
            <p className="text-center text-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-content transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "設定中..." : "完成初始化設定"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/**
 * 表單輸入欄位元件。
 * Form input field component.
 */
function Field({
  icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-base-content/60">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-base-300/50 bg-base-100/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary/50"
        />
      </div>
    </div>
  );
}
