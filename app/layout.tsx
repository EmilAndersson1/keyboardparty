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
      className="bg-black [background-image:radial-gradient(80%_66%_at_50%_50%,#18213a_0%,#141c31_18%,#10172a_34%,#0c1221_48%,rgba(10,15,26,0.94)_60%,rgba(8,12,21,0.78)_70%,rgba(5,8,14,0.52)_78%,rgba(3,5,9,0.26)_85%,transparent_90%)]"
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
