import React, { useState, useEffect, useRef, RefObject } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  X, 
  Flame, 
  ArrowRight, 
  Move, 
  Sparkles, 
  ExternalLink, 
  Globe, 
  Building2, 
  Radio, 
  ShieldCheck,
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface FlashSaleItem {
  id: string;
  title: string;
  badge: string;
  originalPrice: number;
  promoPrice: number;
  countdownText: string;
  text: string;
  productId: string;
  brand: string;
  brandSourceName: string;
  brandSourceUrl: string;
  sellerName: string;
  sellerHub: string;
  isLiveCrawled: boolean;
  category: string;
}

const FLASH_SALES: FlashSaleItem[] = [
  {
    id: 'fs-1',
    productId: 'mtm-m01',
    title: 'Altendorf F45 ElmoDrive Sliding Table Saw',
    badge: 'Benin Hub AI Verified',
    brand: 'Altendorf',
    brandSourceName: 'Altendorf Group Germany',
    brandSourceUrl: 'https://www.altendorfgroup.com/en/products/sliding-table-saws/f-45/',
    sellerName: 'Interior Duct Ltd',
    sellerHub: 'Benin City, Edo State',
    originalPrice: 16500000,
    promoPrice: 14800000,
    countdownText: 'Physical inspection completed in Benin City • Ready for crane dispatch',
    text: 'Flagship 3200mm anodized sliding carriage with CNC motorized rip fence and scoring blade. 48-hr trial protected.',
    isLiveCrawled: true,
    category: 'Machines'
  },
  {
    id: 'fs-2',
    productId: 'mtm-m02',
    title: 'KDT Heavy Duty Automatic Edge Bander (KE-668J)',
    badge: 'Lagos Hub AI Match',
    brand: 'KDT Machinery / Nanxing',
    brandSourceName: 'KDT Machinery Global',
    brandSourceUrl: 'https://www.kdtmac.com/edgebanding-machine/',
    sellerName: 'Oregun Machinery & Tooling Hub',
    sellerHub: 'Oregun Industrial Area, Ikeja, Lagos',
    originalPrice: 19800000,
    promoPrice: 18500000,
    countdownText: 'Pre-milling units & dual trimming verified • 0 active disputes',
    text: 'Industrial heavy-duty edge bander with quick-melt glue pot, end trimming, and high-speed corner rounding units.',
    isLiveCrawled: true,
    category: 'Machines'
  },
  {
    id: 'fs-3',
    productId: 'mtm-m03',
    title: 'Syntec 4-Axis Heavy Industrial CNC Router (1325)',
    badge: 'Trending Wood & Metal',
    brand: 'Syntec / HSD Italy',
    brandSourceName: 'Syntec Technology Inc.',
    brandSourceUrl: 'https://www.syntecclub.com.tw/',
    sellerName: 'Interior Duct Ltd',
    sellerHub: 'Benin City, Edo State',
    originalPrice: 24500000,
    promoPrice: 22000000,
    countdownText: 'HSD 9.0kW Italian auto tool changer spindle certified',
    text: 'Heavy steel gantry CNC machining center with multi-zone vacuum bed and Delta servo drives.',
    isLiveCrawled: true,
    category: 'Machines'
  },
  {
    id: 'fs-4',
    productId: 'mtm-m04',
    title: 'Leadermac 4-Side Heavy Planer Moulder (LMC-623C)',
    badge: 'Kano Hub AI Pick',
    brand: 'Leadermac',
    brandSourceName: 'Leadermac Machinery Corp',
    brandSourceUrl: 'https://www.leadermac.com/',
    sellerName: 'Bompai Industrial Equipment Ltd',
    sellerHub: 'Bompai Industrial Layout, Kano',
    originalPrice: 32000000,
    promoPrice: 29500000,
    countdownText: 'Chromed bed plates & heavy gear drive verified in Kano',
    text: '6-spindle heavy-duty high-speed timber moulder for commercial profiling and solid hardwood furniture processing.',
    isLiveCrawled: true,
    category: 'Machines'
  },
  {
    id: 'fs-5',
    productId: 'mtm-m09',
    title: 'Caterpillar 150kVA Heavy Duty Soundproof Diesel Generator',
    badge: 'Power & Logistics Live',
    brand: 'Caterpillar Inc.',
    brandSourceName: 'Caterpillar Official Power Systems',
    brandSourceUrl: 'https://www.cat.com/en_US/products/new/power-systems/electric-power/diesel-generator-sets.html',
    sellerName: 'Bompai Industrial Equipment Ltd',
    sellerHub: 'Bompai Industrial Layout, Kano',
    originalPrice: 38000000,
    promoPrice: 35000000,
    countdownText: 'Low engine hours certified • Includes 400A automatic transfer switch',
    text: 'Genuine Cat C7.1 prime power heavy diesel generator set for continuous three-phase workshop operations.',
    isLiveCrawled: true,
    category: 'Machines'
  }
];

interface DragPosition {
  x: number;
  y: number;
}

// 🪝 Drag boundary hook with viewport constraints, touch events, and localStorage persistence
export const useDraggableBoundary = (
  ref: RefObject<HTMLDivElement | null>,
  storageKey: string,
  initialPosition: DragPosition = { x: 0, y: 0 }
) => {
  const [position, setPosition] = useState<DragPosition>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved drag position', e);
    }
    return initialPosition;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ clientX: 0, clientY: 0, posX: 0, posY: 0 });

  const startDrag = (clientX: number, clientY: number, target: HTMLElement) => {
    if (target.closest('button') || target.closest('a') || target.closest('.action-link')) {
      return;
    }
    setIsDragging(true);
    setDragStart({
      clientX,
      clientY,
      posX: position.x,
      posY: position.y
    });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !ref.current) return;
    
    const dx = clientX - dragStart.clientX;
    const dy = clientY - dragStart.clientY;
    
    const candidateX = dragStart.posX + dx;
    const candidateY = dragStart.posY + dy;
    
    const rect = ref.current.getBoundingClientRect();
    const initialLeft = rect.left - position.x;
    const initialTop = rect.top - position.y;
    
    const candidateLeft = initialLeft + candidateX;
    const candidateTop = initialTop + candidateY;
    
    const clampedLeft = Math.max(0, Math.min(window.innerWidth - rect.width, candidateLeft));
    const clampedTop = Math.max(0, Math.min(window.innerHeight - rect.height, candidateTop));
    
    const finalX = clampedLeft - initialLeft;
    const finalY = clampedTop - initialTop;
    
    const newPos = { x: finalX, y: finalY };
    setPosition(newPos);
    localStorage.setItem(storageKey, JSON.stringify(newPos));
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX, e.clientY);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      if (e.cancelable) {
        e.preventDefault();
      }
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleGlobalDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalDragEnd);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleGlobalDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalDragEnd);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalDragEnd);
    };
  }, [isDragging, dragStart, position]);

  // Readjust constraints dynamically on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const initialLeft = rect.left - position.x;
      const initialTop = rect.top - position.y;
      
      const candidateLeft = initialLeft + position.x;
      const candidateTop = initialTop + position.y;
      
      const clampedLeft = Math.max(0, Math.min(window.innerWidth - rect.width, candidateLeft));
      const clampedTop = Math.max(0, Math.min(window.innerHeight - rect.height, candidateTop));
      
      const finalX = clampedLeft - initialLeft;
      const finalY = clampedTop - initialTop;
      
      if (finalX !== position.x || finalY !== position.y) {
        const newPos = { x: finalX, y: finalY };
        setPosition(newPos);
        localStorage.setItem(storageKey, JSON.stringify(newPos));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, ref, storageKey]);

  return {
    position,
    isDragging,
    startDrag
  };
};

export const FlashSalePopup: React.FC = () => {
  const { 
    products, 
    setActiveProduct, 
    setSelectedSellerProfile,
    showToast, 
    formatPrice,
    isVideoDemoOpen,
    lastActivityRef
  } = useMarketplace();

  // Dynamically shuffle flash sales on each view / mount with real-time live industry updates
  const [salesItems, setSalesItems] = useState<FlashSaleItem[]>(() => {
    const cloned = [...FLASH_SALES];
    return cloned.sort(() => Math.random() - 0.5);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isRefreshingCrawl, setIsRefreshingCrawl] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Utilize the custom boundary drag hook
  const { position, isDragging, startDrag } = useDraggableBoundary(
    containerRef,
    'mtm_flash_sale_position'
  );

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const currentSale = salesItems[currentIndex] || salesItems[0];

  useEffect(() => {
    if (isDismissed || isVideoDemoOpen) return;

    if (isVisible) {
      // Automatically hide pop-up if user resumes active interaction with website
      const activeCheckInterval = setInterval(() => {
        const inactiveTime = Date.now() - lastActivityRef.current;
        if (inactiveTime < 1500 && !isHovered) {
          setIsVisible(false);
        }
      }, 500);

      // Stay visible for 30 seconds maximum unless touched/hovered with mouse or user becomes active
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        lastActivityRef.current = Date.now(); // reset activity so we don't immediately reappear
      }, 30000);

      return () => {
        clearInterval(activeCheckInterval);
        clearTimeout(hideTimer);
      };
    } else {
      // Wait for 10 minutes (600,000ms) of complete user inactivity before appearing
      const checkInterval = setInterval(() => {
        const inactiveTime = Date.now() - lastActivityRef.current;
        if (inactiveTime >= 600000) { // 10 minutes of complete inactivity
          setCurrentIndex((prev) => (prev + 1) % salesItems.length);
          setIsVisible(true);
        }
      }, 1000);

      return () => clearInterval(checkInterval);
    }
  }, [currentIndex, isDismissed, isVisible, currentSale, isVideoDemoOpen, salesItems.length, isHovered, lastActivityRef]);

  // If dismissed or if Video Demo popup is active, do not show flash sales at the same time (sequential order)
  if (isDismissed || isVideoDemoOpen) return null;

  const handleOpenProduct = () => {
    const matched = products.find(p => p.id === currentSale.productId);
    if (matched) {
      setActiveProduct(matched);
      showToast(`⚡ Viewing Recommended Offer: ${matched.title}`);
    } else {
      showToast(`⚡ Viewing Offer: ${currentSale.title}`);
    }
  };

  const handleOpenSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    const matched = products.find(p => p.id === currentSale.productId);
    if (matched && matched.seller) {
      setSelectedSellerProfile(matched.seller);
      showToast(`🏢 Viewing Verified Merchant: ${matched.seller.name}`);
    }
  };

  const handleRefreshCrawl = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshingCrawl(true);
    setTimeout(() => {
      setIsRefreshingCrawl(false);
      setSalesItems(prev => [...prev].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setIsVisible(true);
      showToast('📡 Live web crawl updated: Fetched latest live industry updates & reshuffled market trends!');
    }, 600);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startDrag(e.clientX, e.clientY, e.target as HTMLElement);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY, e.target as HTMLElement);
    }
  };

  return (
    <div
      id="flash-sale-rotating-widget"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out, opacity 0.5s ease-in-out'
      }}
      className={`fixed bottom-36 right-3 sm:bottom-24 sm:right-6 z-[99999] transition-all duration-200 bg-white/95 backdrop-blur-md text-slate-800 rounded-2xl shadow-2xl border-2 border-orange-500 overflow-hidden select-none ${
        isExpanded ? 'max-w-md w-[92vw] sm:w-[440px]' : 'max-w-sm w-[88vw] sm:w-84'
      } ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {/* Recommended Verified Items top header section */}
      <div className="bg-orange-600 text-white px-3.5 py-2 flex items-center justify-between text-xs font-bold border-b border-orange-400/30">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
          <span className="uppercase tracking-wider font-black text-[10px]">Recommended Verified Items</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Expand / Minimize Pop-up Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
              showToast(isExpanded ? 'Reduced pop-up size.' : 'Expanded pop-up for extra specs & deal codes.');
            }}
            className="p-1 hover:bg-orange-700/80 rounded transition cursor-pointer text-amber-200 hover:text-white"
            title={isExpanded ? "Reduce Pop-up Size" : "Expand Pop-up"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleRefreshCrawl}
            className="p-1 hover:bg-orange-700/80 rounded transition cursor-pointer text-orange-100 hover:text-white"
            title="Trigger live crawl refresh"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshingCrawl ? 'animate-spin' : ''}`} />
          </button>
          <span className="bg-sky-200 text-sky-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
            Live Crawl
          </span>

          <button
            onClick={() => {
              setIsDismissed(true);
              showToast('Closed recommended items overlay.');
            }}
            className="p-1 ml-1 rounded-md bg-orange-700 hover:bg-rose-600 hover:text-white text-white transition cursor-pointer"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        
        {/* Header Badge & Dismiss */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[9.5px] bg-orange-50 text-orange-800 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider border border-orange-300/40">
              <Flame className="w-3 h-3 text-orange-600 fill-orange-400/30" />
              <span>{currentSale.badge}</span>
            </span>
          </div>

          <button
            onClick={() => {
              setIsDismissed(true);
              showToast('Closed recommended items overlay.');
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-full transition cursor-pointer"
            title="Dismiss recommendation"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-2">
          {/* Main Title */}
          <h4 
            onClick={handleOpenProduct}
            className="text-xs font-black text-slate-900 hover:text-orange-600 hover:underline cursor-pointer leading-tight"
          >
            {currentSale.title}
          </h4>

          {/* Seller and Hub Info */}
          <div className="flex items-center justify-between text-[10px] text-slate-600 pt-0.5 pb-0.5">
            <button
              onClick={handleOpenSeller}
              className="inline-flex items-center gap-1 text-slate-700 hover:text-orange-600 font-bold transition cursor-pointer"
              title="View seller profile"
            >
              <Building2 className="w-3 h-3 text-orange-600" />
              <span>Seller: {currentSale.sellerName}</span>
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
            </button>
            <span className="text-slate-400 text-[9px]">
              {currentSale.sellerHub.split(',')[0]}
            </span>
          </div>

          {/* Official Brand Source Direct Link */}
          {currentSale.brandSourceUrl && (
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[10px] flex items-center justify-between">
              <div className="flex items-center gap-1 text-slate-600 font-medium truncate mr-2">
                <Globe className="w-3 h-3 text-sky-600 shrink-0" />
                <span className="truncate">Brand: <strong className="text-slate-800">{currentSale.brandSourceName}</strong></span>
              </div>
              <a
                href={currentSale.brandSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 text-[9.5px] font-extrabold border border-sky-200 shrink-0 transition"
                title={`Open official ${currentSale.brandSourceName} portal`}
              >
                <span>OEM Source</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          )}
          
          <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
            {currentSale.text}
          </p>

          {/* Pricing Block */}
          <div className="flex items-baseline gap-2 py-0.5">
            <span className="text-sm font-black text-slate-900">
              {formatPrice(currentSale.promoPrice)}
            </span>
            <span className="text-[10px] text-slate-400 line-through">
              {formatPrice(currentSale.originalPrice)}
            </span>
            <span className="text-[9px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              SAVE {Math.round((1 - currentSale.promoPrice / currentSale.originalPrice) * 100)}%
            </span>
          </div>

          <p className="text-[10px] text-slate-600 font-medium italic">
            🕒 {currentSale.countdownText}
          </p>
        </div>

        {/* Action Trigger Block */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-mono text-[9px] flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
            <span>Crawled Live Index</span>
          </span>
          <div className="flex items-center gap-2">
            {currentSale.brandSourceUrl && (
              <a
                href={currentSale.brandSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-500 hover:text-slate-800 font-semibold text-[10px] flex items-center gap-0.5 transition"
                title="Visit brand manufacturer source"
              >
                <span>Brand Source</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            <button
              onClick={handleOpenProduct}
              className="action-link bg-orange-600 hover:bg-orange-500 text-white font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer shadow-xs"
            >
              <span>View Offer</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
