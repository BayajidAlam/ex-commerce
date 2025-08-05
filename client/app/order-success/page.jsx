"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Download } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"

export default function OrderSuccessPage() {
  const orderNumber = "185853"
  const orderDate = "2025/Jul/27 04:38 pm"
  const total = "31,500 TK"
  const paymentMethod = "Cash on delivery"

  const orderDetails = [{ product: "Maulana Gold Vietnam × 9", total: "31,500 TK" }]

  // Customer details (you can get this from checkout form data or store)
  const customerInfo = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+880 1234 567890",
    address: "123 Main Street, Dhaka, Bangladesh"
  }

  const downloadInvoice = () => {
    // Create invoice HTML content
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice #${orderNumber}</title>
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
            <div><strong>Invoice #:</strong> ${orderNumber}</div>
            <div><strong>Date:</strong> ${orderDate}</div>
          </div>
          <div class="info-row">
            <div><strong>Payment Method:</strong> ${paymentMethod}</div>
            <div><strong>Status:</strong> Pending</div>
          </div>
        </div>

        <div class="info-section">
          <h3>Bill To:</h3>
          <div>${customerInfo.name}</div>
          <div>${customerInfo.email}</div>
          <div>${customerInfo.phone}</div>
          <div>${customerInfo.address}</div>
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
            ${orderDetails.map(item => `
              <tr>
                <td>${item.product.split(' × ')[0]}</td>
                <td>${item.product.split(' × ')[1] || '1'}</td>
                <td>${item.total}</td>
                <td>${item.total}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="2">Subtotal</td>
              <td></td>
              <td>31,500 TK</td>
            </tr>
            <tr>
              <td colspan="2">Shipping</td>
              <td></td>
              <td>0 TK</td>
            </tr>
            <tr>
              <td colspan="2">Tax</td>
              <td></td>
              <td>0 TK</td>
            </tr>
            <tr class="total-row">
              <td colspan="2"><strong>Total Amount</strong></td>
              <td></td>
              <td><strong>31,500 TK</strong></td>
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
    link.download = `Invoice-${orderNumber}.html`
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
                  <span className="text-red-500 font-bold">Sample Order #01</span>
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
        </div>
      </div>
    </div>
  )
}