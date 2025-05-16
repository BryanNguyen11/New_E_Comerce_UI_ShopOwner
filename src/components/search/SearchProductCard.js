"use client";
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';

const SearchProductCard = ({ product }) => {
  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Generate star rating display
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        <div className="flex mr-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'} text-sm`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Link href={`/product/${product.productId}`}>
      <div className="flex bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
        <div className="w-48 h-48 relative flex-shrink-0">
          {product.coverImage ? (
            <img
              src={product.coverImage}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
              -{product.discount}%
            </div>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.productName}</h3>
            
            <div className="mt-2 flex items-center">
              <span className="text-red-600 font-bold text-lg">{formatPrice(product.price)}</span>
              
              {product.originalPrice > product.price && (
                <span className="ml-2 line-through text-gray-500 text-sm">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <div className="mt-2">
              {renderRating(product.ratingAvg || 0)}
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-end">
            <div className="flex items-center text-sm text-gray-500">
              <FaMapMarkerAlt className="mr-1" />
              <span>{product.location || 'Hà Nội'}</span>
            </div>
            
            <div className="text-sm text-gray-500">
              Đã bán {product.soldCount || 0}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchProductCard;