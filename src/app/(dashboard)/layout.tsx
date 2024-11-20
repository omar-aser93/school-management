import { ClerkProvider } from "@clerk/nextjs";      //ClerkProvider we wrap it around the layout
import Image from "next/image";
import Link from "next/link";
import "../globals.css";
import { auth } from "@clerk/nextjs/server";
/* react-toastify, we pass the ToastContainer in the layout */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/* components that will be used inside the layout so they can be part of every page by default */
import Menu from "@/components/general/Menu";
import Navbar from "@/components/general/Navbar";


//The head metadata (title, description, ...)
export const metadata = {
  title: "School Management Dashboard",
  description: "Next.js School Management System",
};

// Typescript Type for a layout {children} is React.ReactNode 
export default function DashboardLayout({children}: Readonly<{ children: React.ReactNode }>) {

  //clerk auth() hook to get current session_user data & get his role from the metadata, will use it with the logo link
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <div className="h-screen flex">
          {/* LEFT */}
          <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 overflow-y-scroll">
            <Link href={`/${role}`} className="flex items-center justify-center lg:justify-start gap-2" >
              <Image src="/logo.png" alt="logo" width={32} height={32} />
              <span className="hidden lg:block font-bold">Omar School</span>
            </Link>
            <Menu />
          </div>
      
          {/* RIGHT */}
          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-y-scroll flex flex-col">
            <Navbar />
            {children}   
            <ToastContainer position="bottom-right" theme="dark" />
          </div>
        </div>
        </body>
      </html>
    </ClerkProvider>
  );
}