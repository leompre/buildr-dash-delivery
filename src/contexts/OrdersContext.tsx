import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import type { CartItem } from "./CartContext";

export type OrderStatus = "preparing" | "in_transit" | "delivered" | "canceled";

export interface Order {
  id: string;
  number: string;
  createdAt: string; // ISO
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  delivery: string;
  payment: string;
  address: string;
  status: OrderStatus;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Order;
  getOrder: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);
const STORAGE_KEY = "buildr:orders";

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Order[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      /* noop */
    }
  }, [orders]);

  const addOrder = useCallback((order: Omit<Order, "id" | "createdAt" | "status">) => {
    const newOrder: Order = {
      ...order,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "preparing",
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id || o.number === id),
    [orders]
  );

  return (
    <OrdersContext.Provider value={{ orders, addOrder, getOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
};

export const statusLabels: Record<OrderStatus, string> = {
  preparing: "Em preparo",
  in_transit: "A caminho",
  delivered: "Entregue",
  canceled: "Cancelado",
};
