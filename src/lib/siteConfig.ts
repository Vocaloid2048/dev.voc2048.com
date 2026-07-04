/**
 * 網站配置讀取 — 服務端函數，從資料庫讀取 SiteConfig。
 * Site config reader — server-side function that reads SiteConfig from database.
 */
import { prisma } from "@/lib/prisma";

export interface SiteConfig {
  siteName: string;
  siteSlogan: string;
  siteQuote: string;
  seoKeywords: string; // JSON array string
  favicon: string;
  background: string;
  cherryBlossomEnabled: boolean;
  cherryBlossomCount: number;
}

const DEFAULTS: SiteConfig = {
  siteName: "夜芷冰的星空夜談",
  siteSlogan: "變量為何要羨慕常數？",
  siteQuote: "讓冷冰冰的軟體，跳出窩心的溫度",
  seoKeywords: "[]",
  favicon: "",
  background: "",
  cherryBlossomEnabled: true,
  cherryBlossomCount: 30,
};

/**
 * 從資料庫讀取網站配置，合併預設值。
 * Reads site config from database, merged with defaults.
 * @returns 合併後的配置物件 / Merged config object.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const configs = await prisma.siteConfig.findMany();
    const map: Record<string, string> = {};
    for (const c of configs) {
      map[c.key] = c.value;
    }

    return {
      siteName: map["site.name"] || DEFAULTS.siteName,
      siteSlogan: map["site.slogan"] || DEFAULTS.siteSlogan,
      siteQuote: map["site.quote"] || DEFAULTS.siteQuote,
      seoKeywords: map["site.seo_keywords"] || DEFAULTS.seoKeywords,
      favicon: map["site.favicon"] || DEFAULTS.favicon,
      background: map["site.background"] || DEFAULTS.background,
      cherryBlossomEnabled:
        map["effects.cherry_blossom"] !== undefined
          ? map["effects.cherry_blossom"] === "true"
          : DEFAULTS.cherryBlossomEnabled,
      cherryBlossomCount: map["effects.cherry_blossom_count"]
        ? parseInt(map["effects.cherry_blossom_count"], 10)
        : DEFAULTS.cherryBlossomCount,
    };
  } catch {
    return DEFAULTS;
  }
}

/**
 * 將 SiteConfig 物件轉為 key-value map（用於 API 回應）。
 * Converts SiteConfig object to key-value map (for API responses).
 */
export function siteConfigToMap(config: SiteConfig): Record<string, string> {
  return {
    "site.name": config.siteName,
    "site.slogan": config.siteSlogan,
    "site.quote": config.siteQuote,
    "site.seo_keywords": config.seoKeywords,
    "site.favicon": config.favicon,
    "site.background": config.background,
    "effects.cherry_blossom": config.cherryBlossomEnabled ? "true" : "false",
    "effects.cherry_blossom_count": String(config.cherryBlossomCount),
  };
}
