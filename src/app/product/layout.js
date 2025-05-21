import AuthStatus from "@/components/AuthStatus";
import Link from "next/link";
import '@ant-design/v5-patch-for-react-19';
import { FaBell, FaFacebook, FaInstagram, FaQuestionCircle, FaTwitter } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
  <div className="bg-gray-100 min-h-screen">
    <Header/>
      {/* Top Navigation */}
      {/* <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-gray-700 text-sm py-2">
            <div className="flex gap-6 items-center">
              <Link href="/dashboard" className="hover:text-blue-500">Kênh Người Bán</Link>
              <Link href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Dashboard
              </Link>
              <a href="#" className="hover:text-blue-500">Tải ứng dụng</a>
              <a href="#" className="hover:text-blue-500">Kết nối</a>
              <div className="flex items-center gap-3">
                <a href="#" className="hover:text-blue-500"><FaFacebook size={16} /></a>
                <a href="#" className="hover:text-blue-500"><FaInstagram size={16} /></a>
                <a href="#" className="hover:text-blue-500"><FaTwitter size={16} /></a>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <a href="#" className="hover:text-blue-500 flex items-center gap-2">
                <FaBell size={16} />
                Thông Báo
              </a>
              <a href="#" className="hover:text-blue-500 flex items-center gap-2">
                <FaQuestionCircle size={16} />
                Hỗ Trợ
              </a>
              <a href="#" className="hover:text-blue-500">Tiếng Việt</a> */}
              {/* {user ? (
                <div className="flex items-center gap-3">
                  <span className="hover:text-blue-500">{user.fullName}</span>
                  <button 
                    onClick={logout}
                    className="hover:text-blue-500"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/register" className="hover:text-blue-500">Đăng Ký</Link>
                  <span>|</span>
                  <Link href="/login" className="hover:text-blue-500">Đăng Nhập</Link>
                </div>
              )} */}
          
              {/* <AuthStatus/> */}
            {/* </div>
          </div>
        </div>
      </div> */}
     
  { children }
  <Footer/>
  </div>
  );
}
