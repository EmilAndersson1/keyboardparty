import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keyboard Party",
  description: "Animated landing page built with Next.js",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html
      lang="en"
      className="bg-black [background-image:radial-gradient(120%_80%_at_50%_10%,#18213c_0%,#090b12_50%,#000_100%)]"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-transparent antialiased`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
