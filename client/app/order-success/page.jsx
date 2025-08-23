"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  Download, 
  Loader2, 
  Package, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  CreditCard,
  ArrowRight,
  Home,
  ShoppingBag,
  Copy,
  Check
} from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"
import { getOrderById } from "@/lib/actions/orders"
import { toast } from "sonner"
import Image from "next/image"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(!!orderId)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  // Default data if no order ID provided (fallback)
  const defaultOrderData = {
    orderNumber: "ALN185853",
    createdAt: new Date().toISOString(),
    totalAmount: 31500,
    paymentMethod: "cod",
    status: "pending",
    items: [{ 
      product: { name: "Premium T-Shirt", images: [{ url: "/placeholder.jpg" }] },
      quantity: 2,
      price: 15000,
      color: "Navy Blue",
      size: "L"
    }],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com", 
      phone: "+880 1234 567890",
      street: "123 Main Street",
      city: "Dhaka"
    },
    shipping: 120,
    tax: 1575
  }

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const result = await getOrderById(orderId)
        
        if (result.success) {
          setOrder(result.order)
        } else {
          setError(result.message || "Failed to fetch order details")
          toast.error("Failed to load order details")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        setError("An unexpected error occurred")
        toast.error("Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  // Use fetched order data or fallback to default
  const orderData = order || defaultOrderData
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatPrice = (price) => {
    return `৳${price.toLocaleString()}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderData.orderNumber)
      setCopied(true)
      toast.success("Order number copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy order number")
    }
  }

  const downloadInvoice = () => {
    // Create invoice HTML content with real order data
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice #${orderData.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; color: #333; }
          .invoice-title { font-size: 20px; margin: 10px 0; }
          .info-section { margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          .table th { background-color: #f5f5f5; font-weight: bold; }
          .total-row { font-weight: bold; background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">ARJO</div>
          <div class="invoice-title">INVOICE</div>
        </div>

        <div class="info-section">
          <div class="info-row">
            <div><strong>Invoice #:</strong> ${orderData.orderNumber}</div>
            <div><strong>Date:</strong> ${formatDate(orderData.createdAt)}</div>
          </div>
          <div class="info-row">
            <div><strong>Payment Method:</strong> ${orderData.paymentMethod}</div>
            <div><strong>Status:</strong> Pending</div>
          </div>
        </div>

        <div class="info-section">
          <h3>Bill To:</h3>
          <div>${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}</div>
          <div>${orderData.shippingAddress.email || 'N/A'}</div>
          <div>${orderData.shippingAddress.phone || 'N/A'}</div>
          <div>${orderData.shippingAddress.street}, ${orderData.shippingAddress.city}</div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderData.items.map(item => `
              <tr>
                <td>${item.product?.name || 'Product'}</td>
                <td>${item.quantity}</td>
                <td>৳${item.price.toLocaleString()}</td>
                <td>৳${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3">Subtotal</td>
              <td>৳${(orderData.totalAmount - orderData.shipping - orderData.tax).toLocaleString()}</td>
            </tr>
            <tr>
              <td colspan="3">Shipping</td>
              <td>৳${orderData.shipping.toLocaleString()}</td>
            </tr>
            <tr>
              <td colspan="3">Tax</td>
              <td>৳${orderData.tax.toLocaleString()}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>Total Amount</strong></td>
              <td><strong>৳${orderData.totalAmount.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>For any queries, contact us at support@arjo.com or +880 123 456 7890</p>
        </div>
      </body>
      </html>
    `

    // Create and download the invoice
    const blob = new Blob([invoiceHTML], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Invoice-${orderData.orderNumber}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <Card className="p-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin mb-4" />
              <p>Loading order details...</p>
            </Card>
          ) : error ? (
            <Card className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <p className="font-semibold">Error loading order details</p>
                <p className="text-sm">{error}</p>
              </div>
              <div className="space-x-4">
                <Link href="/products">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
                <Link href="/">
                  <Button>Back to Home</Button>
                </Link>
              </div>
            </Card>
          ) : (
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
                    <p className="font-semibold">{orderData.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date:</p>
                    <p className="font-semibold">{formatDate(orderData.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total:</p>
                    <p className="font-semibold">{formatPrice(orderData.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment method:</p>
                    <p className="font-semibold">{orderData.paymentMethod}</p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Pay with cash upon delivery.</p>
                  <div className="inline-block border-2 border-red-500 px-6 py-2">
                    <span className="text-red-500 font-bold">Order #{orderData.orderNumber}</span>
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

                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <span className="text-gray-700">{item.product?.name || 'Product'}</span>
                          <span className="text-gray-500 text-sm"> × {item.quantity}</span>
                          {item.color && (
                            <span className="text-gray-500 text-sm"> • {item.color}</span>
                          )}
                          {item.size && (
                            <span className="text-gray-500 text-sm"> • {item.size}</span>
                          )}
                        </div>
                        <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}

                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(orderData.totalAmount - orderData.shipping - orderData.tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{formatPrice(orderData.shipping)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatPrice(orderData.tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment method</span>
                        <span>{orderData.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>{formatPrice(orderData.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Invoice Button */}
                <div className="text-center py-4">
                  <Button 
                    onClick={downloadInvoice}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Invoice
                  </Button>
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
          )}
        </div>
      </div>
    </div>
  )
}