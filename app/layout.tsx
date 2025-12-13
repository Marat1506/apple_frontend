import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "./providers";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dubliz - Premium Apple Store",
  description: "A production-ready, premium e-commerce platform for Apple products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </Providers>
      </body>
    </html>
  );
}
