"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter } from "lucide-react";
import { useCartStore } from "@/lib/store";
import Header from "@/components/header";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const allProducts = [
    {
      id: 1,
      name: "Cotton Casual Shirt",
      price: "৳1,200",
      category: "casual",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 2,
      name: "Formal White Shirt",
      price: "৳1,500",
      category: "formal",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 3,
      name: "Denim Casual Shirt",
      price: "৳1,800",
      category: "casual",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 4,
      name: "Striped Casual Shirt",
      price: "৳1,400",
      category: "casual",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 5,
      name: "Black Kurta",
      price: "৳2,200",
      category: "traditional",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 6,
      name: "White Panjabi",
      price: "৳2,500",
      category: "traditional",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 7,
      name: "Navy Kurta",
      price: "৳2,000",
      category: "traditional",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 8,
      name: "Maroon Kurta",
      price: "৳2,300",
      category: "traditional",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 9,
      name: "Pink Casual Shirt",
      price: "৳1,600",
      category: "casual",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 10,
      name: "Light Green Shirt",
      price: "৳1,700",
      category: "formal",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 11,
      name: "Striped Formal",
      price: "৳1,900",
      category: "formal",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 12,
      name: "Beige Casual",
      price: "৳1,500",
      category: "casual",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 13,
      name: "Check Pattern",
      price: "৳1,800",
      category: "casual",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 14,
      name: "Cream Formal",
      price: "৳2,000",
      category: "formal",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 15,
      name: "Black Casual",
      price: "৳1,400",
      category: "casual",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
    {
      id: 16,
      name: "Yellow Casual",
      price: "৳1,300",
      category: "casual",
      image: "https://i.ibb.co.com/PzNwVgZm/Aluna-250103.jpg",
    },
  ];

  const categories = [
    { id: "bag", label: "Bag" },
    { id: "jewellry", label: "Jewellry" },
    { id: "glass", label: "Glass" },
    { id: "watch", label: "Watch" },
  ];

  useEffect(() => {
    let filtered = allProducts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Filter by price range
    filtered = filtered.filter((product) => {
      const price = Number.parseFloat(
        product.price.replace("৳", "").replace(",", "")
      );
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            Number.parseFloat(a.price.replace("৳", "").replace(",", "")) -
            Number.parseFloat(b.price.replace("৳", "").replace(",", ""))
          );
        case "price-high":
          return (
            Number.parseFloat(b.price.replace("৳", "").replace(",", "")) -
            Number.parseFloat(a.price.replace("৳", "").replace(",", ""))
          );
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategories, priceRange, sortBy]);

  const handleCategoryChange = (categoryId, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  const handleAddToCart = (product) => {
    addItem(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/5">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">
                  Categories
                </label>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category.id, checked)
                        }
                      />
                      <label htmlFor={category.id} className="text-sm">
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">
                  Price Range
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          Number.parseInt(e.target.value) || 0,
                          priceRange[1],
                        ])
                      }
                      className="w-20"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          Number.parseInt(e.target.value) || 5000,
                        ])
                      }
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:w-4/5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                Products ({filteredProducts.length})
              </h1>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <ProductCard
                    product={product}
                    showCategory={true}
                    showAddToCart={true}
                    onAddToCart={handleAddToCart}
                  />
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
