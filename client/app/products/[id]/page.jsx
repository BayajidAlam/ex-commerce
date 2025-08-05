"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import Header from "@/components/header";
import { useParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [isReturnsOpen, setIsReturnsOpen] = useState(false);

  // Mock product data - in real app, fetch based on params.id
  const product = {
    id: Number.parseInt(params.id) || 1,
    name: "White Premium Panjabi",
    price: "৳2,500",
    originalPrice: "৳3,000",
    category: "traditional",
    material: "Remi Rayon",
    images: [
      "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
      "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
      "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
      "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    ],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Cream", value: "#F5F5DC" },
      { name: "Light Blue", value: "#ADD8E6" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    description: `Experience timeless elegance with Arjo's White Premium Panjabi, crafted from premium Remi Rayon for ultimate comfort. This panjabi offers a breathable, soft feel, ensuring effortless wear throughout the day. Designed with a tailored fit, it seamlessly blends tradition with modern sophistication, making it perfect for any occasion, be it casual gatherings or festive celebrations. If you're looking for high-quality panjabi for men in BD, this refined piece is a must-have in your collection.`,
  };

  // Validation function
  const validateSelection = () => {
    const errors = [];
    if (!selectedColor) {
      errors.push("Please select a color");
    }
    if (!selectedSize) {
      errors.push("Please select a size");
    }
    
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!validateSelection()) return;
    
    addItem(product, selectedColor, selectedSize, quantity);
    alert(`Added ${product.name} (${selectedColor}, ${selectedSize}) to cart!`);
  };

  // Handle Order Now
  const handleOrderNow = () => {
    if (!validateSelection()) return;
    
    addItem(product, selectedColor, selectedSize, quantity);
    router.push("/checkout");
  };

  // Mock related products
  const relatedProducts = [
    {
      id: 2,
      name: "Black Premium Panjabi",
      price: "৳2,800",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 3,
      name: "Navy Blue Panjabi",
      price: "৳2,600",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 4,
      name: "Grey Cotton Panjabi",
      price: "৳2,400",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 5,
      name: "Maroon Festive Panjabi",
      price: "৳3,200",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-white">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                )}
                <Badge variant="destructive">Save ৳500</Badge>
              </div>
              <p className="text-gray-600 mb-4">Material: {product.material}</p>
              <div className="flex items-center space-x-2">
                <Badge variant={product.inStock ? "default" : "secondary"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">
                Color {!selectedColor && <span className="text-red-500">*</span>}
              </h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`py-2 px-4 border rounded transition-all ${
                      selectedColor === color.name
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {selectedColor}
                </p>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">
                Size {!selectedSize && <span className="text-red-500">*</span>}
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-4 border rounded transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {selectedSize}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-3">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="bg-transparent w-full"
                  size="lg"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleOrderNow}
                  className="w-full"
                  size="lg"
                  disabled={!product.inStock}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Order Now
                </Button>
              </div>
            </div>

            {/* Product Information Sections */}
            <div className="mt-8">
              <Card>
                <CardContent className="p-0">
                  {/* Description */}
                  <Collapsible
                    open={isDescriptionOpen}
                    onOpenChange={setIsDescriptionOpen}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <h2 className="text-lg font-semibold text-primary">
                        Description
                      </h2>
                      {isDescriptionOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* More Info */}
                  <Collapsible
                    open={isMoreInfoOpen}
                    onOpenChange={setIsMoreInfoOpen}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <h2 className="text-lg font-semibold text-primary">
                        More Information
                      </h2>
                      {isMoreInfoOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="font-medium">Material:</span>
                          <span>{product.material}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="font-medium">Care:</span>
                          <span>Machine wash cold</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="font-medium">Origin:</span>
                          <span>Bangladesh</span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Returns */}
                  <Collapsible
                    open={isReturnsOpen}
                    onOpenChange={setIsReturnsOpen}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <h2 className="text-lg font-semibold text-primary">
                        Returns & Exchange
                      </h2>
                      {isReturnsOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <p className="text-gray-600 text-sm">
                        Free returns within 7 days of delivery. Items must be
                        unworn and in original condition with tags attached.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}