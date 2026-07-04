"use client";

/**
 * 後台登入頁 — 帳號密碼登入。
 * Admin login page — username/password authentication.
 */
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Lock, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("common");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登入失敗");
        return;
      }

      const redirect = searchParams.get("redirect") || "/admin";
      router.push(redirect);
      router.refresh();
    } catch {
      setError("網路錯誤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-sm rounded-2xl border border-base-300/30 bg-base-200/30 p-8 backdrop-blur-xl"
      >
        <h1 className="mb-6 text-center text-2xl font-bold">管理後台</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="帳號"
              className="w-full rounded-xl border border-base-300/50 bg-base-100/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary/50"
              required
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密碼"
              className="w-full rounded-xl border border-base-300/50 bg-base-100/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary/50"
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
            {loading ? t("loading") : "登入"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
