"use client";

import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaShoppingCart,
  FaBell,
  FaQuestionCircle,
  FaSearch,
  FaCcVisa,
  FaCcMastercard,
  FaCcJcb,
  FaCcPaypal,
  FaGooglePay,
  FaApplePay,
  FaComments,
  FaFileInvoice,
} from "react-icons/fa";
import { useRef, useState } from "react";
import { mockConversations } from "@/data/mockData";
import AuthStatus from "@/components/AuthStatus";
import { useRouter } from 'next/navigation';

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

  const router = useRouter();

  const toggleChatPopup = () => {
    setChatPopupVisible(!isChatPopupVisible);
  };

  const handleQuery = () => {
    const query = searchRef.current.value;
    if (query) {
      // Redirect to search page with query
      router.push(`/search?query=${encodeURIComponent(query)}`);
      // window.location.href = `/search?query=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Navigation */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-gray-700 text-sm py-2">
            <div className="flex gap-6 items-center">
              <Link href="/" className="text-gray-700 text-3xl font-bold">
                <img src="/images/logo.png" alt="Logo" className="h-12" />
              </Link>
              <Link href="/dashboard" className="hover:text-blue-500">
                Kênh Người Bán
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Dashboard
              </Link>
              <a href="#" className="hover:text-blue-500">
                Tải ứng dụng
              </a>
              <a href="#" className="hover:text-blue-500">
                Kết nối
              </a>
              <div className="flex items-center gap-3">
                <a href="#" className="hover:text-blue-500">
                  <FaFacebook size={16} />
                </a>
                <a href="#" className="hover:text-blue-500">
                  <FaInstagram size={16} />
                </a>
                <a href="#" className="hover:text-blue-500">
                  <FaTwitter size={16} />
                </a>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <a
                href="#"
                className="hover:text-blue-500 flex items-center gap-2"
              >
                <FaBell size={16} />
                Thông Báo
              </a>
              <a
                href="#"
                className="hover:text-blue-500 flex items-center gap-2"
              >
                <FaQuestionCircle size={16} />
                Hỗ Trợ
              </a>
              <a href="#" className="hover:text-blue-500">
                Tiếng Việt
              </a>
              <AuthStatus />
            </div>
          </div>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-gray-100 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-10 py-4">
            <div className="flex-1">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm"
                  ref={searchRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleQuery();
                    }
                  }}
                  className="w-full px-4 py-2 rounded-l-md text-sm bg-white text-gray-700 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600"
                  onClick={() => handleQuery()}
                >
                  <FaSearch size={16} />
                </button>
              </div>
            </div>
            <div className="text-gray-700 text-2xl relative flex items-center gap-4">
              <div className="relative cursor-pointer">
                <Link href="/cart">
                  <FaShoppingCart
                    size={24}
                    className="cursor-pointer text-gray-700 hover:text-blue-500"
                  />
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              </div>
              <div className="relative">
                <FaComments
                  size={24}
                  className="cursor-pointer text-gray-700 hover:text-blue-500"
                  onClick={toggleChatPopup}
                />
              </div>
              <div className="relative">
                <Link href={`/orders`}>
                  <FaFileInvoice
                    size={24}
                    className="cursor-pointer text-gray-700 hover:text-blue-500"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Popup */}
      {isChatPopupVisible && (
        <div className="fixed top-30 right-4 flex space-x-4 z-50">
          {/* Chat List Popup */}
          <div className="bg-white shadow-lg rounded-lg w-80 p-4">
            <h3 className="text-lg font-medium text-black mb-4">
              Danh sách cuộc trò chuyện
            </h3>
            <ul className="space-y-2">
              {mockConversations.map((conversation) => (
                <li
                  key={conversation.id}
                  className="flex items-center gap-3 p-2 border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => setActiveChat(conversation)}
                >
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-black font-medium">
                    {conversation.name}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={toggleChatPopup}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Đóng
            </button>
          </div>

          {/* Chat Detail Popup */}
          {activeChat && (
            <div className="bg-white shadow-lg rounded-lg w-80 p-4">
              <button
                onClick={() => setActiveChat(null)}
                className="text-blue-500 hover:underline mb-4"
              >
                Đóng
              </button>
              <h3 className="text-lg font-medium text-black mb-4">
                Trò chuyện với {activeChat.name}
              </h3>
              {activeChat.messages ? (
                <div className="space-y-2 overflow-y-auto max-h-60">
                  {activeChat.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shadow-md ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Không có tin nhắn nào.</p>
              )}
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Gửi
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Menu */}

      {/* Banner Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <img
              src="/images/banner/main-banner.jpg"
              alt="Main Banner"
              className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
            />
          </div>
          <div className="col-span-4 space-y-4">
            <img
              src="/images/banner/main-banner.jpg"
              alt="Food Banner"
              className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
            />
            <img
              src="/images/banner/main-banner.jpg"
              alt="YouTube Banner"
              className="w-full rounded-sm shadow-md hover:opacity-90 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* Flash Sale Section */}

      {/* Product List */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-sm p-4 shadow-md">
          {/* <h3 className="text-gray-700 text-lg font-medium mb-4">GỢI Ý HÔM NAY</h3> */}
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
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 mt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium mb-4 text-gray-700">
                CHĂM SÓC KHÁCH HÀNG
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Trung Tâm Trợ Giúp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Shopee Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Shopee Mall
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Hướng Dẫn Mua Hàng
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-700">VỀ CHÚNG TÔI</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Giới Thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Tuyển Dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Điều Khoản
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Chính Sách Bảo Mật
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-700">THANH TOÁN</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                  <FaCcVisa className="text-blue-600 text-2xl" />
                </div>
                <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                  <FaCcMastercard className="text-red-600 text-2xl" />
                </div>
                <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                  <FaCcJcb className="text-purple-600 text-2xl" />
                </div>
                <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                  <FaCcPaypal className="text-blue-500 text-2xl" />
                </div>
                <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                  <FaGooglePay className="text-green-600 text-2xl" />
                </div>
                <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                  <FaApplePay className="text-black text-2xl" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-700">
                TẢI ỨNG DỤNG NGAY
              </h4>
              <div className="flex gap-4">
                <img src="/images/qr-code.png" alt="QR Code" className="w-24" />
                <div className="space-y-2">
                  <img
                    src="/images/app-store.png"
                    alt="App Store"
                    className="h-10"
                  />
                  <img
                    src="/images/google-play.png"
                    alt="Google Play"
                    className="h-10"
                  />
                  <img
                    src="/images/app-gallery.png"
                    alt="App Gallery"
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-700">
            <p>&copy; 2025. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
