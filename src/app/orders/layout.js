import AuthStatus from "@/components/AuthStatus";
import Link from "next/link";
import React from "react";
import {
  FaApplePay,
  FaBell,
  FaCcJcb,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaFacebook,
  FaGooglePay,
  FaInstagram,
  FaQuestionCircle,
  FaTwitter,
} from "react-icons/fa";

const layout = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Navigation */}
      <header className="bg-white shadow-md">
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
      </header>
      {children}
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
};

export default layout;
