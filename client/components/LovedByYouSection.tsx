"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import {
  getMostSoldProductsClient,
  transformProduct,
} from "@/lib/api/products";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import Link from "next/link";

export default function LovedByYouSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchMostSoldProducts = async () => {
      try {
        setLoading(true);
        const mostSoldProducts = await getMostSoldProductsClient(8);
        const transformedProducts = mostSoldProducts.map(transformProduct);
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching most sold products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostSoldProducts();
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

  // Show skeleton loading when loading OR when no products are available
  if (loading || products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and bestselling products that customers
              can't stop buying
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Loved by You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and bestselling products that customers
            can't stop buying
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/products"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
