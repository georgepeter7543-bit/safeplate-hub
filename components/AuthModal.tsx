"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { useRestaurants } from "@/context/RestaurantContext";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  MapPin,
  Phone,
  Upload,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Store,
  UserPlus,
  LogIn,
  History,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "create_account" | "register";
}

type AuthTab = "signin" | "create_account" | "register";
type RegisterStep = 1 | 2 | 3;

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = "signin",
}: AuthModalProps) {
  const { locale } = useLocale();
  const { user, login, registerPlace, savedAccounts, quickLogin, removeSavedAccount } = useAuth();
  const { addRestaurant } = useRestaurants();
  const router = useRouter();
  const isEng = locale === "eng";

  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);
  const [signInRole, setSignInRole] = useState<"diner" | "merchant">("diner");
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /* Sign-in fields */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Create Account fields (Diner) */
  const [fullName, setFullName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");

  /* Register Place fields (Seller) */
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  /* Reset on open */
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setRegisterStep(1);
      setIsSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  /* ── Handlers ── */
  const handleQuickLogin = (account: any) => {
    setIsLoading(true);
    setTimeout(() => {
      quickLogin(account);
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        if (account.role === "merchant") {
          router.push("/seller-dashboard");
        }
      }, 400);
    }, 300);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    setIsSuccess(true);
    const roleToUse = signInRole;
    login(
      roleToUse === "merchant" ? "owner@gmail.com" : "diner@gmail.com",
      roleToUse === "merchant" ? "Google Merchant" : "Google Diner",
      roleToUse
    );
    setTimeout(() => {
      onClose();
      if (roleToUse === "merchant") {
        router.push("/seller-dashboard");
      }
    }, 500);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    setIsSuccess(true);

    const isMerchantEmail =
      email.toLowerCase().includes("owner") ||
      email.toLowerCase().includes("seller") ||
      email.toLowerCase().includes("merchant");
    const roleToUse: "diner" | "merchant" = signInRole === "merchant" || isMerchantEmail ? "merchant" : "diner";

    login(
      email || (roleToUse === "merchant" ? "owner@arusha.tz" : "diner@arusha.tz"),
      email.split("@")[0] || (roleToUse === "merchant" ? "Restaurant Owner" : "Diner"),
      roleToUse
    );

    setTimeout(() => {
      onClose();
      if (roleToUse === "merchant") {
        router.push("/seller-dashboard");
      }
    }, 500);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsLoading(false);
    setIsSuccess(true);
    login(createEmail || "newdiner@arusha.tz", fullName || "New Diner", "diner");
    setTimeout(onClose, 500);
  };

  const handleRegisterSubmit = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setIsSuccess(true);

    const locationText = selectedNeighborhood || "Ngarenaro, Arusha";
    const resolvedWhatsApp = whatsAppNumber || phoneNumber || "+255754000111";

    /* Register place in AuthContext and add to dynamic RestaurantContext */
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

    setTimeout(() => {
      onClose();
      router.push("/seller-dashboard");
    }, 600);
  };

  const handleRegisterNext = () => {
    if (registerStep < 3) setRegisterStep((s) => (s + 1) as RegisterStep);
    else handleRegisterSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-amber-400">SafePlate Hub Arusha 🔒</span>
          </div>

          <h2 className="text-xl font-extrabold text-white">
            {activeTab === "signin"
              ? isEng ? "Sign In to Your Account" : "Ingia kwenye Akaunti Yako"
              : activeTab === "create_account"
              ? isEng ? "Create Diner Account" : "Tengeneza Akaunti ya Mlaaji"
              : isEng ? "Register Your Food Place" : "Sajili Mkahawa Wako"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEng
              ? "Verified local food, hygiene transparency, and direct Call & Connect."
              : "Chakula salama cha mtaani, usafi na mawasiliano ya direct."}
          </p>
        </div>

        {/* ── Mode Selection Tabs ── */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-3 px-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "signin"
                ? "bg-white dark:bg-slate-900 text-amber-500 border-b-2 border-amber-500"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            {isEng ? "Sign In" : "Ingia"}
          </button>

          <button
            onClick={() => setActiveTab("create_account")}
            className={`flex-1 py-3 px-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "create_account"
                ? "bg-white dark:bg-slate-900 text-amber-500 border-b-2 border-amber-500"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            {isEng ? "Create Account" : "Tengeneza Akaunti"}
          </button>

          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 px-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "register"
                ? "bg-white dark:bg-slate-900 text-amber-500 border-b-2 border-amber-500"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            {isEng ? "Register Place" : "Sajili Mkahawa"}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          
          {/* Success Message */}
          {isSuccess ? (
            <div className="py-8 text-center animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {isEng ? "Successfully Authenticated!" : "Imefanikiwa Kuingia!"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEng ? "Welcome to SafePlate Hub Arusha." : "Karibu kwenye SafePlate Hub Arusha."}
              </p>
            </div>
          ) : (
            <>
              {/* ── 1. SIGN IN TAB ── */}
              {activeTab === "signin" && (
                <div className="space-y-4">

                  {/* ── Saved Accounts / Quick Login Memory ── */}
                  {savedAccounts && savedAccounts.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 dark:text-white">
                          <History className="w-3.5 h-3.5 text-amber-500" />
                          <span>{isEng ? "Quick Login (Saved Accounts)" : "Ingia Haraka (Akaunti Zilizopo)"}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {savedAccounts.length} {isEng ? "saved" : "zilizopo"}
                        </span>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {savedAccounts.map((acc) => (
                          <div
                            key={acc.email}
                            className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all text-left shadow-sm group"
                          >
                            <button
                              type="button"
                              onClick={() => handleQuickLogin(acc)}
                              className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                            >
                              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
                                {acc.role === "merchant" ? <Store className="w-4 h-4" /> : <User className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                                    {acc.businessName || acc.name}
                                  </p>
                                  <span
                                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase shrink-0 ${
                                      acc.role === "merchant"
                                        ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                                        : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                                    }`}
                                  >
                                    {acc.role === "merchant" ? "Owner" : "Diner"}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                  {acc.neighborhood ? `${acc.neighborhood} • ` : ""}{acc.email}
                                </p>
                              </div>
                            </button>

                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              <button
                                type="button"
                                onClick={() => handleQuickLogin(acc)}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[10px] rounded-lg transition-all shadow-sm flex items-center gap-1"
                              >
                                <span>{isEng ? "Resume" : "Ingia"}</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSavedAccount(acc.email);
                                }}
                                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                title={isEng ? "Forget Account" : "Ondoa"}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Account Type Selector for Sign In */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                      {isEng ? "Select Account Role" : "Chagua Aina ya Akaunti"}
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setSignInRole("diner")}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          signInRole === "diner"
                            ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/60 dark:border-slate-700"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>{isEng ? "Customer (Diner)" : "Mteja (Mlaaji)"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignInRole("merchant")}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          signInRole === "merchant"
                            ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/60 dark:border-slate-700"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                        }`}
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>{isEng ? "Restaurant Owner" : "Mmiliki wa Mgahawa"}</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Google Social Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-bold text-xs text-slate-800 dark:text-white transition-all shadow-sm group"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{isEng ? "Continue with Google" : "Endelea na Google"}</span>
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                    <span className="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
                      {isEng ? "or sign in with email" : "au kwa barua pepe"}
                    </span>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isEng ? "Email Address" : "Barua Pepe"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="diner@arusha.tz"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isEng ? "Password" : "Nenosiri"}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
                    >
                      {isLoading ? (isEng ? "Signing in..." : "Inaingia...") : (isEng ? "Sign In" : "Ingia")}
                    </button>
                  </form>
                </div>
              )}

              {/* ── 2. CREATE ACCOUNT TAB (DINER) ── */}
              {activeTab === "create_account" && (
                <div className="space-y-4">
                  
                  {/* Google Social Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-bold text-xs text-slate-800 dark:text-white transition-all shadow-sm group"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{isEng ? "Instant Sign Up with Google" : "Jiunge Haraka na Google"}</span>
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                    <span className="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
                      {isEng ? "or register with email" : "au sajili kwa barua pepe"}
                    </span>
                  </div>

                  <form onSubmit={handleCreateAccount} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isEng ? "Full Name" : "Jina Kamili"}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Grace Temba"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isEng ? "Email Address" : "Barua Pepe"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={createEmail}
                          onChange={(e) => setCreateEmail(e.target.value)}
                          placeholder="grace@gmail.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isEng ? "Create Password" : "Tengeneza Nenosiri"}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={createPassword}
                          onChange={(e) => setCreatePassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
                    >
                      {isLoading ? (isEng ? "Creating Account..." : "Inatengeneza...") : (isEng ? "Create Account & Sign In" : "Tengeneza Akaunti")}
                    </button>
                  </form>
                </div>
              )}

              {/* ── 3. REGISTER PLACE TAB (SELLER WITH FREE-FORM LOCATION) ── */}
              {activeTab === "register" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEng ? "Restaurant / Place Name" : "Jina la Mgahawa"} *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Unga Limited BBQ & Grill"
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
                        placeholder="e.g. Peter M."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Free-Form Arusha Location Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEng ? "Arusha Location / Neighborhood" : "Mahali / Mtaa wa Arusha"} *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={selectedNeighborhood}
                        onChange={(e) => setSelectedNeighborhood(e.target.value)}
                        placeholder="e.g. Unga Limited, Sekei, Kisongo, Njiro..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEng ? "Contact Phone (Call & Connect)" : "Simu ya Direct"} *
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
                        {isEng ? "WhatsApp Phone (Direct Ordering)" : "Namba ya WhatsApp"}
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
                    <p className="text-[10px] text-slate-400 mt-1">
                      {isEng ? "Enables 1-tap WhatsApp food ordering for your eatery." : "Huwezesha wateja kuagiza chakula kwa WhatsApp."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRegisterSubmit}
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20"
                  >
                    {isLoading ? (isEng ? "Registering Place..." : "Inasajili...") : (isEng ? "Register Place & List Menu" : "Sajili Mkahawa")}
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
