import type { Metadata } from "next";

import "./globals.css";
import Navigation from "../components/Navigation";
import Footer from "@/components/Footer";

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
        {children}
        <Footer />
      </body>
    </html>
  );
}
