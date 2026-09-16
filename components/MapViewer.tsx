"use client";

import React, { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { mockRestaurants, Restaurant } from "@/lib/mockData";
import {
  MapPin, Navigation, ShieldCheck, Star, Layers,
  Compass, ExternalLink, Lock, Zap,
} from "lucide-react";

/* Arusha center coordinates */
const ARUSHA_CENTER = { lat: -3.3869, lng: 36.6830 };

const ARUSHA_NEIGHBORHOODS = [
  { name: "All",             nameSw: "Zote",          color: "bg-slate-700 text-slate-200" },
  { name: "Ngarenaro",      nameSw: "Ngarenaro",      color: "bg-emerald-900/40 text-emerald-300" },
  { name: "Majengo",        nameSw: "Majengo",        color: "bg-blue-900/40 text-blue-300" },
  { name: "Clock Tower / CBD", nameSw: "Mnara wa Saa",color: "bg-amber-900/40 text-amber-300" },
  { name: "Njiro",          nameSw: "Njiro",          color: "bg-purple-900/40 text-purple-300" },
];

interface MapViewerProps {
  onSelectRestaurant?: (restaurant: Restaurant) => void;
  onVerifyRestaurant?: (restaurant: Restaurant) => void;
  restaurants?: Restaurant[];
}

export default function MapViewer({ onSelectRestaurant, onVerifyRestaurant, restaurants }: MapViewerProps) {
  const { locale, t } = useLocale();
  const isEng = locale === "eng";

  const allSpots = restaurants || mockRestaurants;
  const [activeNeighborhood, setActiveNeighborhood] = useState("All");
  const [selectedMapPin, setSelectedMapPin] = useState<Restaurant | null>(allSpots[0] || null);
  const [mapType, setMapType] = useState<"hygiene" | "standard">("hygiene");

  /* All restaurants are Arusha-only */
  const displayRestaurants =
    activeNeighborhood === "All"
      ? allSpots
      : allSpots.filter((r) => r.neighborhood.startsWith(activeNeighborhood.split(" / ")[0]));

  const shownRestaurants = displayRestaurants.slice(0, 3);

  return (
    <section id="map" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-semibold text-sm mb-1 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            {isEng ? "GPS & Hygiene Radar" : "GPS na Rada ya Usafi"}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            {isEng ? "Arusha Interactive Eatery Map" : "Ramani Interakti ya Migahawa ya Arusha"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 max-w-2xl text-sm">
            {isEng
              ? "Live map locked to Arusha, Tanzania. Tap pins to view sanitation scores & pre-order."
              : "Ramani ya moja kwa moja imefungwa Arusha, Tanzania. Gusa pini kuona alama za usafi."}
          </p>
        </div>

        {/* Arusha Lock Banner */}
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl text-sm font-semibold text-amber-700 dark:text-amber-400 whitespace-nowrap">
          <Lock className="w-4 h-4" />
          {isEng ? "Arusha-Only Zone" : "Eneo la Arusha Tu"}
        </div>
      </div>

      {/* Neighborhood Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {ARUSHA_NEIGHBORHOODS.map((nb) => {
          const label = isEng ? nb.name : nb.nameSw;
          const isActive = activeNeighborhood === nb.name;
          return (
            <button
              key={nb.name}
              onClick={() => {
                setActiveNeighborhood(nb.name);
                const first =
                  nb.name === "All"
                    ? mockRestaurants[0]
                    : mockRestaurants.find((r) => r.neighborhood.startsWith(nb.name.split(" / ")[0]));
                if (first) setSelectedMapPin(first);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isActive
                  ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <MapPin className="w-3 h-3 inline-block mr-1 -mt-0.5" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Map Canvas */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-950 min-h-[520px] flex flex-col justify-between p-4 sm:p-6">

        {/* Background — stylized Arusha map simulation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-95" />
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,#000_60%,transparent_100%)]" />

          {/* Arusha GPS center pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-28 w-28 rounded-full bg-amber-400 opacity-10" />
            <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-amber-400 opacity-15 animation-delay-300" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 ring-4 ring-amber-500/30 shadow-lg shadow-amber-500/40" />
          </div>

          {/* Road simulation SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-20 stroke-slate-600" strokeWidth="1.5" fill="none">
            <path d="M0 200 Q200 180 400 220 T800 190 T1200 230" strokeDasharray="6 4" />
            <path d="M100 0 Q250 300 500 520" strokeWidth="2.5" />
            <path d="M0 380 Q350 340 700 400 T1200 380" />
            <path d="M600 0 Q580 250 620 520" strokeDasharray="8 4" />
            <path d="M0 100 Q600 80 1200 120" strokeDasharray="4 6" opacity="0.5"/>
          </svg>

          {/* Hygiene heatmap overlay (when active) */}
          {mapType === "hygiene" && (
            <>
              <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-emerald-500/8 rounded-full blur-3xl" />
            </>
          )}
        </div>

        {/* Top Control Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm font-medium">
            <Navigation className="w-4 h-4 text-amber-500 animate-pulse flex-shrink-0" />
            <span className="font-semibold text-white">Arusha, Tanzania</span>
            <span className="text-slate-500 hidden sm:inline">—</span>
            <span className="text-slate-400 hidden sm:inline text-xs">
              {ARUSHA_CENTER.lat}°S, {ARUSHA_CENTER.lng}°E
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              GPS LIVE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMapType(mapType === "hygiene" ? "standard" : "hygiene")}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                mapType === "hygiene"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {mapType === "hygiene"
                ? isEng ? "Hygiene Heatmap" : "Ramani ya Usafi"
                : isEng ? "Standard View" : "Mtazamo wa Kawaida"}
            </button>
          </div>
        </div>

        {/* Restaurant Pin Cards */}
        <div className="relative z-10 my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shownRestaurants.map((restaurant, idx) => {
            const isSelected = selectedMapPin?.id === restaurant.id;
            return (
              <div
                key={restaurant.id}
                onClick={() => setSelectedMapPin(restaurant)}
                className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 backdrop-blur-md ${
                  isSelected
                    ? "bg-slate-900/98 border-2 border-amber-500 shadow-xl shadow-amber-500/15 -translate-y-1"
                    : "bg-slate-900/80 border border-slate-800 hover:border-slate-600 hover:bg-slate-900/90"
                }`}
              >
                {/* Pin number + name */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xs flex-shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">{restaurant.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-amber-400" />
                        {restaurant.neighborhood}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0 ${
                      restaurant.hygieneScore >= 93
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : restaurant.hygieneScore >= 88
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {restaurant.hygieneScore}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {restaurant.rating} ({restaurant.reviewCount})
                  </span>
                  <span className="text-slate-500">{restaurant.prepTime}</span>
                  <span className="text-slate-300 font-bold">{restaurant.distance} km</span>
                </div>

                {/* Open/Closed indicator */}
                <div className={`mt-2 flex items-center gap-1.5 text-[10px] font-bold ${restaurant.openNow ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${restaurant.openNow ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  {restaurant.openNow ? (isEng ? 'Open Now' : 'Wazi Sasa') : (isEng ? 'Closed' : 'Imefungwa')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Pin Detail Bar */}
        {selectedMapPin && (
          <div className="relative z-10 bg-slate-900/98 backdrop-blur-xl border border-slate-700/80 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={selectedMapPin.image}
                alt={selectedMapPin.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{selectedMapPin.name}</h3>
                  {selectedMapPin.verified && (
                    <span className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wide">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {selectedMapPin.neighborhood}, Arusha
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1.5">
                  <span>
                    {t("priceRange")}: <strong className="text-amber-400">{selectedMapPin.priceRange}</strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>
                    {t("prepTime")}: <strong>{selectedMapPin.prepTime}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => selectedMapPin && onVerifyRestaurant?.(selectedMapPin)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {isEng ? "Sanitation Audit" : "Ukaguzi wa Usafi"}
              </button>
              <button
                onClick={() => selectedMapPin && onSelectRestaurant?.(selectedMapPin)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white text-xs font-bold transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-1.5"
              >
                {t("preOrder") || "Pre-Order"}
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
