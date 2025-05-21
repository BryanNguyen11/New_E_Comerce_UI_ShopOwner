// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { message } from "antd";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import ProductCard from "@/components/product/ProductCard";

// export default function ShopPage() {
//   const { vendorId } = useParams();
//   const { authState } = useAuth();
//   const router = useRouter();
//   const [shopInfo, setShopInfo] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     if (!authState.token) {
//       message.warning("Vui lòng đăng nhập để xem thông tin shop");
//       router.push("/login");
//       return;
//     }

//     async function fetchShopInfo() {
//       try {
//         const response = await fetch(`/api/users/vendors/${vendorId}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${authState.token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Không thể lấy thông tin shop");
//         }

//         const data = await response.json();
//         console.log("Shop info:", data);
//         setShopInfo(data);
//       } catch (err) {
//         console.error("Lỗi khi lấy thông tin shop:", err);
//         setShopInfo({ shopName: "Shop không xác định", shopDescription: "Không có mô tả" });
//       }
//     }

//     async function fetchProducts() {
//       try {
//         const response = await fetch(
//           `/api/products/vendors/${vendorId}?page=${page}&size=12&productName=${encodeURIComponent(searchQuery)}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${authState.token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Không thể lấy danh sách sản phẩm");
//         }

//         const data = await response.json();
//         console.log("Products data:", data);

//         // Filter out hidden products (show: false) and map to ProductCard-compatible format
//         const mappedProducts = (data.content || [])
//           .filter(product => product.show !== false)
//           .map(product => ({
//             productId: product.productId,
//             productName: product.productName,
//             price: product.price,
//             thumbImage: product.coverImage,
//             ratingAvg: product.ratingAvg,
//             soldCount: product.soldCount,
//             stock: product.stock,
//           }));

//         setProducts(mappedProducts);
//         setTotalPages(data.totalPages || 0);
//         setTotalProducts(data.totalElements || 0);
//       } catch (err) {
//         console.error("Lỗi khi lấy sản phẩm:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchShopInfo();
//     fetchProducts();
//   }, [vendorId, authState.token, page, searchQuery]);

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//     setPage(0); // Reset to first page on search
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Header />
//       <div className="container mx-auto px-4 py-8 flex-grow">
//         {/* Shop Banner */}
//         <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 h-52 rounded-xl overflow-hidden mb-8 shadow-lg">
//           <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//             <div className="text-center">
//               <h1 className="text-4xl font-bold text-white drop-shadow-lg">
//                 {shopInfo?.shopName || "Shop không xác định"}
//               </h1>
//               <p className="text-white text-base mt-2 max-w-lg mx-auto">
//                 {shopInfo?.shopDescription || "Khám phá các sản phẩm tuyệt vời từ cửa hàng của chúng tôi!"}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-8 rounded-xl shadow-md">
//           {/* Search Bar */}
//           <div className="mb-6">
//             <div className="relative">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 placeholder="Tìm kiếm sản phẩm trong shop..."
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
//               />
//               <svg
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 ></path>
//               </svg>
//             </div>
//           </div>

//           <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sản phẩm của shop</h2>

//           {loading && (
//             <div className="text-center py-12">
//               <div className="animate-spin inline-block w-8 h-8 border-4 border-t-blue-500 rounded-full"></div>
//               <span className="ml-3 text-gray-600 text-lg">Đang tải...</span>
//             </div>
//           )}
//           {error && (
//             <p className="text-center text-red-500 py-12 text-lg">{error}</p>
//           )}

//           {!loading && !error && products.length === 0 && (
//             <p className="text-center text-gray-500 py-12 text-lg">
//               Shop hiện không có sản phẩm nào.
//             </p>
//           )}

//           {!loading && !error && products.length > 0 && (
//             <>
//               <div className="mb-6 text-gray-600 text-lg font-medium">
//                 Tìm thấy {products.length} sản phẩm
//               </div>
//               {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {products.map((product) => (
//                   <ProductCard key={product.productId} product={product} />
//                 ))}
//               </div> */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//             </>
//           )}

//           {totalPages > 1 && (
//             <div className="flex justify-center items-center mt-10 gap-3">
//               <button
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
//                 onClick={() => setPage((prev) => Math.max(0, prev - 1))}
//                 disabled={page === 0}
//               >
//                 Trang trước
//               </button>
//               <div className="flex items-center gap-2">
//                 {Array.from({ length: totalPages }, (_, index) => (
//                   <button
//                     key={index}
//                     className={`px-4 py-2 rounded-lg text-sm ${
//                       page === index
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                     }`}
//                     onClick={() => setPage(index)}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
//                 onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
//                 disabled={page === totalPages - 1}
//               >
//                 Trang sau
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { message } from "antd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/product/ProductCard";

export default function ShopPage() {
  const { vendorId } = useParams();
  const { authState } = useAuth();
  const router = useRouter();

  const [shopInfo, setShopInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authState.token) {
      message.warning("Vui lòng đăng nhập để xem thông tin shop");
      router.push("/login");
      return;
    }

    async function fetchShopInfo() {
      try {
        const res = await fetch(`/api/users/vendors/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (!res.ok) throw new Error("Không thể lấy thông tin shop");

        const data = await res.json();
        setShopInfo(data);
      } catch (err) {
        console.error(err);
        setShopInfo({
          shopName: "Shop không xác định",
          shopDescription: "Không có mô tả",
        });
      }
    }

    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products/vendors/${vendorId}?page=${page}&size=12&productName=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Không thể lấy danh sách sản phẩm");

        const data = await res.json();

        const mapped = (data.content || [])
          .filter((product) => product.show !== false)
          .map((product) => ({
            id: product.productId,
            name: product.productName,
            price: product.price,
            image: product.coverImage,
            rating: product.ratingAvg,
            salesCount: product.soldCount,
            stock: product.stock,
          }));

        setProducts(mapped);
        setTotalPages(data.totalPages || 0);
        setTotalProducts(data.totalElements || 0);
      } catch (err) {
        console.error(err);
        setError(err.message || "Lỗi khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    }

    fetchShopInfo();
    fetchProducts();
  }, [vendorId, authState.token, page, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Banner */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 h-52 rounded-xl overflow-hidden mb-8 shadow-lg">
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                {shopInfo?.shopName || "Shop không xác định"}
              </h1>
              <p className="text-white text-base mt-2 max-w-lg mx-auto">
                {shopInfo?.shopDescription || "Khám phá các sản phẩm tuyệt vời từ cửa hàng của chúng tôi!"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          {/* Search */}
          <div className="mb-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Tìm kiếm sản phẩm trong shop..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sản phẩm của shop</h2>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-t-blue-500 rounded-full inline-block" />
              <span className="ml-3 text-gray-600 text-lg">Đang tải...</span>
            </div>
          )}
          {error && <p className="text-center text-red-500 py-12 text-lg">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p className="text-center text-gray-500 py-12 text-lg">
              Shop hiện không có sản phẩm nào.
            </p>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="mb-6 text-gray-600 text-lg font-medium">
                Tìm thấy {totalProducts} sản phẩm
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 gap-3">
              <button
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Trang trước
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      page === index
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
