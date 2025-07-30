import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import BannerSlider from "@/components/banner-slider";
import { ProductCard } from "@/components/ProductCard";

export default function HomePage() {
  const products = [
    {
      id: 1,
      name: "Cotton Casual Shirt",
      price: "৳1,200",
      image: "/placeholder.svg?height=300&width=250&text=Casual+Shirt",
    },
    {
      id: 2,
      name: "Formal White Shirt",
      price: "৳1,500",
      image: "/placeholder.svg?height=300&width=250&text=White+Shirt",
    },
    {
      id: 3,
      name: "Denim Casual Shirt",
      price: "৳1,800",
      image: "/placeholder.svg?height=300&width=250&text=Denim+Shirt",
    },
    {
      id: 4,
      name: "Striped Casual Shirt",
      price: "৳1,400",
      image: "/placeholder.svg?height=300&width=250&text=Striped+Shirt",
    },
    {
      id: 5,
      name: "Black Kurta",
      price: "৳2,200",
      image: "/placeholder.svg?height=300&width=250&text=Black+Kurta",
    },
    {
      id: 6,
      name: "White Panjabi",
      price: "৳2,500",
      image: "/placeholder.svg?height=300&width=250&text=White+Panjabi",
    },
    {
      id: 7,
      name: "Navy Kurta",
      price: "৳2,000",
      image: "/placeholder.svg?height=300&width=250&text=Navy+Kurta",
    },
    {
      id: 8,
      name: "Maroon Kurta",
      price: "৳2,300",
      image: "/placeholder.svg?height=300&width=250&text=Maroon+Kurta",
    },
  ];

  const seasonalProducts = [
    {
      id: 9,
      name: "Pink Casual Shirt",
      price: "৳1,600",
      image: "/placeholder.svg?height=300&width=250&text=Pink+Shirt",
    },
    {
      id: 10,
      name: "Light Green Shirt",
      price: "৳1,700",
      image: "/placeholder.svg?height=300&width=250&text=Green+Shirt",
    },
    {
      id: 11,
      name: "Striped Formal",
      price: "৳1,900",
      image: "/placeholder.svg?height=300&width=250&text=Striped+Formal",
    },
    {
      id: 12,
      name: "Beige Casual",
      price: "৳1,500",
      image: "/placeholder.svg?height=300&width=250&text=Beige+Casual",
    },
    {
      id: 13,
      name: "Check Pattern",
      price: "৳1,800",
      image: "/placeholder.svg?height=300&width=250&text=Check+Pattern",
    },
    {
      id: 14,
      name: "Cream Formal",
      price: "৳2,000",
      image: "/placeholder.svg?height=300&width=250&text=Cream+Formal",
    },
    {
      id: 15,
      name: "Black Casual",
      price: "৳1,400",
      image: "/placeholder.svg?height=300&width=250&text=Black+Casual",
    },
    {
      id: 16,
      name: "Yellow Casual",
      price: "৳1,300",
      image: "/placeholder.svg?height=300&width=250&text=Yellow+Casual",
    },
  ];

  const bottomProducts = [
    {
      id: 17,
      name: "Light Pink Shirt",
      price: "৳1,500",
      image: "/placeholder.svg?height=300&width=250&text=Light+Pink",
    },
    {
      id: 18,
      name: "Black Formal",
      price: "৳1,800",
      image: "/placeholder.svg?height=300&width=250&text=Black+Formal",
    },
    {
      id: 19,
      name: "Light Blue Casual",
      price: "৳1,600",
      image: "/placeholder.svg?height=300&width=250&text=Light+Blue",
    },
    {
      id: 20,
      name: "Navy Formal",
      price: "৳1,900",
      image: "/placeholder.svg?height=300&width=250&text=Navy+Formal",
    },
  ];

  const recentProducts = [
    {
      id: 21,
      name: "Yellow Casual Shirt",
      price: "৳1,400",
      image: "/placeholder.svg?height=200&width=150&text=Yellow",
    },
    {
      id: 22,
      name: "Light Blue Shirt",
      price: "৳1,600",
      image: "/placeholder.svg?height=200&width=150&text=Light+Blue",
    },
    {
      id: 23,
      name: "Red Check Shirt",
      price: "৳1,700",
      image: "/placeholder.svg?height=200&width=150&text=Red+Check",
    },
    {
      id: 24,
      name: "Beige Casual",
      price: "৳1,500",
      image: "/placeholder.svg?height=200&width=150&text=Beige",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Banner Slider */}
      <BannerSlider />

      {/* Hero Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">SHIRT COLLECTION</h1>
            <div className="flex justify-center space-x-4 mb-6">
              <Button variant="outline" size="sm">
                Home
              </Button>
              <Button variant="outline" size="sm">
                All
              </Button>
              <Button variant="outline" size="sm">
                New
              </Button>
            </div>
            <Button className="bg-black text-white px-8 py-2 rounded-full">
              View All Products
            </Button>
          </div>

          <div className="relative h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src="/hero-image.png"
              alt="ARJO Collection"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {products.map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Wear Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">SEASONAL WEAR</h2>

          {/* Large Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=300&text=Seasonal+1"
                alt="Seasonal Collection"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=300&text=Seasonal+2"
                alt="Seasonal Collection"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=300&text=Seasonal+3"
                alt="Seasonal Collection"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=300&text=Seasonal+4"
                alt="Seasonal Collection"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {seasonalProducts.map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>

          {/* Bottom Row Products */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {bottomProducts.map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>

          {/* Large Bottom Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=500&text=Collection+Image+1"
                alt="Collection"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=500&text=Collection+Image+2"
                alt="Collection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            RECENT ARRIVALS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ARJO</h3>
              <p className="text-gray-400 text-sm">
                Premium quality men's fashion and traditional wear.
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
                <p>Phone: +880 123 456 789</p>
                <p>Email: info@arjo.com</p>
                <p>Address: Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ARJO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
