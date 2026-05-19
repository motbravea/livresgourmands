import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'lg_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product, qty = 1) => {
    if (!product || !product.id) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          titre: product.titre,
          auteur: product.auteur,
          prix: Number(product.prix) || 0,
          stock: product.stock,
          quantity: qty,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    const q = Math.max(1, Number(quantity) || 1);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: q } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.prix * i.quantity, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans CartProvider');
  return ctx;
}
