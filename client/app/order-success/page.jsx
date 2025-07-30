"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"

export default function OrderSuccessPage() {
  const orderNumber = "185853"
  const orderDate = "2025/Jul/27 04:38 pm"
  const total = "31,500 TK"
  const paymentMethod = "Cash on delivery"

  const orderDetails = [{ product: "Maulana Gold Vietnam × 9", total: "31,500 TK" }]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden">
            {/* Green Header */}
            <div className="bg-green-600 text-white text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 mb-4" />
              <h1 className="text-3xl font-bold">Thank You</h1>
            </div>

            {/* Order Confirmation */}
            <div className="bg-gray-100 text-center py-6">
              <p className="text-gray-700">
                Your order has been successfully submitted. One of our representatives will call you shortly.
              </p>
            </div>

            <CardContent className="p-8 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order number:</p>
                  <p className="font-semibold">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date:</p>
                  <p className="font-semibold">{orderDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total:</p>
                  <p className="font-semibold">{total}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment method:</p>
                  <p className="font-semibold">{paymentMethod}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Pay with cash upon delivery.</p>
                <div className="inline-block border-2 border-red-500 px-6 py-2">
                  <span className="text-red-500 font-bold">Sample 01</span>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Order details</h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Product</span>
                    <span className="font-medium">Total</span>
                  </div>

                  {orderDetails.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">{item.product}</span>
                      <span className="font-semibold">{item.total}</span>
                    </div>
                  ))}

                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>31,500 TK</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>0 TK</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coupon</span>
                      <span>0 TK</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment method</span>
                      <span>Cash on delivery</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>31,500 TK</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link href="/products">
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full sm:w-auto">Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
