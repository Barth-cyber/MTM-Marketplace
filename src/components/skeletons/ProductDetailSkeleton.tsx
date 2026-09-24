import React from 'react';

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* ── TOP SECTION (Media Gallery & Overview) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Main 4:3 image skeleton */}
          <div className="relative aspect-[4/3] rounded-xl bg-slate-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>

          {/* Thumbnails row */}
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 rounded-lg bg-slate-200" />
            <div className="w-16 h-16 rounded-lg bg-slate-200" />
            <div className="w-16 h-16 rounded-lg bg-slate-200" />
            <div className="w-16 h-16 rounded-lg bg-slate-200" />
          </div>

          {/* Video run test placeholder */}
          <div className="w-full h-11 rounded-xl bg-slate-100 border border-slate-200" />
        </div>

        {/* Right: Info & Pricing Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Top brand / department badge & rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-24 h-5 rounded bg-slate-200" />
                <div className="w-16 h-5 rounded bg-slate-200" />
              </div>
              <div className="w-28 h-5 rounded bg-slate-200" />
            </div>

            {/* Title placeholders */}
            <div className="space-y-1.5">
              <div className="w-full h-7 rounded bg-slate-300" />
              <div className="w-3/4 h-7 rounded bg-slate-300" />
            </div>

            {/* Seller & Verification trust row */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200" />
                <div className="space-y-1">
                  <div className="w-28 h-3.5 rounded bg-slate-300" />
                  <div className="w-40 h-3 rounded bg-slate-200" />
                </div>
              </div>
              <div className="w-24 h-6 rounded bg-slate-200" />
            </div>

            {/* Pricing Dossier Box */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-24 h-3 rounded bg-slate-300" />
                <div className="w-28 h-4 rounded bg-slate-300" />
              </div>
              <div className="flex items-baseline space-x-3">
                <div className="w-48 h-8 rounded bg-slate-300" />
                <div className="w-24 h-5 rounded bg-slate-200" />
              </div>
            </div>

            {/* Primary Action Buttons (Add to Cart / Make Offer) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="h-12 rounded-xl bg-slate-300" />
              <div className="h-12 rounded-xl bg-slate-300" />
            </div>

            {/* Secondary Actions Grid */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="h-9 rounded-lg bg-slate-200" />
              <div className="h-9 rounded-lg bg-slate-200" />
              <div className="h-9 rounded-lg bg-slate-200" />
              <div className="h-9 rounded-lg bg-slate-200" />
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS NAVIGATION PLACEHOLDER ── */}
      <div className="border-t border-slate-200 pt-6 space-y-4">
        <div className="flex space-x-6 border-b border-slate-200 pb-3">
          <div className="w-36 h-5 rounded bg-slate-300" />
          <div className="w-40 h-5 rounded bg-slate-200" />
          <div className="w-44 h-5 rounded bg-slate-200" />
          <div className="w-32 h-5 rounded bg-slate-200" />
        </div>

        {/* Specs Table Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="w-24 h-4 rounded bg-slate-200" />
              <div className="w-32 h-4 rounded bg-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
