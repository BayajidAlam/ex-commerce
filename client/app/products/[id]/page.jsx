"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react"
import { useCartStore } from "@/lib/store"
import Header from "@/components/header"
import { useParams } from "next/navigation"

export default function ProductDetailPage() {
  const params = useParams()
  const { addItem } = useCartStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true)
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false)
  const [isReturnsOpen, setIsReturnsOpen] = useState(false)

  // Mock product data - in real app, fetch based on params.id
  const product = {
    id: Number.parseInt(params.id) || 1,
    name: "White Premium Panjabi",
    price: "৳2,500",
    originalPrice: "৳3,000",
    category: "traditional",
    material: "Remi Rayon",
    images: [
      "/placeholder.svg?height=600&width=500&text=White+Panjabi+Front",
      "/placeholder.svg?height=600&width=500&text=White+Panjabi+Back",
      "/placeholder.svg?height=600&width=500&text=White+Panjabi+Side",
      "/placeholder.svg?height=600&width=500&text=White+Panjabi+Detail",
    ],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Cream", value: "#F5F5DC" },
      { name: "Light Blue", value: "#ADD8E6" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    description: `Experience timeless elegance with Arjo's White Premium Panjabi, crafted from premium Remi Rayon for ultimate comfort. This panjabi offers a breathable, soft feel, ensuring effortless wear throughout the day. Designed with a tailored fit, it seamlessly blends tradition with modern sophistication, making it perfect for any occasion, be it casual gatherings or festive celebrations. If you're looking for high-quality panjabi for men in BD, this refined piece is a must-have in your collection. Elevate your style with Arjo today!`,
  }

  const sizeChart = [
    { size: "S", chest: "42", length: "40", sleeve: "23.5", collar: "16" },
    { size: "M", chest: "44", length: "42", sleeve: "24", collar: "16" },
    { size: "L", chest: "46", length: "44", sleeve: "24.5", collar: "17" },
    { size: "XL", chest: "48", length: "46", sleeve: "25", collar: "17" },
    { size: "XXL", chest: "50", length: "48", sleeve: "25.5", collar: "18" },
  ]

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    const cartItem = {
      ...product,
      selectedSize,
      selectedColor: selectedColor || product.colors[0].name,
      quantity,
    }

    for (let i = 0; i < quantity; i++) {
      addItem(cartItem)
    }

    alert("Added to cart!")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border">
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
                    selectedImage === index ? "border-primary" : "border-gray-200"
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
                <span className="text-3xl font-bold text-primary">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">{product.originalPrice}</span>
                )}
                <Badge variant="destructive">Save ৳500</Badge>
              </div>
              <p className="text-gray-600 mb-4">Material: {product.material}</p>
              <div className="flex items-center space-x-2">
                <Badge variant={product.inStock ? "default" : "secondary"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color.name ? "border-primary border-4" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              {selectedColor && <p className="text-sm text-gray-600 mt-2">Selected: {selectedColor}</p>}
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-4 border rounded ${
                      selectedSize === size
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleAddToCart} className="w-full" size="lg" disabled={!product.inStock}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Information Sections */}
            <div className="mt-8">
              <Card>
                <CardContent className="p-0">
                  {/* Description */}
                  <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <h2 className="text-lg font-semibold text-primary">Description</h2>
                      {isDescriptionOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm">{product.description}</p>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h3 className="font-semibold mb-3 text-sm">Panjabi Size Chart</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-1 px-2 font-semibold">Size</th>
                                  <th className="text-left py-1 px-2 font-semibold">Chest</th>
                                  <th className="text-left py-1 px-2 font-semibold">Length</th>
                                  <th className="text-left py-1 px-2 font-semibold">Sleeve</th>
                                  <th className="text-left py-1 px-2 font-semibold">Collar</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sizeChart.map((row) => (
                                  <tr key={row.size} className="border-b">
                                    <td className="py-1 px-2 font-medium">{row.size}</td>
                                    <td className="py-1 px-2">{row.chest}</td>
                                    <td className="py-1 px-2">{row.length}</td>
                                    <td className="py-1 px-2">{row.sleeve}</td>
                                    <td className="py-1 px-2">{row.collar}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* More Information */}
                  <Collapsible open={isMoreInfoOpen} onOpenChange={setIsMoreInfoOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <h2 className="text-lg font-semibold">More Information</h2>
                      {isMoreInfoOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-3">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Care Instructions</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Machine wash cold</li>
                            <li>• Do not bleach</li>
                            <li>• Tumble dry low</li>
                            <li>• Iron on low heat</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Product Details</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Material: {product.material}</li>
                            <li>• Origin: Bangladesh</li>
                            <li>• Fit: Regular</li>
                            <li>• Occasion: Casual/Festive</li>
                          </ul>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Returns & Exchange */}
                  <Collapsible open={isReturnsOpen} onOpenChange={setIsReturnsOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50">
                      <h2 className="text-lg font-semibold">Returns & Exchange Information</h2>
                      {isReturnsOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-3">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Return Policy</h4>
                          <p className="text-xs text-gray-600 mb-3">
                            We offer a 7-day return policy for all items. Items must be in original condition with tags
                            attached.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Exchange Policy</h4>
                          <p className="text-xs text-gray-600 mb-3">
                            Size exchanges are available within 7 days of purchase. Color exchanges subject to
                            availability.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">How to Return</h4>
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
      </div>
    </div>
  )
}
