import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcJcb,
  FaGooglePay,
  FaApplePay
} from 'react-icons/fa';


export default function Footer() {
    return (
        <footer className="bg-gray-200 mt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium mb-4 text-gray-700">CHĂM SÓC KHÁCH HÀNG</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="#" className="hover:text-blue-500">Trung Tâm Trợ Giúp</a></li>
                <li><a href="#" className="hover:text-blue-500">Shopee Blog</a></li>
                <li><a href="#" className="hover:text-blue-500">Shopee Mall</a></li>
                <li><a href="#" className="hover:text-blue-500">Hướng Dẫn Mua Hàng</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-700">VỀ CHÚNG TÔI</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="#" className="hover:text-blue-500">Giới Thiệu</a></li>
                <li><a href="#" className="hover:text-blue-500">Tuyển Dụng</a></li>
                <li><a href="#" className="hover:text-blue-500">Điều Khoản</a></li>
                <li><a href="#" className="hover:text-blue-500">Chính Sách Bảo Mật</a></li>
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
              <h4 className="font-medium mb-4 text-gray-700">TẢI ỨNG DỤNG NGAY</h4>
              <div className="flex gap-4">
                <img src="/images/qr-code.png" alt="QR Code" className="w-24" />
                <div className="space-y-2">
                  <img src="/images/app-store.png" alt="App Store" className="h-10" />
                  <img src="/images/google-play.png" alt="Google Play" className="h-10" />
                  <img src="/images/app-gallery.png" alt="App Gallery" className="h-10" />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-700">
            <p>© 2025. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    );
  }