// Voucher API service
import { BACKEND_URL, API_ENDPOINTS } from '@/utils/constants';

export const voucherApi = {

  getVouchers: async (userId, authToken) => {
  try {
    const response = await fetch(`/api/vouchers/vendor/${userId}`, {
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
        errorMessage = errorData.message || 'Không thể lấy danh sách mã giảm giá';
      } catch (e) {
        errorMessage = errorText || 'Không thể lấy danh sách mã giảm giá';
      }
      throw new Error(errorMessage);
    }

    // Sử dụng response.text() để đảm bảo có thể đọc nội dung
    const responseText = await response.text();
    
    try {
      // Kiểm tra nếu response không rỗng
      if (!responseText.trim()) {
        console.log("API trả về phản hồi rỗng");
        return [];
      }
      
      // Phân tích cú pháp JSON
      const data = JSON.parse(responseText);
      
      // Kiểm tra nếu data là mảng
      if (Array.isArray(data)) {
        return data;
      }
      
      // Nếu data không phải là mảng, kiểm tra xem có thuộc tính nào chứa mảng không
      const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
      if (possibleArrays.length > 0) {
        return possibleArrays[0]; // Trả về mảng đầu tiên tìm thấy
      }
      
      // Nếu không tìm thấy mảng nào, trả về mảng rỗng
      console.warn("Không tìm thấy mảng vouchers trong phản hồi:", data);
      return [];
    } catch (e) {
      console.error("Lỗi khi phân tích phản hồi:", e);
      throw new Error("Không thể phân tích phản hồi từ API");
    }
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    throw error;
  }
},

  getVoucherById: async (id) => {
    try {
      const endpoint = API_ENDPOINTS.VOUCHERS.DETAIL.replace(':id', id);
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Không thể lấy chi tiết mã giảm giá';
        } catch (e) {
          errorMessage = errorText || 'Không thể lấy chi tiết mã giảm giá';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching voucher details:', error);
      throw error;
    }
  },

  createVoucher: async (voucherData) => {
    try {
      const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.VOUCHERS.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(voucherData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Không thể tạo mã giảm giá';
        } catch (e) {
          errorMessage = errorText || 'Không thể tạo mã giảm giá';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating voucher:', error);
      throw error;
    }
  },

  deleteVoucher: async (id) => {
    try {
      const endpoint = API_ENDPOINTS.VOUCHERS.DELETE.replace(':id', id);
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Không thể xóa mã giảm giá';
        } catch (e) {
          errorMessage = errorText || 'Không thể xóa mã giảm giá';
        }
        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      console.error('Error deleting voucher:', error);
      throw error;
    }
  }
};
