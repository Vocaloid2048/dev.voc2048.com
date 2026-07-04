"use client";

/**
 * 後台登入頁 — 帳號密碼登入，深色背景。
 * Dashboard login page — username/password auth, dark background.
 */
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Lock, User } from "lucide-react";

export default function DashboardLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 檢查是否需要 setup
  useEffect(() => {
    fetch("/api/auth/setup")
      .then((r) => r.json())
      .then((data) => {
        if (data.needsSetup) {
          router.push("/dashboard/setup");
        }
      })
      .catch(() => {});
  }, [router]);

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

      const redirect = searchParams.get("redirect") || "/dashboard";
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
        className="w-full max-w-sm rounded-2xl border border-[var(--db-border)] bg-[rgba(35,26,26,0.5)] p-8 backdrop-blur-xl"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-[var(--db-text)]">
          後台管理
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]"
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="帳號"
              className="dashboard-input w-full py-2.5 pl-10 pr-4 text-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密碼"
              className="dashboard-input w-full py-2.5 pl-10 pr-4 text-sm"
              required
            />
          </div>

          {error && (
            <p className="text-center text-sm text-[var(--db-error)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="dashboard-btn-primary w-full py-2.5 text-sm"
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
