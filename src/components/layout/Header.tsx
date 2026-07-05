"use client";

/**
 * 藥丸型霧化導航列。
 * Pill-shaped frosted glass navigation bar.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Sun, Moon, Languages, Home, FileText, PenTool, Clock, Lightbulb, MoreHorizontal } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  siteName?: string;
  siteSlogan?: string;
  adminAvatar?: string;
}

export function Header({ siteName, siteSlogan, adminAvatar }: HeaderProps) {
  const t = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { key: "home", href: "/", icon: Home },
    { key: "articles", href: "/articles", icon: FileText },
    { key: "notes", href: "/notes", icon: PenTool },
    { key: "timeline", href: "/timeline", icon: Clock },
    { key: "thinking", href: "/thinking", icon: Lightbulb },
    { key: "more", href: "/more", icon: MoreHorizontal },
  ] as const;

  // 關閉語言選單 (點擊外部)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "" || pathname === "/";
    return pathname.startsWith(href);
  };

  const switchLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw]">
      <nav
        className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 shadow-2xl backdrop-blur-2xl"
        style={{ WebkitBackdropFilter: "blur(20px)" }}
      >
        {/* 左側：頭像 + 網站標題 */}
        <div className="flex items-center gap-2 pl-2 pr-1 mr-1 border-r border-white/10">
          <div className="h-6 w-6 overflow-hidden rounded-full border border-white/20 shrink-0">
            <img
              src={adminAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Vocchi"}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden lg:flex items-center whitespace-nowrap overflow-hidden">
            <span className="text-xs font-bold text-white/90 truncate max-w-[120px]">
              {siteName || "夜芷冰"}
            </span>
            {siteSlogan && (
              <>
                <span className="mx-1 text-white/20">-</span>
                <span className="text-[10px] text-white/50 truncate max-w-[150px]">
                  {siteSlogan}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 導航連結 */}
        <div className="flex items-center gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all rounded-full hover:bg-white/5 ${isActive(item.href) ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              {isActive(item.href) && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon size={14} className="opacity-80" />
              <span className="relative z-10 hidden sm:inline-block whitespace-nowrap">{t(item.key)}</span>
            </Link>
          ))}
        </div>

        <div className="mx-2 h-4 w-px bg-white/10" />

        {/* 右側: 語言切換 + 主題切換 */}
        <div className="flex items-center gap-0.5">
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Languages size={14} />
            </button>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-3 w-32 rounded-2xl border border-white/10 bg-black/60 p-1 shadow-2xl backdrop-blur-2xl"
              >
                <button
                  onClick={() => switchLocale("zh-TW")}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-white/5 ${locale === "zh-TW" ? "text-primary font-medium" : "text-white/60"}`}
                >
                  繁體中文
                </button>
                <button
                  onClick={() => switchLocale("en")}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-white/5 ${locale === "en" ? "text-primary font-medium" : "text-white/60"}`}
                >
                  English
                </button>
              </motion.div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-full p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
            >
              {theme === "nightstar-light" ? <Moon size={14} /> : <Sun size={14} />}
            </motion.div>
          </button>
        </div>
      </nav>
    </header>
  );
}

