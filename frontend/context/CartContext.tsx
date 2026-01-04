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
  decreaseQuantity: (productId: string) => void; // Додано
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error("Помилка при читанні кошика:", e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    let isNew = false;
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        isNew = false;
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      isNew = true;
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(isNew ? `${product.name} додано` : "Кількість оновлено", {
      id: product._id,
    });
  };

  // НОВА ФУНКЦІЯ: Зменшення кількості
  const decreaseQuantity = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === productId);

      if (existing && existing.quantity > 1) {
        // Якщо більше 1 — просто зменшуємо
        return prev.map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      // Якщо 1 — видаляємо повністю
      return prev.filter((item) => item._id !== productId);
    });
    toast.error("Кількість зменшено", { id: productId });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
    toast.error("Товар видалено", { id: productId });
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
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
      }}
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
