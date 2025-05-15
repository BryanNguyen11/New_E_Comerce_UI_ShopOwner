import Link from 'next/link';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

export const ProductCard = ({ product }) => {
  return (
    <Link 
      href={`/product/${product.productId}`}
      className="relative group hover:shadow-lg transition-shadow bg-white rounded-sm overflow-hidden"
    >
      <div className="relative">
        <img
          src={product.coverImage}
          alt={product.productName}
          className="w-full aspect-square object-cover"
        />
      </div>
      <div className="p-2">
        <h4 className="text-sm text-gray-800 line-clamp-2 mb-2 min-h-[32px]">{product.productName}</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-black text-lg">₫{product.price.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < Math.floor(product.rating) ? "text-[#ee4d2d]" : "text-gray-300"}
                    size={12}
                  />
                ))}
              </div>
              {/* <span>({product.ratingCount})</span> */}
            </div>
            <span>Đã bán {product.soldCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};