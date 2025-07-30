import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientToaster } from "@/components/client-toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TheHangout - Accessories, Streetwear, and Fashion",
  description:
    "Discover the latest in accessories, streetwear, and fashion at TheHangout. Shop now for unique styles and trends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ClientToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
