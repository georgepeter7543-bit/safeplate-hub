import { useLocale } from "@/context/LocaleContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Restaurant } from "@/lib/mockData";
import { CheckCircle, Star, Clock, MapPin, ShieldCheck, Eye, BadgeDollarSign, Phone, MessageSquare } from "lucide-react";
import React from "react";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPreOrder: (restaurant: Restaurant) => void;
  onViewDetails: (restaurant: Restaurant) => void;
}

export default function RestaurantCard({ restaurant, onViewDetails }: RestaurantCardProps) {
  const { t, locale } = useLocale();
  const { formatPrice } = useCurrency();
  const isEng = locale === 'eng';

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 75) return "bg-amber-500";
    return "bg-red-500";
  };

  const img = restaurant.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80";

  const rawWhatsApp = restaurant.whatsapp || restaurant.phone || "255754000111";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0")
    ? "255" + cleanWhatsApp.slice(1)
    : cleanWhatsApp.startsWith("255")
    ? cleanWhatsApp
    : "255" + cleanWhatsApp;

  const orderGreeting = encodeURIComponent(
    isEng
      ? `Hello! I would like to order food from ${restaurant.name} via SafePlate Hub.`
      : `Habari! Ningependa kuagiza chakula kutoka ${restaurant.name} kupitia SafePlate Hub.`
  );
  const whatsAppOrderUrl = `https://wa.me/${formattedWhatsApp}?text=${orderGreeting}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200/80 dark:border-slate-800 flex flex-col group">
      {/* Image Section */}
      <div className="relative h-52 w-full overflow-hidden">
        <img 
          src={img} 
          alt={restaurant.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Hygiene Score */}
        <div className={`absolute top-3 left-3 ${getScoreColor(restaurant.hygieneScore)} text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800 text-base`}>
          {restaurant.hygieneScore}%
        </div>

        {/* Verified Badge */}
        {restaurant.verified && (
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-amber-400 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-lg flex items-center gap-1 border border-amber-500/30">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>Arusha Verified</span>
          </div>
        )}

        {/* Location & Distance */}
        <div className="absolute bottom-3 left-3 flex items-center text-white/90 text-xs font-semibold">
          <MapPin size={14} className="mr-1 text-amber-400" />
          {restaurant.neighborhood}, Arusha
        </div>
        <div className="absolute bottom-3 right-3 text-white/90 text-xs font-semibold">
          {restaurant.distance} km
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white line-clamp-1 flex items-center gap-2">
            {restaurant.name}
            <span className={`w-2 h-2 rounded-full ${restaurant.openNow ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} title={restaurant.openNow ? 'Open Now' : 'Closed'} />
          </h3>
        </div>

        {/* Price & Rating Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-bold">
          <div className="flex items-center bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-1 rounded-md">
            <Star size={13} className="mr-1 fill-amber-500 text-amber-500" />
            {restaurant.rating.toFixed(1)} ({restaurant.reviewCount})
          </div>
          <div className="flex items-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md">
            <BadgeDollarSign size={13} className="mr-1" />
            Avg. {formatPrice(restaurant.avgDishPriceUSD)}
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">
            <Clock size={13} className="mr-1" />
            {restaurant.prepTime}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {restaurant.categories.slice(0, 3).map((category, idx) => (
            <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700">
              {category}
            </span>
          ))}
        </div>

        {/* Municipal Health Verification Badge */}
        <div className="mb-4 flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[11px] font-extrabold">
              {isEng ? "Arusha Municipal Verified" : "Halmashauri ya Arusha • Imethibitishwa"}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
            {restaurant.hygieneScore}% {isEng ? "Hygiene" : "Usafi"}
          </span>
        </div>

        {/* Action Buttons: One-Tap WhatsApp Order & Menu / Call */}
        <div className="mt-auto space-y-2">
          <a
            href={whatsAppOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md shadow-emerald-600/20 font-extrabold text-xs"
          >
            <MessageSquare size={14} className="fill-current" />
            <span>{isEng ? 'Order via WhatsApp' : 'Agiza kupitia WhatsApp'}</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(restaurant)}
              className="flex items-center justify-center py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-xs"
            >
              <Eye size={13} className="mr-1.5 text-amber-500" />
              {isEng ? 'Digital Menu' : 'Menyu ya Simu'}
            </button>
            
            <a
              href={`tel:${restaurant.phone}`}
              className="flex items-center justify-center py-2 px-3 border border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors font-bold text-xs"
            >
              <Phone size={13} className="mr-1.5" />
              {isEng ? 'Call Direct' : 'Piga Simu'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
