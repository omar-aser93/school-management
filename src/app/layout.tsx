import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });            //The default Font

//The head metadata (title, description, ...)
export const metadata: Metadata = {
  title: "School Management Dashboard",
  description: "Next.js School Management System",
};

//RootLayout is the default main layout , can't be removed
export default function RootLayout({ children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
