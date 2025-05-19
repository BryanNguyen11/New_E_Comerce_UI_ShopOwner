'use client';

import { getProducts, getProduct } from '@/services/mock/products';

export const productApi = {
  getProducts: async (page = 1, size = 10, token) => {
    // Trong tương lai sẽ thay bằng API call thực tế

    const url = `/api/products/search?page=${page}&size=${size}&productName=`;

    const data = await fetch(url,{
      method: "GET",
      headers:{
        'Authorization': `Bearer ${token}`
      }
    });

    if (!data.ok) {
      throw new Error("Failed to fetch products");
    }
    const dataJson = await data.json();

    return dataJson;
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

  getProduct: async (id) => {
    // Trong tương lai sẽ thay bằng API call thực tế
    return getProduct(id);
  }
};