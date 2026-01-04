"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false); // Захист від дублювання

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const handleAdd = (product: Product) => {
    if (isAdding) return;
    setIsAdding(true);

    addToCart(product);

    setTimeout(() => setIsAdding(false), 100);
  };

  return (
    <main className="p-8 bg-slate-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Каталог товарів</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="group bg-slate-900 border border-slate-800 p-6 rounded-4xl hover:border-green-500/50 transition-all duration-300 shadow-xl"
          >
            <div className="h-48 bg-slate-800 rounded-2xl mb-4 flex items-center justify-center text-slate-600 font-black uppercase tracking-widest text-xs">
              No Image
            </div>

            <h2 className="text-xl font-bold mb-1 group-hover:text-green-400 transition">
              {product.name}
            </h2>
            <p className="text-slate-500 text-xs mb-6 uppercase tracking-widest font-bold">
              {product.category}
            </p>

            <div className="flex justify-between items-end">
              <div>
                <span className="block text-[10px] text-slate-500 font-black uppercase mb-1">
                  Ціна
                </span>
                <span className="text-2xl font-black text-white">
                  {product.price}{" "}
                  <span className="text-green-500 text-sm">₴</span>
                </span>
              </div>

              <button
                onClick={() => handleAdd(product)} // Виклик через захищену функцію
                className="bg-white text-slate-900 p-4 rounded-2xl hover:bg-green-500 hover:text-white transition-all active:scale-90 shadow-lg shadow-black/20"
              >
                <ShoppingCart size={20} />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
              <span
                className={`text-[10px] font-black uppercase tracking-tight ${
                  product.stock > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {product.stock > 0
                  ? `В наявності: ${product.stock}`
                  : "Out of stock"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
