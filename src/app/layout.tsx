import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "夜芷冰的星空夜談",
  description: "變量為何要羨慕常數？讓冷冰冰的軟體，跳出窩心的溫度。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
