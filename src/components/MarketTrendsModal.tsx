import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  BarChart2, 
  Sparkles, 
  Building2, 
  Layers, 
  ArrowUpRight, 
  Flame, 
  ShieldCheck, 
  Search,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';
import { MARKET_CATEGORY_TRENDS } from '../utils/trendAnalysis';
import { useMarketplace } from '../context/MarketplaceContext';
import { MainCategory } from '../types';
import { BackNavigation } from './BackNavigation';
import { useDraggableModal } from '../hooks/useDraggableModal';

interface MarketTrendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketTrendsModal: React.FC<MarketTrendsModalProps> = ({ isOpen, onClose }) => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const { 
    setSelectedCategory, 
    setFilterState, 
    setActiveView,
    setIsAIAdvisorOpen,
    setAdvisorInitialPrompt 
  } = useMarketplace();

  const [selectedTab, setSelectedTab] = useState<'categories' | 'macro' | 'insights'>('categories');

  if (!isOpen) return null;

  const handleSelectCategoryTrend = (category: string) => {
    setSelectedCategory(category as MainCategory);
    setFilterState(prev => ({ ...prev, category, subcategory: 'All' }));
    setActiveView('category');
    onClose();
  };

  const handleAskAIAboutTrends = () => {
    setAdvisorInitialPrompt(
      "Provide a high-level industrial market briefing on machinery valuation, import replacement costs, and high-ROI manufacturing sectors in Nigeria for 2026."
    );
    setIsAIAdvisorOpen(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 animate-fadeIn">
      <div 
        style={modalStyle}
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative my-auto"
      >
        {/* Back Navigation Helper */}
        <BackNavigation 
          onBack={onClose} 
          label="Back to Marketplace" 
          showClose={true} 
          onClose={onClose} 
          dragHandleProps={dragHandleProps}
        />
        
        {/* Header */}
        <div 
          {...dragHandleProps}
          className="p-5 sm:p-6 bg-white text-slate-900 flex items-center justify-between border-b border-slate-200 shrink-0 select-none"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#8B1520]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  MTM Market Intelligence
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-50 text-[#8B1520] text-[10px] font-bold border border-rose-200">
                  Q3 2026 Live Index
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Nigerian Industrial Machinery Trends & Valuations
              </h2>
            </div>
          </div>

          <button
            id="close-market-trends-modal-btn"
            onClick={onClose}
            className="no-drag p-2 rounded-xl bg-white hover:bg-rose-600 hover:text-white text-slate-700 border border-slate-300 hover:border-rose-600 transition-colors shadow-xs cursor-pointer"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 font-bold" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex items-center space-x-6 text-xs font-bold">
          <button
            onClick={() => setSelectedTab('categories')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              selectedTab === 'categories' 
                ? 'border-[#8B1520] text-[#8B1520] font-black' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Category Growth & Demand Rankings
          </button>

          <button
            onClick={() => setSelectedTab('macro')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              selectedTab === 'macro' 
                ? 'border-[#8B1520] text-[#8B1520] font-black' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Macro Industrial Benchmarks & FX
          </button>

          <button
            onClick={() => setSelectedTab('insights')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              selectedTab === 'insights' 
                ? 'border-[#8B1520] text-[#8B1520] font-black' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Regional Cluster Dynamics
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-xs">
          
          {/* TAB 1: Category Growth & Demand Rankings */}
          {selectedTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4 text-[#8B1520]" />
                  <span>Sub-Sector Transaction Velocity (Last 12 Months)</span>
                </h3>
                <span className="text-slate-500 text-[11px]">Ranked by active verified buyer inquiries</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {MARKET_CATEGORY_TRENDS.map(cat => (
                  <div
                    key={cat.category}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-200 hover:shadow-xs transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-md bg-rose-50 text-[#8B1520] border border-rose-200 font-black text-xs flex items-center justify-center">
                            #{cat.demandRank}
                          </span>
                          <h4 className="font-black text-slate-900 text-sm">{cat.category}</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center space-x-0.5">
                          <TrendingUp className="w-3 h-3" />
                          <span>+{cat.growthRatePct}% YoY</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                        <div>
                          <span className="text-slate-400 font-medium">Top Sought Model: </span>
                          <strong className="text-slate-800">{cat.topSoughtModel}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Depreciation Curve: </span>
                          <span className="text-slate-700">{cat.averageDepreciationRate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">
                        {cat.activeListingsCount} verified machines on MTM
                      </span>
                      <button
                        onClick={() => handleSelectCategoryTrend(cat.category)}
                        className="text-xs font-bold text-[#8B1520] hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <span>View Catalog</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Macro Industrial Benchmarks */}
          {selectedTab === 'macro' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-semibold text-[11px]">Industrial Import Inflation Index</span>
                  <div className="text-xl font-black text-slate-900">+18.6%</div>
                  <p className="text-[10px] text-slate-500">
                    Driven by shipping container rates and import tariffs on new equipment.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-semibold text-[11px]">Average Used Capex Savings</span>
                  <div className="text-xl font-black text-emerald-700">54% - 68%</div>
                  <p className="text-[10px] text-slate-500">
                    Tested operational machines vs brand new European / Asian equivalents.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-semibold text-[11px]">Average Resale Days on MTM</span>
                  <div className="text-xl font-black text-[#8B1520]">18.4 Days</div>
                  <p className="text-[10px] text-slate-500">
                    For equipment with &gt;85% inspection scores and video run tests.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
                <div className="flex items-center space-x-2 text-[#8B1520] font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Procurement Timing Strategy</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs">
                  Due to current exchange rates and lead times of 12–16 weeks on European factory machinery, pre-inspected local plant clearances in Lagos and Kano provide immediate cash flow deployment with zero clearing delays.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Regional Cluster Dynamics */}
          {selectedTab === 'insights' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold text-sm">Lagos Industrial Corridor (Ikeja, Oregun, Agbara)</strong>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Highest Demand</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Leading in high-speed furniture CNC machinery, automated packaging lines, and industrial diesel generation capacity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold text-sm">Kano & Northern Hubs (Bompai, Sharada, Challawa)</strong>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-[#8B1520] border border-rose-200 text-[10px] font-bold">Agricultural & Heavy Milling</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  High demand for grain processing, commercial flour milling, heavy tractors, and oil extraction presses.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold text-sm">Eastern Industrial Axis (Nnewi, Onitsha, Aba)</strong>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">Metal Fabrication & Tooling</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Accelerated procurement of metal lathes, hydraulic press brakes, stamping presses, and automotive foundry tools.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 text-[11px]">
            Data updated daily via MTM verified transaction escrow telemetry.
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAskAIAboutTrends}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold transition flex items-center space-x-1.5 shadow-md border border-[#7A101A]/30 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Industrial Advisor</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
