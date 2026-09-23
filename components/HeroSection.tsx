"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { 
  Search, MapPin, Shield, CreditCard, BookOpen, 
  ChevronRight, Sparkles, Lock, Wallet, ArrowRight, X,
  Store, UtensilsCrossed
} from 'lucide-react';

const NEIGHBORHOODS = ['Ngarenaro', 'Majengo', 'Clock Tower', 'Njiro'];

const QUICK_SUGGESTIONS = [
  { label: "Pilau", query: "Pilau" },
  { label: "Nyama Choma", query: "Nyama Choma" },
  { label: "< 5,000 TZS", query: "5000" },
  { label: "5k – 10k TZS", query: "5000 - 10000" },
  { label: "Njiro", query: "Njiro" },
  { label: "Ngarenaro", query: "Ngarenaro" },
  { label: "Mama Zawadi", query: "Mama Zawadi" },
];

export default function HeroSection() {
  /* ── All Hooks Unconditionally at Top Level ── */
  const { t, locale } = useLocale();
  const router = useRouter();
  const isEng = locale === 'eng';

  const [mounted, setMounted] = useState(false);
  const [activeTrustIndex, setActiveTrustIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveTrustIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchValue.trim();
    if (query) {
      router.push(`/explore?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/explore');
    }
  };

  const handleQuickSuggestionClick = (presetQuery: string) => {
    router.push(`/explore?q=${encodeURIComponent(presetQuery)}`);
  };

  const trustBadges = [
    {
      icon: Shield,
      text: isEng ? 'Physical Hygiene Audits — 4-Step Framework' : 'Ukaguzi wa Usafi wa Kimwili — Hatua 4',
    },
    {
      icon: CreditCard,
      text: isEng ? 'Escrow-Protected Pre-Orders (M-Pesa / Tigo / Airtel)' : 'Agizo Salama la Mapema (Escrow)',
    },
    {
      icon: BookOpen,
      text: isEng ? 'Newcomer Food Guides for Arusha Neighborhoods' : 'Miongozo ya Chakula ya Mitaa ya Arusha',
    },
  ];

  if (!mounted) return null;

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 sm:px-8 lg:px-16 pt-20 pb-16">

      {/* ── Background Layers ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-slate-900 to-amber-950/50" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:28px_28px]" />
        {/* Amber glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[130px]" />
        {/* Top right accent */}
        <div className="absolute -top-20 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]" />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center">

        {/* Arusha-Locked Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-amber-500/25 backdrop-blur-md mb-7 shadow-lg shadow-amber-500/10 animate-fade-in">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
            {isEng ? 'Serving Arusha, Tanzania Only' : 'Inahudumia Arusha, Tanzania Pekee'}
          </span>
          <Lock className="w-3 h-3 text-amber-400" />
        </div>

        {/* Verified Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow animate-fade-in delay-100">
          <Shield className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-white/85">
            {isEng ? "Arusha's #1 Verified Food Marketplace" : "Soko #1 la Chakula Halisi la Arusha"}
          </span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        {/* H1 Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6 animate-slide-in-up">
          {isEng ? (
            <>
              Discover Hygienic,{' '}
              <span className="text-gradient-amber">Verified Eats</span>
              <br />
              Across{' '}
              <span className="text-gradient-amber">Arusha</span>
            </>
          ) : (
            <>
              Gundua Chakula Safi,{' '}
              <span className="text-gradient-amber">Kilichothibitishwa</span>
              <br />
              Kote{' '}
              <span className="text-gradient-amber">Arusha</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300/90 max-w-2xl mb-8 leading-relaxed animate-slide-in-up delay-100">
          {isEng
            ? 'Instantly find eateries by restaurant name, specific food dish, budget in TZS, or neighborhood location.'
            : 'Tafuta migahawa ya Arusha papo hapo kwa jina la mgahawa, chakula maalum, bajeti ya TZS, au mtaa wowote.'}
        </p>

        {/* ── Multi-Criteria Search Bar ── */}
        <form 
          onSubmit={handleSearchSubmit}
          className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl sm:rounded-full shadow-2xl shadow-black/40 mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 animate-slide-in-up delay-200"
        >
          <div className="flex-1 flex items-center px-4 py-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mr-3 shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                isEng 
                  ? "Search restaurant, food, budget (TZS), or location..." 
                  : "Tafuta mkahawa, chakula, bajeti (TZS), au mtaa..."
              }
              className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder:text-slate-400 text-sm sm:text-base font-medium"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => setSearchValue('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white px-7 py-3.5 rounded-xl sm:rounded-full font-bold transition-all shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] shrink-0 text-sm"
          >
            <Search className="w-4 h-4" />
            <span>{isEng ? 'Search' : 'Tafuta'}</span>
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 animate-fade-in delay-250">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {isEng ? "Quick Suggestions:" : "Mapendekezo:"}
          </span>
          {QUICK_SUGGESTIONS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleQuickSuggestionClick(preset.query)}
              className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 text-xs font-semibold transition-all backdrop-blur-sm shadow-xs"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Neighborhood Reference Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in delay-300">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <MapPin className="w-3 h-3 text-amber-500" />
            {isEng ? "Arusha Areas:" : "Mitaa ya Arusha:"}
          </span>
          {NEIGHBORHOODS.map((n) => (
            <button
              key={n}
              onClick={() => handleQuickSuggestionClick(n)}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 text-xs font-medium transition-all"
            >
              {n}
            </button>
          ))}
          <button 
            onClick={() => router.push('/explore')}
            className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all flex items-center gap-1"
          >
            <span>{isEng ? 'Explore All' : 'Gundua Yote'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Trust Badge Ticker */}
        <div
          className="w-full max-w-3xl relative overflow-hidden h-14 mb-12"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
        >
          <div className="absolute inset-0 flex justify-center items-center">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              const isActive = activeTrustIndex === idx;
              return (
                <div
                  key={idx}
                  className={`absolute transition-all duration-500 ease-in-out flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-800/90 backdrop-blur-md border border-slate-700/80 ${
                    isActive
                      ? 'opacity-100 translate-y-0 scale-100 z-10'
                      : 'opacity-0 translate-y-6 scale-95 z-0'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-white/90 font-medium text-sm">{badge.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-8 sm:gap-16 w-full max-w-2xl border-t border-white/10 pt-8 animate-fade-in delay-400">
          {[
            { value: '50+', label: isEng ? 'Arusha Eateries' : 'Migahawa ya Arusha' },
            { value: '4', label: isEng ? 'Neighborhoods Covered' : 'Mitaa Inayoshughulikiwa' },
            { value: '98%', label: isEng ? 'Hygiene Pass Rate' : 'Kiwango cha Usafi', highlight: true },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className={`text-3xl sm:text-4xl font-black mb-1 ${stat.highlight ? 'text-emerald-400' : 'text-white'}`}>
                {stat.value}
              </div>
              <div className="text-slate-400 text-xs sm:text-sm font-medium text-center leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
