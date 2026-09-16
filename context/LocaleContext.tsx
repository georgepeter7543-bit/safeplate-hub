"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { translations } from "@/lib/translations";

type Locale = "eng" | "sw";
type TranslationKey = keyof typeof translations["eng"];

interface LocaleContextValue {
  locale: Locale;
  t: (key: TranslationKey | string) => string;
  switchLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("eng");

  const t = useCallback(
    (key: TranslationKey | string): string => {
      const dict = translations[locale] as Record<string, string>;
      return dict[key] ?? key;
    },
    [locale]
  );

  const switchLocale = useCallback((loc: Locale) => {
    setLocale(loc);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "eng" ? "sw" : "eng"));
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, t, switchLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within <LocaleProvider>");
  return ctx;
}
