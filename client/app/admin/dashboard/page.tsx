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
  getAdminUsers,
  getAdminUserDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  updateUser,
  deleteUser,
  toggleUserStatus,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [customers, setCustomers] = useState<any[]>([]);
  const [customersStats, setCustomersStats] = useState({
    total: 0,
    byRole: [],
    recent: [],
  });
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
  const [isProductViewDialogOpen, setIsProductViewDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isCustomerViewDialogOpen, setIsCustomerViewDialogOpen] =
    useState(false);
  const [isCustomerEditDialogOpen, setIsCustomerEditDialogOpen] =
    useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [viewingCustomer, setViewingCustomer] = useState<any>(null);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
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
      await Promise.all([
        fetchProducts(),
        fetchStats(),
        fetchOrders(),
        fetchCustomers(),
      ]);
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

  const fetchCustomers = async () => {
    try {
      const result = await getAdminUsers({ limit: 50 });
      if (result.success) {
        setCustomers(result.users);
        setCustomersStats(result.stats);
      } else {
        toast.error(result.message || "Failed to fetch customers");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers");
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

  const handleUpdateProductStatus = async (
    productId: string,
    isActive: boolean
  ) => {
    try {
      const result = await updateProduct(productId, { isActive });
      if (result.success) {
        toast.success(
          `Product ${isActive ? "activated" : "deactivated"} successfully`
        );
        fetchProducts();
        setIsStatusDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
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
      console.log("Fetching order details for ID:", orderId);
      setViewingOrder(null); // Clear previous order
      setIsOrderModalOpen(true); // Show modal with loading state

      const result = await getOrderDetails(orderId);
      console.log("Order details result:", result);

      if (result.success) {
        setViewingOrder(result.order);
      } else {
        toast.error(result.message || "Failed to get order details");
        setIsOrderModalOpen(false); // Close modal on error
      }
    } catch (error) {
      console.error("Error getting order details:", error);
      toast.error("Failed to get order details");
      setIsOrderModalOpen(false); // Close modal on error
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

  // Customer management handlers
  const handleUpdateCustomer = async (
    customerId: string,
    customerData: any
  ) => {
    try {
      const result = await updateUser(customerId, customerData);
      if (result.success) {
        toast.success("Customer updated successfully");
        fetchCustomers();
        setIsCustomerEditDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer");
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        const result = await deleteUser(customerId);
        if (result.success) {
          toast.success("Customer deleted successfully");
          fetchCustomers();
        } else {
          toast.error(result.message || "Failed to delete customer");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Failed to delete customer");
      }
    }
  };

  const handleToggleCustomerStatus = async (customerId: string) => {
    try {
      const result = await toggleUserStatus(customerId);
      if (result.success) {
        toast.success(result.message);
        fetchCustomers();
      } else {
        toast.error(result.message || "Failed to update customer status");
      }
    } catch (error) {
      console.error("Error toggling customer status:", error);
      toast.error("Failed to update customer status");
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

  const formatDate = (date: string) => new Date(date).toLocaleString();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className=" mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 w-full">
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">
                Products ({products.length})
              </TabsTrigger>
              <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
              <TabsTrigger value="customers">
                Customers ({customers.length})
              </TabsTrigger>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Actions</TableHead>
                        <TableHead>Date & Time</TableHead>
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
                            <div className="flex items-center gap-2">
                              {product.isActive !== undefined ? (
                                product.isActive ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle size={12} className="mr-1" />
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800">
                                    <XCircle size={12} className="mr-1" />
                                    Inactive
                                  </Badge>
                                )
                              ) : (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle size={12} className="mr-1" />
                                  Active
                                </Badge>
                              )}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => {
                                        setViewingProduct(product);
                                        setIsStatusDialogOpen(true);
                                      }}
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-gray-600 hover:text-gray-800"
                                    >
                                      <Settings size={14} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit Status</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
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
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => {
                                        setViewingProduct(product);
                                        setIsProductViewDialogOpen(true);
                                      }}
                                      size="sm"
                                      variant="outline"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <Eye size={16} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Product Details</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
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
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <Edit3 size={16} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit Product</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() =>
                                        handleDeleteProduct(product._id)
                                      }
                                      size="sm"
                                      variant="destructive"
                                      className="hover:bg-red-600"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete Product</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(product.createdAt)}</TableCell>
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
                        <TableHead>Actions</TableHead>
                        <TableHead>Date & Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-mono text-sm">
                            {order._id.slice(-8)}
                          </TableCell>
                          <TableCell>
                            {order.user?.firstName && order.user?.lastName
                              ? `${order.user.firstName} ${order.user.lastName}`
                              : order.user?.name ||
                                order.customerInfo?.name ||
                                (order.shippingAddress?.firstName &&
                                  order.shippingAddress?.lastName)
                              ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                              : "Unknown"}
                          </TableCell>
                          <TableCell>
                            {formatPrice(order.totalAmount)}
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
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
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
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

            {/* Customers Tab */}
            <TabsContent value="customers" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Customer Management</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Total: {customersStats.total}</Badge>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow key={customer._id}>
                          <TableCell className="font-medium">
                            {customer.firstName && customer.lastName
                              ? `${customer.firstName} ${customer.lastName}`
                              : customer.firstName ||
                                customer.lastName ||
                                "N/A"}
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone || "N/A"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                customer.role === "admin"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                customer.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : customer.role === "seller"
                                  ? "bg-orange-100 text-orange-800"
                                  : ""
                              }
                            >
                              {customer.role === "user"
                                ? "customer"
                                : customer.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {customer.isActive !== false ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle size={12} className="mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">
                                <XCircle size={12} className="mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => {
                                        setViewingCustomer(customer);
                                        setIsCustomerViewDialogOpen(true);
                                      }}
                                      size="sm"
                                      variant="outline"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <Eye size={16} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Customer Details</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              {(customer.role === "user" ||
                                customer.role === "seller") && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        onClick={() => {
                                          setEditingCustomer(customer);
                                          setIsCustomerEditDialogOpen(true);
                                        }}
                                        size="sm"
                                        variant="outline"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                      >
                                        <Edit3 size={16} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Edit Customer</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {customers.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-6 text-gray-500"
                          >
                            No customers found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
                        <SelectItem value="bag">Bag</SelectItem>
                        <SelectItem value="glass">Glass</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="watch">Watch</SelectItem>
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

          {/* Product View Dialog */}
          <Dialog
            open={isProductViewDialogOpen}
            onOpenChange={setIsProductViewDialogOpen}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Product Details
                </DialogTitle>
              </DialogHeader>

              {viewingProduct && (
                <div className="space-y-6">
                  {/* Product Images */}
                  {viewingProduct.images &&
                    viewingProduct.images.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Product Images
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {viewingProduct.images.map(
                            (image: any, index: number) => (
                              <div
                                key={index}
                                className="relative aspect-square border rounded-lg overflow-hidden"
                              >
                                <img
                                  src={image.url}
                                  alt={
                                    image.alt || `Product image ${index + 1}`
                                  }
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Product Name
                        </Label>
                        <p className="text-lg font-semibold">
                          {viewingProduct.name}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Category
                        </Label>
                        <Badge variant="outline" className="ml-2">
                          {viewingProduct.category}
                        </Badge>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          SKU
                        </Label>
                        <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {viewingProduct.sku}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Price
                        </Label>
                        <p className="text-2xl font-bold text-green-600">
                          {formatPrice(viewingProduct.price)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Featured Product
                        </Label>
                        <div className="mt-1">
                          {viewingProduct.featured ? (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Star size={12} className="mr-1" />
                              Featured
                            </Badge>
                          ) : (
                            <Badge variant="outline">Regular</Badge>
                          )}
                        </div>
                      </div>

                      {viewingProduct.discount &&
                        viewingProduct.discount.isActive && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">
                              Discount
                            </Label>
                            <p className="text-red-600 font-semibold">
                              {viewingProduct.discount.percentage}% OFF
                            </p>
                            {viewingProduct.discount.validUntil && (
                              <p className="text-sm text-gray-500">
                                Valid until:{" "}
                                {new Date(
                                  viewingProduct.discount.validUntil
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}

                      {viewingProduct.dimensions && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Dimensions
                          </Label>
                          <div className="text-sm bg-gray-50 p-2 rounded">
                            <p>
                              Length: {viewingProduct.dimensions.length}{" "}
                              {viewingProduct.dimensions.unit}
                            </p>
                            <p>
                              Width: {viewingProduct.dimensions.width}{" "}
                              {viewingProduct.dimensions.unit}
                            </p>
                            <p>
                              Height: {viewingProduct.dimensions.height}{" "}
                              {viewingProduct.dimensions.unit}
                            </p>
                            <p>Weight: {viewingProduct.dimensions.weight} g</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Description
                    </Label>
                    <p className="mt-1 text-gray-700 leading-relaxed">
                      {viewingProduct.description}
                    </p>
                  </div>

                  {/* Additional Information */}
                  {viewingProduct.moreInfo && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Additional Information
                      </Label>
                      <p className="mt-1 text-gray-700 leading-relaxed">
                        {viewingProduct.moreInfo}
                      </p>
                    </div>
                  )}

                  {/* Color Variants */}
                  {viewingProduct.colorVariants &&
                    viewingProduct.colorVariants.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Color Variants
                        </Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {viewingProduct.colorVariants.map(
                            (variant: any, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                {variant.name}
                                <span className="text-xs text-gray-500">
                                  ({variant.stock} in stock)
                                </span>
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Sizes */}
                  {viewingProduct.sizes && viewingProduct.sizes.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Available Sizes
                      </Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {viewingProduct.sizes.map(
                          (size: any, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              {size.size}
                              <span className="text-xs text-gray-500">
                                ({size.stock} in stock)
                              </span>
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Policies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingProduct.returnPolicy && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Return Policy
                        </Label>
                        <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {viewingProduct.returnPolicy}
                        </p>
                      </div>
                    )}

                    {viewingProduct.exchangePolicy && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Exchange Policy
                        </Label>
                        <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {viewingProduct.exchangePolicy}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      onClick={() => {
                        setEditingProduct(viewingProduct);
                        setProductForm({
                          name: viewingProduct.name,
                          description: viewingProduct.description,
                          moreInfo: viewingProduct.moreInfo || "",
                          returnPolicy:
                            viewingProduct.returnPolicy ||
                            "Returns accepted within 30 days of purchase. Item must be in original condition.",
                          exchangePolicy:
                            viewingProduct.exchangePolicy ||
                            "Exchanges accepted within 15 days. Size/color exchanges subject to availability.",
                          price: viewingProduct.price.toString(),
                          discount: viewingProduct.discount || {
                            percentage: 0,
                            isActive: false,
                            validUntil: "",
                          },
                          category: viewingProduct.category,
                          colorVariants: viewingProduct.colorVariants || [],
                          dimensions: viewingProduct.dimensions || {
                            length: "",
                            width: "",
                            height: "",
                            weight: "",
                            unit: "cm",
                          },
                          images: viewingProduct.images || [],
                          sku: viewingProduct.sku,
                          featured: viewingProduct.featured || false,
                          relatedProducts: viewingProduct.relatedProducts || [],
                          sizes: viewingProduct.sizes || [],
                        });
                        setIsProductViewDialogOpen(false);
                        setIsProductDialogOpen(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit Product
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Product
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the product "{viewingProduct.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDeleteProduct(viewingProduct._id);
                              setIsProductViewDialogOpen(false);
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Product Status Dialog */}
          <Dialog
            open={isStatusDialogOpen}
            onOpenChange={setIsStatusDialogOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Update Product Status
                </DialogTitle>
                <DialogDescription>
                  Change the status of this product to control its visibility
                  and availability.
                </DialogDescription>
              </DialogHeader>

              {viewingProduct && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Product</Label>
                    <p className="text-lg font-semibold">
                      {viewingProduct.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      SKU: {viewingProduct.sku}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Current Status
                    </Label>
                    <div className="flex items-center gap-2">
                      {viewingProduct.isActive !== undefined ? (
                        viewingProduct.isActive ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <XCircle size={12} className="mr-1" />
                            Inactive
                          </Badge>
                        )
                      ) : (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Update Status</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() =>
                            handleUpdateProductStatus(viewingProduct._id, true)
                          }
                          variant={
                            viewingProduct.isActive !== false
                              ? "default"
                              : "outline"
                          }
                          className={`flex items-center gap-2 ${
                            viewingProduct.isActive !== false
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "border-green-600 text-green-600 hover:bg-green-50"
                          }`}
                          disabled={viewingProduct.isActive !== false}
                        >
                          <CheckCircle size={16} />
                          Activate Product
                        </Button>

                        <Button
                          onClick={() =>
                            handleUpdateProductStatus(viewingProduct._id, false)
                          }
                          variant={
                            viewingProduct.isActive === false
                              ? "destructive"
                              : "outline"
                          }
                          className={`flex items-center gap-2 ${
                            viewingProduct.isActive === false
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "border-red-600 text-red-600 hover:bg-red-50"
                          }`}
                          disabled={viewingProduct.isActive === false}
                        >
                          <XCircle size={16} />
                          Deactivate Product
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>Note:</strong> Inactive products will not be
                      visible to customers in the store but will remain in your
                      inventory.
                    </p>
                  </div>
                </div>
              )}

              <DialogFooter className="flex gap-2">
                <Button
                  onClick={() => setIsStatusDialogOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Customer View Dialog */}
          <Dialog
            open={isCustomerViewDialogOpen}
            onOpenChange={setIsCustomerViewDialogOpen}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Details
                </DialogTitle>
              </DialogHeader>

              {viewingCustomer && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Full Name
                        </Label>
                        <p className="text-lg font-semibold">
                          {viewingCustomer.firstName && viewingCustomer.lastName
                            ? `${viewingCustomer.firstName} ${viewingCustomer.lastName}`
                            : viewingCustomer.firstName ||
                              viewingCustomer.lastName ||
                              "N/A"}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Email
                        </Label>
                        <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {viewingCustomer.email}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Phone
                        </Label>
                        <p>{viewingCustomer.phone || "N/A"}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Role
                        </Label>
                        <div className="mt-1">
                          <Badge
                            variant={
                              viewingCustomer.role === "admin"
                                ? "default"
                                : "outline"
                            }
                            className={
                              viewingCustomer.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : viewingCustomer.role === "seller"
                                ? "bg-orange-100 text-orange-800"
                                : ""
                            }
                          >
                            {viewingCustomer.role === "user"
                              ? "customer"
                              : viewingCustomer.role}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Status
                        </Label>
                        <div className="mt-1">
                          {viewingCustomer.isActive !== false ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <XCircle size={12} className="mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Member Since
                        </Label>
                        <p>
                          {new Date(
                            viewingCustomer.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {viewingCustomer.address && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Address
                      </Label>
                      <div className="mt-1 text-gray-700 bg-gray-50 p-3 rounded">
                        {typeof viewingCustomer.address === "object" ? (
                          <div>
                            <p>{viewingCustomer.address.street}</p>
                            <p>
                              {viewingCustomer.address.city},{" "}
                              {viewingCustomer.address.state}{" "}
                              {viewingCustomer.address.zipCode}
                            </p>
                            <p>{viewingCustomer.address.country}</p>
                          </div>
                        ) : (
                          <p>{viewingCustomer.address}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {(viewingCustomer.role === "user" ||
                    viewingCustomer.role === "seller") && (
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        onClick={() => {
                          setEditingCustomer(viewingCustomer);
                          setIsCustomerViewDialogOpen(false);
                          setIsCustomerEditDialogOpen(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit Customer
                      </Button>

                      <Button
                        onClick={() =>
                          handleToggleCustomerStatus(viewingCustomer._id)
                        }
                        variant={
                          viewingCustomer.isActive === false
                            ? "default"
                            : "outline"
                        }
                        className="flex items-center gap-2"
                      >
                        {viewingCustomer.isActive === false ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Activate
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            Deactivate
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Customer Edit Dialog */}
          <Dialog
            open={isCustomerEditDialogOpen}
            onOpenChange={setIsCustomerEditDialogOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Edit Customer
                </DialogTitle>
              </DialogHeader>

              {editingCustomer && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const customerData = {
                      firstName: formData.get("firstName") as string,
                      lastName: formData.get("lastName") as string,
                      phone: formData.get("phone") as string,
                      isActive: formData.get("isActive") === "true",
                    };
                    handleUpdateCustomer(editingCustomer._id, customerData);
                  }}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          defaultValue={editingCustomer.firstName || ""}
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          defaultValue={editingCustomer.lastName || ""}
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={editingCustomer.phone || ""}
                        placeholder="Phone number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="isActive">Status</Label>
                      <Select
                        name="isActive"
                        defaultValue={
                          editingCustomer.isActive !== false ? "true" : "false"
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter className="flex gap-2 mt-6">
                    <Button
                      type="button"
                      onClick={() => setIsCustomerEditDialogOpen(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Update Customer</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Order Details Modal */}
          <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Details
                </DialogTitle>
              </DialogHeader>

              {viewingOrder ? (
                <div className="space-y-6">
                  {/* Order Header */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Order ID
                      </Label>
                      <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {viewingOrder._id}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Status
                      </Label>
                      <div className="mt-1">
                        {getStatusBadge(viewingOrder.status)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Order Date
                      </Label>
                      <p>
                        {new Date(viewingOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Name
                        </Label>
                        <p>
                          {viewingOrder.user?.firstName &&
                          viewingOrder.user?.lastName
                            ? `${viewingOrder.user.firstName} ${viewingOrder.user.lastName}`
                            : viewingOrder.user?.name ||
                              viewingOrder.customerInfo?.name ||
                              "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Email
                        </Label>
                        <p>
                          {viewingOrder.user?.email ||
                            viewingOrder.customerInfo?.email ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Phone
                        </Label>
                        <p>
                          {viewingOrder.user?.phone ||
                            viewingOrder.customerInfo?.phone ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Order Number
                        </Label>
                        <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {viewingOrder.orderNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Transaction ID
                        </Label>
                        <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {viewingOrder.transactionId || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Payment Method
                        </Label>
                        <p className="capitalize">
                          {viewingOrder.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : viewingOrder.paymentMethod === "mobile_banking"
                            ? "Mobile Banking"
                            : viewingOrder.paymentMethod || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Payment Status
                        </Label>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              viewingOrder.paymentStatus === "paid"
                                ? "bg-green-100 text-green-800"
                                : viewingOrder.paymentStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : viewingOrder.paymentStatus === "failed"
                                ? "bg-red-100 text-red-800"
                                : viewingOrder.paymentStatus === "refunded"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {viewingOrder.paymentStatus
                              ?.charAt(0)
                              .toUpperCase() +
                              viewingOrder.paymentStatus?.slice(1) || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  {viewingOrder.shippingAddress && (
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">
                        Shipping Address
                      </h3>
                      <div className="text-gray-700">
                        {typeof viewingOrder.shippingAddress === "object" ? (
                          <div>
                            <p>{viewingOrder.shippingAddress.street}</p>
                            <p>
                              {viewingOrder.shippingAddress.city},{" "}
                              {viewingOrder.shippingAddress.state}
                            </p>
                            <p>{viewingOrder.shippingAddress.zipCode}</p>
                            <p>{viewingOrder.shippingAddress.country}</p>
                          </div>
                        ) : (
                          <p>{viewingOrder.shippingAddress}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                    {viewingOrder.items && viewingOrder.items.length > 0 ? (
                      <div className="space-y-3">
                        {viewingOrder.items.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {item.product?.images?.[0] && (
                                <img
                                  src={item.product.images[0].url}
                                  alt={item.product.name}
                                  className="w-12 h-12 rounded object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium">
                                  {item.product?.name || item.name || "Product"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  SKU: {item.product?.sku || item.sku || "N/A"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatPrice(item.price)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Total: {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No items found
                      </p>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>
                          {formatPrice(
                            viewingOrder.subtotal || viewingOrder.totalAmount
                          )}
                        </span>
                      </div>
                      {viewingOrder.shippingCost && (
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>{formatPrice(viewingOrder.shippingCost)}</span>
                        </div>
                      )}
                      {viewingOrder.tax && (
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>{formatPrice(viewingOrder.tax)}</span>
                        </div>
                      )}
                      {viewingOrder.discount && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount:</span>
                          <span>-{formatPrice(viewingOrder.discount)}</span>
                        </div>
                      )}
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span>{formatPrice(viewingOrder.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Loading order details...</p>
                  </div>
                </div>
              )}

              <DialogFooter className="flex gap-2">
                <Button
                  onClick={() => setIsOrderModalOpen(false)}
                  variant="outline"
                >
                  Close
                </Button>
                {viewingOrder && (
                  <Button
                    onClick={() => {
                      setIsOrderModalOpen(false);
                      // You can add navigation to edit order here if needed
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Order
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
