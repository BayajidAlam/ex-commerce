import Image from "next/image";
import Header from "@/components/header";
import BannerSlider from "@/components/banner-slider";
import { ProductCard } from "@/components/ProductCard";
import Categories from "@/components/UI/Home/Categories";
import productImage from "../public/products/Aluna 250103.jpg";
import Link from "next/link";

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

      {/* Seasonal Wear Section */}
      <section className="py-20 bg-gray-300">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Loved by you</h2>

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

        <div className="text-center">
          {" "}
          <button className="text-center text-lg bg-white px-10 py-2 rounded-md">
            See All
          </button>
        </div>
      </section>

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
