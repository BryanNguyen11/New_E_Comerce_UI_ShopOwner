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

  getProduct: async (id) => {
    // Trong tương lai sẽ thay bằng API call thực tế
    return getProduct(id);
  }
}; 