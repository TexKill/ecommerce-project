"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useHasMounted } from "@/hooks/useMounted";
import { ShoppingCart, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const hasMounted = useHasMounted();

  return (
    <nav className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <Link
        href="/"
        className="text-2xl font-black tracking-tighter text-green-500 hover:text-green-400 transition"
      >
        MY <span className="text-white">STORE</span>
      </Link>

      <div className="flex items-center gap-8">
        {/* Секція Кошика */}
        <Link
          href="/cart"
          className="relative group flex items-center gap-2 hover:text-green-400 transition"
        >
          <ShoppingCart size={22} />
          <span className="text-sm font-medium">Кошик</span>
          {hasMounted && cart.length > 0 && (
            <span className="absolute -top-2 -left-2 bg-green-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-slate-900">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-6">
          {!hasMounted ? (
            <div className="w-20 h-8"></div>
          ) : user ? (
            <>
              <div className="flex items-center gap-2 text-slate-300">
                <User size={18} />
                <span className="text-xs font-mono max-w-[150px] truncate">
                  {user.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition text-xs font-bold"
              >
                <LogOut size={14} />
                Вийти
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="text-slate-300 hover:text-white transition text-sm font-bold px-2 py-2"
              >
                Реєстрація
              </Link>
              <Link
                href="/login"
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-500 transition text-sm font-bold shadow-lg shadow-green-900/20"
              >
                Увійти
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
