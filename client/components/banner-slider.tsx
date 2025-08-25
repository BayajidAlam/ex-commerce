"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  image: {
    url: string;
    public_id: string;
  };
  isActive: boolean;
}

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/banners`);

      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      } else {
        console.error("Failed to fetch banners");
        // Fallback to default banners if API fails
        setBanners(getDefaultBanners());
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      // Fallback to default banners if API fails
      setBanners(getDefaultBanners());
    } finally {
      setIsLoading(false);
    }
  };

  // Default banners as fallback
  const getDefaultBanners = (): Banner[] => [
    {
      _id: "default-1",
      title: "Summer Collection 2024",
      subtitle: "Discover our latest traditional wear",
      buttonText: "Shop Now",
      buttonLink: "/products",
      order: 1,
      image: {
        url: "/placeholder.svg?height=500&width=1200&text=Summer+Collection+2024",
        public_id: "default-1",
      },
      isActive: true,
    },
    {
      _id: "default-2",
      title: "Premium Panjabi Collection",
      subtitle: "Crafted with finest materials",
      buttonText: "Explore",
      buttonLink: "/products?category=traditional",
      order: 2,
      image: {
        url: "/placeholder.svg?height=500&width=1200&text=Premium+Panjabi+Collection",
        public_id: "default-2",
      },
      isActive: true,
    },
    {
      _id: "default-3",
      title: "Casual Shirts Sale",
      subtitle: "Up to 30% off on selected items",
      buttonText: "Shop Sale",
      buttonLink: "/products?category=casual",
      order: 3,
      image: {
        url: "/placeholder.svg?height=500&width=1200&text=Casual+Shirts+Sale",
        public_id: "default-3",
      },
      isActive: true,
    },
  ];

  useEffect(() => {
    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(nextSlide, 5000); // Change slide every 5 seconds
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  // Reset current slide if banners change
  useEffect(() => {
    if (currentSlide >= banners.length && banners.length > 0) {
      setCurrentSlide(0);
    }
  }, [banners.length, currentSlide]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[300px] md:h-[500px] bg-gray-200 animate-pulse rounded-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading banners...</div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[300px] md:h-[500px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to ARJO</h2>
          <p className="text-xl mb-6">Discover our premium collection</p>
          <Link href="/products">
            <Button size="lg" variant="secondary">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="relative w-full h-full flex-shrink-0"
          >
            <Image
              src={banner.image.url || "/placeholder.svg"}
              alt={banner.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-4">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {banner.title}
                </h2>
                <p className="text-lg md:text-xl mb-8">{banner.subtitle}</p>
                <Link href={banner.buttonLink}>
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    {banner.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? "bg-white" : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
