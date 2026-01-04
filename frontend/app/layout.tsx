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
      <body className="bg-slate-950 text-slate-50 antialiased">
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-center" />
            <Navbar />
            <main className="flex-1">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
