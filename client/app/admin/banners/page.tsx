"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  Edit3,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Header from "@/components/header";

// Helper function to get auth headers (same as admin.js)
function getAuthHeaders() {
  let token = null;

  // First try to get token from client-accessible cookie
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split("; ");
    console.log("All cookies:", cookies);

    const tokenCookie = cookies.find((row) =>
      row.startsWith("auth-token-client=")
    );
    if (tokenCookie) {
      token = tokenCookie.split("=")[1];
      console.log("Token found in auth-token-client cookie");
    } else {
      // Fallback to check if token is in regular auth-token cookie (if it's not httpOnly)
      const fallbackCookie = cookies.find((row) =>
        row.startsWith("auth-token=")
      );
      if (fallbackCookie) {
        token = fallbackCookie.split("=")[1];
        console.log("Token found in auth-token cookie");
      }
    }
  }

  // Fallback to localStorage if cookies are not available
  if (!token && typeof localStorage !== "undefined") {
    token = localStorage.getItem("auth-token");
    if (token) {
      console.log("Token found in localStorage");
    }
  }

  console.log("Final token status:", token ? "Found" : "Not found");
  if (token) {
    console.log("Token preview:", token.substring(0, 20) + "...");
  }

  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
}

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    buttonText: "Shop Now",
    buttonLink: "/products",
    order: 0,
    image: { url: "", public_id: "" },
  });

  const resetBannerForm = () => {
    setBannerForm({
      title: "",
      subtitle: "",
      buttonText: "Shop Now",
      buttonLink: "/products",
      order: 0,
      image: { url: "", public_id: "" },
    });
  };

  const fetchBanners = async () => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const headers = getAuthHeaders();

      const response = await fetch(`${API_BASE}/api/admin/banners`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      } else {
        console.error("Failed to fetch banners");
        toast.error("Failed to fetch banners");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Error fetching banners");
    }
  };

  const handleCreateBanner = async () => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const headers = getAuthHeaders();

      const response = await fetch(`${API_BASE}/api/admin/banners`, {
        method: "POST",
        headers,
        body: JSON.stringify(bannerForm),
      });

      if (response.ok) {
        const data = await response.json();
        setBanners([...banners, data.banner]);
        setIsBannerDialogOpen(false);
        resetBannerForm();
        toast.success("Banner created successfully");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create banner");
      }
    } catch (error) {
      console.error("Error creating banner:", error);
      toast.error("Failed to create banner");
    }
  };

  const handleUpdateBanner = async () => {
    if (!selectedBanner) return;

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const headers = getAuthHeaders();

      const response = await fetch(
        `${API_BASE}/api/admin/banners/${selectedBanner._id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(bannerForm),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBanners(
          banners.map((b) => (b._id === selectedBanner._id ? data.banner : b))
        );
        setIsBannerDialogOpen(false);
        setSelectedBanner(null);
        resetBannerForm();
        toast.success("Banner updated successfully");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update banner");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner");
    }
  };

  const toggleBannerStatus = async (bannerId: string) => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const headers = getAuthHeaders();

      const response = await fetch(
        `${API_BASE}/api/admin/banners/${bannerId}/toggle-status`,
        {
          method: "PATCH",
          headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBanners(banners.map((b) => (b._id === bannerId ? data.banner : b)));
        toast.success(data.message);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to toggle banner status");
      }
    } catch (error) {
      console.error("Error toggling banner status:", error);
      toast.error("Failed to toggle banner status");
    }
  };

  const deleteBanner = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const headers = getAuthHeaders();

      const response = await fetch(
        `${API_BASE}/api/admin/banners/${bannerId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (response.ok) {
        setBanners(banners.filter((b) => b._id !== bannerId));
        toast.success("Banner deleted successfully");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  const openEditDialog = (banner: any) => {
    setSelectedBanner(banner);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      order: banner.order,
      image: banner.image,
    });
    setIsBannerDialogOpen(true);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Banner Management</h1>
          </div>
          <p className="text-gray-600">
            Manage your website banners and slider content.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={() => setIsBannerDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Banner
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Website Banners</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Subtitle</TableHead>
                    <TableHead>Button Text</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner._id}>
                      <TableCell>
                        <img
                          src={banner.image.url}
                          alt={banner.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {banner.title}
                      </TableCell>
                      <TableCell>{banner.subtitle}</TableCell>
                      <TableCell>{banner.buttonText}</TableCell>
                      <TableCell>{banner.order}</TableCell>
                      <TableCell>
                        <Badge
                          variant={banner.isActive ? "default" : "secondary"}
                        >
                          {banner.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(banner)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBannerStatus(banner._id)}
                          >
                            {banner.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteBanner(banner._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {banners.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No banners found. Create your first banner!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Banner Dialog */}
        <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedBanner ? "Edit Banner" : "Create New Banner"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Banner Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Banner Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {bannerForm.image.url ? (
                    <div className="space-y-2">
                      <img
                        src={bannerForm.image.url}
                        alt="Banner preview"
                        className="max-h-48 mx-auto rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setBannerForm({
                            ...bannerForm,
                            image: { url: "", public_id: "" },
                          })
                        }
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload banner image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // For now, just set a placeholder URL - you'd implement Cloudinary upload here
                            const reader = new FileReader();
                            reader.onload = () => {
                              setBannerForm({
                                ...bannerForm,
                                image: {
                                  url: reader.result as string,
                                  public_id: "temp",
                                },
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="banner-upload"
                      />
                      <label
                        htmlFor="banner-upload"
                        className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={bannerForm.title}
                    onChange={(e) =>
                      setBannerForm({ ...bannerForm, title: e.target.value })
                    }
                    placeholder="Banner title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subtitle</label>
                  <Input
                    value={bannerForm.subtitle}
                    onChange={(e) =>
                      setBannerForm({ ...bannerForm, subtitle: e.target.value })
                    }
                    placeholder="Banner subtitle"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Button Text</label>
                  <Input
                    value={bannerForm.buttonText}
                    onChange={(e) =>
                      setBannerForm({
                        ...bannerForm,
                        buttonText: e.target.value,
                      })
                    }
                    placeholder="Shop Now"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Button Link</label>
                  <Input
                    value={bannerForm.buttonLink}
                    onChange={(e) =>
                      setBannerForm({
                        ...bannerForm,
                        buttonLink: e.target.value,
                      })
                    }
                    placeholder="/products"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Order</label>
                  <Input
                    type="number"
                    value={bannerForm.order}
                    onChange={(e) =>
                      setBannerForm({
                        ...bannerForm,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsBannerDialogOpen(false);
                  setSelectedBanner(null);
                  resetBannerForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  selectedBanner ? handleUpdateBanner : handleCreateBanner
                }
                disabled={!bannerForm.title || !bannerForm.image.url}
              >
                {selectedBanner ? "Update Banner" : "Create Banner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
