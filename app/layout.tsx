import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "电商小工 - 卖家的 AI 小工",
  description: "卖家的 AI 小工，差评标题一键搞定",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
        <Header />
        <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
