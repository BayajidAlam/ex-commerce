"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { getUserOrders } from "@/lib/actions/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Package,
  MapPin,
  CreditCard,
  Clock,
  Eye,
  Download,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Truck,
  Phone,
  MoreHorizontal,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const formatPrice = (price) => `$${price?.toFixed(2) || "0.00"}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: Clock,
        message: "Order is being processed",
      },
      confirmed: {
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: CheckCircle,
        message: "Order confirmed",
      },
      shipped: {
        color: "bg-purple-100 text-purple-800 border-purple-300",
        icon: Truck,
        message: "Package is on the way",
      },
      delivered: {
        color: "bg-green-100 text-green-800 border-green-300",
        icon: CheckCircle,
        message: "Successfully delivered",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-300",
        icon: XCircle,
        message: "Order was cancelled",
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    totalValue: orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    ),
  };

  const downloadInvoice = (order) => {
    console.log("Downloading invoice for order:", order._id);
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      console.log("Fetching orders for user:", user.id);
      const result = await getUserOrders();

      if (result.success) {
        const ordersWithNumbers = result.orders.map((order, index) => ({
          ...order,
          orderNumber:
            order.orderNumber ||
            `ORD-${String(Date.now()).slice(-6)}-${index + 1}`,
        }));
        setOrders(ordersWithNumbers);
      } else {
        setError(result.error || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 shadow-xl">
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please login to view your orders
            </p>
            <Link href="/login">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Orders
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage your purchases
              </p>
            </div>
            <Button
              onClick={refreshOrders}
              variant="outline"
              className="flex items-center gap-2"
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold">{orderStats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Pending</p>
                  <p className="text-3xl font-bold">{orderStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Shipped</p>
                  <p className="text-3xl font-bold">{orderStats.shipped}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Delivered</p>
                  <p className="text-3xl font-bold">{orderStats.delivered}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Total Value</p>
                  <p className="text-2xl font-bold">
                    {formatPrice(orderStats.totalValue)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders by order number or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div>
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="animate-pulse bg-white/80 backdrop-blur-sm border-0"
                >
                  <CardHeader className="bg-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-32"></div>
                        <div className="h-4 bg-gray-300 rounded w-48"></div>
                      </div>
                      <div className="h-8 bg-gray-300 rounded w-20"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-3">
                        {[1, 2].map((j) => (
                          <div
                            key={j}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                            </div>
                            <div className="h-4 bg-gray-300 rounded w-20"></div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <div className="h-32 bg-gray-100 rounded-lg"></div>
                        <div className="h-24 bg-gray-100 rounded-lg"></div>
                        <div className="h-20 bg-gray-100 rounded-lg"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="bg-red-50 border-red-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  Error Loading Orders
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button
                  onClick={fetchOrders}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {searchQuery || selectedStatus !== "all"
                    ? "No matching orders found"
                    : "No orders yet"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery || selectedStatus !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "Start shopping to see your orders here. We have amazing products waiting for you!"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {searchQuery || selectedStatus !== "all" ? (
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedStatus("all");
                      }}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <Link href="/products">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Start Shopping
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <Card
                    key={order._id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
                  >
                    {/* Order Header */}
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900">
                              Order #{order.orderNumber}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Placed on {formatDate(order.createdAt)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                <span>
                                  {order.items.length} item
                                  {order.items.length > 1 ? "s" : ""}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-4 w-4" />
                                <span>{formatPrice(order.totalAmount)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`${statusInfo.color} border flex items-center gap-2 px-3 py-1.5 text-sm font-medium`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-2 max-w-32">
                            {statusInfo.message}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Items */}
                        <div className="lg:col-span-2">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-blue-600" />
                            Items Ordered
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border"
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
                                  <h5 className="font-medium text-gray-900 truncate">
                                    {item.product?.name || "Product Name"}
                                  </h5>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm text-gray-600">
                                      Qty: {item.quantity}
                                    </span>
                                    {item.color && (
                                      <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-gray-400 border"></div>
                                        <span className="text-sm text-gray-600">
                                          {item.color}
                                        </span>
                                      </div>
                                    )}
                                    {item.size && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {item.size}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    {formatPrice(item.price)} each
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-gray-900">
                                    {formatPrice(item.price * item.quantity)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary & Actions */}
                        <div className="space-y-6">
                          {/* Shipping Address */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-green-600" />
                              Shipping Address
                            </h4>
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <div className="space-y-1 text-sm">
                                <p className="font-medium text-gray-900">
                                  {order.shippingAddress?.firstName}{" "}
                                  {order.shippingAddress?.lastName}
                                </p>
                                <p className="text-gray-700">
                                  {order.shippingAddress?.street}
                                </p>
                                <p className="text-gray-700">
                                  {order.shippingAddress?.city},{" "}
                                  {order.shippingAddress?.zipCode}
                                </p>
                                {order.shippingAddress?.phone && (
                                  <div className="flex items-center gap-2 pt-2">
                                    <Phone className="h-3 w-3 text-gray-500" />
                                    <span className="text-gray-600">
                                      {order.shippingAddress.phone}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Order Timeline */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Clock className="h-4 w-4 text-purple-600" />
                              Order Timeline
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>
                                  Order placed:{" "}
                                  {formatDateTime(order.createdAt)}
                                </span>
                              </div>
                              {order.status !== "pending" && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span>Status: {order.status}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order Total */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Order Total
                            </h4>
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Subtotal:
                                  </span>
                                  <span>
                                    {formatPrice(
                                      order.totalAmount -
                                        (order.shipping || 0) -
                                        (order.tax || 0)
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Shipping:
                                  </span>
                                  <span>
                                    {formatPrice(order.shipping || 0)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tax:</span>
                                  <span>{formatPrice(order.tax || 0)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold text-lg">
                                  <span>Total:</span>
                                  <span className="text-blue-600">
                                    {formatPrice(order.totalAmount)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-3">
                            <Link
                              href={`/order-success?orderId=${order._id}`}
                              className="block"
                            >
                              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                <Eye className="h-4 w-4 mr-2" />
                                View Order Details
                              </Button>
                            </Link>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadInvoice(order)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Invoice
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Phone className="h-4 w-4 mr-2" />
                                    Contact Support
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Package className="h-4 w-4 mr-2" />
                                    Track Package
                                  </DropdownMenuItem>
                                  {order.status === "pending" && (
                                    <DropdownMenuItem className="text-red-600">
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel Order
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
