import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientToaster } from "@/components/client-toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Hangout Store",
  description:
    "Discover the latest trends in streetwear, designed for the next generation.",
    icons: {
      icon: "/TheHangOut.png",
    }
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
