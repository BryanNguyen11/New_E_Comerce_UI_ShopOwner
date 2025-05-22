// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { productApi } from '@/services/api/product';
// import { message } from 'antd';

// export default function ProductDetailClient({ id }) {
//   const { authState, user } = useAuth();
//   const router = useRouter();
//   const [product, setProduct] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImageIdx, setSelectedImageIdx] = useState(0);
//   const [selectedFirstCategory, setSelectedFirstCategory] = useState(null);
//   const [selectedSecondCategory, setSelectedSecondCategory] = useState(null);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     if (!authState.token) {
//       message.warning('Vui lòng đăng nhập để xem chi tiết sản phẩm');
//       router.push('/login');
//       return;
//     }

//     async function fetchProduct() {
//       try {
//         console.log('Fetching product with ID:', id);
//         const data = await productApi.getProduct(id, authState.token);
//         console.log('API data:', data);
//         setProduct(data);
//       } catch (err) {
//         console.error('Fetch error:', err.message);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) {
//       fetchProduct();
//     }
//   }, [id, authState.token]);

//   const handleAddToCart = async (buyNow = false) => {
//     if (!product) {
//       message.error('Sản phẩm không khả dụng');
//       return;
//     }
//     if (product.firstCategoryName && !selectedFirstCategory) {
//       message.error(`Vui lòng chọn ${product.firstCategoryName}`);
//       return;
//     }
//     if (product.secondCategoryName && !selectedSecondCategory) {
//       message.error(`Vui lòng chọn ${product.secondCategoryName}`);
//       return;
//     }
//     if (!authState.isAuthenticated || !authState.token) {
//       message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
//       router.push('/login');
//       return;
//     }

//     try {
//       const response = await fetch('/api/cart-detail/add-product', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${authState.token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           productId: product.productId,
//           customerId: user?.userId,
//           quantity,
//           firstCategory: selectedFirstCategory,
//           secondCategory: selectedSecondCategory,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Thêm vào giỏ hàng thất bại');
//       }

//       message.success('Thêm vào giỏ hàng thành công');
//       if (buyNow) {
//         router.push('/cart');
//       }
//     } catch (error) {
//       console.error('Lỗi khi thêm vào giỏ hàng:', error);
//       message.error(error.message || 'Thêm vào giỏ hàng thất bại');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-black">Đang tải...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-red-500">Lỗi: {error}</div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-black">Không tìm thấy sản phẩm</div>
//       </div>
//     );
//   }

//   // Debug: In dữ liệu product trước khi render
//   console.log('Rendering product:', product);

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Breadcrumb */}
//       <div className="bg-white py-2">
//         <div className="container mx-auto px-4">
//           <div className="text-sm">
//             <Link href="/" className="text-[#0055AA] hover:opacity-80">
//               Shopee
//             </Link>
//             <span className="mx-1">›</span>
//             <Link
//               href="/category/thoi-trang"
//               className="text-[#0055AA] hover:opacity-80"
//             >
//               {product.firstCategoryName || 'Thời Trang'}
//             </Link>
//             <span className="mx-1">›</span>
//             <span className="text-black">{product.productName || 'Sản phẩm'}</span>
//           </div>
//         </div>
//       </div>

//       {/* Product Detail */}
//       <div className="container mx-auto px-4 py-4">
//         <div className="bg-white p-4 rounded shadow-sm">
//           <div className="grid grid-cols-12 gap-8">
//             {/* Left: Product Images and Video */}
//             <div className="col-span-5">
//               <div className="aspect-square relative">
//                 <img
//                   src={
//                     product.imageList?.[selectedImageIdx] ||
//                     product.coverImage ||
//                     '/images/product-placeholder.jpg'
//                   }
//                   alt={product.productName || 'Sản phẩm'}
//                   className="w-full h-full object-cover rounded-sm"
//                 />
//               </div>
//               <div className="grid grid-cols-5 gap-2 mt-4">
//                 {product.imageList?.length > 0 &&
//                   product.imageList.map((img, index) => (
//                     <div
//                       key={index}
//                       className={`aspect-square border cursor-pointer ${
//                         selectedImageIdx === index
//                           ? 'border-[#ee4d2d]'
//                           : 'border-gray-200'
//                       } hover:border-[#ee4d2d]`}
//                       onClick={() => setSelectedImageIdx(index)}
//                     >
//                       <img
//                         src={img}
//                         alt={`${product.productName || 'Sản phẩm'} ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   ))}
//               </div>
//               {product.video && (
//                 <div className="mt-4">
//                   <video
//                     controls
//                     src={product.video}
//                     className="w-full rounded-sm"
//                   >
//                     Trình duyệt của bạn không hỗ trợ video.
//                   </video>
//                 </div>
//               )}
//               <div className="flex items-center gap-4 mt-4 border-t pt-4">
//                 <span className="text-black">Chia sẻ:</span>
//                 <div className="flex gap-2">
//                   <button className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center">
//                     <i className="fab fa-facebook-f"></i>
//                   </button>
//                   <button className="w-8 h-8 rounded-full bg-[#1da1f2] text-white flex items-center justify-center">
//                     <i className="fab fa-twitter"></i>
//                   </button>
//                   <button className="w-8 h-8 rounded-full bg-[#e60023] text-white flex items-center justify-center">
//                     <i className="fab fa-pinterest"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Product Info */}
//             <div className="col-span-7">
//               <h1 className="text-xl font-bold text-black">{product.productName || 'Sản phẩm'}</h1>
//               <div className="text-sm text-gray-600 mt-2">
//                 Thương hiệu: {product.brand || 'Không có'}
//               </div>

//               <div className="flex items-center gap-4 mt-4">
//                 <div className="flex items-center gap-1">
//                   <span className="text-[#ee4d2d] text-lg">
//                     {product.ratingAvg?.toFixed(1) || 0}
//                   </span>
//                   <div className="flex text-[#ee4d2d]">
//                     {Array(5)
//                       .fill(0)
//                       .map((_, i) => (
//                         <i
//                           key={i}
//                           className={`fas fa-star ${
//                             i < Math.floor(product.ratingAvg || 0)
//                               ? 'text-[#ee4d2d]'
//                               : 'text-gray-300'
//                           }`}
//                         ></i>
//                       ))}
//                   </div>
//                 </div>
//                 <div className="border-l border-gray-300 pl-4">
//                   <span className="text-black">
//                     {(product.soldCount || 0).toLocaleString()}
//                   </span>
//                   <span className="text-black ml-1">Đã bán</span>
//                 </div>
//                 <button className="ml-auto text-sm text-gray-500 hover:text-[#ee4d2d]">
//                   Tố cáo
//                 </button>
//               </div>

//               <div className="bg-gray-50 p-4 mt-4">
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-[#ee4d2d] text-3xl">
//                     ₫{(product.price || 0).toLocaleString('vi-VN')}
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-6 space-y-6">
//                 <div className="flex items-center gap-4">
//                   <span className="text-black w-24">Combo Khuyến Mãi</span>
//                   <span className="text-[#ee4d2d] border border-[#ee4d2d] px-2 py-1 text-sm">
//                     Mua 2 & giảm 1%
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <span className="text-black w-24">Vận Chuyển</span>
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <i className="fas fa-truck text-[#00bfa5]"></i>
//                       <span className="text-black">Miễn phí vận chuyển</span>
//                     </div>
//                     <div className="flex items-center gap-2 mt-1">
//                       <i className="fas fa-clock text-[#00bfa5]"></i>
//                       <span className="text-black">Nhận vào 28 Th04</span>
//                     </div>
//                     <span className="text-gray-500 text-sm block mt-1">
//                       Tặng Voucher ₫15.000 đơn giao sau thời gian trên
//                     </span>
//                   </div>
//                 </div>

//                 {product.firstCategoryName && product.firstCategories?.length > 0 && (
//                   <div className="flex gap-4">
//                     <span className="text-black w-24">{product.firstCategoryName}</span>
//                     <div className="flex flex-wrap gap-2">
//                       {product.firstCategories.map((category, index) => (
//                         <button
//                           key={index}
//                           className={`px-4 py-2 border rounded ${
//                             selectedFirstCategory === category
//                               ? 'border-[#ee4d2d] text-[#ee4d2d]'
//                               : 'border-gray-300 hover:border-[#ee4d2d]'
//                           }`}
//                           onClick={() => setSelectedFirstCategory(category)}
//                         >
//                           <span className="text-black">{category}</span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {product.secondCategoryName && product.secondCategories?.length > 0 && (
//                   <div className="flex gap-4">
//                     <span className="text-black w-24">{product.secondCategoryName}</span>
//                     <div className="flex flex-wrap gap-2">
//                       {product.secondCategories.map((category, index) => (
//                         <button
//                           key={index}
//                           className={`px-4 py-2 border rounded ${
//                             selectedSecondCategory === category
//                               ? 'border-[#ee4d2d] text-[#ee4d2d]'
//                               : 'border-gray-300 hover:border-[#ee4d2d]'
//                           }`}
//                           onClick={() => setSelectedSecondCategory(category)}
//                         >
//                           <span className="text-black">{category}</span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex items-center gap-4">
//                   <span className="text-black w-24">Số Lượng</span>
//                   <div className="flex items-center">
//                     <button
//                       className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     >
//                       -
//                     </button>
//                     <input
//                       type="number"
//                       className="w-16 h-8 border-t border-b border-[#ee4d2d] text-center text-[#ee4d2d]"
//                       value={quantity}
//                       onChange={(e) =>
//                         setQuantity(Math.max(1, parseInt(e.target.value) || 1))
//                       }
//                     />
//                     <button
//                       className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
//                       onClick={() => setQuantity(quantity + 1)}
//                     >
//                       +
//                     </button>
//                     <span className="ml-4 text-black">
//                       {product.stock || 0} sản phẩm có sẵn
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex gap-4 pt-4">
//                   <button
//                     className="flex-1 px-4 py-3 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center gap-2 hover:bg-[#fef6f5]"
//                     onClick={() => handleAddToCart(false)}
//                   >
//                     <i className="fas fa-cart-plus"></i>
//                     Thêm Vào Giỏ Hàng
//                   </button>
//                   <button
//                     className="flex-1 px-4 py-3 bg-[#ee4d2d] text-white hover:bg-[#d73211]"
//                     onClick={() => handleAddToCart(true)}
//                   >
//                     Mua Ngay
//                   </button>
//                 </div>
//               </div>

//               {product.description && (
//                 <div className="mt-8 pt-8 border-t">
//                   <h2 className="text-black text-lg font-medium mb-4">
//                     Mô tả sản phẩm
//                   </h2>
//                   <p className="text-black whitespace-pre-line">
//                     {product.description}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Product Reviews Section */}
//           <div className="mt-8">
//             <h2 className="text-black text-lg font-medium mb-4">Đánh giá sản phẩm</h2>
//             <div className="bg-gray-50 p-4 rounded">
//               <p className="text-black">Chưa có đánh giá nào.</p>
//               {/* Thay bằng <ProductReviews productId={product.productId} /> khi có component */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { productApi } from "@/services/api/product";
import { message } from "antd";
import ProductReviews from "@/components/product/ProductReviews";
import { BACKEND_URL } from "@/utils/constants";

export default function ProductDetailClient({ id }) {
  const { authState, user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedFirstCategory, setSelectedFirstCategory] = useState(null);
  const [selectedSecondCategory, setSelectedSecondCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [shopInfo, setShopInfo] = useState(null);

  useEffect(() => {
    if (!authState.token) {
      return;
    }

    async function fetchProduct() {
      try {
        console.log("Fetching product with ID:", id);
        const data = await productApi.getProduct(id, authState.token);
        console.log("API data:", data);
        setProduct(data);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id, authState.token]);

  // Fetch shop info
  useEffect(() => {
    async function fetchShopInfo() {
      if (product?.vendorId && authState.token) {
        try {
          const response = await fetch(
            `/api/users/vendors/${product.vendorId}/info`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authState.token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch shop info");
          }

          const data = await response.json();
          console.log("Shop info:", data);
          setShopInfo(data);
        } catch (err) {
          console.error("Error fetching shop info:", err);
          setShopInfo({ shopName: "Shop không xác định" });
        }
      }
    }

    fetchShopInfo();
  }, [product?.vendorId, authState.token]);

  const handleAddToCart = async (buyNow = false) => {
    if (!product) {
      message.error("Sản phẩm không khả dụng");
      return;
    }
    if (product.firstCategoryName && !selectedFirstCategory) {
      message.error(`Vui lòng chọn ${product.firstCategoryName}`);
      return;
    }
    if (product.secondCategoryName && !selectedSecondCategory) {
      message.error(`Vui lòng chọn ${product.secondCategoryName}`);
      return;
    }
    if (!authState.isAuthenticated || !authState.token) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/cart-detail/add-product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.productId,
          customerId: user?.userId,
          quantity,
          firstCategory: selectedFirstCategory,
          secondCategory: selectedSecondCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Thêm vào giỏ hàng thất bại");
      }

      message.success("Thêm vào giỏ hàng thành công");
      if (buyNow) {
        router.push("/cart");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      message.error(error.message || "Thêm vào giỏ hàng thất bại");
    }
  };

  const handlePrevImage = () => {
    if (product?.imageList?.length > 0) {
      setSelectedImageIdx((prev) =>
        prev === 0 ? product.imageList.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (product?.imageList?.length > 0) {
      setSelectedImageIdx((prev) =>
        prev === product.imageList.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-black">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">Lỗi: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-black">Không tìm thấy sản phẩm</div>
      </div>
    );
  }

  console.log("Rendering product:", product);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white py-2">
        <div className="container mx-auto px-4">
          <div className="text-sm">
            <Link href="/" className="text-[#0055AA] hover:opacity-80">
              Shopee
            </Link>
            <span className="mx-1">›</span>
            <Link
              href="/category/thoi-trang"
              className="text-[#0055AA] hover:opacity-80"
            >
              {product.firstCategoryName || "Thời Trang"}
            </Link>
            <span className="mx-1">›</span>
            <span className="text-black">
              {product.productName || "Sản phẩm"}
            </span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="grid grid-cols-12 gap-8">
            {/* Left: Product Media (Images only) */}
            <div className="col-span-5">
              <div className="relative aspect-square">
                <img
                  src={
                    product.imageList?.[selectedImageIdx] ||
                    product.coverImage ||
                    "/images/product-placeholder.jpg"
                  }
                  alt={product.productName || "Sản phẩm"}
                  className="w-full h-full object-cover rounded-sm"
                />
                {product.imageList?.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {product.imageList?.length > 0 &&
                  product.imageList.map((img, index) => (
                    <div
                      key={index}
                      className={`aspect-square border cursor-pointer ${
                        selectedImageIdx === index
                          ? "border-[#ee4d2d]"
                          : "border-gray-200"
                      } hover:border-[#ee4d2d]`}
                      onClick={() => setSelectedImageIdx(index)}
                    >
                      <img
                        src={img}
                        alt={`${product.productName || "Sản phẩm"} ${
                          index + 1
                        }`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
              <div className="flex items-center gap-4 mt-4 border-t pt-4">
                <span className="text-black">Chia sẻ:</span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center">
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#1da1f2] text-white flex items-center justify-center">
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#e60023] text-white flex items-center justify-center">
                    <i className="fab fa-pinterest"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="col-span-7">
              <h1 className="text-xl font-bold text-black">
                {product.productName || "Sản phẩm"}
              </h1>
              <div className="text-sm text-gray-600 mt-2">
                Thương hiệu: {product.brand || "Không có"}
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <span className="text-[#ee4d2d] text-lg">
                    {product.ratingAvg?.toFixed(1) || 0}
                  </span>
                  <div className="flex text-[#ee4d2d]">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${
                            i < Math.floor(product.ratingAvg || 0)
                              ? "text-[#ee4d2d]"
                              : "text-gray-300"
                          }`}
                        ></i>
                      ))}
                  </div>
                </div>
                <div className="border-l border-gray-300 pl-4">
                  <span className="text-black">
                    {(product.soldCount || 0).toLocaleString()}
                  </span>
                  <span className="text-black ml-1">Đã bán</span>
                </div>
                <button className="ml-auto text-sm text-gray-500 hover:text-[#ee4d2d]">
                  Tố cáo
                </button>
              </div>

              <div className="bg-gray-50 p-4 mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#ee4d2d] text-3xl">
                    ₫{(product.price || 0).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-black w-24">Combo Khuyến Mãi</span>
                  <span className="text-[#ee4d2d] border border-[#ee4d2d] px-2 py-1 text-sm">
                    Mua 2 & giảm 1%
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-black w-24">Vận Chuyển</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-truck text-[#00bfa5]"></i>
                      <span className="text-black">Miễn phí vận chuyển</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <i className="fas fa-clock text-[#00bfa5]"></i>
                      <span className="text-black">Nhận vào 28 Th04</span>
                    </div>
                    <span className="text-gray-500 text-sm block mt-1">
                      Tặng Voucher ₫15.000 đơn giao sau thời gian trên
                    </span>
                  </div>
                </div>

                {product.firstCategoryName &&
                  product.firstCategories?.length > 0 && (
                    <div className="flex gap-4">
                      <span className="text-black w-24">
                        {product.firstCategoryName}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.firstCategories.map((category, index) => (
                          <button
                            key={index}
                            className={`px-4 py-2 border rounded ${
                              selectedFirstCategory === category
                                ? "border-[#ee4d2d] text-[#ee4d2d]"
                                : "border-gray-300 hover:border-[#ee4d2d]"
                            }`}
                            onClick={() => setSelectedFirstCategory(category)}
                          >
                            <span className="text-black">{category}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {product.secondCategoryName &&
                  product.secondCategories?.length > 0 && (
                    <div className="flex gap-4">
                      <span className="text-black w-24">
                        {product.secondCategoryName}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.secondCategories.map((category, index) => (
                          <button
                            key={index}
                            className={`px-4 py-2 border rounded ${
                              selectedSecondCategory === category
                                ? "border-[#ee4d2d] text-[#ee4d2d]"
                                : "border-gray-300 hover:border-[#ee4d2d]"
                            }`}
                            onClick={() => setSelectedSecondCategory(category)}
                          >
                            <span className="text-black">{category}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* <div className="flex items-center gap-4">
                  <span className="text-black w-24">Số Lượng</span>
                  <div className="flex items-center">
                    <button
                      className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="w-16 h-8 border-t border-b border-[#ee4d2d] text-center text-[#ee4d2d]"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                    />
                    <button
                      className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                    <span className="ml-4 text-black">
                      {product.stock || 0} sản phẩm có sẵn
                    </span>
                  </div>
                </div> */}
                <div className="flex items-center gap-4">
                  <span className="text-black w-24">Số Lượng</span>
                  <div className="flex items-center">
                    <button
                      className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={product.stock === 0}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="w-16 h-8 border-t border-b border-[#ee4d2d] text-center text-[#ee4d2d]"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(
                              product.stock,
                              parseInt(e.target.value) || 1
                            )
                          )
                        )
                      }
                      disabled={product.stock === 0}
                    />
                    <button
                      className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={product.stock === 0}
                    >
                      +
                    </button>
                    <span className="ml-4 text-black">
                      {product.stock === 0
                        ? "Hết hàng"
                        : `${product.stock} sản phẩm có sẵn`}
                    </span>
                  </div>
                </div>

                {/* <div className="flex gap-4 pt-4">
                  <button
                    className="flex-1 px-4 py-3 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center gap-2 hover:bg-[#fef6f5]"
                    onClick={() => handleAddToCart(false)}
                  >
                    <i className="fas fa-cart-plus"></i>
                    Thêm Vào Giỏ Hàng
                  </button>
                  <button
                    className="flex-1 px-4 py-3 bg-[#ee4d2d] text-white hover:bg-[#d73211]"
                    onClick={() => handleAddToCart(true)}
                  >
                    Mua Ngay
                  </button>
                </div> */}
                <div className="flex gap-4 pt-4">
                  <button
                    className={`flex-1 px-4 py-3 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center gap-2 ${
                      product.stock === 0
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "hover:bg-[#fef6f5]"
                    }`}
                    onClick={() => handleAddToCart(false)}
                    disabled={product.stock === 0}
                  >
                    <i className="fas fa-cart-plus"></i>
                    Thêm Vào Giỏ Hàng
                  </button>
                  <button
                    className={`flex-1 px-4 py-3 ${
                      product.stock === 0
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-[#ee4d2d] text-white hover:bg-[#d73211]"
                    }`}
                    onClick={() => handleAddToCart(true)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Hết hàng" : "Mua Ngay"}
                  </button>
                </div>
              </div>
              {/* </div> */}

              {(product.description || product.video) && (
                <div className="mt-8 pt-8 border-t">
                  <h2 className="text-2xl font-medium text-black mb-4">
                    Mô tả sản phẩm
                  </h2>
                  {product.description && (
                    <p className="text-black whitespace-pre-line">
                      {product.description}
                    </p>
                  )}
                  {product.video && (
                    <div className="mt-4">
                      <h3 className="text-black text-sm font-medium mb-2">
                        Video sản phẩm
                      </h3>
                      <video
                        controls
                        src={product.video}
                        className="w-full rounded-sm"
                      >
                        Trình duyệt của bạn không hỗ trợ video.
                      </video>
                    </div>
                  )}
                </div>
              )}

              {/* Shop Info */}
              <div className="mt-8 pt-8 border-t">
                <h2 className="text-xl font-medium text-black mb-4">Shop</h2>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                    <i className="fas fa-store text-gray-500"></i>
                  </div>
                  <div>
                    <p className="text-black font-medium">
                      {shopInfo?.shopName || "Shop không xác định"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {shopInfo?.shopDescription || "Không có mô tả"}
                    </p>
                  </div>
                  {shopInfo?.userId && (
                    <Link
                      href={`/shop/${shopInfo.userId}`}
                      className="ml-auto px-4 py-2 border border-[#ee4d2d] text-[#ee4d2d] rounded hover:bg-[#fef6f5]"
                    >
                      Xem Shop
                    </Link>
                  )}
                </div>
              </div>

              {/* Product Reviews Section */}
              <div className="mt-8">
                <ProductReviews productId={product.productId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { productApi } from '@/services/api/product';
// import { message } from 'antd';

// export default function ProductDetailClient({ id }) {
//   const { authState, user } = useAuth();
//   const router = useRouter();
//   const [product, setProduct] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImageIdx, setSelectedImageIdx] = useState(0);
//   const [selectedFirstCategory, setSelectedFirstCategory] = useState(null);
//   const [selectedSecondCategory, setSelectedSecondCategory] = useState(null);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     if (!authState.token) {
//       message.warning('Vui lòng đăng nhập để xem chi tiết sản phẩm');
//       router.push('/login');
//       return;
//     }

//     async function fetchProduct() {
//       try {
//         console.log('Fetching product with ID:', id);
//         const data = await productApi.getProduct(id, authState.token);
//         console.log('API data:', data);
//         setProduct(data);
//       } catch (err) {
//         console.error('Fetch error:', err.message);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) {
//       fetchProduct();
//     }
//   }, [id, authState.token]);

//   const handleAddToCart = async (buyNow = false) => {
//     if (!product) {
//       message.error('Sản phẩm không khả dụng');
//       return;
//     }
//     if (product.firstCategoryName && !selectedFirstCategory) {
//       message.error(`Vui lòng chọn ${product.firstCategoryName}`);
//       return;
//     }
//     if (product.secondCategoryName && !selectedSecondCategory) {
//       message.error(`Vui lòng chọn ${product.secondCategoryName}`);
//       return;
//     }
//     if (!authState.isAuthenticated || !authState.token) {
//       message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
//       router.push('/login');
//       return;
//     }

//     try {
//       const response = await fetch('/api/cart-detail/add-product', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${authState.token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           productId: product.productId,
//           customerId: user?.userId,
//           quantity,
//           firstCategory: selectedFirstCategory,
//           secondCategory: selectedSecondCategory,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Thêm vào giỏ hàng thất bại');
//       }

//       message.success('Thêm vào giỏ hàng thành công');
//       if (buyNow) {
//         router.push('/cart');
//       }
//     } catch (error) {
//       console.error('Lỗi khi thêm vào giỏ hàng:', error);
//       message.error(error.message || 'Thêm vào giỏ hàng thất bại');
//     }
//   };

//   const handlePrevImage = () => {
//     if (product?.imageList?.length > 0) {
//       setSelectedImageIdx((prev) =>
//         prev === 0 ? product.imageList.length - 1 : prev - 1
//       );
//     }
//   };

//   const handleNextImage = () => {
//     if (product?.imageList?.length > 0) {
//       setSelectedImageIdx((prev) =>
//         prev === product.imageList.length - 1 ? 0 : prev + 1
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-black">Đang tải...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-red-500">Lỗi: {error}</div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-black">Không tìm thấy sản phẩm</div>
//       </div>
//     );
//   }

//   // Debug: In dữ liệu product trước khi render
//   console.log('Rendering product:', product);

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Breadcrumb */}
//       <div className="bg-white py-2">
//         <div className="container mx-auto px-4">
//           <div className="text-sm">
//             <Link href="/" className="text-[#0055AA] hover:opacity-80">
//               Shopee
//             </Link>
//             <span className="mx-1">›</span>
//             <Link
//               href="/category/thoi-trang"
//               className="text-[#0055AA] hover:opacity-80"
//             >
//               {product.firstCategoryName || 'Thời Trang'}
//             </Link>
//             <span className="mx-1">›</span>
//             <span className="text-black">{product.productName || 'Sản phẩm'}</span>
//           </div>
//         </div>
//       </div>

//       {/* Product Detail */}
//       <div className="container mx-auto px-4 py-4">
//         <div className="bg-white p-4 rounded shadow-sm">
//           <div className="grid grid-cols-12 gap-8">
//             {/* Left: Product Media (Images and Video) */}
//             <div className="col-span-5">
//               <div className="relative aspect-square">
//                 {/* Main Media */}
//                 <img
//                   src={
//                     product.imageList?.[selectedImageIdx] ||
//                     product.coverImage ||
//                     '/images/product-placeholder.jpg'
//                   }
//                   alt={product.productName || 'Sản phẩm'}
//                   className="w-full h-full object-cover rounded-sm"
//                 />
//                 {/* Navigation Buttons */}
//                 {product.imageList?.length > 1 && (
//                   <>
//                     <button
//                       onClick={handlePrevImage}
//                       className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70"
//                     >
//                       <i className="fas fa-chevron-left"></i>
//                     </button>
//                     <button
//                       onClick={handleNextImage}
//                       className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70"
//                     >
//                       <i className="fas fa-chevron-right"></i>
//                     </button>
//                   </>
//                 )}
//               </div>
//               {/* Thumbnails */}
//               <div className="grid grid-cols-5 gap-2 mt-4">
//                 {product.imageList?.length > 0 &&
//                   product.imageList.map((img, index) => (
//                     <div
//                       key={index}
//                       className={`aspect-square border cursor-pointer ${
//                         selectedImageIdx === index
//                           ? 'border-[#ee4d2d]'
//                           : 'border-gray-200'
//                       } hover:border-[#ee4d2d]`}
//                       onClick={() => setSelectedImageIdx(index)}
//                     >
//                       <img
//                         src={img}
//                         alt={`${product.productName || 'Sản phẩm'} ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   ))}
//               </div>
//               {/* Video */}
//               {product.video && (
//                 <div className="mt-4">
//                   <h3 className="text-black text-sm font-medium mb-2">Video sản phẩm</h3>
//                   <video
//                     controls
//                     src={product.video}
//                     className="w-full rounded-sm"
//                   >
//                     Trình duyệt của bạn không hỗ trợ video.
//                   </video>
//                 </div>
//               )}
//               {/* Share Buttons */}
//               <div className="flex items-center gap-4 mt-4 border-t pt-4">
//                 <span className="text-black">Chia sẻ:</span>
//                 <div className="flex gap-2">
//                   <button className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center">
//                     <i className="fab fa-facebook-f"></i>
//                   </button>
//                   <button className="w-8 h-8 rounded-full bg-[#1da1f2] text-white flex items-center justify-center">
//                     <i className="fab fa-twitter"></i>
//                   </button>
//                   <button className="w-8 h-8 rounded-full bg-[#e60023] text-white flex items-center justify-center">
//                     <i className="fab fa-pinterest"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Product Info */}
//             <div className="col-span-7">
//               <h1 className="text-xl font-bold text-black">{product.productName || 'Sản phẩm'}</h1>
//               <div className="text-sm text-gray-600 mt-2">
//                 Thương hiệu: {product.brand || 'Không có'}
//               </div>

//               <div className="flex items-center gap-4 mt-4">
//                 <div className="flex items-center gap-1">
//                   <span className="text-[#ee4d2d] text-lg">
//                     {product.ratingAvg?.toFixed(1) || 0}
//                   </span>
//                   <div className="flex text-[#ee4d2d]">
//                     {Array(5)
//                       .fill(0)
//                       .map((_, i) => (
//                         <i
//                           key={i}
//                           className={`fas fa-star ${
//                             i < Math.floor(product.ratingAvg || 0)
//                               ? 'text-[#ee4d2d]'
//                               : 'text-gray-300'
//                           }`}
//                         ></i>
//                       ))}
//                   </div>
//                 </div>
//                 <div className="border-l border-gray-300 pl-4">
//                   <span className="text-black">
//                     {(product.soldCount || 0).toLocaleString()}
//                   </span>
//                   <span className="text-black ml-1">Đã bán</span>
//                 </div>
//                 <button className="ml-auto text-sm text-gray-500 hover:text-[#ee4d2d]">
//                   Tố cáo
//                 </button>
//               </div>

//               <div className="bg-gray-50 p-4 mt-4">
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-[#ee4d2d] text-3xl">
//                     ₫{(product.price || 0).toLocaleString('vi-VN')}
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-6 space-y-6">
//                 <div className="flex items-center gap-4">
//                   <span className="text-black w-24">Combo Khuyến Mãi</span>
//                   <span className="text-[#ee4d2d] border border-[#ee4d2d] px-2 py-1 text-sm">
//                     Mua 2 & giảm 1%
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <span className="text-black w-24">Vận Chuyển</span>
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <i className="fas fa-truck text-[#00bfa5]"></i>
//                       <span className="text-black">Miễn phí vận chuyển</span>
//                     </div>
//                     <div className="flex items-center gap-2 mt-1">
//                       <i className="fas fa-clock text-[#00bfa5]"></i>
//                       <span className="text-black">Nhận vào 28 Th04</span>
//                     </div>
//                     <span className="text-gray-500 text-sm block mt-1">
//                       Tặng Voucher ₫15.000 đơn giao sau thời gian trên
//                     </span>
//                   </div>
//                 </div>

//                 {product.firstCategoryName && product.firstCategories?.length > 0 && (
//                   <div className="flex gap-4">
//                     <span className="text-black w-24">{product.firstCategoryName}</span>
//                     <div className="flex flex-wrap gap-2">
//                       {product.firstCategories.map((category, index) => (
//                         <button
//                           key={index}
//                           className={`px-4 py-2 border rounded ${
//                             selectedFirstCategory === category
//                               ? 'border-[#ee4d2d] text-[#ee4d2d]'
//                               : 'border-gray-300 hover:border-[#ee4d2d]'
//                           }`}
//                           onClick={() => setSelectedFirstCategory(category)}
//                         >
//                           <span className="text-black">{category}</span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {product.secondCategoryName && product.secondCategories?.length > 0 && (
//                   <div className="flex gap-4">
//                     <span className="text-black w-24">{product.secondCategoryName}</span>
//                     <div className="flex flex-wrap gap-2">
//                       {product.secondCategories.map((category, index) => (
//                         <button
//                           key={index}
//                           className={`px-4 py-2 border rounded ${
//                             selectedSecondCategory === category
//                               ? 'border-[#ee4d2d] text-[#ee4d2d]'
//                               : 'border-gray-300 hover:border-[#ee4d2d]'
//                           }`}
//                           onClick={() => setSelectedSecondCategory(category)}
//                         >
//                           <span className="text-black">{category}</span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex items-center gap-4">
//                   <span className="text-black w-24">Số Lượng</span>
//                   <div className="flex items-center">
//                     <button
//                       className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     >
//                       -
//                     </button>
//                     <input
//                       type="number"
//                       className="w-16 h-8 border-t border-b border-[#ee4d2d] text-center text-[#ee4d2d]"
//                       value={quantity}
//                       onChange={(e) =>
//                         setQuantity(Math.max(1, parseInt(e.target.value) || 1))
//                       }
//                     />
//                     <button
//                       className="w-8 h-8 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center hover:bg-[#fef6f5]"
//                       onClick={() => setQuantity(quantity + 1)}
//                     >
//                       +
//                     </button>
//                     <span className="ml-4 text-black">
//                       {product.stock || 0} sản phẩm có sẵn
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex gap-4 pt-4">
//                   <button
//                     className="flex-1 px-4 py-3 border border-[#ee4d2d] text-[#ee4d2d] flex items-center justify-center gap-2 hover:bg-[#fef6f5]"
//                     onClick={() => handleAddToCart(false)}
//                   >
//                     <i className="fas fa-cart-plus"></i>
//                     Thêm Vào Giỏ Hàng
//                   </button>
//                   <button
//                     className="flex-1 px-4 py-3 bg-[#ee4d2d] text-white hover:bg-[#d73211]"
//                     onClick={() => handleAddToCart(true)}
//                   >
//                     Mua Ngay
//                   </button>
//                 </div>
//               </div>

//               {product.description && (
//                 <div className="mt-8 pt-8 border-t">
//                   <h2 className="text-black text-lg font-medium mb-4">
//                     Mô tả sản phẩm
//                   </h2>
//                   <p className="text-black whitespace-pre-line">
//                     {product.description}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Product Reviews Section */}
//           <div className="mt-8">
//             <h2 className="text-black text-lg font-medium mb-4">Đánh giá sản phẩm</h2>
//             <div className="bg-gray-50 p-4 rounded">
//               <p className="text-black">Chưa có đánh giá nào.</p>
//               {/* Thay bằng <ProductReviews productId={product.productId} /> khi có component */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
