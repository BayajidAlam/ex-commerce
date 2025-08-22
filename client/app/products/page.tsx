import { Suspense } from 'react'
import { getProducts, getCategories, transformProduct, type ProductFilters } from '@/lib/api/products'
import Header from '@/components/header'
import { ProductsLoading } from '@/components/products/ProductsLoading'
import { ProductsClient } from '@/components/products/ProductClient'

interface ProductsPageProps {
  searchParams: {
    search?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    sortOrder?: string
    page?: string
    limit?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Build filters from search params
  const filters: ProductFilters = {
    search: searchParams.search,
    category: searchParams.category,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    sortBy: searchParams.sortBy as any,
    sortOrder: searchParams.sortOrder as any,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : 6
  }

  // Fetch data on server-side
  const [productsData, categories] = await Promise.all([
    getProducts(filters),
    getCategories()
  ])

  // Transform products for frontend
  const transformedProducts = productsData.products.map(transformProduct)

  // Generate metadata for SEO
  const title = searchParams.search 
    ? `Search: ${searchParams.search} - ARJO`
    : searchParams.category 
    ? `${searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)} Products - ARJO`
    : 'All Products - ARJO'

  const description = searchParams.search
    ? `Search results for "${searchParams.search}" - Find quality products at ARJO`
    : `Browse our collection of ${searchParams.category || 'all'} products. Quality fashion and accessories at great prices.`

  return (
    <>
      <Header />
      <Suspense fallback={<ProductsLoading />}>
        <ProductsClient 
          initialProducts={transformedProducts}
          initialCategories={categories}
          initialFilters={filters}
          pagination={productsData.pagination}
        />
      </Suspense>
    </>
  )
}

// SEO metadata generation
export async function generateMetadata({ searchParams }: ProductsPageProps) {
  const title = searchParams.search 
    ? `Search: ${searchParams.search} - ARJO`
    : searchParams.category 
    ? `${searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)} Products - ARJO`
    : 'All Products - ARJO'

  const description = searchParams.search
    ? `Search results for "${searchParams.search}" - Find quality products at ARJO`
    : `Browse our collection of ${searchParams.category || 'all'} products. Quality fashion and accessories at great prices.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website'
    }
  }
}