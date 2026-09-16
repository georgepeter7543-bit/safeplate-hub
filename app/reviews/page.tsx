"use client";

import React from "react";
import CommunityFeed from "@/components/CommunityFeed";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageSquare, ShieldCheck, Lock } from "lucide-react";

export default function ReviewsPage() {
  const { locale } = useLocale();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated && user?.role === 'merchant') {
      router.replace('/seller-dashboard');
    }
  }, [isAuthenticated, user, router]);

  // Prevent flash of review content for restaurant owners
  if (isAuthenticated && user?.role === 'merchant') {
    return null;
  }
  const isEng = locale === "eng";

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* ── Page Header ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-blue-500/30">
            <MessageSquare className="w-3.5 h-3.5" />
            {isEng ? "Arusha Hygiene Feedback Portal" : "Lango la Mapitio ya Usafi Arusha"}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span>{isEng ? "Community Hygiene Reviews & Audits" : "Mapitio ya Usafi ya Jamii"}</span>
            <span className="text-xs bg-amber-500 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" /> Protected
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            {isEng
              ? "Read crowdsourced sanitation photo reports across Ngarenaro, Majengo, Clock Tower & Njiro. Authenticated diners can post star ratings and hygiene feedback."
              : "Soma ripoti za picha za usafi kote Ngarenaro, Majengo, Mnara wa Saa na Njiro. Walaji waliothibitishwa wanaweza kuweka rating na mapitio."}
          </p>
        </div>
      </div>

      {/* ── Community Feed Component ── */}
      <div className="max-w-4xl mx-auto py-8">
        <CommunityFeed />
      </div>

    </main>
  );
}
