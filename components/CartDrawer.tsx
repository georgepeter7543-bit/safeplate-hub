"use client";
import React from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useCart, CartItem } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { X, Plus, Minus, Trash2, ShoppingCart, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { locale } = useLocale();
  const { items: cartItems, isCartOpen, setCartOpen, updateQuantity, removeItem, subtotal, serviceFee, total } = useCart();
  const { formatPrice } = useCurrency();

  if (!isCartOpen) return null;

  const isEng = locale === 'eng';

  const t = {
    yourCart: isEng ? 'Your Cart' : 'Kikapu Chako',
    emptyCart: isEng ? 'Your cart is empty' : 'Kikapu chako kipo wazi',
    startBrowsing: isEng ? 'Start browsing restaurants to add items' : 'Anza kuvinjari mikahawa kuongeza vitu',
    subtotal: isEng ? 'Subtotal' : 'Jumla Ndogo',
    serviceFee: isEng ? 'Escrow Service Fee' : 'Ada ya Huduma ya Dhamana',
    total: isEng ? 'Total' : 'Jumla Kuu',
    proceedToCheckout: isEng ? 'Proceed to Checkout' : 'Nenda kwenye Malipo',
    trustNote: isEng ? 'Funds protected until delivery' : 'Pesa zinalindwa mpaka uletewe',
  };

  const handleCheckout = () => {
    setCartOpen(false);
    onCheckout();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-amber-600 dark:text-amber-500" size={24} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.yourCart}</h2>
            {cartItems.length > 0 && (
              <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/50">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                <ShoppingCart size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{t.emptyCart}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.startBrowsing}</p>
              <button 
                onClick={() => setCartOpen(false)}
                className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-medium transition-colors"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item: CartItem) => (
                <div key={item.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between gap-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                        {isEng ? item.name : (item.nameSw || item.name)}
                      </h4>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.portionSize && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium capitalize">
                          {item.portionSize}
                        </span>
                      )}
                      {item.spiceLevel && (
                        <span className="text-[10px] bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 px-1.5 py-0.5 rounded font-medium capitalize">
                          {item.spiceLevel}
                        </span>
                      )}
                    </div>
                    
                    {item.dietaryNotes && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 italic truncate">
                        Note: {item.dietaryNotes}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-full p-0.5">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-200 hover:text-amber-600 shadow-sm"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-semibold w-3 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-200 hover:text-amber-600 shadow-sm"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t.subtotal}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  {t.serviceFee}
                  <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-1 rounded font-bold">10%</span>
                </span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-700">
                <span>{t.total}</span>
                <span className="text-amber-600 dark:text-amber-400">{formatPrice(total)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 justify-center mb-4 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 py-2 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
              <ShieldCheck size={14} />
              <span>{t.trustNote}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-amber-600/30 transition-transform active:scale-[0.98]"
            >
              <span>{t.proceedToCheckout}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
