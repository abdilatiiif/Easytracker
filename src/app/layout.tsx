import type { Metadata } from "next";

import "./globals.css";
import Navigation from "../components/Navigation/Navigation";
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
        {children}
        <Footer />
      </body>
    </html>
  );
}
