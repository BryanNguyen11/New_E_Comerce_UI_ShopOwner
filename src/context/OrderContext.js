"use client";

import { createContext, useState } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [promotions, setPromotions] = useState(null); // Ví dụ: { type: "percent", value: 10 } hoặc { type: "fixed", value: 50000 }

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  // Tăng số lượng sản phẩm
  const increaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Giảm số lượng sản phẩm
  const decreaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCart([]);
  };

  // Áp dụng khuyến mãi
  const applyPromotion = (promotion) => {
    setPromotions(promotion); // Ví dụ: { type: "percent", value: 10 } hoặc { type: "fixed", value: 50000 }
  };

  // Tính tổng tiền trước khuyến mãi
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Tính tổng tiền sau khuyến mãi
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    if (!promotions) return subtotal;
    if (promotions.type === "percent") {
      return subtotal * (1 - promotions.value / 100);
    }
    if (promotions.type === "fixed") {
      return Math.max(0, subtotal - promotions.value);
    }
    return subtotal;
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        promotions,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        applyPromotion,
        calculateSubtotal,
        calculateTotal,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};