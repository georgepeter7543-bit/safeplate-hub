import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AuthProvider } from "@/context/AuthContext";
import { RestaurantProvider } from "@/context/RestaurantContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "SafePlate Hub — Arusha's Verified Local Food Platform",
  description:
    "Discover safe, hygienic, and authentic local eateries in Arusha, Tanzania — Ngarenaro, Majengo, Clock Tower & Njiro. Direct Call & Connect, multi-currency support, and crowdsourced hygiene reviews.",
  keywords: [
    "Arusha food",
    "Tanzania restaurant",
    "Nyama Choma Arusha",
    "halal food Arusha",
    "SafePlate Hub",
    "verified restaurant Tanzania",
  ],
  openGraph: {
    title: "SafePlate Hub — Arusha's Direct Culinary Connection Platform",
    description: "Hygienic, verified local eateries across Arusha neighborhoods.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body
        className={`${outfit.variable} font-[family-name:var(--font-outfit)] min-h-full flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <AuthProvider>
          <RestaurantProvider>
            <ThemeProvider>
              <LocaleProvider>
                <CurrencyProvider>
                  <CartProvider>
                    <OrderProvider>
                      <Navbar />
                      <div className="flex-1">{children}</div>
                      <Footer />
                    </OrderProvider>
                  </CartProvider>
                </CurrencyProvider>
              </LocaleProvider>
            </ThemeProvider>
          </RestaurantProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
