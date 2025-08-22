'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useCartStore } from '@/lib/store'
import { ProductCard } from '@/components/ProductCard'
import { Minus, Plus, Ruler, ShoppingCart, Heart, ChevronDown, ChevronUp } from 'lucide-react'

interface ProductDetailsClientProps {
  product: any
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter()
  const { addItem } = useCartStore()
  
  // State management
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true)
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false)
  const [isReturnsOpen, setIsReturnsOpen] = useState(false)

  // Create gallery with exactly 4 images
  const createGallery = () => {
    const images = []
    
    if (product.images && product.images.length > 0) {
      // Use available product images
      images.push(...product.images)
    } else if (product.image) {
      // If no images array, use main image
      images.push(product.image)
    }
    
    // If we have fewer than 4 images, repeat the first image to fill slots
    while (images.length < 4) {
      images.push(images[0] || '/placeholder.svg')
    }
    
    // Take only first 4 images
    return images.slice(0, 4)
  }

  const galleryImages = createGallery()

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    console.log('🖱️ Thumbnail clicked:', index)
    setSelectedImage(index)
  }

  // Validation helper
  const validateSelections = () => {
    const errors = []
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      errors.push('Please select a color')
    }
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      errors.push('Please select a size')
    }
    
    return errors
  }

  // Handle Add to Cart - FIXED
  const handleAddToCart = () => {
    const errors = validateSelections()
    
    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    try {
      // Create cart item with proper structure
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        selectedColor: selectedColor || 'default',
        selectedSize: selectedSize || 'default',
        quantity: quantity,
        itemKey: `${product.id}-${selectedColor || 'default'}-${selectedSize || 'default'}`
      }

      // Use the correct addItem signature from your store
      addItem(cartItem, selectedColor || 'default', selectedSize || 'default', quantity)
      
      alert(`✅ Added ${quantity} item(s) to cart!`)
      console.log('🛒 Added to cart:', cartItem)
    } catch (error) {
      console.error('❌ Error adding to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    }
  }

  // Handle Order Now - FIXED
  const handleOrderNow = () => {
    const errors = validateSelections()
    
    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    try {
      // Create cart item
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        selectedColor: selectedColor || 'default',
        selectedSize: selectedSize || 'default',
        quantity: quantity,
        itemKey: `${product.id}-${selectedColor || 'default'}-${selectedSize || 'default'}`
      }

      // Add to cart first
      addItem(cartItem, selectedColor || 'default', selectedSize || 'default', quantity)
      
      console.log('🚀 Order Now - Added to cart and redirecting:', cartItem)
      
      // Redirect to checkout
      router.push('/checkout')
    } catch (error) {
      console.error('❌ Error in Order Now:', error)
      alert('Failed to process order. Please try again.')
    }
  }

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
            {/* Main Image */}
            <div className="relative h-[550px] overflow-hidden rounded-lg border">
              <Image
                src={galleryImages[selectedImage] || '/placeholder.svg'}
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
                      ? 'border-blue-500 border-4 shadow-lg'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={image || '/placeholder.svg'}
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
                Material: {product.material || 'Premium Quality'}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant={product.inStock ? 'default' : 'secondary'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
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
                  {product.dimensions || '22cm x 20cm x 12cm'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Length × Width × Height
                </p>
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">
                  Color <span className="text-red-500">*</span>
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color: any, index: number) => {
                    const colorName = typeof color === 'string' ? color : color.name
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(colorName)}
                        className={`px-4 py-2 border rounded-md transition-colors ${
                          selectedColor === colorName
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
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

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">
                  Size <span className="text-red-500">*</span>
                </h3>
                <div className="flex space-x-3">
                  {product.sizes.map((sizeObj: any, index: number) => {
                    const sizeValue = typeof sizeObj === 'string' ? sizeObj : sizeObj.size
                    const stock = typeof sizeObj === 'object' ? sizeObj.stock : null
                    const isOutOfStock = stock !== null && stock <= 0
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(sizeValue)}
                        disabled={isOutOfStock}
                        className={`px-4 py-2 border rounded-md transition-colors ${
                          selectedSize === sizeValue
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : isOutOfStock
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {sizeValue}
                        {stock !== null && (
                          <span className="text-xs block">
                            {stock > 0 ? `(${stock})` : 'Out'}
                          </span>
                        )}
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
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium px-4">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleOrderNow}
                  size="lg"
                  className="flex-1"
                  disabled={!product.inStock}
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