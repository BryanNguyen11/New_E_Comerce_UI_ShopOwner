"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/search/SearchBar";
import SortOptions from "@/components/search/SortOptions";
import ProductList from "@/components/search/ProductList";
import FilterPanel from "@/components/search/FilterPanel";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const { authState } = useAuth();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    condition: null, // Using null to match the Boolean isNew parameter
    rating: 0
  });
  const [currentPage, setCurrentPage] = useState(0); // 0-based for Java API compatibility
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  // Build URL with all required parameters
  const buildSearchUrl = (pageNum, query, sort) => {
    const baseUrl = `/api/products/search`;
    const params = new URLSearchParams();
    
    // Required parameters
    params.append('productName', query);
    params.append('page', pageNum);
    params.append('size', 10);
    
    // Optional parameters
    if (filters.priceRange.min) {
      params.append('minPrice', filters.priceRange.min);
    }
    
    if (filters.priceRange.max) {
      params.append('maxPrice', filters.priceRange.max);
    }
    
    if (filters.condition !== null) {
      params.append('isNew', filters.condition);
    }
    
    if (filters.rating > 0) {
      params.append('minRating', filters.rating);
    }
    
    if (sort) {
      params.append('sortKey', sort);
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  // Search products function
  const searchProducts = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const url = buildSearchUrl(currentPage, searchQuery, sortOption);
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      
      const newProducts = data.content || [];
      setTotalProducts(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setProducts(newProducts);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(0); // Reset to first page on new search
  };
  
  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
    setCurrentPage(0); // Reset to first page on sort change
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Removed the automatic scrolling behavior
  };
  
  // Effect to trigger search when query, sort option, filters, or page changes
  useEffect(() => {
    if (searchQuery && authState.token) {
      searchProducts();
    }
  }, [searchQuery, sortOption, filters, currentPage, authState.token]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Kết quả tìm kiếm cho: {searchQuery}</h1>
      
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with filters */}
        <div className="col-span-1">
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        {/* Main content */}
        <div id="search-results-top" className="col-span-1 md:col-span-3">
          <div className="mb-4">
            <SortOptions value={sortOption} onChange={handleSortChange} />
          </div>
          
          {totalProducts > 0 && (
            <div className="mb-4 text-gray-600">
              Tìm thấy {totalProducts} sản phẩm phù hợp
            </div>
          )}
          
          <ProductList 
            products={products} 
            loading={loading} 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}