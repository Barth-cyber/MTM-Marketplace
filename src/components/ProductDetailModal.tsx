import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Video, 
  ArrowRightLeft, 
  ShoppingCart, 
  Sparkles, 
  Building2, 
  FileCheck, 
  Clock, 
  Play,
  Star,
  Layers,
  Activity,
  CheckCircle,
  HelpCircle,
  Tag,
  Bell,
  TrendingDown,
  TrendingUp,
  BarChart3,
  ExternalLink,
  Globe,
  Radio,
  Glasses,
  Box,
  Share2
} from 'lucide-react';
import { Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { getCategoryTheme } from '../utils/categoryThemes';
import { PriceAlertModal } from './PriceAlertModal';
import { ProductDetailSkeleton } from './skeletons/ProductDetailSkeleton';
import { SmartTrendAnalysis } from './SmartTrendAnalysis';
import { BackNavigation } from './BackNavigation';
import { useDraggableModal } from '../hooks/useDraggableModal';
import { IndustrialVideoPlayer } from './IndustrialVideoPlayer';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    formatPrice,
    addToCart,
    uncart,
    isInCart,
    addToCompare,
    compareList,
    setActiveNegotiationProduct,
    setActiveInspectionProduct,
    setIsAIAdvisorOpen,
    setAdvisorInitialPrompt,
    getPriceAlertForProduct,
    setIsArPlacementOpen,
    setIsVrShowroomOpen,
    setIsEnergyCalculatorOpen,
    showToast,
  } = useMarketplace();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'condition' | 'power' | 'seller' | 'trends'>('specs');
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);
  const { modalStyle, dragHandleProps } = useDraggableModal();

  // Perceived performance loading simulation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 220);
    return () => clearTimeout(timer);
  }, [product.id]);

  const rawImg = product.images[selectedImgIndex] || product.images[0];
  const absoluteImgUrl = rawImg.startsWith('http') ? rawImg : `${window.location.origin}${rawImg}`;
  const sharePageUrl = window.location.href;
  const whatsappPayload = `🏭 *${product.title}*\n\n💰 Price: ₦${product.priceNGN.toLocaleString()} (~$${product.priceUSD.toLocaleString()} USD)\n🏭 Category: ${product.category}\n⚙️ Condition: ${product.condition}\n📍 Location: ${product.location.city}, ${product.location.state}\n🛡️ 100% Escrow Protected\n\n🖼️ *Machine Image (JPEG):*\n${absoluteImgUrl}\n\n🔗 *Inspect & Buy on MTM Marketplace:*\n${sharePageUrl}`;

  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${product.title} - MTM Industrial Marketplace`;

    const updateOrCreateMeta = (property: string, content: string, isName = false) => {
      const attr = isName ? 'name' : 'property';
      let meta = document.querySelector(`meta[${attr}="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateMeta('og:title', product.title);
    updateOrCreateMeta('og:description', `Price: ₦${product.priceNGN.toLocaleString()} (~$${product.priceUSD.toLocaleString()} USD) | Condition: ${product.condition} | Location: ${product.location.city}, ${product.location.state}. 100% Escrow Protected on MTM.`);
    updateOrCreateMeta('og:image', absoluteImgUrl);
    updateOrCreateMeta('og:image:type', 'image/jpeg');
    updateOrCreateMeta('og:image:width', '1200');
    updateOrCreateMeta('og:image:height', '630');
    updateOrCreateMeta('og:url', sharePageUrl);
    updateOrCreateMeta('twitter:card', 'summary_large_image', true);
    updateOrCreateMeta('twitter:title', product.title, true);
    updateOrCreateMeta('twitter:description', `Price: ₦${product.priceNGN.toLocaleString()} | Condition: ${product.condition} | Location: ${product.location.city}, ${product.location.state}`, true);
    updateOrCreateMeta('twitter:image', absoluteImgUrl, true);

    try {
      window.history.replaceState(null, '', `?product=${product.id}`);
    } catch {}

    return () => {
      document.title = originalTitle;
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch {}
    };
  }, [product, selectedImgIndex, absoluteImgUrl, sharePageUrl]);

  const handleShareWithImage = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      const file = await new Promise<File>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || 1200;
            canvas.height = img.naturalHeight || 800;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('No canvas context');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(new File([blob], `${product.slug || 'industrial-machine'}.jpg`, { type: 'image/jpeg' }));
              } else {
                reject(new Error('Canvas blob failed'));
              }
            }, 'image/jpeg', 0.95);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = (err) => reject(err);
        img.src = absoluteImgUrl;
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: product.title,
          text: whatsappPayload,
          files: [file],
        });
        showToast("✅ Machine image and specs shared successfully to WhatsApp!");
        return;
      }
    } catch (err) {
      console.log("Native share file fallback:", err);
    }

    try {
      await navigator.clipboard.writeText(whatsappPayload);
    } catch {}

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappPayload)}`;
    window.open(waUrl, '_blank');
    showToast("📲 WhatsApp opened! Click 'Download JPEG' to attach photo directly in chat.");
  };

  const theme = getCategoryTheme(product.category || product.subcategory);
  const isCompared = compareList.some(p => p.id === product.id);
  const activeAlert = getPriceAlertForProduct(product.id);


  // Condition Report with default fallback if not explicitly populated
  const conditionReport = product.conditionReport || {
    overall: product.condition,
    overallScore: product.inspectionScore || 80,
    mechanical: 80,
    electrical: 70,
    cosmetic: 60,
    operational: 80,
    inspectorNotes: 'Machine mechanical components, spindle alignment, electrical contactors, and motor insulation checked in person.',
    inspectionDate: 'August 2026',
    inspectorName: 'MTM Certified Senior Industrial Inspector',
    certifiedGrade: 'Grade B+ Commercial Production',
  };

  const handleAskAIAboutProduct = () => {
    setAdvisorInitialPrompt(
      `Provide an expert analysis for "${product.title}" (${product.brand}, Model ${product.model}, Year ${product.year}). Analyze power requirements (${product.powerSpecs.voltage}), generator sizing, and spare parts availability in Nigeria.`
    );
    setIsAIAdvisorOpen(true);
  };

  // Helper function for Condition bar color
  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-[#8B1520]';
    if (score >= 70) return 'bg-slate-700';
    if (score >= 50) return 'bg-amber-600';
    return 'bg-rose-500';
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        style={modalStyle} 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-6xl max-h-[86vh] flex flex-col shadow-2xl overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back Navigation Helper */}
        <BackNavigation 
          onBack={onClose} 
          label="Back to Marketplace" 
          showClose={true} 
          onClose={onClose} 
          dragHandleProps={dragHandleProps}
        />
        
        {/* ── TOP HEADER BAR (Category Themed) ── */}
        <div 
          {...dragHandleProps}
          className={`flex items-center justify-between px-6 py-3.5 border-b border-slate-200 ${theme.lightBg} shrink-0 select-none`}
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-md border shadow-2xs ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
              {product.category || 'Machinery'} • {product.department || product.subcategory}
            </span>
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{product.location.city}, {product.location.state}</span>
              {product.location.industrialArea && (
                <span className="text-slate-400 text-[11px]">({product.location.industrialArea})</span>
              )}
            </div>
          </div>

          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="no-drag p-2 rounded-xl bg-white hover:bg-rose-600 hover:text-white text-slate-700 border border-slate-300 hover:border-rose-600 transition-colors shadow-xs cursor-pointer"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 font-bold" />
          </button>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {isLoading ? (
            <ProductDetailSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ── LEFT: MEDIA GALLERY (5 cols) ── */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                {isVideoPlaying ? (
                  <div className="relative w-full h-full flex flex-col bg-slate-950">
                    <div className="absolute top-2 right-2 z-30">
                      <button
                        onClick={() => setIsVideoPlaying(false)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/95 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 shadow-lg cursor-pointer flex items-center gap-1"
                      >
                        <span>✕ Back to Photos</span>
                      </button>
                    </div>
                    <div className="flex-1 w-full h-full flex items-center justify-center">
                      <IndustrialVideoPlayer
                        videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                        posterUrl={product.images[0]}
                        title={`${product.title} - Certified Run-Test`}
                        subtitle={`Inspection Score: ${product.inspectionScore || 92}% • MTM Verified`}
                        autoPlay={true}
                        className="w-full h-full rounded-none border-0 shadow-none"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={product.images[selectedImgIndex] || product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/scm_panel_saw_1790179186875.jpg';
                      }}
                    />
                    {product.hasVideoTest && (
                      <button
                        onClick={() => setIsVideoPlaying(true)}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-[#8B1520] text-white text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition shadow-lg backdrop-blur-xs cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Run-Test</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImgIndex(idx);
                      setIsVideoPlaying(false);
                    }}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                      selectedImgIndex === idx && !isVideoPlaying 
                        ? `${theme.badgeBorder} ring-2 ring-rose-500/30` 
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="Thumb" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/scm_panel_saw_1790179186875.jpg';
                      }}
                    />
                  </button>
                ))}

                {product.hasVideoTest && (
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className={`w-20 h-16 rounded-lg bg-slate-100 border-2 shrink-0 flex flex-col items-center justify-center text-[10px] ${theme.accentText} font-bold transition cursor-pointer ${
                      isVideoPlaying ? 'border-[#8B1520] bg-rose-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Video className="w-4 h-4 mb-0.5" />
                    <span>Run Video</span>
                  </button>
                )}
              </div>

              {/* AR Placement, VR Showroom & Energy Audit Tool Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => setIsArPlacementOpen(true)}
                  className="py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  title="Place in your factory floor using AR"
                >
                  <Box className="w-3.5 h-3.5 text-slate-700" />
                  <span>AR Fit</span>
                </button>

                <button
                  onClick={() => setIsVrShowroomOpen(true)}
                  className="py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  title="Immersive 360° VR Showroom Walkthrough"
                >
                  <Glasses className="w-3.5 h-3.5 text-slate-700" />
                  <span>VR Walk</span>
                </button>

                <button
                  onClick={() => setIsEnergyCalculatorOpen(true)}
                  className="py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  title="Industrial Power & Energy Cost Calculator"
                >
                  <Zap className="w-3.5 h-3.5 text-[#8B1520]" />
                  <span>Energy Calc</span>
                </button>
              </div>

              {/* MTM Trust Verification Box */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>MTM Physical Verification Passed</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">
                    Score: {conditionReport.overallScore}%
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Verified in person by an MTM industrial mechanical engineer. Bearings, motor windings, slideways, and safety interlocks certified.
                </p>
              </div>
            </div>

            {/* ── RIGHT: BASIC INFORMATION & ACTIONS (7 cols) ── */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                {/* Micro Header: Brand, Model, Year, and Brand Source Direct Link */}
                <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
                  <span className={`text-xs font-black uppercase tracking-wider ${theme.accentText}`}>
                    {product.brand}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-semibold text-slate-700">Model: {product.model}</span>
                  {product.year && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">Year: {product.year}</span>
                    </>
                  )}
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">Type: {product.machineType || product.subcategory}</span>

                  {product.brandSourceUrl && (
                    <a
                      href={product.brandSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-[#8B1520] text-[10px] font-extrabold border border-rose-200 transition shadow-2xs cursor-pointer ml-auto"
                      title={`Open official ${product.brandSourceName || product.brand} portal`}
                    >
                      <Globe className="w-3 h-3 text-[#8B1520]" />
                      <span>OEM Brand Source: {product.brandSourceName || product.brand}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                {/* Main Title */}
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-2.5">
                  {product.title}
                </h1>

                {/* Live Crawl & Authenticity Tag */}
                {product.isLiveCrawled && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold mb-2.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>Live Web Crawled: Authenticated Index ({product.crawlSourceHub || 'Industrial Direct Hub'})</span>
                    {product.lastCrawledAt && (
                      <span className="text-emerald-700 font-mono text-[10px]">
                        • {product.lastCrawledAt}
                      </span>
                    )}
                  </div>
                )}

                {/* Rating & Location Line */}
                <div className="flex items-center space-x-3 mb-3 flex-wrap gap-y-1">
                  <div className="flex items-center space-x-1 text-amber-500">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating || 4.8)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{(product.rating || 4.8).toFixed(1)}</span>
                    {product.ratingCount && (
                      <span className="text-[10px] text-slate-400 font-normal">({product.ratingCount} reviews)</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{product.location.city}, {product.location.state}</span>
                  </div>

                  {product.seller && (
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                      <span>Seller:</span>
                      <strong className="text-slate-800 font-bold">{product.seller.name}</strong>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-rose-50 text-[#8B1520] text-[10px] font-bold border border-rose-100 shadow-3xs" title="MTM Certified Verified Seller Account">
                        <ShieldCheck className="w-3 h-3 text-[#8B1520] fill-rose-50" />
                        <span>Verified Seller</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Condition & Availability Chips */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    Condition: <span className="font-extrabold text-slate-900">{product.condition}</span>
                  </span>
                  
                  {product.usage && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-50 text-slate-700 border border-slate-200">
                      Usage: {product.usage}
                    </span>
                  )}

                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{product.availability || 'In Stock • Ready for MTM Inspection & Dispatch'}</span>
                  </span>
                </div>

                    {/* Price Display */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-2.5">
                      <div className="flex items-baseline justify-between flex-wrap gap-2">
                        <div>
                          <span className="text-xs text-slate-500 block mb-0.5">Industrial Marketplace Price (Escrow Protected)</span>
                          <div className="flex items-baseline space-x-3">
                            <span className="text-2xl sm:text-3xl font-black text-slate-900">
                              {formatPrice(product.priceNGN, product.priceUSD)}
                            </span>
                            {product.originalPriceNGN && (
                              <span className="text-sm text-slate-400 line-through">
                                {formatPrice(product.originalPriceNGN, product.originalPriceUSD)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Price Alert Quick Button */}
                          <button
                            id="product-detail-quick-alert-btn"
                            onClick={() => setIsPriceAlertOpen(true)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition shadow-2xs cursor-pointer ${
                              activeAlert
                                ? 'bg-amber-50 text-amber-900 border-amber-300 font-black'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 hover:text-slate-900'
                            }`}
                            title="Get notified when the seller drops the price"
                          >
                            <Bell className={`w-3.5 h-3.5 ${activeAlert ? 'fill-amber-500 text-amber-600 animate-bounce' : 'text-slate-500'}`} />
                            <span>
                              {activeAlert 
                                ? `Alert: ${formatPrice(activeAlert.targetPriceNGN, activeAlert.targetPriceUSD)}` 
                                : 'Set Price Alert'}
                            </span>
                          </button>

                          <span className={`text-xs font-bold px-2.5 py-1.5 rounded border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                            Negotiable RFQ
                          </span>
                        </div>
                      </div>

                      {/* Smart Trend Quick Banner */}
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <button
                          onClick={() => setActiveTab('trends')}
                          className="inline-flex items-center space-x-1.5 text-[#8B1520] hover:text-[#72111A] font-bold text-[11px] group cursor-pointer"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-[#8B1520] group-hover:translate-x-0.5 transition" />
                          <span>Smart Valuation: AI Liquidation & Replacement Cost Analysis</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('trends')}
                          className="text-[11px] text-slate-500 hover:text-slate-900 font-semibold underline"
                        >
                          View 12m Trajectory
                        </button>
                      </div>
                    </div>

                {/* Primary Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {isInCart(product.id) ? (
                    <button
                      id="product-detail-uncart-btn"
                      onClick={() => {
                        uncart(product.id);
                      }}
                      className="py-3 px-4 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-300 font-black text-sm transition flex items-center justify-center space-x-2 shadow-xs active:scale-98 cursor-pointer"
                      title="Remove item from order (Uncart)"
                    >
                      <ShoppingCart className="w-4 h-4 text-rose-600" />
                      <span>In Cart • Click to Uncart</span>
                    </button>
                  ) : (
                    <button
                      id="product-detail-add-cart-btn"
                      onClick={() => {
                        addToCart(product, true, true);
                      }}
                      className={`py-3 px-4 rounded-lg text-white font-bold text-sm transition flex items-center justify-center space-x-2 shadow-xs active:scale-98 cursor-pointer ${theme.accentBg} ${theme.accentHoverBg}`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Purchase with Escrow Protection</span>
                    </button>
                  )}

                  <button
                    id="product-detail-make-offer-btn"
                    onClick={() => {
                      setActiveNegotiationProduct(product);
                      onClose();
                    }}
                    className="py-3 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-sm transition flex items-center justify-center space-x-2 shadow-xs"
                  >
                    <span>Make Offer / Negotiate Price</span>
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    id="product-detail-set-price-alert-btn"
                    onClick={() => setIsPriceAlertOpen(true)}
                    className={`py-2 px-3 rounded-lg border flex items-center justify-center space-x-1.5 transition font-semibold ${
                      activeAlert
                        ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Bell className={`w-3.5 h-3.5 ${activeAlert ? 'fill-amber-500 text-amber-600' : 'text-amber-500'}`} />
                    <span>{activeAlert ? 'Edit Alert' : 'Price Alert'}</span>
                  </button>

                  <button
                    onClick={() => setActiveInspectionProduct(product)}
                    className="py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center space-x-1.5 transition font-semibold"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Inspection</span>
                  </button>

                  <button
                    onClick={() => addToCompare(product)}
                    className={`py-2 px-3 rounded-lg border flex items-center justify-center space-x-1.5 transition font-semibold ${
                      isCompared
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>{isCompared ? 'In Matrix' : 'Compare'}</span>
                  </button>

                  <button
                    onClick={handleAskAIAboutProduct}
                    className={`py-2 px-3 rounded-lg ${theme.badgeBg} ${theme.accentText} border ${theme.badgeBorder} flex items-center justify-center space-x-1.5 transition font-bold`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Advisor</span>
                  </button>
                </div>

                {/* Social Media Share Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-600 font-bold">
                    <Share2 className="w-4 h-4 text-[#8B1520]" />
                    <span>Share Machine:</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* WhatsApp */}
                    <button
                      onClick={handleShareWithImage}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1 text-[11px] shadow-2xs transition cursor-pointer"
                    >
                      <span>WhatsApp</span>
                    </button>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center space-x-1 text-[11px] shadow-2xs transition"
                    >
                      <span>Facebook</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-sky-800 hover:bg-sky-900 text-white font-bold flex items-center space-x-1 text-[11px] shadow-2xs transition"
                    >
                      <span>LinkedIn</span>
                    </a>

                    {/* X (Twitter) */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Industrial Machine Listing: ${product.title}`)}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white font-bold flex items-center space-x-1 text-[11px] shadow-2xs transition"
                    >
                      <span>X (Twitter)</span>
                    </a>

                    {/* Instagram */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${product.title} - Available on MTM Marketplace: ${window.location.href}`);
                        showToast("📸 Link copied! Open Instagram to share in story or post.");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold flex items-center space-x-1 text-[11px] shadow-2xs transition cursor-pointer"
                    >
                      <span>Instagram</span>
                    </button>

                    {/* TikTok */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${product.title} - Available on MTM Marketplace: ${window.location.href}`);
                        showToast("🎵 Link copied! Open TikTok to share in video caption.");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-black text-emerald-400 border border-slate-800 font-bold flex items-center space-x-1 text-[11px] shadow-2xs transition cursor-pointer"
                    >
                      <span>TikTok</span>
                    </button>
                  </div>
                </div>

                {/* Equipment & Specifications Share Card (JPEG Image + Specs) */}
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-[#8B1520]" />
                      <span>WhatsApp & Social Share Card (JPEG Photo + Specs)</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      JPEG Linked
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-center bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="relative w-full sm:w-28 h-24 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                      <img 
                        src={product.images[selectedImgIndex] || product.images[0]} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-white text-[8px] font-bold">
                        JPEG Photo
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 text-xs space-y-1">
                      <h5 className="font-extrabold text-slate-900 truncate">{product.title}</h5>
                      <p className="text-slate-600 font-bold text-[#8B1520]">
                        ₦{product.priceNGN.toLocaleString()} <span className="text-slate-400 font-normal">| ~$</span>{product.priceUSD.toLocaleString()} USD
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        ⚙️ {product.category} • {product.condition} • {product.location.city}, {product.location.state}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={handleShareWithImage}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition cursor-pointer"
                        >
                          <span>Send to WhatsApp (with Image)</span>
                        </button>

                        <button
                          onClick={() => {
                            const shareText = `*${product.title}*\n💰 Price: ₦${product.priceNGN.toLocaleString()} (~$${product.priceUSD.toLocaleString()} USD)\n📍 Location: ${product.location.city}, ${product.location.state}\n🖼️ Photo (JPEG): ${window.location.origin}${product.images[selectedImgIndex] || product.images[0]}\n🔗 Link: ${window.location.href}`;
                            navigator.clipboard.writeText(shareText);
                            showToast("📋 Equipment specifications & JPEG image link copied to clipboard!");
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-[11px] transition cursor-pointer"
                        >
                          Copy Specs & Link
                        </button>

                        <a
                          href={product.images[selectedImgIndex] || product.images[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-[11px] transition cursor-pointer"
                        >
                          Download JPEG
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── INTERACTIVE EXPERIENCE SECTION ── */}
                <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-rose-50/70 via-slate-50 to-rose-50/70 text-slate-900 shadow-2xs border border-rose-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-[#8B1520] text-white shadow-xs">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs tracking-wide text-slate-900 uppercase">
                          Interactive Shop Floor Experience
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          Simulate space fit, clearances, and 3D floor layout for <strong className="text-[#8B1520]">{product.title}</strong>
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-[#8B1520] border border-rose-200">
                      3D / AR / VR Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* AR Placement Button */}
                    <button
                      onClick={() => {
                        setIsArPlacementOpen(true);
                        showToast(`📐 Launching AR Camera for ${product.title}...`);
                      }}
                      className="px-3.5 py-2.5 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md border border-[#7A101A]/30 cursor-pointer group"
                    >
                      <Glasses className="w-4 h-4 group-hover:scale-110 transition" />
                      <span>Launch AR Camera Placement</span>
                    </button>

                    {/* VR Showroom Button */}
                    <button
                      onClick={() => {
                        setIsVrShowroomOpen(true);
                        showToast(`🥽 Opening 360° VR Showroom for ${product.title}...`);
                      }}
                      className="px-3.5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 hover:text-slate-900 border border-slate-300 font-bold text-xs flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer group"
                    >
                      <Radio className="w-4 h-4 text-[#8B1520] group-hover:scale-110 transition" />
                      <span>Explore 360° VR Showroom</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── TECHNICAL DOSSIER & CONDITION REPORT TABS ── */}
          <div className="border-t border-slate-200 pt-6">
            
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 space-x-4 mb-4 text-xs font-bold overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 px-1 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'specs' 
                    ? `border-b-2 ${theme.accentText} font-black` 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
                style={{ borderColor: activeTab === 'specs' ? theme.hexPrimary : 'transparent' }}
              >
                1. Machine Technical Specifications
              </button>
              
              <button
                onClick={() => setActiveTab('condition')}
                className={`pb-2.5 px-1 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'condition' 
                    ? `border-b-2 ${theme.accentText} font-black` 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
                style={{ borderColor: activeTab === 'condition' ? theme.hexPrimary : 'transparent' }}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>2. Condition Report & Bar Ratings</span>
              </button>

              <button
                onClick={() => setActiveTab('power')}
                className={`pb-2.5 px-1 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'power' 
                    ? `border-b-2 ${theme.accentText} font-black` 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
                style={{ borderColor: activeTab === 'power' ? theme.hexPrimary : 'transparent' }}
              >
                3. Power & Generator Compatibility
              </button>

              <button
                id="tab-smart-trends-btn"
                onClick={() => setActiveTab('trends')}
                className={`pb-2.5 px-1 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'trends' 
                    ? `border-b-2 ${theme.accentText} font-black` 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
                style={{ borderColor: activeTab === 'trends' ? theme.hexPrimary : 'transparent' }}
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#8B1520]" />
                <span>4. Smart Price & Market Trends</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-[#8B1520] uppercase">AI Valued</span>
              </button>

              <button
                onClick={() => setActiveTab('seller')}
                className={`pb-2.5 px-1 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'seller' 
                    ? `border-b-2 ${theme.accentText} font-black` 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
                style={{ borderColor: activeTab === 'seller' ? theme.hexPrimary : 'transparent' }}
              >
                5. Verified Seller & Logistics
              </button>
            </div>

            {/* ── TAB 1: TECHNICAL SPECIFICATIONS ── */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {product.description}
                </p>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Industrial Engineering Specifications</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Explicit items from user spec requirement */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-500 block mb-0.5 font-medium">Machine Type</span>
                      <span className="font-bold text-slate-900">{product.machineType || product.subcategory}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-500 block mb-0.5 font-medium">Brand</span>
                      <span className="font-bold text-slate-900">{product.brand}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-500 block mb-0.5 font-medium">Model</span>
                      <span className="font-bold text-slate-900">{product.model}</span>
                    </div>

                    {product.year && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                        <span className="text-slate-500 block mb-0.5 font-medium">Year of Manufacture</span>
                        <span className="font-bold text-slate-900">{product.year}</span>
                      </div>
                    )}

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-500 block mb-0.5 font-medium">Operating Voltage & Phase</span>
                      <span className="font-bold text-slate-900">{product.powerSpecs.voltage}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-500 block mb-0.5 font-medium">Power Rating</span>
                      <span className="font-bold text-slate-900">{product.powerSpecs.kwRating ? `${product.powerSpecs.kwRating} kW` : 'Standard Industrial'}</span>
                    </div>

                    {/* All additional key-values from technicalSpecs */}
                    {Object.entries(product.technicalSpecs).map(([key, val]) => (
                      <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                        <span className="text-slate-500 block mb-0.5 font-medium">{key}</span>
                        <span className="font-bold text-slate-900">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: CONDITION REPORT (Matches Section 9 Specifications) ── */}
            {activeTab === 'condition' && (
              <div className="space-y-5">
                <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6 rounded-xl space-y-6">
                  
                  {/* Top Grade Banner */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        <h4 className="text-base font-black text-slate-900">
                          MTM Official Condition Report & Verification
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Inspection Date: {conditionReport.inspectionDate || 'August 2026'} • Certified Grade: <strong className="text-emerald-700">{conditionReport.certifiedGrade || 'Grade A'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Overall Index</span>
                        <span className="text-xl font-black text-slate-900">{conditionReport.overallScore}% / 100</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center border-2 border-emerald-500">
                        {conditionReport.overallScore}%
                      </div>
                    </div>
                  </div>

                  {/* Visual Condition Progress Bars (Section 9 Requirement) */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-black uppercase tracking-wider text-slate-600">
                      Component Performance Breakdown
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* 1. Mechanical */}
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-800">Mechanical Condition:</span>
                          <span className="text-slate-900 font-black">{conditionReport.mechanical}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getBarColor(conditionReport.mechanical)}`}
                            style={{ width: `${conditionReport.mechanical}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          Gearboxes, bearings, sliding table ways, lead screws, and spindle play.
                        </span>
                      </div>

                      {/* 2. Electrical */}
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-800">Electrical Condition:</span>
                          <span className="text-slate-900 font-black">{conditionReport.electrical}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getBarColor(conditionReport.electrical)}`}
                            style={{ width: `${conditionReport.electrical}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          Motor windings insulation, contactors, wiring harnesses, and emergency switches.
                        </span>
                      </div>

                      {/* 3. Cosmetic */}
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-800">Cosmetic Condition:</span>
                          <span className="text-slate-900 font-black">{conditionReport.cosmetic}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getBarColor(conditionReport.cosmetic)}`}
                            style={{ width: `${conditionReport.cosmetic}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          Cast-iron chassis paint, guards, covers, and cosmetic surface patina.
                        </span>
                      </div>

                      {/* 4. Operational */}
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-800">Operational Condition:</span>
                          <span className="text-slate-900 font-black">{conditionReport.operational}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getBarColor(conditionReport.operational)}`}
                            style={{ width: `${conditionReport.operational}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          Full operational test under working feed rate and load cutting cycle.
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Inspector Notes */}
                  {conditionReport.inspectorNotes && (
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                      <span className="text-xs font-bold text-slate-900 block flex items-center space-x-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>Engineer Field Inspector Notes ({conditionReport.inspectorName || 'MTM Certified'})</span>
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        "{conditionReport.inspectorNotes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 3: POWER COMPATIBILITY ── */}
            {activeTab === 'power' && (
              <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center space-x-2 text-[#8B1520] font-bold text-sm">
                  <Zap className="w-4 h-4 text-[#8B1520]" />
                  <span>Workshop Power & Generator Sizing Guide</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block mb-0.5">Operating Voltage</span>
                    <span className="font-bold text-slate-900 text-sm">{product.powerSpecs.voltage}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block mb-0.5">Recommended Generator Sizing</span>
                    <span className="font-bold text-[#8B1520] text-sm">
                      {product.powerSpecs.minGeneratorKVA ? `Min ${product.powerSpecs.minGeneratorKVA} kVA Generator` : 'Grid / 3-Phase Standard'}
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block mb-0.5">Inrush Current Compensation</span>
                    <span className="font-bold text-slate-900 text-sm">Soft-Start / Star-Delta Rated</span>
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed pt-1">
                  In Nigerian industrial workshops (Lagos, Benin City, Kano, Aba), steady power supply is crucial. MTM provides matching Perkins / Mikano / Cummins industrial diesel generator recommendations to ensure seamless continuous production.
                </p>
              </div>
            )}

            {/* ── TAB 4: SMART PRICE & MARKET TRENDS ── */}
            {activeTab === 'trends' && (
              <SmartTrendAnalysis
                product={product}
                onSetPriceAlert={() => setIsPriceAlertOpen(true)}
                onAskAI={handleAskAIAboutProduct}
              />
            )}

            {/* ── TAB 5: SELLER & LOGISTICS ── */}
            {activeTab === 'seller' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Seller Profile */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-rose-50 text-[#8B1520] border border-rose-200 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>{product.seller.name}</span>
                        {product.seller.isVerified && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-100 text-[#8B1520] text-[10px] font-black uppercase tracking-wider shadow-3xs" title="MTM Physically Audited Seller">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#8B1520]" />
                            <span>Verified</span>
                          </span>
                        )}
                      </h4>
                      <span className="text-slate-500 text-[11px]">
                        {product.seller.businessType} • Joined {product.seller.joinedYear} • {product.seller.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-1 text-slate-700">
                    <div>
                      <span className="text-amber-600 font-bold">★ {product.seller.rating}</span> ({product.seller.reviewCount} verified transactions)
                    </div>
                    <div>
                      <span className="text-slate-500">Response:</span> {product.seller.responseTime}
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    {product.seller.verifiedBadges.map(b => (
                      <div key={b} className="flex items-center space-x-1.5 text-emerald-700 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heavy Freight & Rigging */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center space-x-2 text-[#8B1520] font-bold text-sm">
                    <Truck className="w-4 h-4" />
                    <span>Heavy Freight, Rigging & Crane Dispatch</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    MTM coordinates specialized flatbed trucks and mobile crane rigging from <strong>{product.deliveryOptions.originHub}</strong> direct to your factory floor.
                  </p>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Estimated Transit Window:</span>
                      <span className="font-semibold text-slate-900">{product.deliveryOptions.estimatedDays}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Escrow Release:</span>
                      <span className="font-semibold text-emerald-700">Only After Physical Machine Handover</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </>
      )}
    </div>


      </div>

      {/* Embedded Price Alert Modal */}
      {isPriceAlertOpen && (
        <PriceAlertModal
          product={product}
          onClose={() => setIsPriceAlertOpen(false)}
        />
      )}
    </div>
  );
};
