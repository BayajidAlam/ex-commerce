"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import BannerSlider from "@/components/banner-slider";
import { ProductCard } from "@/components/ProductCard";
import Categories from "@/components/UI/Home/Categories";
import Link from "next/link";
import Header from "@/components/header";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import LovedByYouSection from "@/components/LovedByYouSection";
import { Skeleton } from "@/components/ui/skeleton";

// Site settings interface
interface SiteSettings {
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

// Note: Since this is a client component, we can't export metadata directly
// The metadata is handled in layout.tsx. For dynamic SEO, consider using next/head or
// converting sections to server components

export default function HomePage() {
  const { addItem } = useCartStore();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch site settings
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_BASE}/api/site-settings`);
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data.siteSettings);
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      }
    };
    fetchSiteSettings();
  }, []);

  // Fetch recent products
  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(
          `${API_BASE}/api/products?limit=4&sortBy=createdAt&sortOrder=desc`
        );
        if (response.ok) {
          const data = await response.json();
          // Transform products to match the expected format
          const transformedProducts = data.products.map((product: any) => ({
            id: product._id,
            name: product.name,
            price: `৳${product.price}`,
            image:
              product.images && product.images.length > 0
                ? product.images[0].url
                : "/placeholder.jpg",
            category: product.category,
          }));
          setRecentProducts(transformedProducts);
        } else {
          console.error("Failed to fetch recent products");
        }
      } catch (error) {
        console.error("Error fetching recent products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchRecentProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || "general",
      selectedColor: "default",
      selectedSize: "default",
      quantity: 1,
      itemKey: `${product.id}-default-default`,
    };

    addItem(cartItem, "default", "default", 1);

    toast.success(`🛒 ${product.name} added to cart!`, {
      description: "1 item added successfully",
      className: "border-green-200 bg-green-50",
    });
  };

  const products = [
    {
      title: "Ladies Bags",
      description:
        "Stylish and functional bags designed for modern, confident women",
      imgSrc: "/path-to-your-image1.jpg",
      buttonActive: true,
      link: "/",
    },
    {
      title: "Jewelry",
      description:
        "Elegant jewelry pieces to elevate your every-day and special looks.",
      imgSrc: "/path-to-your-image2.jpg",
      buttonActive: false,
      link: "/",
    },
    {
      title: "Sunglasses",
      description:
        "Designer-inspired sunglasses crafted for bold expression and flawless protection.",
      imgSrc: "/path-to-your-image3.jpg",
      buttonActive: false,
      link: "/",
    },
    {
      title: "Watches",
      description:
        "Refined and reliable watches made to complement every graceful moment.",
      imgSrc: "/path-to-your-image4.jpg",
      buttonActive: false,
      link: "/",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Banner Slider */}
      <BannerSlider />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-4xl font-bold">Find your flow</h1>
          <p className="text-gray-700 text-sm">
            Explore styles curated for every version of you
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map(
            ({ title, description, imgSrc, buttonActive, link }) => (
              <Link
                key={title}
                href={link || "#"}
                className="flex flex-col space-y-4 rounded-lg overflow-hidden cursor-pointer"
              >
                <div className="rounded-lg overflow-hidden p-3">
                  <img
                    src={"https://i.ibb.co.com/9HXS7Q16/image.png"}
                    alt={title}
                    className="w-full h-88 object-cover rounded-lg"
                  />
                </div>
                <div className="px-1">
                  <h3 className="font-bold text-lg text-center">{title}</h3>
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Loved by You Section */}
      <LovedByYouSection />

      {/* Category */}

      <Categories />

      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* First Image */}
          <div className="relative w-full h-[700px] overflow-hidden">
            <Image
              src="https://i.ibb.co.com/PvcyVZ2D/image.png"
              alt="First"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Second Image */}
          <div className="relative w-full h-[700px] overflow-hidden ">
            <Image
              src="https://i.ibb.co.com/wF9t4QwY/image.png"
              alt="Second"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-40">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-800">Recently Added</h2>
            <div className="mt-2 w-36 h-1 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-red-500 shadow-md"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loadingProducts ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            ) : recentProducts.length > 0 ? (
              recentProducts.map((product, i) => (
                <ProductCard
                  product={product}
                  key={product.id || i}
                  onAddToCart={handleAddToCart}
                  showAddToCart={true}
                />
              ))
            ) : (
              // No products found
              <div className="col-span-2 md:col-span-4 text-center py-8">
                <p className="text-gray-500">No recent products found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                {siteSettings?.logoUrl ? (
                  <img
                    src={siteSettings.logoUrl}
                    alt={siteSettings.siteName || "ARJO"}
                    className="h-8 w-auto max-w-[120px] object-contain brightness-0 invert"
                  />
                ) : (
                  <h3 className="text-xl font-bold">
                    {siteSettings?.siteName || "ARJO"}
                  </h3>
                )}
              </div>
              <p className="text-gray-400 text-sm">
                {siteSettings?.description ||
                  "Premium quality men's fashion and traditional wear."}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Casual Shirts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Formal Wear
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Traditional
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Seasonal
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Phone: {siteSettings?.contactPhone || "+880 123 456 789"}</p>
                <p>Email: {siteSettings?.contactEmail || "info@arjo.com"}</p>
                <p>Address: {siteSettings?.address || "Dhaka, Bangladesh"}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; 2024 {siteSettings?.siteName || "ARJO"}. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
