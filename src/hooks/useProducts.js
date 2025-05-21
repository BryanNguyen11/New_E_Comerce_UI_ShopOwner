'use client'
import { useState, useEffect } from 'react';
import { productApi } from '@/services/api/product';
// import { useAuth } from '@/context/AuthContext';

export const useProducts = (initialPage = 0, limit = 10, token) => {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const MAX_PAGES = 4; // Giới hạn số trang tải về

  useEffect(() => {
    setProducts([]);
    setPage(initialPage);
    setHasMore(true);
    setLoading(false);
  }, [initialPage]);

  useEffect(() => {
    console.log("Current products:", products);
  }, [products]);

  const loadMoreProducts = async () => {
    if (loading || page > MAX_PAGES){
      console.log("LOADING!!")
      
      return;
    };
    
    if (!token){
      return;
    }

    

    try {
      setLoading(true);
      const newProducts = await productApi.getProducts(page, limit, token);

      console.log("NEW PRODUCTS", newProducts)

      if (page  >= newProducts.totalPages || page >= MAX_PAGES) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts?.content || []]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    console.log("PRODUCTS", products) 
  };


  return {
    products,
    hasMore,
    loading,
    error,
    loadMoreProducts
  };
}; 