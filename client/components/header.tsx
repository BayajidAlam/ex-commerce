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
import { ShoppingCart, User, LogOut, Settings } from "lucide-react";
import { useCartStore, useAuthStore } from "@/lib/store";
import { logoutAction } from "@/lib/actions/auth";
import Link from "next/link";
import SearchDropdown from "./SearchDropdown";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { items, getTotalItems } = useCartStore();
  const { user, isAuthenticated } = useAuthStore(); // Get user from Zustand store

  // Check if we're in admin dashboard
  const isAdminDashboard = pathname?.startsWith("/admin/dashboard");

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
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ARJO
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-gray-700 hover:text-gray-900"
            >
              Categories
            </Link>
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
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center w-full"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
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
