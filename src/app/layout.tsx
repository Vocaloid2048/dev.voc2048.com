import type { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { FrontendChrome } from "@/components/layout/FrontendChrome";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/siteConfig";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  const keywords = config.seoKeywords
    ? (() => {
        try {
          return JSON.parse(config.seoKeywords) as string[];
        } catch {
          return [];
        }
      })()
    : [];

  return {
    title: config.siteName || "夜芷冰的星空夜談",
    description: config.siteSlogan || "變量為何要羨慕常數？讓冷冰冰的軟體，跳出窩心的溫度。",
    keywords: keywords.length > 0 ? keywords : undefined,
    icons: config.favicon
      ? { icon: config.favicon, shortcut: config.favicon }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const config = await getSiteConfig();

  // 取得管理員頭像以在 Header 顯示
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { avatar: true },
  });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            {/* 套用自訂背景圖 */}
            {config.background && (
              <style>{`
                body::before {
                  content: "";
                  position: fixed;
                  inset: 0;
                  z-index: 2;
                  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${config.background});
                  background-size: cover;
                  background-position: center;
                  background-attachment: fixed;
                  opacity: 0.8;
                  pointer-events: none;
                }
              `}</style>
            )}
            <FrontendChrome
              config={{
                siteName: config.siteName,
                siteSlogan: config.siteSlogan,
                adminAvatar: admin?.avatar || undefined,
                background: config.background,
                bgGradientEnabled: config.bgGradientEnabled,
                cherryBlossomEnabled: config.cherryBlossomEnabled,
                cherryBlossomCount: config.cherryBlossomCount,
              }}
            >
              {children}
            </FrontendChrome>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
