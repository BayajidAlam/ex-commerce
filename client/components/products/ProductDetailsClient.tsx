"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCartStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import {
  Minus,
  Plus,
  Ruler,
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface ProductDetailsClientProps {
  product: any;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter();
  const { addItem } = useCartStore();

  // State management
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [isReturnsOpen, setIsReturnsOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  // Create gallery with exactly 4 images
  const createGallery = () => {
    const images = [];

    if (product.images && product.images.length > 0) {
      // Use available product images
      images.push(...product.images);
    } else if (product.image) {
      // If no images array, use main image
      images.push(product.image);
    }

    // If we have fewer than 4 images, repeat the first image to fill slots
    while (images.length < 4) {
      images.push(images[0] || "/placeholder.svg");
    }

    // Take only first 4 images
    return images.slice(0, 4);
  };

  const galleryImages = createGallery();

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    console.log("🖱️ Thumbnail clicked:", index);
    setSelectedImage(index);
  };

  // Validation helper - Size is mandatory if sizes are available
  const validateSelections = () => {
    const errors = [];

    // Require size selection if any sizes are available
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      errors.push("Please select a size");
    }

    return errors;
  };

  // Handle Add to Cart - NOW with redirect
  const handleAddToCart = async () => {
    // Check if product is out of stock first
    if (!product.inStock) {
      toast.error("Product is out of stock", {
        description:
          "This item is currently unavailable. Please check back later.",
        className: "border-red-200 bg-red-50",
      });
      return;
    }

    const errors = validateSelections();
    if (errors.length > 0) {
      toast.error(errors.join(" and "), {
        description: "Please make your selections before adding to cart",
        className: "border-red-200 bg-red-50",
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        selectedColor: selectedColor || "default",
        selectedSize: selectedSize || "default",
        quantity: quantity,
        itemKey: `${product.id}-${selectedColor || "default"}-${
          selectedSize || "default"
        }`,
      };

      addItem(
        cartItem,
        selectedColor || "default",
        selectedSize || "default",
        quantity
      );

      console.log("🎯 Item added to cart:", cartItem);

      toast.success(`🛒 ${product.name} added to cart!`, {
        description: `${quantity} item(s) • ${selectedColor || "Default"} • ${
          selectedSize || "Default"
        }`,
        className: "border-green-200 bg-green-50",
      });

      // Don't redirect - keep user on product page
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast.error("Oops! Something went wrong", {
        description: "Failed to add item to cart. Please try again.",
        className: "border-red-200 bg-red-50",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle Order Now - NOW with redirect
  const handleOrderNow = async () => {
    // Check if product is out of stock first
    if (!product.inStock) {
      toast.error("Product is out of stock", {
        description:
          "This item is currently unavailable. Please check back later.",
        className: "border-red-200 bg-red-50",
      });
      return;
    }

    const errors = validateSelections();
    if (errors.length > 0) {
      toast.error(errors.join(" and "), {
        description: "Please make your selections before ordering",
        className: "border-red-200 bg-red-50",
      });
      return;
    }

    setIsOrdering(true);

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        selectedColor: selectedColor || "default",
        selectedSize: selectedSize || "default",
        quantity: quantity,
        itemKey: `${product.id}-${selectedColor || "default"}-${
          selectedSize || "default"
        }`,
      };

      addItem(
        cartItem,
        selectedColor || "default",
        selectedSize || "default",
        quantity
      );

      toast.success(`🚀 Order placed! Redirecting...`, {
        className: "border-blue-200 bg-blue-50",
      });

      // ✅ Redirect to checkout immediately
      router.push("/checkout");
    } catch (error) {
      console.error("❌ Error in Order Now:", error);
      toast.error("Order failed!", {
        description: "Unable to process your order. Please try again.",
        className: "border-red-200 bg-red-50",
      });
      setIsOrdering(false);
    }
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-[550px] overflow-hidden rounded-lg border">
              <Image
                src={galleryImages[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnails - Always show exactly 4 */}
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative aspect-square overflow-hidden rounded border-2 transition-all duration-200 hover:scale-105 ${
                    selectedImage === index
                      ? "border-blue-500 border-4 shadow-lg"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                    <Badge variant="destructive">Save ৳500</Badge>
                  </>
                )}
              </div>
              <p className="text-gray-600 mb-4">
                Material: {product.material || "Premium Quality"}
              </p>

              {/* Color Selection - Made Selectable */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    Color
                    {selectedColor && (
                      <span className="ml-2 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {selectedColor}
                      </span>
                    )}
                  </h3>
                  <div className="flex space-x-2 flex-wrap gap-2">
                    {product.colors.map((color: any, index: number) => {
                      const colorName =
                        typeof color === "string" ? color : color.name;
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(colorName)}
                          className={`px-3 py-2 border-2 rounded-md transition-all duration-200 font-medium text-sm ${
                            selectedColor === colorName
                              ? "border-blue-500 bg-blue-50 text-blue-700 scale-105 shadow-md"
                              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:scale-102"
                          }`}
                        >
                          {colorName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Badge variant={product.inStock ? "default" : "secondary"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Dimensions
              </h3>
              <div className="py-3 px-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-lg font-medium text-gray-800">
                  {product.dimensions && typeof product.dimensions === "object"
                    ? `${product.dimensions.length || 22}${
                        product.dimensions.unit || "cm"
                      } × ${product.dimensions.width || 20}${
                        product.dimensions.unit || "cm"
                      } × ${product.dimensions.height || 12}${
                        product.dimensions.unit || "cm"
                      }`
                    : product.dimensions || "22cm × 20cm × 12cm"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Length × Width × Height
                </p>
              </div>
            </div>

            {/* Size Selection - Made Mandatory */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  Size
                  <span className="text-red-500 ml-1">*</span>
                  {selectedSize && (
                    <span className="ml-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                      {selectedSize}
                    </span>
                  )}
                </h3>
                <div className="flex space-x-2 flex-wrap gap-2">
                  {product.sizes.map((sizeObj: any, index: number) => {
                    const sizeValue =
                      typeof sizeObj === "string" ? sizeObj : sizeObj.size;
                    const stock =
                      typeof sizeObj === "object" ? sizeObj.stock : null;
                    const isOutOfStock = stock !== null && stock <= 0;

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          !isOutOfStock && setSelectedSize(sizeValue)
                        }
                        disabled={isOutOfStock}
                        className={`px-3 py-2 border-2 rounded-md transition-all duration-200 font-medium text-sm relative ${
                          selectedSize === sizeValue
                            ? "border-green-500 bg-green-50 text-green-700 scale-105 shadow-md"
                            : isOutOfStock
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:scale-102"
                        }`}
                      >
                        {sizeValue}
                        {isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-0.5 bg-red-400 rotate-45"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity - Enhanced */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-8 w-8 rounded-none hover:bg-gray-100 border-r border-gray-200"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="flex items-center justify-center w-12 h-8 text-sm font-bold bg-gray-50">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 rounded-none hover:bg-gray-100 border-l border-gray-200"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons - Reduced Size */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="default"
                  className="flex-1 h-12 text-base font-semibold cursor-pointer hover:bg-gray-50"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>

                <Button
                  onClick={handleOrderNow}
                  size="default"
                  className="flex-1 h-12 text-base font-semibold bg-black text-white cursor-pointer hover:bg-gray-800"
                >
                  <Heart className="mr-2 h-4 w-4" />
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
                      <h2 className="text-lg font-semibold text-blue-600">
                        Description
                      </h2>
                      {isDescriptionOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* More Information */}
                  <Collapsible
                    open={isMoreInfoOpen}
                    onOpenChange={setIsMoreInfoOpen}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <h2 className="text-lg font-semibold text-blue-600">
                        More Information
                      </h2>
                      {isMoreInfoOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Category:</span>
                          <span className="text-gray-600 capitalize">
                            {product.category}
                          </span>
                        </div>
                        {product.seller && (
                          <div className="flex justify-between">
                            <span className="font-medium">Seller:</span>
                            <span className="text-gray-600">
                              {product.seller.firstName}{" "}
                              {product.seller.lastName}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="font-medium">Availability:</span>
                          <span
                            className={
                              product.inStock
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Returns & Exchange */}
                  <Collapsible
                    open={isReturnsOpen}
                    onOpenChange={setIsReturnsOpen}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <h2 className="text-lg font-semibold text-blue-600">
                        Returns & Exchange
                      </h2>
                      {isReturnsOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>• 7-day return policy</p>
                        <p>• Items must be in original condition</p>
                        <p>• Exchange available for size/color</p>
                        <p>• Return shipping costs apply</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Recent Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showAddToCart={true}
                onAddToCart={(product) => {
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
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
