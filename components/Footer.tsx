"use client";

import React from 'react';
import { useLocale } from '@/context/LocaleContext';
import { 
  Shield, Mail, Phone, Globe, Send, Heart, 
  MessageSquare, ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import { PLATFORM_BRANDING } from '@/lib/budgetFilter';
import InstagramIcon from '@/components/InstagramIcon';

export default function Footer() {
  const { locale } = useLocale();
  const isSw = locale === 'sw';
  const isEng = locale === 'eng';

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Shield className="w-8 h-8 text-amber-500" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                SafePlate Hub
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isSw 
                ? "Inaunganisha walaji na wageni na migahawa iliyothibitishwa usafi nchini Tanzania kwa ulinganishaji wa bajeti na mawasiliano ya moja kwa moja." 
                : "Connecting diners and expats with hygiene-verified eateries in Arusha, Tanzania, with instant budget search and direct WhatsApp ordering."}
            </p>

            {/* Social & Direct Contact Links */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a 
                href={PLATFORM_BRANDING.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Official Instagram: Trustcore_web" 
                title="Follow @Trustcore_web on Instagram"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-pink-400 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all shadow-md group"
              >
                <InstagramIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>

              {/* WhatsApp */}
              <a 
                href={PLATFORM_BRANDING.whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={`Official WhatsApp: ${PLATFORM_BRANDING.whatsappNumber}`} 
                title={`Chat on WhatsApp: ${PLATFORM_BRANDING.whatsappNumber}`}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-md group"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>

              {/* Website */}
              <a 
                href="#" 
                aria-label="Website" 
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-white transition-all shadow-md"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>

            {/* Official Instagram Badge */}
            <div className="pt-2">
              <a
                href={PLATFORM_BRANDING.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-xs font-bold text-pink-300 hover:bg-pink-500/20 transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>@{PLATFORM_BRANDING.instagramHandle}</span>
                <ExternalLink className="w-3 h-3 text-pink-400/80 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{isSw ? "Viungo vya Haraka" : "Quick Links"}</h4>
            <ul className="space-y-3">
              {[
                { name: isSw ? 'Mwanzo' : 'Home', path: '/' },
                { name: isSw ? 'Gundua kwa Bajeti' : 'Explore by Budget', path: '/explore' },
                { name: isSw ? 'Mapitio ya Jamii' : 'Community Reviews', path: '/reviews' },
                { name: isSw ? 'Sajili Mkahawa' : 'Register Place', path: '/register-place' },
                { name: isSw ? 'Lango la Muuzaji' : 'Seller Dashboard', path: '/seller-dashboard' },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2 text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget Quick Filters */}
          <div>
            <h4 className="text-lg font-bold mb-6">{isSw ? "Vinjari kwa Bajeti (TZS)" : "Browse by Budget"}</h4>
            <ul className="space-y-3">
              {[
                { label: isSw ? "Chini ya TZS 5,000 (Nafuu)" : "Under 5,000 TZS (Budget)", query: "5000" },
                { label: isSw ? "TZS 5,000 – 10,000 (Kawaida)" : "5,000 – 10,000 TZS (Standard)", query: "5000 - 10000" },
                { label: isSw ? "TZS 10,000 – 20,000 (Kati)" : "10,000 – 20,000 TZS (Mid-Range)", query: "10000 - 20000" },
                { label: isSw ? "Zaidi ya TZS 20,000 (Maalum)" : "20,000+ TZS (Premium Feast)", query: "20000" },
              ].map((tier, i) => (
                <li key={i}>
                  <Link 
                    href={`/explore?budget=${encodeURIComponent(tier.query)}`} 
                    className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {tier.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Contact & Admin Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">{isSw ? "Mawasiliano na Usaidizi" : "Contact & Support"}</h4>
            
            <div className="space-y-3">
              {/* WhatsApp Direct Chat */}
              <a
                href={PLATFORM_BRANDING.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-bold group"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-emerald-500 uppercase tracking-wider font-extrabold">
                    {isSw ? "WhatsApp ya Wasimamizi" : "Official Admin WhatsApp"}
                  </span>
                  <span className="text-white text-xs">{PLATFORM_BRANDING.whatsappNumber}</span>
                </div>
              </a>

              {/* Instagram Handle */}
              <a
                href={PLATFORM_BRANDING.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition-all text-sm font-bold group"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-pink-400 uppercase tracking-wider font-extrabold">
                    {isSw ? "Instagram Rasmi" : "Official Instagram"}
                  </span>
                  <span className="text-white text-xs">@{PLATFORM_BRANDING.instagramHandle}</span>
                </div>
              </a>

              {/* Direct Call */}
              <a 
                href={`tel:${PLATFORM_BRANDING.whatsappNumber.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 text-slate-300 hover:text-white text-xs pt-1 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>{isEng ? "Call Line:" : "Piga Simu:"} {PLATFORM_BRANDING.whatsappNumber}</span>
              </a>

              {/* Email */}
              <p className="flex items-center gap-2 text-slate-400 text-xs">
                <Mail className="w-3.5 h-3.5 text-amber-500" /> support@safeplatehub.com
              </p>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar & Developer Info */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 flex items-center gap-1">
            © 2026 SafePlate Hub. 
            {isSw ? "Imetengenezwa kwa " : "Made with "}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current mx-1" /> 
            {isSw ? " nchini Tanzania." : " in Arusha, Tanzania."}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <span>
              {isSw ? "Msanidi & Usanifu:" : "Engineering & Design:"}{" "}
              <a 
                href={PLATFORM_BRANDING.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-pink-400 hover:underline font-extrabold inline-flex items-center gap-1"
              >
                <InstagramIcon className="w-3 h-3 text-pink-400" />
                @{PLATFORM_BRANDING.instagramHandle}
              </a>
            </span>
            <span>•</span>
            <span>
              WhatsApp:{" "}
              <a 
                href={PLATFORM_BRANDING.whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-400 hover:underline font-extrabold"
              >
                {PLATFORM_BRANDING.whatsappNumber}
              </a>
            </span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
