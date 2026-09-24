import React, { useState, useEffect } from 'react';
import { 
  X, 
  Glasses, 
  Sparkles, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Cpu, 
  Activity, 
  Gauge, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Armchair,
  Wrench,
  Compass,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { EquipmentCalibrationGuide } from './EquipmentCalibrationGuide';
import { audioEffects } from '../utils/audioEffects';

interface VRShowroomModalProps {
  onClose?: () => void;
  initialMachineId?: string;
}

interface VRHeavyModel {
  id: string;
  name: string;
  category: string;
  priceNGN: number;
  priceUSD: number;
  motorKw: string;
  voltage: string;
  amperage: string;
  spindleRpm: string;
  acousticDb: string;
  weight: string;
  hubLocation: string;
  imageUrl: string;
  hotspots: {
    title: string;
    specTag: string;
    specValue: string;
    categoryTag: string;
    description: string;
    x: number;
    y: number;
  }[];
  audioEffectDescription: string;
}

const VR_HEAVY_MODELS: VRHeavyModel[] = [
  {
    id: 'vr-scm-panel-saw',
    name: 'SCM SI 400 Nova Sliding Table Panel Saw',
    category: 'Joinery & Woodworking',
    priceNGN: 14800000,
    priceUSD: 9866,
    motorKw: '7.5 kW (10 HP)',
    voltage: '415V / 3-Phase',
    amperage: '16.8 Amps Continuous',
    spindleRpm: '4,000 / 5,000 RPM',
    acousticDb: '78 dB Under Load',
    weight: '1,100 kg Cast-Iron Frame',
    hubLocation: 'Lagos & Kano Hubs',
    imageUrl: '/images/scm_panel_saw_1790001707902.jpg',
    hotspots: [
      { 
        title: 'Main Spindle Induction Motor', 
        specTag: '415V Power Requirement', 
        specValue: '415V 3-Phase · 16.8A Continuous', 
        categoryTag: 'ELECTRICAL & MOTOR',
        description: '7.5kW heavy copper-wound induction motor with dynamic electronic braking and star-delta automatic starter.', 
        x: 48, 
        y: 52 
      },
      { 
        title: 'Prismatic Sliding Carriage', 
        specTag: 'CNC Precision Grade', 
        specValue: 'Tolerance: ±0.01mm / 3.2m travel', 
        categoryTag: 'GUIDEWAY RIGIDITY',
        description: 'Hardened ground steel guideways with arc-welded honeycomb chassis for zero deflection during continuous heavy sheet cuts.', 
        x: 26, 
        y: 68 
      },
      { 
        title: 'Micro-Adjustable Digital Rip Fence', 
        specTag: 'Optical DRO Telemetry', 
        specValue: 'Digital Readout · 0.05mm Micro-Drive', 
        categoryTag: 'TOLERANCE READOUT',
        description: 'Micro-adjustable digital DRO with optical magnetic encoder precision and pneumatic position locking.', 
        x: 74, 
        y: 40 
      },
      {
        title: 'Independent Scoring Unit Assembly',
        specTag: 'High-Speed Blade Drive',
        specValue: '9,200 RPM · 0.75 kW Motor',
        categoryTag: 'CUTTING ASSEMBLY',
        description: 'Dual-blade anti-chipping scoring blade ensures laminate and veneered boards cut without tear-out.',
        x: 52,
        y: 62
      }
    ],
    audioEffectDescription: 'High-torque spindle wind-up with smooth carbide cut resonance',
  },
  {
    id: 'vr-cnc-lathe',
    name: 'Heavy-Duty 3-Phase Precision CNC Metal Lathe',
    category: 'Metalworking & Machining',
    priceNGN: 18500000,
    priceUSD: 12333,
    motorKw: '11.0 kW Spindle Motor',
    voltage: '415V / 3-Phase',
    amperage: '24.2 Amps Full Load',
    spindleRpm: '2,800 Max Programmable RPM',
    acousticDb: '74 dB Machining Grade',
    weight: '2,850 kg Monoblock Cast Bed',
    hubLocation: 'Kano Industrial Hub',
    imageUrl: '/images/cnc_metal_lathe_1790001722561.jpg',
    hotspots: [
      { 
        title: 'Tempered Hydraulic 3-Jaw Chuck', 
        specTag: 'CNC Precision Grade', 
        specValue: 'Concentricity: 0.005mm · DIN 8605', 
        categoryTag: 'CHUCK TOLERANCE',
        description: 'Precision tempered steel gripping jaws with hydraulic self-centering clamp rated for high centrifugal RPM.', 
        x: 38, 
        y: 46 
      },
      { 
        title: 'Induction-Hardened V-Slideways', 
        specTag: 'Cast-Iron High Mass Rigidity', 
        specValue: 'HRC 52-55 Surface Hardness', 
        categoryTag: 'STRUCTURAL BED',
        description: 'Induction-hardened & precision ground V-guideways with automatic oil injection lubrication and Turcite-B coating.', 
        x: 62, 
        y: 64 
      },
      { 
        title: 'Multi-Axis CNC Control Console', 
        specTag: '415V Power Requirement', 
        specValue: '415V · 11 kW High Torque Vector Drive', 
        categoryTag: 'G-CODE TELEMETRY',
        description: 'Multi-axis digital display with live G-code interpolation, spindle tachometer telemetry, and feed-rate monitoring.', 
        x: 80, 
        y: 32 
      },
      {
        title: '8-Station Automatic Tool Turret',
        specTag: 'Rapid Indexing Unit',
        specValue: '0.4s Tool Change · Servomotor Index',
        categoryTag: 'TOOLING STATION',
        description: 'High-rigidity bi-directional servo tool turret with high-pressure internal coolant manifold for carbide inserts.',
        x: 48,
        y: 40
      }
    ],
    audioEffectDescription: 'Deep mechanical spindle spin with intermittent coolant spray hum',
  },
  {
    id: 'vr-perkins-gen',
    name: 'Perkins 100kVA Heavy Soundproof Diesel Generator',
    category: 'Heavy Power & Plants',
    priceNGN: 22400000,
    priceUSD: 14933,
    motorKw: '80 kW / 100 kVA Prime',
    voltage: '415V / 240V Dual Output',
    amperage: '139 Amps / Phase',
    spindleRpm: '1,500 RPM Synchronous',
    acousticDb: '68 dB Super Soundproof',
    weight: '1,650 kg Acoustic Steel Canopy',
    hubLocation: 'Port Harcourt Hub',
    imageUrl: '/images/perkins_gen_1790001737200.jpg',
    hotspots: [
      { 
        title: 'Turbocharged Diesel Power Unit', 
        specTag: '415V Power Requirement', 
        specValue: '415V / 240V · 139A Continuous Delivery', 
        categoryTag: 'ENGINE & PRIME POWER',
        description: 'Perkins 4-cylinder direct-injection turbocharged engine with electronic governor and high-efficiency radiator cooling.', 
        x: 42, 
        y: 44 
      },
      { 
        title: 'Stamford Class-H Copper Alternator', 
        specTag: '100% Pure Copper Windings', 
        specValue: 'SX460 Electronic AVR · ±1.0% Regulation', 
        categoryTag: 'ALTERNATOR SPEC',
        description: '100% Class-H insulated copper windings with brushless exciter, designed for high starting inrush loads and tropical humidity.', 
        x: 68, 
        y: 52 
      },
      { 
        title: 'Deep Sea DSE 6120 AMF Control Panel', 
        specTag: 'Automatic Synchronization', 
        specValue: 'AMF Auto-Mains Transfer · Remote Telemetry', 
        categoryTag: 'DIGITAL CONTROLLER',
        description: 'Automatic Mains Failure (AMF) auto-sync module with live voltage monitoring, oil pressure cutouts, and frequency logging.', 
        x: 22, 
        y: 38 
      },
      {
        title: 'Acoustic Sound-Dampening Canopy',
        specTag: 'Acoustic Noise Attenuation',
        specValue: '68 dB @ 7m · Galvanized Steel',
        categoryTag: 'SOUNDPROOF ENCLOSURE',
        description: 'Heavy-duty weather-sealed acoustic canopy with fire-retardant foam lining and residential internal silencer.',
        x: 55,
        y: 28
      }
    ],
    audioEffectDescription: 'Heavy low-frequency turbo-diesel rhythmic purr with acoustic dampening',
  },
  {
    id: 'vr-lincoln-welder',
    name: 'Lincoln Power Wave S500 Multi-Process Welder',
    category: 'Metal Welding & Fabrication',
    priceNGN: 8200000,
    priceUSD: 5466,
    motorKw: '22 kVA Max Input',
    voltage: '380V - 460V 3-Phase',
    amperage: '500A @ 60% Duty Cycle',
    spindleRpm: 'High Frequency Inverter',
    acousticDb: '55 dB Silent Cooling',
    weight: '72 kg Rugged Steel Housing',
    hubLocation: 'Benin City (Interior Duct Ltd)',
    imageUrl: '/images/welding_machine_1790001750091.jpg',
    hotspots: [
      { 
        title: 'Power Wave Digital Inverter Engine', 
        specTag: '415V Power Requirement', 
        specValue: '380V - 460V 3-Phase · 500A @ 60%', 
        categoryTag: 'POWER SOURCE',
        description: 'Waveform Control Technology dynamically modifies the arc waveform for ultra-low spatter across steel and structural aluminum.', 
        x: 48, 
        y: 36 
      },
      { 
        title: 'Heavy Solid Brass DINSE Terminals', 
        specTag: 'CNC Precision Grade', 
        specValue: '600A Continuous · Zero Voltage Drop', 
        categoryTag: 'OUTPUT COUPLING',
        description: 'Solid machined brass DINSE 70/95 high-amperage connection lugs with thermal-resistant phenolic insulators.', 
        x: 65, 
        y: 72 
      },
      { 
        title: '4-Roll Planetary Drive Wire Feeder', 
        specTag: 'Tachometer Feeder Stabilization', 
        specValue: '1.5 - 28 m/min · Anti-Birdnesting', 
        categoryTag: 'WIRE DRIVE UNIT',
        description: '4-roll planetary drive system with digital optical tachometer for steady, slip-free wire delivery in heavy industrial fabrication.', 
        x: 30, 
        y: 56 
      },
      {
        title: 'Intelligent Cool-Arc Water Cooler Unit',
        specTag: 'Thermal Duty Stabilization',
        specValue: '100% Water-Cooled Duty Cycle at 450A',
        categoryTag: 'COOLING RADIATOR',
        description: 'Integrated centrifugal coolant pump and copper fin radiator to keep MIG/TIG torches operating without thermal degradation.',
        x: 75,
        y: 58
      }
    ],
    audioEffectDescription: 'High-frequency electric arc sizzle and pulse modulation resonance',
  },
  {
    id: 'vr-kdt-edgebander',
    name: 'KDT Automatic Heavy-Duty High-Speed Edge Bander',
    category: 'Furniture Plant Machinery',
    priceNGN: 16200000,
    priceUSD: 10800,
    motorKw: '14.5 kW Total Power',
    voltage: '415V / 3-Phase',
    amperage: '28.5 Amps',
    spindleRpm: '12,000 RPM High-Speed Trimmers',
    acousticDb: '76 dB Controlled Noise',
    weight: '2,200 kg Rigid Beam Frame',
    hubLocation: 'Benin City Hub',
    imageUrl: '/images/edge_bander_banner.jpg',
    hotspots: [
      { 
        title: 'Teflon Quick-Melt Glue Pot', 
        specTag: '415V Power Requirement', 
        specValue: '415V 3-Phase · 14.5 kW Connected Plant Power', 
        categoryTag: 'THERMAL APPLICATION',
        description: 'Non-stick Teflon pneumatic glue applicator with digital PID thermostat and rapid 12-minute quick-melt cartridge system.', 
        x: 34, 
        y: 48 
      },
      { 
        title: 'Dual High-Speed End Trimming Units', 
        specTag: 'CNC Precision Grade', 
        specValue: 'Dual 12,000 RPM Motors · Prismatic Linear Rails', 
        categoryTag: 'HIGH-SPEED SPINDLE',
        description: 'Twin high-frequency 12,000 RPM motors riding on hardened prismatic linear bearing tracks for flush edge cutoff.', 
        x: 55, 
        y: 42 
      },
      { 
        title: 'Dual Buffing & Polishing Station', 
        specTag: 'Surface Finish Spec', 
        specValue: 'Cotton Buffers · Automatic Chemical Mist', 
        categoryTag: 'FINISHING UNIT',
        description: 'Dual counter-rotating cotton buffing heads with automated release agent mist for spotless high-gloss panel edges.', 
        x: 78, 
        y: 58 
      },
      {
        title: 'Chain-Feed Track & Top Pressure Beam',
        specTag: 'High-Traction Conveyance',
        specValue: 'Feed Rate: 16-23 m/min · Dual Rubber Rollers',
        categoryTag: 'FEED MECHANISM',
        description: 'Heavy cast-iron track with vulcanized non-slip rubber pads to carry panels through trimming without surface scratching.',
        x: 22,
        y: 64
      }
    ],
    audioEffectDescription: 'Dual high-speed pneumatic trimming buzz with feed chain hum',
  }
];

export const VrShowroomModal: React.FC<VRShowroomModalProps> = ({ onClose, initialMachineId }) => {
  const { 
    isVrShowroomOpen, 
    setIsVrShowroomOpen, 
    products, 
    setActiveProduct, 
    formatPrice, 
    showToast,
    setActiveView,
    setFilterState
  } = useMarketplace();

  const [selectedMachine, setSelectedMachine] = useState<VRHeavyModel>(() => {
    return VR_HEAVY_MODELS.find(m => m.id === initialMachineId) || VR_HEAVY_MODELS[0];
  });

  const [rotationAngle, setRotationAngle] = useState(15);
  const [isRotating, setIsRotating] = useState(false);
  const [viewMode, setViewMode] = useState<'solid' | 'thermal' | 'wireframe' | 'internal'>('solid');
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Auto-rotation simulation when active
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isRotating]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsVrShowroomOpen(false);
    }
  };

  // Guard if controlled via Context and closed
  if (!onClose && !isVrShowroomOpen) return null;

  const handleInspectMachine = (searchTag: string) => {
    handleClose();
    setActiveProduct(null);
    setFilterState(prev => ({ ...prev, search: searchTag, category: 'Machines' }));
    setActiveView('machines');
  };

  const handleSelectMachineModel = (machine: VRHeavyModel) => {
    audioEffects.playHotspotSelectSound();
    setSelectedMachine(machine);
    setActiveHotspot(null);
    setHoveredHotspot(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-6xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* VR HUD Header Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 relative z-20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-50 text-[#8B1520] border border-rose-200 shadow-xs">
              <Glasses className="w-5 h-5 text-[#8B1520]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-50 text-[#8B1520] border border-rose-200 font-mono">
                  VR 360° ENGINE
                </span>
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Holographic Diagnostics
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                MTM Immersive Virtual Machinery Showroom
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Calibration Guide */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#8B1520] hover:bg-slate-50 transition text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-3xs"
            >
              <Wrench className="w-3.5 h-3.5 text-[#8B1520]" />
              <span className="hidden sm:inline">Calibration Specs</span>
            </button>

            {/* Audio Simulation Button */}
            <button
              onClick={() => {
                setIsAudioActive(!isAudioActive);
                showToast(isAudioActive ? 'Sound simulation muted' : '🔊 Machinery acoustic simulation active');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border shadow-3xs ${
                isAudioActive 
                  ? 'bg-[#8B1520] text-white border-[#72111A]' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isAudioActive ? 'Sound Sim ON' : 'Sound Sim OFF'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-white hover:bg-rose-600 hover:text-white text-slate-600 hover:border-rose-600 transition-colors cursor-pointer border border-slate-200 shadow-xs"
              title="Close dialog"
              aria-label="Close VR Showroom"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Machine Selector Tabs Bar */}
        <div className="bg-slate-50/50 border-b border-slate-200 px-4 sm:px-6 py-2.5 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#8B1520]" />
            <span>Select Model:</span>
          </span>
          {VR_HEAVY_MODELS.map((machine) => {
            const isSelected = selectedMachine.id === machine.id;
            return (
              <button
                key={machine.id}
                onClick={() => handleSelectMachineModel(machine)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-2 border shadow-3xs ${
                  isSelected
                    ? 'bg-rose-50 text-[#8B1520] border-[#8B1520]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{machine.name.split(' ')[0]} {machine.name.split(' ')[1]}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isSelected ? 'bg-white text-[#8B1520] border border-rose-200' : 'bg-slate-100 text-slate-500'}`}>
                  {machine.voltage.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main VR Visual Stage & Control Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 min-h-[460px]">
          
          {/* 360° Visual Render Canvas Stage (8 cols) */}
          <div className="lg:col-span-8 bg-slate-100/60 relative flex flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-hidden select-none">
            
            {/* Background Holographic Grid Effect */}
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Environment Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/95 border border-slate-200 text-[11px] font-bold text-slate-800 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Hub: {selectedMachine.hubLocation}</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/95 border border-slate-200 text-[10px] font-mono text-slate-700 shadow-xs">
                Orbit: {rotationAngle}°
              </span>
            </div>

            {/* View Mode Switcher Pill */}
            <div className="absolute top-4 right-4 z-10 flex items-center bg-white/95 border border-slate-200 p-1 rounded-xl backdrop-blur-md gap-1 shadow-xs">
              {[
                { id: 'solid', label: 'Solid 3D' },
                { id: 'thermal', label: 'Thermal Motor' },
                { id: 'wireframe', label: 'Tolerance Grid' },
                { id: 'internal', label: 'X-Ray Bearings' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition cursor-pointer ${
                    viewMode === mode.id 
                      ? 'bg-[#8B1520] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Center Heavy Machine Render Platform */}
            <div 
              className="relative w-full max-w-lg aspect-video rounded-2xl overflow-visible border border-slate-200 shadow-md bg-white transition-all duration-300"
              style={{
                transform: `scale(${zoomLevel}) perspective(1000px) rotateY(${((rotationAngle % 60) - 30) * 0.3}deg)`,
                filter: viewMode === 'thermal' 
                  ? 'hue-rotate(290deg) contrast(175%) saturate(200%)' 
                  : viewMode === 'wireframe' 
                  ? 'grayscale(80%) invert(20%) contrast(150%)' 
                  : viewMode === 'internal'
                  ? 'brightness(1.2) contrast(140%) hue-rotate(180deg)'
                  : 'none'
              }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <img 
                  src={selectedMachine.imageUrl} 
                  alt={selectedMachine.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Holographic Scanline Overlay in VR mode */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8B1520]/5 to-transparent pointer-events-none animate-pulse" />
              </div>

              {/* Interactive Hotspots with Hover Tooltips in Silver-Gray Industrial Theme */}
              {selectedMachine.hotspots.map((hotspot, idx) => {
                const isHovered = hoveredHotspot === idx;
                const isSelected = activeHotspot === idx;
                const showTooltip = isHovered || isSelected;

                return (
                  <div
                    key={hotspot.title}
                    style={{ top: `${hotspot.y}%`, left: `${hotspot.x}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                    onMouseEnter={() => {
                      setHoveredHotspot(idx);
                      audioEffects.playHotspotHoverSound();
                    }}
                    onMouseLeave={() => setHoveredHotspot(null)}
                  >
                    {/* Hotspot Pulsing Beacon Pin */}
                    <button
                      onClick={() => setActiveHotspot(activeHotspot === idx ? null : idx)}
                      className="relative flex h-7 w-7 items-center justify-center cursor-pointer group/pin focus:outline-none"
                      aria-label={`Inspect ${hotspot.specTag}`}
                    >
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${isHovered || isSelected ? 'bg-amber-400' : 'bg-[#8B1520]'}`} />
                      <span className={`relative inline-flex rounded-full h-5 w-5 border-2 shadow-sm items-center justify-center text-[9px] font-black transition-transform duration-200 group-hover/pin:scale-125 ${
                        isHovered || isSelected
                          ? 'bg-slate-100 text-slate-900 border-amber-400 ring-2 ring-amber-400'
                          : 'bg-[#8B1520] text-white border-white'
                      }`}>
                        {idx + 1}
                      </span>
                    </button>

                    {/* Industrial Silver-Gray Interactive Tooltip Card */}
                    {showTooltip && (
                      <div 
                        className={`absolute z-40 w-64 sm:w-72 bg-white text-slate-900 border border-slate-200 rounded-2xl p-3 shadow-xl text-left backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-auto ${
                          hotspot.y > 50 ? 'bottom-9 left-1/2 -translate-x-1/2' : 'top-9 left-1/2 -translate-x-1/2'
                        }`}
                      >
                        {/* Brushed Metallic Industrial Header Bar */}
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-[#8B1520]" />
                            <span className="text-[9px] font-black uppercase font-mono tracking-wider text-slate-600">
                              {hotspot.categoryTag}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            SPEC #{idx + 1}
                          </span>
                        </div>

                        {/* Stamped Specification Tag */}
                        <div className="text-xs font-black text-slate-900 flex items-center gap-1.5 mb-1">
                          <span className="text-[#8B1520]">■</span>
                          <span>{hotspot.specTag}</span>
                        </div>

                        {/* Title of the component */}
                        <div className="text-[11px] font-bold text-slate-800 leading-tight mb-1.5">
                          {hotspot.title}
                        </div>

                        {/* Spec Readout Pill */}
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800 font-mono text-[10px] font-extrabold flex items-center justify-between border border-slate-200 mb-1.5">
                          <span>{hotspot.specValue}</span>
                          <span className="text-[9px] text-emerald-600 font-sans">✓ TESTED</span>
                        </div>

                        {/* Engineering Description */}
                        <p className="text-[10.5px] text-slate-600 leading-relaxed">
                          {hotspot.description}
                        </p>

                        {/* Tooltip Arrow */}
                        <div 
                          className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 ${
                            hotspot.y > 50 ? '-bottom-1.5' : '-top-1.5 !border-r-0 !border-b-0 !border-l !border-t'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rotating Orbit Stage Pedestal */}
            <div className="w-3/4 h-6 mt-4 rounded-full bg-gradient-to-r from-transparent via-slate-200 to-transparent border-t border-slate-300 flex items-center justify-center relative">
              <div className="w-24 h-1 bg-[#8B1520] rounded-full" />
            </div>

            {/* Bottom Orbit & Zoom Control Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 z-10">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition border shadow-3xs ${
                  isRotating 
                    ? 'bg-rose-50 text-[#8B1520] border-[#8B1520]' 
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin text-[#8B1520]' : ''}`} />
                <span>{isRotating ? 'Pause 360° Orbit' : 'Auto 360° Orbit'}</span>
              </button>

              <button
                onClick={() => setRotationAngle(prev => (prev + 45) % 360)}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-3 py-2 rounded-xl text-xs font-black cursor-pointer shadow-3xs"
              >
                Rotate +45°
              </button>

              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-3xs">
                <span className="text-[10px] font-bold text-slate-600">Zoom:</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold text-slate-900 px-1">{zoomLevel.toFixed(1)}x</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Audio Simulation Status Indicator */}
            {isAudioActive && (
              <div className="mt-3 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[11px] text-[#8B1520] font-mono flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#8B1520] animate-pulse" />
                <span>Simulating Sound: {selectedMachine.audioEffectDescription}</span>
              </div>
            )}
          </div>

          {/* Machine Diagnostics & Verified Inspection HUD (4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Verified Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-[#8B1520] border border-rose-200">
                  {selectedMachine.category}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Passed Physical Testing
                </span>
              </div>

              {/* Title & Price */}
              <h3 className="text-lg font-black text-slate-900 leading-tight mb-2">
                {selectedMachine.name}
              </h3>

              <div className="text-2xl font-black text-[#8B1520] mb-4">
                {formatPrice(selectedMachine.priceNGN, selectedMachine.priceUSD)}
              </div>

              {/* Technical Specifications Grid */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-[#8B1520]" />
                  <span>Verified 3-Phase Electrical & Motor Specs</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-500">Main Motor Power</div>
                    <div className="font-extrabold text-slate-900 text-xs mt-0.5">{selectedMachine.motorKw}</div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-500">Rated Voltage</div>
                    <div className="font-extrabold text-slate-900 text-xs mt-0.5">{selectedMachine.voltage}</div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-500">Amperage Draw</div>
                    <div className="font-extrabold text-slate-900 text-xs mt-0.5">{selectedMachine.amperage}</div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-500">Spindle Speed</div>
                    <div className="font-extrabold text-slate-900 text-xs mt-0.5">{selectedMachine.spindleRpm}</div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-500">Acoustic Noise</div>
                    <div className="font-extrabold text-slate-900 text-xs mt-0.5">{selectedMachine.acousticDb}</div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-500">Mass / Weight</div>
                    <div className="font-extrabold text-slate-900 text-xs mt-0.5">{selectedMachine.weight}</div>
                  </div>
                </div>
              </div>

              {/* Escrow Guarantee Notice */}
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Escrow Protected:</strong> Funds remain securely locked until on-site commissioning & voltage runout testing is verified by your engineer.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => handleInspectMachine(selectedMachine.name.split(' ')[0])}
                className="w-full py-3 rounded-xl font-black text-sm text-center flex items-center justify-center gap-2 cursor-pointer bg-[#8B1520] hover:bg-[#72111A] text-white shadow-xs"
              >
                <span>View Full Catalog Listing & Specs</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => handleInspectMachine(selectedMachine.name.split(' ')[0])}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 py-2.5 rounded-xl font-black text-xs text-center cursor-pointer shadow-3xs"
              >
                Book On-Site Testing in {selectedMachine.hubLocation}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Equipment Calibration & Setup Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <EquipmentCalibrationGuide 
            onClose={() => setIsGuideOpen(false)} 
            machineTitle={selectedMachine.name}
            category={selectedMachine.category}
          />
        </div>
      )}
    </div>
  );
};
