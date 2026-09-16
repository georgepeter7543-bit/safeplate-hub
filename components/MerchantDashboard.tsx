"use client";

import React, { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { useRestaurants } from '@/context/RestaurantContext';
import { useCurrency } from '@/context/CurrencyContext';
import { 
  LayoutDashboard, UtensilsCrossed, Package, BarChart3, 
  MessageSquare, Plus, Edit, Trash2, Check, X, 
  TrendingUp, DollarSign, Star, Users, Phone, MapPin, Sparkles
} from 'lucide-react';

export default function MerchantDashboard() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const { restaurants, addMenuItem, deleteMenuItem } = useRestaurants();
  const { formatPrice } = useCurrency();
  const isSw = locale === 'sw';
  const isEng = locale === 'eng';
  
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'analytics'>('menu');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(
    restaurants[0]?.id || ""
  );

  /* Add Item Form State */
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Grills");
  const [newItemDesc, setNewItemDesc] = useState("");

  const currentRestaurant =
    restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !currentRestaurant) return;

    addMenuItem(currentRestaurant.id, {
      name: newItemName,
      price: parseFloat(newItemPrice) || 3.5,
      category: newItemCategory,
      description: newItemDesc || "Freshly prepared local dish in Arusha.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
    });

    setNewItemName("");
    setNewItemPrice("");
    setNewItemDesc("");
    setIsAddingItem(false);
  };

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 transition-colors min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/30">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                {isSw ? "Dashibodi ya Mfanyabiashara" : "Seller Product & Control Panel"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isSw ? "Post na usimamie menyu yako ya chakula ya Arusha" : "Post new food items and manage live Arusha digital menus"}
              </p>
            </div>
          </div>

          {/* Restaurant Selector */}
          {restaurants.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{isEng ? "Active Eatery:" : "Mkahawa:"}</span>
              <select
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.neighborhood})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected Eatery Banner */}
        {currentRestaurant && (
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-6 mb-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {currentRestaurant.hygieneScore}% Hygiene Verified
                </span>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentRestaurant.neighborhood}, Arusha 🔒
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">{currentRestaurant.name}</h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call & Connect: {currentRestaurant.phone}</span>
              </p>
            </div>

            <button
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-3 rounded-2xl font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{isSw ? "Post Food Item Mpya" : "Post New Food Dish"}</span>
            </button>
          </div>
        )}

        {/* ── Post New Item Collapsible Form ── */}
        {isAddingItem && (
          <form onSubmit={handleCreateMenuItem} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl mb-8 animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-amber-500" />
              {isSw ? "Post Sahani Mpya kwenye Menyu" : "Post New Dish to Arusha Menu"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isSw ? "Jina la Chakula" : "Food Dish Name"} *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Special Nyama Choma & Chipsi"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isSw ? "Bei (USD $)" : "Price (USD $)"} *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  placeholder="e.g. 4.50"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isSw ? "Kategoria" : "Category"}
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                >
                  <option value="Grills">Nyama Choma / Grills</option>
                  <option value="Authentic Swahili">Authentic Swahili</option>
                  <option value="Ugali Dishes">Ugali Dishes</option>
                  <option value="Rice Dishes">Rice & Pilau</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Vegetarian">Vegetarian</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isSw ? "Maelezo ya Chakula" : "Dish Description"}
              </label>
              <textarea
                rows={2}
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                placeholder="e.g. Fresh local goat meat charcoal roasted with spicy kachumbari salsa..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                {isSw ? "Ghairi" : "Cancel"}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-amber-500/20"
              >
                {isSw ? "Hifadhi Chakula" : "Save & Post Dish Live"}
              </button>
            </div>
          </form>
        )}

        {/* ── Posted Menu Items Grid ── */}
        {currentRestaurant && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-amber-500" />
                <span>{isSw ? "Sahani Zilizowekwa Kwenye Menyu" : "Live Posted Menu Items"}</span>
                <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                  {currentRestaurant.menu.length}
                </span>
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentRestaurant.menu.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-center justify-between shadow-sm hover:border-amber-500/40 transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-200 dark:bg-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h5>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {item.category}
                    </p>
                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMenuItem(currentRestaurant.id, item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
