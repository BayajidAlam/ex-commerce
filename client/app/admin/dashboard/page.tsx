"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAdminProducts,
  getAdminOrders,
  getAdminStats,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  getOrderDetails,
  deleteOrder,
} from "@/lib/actions/admin-server";
import {
  uploadMultipleToCloudinary,
  uploadSingleToCloudinary,
} from "@/lib/actions/admin";
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

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    newOrdersToday: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
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
    colorVariants: [] as Array<{ name: string; stock: number }>,
    dimensions: {
      length: "",
      width: "",
      height: "",
      weight: "",
      unit: "cm",
    },
    images: [] as Array<{ url: string; alt: string }>,
    sku: "",
    featured: false,
    relatedProducts: [] as string[],
    sizes: [] as Array<{ size: string; stock: number }>,
  });

  // Modal states
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Color variant management
  const [newColorName, setNewColorName] = useState("");
  const [newColorStock, setNewColorStock] = useState("");

  // Related products
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedRelatedProduct, setSelectedRelatedProduct] = useState("");

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
    // Basic validation
    if (!productForm.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!productForm.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    if (!productForm.price || parseFloat(productForm.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!productForm.category) {
      toast.error("Product category is required");
      return;
    }
    if (productForm.images.length === 0) {
      toast.error("At least one product image is required");
      return;
    }

    try {
      const result = await createProduct({
        ...productForm,
        price: parseFloat(productForm.price),
      });

      if (result.success) {
        toast.success("Product created successfully");
        setIsProductDialogOpen(false);
        resetProductForm();
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
        price: parseFloat(productForm.price),
      });

      if (result.success) {
        toast.success("Product updated successfully");
        setIsProductDialogOpen(false);
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
      colorVariants: [] as Array<{ name: string; stock: number }>,
      dimensions: {
        length: "",
        width: "",
        height: "",
        weight: "",
        unit: "cm",
      },
      images: [] as Array<{ url: string; alt: string }>,
      sku: "",
      featured: false,
      relatedProducts: [] as string[],
      sizes: [] as Array<{ size: string; stock: number }>,
    });
    setEditingProduct(null);
  };

  // Color variant management
  const addColorVariant = () => {
    console.log("addColorVariant called", { newColorName, newColorStock });

    if (newColorName.trim()) {
      const newVariant = {
        name: newColorName.trim(),
        stock: parseInt(newColorStock) || 0,
      };

      console.log("Adding variant:", newVariant);

      setProductForm((prev) => ({
        ...prev,
        colorVariants: [...prev.colorVariants, newVariant],
      }));

      setNewColorName("");
      setNewColorStock("");
      toast.success("Color variant added");
    } else {
      toast.error("Please enter a color name");
    }
  };

  const removeColorVariant = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      colorVariants: prev.colorVariants.filter((_, i) => i !== index),
    }));
  };

  const updateColorStock = (index: number, newStock: string) => {
    setProductForm((prev) => ({
      ...prev,
      colorVariants: prev.colorVariants.map((variant, i) =>
        i === index ? { ...variant, stock: parseInt(newStock) || 0 } : variant
      ),
    }));
  };

  // Image management functions
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const result = await uploadMultipleToCloudinary(files);
      if (result.success && result.successful) {
        const newImages = result.successful.map((image: any) => ({
          url: image.secure_url,
          alt: `${productForm.name} - Image`,
        }));

        setProductForm((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));

        toast.success(`${newImages.length} image(s) uploaded successfully`);

        // Show any failed uploads
        if (result.failed && result.failed.length > 0) {
          toast.error(`${result.failed.length} image(s) failed to upload`);
        }
      } else {
        toast.error(result.message || "Failed to upload images");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploadingImages(false);
      // Reset the input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.success("Image removed");
  };

  const updateImageAlt = (index: number, newAlt: string) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, alt: newAlt } : img
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

  const removeRelatedProduct = (productId: string) => {
    setProductForm((prev) => ({
      ...prev,
      relatedProducts: prev.relatedProducts.filter((id) => id !== productId),
    }));
    toast.success("Related product removed");
  };

  // Size management
  const addSizeToProduct = (size: string, stock: string) => {
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

  const removeSizeFromProduct = (sizeToRemove: string) => {
    setProductForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size.size !== sizeToRemove),
    }));
  };

  // Product submit handler
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = editingProduct
        ? await updateProduct(editingProduct._id, productForm)
        : await createProduct(productForm);

      if (result.success) {
        toast.success(
          `Product ${editingProduct ? "updated" : "created"} successfully`
        );
        setIsProductDialogOpen(false);
        resetProductForm();
        fetchProducts();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Product submit error:", error);
      toast.error("Failed to save product");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
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

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string
  ) => {
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

  const handleViewOrder = async (orderId: string) => {
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

  const handleDeleteOrder = async (orderId: string) => {
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

  // Helper functions
  const formatPrice = (price: number) => `৳${price?.toLocaleString() || 0}`;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLogout = async () => {
    try {
      // Clear auth state
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      shipped: { color: "bg-purple-100 text-purple-800", icon: Package },
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig["pending"];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon size={12} />
        {status}
      </Badge>
    );
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

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
                      {
                        orders.filter((order) => order.status === "pending")
                          .length
                      }
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
              <TabsTrigger value="products">
                Products ({products.length})
              </TabsTrigger>
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
                          {orders.filter((o) => o.status === "pending").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Featured Products:</span>
                        <span className="font-semibold text-blue-600">
                          {products.filter((p) => p.featured).length}
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
                        onClick={() => {
                          resetProductForm();
                          setIsProductDialogOpen(true);
                        }}
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
                <Button
                  onClick={() => {
                    resetProductForm();
                    setIsProductDialogOpen(true);
                  }}
                >
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
                                onClick={() => {
                                  setEditingProduct(product);
                                  setProductForm({
                                    ...productForm,
                                    name: product.name,
                                    description: product.description,
                                    price: product.price.toString(),
                                    category: product.category,
                                    sku: product.sku,
                                    featured: product.featured || false,
                                  });
                                  setIsProductDialogOpen(true);
                                }}
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
                            {order.user?.name ||
                              order.customerInfo?.name ||
                              "Unknown"}
                          </TableCell>
                          <TableCell>
                            {formatPrice(order.totalAmount)}
                          </TableCell>
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
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="confirmed">
                                    Confirmed
                                  </SelectItem>
                                  <SelectItem value="shipped">
                                    Shipped
                                  </SelectItem>
                                  <SelectItem value="delivered">
                                    Delivered
                                  </SelectItem>
                                  <SelectItem value="cancelled">
                                    Cancelled
                                  </SelectItem>
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

          {/* Product Dialog */}
          <Dialog
            open={isProductDialogOpen}
            onOpenChange={setIsProductDialogOpen}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
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
                        setProductForm({ ...productForm, sku: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) =>
                        setProductForm({ ...productForm, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Home & Garden">
                          Home & Garden
                        </SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Toys">Toys</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Automotive">Automotive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="moreInfo">Additional Information</Label>
                  <Textarea
                    id="moreInfo"
                    value={productForm.moreInfo}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        moreInfo: e.target.value,
                      })
                    }
                    rows={2}
                    placeholder="Additional product details, specifications, etc."
                  />
                </div>

                {/* Product Images */}
                <div>
                  <Label>Product Images</Label>
                  <div className="mt-2 space-y-4">
                    {/* File input */}
                    <div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={uploadingImages}
                      />
                      {uploadingImages && (
                        <p className="text-sm text-gray-500 mt-1">
                          Uploading images...
                        </p>
                      )}
                    </div>

                    {/* Image previews */}
                    {productForm.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {productForm.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                            <input
                              type="text"
                              placeholder="Alt text"
                              value={image.alt}
                              onChange={(e) =>
                                updateImageAlt(index, e.target.value)
                              }
                              className="mt-1 w-full text-xs p-1 border rounded"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Variants */}
                <div>
                  <Label>Color Variants</Label>
                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                      <Input
                        placeholder="Color name"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Stock"
                        value={newColorStock}
                        onChange={(e) => setNewColorStock(e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          addColorVariant();
                        }}
                        disabled={!newColorName.trim()}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Color
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {productForm.colorVariants.map((variant, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 border rounded"
                        >
                          <span className="font-medium">{variant.name}</span>
                          <Input
                            type="number"
                            value={variant.stock}
                            onChange={(e) =>
                              updateColorStock(index, e.target.value)
                            }
                            className="w-20"
                            min="0"
                          />
                          <span className="text-sm text-gray-500">
                            in stock
                          </span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeColorVariant(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <Label>Product Dimensions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                    <Input
                      placeholder="Length"
                      value={productForm.dimensions.length}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          dimensions: {
                            ...productForm.dimensions,
                            length: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Width"
                      value={productForm.dimensions.width}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          dimensions: {
                            ...productForm.dimensions,
                            width: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Height"
                      value={productForm.dimensions.height}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          dimensions: {
                            ...productForm.dimensions,
                            height: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Weight"
                      value={productForm.dimensions.weight}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          dimensions: {
                            ...productForm.dimensions,
                            weight: e.target.value,
                          },
                        })
                      }
                    />
                    <Select
                      value={productForm.dimensions.unit}
                      onValueChange={(value) =>
                        setProductForm({
                          ...productForm,
                          dimensions: {
                            ...productForm.dimensions,
                            unit: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="in">in</SelectItem>
                        <SelectItem value="mm">mm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Discount Settings */}
                <div>
                  <Label>Discount Settings</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={productForm.discount.isActive}
                        onCheckedChange={(checked) =>
                          setProductForm({
                            ...productForm,
                            discount: {
                              ...productForm.discount,
                              isActive: checked,
                            },
                          })
                        }
                      />
                      <Label>Enable Discount</Label>
                    </div>

                    {productForm.discount.isActive && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Discount %"
                          value={productForm.discount.percentage}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              discount: {
                                ...productForm.discount,
                                percentage: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          min="0"
                          max="100"
                        />
                        <Input
                          type="date"
                          value={productForm.discount.validUntil}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              discount: {
                                ...productForm.discount,
                                validUntil: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Policies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="returnPolicy">Return Policy</Label>
                    <Textarea
                      id="returnPolicy"
                      value={productForm.returnPolicy}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          returnPolicy: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exchangePolicy">Exchange Policy</Label>
                    <Textarea
                      id="exchangePolicy"
                      value={productForm.exchangePolicy}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          exchangePolicy: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>

                {/* Featured Product Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={productForm.featured}
                    onCheckedChange={(checked) =>
                      setProductForm({ ...productForm, featured: checked })
                    }
                  />
                  <Label>Featured Product</Label>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsProductDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !productForm.name ||
                      !productForm.price ||
                      !productForm.category
                    }
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </DialogFooter>
              </form>
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
                      <div className="mt-1">
                        {getStatusBadge(viewingOrder.status)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Customer</Label>
                      <p>
                        {viewingOrder.user?.name ||
                          viewingOrder.customerInfo?.name}
                      </p>
                    </div>
                    <div>
                      <Label>Total Amount</Label>
                      <p className="font-semibold">
                        {formatPrice(viewingOrder.totalAmount)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label>Items</Label>
                    <div className="mt-2 space-y-2">
                      {viewingOrder.items?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between p-2 bg-gray-50 rounded"
                        >
                          <span>
                            {item.product?.name || "Product"} x{item.quantity}
                          </span>
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
