import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

function storageKey(uid) {
  return `novamart_cart_${uid || "guest"}`;
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);

  // Load the right cart whenever the logged-in user changes (or on first load for guests).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(currentUser?.uid));
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, [currentUser?.uid]);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(currentUser?.uid), JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items, currentUser?.uid]);

  function addItem(product, quantity = 1) {
    const stock = product.stock === undefined || product.stock === null ? null : Number(product.stock);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        const nextQty = stock == null ? existing.quantity + quantity : Math.min(existing.quantity + quantity, stock);
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: nextQty, stock } : i));
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          imageUrl: product.imageUrl || "",
          stock, // null = unknown/unlimited, otherwise the last-known stock count
          quantity: stock == null ? quantity : Math.min(quantity, stock),
        },
      ];
    });
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const capped = i.stock == null ? quantity : Math.min(quantity, i.stock);
        return { ...i, quantity: capped };
      })
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const value = { items, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}