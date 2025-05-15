"use client";
import { useEffect, useRef, useState } from "react";
import EditProductModal from "../product/EditProductModal";
import { useAuth } from "@/context/AuthContext";
import { message } from "antd";


export default function ProductDetailView({ productId, onBack }) {
  const { user, authState } = useAuth();
  const modalRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("Tổng quan");
  const [visibility, setVisibility] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleToggleVisibility = async (productId) => {
    const response = await fetch(`/api/products/${productId}/${visibility ? "hide" : "show"}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
    });
    if (!response.ok) {
      console.error("Error updating visibility:", response.statusText);
      return;
    }
    setVisibility((x) => !x);
  };

  const fetchProduct = async () => {
    const productData = await fetch(`/api/products/${productId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
    });
    if (!productData.ok) {
      console.error("Error fetching product:", productData.statusText);
      return;
    }
    const productJson = await productData.json();
    console.log("Product data:", productJson);
    setVisibility(productJson.show);
    setProduct(productJson);

  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleSaveProduct = () => {
    fetchProduct();
    message.success("Cập nhật sản phẩm thành công");
  };

  if (!product)
    return (
      <div className="p-8 text-center text-gray-500">Đang tải sản phẩm...</div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Nút quay lại */}
      <button
        onClick={onBack}
        className="mb-4 text-blue-600 hover:underline flex items-center gap-1"
      >
        <i className="fas fa-arrow-left text-xs"></i> Quay lại danh sách
      </button>

      {/* Header và nút hành động */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-black">{product.productName}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              modalRef.current.showModal();
            }}
            className="px-4 py-2 border border-gray-300 rounded text-black bg-white hover:bg-gray-50 flex items-center gap-2 text-sm"
          >
            <i className="fas fa-pen"></i> Sửa
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded text-black bg-white hover:bg-gray-50 flex items-center gap-2 text-sm">
            <i className="fas fa-download"></i> Tải xuống
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {["Tổng quan", "Nhập hàng", "Điều chỉnh", "Lịch sử"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-8 py-2 px-1 border-b-2 text-sm ${
              activeTab === tab
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Nội dung tab */}
      <div>
        {activeTab === "Tổng quan" && (
          <div className="grid grid-cols-3 gap-6">
            {/* Cột thông tin chính và nhà cung cấp */}
            <div className="col-span-2">
              {/* Thông tin chính */}
              <div className="mb-8">
                <h3 className="text-black font-semibold mb-4 text-base">
                  Thông tin chính
                </h3>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-gray-500">Tên sản phẩm</div>
                  <div className="text-black">{product.productName}</div>
                  <div className="text-gray-500">Mã sản phẩm</div>
                  <div className="text-black">{product.productId}</div>
                  <div className="text-gray-500">Giá thành sản phẩm</div>
                  <div className="text-black">{product.price}</div>
                  <div className="text-gray-500">Đánh giá</div>
                  <div className="text-black">
                    {product.ratingAvg
                      ? product.ratingAvg.toFixed(1)
                      : "Chưa có đánh giá"}
                  </div>
                  <div className="text-gray-500">Giá trị giới hạn</div>
                  <div className="text-black">{product.stock}</div>
                  <div className="text-gray-500">Số lượng bán ra</div>
                  <div className="text-black">{product.soldCount}</div>
                  <div className="text-gray-500">Chú thích</div>
                  <div className="text-black">{product.description || "Không có"}</div>
                  <div className="text-gray-500">Thương hiệu</div>
                  <div className="text-black">{product.brand || "Không có"}</div>
                  <div className="text-gray-500">Danh mục 1: {product.firstCategoryName}</div>
                  <div className="text-black">
                    {product.firstCategories?.map((category) => (
                      <span
                        key={category}
                        className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-500">Danh mục 2: {product.secondCategoryName}</div>
                  <div className="text-black">
                    {product.secondCategories?.map((category) => (
                      <span
                        key={category}
                        className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-500">Trạng thái sản phẩm</div>
                  <div className="text-black">{product.new ? "Mới" : "Cũ"}</div>
                  <div className="text-gray-500">Hiển thị</div>
                  <div className="text-black">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibility}
                        onChange={() => handleToggleVisibility(product.productId)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {visibility ? "Đang hiển thị" : "Đang ẩn"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột ảnh và số liệu */}
            <div className="col-span-1">
              {/* Ảnh sản phẩm */}
              <div className="mb-8">
                <h3 className="text-black font-semibold mb-4 text-base">
                  Ảnh chính của sản phẩm
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded p-1">
                    <img
                      src={product.coverImage}
                      alt={`Ảnh sản phẩm`}
                      className="w-full h-36 object-cover rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Media Gallery */}
              <div className="mb-8">
                <h3 className="text-black font-semibold mb-4 text-base">
                  Thư viện hình ảnh
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {product.imageList?.map((data, index) => (
                    <div
                      key={data}
                      className="border-2 border-dashed border-gray-300 rounded p-1"
                    >
                      <img
                        src={data}
                        alt={`Sample ${index + 1}`}
                        className="w-full h-36 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Video sản phẩm */}
              <div className="mb-8">
                <h3 className="text-black font-semibold mb-4 text-base">
                  Video sản phẩm
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {product.video && (
                    <video
                      controls
                      className="w-full h-80 object-cover rounded col-span-3"
                      src={product.video}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab !== "Tổng quan" && (
          <div className="py-4">
            <p className="text-gray-500">
              Thông tin {activeTab.toLowerCase()} sẽ hiển thị ở đây
            </p>
          </div>
        )}
      </div>

      {/* {isEditModalOpen && ( */}
        <EditProductModal
          dialogRef={modalRef}
          product={product}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProduct}
        />
      {/* )}*/}
    </div>
  );
}