"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaShoppingCart,
  FaBell,
  FaQuestionCircle,
  FaSearch,
  FaComments,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { OrderContext } from "@/context/OrderContext";
import AuthStatus from "@/components/AuthStatus";
import { mockConversations } from "@/data/mockData";
import { useRouter } from "next/navigation"; 

export default function Header() {
  const { user } = useAuth();
  const { cart } = useContext(OrderContext);
  const [isChatPopupVisible, setChatPopupVisible] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter(); 
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?productName=${encodeURIComponent(searchTerm)}`);
    }
  };
  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    console.log("User data:", user);
  }, [user]);

  const toggleChatPopup = () => {
    setChatPopupVisible(!isChatPopupVisible);
  };

  return (
    <div>
      {/* Top Navigation */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-gray-700 text-sm py-2">
            <div className="flex gap-6 items-center">
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
            <Link href="/" className="text-gray-700 text-3xl font-bold">
              <img src="/images/logo.png" alt="Logo" className="h-12" />
            </Link>
            <form onSubmit={handleSearch} className="flex-1">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm, thương hiệu và tên shop"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-l-md text-sm bg-white text-gray-700 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600"
                >
                  <FaSearch size={16} />
                </button>
              </div>
            </form>

            <div className="text-gray-700 text-2xl relative flex items-center gap-4">
              <Link href="/cart" className="relative">
                <FaShoppingCart
                  size={24}
                  className="cursor-pointer text-gray-700 hover:text-blue-500"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="relative">
                <FaComments
                  size={24}
                  className="cursor-pointer text-gray-700 hover:text-blue-500"
                  onClick={toggleChatPopup}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Popup */}
      {isChatPopupVisible && (
        <div className="fixed top-[120px] right-4 flex space-x-4 z-50">
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
    </div>
  );
}
