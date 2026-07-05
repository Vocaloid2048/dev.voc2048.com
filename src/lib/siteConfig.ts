/**
 * 網站配置讀取 — 服務端函數，從資料庫讀取 SiteConfig。
 * Site config reader — server-side function that reads SiteConfig from database.
 */
import { prisma } from "@/lib/prisma";

export interface SiteConfig {
  siteName: string;
  siteSlogan: string;
  nameDisplay: string;
  siteQuote: string;
  seoKeywords: string; // JSON array string
  favicon: string;
  background: string;
  bgGradientEnabled: boolean;
  cherryBlossomEnabled: boolean;
  cherryBlossomCount: number;
  heroJob: string;
  homeIntro: string;
  homeBlocks: string; // JSON string for building blocks
  aboutBio: string;
}

const DEFAULTS: SiteConfig = {
  siteName: "夜芷冰的星空夜談",
  siteSlogan: "變量為何要羨慕常數？",
  nameDisplay: "夜芷冰",
  siteQuote: "讓冷冰冰的軟體，跳出窩心的溫度",
  seoKeywords: "[]",
  favicon: "",
  background: "",
  bgGradientEnabled: true,
  cherryBlossomEnabled: true,
  cherryBlossomCount: 30,
  heroTitle: "你好呀~ 我係 {name} 🎸",
  heroSubtitle: "Hello ~ I'm Vocchi",
  heroJob: "跨平台應用程式開發者 From HK",
  homeIntro: "# 你好呀~ 我係 {name} 🎸\n### 跨平台應用程式開發者 From HK\n\nHello ~ I'm Vocchi",
  homeBlocks: JSON.stringify([
    { id: "1", type: "heading", content: "你好呀~ 我係 {name} 🎸", level: 1 },
    { id: "2", type: "heading", content: "跨平台應用程式開發者 From HK", level: 3 },
    { id: "3", type: "text", content: "Hello ~ I'm Vocchi" },
    { id: "4", type: "chips", items: ["React", "Next.js", "TypeScript", "Kotlin"] },
  ]),
  aboutBio: "",
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
      nameDisplay: map["site.name_display"] || DEFAULTS.nameDisplay,
      siteQuote: map["site.quote"] || DEFAULTS.siteQuote,
      seoKeywords: map["site.seo_keywords"] || DEFAULTS.seoKeywords,
      favicon: map["site.favicon"] || DEFAULTS.favicon,
      background: map["site.background"] || DEFAULTS.background,
      bgGradientEnabled:
        map["effects.bg_gradient"] !== undefined
          ? map["effects.bg_gradient"] === "true"
          : DEFAULTS.bgGradientEnabled,
      cherryBlossomEnabled:
        map["effects.cherry_blossom"] !== undefined
          ? map["effects.cherry_blossom"] === "true"
          : DEFAULTS.cherryBlossomEnabled,
      cherryBlossomCount: map["effects.cherry_blossom_count"]
        ? parseInt(map["effects.cherry_blossom_count"], 10)
        : DEFAULTS.cherryBlossomCount,
      heroTitle: map["home.hero_title"] || DEFAULTS.heroTitle,
      heroSubtitle: map["home.hero_subtitle"] || DEFAULTS.heroSubtitle,
      heroJob: map["home.hero_job"] || DEFAULTS.heroJob,
      homeIntro: map["home.intro"] || DEFAULTS.homeIntro,
      homeBlocks: map["home.blocks"] || DEFAULTS.homeBlocks,
      aboutBio: map["about.bio"] || DEFAULTS.aboutBio,
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
    "effects.bg_gradient": config.bgGradientEnabled ? "true" : "false",
    "effects.cherry_blossom": config.cherryBlossomEnabled ? "true" : "false",
    "effects.cherry_blossom_count": String(config.cherryBlossomCount),
    "home.hero_title": config.heroTitle,
    "home.hero_subtitle": config.heroSubtitle,
    "home.hero_job": config.heroJob,
    "home.intro": config.homeIntro,
    "home.blocks": config.homeBlocks,
    "about.bio": config.aboutBio,
  };
}
