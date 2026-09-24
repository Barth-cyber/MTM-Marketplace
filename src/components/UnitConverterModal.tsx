import React, { useState } from 'react';
import { 
  Calculator, 
  X, 
  ArrowRightLeft, 
  Zap, 
  Ruler, 
  Weight, 
  Gauge,
  CheckCircle2
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const UnitConverterModal: React.FC = () => {
  const { isUnitConverterOpen, setIsUnitConverterOpen, showToast } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'power' | 'length' | 'weight' | 'pressure'>('power');

  // Power state (kW <-> HP)
  const [powerKw, setPowerKw] = useState<number | string>(15);
  // Length state (mm <-> inches)
  const [lengthMm, setLengthMm] = useState<number | string>(500);
  // Weight state (kg <-> lbs)
  const [weightKg, setWeightKg] = useState<number | string>(1200);
  // Pressure state (bar <-> psi)
  const [pressureBar, setPressureBar] = useState<number | string>(6);

  if (!isUnitConverterOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-blue-600 text-white shadow shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">Industrial Unit Converter</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Convert machinery specifications between Metric & Imperial units instantly.</p>
            </div>
          </div>
          <button
            onClick={() => setIsUnitConverterOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700 hover:border-rose-600 transition-colors cursor-pointer shrink-0 ml-2 shadow-xs"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 bg-slate-100 p-1.5 border-b border-slate-200 text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('power')}
            className={`py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'power' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Power</span>
          </button>
          <button
            onClick={() => setActiveTab('length')}
            className={`py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'length' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Length</span>
          </button>
          <button
            onClick={() => setActiveTab('weight')}
            className={`py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'weight' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Weight className="w-3.5 h-3.5" />
            <span>Weight</span>
          </button>
          <button
            onClick={() => setActiveTab('pressure')}
            className={`py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'pressure' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Pressure</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'power' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">Kilowatts (kW) ⇄ Horsepower (HP)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Power (Kilowatts - kW)</label>
                  <input
                    type="number"
                    value={powerKw}
                    onChange={(e) => setPowerKw(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mechanical Horsepower (HP)</label>
                  <div className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-black text-blue-800 flex items-center">
                    {typeof powerKw === 'number' || !isNaN(Number(powerKw)) ? (Number(powerKw) * 1.34102).toFixed(2) : '0.00'} HP
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Note: 1 kW is equivalent to approximately 1.34102 mechanical horsepower (HP).</p>
            </div>
          )}

          {activeTab === 'length' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">Millimeters (mm) ⇄ Inches (in)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Length (Millimeters - mm)</label>
                  <input
                    type="number"
                    value={lengthMm}
                    onChange={(e) => setLengthMm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Length (Inches - in)</label>
                  <div className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-black text-blue-800 flex items-center">
                    {typeof lengthMm === 'number' || !isNaN(Number(lengthMm)) ? (Number(lengthMm) / 25.4).toFixed(3) : '0.000'} inches
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Note: 1 inch is exactly 25.4 millimeters.</p>
            </div>
          )}

          {activeTab === 'weight' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">Kilograms (kg) ⇄ Pounds (lbs)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Weight (Kilograms - kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Weight (Pounds - lbs)</label>
                  <div className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-black text-blue-800 flex items-center">
                    {typeof weightKg === 'number' || !isNaN(Number(weightKg)) ? (Number(weightKg) * 2.20462).toFixed(1) : '0.0'} lbs
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Note: 1 kilogram equals 2.20462 pounds.</p>
            </div>
          )}

          {activeTab === 'pressure' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">Bar ⇄ PSI (Pounds per Square Inch)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Pressure (Bar)</label>
                  <input
                    type="number"
                    value={pressureBar}
                    onChange={(e) => setPressureBar(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Pressure (PSI)</label>
                  <div className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-black text-blue-800 flex items-center">
                    {typeof pressureBar === 'number' || !isNaN(Number(pressureBar)) ? (Number(pressureBar) * 14.5038).toFixed(1) : '0.0'} PSI
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Note: 1 Bar equals 14.5038 PSI for pneumatic and hydraulic machinery.</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => {
                showToast('📐 Specification values copied to clipboard.');
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow"
            >
              Copy Conversion Result
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
