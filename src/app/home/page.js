// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useProducts } from "@/hooks/useProducts";
// import { ProductCard } from "@/components/product/ProductCard";
// import InfiniteScroll from "react-infinite-scroll-component";
// import {
//   FaCcVisa,
//   FaCcMastercard,
//   FaCcJcb,
//   FaCcPaypal,
//   FaGooglePay,
//   FaApplePay,
// } from "react-icons/fa";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// export default function HomePage() {
//   const { user, authState } = useAuth();
//   const { products, hasMore, loadMoreProducts, loading } = useProducts(
//     0,
//     10,
//     authState.token
//   );

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <Header />

//       {/* Banner Section */}
//       <div className="container mx-auto px-4 py-4">
//         <div className="grid grid-cols-12 gap-4">
//           <div className="col-span-8">
//             <img
//               src="/images/banner/main-banner.jpg"
//               alt="Main Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//           </div>
//           <div className="col-span-4 space-y-4">
//             <img
//               src="/images/banner/main-banner.jpg"
//               alt="Food Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//             <img
//               src="/images/banner/main-banner.jpg"
//               alt="YouTube Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Product List */}
//       <div className="container mx-auto px-4 py-4">
//         <div className="bg-white rounded-sm p-4 shadow-md">
//           <InfiniteScroll
//             dataLength={products.length}
//             next={loadMoreProducts}
//             hasMore={hasMore}
//             loader={
//               <div className="text-center py-4">
//                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
//                 <p className="text-black mt-2">Đang tải thêm sản phẩm...</p>
//               </div>
//             }
//             endMessage={
//               <p className="text-center text-gray-500 py-4">
//                 Đã hiển thị tất cả sản phẩm
//               </p>
//             }
//           >
//             <div className="grid grid-cols-6 gap-4">
//               {products.map((product) => (
//                 <ProductCard key={product.productId} product={product} />
//               ))}
//             </div>
//           </InfiniteScroll>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { ProductCard } from "@/components/product/ProductCard";
// import InfiniteScroll from "react-infinite-scroll-component";
// import {
//   FaCcVisa,
//   FaCcMastercard,
//   FaCcJcb,
//   FaCcPaypal,
//   FaGooglePay,
//   FaApplePay,
// } from "react-icons/fa";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// export default function HomePage() {
//   const { authState } = useAuth();
//   const [products, setProducts] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [totalElements, setTotalElements] = useState(0);
//   const [error, setError] = useState(null);
//   const pageSize = 20; // 20 sản phẩm mỗi trang
//   const maxProducts = 100; // Giới hạn 100 sản phẩm

//   // Hàm lấy danh sách sản phẩm
//   const loadProducts = async (pageNum) => {
//     console.log("loadProducts called, page:", pageNum, "authState:", authState);
//     if (!authState.token || products.length >= maxProducts) {
//       console.log("Stopping load:", {
//         hasToken: !!authState.token,
//         productsLength: products.length,
//         totalElements,
//         maxProducts,
//       });
//       setHasMore(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?productName=&page=${pageNum}&size=${pageSize}`;
//       console.log("Fetching URL:", url);

//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${authState.token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("API response:", data);

//       const newProducts = data.content || [];
//       setProducts((prev) => {
//         const updated = [...prev, ...newProducts];
//         console.log("Updated products:", updated);
//         return updated.slice(0, maxProducts);
//       });
//       setTotalElements(data.totalElements || 0);
//       setHasMore(
//         newProducts.length === pageSize &&
//         products.length + newProducts.length < maxProducts &&
//         products.length + newProducts.length < data.totalElements
//       );
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setError(error.message);
//       setHasMore(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Gọi API khi page hoặc authState thay đổi
//   useEffect(() => {
//     console.log("useEffect triggered, page:", page, "authState:", authState);
//     if (authState.isAuthenticated && !authState.isLoading && authState.token) {
//       loadProducts(page);
//     } else {
//       console.log("Cannot load products: authState not ready", authState);
//     }
//   }, [page, authState]);

//   // Hàm tải thêm sản phẩm
//   const loadMoreProducts = () => {
//     if (!loading && hasMore) {
//       console.log("Loading more products, page:", page + 1);
//       setPage((prev) => prev + 1);
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen" suppressHydrationWarning>
//       <Header />

//       {/* Banner Section */}
//       <div className="container mx-auto px-4 py-4" suppressHydrationWarning>
//         <div className="grid grid-cols-12 gap-4" suppressHydrationWarning>
//           <div className="col-span-8" suppressHydrationWarning>
//             <img
//               src="/images/banner/main-banner.jpg"
//               alt="Main Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//           </div>
//           <div className="col-span-4 space-y-4" suppressHydrationWarning>
//             <img
//               src="/images/banner/main-banner.jpg"
//               alt="Food Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//             <img
//               src="/images/banner/main-banner.jpg"
//               alt="YouTube Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Product List */}
//       <div className="container mx-auto px-4 py-4" suppressHydrationWarning>
//         <h2 className="text-2xl font-bold mb-4">Danh Sách Sản Phẩm</h2>
//         <div className="bg-white rounded-sm p-4 shadow-md" suppressHydrationWarning>
//           {loading && products.length === 0 ? (
//             <div className="text-center py-4">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
//               <p className="text-black mt-2">Đang tải...</p>
//             </div>
//           ) : error ? (
//             <p className="text-red-500 text-center py-4">
//               Lỗi khi tải sản phẩm: {error}
//             </p>
//           ) : products.length === 0 && !hasMore ? (
//             <p className="text-gray-500 text-center py-4">
//               Không có sản phẩm nào để hiển thị.
//             </p>
//           ) : (
//             <InfiniteScroll
//               dataLength={products.length}
//               next={loadMoreProducts}
//               hasMore={hasMore}
//               loader={
//                 <div className="text-center py-4">
//                   <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
//                   <p className="text-black mt-2">Đang tải thêm sản phẩm...</p>
//                 </div>
//               }
//               endMessage={
//                 <p className="text-center text-gray-500 py-4">
//                   {products.length >= totalElements
//                     ? "Đã hiển thị tất cả sản phẩm"
//                     : "Đã hiển thị 100 sản phẩm đầu tiên"}
//                 </p>
//               }
//             >
//               <div className="grid grid-cols-6 gap-4" suppressHydrationWarning>
//                 {products.map((product) => (
//                   <ProductCard key={product.productId} product={product} />
//                 ))}
//               </div>
//             </InfiniteScroll>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useProducts } from '@/hooks/useProducts';
// import { useAuth } from '@/context/AuthContext';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import Link from 'next/link';

// export default function HomePage() {
//   const { authState } = useAuth();
//   const { products, loading, error, totalProducts, loadProducts } = useProducts(0, 100, authState.token);
//   const [hasLoaded, setHasLoaded] = useState(false);

//   useEffect(() => {
//     if (authState.isAuthenticated && authState.token && !authState.isLoading && !hasLoaded) {
//       console.log('Calling loadProducts, token:', authState.token);
//       loadProducts();
//       setHasLoaded(true);
//     }
//   }, [authState.isAuthenticated, authState.token, authState.isLoading, hasLoaded, loadProducts]);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header />
      
//       <main className="container mx-auto px-4 py-8 flex-grow">
//         <h1 className="text-2xl font-bold text-gray-700 mb-6">Sản phẩm nổi bật</h1>

//         {loading && <p className="text-center text-gray-500">Đang tải...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}

//         {!loading && !error && products.length === 0 && (
//           <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
//         )}

//         {!loading && !error && products.length > 0 && (
//           <>
//             <div className="mb-4 text-gray-600">
//               Tìm thấy {totalProducts} sản phẩm
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <div
//                   key={product.id}
//                   className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
//                 >
//                   <Link href={`/product/${product.id}`}>
//                     <img
//                       src={product.image || '/images/product-placeholder.jpg'}
//                       alt={product.name}
//                       className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer"
//                     />
//                   </Link>
//                   <h3 className="text-sm font-medium text-gray-700 truncate">
//                     <Link href={`/product/${product.id}`}>{product.name}</Link>
//                   </h3>
//                   <p className="text-red-500 font-bold mt-2">
//                     {(product.price || 0).toLocaleString('vi-VN')} ₫
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </main>
//       <Footer/>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useProducts } from '@/hooks/useProducts';
// import { useAuth } from '@/context/AuthContext';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import Link from 'next/link';

// export default function HomePage() {
//   const { authState } = useAuth();
//   const { products, loading, error, totalProducts, loadProducts } = useProducts(0, 100, authState.token);
//   const [hasLoaded, setHasLoaded] = useState(false);

//   useEffect(() => {
//     if (authState.isAuthenticated && authState.token && !authState.isLoading && !hasLoaded) {
//       console.log('Calling loadProducts, token:', authState.token);
//       loadProducts();
//       setHasLoaded(true);
//     }
//   }, [authState.isAuthenticated, authState.token, authState.isLoading, hasLoaded, loadProducts]);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header />

//       {/* Banner Section */}
//       <div className="container mx-auto px-4 py-4" suppressHydrationWarning>
//         <div className="grid grid-cols-12 gap-4" suppressHydrationWarning>
//           <div className="col-span-8" suppressHydrationWarning>
//             <img
//               src="/images/banner/main-banner.jpg"
//               alt="Main Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//           </div>
//           <div className="col-span-4 space-y-4" suppressHydrationWarning>
//             <img
//               src="/images/banner/food-banner.jpg"
//               alt="Food Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//             <img
//               src="/images/banner/youtube-banner.jpg"
//               alt="YouTube Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//           </div>
//         </div>
//       </div>

//       <main className="container mx-auto px-4 py-8 flex-grow">
//         <h1 className="text-2xl font-bold text-gray-700 mb-6">Sản phẩm nổi bật</h1>

//         {loading && <p className="text-center text-gray-500">Đang tải...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}

//         {!loading && !error && products.length === 0 && (
//           <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
//         )}

//         {!loading && !error && products.length > 0 && (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <div
//                   key={product.id}
//                   className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
//                 >
//                   <Link href={`/product/${product.id}`}>
//                     <img
//                       src={product.image || '/images/product-placeholder.jpg'}
//                       alt={product.name}
//                       className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer"
//                     />
//                   </Link>
//                   <h3 className="text-sm font-medium text-gray-700 truncate">
//                     <Link href={`/product/${product.id}`}>{product.name}</Link>
//                   </h3>
//                   <p className="text-red-500 font-bold mt-2">
//                     {(product.price || 0).toLocaleString('vi-VN')} ₫
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/product/ProductCard';

export default function HomePage() {
  const { authState } = useAuth();
  const { products, loading, error, totalProducts, loadProducts } = useProducts(0, 100, authState.token);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (authState.isAuthenticated && authState.token && !authState.isLoading && !hasLoaded) {
      console.log('Calling loadProducts, token:', authState.token);
      loadProducts();
      setHasLoaded(true);
    }
  }, [authState.isAuthenticated, authState.token, authState.isLoading, hasLoaded, loadProducts]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      {/* Banner Section */}
      <div className="container mx-auto px-4 py-4" suppressHydrationWarning>
        <div className="grid grid-cols-12 gap-4" suppressHydrationWarning>
          <div className="col-span-8" suppressHydrationWarning>
            <img
              src="/images/banner/main-banner.jpg"
              alt="Main Banner"
              className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
            />
          </div>
          <div className="col-span-4 space-y-4" suppressHydrationWarning>
            <img
              src="/images/banner/food-banner.jpg"
              alt="Food Banner"
              className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
            />
            <img
              src="/images/banner/youtube-banner.jpg"
              alt="YouTube Banner"
              className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Sản phẩm nổi bật</h1>

        {loading && <p className="text-center text-gray-500">Đang tải...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="mb-4 text-gray-600">
              Tìm thấy {totalProducts} sản phẩm
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}



// 'use client';

// import { useEffect, useState } from 'react';
// import { useProducts } from '@/hooks/useProducts';
// import { useAuth } from '@/context/AuthContext';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import ProductCard from '@/components/product/ProductCard';

// export default function HomePage() {
//   const { authState } = useAuth();
//   const { products, loading, error, totalProducts, loadProducts } = useProducts(0, 100, authState.token);
//   const [hasLoaded, setHasLoaded] = useState(false);

//   useEffect(() => {
//     if (authState.isAuthenticated && authState.token && !authState.isLoading && !hasLoaded) {
//       console.log('Calling loadProducts, token:', authState.token);
//       loadProducts();
//       setHasLoaded(true);
//     }
//   }, [authState.isAuthenticated, authState.token, authState.isLoading, hasLoaded, loadProducts]);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header />

//       {/* Banner Section */}
//       <div className="container mx-auto px-4 py-4" suppressHydrationWarning>
//         <div className="grid grid-cols-12 gap-4" suppressHydrationWarning>
//           <div className="col-span-8" suppressHydrationWarning>
//             <img
//               src="/images/banner/main-banner.jpg"
//               alt="Main Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//           </div>
//           <div className="col-span-4 space-y-4" suppressHydrationWarning>
//             <img
//               src="/images/banner/food-banner.jpg"
//               alt="Food Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//             <img
//               src="/images/banner/youtube-banner.jpg"
//               alt="YouTube Banner"
//               className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
//             />
//           </div>
//         </div>
//       </div>

//       <main className="container mx-auto px-4 py-8 flex-grow">
//         <h1 className="text-2xl font-bold text-gray-700 mb-6">Sản phẩm nổi bật</h1>

//         {loading && <p className="text-center text-gray-500">Đang tải...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}

//         {!loading && !error && products.length === 0 && (
//           <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
//         )}

//         {!loading && !error && products.length > 0 && (
//           <>
//             <div className="mb-4 text-gray-600">
//               Tìm thấy {totalProducts} sản phẩm
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           </>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// }