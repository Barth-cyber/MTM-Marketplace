import React, { useState } from 'react';
import { 
  X, 
  Box, 
  Maximize2, 
  RotateCw, 
  Sliders, 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  ShieldCheck,
  Compass,
  ArrowRight,
  Ruler,
  AlertTriangle,
  Layers,
  Wrench,
  Check
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { EquipmentCalibrationGuide } from './EquipmentCalibrationGuide';

export const ArPlacementModal: React.FC = () => {
  const { isArPlacementOpen, setIsArPlacementOpen, activeProduct, formatPrice, showToast } = useMarketplace();
  const [scaleFactor, setScaleFactor] = useState(1.0); // 0.5x to 2.0x
  const [rotationAngle, setRotationAngle] = useState(0);
  const [floorSurface, setFloorSurface] = useState<'concrete' | 'industrial' | 'grid'>('concrete');
  const [isCapturing, setIsCapturing] = useState(false);
  const [showSafetyZone, setShowSafetyZone] = useState(true);
  const [showWallDistances, setShowWallDistances] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  if (!isArPlacementOpen || !activeProduct) return null;

  const floorBg = {
    concrete: 'bg-slate-800 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:16px_16px]',
    industrial: 'bg-stone-900 bg-[linear-gradient(to_right,#292524_1px,transparent_1px),linear-gradient(to_bottom,#292524_1px,transparent_1px)] [background-size:24px_24px]',
    grid: 'bg-zinc-950 bg-[linear-gradient(to_right,#3f3f46_1px,transparent_1px),linear-gradient(to_bottom,#3f3f46_1px,transparent_1px)] [background-size:32px_32px]'
  };

  // Base physical dimensions
  const baseL = 2.40;
  const baseW = 1.80;
  const baseH = 2.10;

  // Real-time scaled dimensions
  const calcL = (baseL * scaleFactor).toFixed(2);
  const calcW = (baseW * scaleFactor).toFixed(2);
  const calcH = (baseH * scaleFactor).toFixed(2);
  const floorAreaM2 = (parseFloat(calcL) * parseFloat(calcW)).toFixed(2);
  const floorAreaSqFt = (parseFloat(floorAreaM2) * 10.7639).toFixed(1);
  const safetyAreaM2 = ((parseFloat(calcL) + 3.0) * (parseFloat(calcW) + 3.0)).toFixed(2);

  const isOptimalFit = scaleFactor <= 1.25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[#8B1520]">
              <Box className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-50 text-[#8B1520] border border-rose-200 tracking-widest">
                  Augmented Reality (AR) Preview
                </span>
                <span className="text-xs text-slate-500">• Real-Time Measurement Overlay</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                {activeProduct.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-[#8B1520] hover:bg-rose-100 transition text-xs font-extrabold flex items-center space-x-1.5 cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-[#8B1520]" />
              <span className="hidden sm:inline">Calibration & Setup Guide</span>
              <span className="sm:hidden">Setup Guide</span>
            </button>

            <button
              onClick={() => setIsArPlacementOpen(false)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 border border-slate-200 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
              title="Close dialog"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Telemetry & Room Fit Banner */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 font-mono">
              <Ruler className="w-4 h-4 text-[#8B1520]" />
              <span className="text-slate-500">Footprint:</span>
              <span className="font-extrabold text-slate-900">{calcL}m (L) × {calcW}m (W) × {calcH}m (H)</span>
            </div>
            <div className="hidden md:flex items-center space-x-1.5 font-mono text-slate-500">
              <span>Area:</span>
              <span className="font-extrabold text-[#8B1520]">{floorAreaM2} m² ({floorAreaSqFt} sq ft)</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center space-x-1.5 ${
              isOptimalFit 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-50 text-amber-800 border border-amber-300'
            }`}>
              {isOptimalFit ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
              <span>{isOptimalFit ? 'FIT VERIFIED: >1.5m Room Clearance' : 'TIGHT FIT: Verify Left Clearance'}</span>
            </span>
          </div>
        </div>

        {/* AR Viewport Container */}
        <div className={`relative flex-1 min-h-[400px] flex items-center justify-center p-8 overflow-hidden ${floorBg[floorSurface]}`}>
          
          {/* Simulated Camera Feed Overlay Badge */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/95 border border-slate-200 text-xs text-slate-700 shadow-md backdrop-blur-md z-20">
            <Camera className="w-4 h-4 text-[#8B1520] animate-pulse" />
            <span>AR Camera Calibration Active • {scaleFactor.toFixed(1)}x Physical Scale</span>
          </div>

          {/* Floor Texture Selector */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/95 border border-slate-200 rounded-xl p-1 text-xs shadow-md z-20">
            {(['concrete', 'industrial', 'grid'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFloorSurface(f)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition cursor-pointer ${
                  floorSurface === f ? 'bg-[#8B1520] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Live Wall Measurement Vectors */}
          {showWallDistances && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              {/* Distance to Top Wall */}
              <div className="absolute top-12 flex flex-col items-center">
                <div className="h-10 border-l border-dashed border-[#8B1520]/60" />
                <span className="text-[10px] font-mono bg-white/95 border border-slate-200 text-[#8B1520] font-bold px-2 py-0.5 rounded shadow-xs">
                  Front Wall Distance: 2.35 m
                </span>
              </div>
              {/* Distance to Left Wall */}
              <div className="absolute left-8 flex items-center">
                <span className="text-[10px] font-mono bg-white/95 border border-slate-200 text-[#8B1520] font-bold px-2 py-0.5 rounded shadow-xs">
                  Left Pillar: 1.80 m
                </span>
                <div className="w-12 border-t border-dashed border-[#8B1520]/60" />
              </div>
              {/* Distance to Right Wall */}
              <div className="absolute right-8 flex items-center">
                <div className="w-12 border-t border-dashed border-[#8B1520]/60" />
                <span className="text-[10px] font-mono bg-white/95 border border-slate-200 text-[#8B1520] font-bold px-2 py-0.5 rounded shadow-xs">
                  Aisle Clearance: 2.10 m
                </span>
              </div>
            </div>
          )}

          {/* Dotted 1.5m Perimeter Safety Zone */}
          {showSafetyZone && (
            <div className="absolute w-80 sm:w-[420px] h-64 sm:h-72 border-2 border-dashed border-amber-500/80 rounded-3xl flex items-start justify-center p-2 pointer-events-none z-10 animate-pulse">
              <span className="text-[10px] font-mono text-amber-900 uppercase tracking-widest bg-amber-50 border border-amber-300 font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                ⚠️ 1.5m Safety Perimeter Radius ({safetyAreaM2} m² total zone)
              </span>
            </div>
          )}

          {/* 3D Machine Model Representation in AR Space */}
          <div 
            className="relative z-20 transition-transform duration-200 flex flex-col items-center select-none"
            style={{ 
              transform: `scale(${scaleFactor}) rotate(${rotationAngle}deg)`,
            }}
          >
            {/* Ground Shadow Effect */}
            <div className="absolute -bottom-6 w-3/4 h-8 bg-black/40 rounded-full blur-md filter" />

            {/* Bounding Box Dimension Overlay Callouts */}
            <div className="absolute -top-7 inset-x-0 flex justify-center">
              <span className="text-[10px] font-mono font-black text-[#8B1520] bg-white/95 border border-rose-200 px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                W: {calcW}m ({(parseFloat(calcW) * 3.28084).toFixed(1)}ft)
              </span>
            </div>

            <div className="absolute -left-12 inset-y-0 flex items-center">
              <span className="text-[10px] font-mono font-black text-[#8B1520] bg-white/95 border border-rose-200 px-2 py-0.5 rounded shadow-md whitespace-nowrap -rotate-90">
                L: {calcL}m
              </span>
            </div>

            <div className="bg-white/95 border-2 border-rose-300 rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-sm flex flex-col items-center text-center space-y-3 group">
              <div className="w-64 h-48 rounded-xl overflow-hidden relative border border-slate-200 shadow-inner">
                <img 
                  src={activeProduct.images[0]} 
                  alt={activeProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-rose-950/10 mix-blend-overlay" />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white/90 text-[10px] font-mono text-[#8B1520] font-bold border border-rose-200 shadow-xs">
                  Real-Time: {calcL}m × {calcW}m × {calcH}m
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#8B1520] uppercase tracking-wider block">
                  {activeProduct.category}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{activeProduct.title}</h4>
                <p className="text-emerald-700 font-black text-sm mt-0.5">
                  {formatPrice(activeProduct.priceNGN, activeProduct.priceUSD)}
                </p>
              </div>
            </div>
          </div>

          {/* AR Floor Reticle */}
          <div className="absolute bottom-6 w-52 h-12 border-2 border-dashed border-rose-400/80 rounded-full flex items-center justify-center animate-pulse pointer-events-none z-10">
            <span className="text-[10px] font-mono text-[#8B1520] font-bold uppercase tracking-widest bg-white/90 px-2 py-0.5 rounded border border-rose-200 shadow-xs">
              AR Floor Plane Locked
            </span>
          </div>
        </div>

        {/* Measurement Toggles & AR Controls Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Scale Slider */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-bold">Scale:</span>
              <input 
                type="range" 
                min="0.6" 
                max="1.6" 
                step="0.05" 
                value={scaleFactor}
                onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
                className="w-28 accent-[#8B1520] cursor-pointer"
              />
              <span className="text-xs font-mono text-[#8B1520] font-bold">{scaleFactor.toFixed(2)}x</span>
            </div>

            {/* Rotation Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-bold">Rotate:</span>
              <button
                onClick={() => setRotationAngle(prev => (prev + 45) % 360)}
                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition flex items-center space-x-1 text-xs font-bold cursor-pointer shadow-2xs"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{rotationAngle}°</span>
              </button>
            </div>

            {/* Safety Radius Overlay Toggle */}
            <button
              onClick={() => setShowSafetyZone(!showSafetyZone)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 border cursor-pointer ${
                showSafetyZone ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Safety Radius (1.5m)</span>
            </button>

            {/* Wall Distance Overlay Toggle */}
            <button
              onClick={() => setShowWallDistances(!showWallDistances)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 border cursor-pointer ${
                showWallDistances ? 'bg-rose-50 border-rose-300 text-[#8B1520]' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ruler className="w-3.5 h-3.5 text-[#8B1520]" />
              <span>Wall Distance Tape</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsCapturing(true);
                setTimeout(() => {
                  setIsCapturing(false);
                  showToast(`📸 AR Measurement snapshot saved! Footprint: ${calcL}m x ${calcW}m.`);
                }, 800);
              }}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Camera className="w-4 h-4 text-[#8B1520]" />
              <span>{isCapturing ? 'Capturing...' : 'Save AR Snapshot'}</span>
            </button>

            <button
              onClick={() => {
                setIsArPlacementOpen(false);
                showToast(`✓ Floor space verified (${calcL}m x ${calcW}m) for ${activeProduct.title.slice(0, 25)}... Ready for order.`);
              }}
              className="px-5 py-2 rounded-xl bg-[#8B1520] hover:bg-[#72111A] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow cursor-pointer"
            >
              <span>Confirm Shop Fit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Equipment Calibration & Setup Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <EquipmentCalibrationGuide 
            onClose={() => setIsGuideOpen(false)} 
            machineTitle={activeProduct.title}
            category={activeProduct.category}
          />
        </div>
      )}
    </div>
  );
};
