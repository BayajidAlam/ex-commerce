"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"

export default function OrderSuccessPage() {
  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="mx-auto h-24 w-24 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-2xl font-bold text-primary">#{orderNumber}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <Package className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                  <p className="font-medium">Order Confirmed</p>
                  <p className="text-sm text-gray-600">Your order is being prepared</p>
                </div>
                <div className="text-center">
                  <Truck className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="font-medium text-gray-400">Shipped</p>
                  <p className="text-sm text-gray-400">We'll notify you when shipped</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="font-medium text-gray-400">Delivered</p>
                  <p className="text-sm text-gray-400">Estimated 3-5 business days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-gray-600">
              We've sent a confirmation email with your order details and tracking information.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
