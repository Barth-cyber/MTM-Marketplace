import React from 'react';
import { ShieldCheck, Cpu, Zap, Truck, CheckCircle2, Award, Building2, Layers, Flame, ArrowLeft } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const AboutView: React.FC = () => {
  const { setIsSellModalOpen, setIsAIAdvisorOpen, setActiveView } = useMarketplace();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
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

      {/* Hero */}
      <div className="border-b border-slate-200 pb-8 space-y-4 max-w-4xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#8B1520] text-xs font-bold">
          <span>THE INDUSTRIAL MARKETPLACE BLUEPRINT</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Integrating Modern Marketplace Innovation with Industrial Machinery Realities
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          MTM - Marketplace is West Africa's specialized multi-vendor marketplace designed specifically for industrial workshops, factories, contractors, and artisans.
        </p>
      </div>

      {/* The 4 Marketplace Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center space-x-3 text-[#8B1520] font-bold text-base">
            <Cpu className="w-5 h-5" />
            <h3>Specialist Industrial Information Architecture</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Industrial machinery cannot be listed like consumer goods. MTM indexes equipment by exact engineering parameters: operating voltages, 3-phase grid compatibility, generator kVA requirements, spindle runout tolerances, working hours, and certified mechanical condition.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center space-x-3 text-emerald-700 font-bold text-base">
            <ShieldCheck className="w-5 h-5" />
            <h3>Transaction Process Guarantee & Escrow Safety</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            MTM guarantees the <strong>transaction process</strong> rather than guaranteeing that every machine is safe or mechanically perfect. Buyers receive robust process protection: secure escrow payment holding, certified physical inspection/testing, delivery verification, a defined 48-hour trial window, evidence-based dispute resolution, and controlled release of funds only upon buyer confirmation.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center space-x-3 text-blue-700 font-bold text-base">
            <Truck className="w-5 h-5" />
            <h3>Heavy Crane Rigging & Freight Network</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Moving industrial machines requires specialized flatbed trailers and mobile crane rigging. MTM bridges industrial corridors across Lagos (Ikeja, Ikorodu), Kano (Bompai), Port Harcourt (Trans-Amadi), Ibadan, Kaduna, and Aba.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center space-x-3 text-amber-700 font-bold text-base">
            <Zap className="w-5 h-5" />
            <h3>AI Equipment Advisor & Generator Matching</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            MTM calculates generator startup inrush requirements, matches complete factory machine packages according to capex budget, and evaluates local spare part availability in Nigerian markets.
          </p>
        </div>
      </div>

      {/* Escrow Workflow Visual */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 text-center sm:text-left">
          How MTM Guaranteed Escrow Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 relative">
            <span className="w-6 h-6 rounded-md bg-[#8B1520] text-white font-black flex items-center justify-center text-xs shadow-xs">1</span>
            <h4 className="font-bold text-slate-900">Buyer Locks Funds</h4>
            <p className="text-slate-500 text-[11px] leading-snug">Buyer deposits funds into MTM Guaranteed Escrow account via verified transfer.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 relative">
            <span className="w-6 h-6 rounded-md bg-[#8B1520] text-white font-black flex items-center justify-center text-xs shadow-xs">2</span>
            <h4 className="font-bold text-slate-900">Physical On-Site Test</h4>
            <p className="text-slate-500 text-[11px] leading-snug">MTM mechanical engineer inspects machine under load and uploads report to portal.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 relative">
            <span className="w-6 h-6 rounded-md bg-[#8B1520] text-white font-black flex items-center justify-center text-xs shadow-xs">3</span>
            <h4 className="font-bold text-slate-900">Flatbed Freight Dispatch</h4>
            <p className="text-slate-500 text-[11px] leading-snug">Specialized rigging team loads and transports machine directly to buyer factory.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 relative">
            <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-black flex items-center justify-center text-xs shadow-xs">4</span>
            <h4 className="font-bold text-emerald-700">Controlled Fund Release</h4>
            <p className="text-slate-500 text-[11px] leading-snug">Buyer verifies delivery & 48hr trial; funds disburse to seller bank within 24 hours.</p>
          </div>
        </div>

        {/* Legal Process Distinction Callout */}
        <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl text-xs space-y-1">
          <span className="font-extrabold text-[#8B1520] uppercase tracking-wider text-[10px]">Legal Framework & Process Guarantee Notice</span>
          <p className="text-slate-700 leading-relaxed">
            MTM does not represent or warrant that every used machine listed is mechanically perfect or safe. Instead, MTM guarantees the <strong>transaction process</strong>: payment protection in escrow, physical inspection/testing, delivery verification, a defined 48-hour trial window, evidence-based dispute resolution, and controlled release of funds.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-slate-900">Ready to equip your workshop or sell machinery?</h3>
          <p className="text-xs text-slate-600">Join over 1,200 verified workshops and factories using MTM across Nigeria.</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsSellModalOpen(true)}
            className="px-5 py-2.5 rounded-lg bg-[#8B1520] hover:bg-[#72111A] text-white font-bold text-xs transition shadow-xs cursor-pointer"
          >
            Sell Your Equipment
          </button>
          <button
            onClick={() => setIsAIAdvisorOpen(true)}
            className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 transition shadow-xs cursor-pointer"
          >
            AI Workshop Planner
          </button>
        </div>
      </div>
    </div>
  );
};
