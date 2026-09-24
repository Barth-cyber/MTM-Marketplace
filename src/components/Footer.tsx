import React from 'react';
import { ShieldCheck, MapPin, PhoneCall, Mail, Cpu, Layers, Wrench, ArrowRight, Bot, QrCode, Repeat } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const Footer: React.FC = () => {
  const { 
    setActiveView, 
    setSelectedCategory, 
    setFilterState, 
    setActiveProduct, 
    setIsAIAdvisorOpen, 
    setIsSellModalOpen, 
    setIsTermsModalOpen, 
    setIsMtmAgentOpen,
    setIsQrScannerOpen,
    setIsQuickReorderOpen,
    setIsPrototypesOpen,
    setPrototypeInitialRole
  } = useMarketplace();

  const handleNav = (view: string, cat = 'All') => {
    setActiveProduct(null);
    setActiveView(view);
    if (cat !== 'All') {
      setSelectedCategory(cat);
      setFilterState(prev => ({ ...prev, category: cat, subcategory: 'All' }));
    }
    // Smoothly scroll straight to the top of respective pages for ease of scrolling
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs pb-16 md:pb-0">
      {/* Top Value Banner */}
      <div className="border-b border-slate-100 py-8 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">MTM Process Guarantee</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                MTM guarantees the transaction process: payment protection, physical inspection/testing, delivery verification, defined 48hr trial, evidence-based dispute resolution & controlled release of funds.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Online E-Commerce Operations</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                Benin City, Edo State. Servicing sellers, buyers, suppliers, dealers, and the general public locally and internationally across industrial ecosystems.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <PhoneCall className="w-6 h-6 text-[#8B1520] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Heavy Equipment Helpline</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                +234 803 685 0229 (WhatsApp only), 8am to 5pm.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand Col */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-[#8B1520] text-white flex items-center justify-center font-black font-mono text-base italic shadow-xs">
              M
            </div>
            <div>
              <span className="font-black text-base text-slate-900">MTM - Marketplace</span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Industrial Procurement Platform</p>
            </div>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
            West Africa's multi-vendor marketplace for machines, tools, and industrial materials. Verified listings, physical inspections, escrow safety, and heavy freight.
          </p>
          <div className="pt-2 flex items-center space-x-3 text-slate-400 text-xs">
            <span>© 2025 MTM Industrial Technologies Ltd. All rights reserved.</span>
          </div>
        </div>

        {/* Col 2: Machines & Tools */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Equipment Sectors</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><button onClick={() => handleNav('machines', 'Machines')} className="hover:text-[#8B1520] transition cursor-pointer">Woodworking Machines</button></li>
            <li><button onClick={() => handleNav('machines', 'Machines')} className="hover:text-[#8B1520] transition cursor-pointer">Metalworking & Lathes</button></li>
            <li><button onClick={() => handleNav('machines', 'Machines')} className="hover:text-[#8B1520] transition cursor-pointer">Construction Plant</button></li>
            <li><button onClick={() => handleNav('machines', 'Machines')} className="hover:text-[#8B1520] transition cursor-pointer">Diesel Generators & Compressors</button></li>
            <li><button onClick={() => handleNav('tools', 'Tools')} className="hover:text-[#8B1520] transition cursor-pointer">Industrial Power Tools</button></li>
            <li><button onClick={() => handleNav('materials', 'Materials')} className="hover:text-[#8B1520] transition cursor-pointer">Structural Steel & Timber</button></li>
          </ul>
        </div>

        {/* Col 3: Services & Trust */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Services & Safety</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><button onClick={() => setIsMtmAgentOpen(true)} className="text-[#8B1520] font-bold hover:underline flex items-center space-x-1 cursor-pointer"><Bot className="w-3.5 h-3.5 text-amber-500 inline" /><span>MTM Agent Assistant</span></button></li>
            <li><button onClick={() => setIsQrScannerOpen(true)} className="text-amber-700 font-bold hover:underline flex items-center space-x-1 cursor-pointer"><QrCode className="w-3.5 h-3.5 text-amber-600 inline" /><span>Scan Asset QR & Escrow Seal</span></button></li>
            <li><button onClick={() => setIsQuickReorderOpen(true)} className="text-[#8B1520] font-bold hover:underline flex items-center space-x-1 cursor-pointer"><Repeat className="w-3.5 h-3.5 text-[#8B1520] inline" /><span>Quick Reorder Workshop Consumables</span></button></li>
            <li><button onClick={() => setIsTermsModalOpen(true)} className="text-[#8B1520] font-bold hover:underline flex items-center space-x-1 cursor-pointer"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" /><span>Escrow Terms & Agreement</span></button></li>
            <li><button onClick={() => handleNav('services')} className="hover:text-[#8B1520] transition cursor-pointer">Certified Physical Inspection</button></li>
            <li><button onClick={() => handleNav('services')} className="hover:text-[#8B1520] transition cursor-pointer">Heavy Crane & Low-Bed Freight</button></li>
            <li><button onClick={() => handleNav('about')} className="hover:text-[#8B1520] transition cursor-pointer">100% Escrow Protection</button></li>
            <li><button onClick={() => handleNav('deals')} className="hover:text-[#8B1520] transition cursor-pointer">Factory Plant Liquidations</button></li>
            <li><button onClick={() => setIsAIAdvisorOpen(true)} className="hover:text-[#8B1520] transition cursor-pointer">AI Generator kVA Calculator</button></li>
          </ul>
        </div>

        {/* Col 4: Vendors & Portal */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Vendors & Leaderboard</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><button onClick={() => handleNav('leaderboard')} className="text-amber-700 font-extrabold hover:underline cursor-pointer">🏆 Top Seller Leaderboard</button></li>
            <li><button onClick={() => setIsSellModalOpen(true)} className="text-[#8B1520] font-bold hover:underline cursor-pointer">Sell on MTM</button></li>
            <li><button onClick={() => handleNav('account')} className="hover:text-[#8B1520] transition cursor-pointer">Buyer & Seller Portal</button></li>
            <li><button onClick={() => handleNav('account')} className="hover:text-[#8B1520] transition cursor-pointer">Track Inspection Status</button></li>
            <li><button onClick={() => handleNav('account')} className="hover:text-[#8B1520] transition cursor-pointer">Manage RFQ Offers</button></li>
            <li><button onClick={() => handleNav('about')} className="hover:text-[#8B1520] transition cursor-pointer">About MTM Architecture</button></li>
            <li><button onClick={() => { setPrototypeInitialRole('admin'); setIsPrototypesOpen(true); }} className="hover:text-[#8B1520] transition cursor-pointer">Admin</button></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
