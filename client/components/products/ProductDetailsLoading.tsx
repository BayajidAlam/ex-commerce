import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProductDetailsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Skeleton */}
          <div className="space-y-4">
            {/* Main Image Skeleton */}
            <Skeleton className="aspect-square w-full rounded-lg" />

            {/* Thumbnails Skeleton */}
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-md" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-6 w-16 mt-2" />
            </div>

            {/* Colors */}
            <div>
              <Skeleton className="h-5 w-16 mb-3" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-16 rounded-md" />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <Skeleton className="h-5 w-12 mb-3" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-12 rounded-md" />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <Skeleton className="h-5 w-20 mb-3" />
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-6 w-8" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            </div>

            {/* Product Information Sections */}
            <div className="mt-8">
              <Card>
                <CardContent className="p-0">
                  {/* Description Section */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>

                  {/* More Info Section */}
                  <div className="p-4 border-t">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Returns Section */}
                  <div className="p-4 border-t">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-36" />
                      <Skeleton className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}