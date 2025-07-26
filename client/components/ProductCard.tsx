// client/components/ProductCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: string;
  category?: string;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
  showAddToCart?: boolean;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({
  product,
  showCategory = false,
  showAddToCart = false,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Square Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {showAddToCart && onAddToCart && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <Button
                onClick={() => onAddToCart(product)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-sm mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-primary">{product.price}</p>
          {showCategory && product.category && (
            <Badge variant="secondary" className="mt-2 capitalize">
              {product.category}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
