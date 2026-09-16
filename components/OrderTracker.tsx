"use client";

import React, { useMemo } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useOrder } from "@/context/OrderContext";
import {
  X,
  Package,
  ChefHat,
  Flame,
  Truck,
  CheckCircle,
  Clock,
  Phone,
  User,
  Star
} from "lucide-react";

export default function OrderTracker() {
  const { locale } = useLocale();
  const { activeOrder, isTrackerOpen, setTrackerOpen, clearOrder } = useOrder();

  const STATUS_SEQUENCE = [
    "pending",
    "kitchen_verified",
    "preparing",
    "out_for_delivery",
    "delivered",
  ];

  const steps = useMemo(() => [
    {
      id: "pending",
      icon: Package,
      labelEn: "Order Placed",
      labelSw: "Agizo Limewekwa"
    },
    {
      id: "kitchen_verified",
      icon: ChefHat,
      labelEn: "Kitchen Verified",
      labelSw: "Jiko Limethibitisha"
    },
    {
      id: "preparing",
      icon: Flame,
      labelEn: "Preparing",
      labelSw: "Inaandaliwa"
    },
    {
      id: "out_for_delivery",
      icon: Truck,
      labelEn: "Out for Delivery",
      labelSw: "Njiani Kuletwa"
    },
    {
      id: "delivered",
      icon: CheckCircle,
      labelEn: "Delivered",
      labelSw: "Imefikishwa"
    }
  ], []);

  if (!isTrackerOpen || !activeOrder) return null;

  const currentStatusIndex = STATUS_SEQUENCE.indexOf(activeOrder.status);

  const handleMinimize = () => {
    setTrackerOpen(false);
  };

  const isDelivered = activeOrder.status === "delivered";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {locale === "eng" ? "Order Tracking" : "Ufuatiliaji wa Agizo"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              #{activeOrder.id}
            </p>
          </div>
          <button
            onClick={handleMinimize}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title={locale === "eng" ? "Minimize" : "Ficha"}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {isDelivered ? (
            <div className="flex flex-col items-center text-center py-8 space-y-6">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2 animate-[scale-in_0.5s_ease-out]">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {locale === "eng" ? "Order Delivered!" : "Agizo Limetolewa!"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {locale === "eng" ? "Enjoy your meal!" : "Furahia chakula chako!"}
                </p>
              </div>

              <div className="w-full max-w-xs space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "eng" ? "Rate your experience" : "Tathmini uzoefu wako"}
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-slate-300 hover:text-accent transition-colors">
                      <Star size={32} className="fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  clearOrder();
                  setTrackerOpen(false);
                }}
                className="w-full max-w-xs bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors mt-6"
              >
                {locale === "eng" ? "Close & Release Escrow" : "Funga & Toa Dhamana"}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Vertical Timeline */}
              <div className="relative pl-4 space-y-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const stepIndex = STATUS_SEQUENCE.indexOf(step.id);
                  const isCompleted = stepIndex < currentStatusIndex;
                  const isActive = stepIndex === currentStatusIndex;
                  const isUpcoming = stepIndex > currentStatusIndex;
                  const isLast = index === steps.length - 1;

                  return (
                    <div key={step.id} className="relative flex items-start gap-4">
                      {/* Timeline Line */}
                      {!isLast && (
                        <div
                          className={`absolute left-[11px] top-8 bottom-[-2rem] w-0.5 ${
                            isCompleted ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700 border-l-2 border-dashed"
                          }`}
                        />
                      )}

                      {/* Icon Circle */}
                      <div
                        className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isActive
                            ? "bg-white dark:bg-slate-800 border-accent text-accent ring-4 ring-accent/20 animate-pulse"
                            : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400"
                        }`}
                      >
                        {isCompleted ? <CheckCircle size={14} className="text-white" /> : <Icon size={12} />}
                      </div>

                      {/* Content */}
                      <div className="pt-0.5 flex-1">
                        <h4
                          className={`font-medium ${
                            isCompleted || isActive
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {locale === "eng" ? step.labelEn : step.labelSw}
                        </h4>
                        {isActive && (
                          <p className="text-xs text-accent mt-1 flex items-center gap-1">
                            <Clock size={12} />
                            {locale === "eng" ? "In progress..." : "Inaendelea..."}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rider Info (if Out for Delivery) */}
              {activeOrder.status === "out_for_delivery" && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 overflow-hidden">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {locale === "eng" ? "Your Rider" : "Mhudumu Wako"}
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {activeOrder.riderName || "Ali Juma"}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${activeOrder.riderPhone || "0700000000"}`}
                    className="w-10 h-10 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 transition-colors"
                  >
                    <Phone size={18} />
                  </a>
                </div>
              )}

              {/* Order Details Accordion / Section */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mt-6 space-y-3">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm pb-2 border-b border-slate-200 dark:border-slate-700">
                  {locale === "eng" ? "Order Details" : "Maelezo ya Agizo"}
                </h4>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        Tsh {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>{locale === "eng" ? "Total Paid" : "Jumla Iliyolipwa"}</span>
                  <span className="text-accent">Tsh {activeOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
