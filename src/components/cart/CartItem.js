import React from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

const CartItem = ({item, selectedItems, toggleSelectItem, handleRemoveItem, handleQuantityChange}) => {
  return (
    <div key={item.cartDetailId} className="flex border-b py-4 last:border-b-0">
      <div className="flex items-center mr-3 text-black">
        <input
          type="checkbox"
          checked={selectedItems.includes(item.cartDetailId)}
          onChange={() => toggleSelectItem(item.cartDetailId)}
          className="w-4 h-4"
        />
      </div>
      <img
        src={item.product.coverImage}
        alt={item.product.productName}
        className="w-20 h-20 object-cover rounded mr-4"
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium text-black">{item.product.productName}</h3>
          <button
            onClick={() => handleRemoveItem(item.cartDetailId)}
            className="text-red-500 hover:text-red-700"
            aria-label="Xóa sản phẩm"
          >
            <FaTrash />
          </button>
        </div>
        <p className="text-gray-500 text-sm">
          Thương hiệu: {item.product.brand || "Không tên"}
        </p>

        <div className="flex justify-between items-center mt-2">
          <div className="text-red-600 font-medium">
            {item.product.price.toLocaleString()}₫
          </div>
          <div className="flex items-center border border-black rounded">
            <button
              onClick={() => handleQuantityChange(item.cartDetailId, -1)}
              className="px-2 py-1 hover:bg-gray-100  text-black"
              aria-label="Giảm số lượng"
            >
              <FaMinus size={12} />
            </button>
            <span className="px-4 py-1 border-l border-r text-black">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.cartDetailId, 1)}
              className="px-2 py-1 hover:bg-gray-100  text-black"
              aria-label="Tăng số lượng"
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
