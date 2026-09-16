"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

/* ───────── Types ───────── */
export type OrderStatus =
  | "placed"
  | "kitchen_verified"
  | "preparing"
  | "out_for_delivery"
  | "delivered";

export interface ActiveOrder {
  id: string;
  restaurantName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  placedAt: string;
  estimatedDelivery: string;
  riderName: string;
  riderPhone: string;
}

interface OrderContextValue {
  activeOrder: ActiveOrder | null;
  placeOrder: (
    order: Omit<
      ActiveOrder,
      | "id"
      | "status"
      | "placedAt"
      | "estimatedDelivery"
      | "riderName"
      | "riderPhone"
    >
  ) => void;
  clearOrder: () => void;
  isTrackerOpen: boolean;
  setTrackerOpen: (open: boolean) => void;
}

/* ───────── Status progression ───────── */
const STATUS_SEQUENCE: OrderStatus[] = [
  "placed",
  "kitchen_verified",
  "preparing",
  "out_for_delivery",
  "delivered",
];

/* ───────── Mock rider data ───────── */
const MOCK_RIDERS = [
  { name: "Emmanuel K.", phone: "+255 712 345 678" },
  { name: "Fatima M.", phone: "+255 754 321 987" },
  { name: "Joseph A.", phone: "+255 786 555 123" },
];

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [isTrackerOpen, setTrackerOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const placeOrder = useCallback(
    (
      orderData: Omit<
        ActiveOrder,
        | "id"
        | "status"
        | "placedAt"
        | "estimatedDelivery"
        | "riderName"
        | "riderPhone"
      >
    ) => {
      // Clear any existing interval
      if (intervalRef.current) clearInterval(intervalRef.current);

      const rider = MOCK_RIDERS[Math.floor(Math.random() * MOCK_RIDERS.length)];
      const now = new Date();
      const estimated = new Date(now.getTime() + 45 * 60 * 1000); // 45 mins

      const newOrder: ActiveOrder = {
        ...orderData,
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        status: "placed",
        placedAt: now.toISOString(),
        estimatedDelivery: estimated.toISOString(),
        riderName: rider.name,
        riderPhone: rider.phone,
      };

      setActiveOrder(newOrder);
      setTrackerOpen(true);

      // Auto-advance status every 8 seconds
      let currentIndex = 0;
      intervalRef.current = setInterval(() => {
        currentIndex++;
        if (currentIndex >= STATUS_SEQUENCE.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }
        setActiveOrder((prev) => {
          if (!prev) return prev;
          return { ...prev, status: STATUS_SEQUENCE[currentIndex] };
        });
      }, 8000);
    },
    []
  );

  const clearOrder = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveOrder(null);
    setTrackerOpen(false);
  }, []);

  return (
    <OrderContext.Provider
      value={{
        activeOrder,
        placeOrder,
        clearOrder,
        isTrackerOpen,
        setTrackerOpen,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within <OrderProvider>");
  return ctx;
}
