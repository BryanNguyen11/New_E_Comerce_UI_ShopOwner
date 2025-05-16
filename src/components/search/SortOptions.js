"use client";
import { useState } from 'react';

const SortOptions = ({ value, onChange }) => {
  const sortOptions = [
    { value: '', label: 'Phổ biến' },
    { value: 'latest', label: 'Mới nhất' },
    { value: 'best_selling', label: 'Bán chạy' },
    { value: 'price_asc', label: 'Giá tăng dần' },
    { value: 'price_desc', label: 'Giá giảm dần' },
  ];

  return (
    <div className="flex items-center bg-white p-4 border rounded-md shadow-sm">
      <p className="font-medium text-gray-700 mr-4">Sắp xếp theo:</p>
      
      <div className="flex flex-wrap gap-2">
        {sortOptions.map(option => (
          <button
            key={option.value}
            className={`px-4 py-2 rounded-md transition-colors ${
              value === option.value 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortOptions;