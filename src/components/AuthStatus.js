"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect } from "react";
import { FaUser } from "react-icons/fa";

export default function AuthStatus() {
  const { authState, isLoading, kcLogin, kcLogout } = useAuth();

  useEffect(() => {
    console.log("AuthState:", authState);
  }, [authState]);

  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  useEffect(() => {
    console.log("AuthState:", authState);
  }, []);

  return (
    <div>
      {authState.isAuthenticated ? (
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <FaUser />
          </Link>
          <div>
            <p>
              Welcome,{" "}
              {authState.user?.last_name + " " + authState.user?.first_name ||
                authState.user?.email}
            </p>
            <button onClick={kcLogout} style={{cursor: "pointer"}}>Logout</button>
          </div>
        </div>
      ) : (
        <button onClick={kcLogin} style={{cursor: "pointer"}}>Login</button>
      )}
    </div>
  );
}
