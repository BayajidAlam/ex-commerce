"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { useCartStore, useAuthStore } from "@/lib/store";
import { logoutAction } from "@/lib/actions/auth";
import { getCategoriesClient, type Category } from "@/lib/api/categories";
import Link from "next/link";
import SearchDropdown from "./SearchDropdown";

// Site settings interface
interface SiteSettings {
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  description: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { items, getTotalItems } = useCartStore();
  const { user, isAuthenticated } = useAuthStore(); // Get user from Zustand store
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Check if we're in admin dashboard
  const isAdminDashboard = pathname?.startsWith("/admin/dashboard");

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

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategoriesClient();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Calculate total items directly from items array - this will update when items change
  const totalItems = items.reduce(
    (total: number, item: any) => total + item.quantity,
    0
  );

  // Debug cart updates
  useEffect(() => {
    console.log(
      "🛒 Cart items updated in header:",
      items.length,
      "items, total quantity:",
      totalItems
    );
  }, [items, totalItems]);

  // Debug auth state
  useEffect(() => {
    console.log("🔒 Auth state in header:", {
      isAuthenticated,
      user: user ? `${user.firstName} ${user.lastName}` : null,
    });
  }, [isAuthenticated, user]);

  const handleAdminSearch = (query: string) => {
    // For admin dashboard, trigger a global search event
    const searchEvent = new CustomEvent("adminGlobalSearch", {
      detail: { query: query.trim() },
    });
    window.dispatchEvent(searchEvent);
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {siteSettings?.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt={siteSettings.siteName || "ARJO"}
                  className="h-8 w-auto max-w-[120px] object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {siteSettings?.siteName || "ARJO"}
                </span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link
              href="/products?page=1"
              className="text-gray-700 hover:text-gray-900"
            >
              Products
            </Link>
            {/* Dynamic Category Links */}
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}&page=1`}
                className="text-gray-700 hover:text-gray-900 capitalize"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <SearchDropdown
                placeholder={
                  isAdminDashboard
                    ? "Search admin data..."
                    : "Search products..."
                }
                onSearch={isAdminDashboard ? handleAdminSearch : undefined}
              />
            </div>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    {user.firstName} {user.lastName}
                  </DropdownMenuItem>

                  {/* Show Admin Dashboard for admin users */}
                  {user.role === "admin" ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center w-full"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/site-settings"
                          className="flex items-center w-full"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Site Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/banners"
                          className="flex items-center w-full"
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Banner Management
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center w-full"
                      >
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Show My Orders only for non-admin users */}
                  {user.role !== "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center w-full">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
