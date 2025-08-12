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
  Ruler,
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
    // Updated: dimensions instead of sizes array
    dimensions: "22cm x 20cm x 12cm",
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
    inStock: true,
    description: `Experience timeless elegance with Arjo's White Premium Panjabi, crafted from premium Remi Rayon for ultimate comfort. This panjabi offers a breathable, soft feel, ensuring effortless wear throughout the day. Designed with a tailored fit, it seamlessly blends tradition with modern sophistication, making it perfect for any occasion, be it casual gatherings or festive celebrations. If you're looking for high-quality panjabi for men in BD, this refined piece is a must-have in your collection. Elevate your style with Arjo today!`,
  };

  // Updated: Add color validation for both buttons
  const handleAddToCart = () => {
    if (!selectedColor) {
      alert("Please select a color");
      return;
    }

    const cartItem = {
      ...product,
      selectedColor,
      quantity,
    };

    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }

    alert("Added to cart!");
  };

  // New: Handle Order Now - goes directly to checkout
  const handleOrderNow = () => {
    if (!selectedColor) {
      alert("Please select a color");
      return;
    }

    const cartItem = {
      ...product,
      selectedColor,
      quantity,
    };

    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }

    // Redirect to checkout page
    router.push("/checkout");
  };

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
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-[550px] overflow-hidden rounded-lg border">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded border-2 ${
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


 {/* Dimensions Display - Replaced Size Selection */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Dimensions
              </h3>
              <div className="py-3 px-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-lg font-medium text-gray-800">
                  {product.dimensions}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Length × Width × Height
                </p>
              </div>
            </div>
            {/* Color Selection - Made Required */}
            <div>
              <h3 className="font-semibold mb-3">
                Color <span className="text-red-500">*</span>
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

            {/* Action Buttons - Fixed Order Now functionality */}
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
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                          {product.description}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* More Information */}
                  <Collapsible
                    open={isMoreInfoOpen}
                    onOpenChange={setIsMoreInfoOpen}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <h2 className="text-lg font-semibold">
                        More Information
                      </h2>
                      {isMoreInfoOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">
                            Product Details
                          </h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Premium {product.material} fabric</li>
                            <li>• Traditional design with modern fit</li>
                            <li>• Suitable for all occasions</li>
                            <li>• Easy care and maintenance</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">
                            Care Instructions
                          </h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Machine wash cold</li>
                            <li>• Do not bleach</li>
                            <li>• Tumble dry low</li>
                            <li>• Iron on medium heat</li>
                          </ul>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Returns & Exchanges */}
                  <Collapsible
                    open={isReturnsOpen}
                    onOpenChange={setIsReturnsOpen}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <h2 className="text-lg font-semibold">
                        Returns & Exchanges
                      </h2>
                      {isReturnsOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">
                            Return Policy
                          </h4>
                          <p className="text-xs text-gray-600 mb-3">
                            Items can be returned within 30 days of purchase.
                            Items must be in original condition with tags attached.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">
                            Exchange Policy
                          </h4>
                          <p className="text-xs text-gray-600 mb-3">
                            Exchanges are available within 7 days of purchase.
                            Color exchanges subject to availability.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">
                            How to Return
                          </h4>
                          <ol className="text-xs text-gray-600 space-y-1">
                            <li>1. Contact our customer service</li>
                            <li>2. Pack the item securely</li>
                            <li>3. Use the provided return label</li>
                            <li>4. Drop off at any courier service</li>
                          </ol>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Title with decorative underline */}
            <div className="mb-8 relative">
              <h2 className="text-2xl font-bold text-gray-800">
                More Products
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
      </div>
    </div>
  );
}