import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from "react";
import type { CartItem } from "./CartContext";

export type OrderStatus = "preparing" | "in_transit" | "delivered" | "canceled";

export interface StatusEvent {
  status: OrderStatus;
  at: string; // ISO
}

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
  history: StatusEvent[];
}

interface OrdersContextType {
  orders: Order[];
  activeOrderId: string | null;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status" | "history">) => Order;
  getOrder: (id: string) => Order | undefined;
  updateStatus: (id: string, status: OrderStatus) => void;
  setActiveOrder: (id: string | null) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);
const STORAGE_KEY = "buildr:orders";
const ACTIVE_KEY = "buildr:active-order";

// Auto-advance timings (ms) - simulates real-time status progression
const ADVANCE_TO_TRANSIT_MS = 15_000;
const ADVANCE_TO_DELIVERED_MS = 35_000;

export const statusLabels: Record<OrderStatus, string> = {
  preparing: "Em preparo",
  in_transit: "A caminho",
  delivered: "Entregue",
  canceled: "Cancelado",
};

export const statusOrder: OrderStatus[] = ["preparing", "in_transit", "delivered"];

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Order[]) : [];
      // Backfill history for older saved orders
      return parsed.map((o) => ({
        ...o,
        history: o.history ?? [{ status: o.status, at: o.createdAt }],
      }));
    } catch {
      return [];
    }
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACTIVE_KEY);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      /* noop */
    }
  }, [orders]);

  useEffect(() => {
    if (activeOrderId) localStorage.setItem(ACTIVE_KEY, activeOrderId);
    else localStorage.removeItem(ACTIVE_KEY);
  }, [activeOrderId]);

  const updateStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id && o.number !== id) return o;
        if (o.status === status) return o;
        return {
          ...o,
          status,
          history: [...o.history, { status, at: new Date().toISOString() }],
        };
      })
    );
  }, []);

  const addOrder = useCallback(
    (order: Omit<Order, "id" | "createdAt" | "status" | "history">) => {
      const now = new Date().toISOString();
      const newOrder: Order = {
        ...order,
        id: crypto.randomUUID(),
        createdAt: now,
        status: "preparing",
        history: [{ status: "preparing", at: now }],
      };
      setOrders((prev) => [newOrder, ...prev]);
      setActiveOrderId(newOrder.id);
      return newOrder;
    },
    []
  );

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id || o.number === id),
    [orders]
  );

  // Auto-advance timers based on createdAt (works across reloads)
  const timersRef = useRef<Record<string, number[]>>({});
  useEffect(() => {
    orders.forEach((o) => {
      if (timersRef.current[o.id] || o.status === "delivered" || o.status === "canceled") return;
      const elapsed = Date.now() - new Date(o.createdAt).getTime();
      const timers: number[] = [];

      if (o.status === "preparing") {
        const delay = Math.max(0, ADVANCE_TO_TRANSIT_MS - elapsed);
        timers.push(window.setTimeout(() => updateStatus(o.id, "in_transit"), delay));
      }
      const delivDelay = Math.max(0, ADVANCE_TO_DELIVERED_MS - elapsed);
      timers.push(window.setTimeout(() => updateStatus(o.id, "delivered"), delivDelay));

      timersRef.current[o.id] = timers;
    });
    // Cleanup on unmount
    return () => {
      Object.values(timersRef.current).flat().forEach((t) => clearTimeout(t));
      timersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.length]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        activeOrderId,
        addOrder,
        getOrder,
        updateStatus,
        setActiveOrder: setActiveOrderId,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
};
