import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Trash2, 
  Search, 
  Tag, 
  TrendingUp, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { VoiceInputButton } from './VoiceInputButton';

interface SearchHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchHistorySidebar: React.FC<SearchHistorySidebarProps> = ({ isOpen, onClose }) => {
  const { 
    searchHistory, 
    clearSearchHistory, 
    filterState, 
    setFilterState, 
    setActiveView, 
    setActiveProduct,
    addSearchHistory
  } = useMarketplace();

  const [customSearch, setCustomSearch] = useState('');

  if (!isOpen) return null;

  const executeSearch = (query: string, category = 'All', maxPrice = 50000000) => {
    addSearchHistory(query);
    setFilterState(prev => ({
      ...prev,
      search: query,
      category: category,
      priceRange: [0, maxPrice]
    }));
    setActiveProduct(null);

    if (category === 'Machines') setActiveView('machines');
    else if (category === 'Tools') setActiveView('tools');
    else if (category === 'Materials') setActiveView('materials');
    else setActiveView('machines');

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden animate-slideLeft">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#1E40AF] text-[#FACC15] shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm">Search History & Filters</h3>
              <p className="text-[11px] text-slate-400">Search log, presets & smart query triggers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Voice Search Bar inside Sidebar */}
        <div className="p-3.5 bg-slate-100 border-b border-slate-200 space-y-2">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            Quick Voice & Keyword Search
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customSearch}
                onChange={e => setCustomSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && customSearch.trim()) {
                    executeSearch(customSearch);
                    setCustomSearch('');
                  }
                }}
                placeholder="Type or use voice search..."
                className="w-full pl-3 pr-8 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#1E40AF]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
            
            <VoiceInputButton
              onTranscript={(transcript) => {
                setCustomSearch(transcript);
                executeSearch(transcript);
              }}
            />
          </div>
        </div>

        {/* Scrollable Sidebar Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Active Search Context */}
          {filterState.search && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#1E40AF] uppercase tracking-wider text-[10px]">Active Filter Query</span>
                <button
                  onClick={() => setFilterState(prev => ({ ...prev, search: '' }))}
                  className="text-[10px] text-blue-700 hover:text-red-600 font-bold underline"
                >
                  Reset Active Filter
                </button>
              </div>
              <p className="font-bold text-slate-900 text-sm font-mono">"{filterState.search}"</p>
              <div className="flex flex-wrap gap-1 text-[10px] font-semibold text-slate-600 pt-1">
                <span className="bg-white px-2 py-0.5 rounded border border-blue-200">Category: {filterState.category}</span>
                <span className="bg-white px-2 py-0.5 rounded border border-blue-200">Max: ₦{(filterState.priceRange[1]/1000000).toFixed(1)}M</span>
              </div>
            </div>
          )}

          {/* Search History List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1E40AF]" />
                <span>Recent Search Queries ({searchHistory.length})</span>
              </h4>
              {searchHistory.length > 0 && (
                <button
                  onClick={clearSearchHistory}
                  className="text-[11px] font-bold text-slate-400 hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>

            {searchHistory.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs space-y-1">
                <Search className="w-6 h-6 mx-auto text-slate-300" />
                <p>No recent search history recorded.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchHistory.map((query, index) => (
                  <div
                    key={index}
                    onClick={() => executeSearch(query)}
                    className="p-3 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl shadow-2xs flex items-center justify-between cursor-pointer transition group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-[#1E40AF] flex items-center justify-center transition">
                        <Tag className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs group-hover:text-[#1E40AF] transition">{query}</h5>
                        <span className="text-[10px] text-slate-400">Recorded search</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1E40AF] transition" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Price & Machinery Filter Presets */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Smart Machinery Presets</span>
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() => executeSearch("Heavy Duty Edge Bander", "Machines", 7000000)}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-left transition cursor-pointer"
              >
                <div>
                  <span className="font-extrabold text-slate-900 block">Edge Banding Machines</span>
                  <span className="text-[10px] text-slate-500">Under ₦7,000,000 • High Demand</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded">Spotlight</span>
              </button>

              <button
                onClick={() => executeSearch("SCM Panel Saw", "Machines", 8500000)}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-left transition cursor-pointer"
              >
                <div>
                  <span className="font-extrabold text-slate-900 block">Sliding Table Panel Saws</span>
                  <span className="text-[10px] text-slate-500">3.2m Scoring Blade • 3-Phase</span>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-[#1E40AF] text-[10px] font-black rounded">Precision</span>
              </button>

              <button
                onClick={() => executeSearch("Interior Duct Ltd Benin City", "Machines", 50000000)}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-left transition cursor-pointer"
              >
                <div>
                  <span className="font-extrabold text-slate-900 block">Interior Duct Ltd Hub</span>
                  <span className="text-[10px] text-slate-500">Benin City • Furniture Training Partner</span>
                </div>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded">Tier-1 Partner</span>
              </button>
            </div>
          </div>

          {/* Featured Vocational Training Spotlight Box */}
          <div className="p-3.5 bg-gradient-to-br from-[#1E40AF] to-slate-900 text-white rounded-2xl shadow-md space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#FACC15]" />
              <span className="text-[10px] font-black uppercase text-[#FACC15] tracking-wider">Vocational Training Spotlight</span>
            </div>
            <h5 className="font-bold text-xs">Interior Duct Ltd Vocational Machinery Training</h5>
            <p className="text-[11px] text-slate-200 leading-relaxed">
              In partnership with <strong>Bomon Development Foundation (Charity NGO)</strong>, Interior Duct Ltd offers professional, NBTE-accredited vocational woodworking and advanced industrial machinery safety training programs in Benin City.
            </p>
            <button
              onClick={() => executeSearch("Interior Duct Ltd Vocational Machinery Training Benin City", "Machines")}
              className="w-full mt-1 bg-[#FACC15] hover:bg-amber-400 text-slate-950 font-black text-xs py-1.5 rounded-lg transition cursor-pointer"
            >
              Explore Training Programs
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
