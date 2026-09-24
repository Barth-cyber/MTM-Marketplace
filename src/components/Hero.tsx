import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Building2, 
  Glasses, 
  Tv, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Tag, 
  ExternalLink, 
  Maximize2 
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { InteractiveTourModal } from './InteractiveTourModal';
import { VrShowroomModal } from './VrShowroomModal';
import { audioEffects } from '../utils/audioEffects';

interface TopPickAd {
  id: string;
  title: string;
  category: string;
  price: string;
  specs: string;
  hub: string;
  discount: string;
  badge: string;
  imageUrl: string;
  searchTag: string;
}

const TOP_PICK_ADS: TopPickAd[] = [
  {
    id: 'ad-scm-panel-saw',
    title: 'SCM SI 400 Nova Panel Saw',
    category: 'Joinery & Woodworking',
    price: '₦14,800,000',
    specs: 'Tested 415V / 3-Phase Heavy Duty',
    hub: 'Lagos & Kano Hubs',
    discount: '12% Below Regional Avg',
    badge: 'High Demand Top Pick',
    imageUrl: '/images/scm_panel_saw_1790179186875.jpg',
    searchTag: 'Panel Saw',
  },
  {
    id: 'ad-cnc-lathe',
    title: 'Heavy-Duty 3-Phase CNC Metal Lathe',
    category: 'Metalworking & Machining',
    price: '₦18,500,000',
    specs: '1000mm Bed • Hardened Slideways • 415V',
    hub: 'Kano Industrial Hub',
    discount: '15% Regional Supply Promo',
    badge: 'Precision Machining Ad',
    imageUrl: '/images/cnc_metal_lathe_1790001722561.jpg',
    searchTag: 'Lathe',
  },
  {
    id: 'ad-perkins-gen',
    title: 'Perkins 100kVA Soundproof Diesel Generator',
    category: 'Heavy Power & Plants',
    price: '₦22,400,000',
    specs: '100% Copper Stamford Alternator • Auto-Start',
    hub: 'Port Harcourt Hub',
    discount: 'Factory Direct Escrow Deal',
    badge: 'High Demand Top Pick',
    imageUrl: '/images/perkins_diesel_gen_1790179175839.jpg',
    searchTag: 'Generator',
  },
  {
    id: 'ad-lincoln-welder',
    title: 'Lincoln Power Wave S500 Multi-Process Welder',
    category: 'Metal Welding & Fabrication',
    price: '₦8,200,000',
    specs: 'Dual Pulse MIG/TIG Inverter • 500A Duty',
    hub: 'Benin City (Interior Duct Ltd)',
    discount: 'NBTE Certified Inventory',
    badge: 'Tier-1 Verified Partner Ad',
    imageUrl: '/images/metal_welding_plant_1790179162965.jpg',
    searchTag: 'Welder',
  },
  {
    id: 'ad-kdt-edgebander',
    title: 'KDT Automatic High-Speed Edge Bander',
    category: 'Furniture Plant Machinery',
    price: '₦16,200,000',
    specs: '6-Stage End Trimming, Rough & Fine Buffing',
    hub: 'Benin City Hub',
    discount: 'Physical Inspection Passed',
    badge: 'Turnkey Industrial Pick',
    imageUrl: '/images/edge_bander_banner.jpg',
    searchTag: 'Edge Bander',
  },
  {
    id: 'ad-hydraulic-press-brake',
    title: 'Yawei 160T CNC Hydraulic Press Brake',
    category: 'Metal Welding & Fabrication',
    price: '₦24,500,000',
    specs: '3200mm Bed • Delem DA-53T CNC • 415V',
    hub: 'Lagos Industrial Cluster',
    discount: 'Verified Diagnostic Passed',
    badge: 'Heavy Fabrication Pick',
    imageUrl: '/images/hydraulic_press_brake_1790179207683.jpg',
    searchTag: 'Press Brake',
  },
  {
    id: 'ad-rotary-screw-compressor',
    title: 'Atlas Copco 75kW Industrial Rotary Screw Compressor',
    category: 'Plant Utilities & Air',
    price: '₦12,800,000',
    specs: '450 CFM @ 10 Bar • Air Dryer & 1000L Receiver',
    hub: 'Kano Industrial Hub',
    discount: 'Escrow Inspected Deal',
    badge: 'Continuous Duty Utility',
    imageUrl: '/images/rotary_screw_compressor_1790179219452.jpg',
    searchTag: 'Compressor',
  },
  {
    id: 'ad-industrial-planer',
    title: 'SCM Invincible S630 Heavy Thickness Planer',
    category: 'Joinery & Woodworking',
    price: '₦9,600,000',
    specs: '630mm Helical Cutterhead • 4-Speed Feed',
    hub: 'Benin City Hub',
    discount: 'Reconditioned Certified',
    badge: 'Precision Joinery Pick',
    imageUrl: '/images/industrial_wood_planer_1790179230947.jpg',
    searchTag: 'Planer',
  },
];

export const Hero: React.FC = () => {
  const {
    setActiveView,
    setSelectedCategory,
    setFilterState,
    setIsAIAdvisorOpen,
    setIsSellModalOpen,
    setActiveProduct,
    setIsInteriorDuctModalOpen,
    siteSettings,
    openVideoDemo,
  } = useMarketplace();

  const [keyword, setKeyword] = useState('');
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isVRModalOpen, setIsVRModalOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSlideshowPaused, setIsSlideshowPaused] = useState(false);

  useEffect(() => {
    if (isSlideshowPaused) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % TOP_PICK_ADS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isSlideshowPaused]);

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % TOP_PICK_ADS.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlideIndex((prev) => (prev - 1 + TOP_PICK_ADS.length) % TOP_PICK_ADS.length);
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setActiveProduct(null);
    setFilterState(prev => ({ ...prev, search: keyword }));
    setActiveView('machines');
  };

  const handleQuickTag = (tag: string, cat = 'Machines') => {
    setActiveProduct(null);
    setFilterState(prev => ({ ...prev, search: tag, category: cat }));
    setActiveView(cat.toLowerCase());
  };

  const currentAd = TOP_PICK_ADS[currentSlideIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 space-y-6 relative">
      {/* Top Banner Row: Hero Light Banner + AI Intelligence Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Main Hero Banner featuring Pepper Red Gradient & Machinery Banner (Wider Column, No Outline) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-slate-900 rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-xs border-0 min-h-[380px] sm:min-h-[420px]">
          {/* Industrial Machinery Image Banner behind pepper red gradient */}
          <div 
            className="absolute inset-0 bg-cover bg-center pointer-events-none filter contrast-125 brightness-105"
            style={{ backgroundImage: `url('/images/edge_bander_banner.jpg')` }}
          />
          {/* Transparent background: darkened top-left, pepper red around center, gradually fading to lighter red toward bottom-right */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#120204]/94 via-28% via-[#B91C1C]/70 via-55% via-[#DC2626]/45 to-[#FB7185]/25 pointer-events-none" />

          {/* Top/Main Content Area */}
          <div className="relative z-10 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-white border border-white/20 text-xs font-semibold backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                <span>{siteSettings.announcementText}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-2.5 leading-tight tracking-tight text-white drop-shadow-xs">
              {siteSettings.landingHeadline.split('.')[0]}.<br />
              <span className="text-slate-200">{siteSettings.landingHeadline.split('.')[1] || 'Empower Your Build.'}</span>
            </h1>

            <p className="text-white/90 text-xs sm:text-sm mb-4 leading-relaxed max-w-lg font-normal drop-shadow-2xs">
              {siteSettings.landingSubheadline} Featured partner: <strong className="text-white underline decoration-rose-300 font-bold">{siteSettings.featuredMerchant}</strong>.
            </p>
          </div>

          {/* Bottom Area: Action Buttons positioned at bottom center + Bottom-Right Spotlight Image Thumbnail */}
          <div className="relative z-10 pt-4 mt-auto border-t border-white/15 flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
            {/* Repositioned & Harmonized Button Row on the Bottom Center */}
            <div className="flex-1 w-full flex flex-wrap items-center justify-center gap-3">
              <button
                id="hero-browse-machines-btn"
                onClick={() => {
                  setActiveProduct(null);
                  setSelectedCategory('Machines');
                  setFilterState(prev => ({ ...prev, category: 'Machines', subcategory: 'All' }));
                  setActiveView('machines');
                }}
                className="h-11 px-5 sm:px-6 rounded-xl bg-white hover:bg-rose-50 text-[#8B1520] font-black text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-102 active:scale-95 border border-white whitespace-nowrap"
              >
                <span>Browse Machinery</span>
                <ArrowRight className="w-4 h-4 text-[#8B1520]" />
              </button>

              <button
                id="hero-sell-equipment-btn"
                onClick={() => setIsSellModalOpen(true)}
                className="h-11 px-5 sm:px-6 rounded-xl bg-black/40 hover:bg-black/60 text-white font-bold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-102 active:scale-95 border border-white/30 backdrop-blur-md whitespace-nowrap"
              >
                <Tag className="w-4 h-4 text-rose-300" />
                <span>Start Selling</span>
              </button>

              <button
                id="hero-video-demos-btn"
                onClick={() => openVideoDemo('mtm-how-it-works-master')}
                className="h-11 px-5 sm:px-6 rounded-xl bg-black/40 hover:bg-black/60 text-white font-bold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-102 active:scale-95 border border-white/30 backdrop-blur-md whitespace-nowrap"
              >
                <Tv className="w-4 h-4 text-rose-300" />
                <span>Video & Voice Demos</span>
              </button>
            </div>

            {/* Pure Image Thumbnail on the Bottom Right-Hand Side of the Hero Banner (No Text) */}
            <button
              id="hero-bottom-right-thumbnail-btn"
              onClick={() => {
                setActiveProduct(null);
                setFilterState(prev => ({ ...prev, search: "KDT Machinery", category: "Machines" }));
                setActiveView('machines');
              }}
              className="self-end shrink-0 w-28 h-18 sm:w-36 sm:h-22 md:w-40 md:h-24 rounded-xl border-2 border-white/80 hover:border-white shadow-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 group bg-black/40 p-0 block"
              title="Click to view Heavy Duty Edge Bander listing"
            >
              <img 
                src="/images/edge_bander_banner.jpg" 
                alt="Heavy Duty Edge Bander Thumbnail" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 block" 
                referrerPolicy="no-referrer"
              />
            </button>
          </div>

          {/* Interactive Tour Modal Walkthrough */}
          {isTourModalOpen && (
            <InteractiveTourModal onClose={() => setIsTourModalOpen(false)} />
          )}

          {/* Immersive 360° VR Showroom Modal */}
          {isVRModalOpen && (
            <VrShowroomModal onClose={() => setIsVRModalOpen(false)} />
          )}
        </div>

        {/* AI Market Intelligence & Customer Top Picks Rotating Slideshow Card */}
        <div 
          className="lg:col-span-5 xl:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-start shadow-xs relative overflow-hidden group/card"
          onMouseEnter={() => setIsSlideshowPaused(true)}
          onMouseLeave={() => setIsSlideshowPaused(false)}
        >
          {/* Header & Pricing Insight */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8B1520]" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B1520]" />
                  <span>AI Market Intelligence</span>
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#8B1520] border border-rose-200">
                Live Pricing
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base mb-1 tracking-tight">
              Live Regional Pricing Insight
            </h3>
          </div>

          {/* ── ROTATING SLIDESHOW OF EQUIPMENT & TOOLS ADS (CUSTOMER TOP PICKS) ── */}
          <div className="mt-0.5 relative bg-slate-50 rounded-xl border border-slate-200 p-3 shadow-3xs overflow-hidden">
            {/* Top Bar of the Slide */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold mb-2">
              <span className="flex items-center gap-1 text-slate-700">
                <TrendingUp className="w-3 h-3 text-[#8B1520]" />
                {currentAd.badge}
              </span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                ● In Stock
              </span>
            </div>

            {/* Slide Content: Visual Showcase with Image + Specs */}
            <div 
              onClick={() => handleQuickTag(currentAd.searchTag, 'Machines')}
              className="cursor-pointer group/slide block"
              title={`View ${currentAd.title}`}
            >
              <div className="relative h-32 sm:h-36 rounded-lg overflow-hidden border border-slate-200 bg-white mb-2">
                <img 
                  src={currentAd.imageUrl} 
                  alt={currentAd.title}
                  className="w-full h-full object-cover group-hover/slide:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/scm_panel_saw_1790179186875.jpg';
                  }}
                />
                
                {/* Hub and Discount Badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-white/90 text-slate-800 text-[9px] font-bold border border-slate-200 backdrop-blur-xs shadow-3xs">
                    {currentAd.hub}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-50/90 text-[#8B1520] text-[9px] font-bold border border-rose-200 backdrop-blur-xs shadow-3xs">
                    {currentAd.discount}
                  </span>
                </div>

                {/* 360 VR Quick Preview Pill */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    audioEffects.playMetallicActivationSound();
                    setIsVRModalOpen(true);
                  }}
                  className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-white/90 text-slate-900 text-[9px] font-bold border border-slate-300 flex items-center gap-1 shadow-xs hover:bg-slate-100 cursor-pointer"
                >
                  <Glasses className="w-3 h-3 text-[#8B1520]" />
                  <span>360° VR</span>
                </button>
              </div>

              {/* Title & Specifications */}
              <div className="text-sm font-bold text-slate-900 group-hover/slide:text-[#8B1520] transition-colors truncate">
                {currentAd.title}
              </div>
              
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200">
                <div className="text-[#8B1520] font-black text-base">
                  {currentAd.price}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {currentAd.specs}
                </span>
              </div>
            </div>

            {/* Slideshow Navigation Controls & Dots */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                {TOP_PICK_ADS.map((ad, idx) => (
                  <button
                    key={ad.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlideIndex === idx 
                        ? 'w-5 bg-[#8B1520]' 
                        : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevSlide}
                  className="p-1 rounded-lg cursor-pointer bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-3xs"
                  aria-label="Previous ad slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-1 rounded-lg cursor-pointer bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-3xs"
                  aria-label="Next ad slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Action Footer inside AI Card */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span className="italic">Rotating Top Picks ({currentSlideIndex + 1}/{TOP_PICK_ADS.length})</span>
            <button
              onClick={() => handleQuickTag(currentAd.searchTag, 'Machines')}
              className="text-[#8B1520] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Pick</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Global Quick Search Bar */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="hero-search-input"
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Search by machine model, tool, timber or steel specs (e.g. SCM Panel Saw, CAT, Perkins 100kVA, TIG Welder)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#8B1520] transition"
            />
          </div>
          <button
            id="hero-search-btn"
            type="submit"
            className="bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer text-white shadow-md border border-[#7A101A]/40"
          >
            <span>Search Catalog</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
          <span className="font-bold text-slate-700">Quick Filters:</span>
          {[
            { label: 'Panel Saws', tag: 'Panel Saw', cat: 'Machines' },
            { label: 'Metal Lathes', tag: 'Lathe', cat: 'Machines' },
            { label: 'Diesel Generators', tag: 'Generator', cat: 'Machines' },
            { label: 'TIG Welders', tag: 'Welder', cat: 'Tools' },
            { label: 'H-Beams', tag: 'Steel', cat: 'Materials' },
            { label: 'Hardwood Timber', tag: 'Timber', cat: 'Materials' },
            { label: 'Liquidation Deals', tag: 'Liquidation', cat: 'Machines' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => handleQuickTag(item.tag, item.cat)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-[#8B1520] hover:border-rose-200 transition font-semibold text-[11px] cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Tier-1 Verified Partner Banner: Interior Duct Ltd (Benin City) */}
      <section className="bg-slate-50 rounded-2xl p-5 sm:p-6 text-slate-900 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white text-[#8B1520] flex items-center justify-center font-black text-xl shadow-xs shrink-0 border-2 border-[#8B1520]">
            IDL
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-rose-50 text-[#8B1520] border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                Tier-1 Verified Partner
              </span>
              <span className="bg-slate-200 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-300">
                NBTE Centre No: 109260
              </span>
            </div>
            <h3 className="font-bold text-lg sm:text-xl text-slate-900">MTM Marketplace — Benin City, Edo State</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Benin City, Edo State. MTM Marketplace is a digital e-commerce business serving sellers, buyers, suppliers, dealers, and the general public both locally and internationally within and beyond the industrial ecosystem.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsInteriorDuctModalOpen(true)}
          className="btn-3d-stainless px-5 py-3 rounded-xl font-bold text-xs transition shadow-xs whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer text-slate-900"
        >
          <Building2 className="w-4 h-4 text-[#8B1520]" />
          <span>View Business Profile Document</span>
          <ArrowRight className="w-4 h-4 text-slate-700" />
        </button>
      </section>

      {/* 4 Trust & Infrastructure Pillars (Silver Metallic Finish) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="silver-metallic-card p-4 rounded-xl border border-slate-300 flex items-start gap-3 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-[#8B1520] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Escrow Security</h4>
            <p className="text-[11px] text-slate-600 leading-snug mt-0.5">Funds held safely until machine is delivered & verified.</p>
          </div>
        </div>

        <div className="silver-metallic-card p-4 rounded-xl border border-slate-300 flex items-start gap-3 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-[#8B1520] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Physical Testing</h4>
            <p className="text-[11px] text-slate-600 leading-snug mt-0.5">Certified engineers test motors, spindle runout & safety.</p>
          </div>
        </div>

        <div className="silver-metallic-card p-4 rounded-xl border border-slate-300 flex items-start gap-3 shadow-2xs">
          <Truck className="w-5 h-5 text-[#8B1520] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Heavy Crane Rigging</h4>
            <p className="text-[11px] text-slate-600 leading-snug mt-0.5">Flatbed trailers across Lagos, Kano, PH & nationwide.</p>
          </div>
        </div>

        <div className="silver-metallic-card p-4 rounded-xl border border-slate-300 flex items-start gap-3 shadow-2xs">
          <Zap className="w-5 h-5 text-[#8B1520] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Power Calculations</h4>
            <p className="text-[11px] text-slate-600 leading-snug mt-0.5">Automatic starting kVA & 3-phase power calculations.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
