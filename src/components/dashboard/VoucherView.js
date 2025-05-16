"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function VoucherView({ onSubmit, onCancel }) {    const [formData, setFormData] = useState({
        voucherName: "",
        startDate: "",
        endDate: "",
        voucherType: "PERCENT", // "PERCENT" or "VALUE"
        percentDiscount: "",
        valueDiscount: null,
        minPriceRequired: 10000,
        usesCount: 100,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { user, authState } = useAuth();
    const accessToken = authState.token;
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});    const validateForm = () => {
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
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://exclusion-info-pcs-tsunami.trycloudflare.com';
            
            // Get user context for vendorId (assuming it's available in localStorage or similar)
            // In a real application, you might get this from a context or state management system
            const vendorId = user?.userId;
            
            console.log('Vendor ID:', vendorId);

            // Format the data according to the API requirements
            const voucherPayload = {
                voucherName: formData.voucherName,
                vendorId: vendorId,
                startDate: formData.startDate,
                endDate: formData.endDate,
                minPriceRequired: Number(formData.minPriceRequired),
                usesCount: Number(formData.usesCount),
                voucherType: formData.voucherType,
                percentDiscount: formData.voucherType === "PERCENT" ? Number(formData.percentDiscount) : null,
                valueDiscount: formData.voucherType === "VALUE" ? Number(formData.valueDiscount) : null,
            };
            
            console.log('Gửi dữ liệu voucher:', voucherPayload);

            const response = await fetch(`/api/vouchers/create-voucher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(voucherPayload),
            });

            console.log('Phản hồi từ server:', response);

            // Handle the response properly
            let resData;
            
            try {
                const responseText = await response.text();
                resData = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error('Lỗi khi phân tích JSON:', parseError);
                throw new Error('Không thể phân tích phản hồi từ máy chủ');
            }

            if (!response.ok) {
                console.error('Lỗi từ server:', resData);
                throw new Error(resData.message || 'Đã có lỗi xảy ra khi tạo mã giảm giá');
            }
            
            // Handle the response data as needed
            console.log('Voucher created successfully:', resData);

            // Call the parent's onSubmit function
            if (onSubmit) {
                onSubmit(resData);
            }
        } catch (err) {
            console.error('Lỗi khi tạo voucher:', err);
            setError(err.message || 'Đã có lỗi xảy ra khi tạo mã giảm giá');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold mb-4 text-black">Tạo mã giảm giá</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Lỗi! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">                <div>
                    <label className="block text-sm font-medium text-black">Tên chương trình giảm giá <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={formData.voucherName}
                        onChange={(e) => {
                            setFormData({ ...formData, voucherName: e.target.value });
                            // Clear validation error when user types
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
                </div>                <div>
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
                )}                <div>
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
                    <label className="block text-sm font-medium text-black">Tổng lượt sử dụng tối đa</label>
                    <input
                        type="number"
                        value={formData.usesCount}
                        onChange={(e) => setFormData({ ...formData, usesCount: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                        min="0"
                    />
                </div>
                {/* <div>
                    <label className="block text-sm font-medium text-black">Lượt sử dụng tối đa/Người mua</label>
                    <input
                        type="number"
                        value={formData.maxUsagePerUser}
                        onChange={(e) => setFormData({ ...formData, maxUsagePerUser: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black">Sản phẩm áp dụng (nếu có)</label>
                    <input
                        type="text"
                        value={formData.applicableProducts.join(", ")}
                        onChange={(e) => setFormData({ ...formData, applicableProducts: e.target.value ? e.target.value.split(", ") : [] })}
                        placeholder="Nhập ID sản phẩm, cách nhau bởi dấu phẩy"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                </div> */}
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
                        ) : "Tạo mã giảm giá"}
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
