import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import type { Product } from "@/data/mockData";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSaved: (productId: string) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "buildr:cart";
const SAVED_KEY = "buildr:saved";

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => readStorage(STORAGE_KEY, [] as CartItem[]));
  const [savedItems, setSavedItems] = useState<CartItem[]>(() => readStorage(SAVED_KEY, [] as CartItem[]));

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* noop */ }
  }, [items]);

  useEffect(() => {
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(savedItems)); } catch { /* noop */ }
  }, [savedItems]);

  const addItem = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { product, qty }];
    });
    toast.success(`${product.name} adicionado ao carrinho`, { duration: 1500 });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const saveForLater = useCallback((productId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;
      setSavedItems((s) => {
        if (s.some((x) => x.product.id === productId)) return s;
        return [...s, item];
      });
      toast("Salvo para depois", { duration: 1500 });
      return prev.filter((i) => i.product.id !== productId);
    });
  }, []);

  const moveToCart = useCallback((productId: string) => {
    setSavedItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;
      setItems((c) => {
        const existing = c.find((i) => i.product.id === productId);
        if (existing) {
          return c.map((i) => i.product.id === productId ? { ...i, qty: i.qty + item.qty } : i);
        }
        return [...c, item];
      });
      toast.success("Adicionado ao carrinho", { duration: 1500 });
      return prev.filter((i) => i.product.id !== productId);
    });
  }, []);

  const removeSaved = useCallback((productId: string) => {
    setSavedItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, savedItems, addItem, removeItem, updateQty, clearCart, saveForLater, moveToCart, removeSaved, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
