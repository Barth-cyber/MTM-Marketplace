import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Gavel, 
  FileCheck, 
  ArrowRight, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const ServicesView: React.FC = () => {
  const { setIsSellModalOpen, setIsAIAdvisorOpen, showToast, setActiveView } = useMarketplace();
  const [requestedQuote, setRequestedQuote] = useState(false);

  const handleRiggingQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestedQuote(true);
    showToast('Heavy Rigging & Logistics inquiry submitted to MTM Logistics Desk');
  };

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

      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-[#8B1520] font-bold text-xs uppercase tracking-wider">
          Industrial Support Infrastructure
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          Marketplace Services & Engineering Solutions
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
          MTM goes beyond listing equipment. We provide on-site technical inspection, heavy crane rigging, preventive maintenance, and plant liquidation services across Nigeria.
        </p>
      </div>

      {/* 4 Core Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service 1: Certified Physical Inspection */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">MTM Certified Physical Inspection</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never buy used machines blind. Our certified mechanical and electrical engineers visit the seller's workshop to conduct comprehensive on-load diagnostic testing.
            </p>
            <div className="space-y-1.5 pt-2 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dial gauge spindle runout & slideway flatness measurements</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Megger insulation test for motor windings and contactor coils</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>4K Video run-test stream & 42-point PDF signed certificate</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-700">From ₦45,000 / $30 per machine</span>
            <span className="text-slate-500">Available in all major Nigerian hubs</span>
          </div>
        </div>

        {/* Service 2: Heavy Logistics & Crane Rigging */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-rose-50 text-[#8B1520] border border-rose-200 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Heavy Rigging & Low-Bed Freight</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Moving a 5-ton CNC lathe or 10-ton press brake requires specialized logistics. MTM coordinates mobile crane lifting, skidding, and transit insurance.
            </p>
            <div className="space-y-1.5 pt-2 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8B1520]" />
                <span>20T - 50T Mobile crane hoisting and factory floor rigging</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8B1520]" />
                <span>Low-bed flatbed trailers with full transit cargo insurance</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8B1520]" />
                <span>Cross-state transport corridors (Lagos – Kano – PH – Abuja)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-[#8B1520]">Custom Distance Quotation</span>
            <span className="text-slate-500">48-Hour Deployment</span>
          </div>
        </div>

        {/* Service 3: Maintenance & Spare Parts Sourcing */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Servicing & Industrial Spare Parts</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ensure long equipment service life with MTM certified service partners. We source OEM and high-durability replacement parts across Nigerian industrial clusters.
            </p>
            <div className="space-y-1.5 pt-2 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>SKF/FAG precision spindle bearings and drive belts</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Hydraulic pump rebuilds and seal kit replacements</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>3-Phase inverter & PLC programming repair technicians</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-amber-700">On-Call Service Network</span>
            <span className="text-slate-500 font-bold">Benin City (Interior Duct Ltd) • Lagos • Kano • Aba • PH</span>
          </div>
        </div>

        {/* Service 4: Plant Liquidation & Consignment Auctions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
              <Gavel className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Factory Liquidation & Consignment</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upgrading your factory or closing a production facility? MTM manages asset cataloging, valuation, buyer verification, and bulk disposal.
            </p>
            <div className="space-y-1.5 pt-2 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Rapid liquidation to qualified industrial buyers</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Full asset tagging, condition grading and photography</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Escrow-settled bank disbursements with zero default risk</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="text-[#8B1520] font-bold hover:underline cursor-pointer"
            >
              List Factory Surplus →
            </button>
            <span className="text-slate-500">Custom Commission Models</span>
          </div>
        </div>
      </div>

      {/* Direct Rigging & Logistics Quote Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-[#8B1520]" />
            <span>Request Immediate Machinery Transport & Crane Quote</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Fill in machine weight, origin, and destination for a guaranteed logistics quote with transit insurance.
          </p>
        </div>

        {requestedQuote ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs space-y-2">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Quote Request Received by MTM Heavy Logistics Desk</span>
            </div>
            <p className="text-slate-600">
              Our freight logistics manager will contact you within 30 minutes with flatbed availability and mobile crane coordination.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRiggingQuote} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Equipment Type & Weight</label>
              <input
                type="text"
                required
                placeholder="e.g. SCM Panel Saw (1,200 kg)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#8B1520]"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Origin Hub / Address</label>
              <input
                type="text"
                required
                placeholder="e.g. Ikeja Industrial Estate, Lagos"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#8B1520]"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Destination Facility</label>
              <input
                type="text"
                required
                placeholder="e.g. Trans-Amadi, Port Harcourt"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#8B1520]"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs transition shadow-md border border-[#7A101A]/30 cursor-pointer"
              >
                Submit Freight & Crane Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
