"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function EditProductModal({
  product,
  onClose,
  onSave,
  dialogRef,
}) {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    productName: product.productName || "",
    price: product.price || 0,
    stock: product.stock || 0,
    description: product.description || "",
    firstCategoryName: product.firstCategoryName || "",
    secondCategoryName: product.secondCategoryName || "",
    currentFirstCategoryName: "",
    currentSecondCategoryName: "",
    firstCategories: product.firstCategories || [],
    secondCategories: product.secondCategories || [],
    brand: product.brand || "",
    coverImage: null,
    video: null,
    imageList: product.imageList || [],
    imagesToDelete: [], // Track images to delete
    newImages: [], // Track new images to upload
    isNew: product.new || false,
  });

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      // dialogRef.current.showModal();
    }
    return () => {
      if (dialogRef.current && dialogRef.current.open) {
        dialogRef.current.close();
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
    }));
  };

  const toggleImageDelete = (imageUrl) => {
    setFormData((prev) => {
      const imagesToDelete = prev.imagesToDelete.includes(imageUrl)
        ? prev.imagesToDelete.filter((url) => url !== imageUrl)
        : [...prev.imagesToDelete, imageUrl];
      return { ...prev, imagesToDelete };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("productName", formData.productName);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("firstCategoryName", formData.firstCategoryName);
    formDataToSend.append("secondCategoryName", formData.secondCategoryName);
    formDataToSend.append("isNew",formData.isNew);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append(
      "firstCategories",
      formData.firstCategories.map((cat) => cat.trim())
    );
    formDataToSend.append(
      "secondCategories",
      formData.secondCategories.map((cat) => cat.trim())
    );
    formDataToSend.append("removeImages", formData.imagesToDelete);
    if (formData.coverImage) {
      formDataToSend.append("coverImage", formData.coverImage);
    }
    if (formData.video) {
      formDataToSend.append("video", formData.video);
    }
    formData.newImages.forEach((image) => {
      formDataToSend.append(`newImages`, image);
    });

    console.log("Form data to send:", formDataToSend);

    try {
      const response = await fetch(
        `/api/products/${product.productId}/update-product`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
          body: formDataToSend,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      onSave();
      handleClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  };

  return (
    // them hieu ung khi dong mo modal
    <dialog
      className="top-1/12 h-10/12 left-1/2 transform -translate-x-1/2 duration-300 transition-all backdrop:bg-black/40 w-1/2"
      ref={dialogRef}
      onClose={() => handleClose()}
      onAbort={() => handleClose()}
      onCancel={() => handleClose()}
    >
      <div className="bg-white p-6">
        <h2
          id="edit-product-modal-title"
          className="text-xl font-semibold mb-4"
        >
          Sửa sản phẩm
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên sản phẩm
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
                aria-required="true"
                min="0"
              />
            </div>
            <div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Số lượng tồn kho
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                  aria-required="true"
                  min="0"
                />
                <label className="block text-sm font-medium text-gray-700">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <label className="block text-sm font-medium text-gray-700">
                  Sản phẩm còn mới
                </label>
                {/*  */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={() =>{
                      setFormData((prev) => ({
                        ...prev,
                        isNew: !prev.isNew,
                      }));
                    }}
                    className="sr-only peer"
                    name="isNew"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {formData.isNew ? "Đang hiển thị" : "Đang ẩn"}
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên danh mục 1
              </label>
              <input
                type="text"
                name="firstCategoryName"
                value={formData.firstCategoryName}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mt-2">
                Danh mục 1 (cách nhau bằng dấu phẩy)
              </label>
              <div className="flex items-center gap-2 ">
                {formData.firstCategories &&
                  formData.firstCategories.map((category, index) => (
                    <span
                      key={index}
                      className="p-2 bg-blue-50 cursor-pointer hover:bg-blue-200 rounded-lg"
                      onClick={() => {
                        const updatedCategories =
                          formData.firstCategories.filter(
                            (_, i) => i !== index
                          );
                        setFormData((prev) => ({
                          ...prev,
                          firstCategories: updatedCategories,
                        }));
                      }}
                    >
                      {category}
                    </span>
                  ))}
              </div>
              <input
                type="text"
                name="currentFirstCategoryName"
                value={formData.currentFirstCategoryName}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const newCategory =
                      formData.currentFirstCategoryName.trim();
                    if (newCategory) {
                      setFormData((prev) => ({
                        ...prev,
                        firstCategories: [...prev.firstCategories, newCategory],
                        currentFirstCategoryName: "",
                      }));
                    }
                  }
                }}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: category1, category2"
              />
            </div>
            {/* Danh muc 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên danh mục 2
              </label>
              <input
                type="text"
                name="secondCategoryName"
                value={formData.secondCategoryName}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700 mt-2">
                Danh mục 2 (Nhấn Enter để submit)
              </label>
              <div className="flex items-center gap-2 ">
                {formData.secondCategories &&
                  formData.secondCategories.map((category, index) => (
                    <span
                      key={index}
                      className="p-2 bg-blue-50 cursor-pointer hover:bg-blue-200 rounded-lg"
                      onClick={() => {
                        const updatedCategories =
                          formData.secondCategories.filter(
                            (_, i) => i !== index
                          );
                        setFormData((prev) => ({
                          ...prev,
                          secondCategories: updatedCategories,
                        }));
                      }}
                    >
                      {category}
                    </span>
                  ))}
              </div>
              <input
                type="text"
                name="currentSecondCategoryName"
                value={formData.currentSecondCategoryName}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const newCategory =
                      formData.currentSecondCategoryName.trim();
                    if (newCategory) {
                      setFormData((prev) => ({
                        ...prev,
                        secondCategories: [
                          ...prev.secondCategories,
                          newCategory,
                        ],
                        currentSecondCategoryName: "",
                      }));
                    }
                  }
                }}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: category1, category2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ảnh bìa
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "coverImage")}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {product.coverImage && (
                <img
                  src={product.coverImage}
                  alt="Ảnh bìa hiện tại"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, "video")}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {product.video && (
                <video
                  src={product.video}
                  controls
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Thư viện hình ảnh
            </label>
            <div className="grid grid-cols-4 gap-4 mt-2">
              {formData.imageList.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Hình ảnh ${index + 1}`}
                    className="w-full h-36 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => toggleImageDelete(image)}
                    className={`absolute top-1 right-1 p-1 rounded-full ${
                      formData.imagesToDelete.includes(image)
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-red-600 hover:text-white transition-colors`}
                    aria-label={`Xóa hình ảnh ${index + 1}`}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewImagesChange}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.newImages.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">
                  Hình ảnh mới:
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {formData.newImages.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Hình ảnh mới ${index + 1}`}
                      className="w-full h-36 object-cover rounded cursor-pointer hover:opacity-80"
                      onClick={() => {
                        const updatedImages = formData.newImages.filter(
                          (_, i) => i !== index
                        );
                        setFormData((prev) => ({
                          ...prev,
                          newImages: updatedImages,
                        }));
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded text-black bg-white hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
