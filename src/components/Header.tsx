import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  MapPin, 
  ArrowRightLeft, 
  User, 
  Store,
  ShieldAlert,
  ChevronDown, 
  ChevronRight,
  SlidersHorizontal,
  Flame,
  PlusCircle,
  Wrench,
  Cpu,
  Package,
  FileCheck,
  Building2,
  PhoneCall,
  Bell,
  TrendingUp,
  Clock,
  Trash2,
  Tag,
  Menu,
  X,
  Truck,
  AlertTriangle,
  Scale,
  Bot,
  Trophy,
  QrCode,
  Repeat,
  Globe,
  Glasses,
  Box,
  Zap,
  Calculator,
  FileText,
  Activity,
  Video,
  Tv,
  PlayCircle,
  UploadCloud
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { INDUSTRIAL_HUBS, PRODUCTS_DATA } from '../data/mockData';
import { VoiceInputButton } from './VoiceInputButton';
import { SearchHistorySidebar } from './SearchHistorySidebar';
import { LanguageSelector } from './LanguageSelector';
import { FileSpreadsheet } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currency,
    setCurrency,
    selectedHub,
    setSelectedHub,
    filterState,
    setFilterState,
    cart,
    setIsCartOpen,
    compareList,
    setIsCompareOpen,
    setIsAIAdvisorOpen,
    setIsMtmAgentOpen,
    setIsSellModalOpen,
    setActiveProduct,
    selectedCategory,
    setSelectedCategory,
    setSelectedSubcategory,
    unreadNotificationCount,
    setIsNotificationsOpen,
    setIsMarketTrendsOpen,
    setIsPrototypesOpen,
    setPrototypeInitialRole,
    searchHistory,
    addSearchHistory,
    clearSearchHistory,
    openOrderTracking,
    setIsInventoryAlertOpen,
    openDisputeCenter,
    setIsTermsModalOpen,
    hasAcceptedTerms,
    siteSettings,
    isSupportHubOpen,
    setIsSupportHubOpen,
    setIsQrScannerOpen,
    setIsQuickReorderOpen,
    isOffline,
    setIsOffline,
    setIsForecastingOpen,
    setIsBulkImportOpen,
    setIsVrShowroomOpen,
    setIsEnergyCalculatorOpen,
    setIsArPlacementOpen,
    setIsUnitConverterOpen,
    setIsMaintenanceAlertsOpen,
    openIoTSensorModal,
    openPurchaseOrderModal,
    openVideoDemo,
    setIsVideoUploadOpen,
    showToast,
    t
  } = useMarketplace();

  const [searchInput, setSearchInput] = useState(filterState.search);
  const [searchCategory, setSearchCategory] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const autocompleteProducts = searchInput.trim().length > 0
    ? PRODUCTS_DATA.filter(p =>
        p.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.category.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(searchInput.toLowerCase()) ||
        (p.seller && p.seller.name && p.seller.name.toLowerCase().includes(searchInput.toLowerCase()))
      ).slice(0, 5)
    : [];
  const [isSearchHistorySidebarOpen, setIsSearchHistorySidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [isTopbarToolsOpen, setIsTopbarToolsOpen] = useState(false);
  const [isIndustrialToolsOpen, setIsIndustrialToolsOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);

  // Dynamic Real-Time Market Trend Headlines state
  const [marketTrendHeadlines, setMarketTrendHeadlines] = useState<string[]>([
    '📈 MARKET TREND: Industrial Steel & Rebar Benchmark Rates Drop 2.4%',
    '📊 SUPPLY CHAIN: Steel H-Beam & Sheet Metal Rates Holding at ₦1,250/kg',
    '⚡ PRICE TREND: 50kVA-150kVA Perkins Diesel Genset & Hybrid Solar Demand +18%',
    '🚛 LOGISTICS TREND: Benin City, Port Harcourt & Kano Heavy Freight Corridors Cleared',
    '⚙️ CNC MACHINERY: West Africa Woodworking & Milling Router Tariffs (-4.2%)'
  ]);

  // Fetch real-time refreshed news from industry news endpoint
  useEffect(() => {
    let isMounted = true;
    const fetchRealtimeNews = async () => {
      try {
        const res = await fetch('/api/ai/industry-news');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          const freshHeadlines = data.articles.map((art: any) => {
            const tag = art.trendIndicator === 'UPWARD' ? '📈' : art.trendIndicator === 'HIGH_DEMAND' ? '⚡' : art.trendIndicator === 'STABLE' ? '📊' : '📉';
            let catPrefix = 'MARKET TREND';
            if (art.category) {
              const cUpper = art.category.toUpperCase();
              if (cUpper.includes('STEEL') || cUpper.includes('METAL')) catPrefix = 'SUPPLY CHAIN';
              else if (cUpper.includes('POWER') || cUpper.includes('GENSET') || cUpper.includes('ENERGY')) catPrefix = 'PRICE TREND';
              else if (cUpper.includes('LOGISTICS') || cUpper.includes('FREIGHT')) catPrefix = 'LOGISTICS TREND';
              else if (cUpper.includes('CNC') || cUpper.includes('WOODWORKING') || cUpper.includes('MACHINERY')) catPrefix = 'EQUIPMENT TREND';
              else catPrefix = cUpper;
            }
            return `${tag} ${catPrefix}: ${art.title}`;
          });
          setMarketTrendHeadlines(freshHeadlines);
        }
      } catch (err) {
        // Fallback gracefully
      }
    };
    fetchRealtimeNews();
  }, []);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const aiMenuRef = useRef<HTMLDivElement>(null);
  const topbarToolsRef = useRef<HTMLDivElement>(null);
  const industrialToolsRef = useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const hamburgerMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (aiMenuRef.current && !aiMenuRef.current.contains(e.target as Node)) {
        setIsAiMenuOpen(false);
      }
      if (topbarToolsRef.current && !topbarToolsRef.current.contains(e.target as Node)) {
        setIsTopbarToolsOpen(false);
      }
      if (industrialToolsRef.current && !industrialToolsRef.current.contains(e.target as Node)) {
        setIsIndustrialToolsOpen(false);
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(e.target as Node)) {
        setIsCategoriesDropdownOpen(false);
      }
      if (
        hamburgerMenuRef.current &&
        !hamburgerMenuRef.current.contains(e.target as Node) &&
        hamburgerBtnRef.current &&
        !hamburgerBtnRef.current.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerSearchQuery = (query: string, cat = 'All') => {
    setSearchInput(query);
    addSearchHistory(query);
    setIsSearchFocused(false);

    // Smart natural language parser
    let parsedCat = cat;
    let parsedMaxPrice = 50000000;
    const lower = query.toLowerCase();

    if (lower.includes('edge bander') || lower.includes('saw') || lower.includes('cnc') || lower.includes('lathe') || lower.includes('press')) {
      parsedCat = 'Machines';
    } else if (lower.includes('timber') || lower.includes('steel') || lower.includes('wood') || lower.includes('sheet')) {
      parsedCat = 'Materials';
    } else if (lower.includes('drill') || lower.includes('router bit') || lower.includes('blade')) {
      parsedCat = 'Tools';
    }

    if (lower.includes('< 5m') || lower.includes('under 5m') || lower.includes('under ₦5m')) parsedMaxPrice = 5000000;
    if (lower.includes('< 7m') || lower.includes('under 7m') || lower.includes('under ₦7m')) parsedMaxPrice = 7000000;
    if (lower.includes('< 10m') || lower.includes('under 10m')) parsedMaxPrice = 10000000;

    setFilterState(prev => ({
      ...prev,
      search: query,
      category: parsedCat,
      priceRange: [0, parsedMaxPrice]
    }));
    setActiveProduct(null);

    if (parsedCat === 'Machines') setActiveView('machines');
    else if (parsedCat === 'Tools') setActiveView('tools');
    else if (parsedCat === 'Materials') setActiveView('materials');
    else {
      setActiveView('category-feed');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      triggerSearchQuery(searchInput, searchCategory);
    } else {
      setFilterState(prev => ({ ...prev, search: '', category: searchCategory }));
      setActiveView('machines');
    }
  };

  const handleNavClick = (view: string, cat = 'All', sub = 'All') => {
    setActiveProduct(null);
    setActiveView(view);
    setSelectedCategory(cat);
    setSelectedSubcategory(sub);
    setFilterState(prev => ({
      ...prev,
      category: cat,
      subcategory: sub,
    }));
    // Smoothly scroll straight to the top of respective pages for ease of scrolling
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Ticker / Status Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 sm:px-6 py-2 flex justify-between items-center text-xs border-b border-slate-800">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 opacity-90">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Marketplace Status:</span>
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">Online</span>
          </div>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="hidden md:inline text-slate-400">Verified Sellers: <strong className="text-white font-semibold">1,402</strong></span>
          <span className="hidden lg:inline text-slate-700">|</span>
          <div className="hidden lg:flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Escrow Protected</span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Regional Hub Selector */}
          <div className="flex items-center gap-1 text-slate-300 text-xs">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <select
              id="header-hub-select"
              value={selectedHub}
              onChange={e => {
                setSelectedHub(e.target.value);
                setFilterState(prev => ({ ...prev, locationHub: e.target.value }));
              }}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer border-b border-dashed border-slate-600 hover:text-white transition"
            >
              {INDUSTRIAL_HUBS.map(hub => (
                <option key={hub} value={hub} className="bg-slate-900 text-white">
                  {hub}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Toggle */}
          <div className="hidden md:flex items-center bg-slate-800 rounded p-0.5 border border-slate-700 text-[11px]">
            <button
              id="curr-ngn-btn"
              onClick={() => setCurrency('NGN')}
              className={`px-2 py-0.5 rounded font-bold transition ${
                currency === 'NGN' ? 'bg-[#8B1520] text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              ₦ NGN
            </button>
            <button
              id="curr-usd-btn"
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 rounded font-bold transition ${
                currency === 'USD' ? 'bg-[#8B1520] text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Language Selector Dropdown */}
          <div className="hidden md:inline-block">
            <LanguageSelector variant="topbar" />
          </div>

          {/* Topbar: Alerts & Cart */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border shadow-2xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700"
              title="Price Drop Alerts & Inspection Updates"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Alerts</span>
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#8B1520] text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border shadow-2xs ${
                cart.length > 0
                  ? 'bg-[#8B1520] text-white border-[#72111A] ring-2 ring-[#8B1520]/20 hover:bg-[#72111A]'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
              }`}
              title="View Cart & Orders"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="bg-white/20 text-white text-[10px] font-black px-1.5 py-0.5 rounded ml-0.5">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Industrial Utilities & Tools Hamburger Dropdown Menu (Organized for all screen sizes) */}
          <div ref={topbarToolsRef} className="relative inline-block text-left">
            <button
              id="topbar-tools-dropdown-btn"
              onClick={() => {
                setIsTopbarToolsOpen(!isTopbarToolsOpen);
                setIsIndustrialToolsOpen(false);
                setIsAiMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border shadow-2xs ${
                isTopbarToolsOpen
                  ? 'bg-[#8B1520] text-white border-[#72111A] ring-2 ring-[#8B1520]/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
              }`}
              title="Industrial Tools: Purchase Orders, Forecasting, Bulk Import, QR Scanner, Quick Reorder, VR Showroom, Energy Calc, Unit Converter, Maintenance Alerts, Inspection Reports, Support Hub"
              aria-label="Industrial Tools Menu"
            >
              <Menu className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="font-extrabold text-[11px] sm:text-xs">Tools & Utilities</span>
              <span className="bg-[#8B1520] text-white text-[9px] font-black px-1 py-0.5 rounded border border-rose-900 hidden xs:inline">13</span>
              <ChevronDown className={`w-3 h-3 opacity-80 shrink-0 transition-transform ${isTopbarToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTopbarToolsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-[1050] animate-fadeIn text-xs text-slate-800">
                <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-rose-50 text-[#8B1520]">
                      <Menu className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Industrial Utilities</h4>
                      <p className="text-[10px] text-slate-500">Calculators, Operations & Procurement</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-rose-50 text-[#8B1520] font-bold px-2 py-0.5 rounded-full border border-rose-200">11 Hubs</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[75vh] overflow-y-auto pr-0.5 scrollbar-thin">
                  {/* 0. Purchase Order Generator */}
                  <button
                    id="dropdown-po-generator-btn"
                    onClick={() => { openPurchaseOrderModal(); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group col-span-1 sm:col-span-2 bg-slate-50/50"
                  >
                    <div className="p-1.5 rounded-lg bg-[#8B1520] text-white border border-[#72111A] group-hover:bg-[#72111A] transition shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1.5">
                        <span>Purchase Order Generator</span>
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 rounded font-black">PDF</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">Corporate Procurement & Escrow Requisitions</div>
                    </div>
                  </button>

                  {/* 1. Forecasting */}
                  <button
                    onClick={() => { setIsForecastingOpen(true); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 group-hover:bg-indigo-100 transition shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">Forecasting</div>
                      <div className="text-[10px] text-slate-500 truncate">AI Demand Velocity</div>
                    </div>
                  </button>

                  {/* 2. Bulk Import */}
                  <button
                    onClick={() => { setIsBulkImportOpen(true); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 group-hover:bg-blue-100 transition shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">Bulk Import</div>
                      <div className="text-[10px] text-slate-500 truncate">CSV & Excel Batch</div>
                    </div>
                  </button>

                  {/* 3. QR Scanner */}
                  <button
                    id="dropdown-qr-scanner-btn"
                    onClick={() => { setIsQrScannerOpen(true); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 group-hover:bg-amber-100 transition shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">QR Scanner</div>
                      <div className="text-[10px] text-slate-500 truncate">Asset Barcode Reader</div>
                    </div>
                  </button>

                  {/* 4. Quick Reorder */}
                  <button
                    id="dropdown-quick-reorder-btn"
                    onClick={() => { setIsQuickReorderOpen(true); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 group-hover:bg-sky-100 transition shrink-0">
                      <Repeat className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">Quick Reorder</div>
                      <div className="text-[10px] text-slate-500 truncate">1-Click Replenish</div>
                    </div>
                  </button>

                  {/* 5. VR Showroom */}
                  <button
                    onClick={() => { setIsVrShowroomOpen(true); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-rose-50 text-[#8B1520] border border-rose-200 group-hover:bg-rose-100 transition shrink-0">
                      <Glasses className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">VR Showroom</div>
                      <div className="text-[10px] text-slate-500 truncate">360° Factory Tours</div>
                    </div>
                  </button>

                  {/* 6. Energy Calc */}
                  <button
                    onClick={() => { setIsEnergyCalculatorOpen(true); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 group-hover:bg-amber-100 transition shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">Energy Calc</div>
                      <div className="text-[10px] text-slate-500 truncate">Power & Fuel Load</div>
                    </div>
                  </button>

                  {/* 7. Unit Converter */}
                  <button
                    onClick={() => { setIsUnitConverterOpen(true); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 group-hover:bg-cyan-100 transition shrink-0">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">Unit Converter</div>
                      <div className="text-[10px] text-slate-500 truncate">kW/HP, mm/in, kg/lb</div>
                    </div>
                  </button>

                  {/* 8. Maintenance Alerts */}
                  <button
                    onClick={() => { setIsMaintenanceAlertsOpen(true); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 group-hover:bg-red-100 transition shrink-0">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">Maintenance Alerts</div>
                      <div className="text-[10px] text-slate-500 truncate">Fault Log History</div>
                    </div>
                  </button>

                  {/* 8.5 IoT Sensor Integration */}
                  <button
                    id="dropdown-iot-sensor-btn"
                    onClick={() => { openIoTSensorModal(); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 group-hover:bg-cyan-100 transition shrink-0">
                      <Activity className="w-4 h-4 text-cyan-600 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1">
                        <span>IoT Sensor Monitor</span>
                        <span className="text-[8px] bg-cyan-100 text-cyan-800 font-black px-1 rounded">LIVE</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">Vibration & Temp Analytics</div>
                    </div>
                  </button>

                  {/* 9. Inspection Reports */}
                  <button
                    id="dropdown-inspection-btn"
                    onClick={() => { handleNavClick('account'); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-100 transition shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">Inspection Reports</div>
                      <div className="text-[10px] text-slate-500 truncate">42-Point Run Tests</div>
                    </div>
                  </button>

                  {/* 10. Support Hub */}
                  <button
                    id="dropdown-support-hub-btn"
                    onClick={() => { setIsSupportHubOpen(true); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-100 transition shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">Support Hub</div>
                      <div className="text-[10px] text-slate-500 truncate">Escrow Helpdesk</div>
                    </div>
                  </button>

                  {/* 11. Marketplace Demo Videos */}
                  <button
                    id="dropdown-video-demo-btn"
                    onClick={() => { openVideoDemo('mtm-how-it-works-master'); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group col-span-1 sm:col-span-2 bg-slate-50/50"
                  >
                    <div className="p-1.5 rounded-lg bg-[#8B1520] text-white border border-[#72111A] group-hover:bg-[#72111A] transition shrink-0">
                      <PlayCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1.5">
                        <span>Video Walkthrough & Demos</span>
                        <span className="text-[8px] bg-amber-100 text-amber-800 px-1 rounded font-black">HOW IT WORKS</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">Platform Guide, Run-Tests & Escrow Safety</div>
                    </div>
                  </button>

                  {/* 12. Video Upload & Live Stream Hub */}
                  <button
                    id="dropdown-video-upload-btn"
                    onClick={() => { setIsVideoUploadOpen(true); setIsTopbarToolsOpen(false); }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer border border-slate-100 group col-span-1 sm:col-span-2 bg-slate-50/50"
                  >
                    <div className="p-1.5 rounded-lg bg-[#8B1520] text-white border border-[#72111A] group-hover:bg-[#72111A] transition shrink-0">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1.5">
                        <span>Video Upload & Stream Hub</span>
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 rounded font-black">LIVE STREAM</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">Publish Run-Tests & Equipment Footage</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Moving Advertising Bar / Marquee */}
      <div className="bg-slate-950 text-slate-300 overflow-hidden py-1.5 border-b border-slate-800 shadow-inner relative flex items-center">
        <style>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee-scroll {
            display: flex;
            width: max-content;
            animation: marquee-scroll 45s linear infinite;
          }
          .animate-marquee-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="animate-marquee-scroll text-[11px] sm:text-xs font-bold tracking-wide gap-10 px-4">
          <span className="flex items-center gap-1.5 whitespace-nowrap"><Sparkles className="w-3.5 h-3.5 text-rose-400" /> AI-Powered Machinery Matchmaker</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap text-amber-400">🔥 FLASH DEAL: Haas UMC-750 5-Axis CNC - 15% OFF</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Escrow Protected Payments</span>
          {/* Dynamic Real-Time Independent Market, Price & Supply Chain Trend Buttons */}
          {marketTrendHeadlines.map((headline, idx) => (
            <button
              key={`marquee-trend-item-${idx}`}
              type="button"
              onClick={() => {
                setIsMarketTrendsOpen(true);
                showToast("📈 Opening Real-Time Industry News, Supply Chain & Price Trends Dashboard");
              }}
              className="flex items-center gap-1.5 whitespace-nowrap text-slate-200 hover:text-white font-medium cursor-pointer transition bg-slate-900 hover:bg-slate-800 px-3 py-0.5 rounded-full border border-slate-700 shadow-xs group"
              title="Click to view full Industry News, Supply Chain & Price Trends Dashboard"
            >
              <span className="animate-pulse text-[#8B1520]">🔥</span>
              <span className="text-slate-200 font-medium group-hover:underline tracking-normal">
                {headline}
              </span>
              <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-bold uppercase tracking-wide ml-1">
                Live Feed
              </span>
            </button>
          ))}
          <span className="flex items-center gap-1.5 whitespace-nowrap"><Truck className="w-3.5 h-3.5 text-blue-400" /> Nationwide Freight & Logistics Hub</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap text-rose-400">🆕 NEW ARRIVAL: 2024 CAT 320 Excavator (Verified)</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap"><Glasses className="w-3.5 h-3.5 text-rose-400" /> VR Showroom & AR Placement</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap text-purple-400">⚡ FEATURED: Complete Warehouse Conveyor System (Used)</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap"><FileText className="w-3.5 h-3.5 text-emerald-400" /> Purchase Order Generator</span>
        </div>
      </div>

      {/* Main Search & Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 relative z-[1000]">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Brand Logo - Responsive & Flex Shrink-0 protected */}
          <div
            id="mtm-logo-btn"
            onClick={() => handleNavClick('home')}
            className="cursor-pointer flex items-center gap-1.5 sm:gap-2 group select-none shrink-0 min-w-0"
          >
            <div className="bg-[#8B1520] p-1.5 sm:p-2 rounded-lg shadow-xs group-hover:bg-[#72111A] transition shrink-0 border border-[#72111A]">
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white flex items-center justify-center font-black text-white italic text-xs sm:text-base">
                M
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[clamp(11px,3.2vw,20px)] sm:text-lg md:text-xl lg:text-2xl font-black tracking-tight text-slate-900 leading-none whitespace-nowrap select-none">
                {siteSettings?.siteTitle || 'MTM - Marketplace'}
              </h1>
              <span className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wide">Machine Tools and Materials</span>
            </div>
          </div>

          {/* Search Input Bar with Smart Search & History Context */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl hidden md:block relative">
            <form onSubmit={handleSearchSubmit} className="flex items-stretch shadow-xs rounded-lg overflow-hidden border border-slate-300 focus-within:border-[#8B1520] bg-white transition">
              <select
                id="search-category-dropdown"
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 border-r border-slate-200 focus:outline-none cursor-pointer hover:bg-slate-100 transition"
              >
                <option value="All" className="bg-white text-slate-900">All Sectors</option>
                <option value="Machines" className="bg-white text-slate-900">Machines</option>
                <option value="Tools" className="bg-white text-slate-900">Tools</option>
                <option value="Materials" className="bg-white text-slate-900">Materials</option>
              </select>

              <div className="relative flex-1 flex items-center">
                <input
                  id="main-industrial-search-input"
                  type="text"
                  value={searchInput}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={e => {
                    setSearchInput(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  placeholder="Search CNC lathes, edge banders, panel saws, timber, welding..."
                  className="w-full h-full pl-4 pr-20 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-white"
                />
                
                <div className="absolute right-2 flex items-center gap-1 z-10">
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        setFilterState(prev => ({ ...prev, search: '' }));
                      }}
                      className="p-1 text-xs text-slate-400 hover:text-slate-600 mr-0.5"
                      title="Clear search input"
                    >
                      ✕
                    </button>
                  )}

                  {/* Voice Input Button */}
                  <VoiceInputButton
                    onTranscript={(transcript) => {
                      setSearchInput(transcript);
                      triggerSearchQuery(transcript, searchCategory);
                    }}
                  />

                  {/* QR Code Scanner Button */}
                  <button
                    type="button"
                    onClick={() => setIsQrScannerOpen(true)}
                    className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition cursor-pointer"
                    title="Scan Machinery Asset QR Code or Escrow Barcode"
                  >
                    <QrCode className="w-4 h-4 text-amber-700" />
                  </button>

                  {/* History Sidebar Drawer Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsSearchHistorySidebarOpen(true)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 border border-slate-200 transition cursor-pointer"
                    title="Open Search History & Sidebar Filters"
                  >
                    <Clock className="w-4 h-4 text-orange-600" />
                  </button>
                </div>
              </div>

              <button
                id="main-search-submit-btn"
                type="submit"
                className="bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white px-6 py-2 rounded-r-md font-bold text-sm transition active:scale-95 flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer shadow-md border-y border-r border-[#7A101A]/50"
              >
                <Search className="w-4 h-4" />
                <span>SEARCH</span>
              </button>
            </form>

            {/* Smart Search Dropdown Popover */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 animate-fadeIn space-y-3">
                {/* AI Smart Intent Auto-Detection */}
                {searchInput.trim().length > 1 && (
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#1E40AF]" />
                      <div>
                        <span className="font-extrabold text-[#1E40AF] block text-[11px] uppercase tracking-wider">AI Search Logic</span>
                        <span className="text-slate-700">
                          Searching: <strong className="text-slate-900">"{searchInput}"</strong>
                          {searchInput.toLowerCase().includes('edge') || searchInput.toLowerCase().includes('saw') ? ' • sector: Machines' : ''}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerSearchQuery(searchInput, searchCategory)}
                      className="text-[11px] font-bold text-white bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] px-2.5 py-1 rounded transition cursor-pointer shadow-xs"
                    >
                      Execute Smart Filter
                    </button>
                  </div>
                )}

                {/* Search History Context Section */}
                {searchHistory.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-blue-600" /> Recent Search History:
                      </span>
                      <button
                        onClick={clearSearchHistory}
                        className="text-slate-400 hover:text-red-600 flex items-center gap-0.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Clear History
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {searchHistory.map((query, idx) => (
                        <button
                          key={idx}
                          onClick={() => triggerSearchQuery(query)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#1E40AF] border border-slate-200 hover:border-blue-300 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Tag className="w-3 h-3 text-slate-400" />
                          <span>{query}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Live Industry Searches & Auto-Complete */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-600">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> 
                      {searchInput.trim().length > 0 ? `Auto-Complete Results for "${searchInput}"` : 'Trending Machinery Searches:'}
                    </span>
                    <span className="text-[10px] text-orange-600 font-extrabold bg-orange-50 px-2 py-0.5 rounded">Live Index</span>
                  </div>

                  {searchInput.trim().length > 0 && autocompleteProducts.length > 0 ? (
                    <div className="space-y-1.5 max-h-56 overflow-y-auto">
                      {autocompleteProducts.map((prod) => (
                        <button
                          key={prod.id}
                          onClick={() => triggerSearchQuery(prod.title, prod.category)}
                          className="w-full p-2 rounded-lg bg-slate-50 hover:bg-orange-50 text-left transition flex items-center justify-between border border-slate-200 hover:border-orange-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded bg-slate-200 overflow-hidden shrink-0">
                              <img src={prod.images?.[0]} alt={prod.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-700">{prod.title}</div>
                              <div className="text-[10px] text-slate-500 truncate">{prod.category} • {prod.subcategory} • ₦{(prod.priceNGN / 1000000).toFixed(1)}M</div>
                            </div>
                          </div>
                          <span className="text-[10px] bg-white text-slate-600 group-hover:bg-orange-600 group-hover:text-white px-2 py-0.5 rounded font-bold transition shrink-0 border border-slate-200">
                            Select
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : searchInput.trim().length > 0 ? (
                    <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
                      No exact product match found for "{searchInput}". Try searching broader terms like "CNC", "Saw", "Welder", or "Timber".
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <button
                        onClick={() => triggerSearchQuery("Heavy Duty Edge Bander", "Machines")}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-left font-bold text-slate-800 transition flex items-center justify-between border border-slate-200 cursor-pointer"
                      >
                        <span>Heavy Duty Edge Bander</span>
                        <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-1.5 py-0.5 rounded">Spotlight</span>
                      </button>
                      <button
                        onClick={() => triggerSearchQuery("SCM Si400 Panel Saw", "Machines")}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-left font-bold text-slate-800 transition flex items-center justify-between border border-slate-200 cursor-pointer"
                      >
                        <span>SCM Si400 Panel Saw</span>
                        <span className="text-[10px] text-blue-700 font-extrabold bg-blue-100 px-1.5 py-0.5 rounded">3-Phase</span>
                      </button>
                      <button
                        onClick={() => triggerSearchQuery("Interior Duct Ltd Benin City", "Machines")}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-left font-bold text-slate-800 transition flex items-center justify-between border border-slate-200 cursor-pointer"
                      >
                        <span>Interior Duct Ltd (Benin)</span>
                        <span className="text-[10px] text-purple-700 font-extrabold bg-purple-100 px-1.5 py-0.5 rounded">Tier 1</span>
                      </button>
                      <button
                        onClick={() => triggerSearchQuery("Yawei CNC Press Brake", "Machines")}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-left font-bold text-slate-800 transition flex items-center justify-between border border-slate-200 cursor-pointer"
                      >
                        <span>Yawei Press Brake</span>
                        <span className="text-[10px] text-amber-700 font-extrabold bg-amber-100 px-1.5 py-0.5 rounded">Liquidation</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-2 sm:gap-3 text-sm font-semibold shrink-0">
            {/* Desktop Action Items - Hidden on mobile (< md), organized in hamburger menu */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3">
              {/* Sell on MTM */}
            <button
              id="header-sell-btn"
              onClick={() => setIsSellModalOpen(true)}
              className="text-[#8B1520] hover:text-[#72111A] font-extrabold text-xs sm:text-sm transition hidden xl:inline-block cursor-pointer mr-1"
            >
              Sell on MTM
            </button>



            {/* 🛠️ Industrial Utilities Dropdown */}
            <div ref={industrialToolsRef} className="relative inline-block text-left hidden md:inline-block">
              <button
                type="button"
                onClick={() => {
                  setIsIndustrialToolsOpen(!isIndustrialToolsOpen);
                  setIsAiMenuOpen(false);
                  setIsTopbarToolsOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition shadow-xs cursor-pointer ${
                  isIndustrialToolsOpen
                    ? 'bg-[#8B1520] text-white border-[#72111A]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B1520]" />
                <span>Industrial Tools</span>
                <ChevronDown className={`w-3 h-3 shrink-0 opacity-80 transition-transform ${isIndustrialToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isIndustrialToolsOpen && (
                <div className="absolute right-0 mt-1.5 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2.5 z-[1050] animate-fadeIn space-y-1 text-slate-800">
                  <div className="px-2 py-1 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span>Escrow, POs & Logistics</span>
                    <span className="text-[#8B1520] bg-rose-50 px-1.5 py-0.5 rounded font-bold border border-rose-200">5 Systems</span>
                  </div>
                  
                  {/* Purchase Order Generator */}
                  <button
                    id="industrial-menu-po-generator-btn"
                    onClick={() => {
                      openPurchaseOrderModal();
                      setIsIndustrialToolsOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 transition flex items-start gap-2.5 cursor-pointer border border-blue-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-600 text-white group-hover:bg-blue-700 transition shrink-0 mt-0.5 shadow-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <span>Purchase Order Generator</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1 rounded">PDF EXPORT</span>
                      </div>
                      <p className="text-[10px] text-blue-700/80 mt-0.5">Formal corporate procurement requisition & bank quotes</p>
                    </div>
                  </button>

                  {/* IoT Sensor Integration */}
                  <button
                    id="industrial-menu-iot-sensor-btn"
                    onClick={() => {
                      openIoTSensorModal();
                      setIsIndustrialToolsOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-cyan-50/70 hover:bg-cyan-100/80 transition flex items-start gap-2.5 cursor-pointer border border-cyan-100 group"
                  >
                    <div className="p-1.5 rounded-lg bg-cyan-600 text-white group-hover:bg-cyan-700 transition shrink-0 mt-0.5 shadow-xs">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-cyan-950 flex items-center gap-1.5">
                        <span>IoT Sensor Integration</span>
                        <span className="bg-cyan-200 text-cyan-900 text-[8px] font-black px-1 rounded">TELEMETRY</span>
                      </div>
                      <p className="text-[10px] text-cyan-800/80 mt-0.5">Real-time vibration velocity & bearing thermal analytics</p>
                    </div>
                  </button>

                  {/* Order Tracking */}
                  <button
                    onClick={() => {
                      openOrderTracking();
                      setIsIndustrialToolsOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-start gap-2.5 cursor-pointer"
                  >
                    <Truck className="w-4.5 h-4.5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>Order & Freight Tracking</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Real-time lowbed trailer routing & carrier milestones</p>
                    </div>
                  </button>

                  {/* Inventory Stock Alerts */}
                  <button
                    onClick={() => {
                      setIsInventoryAlertOpen(true);
                      setIsIndustrialToolsOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-start gap-2.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Stock & Price Drop Alerts</div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Automated safety levels & customized equipment thresholds</p>
                    </div>
                  </button>

                  {/* Terms & Escrow Shield */}
                  <button
                    onClick={() => {
                      setIsTermsModalOpen(true);
                      setIsIndustrialToolsOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-start gap-2.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center justify-between gap-2">
                        <span>Escrow Shield Guarantee</span>
                        <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded uppercase ${hasAcceptedTerms ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {hasAcceptedTerms ? 'Active' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">NITDA & FCCPA compliant secured fund protection framework</p>
                    </div>
                  </button>

                  {/* Dispute Resolution */}
                  <button
                    onClick={() => {
                      openDisputeCenter();
                      setIsIndustrialToolsOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-start gap-2.5 cursor-pointer"
                  >
                    <Scale className="w-4.5 h-4.5 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Arbitration & Dispute Center</div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Escrow refund claims, technician panels & site test mediation</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

            {/* Personal Actions Cluster */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* AI Matchmaker Button */}
              <button
                onClick={() => setIsAIAdvisorOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white text-xs font-bold transition shadow-xs border border-[#7A101A] cursor-pointer"
                title="AI Matchmaker & Sizing Advisor"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">AI Matchmaker</span>
              </button>

              {/* Compare Button */}
              <button
                id="open-compare-btn"
                onClick={() => setIsCompareOpen(true)}
                className="hidden sm:block relative p-2 rounded-lg text-slate-600 hover:text-[#8B1520] hover:bg-slate-100 transition cursor-pointer"
                title="Compare Equipment Specifications"
              >
                <ArrowRightLeft className="w-5 h-5" />
                {compareList.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#8B1520] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {compareList.length}
                  </span>
                )}
              </button>

              {/* Account / Portal - Last item on the row */}
              <button
                id="header-account-btn"
                onClick={() => handleNavClick('account')}
                className={`hidden sm:flex items-center gap-1.5 p-1 px-2 py-1 sm:p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition cursor-pointer ${
                  activeView === 'account'
                    ? 'bg-rose-50 text-[#8B1520] border border-rose-200'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-[#8B1520] border border-transparent'
                }`}
                title="User & Enterprise Account Portal"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden lg:inline text-xs font-bold">Portal</span>
              </button>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-1.5 sm:gap-2 mr-1">
          </div>
          {/* Prominent Hamburger Menu Toggle Button (3 horizontal lines) - Easily locatable on all mobile & desktop views, side-by-side with MTM-Marketplace title */}
          <button
            ref={hamburgerBtnRef}
            id="mobile-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all border-2 cursor-pointer shrink-0 shadow-xs ${
                isMobileMenuOpen
                  ? 'bg-rose-50 text-[#8B1520] border-rose-300 ring-2 ring-rose-400/20'
                  : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
              }`}
              title="Toggle Complete Marketplace Navigation & Tools Menu"
              aria-label="Toggle Complete Menu"
            >
              {isMobileMenuOpen ? (
                <>
                  <X className="w-5 h-5 text-[#8B1520] stroke-[2.5]" />
                  <span className="text-xs font-black uppercase text-[#8B1520]">Close</span>
                </>
              ) : (
                <>
                  <Menu className="w-5 h-5 text-[#8B1520] stroke-[2.5]" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">Menu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex rounded-md overflow-hidden border border-slate-300 bg-white">
            <input
              id="mobile-search-input"
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search CNC, tools, steel, generators..."
              className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#8B1520] text-white px-4 py-2 text-xs font-bold flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Primary Category Navigation Bar */}
      <nav className="border-t border-b border-slate-200 px-4 sm:px-6 bg-slate-50 hidden md:block relative z-[30]">
        <div className={`max-w-7xl mx-auto flex items-center gap-6 sm:gap-8 text-xs font-bold uppercase tracking-wide text-slate-600 py-2.5 ${isCategoriesDropdownOpen ? 'overflow-visible' : 'overflow-x-auto scrollbar-none'}`}>
          {/* All Categories Dropdown Menu Container */}
          <div ref={categoriesDropdownRef} className="relative inline-block text-left pb-1">
            <button
              id="nav-all-categories-btn"
              onClick={() => {
                setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen);
              }}
              className={`pb-1 whitespace-nowrap transition cursor-pointer flex items-center gap-1 font-bold ${
                (activeView === 'categories' || isCategoriesDropdownOpen || activeView === 'category-feed' || activeView === 'machines' || activeView === 'tools' || activeView === 'materials' || activeView === 'services')
                  ? 'text-[#8B1520] border-b-2 border-[#8B1520]' 
                  : 'hover:text-[#8B1520] text-slate-700'
              }`}
            >
              <span>All Categories</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75 shrink-0" />
            </button>

            {isCategoriesDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-2xl p-2.5 z-[999] animate-fadeIn space-y-1 font-bold text-slate-800">
                {/* 1. General All Categories Overview */}
                <button
                  onClick={() => {
                    handleNavClick('categories');
                    setIsCategoriesDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-slate-50 hover:text-[#8B1520] transition flex items-center justify-between cursor-pointer text-xs ${
                    activeView === 'categories' ? 'bg-rose-50 text-[#8B1520]' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#8B1520] shrink-0" />
                    <span>View All Sectors</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>

                <div className="h-px bg-slate-100 my-1.5" />

                {/* 2. 🪑 Furniture Manufacturing */}
                <button
                  onClick={() => {
                    handleNavClick('category-feed', 'Furniture Manufacturing');
                    setIsCategoriesDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-center justify-between cursor-pointer text-xs ${
                    selectedCategory === 'Furniture Manufacturing' && activeView === 'category-feed' ? 'bg-amber-50 text-amber-900 font-black border-l-2 border-amber-500 pl-1.5' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="shrink-0">🪑</span>
                    <span>Furniture Manufacturing</span>
                  </span>
                  <span className="text-[8px] bg-amber-100 text-amber-800 font-extrabold px-1 py-0.5 rounded shrink-0">Featured</span>
                </button>

                {/* 3. Industrial Machinery */}
                <button
                  onClick={() => {
                    handleNavClick('machines', 'Industrial Machinery');
                    setIsCategoriesDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-center justify-between cursor-pointer text-xs ${
                    (activeView === 'machines' || (selectedCategory === 'Industrial Machinery' && activeView === 'category-feed')) ? 'bg-blue-50 text-[#1E40AF] font-black border-l-2 border-blue-500 pl-1.5' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="shrink-0">⚙️</span>
                    <span>Industrial Machinery</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>

                {/* 4. Construction */}
                <button
                  onClick={() => {
                    handleNavClick('category-feed', 'Construction');
                    setIsCategoriesDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-center justify-between cursor-pointer text-xs ${
                    selectedCategory === 'Construction' && activeView === 'category-feed' ? 'bg-amber-50 text-amber-800 font-black border-l-2 border-amber-500 pl-1.5' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="shrink-0">🏗️</span>
                    <span>Construction</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>

                {/* 5. Agriculture */}
                <button
                  onClick={() => {
                    handleNavClick('category-feed', 'Agriculture');
                    setIsCategoriesDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-center justify-between cursor-pointer text-xs ${
                    selectedCategory === 'Agriculture' && activeView === 'category-feed' ? 'bg-emerald-50 text-emerald-800 font-black border-l-2 border-emerald-500 pl-1.5' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="shrink-0">🌾</span>
                    <span>Agriculture</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>

                {/* 6. Electrical & Power */}
                <button
                  onClick={() => {
                    handleNavClick('category-feed', 'Electrical');
                    setIsCategoriesDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-center justify-between cursor-pointer text-xs ${
                    selectedCategory === 'Electrical' && activeView === 'category-feed' ? 'bg-cyan-50 text-cyan-800 font-black border-l-2 border-cyan-500 pl-1.5' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="shrink-0">⚡</span>
                    <span>Electrical & Power</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>

                {/* 7. Workshop Tools */}
                <button
                  onClick={() => {
                    handleNavClick('tools', 'Workshop Tools');
                    setIsCategoriesDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-center justify-between cursor-pointer text-xs ${
                    (activeView === 'tools' || (selectedCategory === 'Workshop Tools' && activeView === 'category-feed')) ? 'bg-rose-50 text-rose-800 font-black border-l-2 border-rose-500 pl-1.5' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="shrink-0">🛠️</span>
                    <span>Workshop Tools</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>

                {/* 8. Materials */}
                <button
                  onClick={() => {
                    handleNavClick('materials', 'Materials');
                    setIsCategoriesDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-center justify-between cursor-pointer text-xs ${
                    activeView === 'materials' ? 'bg-blue-50 text-[#1E40AF] font-black border-l-2 border-blue-500 pl-1.5' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="shrink-0">📦</span>
                    <span>Materials</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>

                {/* 9. Services & Rigging */}
                <button
                  onClick={() => {
                    handleNavClick('services');
                    setIsCategoriesDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-center justify-between cursor-pointer text-xs ${
                    activeView === 'services' ? 'bg-blue-50 text-[#1E40AF] font-black border-l-2 border-blue-500 pl-1.5' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="shrink-0">🚛</span>
                    <span>Services & Rigging</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>
              </div>
            )}
          </div>

          <button
            id="nav-deals-btn"
            onClick={() => handleNavClick('deals')}
            className={`pb-1 whitespace-nowrap transition cursor-pointer text-amber-700 hover:text-amber-800 flex items-center gap-1 ${
              activeView === 'deals' ? 'border-b-2 border-amber-600 font-extrabold' : ''
            }`}
          >
            <span>🔥 Liquidations & Deals</span>
          </button>

          <button
            id="nav-market-trends-btn"
            onClick={() => setIsMarketTrendsOpen(true)}
            className="pb-1 whitespace-nowrap transition cursor-pointer text-slate-700 hover:text-[#8B1520] flex items-center gap-1 font-bold"
            title="Nigerian Industrial Machinery Price Index & Supply Analytics"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#8B1520]" />
            <span>Smart Trends</span>
          </button>

          <button
            id="nav-leaderboard-btn"
            onClick={() => handleNavClick('leaderboard')}
            className={`pb-1 whitespace-nowrap transition cursor-pointer text-amber-700 hover:text-amber-800 flex items-center gap-1 font-extrabold ${
              activeView === 'leaderboard' ? 'border-b-2 border-amber-600 text-amber-800' : ''
            }`}
            title="Top Verified Industrial Seller Rankings"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Seller Leaderboard</span>
          </button>

          <button
            id="nav-quick-reorder-btn"
            onClick={() => setIsQuickReorderOpen(true)}
            className="pb-1 whitespace-nowrap transition cursor-pointer text-slate-700 hover:text-[#8B1520] flex items-center gap-1 font-bold"
            title="1-Click Repeat Replenishment for Workshop Consumables & Spare Parts"
          >
            <Repeat className="w-3.5 h-3.5 text-[#8B1520]" />
            <span>{t('nav.quickReorder')}</span>
            <span className="text-[9px] bg-rose-50 text-[#8B1520] border border-rose-200 font-black px-1.5 py-0.5 rounded">1-Click</span>
          </button>

          <button
            id="nav-about-btn"
            onClick={() => handleNavClick('about')}
            className={`pb-1 whitespace-nowrap transition cursor-pointer ${
              activeView === 'about' ? 'text-[#8B1520] border-b-2 border-[#8B1520]' : 'text-slate-600 hover:text-[#8B1520]'
            }`}
          >
            About & Escrow
          </button>

          <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-200">
            <button
              onClick={() => { setPrototypeInitialRole('buyer'); setIsPrototypesOpen(true); }}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1 shadow-2xs"
              title="Buyer Dashboard Prototype"
            >
              <User className="w-3.5 h-3.5 text-[#8B1520]" />
              <span>Buyer Portal</span>
            </button>

            <button
              onClick={() => { setPrototypeInitialRole('seller'); setIsPrototypesOpen(true); }}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-emerald-800 text-xs font-bold transition flex items-center space-x-1 shadow-2xs"
              title="Seller Centre Prototype"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Seller Centre</span>
            </button>
          </div>

        </div>
      </nav>

      {/* Hamburger Dropdown Drawer Panel - Unhides all top navigation, categories, utilities, and portals */}
      {isMobileMenuOpen && (
        <div
          ref={hamburgerMenuRef}
          id="mobile-hamburger-dropdown"
          className="bg-white border-b-2 border-slate-300 shadow-2xl animate-fadeIn z-[95] max-h-[85vh] overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-5">
            {/* Drawer Header with Title & Quick Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#8B1520] text-white">
                  <Menu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    Main Navigation & Operations Hub
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    All marketplace categories, industrial tools, portals & services
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
            
            {/* Mobile Search Input */}
            <div className="pt-0.5 md:hidden">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => {
                    setSearchInput(e.target.value);
                    setFilterState(prev => ({ ...prev, search: e.target.value }));
                  }}
                  placeholder="Search machinery, tools, materials, models..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3 pr-10 py-3 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#8B1520] shadow-3xs"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-1.5 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] text-white cursor-pointer shadow-xs"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          {/* 🤖 PREMIER AI ASSISTANT & COPILOT INTELLIGENCE HUB */}
          <div className="bg-gradient-to-br from-rose-50 via-slate-50 to-white border border-rose-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] text-white shadow-2xs">
                  <Bot className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-900 flex items-center gap-1.5">
                    <span>AI Assistant & Copilot</span>
                    <span className="bg-gradient-to-r from-[#48060C] to-[#D83A46] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">Live</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Technical sizing, mechanical specs & valuation</div>
                </div>
              </div>
            </div>

            {/* Main AI Assistant Action Button */}
            <button
              id="mobile-open-mtm-agent-btn"
              onClick={() => { setIsMtmAgentOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-200" />
              <span>Ask MTM Agent Assistant</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            </button>

            {/* Sizing Advisor & Video Walkthrough Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => { setIsAIAdvisorOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-200 text-left transition flex items-center gap-2.5 cursor-pointer shadow-3xs"
              >
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 shrink-0">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate">Sizing Advisor</div>
                  <div className="text-[9px] text-slate-500 truncate">kVA & HP match</div>
                </div>
              </button>

              <button
                onClick={() => { openVideoDemo('mtm-how-it-works-master'); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-left transition flex items-center gap-2.5 cursor-pointer shadow-3xs"
              >
                <div className="p-1.5 rounded-lg bg-orange-100 text-orange-700 shrink-0">
                  <Tv className="w-4 h-4 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                    <span className="truncate">Video Tour</span>
                    <span className="text-[8px] bg-orange-100 text-orange-800 font-extrabold px-1 rounded shrink-0">30s</span>
                  </div>
                  <div className="text-[9px] text-slate-500 truncate">2-Min Rotative</div>
                </div>
              </button>
            </div>
          </div>

          {/* Personal Actions & Order Navigation: Account, Compare, Notifications, Cart */}
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center justify-between">
              <span>Personal Account & Orders</span>
              <span className="text-[9px] text-slate-400 font-bold">2 Shortcuts</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 grid grid-cols-2 gap-1 text-center shadow-3xs">
              <button
                onClick={() => { handleNavClick('account'); setIsMobileMenuOpen(false); }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white text-slate-700 hover:text-orange-600 transition cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 shadow-3xs">
                  <User className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-black">Account</span>
              </button>

              <button
                onClick={() => { setIsCompareOpen(true); setIsMobileMenuOpen(false); }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white text-slate-700 hover:text-orange-600 transition cursor-pointer relative"
              >
                <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 relative shadow-3xs">
                  <ArrowRightLeft className="w-4.5 h-4.5" />
                  {compareList.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-orange-600 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                      {compareList.length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-black">Compare</span>
              </button>

            </div>

            {/* List & Sell Equipment Full Width Button */}
            <button
              onClick={() => { setIsSellModalOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full py-2.5 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-rose-200" />
              <span>List & Sell Equipment on MTM</span>
            </button>
          </div>

          {/* Sector Categories Section */}
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#8B1520]" />
              <span>Marketplace Categories & Sectors</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={() => { handleNavClick('categories'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                  activeView === 'categories' ? 'bg-rose-50 border-rose-200 text-[#8B1520]' : 'hover:bg-slate-100 border-slate-100 text-slate-700'
                }`}
              >
                <span>All Categories</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { handleNavClick('category-feed', 'Furniture Manufacturing'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                  selectedCategory === 'Furniture Manufacturing' && activeView === 'category-feed' ? 'bg-amber-50 border-amber-200 text-amber-800 font-extrabold' : 'hover:bg-amber-50/60 border-slate-100 text-amber-900'
                }`}
              >
                <span>🪑 Furniture Manufacturing</span>
                <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">Featured</span>
              </button>

              <button
                onClick={() => { handleNavClick('machines', 'Industrial Machinery'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                  (activeView === 'machines' || (selectedCategory === 'Industrial Machinery' && activeView === 'category-feed')) ? 'bg-blue-50 border-blue-200 text-[#1E40AF]' : 'hover:bg-slate-100 border-slate-100 text-slate-700'
                }`}
              >
                <span>Industrial Machinery</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { handleNavClick('category-feed', 'Construction'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                  selectedCategory === 'Construction' && activeView === 'category-feed' ? 'bg-amber-50 border-amber-200 text-amber-700 font-bold' : 'hover:bg-slate-100 border-slate-100 text-slate-700'
                }`}
              >
                <span>Construction Equipment</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { handleNavClick('category-feed', 'Agriculture'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                  selectedCategory === 'Agriculture' && activeView === 'category-feed' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'hover:bg-slate-100 border-slate-100 text-slate-700'
                }`}
              >
                <span>Agriculture & Processing</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { handleNavClick('category-feed', 'Electrical'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                  selectedCategory === 'Electrical' && activeView === 'category-feed' ? 'bg-cyan-50 border-cyan-200 text-cyan-800 font-bold' : 'hover:bg-slate-100 border-slate-100 text-slate-700'
                }`}
              >
                <span>Electrical & Power</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { handleNavClick('tools', 'Workshop Tools'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                  (activeView === 'tools' || (selectedCategory === 'Workshop Tools' && activeView === 'category-feed')) ? 'bg-rose-50 border-rose-200 text-rose-800' : 'hover:bg-slate-100 border-slate-100 text-slate-700'
                }`}
              >
                <span>Workshop Tools</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { handleNavClick('materials', 'Materials'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                  activeView === 'materials' ? 'bg-blue-50 border-blue-200 text-[#1E40AF]' : 'hover:bg-slate-100 border-slate-100 text-slate-700'
                }`}
              >
                <span>Raw Materials & Steel</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { handleNavClick('services'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                  activeView === 'services' ? 'bg-blue-50 border-blue-200 text-[#1E40AF]' : 'hover:bg-slate-100 border-slate-100 text-slate-700'
                }`}
              >
                <span>Services & Crane Rigging</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { handleNavClick('deals'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition flex items-center justify-between text-amber-700 border hover:bg-amber-50 border-slate-100 cursor-pointer ${
                  activeView === 'deals' ? 'bg-amber-100/70 border-amber-200 font-black' : ''
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Liquidations & Hot Deals</span>
                </span>
                <span className="text-[9px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded uppercase">Hot</span>
              </button>

              <button
                onClick={() => { setIsMarketTrendsOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#1E40AF] hover:bg-blue-50 transition flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>Smart Trends Index</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => { handleNavClick('leaderboard'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  activeView === 'leaderboard' ? 'bg-amber-100 text-amber-950 font-black' : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>Seller Leaderboard</span>
                </span>
                <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.5 rounded">Top Ranked</span>
              </button>

              <button
                onClick={() => { handleNavClick('about'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  activeView === 'about' ? 'bg-blue-50 text-[#1E40AF]' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>About MTM & Escrow</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Dedicated Industrial Tools & Utilities Dropdown / Grid Section */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Menu className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-slate-800">Industrial Tools & Utilities</span>
              </span>
              <span className="text-[9px] bg-slate-200 text-slate-700 font-black px-1.5 py-0.5 rounded">11 Utilities</span>
            </div>

            {/* PO Generator Highlight Banner Button */}
            <button
              id="mobile-po-generator-btn"
              onClick={() => { openPurchaseOrderModal(); setIsMobileMenuOpen(false); }}
              className="w-full p-2.5 mb-2 rounded-xl bg-rose-50/70 text-[#8B1520] text-left text-xs font-bold transition flex items-center justify-between hover:bg-rose-100/70 border border-rose-200 shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#8B1520] text-white shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight flex items-center gap-1.5">
                    <span>Purchase Order Generator</span>
                    <span className="text-[8px] bg-rose-100 text-[#8B1520] font-black px-1 rounded border border-rose-200">PDF</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">Export formal corporate PO requisition</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              {/* 1. Forecasting */}
              <button
                onClick={() => { setIsForecastingOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-900 text-left text-xs font-bold transition flex flex-col justify-between hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <TrendingUp className="w-4 h-4 text-[#8B1520]" />
                  <span className="text-[8px] bg-rose-100 text-[#8B1520] px-1 py-0.5 rounded font-black">AI</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight">Forecasting</div>
                  <div className="text-[9px] text-slate-500 font-normal">Demand Velocity</div>
                </div>
              </button>

              {/* 2. Bulk Import */}
              <button
                onClick={() => { setIsBulkImportOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-900 text-left text-xs font-bold transition flex flex-col justify-between hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <FileSpreadsheet className="w-4 h-4 text-slate-700" />
                  <span className="text-[8px] bg-slate-200 text-slate-700 px-1 py-0.5 rounded font-black">CSV</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight">Bulk Import</div>
                  <div className="text-[9px] text-slate-500 font-normal">Batch Upload</div>
                </div>
              </button>

              {/* 3. QR Scanner */}
              <button
                onClick={() => { setIsQrScannerOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-900 text-left text-xs font-bold transition flex flex-col justify-between hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <QrCode className="w-4 h-4 text-slate-700" />
                  <span className="text-[8px] bg-slate-200 text-slate-700 px-1 py-0.5 rounded font-black">Scan</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight">QR Scanner</div>
                  <div className="text-[9px] text-slate-500 font-normal">Asset Barcodes</div>
                </div>
              </button>

              {/* 4. Quick Reorder */}
              <button
                onClick={() => { setIsQuickReorderOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-900 text-left text-xs font-bold transition flex flex-col justify-between hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Repeat className="w-4 h-4 text-[#8B1520]" />
                  <span className="text-[8px] bg-rose-100 text-[#8B1520] px-1 py-0.5 rounded font-black">1-Click</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight">Quick Reorder</div>
                  <div className="text-[9px] text-slate-500 font-normal">Workshop Spares</div>
                </div>
              </button>

              {/* 5. VR Showroom */}
              <button
                onClick={() => { setIsVrShowroomOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-900 text-left text-xs font-bold transition flex flex-col justify-between hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Glasses className="w-4 h-4 text-slate-700" />
                  <span className="text-[8px] bg-slate-200 text-slate-700 px-1 py-0.5 rounded font-black">360°</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight">VR Showroom</div>
                  <div className="text-[9px] text-slate-500 font-normal">Virtual Tours</div>
                </div>
              </button>

              {/* 6. Energy Calc */}
              <button
                onClick={() => { setIsEnergyCalculatorOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-900 text-left text-xs font-bold transition flex flex-col justify-between hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span className="text-[8px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-black">kW</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight">Energy Calc</div>
                  <div className="text-[9px] text-slate-500 font-normal">Power & Fuel Load</div>
                </div>
              </button>

              {/* 7. Unit Converter */}
              <button
                onClick={() => { setIsUnitConverterOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-900 text-left text-xs font-bold transition flex flex-col justify-between hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Calculator className="w-4 h-4 text-slate-700" />
                  <span className="text-[8px] bg-slate-200 text-slate-700 px-1 py-0.5 rounded font-black">Unit</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight">Unit Converter</div>
                  <div className="text-[9px] text-slate-500 font-normal">HP, mm, kg/lb</div>
                </div>
              </button>

              {/* 8. Maintenance Alerts */}
              <button
                onClick={() => { setIsMaintenanceAlertsOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-900 text-left text-xs font-bold transition flex flex-col justify-between hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Wrench className="w-4 h-4 text-[#8B1520]" />
                  <span className="text-[8px] bg-rose-100 text-[#8B1520] px-1 py-0.5 rounded font-black">Alert</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight">Maintenance</div>
                  <div className="text-[9px] text-slate-500 font-normal">IoT Alerts & Logs</div>
                </div>
              </button>

              {/* 8.5 IoT Sensor Monitor */}
              <button
                id="mobile-iot-sensor-btn"
                onClick={() => { openIoTSensorModal(); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-900 text-left text-xs font-bold transition flex flex-col justify-between hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Activity className="w-4 h-4 text-[#8B1520] animate-pulse" />
                  <span className="text-[8px] bg-rose-100 text-[#8B1520] px-1 py-0.5 rounded font-black">Live</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight">IoT Sensor Hub</div>
                  <div className="text-[9px] text-slate-500 font-normal">Vib & Temp Live</div>
                </div>
              </button>

              {/* 9. Inspection Reports */}
              <button
                onClick={() => { handleNavClick('account'); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-900 text-left text-xs font-bold transition flex flex-col justify-between hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded font-black">42-pt</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight">Inspection</div>
                  <div className="text-[9px] text-slate-500 font-normal">Test Run Reports</div>
                </div>
              </button>

              {/* 10. Support Hub */}
              <button
                onClick={() => { setIsSupportHubOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-900 text-left text-xs font-bold transition flex flex-col justify-between hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded font-black">Help</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs leading-tight">Support Hub</div>
                  <div className="text-[9px] text-slate-500 font-normal">Escrow Hotline</div>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Language Selector */}
          <div className="pt-3 border-t border-slate-200">
            <LanguageSelector variant="mobile" />
          </div>

          {/* Mobile Currency Selection */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
              Select Marketplace Currency
            </div>
            <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
              <button
                onClick={() => { setCurrency('NGN'); setIsMobileMenuOpen(false); }}
                className={`flex-1 py-2 rounded-lg font-bold transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  currency === 'NGN' ? 'bg-[#8B1520] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>₦ NGN (Naira)</span>
                {currency === 'NGN' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
              <button
                onClick={() => { setCurrency('USD'); setIsMobileMenuOpen(false); }}
                className={`flex-1 py-2 rounded-lg font-bold transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  currency === 'USD' ? 'bg-[#8B1520] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>$ USD (Dollar)</span>
                {currency === 'USD' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            </div>
          </div>

          {/* Quick Operations & Guarantee Features */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
              Order Operations & Escrow Guarantee
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => { openOrderTracking(); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1E40AF] text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#1E40AF]" />
                <span>Order Track</span>
              </button>
              <button
                onClick={() => { setIsInventoryAlertOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Stock Alerts</span>
              </button>
              <button
                onClick={() => { openDisputeCenter(); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer"
              >
                <Scale className="w-4 h-4 text-rose-600" />
                <span>Dispute Desk</span>
              </button>
              <button
                onClick={() => { setIsTermsModalOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Escrow Terms</span>
              </button>
            </div>
          </div>

          {/* User Roles & Portals Section */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
              Portals & Command Centres
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setPrototypeInitialRole('buyer'); setIsPrototypesOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1E40AF] text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Buyer Portal</span>
              </button>
              <button
                onClick={() => { setPrototypeInitialRole('seller'); setIsPrototypesOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>Seller Centre</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
      {/* Search History Sidebar Modal Drawer */}
      <SearchHistorySidebar
        isOpen={isSearchHistorySidebarOpen}
        onClose={() => setIsSearchHistorySidebarOpen(false)}
      />
    </header>
  );
};
