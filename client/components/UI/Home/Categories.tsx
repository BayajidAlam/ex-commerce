"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Category images
import categoryImage1 from "../../../public/categories/Symbol web-14.png";
import categoryImage2 from "../../../public/categories/Symbol web-15.png";
import categoryImage3 from "../../../public/categories/Symbol web-16.png";
import categoryImage4 from "../../../public/categories/Symbol web-17.png";

// Product image link
const productImg = "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg";

// Mock products
const products = {
  bags: Array(4).fill({ name: "Ladies Bag", img: productImg }),
  jewelry: Array(4).fill({ name: "Necklace", img: productImg }),
  sunglasses: Array(4).fill({ name: "Sunglasses", img: productImg }),
  watches: Array(4).fill({ name: "Luxury Watch", img: productImg }),
};

export default function Categories() {
  return (
    <div className="text-center py-32">
      <Tabs defaultValue="bags" className="w-full">
        {/* Category Selector */}
        <TabsList className="flex justify-center items-center gap-10 bg-transparent p-0">
          {[
            { value: "bags", img: categoryImage1 },
            { value: "jewelry", img: categoryImage2 },
            { value: "sunglasses", img: categoryImage3 },
            { value: "watches", img: categoryImage4 },
          ].map((cat) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              className="flex items-center justify-center w-32 h-32 rounded-full
                         transition-all data-[state=active]:bg-pink-100 data-[state=active]:text-pink-600"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src={cat.img}
                  alt={cat.value}
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
            <CategorySection title={key} items={items} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function CategorySection({
  title,
  items,
}: {
  title: string;
  items: { name: string; img: string }[];
}) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {items.map((product, i) => (
            <Link key={i} href={`/products/${i}`} className="block group">
              <div className="overflow-hidden rounded-lg shadow-sm group-hover:shadow-lg transition-shadow">
                <Image
                  src={product.img}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="mt-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {product.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
