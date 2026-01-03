"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="flex justify-between items-center p-4 bg-white shadow-md text-black">
        <Link href="/" className="text-xl font-bold text-green-600">
          MyStore
        </Link>
        <div className="flex items-center gap-6">
          <div className="text-xl">🛒 Кошик</div>
          <div className="w-20 h-8"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md text-black">
      <Link href="/" className="text-xl font-bold text-green-600">
        MyStore
      </Link>

      <div className="flex items-center gap-6">
        <Link
          href="/cart"
          className="relative flex items-center gap-1 hover:text-green-600 transition"
        >
          <span className="text-xl">🛒</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
          <span className="hidden sm:inline">Кошик</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium border-b border-green-200">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition text-sm"
            >
              Вийти
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-green-600 text-white px-5 py-1.5 rounded hover:bg-green-700 transition text-sm"
          >
            Увійти
          </Link>
        )}
      </div>
    </nav>
  );
}
