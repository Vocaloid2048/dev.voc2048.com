/**
 * 語系佈局 — 全域 Header + Footer + 櫻花特效 + 主題 Provider。
 * Locale layout — global Header + Footer + cherry blossom + theme provider.
 */
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { CherryBlossom } from "@/components/effects/CherryBlossom";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <ThemeProvider>
        <html lang={locale} suppressHydrationWarning>
          <body className="min-h-screen antialiased">
            <CherryBlossom count={30} enabled={true} />
            <Header />
            <main className="relative z-10 pt-20">{children}</main>
            <Footer />
            <BackToTop />
          </body>
        </html>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
