"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
}

interface SearchDropdownProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchDropdown({
  className = "",
  placeholder = "Search products...",
  onSearch,
}: SearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (query.length > 1) {
      setIsLoading(true);
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            }/api/products/search/autocomplete?q=${encodeURIComponent(query)}`
          );
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data.suggestions || []);
            // Always show dropdown if user has typed something and we got a response
            setIsOpen(true);
          } else {
            setSuggestions([]);
            setIsOpen(false);
          }
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
          setIsOpen(false);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(
          `/products?search=${encodeURIComponent(query.trim())}&page=1`
        );
      }
    }
  };

  const handleSuggestionClick = (productId: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/products/${productId}`);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSuggestionClick(product.id)}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md overflow-hidden mr-3">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <Search className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {product.category}
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      ${product.price}
                    </p>
                  </div>
                </div>
              ))}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    router.push(
                      `/products?search=${encodeURIComponent(query)}`
                    );
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  View all results for "{query}"
                </Button>
              </div>
            </>
          ) : query.length > 1 ? (
            <div className="p-4 text-center">
              <div className="text-gray-500 mb-2">
                No products found for "{query}"
              </div>
              <Button
                onClick={() => {
                  setIsOpen(false);
                  router.push(
                    `/products?search=${encodeURIComponent(query)}&page=1`
                  );
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Search all products for "{query}"
              </Button>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}
    </div>
  );
}
