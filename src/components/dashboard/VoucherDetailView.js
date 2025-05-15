"use client";

import { useState, useEffect } from "react";
import { voucherApi } from "@/services/api/voucher";

export default function VoucherDetailView({ voucherId, onBack }) {
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoucherDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiVoucher = await voucherApi.getVoucherById(voucherId);
        
        // Chuyển đổi từ định dạng API sang định dạng hiển thị
        const formattedVoucher = {
          id: apiVoucher.id,
          name: apiVoucher.voucherName || "Voucher không tên",
          code: apiVoucher.voucherCode || "-",
          startDate: apiVoucher.startDate ? new Date(apiVoucher.startDate).toLocaleDateString() : "-",
          endDate: apiVoucher.endDate ? new Date(apiVoucher.endDate).toLocaleDateString() : "-",
          discountType: apiVoucher.voucherType === "PERCENT" ? "percentage" : "amount",
          discountValue: apiVoucher.voucherType === "PERCENT" ? 
            Number(apiVoucher.percentDiscount) : Number(apiVoucher.valueDiscount || 0),
          minOrderValue: Number(apiVoucher.minPriceRequired || 0),
          maxUsage: Number(apiVoucher.usesCount || 0),
          maxUsagePerUser: 1,
          totalUsed: Number(apiVoucher.usedCount || 0),
          status: apiVoucher.active ? "active" : "inactive",
          applicableProducts: apiVoucher.products || [],
          createdAt: apiVoucher.createdAt ? new Date(apiVoucher.createdAt).toLocaleDateString() : "-",
          createdBy: apiVoucher.createdBy || "Admin",
        };
        
        setVoucherDetails(formattedVoucher);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching voucher details:", err);
        setError(err.message || "Không thể lấy thông tin chi tiết mã giảm giá");
        setLoading(false);
      }
    };

    fetchVoucherDetails();
  }, [voucherId]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mr-3"></div>
        <span className="text-gray-500">Đang tải...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <div className="flex">
          <div className="py-1">
            <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 10.32 10.32zM10 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>
          </div>
          <div>
            <p className="font-bold">Lỗi</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={onBack}
              className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-black">Chi tiết mã giảm giá</h2>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">
            Chỉnh sửa
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Xóa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            Thông tin chung
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-black">ID:</span>
              <span className="font-medium text-black">{voucherDetails.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Tên chương trình:</span>
              <span className="font-medium text-black">{voucherDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Mã voucher:</span>
              <span className="font-medium text-black">{voucherDetails.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Trạng thái:</span>
              <span className="font-medium capitalize">
                {voucherDetails.status === "active" ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Hoạt động
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                    Không hoạt động
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Thông tin giảm giá
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-black">Loại giảm giá:</span>
              <span className="font-medium text-black">
                {voucherDetails.discountType === "percentage"
                  ? "Giảm theo %"
                  : "Giảm theo số tiền"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Giá trị giảm giá:</span>
              <span className="font-medium text-black">
                {!!voucherDetails.discountValue && voucherDetails.discountType === "percentage"
                  ? `${voucherDetails.discountValue}%`
                  : `${voucherDetails.discountValue.toLocaleString()} VND`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Giá trị đơn hàng tối thiểu:</span>
              <span className="font-medium text-black">
                {voucherDetails.minOrderValue.toLocaleString()} VND
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 p-4 rounded">
          <h3 className="text-lg font-semibold text-green-600 mb-2">
            Thời gian áp dụng
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày bắt đầu:</span>
              <span className="font-medium text-black">{voucherDetails.startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày kết thúc:</span>
              <span className="font-medium text-black">{voucherDetails.endDate}</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <h3 className="text-lg font-semibold text-purple-600 mb-2">
            Giới hạn sử dụng
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng lượt sử dụng tối đa:</span>
              <span className="font-medium text-black">{voucherDetails.maxUsage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Đã sử dụng:</span>
              <span className="font-medium text-black">{voucherDetails.totalUsed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Lượt sử dụng tối đa/Người mua:
              </span>
              <span className="font-medium text-black">
                {voucherDetails.maxUsagePerUser}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold text-yellow-600 mb-2">
          Sản phẩm áp dụng
        </h3>
        <div>
          {voucherDetails.applicableProducts.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {voucherDetails.applicableProducts.map((product, index) => (
                <li key={index} className="text-gray-700">
                  {product}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">
              Áp dụng cho tất cả sản phẩm
            </p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Thông tin khác
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày tạo:</span>
            <span className="font-medium text-black">{voucherDetails.createdAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Người tạo:</span>
            <span className="font-medium text-black">{voucherDetails.createdBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
