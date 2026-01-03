"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Завантажуємо кошик відразу при ініціалізації стану
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Використовуємо useEffect тільки для збереження змін
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        toast.success(`Кількість ${product.name} оновлено`);
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${product.name} додано до кошика`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
    toast.error("Товар видалено");
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
