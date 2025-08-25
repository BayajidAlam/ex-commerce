"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { forgotPasswordAction } from "@/lib/actions/auth";
import Link from "next/link";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [state, formAction] = useFormState(forgotPasswordAction, {
    success: false,
    message: "",
  });

  // Handle successful email send
  useEffect(() => {
    if (state?.success) {
      setEmailSent(true);
    }
  }, [state?.success]);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    formAction(formData);
    setIsPending(false);
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Check your email
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            {state?.message ||
              "We've sent a password reset link to your email address."}
          </p>
          {/* Show reset token in development */}
          {process.env.NODE_ENV === "development" && state?.resetToken && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800">
                <strong>Development Mode:</strong> Reset token:
                <br />
                <code className="text-xs break-all">{state.resetToken}</code>
              </p>
              <Link
                href={`/reset-password?token=${state.resetToken}`}
                className="text-xs text-blue-600 hover:underline mt-2 block"
              >
                Click here to reset password (dev only)
              </Link>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Button
            onClick={() => setEmailSent(false)}
            variant="outline"
            className="w-full"
          >
            Send another email
          </Button>
          <Link href="/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Error Message */}
      {state && !state.success && state.message && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {state.message}
        </div>
      )}

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your email address"
          disabled={isPending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending reset link...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <div className="text-center">
        <Link href="/login">
          <Button variant="ghost" className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
        </Link>
      </div>
    </form>
  );
}
