import { Suspense } from 'react'
import { redirectIfAuthenticated } from '@/lib/auth'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

// This is a server component - great for SEO!
export default async function RegisterPage() {
  // Redirect if already authenticated
  await redirectIfAuthenticated()

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <p className="text-gray-600">Join ARJO today</p>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <RegisterForm />
              </Suspense>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
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
  )
}

// SEO metadata
export const metadata = {
  title: 'Register - ARJO',
  description: 'Create your ARJO account to start shopping for premium fashion and accessories.',
}