"use client";

import { useSearchParams } from "next/navigation";
import { message } from "antd";
import Footer from "@/components/Footer";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderData = searchParams.get("orderData") ? JSON.parse(decodeURIComponent(searchParams.get("orderData"))) : null;

  if (!orderId || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Không tìm thấy thông tin đơn hàng!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-6">Đặt hàng thành công!</h1>
        <p className="text-gray-700 mb-4">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận.
        </p>
        <div className="mb-6">
          <p className="text-gray-600">
            <strong>Mã đơn hàng:</strong> {orderId}
          </p>
          <p className="text-gray-600">
            <strong>Tổng tiền:</strong> {orderData.totalPrice?.toLocaleString("vi-VN")} ₫
          </p>
          <p className="text-gray-600">
            <strong>Trạng thái:</strong> PENDING
          </p>
          <p className="text-gray-600">
            <strong>Địa chỉ giao hàng:</strong> {orderData.deliveryAddress.recipientAddress}
          </p>
          <p className="text-gray-600">
            <strong>Sản phẩm:</strong> {orderData.orderDetails[0].productName} (x{orderData.orderDetails[0].quantity})
          </p>
        </div>
        <button
          onClick={() => window.location.href = "/"}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Quay lại trang chủ
        </button>
      </div>
     
    </div>
  );
}