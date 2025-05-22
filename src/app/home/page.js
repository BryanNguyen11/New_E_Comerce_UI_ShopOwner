// <<<<<<< HEAD
// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useProducts } from "@/hooks/useProducts";

// import ProductCard from "@/components/product/ProductCard";
// import InfiniteScroll from "react-infinite-scroll-component";
// import Link from "next/link";
// import {
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
//   FaLinkedin,
//   FaShoppingCart,
//   FaBell,
//   FaQuestionCircle,
//   FaSearch,
//   FaCcVisa,
//   FaCcMastercard,
//   FaCcJcb,
//   FaCcPaypal,
//   FaGooglePay,
//   FaApplePay,
//   FaComments,
//   FaFileInvoice,
// } from "react-icons/fa";
// import { useRef, useState, useEffect } from "react";
// import { mockConversations } from "@/data/mockData";
// import AuthStatus from "@/components/AuthStatus";
// import { useRouter } from 'next/navigation';
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// // Danh sách ảnh banner (có thể tự động lấy từ public/images/banner nếu build-time, ở đây hardcode)
// const bannerImages = [
//   "/images/banner/main-banner.jpg",
//   "/images/banner/flash-sale-banner.jpg",
//   "/images/banner/sub-banner-1.jpg",
//   "/images/banner/sub-banner-2.jpg",
//   "/images/banner/49601b406491a8eae318bebc541bf8ca.jpg",
//   "/images/banner/89bf8e3eef57a1034a4786da47d79d15.jpg",
//   "/images/banner/f5894834d664f6ca42dc6aa2d9d5bac4.jpg",
//   "/images/banner/f9746c1ec6a7e39f232a382017e3fb55.jpg",
// ];
// =======
'use client';

import InfiniteScroll from "react-infinite-scroll-component";
import {useRef, useEffect, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { mockConversations } from "@/data/mockData";
import Footer from '@/components/Footer';
import ProductCard from '@/components/product/ProductCard';
// >>>>>>> 54d0e8d (fix order)
// Danh sách ảnh banner (có thể tự động lấy từ public/images/banner nếu build-time, ở đây hardcode)
const bannerImages = [
  "/images/banner/main-banner.jpg",
  "/images/banner/flash-sale-banner.jpg",
  "/images/banner/sub-banner-1.jpg",
  "/images/banner/sub-banner-2.jpg",
  "/images/banner/49601b406491a8eae318bebc541bf8ca.jpg",
  "/images/banner/89bf8e3eef57a1034a4786da47d79d15.jpg",
  "/images/banner/f5894834d664f6ca42dc6aa2d9d5bac4.jpg",
  "/images/banner/f9746c1ec6a7e39f232a382017e3fb55.jpg",
];
export default function HomePage() {
  const { user, authState } = useAuth();
  const { products, hasMore, loadMoreProducts, loading } = useProducts(
    0,
    10,
    authState.token
  );
  const [isChatPopupVisible, setChatPopupVisible] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const searchRef = useRef(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (authState.isAuthenticated && authState.token && !authState.isLoading && !hasLoaded) {
      console.log('Calling loadProducts, token:', authState.token);
      setHasLoaded(true);
    }
  }, [authState.isAuthenticated, authState.token, authState.isLoading, hasLoaded]);

  // Tự động chuyển slide mỗi 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      {/* Banner Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 relative">
            <img
              src={bannerImages[currentBanner]}
              alt="Main Banner"
              className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity h-[215px] object-cover"
            />
            {/* Nút chuyển slide */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow"
              onClick={() => setCurrentBanner((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)}
              aria-label="Previous banner"
            >
              &#8592;
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow"
              onClick={() => setCurrentBanner((prev) => (prev + 1) % bannerImages.length)}
              aria-label="Next banner"
            >
              &#8594;
            </button>
            {/* Dots indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {bannerImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`inline-block w-3 h-3 rounded-full ${idx === currentBanner ? 'bg-[#05fa80]' : 'bg-white/70 border border-gray-300'}`}
                  onClick={() => setCurrentBanner(idx)}
                  style={{ cursor: 'pointer' }}
                ></span>
              ))}
            </div>
          </div>
          <div className="col-span-4 space-y-4">
            {/* Hiển thị 2 banner tiếp theo dạng nhỏ */}
            <img
              src={bannerImages[(currentBanner + 1) % bannerImages.length]}
              alt="Food Banner"
              className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity h-[100px] object-cover"
            />
            <img
              src={bannerImages[(currentBanner + 2) % bannerImages.length]}
              alt="YouTube Banner"
              className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity h-[100px] object-cover"
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Sản phẩm nổi bật</h1>

        <InfiniteScroll
            dataLength={products.length}
            next={loadMoreProducts}
            hasMore={hasMore}
            loader={
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-black mt-2">Đang tải thêm sản phẩm...</p>
              </div>
            }
            endMessage={
              <p className="text-center text-gray-500 py-4">
                Đã hiển thị tất cả sản phẩm
              </p>
            }
          >
            <div className="grid grid-cols-6 gap-4">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          </InfiniteScroll>
      </main>
      <Footer />
    </div>
  );
}
