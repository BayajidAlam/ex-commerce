import { Suspense } from "react";
import { redirectIfAuthenticated } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

// This is a server component - great for SEO!
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  // Redirect if already authenticated
  await redirectIfAuthenticated();

  const token = searchParams.token;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
                <p className="text-gray-600">
                  The password reset link is invalid or has expired.
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <Link href="/forgot-password">
                    <button className="text-primary hover:underline">
                      Request a new reset link
                    </button>
                  </Link>
                  <div>
                    <Link
                      href="/login"
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Back to login
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <p className="text-gray-600">Enter your new password</p>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm token={token} />
              </Suspense>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// SEO metadata
export const metadata = {
  title: "Reset Password - ARJO",
  description: "Reset your ARJO account password.",
};
