"use client";

import React, { useState, useMemo } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Restaurant } from '@/lib/mockData';
import { X, Star, Clock, MapPin, ShieldCheck, Phone, MessageSquare, ArrowUpDown } from 'lucide-react';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onViewVerification: (restaurant: Restaurant) => void;
}

export default function RestaurantDetailModal({
  restaurant,
  isOpen,
  onClose,
  onViewVerification,
}: RestaurantDetailModalProps) {
  // ── 1. ALL REACT HOOKS DECLARED UNCONDITIONALLY AT TOP LEVEL ──
  const { locale } = useLocale();
  const { formatPrice } = useCurrency();
  const [menuSortOrder, setMenuSortOrder] = useState<'default' | 'cheapest' | 'highest'>('default');

  /* Sorted menu items hook — declared before any conditional returns */
  const sortedMenuItems = useMemo(() => {
    if (!restaurant || !restaurant.menu) return [];
    const items = [...restaurant.menu];
    if (menuSortOrder === 'cheapest') return items.sort((a, b) => a.price - b.price);
    if (menuSortOrder === 'highest') return items.sort((a, b) => b.price - a.price);
    return items;
  }, [restaurant, menuSortOrder]);

  // ── 2. GUARD CLAUSE / CONDITIONAL RETURN EXECUTED STRICTLY AFTER ALL HOOKS ──
  if (!isOpen || !restaurant) return null;

  const isEng = locale === 'eng';

  const t = {
    viewVerification: isEng ? 'Sanitation Audit' : 'Ukaguzi wa Usafi',
    popular: isEng ? 'Popular' : 'Inapendwa',
    callNow: isEng ? 'Call & Connect' : 'Piga Simu Direct',
    chatWhatsApp: isEng ? 'WhatsApp Direct' : 'WhatsApp ya Mkahawa',
    cheapestFirst: isEng ? 'Cheapest First ($ → $$$)' : 'Bei Nafuu Kwanza',
    highestFirst: isEng ? 'Highest Price ($$$ → $)' : 'Bei ya Juu Kwanza',
    defaultSort: isEng ? 'Featured' : 'Zilizopendekezwa',
  };

  const rawWhatsApp = restaurant.whatsapp || restaurant.phone || "255754000111";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0")
    ? "255" + cleanWhatsApp.slice(1)
    : cleanWhatsApp.startsWith("255")
    ? cleanWhatsApp
    : "255" + cleanWhatsApp;

  const generalOrderMsg = encodeURIComponent(
    isEng
      ? `Hello! I would like to order food from ${restaurant.name} via SafePlate Hub.`
      : `Habari! Ningependa kuagiza chakula kutoka ${restaurant.name} kupitia SafePlate Hub.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Image & Info */}
        <div className="relative h-56 shrink-0">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900 backdrop-blur-md rounded-full text-white transition-colors border border-slate-700 z-10"
          >
            <X size={20} />
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <button 
                    onClick={() => onViewVerification(restaurant)}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-500/40 flex items-center gap-1 transition-colors"
                  >
                    <ShieldCheck size={14} />
                    {restaurant.hygieneScore}% {t.viewVerification}
                  </button>
                  <span className="text-xs text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    <MapPin size={13} /> {restaurant.neighborhood}, Arusha 🔒
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 text-white">{restaurant.name}</h2>
                
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-300">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={14} fill="currentColor" />
                    <span>{restaurant.rating.toFixed(1)} ({restaurant.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{restaurant.prepTime}</span>
                  </div>
                </div>
              </div>
              
              {/* Direct Connection Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-3.5 py-2.5 rounded-xl transition-all shadow-lg font-extrabold text-xs"
                >
                  <Phone size={14} />
                  <span>{t.callNow}</span>
                </a>
                <a
                  href={`https://wa.me/${formattedWhatsApp}?text=${generalOrderMsg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2.5 rounded-xl transition-all font-extrabold text-xs shadow-lg"
                >
                  <MessageSquare size={14} />
                  <span>{t.chatWhatsApp}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Sort & Filter Bar */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <ArrowUpDown size={14} className="text-amber-500" />
            <span>{isEng ? 'Sort Menu Dishes:' : 'Panga Menyu:'}</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setMenuSortOrder('default')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                menuSortOrder === 'default'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t.defaultSort}
            </button>
            <button
              onClick={() => setMenuSortOrder('cheapest')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                menuSortOrder === 'cheapest'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t.cheapestFirst}
            </button>
            <button
              onClick={() => setMenuSortOrder('highest')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                menuSortOrder === 'highest'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t.highestFirst}
            </button>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {sortedMenuItems.map((item) => {
            const itemOrderMsg = encodeURIComponent(
              isEng
                ? `Hello! I would like to order "${item.name}" from ${restaurant.name} via SafePlate Hub.`
                : `Habari! Ningependa kuagiza "${item.name}" kutoka ${restaurant.name} kupitia SafePlate Hub.`
            );

            return (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex gap-4 items-center justify-between hover:border-amber-500/50 transition-all shadow-sm"
              >
                <div className="flex gap-4 items-center min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-200 dark:bg-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                        {isEng ? item.name : item.nameSw || item.name}
                      </h4>
                      {(item.isChefSpecial || item.popular) && (
                        <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star size={10} className="fill-amber-500 text-amber-500" />
                          <span>{isEng ? "Chef's Special" : "Maalum ya Mpishi"}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {isEng ? item.description : item.descriptionSw || item.description}
                    </p>
                    <span className="inline-block mt-1 text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>

                {/* Direct WhatsApp & Call for specific dish */}
                <div className="shrink-0 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${formattedWhatsApp}?text=${itemOrderMsg}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    title={isEng ? `Order ${item.name} via WhatsApp` : `Agiza ${item.name} kupitia WhatsApp`}
                  >
                    <MessageSquare size={13} />
                    <span className="hidden sm:inline">{isEng ? 'Order' : 'Agiza'}</span>
                  </a>
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="flex items-center gap-1.5 px-2.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    <Phone size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
