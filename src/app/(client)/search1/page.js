"use client";

import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OrderContext } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { productApi } from "@/services/api/product";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { addToCart } = useContext(OrderContext);
  const { authState } = useAuth();
  const [rawProducts, setRawProducts] = useState([]); // Danh sách gốc từ API
  const [products, setProducts] = useState([]); // Danh sách đã lọc và sắp xếp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    productName: searchParams.get("productName") || "",
    minRatings: [],
    locations: [],
  });
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productApi.searchProducts({
          productName: filters.productName,
          page: currentPage,
          size: 12,
        });
        setRawProducts(response.content || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.productName, currentPage]);

  // Lọc và sắp xếp sản phẩm trên client
  useEffect(() => {
    let filteredProducts = [...rawProducts];

    // Lọc theo đánh giá
    if (filters.minRatings.length > 0) {
      const minRating = Math.min(...filters.minRatings);
      filteredProducts = filteredProducts.filter((product) => product.rating >= minRating);
    }

    // Lọc theo nơi bán
    if (filters.locations.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.locations.includes(product.location)
      );
    }

    // Sắp xếp
    if (sortOrder === "lowToHigh") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "newest") {
      filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "bestSelling") {
      filteredProducts.sort((a, b) => b.salesCount - a.salesCount);
    }

    setProducts(filteredProducts);
  }, [rawProducts, filters, sortOrder]);

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
    setFilters((prev) => {
      const updated = { ...prev };
      if (type === "minRatings") {
        updated.minRatings = checked
          ? [...prev.minRatings, parseInt(value)]
          : prev.minRatings.filter((r) => r !== parseInt(value));
      } else if (type === "locations") {
        updated.locations = checked
          ? [...prev.locations, value]
          : prev.locations.filter((l) => l !== value);
      }
      return updated;
    });
    setCurrentPage(0);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          Kết quả tìm kiếm cho "{filters.productName}"
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Danh sách sản phẩm */}
          <div className="md:w-3/4">
            {/* Phần sắp xếp */}
            <div className="mb-4">
              <label className="text-gray-700 mr-2">Sắp xếp theo:</label>
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="default">Mặc định</option>
                <option value="lowToHigh">Giá thấp đến cao</option>
                <option value="highToLow">Giá cao đến thấp</option>
                <option value="newest">Mới nhất</option>
                <option value="bestSelling">Bán chạy</option>
              </select>
            </div>

            {loading && <p className="text-center text-gray-500">Đang tải...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && products.length === 0 && (
              <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/product/${product.id}`}>
                      <img
                        src={product.coverImage || "/images/product-placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer"
                      />
                    </Link>
                    <h3 className="text-sm font-medium text-gray-700 truncate">
                      <Link href={`/product/${product.id}`}>{product.productName}</Link>
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

          {/* Bộ lọc */}
          <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>

            {/* Đánh giá */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Đánh giá</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      value={rating}
                      checked={filters.minRatings.includes(rating)}
                      onChange={handleFilterChange("minRatings")}
                      className="mr-2"
                    />
                    <span className="text-yellow-500">{'★'.repeat(rating)}</span>
                    <span className="text-gray-700 ml-1">{rating} sao trở lên</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nơi bán */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Nơi bán</h3>
              <div className="space-y-2">
                {["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Nơi khác"].map((location) => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      value={location}
                      checked={filters.locations.includes(location)}
                      onChange={handleFilterChange("locations")}
                      className="mr-2"
                    />
                    <span className="text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}