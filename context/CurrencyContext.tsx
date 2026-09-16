"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

/* ─────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────── */
export type Currency = "TZS" | "USD";

/** 1 USD → TZS (approximate live rate for simulation) */
const USD_TO_TZS = 2650;

interface CurrencyContextValue {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (c: Currency) => void;
  /** Convert a USD amount to the active currency and format with symbol */
  formatPrice: (usdAmount: number) => string;
  /** Return the raw converted number */
  convertPrice: (usdAmount: number) => number;
  /** Current currency symbol */
  symbol: string;
  /** Exchange rate label for display (e.g. "1 USD = 2,650 TZS") */
  rateLabel: string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("TZS");

  const toggleCurrency = useCallback(() => {
    setCurrencyState((prev) => (prev === "TZS" ? "USD" : "TZS"));
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
  }, []);

  const symbol = useMemo(() => (currency === "TZS" ? "Shs" : "$"), [currency]);

  const rateLabel = useMemo(
    () => `1 USD = ${USD_TO_TZS.toLocaleString()} TZS`,
    []
  );

  const convertPrice = useCallback(
    (usdAmount: number): number => {
      if (currency === "USD") return usdAmount;
      return Math.round(usdAmount * USD_TO_TZS);
    },
    [currency]
  );

  const formatPrice = useCallback(
    (usdAmount: number): string => {
      const amount = convertPrice(usdAmount);
      if (currency === "TZS") {
        return `Shs ${amount.toLocaleString("en-TZ")}`;
      }
      return `$ ${amount.toFixed(2)}`;
    },
    [convertPrice, currency]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        toggleCurrency,
        setCurrency,
        formatPrice,
        convertPrice,
        symbol,
        rateLabel,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx)
    throw new Error("useCurrency must be used within <CurrencyProvider>");
  return ctx;
}
