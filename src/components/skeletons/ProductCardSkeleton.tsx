import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between animate-pulse">
      {/* 1. Image & Badges Placeholder */}
      <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
        {/* Shimmer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        
        {/* Top left badge placeholder */}
        <div className="absolute top-2.5 left-2.5 w-24 h-5 rounded bg-slate-300" />
        
        {/* Top right favorite button placeholder */}
        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-300" />
        
        {/* Bottom badges */}
        <div className="absolute bottom-2.5 left-2.5 flex space-x-1.5">
          <div className="w-16 h-4 rounded bg-slate-300" />
          <div className="w-20 h-4 rounded bg-slate-300" />
        </div>
      </div>

      {/* 2. Content Info Placeholder */}
      <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Brand & Model Row */}
          <div className="flex items-center justify-between">
            <div className="w-20 h-3.5 rounded bg-slate-200" />
            <div className="w-12 h-3.5 rounded bg-slate-200" />
          </div>

          {/* Title Lines */}
          <div className="w-full h-4 rounded bg-slate-200" />
          <div className="w-3/4 h-4 rounded bg-slate-200" />
        </div>

        {/* Location & Specs Row */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-28 h-3 rounded bg-slate-200" />
            <div className="w-16 h-3 rounded bg-slate-200" />
          </div>

          {/* Specs Chips Placeholder */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="w-16 h-5 rounded-md bg-slate-100 border border-slate-200" />
            <div className="w-14 h-5 rounded-md bg-slate-100 border border-slate-200" />
            <div className="w-20 h-5 rounded-md bg-slate-100 border border-slate-200" />
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
          <div className="space-y-1">
            <div className="w-16 h-2.5 rounded bg-slate-200" />
            <div className="w-32 h-6 rounded bg-slate-300" />
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-8 h-8 rounded-lg bg-slate-200" />
            <div className="w-20 h-8 rounded-lg bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
