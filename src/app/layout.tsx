import type { Metadata } from "next";

import "./globals.css";
import Navigation from "../components/Navigation/Navigation";
import Footer from "@/components/Footer";
import { TopHeader } from "@/components/TopHeader";

export const metadata: Metadata = {
  title: "EasyTracker ",
  description: "Easy dumpster tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <TopHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
