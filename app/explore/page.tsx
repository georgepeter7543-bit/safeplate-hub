"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import MapViewer from "@/components/MapViewer";
import RestaurantCard from "@/components/RestaurantCard";
import RestaurantDetailModal from "@/components/RestaurantDetailModal";
import VerificationModal from "@/components/VerificationModal";
import { useRouter, useSearchParams } from "next/navigation";

import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { useRestaurants } from "@/context/RestaurantContext";
import { Restaurant } from "@/lib/mockData";
import { 
  Search, Filter, MapPin, Lock, ShieldCheck, Compass, 
  ArrowUpDown, Wallet, X, BadgeDollarSign, Sparkles, Check,
  Store, UtensilsCrossed
} from "lucide-react";
import { 
  parseMultiCriteriaQuery, 
  evaluateRestaurantMultiCriteria, 
  USD_TO_TZS_RATE 
} from "@/lib/budgetFilter";

/* Arusha quick filter chips */
const NEIGHBORHOODS = ["All", "Ngarenaro", "Majengo", "Clock Tower / CBD", "Njiro"];
const CATEGORIES = ["All", "Nyama Choma", "Authentic Swahili", "Local Rice", "Business Lunch", "Vegetarian", "Seafood"];

const QUICK_SUGGESTIONS = [
  { label: "All Eateries", labelSw: "Migahawa Yote", query: "" },
  { label: "Pilau", labelSw: "Pilau", query: "Pilau", type: "food" },
  { label: "Nyama Choma", labelSw: "Nyama Choma", query: "Nyama Choma", type: "food" },
  { label: "< 5,000 TZS", labelSw: "< TZS 5,000", query: "5000", type: "budget" },
  { label: "5k – 10k TZS", labelSw: "TZS 5k – 10k", query: "5000 - 10000", type: "budget" },
  { label: "Ngarenaro", labelSw: "Ngarenaro", query: "Ngarenaro", type: "location" },
  { label: "Njiro", labelSw: "Njiro", query: "Njiro", type: "location" },
  { label: "Mama Zawadi", labelSw: "Mama Zawadi", query: "Mama Zawadi", type: "restaurant" },
];

function ExploreContent() {
  /* ── 1. ALL REACT HOOKS UNCONDITIONALLY AT THE TOP LEVEL ── */
  const { locale, t } = useLocale();
  const { user, isAuthenticated } = useAuth();
  const { restaurants } = useRestaurants();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEng = locale === "eng";

  /* Initial search query from URL query parameters (?q=... or ?budget=... or ?search=...) */
  const initialQuery = 
    searchParams.get("q") || 
    searchParams.get("budget") || 
    searchParams.get("search") || 
    "";

  /* Modal states */
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [verifyingRestaurant, setVerifyingRestaurant] = useState<Restaurant | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  /* Multi-Criteria Search Input State */
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"cheapest" | "highest" | "hygiene" | "rating" | "distance">("cheapest");

  /* Sync search input if URL parameters change */
  useEffect(() => {
    const q = searchParams.get("q") || searchParams.get("budget") || searchParams.get("search") || "";
    if (q && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  /* Parse multi-criteria search query structure */
  const parsedSearch = useMemo(() => {
    return parseMultiCriteriaQuery(searchQuery, isEng);
  }, [searchQuery, isEng]);

  /* Filtered restaurants evaluated dynamically across Restaurant Name, Food Name, Budget, and Location */
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        /* Secondary neighborhood pill filter */
        if (selectedNeighborhood !== "All") {
          const nbKey = selectedNeighborhood.split(" / ")[0].toLowerCase();
          if (!r.neighborhood.toLowerCase().includes(nbKey)) return false;
        }

        /* Secondary category pill filter */
        if (
          selectedCategory !== "All" &&
          !r.categories.some((c) =>
            c.toLowerCase().includes(selectedCategory.toLowerCase())
          )
        ) {
          return false;
        }

        /* Multi-Criteria Match (Restaurant Name, Food Name, Budget, Location) */
        const matchResult = evaluateRestaurantMultiCriteria(r, searchQuery, isEng);
        if (!matchResult.matches) {
          return false;
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
  }, [restaurants, searchQuery, isEng, selectedNeighborhood, selectedCategory, sortBy]);

  /* Strict Owner Isolation: Redirect sellers away from public diner browsing */
  useEffect(() => {
    if (isAuthenticated && user?.role === "merchant") {
      router.replace("/seller-dashboard");
    }
  }, [isAuthenticated, user, router]);

  /* Guard clause executed strictly after all hooks */
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

  const handleSuggestionClick = (queryText: string) => {
    setSearchQuery(queryText);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">
      
      {/* ── Page Header with Multi-Criteria Search Bar ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-amber-500/30">
              <Compass className="w-3.5 h-3.5" />
              {isEng ? "Arusha Explorer & Smart Search" : "Utafutaji Mahiri wa Arusha"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
              <span>{isEng ? "Multi-Criteria Dining Directory" : "Orodha ya Migahawa ya Arusha"}</span>
              <span className="text-xs bg-gradient-to-r from-amber-600 to-orange-500 text-white font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" /> All-in-One Finder
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              {isEng
                ? "Filter instantly by restaurant name, specific food dish, budget in TZS, or neighborhood location simultaneously as you type."
                : "Tafuta papo hapo kwa jina la mgahawa, chakula maalum, bajeti ya TZS, au mtaa wowote wa Arusha kwa wakati mmoja."}
            </p>
          </div>

          {/* ── Multi-Criteria Search Input Bar ── */}
          <div className="flex flex-col gap-2 w-full lg:w-[440px]">
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEng 
                    ? "Search restaurant, food, budget (TZS), or location..." 
                    : "Tafuta mkahawa, chakula, bajeti (TZS), au mtaa..."
                }
                className="w-full pl-10 pr-9 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 shadow-inner transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Helper Criteria Badges */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1 gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-0.5 text-slate-500 dark:text-slate-400 font-medium">
                  <Store className="w-3 h-3 text-amber-500" /> Restaurant
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-slate-500 dark:text-slate-400 font-medium">
                  <UtensilsCrossed className="w-3 h-3 text-orange-500" /> Food
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-slate-500 dark:text-slate-400 font-medium">
                  <Wallet className="w-3 h-3 text-emerald-500" /> Budget
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-slate-500 dark:text-slate-400 font-medium">
                  <MapPin className="w-3 h-3 text-blue-500" /> Location
                </span>
              </div>
              {searchQuery && (
                <button 
                  onClick={handleClearSearch}
                  className="text-amber-500 hover:underline font-bold shrink-0"
                >
                  {isEng ? "Reset" : "Rejesha"}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* ── Quick Smart Suggestions Bar ── */}
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {isEng ? "Quick Suggestions:" : "Mapendekezo ya Haraka:"}
          </span>

          {QUICK_SUGGESTIONS.map((sug) => {
            const isActive = searchQuery.trim().toLowerCase() === sug.query.toLowerCase();
            return (
              <button
                key={sug.label}
                onClick={() => handleSuggestionClick(sug.query)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                  isActive
                    ? "bg-amber-600 text-white shadow-amber-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-slate-700"
                }`}
              >
                {isActive && <Check className="w-3 h-3 text-white" />}
                <span>{isEng ? sug.label : sug.labelSw}</span>
                {sug.type && !isActive && (
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-tighter">
                    {sug.type}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Search Filter Notice Banner (if search query applied) ── */}
      {searchQuery.trim() && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-extrabold text-amber-700 dark:text-amber-400">
                {parsedSearch.displaySummary}
              </span>
              <span className="text-slate-500 dark:text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-300">
                {isEng
                  ? `Showing ${filteredRestaurants.length} matching eateries`
                  : `Inaonyesha migahawa ${filteredRestaurants.length} inayolingana`}
              </span>
            </div>

            <button
              onClick={handleClearSearch}
              className="px-3 py-1 bg-white dark:bg-slate-800 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
            >
              {isEng ? "Clear Search Filter" : "Ondoa Utafutaji"}
            </button>
          </div>
        </div>
      )}

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
              {isEng ? "Verified Eateries Matching Criteria" : "Migahawa Inayolingana na Vigezo"}
              <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded-full">
                {filteredRestaurants.length}
              </span>
            </h2>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
              {isEng ? "Sort By:" : "Panga Kwa:"}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            >
              <option value="cheapest">{t("cheapestFirst") || "Price: Low to High (TZS)"}</option>
              <option value="highest">{t("highestPrice") || "Price: High to Low (TZS)"}</option>
              <option value="hygiene">{t("sortByHygiene") || "Hygiene Score (Highest First)"}</option>
              <option value="rating">{t("sortByRating") || "Top Rated"}</option>
              <option value="distance">{t("distance") || "Distance"}</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Bar: Neighborhood & Category Chips */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 mb-8 shadow-sm flex flex-col gap-4">
          
          {/* Neighborhood Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              {isEng ? "Quick Neighborhoods:" : "Mitaa ya Arusha:"}
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
            <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {isEng ? "No eateries match your search criteria" : "Hakuna migahawa inayolingana na vigezo vyako"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {isEng
                ? "Try searching by a different restaurant name, food item (e.g. Pilau), budget threshold, or neighborhood (e.g. Njiro)."
                : "Jaribu kutafuta kwa jina lingine la mgahawa, chakula (mf. Pilau), kiwango cha bajeti, au mtaa (mf. Njiro)."}
            </p>
            <button
              onClick={() => {
                setSelectedNeighborhood("All");
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-5 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white text-xs font-bold rounded-xl hover:from-amber-500 hover:to-orange-400 transition-all shadow-md shadow-amber-500/20"
            >
              {isEng ? "Reset All Filters" : "Rejesha Vianzio Vyote"}
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

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider">Loading SafePlate Hub Multi-Criteria Directory...</p>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
