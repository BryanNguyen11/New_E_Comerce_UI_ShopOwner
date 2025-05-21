// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { FaStar } from 'react-icons/fa';
// import { useAuth } from '@/context/AuthContext';

// export default function ProductCard({ product }) {
//   const { authState } = useAuth();

//   const handleAddToCart = async (e) => {
//     e.preventDefault(); 
//     if (!authState.isAuthenticated) {
//       alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
//       return;
//     }

//     try {
//       const response = await fetch('/api/cart-detail/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${authState.token}`,
//         },
//         body: JSON.stringify({
//           productId: product.id,
//           quantity: 1,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add item to cart');
//       }

//       alert(`${product.name} đã được thêm vào giỏ hàng!`);
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       alert('Không thể thêm sản phẩm vào giỏ hàng');
//     }
//   };

//   return (
//     <Link
//       href={`/product/${product.id}`}
//       className="relative group hover:shadow-lg transition-shadow bg-white rounded-sm overflow-hidden"
//     >
//       <div className="relative">
//         <img
//           src={product.image || '/images/product-placeholder.jpg'}
//           alt={product.name}
//           className="w-full aspect-square object-cover"
//         />
//         <button
//           onClick={handleAddToCart}
//           className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 bg-blue-500 text-white text-sm py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//         >
//           Thêm vào giỏ
//         </button>
//       </div>
//       <div className="p-2">
//         <h4 className="text-sm text-gray-800 line-clamp-2 mb-2 min-h-[32px]">{product.name}</h4>
//         <div className="space-y-2">
//           <div className="flex items-center gap-2">
//             <span className="text-black text-lg">₫{(product.price || 0).toLocaleString('vi-VN')}</span>
//           </div>
//           <div className="flex items-center justify-between text-xs text-gray-500">
//             <div className="flex items-center gap-1">
//               <div className="flex items-center">
//                 {[...Array(5)].map((_, index) => (
//                   <FaStar
//                     key={index}
//                     className={index < Math.floor(product.rating || 0) ? 'text-[#ee4d2d]' : 'text-gray-300'}
//                     size={12}
//                   />
//                 ))}
//               </div>
//             </div>
//             <span>Đã bán {(product.salesCount || 0).toLocaleString('vi-VN')}</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }


'use client';

import { useRouter } from 'next/navigation';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useContext } from 'react';
import { OrderContext } from '@/context/OrderContext';

export default function ProductCard({ product }) {
  const { authState } = useAuth();
  const { addToCart } = useContext(OrderContext);
  const router = useRouter();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authState.isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }

    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '/images/product-placeholder.jpg',
        quantity: 1,
      });
      alert(`${product.name} đã được thêm vào giỏ hàng!`);
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (!authState.isAuthenticated) {
      alert('Vui lòng đăng nhập để xem chi tiết sản phẩm!');
    }
  
    router.push(`/product/${product.id}`);
  };
  

  return (
    <div className="relative group hover:shadow-lg transition-shadow bg-white rounded-sm overflow-hidden cursor-pointer" onClick={() => router.push(`/product/${product.id}`)}>
      <div className="relative">
        <img
          src={product.image || '/images/product-placeholder.jpg'}
          alt={product.name}
          className="w-full aspect-square object-cover"
        />
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-full flex flex-col gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-500 text-white text-sm py-1.5 rounded-md hover:bg-blue-600"
          >
            Thêm vào giỏ
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full bg-red-500 text-white text-sm py-1.5 rounded-md hover:bg-red-600"
          >
            Mua ngay
          </button>
        </div>
      </div>
      <div className="p-2">
        <h4 className="text-sm text-gray-800 line-clamp-2 mb-2 min-h-[32px]">{product.name}</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-black text-lg">₫{(product.price || 0).toLocaleString('vi-VN')}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < Math.floor(product.rating || 0) ? 'text-[#ee4d2d]' : 'text-gray-300'}
                    size={12}
                  />
                ))}
              </div>
            </div>
            <span>Đã bán {(product.salesCount || 0).toLocaleString('vi-VN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}




// 'use client';

// import Link from 'next/link';
// import { FaStar } from 'react-icons/fa';
// import { useAuth } from '@/context/AuthContext';
// import { useContext } from 'react';
// import { OrderContext } from '@/context/OrderContext';

// export default function ProductCard({ product }) {
//   const { authState } = useAuth();
//   const { addToCart } = useContext(OrderContext);

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!authState.isAuthenticated) {
//       alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
//       return;
//     }

//     try {
//       addToCart({
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         image: product.image || '/images/product-placeholder.jpg',
//         quantity: 1,
//       });
//       alert(`${product.name} đã được thêm vào giỏ hàng!`);
//     } catch (error) {
//       console.error('Lỗi khi thêm vào giỏ hàng:', error);
//       alert('Không thể thêm sản phẩm vào giỏ hàng');
//     }
//   };

//   return (
//     <Link
//       href={`/product/${product.id}`}
//       className="relative group hover:shadow-lg transition-shadow bg-white rounded-sm overflow-hidden"
//     >
//       <div className="relative">
//         <img
//           src={product.image || '/images/product-placeholder.jpg'}
//           alt={product.name}
//           className="w-full aspect-square object-cover"
//         />
//         <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-full flex flex-col gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//           <button
//             onClick={handleAddToCart}
//             className="w-full bg-blue-500 text-white text-sm py-1.5 rounded-md hover:bg-blue-600"
//           >
//             Thêm vào giỏ
//           </button>
//           <button
//             className="w-full bg-red-500 text-white text-sm py-1.5 rounded-md hover:bg-red-600"
//           >
//             Mua ngay
//           </button>
//         </div>
//       </div>
//       <div className="p-2">
//         <h4 className="text-sm text-gray-800 line-clamp-2 mb-2 min-h-[32px]">{product.name}</h4>
//         <div className="space-y-2">
//           <div className="flex items-center gap-2">
//             <span className="text-black text-lg">₫{(product.price || 0).toLocaleString('vi-VN')}</span>
//           </div>
//           <div className="flex items-center justify-between text-xs text-gray-500">
//             <div className="flex items-center gap-1">
//               <div className="flex items-center">
//                 {[...Array(5)].map((_, index) => (
//                   <FaStar
//                     key={index}
//                     className={index < Math.floor(product.rating || 0) ? 'text-[#ee4d2d]' : 'text-gray-300'}
//                     size={12}
//                   />
//                 ))}
//               </div>
//             </div>
//             <span>Đã bán {(product.salesCount || 0).toLocaleString('vi-VN')}</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }