"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  ShoppingBag,
  DollarSign,
  Clock,
  RefreshCw,
  Settings,
  LogOut,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  BarChart3,
} from "lucide-react";
import Header from "@/components/header";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { 
  getAdminProducts,
  getAdminOrders,
  getAdminStats,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  getOrderDetails,
  deleteOrder
} from "@/lib/actions/admin-server";
import { logoutAction } from "@/lib/actions/auth";

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    newOrdersToday: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [],
    sku: '',
    featured: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role !== "admin") {
      toast.error("Access denied. Admin only.");
      router.push("/");
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProducts(), fetchStats(), fetchOrders()]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const result = await getAdminProducts();
      if (result.success) {
        setProducts(result.products);
      } else {
        toast.error(result.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  const fetchStats = async () => {
    try {
      const result = await getAdminStats();
      if (result.success) {
        setDashboardStats(result.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const result = await getAdminOrders();
      if (result.success) {
        setOrders(result.orders);
      } else {
        toast.error(result.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  const handleCreateProduct = async () => {
    try {
      const result = await createProduct({
        ...productForm,
        price: parseFloat(productForm.price)
      });
      
      if (result.success) {
        toast.success("Product created successfully");
        setIsProductModalOpen(false);
        setProductForm({
          name: '',
          description: '',
          price: '',
          category: '',
          images: [],
          sku: '',
          featured: false
        });
        fetchProducts();
      } else {
        toast.error(result.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const result = await updateProduct(editingProduct._id, {
        ...productForm,
        price: parseFloat(productForm.price)
      });
      
      if (result.success) {
        toast.success("Product updated successfully");
        setIsProductModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        toast.error(result.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const result = await deleteProduct(productId);
        if (result.success) {
          toast.success("Product deleted successfully");
          fetchProducts();
        } else {
          toast.error(result.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success("Order status updated successfully");
        fetchOrders();
      } else {
        toast.error(result.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const result = await getOrderDetails(orderId);
      if (result.success) {
        setViewingOrder(result.order);
        setIsOrderModalOpen(true);
      } else {
        toast.error(result.message || "Failed to get order details");
      }
    } catch (error) {
      console.error("Error getting order details:", error);
      toast.error("Failed to get order details");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        const result = await deleteOrder(orderId);
        if (result.success) {
          toast.success("Order deleted successfully");
          fetchOrders();
        } else {
          toast.error(result.message || "Failed to delete order");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Failed to delete order");
      }
    }
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      images: product.images || [],
      sku: product.sku,
      featured: product.featured || false
    });
    setIsProductModalOpen(true);
  };

  const openCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      images: [],
      sku: '',
      featured: false
    });
    setIsProductModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'confirmed': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      'shipped': { color: 'bg-purple-100 text-purple-800', icon: Package },
      'delivered': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon size={12} />
        {status}
      </Badge>
    );
  };

  const formatPrice = (price) => `৳${price?.toLocaleString() || 0}`;
  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-6" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Loading Dashboard
              </h2>
              <p className="text-gray-500">Please wait...</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Settings className="h-8 w-8 text-blue-600" />
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your products, orders, and store settings
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={fetchDashboardData} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={handleLogout} variant="destructive" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {products.length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {orders.length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(dashboardStats.totalRevenue || 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pending Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {orders.filter(order => order.status === 'pending').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
              <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Products:</span>
                        <span className="font-semibold">{products.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Orders:</span>
                        <span className="font-semibold">{orders.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Orders:</span>
                        <span className="font-semibold text-yellow-600">
                          {orders.filter(o => o.status === 'pending').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Featured Products:</span>
                        <span className="font-semibold text-blue-600">
                          {products.filter(p => p.featured).length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        onClick={openCreateProduct}
                        className="w-full justify-start"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Product
                      </Button>
                      <Button 
                        onClick={() => setActiveTab("products")}
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Manage Products
                      </Button>
                      <Button 
                        onClick={() => setActiveTab("orders")}
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Manage Orders
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <Button onClick={openCreateProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>
                            {product.featured ? (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Star size={12} className="mr-1" />
                                Featured
                              </Badge>
                            ) : (
                              <Badge variant="outline">Regular</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => openEditProduct(product)}
                                size="sm"
                                variant="outline"
                              >
                                <Edit3 size={16} />
                              </Button>
                              <Button
                                onClick={() => handleDeleteProduct(product._id)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {products.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No products found. Add your first product!
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Order Management</h2>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-mono text-sm">
                            {order._id.slice(-8)}
                          </TableCell>
                          <TableCell>
                            {order.user?.name || order.customerInfo?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleViewOrder(order._id)}
                                size="sm"
                                variant="outline"
                              >
                                <Eye size={16} />
                              </Button>
                              <Select
                                value={order.status}
                                onValueChange={(newStatus) => 
                                  handleUpdateOrderStatus(order._id, newStatus)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                onClick={() => handleDeleteOrder(order._id)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {orders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No orders found.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Product Modal */}
          <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Enter product description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                      placeholder="Product SKU"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bag">Bag</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="watch">Watch</SelectItem>
                      <SelectItem value="glass">Glass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                  disabled={!productForm.name || !productForm.price || !productForm.category}
                >
                  {editingProduct ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Order Details Modal */}
          <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>
              {viewingOrder && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Order ID</Label>
                      <p className="font-mono text-sm">{viewingOrder._id}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">{getStatusBadge(viewingOrder.status)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Customer</Label>
                      <p>{viewingOrder.user?.name || viewingOrder.customerInfo?.name}</p>
                    </div>
                    <div>
                      <Label>Total Amount</Label>
                      <p className="font-semibold">{formatPrice(viewingOrder.totalAmount)}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Items</Label>
                    <div className="mt-2 space-y-2">
                      {viewingOrder.items?.map((item, index) => (
                        <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>{item.product?.name || 'Product'} x{item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsOrderModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
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
import { Switch } from "@/components/ui/switch";
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
  Settings,
  Save,
  LogOut,
} from "lucide-react";
import Header from "@/components/header";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetStats,
  uploadMultipleToCloudinary,
  adminGetOrders,
  adminUpdateOrderStatus,
} from "@/lib/actions/admin";
import { logoutAction } from "@/lib/actions/auth";

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
  });

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    moreInfo: "",
    returnPolicy:
      "Returns accepted within 30 days of purchase. Item must be in original condition.",
    exchangePolicy:
      "Exchanges accepted within 15 days. Size/color exchanges subject to availability.",
    price: "",
    discount: {
      percentage: 0,
      isActive: false,
      validUntil: "",
    },
    category: "",
    colorVariants: [],
    dimensions: {
      length: "",
      width: "",
      height: "",
      weight: "",
      unit: "cm",
    },
    images: [],
    sku: "",
    featured: false,
    relatedProducts: [],
    sizes: [],
  });
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Color variant management
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("#000000");
  const [newColorStock, setNewColorStock] = useState("");

  // Related products
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedRelatedProduct, setSelectedRelatedProduct] = useState("");

  // Order management
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    if (user?.role !== "admin") {
      toast.error("Access denied. Admin only.");
      router.push("/");
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProducts(), fetchStats(), fetchOrders()]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log("Fetching products...");
      const result = await adminGetProducts();
      console.log("Products API result:", result);
      if (result.success) {
        console.log("Products fetched:", result.products?.length || 0);
        setProducts(result.products);
      } else {
        console.error("Failed to fetch products:", result.message);
        toast.error(result.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  const fetchStats = async () => {
    try {
      const result = await adminGetStats();
      if (result.success) {
        setDashboardStats(result.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders...");
      const result = await adminGetOrders();
      console.log("Orders API result:", result);
      if (result.success) {
        console.log("Orders fetched:", result.orders?.length || 0);
        setOrders(result.orders);
      } else {
        console.error("Failed to fetch orders:", result.message);
        toast.error(result.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  // Cloudinary image upload
  const uploadToCloudinary = async (files) => {
    setUploadingImages(true);

    try {
      const result = await uploadMultipleToCloudinary(files);

      if (result.success) {
        const uploadedImages = result.successful.map((item) => ({
          url: item.url,
          alt: "Product image",
        }));

        setProductForm((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedImages],
        }));

        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  // Product management functions
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = editingProduct
        ? await adminUpdateProduct(editingProduct._id, {
            ...productForm,
            price: parseFloat(productForm.price),
          })
        : await adminCreateProduct({
            ...productForm,
            price: parseFloat(productForm.price),
          });

      if (result.success) {
        toast.success(
          editingProduct
            ? "Product updated successfully"
            : "Product created successfully"
        );
        setIsProductDialogOpen(false);
        resetProductForm();
        fetchProducts();
      } else {
        toast.error(result.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      moreInfo: "",
      returnPolicy:
        "Returns accepted within 30 days of purchase. Item must be in original condition.",
      exchangePolicy:
        "Exchanges accepted within 15 days. Size/color exchanges subject to availability.",
      price: "",
      discount: {
        percentage: 0,
        isActive: false,
        validUntil: "",
      },
      category: "",
      colorVariants: [],
      dimensions: {
        length: "",
        width: "",
        height: "",
        weight: "",
        unit: "cm",
      },
      images: [],
      sku: "",
      featured: false,
      relatedProducts: [],
      sizes: [],
    });
    setEditingProduct(null);
    setNewColorName("");
    setNewColorCode("#000000");
    setNewColorStock("");
  };

  const handleEditProduct = (product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      moreInfo: product.moreInfo || "",
      returnPolicy:
        product.returnPolicy ||
        "Returns accepted within 30 days of purchase. Item must be in original condition.",
      exchangePolicy:
        product.exchangePolicy ||
        "Exchanges accepted within 15 days. Size/color exchanges subject to availability.",
      price: product.price.toString(),
      discount: {
        percentage: product.discount?.percentage || 0,
        isActive: product.discount?.isActive || false,
        validUntil: product.discount?.validUntil
          ? new Date(product.discount.validUntil).toISOString().split("T")[0]
          : "",
      },
      category: product.category,
      colorVariants: product.colorVariants || [],
      dimensions: {
        length: product.dimensions?.length?.toString() || "",
        width: product.dimensions?.width?.toString() || "",
        height: product.dimensions?.height?.toString() || "",
        weight: product.dimensions?.weight?.toString() || "",
        unit: product.dimensions?.unit || "cm",
      },
      images: product.images || [],
      sku: product.sku,
      featured: product.featured || false,
      relatedProducts: product.relatedProducts || [],
      sizes: product.sizes || [],
    });
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const result = await adminDeleteProduct(productId);

      if (result.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error(result.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Order Management Functions
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await adminUpdateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success("Order status updated successfully");
        fetchOrders();
      } else {
        toast.error(result.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      shipped: { color: "bg-purple-100 text-purple-800", icon: Truck },
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = orderFilter === "all" || order.status === orderFilter;
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleLogout = async () => {
    try {
      const result = await logoutAction();
      if (result.success) {
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error("Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  // Color variant management functions
  const addColorVariant = () => {
    if (newColorName && newColorStock) {
      const newVariant = {
        colorName: newColorName,
        colorCode: newColorCode,
        stock: parseInt(newColorStock),
        images: [],
      };

      setProductForm((prev) => ({
        ...prev,
        colorVariants: [...prev.colorVariants, newVariant],
      }));

      setNewColorName("");
      setNewColorCode("#000000");
      setNewColorStock("");
      toast.success(`Color variant '${newColorName}' added`);
    } else {
      toast.error("Please fill color name and stock");
    }
  };

  const removeColorVariant = (index) => {
    setProductForm((prev) => ({
      ...prev,
      colorVariants: prev.colorVariants.filter((_, i) => i !== index),
    }));
    toast.success("Color variant removed");
  };

  const updateColorVariantStock = (index, newStock) => {
    setProductForm((prev) => ({
      ...prev,
      colorVariants: prev.colorVariants.map((variant, i) =>
        i === index ? { ...variant, stock: parseInt(newStock) || 0 } : variant
      ),
    }));
  };

  // Related products management
  const addRelatedProduct = () => {
    if (
      selectedRelatedProduct &&
      !productForm.relatedProducts.includes(selectedRelatedProduct)
    ) {
      setProductForm((prev) => ({
        ...prev,
        relatedProducts: [...prev.relatedProducts, selectedRelatedProduct],
      }));
      setSelectedRelatedProduct("");
      toast.success("Related product added");
    }
  };

  const removeRelatedProduct = (productId) => {
    setProductForm((prev) => ({
      ...prev,
      relatedProducts: prev.relatedProducts.filter((id) => id !== productId),
    }));
    toast.success("Related product removed");
  };

  const formatPrice = (price) => `৳${price.toLocaleString()}`;

  const addColorToProduct = (color) => {
    if (color && !productForm.colors.includes(color)) {
      setProductForm((prev) => ({
        ...prev,
        colors: [...prev.colors, color],
      }));
    }
  };

  const removeColorFromProduct = (colorToRemove) => {
    setProductForm((prev) => ({
      ...prev,
      colorVariants: prev.colorVariants.filter(
        (variant) => variant.color !== colorToRemove
      ),
    }));
  };

  const addSizeToProduct = (size, stock) => {
    if (size) {
      setProductForm((prev) => ({
        ...prev,
        sizes: [
          ...prev.sizes.filter((s) => s.size !== size),
          { size, stock: parseInt(stock) || 0 },
        ],
      }));
    }
  };

  const removeSizeFromProduct = (sizeToRemove) => {
    setProductForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size.size !== sizeToRemove),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-6" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Loading Dashboard
              </h2>
              <p className="text-gray-500">Please wait...</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Settings className="h-8 w-8 text-blue-600" />
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your products, orders, and store settings
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={fetchDashboardData} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={handleLogout} variant="destructive" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats.totalProducts}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(dashboardStats.totalRevenue)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Featured Products
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {products.filter((p) => p.featured).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Products Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Products Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.slice(0, 5).map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-200 rounded-lg overflow-hidden">
                              {product.images?.[0] ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Package className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">
                                {product.category}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatPrice(product.price)}
                            </p>
                            {product.featured && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <Dialog
                  open={isProductDialogOpen}
                  onOpenChange={setIsProductDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={resetProductForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingProduct
                          ? "Update product information"
                          : "Create a new product for your store"}
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            value={productForm.name}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="sku">SKU</Label>
                          <Input
                            id="sku"
                            value={productForm.sku}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                sku: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={productForm.description}
                          onChange={(e) =>
                            setProductForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price (৳)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={productForm.price}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={productForm.category}
                            onValueChange={(value) =>
                              setProductForm((prev) => ({
                                ...prev,
                                category: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="formal">Formal</SelectItem>
                              <SelectItem value="traditional">
                                Traditional
                              </SelectItem>
                              <SelectItem value="bag">Bag</SelectItem>
                              <SelectItem value="jewellry">
                                Jewellery
                              </SelectItem>
                              <SelectItem value="glass">Glass</SelectItem>
                              <SelectItem value="watch">Watch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <Label>Product Images</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                              uploadToCloudinary(Array.from(e.target.files))
                            }
                            className="mb-4"
                            disabled={uploadingImages}
                          />
                          {uploadingImages && (
                            <div className="flex items-center gap-2 text-blue-600">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading images...
                            </div>
                          )}
                          <div className="grid grid-cols-4 gap-2 mt-4">
                            {productForm.images.map((image, index) => (
                              <div key={index} className="relative">
                                <Image
                                  src={image.url}
                                  alt={image.alt}
                                  width={80}
                                  height={80}
                                  className="object-cover rounded"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                                  onClick={() => {
                                    setProductForm((prev) => ({
                                      ...prev,
                                      images: prev.images.filter(
                                        (_, i) => i !== index
                                      ),
                                    }));
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                        <Label>Colors</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Add color"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addColorToProduct(e.target.value);
                                e.target.value = "";
                              }
                            }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {productForm.colorVariants &&
                            productForm.colorVariants.map((variant, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {variant.color}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                  onClick={() =>
                                    removeColorFromProduct(variant.color)
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                        </div>
                      </div>

                      {/* Sizes */}
                      <div>
                        <Label>Sizes & Stock</Label>
                        <div className="space-y-2">
                          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                            const sizeData = productForm.sizes.find(
                              (s) => s.size === size
                            );
                            return (
                              <div
                                key={size}
                                className="flex items-center gap-2"
                              >
                                <span className="w-12 text-sm">{size}</span>
                                <Input
                                  type="number"
                                  placeholder="Stock"
                                  min="0"
                                  value={sizeData?.stock || ""}
                                  onChange={(e) =>
                                    addSizeToProduct(size, e.target.value)
                                  }
                                  className="w-20"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Featured */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={productForm.featured}
                          onCheckedChange={(checked) =>
                            setProductForm((prev) => ({
                              ...prev,
                              featured: checked,
                            }))
                          }
                        />
                        <Label htmlFor="featured">Featured Product</Label>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsProductDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          {editingProduct ? "Update" : "Create"} Product
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Products Grid */}
              {products.length === 0 ? (
                <div className="col-span-full">
                  <Card className="p-12 text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      You haven't created any products yet. Click the "Add
                      Product" button to get started.
                    </p>
                    <Button onClick={() => setIsProductDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </Card>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card key={product._id} className="overflow-hidden">
                      <div className="aspect-square relative bg-gray-100">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        {product.featured && (
                          <Badge className="absolute top-2 left-2 bg-yellow-500">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {product.category}
                        </p>
                        <p className="font-bold text-lg text-blue-600 mb-3">
                          {formatPrice(product.price)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Product
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteProduct(product._id)
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Order Management</h2>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={orderFilter} onValueChange={setOrderFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
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

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <Card className="p-12 text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Orders Found
                  </h3>
                  <p className="text-gray-500">
                    {orderFilter === "all"
                      ? "No orders have been placed yet."
                      : `No ${orderFilter} orders found.`}
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order._id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Order #{order.orderNumber}
                            </h3>
                            <p className="text-gray-600">
                              {order.user?.name || "Customer"} •{" "}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {formatPrice(order.totalAmount)}
                            </p>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium mb-2">Order Items</h4>
                            <div className="space-y-2">
                              {order.items?.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item.product?.name || "Product"} ×{" "}
                                  {item.quantity}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">
                              Shipping Address
                            </h4>
                            <div className="text-sm text-gray-600">
                              <p>
                                {order.shippingAddress?.firstName}{" "}
                                {order.shippingAddress?.lastName}
                              </p>
                              <p>{order.shippingAddress?.street}</p>
                              <p>{order.shippingAddress?.city}</p>
                              <p>{order.shippingAddress?.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(status) =>
                              updateOrderStatus(order._id, status)
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">
                                Delivered
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
