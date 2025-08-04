import Image from "next/image";
import Header from "@/components/header";
import BannerSlider from "@/components/banner-slider";
import { ProductCard } from "@/components/ProductCard";
import Categories from "@/components/UI/Home/Categories";
import productImage from "../public/products/Aluna 250103.jpg";

export default function HomePage() {
  const seasonalProducts = [
    {
      id: 9,
      name: "Pink Casual Shirt",
      price: "৳1,600",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 10,
      name: "Light Green Shirt",
      price: "৳1,700",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 11,
      name: "Striped Formal",
      price: "৳1,900",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 12,
      name: "Beige Casual",
      price: "৳1,500",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 13,
      name: "Check Pattern",
      price: "৳1,800",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 14,
      name: "Cream Formal",
      price: "৳2,000",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 16,
      name: "Cream Formal",
      price: "৳2,000",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 17,
      name: "Cream Formal",
      price: "৳2,000",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
  ];

  const recentProducts = [
    {
      id: 21,
      name: "Yellow Casual Shirt",
      price: "৳1,400",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 22,
      name: "Light Blue Shirt",
      price: "৳1,600",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 23,
      name: "Red Check Shirt",
      price: "৳1,700",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 24,
      name: "Beige Casual",
      price: "৳1,500",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Banner Slider */}
      <BannerSlider />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Categories />
          <div className="relative h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src="/hero-image.png"
              alt="ARJO Collection"
              fill
              className="object-cover"
            />
          </div>
        </div>{" "}
      </section>

      {/* Seasonal Wear Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Item</h2>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {seasonalProducts.map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>

          {/* Large Bottom Images */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
          </div> */}
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Bag</h2>
            <div className="mt-2 w-36 h-1 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-red-500 shadow-md"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.slice(0, 4).map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Jewellery</h2>
            <div className="mt-2 w-36 h-1 rounded-full bg-gradient-to-r from-yellow-400 via-rose-400 to-pink-500 shadow-md"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.slice(0, 4).map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Watch</h2>
            <div className="mt-2 w-36 h-1 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-500 shadow-md"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.slice(0, 4).map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Glass</h2>
            <div className="mt-2 w-36 h-1 rounded-full bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 shadow-md"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.slice(0, 4).map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Title with decorative underline */}
          <div className="mb-8 relative">
            <h2 className="text-2xl font-bold text-gray-800">
              RECENT ARRIVALS
            </h2>
            <div className="mt-2 w-36 h-1 rounded-full bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 shadow-md"></div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.slice(0, 4).map((product, i) => (
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
