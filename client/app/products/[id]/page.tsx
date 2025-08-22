import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProduct, transformProduct } from '@/lib/api/products'
import Header from '@/components/header'
import { ProductDetailsClient } from '@/components/products/ProductDetailsClient'
import { ProductDetailsLoading } from '@/components/products/ProductDetailsLoading'

interface ProductDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  // Fetch product data from backend based on ID
  console.log('🔍 Fetching product with ID:', params.id)
  const product = await getProduct(params.id)

  // If product not found, show 404
  if (!product) {
    console.log('❌ Product not found:', params.id)
    notFound()
  }

  // Transform product for frontend
  const transformedProduct = transformProduct(product)
  console.log('✅ Product loaded:', transformedProduct.name)

  return (
    <>
      <Header />
      <Suspense fallback={<ProductDetailsLoading />}>
        <ProductDetailsClient product={transformedProduct} />
      </Suspense>
    </>
  )
}

// SEO metadata generation
export async function generateMetadata({ params }: ProductDetailsPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: 'Product Not Found - ARJO',
      description: 'The product you are looking for could not be found.'
    }
  }

  const price = `৳${product.price.toLocaleString()}`
  
  return {
    title: `${product.name} - ${price} - ARJO`,
    description: product.description.length > 160 
      ? `${product.description.substring(0, 157)}...` 
      : product.description,
    openGraph: {
      title: `${product.name} - ${price}`,
      description: product.description,
      images: [
        {
          url: product.images?.[0]?.url || '/placeholder.svg',
          width: 800,
          height: 600,
          alt: product.name,
        }
      ],
      type: 'website',
      siteName: 'ARJO'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${price}`,
      description: product.description,
      images: [product.images?.[0]?.url || '/placeholder.svg']
    }
  }
}