// client/components/ProductCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  showAddToCart = true,
  onAddToCart,
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation(); // Stop event bubbling
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Square Image Container */}
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-square overflow-hidden rounded-t-lg cursor-pointer">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-sm mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-lg font-bold text-primary mb-3">{product.price}</p>
          
          {showCategory && product.category && (
            <Badge variant="secondary" className="mb-3 capitalize">
              {product.category}
            </Badge>
          )}

          {showAddToCart && (
            <Button
              onClick={handleAddToCart}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
