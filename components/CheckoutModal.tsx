"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { useCurrency } from "@/context/CurrencyContext";
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Lock,
  Phone,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { locale } = useLocale();
  const { items, subtotal, serviceFee, total, clearCart } = useCart();
  const { placeOrder, setTrackerOpen } = useOrder();
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<string>("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 2) {
      // Place order
      placeOrder({
        restaurantName: items[0]?.restaurantName || "SafePlate Partner",
        items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total,
        paymentMethod: selectedMethod === "mpesa" ? "M-Pesa" : selectedMethod === "tigo" ? "Tigo Pesa" : selectedMethod === "airtel" ? "Airtel Money" : "Card",
      });
      setOrderId(`ORD-${Date.now().toString(36).toUpperCase()}`);
      clearCart();
    }
    setStep(step + 1);
  };

  const handleTrack = () => {
    setTrackerOpen(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {locale === "eng" ? "Checkout" : "Malipo"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full -z-10" />
            
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accent rounded-full -z-10 transition-all duration-300`}
              style={{ width: `${(step - 1) * 50}%` }}
            />

            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  s < step
                    ? "bg-green-500 text-white border-2 border-green-500"
                    : s === step
                    ? "bg-accent text-white border-2 border-accent ring-4 ring-accent/20"
                    : "bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-300 dark:border-slate-600"
                }`}
              >
                {s < step ? <CheckCircle size={16} /> : s}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{locale === "eng" ? "Summary" : "Muhtasari"}</span>
            <span>{locale === "eng" ? "Payment" : "Malipo"}</span>
            <span>{locale === "eng" ? "Confirm" : "Thibitisha"}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {locale === "eng" ? "Order Items" : "Vitu vya Agizo"}
                </h3>
                {items.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {locale === "eng" ? "Your cart is empty." : "Kikapu chako ni kitupu."}
                  </p>
                ) : (
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {item.quantity}x
                          </span>
                          <span className="text-slate-700 dark:text-slate-300 line-clamp-1">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{locale === "eng" ? "Subtotal" : "Jumla Ndogo"}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{locale === "eng" ? "Service Fee (10%)" : "Ada ya Huduma (10%)"}</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 mt-2">
                  <span>{locale === "eng" ? "Total" : "Jumla"}</span>
                  <span className="text-accent">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl flex gap-3 items-start border border-green-100 dark:border-green-800/50">
                <ShieldCheck className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-green-800 dark:text-green-300 leading-snug">
                  {locale === "eng"
                    ? "Your payment is held securely in escrow until you confirm receipt of your order. This ensures complete buyer protection."
                    : "Malipo yako yanahifadhiwa salama kwenye dhamana hadi utakapothibitisha kupokea agizo lako. Hii inahakikisha ulinzi kamili wa mnunuzi."}
                </p>
              </div>

              <button
                onClick={handleNext}
                disabled={items.length === 0}
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {locale === "eng" ? "Proceed to Payment" : "Endelea na Malipo"}
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {locale === "eng" ? "Select Payment Method" : "Chagua Njia ya Malipo"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* M-Pesa */}
                <button
                  onClick={() => setSelectedMethod("mpesa")}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden \${
                    selectedMethod === "mpesa"
                      ? "border-accent bg-accent/5 dark:bg-accent/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-accent/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">M-Pesa</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Vodacom</div>
                  </div>
                  {selectedMethod === "mpesa" && (
                    <div className="absolute top-2 right-2 text-accent">
                      <CheckCircle size={16} className="fill-current text-accent/20" />
                    </div>
                  )}
                  <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                    POPULAR
                  </div>
                </button>

                {/* Tigo Pesa */}
                <button
                  onClick={() => setSelectedMethod("tigo")}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden \${
                    selectedMethod === "tigo"
                      ? "border-accent bg-accent/5 dark:bg-accent/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-accent/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">Tigo Pesa</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Tigo</div>
                  </div>
                  {selectedMethod === "tigo" && (
                    <div className="absolute top-2 right-2 text-accent">
                      <CheckCircle size={16} className="fill-current text-accent/20" />
                    </div>
                  )}
                </button>

                {/* Airtel Money */}
                <button
                  onClick={() => setSelectedMethod("airtel")}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden \${
                    selectedMethod === "airtel"
                      ? "border-accent bg-accent/5 dark:bg-accent/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-accent/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">Airtel Money</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Airtel</div>
                  </div>
                  {selectedMethod === "airtel" && (
                    <div className="absolute top-2 right-2 text-accent">
                      <CheckCircle size={16} className="fill-current text-accent/20" />
                    </div>
                  )}
                </button>

                {/* Card */}
                <button
                  onClick={() => setSelectedMethod("card")}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden \${
                    selectedMethod === "card"
                      ? "border-accent bg-accent/5 dark:bg-accent/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-accent/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">Bank Card</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Visa / Mastercard</div>
                  </div>
                  {selectedMethod === "card" && (
                    <div className="absolute top-2 right-2 text-accent">
                      <CheckCircle size={16} className="fill-current text-accent/20" />
                    </div>
                  )}
                </button>
              </div>

              {/* Payment Details Input */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                {selectedMethod !== "card" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {locale === "eng" ? "Phone Number" : "Namba ya Simu"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={18} className="text-slate-400" />
                        </div>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="07XX XXX XXX"
                          className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                        {locale === "eng" ? "Enter the number you will pay from." : "Ingiza namba utakayolipa."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {locale === "eng" ? "Card Number" : "Namba ya Kadi"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard size={18} className="text-slate-400" />
                        </div>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="•••• •••• •••• ••••"
                          className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          MM/YY
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="12/25"
                          className="block w-full px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                          className="block w-full px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-6"
              >
                <Lock size={18} />
                {locale === "eng" ? `Pay ${formatPrice(total)}` : `Lipa ${formatPrice(total)}`}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center py-6 space-y-6">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2 animate-[scale-in_0.5s_ease-out]">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {locale === "eng" ? "Order Placed Successfully!" : "Agizo Limewekwa Kwa Mafanikio!"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {locale === "eng" ? "Order ID" : "Namba ya Agizo"}: <span className="font-mono font-medium text-slate-900 dark:text-slate-300">#{orderId}</span>
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 max-w-sm w-full">
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 justify-center mb-1">
                  <ShieldCheck size={16} className="text-accent" />
                  <span className="font-medium">Escrow Protection Active</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {locale === "eng" 
                    ? "Your funds are safely held in escrow." 
                    : "Fedha zako zimehifadhiwa salama."}
                </p>
              </div>

              <div className="w-full space-y-3 pt-4">
                <button
                  onClick={handleTrack}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors"
                >
                  {locale === "eng" ? "Track Your Order" : "Fuatilia Agizo Lako"}
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-3.5 px-4 rounded-xl transition-colors"
                >
                  {locale === "eng" ? "Close" : "Funga"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
