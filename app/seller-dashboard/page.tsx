"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useRestaurants } from "@/context/RestaurantContext";
import {
  Store, UtensilsCrossed, Plus, Trash2, DollarSign,
  MapPin, Phone, User, ShieldCheck, LogOut, ArrowUpDown,
  Tag, Clock, CheckCircle, RefreshCw, Edit3, Image as ImageIcon,
  Sparkles, X, Check, MessageSquare, Star, ExternalLink, Award
} from "lucide-react";
import { PLATFORM_BRANDING } from "@/lib/budgetFilter";
import InstagramIcon from "@/components/InstagramIcon";

/* ── Fallback Dish Thumbnail Component ── */
function DishThumbnail({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center shrink-0">
        <UtensilsCrossed className="w-6 h-6 text-amber-600/80 dark:text-amber-400/80" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className="w-16 h-16 rounded-xl object-cover bg-slate-200 dark:bg-slate-700 shrink-0 shadow-sm"
    />
  );
}

/* ── Popular Arusha Neighborhood Presets ── */
const ARUSHA_NEIGHBORHOODS = [
  "Ngarenaro",
  "Majengo",
  "Njiro",
  "Sekei",
  "Clock Tower",
  "Sanawari",
  "Sakina",
  "Moshono",
];

/* ── Arusha Food Image & Dish Presets ── */
const ARUSHA_FOOD_PRESETS = [
  {
    name: "Nyama Choma Kilo 1",
    priceTZS: "12000",
    category: "Grills",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    label: "🥩 Nyama Choma",
    isChefSpecial: true,
  },
  {
    name: "Pilau ya Nyama na Kachumbari",
    priceTZS: "6000",
    category: "Local Rice",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    label: "🍚 Pilau ya Arusha",
    isChefSpecial: true,
  },
  {
    name: "Chips Mayai (Zege)",
    priceTZS: "4000",
    category: "Authentic Swahili",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
    label: "🍳 Chips Mayai",
    isChefSpecial: false,
  },
  {
    name: "Samaki Kaanga na Ugali",
    priceTZS: "10000",
    category: "Seafood",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    label: "🐟 Samaki Kaanga",
    isChefSpecial: true,
  },
  {
    name: "Mishkaki ya Ng'ombe (3 Skewers)",
    priceTZS: "4500",
    category: "Grills",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    label: "🍢 Mishkaki BBQ",
    isChefSpecial: false,
  },
];

export default function SellerDashboard() {
  /* ── 1. ALL REACT HOOKS UNCONDITIONALLY AT THE TOP LEVEL ── */
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { locale } = useLocale();
  const { currency, toggleCurrency, formatPrice } = useCurrency();
  const { restaurants, addMenuItem, deleteMenuItem, updateRestaurantDetails } = useRestaurants();
  const isEng = locale === "eng";

  /* Find or associate current restaurant */
  const ownerRestaurant = useMemo(() => {
    if (!user) return null;
    return (
      restaurants.find(
        (r) =>
          (user.businessName && r.name.toLowerCase() === user.businessName.toLowerCase()) ||
          (user.phone && r.phone === user.phone) ||
          r.name.toLowerCase().includes(user.name.toLowerCase())
      ) || restaurants[0]
    );
  }, [restaurants, user]);

  /* Form State for New Food Item */
  const [foodName, setFoodName] = useState("");
  const [foodPriceTZS, setFoodPriceTZS] = useState("");
  const [foodImageUrl, setFoodImageUrl] = useState("");
  const [category, setCategory] = useState("Grills");
  const [description, setDescription] = useState("");
  const [isChefSpecial, setIsChefSpecial] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  /* Profile & Location Edit State */
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editBusinessName, setEditBusinessName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editWhatsApp, setEditWhatsApp] = useState("");
  const [profileSuccessNotice, setProfileSuccessNotice] = useState(false);

  /* Menu Sorting State */
  const [sortBy, setSortBy] = useState<"cheapest" | "highest" | "name" | "newest">("cheapest");

  /* Sorted Menu Items — Hook declared unconditionally at top level */
  const sortedMenuItems = useMemo(() => {
    if (!ownerRestaurant || !ownerRestaurant.menu) return [];
    const items = [...ownerRestaurant.menu];

    switch (sortBy) {
      case "cheapest":
        return items.sort((a, b) => a.price - b.price);
      case "highest":
        return items.sort((a, b) => b.price - a.price);
      case "name":
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
      default:
        return items.reverse();
    }
  }, [ownerRestaurant, sortBy]);

  /* Sync initial profile form inputs from user / restaurant */
  useEffect(() => {
    if (user) {
      setEditBusinessName(user.businessName || (ownerRestaurant ? ownerRestaurant.name : ""));
      setEditLocation(user.neighborhood || (ownerRestaurant ? ownerRestaurant.neighborhood : ""));
      setEditPhone(user.phone || (ownerRestaurant ? ownerRestaurant.phone : ""));
      setEditWhatsApp(user.whatsapp || (ownerRestaurant ? ownerRestaurant.whatsapp : user.phone || ""));
    }
  }, [user, ownerRestaurant]);

  /* USD rate: 1 USD ≈ 2,650 TZS */
  const USD_RATE = 2650;

  /* Handle Profile, Location & WhatsApp Save */
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = editBusinessName.trim();
    const trimmedLoc = editLocation.trim();
    const trimmedPhone = editPhone.trim();
    const trimmedWhatsApp = editWhatsApp.trim();

    updateProfile({
      businessName: trimmedName || user?.businessName,
      neighborhood: trimmedLoc || user?.neighborhood,
      phone: trimmedPhone || user?.phone,
      whatsapp: trimmedWhatsApp || user?.whatsapp,
    });

    if (ownerRestaurant) {
      updateRestaurantDetails(ownerRestaurant.id, {
        name: trimmedName || ownerRestaurant.name,
        neighborhood: trimmedLoc || ownerRestaurant.neighborhood,
        phone: trimmedPhone || ownerRestaurant.phone,
        whatsapp: trimmedWhatsApp || ownerRestaurant.whatsapp,
      });
    }

    setIsEditingProfile(false);
    setProfileSuccessNotice(true);
    setTimeout(() => setProfileSuccessNotice(false), 3500);
  };

  /* Handle Food Item Posting */
  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || !foodPriceTZS.trim() || !ownerRestaurant) return;

    setIsSubmitting(true);
    const priceTZSNumber = parseFloat(foodPriceTZS) || 0;
    const priceInUSD = priceTZSNumber / USD_RATE;

    addMenuItem(ownerRestaurant.id, {
      name: foodName.trim(),
      price: parseFloat(priceInUSD.toFixed(2)),
      category: category,
      categorySw: category === "Grills" ? "Nyama Choma" : category,
      description: description.trim() || "Freshly cooked local dish in Arusha.",
      image: foodImageUrl.trim() || undefined,
      isChefSpecial: isChefSpecial,
    });

    setFoodName("");
    setFoodPriceTZS("");
    setFoodImageUrl("");
    setDescription("");
    setIsChefSpecial(false);
    setIsSubmitting(false);
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 3000);
  };

  /* Select Arusha Preset Dish */
  const handleSelectPreset = (preset: typeof ARUSHA_FOOD_PRESETS[0]) => {
    setFoodImageUrl(preset.image);
    if (!foodName.trim()) {
      setFoodName(preset.name);
    }
    if (!foodPriceTZS.trim()) {
      setFoodPriceTZS(preset.priceTZS);
    }
    setCategory(preset.category);
    if (preset.isChefSpecial !== undefined) {
      setIsChefSpecial(preset.isChefSpecial);
    }
  };

  /* Helper to format WhatsApp URL for testing */
  const rawWhatsApp = user?.whatsapp || ownerRestaurant?.whatsapp || user?.phone || "+255754112233";
  const cleanWhatsAppNumber = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsAppNumber.startsWith("0")
    ? "255" + cleanWhatsAppNumber.slice(1)
    : cleanWhatsAppNumber.startsWith("255")
    ? cleanWhatsAppNumber
    : "255" + cleanWhatsAppNumber;

  const testWhatsAppOrderUrl = `https://wa.me/${formattedWhatsApp}?text=${encodeURIComponent(
    isEng
      ? `Hello! I would like to order food from ${user?.businessName || ownerRestaurant?.name || "your restaurant"} via SafePlate Hub.`
      : `Habari! Ningependa kuagiza chakula kutoka ${user?.businessName || ownerRestaurant?.name || "mgahawa wako"} kupitia SafePlate Hub.`
  )}`;

  /* ── 2. ACCESS GUARD EXECUTED STRICTLY AFTER ALL HOOKS ── */
  if (!isAuthenticated || user?.role !== "merchant") {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-red-200 dark:border-red-900/30 text-center shadow-xl">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            {isEng ? "Restaurant Owner Access Required" : "Inahitaji Akaunti ya Mmiliki wa Mgahawa"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            {isEng
              ? "This dashboard is exclusively isolated for registered restaurant owners to manage menus and prices. Diners must browse via the public directory."
              : "Dashibodi hii imetengwa kwa wamiliki wa migahawa pekee ili kusimamia menyu na bei. Walaji wanatumia orodha ya kawaida."}
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs transition-all shadow-md"
          >
            {isEng ? "Return to Public SafePlate" : "Rudi Nyumbani"}
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">

      {/* ── Seller Dashboard Top Banner ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {isEng ? "Verified Restaurant Owner" : "Mmiliki Aliyethibitishwa"}
                </span>
                <span className="text-xs text-amber-500 font-bold">Arusha, TZ 🔒</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {user.businessName || (ownerRestaurant ? ownerRestaurant.name : "Seller Control Panel")}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <User className="w-3 h-3" />
                <span>{isEng ? "Owner:" : "Mmiliki:"} {user.name}</span>
                <span>•</span>
                <Phone className="w-3 h-3" />
                <span>{user.phone || (ownerRestaurant ? ownerRestaurant.phone : "+255 7XX XXX XXX")}</span>
                <span>•</span>
                <MessageSquare className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">WhatsApp: {user.whatsapp || (ownerRestaurant ? ownerRestaurant.whatsapp : user.phone || "+255 7XX XXX XXX")}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Toggle */}
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 transition-all text-xs font-bold text-amber-700 dark:text-amber-400"
            >
              <DollarSign className="w-4 h-4" />
              <span>{currency === "TZS" ? "TZS Shs" : "USD $"}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              title={isEng ? "Sign Out" : "Ondoka"}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{isEng ? "Sign Out" : "Ondoka"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Municipal Health Verification Transparency Banner ── */}
        <div className="bg-gradient-to-r from-emerald-900/20 via-emerald-800/10 to-teal-900/20 border border-emerald-500/30 rounded-3xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    {isEng ? "Official Hygiene Certification" : "Uthibitisho Rasmi wa Usafi"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                    {ownerRestaurant?.hygieneScore || 95}% {isEng ? "Hygiene Score" : "Kiwango cha Usafi"}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {isEng ? "Arusha Municipal Council Sanitation Verified" : "Imethibitishwa na Halmashauri ya Jiji la Arusha"}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {isEng
                    ? "Your physical kitchen inspection has passed municipal health standards. Diners see this verification badge on your public listing."
                    : "Ukaguzi wa jiko lako umekidhi viwango vya afya vya manispaa. Walaji wanaona beji hii ya uthibitisho kwenye ukurasa wako."}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{isEng ? "Status: Active & Approved" : "Hali: Imeidhinishwa"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Official Platform Admin Support & Technical Hotline ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0 shadow-md">
                <InstagramIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-pink-400">
                    {isEng ? "Platform Administration & Technical Support" : "Usaidizi wa Kiufundi na Wasimamizi"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
                    24/7 Available
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {isEng ? "SafePlate Hub Admin: Trustcore_web" : "Msimamizi wa SafePlate Hub: Trustcore_web"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEng
                    ? "Need menu modifications, hygiene audit renewals, or seller support? Chat directly with platform admin on WhatsApp or Instagram."
                    : "Unahitaji msaada wa menyu, ukaguzi wa usafi, au usaidizi wa kiufundi? Wasiliana moja kwa moja na msimamizi kupitia WhatsApp au Instagram."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* WhatsApp Admin button */}
              <a
                href={PLATFORM_BRANDING.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-600/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp: {PLATFORM_BRANDING.whatsappNumber}</span>
              </a>

              {/* Instagram button */}
              <a
                href={PLATFORM_BRANDING.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs transition-all shadow-md"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>@{PLATFORM_BRANDING.instagramHandle}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Restaurant Profile, Location & WhatsApp Management Card ── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-500" />
                {isEng ? "Restaurant Profile, Location & Direct Ordering" : "Profaili ya Mgahawa, Mahali na Namba ya WhatsApp"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEng
                  ? "Configure your manual neighborhood, phone number, and dedicated WhatsApp order line. Changes sync instantly."
                  : "Weka mtaa wako, namba ya simu, na namba ya WhatsApp kwa ajili ya wateja kuagiza chakula moja kwa moja."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                <span>{isEditingProfile ? (isEng ? "Cancel" : "Acha") : (isEng ? "Edit Details" : "Badili Taarifa")}</span>
              </button>
            </div>
          </div>

          {/* Profile Success Notice */}
          {profileSuccessNotice && (
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{isEng ? "Restaurant location, phone & WhatsApp order line successfully updated and saved!" : "Taarifa za mgahawa, simu na WhatsApp zimehifadhiwa kwa mafanikio!"}</span>
            </div>
          )}

          {/* Editable Form Mode */}
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Business Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isEng ? "Restaurant / Business Name" : "Jina la Mgahawa"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editBusinessName}
                    onChange={(e) => setEditBusinessName(e.target.value)}
                    placeholder="e.g. Mama Zawadi's Kitchen"
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                {/* Manual Neighborhood / Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isEng ? "Arusha Neighborhood / Location" : "Mtaa / Mahali (Arusha)"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Ngarenaro, Majengo, Njiro"
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                {/* Direct Call Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isEng ? "Call & Connect Phone" : "Simu ya Direct"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+255 754 XXX XXX"
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                {/* Dedicated WhatsApp Phone Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {isEng ? "WhatsApp Order Number" : "Namba ya WhatsApp"} *
                    </label>
                    {editPhone && (
                      <button
                        type="button"
                        onClick={() => setEditWhatsApp(editPhone)}
                        className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-bold"
                      >
                        {isEng ? "Use Call Phone" : "Tumia ya Simu"}
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={editWhatsApp}
                    onChange={(e) => setEditWhatsApp(e.target.value)}
                    placeholder="+255 7XX XXX XXX"
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {isEng ? "Powers 1-tap WhatsApp direct orders for diners." : "Inatumika kwa wateja kuagiza kwa WhatsApp."}
                  </p>
                </div>
              </div>

              {/* Quick Neighborhood Chips */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
                  {isEng ? "Quick Arusha Neighborhoods:" : "Chagua Mtaa Haraka:"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ARUSHA_NEIGHBORHOODS.map((hood) => (
                    <button
                      key={hood}
                      type="button"
                      onClick={() => setEditLocation(`${hood}, Arusha`)}
                      className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-400 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {hood}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {isEng ? "Cancel" : "Ghairi"}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEng ? "Save Details" : "Hifadhi Taarifa"}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Static Display Mode */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs font-medium">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 text-[10px] font-bold uppercase">{isEng ? "Neighborhood / Location" : "Mtaa / Mahali"}</p>
                <p className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate">{user.neighborhood || ownerRestaurant?.neighborhood || "Ngarenaro, Arusha"}</span>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 text-[10px] font-bold uppercase">{isEng ? "Direct Customer Line" : "Simu ya Wateja"}</p>
                <p className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-1.5 mt-1">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{user.phone || ownerRestaurant?.phone || "+255 754 000 111"}</span>
                </p>
              </div>

              {/* Dedicated WhatsApp Card with Live Direct Test Link */}
              <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/40">
                <p className="text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase flex items-center justify-between">
                  <span>{isEng ? "WhatsApp Direct Order Line" : "Namba ya WhatsApp"}</span>
                  <a
                    href={testWhatsAppOrderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-extrabold"
                    title={isEng ? "Test WhatsApp order link" : "Jaribu kiunganishi cha WhatsApp"}
                  >
                    <span>{isEng ? "Test" : "Jaribu"}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </p>
                <p className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mt-1">
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 fill-current" />
                  <span>{user.whatsapp || ownerRestaurant?.whatsapp || user.phone || "+255 754 112 233"}</span>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 text-[10px] font-bold uppercase">{isEng ? "Active Menu Dishes" : "Vyakula Kwenye Menyu"}</p>
                <p className="font-extrabold text-sm text-amber-500 flex items-center gap-1.5 mt-1">
                  <UtensilsCrossed className="w-4 h-4 shrink-0" />
                  <span>{ownerRestaurant?.menu.length || 0} {isEng ? "dishes listed" : "sahani zilizopo"}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Post New Food Item Section ── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                {isEng ? "Post New Food Item & Price" : "Weka Chakula Kipya na Bei"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEng
                  ? "Add food names, prices in Tanzanian Shillings (TZS), dish images, and feature as Chef's Special."
                  : "Weka jina la chakula, bei kwa TZS, picha na weka alama ya Chakula Maalum cha Mpishi."}
              </p>
            </div>
          </div>

          {/* Preset Quick Food Selection */}
          <div className="mb-5 p-3.5 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 dark:border-amber-900/30">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-extrabold text-amber-800 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isEng ? "Quick Preset Dishes & Images:" : "Mifano ya Vyakula na Picha (Arusha):"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ARUSHA_FOOD_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100/50 dark:hover:bg-amber-900/40 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>{preset.label}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold">({parseInt(preset.priceTZS).toLocaleString()} TZS)</span>
                </button>
              ))}
            </div>
          </div>

          {successNotice && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{isEng ? "Food item posted successfully and added to your menu!" : "Chakula kimeongezwa kwenye menyu kwa mafanikio!"}</span>
            </div>
          )}

          <form onSubmit={handleAddFood} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Food Name */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isEng ? "Food Name" : "Jina la Chakula"} *
                </label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder={isEng ? "e.g. Nyama Choma Kilo 1" : "mfano: Nyama Choma Kilo 1"}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              {/* Price in TZS */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isEng ? "Price in TZS (Tanzanian Shillings)" : "Bei ya TZS"} *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">
                    TSh
                  </span>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    value={foodPriceTZS}
                    onChange={(e) => setFoodPriceTZS(e.target.value)}
                    placeholder="e.g. 8000"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                {foodPriceTZS && (
                  <p className="text-[10px] text-slate-400 font-bold mt-1">
                    ≈ ${(parseFloat(foodPriceTZS) / USD_RATE).toFixed(2)} USD
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isEng ? "Category" : "Aina ya Chakula"}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                >
                  <option value="Grills">Nyama Choma / Grills</option>
                  <option value="Authentic Swahili">Authentic Swahili</option>
                  <option value="Local Rice">Pilau & Rice</option>
                  <option value="Ugali Dishes">Ugali Special</option>
                  <option value="Seafood">Samaki / Seafood</option>
                  <option value="Vegetarian">Mboga / Vegetarian</option>
                </select>
              </div>
            </div>

            {/* Food Image URL & Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    {isEng ? "Menu Dish Image URL (Optional)" : "Picha ya Chakula (URL)"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {isEng ? "Paste URL or select preset above" : "Weka kiunganishi au chagua hapo juu"}
                  </span>
                </label>
                <input
                  type="url"
                  value={foodImageUrl}
                  onChange={(e) => setFoodImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {isEng ? "Preview" : "Mwonekano"}
                </label>
                <div className="flex items-center gap-2">
                  <DishThumbnail src={foodImageUrl} alt="Food Preview" />
                  {foodImageUrl && (
                    <button
                      type="button"
                      onClick={() => setFoodImageUrl("")}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={isEng ? "Clear image" : "Ondoa picha"}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Chef's Special Toggle */}
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${isChefSpecial ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                <div>
                  <label htmlFor="chefSpecialCheckbox" className="text-xs font-extrabold text-slate-800 dark:text-white cursor-pointer">
                    {isEng ? "Mark as Chef's Special" : "Weka kama Chakula Maalum cha Mpishi"}
                  </label>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isEng ? "Badges this dish prominently as a house recommendation on the public directory." : "Huonyesha beji maalum ya kupendekezwa kwenye menyu ya umma."}
                  </p>
                </div>
              </div>
              <input
                id="chefSpecialCheckbox"
                type="checkbox"
                checked={isChefSpecial}
                onChange={(e) => setIsChefSpecial(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isEng ? "Dish Description & Ingredients" : "Maelezo ya Chakula"}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isEng ? "e.g. Served hot with kachumbari, pili pili, and freshly roasted bananas..." : "mfano: Kinaandaliwa moto na kachumbari, ndizi choma na pilipili..."}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 text-xs disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {isSubmitting
                  ? isEng ? "Posting..." : "Inaweka..."
                  : isEng ? "Post Food to Menu" : "Weka Chakula Kwenye Menyu"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Active Menu with Live Price Sorting & Conversion ── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-amber-500" />
                {isEng ? "Active Menu Items" : "Menyu Yako ya Sasa"}
                <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-extrabold px-2.5 py-0.5 rounded-full">
                  {sortedMenuItems.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEng
                  ? "Manage prices, sort by cheapest/highest, view converted currency rates, and review Chef's Specials."
                  : "Simamia bei, panga kwa bei nafuu/juu, na tazama vyakula maalum vya mpishi."}
              </p>
            </div>

            {/* Price Sorting Controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
                {isEng ? "Sort:" : "Panga:"}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="cheapest">{isEng ? "Price: Cheapest First (Low → High)" : "Bei: Nafuu Kwanza"}</option>
                <option value="highest">{isEng ? "Price: Highest First (High → Low)" : "Bei: Juu Kwanza"}</option>
                <option value="name">{isEng ? "Dish Name (A → Z)" : "Jina (A → Z)"}</option>
                <option value="newest">{isEng ? "Recently Added" : "Hivi Karibuni"}</option>
              </select>
            </div>
          </div>

          {sortedMenuItems.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <UtensilsCrossed className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                {isEng ? "No food items posted yet. Add your first dish above!" : "Hakuna chakula kilichoorodheshwa bado. Ongeza hapo juu!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 flex gap-3.5 items-center justify-between transition-all hover:border-amber-500/40 shadow-sm"
                >
                  <DishThumbnail src={item.image} alt={item.name} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      {(item.isChefSpecial || item.popular) && (
                        <span className="text-[9px] font-black text-amber-700 dark:text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-500" />
                          <span>{isEng ? "Chef's Special" : "Maalum ya Mpishi"}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate mt-1">
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        (TSh {Math.round(item.price * USD_RATE).toLocaleString()})
                      </span>
                    </div>
                  </div>

                  {ownerRestaurant && (
                    <button
                      onClick={() => deleteMenuItem(ownerRestaurant.id, item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                      title={isEng ? "Delete Dish" : "Futa Chakula"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

