import { Suspense } from 'react'
import { redirectIfAuthenticated } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

// This is a server component - great for SEO!
export default async function LoginPage({
  searchParams
}: {
  searchParams: { redirect?: string }
}) {
  // Redirect if already authenticated
  await redirectIfAuthenticated()

  // Get redirect URL from search params
  const redirectTo = searchParams.redirect || '/'

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <p className="text-gray-600">Sign in to your account</p>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <LoginForm redirectTo={redirectTo} />
              </Suspense>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// SEO metadata
export const metadata = {
  title: 'Login - ARJO',
  description: 'Sign in to your ARJO account to access your orders, wishlist, and more.',
}