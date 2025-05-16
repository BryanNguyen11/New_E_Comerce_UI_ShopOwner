"use client";
import { useState, useEffect } from 'react';
import { FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FilterPanel = ({ filters, onFilterChange }) => {
  // State for price range inputs
  const [minPrice, setMinPrice] = useState(filters.priceRange.min);
  const [maxPrice, setMaxPrice] = useState(filters.priceRange.max);

  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    condition: true,
    rating: true
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Format price input for display
  const formatPriceInput = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Parse formatted price back to number
  const parsePriceInput = (value) => {
    return value ? parseInt(value.replace(/\./g, ''), 10) : '';
  };

  // Handle condition filter change (now using boolean for isNew parameter)
  const handleConditionChange = (isNew) => {
    onFilterChange({
      ...filters,
      condition: isNew // true for new, false for used
    });
  };

  // Apply price range filters
  const applyPriceRange = () => {
    onFilterChange({
      ...filters,
      priceRange: {
        min: parsePriceInput(minPrice),
        max: parsePriceInput(maxPrice)
      }
    });
  };

  // Handle rating filter change
  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? 0 : rating
    });
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc tìm kiếm</h2>
      
      {/* Price Range Filter */}
      <div className="mb-6 border-b pb-4">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('price')}
        >
          <h3 className="font-medium text-gray-700">Khoảng giá</h3>
          {expandedSections.price ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="text"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="₫ TỪ"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="mx-2 text-gray-400">-</span>
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="₫ ĐẾN"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={applyPriceRange}
              className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Áp dụng
            </button>
          </div>
        )}
      </div>
      
      {/* Condition Filter */}
      <div className="mb-6 border-b pb-4">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('condition')}
        >
          <h3 className="font-medium text-gray-700">Tình trạng</h3>
          {expandedSections.condition ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        
        {expandedSections.condition && (
          <div className="space-y-2">
            <div 
              className={`p-2 rounded-md cursor-pointer ${filters.condition === true ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleConditionChange(true)}
            >
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={filters.condition === true}
                  onChange={() => {}}
                  className="mr-2"
                />
                <span className="text-gray-700">Mới</span>
              </label>
            </div>
            <div 
              className={`p-2 rounded-md cursor-pointer ${filters.condition === false ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleConditionChange(false)}
            >
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={filters.condition === false}
                  onChange={() => {}}
                  className="mr-2"
                />
                <span className="text-gray-700">Đã sử dụng</span>
              </label>
            </div>
            {filters.condition !== null && (
              <div 
                className="p-2 rounded-md cursor-pointer text-center text-blue-600 hover:bg-gray-100"
                onClick={() => handleConditionChange(null)}
              >
                Xóa bộ lọc
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Rating Filter */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('rating')}
        >
          <h3 className="font-medium text-gray-700">Đánh giá</h3>
          {expandedSections.rating ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        
        {expandedSections.rating && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div 
                key={rating} 
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  filters.rating === rating ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleRatingChange(rating)}
              >
                <div className="flex mr-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar
                      key={star}
                      className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-700 ml-1">trở lên</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Reset Filters Button */}
      <button
        onClick={() => onFilterChange({
          priceRange: { min: '', max: '' },
          condition: null,
          rating: 0
        })}
        className="w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
      >
        Xóa tất cả
      </button>
    </div>
  );
};

export default FilterPanel;