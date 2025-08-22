import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";
import { ClientAuthSync } from "@/components/ClientAuthSync";

export const metadata: Metadata = {
  title: "Aluna",
  description: "Create by Bayajid Alam Joyel",
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
        {/* All your pages remain server-side rendered! */}
        {children}
      </body>
    </html>
  );
}
