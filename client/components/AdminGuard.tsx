"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait for auth state to be determined
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // If authenticated but not admin, redirect to home
      if (user && user.role !== "admin") {
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show nothing if not authenticated or not admin
  if (!isAuthenticated || (user && user.role !== "admin")) {
    return null;
  }

  // Render children if admin
  return <>{children}</>;
}
