"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

/* ───────── Types ───────── */
export interface CartItem {
  id: string;
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  nameSw: string;
  price: number;
  quantity: number;
  portionSize: "small" | "medium" | "large";
  spiceLevel: "mild" | "medium" | "hot" | "extra_hot";
  dietaryNotes: string;
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

/* ───────── Portion multipliers ───────── */
const PORTION_MULTIPLIER: Record<CartItem["portionSize"], number> = {
  small: 0.8,
  medium: 1.0,
  large: 1.3,
};

const SERVICE_FEE_RATE = 0.1; // 10%

let nextCartId = 1;

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    const id = `cart-${nextCartId++}-${Date.now()}`;
    setItems((prev) => [...prev, { ...item, id }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + i.price * i.quantity * PORTION_MULTIPLIER[i.portionSize],
        0
      ),
    [items]
  );

  const serviceFee = useMemo(
    () => Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100,
    [subtotal]
  );

  const total = useMemo(
    () => Math.round((subtotal + serviceFee) * 100) / 100,
    [subtotal, serviceFee]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        serviceFee,
        total,
        isCartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
