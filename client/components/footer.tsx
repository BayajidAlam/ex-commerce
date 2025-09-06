"use client";

import { useState, useEffect } from "react";

// Site settings interface
interface SiteSettings {
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export default function Footer() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Fetch site settings
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_BASE}/api/site-settings`);
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data.siteSettings);
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      }
    };
    fetchSiteSettings();
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              {siteSettings?.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt={siteSettings.siteName || "ARJO"}
                  className="h-8 w-auto max-w-[120px] object-contain brightness-0 invert"
                />
              ) : (
                <h3 className="text-xl font-bold">
                  {siteSettings?.siteName || "ARJO"}
                </h3>
              )}
            </div>
            <p className="text-primary-foreground/80 text-sm">
              {siteSettings?.description ||
                "Premium quality men's fashion and traditional wear."}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="/" className="hover:text-primary-foreground uppercase">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="hover:text-primary-foreground uppercase"
                >
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground uppercase">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground uppercase">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a
                  href="/products?category=bag&page=1"
                  className="hover:text-primary-foreground uppercase tracking-wider"
                >
                  BAG
                </a>
              </li>
              <li>
                <a
                  href="/products?category=glass&page=1"
                  className="hover:text-primary-foreground uppercase tracking-wider"
                >
                  GLASS
                </a>
              </li>
              <li>
                <a
                  href="/products?category=jewelry&page=1"
                  className="hover:text-primary-foreground uppercase tracking-wider"
                >
                  JEWELRY
                </a>
              </li>
              <li>
                <a
                  href="/products?category=watch&page=1"
                  className="hover:text-primary-foreground uppercase tracking-wider"
                >
                  WATCH
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p>Phone: {siteSettings?.contactPhone || "+880 123 456 789"}</p>
              <p>Email: {siteSettings?.contactEmail || "info@arjo.com"}</p>
              <p>Address: {siteSettings?.address || "Dhaka, Bangladesh"}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
          <p>
            &copy; 2024 {siteSettings?.siteName || "ARJO"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
