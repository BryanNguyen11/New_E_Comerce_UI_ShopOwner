// "use client";

// import { useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { OrderContext } from "@/context/OrderContext";
// import { useAuth } from "@/context/AuthContext";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { message, Input, Select, Form } from "antd";

// const { TextArea } = Input;
// const { Option } = Select;

// export default function OrderPage() {
//   const {
//     tempOrder,
//     deliveryAddress,
//     selectedVoucherId,
//     setDeliveryAddress,
//     setSelectedVoucherId,
//     calculateSubtotal,
//     calculateDiscount,
//     calculateTotal,
//     increaseQuantity,
//     decreaseQuantity,
//     clearTempOrder,
//   } = useContext(OrderContext);
//   const { authState, user } = useAuth();
//   const router = useRouter();
//   const [vouchers, setVouchers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     async function fetchVouchers() {
//       if (tempOrder?.vendorId && authState.token) {
//         try {
//           const response = await fetch(`/api/vouchers/vendor/${tempOrder.vendorId}/available`, {
//             headers: {
//               Authorization: `Bearer ${authState.token}`,
//             },
//           });
//           if (!response.ok) throw new Error("Failed to fetch vouchers");
//           const data = await response.json();
//           console.log("Fetched vouchers:", data);
//           const today = new Date("2025-05-22");
//           const filteredVouchers = data.filter((voucher) => {
//             const startDate = new Date(voucher.startDate);
//             const endDate = new Date(voucher.endDate);
//             const subtotal = calculateSubtotal();
//             return (
//               startDate <= today &&
//               today <= endDate &&
//               voucher.minPriceRequired <= subtotal
//             );
//           });
//           setVouchers(filteredVouchers);
//         } catch (err) {
//           console.error("Error fetching vouchers:", err);
//           message.error("Không thể tải danh sách voucher");
//         }
//       }
//     }
//     fetchVouchers();
//   }, [tempOrder?.vendorId, authState.token, calculateSubtotal]);

//   const handleCheckout = async (values) => {
//     if (!authState.isAuthenticated) {
//       message.warning("Vui lòng đăng nhập để thanh toán!");
//       router.push("/login");
//       return;
//     }

//     if (!tempOrder) {
//       message.error("Không có sản phẩm để thanh toán!");
//       return;
//     }

//     if (tempOrder.quantity > tempOrder.stock) {
//       message.error("Số lượng vượt quá tồn kho!");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const selectedVoucher = vouchers.find((v) => v.voucherId === selectedVoucherId);
//       const totalPrice = calculateTotal(selectedVoucher);

//       const orderData = {
//         orderId: crypto.randomUUID().replace(/-/g, ""),
//         customerId: user.userId,
//         vendorId: tempOrder.vendorId,
//         notes: values.notes || "Thanh toán: Chuyển khoản ngân hàng",
//         deliveryAddress: {
//           recipientName: values.recipientName,
//           recipientPhone: values.recipientPhone,
//           recipientAddress: values.recipientAddress,
//         },
//         orderDetails: [
//           {
//             productId: tempOrder.id,
//             quantity: tempOrder.quantity,
//             price: tempOrder.price,
//             productName: tempOrder.name,
//             productImage: tempOrder.image,
//             firstCategory: tempOrder.firstCategory,
//             secondCategory: tempOrder.secondCategory,
//           },
//         ],
//         voucherId: selectedVoucherId || null,
//         totalPrice: totalPrice,
//       };

//       console.log("Order data:", JSON.stringify(orderData, null, 2));
//       console.log("Auth token:", authState.token);

//       // Chuyển hướng đến trang QR với orderData
//       const qrParams = new URLSearchParams({
//         orderId: orderData.orderId,
//         totalPrice: totalPrice.toString(),
//         orderData: JSON.stringify(orderData),
//         token: authState.token,
//       });

//       router.push(`/qr-payment?${qrParams.toString()}`);
//     } catch (error) {
//       console.error("Lỗi chuẩn bị thanh toán:", error);
//       message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const selectedVoucher = vouchers.find((v) => v.voucherId === selectedVoucherId);

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <Header />

//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold text-gray-700 mb-6">Chi tiết đơn hàng</h1>

//         <div className="bg-white rounded-sm p-6 shadow-md mb-6">
//           <h2 className="text-lg font-medium text-gray-700 mb-4">Thông tin giao hàng</h2>
//           <Form
//             form={form}
//             onFinish={handleCheckout}
//             layout="vertical"
//             initialValues={deliveryAddress}
//           >
//             <Form.Item
//               name="recipientName"
//               label="Tên người nhận"
//               rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
//             >
//               <Input
//                 placeholder="Nhập tên người nhận"
//                 onChange={(e) =>
//                   setDeliveryAddress({ ...deliveryAddress, recipientName: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </Form.Item>
//             <Form.Item
//               name="recipientPhone"
//               label="Số điện thoại"
//               rules={[
//                 { required: true, message: "Vui lòng nhập số điện thoại" },
//                 {
//                   pattern: /^0[35789]\d{8}$/,
//                   message: "Số điện thoại không hợp lệ",
//                 },
//               ]}
//             >
//               <Input
//                 placeholder="Nhập số điện thoại"
//                 onChange={(e) =>
//                   setDeliveryAddress({ ...deliveryAddress, recipientPhone: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </Form.Item>
//             <Form.Item
//               name="recipientAddress"
//               label="Địa chỉ nhận hàng"
//               rules={[{ required: true, message: "Vui lòng nhập địa chỉ nhận hàng" }]}
//             >
//               <TextArea
//                 rows={3}
//                 placeholder="Nhập địa chỉ nhận hàng"
//                 onChange={(e) =>
//                   setDeliveryAddress({ ...deliveryAddress, recipientAddress: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </Form.Item>
//             <Form.Item
//               name="notes"
//               label="Ghi chú"
//               rules={[{ max: 200, message: "Ghi chú không quá 200 ký tự" }]}
//             >
//               <TextArea
//                 rows={3}
//                 placeholder="Nhập ghi chú (tùy chọn)"
//                 disabled={isLoading}
//               />
//             </Form.Item>
//           </Form>
//         </div>

//         <div className="bg-white rounded-sm p-6 shadow-md mb-6">
//           <h2 className="text-lg font-medium text-gray-700 mb-4">Sản phẩm</h2>
//           {!tempOrder ? (
//             <p className="text-gray-500">Không có sản phẩm</p>
//           ) : (
//             <div className="flex items-center justify-between border-b py-4">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={tempOrder.image || "/images/product-placeholder.jpg"}
//                   alt={tempOrder.name}
//                   className="w-16 h-16 object-cover rounded"
//                 />
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-700">{tempOrder.name}</h3>
//                   <p className="text-red-500 font-bold">
//                     {(tempOrder.price || 0).toLocaleString("vi-VN")} ₫
//                   </p>
//                   {tempOrder.firstCategory && (
//                     <p className="text-gray-500 text-sm">{tempOrder.firstCategory}</p>
//                   )}
//                   {tempOrder.secondCategory && (
//                     <p className="text-gray-500 text-sm">{tempOrder.secondCategory}</p>
//                   )}
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => decreaseQuantity(tempOrder.id)}
//                   className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
//                   disabled={isLoading || tempOrder.quantity <= 1}
//                 >
//                   -
//                 </button>
//                 <span>{tempOrder.quantity}</span>
//                 <button
//                   onClick={() => increaseQuantity(tempOrder.id)}
//                   className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
//                   disabled={isLoading || tempOrder.quantity >= tempOrder.stock}
//                 >
//                   +
//                 </button>
//                 <span className="ml-4 text-gray-500">
//                   ({tempOrder.stock} sản phẩm có sẵn)
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="bg-white rounded-sm p-6 shadow-md mb-6">
//           <h2 className="text-lg font-medium text-gray-700 mb-4">Khuyến mãi</h2>
//           <Form.Item label="Chọn Voucher">
//             <Select
//               placeholder="Chọn voucher (tùy chọn)"
//               value={selectedVoucherId}
//               onChange={(value) => setSelectedVoucherId(value)}
//               allowClear
//               disabled={isLoading}
//             >
//               {vouchers.map((voucher) => (
//                 <Option key={voucher.voucherId} value={voucher.voucherId}>
//                   {voucher.voucherName} (
//                   {voucher.voucherType === "PERCENT"
//                     ? `Giảm ${voucher.percentDiscount}%`
//                     : `Giảm ₫${voucher.valueDiscount?.toLocaleString("vi-VN")}`},
//                   Tối thiểu ₫{voucher.minPriceRequired.toLocaleString("vi-VN")})
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//           {selectedVoucherId && (
//             <p className="mt-2 text-green-500">
//               Đã áp dụng: {selectedVoucher?.voucherName} (Giảm ₫
//               {calculateDiscount(selectedVoucher).toLocaleString("vi-VN")})
//             </p>
//           )}
//         </div>

//         <div className="bg-white rounded-sm p-6 shadow-md mb-6">
//           <h2 className="text-lg font-medium text-gray-700 mb-4">Tổng thanh toán</h2>
//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span>Tạm tính:</span>
//               <span>{calculateSubtotal().toLocaleString("vi-VN")} ₫</span>
//             </div>
//             {selectedVoucherId && (
//               <div className="flex justify-between text-green-500">
//                 <span>Giảm giá:</span>
//                 <span>-{calculateDiscount(selectedVoucher).toLocaleString("vi-VN")} ₫</span>
//               </div>
//             )}
//             <div className="flex justify-between font-bold">
//               <span>Tổng cộng:</span>
//               <span>{calculateTotal(selectedVoucher).toLocaleString("vi-VN")} ₫</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-sm p-6 shadow-md">
//           <h2 className="text-lg font-medium text-gray-700 mb-4">Phương thức thanh toán</h2>
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 name="payment"
//                 value="bank_transfer"
//                 checked
//                 readOnly
//                 className="form-radio"
//               />
//               <span>Chuyển khoản ngân hàng</span>
//             </div>
//           </div>
//           <button
//             type="submit"
//             onClick={() => form.submit()}
//             className="mt-6 w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
//             disabled={!tempOrder || isLoading}
//           >
//             {isLoading ? "Đang xử lý..." : "Thanh toán"}
//           </button>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }





"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrderContext } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { message, Input, Select, Form, Button, Radio } from "antd";

const { TextArea } = Input;
const { Option } = Select;

export default function OrderPage() {
  const {
    tempOrder,
    deliveryAddress,
    selectedVoucherId,
    setDeliveryAddress,
    setSelectedVoucherId,
    calculateSubtotal,
    calculateDiscount,
    calculateTotal,
    increaseQuantity,
    decreaseQuantity,
    clearTempOrder,
    setTempOrder, // Thêm setTempOrder từ OrderContext
  } = useContext(OrderContext);
  const { authState, user } = useAuth();
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      if (!tempOrder || !authState.token || !user) return;

      try {
        // Lấy vendorId nếu tempOrder không có
        let vendorId = tempOrder.vendorId;
        if (!vendorId && tempOrder.id) {
          const vendorResponse = await fetch(`/api/users/vendors/${tempOrder.id}`, {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          });
          if (!vendorResponse.ok) throw new Error("Không thể lấy thông tin nhà cung cấp");
          const vendorData = await vendorResponse.json();
          console.log("Fetched vendor:", vendorData);
          vendorId = vendorData.vendorId;
          if (vendorId) {
            setTempOrder({ ...tempOrder, vendorId }); // Cập nhật tempOrder trong context
          } else {
            throw new Error("vendorId không hợp lệ từ API");
          }
        }

        // Lấy danh sách voucher
        const voucherResponse = await fetch(`/api/vouchers/vendor/${vendorId || 'default'}/available`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        if (!voucherResponse.ok) throw new Error("Không thể lấy danh sách voucher");
        const voucherData = await voucherResponse.json();
        console.log("Fetched vouchers:", voucherData);
        const today = new Date("2025-05-22");
        const filteredVouchers = voucherData.filter((voucher) => {
          const startDate = new Date(voucher.startDate);
          const endDate = new Date(voucher.endDate);
          const subtotal = calculateSubtotal();
          return (
            startDate <= today &&
            today <= endDate &&
            voucher.minPriceRequired <= subtotal
          );
        });
        setVouchers(filteredVouchers);

        // Lấy danh sách địa chỉ từ API
        await fetchAddresses();
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        message.error("Không thể tải dữ liệu (voucher, vendor hoặc địa chỉ)");
      }
    }
    fetchData();
  }, [tempOrder, authState.token, user, setDeliveryAddress, form, calculateSubtotal, setTempOrder]);

  const fetchAddresses = async () => {
    try {
      const addressResponse = await fetch(`/api/users/customers/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (!addressResponse.ok) throw new Error("Không thể lấy danh sách địa chỉ");
      const userData = await addressResponse.json();
      console.log("Fetched user data:", userData);
      setAddresses(userData.address || []);
      if (userData.address && userData.address.length > 0 && !selectedAddressId) {
        const defaultAddress = userData.address[0];
        setSelectedAddressId(defaultAddress.addressId);
        setDeliveryAddress({
          recipientName: defaultAddress.recipientName,
          recipientPhone: defaultAddress.recipientPhone,
          recipientAddress: defaultAddress.recipientAddress,
        });
        form.setFieldsValue({
          recipientName: defaultAddress.recipientName,
          recipientPhone: defaultAddress.recipientPhone,
          recipientAddress: defaultAddress.recipientAddress,
        });
      }
    } catch (err) {
      console.error("Lỗi lấy địa chỉ:", err);
      message.error("Không thể tải danh sách địa chỉ");
    }
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddressId(addressId);
    if (addressId === "new") {
      setUseNewAddress(true);
      setDeliveryAddress({});
      form.resetFields(["recipientName", "recipientPhone", "recipientAddress"]);
    } else {
      setUseNewAddress(false);
      const selectedAddress = addresses.find((addr) => addr.addressId === addressId);
      if (selectedAddress) {
        setDeliveryAddress({
          recipientName: selectedAddress.recipientName,
          recipientPhone: selectedAddress.recipientPhone,
          recipientAddress: selectedAddress.recipientAddress,
        });
        form.setFieldsValue({
          recipientName: selectedAddress.recipientName,
          recipientPhone: selectedAddress.recipientPhone,
          recipientAddress: selectedAddress.recipientAddress,
        });
      }
    }
  };

  const handleAddAddress = async () => {
    try {
      const values = await form.validateFields(["recipientName", "recipientPhone", "recipientAddress"]);
      const addressRequest = {
        recipientName: values.recipientName,
        recipientPhone: values.recipientPhone,
        recipientAddress: values.recipientAddress,
        addressType: "NORMAL",
      };

      const response = await fetch(`/api/users/customers/${user.userId}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(addressRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể thêm địa chỉ mới");
      }

      const responseData = await response.json();
      message.success("Thêm địa chỉ mới thành công!");
      await fetchAddresses(); // Cập nhật danh sách địa chỉ
      const newAddress = responseData.address.find(
        (addr) =>
          addr.recipientName === values.recipientName &&
          addr.recipientPhone === values.recipientPhone &&
          addr.recipientAddress === values.recipientAddress
      );
      if (newAddress) {
        setSelectedAddressId(newAddress.addressId);
        setDeliveryAddress({
          recipientName: newAddress.recipientName,
          recipientPhone: newAddress.recipientPhone,
          recipientAddress: newAddress.recipientAddress,
        });
        form.setFieldsValue({
          recipientName: newAddress.recipientName,
          recipientPhone: newAddress.recipientPhone,
          recipientAddress: newAddress.recipientAddress,
        });
      }
      setUseNewAddress(false);
    } catch (error) {
      console.error("Lỗi thêm địa chỉ:", error);
      message.error(`Lỗi thêm địa chỉ: ${error.message}`);
    }
  };

  const handleCheckout = async () => {
    if (!authState.isAuthenticated) {
      message.warning("Vui lòng đăng nhập để thanh toán!");
      router.push("/login");
      return;
    }

    if (!tempOrder) {
      message.error("Không có sản phẩm để thanh toán!");
      return;
    }

    if (tempOrder.quantity > tempOrder.stock) {
      message.error("Số lượng vượt quá tồn kho!");
      return;
    }

    if (!tempOrder.vendorId) {
      message.error("Không tìm thấy thông tin nhà cung cấp (vendor)!");
      return;
    }

    if (!deliveryAddress.recipientName || !deliveryAddress.recipientPhone || !deliveryAddress.recipientAddress) {
      message.error("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    setIsLoading(true);
    try {
      const values = await form.validateFields(["notes"]);
      const selectedVoucher = vouchers.find((v) => v.voucherId === selectedVoucherId);
      const totalPrice = calculateTotal(selectedVoucher);

      const orderData = {
        orderId: crypto.randomUUID().replace(/-/g, ""),
        customerId: user.userId,
        vendorId: tempOrder.vendorId,
        notes: values.notes || "Thanh toán: Chuyển khoản ngân hàng",
        deliveryAddress: {
          recipientName: deliveryAddress.recipientName,
          recipientPhone: deliveryAddress.recipientPhone,
          recipientAddress: deliveryAddress.recipientAddress,
        },
        orderDetails: [
          {
            productId: tempOrder.id,
            quantity: tempOrder.quantity,
            price: tempOrder.price,
            productName: tempOrder.name,
            productImage: tempOrder.image,
            firstCategory: tempOrder.firstCategory,
            secondCategory: tempOrder.secondCategory,
          },
        ],
        voucherId: selectedVoucherId || null,
        totalPrice: totalPrice,
      };

      console.log("Order data:", JSON.stringify(orderData, null, 2));
      console.log("Auth token:", authState.token);

      // Chuyển hướng đến trang QR với orderData
      const qrParams = new URLSearchParams({
        orderId: orderData.orderId,
        totalPrice: totalPrice.toString(),
        orderData: JSON.stringify(orderData),
        token: authState.token,
      });

      router.push(`/qr-payment?${qrParams.toString()}`);
    } catch (error) {
      console.error("Lỗi chuẩn bị thanh toán:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVoucher = vouchers.find((v) => v.voucherId === selectedVoucherId);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Chi tiết đơn hàng</h1>

        <div className="bg-white rounded-sm p-6 shadow-md mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Thông tin giao hàng</h2>
          <Form
            form={form}
            onFinish={handleCheckout}
            layout="vertical"
            initialValues={deliveryAddress}
          >
            <Form.Item label="Chọn địa chỉ giao hàng">
              <Select
                value={selectedAddressId}
                onChange={handleAddressChange}
                placeholder="Chọn địa chỉ"
                disabled={isLoading}
              >
                {addresses.map((address) => (
                  <Option key={address.addressId} value={address.addressId}>
                    {`${address.recipientName} - ${address.recipientPhone} - ${address.recipientAddress}`}
                  </Option>
                ))}
                <Option value="new">Thêm địa chỉ mới</Option>
              </Select>
            </Form.Item>

            {useNewAddress && (
              <>
                <Form.Item
                  name="recipientName"
                  label="Tên người nhận"
                  rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
                >
                  <Input
                    placeholder="Nhập tên người nhận"
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, recipientName: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </Form.Item>
                <Form.Item
                  name="recipientPhone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^0[35789]\d{8}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập số điện thoại"
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, recipientPhone: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </Form.Item>
                <Form.Item
                  name="recipientAddress"
                  label="Địa chỉ nhận hàng"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ nhận hàng" }]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Nhập địa chỉ nhận hàng"
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, recipientAddress: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="default"
                    onClick={handleAddAddress}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Thêm địa chỉ
                  </Button>
                </Form.Item>
              </>
            )}

            <Form.Item
              name="notes"
              label="Ghi chú"
              rules={[{ max: 200, message: "Ghi chú không quá 200 ký tự" }]}
            >
              <TextArea
                rows={3}
                placeholder="Nhập ghi chú (tùy chọn)"
                disabled={isLoading}
              />
            </Form.Item>
          </Form>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-md mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Sản phẩm</h2>
          {!tempOrder ? (
            <p className="text-gray-500">Không có sản phẩm</p>
          ) : (
            <div className="flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-4">
                <img
                  src={tempOrder.image || "/images/product-placeholder.jpg"}
                  alt={tempOrder.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">{tempOrder.name}</h3>
                  <p className="text-red-500 font-bold">
                    {(tempOrder.price || 0).toLocaleString("vi-VN")} ₫
                  </p>
                  {tempOrder.firstCategory && (
                    <p className="text-gray-500 text-sm">{tempOrder.firstCategory}</p>
                  )}
                  {tempOrder.secondCategory && (
                    <p className="text-gray-500 text-sm">{tempOrder.secondCategory}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => decreaseQuantity(tempOrder.id)}
                  className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
                  disabled={isLoading || tempOrder.quantity <= 1}
                >
                  -
                </button>
                <span>{tempOrder.quantity}</span>
                <button
                  onClick={() => increaseQuantity(tempOrder.id)}
                  className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
                  disabled={isLoading || tempOrder.quantity >= tempOrder.stock}
                >
                  +
                </button>
                <span className="ml-4 text-gray-500">
                  ({tempOrder.stock} sản phẩm có sẵn)
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-sm p-6 shadow-md mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Khuyến mãi</h2>
          <Form.Item label="Chọn Voucher">
            <Select
              placeholder="Chọn voucher (tùy chọn)"
              value={selectedVoucherId}
              onChange={(value) => setSelectedVoucherId(value)}
              allowClear
              disabled={isLoading}
            >
              {vouchers.map((voucher) => (
                <Option key={voucher.voucherId} value={voucher.voucherId}>
                  {voucher.voucherName} (
                  {voucher.voucherType === "PERCENT"
                    ? `Giảm ${voucher.percentDiscount}%`
                    : `Giảm ₫${voucher.valueDiscount?.toLocaleString("vi-VN")}`},
                  Tối thiểu ₫{voucher.minPriceRequired.toLocaleString("vi-VN")})
                </Option>
              ))}
            </Select>
          </Form.Item>
          {selectedVoucherId && (
            <p className="mt-2 text-green-500">
              Đã áp dụng: {selectedVoucher?.voucherName} (Giảm ₫
              {calculateDiscount(selectedVoucher).toLocaleString("vi-VN")})
            </p>
          )}
        </div>

        <div className="bg-white rounded-sm p-6 shadow-md mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Tổng thanh toán</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{calculateSubtotal().toLocaleString("vi-VN")} ₫</span>
            </div>
            {selectedVoucherId && (
              <div className="flex justify-between text-green-500">
                <span>Giảm giá:</span>
                <span>-{calculateDiscount(selectedVoucher).toLocaleString("vi-VN")} ₫</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Tổng cộng:</span>
              <span>{calculateTotal(selectedVoucher).toLocaleString("vi-VN")} ₫</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-md">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Phương thức thanh toán</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Radio value="bank_transfer" checked disabled>
                Chuyển khoản ngân hàng
              </Radio>
            </div>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={isLoading}
              disabled={!tempOrder || isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
            >
              {isLoading ? "Đang xử lý..." : "Thanh toán"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


// "use client";

// import { useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { OrderContext } from "@/context/OrderContext";
// import { useAuth } from "@/context/AuthContext";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { message, Input, Select, Form, Button, Radio } from "antd";

// const { TextArea } = Input;
// const { Option } = Select;

// export default function OrderPage() {
//   const {
//     tempOrder,
//     deliveryAddress,
//     selectedVoucherId,
//     setDeliveryAddress,
//     setSelectedVoucherId,
//     calculateSubtotal,
//     calculateDiscount,
//     calculateTotal,
//     increaseQuantity,
//     decreaseQuantity,
//     clearTempOrder,
//   } = useContext(OrderContext);
//   const { authState, user } = useAuth();
//   const router = useRouter();
//   const [vouchers, setVouchers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [useNewAddress, setUseNewAddress] = useState(false);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     async function fetchData() {
//       if (!tempOrder || !authState.token || !user) return;

//       try {
//         // Lấy vendorId nếu tempOrder không có
//         let vendorId = tempOrder.vendorId;
//         if (!vendorId && tempOrder.id) {
//           const vendorResponse = await fetch(`/api/users/vendors/${tempOrder.id}`, {
//             headers: {
//               Authorization: `Bearer ${authState.token}`,
//             },
//           });
//           if (!vendorResponse.ok) throw new Error("Không thể lấy thông tin nhà cung cấp");
//           const vendorData = await vendorResponse.json();
//           console.log("Fetched vendor:", vendorData);
//           vendorId = vendorData.vendorId;
//           tempOrder.vendorId = vendorId; // Cập nhật tempOrder
//         }

//         // Lấy danh sách voucher
//         const voucherResponse = await fetch(`/api/vouchers/vendor/${vendorId || 'default'}/available`, {
//           headers: {
//             Authorization: `Bearer ${authState.token}`,
//           },
//         });
//         if (!voucherResponse.ok) throw new Error("Không thể lấy danh sách voucher");
//         const voucherData = await voucherResponse.json();
//         console.log("Fetched vouchers:", voucherData);
//         const today = new Date("2025-05-22");
//         const filteredVouchers = voucherData.filter((voucher) => {
//           const startDate = new Date(voucher.startDate);
//           const endDate = new Date(voucher.endDate);
//           const subtotal = calculateSubtotal();
//           return (
//             startDate <= today &&
//             today <= endDate &&
//             voucher.minPriceRequired <= subtotal
//           );
//         });
//         setVouchers(filteredVouchers);

//         // Lấy danh sách địa chỉ từ API
//         await fetchAddresses();
//       } catch (err) {
//         console.error("Lỗi lấy dữ liệu:", err);
//         message.error("Không thể tải dữ liệu (voucher, vendor hoặc địa chỉ)");
//       }
//     }
//     fetchData();
//   }, [tempOrder, authState.token, user, setDeliveryAddress, form, calculateSubtotal]);

//   const fetchAddresses = async () => {
//     try {
//       const addressResponse = await fetch(`/api/users/customers/${user.userId}`, {
//         headers: {
//           Authorization: `Bearer ${authState.token}`,
//         },
//       });
//       if (!addressResponse.ok) throw new Error("Không thể lấy danh sách địa chỉ");
//       const userData = await addressResponse.json();
//       console.log("Fetched user data:", userData);
//       setAddresses(userData.address || []);
//       if (userData.address && userData.address.length > 0 && !selectedAddressId) {
//         const defaultAddress = userData.address[0];
//         setSelectedAddressId(defaultAddress.addressId);
//         setDeliveryAddress({
//           recipientName: defaultAddress.recipientName,
//           recipientPhone: defaultAddress.recipientPhone,
//           recipientAddress: defaultAddress.recipientAddress,
//         });
//         form.setFieldsValue({
//           recipientName: defaultAddress.recipientName,
//           recipientPhone: defaultAddress.recipientPhone,
//           recipientAddress: defaultAddress.recipientAddress,
//         });
//       }
//     } catch (err) {
//       console.error("Lỗi lấy địa chỉ:", err);
//       message.error("Không thể tải danh sách địa chỉ");
//     }
//   };

//   const handleAddressChange = (addressId) => {
//     setSelectedAddressId(addressId);
//     if (addressId === "new") {
//       setUseNewAddress(true);
//       setDeliveryAddress({});
//       form.resetFields(["recipientName", "recipientPhone", "recipientAddress"]);
//     } else {
//       setUseNewAddress(false);
//       const selectedAddress = addresses.find((addr) => addr.addressId === addressId);
//       if (selectedAddress) {
//         setDeliveryAddress({
//           recipientName: selectedAddress.recipientName,
//           recipientPhone: selectedAddress.recipientPhone,
//           recipientAddress: selectedAddress.recipientAddress,
//         });
//         form.setFieldsValue({
//           recipientName: selectedAddress.recipientName,
//           recipientPhone: selectedAddress.recipientPhone,
//           recipientAddress: selectedAddress.recipientAddress,
//         });
//       }
//     }
//   };

//   const handleAddAddress = async () => {
//     try {
//       const values = await form.validateFields(["recipientName", "recipientPhone", "recipientAddress"]);
//       const addressRequest = {
//         recipientName: values.recipientName,
//         recipientPhone: values.recipientPhone,
//         recipientAddress: values.recipientAddress,
//         addressType: "NORMAL",
//       };

//       const response = await fetch(`/api/users/customers/${user.userId}/address`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authState.token}`,
//         },
//         body: JSON.stringify(addressRequest),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Không thể thêm địa chỉ mới");
//       }

//       const responseData = await response.json();
//       message.success("Thêm địa chỉ mới thành công!");
//       await fetchAddresses(); // Cập nhật danh sách địa chỉ
//       const newAddress = responseData.address.find(addr => addr.recipientName === values.recipientName && addr.recipientPhone === values.recipientPhone && addr.recipientAddress === values.recipientAddress);
//       if (newAddress) {
//         setSelectedAddressId(newAddress.addressId);
//         setDeliveryAddress({
//           recipientName: newAddress.recipientName,
//           recipientPhone: newAddress.recipientPhone,
//           recipientAddress: newAddress.recipientAddress,
//         });
//         form.setFieldsValue({
//           recipientName: newAddress.recipientName,
//           recipientPhone: newAddress.recipientPhone,
//           recipientAddress: newAddress.recipientAddress,
//         });
//       }
//       setUseNewAddress(false);
//     } catch (error) {
//       console.error("Lỗi thêm địa chỉ:", error);
//       message.error(`Lỗi thêm địa chỉ: ${error.message}`);
//     }
//   };

//   const handleCheckout = async () => {
//     if (!authState.isAuthenticated) {
//       message.warning("Vui lòng đăng nhập để thanh toán!");
//       router.push("/login");
//       return;
//     }

//     if (!tempOrder) {
//       message.error("Không có sản phẩm để thanh toán!");
//       return;
//     }

//     if (tempOrder.quantity > tempOrder.stock) {
//       message.error("Số lượng vượt quá tồn kho!");
//       return;
//     }

//     if (!tempOrder.vendorId) {
//       message.error("Không tìm thấy thông tin nhà cung cấp (vendor)!");
//       return;
//     }

//     if (!deliveryAddress.recipientName || !deliveryAddress.recipientPhone || !deliveryAddress.recipientAddress) {
//       message.error("Vui lòng điền đầy đủ thông tin giao hàng!");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const values = await form.validateFields(["notes"]);
//       const selectedVoucher = vouchers.find((v) => v.voucherId === selectedVoucherId);
//       const totalPrice = calculateTotal(selectedVoucher);

//       const orderData = {
//         orderId: crypto.randomUUID().replace(/-/g, ""),
//         customerId: user.userId,
//         vendorId: tempOrder.vendorId,
//         notes: values.notes || "Thanh toán: Chuyển khoản ngân hàng",
//         deliveryAddress: {
//           recipientName: deliveryAddress.recipientName,
//           recipientPhone: deliveryAddress.recipientPhone,
//           recipientAddress: deliveryAddress.recipientAddress,
//         },
//         orderDetails: [
//           {
//             productId: tempOrder.id,
//             quantity: tempOrder.quantity,
//             price: tempOrder.price,
//             productName: tempOrder.name,
//             productImage: tempOrder.image,
//             firstCategory: tempOrder.firstCategory,
//             secondCategory: tempOrder.secondCategory,
//           },
//         ],
//         voucherId: selectedVoucherId || null,
//         totalPrice: totalPrice,
//       };

//       console.log("Order data:", JSON.stringify(orderData, null, 2));
//       console.log("Auth token:", authState.token);

//       // Chuyển hướng đến trang QR với orderData
//       const qrParams = new URLSearchParams({
//         orderId: orderData.orderId,
//         totalPrice: totalPrice.toString(),
//         orderData: JSON.stringify(orderData),
//         token: authState.token,
//       });

//       router.push(`/qr-payment?${qrParams.toString()}`);
//     } catch (error) {
//       console.error("Lỗi chuẩn bị thanh toán:", error);
//       message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const selectedVoucher = vouchers.find((v) => v.voucherId === selectedVoucherId);

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <Header />

//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold text-gray-700 mb-6">Chi tiết đơn hàng</h1>

//         <div className="bg-white rounded-sm p-6 shadow-md mb-6">
//           <h2 className="text-lg font-medium text-gray-700 mb-4">Thông tin giao hàng</h2>
//           <Form
//             form={form}
//             onFinish={handleCheckout}
//             layout="vertical"
//             initialValues={deliveryAddress}
//           >
//             <Form.Item label="Chọn địa chỉ giao hàng">
//               <Select
//                 value={selectedAddressId}
//                 onChange={handleAddressChange}
//                 placeholder="Chọn địa chỉ"
//                 disabled={isLoading}
//               >
//                 {addresses.map((address) => (
//                   <Option key={address.addressId} value={address.addressId}>
//                     {`${address.recipientName} - ${address.recipientPhone} - ${address.recipientAddress}`}
//                   </Option>
//                 ))}
//                 <Option value="new">Thêm địa chỉ mới</Option>
//               </Select>
//             </Form.Item>

//             {useNewAddress && (
//               <>
//                 <Form.Item
//                   name="recipientName"
//                   label="Tên người nhận"
//                   rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
//                 >
//                   <Input
//                     placeholder="Nhập tên người nhận"
//                     onChange={(e) =>
//                       setDeliveryAddress({ ...deliveryAddress, recipientName: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </Form.Item>
//                 <Form.Item
//                   name="recipientPhone"
//                   label="Số điện thoại"
//                   rules={[
//                     { required: true, message: "Vui lòng nhập số điện thoại" },
//                     {
//                       pattern: /^0[35789]\d{8}$/,
//                       message: "Số điện thoại không hợp lệ",
//                     },
//                   ]}
//                 >
//                   <Input
//                     placeholder="Nhập số điện thoại"
//                     onChange={(e) =>
//                       setDeliveryAddress({ ...deliveryAddress, recipientPhone: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </Form.Item>
//                 <Form.Item
//                   name="recipientAddress"
//                   label="Địa chỉ nhận hàng"
//                   rules={[{ required: true, message: "Vui lòng nhập địa chỉ nhận hàng" }]}
//                 >
//                   <TextArea
//                     rows={3}
//                     placeholder="Nhập địa chỉ nhận hàng"
//                     onChange={(e) =>
//                       setDeliveryAddress({ ...deliveryAddress, recipientAddress: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </Form.Item>
//                 <Form.Item>
//                   <Button
//                     type="default"
//                     onClick={handleAddAddress}
//                     disabled={isLoading}
//                     className="w-full"
//                   >
//                     Thêm địa chỉ
//                   </Button>
//                 </Form.Item>
//               </>
//             )}

//             <Form.Item
//               name="notes"
//               label="Ghi chú"
//               rules={[{ max: 200, message: "Ghi chú không quá 200 ký tự" }]}
//             >
//               <TextArea
//                 rows={3}
//                 placeholder="Nhập ghi chú (tùy chọn)"
//                 disabled={isLoading}
//               />
//             </Form.Item>

//             <Form.Item>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={isLoading}
//                 disabled={!tempOrder || isLoading}
//                 className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
//               >
//                 {isLoading ? "Đang xử lý..." : "Thanh toán"}
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>

//         <div className="bg-white rounded-sm p-6 shadow-md mb-6">
//           <h2 className="text-lg font-medium text-gray-700 mb-4">Sản phẩm</h2>
//           {!tempOrder ? (
//             <p className="text-gray-500">Không có sản phẩm</p>
//           ) : (
//             <div className="flex items-center justify-between border-b py-4">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={tempOrder.image || "/images/product-placeholder.jpg"}
//                   alt={tempOrder.name}
//                   className="w-16 h-16 object-cover rounded"
//                 />
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-700">{tempOrder.name}</h3>
//                   <p className="text-red-500 font-bold">
//                     {(tempOrder.price || 0).toLocaleString("vi-VN")} ₫
//                   </p>
//                   {tempOrder.firstCategory && (
//                     <p className="text-gray-500 text-sm">{tempOrder.firstCategory}</p>
//                   )}
//                   {tempOrder.secondCategory && (
//                     <p className="text-gray-500 text-sm">{tempOrder.secondCategory}</p>
//                   )}
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => decreaseQuantity(tempOrder.id)}
//                   className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
//                   disabled={isLoading || tempOrder.quantity <= 1}
//                 >
//                   -
//                 </button>
//                 <span>{tempOrder.quantity}</span>
//                 <button
//                   onClick={() => increaseQuantity(tempOrder.id)}
//                   className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
//                   disabled={isLoading || tempOrder.quantity >= tempOrder.stock}
//                 >
//                   +
//                 </button>
//                 <span className="ml-4 text-gray-500">
//                   ({tempOrder.stock} sản phẩm có sẵn)
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="bg-white rounded-sm p-6 shadow-md mb-6">
//           <h2 className="text-lg font-medium text-gray-700 mb-4">Khuyến mãi</h2>
//           <Form.Item label="Chọn Voucher">
//             <Select
//               placeholder="Chọn voucher (tùy chọn)"
//               value={selectedVoucherId}
//               onChange={(value) => setSelectedVoucherId(value)}
//               allowClear
//               disabled={isLoading}
//             >
//               {vouchers.map((voucher) => (
//                 <Option key={voucher.voucherId} value={voucher.voucherId}>
//                   {voucher.voucherName} (
//                   {voucher.voucherType === "PERCENT"
//                     ? `Giảm ${voucher.percentDiscount}%`
//                     : `Giảm ₫${voucher.valueDiscount?.toLocaleString("vi-VN")}`},
//                   Tối thiểu ₫{voucher.minPriceRequired.toLocaleString("vi-VN")})
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//           {selectedVoucherId && (
//             <p className="mt-2 text-green-500">
//               Đã áp dụng: {selectedVoucher?.voucherName} (Giảm ₫
//               {calculateDiscount(selectedVoucher).toLocaleString("vi-VN")})
//             </p>
//           )}
//         </div>

//         <div className="bg-white rounded-sm p-6 shadow-md mb-6">
//           <h2 className="text-lg font-medium text-gray-700 mb-4">Tổng thanh toán</h2>
//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span>Tạm tính:</span>
//               <span>{calculateSubtotal().toLocaleString("vi-VN")} ₫</span>
//             </div>
//             {selectedVoucherId && (
//               <div className="flex justify-between text-green-500">
//                 <span>Giảm giá:</span>
//                 <span>-{calculateDiscount(selectedVoucher).toLocaleString("vi-VN")} ₫</span>
//               </div>
//             )}
//             <div className="flex justify-between font-bold">
//               <span>Tổng cộng:</span>
//               <span>{calculateTotal(selectedVoucher).toLocaleString("vi-VN")} ₫</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-sm p-6 shadow-md">
//           <h2 className="text-lg font-medium text-gray-700 mb-4">Phương thức thanh toán</h2>
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Radio
//                 value="bank_transfer"
//                 checked
//                 disabled
//               >
//                 Chuyển khoản ngân hàng
//               </Radio>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }