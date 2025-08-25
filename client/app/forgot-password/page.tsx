import { Suspense } from "react";
import { redirectIfAuthenticated } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

// This is a server component - great for SEO!
export default async function ForgotPasswordPage() {
  // Redirect if already authenticated
  await redirectIfAuthenticated();

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Forgot Password</CardTitle>
              <p className="text-gray-600">
                Enter your email to reset your password
              </p>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <ForgotPasswordForm />
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
  title: "Forgot Password - ARJO",
  description: "Reset your ARJO account password.",
};
