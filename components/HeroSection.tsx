"use client";

import React, { useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { Search, MapPin, Shield, CreditCard, BookOpen, ChevronRight, Sparkles, Lock } from 'lucide-react';

const NEIGHBORHOODS = ['Ngarenaro', 'Majengo', 'Clock Tower', 'Njiro'];

export default function HeroSection() {
  const { t, locale } = useLocale();
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
        <p className="text-lg sm:text-xl text-slate-300/90 max-w-2xl mb-10 leading-relaxed animate-slide-in-up delay-100">
          {isEng
            ? 'Connect with neighborhood eateries in Ngarenaro, Majengo, Clock Tower & Njiro — all verified through our 4-step hygiene framework.'
            : 'Ungana na migahawa ya mitaa Ngarenaro, Majengo, Mnara wa Saa na Njiro — yote yaliyothibitishwa kupitia mfumo wetu wa hatua 4 wa usafi.'}
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-3xl bg-white p-1.5 rounded-2xl sm:rounded-full shadow-2xl shadow-black/40 mb-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-0 animate-slide-in-up delay-200">
          <div className="flex-1 flex items-center px-4 py-3">
            <MapPin className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('searchPlaceholder') || 'Search Arusha eateries, e.g. Nyama Choma, Njiro...'}
              className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-base font-medium"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white px-7 py-3.5 rounded-xl sm:rounded-full font-bold transition-all shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98]">
            <Search className="w-4 h-4" />
            <span>{isEng ? 'Search' : 'Tafuta'}</span>
          </button>
        </div>

        {/* Neighborhood Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in delay-300">
          {NEIGHBORHOODS.map((n) => (
            <button
              key={n}
              className="px-4 py-2 rounded-full bg-white/8 hover:bg-white/15 border border-white/15 hover:border-amber-400/50 text-white/90 text-sm font-semibold transition-all backdrop-blur-sm hover:text-amber-300"
            >
              <MapPin className="w-3 h-3 inline-block mr-1.5 -mt-0.5 text-amber-400" />
              {n}
            </button>
          ))}
          <button className="px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5" />
            {isEng ? 'All Districts' : 'Mitaa Yote'}
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
