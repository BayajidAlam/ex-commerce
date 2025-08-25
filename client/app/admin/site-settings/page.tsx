"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Header from "@/components/header";
import { uploadSingleToCloudinary } from "@/lib/actions/admin";

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

export default function SiteSettingsPage() {
  const [siteSettings, setSiteSettings] = useState<any>({
    siteName: "ARJO",
    logoUrl: "",
    faviconUrl: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    seoSettings: {
      metaTitle: "",
      metaDescription: "",
      keywords: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  // Image upload handlers
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const result = await uploadSingleToCloudinary(file);
      if (result.success) {
        setSiteSettings({
          ...siteSettings,
          logoUrl: result.data.secure_url,
        });
        toast.success("Logo uploaded successfully!");
      } else {
        toast.error(result.message || "Failed to upload logo");
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      toast.error("Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
      // Reset the input
      e.target.value = "";
    }
  };

  const handleFaviconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFavicon(true);
    try {
      const result = await uploadSingleToCloudinary(file);
      if (result.success) {
        setSiteSettings({
          ...siteSettings,
          faviconUrl: result.data.secure_url,
        });
        toast.success("Favicon uploaded successfully!");
      } else {
        toast.error(result.message || "Failed to upload favicon");
      }
    } catch (error) {
      console.error("Favicon upload error:", error);
      toast.error("Failed to upload favicon");
    } finally {
      setIsUploadingFavicon(false);
      // Reset the input
      e.target.value = "";
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const headers = getAuthHeaders();

      const response = await fetch(`${API_BASE}/api/admin/site-settings`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setSiteSettings(data.siteSettings || {});
      } else {
        console.error("Failed to fetch site settings");
        toast.error("Failed to fetch site settings");
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
      toast.error("Error fetching site settings");
    }
  };

  const saveSiteSettings = async () => {
    setIsLoading(true);
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const headers = getAuthHeaders();

      const response = await fetch(`${API_BASE}/api/admin/site-settings`, {
        method: "PUT",
        headers,
        body: JSON.stringify(siteSettings),
      });

      if (response.ok) {
        const data = await response.json();
        setSiteSettings(data.siteSettings);
        toast.success("Site settings saved successfully");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to save site settings");
      }
    } catch (error) {
      console.error("Error saving site settings:", error);
      toast.error("Failed to save site settings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteSettings();
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
            <h1 className="text-3xl font-bold">Site Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage your website settings, contact information, and SEO.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={saveSiteSettings}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        siteName: e.target.value,
                      })
                    }
                    placeholder="Enter site name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={siteSettings.description}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter site description"
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <Label>Logo</Label>
                  <div className="space-y-4">
                    {siteSettings.logoUrl && (
                      <div className="relative inline-block">
                        <img
                          src={siteSettings.logoUrl}
                          alt="Logo preview"
                          className="h-20 w-auto border rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() =>
                            setSiteSettings({
                              ...siteSettings,
                              logoUrl: "",
                            })
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={siteSettings.logoUrl || ""}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              logoUrl: e.target.value,
                            })
                          }
                          placeholder="Enter logo URL or upload below"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                          disabled={isUploadingLogo}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          asChild
                          disabled={isUploadingLogo}
                        >
                          <label
                            htmlFor="logo-upload"
                            className="cursor-pointer"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isUploadingLogo ? "Uploading..." : "Upload"}
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Favicon Upload */}
                <div>
                  <Label>Favicon</Label>
                  <div className="space-y-4">
                    {siteSettings.faviconUrl && (
                      <div className="relative inline-block">
                        <img
                          src={siteSettings.faviconUrl}
                          alt="Favicon preview"
                          className="h-8 w-8 border rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0"
                          onClick={() =>
                            setSiteSettings({
                              ...siteSettings,
                              faviconUrl: "",
                            })
                          }
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={siteSettings.faviconUrl || ""}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              faviconUrl: e.target.value,
                            })
                          }
                          placeholder="Enter favicon URL or upload below"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFaviconUpload}
                          className="hidden"
                          id="favicon-upload"
                          disabled={isUploadingFavicon}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          asChild
                          disabled={isUploadingFavicon}
                        >
                          <label
                            htmlFor="favicon-upload"
                            className="cursor-pointer"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isUploadingFavicon ? "Uploading..." : "Upload"}
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        contactEmail: e.target.value,
                      })
                    }
                    placeholder="Enter contact email"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={siteSettings.contactPhone}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        contactPhone: e.target.value,
                      })
                    }
                    placeholder="Enter contact phone"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={siteSettings.address}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        address: e.target.value,
                      })
                    }
                    placeholder="Enter business address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={siteSettings.seoSettings?.metaTitle || ""}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        seoSettings: {
                          ...siteSettings.seoSettings,
                          metaTitle: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter meta title"
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={siteSettings.seoSettings?.metaDescription || ""}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        seoSettings: {
                          ...siteSettings.seoSettings,
                          metaDescription: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter meta description"
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={siteSettings.seoSettings?.keywords || ""}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        seoSettings: {
                          ...siteSettings.seoSettings,
                          keywords: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter keywords (comma separated)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    value={siteSettings.socialMedia?.facebook || ""}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        socialMedia: {
                          ...siteSettings.socialMedia,
                          facebook: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter Facebook URL"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={siteSettings.socialMedia?.instagram || ""}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        socialMedia: {
                          ...siteSettings.socialMedia,
                          instagram: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter Instagram URL"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    value={siteSettings.socialMedia?.twitter || ""}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        socialMedia: {
                          ...siteSettings.socialMedia,
                          twitter: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter Twitter URL"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={siteSettings.socialMedia?.linkedin || ""}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        socialMedia: {
                          ...siteSettings.socialMedia,
                          linkedin: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter LinkedIn URL"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
