"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { mockRestaurants } from "@/lib/mockData";
import { 
  ShieldCheck, Compass, Store, MessageSquare, MapPin, Lock, 
  CheckCircle, ArrowRight, Star, Flame, Award, HeartHandshake, Phone 
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import RelocationGuides from "@/components/RelocationGuides";

export default function Home() {
  const { locale } = useLocale();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isEng = locale === "eng";

  /* Strict Owner Isolation: Redirect sellers away from public diner home */
  React.useEffect(() => {
    if (isAuthenticated && user?.role === "merchant") {
      router.replace("/seller-dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated && user?.role === "merchant") {
    return null;
  }

  /* Featured Arusha spots */
  const featuredSpots = mockRestaurants.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* ── Arusha Lock Banner ── */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">SafePlate Hub</span>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Arusha, Tanzania</span>
              <Lock className="w-3 h-3" />
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">
              {isEng
                ? "Ngarenaro · Majengo · Clock Tower · Njiro"
                : "Ngarenaro · Majengo · Mnara wa Saa · Njiro"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <span>{isEng ? "Explore All Spots" : "Tazama Migahawa Yote"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <HeroSection />

      {/* ── Quick Navigation Portal Cards ── */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isEng ? "Explore SafePlate Hub Arusha" : "Gundua SafePlate Hub Arusha"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl mx-auto">
              {isEng
                ? "Connect directly with verified local culinary spots across Ngarenaro, Majengo, Clock Tower, and Njiro."
                : "Unganishwa moja kwa moja na migahawa iliyothibitishwa kote Ngarenaro, Majengo, Mnara wa Saa na Njiro."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Explore Eateries */}
            <Link
              href="/explore"
              className="group bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-amber-500 transition-colors flex items-center justify-between">
                  <span>{isEng ? "Map & Directory Explorer" : "Ramani na Orodha ya Migahawa"}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEng
                    ? "Interactive Arusha map, real-time neighborhood search (Ngarenaro, Majengo, Clock Tower, Njiro), and price sorting."
                    : "Ramani ya Arusha, utafutaji wa mitaa ya Ngarenaro, Majengo, Mnara wa Saa na Njiro, pamoja na kupanga bei."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center text-xs font-bold text-amber-500">
                <span>{isEng ? "Launch Explorer" : "Fungua Ramani"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Register Place */}
            <Link
              href="/register-place"
              className="group bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors flex items-center justify-between">
                  <span>{isEng ? "Register Eatery Place" : "Sajili Mkahawa Wako"}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEng
                    ? "For Arusha restaurant owners: submit credentials, get physical hygiene audit badge, and showcase digital menus."
                    : "Kwa wamiliki wa migahawa ya Arusha: sajili maelezo, pata nishani ya usafi na uweke menyu za simu."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center text-xs font-bold text-emerald-500">
                <span>{isEng ? "Owner Onboarding Portal" : "Lango la Wamiliki"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Community Reviews */}
            <Link
              href="/reviews"
              className="group bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors flex items-center justify-between">
                  <span>{isEng ? "Community Reviews" : "Mapitio ya Usafi"}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEng
                    ? "Authentic diner feedback, star ratings, and photo evidence reports from verified Arusha food lovers."
                    : "Maoni ya kweli ya walaji, rating za nyota na picha za usafi kutoka kwa walaji wa Arusha."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center text-xs font-bold text-blue-500">
                <span>{isEng ? "Read & Submit Reviews" : "Soma Mapitio"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── 4-Step Hygiene Verification Audit Trust Banner ── */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4" />
              {isEng ? "The 4-Pillar Hygiene Standard" : "Viwango 4 vya Usafi"}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              {isEng ? "How SafePlate Verifies Arusha Eateries" : "Jinsi SafePlate Inavyothibitisha Migahawa"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {isEng
                ? "Every listed spot must pass 4 mandatory physical audits before earning the Arusha Verified Hygiene Seal."
                : "Kila mgahawa ni lazima upite ukaguzi 4 wa usafi kabla ya kupata Muhuri wa Uthibitisho wa Arusha."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-colors">
              <div>
                <span className="text-2xl font-black text-amber-500/30 mb-2 block">01</span>
                <h4 className="font-extrabold text-base text-white mb-1">
                  {isEng ? "Kitchen Sanitation Audit" : "Ukaguzi wa Usafi wa Jiko"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isEng
                    ? "Stainless steel surfaces, food separation, rodent inspection, and oil recycling protocols."
                    : "Usafi wa nyuso za jiko, kutenganisha vyakula, na ukaguzi wa wadudu."}
                </p>
              </div>
              <div className="mt-4 flex items-center text-[11px] font-bold text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                {isEng ? "Physical Inspection" : "Ukaguzi wa Kimwili"}
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-colors">
              <div>
                <span className="text-2xl font-black text-amber-500/30 mb-2 block">02</span>
                <h4 className="font-extrabold text-base text-white mb-1">
                  {isEng ? "Clean Water Source" : "Chanzo cha Maji Salama"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isEng
                    ? "Arusha municipal water line verification, bacterial testing, and clean handwashing stations."
                    : "Maji safi ya mji ya Arusha, vipimo vya bakteria, na vituo vya kunawa mikono."}
                </p>
              </div>
              <div className="mt-4 flex items-center text-[11px] font-bold text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                {isEng ? "Bacterial Tested" : "Maji Yaliyopimwa"}
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-colors">
              <div>
                <span className="text-2xl font-black text-amber-500/30 mb-2 block">03</span>
                <h4 className="font-extrabold text-base text-white mb-1">
                  {isEng ? "Staff Health License" : "Leseni za Afya ya Wafanyakazi"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isEng
                    ? "Mandatory municipal health certificates for all chefs, cooks, and food handlers."
                    : "Vyeti halali vya afya vya serikali kwa mpishi na wahudumu wote wa chakula."}
                </p>
              </div>
              <div className="mt-4 flex items-center text-[11px] font-bold text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                {isEng ? "Verified Licenced" : "Vyeti Vilivyohakikiwa"}
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-colors">
              <div>
                <span className="text-2xl font-black text-amber-500/30 mb-2 block">04</span>
                <h4 className="font-extrabold text-base text-white mb-1">
                  {isEng ? "Storage & Freshness" : "Hifadhi ya Chakula Safi"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isEng
                    ? "First-in First-out labeling, working refrigeration units, and fresh daily meat sourcing."
                    : "Friji zinazofanya kazi vizuri na nyama mpya ya kila siku ya mtaani."}
                </p>
              </div>
              <div className="mt-4 flex items-center text-[11px] font-bold text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                {isEng ? "Fresh Meat Sourced" : "Chakula Kipya Kila Siku"}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Featured Arusha Spots Preview ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block mb-1">
              {isEng ? "Verified Arusha Listings" : "Orodha Iliyothibitishwa Arusha"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isEng ? "Featured Local Eateries" : "Migahawa Iliyoangaziwa"}
            </h2>
          </div>
          <Link
            href="/explore"
            className="flex items-center gap-1.5 text-xs font-extrabold text-amber-500 hover:text-amber-600 transition-colors"
          >
            <span>{isEng ? "Explore All Eateries & Map" : "Tazama Yote na Ramani"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSpots.map((spot) => (
            <div
              key={spot.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                  {spot.hygieneScore}% Hygiene
                </div>
                <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1 drop-shadow">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {spot.neighborhood}, Arusha
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
                    {spot.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {isEng ? spot.description : spot.descriptionSw}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{spot.rating.toFixed(1)}</span>
                  </div>
                  <a
                    href={`tel:${spot.phone}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold shadow hover:bg-amber-600 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{isEng ? "Call & Connect" : "Piga Simu"}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Relocation Guide Banner ── */}
      <RelocationGuides />

    </main>
  );
}
