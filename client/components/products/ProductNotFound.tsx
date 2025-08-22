import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import Header from '@/components/header'

export default function ProductNotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">
                <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Product Not Found
              </h1>
              
              <p className="text-gray-600 mb-6">
                Sorry, the product you're looking for doesn't exist or has been removed.
              </p>
              
              <div className="space-y-3">
                <Link href="/products">
                  <Button className="w-full">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Browse All Products
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}