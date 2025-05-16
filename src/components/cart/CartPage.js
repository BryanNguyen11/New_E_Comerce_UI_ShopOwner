"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaShoppingBag,
  FaCheck,
  FaArrowRight,
  FaAngleLeft,
} from "react-icons/fa";
import AuthStatus from "@/components/AuthStatus";
import { useAuth } from "@/context/AuthContext";
import CartWrapper from "./CartWrapper";
import CartItem from "./CartItem";
import { message } from "antd";
import "@ant-design/v5-patch-for-react-19";

export default function CartPage() {
  const { user, authState } = useAuth();
  // vendor
  // cartDetail
  const [cartItems, setCartItems] = useState([]);
  const [vendorPerCartItems, setVendorPerCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [updateTimers, setUpdateTimers] = useState({});

  const [step, setStep] = useState("cart"); // 'cart', 'voucher', 'payment', 'confirmation'
  const [fetchingVouchers, setFetchingVouchers] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [selectedVouchers, setSelectedVouchers] = useState({});
  const [shopInfo, setShopInfo] = useState({});
  const [qrCodeImage, setQrCodeImage] = useState(
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PaymentURL"
  );

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [fetchingCustomer, setFetchingCustomer] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    isDefault: false, // Changed from addressType to isDefault
  });
  const [orderId, setOrderId] = useState(null);


  const handleCheckOrderStatus = () =>{
    fetch(`/api/orders/${orderId}/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch order status");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Order status:", data);

        message.success("Order status created successfully");
        
      })
      .catch((error) => {
        console.error("Error fetching order status:", error);
        message.error("Failed to fetch order status");
      });
  }

  // Function to delete an address
  const handleDeleteAddress = (addressId) => {
    // In a real app, you would call an API to delete the address
    setAddresses((prev) => prev.filter((addr) => addr.addressId !== addressId));

    // If we're deleting the currently selected address, select another one
    if (addressId === selectedAddressId && addresses.length > 1) {
      const remainingAddresses = addresses.filter(
        (addr) => addr.addressId !== addressId
      );
      if (remainingAddresses.length > 0) {
        setSelectedAddressId(remainingAddresses[0].addressId);
        setSubmittedAddress(remainingAddresses[0]);
      }
    }

    fetch(`/api/users/customers/${user.userId}/address/${addressId}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to delete address");
      }
      message.success("Địa chỉ đã được xóa");
    })
    .catch((error) => {
      console.error("Error deleting address:", error);
      message.error("Failed to delete address");
    });
  };

  // Function to set an address as default
  const handleSetDefaultAddress = async (addressId) => {
    // In a real app, you would call an API to update the default address
    setAddresses((prev) =>
      prev.map((addr) => {
        if (addr.addressId === addressId) {
          return { ...addr, addressType: "DEFAULT" };
        } else if (addr.addressType === "DEFAULT") {
          return { ...addr, addressType: "NORMAL" };
        } else {
          return addr;
        }
      })
    );

    const selectedAddress = {
      ...addresses.find((addr) => addr.addressId === addressId),
      addressType: "DEFAULT",
    };

    const defaultAddresses = addresses
      .filter((addr) => addr.addressType === "DEFAULT")
      .map((temp) => ({ ...temp, addressType: "NORMAL" }));

    // setFetchingCustomer(true);
    for (const addr of defaultAddresses) {
      try {
        const response = await fetch(
          `/api/users/customers/${user.userId}/address/${addr.addressId}/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authState.token}`,
            },
            body: JSON.stringify(addr),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to update address ${addr.addressId}`);
        }
      } catch (error) {
        console.error("Error updating address:", error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo cho người dùng)
      }
    }
    fetch(
      `/api/users/customers/${user.userId}/address/${selectedAddress.addressId}/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(selectedAddress),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to set default address");
        }
        return res.json();
      })
      .then((data) => {
        // setAddresses(data.address);
        // setFetchingCustomer(false);
        message.success("Đã đặt địa chỉ mặc định");
      })
      .catch((e) => {
        message.error("update address type that bai");
      });
  };

  // New states for shipping and payment
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  useEffect(() => {
    if (!user) {
      console.error("User not found");
      return;
    }
    if (!authState.token) {
      console.error("Token not found");
      return;
    }
    // Initialize SSE connections
    const eventSource = new EventSource(
      `/api/cart-detail/customer/${user.userId}?token=${authState.token}`,
      {}
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setCartItems((prev) => [...prev, data]);
        setVendorPerCartItems((prev) => {
          const existingVendor = prev.find(
            (v) => v.vendorId === data.product.vendorId
          );
          if (existingVendor) {
            return prev.map((v) =>
              v.vendorId === data.product.vendorId
                ? { ...v, cartDetail: [...v.cartDetail, data] }
                : v
            );
          } else {
            return [
              ...prev,
              { vendorId: data.product.vendorId, cartDetail: [data] },
            ];
          }
        });
        console.log("SSE data:", data);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      // setError('Error connecting to real-time updates');
      setLoading(false);
      eventSource.close();
    };

    return () => {
      setLoading(false);
      eventSource.close();
    };
  }, [user]);

  // Fixed functions
  const handleQuantityChange = (id, change) => {
    const currentItem = cartItems.find((item) => item.cartDetailId === id);
    const newQuantity = Math.max(1, currentItem.quantity + change);

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartDetailId === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
              totalPrice:
                Math.max(1, item.quantity + change) * item.product.price,
            }
          : item
      )
    );

    setVendorPerCartItems((prevItems) => {
      const updatedVendors = prevItems.map((vendor) => {
        const updatedCartDetail = vendor.cartDetail.map((item) =>
          item.cartDetailId === id
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + change),
                totalPrice:
                  Math.max(1, item.quantity + change) * item.product.price,
              }
            : item
        );
        return {
          ...vendor,
          cartDetail: updatedCartDetail,
        };
      });
      return updatedVendors.filter((vendor) => vendor.cartDetail.length > 0);
    });

    // Clear any existing timer for this item
    if (updateTimers[id]) {
      clearTimeout(updateTimers[id]);
    }

    // Set new timer for API call with 1 second delay
    const newTimer = setTimeout(() => {
      fetch(`/api/cart-detail/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            message.error("Failed to update item quantity");
            return response.json().then((data) => {
              console.error("Error details:", data);
              throw new Error("Network response was not ok");
            });
          }
          return response.json();
        })
        .then((data) => {
          message.success("Successfully updated cart item", data);
        })
        .catch((error) => {
          console.error("Error updating cart item:", error);
          // Optional: Revert UI state on error or refetch cart data
        })
        .finally(() => {
          // Remove this timer from the timers object
          setUpdateTimers((prev) => {
            const newTimers = { ...prev };
            delete newTimers[id];
            return newTimers;
          });
        });
    }, 1000); // 1 second delay

    // Store the timer reference
    setUpdateTimers((prev) => ({
      ...prev,
      [id]: newTimer,
    }));
  };

  const handleRemoveItem = (id) => {
    // setCartItems(prevItems => prevItems.filter(item => item.cartDetailId !== id));
    setVendorPerCartItems((prevItems) => {
      const updatedVendors = prevItems.map((vendor) => {
        const updatedCartDetail = vendor.cartDetail.filter(
          (item) => item.cartDetailId !== id
        );
        return {
          ...vendor,
          cartDetail: updatedCartDetail,
        };
      });
      return updatedVendors.filter((vendor) => vendor.cartDetail.length > 0);
    });

    fetch(`/api/cart-detail/${id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
    }).then((response) => {
      if (!response.ok) {
        message.error("Failed to remove item from cart");
        response.json().then((data) => {
          console.error("Error details:", data);
        });
        throw new Error("Network response was not ok");
      }
      message.success("Item removed from cart");
    });

    setSelectedItems((prevItems) =>
      prevItems.filter((itemId) => itemId !== id)
    );
  };

  // New functions for selection and steps
  const toggleSelectItem = (cartDetailId) => {
    setSelectedItems((prev) => {
      if (prev.includes(cartDetailId)) {
        return prev.filter((id) => id !== cartDetailId);
      } else {
        const currentItem = cartItems.find(
          (item) => item.cartDetailId === cartDetailId
        );
        const vendorId = currentItem.product.vendorId;
        if (prev.length > 0) {
          const firstItem = cartItems.find(
            (item) => item.cartDetailId === prev[0]
          );
          const firstVendorId = firstItem.product.vendorId;
          if (firstVendorId !== vendorId) {
            // If the first selected item is from a different vendor, clear the selection
            return [cartDetailId];
          }
        }
        return [...prev, cartDetailId];
        // const newSelectedItems = cartItems
        //   .filter((item) => item.product.vendorId === vendorId)
        //   .map((item) => item.cartDetailId);
        // return [...prev.filter((id) => !newSelectedItems.includes(id)), ...newSelectedItems];
      }
    });
  };

  const fetchShopInfo = async (vendorId) => {
    try {
      const response = await fetch(`/api/users/vendors/${vendorId}/info`, {
        method: "GET",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch shop info");
      }
      const data = await response.json();
      setShopInfo(data);
      console.log("Shop info:", data);
    } catch (error) {
      console.error("Error fetching shop info:", error);
      message.error("Failed to fetch shop info");
    }
  };

  const fetchCustomerInfo = async (customerId) => {
    try {
      const response = await fetch(`/api/users/customers/${customerId}/info`, {
        method: "GET",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch customer info");
      }
      const data = await response.json();
      setAddresses(data.address);
      if (data.address) {
        data.address.forEach((address) => {
          if (address.isDefault) {
            setSelectedAddressId(address.addressId);
            setSubmittedAddress(address);
          }
        });
      }
      setFetchingCustomer(false);
      // setFetch
      console.log("Customer info:", data);
    } catch (error) {
      console.error("Error fetching customer info:", error);
      message.error("Failed to fetch customer info");
    }
  };

  const fetchVoucherByVendor = async (vendorId) => {
    try {
      const response = await fetch(
        `/api/vouchers/vendor/${vendorId}/available`,
        {
          method: "GET",
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch vouchers");
      }
      const data = await response.json();
      setAvailableVouchers(data);
      console.log("Available vouchers:", data);
      setFetchingVouchers(false);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      message.error("Failed to fetch vouchers");
    }
  };

  const handleProceedToVouchers = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }
    const vendorId = cartItems.find((item) =>
      selectedItems.includes(item.cartDetailId)
    ).product.vendorId;

    fetchShopInfo(vendorId);
    fetchVoucherByVendor(vendorId);
    setStep("voucher");
    setFetchingVouchers(true);
  };

  const handleBackToCart = () => {
    setStep("cart");
  };

  const handleProceedToPayment = () => {
    setAddresses([]);
    fetchCustomerInfo(user.userId);
    setFetchingCustomer(true);
    // Move to payment step
    setStep("payment");
  };

  const selectVoucher = (vendorId, voucherId) => {
    setSelectedVouchers((prev) => {
      if (prev[vendorId] === voucherId) {
        // If already selected, deselect it
        const newVouchers = { ...prev };
        delete newVouchers[vendorId];
        return newVouchers;
      } else {
        return { ...prev, [vendorId]: voucherId };
      }
    });
  };

  // Handle final order submission
  const handleSubmitOrder = () => {
    if (!selectedAddressId) {
      message.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    const submittedAddress = addresses.find(
      (address) => address.addressId === selectedAddressId
    );

    setIsProcessingOrder(true);

    // Structure the order data

    const orderId = crypto.randomUUID().replace(/-/g, '');
    setOrderId(orderId);
    let orderData = {
      orderId,
      customerId: user?.userId,
      vendorId: shopInfo.userId,
      deliveryAddress: {
        ...submittedAddress,
      },
      orderDetails: selectedItems.map((itemId) => {
        const item = cartItems.find((item) => item.cartDetailId === itemId);
        return {
          productId: item.product.productId,
          quantity: item.quantity,
          firstCategory: item.firstCategory,
          secondCategory: item.secondCategory
        };
      }),
      totalPrice: selectedItemsTotal - calculateDiscounts(),
      status: "PENDING",
    };
    if (selectedVouchers[shopInfo.userId]){
      orderData = {...orderData, voucherId: selectedVouchers[shopInfo.userId]}
    }

    console.log(orderData);
    console.log('selected voucher: ', selectedVouchers)


    fetch('/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState.token}`,
      },
      body: JSON.stringify(orderData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      return response.text();
    })
    .then(data => {
      setQrCodeImage(data);
      setIsProcessingOrder(false);
      setStep("confirmation");
    })
    .catch(error => {
      console.error('Error creating order:', error);
      message.error('Failed to create order');
      setIsProcessingOrder(false);
    });

    
    

    // // Mock API call to create order
    // setTimeout(() => {
    //   console.log("Order submitted:", orderData);
    //   message.success("Đơn hàng đã được tạo thành công!");
    //   setIsProcessingOrder(false);

    //   // Redirect to confirmation step
    //   setStep("confirmation");
    // }, 2000);
  };

  // Helper function to group cart items by vendor
  const groupItemsByVendor = useMemo(() => {
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.cartDetailId)
    );

    return selectedCartItems.reduce((groups, item) => {
      const vendorId = item.product.vendorId;
      if (!groups[vendorId]) {
        groups[vendorId] = {
          vendorName: shopInfo.shopName || "Cửa hàng không tên",
          vendorId: shopInfo.userId,
          items: [],
          totalAmount: 0,
        };
      }
      groups[vendorId].items.push(item);
      groups[vendorId].totalAmount += item.totalPrice;
      return groups;
    }, {});
  }, [cartItems, selectedItems, shopInfo]);

  // Calculate discounts based on selected vouchers
  const calculateDiscounts = () => {
    let totalDiscount = 0;

    Object.entries(selectedVouchers).forEach(([vendorId, voucherId]) => {
      const voucher = availableVouchers.find((v) => v.voucherId === voucherId);
      const vendorGroup = groupItemsByVendor[vendorId];

      if (
        voucher &&
        vendorGroup &&
        vendorGroup.totalAmount >= voucher.minPriceRequired
      ) {
        if (voucher.voucherType === "PERCENT" && voucher.percentDiscount) {
          totalDiscount +=
            (vendorGroup.totalAmount * voucher.percentDiscount) / 100;
        } else if (voucher.voucherType === "VALUE" && voucher.valueDiscount) {
          totalDiscount += Math.min(
            vendorGroup.totalAmount,
            voucher.valueDiscount
          );
        }
      }
    });

    return totalDiscount;
  };

  // Calculate total price of selected items
  const selectedItemsTotal = useMemo(() => {
    return cartItems
      .filter((item) => selectedItems.includes(item.cartDetailId))
      .reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cartItems, selectedItems]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = appliedVoucher
    ? appliedVoucher.type === "percentage"
      ? subtotal * appliedVoucher.discount
      : appliedVoucher.discount
    : 0;
  const shipping = subtotal > 0 ? 30000 : 0; // Free shipping for orders over 300,000 VND
  const total = subtotal - discount + shipping;

  const handleCreateAddress = async (address) => {
    setFetchingCustomer(true);
    try {
      const response = await fetch(
        `/api/users/customers/${user.userId}/create-address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(address),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create address");
      }
      const data = await response.json();
      setAddresses(data.address);
      message.success("Địa chỉ đã được thêm thành công");
    } catch (error) {
      console.error("Error creating address:", error);
      message.error("Failed to create address");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-gray-700 text-sm py-2">
            <div className="flex gap-6 items-center">
              <Link href="/dashboard" className="hover:text-blue-500">
                Kênh Người Bán
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Dashboard
              </Link>
              <a href="#" className="hover:text-blue-500">
                Tải ứng dụng
              </a>
              <a href="#" className="hover:text-blue-500">
                Kết nối
              </a>
            </div>
            <div className="flex gap-6 items-center">
              <a
                href="#"
                className="hover:text-blue-500 flex items-center gap-2"
              >
                Thông Báo
              </a>
              <a
                href="#"
                className="hover:text-blue-500 flex items-center gap-2"
              >
                Hỗ Trợ
              </a>
              <a href="#" className="hover:text-blue-500">
                Tiếng Việt
              </a>
              <AuthStatus />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm mb-4">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/home"
              className="text-blue-500 flex items-center gap-2 hover:underline"
            >
              <FaArrowLeft /> Trở về trang chủ
            </Link>
            <h1 className="text-xl font-bold">Giỏ hàng của bạn</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart items (left side) */}
            <div className="lg:col-span-2">
              {step === "cart" && (
                <>
                  <div className="bg-white rounded-md shadow-sm p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-lg">
                        Sản phẩm trong giỏ hàng ({cartItems.length})
                      </h2>
                    </div>
                    {vendorPerCartItems.map((vendor) => (
                      <CartWrapper
                        shopName={vendor.vendorId}
                        key={vendor.vendorId}
                      >
                        {vendor.cartDetail.map((item) => (
                          <CartItem
                            item={item}
                            key={item.cartDetailId}
                            handleQuantityChange={handleQuantityChange}
                            handleRemoveItem={handleRemoveItem}
                            selectedItems={selectedItems}
                            toggleSelectItem={toggleSelectItem}
                          />
                        ))}
                      </CartWrapper>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleProceedToVouchers}
                      disabled={selectedItems.length === 0}
                      className={`px-6 py-2 rounded-md font-medium flex items-center gap-2
                        ${
                          selectedItems.length === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                      Tiếp tục <FaArrowRight size={14} />
                    </button>
                  </div>
                </>
              )}

              {step === "voucher" && (
                <>
                  <div className="bg-white rounded-md shadow-sm p-4 mb-4">
                    <div className="flex items-center gap-2 mb-6">
                      <button
                        onClick={handleBackToCart}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FaAngleLeft /> Quay lại giỏ hàng
                      </button>
                      <h2 className="font-bold text-lg">
                        Chọn Voucher theo cửa hàng
                      </h2>
                    </div>

                    {Object.entries(groupItemsByVendor).map(
                      ([vendorId, vendor]) => (
                        <div
                          key={vendorId}
                          className="mb-6 border rounded-md overflow-hidden"
                        >
                          <div className="bg-gray-50 p-3 border-b">
                            <h3 className="font-medium">{vendor.vendorName}</h3>
                            <p className="text-sm text-gray-500">
                              {vendor.items.length} sản phẩm - Tổng:{" "}
                              {vendor.totalAmount.toLocaleString()}₫
                            </p>
                          </div>

                          <div className="p-3">
                            <div className="mb-3">
                              <h4 className="text-sm font-medium mb-2">
                                Sản phẩm đã chọn:
                              </h4>
                              <div className="flex flex-col gap-2">
                                {vendor.items.map((item) => (
                                  <div
                                    key={item.cartDetailId}
                                    className="flex items-center gap-2 bg-gray-50 p-2 rounded justify-between"
                                  >
                                    <div className="flex gap-2 items-center">
                                      <img
                                        src={item.product.coverImage}
                                        alt={item.product.productName}
                                        className="w-8 h-8 object-cover rounded"
                                      />
                                      <span className="text-xs">
                                        {item.product.productName.substring(
                                          0,
                                          30
                                        )}
                                        ...
                                      </span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                      <span className="text-xs text-gray-500">
                                        {item.quantity} x{" "}
                                        {item.product.price.toLocaleString()}₫
                                      </span>
                                      <span className="text-xs font-medium">
                                        {(item.quantity * item.product.price)
                                          .toLocaleString()
                                          .replace(/,/g, ".")}
                                        ₫
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <h4 className="text-sm font-medium mb-2">
                              Vouchers khả dụng:
                            </h4>
                            <div className="space-y-2">
                              {availableVouchers
                                .filter((v) => v.vendorId === vendorId)
                                .filter(
                                  (v) =>
                                    vendor.totalAmount >= v.minPriceRequired
                                )
                                .map((voucher) => (
                                  <div
                                    key={voucher.voucherId}
                                    onClick={() =>
                                      selectVoucher(vendorId, voucher.voucherId)
                                    }
                                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer border
                                    ${
                                      selectedVouchers[vendorId] ===
                                      voucher.voucherId
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-blue-300"
                                    }`}
                                  >
                                    <div>
                                      <h5 className="font-medium">
                                        {voucher.voucherName}
                                      </h5>
                                      <p className="text-sm text-gray-600">
                                        {voucher.voucherType === "PERCENT"
                                          ? `Giảm ${voucher.percentDiscount}%`
                                          : `Giảm ${voucher.valueDiscount.toLocaleString()}₫`}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Đơn tối thiểu{" "}
                                        {voucher.minPriceRequired.toLocaleString()}
                                        ₫
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        HSD:{" "}
                                        {new Date(
                                          voucher.endDate
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    {selectedVouchers[vendorId] ===
                                      voucher.voucherId && (
                                      <div className="text-blue-500">
                                        <FaCheck />
                                      </div>
                                    )}
                                  </div>
                                ))}

                              {availableVouchers.filter(
                                (v) => v.vendorId === vendorId
                              ).length === 0 && (
                                <p className="text-sm text-gray-500 italic">
                                  Không có voucher khả dụng cho shop này
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleProceedToPayment}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 flex items-center gap-2"
                      >
                        Tiếp tục thanh toán <FaArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === "payment" && (
                <div className="bg-white rounded-md shadow-sm p-4 mb-4">
                  <div className="flex items-center gap-2 mb-6">
                    <button
                      onClick={() => setStep("voucher")}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FaAngleLeft /> Quay lại chọn voucher
                    </button>
                    <h2 className="font-bold text-lg">Thanh toán</h2>
                  </div>

                  {/* Address selection section */}
                  <div className="border-b pb-6 mb-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Địa chỉ giao hàng
                    </h3>

                    {/* Address list */}
                    <div className="space-y-3 mb-4">
                      {addresses.map((address) => (
                        <div
                          key={address.addressId}
                          className={`border rounded-md p-3 cursor-pointer ${
                            selectedAddressId === address.addressId
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() =>
                            setSelectedAddressId(address.addressId)
                          }
                        >
                          <div className="flex justify-between">
                            <div className="flex gap-2 items-center">
                              <span className="font-medium">
                                {address.recipientName}
                              </span>
                              <span className="text-gray-500">|</span>
                              <span className="text-gray-700">
                                {address.recipientPhone}
                              </span>
                            </div>
                            {address.addressType == "DEFAULT" && (
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <div className="text-gray-600 mt-1">
                            {address.recipientAddress}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {address.addressType == "DEFAULT"
                              ? "Địa chỉ mặc định"
                              : "Địa chỉ khác"}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() =>
                                handleSetDefaultAddress(address.addressId)
                              }
                              className="text-blue-600 text-sm hover:underline"
                            >
                              Đặt làm mặc định
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteAddress(address.addressId)
                              }
                              className="text-red-600 text-sm hover:underline"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add new address button or form */}
                    {!showAddAddressForm ? (
                      <button
                        onClick={() => setShowAddAddressForm(true)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <span className="text-xl">+</span> Thêm địa chỉ mới
                      </button>
                    ) : (
                      <div className="border rounded-md p-4 mt-4">
                        <h4 className="font-medium mb-3">Thêm địa chỉ mới</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Họ tên người nhận
                            </label>
                            <input
                              type="text"
                              value={newAddress.recipientName}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  recipientName: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                              placeholder="Nhập họ tên người nhận"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Số điện thoại
                            </label>
                            <input
                              type="text"
                              value={newAddress.recipientPhone}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  recipientPhone: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                              placeholder="Nhập số điện thoại"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Địa chỉ
                            </label>
                            <textarea
                              value={newAddress.recipientAddress}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  recipientAddress: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                              placeholder="Nhập địa chỉ cụ thể"
                              rows="3"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Đặt làm mặc định
                            </label>
                            <div className="flex gap-4">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="isDefault"
                                  value="true"
                                  checked={newAddress.isDefault === true}
                                  onChange={() =>
                                    setNewAddress({
                                      ...newAddress,
                                      isDefault: true,
                                    })
                                  }
                                  className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm">Có</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="isDefault"
                                  value="false"
                                  checked={newAddress.isDefault === false}
                                  onChange={() =>
                                    setNewAddress({
                                      ...newAddress,
                                      isDefault: false,
                                    })
                                  }
                                  className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm">Không</span>
                              </label>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <button
                              onClick={() => setShowAddAddressForm(false)}
                              className="px-3 py-1.5 border border-gray-300 text-sm rounded-md hover:bg-gray-100"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() => {
                                // Add new address with unique ID
                                // const newId =
                                //   Math.max(
                                //     ...addresses.map((a) => a.addressId)
                                //   ) + 1;
                                // const addressToAdd = {
                                //   addressId: newId,
                                //   ...newAddress,
                                // };
                                const addressToAdd = {
                                  ...newAddress,
                                  addressType: newAddress.isDefault
                                    ? "DEFAULT"
                                    : "NORMAL",
                                };
                                setAddresses([...addresses]);
                                setShowAddAddressForm(false);
                                handleCreateAddress(addressToAdd);
                                setNewAddress({
                                  recipientName: "",
                                  recipientPhone: "",
                                  recipientAddress: "",
                                  isDefault: false,
                                });
                              }}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                            >
                              Lưu địa chỉ
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order summary for review */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">
                      Kiểm tra lại đơn hàng
                    </h3>

                    {Object.entries(groupItemsByVendor).map(
                      ([vendorId, vendor]) => (
                        <div key={vendorId} className="mb-4 border-b pb-4">
                          <div className="font-medium mb-2">
                            {vendor.vendorName}
                          </div>
                          <div className="space-y-3">
                            {vendor.items.map((item) => (
                              <div
                                key={item.cartDetailId}
                                className="flex gap-3"
                              >
                                <img
                                  src={item.product.coverImage}
                                  alt={item.product.productName}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {item.product.productName}
                                  </div>
                                  <div className="text-gray-500 text-sm">
                                    Số lượng: {item.quantity}
                                  </div>
                                  <div className="text-red-600">
                                    {item.product.price.toLocaleString()}₫
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Voucher applied to this vendor */}
                          {selectedVouchers[vendorId] && (
                            <div className="mt-2 text-green-600 text-sm">
                              Đã áp dụng voucher:{" "}
                              {
                                availableVouchers.find(
                                  (v) =>
                                    v.voucherId === selectedVouchers[vendorId]
                                )?.voucherName
                              }
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {step === "confirmation" && (
                <div className="bg-white rounded-md shadow-sm p-4 mb-4">
                  <div className="flex items-center gap-2 mb-6">
                    <h2 className="font-bold text-lg">Xác nhận thanh toán</h2>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-700 mb-4">
                      Quét mã QR bên dưới để hoàn tất thanh toán:
                    </p>
                    <img
                      src={qrCodeImage}
                      alt="QR Code for Payment"
                      className="mx-auto mb-4"
                    />
                    <p className="text-gray-500">
                      Sau khi thanh toán, đơn hàng của bạn sẽ được xử lý.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary (right side) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-md shadow-sm p-4 sticky top-4">
                <h2 className="font-bold text-lg mb-4">Thông tin đơn hàng</h2>

                {step === "cart" && (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span>Tạm tính ({selectedItems.length} sản phẩm):</span>
                      <span>{selectedItemsTotal.toLocaleString()}₫</span>
                    </div>
                  </div>
                )}

                {(step === "voucher" || step === "payment") && (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span>Tạm tính ({selectedItems.length} sản phẩm):</span>
                      <span>{selectedItemsTotal.toLocaleString()}₫</span>
                    </div>

                    {Object.keys(selectedVouchers).length > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá từ voucher:</span>
                        <span>-{calculateDiscounts().toLocaleString()}₫</span>
                      </div>
                    )}

                    <div className="border-t pt-3 font-bold flex justify-between">
                      <span>Tổng cộng:</span>
                      <span className="text-red-600 text-xl">
                        {(
                          selectedItemsTotal - calculateDiscounts()
                        ).toLocaleString()}
                        ₫
                      </span>
                    </div>

                    {Object.entries(selectedVouchers).length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-md mt-2">
                        <h3 className="text-sm font-medium mb-2">
                          Voucher đã chọn:
                        </h3>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(selectedVouchers).map(
                            ([vendorId, voucherId]) => {
                              const voucher = availableVouchers.find(
                                (v) => v.voucherId === voucherId
                              );
                              const vendorGroup = groupItemsByVendor[vendorId];
                              if (!voucher || !vendorGroup) return null;

                              const discountValue =
                                voucher.voucherType === "PERCENT"
                                  ? (vendorGroup.totalAmount *
                                      voucher.percentDiscount) /
                                    100
                                  : Math.min(
                                      vendorGroup.totalAmount,
                                      voucher.valueDiscount
                                    );

                              return (
                                <li
                                  key={voucherId}
                                  className="flex justify-between"
                                >
                                  <span>{vendorGroup.vendorName}:</span>
                                  <span className="text-green-600">
                                    -{discountValue.toLocaleString()}₫
                                  </span>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {step === "cart" && (
                  <button
                    onClick={handleProceedToVouchers}
                    disabled={selectedItems.length === 0}
                    className={`w-full py-3 rounded-md font-medium flex items-center justify-center gap-2 mb-2
                      ${
                        selectedItems.length === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                  >
                    Tiếp tục với {selectedItems.length} sản phẩm{" "}
                    <FaArrowRight />
                  </button>
                )}

                {step === "voucher" && (
                  <button
                    onClick={handleProceedToPayment}
                    className={`w-full bg-blue-500 text-white py-3 rounded-md font-medium hover:bg-blue-600 mb-2 flex items-center justify-center gap-2 ${
                      fetchingVouchers &&
                      "cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300"
                    }`}
                    disabled={fetchingVouchers}
                  >
                    Tiến hành thanh toán <FaArrowRight />
                  </button>
                )}

                {step === "payment" && (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isProcessingOrder || fetchingCustomer}
                    className={`w-full py-3 rounded-md font-medium flex items-center justify-center gap-2 mb-2 ${
                      isProcessingOrder || fetchingCustomer
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    <FaShoppingBag /> Xác nhận đặt hàng
                  </button>
                )}
                {
                  step === "confirmation" && (
                    <button
                      onClick={handleCheckOrderStatus}
                      className="w-full py-3 rounded-md font-medium flex items-center justify-center gap-2 mb-2 bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Kiểm tra đơn hàng
                    </button>

                  )
                }
                <Link
                  href="/home"
                  className="block text-center text-blue-500 hover:underline mt-2"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4 text-gray-400">
              <FaShoppingBag size={64} />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-500 mb-6">
              Hãy thêm các sản phẩm vào giỏ hàng của bạn
            </p>
            <Link
              href="/home"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Mua sắm ngay
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white mt-8 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium mb-4 text-gray-700">
                CHĂM SÓC KHÁCH HÀNG
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Trung Tâm Trợ Giúp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Hướng Dẫn Mua Hàng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Thanh Toán
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Vận Chuyển
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-700">VỀ CHÚNG TÔI</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Giới Thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Tuyển Dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Điều Khoản
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Chính Sách Bảo Mật
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-700">THANH TOÁN</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-md">
                  Visa
                </div>
                <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-md">
                  MC
                </div>
                <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-md">
                  JCB
                </div>
                <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-md">
                  COD
                </div>
                <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-md">
                  Bank
                </div>
                <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-md">
                  Momo
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-700">
                THEO DÕI CHÚNG TÔI
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© 2025 E-Commerce Shop. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
