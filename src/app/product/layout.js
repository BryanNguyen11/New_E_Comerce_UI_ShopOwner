import AuthStatus from "@/components/AuthStatus";
import Link from "next/link";
import '@ant-design/v5-patch-for-react-19';
import { FaBell, FaFacebook, FaInstagram, FaQuestionCircle, FaTwitter } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
  <div className="bg-gray-100 min-h-screen">
    <Header/>
     
  { children }
  <Footer/>
  </div>
  );
}
