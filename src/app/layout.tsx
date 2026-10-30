import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Rubik } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import MobileBottomNav from "@/components/MobileBottomNav";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-main",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "WHITE BOX — High-Tech Hardware, Electronics & Living Gear",
  description: "Official WhiteBox Store: Premium smartphones, pro headphones, high-grade tools, and smart lifestyle equipment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${rubik.variable}`}>
      <head>
        <link rel="icon" href="/whitebox-logo.png" />
      </head>
      <body>
        <CartProvider>
          {children}
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
