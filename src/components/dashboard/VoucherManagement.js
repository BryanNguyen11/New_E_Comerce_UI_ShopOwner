"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
import VoucherDetailView from "./VoucherDetailView";
import VoucherView from "./VoucherView";
=======
import { useState, useEffect } from "react";
import VoucherDetailView from "./VoucherDetailView";
import VoucherView from "./VoucherView";
import { voucherApi } from "@/services/api/voucher";
>>>>>>> e3f9a2c3a42262a408977b26d7ac277caaf4f3c2
import { useAuth } from "@/context/AuthContext";

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState([]);
<<<<<<< HEAD
  const { user, authState } = useAuth();
  const authToken = authState.token;

=======
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
>>>>>>> e3f9a2c3a42262a408977b26d7ac277caaf4f3c2

  // State để theo dõi voucher được chọn
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  // State để kiểm soát hiển thị popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { user, authState } = useAuth();

<<<<<<< HEAD
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

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này không?");
  if (confirmDelete) {
    const response = await fetch(`/api/vouchers/${id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    setVouchers((prevVouchers) => prevVouchers.filter((voucher) => voucher.voucherId !== id));
  }
};
=======
  // Hàm để lấy dữ liệu từ API
  const fetchVouchers = async () => {
  try {
    setLoading(true);
    setError(null);
    
    console.log("user: {}",user)

    if (!user){
      return;
    }

    // Gọi API để lấy dữ liệu - có thể trả về mảng hoặc null hoặc lỗi
    const data = await voucherApi.getVouchers(user.userId, authState.token);
    
    // data đã được đảm bảo là mảng từ hàm voucherApi.getVouchers()
    // nên chúng ta có thể map trực tiếp
    const formattedVouchers = (data || []).map(item => ({
      id: item.id || item.voucherId,
      name: item.voucherName || "Voucher không tên",
      code: item.voucherCode || "-",
      startDate: item.startDate ? new Date(item.startDate).toLocaleDateString() : "-",
      endDate: item.endDate ? new Date(item.endDate).toLocaleDateString() : "-",
      discountType: item.voucherType === "PERCENT" ? "percentage" : "amount",
      discountValue: item.voucherType === "PERCENT" ? 
        Number(item.percentDiscount) : Number(item.valueDiscount || 0),
      minOrderValue: Number(item.minPriceRequired || 0),
      maxUsage: Number(item.usesCount || 0),
      maxUsagePerUser: 1,
      totalUsed: Number(item.usedCount || 0)
    }));
      
    setVouchers(formattedVouchers);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching vouchers:", err);
    setError(err.message || "Không thể lấy danh sách mã giảm giá");
    setLoading(false);
  }
};

  // Gọi API khi component mount
  useEffect(() => {
    fetchVouchers();
  }, [ user, authState]);

  const handleDelete = async (id) => {
    try {
      setVouchers(vouchers.filter((voucher) => voucher.id !== id));
    } catch (err) {
      console.error("Error deleting voucher:", err);
      alert("Không thể xóa mã giảm giá này. Vui lòng thử lại sau.");
    }
  };
>>>>>>> e3f9a2c3a42262a408977b26d7ac277caaf4f3c2

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };
  const getMostUsedVoucher = () => {
    if (!vouchers || vouchers.length === 0) return { name: "Không có", totalUsed: 0 };
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
  };  // Hàm xử lý khi tạo mã giảm giá mới
  const handleCreateVoucher = async (newVoucher) => {
    try {
      console.log("Voucher từ form:", newVoucher);
      
      // Gửi dữ liệu voucher tới API
      const createdVoucher = await voucherApi.createVoucher(newVoucher);
      console.log("Voucher từ API:", createdVoucher);
      
      // Chuyển đổi từ cấu trúc API sang cấu trúc component
      const voucherToAdd = {
        id: createdVoucher.id,
        name: createdVoucher.voucherName || "Voucher mới",
        code: createdVoucher.voucherCode || `CODE-${Date.now().toString().slice(-6)}`,
        startDate: createdVoucher.startDate ? new Date(createdVoucher.startDate).toLocaleDateString() : "",
        endDate: createdVoucher.endDate ? new Date(createdVoucher.endDate).toLocaleDateString() : "",
        discountType: createdVoucher.voucherType === "PERCENT" ? "percentage" : "amount",
        discountValue: createdVoucher.voucherType === "PERCENT" ? 
          Number(createdVoucher.percentDiscount) : Number(createdVoucher.valueDiscount || 0),
        minOrderValue: Number(createdVoucher.minPriceRequired || 0),
        maxUsage: Number(createdVoucher.usesCount || 0),
        maxUsagePerUser: 1,
        totalUsed: 0 // Mã mới nên chưa có lượt sử dụng
      };
      
      console.log("Voucher đã chuyển đổi:", voucherToAdd);
      setVouchers(prev => [...prev, voucherToAdd]);
      setIsPopupOpen(false); // Đóng popup sau khi tạo
    } catch (err) {
      console.error("Error creating voucher:", err);
      alert("Không thể tạo mã giảm giá. Vui lòng thử lại sau.");
    }
  };
<<<<<<< HEAD
  // Hàm xử lý khi tạo mã giảm giá mới
  const handleCreateVoucher = (newVoucher) => {
    console.log("Voucher từ API:", newVoucher);

    // Chuyển đổi từ cấu trúc API sang cấu trúc component
    const maxId = Math.max(...vouchers.map(v => v.id), 0);
    const voucherToAdd = {
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
=======

  if (!user) {
    return <div className="p-6 bg-gray-100">Vui lòng đăng nhập để xem mã giảm giá.</div>;
  }
>>>>>>> e3f9a2c3a42262a408977b26d7ac277caaf4f3c2

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
<<<<<<< HEAD
              <p className="text-2xl font-bold text-purple-500">{mostUsedVoucher?.name || ""}</p>
              <p className="text-xs text-black">{mostUsedVoucher?.totalUsed || ""} lần</p>
=======
              <p className="text-2xl font-bold text-purple-500">{mostUsedVoucher?.name || "Không có"}</p>
              <p className="text-xs text-black">{mostUsedVoucher?.totalUsed || 0} lần</p>
>>>>>>> e3f9a2c3a42262a408977b26d7ac277caaf4f3c2
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm font-medium text-black">Mã giảm giá sắp hết hạn</p>
              <p className="text-2xl font-bold text-red-500">12</p>
              <p className="text-xs text-black">2 mã hết hạn trong 7 ngày</p>
            </div>
          </div>

<<<<<<< HEAD
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
=======
          {/* Error state */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Lỗi! </strong>
              <span className="block sm:inline">{error}</span>
              <button 
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-3"
                onClick={handleRetry}
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="bg-white p-12 rounded shadow flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            /* Voucher Table */
            <div className="bg-white p-4 rounded shadow overflow-x-auto">
              {vouchers.length > 0 ? (
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
                        key={voucher.id} 
                        className="border-t hover:bg-blue-50 transition cursor-pointer"
                        onClick={() => handleVoucherClick(voucher.id)}
>>>>>>> e3f9a2c3a42262a408977b26d7ac277caaf4f3c2
                      >
                        <td className="px-4 py-3 border-b text-black font-medium">{voucher.name}</td>
                        <td className="px-4 py-3 border-b text-black">{voucher.code}</td>
                        <td className="px-4 py-3 border-b text-black">
                          {voucher.startDate} - {voucher.endDate}
                        </td>
                        <td className="px-4 py-3 border-b text-black">
                          {voucher.discountType === "percentage" ? "Giảm %" : "Giảm tiền"}
                        </td>                    
                        <td className="px-4 py-3 border-b text-black">
                          {voucher.discountType === "percentage"
                            ? `${voucher.discountValue || 0}%`
                            : `${(voucher.discountValue || 0).toLocaleString()} VND`}
                        </td>
                        <td className="px-4 py-3 border-b text-black text-center">{voucher.totalUsed}</td>
                        <td className="px-4 py-3 border-b text-black text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(voucher.id);
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
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500">Không có mã giảm giá nào.</p>
                  <button 
                    onClick={handleOpenPopup}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Tạo mã giảm giá mới
                  </button>
                </div>
              )}
            </div>
          )}

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
