import AuthStatus from "@/components/AuthStatus";
import Link from "next/link";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const layout = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Navigation */}
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
