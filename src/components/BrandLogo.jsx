import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function BrandLogo({ compact = false, showTagline = true }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 select-none">
      <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg overflow-hidden border border-[#0029A8] dark:border-[#2952CC] shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0033CC] via-[#2952CC] to-[#0A0A0A]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <TrendingUp className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px] text-white" strokeWidth={2.3} />
        </div>
      </div>

      {!compact && (
        <div className="leading-none">
          <p
            className="text-[15px] sm:text-[18px] font-bold tracking-[-0.01em] sm:tracking-tight text-[#0A0A0A] dark:text-[#F7F7F5]"
            style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
          >
            FinTrack
          </p>
          {showTagline && (
            <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#525252] dark:text-[#A3A3A3] mt-0.5">
              Finance OS
            </p>
          )}
        </div>
      )}
    </div>
  );
}
