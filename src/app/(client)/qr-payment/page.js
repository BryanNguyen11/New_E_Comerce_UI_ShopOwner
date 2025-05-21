

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { message } from "antd";

// export default function QRPaymentPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isLoading, setIsLoading] = useState(false);

//   const orderId = searchParams.get("orderId");
//   const totalPrice = searchParams.get("totalPrice");
//   const orderData = searchParams.get("orderData") ? JSON.parse(searchParams.get("orderData")) : null;
//   const token = searchParams.get("token");

//   useEffect(() => {
//     console.log("Query params:", { orderId, totalPrice, orderData, token });
//     if (!orderId || !totalPrice || !orderData || !token) {
//       message.error("Thông tin thanh toán không hợp lệ!");
//       router.push("/order");
//       return;
//     }

//     if (!orderData.vendorId) {
//       message.error("Thiếu thông tin nhà cung cấp (vendorId)!");
//       router.push("/order");
//       return;
//     }

//     // Kiểm tra stock sản phẩm trước khi gọi API
//     const checkStock = async () => {
//       try {
//         const productId = orderData.orderDetails[0].productId;
//         const quantity = orderData.orderDetails[0].quantity;
//         const response = await fetch(`/api/products/${productId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) throw new Error("Không thể kiểm tra tồn kho sản phẩm");
//         const product = await response.json();
//         if (product.stock < quantity) {
//           throw new Error(`Sản phẩm ${product.productName} không đủ hàng (còn ${product.stock})`);
//         }
//       } catch (error) {
//         message.error(error.message);
//         router.push("/order");
//         return false;
//       }
//       return true;
//     };

//     // Giả lập thanh toán sau 10 giây
//     console.log("Simulating payment success after 10 seconds...");
//     const timer = setTimeout(async () => {
//       if (await checkStock()) {
//         console.log("Calling createOrder...");
//         createOrder();
//       }
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, [orderId, totalPrice, orderData, token, router]);

//   const createOrder = async () => {
//     setIsLoading(true);
//     try {
//       console.log("Creating order request with data:", JSON.stringify(orderData, null, 2));

//       // Bước 1: Gọi POST /api/orders để tạo yêu cầu thanh toán và lưu vào Redis
//       const requestResponse = await fetch("/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(orderData),
//       });

//       console.log("Request response status:", requestResponse.status);
//       const requestBody = await requestResponse.text();
//       console.log("Request response body:", requestBody);

//       if (!requestResponse.ok) {
//         let errorMessage = "Không thể tạo yêu cầu thanh toán";
//         try {
//           const errorData = JSON.parse(requestBody);
//           errorMessage = errorData.detail || errorMessage;
//         } catch (e) {
//           // Không parse được JSON
//         }
//         throw new Error(errorMessage);
//       }

//       // Kiểm tra response body là URL QR code
//       if (!requestBody.includes("qr.sepay.vn")) {
//         throw new Error("Phản hồi không mong đợi từ /api/orders");
//       }

//       // Bước 2: Mô phỏng webhook để kích hoạt lưu đơn hàng
//       console.log("Simulating webhook for order:", orderId);
//       const webhookResponse = await fetch("/api/payments/webhook", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           content: `Payment for SEVQR ${orderId}`,
//           transferAmount: parseInt(totalPrice),
//         }),
//       });

//       console.log("Webhook response status:", webhookResponse.status);
//       const webhookBody = await webhookResponse.text();
//       console.log("Webhook response body:", webhookBody);

//       if (!webhookResponse.ok) {
//         throw new Error("Không thể mô phỏng webhook: " + webhookBody);
//       }

//       // Bước 3: Xác nhận đơn hàng đã được lưu trong database
//       const orderCheckResponse = await fetch(`/api/orders/${orderId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("Order check response status:", orderCheckResponse.status);
//       if (!orderCheckResponse.ok) {
//         throw new Error("Không thể xác nhận đơn hàng trong database");
//       }

//       message.success("Thanh toán thành công! Đơn hàng đã được tạo.");
//       router.push(`/order-success?orderId=${orderId}&orderData=${encodeURIComponent(JSON.stringify(orderData))}`);
//     } catch (error) {
//       console.error("Lỗi tạo đơn hàng:", error);
//       message.error(`Lỗi tạo đơn hàng: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const qrUrl = `https://qr.sepay.vn/img?acc=107872989482&bank=VietinBank&des=SEVQR+${orderId}&amount=${totalPrice}`;

//   return (
//     <div className="bg-gray-100 min-h-screen flex items-center justify-center">
//       <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
//         <h1 className="text-2xl font-bold text-gray-700 mb-6">Quét mã QR để thanh toán</h1>
//         <div className="flex justify-center mb-6">
//           <img src={qrUrl} alt="QR Code" className="w-64 h-64" />
//         </div>
//         <p className="text-center text-gray-600 mb-4">
//           Số tiền: <span className="font-bold">{parseInt(totalPrice).toLocaleString("vi-VN")} ₫</span>
//         </p>
//         <p className="text-center text-gray-600 mb-6">
//           Vui lòng quét mã QR bằng ứng dụng ngân hàng để thanh toán.
//         </p>
//         {isLoading && (
//           <p className="text-center text-blue-500">Đang xử lý thanh toán...</p>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { message } from "antd";

export default function QRPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const orderId = searchParams.get("orderId");
  const totalPrice = searchParams.get("totalPrice");
  const orderData = searchParams.get("orderData") ? JSON.parse(searchParams.get("orderData")) : null;
  const token = searchParams.get("token");

  useEffect(() => {
    console.log("Query params:", { orderId, totalPrice, orderData, token });
    if (!orderId || !totalPrice || !orderData || !token) {
      message.error("Thông tin thanh toán không hợp lệ!");
      router.push("/order");
      return;
    }

    if (!orderData.vendorId) {
      console.error("VendorId is null in orderData:", orderData);
      message.error("Thiếu thông tin nhà cung cấp (vendorId)!");
      router.push("/order");
      return;
    }

    // Kiểm tra stock sản phẩm trước khi gọi API
    const checkStock = async () => {
      try {
        const productId = orderData.orderDetails[0].productId;
        const quantity = orderData.orderDetails[0].quantity;
        const response = await fetch(`/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Không thể kiểm tra tồn kho sản phẩm");
        const product = await response.json();
        if (product.stock < quantity) {
          throw new Error(`Sản phẩm ${product.productName} không đủ hàng (còn ${product.stock})`);
        }
      } catch (error) {
        message.error(error.message);
        router.push("/order");
        return false;
      }
      return true;
    };

    // Giả lập thanh toán sau 10 giây
    console.log("Simulating payment success after 10 seconds...");
    const timer = setTimeout(async () => {
      if (await checkStock()) {
        console.log("Calling createOrder...");
        createOrder();
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [orderId, totalPrice, orderData, token, router]);

  const createOrder = async () => {
    setIsLoading(true);
    try {
      console.log("Creating order request with data:", JSON.stringify(orderData, null, 2));

      // Bước 1: Gọi POST /api/orders để tạo yêu cầu thanh toán và lưu vào Redis
      const requestResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      console.log("Request response status:", requestResponse.status);
      const requestBody = await requestResponse.text();
      console.log("Request response body:", requestBody);

      if (!requestResponse.ok) {
        let errorMessage = "Không thể tạo yêu cầu thanh toán";
        try {
          const errorData = JSON.parse(requestBody);
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          // Không parse được JSON
        }
        throw new Error(errorMessage);
      }

      // Kiểm tra response body là URL QR code
      if (!requestBody.includes("qr.sepay.vn")) {
        throw new Error("Phản hồi không mong đợi từ /api/orders");
      }

      // Bước 2: Mô phỏng webhook để kích hoạt lưu đơn hàng
      console.log("Simulating webhook for order:", orderId);
      const webhookResponse = await fetch("/api/payments/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `Payment for SEVQR ${orderId}`,
          transferAmount: parseInt(totalPrice),
        }),
      });

      console.log("Webhook response status:", webhookResponse.status);
      const webhookBody = await webhookResponse.text();
      console.log("Webhook response body:", webhookBody);

      if (!webhookResponse.ok) {
        throw new Error("Không thể mô phỏng webhook: " + webhookBody);
      }

      // Bước 3: Xác nhận đơn hàng đã được lưu trong database
      const orderCheckResponse = await fetch(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Order check response status:", orderCheckResponse.status);
      if (!orderCheckResponse.ok) {
        throw new Error("Không thể xác nhận đơn hàng trong database");
      }

      message.success("Thanh toán thành công! Đơn hàng đã được tạo.");
      router.push(`/order-success?orderId=${orderId}&orderData=${encodeURIComponent(JSON.stringify(orderData))}`);
    } catch (error) {
      console.error("Lỗi tạo đơn hàng:", error);
      message.error(`Lỗi tạo đơn hàng: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const qrUrl = `https://qr.sepay.vn/img?acc=107872989482&bank=VietinBank&des=SEVQR+${orderId}&amount=${totalPrice}`;

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Quét mã QR để thanh toán</h1>
        <div className="flex justify-center mb-6">
          <img src={qrUrl} alt="QR Code" className="w-64 h-64" />
        </div>
        <p className="text-center text-gray-600 mb-4">
          Số tiền: <span className="font-bold">{parseInt(totalPrice).toLocaleString("vi-VN")} ₫</span>
        </p>
        <p className="text-center text-gray-600 mb-6">
          Vui lòng quét mã QR bằng ứng dụng ngân hàng để thanh toán.
        </p>
        {isLoading && (
          <p className="text-center text-blue-500">Đang xử lý thanh toán...</p>
        )}
      </div>
    </div>
  );
}