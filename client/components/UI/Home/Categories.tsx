"use client";

import React from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";

// Category images
import categoryImage1 from "../../../public/categories/Symbol web-14.png";
import categoryImage2 from "../../../public/categories/Symbol web-15.png";
import categoryImage3 from "../../../public/categories/Symbol web-16.png";
import categoryImage4 from "../../../public/categories/Symbol web-17.png";

// Mock product image
const productImg = "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg";

// Mock products (ensure id, name, price, image)
const products = {
  bags: Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      name: "Ladies Bag",
      price: "৳2,500",
      image: productImg,
      category: "bag",
    })),
  jewelry: Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i + 101,
      name: "Necklace",
      price: "৳3,200",
      image: productImg,
      category: "jewellry",
    })),
  sunglasses: Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i + 201,
      name: "Sunglasses",
      price: "৳1,200",
      image: productImg,
      category: "glass",
    })),
  watches: Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i + 301,
      name: "Luxury Watch",
      price: "৳8,500",
      image: productImg,
      category: "watch",
    })),
};

export default function Categories() {
  const { addItem } = useCartStore();

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

  return (
    <div className="text-center py-32">
      <Tabs defaultValue="bags" className="w-full">
        {/* Category Selector */}
        <TabsList className="flex justify-center items-center gap-10 bg-transparent p-0">
          {[
            { value: "bags", img: categoryImage1, label: "Bags" },
            { value: "jewelry", img: categoryImage2, label: "Jewelry" },
            { value: "sunglasses", img: categoryImage3, label: "Sunglasses" },
            { value: "watches", img: categoryImage4, label: "Watches" },
          ].map((cat) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              className="flex items-center justify-center w-32 h-32 rounded-full transition-all data-[state=active]:bg-pink-100 data-[state=active]:text-pink-600"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src={cat.img}
                  alt={cat.label}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Products Section */}
        {Object.entries(products).map(([key, items]) => (
          <TabsContent key={key} value={key}>
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                  {(items as any[]).slice(0, 12).map((p, i) => (
                    <ProductCard
                      key={`${key}-${p.id}-${i}`}
                      product={p}
                      showAddToCart
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            </section>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
