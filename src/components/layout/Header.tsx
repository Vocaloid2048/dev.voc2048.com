"use client";

/**
 * 藥丸型霧化導航列。
 * Pill-shaped frosted glass navigation bar.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const t = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { key: "home", href: "/" },
    { key: "notes", href: "/notes" },
    { key: "works", href: "/works" },
    { key: "about", href: "/about" },
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
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl">
      <nav
        className="flex items-center justify-between gap-2 rounded-full border border-base-300/50 bg-base-100/60 px-3 py-2 shadow-lg backdrop-blur-xl"
        style={{ WebkitBackdropFilter: "blur(12px)" }}
      >
        {/* 左側: 導航連結 */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="relative px-3 py-1.5 text-sm font-medium transition-colors rounded-full hover:text-primary"
            >
              {isActive(item.href) && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-primary/15"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t(item.key)}</span>
            </Link>
          ))}
        </div>

        {/* 右側: 語言切換 + 主題切換 */}
        <div className="flex items-center gap-1">
          {/* 語言切換 */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-base-200/50"
              aria-label="Switch language"
            >
              <Languages size={16} />
              <span className="uppercase">{locale === "zh-TW" ? "中" : "EN"}</span>
            </button>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-32 rounded-2xl border border-base-300/50 bg-base-100/80 p-1 shadow-xl backdrop-blur-xl"
              >
                <button
                  onClick={() => switchLocale("zh-TW")}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-base-200/50 ${locale === "zh-TW" ? "text-primary font-medium" : ""}`}
                >
                  繁體中文
                </button>
                <button
                  onClick={() => switchLocale("en")}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-base-200/50 ${locale === "en" ? "text-primary font-medium" : ""}`}
                >
                  English
                </button>
              </motion.div>
            )}
          </div>

          {/* 主題切換 */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-base-200/50"
            aria-label={theme === "nightstar-light" ? tTheme("dark") : tTheme("light")}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {theme === "nightstar-light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </motion.div>
          </button>
        </div>
      </nav>
    </header>
  );
}
