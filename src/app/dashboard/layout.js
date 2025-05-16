// src/app/dashboard/layout.js
"use client"; // Layouts trong App Router cần 'use client' nếu có hooks hoặc tương tác

import AuthStatus from '@/components/AuthStatus';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter

// Giả sử bạn có các icon (cần import thư viện icon hoặc dùng SVG/Image)
// import { HomeIcon, BoxIcon, ChartBarIcon, UsersIcon, ShoppingCartIcon, StoreIcon, CogIcon, LogoutIcon } from './icons'; // Ví dụ

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter(); // Khởi tạo router
  const { user } = useAuth(); // Giả sử bạn có hook để lấy thông tin người dùng

  const handleLogout = () => {
    // Logic đăng xuất (xóa token, etc.)
    router.push('/login'); // Chuyển hướng về trang login
  };

  const navigationItems = [
    { icon: "home", label: "Trang chủ", href: "/dashboard" },
    { icon: "box", label: "Kho hàng", href: "/dashboard/inventory" },
    //remove supplier
    // { icon: "users", label: "Nhà cung cấp", href: "/dashboard/supplier" }, // Cập nhật href
    { icon: "shopping-cart", label: "Đơn hàng", href: "/dashboard/order" },
    { icon: "tag", label: "Quản lý Voucher", href: "/dashboard/voucher" },
    { icon: "users", label: "Seller Management", href: "/dashboard/seller-management" },
    { icon: "shopping-cart", label: "Quay về trang chủ", href: "/home" },
    
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Navigation Sidebar */}
      <div className="w-64 bg-white shadow-sm flex flex-col"> {/* Thêm flex flex-col */}
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-4 border-b cursor-pointer"
          onClick={() => router.push('/home')} // Chuyển hướng về trang dashboard khi click logo
        >
          <div className="w-8 h-8">
            {/* Sử dụng Image component của Next.js nếu có thể */}
            <img src="/images/logo.png" alt="Shopee Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-[#ee4d2d] font-bold text-xl">KANBAN</span>
        </div>

        {/* Navigation Items */}
        <nav className="py-4 flex-grow"> {/* Thêm flex-grow */}
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`w-full text-left flex items-center gap-3 px-6 py-3 transition-colors ${
                pathname === item.href
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 font-semibold'
                  : 'text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-300 hover:to-orange-500'
              }`}
            >
              {/* Thay thế bằng component Icon nếu có */}
              <i className={`fas fa-${item.icon} w-5`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-6 py-4 border-t"> {/* Đặt nút logout ở dưới cùng */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#ee4d2d] transition-colors"
          >
            {/* Thay thế bằng component Icon nếu có */}
            <i className="fas fa-sign-out-alt w-5"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto"> {/* Thêm overflow-auto */}
        {/* Thanh tìm kiếm (nếu có) có thể đặt ở đây */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Tìm sản phẩm, nhà cung cấp, đơn hàng"
              className="w-full px-10 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="fas fa-search"></i>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <i className="fas fa-bell text-gray-500 text-lg cursor-pointer"></i>
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.png" // Thay bằng hình đại diện của user
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
             <AuthStatus/>
            </div>
          </div>
        </div>
        {children} {/* Đây là nơi nội dung của page.js sẽ được render */}
      </main>
    </div>
  );
}
