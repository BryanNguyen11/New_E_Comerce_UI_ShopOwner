"use client";

import { createContext, useState } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [promotions, setPromotions] = useState(null);
  const [tempOrder, setTempOrder] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
  });
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  const addToCart = (item) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    if (tempOrder && tempOrder.id === id && tempOrder.quantity < tempOrder.stock) {
      setTempOrder((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
    }
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    if (tempOrder && tempOrder.id === id && tempOrder.quantity > 1) {
      setTempOrder((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    if (tempOrder) {
      return tempOrder.price * tempOrder.quantity;
    }
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateDiscount = (voucher) => {
    if (!voucher || !tempOrder) return 0;
    const subtotal = calculateSubtotal();
    if (voucher.voucherType === "PERCENT" && voucher.percentDiscount) {
      return (subtotal * voucher.percentDiscount) / 100;
    } else if (voucher.voucherType === "VALUE" && voucher.valueDiscount) {
      return voucher.valueDiscount;
    }
    return 0;
  };

  const calculateTotal = (voucher) => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(voucher);
    return Math.max(0, subtotal - discount);
  };

  const applyPromotion = (promotion) => {
    setPromotions(promotion);
  };

  const setTempOrderItem = (item) => {
    setTempOrder(item);
  };

  const clearTempOrder = () => {
    setTempOrder(null);
    setSelectedVoucherId(null);
    setDeliveryAddress({
      recipientName: "",
      recipientPhone: "",
      recipientAddress: "",
    });
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        promotions,
        tempOrder,
        deliveryAddress,
        selectedVoucherId,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        calculateSubtotal,
        calculateDiscount,
        calculateTotal,
        applyPromotion,
        setTempOrderItem,
        clearTempOrder,
        setDeliveryAddress,
        setSelectedVoucherId,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};