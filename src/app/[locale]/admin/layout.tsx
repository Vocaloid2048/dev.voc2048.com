"use client";

/**
 * 後台佈局 — 側邊欄導航 + 認證檢查。
 * Admin layout — sidebar navigation + auth check.
 */
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Upload,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard, label: "儀表盤" },
  { key: "notes", href: "/admin/notes", icon: FileText, label: "筆記管理" },
  { key: "works", href: "/admin/works", icon: FolderGit2, label: "作品管理" },
  { key: "files", href: "/admin/files", icon: Upload, label: "檔案管理" },
  { key: "settings", href: "/admin/settings", icon: Settings, label: "系統設置" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          const redirect = encodeURIComponent(pathname);
          router.push(`/${locale}/admin/login?redirect=${redirect}`);
          setAuthed(false);
        } else {
          setAuthed(true);
        }
      })
      .catch(() => {
        router.push(`/${locale}/admin/login`);
        setAuthed(false);
      });
  }, [router, pathname, locale]);

  // 登入頁面不需要側邊欄
  const isLoginPage = pathname.includes("/admin/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-base-content/50">載入中...</p>
      </div>
    );
  }

  if (!authed) return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      {/* 側邊欄 */}
      <aside className="sticky top-0 h-screen w-56 shrink-0 border-r border-base-300/30 bg-base-200/20 p-4">
        <h2 className="mb-6 px-2 text-lg font-bold">管理後台</h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === `/${locale}${item.href}`;
            return (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${active ? "bg-primary/15 text-primary font-medium" : "hover:bg-base-300/30"}`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-error/70 transition-colors hover:bg-error/10"
        >
          <LogOut size={16} />
          登出
        </button>
      </aside>

      {/* 主內容 */}
      <main className="min-w-0 flex-1 p-6">{children}</main>
    </div>
  );
}
