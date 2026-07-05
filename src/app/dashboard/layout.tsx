"use client";

/**
 * 後台佈局 — 深色主題側邊欄，隱藏前端導航。
 * Dashboard layout — dark theme sidebar, hides frontend navigation.
 *
 * 特點：
 * - 不顯示前端 Header / Footer / 櫻花動畫
 * - 強制深色微紋理背景（或讀取 assets/dashboard_image）
 * - 側邊欄含語言切換（獨立於前端）+ 登出
 * - 自動認證檢查 + Setup 重導
 * - 導航區域可捲動，不覆蓋底部語言/登出按鈕
 */
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Upload,
  Settings,
  LogOut,
  Languages,
  Info,
} from "lucide-react";
import "./dashboard.css";

/** 側邊欄導航項目（雙語）。 */
const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: { "zh-TW": "儀表盤", en: "Dashboard" } },
  { href: "/dashboard/info", icon: Info, label: { "zh-TW": "資訊設定", en: "Information" } },
  { href: "/dashboard/notes", icon: FileText, label: { "zh-TW": "筆記管理", en: "Notes" } },
  { href: "/dashboard/works", icon: FolderGit2, label: { "zh-TW": "作品管理", en: "Works" } },
  { href: "/dashboard/files", icon: Upload, label: { "zh-TW": "檔案管理", en: "Files" } },
  { href: "/dashboard/settings", icon: Settings, label: { "zh-TW": "系統設置", en: "Settings" } },
];

/** 支援的後台語言。 */
const dashboardLocales = ["zh-TW", "en"] as const;
type DashboardLocale = (typeof dashboardLocales)[number];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [locale, setLocale] = useState<DashboardLocale>("zh-TW");

  // 從 localStorage 讀取後台語言偏好（獨立於前端）
  useEffect(() => {
    const saved = localStorage.getItem("dashboard-locale");
    if (saved && dashboardLocales.includes(saved as DashboardLocale)) {
      setLocale(saved as DashboardLocale);
    }
  }, []);

  // 認證 + Setup 檢查
  useEffect(() => {
    // setup 頁面不需要認證
    if (pathname.includes("/dashboard/setup")) {
      return;
    }

    // login 頁面不需要認證
    if (pathname.includes("/dashboard/login")) {
      return;
    }

    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) {
          // 檢查是否需要 setup
          const setupRes = await fetch("/api/auth/setup");
          const setupData = await setupRes.json();
          if (setupData.needsSetup) {
            router.push("/dashboard/setup");
            setNeedsSetup(true);
            return;
          }
          const redirect = encodeURIComponent(pathname);
          router.push(`/dashboard/login?redirect=${redirect}`);
          setAuthed(false);
        } else {
          setAuthed(true);
        }
      })
      .catch(() => {
        router.push("/dashboard/login");
        setAuthed(false);
      });
  }, [router, pathname]);

  // 切換後台語言（獨立於前端，存 localStorage）
  const switchLocale = (newLocale: DashboardLocale) => {
    setLocale(newLocale);
    localStorage.setItem("dashboard-locale", newLocale);
  };

  // 登出
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  };

  // Setup 與 Login 頁面不需要側邊欄
  const isAuthPage =
    pathname.includes("/dashboard/login") ||
    pathname.includes("/dashboard/setup");

  if (isAuthPage) {
    return (
      <div className="dashboard-root">
        <DashboardBackground type="login" />
        {children}
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="dashboard-root">
        <DashboardBackground type="dashboard" />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-[var(--db-text-muted)]">正在跳轉到初始化設定...</p>
        </div>
      </div>
    );
  }

  if (authed === null) {
    return (
      <div className="dashboard-root">
        <DashboardBackground type="dashboard" />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-[var(--db-text-muted)]">載入中...</p>
        </div>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="dashboard-root">
      <DashboardBackground type="dashboard" />

      <div className="flex min-h-screen">
        {/* 側邊欄 — flex-col 佈局，導航區可捲動，底部固定 */}
        <aside className="dashboard-sidebar sticky top-0 flex h-screen w-56 shrink-0 flex-col">
          {/* 標題（固定不捲動） */}
          <div className="shrink-0 p-4 pb-2">
            <h2 className="px-2 text-lg font-bold text-[var(--db-text)]">
              {locale === "zh-TW" ? "後台管理" : "Admin Panel"}
            </h2>
          </div>

          {/* 導航區（可捲動） */}
          <nav className="dashboard-nav-scroll flex-1 overflow-y-auto px-4 py-2">
            <div className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`dashboard-nav-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${active ? "active" : ""}`}
                  >
                    <item.icon size={16} />
                    {item.label[locale]}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* 底部：語言切換 + 登出（固定不捲動） */}
          <div className="shrink-0 border-t border-[var(--db-border)] p-4">
            {/* 語言切換器（獨立於前端） */}
            <div className="mb-3">
              <div className="mb-1.5 flex items-center gap-1.5 px-2 text-xs text-[var(--db-text-muted)]">
                <Languages size={12} />
                {locale === "zh-TW" ? "語言" : "Language"}
              </div>
              <div className="dashboard-lang-switch">
                {dashboardLocales.map((l) => (
                  <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className={locale === l ? "active" : ""}
                  >
                    {l === "zh-TW" ? "繁中" : "EN"}
                  </button>
                ))}
              </div>
            </div>

            {/* 登出按鈕 */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--db-error)] transition-colors hover:bg-[rgba(201,122,122,0.1)]"
            >
              <LogOut size={16} />
              {locale === "zh-TW" ? "登出" : "Logout"}
            </button>
          </div>
        </aside>

        {/* 主內容區 */}
        <main className="min-w-0 flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * 後台背景元件 — 深色微紋理或讀取自訂圖片。
 * Dashboard background — dark micro-texture or custom image.
 *
 * 讀取順序：
 * 1. assets/dashboard_image.<ext> (或 assets/login_image.<ext>)
 * 2. 預設深色微紋理
 */
function DashboardBackground({ type }: { type: "dashboard" | "login" }) {
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    // 嘗試載入自訂背景圖
    const imageName = type === "login" ? "login_image" : "dashboard_image";
    const extensions = ["jpg", "jpeg", "png", "webp", "gif", "svg"];

    const tryLoadImage = (idx: number) => {
      if (idx >= extensions.length) return;
      const ext = extensions[idx];
      const img = new Image();
      img.onload = () => setBgImage(`/assets/${imageName}.${ext}`);
      img.onerror = () => tryLoadImage(idx + 1);
      img.src = `/assets/${imageName}.${ext}`;
    };

    tryLoadImage(0);
  }, [type]);

  return (
    <div
      className={`dashboard-bg ${bgImage ? "has-image" : ""}`}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    />
  );
}
