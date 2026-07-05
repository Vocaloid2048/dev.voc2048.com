"use client";

/**
 * 前端外殼 — 條件渲染 Header/Footer/CherryBlossom/BackToTop。
 * Frontend chrome — conditionally renders Header/Footer/CherryBlossom/BackToTop.
 *
 * 在 /dashboard 路由下不顯示任何前端元素，直接渲染 children。
 * Does not render frontend elements on /dashboard routes.
 */
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { CherryBlossom } from "@/components/effects/CherryBlossom";
import { BackgroundGradient } from "@/components/effects/BackgroundGradient";

interface SiteConfigData {
  siteName?: string;
  siteSlogan?: string;
  adminAvatar?: string;
  background?: string;
  bgGradientEnabled?: boolean;
  cherryBlossomEnabled?: boolean;
  cherryBlossomCount?: number;
}

export function FrontendChrome({
  children,
  config,
}: {
  children: React.ReactNode;
  config?: SiteConfigData;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // 背景組件應在所有頁面渲染
  const background = (
    <BackgroundGradient 
      enabled={config?.bgGradientEnabled ?? true} 
      hasBackground={!!config?.background}
    />
  );

  // Dashboard 路由下僅顯示背景，不顯示導航列與頁腳
  if (isDashboard) {
    return (
      <div className="relative z-10">
        {background}
        {children}
      </div>
    );
  }

  return (
    <div className="relative z-10">
      {background}
      <CherryBlossom
        count={config?.cherryBlossomCount ?? 30}
        enabled={config?.cherryBlossomEnabled ?? true}
      />
      <Header 
        siteName={config?.siteName} 
        siteSlogan={config?.siteSlogan} 
        adminAvatar={config?.adminAvatar}
      />
      <main className="relative z-10 min-h-screen pt-20">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
