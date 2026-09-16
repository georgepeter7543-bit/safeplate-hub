"use client";

import React from 'react';
import { useLocale } from '@/context/LocaleContext';
import { mockRelocationGuides } from '@/lib/mockData';
import { MapPin, Shield, BookOpen, ChevronRight, Compass, Star } from 'lucide-react';

export default function RelocationGuides() {
  const { locale, t } = useLocale();
  const isSw = locale === 'sw';

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Compass className="w-8 h-8 text-amber-500" />
            {isSw ? "Miongozo ya Chakula Kwa Wageni" : "Relocation Meal Guides"}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {isSw 
              ? "Mgeni Tanzania? Gundua sehemu salama, zilizothibitishwa za chakula katika mtaa wako." 
              : "New to Tanzania? Discover safe, verified eateries in your neighborhood."}
          </p>
        </div>

        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-8 pb-8 md:pb-0 hide-scrollbar snap-x snap-mandatory">
          {mockRelocationGuides.map((guide) => (
            <div 
              key={guide.id} 
              className="min-w-[300px] md:min-w-0 snap-center bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 group flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={guide.image} 
                  alt={isSw ? guide.titleSw : guide.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    {guide.city}
                  </h3>
                  <div className="inline-flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {guide.topSpots} {isSw ? "Sehemu Bora" : "Top-Rated Spots"}
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {isSw ? guide.titleSw : guide.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow">
                  {isSw ? guide.descriptionSw : guide.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {(isSw ? guide.safetyTipsSw : guide.safetyTips).slice(0, 3).map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{tip}</span>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <BookOpen className="w-4 h-4" />
                  {isSw ? "Gundua Mwongozo" : "Explore Guide"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
