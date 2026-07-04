"use client";

/**
 * 初始化設定頁 — 首次建立管理員帳號與網站配置。
 * Setup page — first-time admin account creation and site configuration.
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { User, Lock, Mail, Image as ImageIcon, Globe, Tag, FileImage, Sparkles } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

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
    seoDescription: "",
    favicon: "",
    avatar: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
        body: JSON.stringify(form),
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

            <Field
              icon={<FileImage size={16} />}
              label="搜尋引擎描述 (SEO)"
              value={form.seoDescription}
              onChange={(v) => setForm({ ...form, seoDescription: v })}
              placeholder="出現在搜尋結果中的網站描述"
            />

            <Field
              icon={<ImageIcon size={16} />}
              label="Favicon URL"
              value={form.favicon}
              onChange={(v) => setForm({ ...form, favicon: v })}
              placeholder="/favicon.ico"
            />
          </div>

          {/* 管理員帳號區 */}
          <div className="space-y-3 rounded-xl border border-base-300/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/40">
              管理員帳號
            </p>

            <Field
              icon={<ImageIcon size={16} />}
              label="管理員頭像 URL"
              value={form.avatar}
              onChange={(v) => setForm({ ...form, avatar: v })}
              placeholder="https://..."
            />

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
