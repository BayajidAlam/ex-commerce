"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Check,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import Header from "@/components/header";
import Link from "next/link";
import { getOrderById } from "@/lib/actions/orders";
import { toast } from "sonner";
import Image from "next/image";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!orderId);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Default data if no order ID provided (fallback)
  const defaultOrderData = {
    orderNumber: "ALN185853",
    createdAt: new Date().toISOString(),
    totalAmount: 31500,
    paymentMethod: "cod",
    status: "pending",
    items: [
      {
        product: {
          name: "Premium T-Shirt",
          images: [{ url: "/placeholder.jpg" }],
        },
        quantity: 2,
        price: 15000,
        color: "Navy Blue",
        size: "L",
      },
    ],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+880 1234 567890",
      street: "123 Main Street",
      city: "Dhaka",
    },
    shipping: 120,
    tax: 1575,
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const result = await getOrderById(orderId);

        if (result.success) {
          setOrder(result.order);
        } else {
          setError(result.message || "Failed to fetch order details");
          toast.error("Failed to load order details");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("An unexpected error occurred");
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Use fetched order data or fallback to default
  const orderData = order || defaultOrderData;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPrice = (price) => {
    return `৳${price.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return {
          title: "Order Received!",
          message:
            "Thank you for your purchase. Your order is being processed.",
          bgColor: "from-yellow-500 to-amber-600",
          icon: Clock,
        };
      case "confirmed":
        return {
          title: "Order Confirmed!",
          message:
            "Your order has been confirmed and is being prepared for shipment.",
          bgColor: "from-blue-500 to-indigo-600",
          icon: CheckCircle,
        };
      case "shipped":
        return {
          title: "Order Shipped!",
          message: "Your order is on its way. You should receive it soon.",
          bgColor: "from-purple-500 to-violet-600",
          icon: Truck,
        };
      case "delivered":
        return {
          title: "Order Delivered!",
          message:
            "Your order has been successfully delivered. Enjoy your purchase!",
          bgColor: "from-green-500 to-emerald-600",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          title: "Order Cancelled",
          message:
            "This order has been cancelled. If you have questions, please contact support.",
          bgColor: "from-red-500 to-rose-600",
          icon: XCircle,
        };
      default:
        return {
          title: "Order Placed!",
          message: "Your order has been received.",
          bgColor: "from-gray-500 to-slate-600",
          icon: Package,
        };
    }
  };

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderData.orderNumber);
      setCopied(true);
      toast.success("Order number copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy order number");
    }
  };

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
            <div><strong>Payment Method:</strong> ${
              orderData.paymentMethod
            }</div>
            <div><strong>Status:</strong> Pending</div>
          </div>
        </div>

        <div class="info-section">
          <h3>Bill To:</h3>
          <div>${orderData.shippingAddress.firstName} ${
      orderData.shippingAddress.lastName
    }</div>
          <div>${orderData.shippingAddress.email || "N/A"}</div>
          <div>${orderData.shippingAddress.phone || "N/A"}</div>
          <div>${orderData.shippingAddress.street}, ${
      orderData.shippingAddress.city
    }</div>
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
            ${orderData.items
              .map(
                (item) => `
              <tr>
                <td>${item.product?.name || "Product"}</td>
                <td>${item.quantity}</td>
                <td>৳${item.price.toLocaleString()}</td>
                <td>৳${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `
              )
              .join("")}
            <tr class="total-row">
              <td colspan="3">Subtotal</td>
              <td>৳${(
                orderData.totalAmount -
                orderData.shipping -
                orderData.tax
              ).toLocaleString()}</td>
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
    `;

    // Create and download the invoice
    const blob = new Blob([invoiceHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${orderData.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <Card className="p-12 text-center border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-600 mb-6" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Loading Order Details
              </h2>
              <p className="text-gray-500">
                Please wait while we fetch your order information...
              </p>
            </Card>
          ) : error ? (
            <Card className="p-12 text-center border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <div className="text-red-500 mb-6">
                <Package className="mx-auto h-16 w-16 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full sm:w-auto">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Back Button */}
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    Back to Home
                  </Button>
                </Link>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              {/* Status Header */}
              <Card
                className={`border-0 shadow-xl bg-gradient-to-r ${
                  getStatusDisplay(orderData.status).bgColor
                } text-white overflow-hidden`}
              >
                <CardContent className="p-4 text-center relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                      {(() => {
                        const StatusIcon = getStatusDisplay(
                          orderData.status
                        ).icon;
                        return <StatusIcon className="h-6 w-6" />;
                      })()}
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold mb-2">
                      {getStatusDisplay(orderData.status).title}
                    </h1>
                    <p className="text-xs sm:text-sm text-white/90 mb-3">
                      {getStatusDisplay(orderData.status).message}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm">
                      <span className="text-white/80">Order #</span>
                      <Badge
                        className="bg-white/20 text-white border-white/30 text-xs px-2 py-1 cursor-pointer hover:bg-white/30 transition-colors break-all font-mono"
                        onClick={copyOrderNumber}
                      >
                        <span className="font-mono">
                          {orderData.orderNumber}
                        </span>
                        {copied ? (
                          <Check className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        ) : (
                          <Copy className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Summary */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Details Card */}
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Order Details
                        </h2>
                        <Badge
                          className={`${getStatusColor(
                            orderData.status
                          )} border`}
                        >
                          {orderData.status?.charAt(0).toUpperCase() +
                            orderData.status?.slice(1)}
                        </Badge>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-4">
                        {orderData.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border"
                          >
                            <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                              <Image
                                src={
                                  item.product?.images?.[0]?.url ||
                                  "/placeholder.svg"
                                }
                                alt={item.product?.name || "Product"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {item.product?.name || "Product"}
                              </h4>
                              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                                <span className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  Qty: {item.quantity}
                                </span>
                                {item.color && (
                                  <span className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                    {item.color}
                                  </span>
                                )}
                                {item.size && (
                                  <Badge variant="outline" className="text-xs">
                                    {item.size}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatPrice(item.price)} × {item.quantity}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Address Card */}
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Shipping Address
                      </h3>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-900">
                            {orderData.shippingAddress.firstName}{" "}
                            {orderData.shippingAddress.lastName}
                          </p>
                          <p className="text-gray-700">
                            {orderData.shippingAddress.street}
                          </p>
                          <p className="text-gray-700">
                            {orderData.shippingAddress.city},{" "}
                            {orderData.shippingAddress.zipCode}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              {orderData.shippingAddress.phone}
                            </div>
                            {orderData.shippingAddress.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-4 w-4" />
                                {orderData.shippingAddress.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary Sidebar */}
                <div className="space-y-6">
                  {/* Order Info Card */}
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Order Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Placed on</span>
                          <span className="font-medium">
                            {formatDate(orderData.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <CreditCard className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Payment</span>
                          <span className="font-medium">
                            {orderData.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : orderData.paymentMethod}
                          </span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Price Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span>
                            {formatPrice(
                              orderData.totalAmount -
                                orderData.shipping -
                                orderData.tax
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shipping</span>
                          <span>{formatPrice(orderData.shipping)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax</span>
                          <span>{formatPrice(orderData.tax)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-green-600">
                            {formatPrice(orderData.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <Button
                          onClick={downloadInvoice}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          size="lg"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Invoice
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Steps Card */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-purple-900 mb-3">
                        What's Next?
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-purple-600">
                              1
                            </span>
                          </div>
                          <p className="text-purple-800">
                            We'll call you within 24 hours to confirm your order
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-purple-600">
                              2
                            </span>
                          </div>
                          <p className="text-purple-800">
                            Your order will be processed and shipped within 2-3
                            business days
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-purple-600">
                              3
                            </span>
                          </div>
                          <p className="text-purple-800">
                            Pay cash when your order arrives at your doorstep
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href="/products" className="block">
                      <Button
                        variant="outline"
                        className="w-full bg-white/70 backdrop-blur-sm hover:bg-white border-gray-300"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Continue Shopping
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/" className="block">
                      <Button className="w-full bg-gray-900 hover:bg-gray-800">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
