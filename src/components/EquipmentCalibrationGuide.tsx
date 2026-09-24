import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Wrench, 
  Compass, 
  RefreshCw, 
  Ruler, 
  Box, 
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface EquipmentCalibrationGuideProps {
  onClose?: () => void;
  machineTitle?: string;
  category?: string;
}

export const EquipmentCalibrationGuide: React.FC<EquipmentCalibrationGuideProps> = ({
  onClose,
  machineTitle = 'Industrial Equipment Unit',
  category = 'Industrial Machinery'
}) => {
  const { showToast } = useMarketplace();

  // Facility environment verification checklist items
  const [checklist, setChecklist] = useState([
    {
      id: 'surface',
      title: 'Flat Concrete / Epoxy Slab Floor Level',
      desc: 'Verify reinforced concrete slab (min 150mm depth) with surface tilt within ±2mm/meter.',
      checked: true,
      tag: 'Floor Foundation'
    },
    {
      id: 'power',
      title: '3-Phase 415V / 50Hz Electrical Drop',
      desc: 'Ensure dedicated circuit breaker (min 32A-63A depending on kVA) within 3.0 meters of installation point.',
      checked: true,
      tag: 'Electrical Power'
    },
    {
      id: 'pneumatic',
      title: 'Pneumatic Air Supply & Dust Extraction',
      desc: 'Connect 6-8 Bar clean dry compressed air line and 120mm dust extraction ducting if applicable.',
      checked: false,
      tag: 'Air & Exhaust'
    },
    {
      id: 'corridor',
      title: 'Factory Doorway & Forklift Access Corridor',
      desc: 'Confirm clear doorway passage (min 2.4m width x 2.6m height) from unloading bay to setup location.',
      checked: true,
      tag: 'Transport Access'
    },
    {
      id: 'safety',
      title: '1.5m Operator Safety & Perimeter Zone',
      desc: 'Ensure 1500mm clear perimeter around all moving spindles, sliding tables, and material outfeeds.',
      checked: false,
      tag: 'Safety Radius'
    }
  ]);

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [lightLevel, setLightLevel] = useState<number>(420); // Lux
  const [floorPlanLocked, setFloorPlanLocked] = useState<boolean>(true);

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const checkedCount = checklist.filter(i => i.checked).length;
  const readinessPercentage = Math.round((checkedCount / checklist.length) * 100);

  const handleRecalibrate = () => {
    setIsCalibrating(true);
    showToast('🔄 Recalibrating spatial camera sensors & ground plane reticle...');
    setTimeout(() => {
      setIsCalibrating(false);
      setLightLevel(Math.floor(380 + Math.random() * 120));
      setFloorPlanLocked(true);
      showToast('✅ Camera parallax & surface level recalibrated successfully (±1.5mm accuracy).');
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[#8B1520]">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-[#8B1520] border border-rose-200">
                Facility Readiness Checklist
              </span>
              <span className="text-xs text-slate-500 font-mono">1:1 Digital Setup Guide</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5 truncate max-w-md">
              Setup Guide: {machineTitle}
            </h3>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 border border-slate-200 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
        {/* Sensor & Camera Calibration Telemetry Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-slate-800">Digital AR/VR Sensor Telemetry</span>
            </div>
            <button
              onClick={handleRecalibrate}
              disabled={isCalibrating}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[#8B1520] border border-slate-200 text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin' : ''}`} />
              <span>{isCalibrating ? 'Calibrating...' : 'Recalibrate'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Ground Lock</span>
              <span className="font-extrabold text-emerald-700">{floorPlanLocked ? 'LOCKED (±1mm)' : 'Scanning'}</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Ambient Light</span>
              <span className="font-extrabold text-[#8B1520]">{lightLevel} Lux (Optimal)</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Parallax Drift</span>
              <span className="font-extrabold text-slate-700">0.02° Low</span>
            </div>
          </div>
        </div>

        {/* Facility Readiness Score Progress Bar */}
        <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-800">Facility Placement Readiness Score:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
              readinessPercentage >= 80 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {readinessPercentage}% Ready ({checkedCount}/{checklist.length} Verified)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                readinessPercentage >= 80 ? 'bg-emerald-600' : 'bg-[#8B1520]'
              }`} 
              style={{ width: `${readinessPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-600 italic">
            {readinessPercentage === 100 
              ? '🎉 All facility prerequisites verified! Your shop floor is ready for machinery delivery & placement.' 
              : 'Complete remaining checklist items to guarantee smooth installation and electrical safety compliance.'}
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Installation Prerequisites Verification:
          </span>

          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3.5 rounded-xl border transition flex items-start space-x-3 cursor-pointer select-none ${
                item.checked 
                  ? 'bg-emerald-50/50 border-emerald-300 text-slate-800' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition ${
                item.checked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-slate-50'
              }`}>
                {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-extrabold ${item.checked ? 'text-slate-900' : 'text-slate-700'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {item.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Standard Clearance Dimension Rules Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-[#8B1520] block flex items-center space-x-1.5">
            <Ruler className="w-4 h-4" />
            <span>Recommended Machine Clearance Matrix</span>
          </span>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block">Operator Front</span>
              <span className="font-extrabold text-slate-900 text-xs">min 1,500 mm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block">Motor Rear</span>
              <span className="font-extrabold text-slate-900 text-xs">min 800 mm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block">Height Overhead</span>
              <span className="font-extrabold text-slate-900 text-xs">min 2,800 mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-mono">
          MTM Industrial Setup Compliance Standard 2026
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#8B1520] hover:bg-[#72111A] text-white font-bold text-xs transition cursor-pointer"
          >
            Apply Calibration Data
          </button>
        )}
      </div>
    </div>
  );
};
