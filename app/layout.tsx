import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "حكايات ومشاعر | نتعلم ونكبر معًا", description: "حكايات تفاعلية تساعد الأطفال على فهم مشاعرهم والتعامل معها" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ar" dir="rtl"><body>{children}</body></html>; }
