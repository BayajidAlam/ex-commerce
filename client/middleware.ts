import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const protectedRoutes = [
  "/checkout",
  "/order-success",
  "/profile",
  "/dashboard",
  "/orders",
];

// Admin routes that require admin role
const adminRoutes = ["/admin"];

// Auth routes that should redirect if already authenticated
const authRoutes = ["/login", "/register"];

async function verifyToken(
  token: string
): Promise<{ isValid: boolean; user?: any }> {
  try {
    const response = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return { isValid: true, user: userData.user };
    }
    return { isValid: false };
  } catch {
    return { isValid: false };
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path is admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Check if current path is auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // Handle admin routes
  if (isAdminRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { isValid, user } = await verifyToken(token);

    if (!isValid) {
      const response = NextResponse.next();
      response.cookies.delete("auth-token");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin role
    if (user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // If it's a protected route and no token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, verify it
  if (token) {
    const { isValid, user } = await verifyToken(token);

    // If token is invalid, remove it and redirect if on protected route
    if (!isValid) {
      const response = NextResponse.next();
      response.cookies.delete("auth-token");

      if (isProtectedRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      return response;
    }

    // If valid token and on auth route, redirect based on user role
    if (isAuthRoute) {
      if (user?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
