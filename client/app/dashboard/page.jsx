"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Upload,
  Image as ImageIcon,
  X,
  Eye,
  Loader2,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Star,
  BarChart3,
} from "lucide-react";
import Header from "@/components/header";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getUserOrders(1, 50); // Get more orders for dashboard

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
    }
  };

  const cancelOrder = async (orderId) => {
    setCancellingOrder(orderId);
    try {
      const result = await cancelOrderAPI(orderId);

      if (result.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "cancelled" } : order
          )
        );

        toast.success(result.message || "Order cancelled successfully");
      } else {
        toast.error(result.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancellingOrder(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const canCancelOrder = (order) => {
    return order.status === "pending" || order.status === "confirmed";
  };

  const filterOrders = (status) => {
    if (status === "all") return orders;
    return orders.filter((order) => order.status === status);
  };

  const searchOrders = (ordersList) => {
    if (!searchQuery) return ordersList;
    return ordersList.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card className="p-12 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-6" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Loading Dashboard
              </h2>
              <p className="text-gray-500">
                Please wait while we load your information...
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const stats = getOrderStats();
  const filteredOrders = searchOrders(filterOrders(activeTab));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.firstName || "User"}!
                </h1>
                <p className="text-gray-600">
                  Manage your orders and account settings
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <Card className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </Card>
            <Card className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </Card>
            <Card className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-blue-600">
                {stats.confirmed}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </Card>
            <Card className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-purple-600">
                {stats.shipped}
              </div>
              <div className="text-sm text-gray-600">Shipped</div>
            </Card>
            <Card className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-green-600">
                {stats.delivered}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </Card>
            <Card className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </Card>
          </div>

          {/* Orders Section */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-white border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-xl">Order History</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchOrders}
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6 bg-gray-50 rounded-none">
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({stats.pending})
                  </TabsTrigger>
                  <TabsTrigger value="confirmed">
                    Confirmed ({stats.confirmed})
                  </TabsTrigger>
                  <TabsTrigger value="shipped">
                    Shipped ({stats.shipped})
                  </TabsTrigger>
                  <TabsTrigger value="delivered">
                    Delivered ({stats.delivered})
                  </TabsTrigger>
                  <TabsTrigger value="cancelled">
                    Cancelled ({stats.cancelled})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  {error ? (
                    <div className="p-8 text-center">
                      <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Unable to Load Orders
                      </h3>
                      <p className="text-gray-600 mb-4">{error}</p>
                      <Button onClick={fetchOrders}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="p-12 text-center">
                      <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        {searchQuery
                          ? "No orders found"
                          : `No ${activeTab === "all" ? "" : activeTab} orders`}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {searchQuery
                          ? "Try adjusting your search terms"
                          : activeTab === "all"
                          ? "You haven't placed any orders yet. Start shopping!"
                          : `You don't have any ${activeTab} orders.`}
                      </p>
                      {!searchQuery && activeTab === "all" && (
                        <Link href="/products">
                          <Button>
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Start Shopping
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredOrders.map((order) => (
                        <div
                          key={order._id}
                          className="p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Order Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-4">
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    Order #{order.orderNumber}
                                  </h3>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {formatDate(order.createdAt)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Package className="h-4 w-4" />
                                      {order.items.length} item
                                      {order.items.length > 1 ? "s" : ""}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <CreditCard className="h-4 w-4" />
                                      {formatPrice(order.totalAmount)}
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  className={`${getStatusColor(
                                    order.status
                                  )} border flex items-center gap-1`}
                                >
                                  {getStatusIcon(order.status)}
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </Badge>
                              </div>

                              {/* Order Items Preview */}
                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex -space-x-2">
                                  {order.items
                                    .slice(0, 3)
                                    .map((item, index) => (
                                      <div
                                        key={index}
                                        className="relative w-12 h-12 rounded-lg border-2 border-white overflow-hidden bg-gray-100"
                                      >
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
                                    ))}
                                  {order.items.length > 3 && (
                                    <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                                      +{order.items.length - 3}
                                    </div>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {order.items
                                    .slice(0, 2)
                                    .map((item) => item.product?.name)
                                    .join(", ")}
                                  {order.items.length > 2 &&
                                    ` and ${order.items.length - 2} more`}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/order-success?orderId=${order._id}`}
                              >
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </Link>

                              {canCancelOrder(order) && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                      disabled={cancellingOrder === order._id}
                                    >
                                      {cancellingOrder === order._id ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      ) : (
                                        <XCircle className="h-4 w-4 mr-2" />
                                      )}
                                      Cancel
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Cancel Order
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel order #
                                        {order.orderNumber}? This action cannot
                                        be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Keep Order
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => cancelOrder(order._id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Cancel Order
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
