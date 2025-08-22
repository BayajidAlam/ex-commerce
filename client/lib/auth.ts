import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Server-side auth utilities
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'user' | 'seller'
}

export interface LoginResponse {
  success: boolean
  message?: string
  token?: string
  user?: User
  errors?: Array<{ field: string; message: string }>
}

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}

// Get auth token from cookies
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth-token')?.value || null
}

// Remove auth cookie
export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

// Get current user from server
export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Always get fresh user data
    })

    if (!response.ok) {
      // Token is invalid, remove it
      await removeAuthCookie()
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Check if user is authenticated (for server components)
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

// Require authentication (redirect if not authenticated)
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

// Redirect if already authenticated
export async function redirectIfAuthenticated(redirectTo: string = '/') {
  const user = await getCurrentUser()
  if (user) {
    redirect(redirectTo)
  }
}