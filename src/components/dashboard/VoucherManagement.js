"use client";

import { useEffect, useState } from "react";
import VoucherDetailView from "./VoucherDetailView";
import VoucherView from "./VoucherView";
import { useAuth } from "@/context/AuthContext";

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState([]);
  const { user, authState } = useAuth();
  const authToken = authState.token;


  // State để theo dõi voucher được chọn
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  // State để kiểm soát hiển thị popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      // Giả lập API call
      if (!user) {
        console.log("Chưa có người dùng, không thể gọi API");
        return;
      }
      // cai nay se vao trong phan pages/api/....
      const url = new URL("/api/vouchers/vendor/" + user.userId, window.location.origin);
      url.searchParams.append("page", 0);
      url.searchParams.append("size", 10);
      console.log("URL:", url.toString());
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Lỗi khi gọi API:", data);
        return;
      }
      console.log("Dữ liệu từ API:", data);
      setVouchers(data);
    }
    fetchVouchers();
  }, [user, authToken]);

  const handleDelete = async(id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này không?");
    if (confirmDelete) {
      const response= await fetch(`/api/vouchers/${id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
      setVouchers((prevVouchers) => prevVouchers.filter((voucher) => voucher.id !== id));
    }
  };

  const getMostUsedVoucher = () => {
    return vouchers.reduce((max, voucher) => (voucher.totalUsed > max.totalUsed ? voucher : max), vouchers[0]);
  };
  const mostUsedVoucher = getMostUsedVoucher();


  // Hàm xử lý khi click vào voucher
  const handleVoucherClick = (voucherId) => {
    setSelectedVoucherId(voucherId);
  };

  // Hàm xử lý khi quay lại danh sách
  const handleBackToList = () => {
    setSelectedVoucherId(null);
  };

  // Hàm để mở popup
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  // Hàm để đóng popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  // Hàm xử lý khi tạo mã giảm giá mới
  const handleCreateVoucher = async (newVoucher) => {
    console.log("Voucher từ API:", newVoucher);

    // Chuyển đổi từ cấu trúc API sang cấu trúc component
    const maxId = Math.max(...vouchers.map(v => v.id), 0);
    const voucherToAdd = {
      ...newVoucher,
      voucherId: newVoucher.voucherId || newVoucher.id || Math.random().toString(36).substring(2, 15),
      id: maxId + 1,
      name: newVoucher.voucherName || "Voucher mới",
      code: newVoucher.voucherCode || `CODE${maxId + 1}`,
      startDate: newVoucher.startDate ? new Date(newVoucher.startDate).toLocaleDateString() : "",
      endDate: newVoucher.endDate ? new Date(newVoucher.endDate).toLocaleDateString() : "",
      discountType: newVoucher.voucherType === "PERCENT" ? "percentage" : "amount",
      discountValue: newVoucher.voucherType === "PERCENT" ?
        Number(newVoucher.percentDiscount) : Number(newVoucher.valueDiscount || 0),
      minOrderValue: Number(newVoucher.minPriceRequired || 0),
      maxUsage: Number(newVoucher.usesCount || 0),
      maxUsagePerUser: 1,
      totalUsed: 0 // Mã mới nên chưa có lượt sử dụng
    };
    
    console.log("Voucher đã chuyển đổi:", voucherToAdd);
    
    setVouchers([...vouchers, voucherToAdd]);
    setIsPopupOpen(false); // Đóng popup sau khi tạo
    
  };

  // Hiển thị có điều kiện dựa trên selectedVoucherId
  return (
    <div className="p-6 bg-gray-100">
      {selectedVoucherId ? (
        <VoucherDetailView voucherId={selectedVoucherId} onBack={handleBackToList} />
      ) : (
        <>
          {/* Search and Summary Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={handleOpenPopup}
              >
                Thêm mã giảm giá
              </button>
              <button className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400">Tải xuống</button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm font-medium text-black">Loại giảm giá</p>
              <p className="text-2xl font-bold text-blue-500">{vouchers.length}</p>
              <p className="text-xs text-black">7 ngày gần đây</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm font-medium text-black">Tổng số lượng mã giảm giá</p>
              <p className="text-2xl font-bold text-orange-500">{vouchers.reduce((sum, v) => sum + v.maxUsage, 0)}</p>
              <p className="text-xs text-black">7 ngày gần đây</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm font-medium text-black">Mã giảm giá được sử dụng nhiều nhất</p>
              <p className="text-2xl font-bold text-purple-500">{mostUsedVoucher?.name || ""}</p>
              <p className="text-xs text-black">{mostUsedVoucher?.totalUsed || ""} lần</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm font-medium text-black">Mã giảm giá sắp hết hạn</p>
              <p className="text-2xl font-bold text-red-500">12</p>
              <p className="text-xs text-black">2 mã hết hạn trong 7 ngày</p>
            </div>
          </div>

          {/* Voucher Table */}
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <table className="min-w-full border border-gray-200 table-fixed">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-1/6 px-4 py-3 border-b text-black text-left font-semibold">Tên chương trình</th>
                  <th className="w-1/6 px-4 py-3 border-b text-black text-left font-semibold">Mã voucher</th>
                  <th className="w-1/6 px-4 py-3 border-b text-black text-left font-semibold">Thời gian</th>
                  <th className="w-1/8 px-4 py-3 border-b text-black text-left font-semibold">Loại giảm giá</th>
                  <th className="w-1/8 px-4 py-3 border-b text-black text-left font-semibold">Giá trị</th>
                  <th className="w-1/8 px-4 py-3 border-b text-black text-left font-semibold">Tổng lượt sử dụng</th>
                  <th className="w-1/8 px-4 py-3 border-b text-black text-center font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr
                    key={voucher.voucherId}
                    className="border-t hover:bg-blue-50 transition cursor-pointer"
                    onClick={() => handleVoucherClick(voucher.voucherId)}
                  >
                    <td className="px-4 py-3 border-b text-black font-medium">{voucher.voucherName}</td>
                    <td className="px-4 py-3 border-b text-black">{voucher.voucherId}</td>
                    <td className="px-4 py-3 border-b text-black">
                      {voucher.startDate} - {voucher.endDate}
                    </td>
                    <td className="px-4 py-3 border-b text-black">
                      {voucher.voucherType === "PERCENT" ? "Giảm %" : "Giảm tiền"}
                    </td>
                    <td className="px-4 py-3 border-b text-black">
                      {voucher.voucherType === "PERCENT"
                        ? `${voucher.percentDiscount || 0}%`
                        : `${(voucher.valueDiscount || 0).toLocaleString()} VND`}
                    </td>
                    <td className="px-4 py-3 border-b text-black text-center">{voucher.usesCount}</td>
                    <td className="px-4 py-3 border-b text-black text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(voucher.voucherId);
                        }}
                        className="text-red-500 hover:underline font-medium"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Popup for adding new voucher */}
          {isPopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop with 60% opacity */}
              <div
                className="fixed inset-0 bg-black opacity-60"
                onClick={handleClosePopup}
              ></div>

              {/* Popup content */}
              <div className="bg-white rounded-lg shadow-xl p-6 w-3/5 max-w-4xl z-10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-black">Thêm mã giảm giá mới</h2>
                  <button
                    onClick={handleClosePopup}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <VoucherView
                  onSubmit={handleCreateVoucher}
                  onCancel={handleClosePopup}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
