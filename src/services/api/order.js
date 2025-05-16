import { BACKEND_URL } from '@/utils/constants';

export const orderApi = {
  // Lấy danh sách đơn hàng
  getOrders: async (authToken, params = {}) => {
    try {
      // Tạo query string từ params nếu có
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/api/orders/list?${queryString}` : '/api/orders/list';
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Không thể lấy danh sách đơn hàng';
        } catch (e) {
          errorMessage = errorText || 'Không thể lấy danh sách đơn hàng';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng theo ID
  getOrderById: async (id, authToken) => {
    try {
      const response = await fetch(`/api/orders/${id}/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Không thể lấy chi tiết đơn hàng';
        } catch (e) {
          errorMessage = errorText || 'Không thể lấy chi tiết đơn hàng';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },
  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderId, orderState, authToken) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: orderState }), // Giữ tên field là 'status' cho API
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Không thể cập nhật trạng thái đơn hàng';
        } catch (e) {
          errorMessage = errorText || 'Không thể cập nhật trạng thái đơn hàng';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData, authToken) => {
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Không thể tạo đơn hàng';
        } catch (e) {
          errorMessage = errorText || 'Không thể tạo đơn hàng';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  getVendorOrders: async (userId, authToken, params = {}) => {
    try {
      // Tạo query string từ params nếu có
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/api/orders/vendor/${userId}?${queryString}` : `/api/orders/vendor/${userId}`;
      
      console.log("endpoint", params);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Không thể lấy danh sách đơn hàng';
        } catch (e) {
          errorMessage = errorText || 'Không thể lấy danh sách đơn hàng';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      throw error;
    }
  }
};
