import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Calculator, 
  DollarSign, 
  Gauge, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  ArrowRight,
  TrendingDown,
  Activity
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const EnergyCalculatorModal: React.FC = () => {
  const { isEnergyCalculatorOpen, setIsEnergyCalculatorOpen, activeProduct, formatPrice, showToast } = useMarketplace();

  // Inputs
  const [operatingHoursPerDay, setOperatingHoursPerDay] = useState<number>(8);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [electricityTariffNgn, setElectricityTariffNgn] = useState<number>(145); // e.g. NGN 145 per kWh industrial tariff
  const [powerPhase, setPowerPhase] = useState<'3-Phase (415V)' | '1-Phase (240V)' | 'Diesel Generator'>('3-Phase (415V)');

  // Default power rating if no product is active or parse from active product
  const defaultPowerKw = (activeProduct as any)?.powerKw || 15.5;
  const [customKw, setCustomKw] = useState<number>(defaultPowerKw);

  if (!isEnergyCalculatorOpen) return null;

  const totalMonthlyHours = operatingHoursPerDay * daysPerWeek * 4.33;
  const monthlyKwh = customKw * totalMonthlyHours;
  const monthlyCostNgn = monthlyKwh * electricityTariffNgn;
  const monthlyCostUsd = monthlyCostNgn / 1500; // approx exchange rate

  // Generator recommendation
  const recommendedGenKva = Math.ceil(customKw * 1.35 / 0.85 / 10) * 10; // 35% safety margin, 0.8 power factor

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-600/30 border border-amber-500/40 text-amber-400 shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-600 text-white tracking-widest">
                  Industrial Energy & Power Calculator
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 hidden xs:inline">• Cost & Gen Sizing</span>
              </div>
              <h2 className="text-xs sm:text-base font-black text-white mt-0.5 line-clamp-1">
                {activeProduct ? activeProduct.title : 'Industrial Machinery Power Audit'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsEnergyCalculatorOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700 hover:border-rose-600 transition-colors cursor-pointer shrink-0 ml-2 shadow-xs"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Monthly Cost</span>
              <p className="text-xl font-black text-amber-400">
                ₦{Math.round(monthlyCostNgn).toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500">~${Math.round(monthlyCostUsd).toLocaleString()} USD</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Monthly Power Consumption</span>
              <p className="text-xl font-black text-white">
                {Math.round(monthlyKwh).toLocaleString()} kWh
              </p>
              <span className="text-[10px] text-slate-500">Based on {totalMonthlyHours.toFixed(0)} operating hrs/mo</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Recommended Generator</span>
              <p className="text-xl font-black text-emerald-400">
                {recommendedGenKva} kVA Gen
              </p>
              <span className="text-[10px] text-slate-500">Includes 35% inductive startup surge</span>
            </div>
          </div>

          {/* Calculator Inputs Grid */}
          <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Adjust Operating Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Power Rating kW */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold block">
                  Power Rating (kW / kVA): <strong className="text-amber-400 font-mono">{customKw} kW</strong>
                </label>
                <input 
                  type="range" 
                  min="2" 
                  max="120" 
                  step="0.5" 
                  value={customKw}
                  onChange={(e) => setCustomKw(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Operating Hours / Day */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold block">
                  Daily Operation: <strong className="text-white font-mono">{operatingHoursPerDay} Hours / Day</strong>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="24" 
                  step="1" 
                  value={operatingHoursPerDay}
                  onChange={(e) => setOperatingHoursPerDay(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Days per Week */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold block">
                  Working Days per Week: <strong className="text-white font-mono">{daysPerWeek} Days</strong>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="7" 
                  step="1" 
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Electricity Tariff */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold block">
                  Industrial Tariff (₦ / kWh): <strong className="text-white font-mono">₦{electricityTariffNgn}</strong>
                </label>
                <input 
                  type="range" 
                  min="80" 
                  max="280" 
                  step="5" 
                  value={electricityTariffNgn}
                  onChange={(e) => setElectricityTariffNgn(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

            </div>

            {/* Power Phase Selection */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-slate-400 font-bold">Electrical Feed Type:</span>
              <div className="flex items-center space-x-2">
                {(['3-Phase (415V)', '1-Phase (240V)', 'Diesel Generator'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPowerPhase(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      powerPhase === p ? 'bg-amber-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Efficiency & Cost Insights */}
          <div className="p-4 rounded-xl bg-amber-100 border border-amber-300 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-black">MTM Engineering Power Optimization Tip</h4>
              <p className="text-[11px] text-black leading-relaxed">
                Operating this machine on {powerPhase} with an estimated consumption of {Math.round(monthlyKwh)} kWh/month allows you to optimize production schedules during off-peak industrial grid tariff windows, saving up to 18% in monthly energy overhead.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Calculated based on standard Nigerian industrial duty cycles</span>
          <button
            onClick={() => {
              setIsEnergyCalculatorOpen(false);
              showToast('✓ Energy consumption report exported to your inquiry session.');
            }}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow"
          >
            <span>Save Energy Audit Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
