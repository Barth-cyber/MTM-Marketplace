import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  PlusCircle, 
  Glasses, 
  ShieldCheck, 
  User, 
  Menu, 
  X, 
  ChevronUp, 
  Bot, 
  QrCode, 
  Wrench, 
  Calculator, 
  Award, 
  Zap, 
  Repeat, 
  Layers, 
  Truck, 
  Box,
  MessageSquare
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const MobileFooterOverlay: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    setSelectedCategory, 
    setFilterState, 
    setActiveProduct, 
    setIsSellModalOpen, 
    setIsTermsModalOpen, 
    setIsMtmAgentOpen,
    setIsQrScannerOpen,
    setIsVrShowroomOpen,
    setIsArPlacementOpen,
    setIsEnergyCalculatorOpen,
    setIsUnitConverterOpen,
    setIsMaintenanceAlertsOpen,
    setIsQuickReorderOpen,
    cart
  } = useMarketplace();

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleNav = (view: string, cat = 'All') => {
    setActiveProduct(null);
    setActiveView(view);
    if (cat !== 'All') {
      setSelectedCategory(cat);
      setFilterState(prev => ({ ...prev, category: cat, subcategory: 'All' }));
    }
    setIsOverlayOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Expanded Mobile Navigation Drawer / Overlay */}
      {isOverlayOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200 flex flex-col justify-end">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOverlayOpen(false)} 
          />

          {/* Drawer Sheet */}
          <div className="relative z-10 bg-white border-t border-slate-200 text-slate-900 rounded-t-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-6 animate-in slide-in-from-bottom-6 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white z-20">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8B1520] text-white flex items-center justify-center font-black font-mono text-sm shadow-xs">
                  M
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">MTM Mobile Navigation</h3>
                  <p className="text-[10px] text-slate-500">Quick access to all marketplace sectors & 3D tools</p>
                </div>
              </div>

              <button
                onClick={() => setIsOverlayOpen(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3D / AR / VR Interactive Suite */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#8B1520] tracking-wider">
                <span>🥽 3D & AR/VR Tools</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-50 text-[#8B1520] border border-rose-200">Interactive</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setIsVrShowroomOpen(true);
                    setIsOverlayOpen(false);
                  }}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#8B1520] text-left flex items-center space-x-2.5 transition cursor-pointer"
                >
                  <Glasses className="w-4 h-4 text-[#8B1520] shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">360° VR Showroom</span>
                    <span className="text-[10px] text-slate-500">Virtual factory pavilions</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsArPlacementOpen(true);
                    setIsOverlayOpen(false);
                  }}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#8B1520] text-left flex items-center space-x-2.5 transition cursor-pointer"
                >
                  <Box className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">AR Camera Tool</span>
                    <span className="text-[10px] text-slate-500">1:1 Floor placement</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsEnergyCalculatorOpen(true);
                    setIsOverlayOpen(false);
                  }}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-500 text-left flex items-center space-x-2.5 transition cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Generator kVA Calc</span>
                    <span className="text-[10px] text-slate-500">Power load analysis</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsUnitConverterOpen(true);
                    setIsOverlayOpen(false);
                  }}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-500 text-left flex items-center space-x-2.5 transition cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-sky-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Unit Converter</span>
                    <span className="text-[10px] text-slate-500">kW, HP, mm, PSI</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Equipment Categories */}
            <div className="space-y-2.5">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider block">
                ⚙️ Industrial Sectors
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleNav('machines', 'Woodworking')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left font-bold text-slate-700 transition border border-slate-200 cursor-pointer"
                >
                  Woodworking
                </button>
                <button
                  onClick={() => handleNav('machines', 'Metalworking')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left font-bold text-slate-700 transition border border-slate-200 cursor-pointer"
                >
                  Metalworking & CNC
                </button>
                <button
                  onClick={() => handleNav('machines', 'Construction')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left font-bold text-slate-700 transition border border-slate-200 cursor-pointer"
                >
                  Construction Plant
                </button>
                <button
                  onClick={() => handleNav('machines', 'Power')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left font-bold text-slate-700 transition border border-slate-200 cursor-pointer"
                >
                  Diesel Generators
                </button>
                <button
                  onClick={() => handleNav('tools')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left font-bold text-slate-700 transition border border-slate-200 cursor-pointer"
                >
                  Power Tools
                </button>
                <button
                  onClick={() => handleNav('materials')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left font-bold text-slate-700 transition border border-slate-200 cursor-pointer"
                >
                  Raw Materials
                </button>
              </div>
            </div>

            {/* Services & Safety */}
            <div className="space-y-2.5">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider block">
                🛡️ Escrow & Services
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  onClick={() => {
                    setIsTermsModalOpen(true);
                    setIsOverlayOpen(false);
                  }}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>100% Escrow Terms & Guarantee</span>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-black">Verified</span>
                </button>

                <button
                  onClick={() => {
                    setIsMaintenanceAlertsOpen(true);
                    setIsOverlayOpen(false);
                  }}
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-[#8B1520] font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-[#8B1520]" />
                  <span>Maintenance Telemetry Alerts</span>
                </button>

                <button
                  onClick={() => {
                    setIsMtmAgentOpen(true);
                    setIsOverlayOpen(false);
                  }}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-amber-500" />
                  <span>MTM AI Industrial Agent</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setIsSellModalOpen(true);
                  setIsOverlayOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-extrabold text-xs shadow-md border border-[#7A101A]/30 text-center cursor-pointer"
              >
                + List Machine For Sale
              </button>
              <button
                onClick={() => handleNav('account')}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs text-center cursor-pointer border border-slate-200"
              >
                Account & Pro Rewards
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Fixed Bottom Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 text-slate-600 py-2 px-3 flex items-center justify-around shadow-lg">
        {/* Catalog */}
        <button
          onClick={() => handleNav('machines')}
          className={`flex flex-col items-center space-y-0.5 px-2 py-1 transition cursor-pointer ${
            activeView === 'machines' || activeView === 'home' ? 'text-[#8B1520] font-black' : 'hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Catalog</span>
        </button>

        {/* 3D VR Showroom */}
        <button
          onClick={() => setIsVrShowroomOpen(true)}
          className="flex flex-col items-center space-y-0.5 px-2 py-1 text-purple-600 hover:text-purple-700 transition cursor-pointer"
        >
          <Glasses className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] font-bold">3D / VR</span>
        </button>

        {/* Sell Machine */}
        <button
          onClick={() => setIsSellModalOpen(true)}
          className="flex flex-col items-center -mt-4 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#48060C] via-[#7A101A] to-[#D83A46] text-white flex items-center justify-center shadow-md border-2 border-white transition transform active:scale-95">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-[#8B1520] mt-0.5">Sell</span>
        </button>

        {/* Services & Escrow */}
        <button
          onClick={() => handleNav('services')}
          className={`flex flex-col items-center space-y-0.5 px-2 py-1 transition cursor-pointer ${
            activeView === 'services' ? 'text-emerald-700 font-black' : 'hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px]">Escrow</span>
        </button>

        {/* More Shortcuts Overlay Toggle */}
        <button
          onClick={() => setIsOverlayOpen(true)}
          className="flex flex-col items-center space-y-0.5 px-2 py-1 text-slate-700 hover:text-slate-900 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-bold">Shortcuts</span>
        </button>
      </div>
    </>
  );
};
