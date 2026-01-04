"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useHasMounted } from "@/hooks/useMounted";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const hasMounted = useHasMounted();
  const router = useRouter();
  const { decreaseQuantity } = useCart();

  if (!hasMounted) return <div className="min-h-screen bg-slate-950" />;

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Будь ласка, увійдіть, щоб оформити замовлення");
      router.push("/login");
      return;
    }

    const orderData = {
      userId: user._id || user.id,
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice,
    };

    try {
      const res = await fetch("http://26.34.204.174:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        toast.success("Замовлення прийнято! Система RabbitMQ обробляє його.");
        clearCart();
        router.push("/");
      } else {
        toast.error("Помилка при створенні замовлення");
      }
    } catch {
      toast.error("Не вдалося з'єднатися з сервером");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="h-[calc(100vh-65px)] flex flex-col items-center justify-center text-white bg-slate-950 overflow-hidden">
        <div className="bg-slate-900 p-12 rounded-3xl border border-slate-800 text-center shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
          <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Кошик порожній</h2>
          <p className="text-slate-500 mb-8 text-sm">
            Ви ще не обрали жодного товару.
          </p>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full font-bold transition w-full shadow-lg shadow-green-900/20"
          >
            <ArrowLeft size={18} /> До каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-65px)] bg-slate-950 text-white overflow-hidden">
      <div className="container mx-auto h-full p-4 md:p-12 flex flex-col">
        <h1 className="text-4xl font-black mb-8 flex items-center gap-4 tracking-tighter uppercase shrink-0">
          <ShoppingBag className="text-green-500" size={36} /> Ваш Кошик
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1 min-h-0">
          <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-2 no-scrollbar">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-slate-700 transition backdrop-blur-sm shrink-0"
              >
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-100 mb-1 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-green-500 font-mono font-black text-xs uppercase tracking-widest">
                    {item.price} ₴ / шт.
                  </p>
                </div>

                <div className="flex items-center bg-slate-800/80 rounded-2xl px-5 py-2 gap-6 border border-slate-700">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="text-slate-400 hover:text-white transition active:scale-90"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="font-black text-xl min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="text-slate-400 hover:text-white transition active:scale-90"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="text-right min-w-[140px]">
                  <p className="text-2xl font-black text-white mb-1">
                    {item.price * item.quantity} ₴
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red hover:text-red-400 text-[12px] uppercase font-bold tracking-tighter flex items-center gap-1 ml-auto transition"
                  >
                    <Trash2 size={12} /> Видалити
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="text-slate-600 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition ml-auto block px-4 py-2"
            >
              Очистити все
            </button>
          </div>

          <div className="shrink-0">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50">
              <h2 className="text-2xl font-black mb-8 border-b border-slate-800 pb-4 uppercase tracking-tighter">
                Підсумок
              </h2>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-slate-400 font-medium text-sm">
                  <span>
                    Товари ({cart.reduce((a, b) => a + b.quantity, 0)})
                  </span>
                  <span>{totalPrice} ₴</span>
                </div>
                <div className="flex justify-between text-slate-400 font-medium border-b border-slate-800 pb-6 text-sm">
                  <span>Логістика</span>
                  <span className="text-green-500 uppercase text-[10px] font-black border border-green-500/30 px-2 py-0.5 rounded-md">
                    Free
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="text-lg font-bold text-slate-300">
                    Разом
                  </span>
                  <span className="text-4xl font-black text-green-500 tracking-tighter">
                    {totalPrice} ₴
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-500 text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-lg shadow-green-900/40 active:scale-[0.98]"
              >
                {" "}
                Оформити
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
