"use client";

import { useState, useEffect } from "react";
import { voucherApi } from "@/services/api/voucher";
import { useAuth } from "@/context/AuthContext";

export default function VoucherDetailView({ voucherId, onBack }) {
  const {authState, user} =  useAuth();
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);  // Hàm xử lý khi click nút xóa
  const handleDeleteVoucher = async () => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này không?");
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/vouchers/${voucherId}/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        });
        
        if (response.ok) {
          setToast(`Đã xóa voucher "${voucherDetails?.name || voucherId}"`);
          // Hiển thị thông báo thành công rồi quay về danh sách sau 1 giây
          setTimeout(() => {
            onBack();
          }, 1000);
        } else {
          setToast("Xóa voucher thất bại!");
          // Ẩn toast sau 3 giây
          setTimeout(() => setToast(null), 3000);
        }
      } catch (err) {
        console.error("Error deleting voucher:", err);
        setToast("Xảy ra lỗi khi xóa voucher!");
        setTimeout(() => setToast(null), 3000);
      }
    }
  };
  
  // Hàm xử lý mở popup chỉnh sửa
  const handleOpenEditPopup = () => {
    setIsEditPopupOpen(true);
  };
  
  // Hàm xử lý đóng popup chỉnh sửa
  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
  };  // Hàm xử lý cập nhật voucher
  const handleUpdateVoucher = async (updatedVoucher) => {
    try {
      // Sử dụng endpoint chuẩn cho việc cập nhật voucher với ID
      const response = await fetch(`/api/vouchers/${updatedVoucher.voucherId}/put`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({...updatedVoucher, vendorId: user.userId}),
      });
      
      if (response.ok) {
        // Cập nhật dữ liệu voucher hiện tại
        const apiVoucher = await voucherApi.getVoucherById(voucherId, authState.token);
        
        // Chuyển đổi từ định dạng API sang định dạng hiển thị
        const formattedVoucher = {
          id: apiVoucher.voucherId || apiVoucher.id,
          name: apiVoucher.voucherName || "Voucher không tên",
          code: apiVoucher.voucherCode || "-",
          startDate: apiVoucher.startDate ? new Date(apiVoucher.startDate).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'}) : "Chưa thiết lập",
          endDate: apiVoucher.endDate ? new Date(apiVoucher.endDate).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'}) : "Chưa thiết lập",
          discountType: apiVoucher.voucherType === "PERCENT" ? "percentage" : "amount",
          discountValue: apiVoucher.voucherType === "PERCENT" ? 
            Number(apiVoucher.percentDiscount || 0) : Number(apiVoucher.valueDiscount || 0),
          minOrderValue: Number(apiVoucher.minPriceRequired || 0),
          maxUsage: Number(apiVoucher.usesCount || 0),
          maxUsagePerUser: 1,
          totalUsed: Number(apiVoucher.usedCount || 0),
          status: apiVoucher.active !== undefined ? (apiVoucher.active ? "active" : "inactive") : "active",
          createdAt: apiVoucher.createdAt ? new Date(apiVoucher.createdAt).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'}) : "Chưa có thông tin",
          createdBy: apiVoucher.fullName || "Người dùng hiện tại",
        };
        
        setVoucherDetails(formattedVoucher);
        setToast("Cập nhật voucher thành công!");
        setIsEditPopupOpen(false);
        
        // Ẩn toast sau 3 giây
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast("Cập nhật voucher thất bại!");
        // Ẩn toast sau 3 giây
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      console.error("Error updating voucher:", err);
      setToast("Xảy ra lỗi khi cập nhật voucher!");
      setTimeout(() => setToast(null), 3000);
    }
  };

  useEffect(() => {
    const fetchVoucherDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        if (authState.isLoading) {
          return;
        }
        const apiVoucher = await voucherApi.getVoucherById(voucherId, authState.token);
        
        // Chuyển đổi từ định dạng API sang định dạng hiển thị
        const formattedVoucher = {          id: apiVoucher.voucherId || apiVoucher.id,
          name: apiVoucher.voucherName || "Voucher không tên",
          code: apiVoucher.voucherCode || "-",
          startDate: apiVoucher.startDate ? new Date(apiVoucher.startDate).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'}) : "Chưa thiết lập",
          endDate: apiVoucher.endDate ? new Date(apiVoucher.endDate).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'}) : "Chưa thiết lập",          discountType: apiVoucher.voucherType === "PERCENT" ? "percentage" : "amount",
          discountValue: apiVoucher.voucherType === "PERCENT" ? 
            Number(apiVoucher.percentDiscount || 0) : Number(apiVoucher.valueDiscount || 0),
          minOrderValue: Number(apiVoucher.minPriceRequired || 0),
          maxUsage: Number(apiVoucher.usesCount || 0),
          maxUsagePerUser: 1,
          totalUsed: Number(apiVoucher.usedCount || 0),          status: apiVoucher.active !== undefined ? (apiVoucher.active ? "active" : "inactive") : "active",
          createdAt: apiVoucher.createdAt ? new Date(apiVoucher.createdAt).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'}) : "Chưa có thông tin",
          createdBy: apiVoucher.fullName || "Người dùng hiện tại",
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
  }, [voucherId, authState.token]);
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
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
      
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
        </div>        <div className="flex gap-2">          <button 
            onClick={handleOpenEditPopup}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">
            Chỉnh sửa
          </button>
          <button 
            onClick={handleDeleteVoucher}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
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
            </div>            <div className="flex justify-between">
              <span className="text-black">Giá trị giảm giá:</span>
              <span className="font-medium text-black">
                {voucherDetails.discountType === "percentage"
                  ? `${voucherDetails.discountValue || 0}%`
                  : `${(voucherDetails.discountValue || 0).toLocaleString()} VND`}
              </span>
            </div>            <div className="flex justify-between">
              <span className="text-black">Giá trị đơn hàng tối thiểu:</span>
              <span className="font-medium text-black">
                {(voucherDetails.minOrderValue || 0).toLocaleString()} VND
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
              <span className="text-gray-600">Số lượt sử dụng còn lại:</span>
              <span className="font-medium text-black">{voucherDetails.maxUsage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Đã sử dụng:</span>
              <span className="font-medium text-black">{voucherDetails.totalUsed}</span>
            </div>
            
          </div>
        </div>      </div>
      
      {/* Popup chỉnh sửa voucher */}
      {isEditPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with opacity */}
          <div
            className="fixed inset-0 bg-black opacity-60"
            onClick={handleCloseEditPopup}
          ></div>

          {/* Popup content */}
          <div className="bg-white rounded-lg shadow-xl p-6 w-3/5 max-w-4xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Chỉnh sửa mã giảm giá</h2>
              <button
                onClick={handleCloseEditPopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <EditVoucherForm
              voucherDetails={voucherDetails}
              onSubmit={handleUpdateVoucher}
              onCancel={handleCloseEditPopup}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Component form chỉnh sửa voucher
function EditVoucherForm({ voucherDetails, onSubmit, onCancel }) {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Chuyển đổi dữ liệu từ định dạng hiển thị sang định dạng form
  const initialFormData = {
    voucherName: voucherDetails.name,
    startDate: formatDate(voucherDetails.startDate),
    endDate: formatDate(voucherDetails.endDate),
    voucherType: voucherDetails.discountType === "percentage" ? "PERCENT" : "VALUE",
    percentDiscount: voucherDetails.discountType === "percentage" ? voucherDetails.discountValue : "",
    valueDiscount: voucherDetails.discountType !== "percentage" ? voucherDetails.discountValue : "",
    minPriceRequired: voucherDetails.minOrderValue,
    usesCount: voucherDetails.maxUsage,
  };
  
  const [formData, setFormData] = useState(initialFormData);
  
  // Helper function để chuyển đổi định dạng ngày từ dd/mm/yyyy sang yyyy-mm-dd
  function formatDate(dateString) {
    if (dateString === "Chưa thiết lập") return "";
    
    // Xử lý trường hợp dateString là định dạng dd/mm/yyyy (từ API)
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateString;
  }
  
  const validateForm = () => {
    const errors = {};

    if (!formData.voucherName.trim()) errors.voucherName = "Tên chương trình là bắt buộc";
    if (!formData.startDate) errors.startDate = "Thời gian bắt đầu là bắt buộc";
    if (!formData.endDate) errors.endDate = "Thời gian kết thúc là bắt buộc";

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = "Thời gian kết thúc phải sau thời gian bắt đầu";
    }

    // Validate the discount based on the type
    if (formData.voucherType === "PERCENT") {
      if (!formData.percentDiscount) errors.percentDiscount = "Giá trị giảm giá là bắt buộc";
      if (parseInt(formData.percentDiscount) > 100) {
        errors.percentDiscount = "Giảm giá theo % không thể vượt quá 100%";
      }
    } else {
      if (!formData.valueDiscount) errors.valueDiscount = "Giá trị giảm giá là bắt buộc";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Format the data according to the API requirements
      const voucherPayload = {
        voucherId: voucherDetails.id,
        voucherName: formData.voucherName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        minPriceRequired: Number(formData.minPriceRequired),
        usesCount: Number(formData.usesCount),
        voucherType: formData.voucherType,
        percentDiscount: formData.voucherType === "PERCENT" ? Number(formData.percentDiscount) : null,
        valueDiscount: formData.voucherType === "VALUE" ? Number(formData.valueDiscount) : null,
        // Đảm bảo thêm vendorId nếu cần thiết
        vendorId: authState.user?.userId,
      };
      
      // Call the parent's onSubmit function
      if (onSubmit) {
        onSubmit(voucherPayload);
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật voucher:', err);
      setError(err.message || 'Đã có lỗi xảy ra khi cập nhật mã giảm giá');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded shadow-md">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black">Tên chương trình giảm giá <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.voucherName}
            onChange={(e) => {
              setFormData({ ...formData, voucherName: e.target.value });
              if (validationErrors.voucherName) {
                setValidationErrors({ ...validationErrors, voucherName: null });
              }
            }}
            className={`mt-1 block w-full border ${validationErrors.voucherName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black`}
            required
          />
          {validationErrors.voucherName && <p className="text-red-500 text-xs mt-1">{validationErrors.voucherName}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4 text-black">
          <div>
            <label className="block text-sm font-medium text-black">Thời gian bắt đầu <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => {
                setFormData({ ...formData, startDate: e.target.value });
                if (validationErrors.startDate) {
                  setValidationErrors({ ...validationErrors, startDate: null });
                }
              }}
              className={`mt-1 block w-full border ${validationErrors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {validationErrors.startDate && <p className="text-red-500 text-xs mt-1">{validationErrors.startDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Thời gian kết thúc <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => {
                setFormData({ ...formData, endDate: e.target.value });
                if (validationErrors.endDate) {
                  setValidationErrors({ ...validationErrors, endDate: null });
                }
              }}
              className={`mt-1 block w-full border ${validationErrors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {validationErrors.endDate && <p className="text-red-500 text-xs mt-1">{validationErrors.endDate}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Loại giảm giá <span className="text-red-500">*</span></label>
          <select
            value={formData.voucherType}
            onChange={(e) => setFormData({ ...formData, voucherType: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            required
          >
            <option value="VALUE">Giảm theo số tiền</option>
            <option value="PERCENT">Giảm theo %</option>
          </select>
        </div>
        {formData.voucherType === "PERCENT" ? (
          <div>
            <label className="block text-sm font-medium text-black">
              Phần trăm giảm giá <span className="text-red-500">*</span>
              <span className="ml-1 text-xs text-gray-500">(1-100)</span>
            </label>
            <input
              type="number"
              value={!!formData.percentDiscount ? formData.percentDiscount : ""}
              onChange={(e) => {
                setFormData({ ...formData, percentDiscount: e.target.value });
                if (validationErrors.percentDiscount) {
                  setValidationErrors({ ...validationErrors, percentDiscount: null });
                }
              }}
              className={`mt-1 block w-full border ${validationErrors.percentDiscount ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black`}
              min="1"
              max="100"
              required={formData.voucherType === "PERCENT"}
            />
            {validationErrors.percentDiscount && <p className="text-red-500 text-xs mt-1">{validationErrors.percentDiscount}</p>}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-black">
              Giá trị giảm giá <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={!!formData.valueDiscount ? formData.valueDiscount : ""}
              onChange={(e) => {
                setFormData({ ...formData, valueDiscount: e.target.value });
                if (validationErrors.valueDiscount) {
                  setValidationErrors({ ...validationErrors, valueDiscount: null });
                }
              }}
              className={`mt-1 block w-full border ${validationErrors.valueDiscount ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black`}
              min="0"
              required={formData.voucherType === "VALUE"}
            />
            {validationErrors.valueDiscount && <p className="text-red-500 text-xs mt-1">{validationErrors.valueDiscount}</p>}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-black">Giá trị đơn hàng tối thiểu</label>
          <input
            type="number"
            value={formData.minPriceRequired}
            onChange={(e) => setFormData({ ...formData, minPriceRequired: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Số lượt sử dụng còn lại</label>
          <input
            type="number"
            value={formData.usesCount}
            onChange={(e) => setFormData({ ...formData, usesCount: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            min="0"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : "Cập nhật mã giảm giá"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
