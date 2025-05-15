"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { mockProducts } from "@/data/mockData";
import { CATEGORIES } from "@/utils/constants";
import ProductDetailView from "./ProductDetailView"; // Import component mới
import { useAuth } from "@/context/AuthContext";

export default function Inventory() {
  const size = 10;

  const { user, authState } = useAuth();
  const accessToken = authState.token;

  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedProductId, setSelectedProductId] = useState(null); // State mới
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    quantity: "",
    coverImage: null,
    images: [],
    video: "",
    vendorId: user?.vendorId || "", // Automatically fetch vendorId
    firstCategories: [],
    secondCategories: [],
    firstCategoryName: null, // Added name for first category
    secondCategoryName: null, // Added name for second category
    isNew: false,
    isVisible: true, // Added visibility state
  });
  const [products, setProducts] = useState({
    content: [],
  });

  const handleLoadPage = async (nextPage) => {
    const url = new URL(
      "/api/products/vendors/" + user.userId,
      window.location.origin
    );
    url.searchParams.append("page", nextPage);
    url.searchParams.append("size", size);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
  
    handleLoadPage(0);
  }, [authState]);

  

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };

    // Thêm sự kiện keydown khi modal mở
    if (showModal) {
      document.addEventListener("keydown", handleEscape);
    }

    // Xóa sự kiện khi modal đóng hoặc component unmount
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length >= 3 && files.length <= 9) {
      setFormData({ ...formData, images: files });
    } else {
      alert("Vui lòng chọn từ 3 đến 9 ảnh.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FormData before submit:", formData);

    const { productName, price, quantity, coverImage, images, video } =
      formData;

    // Kiểm tra các trường bắt buộc
    if (!productName || !price || !quantity || !coverImage || !video) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    if (quantity <= 0) {
      alert("Số lượng sản phẩm phải lớn hơn 0.");
      return;
    }

    if (images.length < 3 || images.length > 9) {
      alert("Vui lòng chọn từ 3 đến 9 ảnh.");
      return;
    }

    // Tạo FormData
    const formDataToSend = new FormData();
    formDataToSend.append("productName", productName);
    formDataToSend.append("price", parseFloat(price));
    formDataToSend.append("stock", parseInt(quantity));
    formDataToSend.append("coverImage", coverImage);
    formDataToSend.append("video", video);
    formDataToSend.append("vendorId", user.userId);
    formDataToSend.append("firstCategoryName", formData.firstCategoryName);
    formDataToSend.append("secondCategoryName", formData.secondCategoryName);
    formDataToSend.append("isNew", formData.isNew);
    formDataToSend.append("isVisible", formData.isVisible);
    formDataToSend.append(
      "firstCategories",
      JSON.stringify(formData.firstCategories)
    );
    formDataToSend.append(
      "secondCategories",
      JSON.stringify(formData.secondCategories)
    );

    // Thêm danh sách ảnh
    images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    console.log("FormData:", formDataToSend);

    try {
      // Gửi dữ liệu bằng fetch
      const response = await fetch(`/api/products`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json(); // Đọc lỗi chi tiết từ server
        throw new Error(errorData.message || "Failed to upload product");
      }

      const result = await response.json();
      alert("Thêm sản phẩm thành công!");
      console.log("Response:", result);

      // Reset form
      setFormData({
        productName: "",
        price: "",
        quantity: "",
        coverImage: null,
        images: [],
        video: "",
        firstCategories: [],
        secondCategories: [],
        firstCategoryName: "",
        secondCategoryName: "",
        isNew: false,
        isVisible: true,
      });

      setProducts((prevProducts) => {
        if (prevProducts.content.length >= size) {
          return prevProducts;
        }
        return {
          ...prevProducts,
          content: [result, ...prevProducts.content], // Thêm sản phẩm mới vào đầu danh sách
        };
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Đã xảy ra lỗi khi thêm sản phẩm.");
    }
  };

  // Hàm xử lý khi click vào sản phẩm
  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
  };

  // Hàm xử lý khi nhấn nút Back trong chi tiết sản phẩm
  const handleBackToList = () => {
    setSelectedProductId(null);
  };

  const handleAddCategory = (e, categoryType) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      setFormData({
        ...formData,
        [categoryType]: [...formData[categoryType], e.target.value.trim()],
      });
      e.target.value = "";
    }
  };

  const handleRemoveCategory = (index, categoryType) => {
    setFormData({
      ...formData,
      [categoryType]: formData[categoryType].filter((_, i) => i !== index),
    });
  };

  const toggleIsNew = () => {
    setFormData((prevData) => ({ ...prevData, isNew: !prevData.isNew }));
  };

  

  if (user == null) {
    return (
      <div className="text-center text-red-500">
        Vui lòng đăng nhập để xem trang này.
      </div>
    );
  }

  if (!products.content) {
    return <div className="text-center text-red-500">Đang loading</div>;
  }

  return (
    <div className="relative">
      {/* Thanh tìm kiếm và Tổng quan luôn hiển thị */}
      {/* Thanh tìm kiếm */}

      {/* Tổng quan kho */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <span className="text-xs font-semibold text-blue-600 mb-1">
            Loại sản phẩm
          </span>
          <span className="text-2xl font-bold text-black">14</span>
          <span className="text-xs text-black mt-1">7 ngày gần đây</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <span className="text-xs font-semibold text-orange-500 mb-1">
            Tổng số lượng sản phẩm
          </span>
          <span className="text-2xl font-bold text-black">868</span>
          <span className="text-xs text-black mt-1">7 ngày gần đây</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <span className="text-xs font-semibold text-purple-600 mb-1">
            Top Selling
          </span>
          <span className="text-2xl font-bold text-black">5</span>
          <span className="text-xs text-black mt-1">7 ngày gần đây</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <span className="text-xs font-semibold text-red-500 mb-1">
            Hàng tồn kho thấp
          </span>
          <span className="text-2xl font-bold text-black">12</span>
          <span className="text-xs text-gray-500 mt-1">
            2 không có trong kho
          </span>
        </div>
      </div>

      {/* Phần nội dung chính: Danh sách hoặc Chi tiết */}
      {selectedProductId ? (
        <ProductDetailView
          productId={selectedProductId}
          onBack={handleBackToList}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black">Danh sách sản phẩm</h2>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => setShowModal(true)}
              >
                Thêm sản phẩm
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded hover:bg-gray-100 transition">
                Filters
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded hover:bg-gray-100 transition">
                Tải xuống
              </button>
            </div>
          </div>
          {products.content.length === 0 && (
            <p className="text-center py-4 text-gray-500">
              Không có sản phẩm nào
            </p>
          )}
          {products.content.length > 0 && (
            <>
              <table className="w-full text-left border-t">
                <thead>
                  <tr className="text-gray-600">
                    <th className="py-3 text-black">Hình ảnh</th>
                    <th className="py-3 text-black">Tên sản phẩm</th>
                    <th className="py-3 text-black">Giá nhập</th>
                    <th className="py-3 text-black">Số lượng</th>
                    <th className="py-3 text-black">Trạng thái</th>
                  </tr>
                </thead>

                <tbody>
                  {products.content.map((item) => (
                    <tr
                      key={item.productId}
                      className="border-t hover:bg-blue-50 transition cursor-pointer"
                      onClick={() => handleProductClick(item.productId)}
                    >
                      <td className="py-3 text-black font-medium items-center gap-2">
                        <img
                          src={item.coverImage}
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 text-black font-medium items-center gap-2">
                        {item.productName}
                      </td>
                      <td className="py-3 text-black">
                        ₫{item.price.toLocaleString()}
                      </td>
                      <td className="py-3 text-black">{item.stock}</td>
                      {/* <td className="py-3 text-black">{CATEGORIES.find(c => item.name.toLowerCase().includes(c.name.toLowerCase()))?.name || 'Khác'}</td> */}
                      <td className="py-3">
                        {item.stock > 10 ? (
                          <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                            Còn hàng
                          </span>
                        ) : item.stock > 0 ? (
                          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">
                            Sắp hết
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">
                            Hết hàng
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                <button
                  className={`px-4 py-2 bg-white border border-gray-300 text-black rounded hover:bg-gray-100 transition ${
                    products.page == 0 && "cursor-not-allowed "
                  }`}
                  onClick={() => handleLoadPage(products.page - 1)}
                  disabled={products.page == 0}
                >
                  Trước
                </button>
                <span className="text-black">
                  Trang {products.page + 1} trong {products.totalPages}
                </span>
                <button
                  className={`px-4 py-2 bg-white border border-gray-300 text-black rounded hover:bg-gray-100 transition ${
                    products.page + 1 == products.totalPages &&
                    "cursor-not-allowed "
                  }`}
                  onClick={() => handleLoadPage(products.page + 1)}
                  disabled={products.page + 1 == products.totalPages}
                >
                  Sau
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal thêm sản phẩm (giữ nguyên) */}
      {showModal && (
        <>
          {/* Overlay blur, không tối màu */}
          <div className="fixed inset-0 z-40 backdrop-blur-[3px] bg-white/40 transition-all"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-125 border border-gray-200">
              <h2 className="text-lg font-semibold text-black mb-3 text-center">
                Thêm sản phẩm mới
              </h2>
              <form onSubmit={handleSubmit} className="space-y-2">
                <div>
                  <label className="block text-black text-xs font-medium mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-1.5 py-0.5 text-black bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-black text-xs font-medium mb-1">
                      Giá *
                    </label>
                    <input
                      name="price"
                      value={formData.price}
                      type="number"
                      step={0.01}
                      min={0}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-1.5 py-0.5 text-black bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Nhập giá"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-black text-xs font-medium mb-1">
                      Số lượng *
                    </label>
                    <input
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-1.5 py-0.5 text-black bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Nhập số lượng"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-black text-xs font-medium mb-1">
                    Ảnh bìa *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coverImage: e.target.files[0],
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-1.5 py-0.5 text-black bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black text-xs font-medium mb-1">
                    Ảnh sản phẩm (3-9 ảnh) *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full border border-gray-300 rounded-lg px-1.5 py-0.5 text-black bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-black text-xs font-medium mb-1">
                    Video *
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setFormData({ ...formData, video: e.target.files[0] })
                    }
                    className="w-full border border-gray-300 rounded-lg px-1.5 py-0.5 text-black bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-black text-xs font-medium mb-1">
                      Tên loại phần 1
                    </label>
                    <input
                      type="text"
                      value={formData.firstCategoryName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstCategoryName: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-1.5 py-0.5 text-black bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Nhập tên loại phần 1"
                    />
                  </div>
                  <div>
                    <label className="block text-black text-xs font-medium mb-1">
                      Loại phần 1
                    </label>
                    <div className="border border-gray-300 rounded-lg px-1.5 py-0.5 text-black bg-gray-50">
                      {formData.firstCategories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-700 px-1 py-0.5 rounded-full text-xs mr-1 mb-1 cursor-pointer"
                          onClick={() =>
                            handleRemoveCategory(index, "firstCategories")
                          }
                        >
                          {category} &times;
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={`Nhập ${
                          formData.firstCategoryName || "loại phần 1"
                        } và nhấn Enter`}
                        className="w-full border-none focus:outline-none"
                        onKeyDown={(e) =>
                          handleAddCategory(e, "firstCategories")
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-black text-xs font-medium mb-1">
                      Tên loại phần 2
                    </label>
                    <input
                      type="text"
                      value={formData.secondCategoryName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          secondCategoryName: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-1.5 py-0.5 text-black bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Nhập tên loại phần 2"
                    />
                  </div>
                  <div>
                    <label className="block text-black text-xs font-medium mb-1">
                      Loại phần 2
                    </label>
                    <div className="border border-gray-300 rounded-lg px-1.5 py-0.5 text-black bg-gray-50">
                      {formData.secondCategories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-block bg-green-100 text-green-700 px-1 py-0.5 rounded-full text-xs mr-1 mb-1 cursor-pointer"
                          onClick={() =>
                            handleRemoveCategory(index, "secondCategories")
                          }
                        >
                          {category} &times;
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={`Nhập ${
                          formData.secondCategoryName || "loại phần 2"
                        } và nhấn Enter`}
                        className="w-full border-none focus:outline-none"
                        onKeyDown={(e) =>
                          handleAddCategory(e, "secondCategories")
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <label className="block text-black text-xs font-medium mb-1">
                      Hiển thị trên trang web
                    </label>
                    <input
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isVisible: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-black text-xs font-medium mb-1">
                      Trạng thái sản phẩm mới
                    </label>
                    <button
                      type="button"
                      onClick={toggleIsNew}
                      className={`px-2 py-0.5 rounded-lg border ${
                        formData.isNew
                          ? "bg-green-600 text-white"
                          : "bg-gray-300 text-black"
                      } hover:bg-green-700 focus:ring-2 focus:ring-green-500`}
                    >
                      {formData.isNew ? "là sản phẩm mới" : "là sản phẩm cũ"}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <button
                    type="button"
                    className="px-2 py-0.5 rounded-lg border border-gray-300 bg-white text-black hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-2 py-0.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                  >
                    Thêm sản phẩm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
