import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // 引入 Next.js 脚本组件

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "OfferVision | 职场财务价值深度诊断",
  description: "基于 AI 的 Offer 薪资对比与财务价值分析工具，一键生成 4 年累计收益趋势报告。",
  keywords: "薪资对比, Offer选择, 税后工资计算, 公积金计算, 职场财务规划",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* Cloudflare Web Analytics 统计脚本 */}
        {/* 提示：请在 Cloudflare 控制台开启 Web Analytics 并替换下方的 token */}
        <Script
          defer
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "YOUR_CLOUDFLARE_ANALYTICS_TOKEN"}'
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}