"use client";

/**
 * 頁尾 — 版權聲明與網站資訊。
 * Footer — copyright notice and site info.
 */
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-base-300/30 py-8">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <p className="text-sm text-base-content/60">
          © {year} {t("copyright")}
        </p>
        <p className="mt-1 text-xs text-base-content/40">
          {t("rights")} · {t("license")}
        </p>
      </div>
    </footer>
  );
}
