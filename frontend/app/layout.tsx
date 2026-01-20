import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Make sure this path matches what you installed (sonner vs toaster)
// If you installed 'sonner', keep it. If 'toast', use "@/components/ui/toaster"
import { Toaster } from "@/components/ui/sonner"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Media App",
  description: "Assessment Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* All your pages will be rendered inside 'children' */}
        {children}
        
        {/* The Toast notification container sits here */}
        <Toaster />
      </body>
    </html>
  );
}