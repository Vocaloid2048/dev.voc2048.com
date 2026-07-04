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

interface SiteConfigData {
  background?: string;
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

  // Dashboard 路由下不顯示前端元素
  if (pathname?.startsWith("/dashboard")) {
    return <>{children}</>;
  }

  return (
    <>
      <CherryBlossom
        count={config?.cherryBlossomCount ?? 30}
        enabled={config?.cherryBlossomEnabled ?? true}
      />
      <Header />
      <main className="relative z-10 min-h-screen pt-20">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
