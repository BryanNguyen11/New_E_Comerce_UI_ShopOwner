// "use client";

// import { useAuth } from "@/context/AuthContext";
// import Link from "next/link";
// import { useEffect } from "react";
// import { FaUser } from "react-icons/fa";

// export default function AuthStatus() {
//   const { authState, isLoading, kcLogin, kcLogout } = useAuth();

//   useEffect(() => {
//     console.log("AuthState:", authState);
//   }, [authState]);

//   if (isLoading) {
//     return <div>Loading authentication status...</div>;
//   }

//   useEffect(() => {
//     console.log("AuthState:", authState);
//   }, []);

//   return (
//     <div>
//       {authState.isAuthenticated ? (

//         <div className="flex items-center gap-4">
//           <Link href="/profile">
//             <FaUser />
//           </Link>
//           <div>
//           <p className='text-blue-600'>Welcome, {authState.user?.last_name + " " + authState.user?.first_name || authState.user?.email}</p>
//           <button className='text-red-500' onClick={kcLogout}>Logout</button>
//         </div>
//         </div>
//       ) : (
//         <button className='text-blue-600' onClick={kcLogin}>Login</button>

//       )}
//     </div>
//   )
// }


"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

export default function AuthStatus() {
  const { authState, isLoading, kcLogin, kcLogout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    console.log("AuthState:", authState);
  }, [authState]);

  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    kcLogout();
    setDropdownOpen(false); // Đóng dropdown sau khi đăng xuất
  };

  return (
    <div className="relative">
      {authState.isAuthenticated ? (
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDropdown}
            className="text-gray-700 hover:text-blue-500"
            aria-label="User menu"
          >
            <FaUser size={16} />
          </button>
          <p className="text-blue-600">
            Welcome,{" "}
            {authState.user?.last_name + " " + authState.user?.first_name ||
              authState.user?.email}
          </p>

          {isDropdownOpen && (
            <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md w-48 py-2 z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Thông tin tài khoản
              </Link>
              <Link
                href="/orders"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Đơn hàng
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="text-blue-600" onClick={kcLogin}>
          Login
        </button>
      )}
    </div>
  );
}