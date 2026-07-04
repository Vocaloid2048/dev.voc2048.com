import type { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { CherryBlossom } from "@/components/effects/CherryBlossom";
import "./globals.css";

export const metadata: Metadata = {
  title: "夜芷冰的星空夜談",
  description: "变量为何要羡慕常数？让冷冰冰的软体，跳出窝心的温度。",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <CherryBlossom count={30} enabled={true} />
            <Header />
            <main className="relative z-10 min-h-screen pt-20">
              {children}
            </main>
            <Footer />
            <BackToTop />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
