// 'use client'
// import { useState, useEffect } from 'react';
// import { productApi } from '@/services/api/product';
// // import { useAuth } from '@/context/AuthContext';

// export const useProducts = (initialPage = 0, limit = 10, token) => {
//   const [products, setProducts] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(initialPage);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const MAX_PAGES = 4; // Giới hạn số trang tải về

//   useEffect(() => {
//     setProducts([]);
//     setPage(initialPage);
//     setHasMore(true);
//     setLoading(false);
//   }, [initialPage]);

//   useEffect(() => {
//     console.log("Current products:", products);
//   }, [products]);

//   const loadMoreProducts = async () => {
//     if (loading || page > MAX_PAGES){
//       console.log("LOADING!!")
      
//       return;
//     };
    
//     if (!token){
//       return;
//     }

    

//     try {
//       setLoading(true);
//       const newProducts = await productApi.getProducts(page, limit, token);

//       console.log("NEW PRODUCTS", newProducts)

//       if (page  >= newProducts.totalPages || page >= MAX_PAGES) {
//         setHasMore(false);
//       } else {
//         setProducts(prev => [...prev, ...newProducts?.content || []]);
//         setPage(prev => prev + 1);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//     console.log("PRODUCTS", products) 
//   };


//   return {
//     products,
//     hasMore,
//     loading,
//     error,
//     loadMoreProducts
//   };
// }; 

import { useState, useEffect, useCallback } from 'react';
import { productApi } from '@/services/api/product';

export const useProducts = (initialPage = 0, limit = 100, token) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadProducts = useCallback(async () => {
    if (loading || !token || hasLoaded) {
      console.log('Cannot load products: loading, no token, or already loaded');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.getProducts(currentPage, limit, token);
      const mappedProducts = (data.content || []).map((item) => ({
        id: item.productId,
        name: item.productName,
        price: item.price,
        image: item.coverImage || '/images/product-placeholder.jpg',
        rating: item.ratingAvg,
        isNew: item.new,
        salesCount: item.soldCount,
      }));
      setProducts(mappedProducts);
      setTotalProducts(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
      setHasLoaded(true);
    } catch (err) {
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      console.error('Load Products Error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, token, loading, hasLoaded]);

  useEffect(() => {
    if (token && !hasLoaded) {
      loadProducts();
    }
  }, [token, loadProducts]);

  return {
    products,
    loading,
    error,
    totalProducts,
    totalPages,
    currentPage,
    setCurrentPage,
    loadProducts,
  };
};