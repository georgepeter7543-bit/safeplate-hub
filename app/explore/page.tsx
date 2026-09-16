"use client";

import React, { useState, useMemo } from "react";
import MapViewer from "@/components/MapViewer";
import RestaurantCard from "@/components/RestaurantCard";
import RestaurantDetailModal from "@/components/RestaurantDetailModal";
import VerificationModal from "@/components/VerificationModal";
import { useRouter } from "next/navigation";

import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { useRestaurants } from "@/context/RestaurantContext";
import { Restaurant } from "@/lib/mockData";
import { Search, Filter, MapPin, Lock, ShieldCheck, Compass, ArrowUpDown } from "lucide-react";

/* Arusha quick filter chips */
const NEIGHBORHOODS = ["All", "Ngarenaro", "Majengo", "Clock Tower / CBD", "Njiro"];
const CATEGORIES = ["All", "Nyama Choma", "Authentic Swahili", "Local Rice", "Business Lunch", "Vegetarian", "Seafood"];

export default function ExplorePage() {
  const { locale, t } = useLocale();
  const { user, isAuthenticated } = useAuth();
  const { restaurants } = useRestaurants();
  const router = useRouter();
  const isEng = locale === "eng";

  /* Modal state — declared unconditionally at top level */
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [verifyingRestaurant, setVerifyingRestaurant] = useState<Restaurant | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  /* Filters — Arusha-only */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"cheapest" | "highest" | "hygiene" | "rating" | "distance">("hygiene");

  /* Filtered restaurants dynamically from context — declared unconditionally */
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        /* Neighborhood filter */
        if (selectedNeighborhood !== "All") {
          const nbKey = selectedNeighborhood.split(" / ")[0].toLowerCase();
          if (!r.neighborhood.toLowerCase().includes(nbKey)) return false;
        }

        /* Category match */
        if (
          selectedCategory !== "All" &&
          !r.categories.some((c) =>
            c.toLowerCase().includes(selectedCategory.toLowerCase())
          )
        ) {
          return false;
        }

        /* Search match (checks name, free-form neighborhood, categories, description, and menu dishes) */
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            r.name.toLowerCase().includes(q) ||
            r.neighborhood.toLowerCase().includes(q) ||
            r.categories.some((c) => c.toLowerCase().includes(q)) ||
            r.description.toLowerCase().includes(q) ||
            r.menu.some((m) => m.name.toLowerCase().includes(q));
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "cheapest") return (a.avgDishPriceUSD || 0) - (b.avgDishPriceUSD || 0);
        if (sortBy === "highest") return (b.avgDishPriceUSD || 0) - (a.avgDishPriceUSD || 0);
        if (sortBy === "hygiene") return b.hygieneScore - a.hygieneScore;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "distance") return a.distance - b.distance;
        return 0;
      });
  }, [restaurants, searchQuery, selectedNeighborhood, selectedCategory, sortBy]);

  /* Strict Owner Isolation: Redirect sellers away from public diner browsing */
  React.useEffect(() => {
    if (isAuthenticated && user?.role === "merchant") {
      router.replace("/seller-dashboard");
    }
  }, [isAuthenticated, user, router]);

  // ── GUARD CLAUSE / CONDITIONAL RETURN EXECUTED STRICTLY AFTER ALL HOOKS ──
  if (isAuthenticated && user?.role === "merchant") {
    return null;
  }

  const handlePreOrder = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailOpen(true);
  };

  const handleViewDetails = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailOpen(true);
  };

  const handleViewVerification = (restaurant: Restaurant) => {
    setVerifyingRestaurant(restaurant);
    setIsVerificationOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* ── Page Header ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-amber-500/30">
              <Compass className="w-3.5 h-3.5" />
              {isEng ? "Arusha Explorer & Map" : "Ramani na Orodha ya Arusha"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isEng ? "Arusha Neighborhood Directory" : "Orodha ya Migahawa ya Arusha"}</span>
              <span className="text-xs bg-amber-500 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> Arusha Only
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isEng
                ? "Type any Arusha location (Unga Limited, Sekei, Kisongo, Njiro...) or search food items."
                : "Tafuta eneo au mtaa wowote wa Arusha au jina la chakula."}
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEng ? "Search dish, place, or location..." : "Tafuta chakula, mkahawa, au mtaa..."}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* ── Interactive Arusha Map Viewer ── */}
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MapViewer
          restaurants={filteredRestaurants}
          onSelectRestaurant={handleViewDetails}
        />
      </section>

      {/* ── Directory Section ── */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Controls Bar: Sort Dropdown & Verification Note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              {isEng ? "Verified Eateries Directory" : "Migahawa Iliyothibitishwa"}
              <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded-full">
                {filteredRestaurants.length}
              </span>
            </h2>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
              {isEng ? "Sort Menu Prices:" : "Panga Bei ya Menyu:"}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            >
              <option value="cheapest">{t("cheapestFirst") || "Cheapest First ($ → $$$)"}</option>
              <option value="highest">{t("highestPrice") || "Highest Price First ($$$ → $)"}</option>
              <option value="hygiene">{t("sortByHygiene") || "Hygiene Score (Highest First)"}</option>
              <option value="rating">{t("sortByRating") || "Top Rated"}</option>
              <option value="distance">{t("distance") || "Distance"}</option>
            </select>
          </div>
        </div>

        {/* Filter Bar: Neighborhood Chips & Category Chips */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 mb-8 shadow-sm flex flex-col gap-4">
          
          {/* Neighborhood Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              {isEng ? "Quick Neighborhoods:" : "Mtaa:"}
            </div>
            {NEIGHBORHOODS.map((nb) => (
              <button
                key={nb}
                onClick={() => setSelectedNeighborhood(nb)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedNeighborhood === nb
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {nb === "All" ? (isEng ? "All Arusha" : "Arusha Yote") : nb}
              </button>
            ))}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedCategory === cat
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat === "All" ? (isEng ? "All Categories" : "Kategoria Zote") : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPreOrder={handlePreOrder}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {isEng ? "No Arusha eateries match your query" : "Hakuna migahawa ya Arusha iliyopatikana"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {isEng
                ? "Try adjusting your search location, category, or query."
                : "Jaribu kubadilisha mtaa, kategoria au utafutaji wako."}
            </p>
            <button
              onClick={() => {
                setSelectedNeighborhood("All");
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 px-5 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-500 transition-colors"
            >
              {isEng ? "Reset Filters" : "Rejesha Vianzio"}
            </button>
          </div>
        )}

      </section>

      {/* Detail Modal */}
      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onViewVerification={handleViewVerification}
      />

      {/* Verification Modal */}
      <VerificationModal
        restaurant={verifyingRestaurant}
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
      />

    </main>
  );
}
