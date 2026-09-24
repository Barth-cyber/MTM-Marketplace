import React, { useState } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  ShieldCheck, 
  RotateCcw, 
  Search, 
  Zap, 
  MapPin, 
  Flame,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './skeletons/ProductGridSkeleton';
import { INDUSTRIAL_HUBS } from '../data/mockData';
import { EquipmentCondition, MainCategory } from '../types';

interface ProductCatalogViewProps {
  title: string;
  categoryFilter?: MainCategory | 'All';
}

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({ title, categoryFilter = 'All' }) => {
  const {
    filteredProducts,
    filterState,
    setFilterState,
    resetFilters,
    isLoadingProducts,
    simulateRefreshInventory,
    setIsMarketTrendsOpen,
    setActiveView,
  } = useMarketplace();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Back Button Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Top Banner & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-[#8B1520] font-bold">{title}</span>
            {filterState.subcategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-slate-800 font-semibold">{filterState.subcategory}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {filterState.subcategory !== 'All' ? filterState.subcategory : title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> industrial equipment listings
          </p>
        </div>

        {/* Sort, Refresh & Market Trends Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Smart Market Trends Button */}
          <button
            id="catalog-market-trends-btn"
            onClick={() => setIsMarketTrendsOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#8B1520] border border-rose-200 text-xs font-bold transition shadow-2xs cursor-pointer"
            title="View Q3 2026 Nigerian Industrial Equipment Trend Index"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#8B1520]" />
            <span>Smart Trends Analysis</span>
          </button>

          {/* Sync / Refresh Inventory Button */}
          <button
            id="catalog-sync-inventory-btn"
            onClick={simulateRefreshInventory}
            disabled={isLoadingProducts}
            className={`p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-2xs cursor-pointer ${
              isLoadingProducts ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Sync Live Inventory & Price Benchmarks"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin text-[#8B1520]' : ''}`} />
          </button>

          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 hidden sm:inline font-medium">Sort:</span>
            <select
              id="catalog-sort-select"
              value={filterState.sortBy}
              onChange={e => setFilterState(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-xs font-bold focus:outline-none focus:border-[#8B1520] cursor-pointer shadow-xs"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="inspection-score">Highest Inspection Score</option>
              <option value="newest">Recently Listed</option>
            </select>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Filter Sidebar (3 cols) */}
        <aside className={`md:col-span-3 space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-5 text-xs shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B1520]" />
                <span>Filters & Facets</span>
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-slate-400 hover:text-[#8B1520] font-bold flex items-center space-x-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Hub Location Filter */}
            <div>
              <label className="block text-slate-800 font-bold mb-2 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Regional Industrial Hub</span>
              </label>
              <select
                value={filterState.locationHub}
                onChange={e => setFilterState(prev => ({ ...prev, locationHub: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-[#8B1520] cursor-pointer"
              >
                {INDUSTRIAL_HUBS.map(hub => (
                  <option key={hub} value={hub}>{hub}</option>
                ))}
              </select>
            </div>

            {/* Condition Selection */}
            <div>
              <label className="block text-slate-800 font-bold mb-2">Equipment Condition</label>
              <div className="space-y-1.5">
                {['All', 'Brand New', 'Like New', 'Refurbished', 'Tested Working'].map(cond => (
                  <label key={cond} className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      checked={filterState.condition === cond}
                      onChange={() => setFilterState(prev => ({ ...prev, condition: cond }))}
                      className="text-[#8B1520] focus:ring-0"
                    />
                    <span className="text-xs">{cond}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Power Grid & Voltage */}
            <div>
              <label className="block text-slate-800 font-bold mb-2 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Power Grid / Generator</span>
              </label>
              <div className="space-y-1.5">
                {['All', '3-Phase', '1-Phase', 'Diesel', 'Pneumatic', 'Manual'].map(pwr => (
                  <label key={pwr} className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 cursor-pointer">
                    <input
                      type="radio"
                      name="powerPhase"
                      checked={filterState.powerPhase === pwr}
                      onChange={() => setFilterState(prev => ({ ...prev, powerPhase: pwr }))}
                      className="text-[#8B1520] focus:ring-0"
                    />
                    <span className="text-xs">{pwr}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verified Inspection Only */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterState.hasInspectionCertOnly}
                  onChange={e => setFilterState(prev => ({ ...prev, hasInspectionCertOnly: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <div className="flex items-center space-x-1 text-emerald-700 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>MTM Verified Only (&gt;90%)</span>
                </div>
              </label>
            </div>

            {/* Liquidation Only */}
            <div>
              <label className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterState.isLiquidationOnly}
                  onChange={e => setFilterState(prev => ({ ...prev, isLiquidationOnly: e.target.checked }))}
                  className="rounded text-red-600 focus:ring-0"
                />
                <div className="flex items-center space-x-1 text-rose-600 font-bold text-xs">
                  <Flame className="w-3.5 h-3.5 fill-rose-600" />
                  <span>Liquidation & Surplus Deals</span>
                </div>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area (9 cols) */}
        <main className="md:col-span-9 space-y-6">
          {isLoadingProducts ? (
            <ProductGridSkeleton count={6} columns="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4 shadow-xs">
              <Search className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="text-base font-bold text-slate-900">No equipment matches your active filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your power specs, hub location, or search keyword to see available machines.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs transition shadow-md border border-[#7A101A]/30 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
