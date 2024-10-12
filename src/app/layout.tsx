import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PopupWidget }  from "@/components/PopupWidget";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Piranha Studios | We build software. No Jargon, No Mess, Just Results.",
  description: "Piranha Studios: Expert web developers Based In Birmingham UK specialising in healthcare and ecommerce solutions. Transform your business with our tailored digital experiences, from appointment systems to online shops and custom B2B portals. Get results-driven websites built for your unique needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" sizes="any"/>
      <body className={inter.className}>
      <ThemeProvider attribute="class">
        <Navbar/>
        <div>{children}</div>
        <Footer/>
        <PopupWidget/>
      </ThemeProvider>
      </body>
      </html>
  );
}
