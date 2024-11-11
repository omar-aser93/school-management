import { ClerkProvider } from "@clerk/nextjs";      //ClerkProvider we wrap it around layouts
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });            //The default Font

//The head metadata (title, description, ...)
export const metadata = {
  title: 'Welcome',
  description: 'School login',
}

//RootLayout is a default main layout (can't be removed), Typescript Type for a layout {children} is React.ReactNode 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
    <html lang="en">    
      <body className={inter.className}>{children}</body>
    </html>
    </ClerkProvider>
  )
}
