import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SHOPNOW",
  description: "SHOP BY CLICK",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          
        />
        {/* <meta http-equiv="Content-Security-Policy" content="default-src 'self' https://cdn.ngrok.com 'unsafe-eval' 'unsafe-inline'; font-src 'self' https://assets.ngrok.com;"></meta> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* <RouteGuard> */}
            {children}
          {/* </RouteGuard> */}
        </AuthProvider>
      </body>
    </html>
  );
}
