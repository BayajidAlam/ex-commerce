"use server";

import { redirect } from "next/navigation";
import { setAuthCookie, removeAuthCookie, LoginResponse } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Login server action
export async function loginAction(
  prevState: any,
  formData: FormData
): Promise<LoginResponse> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Basic validation
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    // Call your backend API
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Login failed",
        errors: data.errors,
      };
    }

    // Set HTTP-only cookie
    await setAuthCookie(data.token);

    // Check if user is admin and redirect accordingly
    if (data.user && data.user.role === "admin") {
      redirect("/admin/dashboard");
    }

    return {
      success: true,
      message: data.message,
      user: data.user,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// Register server action
export async function registerAction(
  prevState: any,
  formData: FormData
): Promise<LoginResponse> {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    // Call your backend API
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Registration failed",
        errors: data.errors,
      };
    }

    // Set HTTP-only cookie
    await setAuthCookie(data.token);

    return {
      success: true,
      message: data.message,
      user: data.user,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// Logout server action
export async function logoutAction() {
  await removeAuthCookie();
  redirect("/");
}

// Forgot Password server action
export async function forgotPasswordAction(
  prevState: any,
  formData: FormData
): Promise<LoginResponse> {
  try {
    const email = formData.get("email") as string;

    // Basic validation
    if (!email) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    // Call your backend API
    const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Failed to send reset email",
        errors: data.errors,
      };
    }

    return {
      success: true,
      message: data.message,
      resetToken: data.resetToken, // Only for development
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// Reset Password server action
export async function resetPasswordAction(
  prevState: any,
  formData: FormData
): Promise<LoginResponse> {
  try {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Basic validation
    if (!token || !password || !confirmPassword) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    // Call your backend API
    const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Failed to reset password",
        errors: data.errors,
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
