import React from 'react';
import { Flame, Clock, ShieldCheck, AlertTriangle, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './skeletons/ProductGridSkeleton';

export const LiquidationDealsView: React.FC = () => {
  const { products, isLoadingProducts, setIsAIAdvisorOpen, setAdvisorInitialPrompt, setActiveView } = useMarketplace();

  const liquidationProducts = products.filter(p => p.isLiquidation || p.originalPriceNGN);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-rose-50/80 via-white to-slate-50 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xs border border-rose-200 text-slate-900">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100/90 border border-rose-200 text-[#8B1520] text-xs font-bold">
            <Flame className="w-4 h-4 fill-[#8B1520] text-[#8B1520] animate-bounce" />
            <span>URGENT FACTORY CLOSURE & SURPLUS PLANT DISPERSAL</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Industrial Liquidation & Clearance Deals
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Decommissioned manufacturing plants, bank-consigned assets, and surplus workshop inventories priced 20%–50% below replacement cost. Full MTM physical testing and escrow release guaranteed.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setAdvisorInitialPrompt("Find the highest ROI factory liquidation package for my budget on MTM.");
                setIsAIAdvisorOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-md border border-[#7A101A]/30 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Liquidation Package Matcher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Liquidation Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Flame className="w-5 h-5 text-[#8B1520] fill-[#8B1520]" />
            <span>Active Liquidation Lots ({liquidationProducts.length} Lots Available)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Inspected on site in Lagos, Kano & Port Harcourt</span>
        </div>

        {isLoadingProducts ? (
          <ProductGridSkeleton count={6} columns="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liquidationProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

