'use client';

export const productApi = {
  // getProducts: async (page = 1, size = 10, token) => {
  //   // Trong tương lai sẽ thay bằng API call thực tế

  //   const url = `/api/products/search?page=${page}&size=${size}&productName=`;

  //   const data = await fetch(url,{
  //     method: "GET",
  //     headers:{
  //       'Authorization': `Bearer ${token}`
  //     }
  //   });

  //   if (!data.ok) {
  //     throw new Error("Failed to fetch products");
  //   }
  //   const dataJson = await data.json();

  //   return dataJson;
  // },

  getProducts : async (page, limit, token) => {
    const url = `/api/products/search?productName=&page=${page}&size=${limit}`;
    console.log('Fetching URL:', url);
    const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    const response = await fetch(url, { headers });
    console.log('Response Status:', response.status);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  },
   
  searchProducts: async ({ productName = "", page = 0, size = 12 }) => {
    try {
      const url = `/api/products/search?page=${page}&size=${size}&productName=${encodeURIComponent(productName)}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error("Failed to search products");
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching products:", error);
      // Fallback to empty results
      return { content: [], totalPages: 0, totalElements: 0 };
    }
  },

  getProduct: async (id, token = null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`/api/products/${id}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },
};