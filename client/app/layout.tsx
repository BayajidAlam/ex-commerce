import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";
import { ClientAuthSync } from "@/components/ClientAuthSync";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Aluna - Premium Fashion & Bestselling Products",
  description:
    "Discover premium fashion with our curated collection of watches, sunglasses, jewelry, and bags. Shop our most loved and bestselling products with fast delivery.",
  keywords:
    "fashion, watches, sunglasses, jewelry, bags, bestselling products, most popular items, premium accessories, loved by customers",
  openGraph: {
    title: "Aluna - Premium Fashion & Bestselling Products",
    description:
      "Discover premium fashion with our curated collection. Shop our most loved and bestselling products.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get user from server-side cookies
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {/* This small client component syncs auth state without making everything client-side */}
        <ClientAuthSync user={user} />
        <Toaster richColors position="top-right" />
        {/* All your pages remain server-side rendered! */}
        {children}
      </body>
    </html>
  );
}
