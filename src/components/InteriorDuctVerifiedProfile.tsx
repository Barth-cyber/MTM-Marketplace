import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  Award, 
  CheckCircle2, 
  Cpu, 
  Zap, 
  Sparkles, 
  X, 
  ExternalLink,
  BookOpen,
  Leaf,
  Users,
  Target,
  Compass,
  ArrowRight,
  Heart
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { BackNavigation } from './BackNavigation';
import { useDraggableModal } from '../hooks/useDraggableModal';

interface InteriorDuctProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteriorDuctVerifiedProfile: React.FC<InteriorDuctProfileModalProps> = ({ isOpen, onClose }) => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const { setActiveView, setSelectedCategory, setFilterState } = useMarketplace();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 animate-fadeIn">
      <div 
        style={modalStyle}
        className="bg-white border border-blue-200 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative my-auto"
      >
        
        {/* Back Navigation Helper */}
        <BackNavigation 
          onBack={onClose} 
          label="Back to Marketplace" 
          showClose={true} 
          onClose={onClose} 
          dragHandleProps={dragHandleProps}
        />

        {/* Header Banner */}
        <div 
          {...dragHandleProps}
          className="bg-[#F3F4F6] border-b border-blue-100 p-6 sm:p-8 relative shrink-0 select-none"
        >
          <button
            onClick={onClose}
            className="no-drag absolute top-4 right-4 p-2 rounded-xl bg-white hover:bg-rose-600 hover:text-white text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-xs"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pointer-events-none">
            <div className="flex items-start sm:items-center space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1E40AF] text-[#FACC15] flex items-center justify-center font-black text-2xl shadow-md border-2 border-white shrink-0">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#1E40AF] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FACC15]" />
                    TIER-1 VERIFIED PARTNER & SELLER
                  </span>
                  <span className="bg-blue-100 text-[#1E40AF] border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Benin City, Edo State
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Interior Duct Ltd
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Furniture Manufacturing, Precision Fabrication & NBTE Accredited Vocational Training Centre
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 text-xs">
              <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs text-right">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">NBTE Accreditation</span>
                <span className="font-extrabold text-[#1E40AF]">Centre No: 109260</span>
              </div>
              <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs text-right">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Cloud Infrastructure</span>
                <span className="font-extrabold text-emerald-600 flex items-center gap-1 justify-end">
                  <Cpu className="w-3.5 h-3.5" /> AWS Secured
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-blue-100 text-xs text-slate-700">
            <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <MapPin className="w-4 h-4 text-[#1E40AF] shrink-0" />
              <span className="line-clamp-1">Benin City, Edo State</span>
            </div>
            <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <Phone className="w-4 h-4 text-[#1E40AF] shrink-0" />
              <span className="font-bold">08066062008</span>
            </div>
            <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <Mail className="w-4 h-4 text-[#1E40AF] shrink-0" />
              <span className="font-bold">interiorductltd@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto bg-white flex-1">
          
          {/* Section 1: Company Overview */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#1E40AF] font-black text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <h2>1. Company Overview & Background</h2>
            </div>
            <div className="bg-[#F3F4F6] border border-slate-200 rounded-xl p-5 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3">
              <p>
                <strong>Interior Duct Ltd</strong> is a premier Nigerian-based Furniture Manufacturing and Fabrication Company specializing in high-quality, durable, and aesthetic furniture that meets international standards. Founded by <strong>Mr. Benedict Omoregbe Onaiwu</strong>, the company has expanded its impact through an NBTE-accredited Skills Training Centre—carried out in close partnership with <strong>Bomon Development Foundation (Charity NGO)</strong>—supporting local content development, youth empowerment, charitable vocational sponsorships, and technical excellence across Nigeria’s manufacturing ecosystem.
              </p>
              <p>
                Incorporated on <strong>7th February 2012</strong> and commencing business formally on <strong>27th April, 2023</strong>, our core focus has always been on <em>“functionality, durability and aesthetics to bring customer satisfaction and great value for investments.”</em>
              </p>
              <p>
                All design, production, and data operations are powered by <strong>AWS Cloud infrastructure</strong>, ensuring secure, scalable, and efficient service delivery. We design, produce, and market extensive furniture lines serving residential, office, commercial (hotels, restaurants), educational (schools, colleges, universities), institutional, and medical clients (hospitals, labs).
              </p>
            </div>
          </div>

          {/* Section 2: Core Business Segments */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#1E40AF] font-black text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <h2>2. Core Business Segments</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-2">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E40AF] flex items-center justify-center font-bold text-xs">01</span>
                <h3 className="font-bold text-slate-900 text-sm">Furniture Manufacturing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Custom design, office, residential, and institutional furniture fabricated under qualified supervision with diverse finishes.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-2">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E40AF] flex items-center justify-center font-bold text-xs">02</span>
                <h3 className="font-bold text-slate-900 text-sm">Vocational Training (NBTE)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Accredited Centre No. 109260 in partnership with <strong>Bomon Development Foundation (Charity NGO)</strong>: Furniture & Upholstery, Welding & Fabrication, Woodwork, Carpentry, Joinery, and Finishes.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-2">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E40AF] flex items-center justify-center font-bold text-xs">03</span>
                <h3 className="font-bold text-slate-900 text-sm">Consultancy & Support</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Technical advisory for SMEs, woodworking startups, and artisan clusters across Nigeria.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Mission & Vision */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-[#1E40AF] font-bold text-xs uppercase">
                <Target className="w-4 h-4" />
                <span>3. Our Mission</span>
              </div>
              <p className="text-slate-800 text-xs sm:text-sm font-semibold italic">
                "Creating a meaningful living atmosphere in every sphere where our products are applicable."
              </p>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-[#1E40AF] font-bold text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>4. Our Vision</span>
              </div>
              <p className="text-slate-800 text-xs sm:text-sm font-semibold italic">
                "Building world class brand and improving local content."
              </p>
            </div>
          </div>

          {/* Section 5: Core Values */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#1E40AF] font-black text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <h2>5. Core Values & Data Security</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block mb-1">Innovation</span>
                <span className="text-[11px] text-slate-500">Modern fabrication tech</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block mb-1">Sustainability</span>
                <span className="text-[11px] text-slate-500">Max material efficiency</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block mb-1">Integrity</span>
                <span className="text-[11px] text-slate-500">Transparent & ethical</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block mb-1">Empowerment</span>
                <span className="text-[11px] text-slate-500">Youth & skill creation</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block mb-1">Data Security</span>
                <span className="text-[11px] text-slate-500">AWS multi-layer encryption</span>
              </div>
            </div>
          </div>

          {/* Section 6 & 7: Impact & Environmental Initiatives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#F3F4F6] border border-blue-200 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[#1E40AF] font-black text-xs uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>6. Training Impact Highlights</span>
                </div>
                <span className="bg-blue-100 text-[#1E40AF] text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-300 flex items-center gap-1 shadow-2xs">
                  <Heart className="w-3 h-3 text-[#1E40AF] fill-[#1E40AF]" />
                  Community Impact
                </span>
              </div>

              {/* NBTE Skills Centre Spotlight Box */}
              <div className="p-3 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 border border-blue-200 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold text-[#1E40AF] uppercase tracking-wider block">NBTE Skills Accreditation Centre (Partner: Bomon Development Foundation)</span>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  Interior Duct Ltd hosts a fully accredited National Board for Technical Education (NBTE) training facility to support standard vocational skills development, conducted in proud partnership with <strong>Bomon Development Foundation (Charity NGO)</strong>.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pt-1">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1. Youth Woodworking & TVET Artisan Empowerment:</strong> Over 150 indigent youth trained in modern cabinetry, furniture fabrication, and joinery.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>2. Women in CNC & Woodworking Manufacturing Initiative:</strong> Specialized training track empowering female woodworkers, machine operators, and design technicians.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>3. Artisanal Carpenter Upskilling in Benin City:</strong> Practical workshops on 3-phase heavy machinery safety, panel saw calibration, and precision digital panel cutting for local carpenters.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>4. Equipment Apprenticeship & Safety Workshop:</strong> Weekly hands-on training sessions on industrial panel saws, heavy-duty edge banders, and thicknessers at Edo Production Centre.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>5. Sustainable Industrial Timber & Sawmill Safety Training:</strong> Eco-friendly hardwood sourcing, kiln drying awareness, and 96% raw material efficiency with zero waste.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>6. Vocational Training Scholarships (in partnership with Bomon Development Foundation):</strong> Direct educational sponsorship for furniture making and advanced woodworking machinery skills acquisition for local youth in the South-South region.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#F3F4F6] border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-[#1E40AF] font-black text-xs uppercase tracking-wider">
                <Leaf className="w-4 h-4" />
                <span>7. Environmental & Sustainability</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Material Efficiency:</strong> 96% raw material utilization with minimal waste</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Sawdust Recycling:</strong> Reused in production briquettes and eco-finishing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Safe Factory:</strong> Advanced ventilation and dust extractor systems installed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Clean Energy:</strong> Ongoing plans to transition machinery to renewable solar power</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Verified Tier-1 Member of MTM Industrial Marketplace • Benin City Hub
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  setActiveView('machines');
                  setSelectedCategory('Machines');
                }}
                className="bg-[#1E40AF] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Interior Duct Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
