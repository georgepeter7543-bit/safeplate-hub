"use client";

import { useLocale } from "@/context/LocaleContext";
import { Restaurant, VerificationStep } from "@/lib/mockData";
import { X, Shield, Droplets, HeartPulse, HardHat, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";

interface VerificationModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationModal({ restaurant, isOpen, onClose }: VerificationModalProps) {
  const { t, locale } = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setShow(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !restaurant) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-500 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50';
      case 'pending': return 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50';
      case 'failed': return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50';
      default: return 'text-slate-500 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  const getIcon = (iconName: string, className?: string) => {
    const props = { size: 24, className };
    switch (iconName) {
      case 'shield': return <Shield {...props} />;
      case 'droplets': return <Droplets {...props} />;
      case 'heart-pulse': return <HeartPulse {...props} />;
      case 'hard-hat': return <HardHat {...props} />;
      default: return <Shield {...props} />;
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'passed') return <CheckCircle size={18} className="text-green-500" />;
    if (status === 'failed') return <XCircle size={18} className="text-red-500" />;
    return <Clock size={18} className="text-amber-500" />;
  };

  const passedCount = restaurant.verificationSteps?.filter(s => s.status === 'passed').length || 0;
  const totalCount = restaurant.verificationSteps?.length || 4;
  const progress = (passedCount / totalCount) * 100;
  const isFullyVerified = passedCount === totalCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300 transform ${show ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center">
              {restaurant.name}
              {isFullyVerified && <Shield className="ml-2 text-amber-500 fill-amber-100" size={24} />}
            </h2>
            <div className="flex items-center text-sm font-medium">
              <span className={`px-2 py-1 rounded-md text-white mr-3 ${restaurant.hygieneScore >= 90 ? 'bg-green-500' : restaurant.hygieneScore >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}>
                Score: {restaurant.hygieneScore}%
              </span>
              <span className={isFullyVerified ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>
                {isFullyVerified ? (locale === 'eng' ? 'Fully Verified' : 'Imethibitishwa Kikamilifu') : (locale === 'eng' ? 'Verification In Progress' : 'Uthibitishaji Unaendelea')}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${isFullyVerified ? 'bg-green-500' : 'bg-amber-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              {locale === 'eng' ? '4-Step Quality Verification Framework' : 'Mfumo wa Hatua 4 wa Uthibitishaji Ubora'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {locale === 'eng' 
                ? 'SafePlate Hub strictly monitors all food vendors to ensure safety and hygiene.'
                : 'SafePlate Hub hufuatilia kwa umakini wauzaji wote wa chakula ili kuhakikisha usafini na usalama.'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {restaurant.verificationSteps?.map((step: VerificationStep, idx: number) => {
              const statusClasses = getStatusColor(step.status);
              return (
                <div key={idx} className={`border rounded-xl p-5 ${statusClasses} transition-colors relative overflow-hidden group`}>
                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <div className={`p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm`}>
                      {getIcon(step.icon)}
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-1 font-medium text-sm capitalize">
                        <StatusIcon status={step.status} />
                        <span>{step.status}</span>
                      </div>
                      <span className="text-xs opacity-70 mt-1">{step.date}</span>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {locale === 'eng' ? step.name : (step.nameSw || step.name)}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 bg-white/40 dark:bg-slate-900/40 p-3 rounded-lg border border-white/20 dark:border-slate-700/50">
                      {locale === 'eng' ? step.notes : (step.notesSw || step.notes)}
                    </p>
                  </div>
                  
                  {/* Subtle background icon */}
                  <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                    {getIcon(step.icon, "w-32 h-32")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
