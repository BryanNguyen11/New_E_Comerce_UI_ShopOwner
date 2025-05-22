// import { BACKEND_URL } from '@/utils/constants';

// export const orderApi = {
//   // Lấy danh sách đơn hàng
//   getOrders: async (authToken, params = {}) => {
//     try {
//       // Tạo query string từ params nếu có
//       const queryString = new URLSearchParams(params).toString();
//       const endpoint = queryString ? `/api/orders/list?${queryString}` : '/api/orders/list';
      
//       const response = await fetch(endpoint, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`,
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         let errorMessage;
//         try {
//           const errorData = JSON.parse(errorText);
//           errorMessage = errorData.message || 'Không thể lấy danh sách đơn hàng';
//         } catch (e) {
//           errorMessage = errorText || 'Không thể lấy danh sách đơn hàng';
//         }
//         throw new Error(errorMessage);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       throw error;
//     }
//   },

//   // Lấy chi tiết đơn hàng theo ID
//   getOrderById: async (id, authToken) => {
//     try {
//       const response = await fetch(`/api/orders/${id}/get`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`,
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         let errorMessage;
//         try {
//           const errorData = JSON.parse(errorText);
//           errorMessage = errorData.message || 'Không thể lấy chi tiết đơn hàng';
//         } catch (e) {
//           errorMessage = errorText || 'Không thể lấy chi tiết đơn hàng';
//         }
//         throw new Error(errorMessage);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching order details:', error);
//       throw error;
//     }
//   },
//   // Cập nhật trạng thái đơn hàng
//   updateOrderStatus: async (orderId, orderState, authToken) => {
//     try {
//       const response = await fetch(`/api/orders/${orderId}/update-status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`,
//         },
//         body: JSON.stringify({ status: orderState }), // Giữ tên field là 'status' cho API
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         let errorMessage;
//         try {
//           const errorData = JSON.parse(errorText);
//           errorMessage = errorData.message || 'Không thể cập nhật trạng thái đơn hàng';
//         } catch (e) {
//           errorMessage = errorText || 'Không thể cập nhật trạng thái đơn hàng';
//         }
//         throw new Error(errorMessage);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       throw error;
//     }
//   },

//   // Tạo đơn hàng mới
//   createOrder: async (orderData, authToken) => {
//     try {
//       const response = await fetch('/api/orders/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`,
//         },
//         body: JSON.stringify(orderData),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         let errorMessage;
//         try {
//           const errorData = JSON.parse(errorText);
//           errorMessage = errorData.message || 'Không thể tạo đơn hàng';
//         } catch (e) {
//           errorMessage = errorText || 'Không thể tạo đơn hàng';
//         }
//         throw new Error(errorMessage);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error creating order:', error);
//       throw error;
//     }
//   },
//   getVendorOrders: async (userId, authToken, params = {}) => {
//     try {
//       // Tạo query string từ params nếu có
//       const queryString = new URLSearchParams(params).toString();
//       const endpoint = queryString ? `/api/orders/vendor/${userId}?${queryString}` : `/api/orders/vendor/${userId}`;
      
//       console.log("endpoint", params);

//       const response = await fetch(endpoint, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`,
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         let errorMessage;
//         try {
//           const errorData = JSON.parse(errorText);
//           errorMessage = errorData.message || 'Không thể lấy danh sách đơn hàng';
//         } catch (e) {
//           errorMessage = errorText || 'Không thể lấy danh sách đơn hàng';
//         }
//         throw new Error(errorMessage);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching vendor orders:', error);
//       throw error;
//     }
//   }
// };


export const orderApi = {
  createOrder: async (orderData, authToken) => {
    try {
      console.log("Sending POST /api/orders with data:", JSON.stringify(orderData, null, 2));
      console.log("Auth token:", authToken);

      const response = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(orderData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log("Error response body:", errorData);
        } catch (e) {
          console.log("Failed to parse error response body");
        }
        throw new Error(errorData?.message || `Failed to create order (Status: ${response.status})`);
      }

      const qrUrl = await response.text();
      console.log("QR URL received:", qrUrl);
      return qrUrl;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  },

  getOrder: async (orderId, authToken) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch order");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getCustomerOrders: async (userId, page, size, orderState, authToken) => {
    try {
      const response = await fetch(
        `/api/orders/customer/${userId}?page=${page}&size=${size}&orderState=${orderState}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  cancelOrder: async (orderId, authToken) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  updateOrderStateSuccess: async (orderId, authToken) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/handleSuccess`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update order state");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateOrderStateFail: async (orderId, authToken) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/handleFail`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update order state");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAvailableVouchers: async (vendorId, authToken) => {
    try {
      const response = await fetch(`/api/vouchers/vendor/${vendorId}/available`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vouchers");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

// export const orderApi = {
//   createOrder: async (orderData, authToken) => {
//     try {
//       const response = await fetch(`/api/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         body: JSON.stringify(orderData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to create order");
//       }

//       return await response.text();
//     } catch (error) {
//       throw error;
//     }
//   },

//   getCustomerOrders: async (userId, page, size, orderState, authToken) => {
//     try {
//       const response = await fetch(
//         `/api/orders/customer/${userId}?page=${page}&size=${size}&orderState=${orderState}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch orders");
//       }

//       return await response.json();
//     } catch (error) {
//       throw error;
//     }
//   },

//   cancelOrder: async (orderId, authToken) => {
//     try {
//       const response = await fetch(`/api/orders/${orderId}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to cancel order");
//       }

//       return true;
//     } catch (error) {
//       throw error;
//     }
//   },

//   updateOrderStateSuccess: async (orderId, authToken) => {
//     try {
//       const response = await fetch(`/api/orders/${orderId}/handleSuccess`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update order state");
//       }

//       return await response.json();
//     } catch (error) {
//       throw error;
//     }
//   },

//   updateOrderStateFail: async (orderId, authToken) => {
//     try {
//       const response = await fetch(`/api/orders/${orderId}/handleFail`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update order state");
//       }

//       return await response.json();
//     } catch (error) {
//       throw error;
//     }
//   },

//   getAvailableVouchers: async (vendorId, authToken) => {
//     try {
//       const response = await fetch(`/api/vouchers/vendor/${vendorId}/available`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch vouchers");
//       }

//       return await response.json();
//     } catch (error) {
//       throw error;
//     }
//   },
// };