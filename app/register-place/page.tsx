"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { useRestaurants } from "@/context/RestaurantContext";
import { 
  Store, ShieldCheck, Upload, MapPin, Phone, CheckCircle, 
  Sparkles, ArrowRight, Building2, User, Lock, Award, MessageSquare 
} from "lucide-react";

export default function RegisterPlacePage() {
  const { locale } = useLocale();
  const { user, isAuthenticated, registerPlace } = useAuth();
  const { addRestaurant } = useRestaurants();
  const router = useRouter();
  const isEng = locale === "eng";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /* If already registered as merchant, redirect straight to Seller Dashboard */
  React.useEffect(() => {
    if (isAuthenticated && user?.role === "merchant" && !isSuccess) {
      router.replace("/seller-dashboard");
    }
  }, [isAuthenticated, user, router, isSuccess]);

  /* Form Fields */
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setIsSuccess(true);

    const locationText = selectedNeighborhood || "Ngarenaro, Arusha";
    const resolvedWhatsApp = whatsAppNumber || phoneNumber || "+255754000111";

    registerPlace({
      businessName: businessName || "Arusha Food Spot",
      ownerName: ownerName || "Local Merchant",
      email: email || "owner@arusha.tz",
      neighborhood: locationText,
      phone: phoneNumber || "+255754000111",
      whatsapp: resolvedWhatsApp,
    });

    addRestaurant({
      name: businessName || "Arusha Food Spot",
      ownerName: ownerName || "Local Merchant",
      neighborhood: locationText,
      phone: phoneNumber || "+255754000111",
      whatsapp: resolvedWhatsApp,
      email: email || "owner@arusha.tz",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Store className="w-4 h-4" />
            {isEng ? "Arusha Merchant Portal" : "Lango la Wafanyabiashara wa Arusha"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            {isEng ? "Register Your Food Place" : "Sajili Mkahawa Wako"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            {isEng
              ? "Join Arusha's verified food network. Type your specific location, get physical hygiene verification, and direct Call & Connect."
              : "Jiunge na mtandao wa chakula uliothibitishwa wa Arusha. Weka mtaa wako wa Arusha, pata uthibitisho na wateja wa direct."}
          </p>
        </div>

        {/* Success Card */}
        {isSuccess ? (
          <div className="bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 text-center shadow-xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              {isEng ? "Place Registered Successfully!" : "Mkahawa Wako Umesajiliwa!"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              {isEng
                ? `Congratulations ${ownerName || businessName}! Your eatery in ${selectedNeighborhood || "Arusha"} is now listed live on the SafePlate Hub directory and map.`
                : `Hongera ${ownerName || businessName}! Mkahawa wako wa ${selectedNeighborhood || "Arusha"} sasa umeorodheshwa live.`}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/seller-dashboard"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-6 py-3 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20"
              >
                <span>{isEng ? "Open Seller Dashboard & Manage Menu" : "Fungua Dashibodi ya Muuzaji"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-Step Onboarding Form */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>1</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">{isEng ? "Business Info" : "Maelezo ya Biashara"}</span>
              </div>
              <div className="h-0.5 flex-1 bg-slate-200 dark:bg-slate-800 mx-3" />
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>2</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">{isEng ? "Arusha Location & Phone" : "Mtaa na Simu"}</span>
              </div>
              <div className="h-0.5 flex-1 bg-slate-200 dark:bg-slate-800 mx-3" />
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>3</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">{isEng ? "Audit Verification" : "Uthibitisho"}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEng ? "Business / Restaurant Name" : "Jina la Mgahawa"} *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Unga Limited BBQ & Swahili Kitchen"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEng ? "Owner Full Name" : "Jina Kamili la Mmiliki"} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="e.g. Amina Khamis"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEng ? "Email Address" : "Barua Pepe"}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. owner@arushafood.tz"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-md"
                  >
                    {isEng ? "Continue to Location & Phone" : "Endelea na Mtaa na Simu"}
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  
                  {/* Free-Form Arusha Location Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEng ? "Arusha Specific Location / Neighborhood" : "Mtaa au Eneo la Arusha"} *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={selectedNeighborhood}
                        onChange={(e) => setSelectedNeighborhood(e.target.value)}
                        placeholder="e.g. Unga Limited, Sekei, Kisongo, Sakina, Njiro..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isEng ? "Type your exact neighborhood or street in Arusha." : "Weka mtaa au eneo lako halisi la Arusha."}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEng ? "Direct Call & Connect Phone Number" : "Namba ya Simu ya Direct"} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+255 754 000 111"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {isEng ? "WhatsApp Phone Number (Direct Orders)" : "Namba ya WhatsApp (Kuagiza Direct)"}
                      </label>
                      {phoneNumber && (
                        <button
                          type="button"
                          onClick={() => setWhatsAppNumber(phoneNumber)}
                          className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-bold"
                        >
                          {isEng ? "Same as Call" : "Sawa na ya Simu"}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input
                        type="tel"
                        value={whatsAppNumber}
                        onChange={(e) => setWhatsAppNumber(e.target.value)}
                        placeholder="+255 7XX XXX XXX"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800/60 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isEng ? "Powers one-tap WhatsApp food ordering on your public restaurant card." : "Inawezesha wateja kuagiza chakula kwa kubofya mara moja kwenye WhatsApp."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      {isEng ? "Back" : "Rudi"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-md"
                    >
                      {isEng ? "Continue to Verification" : "Endelea na Uthibitisho"}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isEng ? "Upload Health Certificate / License (Optional)" : "Pakia Leseni ya Biashara au Afya"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">PNG, JPG or PDF up to 10MB</p>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2 text-amber-500 font-extrabold mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isEng ? "Hygiene Verification Pledge" : "Ahadi ya Usafi"}</span>
                    </div>
                    <p className="text-[11px]">
                      {isEng
                        ? "By submitting, you agree to permit SafePlate Hub field inspectors to conduct periodic sanitation audits."
                        : "Kwa kuwasilisha, unakubali wakaguzi wa SafePlate Hub kufanya ukaguzi wa usafi wa mazingira."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="terms" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {isEng ? "I agree to SafePlate Hub hygiene standards & terms" : "Ninakubali vigezo na viwango vya usafi vya SafePlate Hub"}
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      {isEng ? "Back" : "Rudi"}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
                    >
                      {isLoading ? (isEng ? "Registering..." : "Inasajili...") : (isEng ? "Complete Registration & List Live" : "Sajili na Weka Live")}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        )}

      </div>
    </main>
  );
}
