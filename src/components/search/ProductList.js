"use client";
import { FaSpinner, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import SearchProductCard from './SearchProductCard';

const ProductList = ({ products, loading, currentPage, totalPages, onPageChange }) => {
  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show
    
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pages.push(
      <button 
        key="prev" 
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaAngleLeft />
      </button>
    );
    
    // First page button (if not already included)
    if (startPage > 0) {
      pages.push(
        <button 
          key="0" 
          onClick={() => onPageChange(0)}
          className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
        >
          1
        </button>
      );
      
      // Ellipsis if there's a gap
      if (startPage > 1) {
        pages.push(
          <span key="ellipsis1" className="px-3 py-2">
            ...
          </span>
        );
      }
    }
    
    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 rounded-md border ${
            i === currentPage 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'border-gray-300 hover:bg-gray-100'
          }`}
        >
          {i + 1}
        </button>
      );
    }
    
    // Last page button (if not already included)
    if (endPage < totalPages - 1) {
      // Ellipsis if there's a gap
      if (endPage < totalPages - 2) {
        pages.push(
          <span key="ellipsis2" className="px-3 py-2">
            ...
          </span>
        );
      }
      
      pages.push(
        <button 
          key={totalPages - 1} 
          onClick={() => onPageChange(totalPages - 1)}
          className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
        >
          {totalPages}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button 
        key="next" 
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaAngleRight />
      </button>
    );
    
    return pages;
  };

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-10 bg-white rounded-md shadow-sm">
        <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm phù hợp.</p>
        <p className="text-gray-500 mt-2">Vui lòng thử lại với từ khóa khác.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <SearchProductCard key={product.productId} product={product} />
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-4">
          <FaSpinner className="animate-spin text-blue-500 text-2xl mr-2" />
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      )}
      
      {!loading && totalPages > 0 && (
        <div className="flex justify-center items-center gap-2 py-4">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default ProductList;