"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { toast } from "sonner";

interface ProductsClientProps {
  initialProducts: any[];
  initialCategories: any[];
  initialFilters: any;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function ProductsClient({
  initialProducts,
  initialCategories,
  initialFilters,
  pagination: initialPagination,
}: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();

  // State
  const [products, setProducts] = useState(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || "name");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters.category ? [initialFilters.category] : []
  );
  const [priceRange, setPriceRange] = useState([
    initialFilters.minPrice || 0,
    initialFilters.maxPrice || 5000,
  ]);

  // Categories mapping - use from props or fallback to hardcoded
  const categories =
    initialCategories && initialCategories.length > 0
      ? initialCategories.map((cat: any) => ({
          id: cat.id,
          label: cat.name || cat.label,
        }))
      : [
          { id: "casual", label: "Casual" },
          { id: "formal", label: "Formal" },
          { id: "traditional", label: "Traditional" },
          { id: "bag", label: "Bags" },
          { id: "jewellry", label: "Jewelry" },
          { id: "glass", label: "Glasses" },
          { id: "watch", label: "Watches" },
        ];

  // Fetch products from API (direct backend call)
  const fetchProducts = async (params: Record<string, string | undefined>) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "") {
          queryParams.append(key, value);
        }
      });

      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${API_BASE}/api/products?${queryParams.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products.map(transformProduct));
        setPagination(data.pagination);
      } else {
        console.error("API error:", response.status);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Transform backend product to frontend format (consistent with API utils)
  const transformProduct = (product: any) => {
    return {
      id: product._id,
      name: product.name,
      price: `৳${product.price.toLocaleString()}`, // Exact same formatting as API utils
      category: product.category,
      image: product.images?.[0]?.url || "/placeholder.svg",
      description: product.description,
      inStock: product.inStock,
    };
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const newParams = {
            search: query || undefined,
            category: selectedCategories[0] || undefined,
            minPrice: priceRange[0] > 0 ? priceRange[0].toString() : undefined,
            maxPrice:
              priceRange[1] < 5000 ? priceRange[1].toString() : undefined,
            sortBy: getSortField(),
            sortOrder: getSortOrder(),
            page: "1",
          };

          console.log("🔍 Search triggered:", { query, newParams });

          fetchProducts(newParams);
          updateURL(newParams);
        }, 600);
      };
    })(),
    [selectedCategories, priceRange, sortBy]
  );

  // Handle add to cart
  const handleAddToCart = (product: any) => {
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

    console.log("🎯 Adding to cart from ProductClient:", cartItem);
    addItem(cartItem, "default", "default", 1);

    toast.success(`🛒 ${product.name} added to cart!`, {
      description: "1 item added successfully",
      className: "border-green-200 bg-green-50",
    });
  };

  // Update URL with new filters
  const updateURL = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams();

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      }
    });

    const newUrl = params.toString()
      ? `/products?${params.toString()}`
      : "/products";
    router.push(newUrl, { scroll: false });
  };

  // Handle search input change - only update URL, let URL effect handle the fetch
  useEffect(() => {
    // Only update URL if search query is different from URL param
    const currentSearch = searchParams.get("search") || "";
    if (searchQuery !== currentSearch) {
      const timeoutId = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) {
          params.set("search", searchQuery);
        } else {
          params.delete("search");
        }
        params.set("page", "1"); // Reset to first page on search

        const newUrl = params.toString()
          ? `/products?${params.toString()}`
          : "/products";
        router.push(newUrl, { scroll: false });
      }, 500); // Debounce delay

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, searchParams, router]);

  // Listen for URL parameter changes and update state + refetch data
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    const sortBy = searchParams.get("sortBy");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Update local state to match URL params
    setSelectedCategories(category ? [category] : []);
    setSearchQuery(search || "");
    setSortBy(sortBy || "name");

    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? parseFloat(minPrice) : 0,
        maxPrice ? parseFloat(maxPrice) : 5000,
      ]);
    }

    // Fetch products with current URL parameters
    const fetchParams = {
      category: category || undefined,
      search: search || undefined,
      page: page || "1",
      limit: "6",
      sortBy: sortBy || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    };

    fetchProducts(fetchParams);
  }, [searchParams]); // Re-run when URL parameters change

  // Handle category change
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    let newCategories = [...selectedCategories];

    if (checked) {
      newCategories.push(categoryId);
    } else {
      newCategories = newCategories.filter((id) => id !== categoryId);
    }

    // Update URL parameters instead of directly calling API
    const params = new URLSearchParams(searchParams.toString());

    if (newCategories.length > 0) {
      params.set("category", newCategories[0]); // Backend expects single category
    } else {
      params.delete("category");
    }
    params.set("page", "1"); // Reset to first page

    const newUrl = params.toString()
      ? `/products?${params.toString()}`
      : "/products";
    router.push(newUrl, { scroll: false });
  };

  // Helper function to get sort field
  const getSortField = () => {
    if (sortBy === "name") return undefined;
    if (sortBy.includes("price")) return "price";
    return sortBy;
  };

  // Helper function to get sort order
  const getSortOrder = () => {
    if (sortBy.includes("high")) return "desc";
    if (sortBy.includes("low")) return "asc";
    return undefined;
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    // Update URL parameters instead of directly calling API
    const params = new URLSearchParams(searchParams.toString());

    if (newSortBy !== "name") {
      params.set("sortBy", "price");
      if (newSortBy.includes("high")) {
        params.set("sortOrder", "desc");
      } else if (newSortBy.includes("low")) {
        params.set("sortOrder", "asc");
      }
    } else {
      params.delete("sortBy");
      params.delete("sortOrder");
    }

    params.set("page", "1"); // Reset to first page

    const newUrl = params.toString()
      ? `/products?${params.toString()}`
      : "/products";
    router.push(newUrl, { scroll: false });
  };

  // Handle price range change
  const handlePriceRangeChange = () => {
    // Update URL parameters instead of directly calling API
    const params = new URLSearchParams(searchParams.toString());

    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString());
    } else {
      params.delete("minPrice");
    }

    if (priceRange[1] < 5000) {
      params.set("maxPrice", priceRange[1].toString());
    } else {
      params.delete("maxPrice");
    }

    params.set("page", "1"); // Reset to first page

    const newUrl = params.toString()
      ? `/products?${params.toString()}`
      : "/products";
    router.push(newUrl, { scroll: false });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    // Update URL parameters instead of directly calling API
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    const newUrl = `/products?${params.toString()}`;
    router.push(newUrl, { scroll: false });

    // Scroll to top of products section
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Handle page size change
  const handlePageSizeChange = (newLimit: number) => {
    const newParams = {
      search: searchQuery || undefined,
      category: selectedCategories[0] || undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0].toString() : undefined,
      maxPrice: priceRange[1] < 5000 ? priceRange[1].toString() : undefined,
      sortBy: getSortField(),
      sortOrder: getSortOrder(),
      page: "1", // Reset to first page when changing page size
      limit: newLimit.toString(),
    };

    console.log("📊 Page size changed:", { newLimit, newParams });

    fetchProducts(newParams);
    updateURL(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                          handleCategoryChange(category.id, checked as boolean)
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
                          parseInt(e.target.value) || 0,
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
                          parseInt(e.target.value) || 5000,
                        ])
                      }
                      className="w-20"
                    />
                  </div>
                  <Button
                    onClick={handlePriceRangeChange}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Apply Price Filter
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:w-4/5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                Products ({pagination.total})
              </h1>
              <Select value={sortBy} onValueChange={handleSortChange}>
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

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading products...</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      showCategory={true}
                      showAddToCart={true}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛍️</div>
                    <h3 className="text-xl font-semibold mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button
                      onClick={() => router.push("/products")}
                      variant="outline"
                    >
                      View All Products
                    </Button>
                  </div>
                )}

                {/* Pagination - Always show */}
                <div className="flex flex-col items-center space-y-4 mt-12 pb-8 border-t pt-8">
                  {/* Pagination Info */}
                  <div className="text-sm text-gray-600">
                    {pagination.total > 0 ? (
                      <>
                        Showing {(pagination.page - 1) * pagination.limit + 1}{" "}
                        to{" "}
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}{" "}
                        of {pagination.total} products
                      </>
                    ) : (
                      "No products found"
                    )}
                  </div>

                  {/* Pagination Controls - Always show */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <Button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1 || loading}
                      variant="outline"
                      size="sm"
                      className="px-3 py-2"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    {/* Page Numbers - Show at least current page */}
                    <div className="flex items-center space-x-1">
                      {pagination.pages === 0 ? (
                        // Show page 1 even when no data
                        <Button
                          disabled
                          variant="default"
                          size="sm"
                          className="w-10 h-10"
                        >
                          1
                        </Button>
                      ) : (
                        <>
                          {/* First page */}
                          {pagination.page > 3 && pagination.pages > 5 && (
                            <>
                              <Button
                                onClick={() => handlePageChange(1)}
                                disabled={loading}
                                variant={
                                  1 === pagination.page ? "default" : "outline"
                                }
                                size="sm"
                                className="w-10 h-10"
                              >
                                1
                              </Button>
                              {pagination.page > 4 && (
                                <span className="px-2 text-gray-500">...</span>
                              )}
                            </>
                          )}

                          {/* Pages around current page */}
                          {Array.from(
                            {
                              length: Math.min(
                                5,
                                Math.max(1, pagination.pages)
                              ),
                            },
                            (_, index) => {
                              let pageNum;

                              if (pagination.pages <= 5) {
                                pageNum = index + 1;
                              } else if (pagination.page <= 3) {
                                pageNum = index + 1;
                              } else if (
                                pagination.page >=
                                pagination.pages - 2
                              ) {
                                pageNum = pagination.pages - 4 + index;
                              } else {
                                pageNum = pagination.page - 2 + index;
                              }

                              if (pageNum < 1 || pageNum > pagination.pages)
                                return null;

                              return (
                                <Button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  disabled={loading}
                                  variant={
                                    pageNum === pagination.page
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="w-10 h-10"
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}

                          {/* Last page */}
                          {pagination.page < pagination.pages - 2 &&
                            pagination.pages > 5 && (
                              <>
                                {pagination.page < pagination.pages - 3 && (
                                  <span className="px-2 text-gray-500">
                                    ...
                                  </span>
                                )}
                                <Button
                                  onClick={() =>
                                    handlePageChange(pagination.pages)
                                  }
                                  disabled={loading}
                                  variant={
                                    pagination.pages === pagination.page
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="w-10 h-10"
                                >
                                  {pagination.pages}
                                </Button>
                              </>
                            )}
                        </>
                      )}
                    </div>

                    {/* Next Button */}
                    <Button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={
                        pagination.page >= Math.max(1, pagination.pages) ||
                        loading
                      }
                      variant="outline"
                      size="sm"
                      className="px-3 py-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Select
                      value={pagination.limit.toString()}
                      onValueChange={(value) =>
                        handlePageSizeChange(parseInt(value))
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="18">18</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Current Page Indicator */}
                  <div className="text-xs text-gray-500">
                    {pagination.page > pagination.pages &&
                      pagination.pages > 0 && (
                        <span className="text-orange-600 ml-2">
                          (No data on this page)
                        </span>
                      )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
