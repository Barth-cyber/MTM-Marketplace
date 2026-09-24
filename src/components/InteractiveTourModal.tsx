import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Glasses, 
  Box, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Radio, 
  Play, 
  Building2 
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface InteractiveTourModalProps {
  onClose: () => void;
}

export const InteractiveTourModal: React.FC<InteractiveTourModalProps> = ({ onClose }) => {
  const { setIsVrShowroomOpen, setIsArPlacementOpen, showToast } = useMarketplace();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);

  const steps = [
    {
      title: '1. Scan & Calibrate Your Shop Floor (1:1 AR)',
      badge: 'AR Camera Technology',
      description: 'Point your camera at your workshop floor. Our AR Spatial Anchoring engine automatically detects concrete surfaces, ceiling heights, and door clearances in real time.',
      icon: Box,
      accentColor: 'from-[#8B1520] to-[#5A0A10]',
      highlights: [
        'Real-time ground plane detection on concrete or epoxy floors',
        'Doorway & transport corridor height check before delivery',
        'Automatic 1:1 true mm millimeter physical scaling'
      ],
      previewImage: '/images/edge_bander_banner.jpg',
    },
    {
      title: '2. Position Machinery & Verify Safety Buffer Zones',
      badge: 'Spatial Clearance Check',
      description: 'Position and rotate panel saws, CNC lathes, or diesel generators around your facility. Verify operator standing zones, dust extraction piping alignment, and electrical access.',
      icon: Compass,
      accentColor: 'from-slate-700 to-slate-900',
      highlights: [
        'Operator safety clearance visualization (1.5m buffer zone)',
        '3-Phase power drop point alignment & cable length check',
        '360° camera rotation around high-precision cast iron tables'
      ],
      previewImage: '/images/edge_bander_banner.jpg',
    },
    {
      title: '3. Virtual Reality 360° Factory Pavilion Inspection',
      badge: '3D VR Industrial Showroom',
      description: 'Step into MTM’s virtual machinery pavilions in Benin City and Lagos. Inspect spindle bearings, test idle run motor acoustics, and view complete manufacturing line setups.',
      icon: Glasses,
      accentColor: 'from-[#A1141F] to-[#72111A]',
      highlights: [
        'Interactive 360° pan/tilt virtual reality environment',
        'Audio guide narration of motor kVA & duty cycle specs',
        'Direct connection to MTM Escrow verified sellers'
      ],
      previewImage: '/images/edge_bander_banner.jpg',
    }
  ];

  const handleLaunchAR = () => {
    onClose();
    setIsArPlacementOpen(true);
    showToast('📐 Launching 1:1 AR Shop Floor Placement Camera...');
  };

  const handleLaunchVR = () => {
    onClose();
    setIsVrShowroomOpen(true);
    showToast('🥽 Entering 360° VR Industrial Machinery Pavilion...');
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="relative z-10 bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#8B1520] text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60">
                  Interactive Guided Tour
                </span>
                <span className="text-[10px] text-slate-400 font-mono">3D / AR / VR Suite</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Visualize Machinery In Your Shop Space
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`p-2 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                isPlayingAudio ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60' : 'bg-slate-800 text-slate-400'
              }`}
              title={isPlayingAudio ? 'Mute Audio Guide' : 'Enable Audio Guide'}
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4 text-rose-300" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
              title="Close dialog"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs overflow-x-auto">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${
                activeStep === idx 
                  ? 'bg-blue-600 text-white font-extrabold shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 font-semibold'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${
                activeStep === idx ? 'bg-white text-blue-600 font-black' : 'bg-slate-800 text-slate-400'
              }`}>
                {idx + 1}
              </span>
              <span className="truncate max-w-[150px] sm:max-w-none">{step.badge}</span>
            </button>
          ))}
        </div>

        {/* Active Step Showcase Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-blue-400 tracking-wider">
                  Step {activeStep + 1} of 3
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {steps[activeStep].title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r text-white shadow-xs self-start sm:self-auto uppercase tracking-wide bg-blue-600">
                {steps[activeStep].badge}
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {steps[activeStep].description}
            </p>

            {/* Simulated Audio Narrative Banner */}
            {isPlayingAudio && (
              <div className="p-3 rounded-lg bg-blue-950/50 border border-blue-800/50 flex items-center space-x-3 text-xs text-blue-200 animate-pulse">
                <Radio className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="italic">
                  "Voice Tour Guide: In this mode, camera sensors measure physical space down to ±2mm accuracy so you can buy with total confidence..."
                </span>
              </div>
            )}

            {/* Checklist items */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Key Technical Capabilities:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {steps[activeStep].highlights.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Direct Launch Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleLaunchAR}
              className="p-4 rounded-xl bg-gradient-to-r from-[#8B1520] to-[#72111A] hover:from-[#72111A] hover:to-[#5A0A10] text-white font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-lg transition cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <Box className="w-5 h-5 text-white group-hover:scale-110 transition" />
                </div>
                <div className="text-left">
                  <span className="block text-white font-black">Launch AR Camera</span>
                  <span className="text-[10px] text-rose-200 font-normal">Test floor scale in your shop</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={handleLaunchVR}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-lg transition cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-rose-950/40 text-rose-300">
                  <Glasses className="w-5 h-5 group-hover:scale-110 transition" />
                </div>
                <div className="text-left">
                  <span className="block text-white font-black">Explore 360° VR Showroom</span>
                  <span className="text-[10px] text-slate-400 font-normal">Virtual factory pavilions</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>

        {/* Footer Navigation bar inside modal */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeStep === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Previous Step
          </button>

          <div className="flex items-center space-x-1.5">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${
                  activeStep === i ? 'w-6 bg-[#8B1520]' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {activeStep < steps.length - 1 ? (
            <button
              onClick={() => setActiveStep(prev => prev + 1)}
              className="px-4 py-2 rounded-lg bg-[#8B1520] hover:bg-[#72111A] text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleLaunchAR}
              className="px-4 py-2 rounded-lg bg-[#8B1520] hover:bg-[#72111A] text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <span>Start AR Placement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
