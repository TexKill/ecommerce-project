import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-center" />
            <Navbar />
            <main className="min-h-screen bg-gray-50">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
