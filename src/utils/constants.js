export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  PRODUCT_DETAIL: '/api/products/:id',
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  VOUCHERS: {
    LIST: '/api/vouchers',
    DETAIL: '/api/vouchers/:id',
    CREATE: '/api/vouchers',
    DELETE: '/api/vouchers/:id',
  },
};

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 24,
};

export const CATEGORIES = [
  { id: 1, name: "Ốp Lưng iPhone", image: "/images/categories/op-lung.png" },
  { id: 2, name: "Đẹp Nữ", image: "/images/categories/dep-nu.png" },
  { id: 3, name: "Kẹp Tóc", image: "/images/categories/kep-toc.png" },
  { id: 4, name: "Quạt Cầm Tay", image: "/images/categories/quat-cam-tay.png" },
  { id: 5, name: "Áo Phông Nữ", image: "/images/categories/ao-phong-nu.png" },
  { id: 6, name: "Túi Xách Nữ", image: "/images/categories/tui-xach-nu.png" },
  { id: 7, name: "Áo", image: "/images/categories/ao.png" },
  { id: 8, name: "Kem Chống Nắng", image: "/images/categories/kem-chong-nang.png" },
  { id: 9, name: "Dép Nam", image: "/images/categories/dep-nam.png" },
  { id: 10, name: "Quần Đùi Nữ", image: "/images/categories/quan-dui-nu.png" },
]; 

export const BACKEND_URL = "https://exclusion-info-pcs-tsunami.trycloudflare.com"; // URL của backend API