"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useLocale } from '@/context/LocaleContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import {
  Sun, Moon, Globe, MapPin, Menu, X,
  Shield, Compass, MessageSquare, Home as HomeIcon,
  DollarSign, LogIn, UserPlus, LogOut, User as UserIcon, Store
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();
  const { currency, toggleCurrency } = useCurrency();
  const { user, isAuthenticated, isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal, logout } = useAuth();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMerchant = isAuthenticated && user?.role === 'merchant';

  const navLinks = isMerchant
    ? [
        {
          name: locale === 'eng' ? 'Seller Dashboard' : 'Dashibodi ya Muuzaji',
          href: '/seller-dashboard',
          icon: Store,
        },
      ]
    : [
        { name: locale === 'eng' ? 'Home' : 'Nyumbani', href: '/', icon: HomeIcon },
        { name: locale === 'eng' ? 'Explore Eateries' : 'Gundua Migahawa', href: '/explore', icon: Compass },
        { name: locale === 'eng' ? 'Hygiene Reviews' : 'Mapitio ya Usafi', href: '/reviews', icon: MessageSquare },
        ...(!isAuthenticated
          ? [{ name: locale === 'eng' ? 'Register Place' : 'Sajili Mahali', href: '/register-place', icon: Store }]
          : []),
      ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-slate-900/95 shadow-md border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-2xl'
            : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/40 dark:border-slate-800/40'
        } h-16 sm:h-20`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full gap-4">

            {/* ── Logo ── */}
            <Link
              href={isMerchant ? "/seller-dashboard" : "/"}
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent tracking-tight">
                  SafePlate Hub
                </span>
                <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  <MapPin className="w-2.5 h-2.5" />
                  Arusha, TZ 🔒
                </span>
              </div>
            </Link>

            {/* ── Desktop Multi-Page Nav Links ── */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500' : ''}`} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* ── Desktop Right Controls ── */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">

              {/* Currency Toggle */}
              <button
                onClick={toggleCurrency}
                title={`Switch to ${currency === 'TZS' ? 'USD' : 'TZS'}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 transition-all text-xs font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap"
              >
                <DollarSign className="w-3.5 h-3.5" />
                {currency === 'TZS' ? 'TZS Shs' : 'USD $'}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <Globe className="w-3.5 h-3.5" />
                {locale === 'eng' ? 'EN' : 'SW'}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 group"
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                ) : (
                  <Sun className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                )}
              </button>

              {/* Auth Buttons / Profile */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                    <UserIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-amber-400">
                      {user?.name}
                    </span>
                    {/* Role Badge */}
                    <span className="ml-2 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded px-1.5">
                      {user?.role === "merchant" ? "Restaurant Owner" : "Diner"}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    {t('signIn') || 'Sign In'}
                  </button>
                  <Link
                    href="/register-place"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    {t('registerPlace') || 'Register Place'}
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile Controls ── */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleCurrency}
                className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-[10px] font-bold text-amber-700 dark:text-amber-400"
              >
                {currency === 'TZS' ? 'Shs' : 'USD'}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 dark:text-slate-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-white'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleLocale}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  🌐 {locale === 'eng' ? 'English' : 'Kiswahili'}
                </button>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-amber-500">
                    Signed in as {user?.name}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-semibold text-red-400"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      openAuthModal('signin');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 text-center rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    Sign In
                  </button>
                  <Link
                    href="/register-place"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center rounded-lg bg-amber-500 text-white text-xs font-bold"
                  >
                    Register Place
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        defaultTab={authModalTab}
      />
    </>
  );
}
