'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Ruler,
} from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { ProductCard } from '@/components/ProductCard'

interface ProductDetailsClientProps {
  product: any
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter()
  const { addItem } = useCartStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true)
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false)
  const [isReturnsOpen, setIsReturnsOpen] = useState(false)

  // Add color validation for both buttons
  const handleAddToCart = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Please select a color')
      return
    }

    const cartItem = {
      ...product,
      selectedColor: selectedColor || 'default',
      quantity,
    }

    for (let i = 0; i < quantity; i++) {
      addItem(cartItem)
    }

    alert('Added to cart!')
  }

  // Handle Order Now - goes directly to checkout
  const handleOrderNow = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Please select a color')
      return
    }

    const cartItem = {
      ...product,
      selectedColor: selectedColor || 'default',
      quantity,
    }

    for (let i = 0; i < quantity; i++) {
      addItem(cartItem)
    }

    // Redirect to checkout page
    router.push('/checkout')
  }

  // Mock related products (you can replace this with real related products from backend)
  const recentProducts = [
    {
      id: 21,
      name: 'Yellow Casual Shirt',
      price: '৳1,400',
      image: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg',
    },
    {
      id: 22,
      name: 'Light Blue Shirt',
      price: '৳1,600',
      image: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg',
    },
    {
      id: 23,
      name: 'Red Check Shirt',
      price: '৳1,700',
      image: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg',
    },
    {
      id: 24,
      name: 'Beige Casual',
      price: '৳1,500',
      image: 'https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-[550px] overflow-hidden rounded-lg border">
              <Image
                src={product.images?.[selectedImage] || product.image || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnails - only show if more than 1 image */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      console.log('Clicked image:', index, 'Current:', selectedImage)
                      setSelectedImage(index)
                    }}
                    className={`relative aspect-square overflow-hidden rounded border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary border-4'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image || '/placeholder.svg'}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                    {product.discount && (
                      <Badge variant="destructive">Save {product.discount}</Badge>
                    )}
                  </>
                )}
              </div>
              <p className="text-gray-600 mb-4">Material: {product.material || 'Premium Quality'}</p>

              <div className="flex items-center space-x-2">
                <Badge variant={product.inStock ? 'default' : 'secondary'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>

            {/* Dimensions Display */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Dimensions
              </h3>
              <div className="py-3 px-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-lg font-medium text-gray-800">
                  {product.dimensions || '22cm x 20cm x 12cm'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Length × Width × Height
                </p>
              </div>
            </div>

            {/* Color Selection - Only show if colors exist */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">
                  Color <span className="text-red-500">*</span>
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color: any) => {
                    const colorName = typeof color === 'string' ? color : color.name || color
                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`py-2 px-4 border rounded transition-all ${
                          selectedColor === colorName
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {colorName}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

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
                      <h2 className="text-lg font-semibold text-primary">
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
                          <span className="text-gray-600 capitalize">{product.category}</span>
                        </div>
                        {product.seller && (
                          <div className="flex justify-between">
                            <span className="font-medium">Seller:</span>
                            <span className="text-gray-600">
                              {product.seller.firstName} {product.seller.lastName}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="font-medium">Availability:</span>
                          <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
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
                      <h2 className="text-lg font-semibold text-primary">
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
          <h2 className="text-2xl font-bold text-center mb-8">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}