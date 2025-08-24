import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if this is an admin route
  if (pathname.startsWith("/admin")) {
    // Check if user is authenticated and has admin role
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // In a real app, you'd decode the JWT and check the role
    // For now, we'll let the component handle the role check
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
