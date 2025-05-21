// "use client";

//     import { useContext, useEffect, useState } from "react";
//     import { useSearchParams } from "next/navigation";
//     import { OrderContext } from "@/context/OrderContext";
//     import { useAuth } from "@/context/AuthContext";
//     import Header from "@/components/Header";
//     import Footer from "@/components/Footer";
//     import Link from "next/link";

//     export default function SearchPage() {
//       const searchParams = useSearchParams();
//       const { addToCart } = useContext(OrderContext);
//       const { authState } = useAuth();
//       const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
//       const [products, setProducts] = useState([]);
//       const [loading, setLoading] = useState(false);
//       const [error, setError] = useState(null);
//       const [sortOption, setSortOption] = useState("");
//       const [filters, setFilters] = useState({
//         priceRange: { min: "", max: "" },
//         condition: null,
//         rating: 0,
//         locations: [],
//       });
//       const [displayPrice, setDisplayPrice] = useState({
//         min: "",
//         max: "",
//       });
//       const [currentPage, setCurrentPage] = useState(0);
//       const [totalPages, setTotalPages] = useState(0);
//       const [totalProducts, setTotalProducts] = useState(0);

//       const formatVND = (value) => {
//         if (value === "" || isNaN(value)) return "";
//         return Number(value).toLocaleString("vi-VN", { minimumFractionDigits: 0 }).replace(/₫/g, "");
//       };

//       const parseVND = (value) => {
//         if (!value) return "";
//         const cleaned = value.replace(/[^0-9]/g, "");
//         return cleaned ? parseInt(cleaned) : "";
//       };

//       const buildSearchUrl = (pageNum, query, sort) => {
//         const baseUrl = `/api/products/search`;
//         const params = new URLSearchParams();
//         params.append("productName", query.trim());
//         params.append("page", pageNum);
//         params.append("size", 60);
//         if (filters.priceRange.min) params.append("minPrice", filters.priceRange.min);
//         if (filters.priceRange.max) params.append("maxPrice", filters.priceRange.max);
//         if (filters.condition !== null) params.append("isNew", filters.condition);
//         if (filters.rating > 0) params.append("minRating", filters.rating);
//         if (sort) params.append("sortKey", sort);
//         return `${baseUrl}?${params.toString()}`;
//       };

//       const searchProducts = async () => {
//         if (!searchQuery.trim()) return;
//         setLoading(true);
//         setError(null);
//         try {
//           const url = buildSearchUrl(currentPage, searchQuery, sortOption);
//           console.log("Search URL:", url);
//           console.log("Auth Token:", authState.token);
//           const headers = authState.token ? { Authorization: `Bearer ${authState.token}` } : {};
//           const response = await fetch(url, { headers });
//           console.log("Response Status:", response.status);
//           if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//           const data = await response.json();
//           console.log("API Response:", data);
//           const mappedProducts = (data.content || []).map((item) => ({
//             id: item.productId,
//             name: item.productName,
//             price: item.price,
//             image: item.coverImage || "/images/product-placeholder.jpg",
//             rating: item.ratingAvg,
//             isNew: item.new,
//             salesCount: item.soldCount,
//           }));
//           setProducts(mappedProducts);
//           setTotalProducts(data.totalElements || 0);
//           setTotalPages(data.totalPages || 1);
//         } catch (err) {
//           setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
//           console.error("Search Error:", err);
//         } finally {
//           setLoading(false);
//         }
//       };

//       useEffect(() => {
//         if (searchQuery) {
//           searchProducts();
//         }
//       }, [searchQuery, sortOption, filters, currentPage]);

//       const handleAddToCart = (product) => {
//         if (!authState.isAuthenticated) {
//           alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
//           return;
//         }
//         addToCart({
//           id: product.id,
//           name: product.name,
//           price: product.price,
//           image: product.image,
//           quantity: 1,
//         });
//         alert(`${product.name} đã được thêm vào giỏ hàng!`);
//       };

//       const handlePageChange = (newPage) => {
//         if (newPage >= 0 && newPage < totalPages) {
//           setCurrentPage(newPage);
//           window.scrollTo({ top: 0, behavior: "smooth" });
//         }
//       };

//       const handleFilterChange = (type) => (e) => {
//         const { value, checked } = e.target;
//         if (type === "minRatings") {
//           setFilters((prev) => ({
//             ...prev,
//             rating: checked ? parseInt(value) : 0,
//           }));
//           setCurrentPage(0);
//         } else if (type === "priceRange") {
//           const field = e.target.name;
//           const rawValue = parseVND(value);
//           setDisplayPrice((prev) => ({
//             ...prev,
//             [field]: value,
//           }));
//           if (rawValue !== "" && (rawValue < 0 || rawValue > 100000000)) return;
//           setFilters((prev) => {
//             const otherField = field === "min" ? "max" : "min";
//             const otherValue = prev.priceRange[otherField];
//             if (field === "min" && otherValue && rawValue > otherValue) return prev;
//             if (field === "max" && otherValue && rawValue < otherValue) return prev;
//             return {
//               ...prev,
//               priceRange: { ...prev.priceRange, [field]: rawValue },
//             };
//           });
//           setCurrentPage(0);
//         } else if (type === "condition") {
//           setFilters((prev) => {
//             if (value === "new" && checked && prev.condition === true) {
//               return { ...prev, condition: null };
//             }
//             if (value === "old" && checked && prev.condition === false) {
//               return { ...prev, condition: null };
//             }
//             return {
//               ...prev,
//               condition: checked ? (value === "new" ? true : false) : null,
//             };
//           });
//           setCurrentPage(0);
//         }
//       };

//       const handlePriceBlur = (field) => () => {
//         setDisplayPrice((prev) => ({
//           ...prev,
//           [field]: formatVND(filters.priceRange[field]),
//         }));
//       };

//       const handleSortChange = (e) => {
//         setSortOption(e.target.value);
//         setCurrentPage(0);
//       };

//       return (
//         <div className="flex flex-col min-h-screen bg-gray-100">
//           <Header />

//           <main className="container mx-auto px-4 py-8 flex-grow">
//             <h1 className="text-2xl font-bold text-gray-700 mb-6">
//               Kết quả tìm kiếm cho "{searchQuery}"
//             </h1>

//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="md:w-3/4">
//                 <div className="mb-4">
//                   <label className="text-gray-700 mr-2">Sắp xếp theo:</label>
//                   <select
//                     value={sortOption}
//                     onChange={handleSortChange}
//                     className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   >
//                     <option value="">Mặc định</option>
//                     <option value="priceAsc">Giá thấp đến cao</option>
//                     <option value="priceDesc">Giá cao đến thấp</option>
//                     <option value="createdAtDesc">Mới nhất</option>
//                     <option value="salesCountDesc">Bán chạy</option>
//                   </select>
//                 </div>

//                 {loading && <p className="text-center text-gray-500">Đang tải...</p>}
//                 {error && <p className="text-center text-red-500">{error}</p>}

//                 {!loading && !error && products.length === 0 && (
//                   <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
//                 )}

//                 {!loading && !error && products.length > 0 && (
//                   <>
//                     <div className="mb-4 text-gray-600">
//                       Tìm thấy {totalProducts} sản phẩm phù hợp
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                       {products.map((product) => (
//                         <div
//                           key={product.id}
//                           className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
//                         >
//                           <Link href={`/product/${product.id}`}>
//                             <img
//                               src={product.image || "/images/product-placeholder.jpg"}
//                               alt={product.name}
//                               className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer"
//                             />
//                           </Link>
//                           <h3 className="text-sm font-medium text-gray-700 truncate">
//                             <Link href={`/product/${product.id}`}>{product.name}</Link>
//                           </h3>
//                           <p className="text-red-500 font-bold mt-2">
//                             {(product.price || 0).toLocaleString("vi-VN")} ₫
//                           </p>
//                           <button
//                             onClick={() => handleAddToCart(product)}
//                             className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
//                           >
//                             Thêm vào giỏ
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}

//                 {totalPages > 1 && (
//                   <div className="flex justify-center mt-8 space-x-2">
//                     <button
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 0}
//                       className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
//                     >
//                       Trước
//                     </button>
//                     <span className="px-4 py-2">
//                       Trang {currentPage + 1} / {totalPages}
//                     </span>
//                     <button
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages - 1}
//                       className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
//                     >
//                       Sau
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-md">
//                 <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>

//                 <div className="mb-6">
//                   <h3 className="text-lg font-medium mb-2">Đánh giá</h3>
//                   <div className="space-y-2">
//                     {[5, 4, 3, 2, 1].map((rating) => (
//                       <label key={rating} className="flex items-center">
//                         <input
//                           type="checkbox"
//                           value={rating}
//                           checked={filters.rating === rating}
//                           onChange={handleFilterChange("minRatings")}
//                           className="mr-2"
//                         />
//                         <span className="text-yellow-500">{'★'.repeat(rating)}</span>
//                         <span className="text-gray-700 ml-1">{rating} sao trở lên</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <h3 className="text-lg font-medium mb-2">Khoảng giá</h3>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="text"
//                       name="min"
//                       placeholder="Giá tối thiểu"
//                       value={displayPrice.min}
//                       onChange={handleFilterChange("priceRange")}
//                       onBlur={handlePriceBlur("min")}
//                       className="w-1/2 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                     <span className="text-gray-700">-</span>
//                     <input
//                       type="text"
//                       name="max"
//                       placeholder="Giá tối đa"
//                       value={displayPrice.max}
//                       onChange={handleFilterChange("priceRange")}
//                       onBlur={handlePriceBlur("max")}
//                       className="w-1/2 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <h3 className="text-lg font-medium mb-2">Tình trạng</h3>
//                   <div className="space-y-2">
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         value="new"
//                         checked={filters.condition === true}
//                         onChange={handleFilterChange("condition")}
//                         className="mr-2"
//                       />
//                       <span className="text-gray-700">Mới</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         value="old"
//                         checked={filters.condition === false}
//                         onChange={handleFilterChange("condition")}
//                         className="mr-2"
//                       />
//                       <span className="text-gray-700">Cũ</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </main>

//           <Footer />
//         </div>
//       );
//     }


"use client";

import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OrderContext } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { addToCart } = useContext(OrderContext);
  const { authState } = useAuth();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [filters, setFilters] = useState({
    priceRange: { min: "", max: "" },
    condition: null,
    rating: 0,
    locations: [],
  });
  const [displayPrice, setDisplayPrice] = useState({
    min: "",
    max: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const formatVND = (value) => {
    if (value === "" || isNaN(value)) return "";
    return Number(value).toLocaleString("vi-VN", { minimumFractionDigits: 0 }).replace(/₫/g, "");
  };

  const parseVND = (value) => {
    if (!value) return "";
    const cleaned = value.replace(/[^0-9]/g, "");
    return cleaned ? parseInt(cleaned) : "";
  };

  const buildSearchUrl = (pageNum, query) => {
    const baseUrl = `/api/products/search`;
    const params = new URLSearchParams();
    params.append("productName", query.trim() || "");
    params.append("page", pageNum);
    params.append("size", 60);
    if (filters.priceRange.min) params.append("minPrice", filters.priceRange.min);
    if (filters.priceRange.max) params.append("maxPrice", filters.priceRange.max);
    if (filters.condition !== null) params.append("isNew", filters.condition);
    if (filters.rating > 0) params.append("minRating", filters.rating);
    // Không gửi sortKey để tránh lỗi thiếu index
    return `${baseUrl}?${params.toString()}`;
  };

  const sortProducts = (products, sortOption) => {
    return [...products].sort((a, b) => {
      switch (sortOption) {
        case "price_asc":
          return (a.price || 0) - (b.price || 0);
        case "price_desc":
          return (b.price || 0) - (a.price || 0);
        case "latest":
          // Sử dụng productId làm proxy cho createdAt (vì API không trả createdAt)
          // Giả định productId là UUID, so sánh chuỗi để gần đúng thứ tự thời gian
          return b.id.localeCompare(a.id);
        case "best_selling":
          return (b.salesCount || 0) - (a.salesCount || 0);
        default:
          return b.id.localeCompare(a.id); // Mặc định sắp xếp theo productId (gần giống latest)
      }
    });
  };

  const searchProducts = async () => {
    if (!searchQuery.trim()) {
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(0);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = buildSearchUrl(currentPage, searchQuery);
      console.log("Search URL:", url);
      console.log("Auth Token:", authState.token);
      const headers = authState.token ? { Authorization: `Bearer ${authState.token}` } : {};
      const response = await fetch(url, { headers });
      console.log("Response Status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.detail || "Không rõ"}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (!data.content || !Array.isArray(data.content)) {
        console.warn("API response content is invalid or empty:", data);
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(0);
        setError("Không tìm thấy sản phẩm phù hợp.");
        return;
      }
      
      const mappedProducts = data.content.map((item) => ({
        id: item.productId,
        name: item.productName,
        price: item.price,
        image: item.coverImage || "/images/product-placeholder.jpg",
        rating: item.ratingAvg,
        isNew: item.new,
        salesCount: item.soldCount,
      }));
      
      // Sắp xếp sản phẩm trên frontend
      const sortedProducts = sortProducts(mappedProducts, sortOption);
      
      setProducts(sortedProducts);
      setTotalProducts(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
      
      if (sortedProducts.length === 0 && data.totalElements > 0) {
        console.warn("No products after sorting, possible issue with data:", sortOption);
        setError("Không tìm thấy sản phẩm phù hợp với tiêu chí sắp xếp.");
      }
    } catch (err) {
      setError(err.message || "Không thể tải sản phẩm. Vui lòng thử lại sau.");
      console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchProducts();
  }, [searchQuery, sortOption, filters, currentPage]);

  const handleAddToCart = (product) => {
    if (!authState.isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    alert(`${product.name} đã được thêm vào giỏ hàng!`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = (type) => (e) => {
    const { value, checked } = e.target;
    if (type === "minRatings") {
      setFilters((prev) => ({
        ...prev,
        rating: checked ? parseInt(value) : 0,
      }));
      setCurrentPage(0);
    } else if (type === "priceRange") {
      const field = e.target.name;
      const rawValue = parseVND(value);
      setDisplayPrice((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (rawValue !== "" && (rawValue < 0 || rawValue > 100000000)) return;
      setFilters((prev) => {
        const otherField = field === "min" ? "max" : "min";
        const otherValue = prev.priceRange[otherField];
        if (field === "min" && otherValue && rawValue > otherValue) return prev;
        if (field === "max" && otherValue && rawValue < otherValue) return prev;
        return {
          ...prev,
          priceRange: { ...prev.priceRange, [field]: rawValue },
        };
      });
      setCurrentPage(0);
    } else if (type === "condition") {
      setFilters((prev) => {
        if (value === "new" && checked && prev.condition === true) {
          return { ...prev, condition: null };
        }
        if (value === "old" && checked && prev.condition === false) {
          return { ...prev, condition: null };
        }
        return {
          ...prev,
          condition: checked ? (value === "new" ? true : false) : null,
        };
      });
      setCurrentPage(0);
    }
  };

  const handlePriceBlur = (field) => () => {
    setDisplayPrice((prev) => ({
      ...prev,
      [field]: formatVND(filters.priceRange[field]),
    }));
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    console.log("Selected sort option:", newSortOption);
    setSortOption(newSortOption);
    setCurrentPage(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          Kết quả tìm kiếm cho "{searchQuery}"
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4">
            <div className="mb-4">
              <label className="text-gray-700 mr-2">Sắp xếp theo:</label>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Mặc định</option>
                <option value="price_asc">Giá thấp đến cao</option>
                <option value="price_desc">Giá cao đến thấp</option>
                <option value="latest">Mới nhất</option>
                <option value="best_selling">Bán chạy</option>
              </select>
            </div>

            {loading && <p className="text-center text-gray-500">Đang tải...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && products.length === 0 && (
              <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                <div className="mb-4 text-gray-600">
                  Tìm thấy {totalProducts} sản phẩm phù hợp
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                      <Link href={`/product/${product.id}`}>
                        <img
                          src={product.image || "/images/product-placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer"
                        />
                      </Link>
                      <h3 className="text-sm font-medium text-gray-700 truncate">
                        <Link href={`/product/${product.id}`}>{product.name}</Link>
                      </h3>
                      <p className="text-red-500 font-bold mt-2">
                        {(product.price || 0).toLocaleString("vi-VN")} ₫
                      </p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Trước
                </button>
                <span className="px-4 py-2">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            )}
          </div>

          <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Đánh giá</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={handleFilterChange("minRatings")}
                      className="mr-2"
                    />
                    <span className="text-yellow-500">{'★'.repeat(rating)}</span>
                    <span className="text-gray-700 ml-1">{rating} sao trở lên</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Khoảng giá</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="min"
                  placeholder="Giá tối thiểu"
                  value={displayPrice.min}
                  onChange={handleFilterChange("priceRange")}
                  onBlur={handlePriceBlur("min")}
                  className="w-1/2 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-gray-700">-</span>
                <input
                  type="text"
                  name="max"
                  placeholder="Giá tối đa"
                  value={displayPrice.max}
                  onChange={handleFilterChange("priceRange")}
                  onBlur={handlePriceBlur("max")}
                  className="w-1/2 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Tình trạng</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="new"
                    checked={filters.condition === true}
                    onChange={handleFilterChange("condition")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Mới</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="old"
                    checked={filters.condition === false}
                    onChange={handleFilterChange("condition")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Cũ</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

