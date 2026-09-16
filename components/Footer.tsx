"use client";

import React from 'react';
import { useLocale } from '@/context/LocaleContext';
import { Shield, Mail, Phone, MapPin, Globe, Share2, MessageCircle, Send, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const { locale } = useLocale();
  const isSw = locale === 'sw';

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white pt-16 pb-8">
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
            <p className="text-slate-400 text-sm">
              {isSw 
                ? "Inaunganisha wageni na walaji wa eneo husika na migahawa iliyothibitishwa usafi nchini Tanzania." 
                : "Connecting expats and local diners with hygiene-verified eateries in Tanzania."}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" aria-label="Website" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-white transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Social Share" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Community Channel" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-white transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{isSw ? "Viungo vya Haraka" : "Quick Links"}</h4>
            <ul className="space-y-3">
              {[
                { name: isSw ? 'Mwanzo' : 'Home', path: '/' },
                { name: isSw ? 'Gundua' : 'Discover', path: '/explore' },
                { name: isSw ? 'Fuatilia Oda' : 'Track Order', path: '/orders' },
                { name: isSw ? 'Jamii' : 'Community', path: '/community' },
                { name: isSw ? 'Dashibodi' : 'Dashboard', path: '/merchant' },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">{isSw ? "Msaada" : "Support"}</h4>
            <ul className="space-y-3">
              {[
                { name: isSw ? 'Kuhusu Sisi' : 'About Us', path: '/about' },
                { name: isSw ? 'Wasiliana Nasi' : 'Contact Us', path: '/contact' },
                { name: isSw ? 'Vigezo na Masharti' : 'Terms of Service', path: '/terms' },
                { name: isSw ? 'Sera ya Faragha' : 'Privacy Policy', path: '/privacy' },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">{isSw ? "Pata Taarifa" : "Stay Updated"}</h4>
            <p className="text-slate-400 text-sm mb-4">
              {isSw ? "Jiunge na jarida letu kupata ofa na masasisho." : "Subscribe to our newsletter for offers and updates."}
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder={isSw ? "Barua pepe yako" : "Your email"} 
                className="bg-slate-800 border-none outline-none text-white px-4 py-2 rounded-l-lg w-full focus:ring-1 focus:ring-amber-500"
              />
              <button className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-r-lg transition-colors flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="mt-6 space-y-2">
              <p className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-amber-500" /> support@safeplatehub.com
              </p>
              <p className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-amber-500" /> +255 700 000 000
              </p>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm flex items-center gap-1">
            © 2026 SafePlate Hub. 
            {isSw ? "Imetengenezwa kwa " : "Made with "}
            <Heart className="w-4 h-4 text-red-500 fill-current mx-1" /> 
            {isSw ? " nchini Tanzania" : " in Tanzania"}
          </p>
        </div>
        
      </div>
    </footer>
  );
}
