"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";

interface ClientAuthSyncProps {
  user: any;
}

// This component only syncs auth state - doesn't wrap content
export function ClientAuthSync({ user }: ClientAuthSyncProps) {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    console.log(
      "🔄 ClientAuthSync received user:",
      user ? `${user.firstName} ${user.lastName}` : "null"
    );

    if (user) {
      setUser({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
      console.log("✅ User set in auth store");
    } else {
      clearUser();
      console.log("❌ User cleared from auth store");
    }
  }, [user, setUser, clearUser]);

  // This component renders nothing - it just syncs state
  return null;
}
