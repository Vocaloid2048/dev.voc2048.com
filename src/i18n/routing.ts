/**
 * next-intl 路由配置。
 * next-intl routing configuration — defines supported locales.
 */
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh-TW", "en"],
  defaultLocale: "zh-TW",
  localePrefix: "never",
});

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
