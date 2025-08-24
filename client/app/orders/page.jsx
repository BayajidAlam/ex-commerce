"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Eye,
  Download,
  Loader2,
  ShoppingBag,
  Truck,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Filter,
  Search,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import Header from "@/components/header";
import Link from "next/link";
import { getUserOrders } from "@/lib/actions/orders";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router]);

  // Filter orders when search or status filter changes
  useEffect(() => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.product?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      const result = await getUserOrders();

      if (result.success) {
        setOrders(result.orders || []);
        setError(null);
      } else {
        setError(result.message || "Failed to fetch orders");
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("An unexpected error occurred");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPrice = (price) => {
    return `৳${price.toLocaleString()}`;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: Clock,
          message: "Order is being reviewed",
        };
      case "confirmed":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: CheckCircle,
          message: "Order confirmed, preparing for shipment",
        };
      case "shipped":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: Truck,
          message: "Order is on the way",
        };
      case "delivered":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
          message: "Order delivered successfully",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: XCircle,
          message: "Order has been cancelled",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: AlertTriangle,
          message: "Unknown status",
        };
    }
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    };
    return stats;
  };

  const downloadInvoice = (order) => {
    // Invoice download functionality
    toast.success(`Downloading invoice for order #${order.orderNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-6" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                Loading Orders
              </h2>
              <p className="text-sm text-gray-500">Please wait...</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  My Orders
                </h1>
                <p className="text-gray-600 mt-1 text-xs sm:text-sm">
                  Track and manage your orders
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={refreshing}
                className="flex items-center gap-2 w-full sm:w-auto"
                size="sm"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>

            {/* Stats Cards */}
            {!loading && orders.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                  <CardContent className="p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold">
                      {getOrderStats().total}
                    </div>
                    <div className="text-blue-100 text-xs">Total Orders</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                  <CardContent className="p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold">
                      {getOrderStats().delivered}
                    </div>
                    <div className="text-green-100 text-xs">Delivered</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                  <CardContent className="p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold">
                      {getOrderStats().shipped}
                    </div>
                    <div className="text-purple-100 text-xs">Shipped</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                  <CardContent className="p-2 sm:p-3 text-center">
                    <div className="text-base sm:text-lg font-bold">
                      {formatPrice(getOrderStats().totalAmount)}
                    </div>
                    <div className="text-orange-100 text-xs">Total Spent</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search and Filter */}
            {!loading && orders.length > 0 && (
              <Card className="mb-4 border bg-white shadow-sm">
                <CardContent className="p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search orders..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-white text-sm"
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-40">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="bg-white text-sm">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Orders</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          {loading ? (
            <Card className="p-12 text-center border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-6" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Loading Your Orders
              </h2>
              <p className="text-gray-500">
                Please wait while we fetch your order history...
              </p>
            </Card>
          ) : error ? (
            <Card className="p-12 text-center border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <div className="text-red-500 mb-6">
                <AlertTriangle className="mx-auto h-16 w-16 mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Unable to Load Orders
                </h2>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
              <Button onClick={handleRefresh} className="mr-4">
                Try Again
              </Button>
              <Link href="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </Card>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <div className="mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  No Orders Yet
                </h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  You haven't placed any orders yet. Start exploring our amazing
                  products and create your first order!
                </p>
              </div>
              <Link href="/products">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card className="p-8 text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Orders Found
              </h2>
              <p className="text-gray-500 mb-4">
                No orders match your search criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <Card
                    key={order._id}
                    className="hover:shadow-lg transition-shadow duration-200 bg-white border"
                  >
                    <CardContent className="p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Order Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                #{order.orderNumber}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                                <span>
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span>
                                  {order.items.length} item
                                  {order.items.length > 1 ? "s" : ""}
                                </span>
                                <span>•</span>
                                <span className="font-medium">
                                  {formatPrice(order.totalAmount)}
                                </span>
                              </div>
                            </div>

                            {/* Items Preview - Mobile */}
                            <div className="mt-2 sm:hidden">
                              <div className="text-xs text-gray-600">
                                {order.items.slice(0, 2).map((item, index) => (
                                  <span key={index}>
                                    {item.product?.name || "Product"} ×{" "}
                                    {item.quantity}
                                    {index < order.items.length - 1 && index < 1
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                                {order.items.length > 2 &&
                                  ` +${order.items.length - 2} more`}
                              </div>
                            </div>

                            {/* Items Preview - Desktop */}
                            <div className="hidden sm:block mt-1">
                              <div className="text-sm text-gray-600">
                                {order.items.slice(0, 3).map((item, index) => (
                                  <span key={index}>
                                    {item.product?.name || "Product"} ×{" "}
                                    {item.quantity}
                                    {index < order.items.length - 1 && index < 2
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                                {order.items.length > 3 &&
                                  ` +${order.items.length - 3} more`}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <Badge
                            className={`${statusInfo.color} border flex items-center gap-1 px-2 py-1 text-xs`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>

                          <div className="flex gap-2">
                            <Link href={`/order-status?orderId=${order._id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs px-3"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </Link>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="px-2"
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => downloadInvoice(order)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Contact Support
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
