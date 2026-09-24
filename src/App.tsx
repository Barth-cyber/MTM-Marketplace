import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedCategories } from './components/FeaturedCategories';
import { ProductCard } from './components/ProductCard';
import { ProductCatalogView } from './components/ProductCatalogView';
import { LiquidationDealsView } from './components/LiquidationDealsView';
import { CategoriesView } from './components/CategoriesView';
import { ServicesView } from './components/ServicesView';
import { AboutView } from './components/AboutView';
import { AccountView } from './components/AccountView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AIEquipmentAdvisor } from './components/AIEquipmentAdvisor';
import { ComparisonModal } from './components/ComparisonModal';
import { SellListingModal } from './components/SellListingModal';
import { NegotiateModal } from './components/NegotiateModal';
import { InspectionBookingModal } from './components/InspectionBookingModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { MarketTrendsModal } from './components/MarketTrendsModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { InventoryAlertModal } from './components/InventoryAlertModal';
import { DisputeCenterModal } from './components/DisputeCenterModal';
import { TermsModal } from './components/TermsModal';
import { PrototypesDashboard } from './components/PrototypesDashboard';
import { SellerProfileModal } from './components/SellerProfileModal';
import { SupportHubModal } from './components/SupportHubModal';
import { InteriorDuctVerifiedProfile } from './components/InteriorDuctVerifiedProfile';
import { SellerLeaderboard } from './components/SellerLeaderboard';
import { AboutAndAdminSection } from './components/AboutAndAdminSection';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { CartDrawer } from './components/CartDrawer';
import { MtmAiAgent } from './components/MtmAiAgent';
import { QrScannerModal } from './components/QrScannerModal';
import { QuickReorderModal } from './components/QuickReorderModal';
import { SmartForecastingModal } from './components/SmartForecastingModal';
import { BulkImportModal } from './components/BulkImportModal';
import { FlashSalePopup } from './components/FlashSalePopup';
import { VrShowroomModal } from './components/VrShowroomModal';
import { ArPlacementModal } from './components/ArPlacementModal';
import { EnergyCalculatorModal } from './components/EnergyCalculatorModal';
import { UnitConverterModal } from './components/UnitConverterModal';
import { MaintenanceAlertsModal } from './components/MaintenanceAlertsModal';
import { IoTSensorModal } from './components/IoTSensorModal';
import { PurchaseOrderModal } from './components/PurchaseOrderModal';
import { MarketplaceDemoVideoModal } from './components/MarketplaceDemoVideoModal';
import { VideoUploadStreamModal } from './components/VideoUploadStreamModal';
import { MobileFooterOverlay } from './components/MobileFooterOverlay';
import { IndustryMarketplaceNews } from './components/IndustryMarketplaceNews';
import { Footer } from './components/Footer';
import { ModalResizeObserver } from './components/ModalResizeObserver';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Cpu, 
  Wrench, 
  Layers, 
  CheckCircle2, 
  Zap, 
  Truck,
  Minus 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeProduct,
    setActiveProduct,
    activeNegotiationProduct,
    setActiveNegotiationProduct,
    activeInspectionProduct,
    setActiveInspectionProduct,
    isPriceAlertModalOpen,
    setIsPriceAlertModalOpen,
    activePriceAlertProduct,
    setActivePriceAlertProduct,
    setIsAIAdvisorOpen,
    isSellModalOpen,
    setIsSellModalOpen,
    isCartOpen,
    isCompareOpen,
    products,
    setSelectedCategory,
    filterState,
    setFilterState,
    toastMessage,
    isPrototypesOpen,
    setIsPrototypesOpen,
    prototypeInitialRole,
    selectedSellerProfile,
    setSelectedSellerProfile,
    isInteriorDuctModalOpen,
    setIsInteriorDuctModalOpen,
    isMarketTrendsOpen,
    setIsMarketTrendsOpen,
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    orderTrackingId,
    isInventoryAlertOpen,
    setIsInventoryAlertOpen,
    isDisputeCenterOpen,
    setIsDisputeCenterOpen,
    disputeOrderId,
    openDisputeCenter,
    isOffline,
    setIsOffline,
    isForecastingOpen,
    setIsForecastingOpen,
    isBulkImportOpen,
    setIsBulkImportOpen,
    setIsCartOpen,
    setIsCompareOpen,
    setIsNotificationsOpen,
    isQrScannerOpen,
    setIsQrScannerOpen,
    isQuickReorderOpen,
    setIsQuickReorderOpen,
    setIsTermsModalOpen,
    setIsSupportHubOpen,
    isVideoDemoOpen,
    setIsVideoDemoOpen,
    activeDemoVideoId,
    isVideoUploadOpen,
    setIsVideoUploadOpen,
    isVrShowroomOpen,
    setIsVrShowroomOpen,
    isArPlacementOpen,
    setIsArPlacementOpen,
    isEnergyCalculatorOpen,
    setIsEnergyCalculatorOpen,
    isUnitConverterOpen,
    setIsUnitConverterOpen,
    isMaintenanceAlertsOpen,
    setIsMaintenanceAlertsOpen,
    isIoTSensorModalOpen,
    setIsIoTSensorModalOpen,
    isPurchaseOrderModalOpen,
    setIsPurchaseOrderModalOpen,
    setIsMtmAgentOpen,
    bringModalToFront,
    getModalZIndex,
    areModalsHidden,
    setAreModalsHidden,
  } = useMarketplace();

  const activeModalsExist = !!(
    activeProduct ||
    activeNegotiationProduct ||
    activeInspectionProduct ||
    isPriceAlertModalOpen ||
    isMarketTrendsOpen ||
    isOrderTrackingOpen ||
    isInventoryAlertOpen ||
    isDisputeCenterOpen ||
    isPrototypesOpen ||
    selectedSellerProfile ||
    isInteriorDuctModalOpen ||
    isVideoDemoOpen ||
    isVideoUploadOpen ||
    isForecastingOpen ||
    isBulkImportOpen ||
    isVrShowroomOpen ||
    isArPlacementOpen ||
    isEnergyCalculatorOpen ||
    isUnitConverterOpen ||
    isMaintenanceAlertsOpen ||
    isIoTSensorModalOpen ||
    isPurchaseOrderModalOpen ||
    isQrScannerOpen ||
    isQuickReorderOpen
  );

  React.useEffect(() => { if (activeProduct) bringModalToFront('productDetail'); }, [activeProduct]);
  React.useEffect(() => { if (activeNegotiationProduct) bringModalToFront('negotiate'); }, [activeNegotiationProduct]);
  React.useEffect(() => { if (activeInspectionProduct) bringModalToFront('inspection'); }, [activeInspectionProduct]);
  React.useEffect(() => { if (isPriceAlertModalOpen) bringModalToFront('priceAlert'); }, [isPriceAlertModalOpen]);
  React.useEffect(() => { if (isCartOpen) bringModalToFront('cart'); }, [isCartOpen]);
  React.useEffect(() => { if (isCompareOpen) bringModalToFront('compare'); }, [isCompareOpen]);
  React.useEffect(() => { if (isSellModalOpen) bringModalToFront('sellModal'); }, [isSellModalOpen]);
  React.useEffect(() => { if (isMarketTrendsOpen) bringModalToFront('marketTrends'); }, [isMarketTrendsOpen]);
  React.useEffect(() => { if (isOrderTrackingOpen) bringModalToFront('orderTracking'); }, [isOrderTrackingOpen]);
  React.useEffect(() => { if (isInventoryAlertOpen) bringModalToFront('inventoryAlert'); }, [isInventoryAlertOpen]);
  React.useEffect(() => { if (isDisputeCenterOpen) bringModalToFront('disputeCenter'); }, [isDisputeCenterOpen]);
  React.useEffect(() => { if (isPrototypesOpen) bringModalToFront('prototypes'); }, [isPrototypesOpen]);
  React.useEffect(() => { if (selectedSellerProfile) bringModalToFront('sellerProfile'); }, [selectedSellerProfile]);
  React.useEffect(() => { if (isVideoDemoOpen) bringModalToFront('videoDemo'); }, [isVideoDemoOpen]);
  React.useEffect(() => { if (isVideoUploadOpen) bringModalToFront('videoUpload'); }, [isVideoUploadOpen]);

  React.useEffect(() => {
    // Handler for clicking outside open dialog boxes (backdrop click closes dialog)
    // Scrolling is explicitly ignored so opened dialogs never close or disappear on scroll
    const handleOutsideClick = (e: MouseEvent) => {
      if (e.button !== 0) return; // Left click only
      const target = e.target as HTMLElement;
      if (!target) return;

      // If user clicked inside the modal content box or on an interactive control, do not close
      const insideModalContent = target.closest('div[class*="fixed"] > div:not([aria-hidden="true"])');
      const interactiveControl = target.closest('button, input, select, textarea, a, [role="button"], .no-drag, [id*="-btn"]');
      
      if (insideModalContent && !target.classList.contains('fixed')) {
        return;
      }
      if (interactiveControl && !target.classList.contains('fixed')) {
        return;
      }

      // Check if target is a fixed modal overlay backdrop
      const isBackdropOverlay = target.classList.contains('fixed') && (target.classList.contains('inset-0') || target.classList.contains('bg-slate-900/60') || target.classList.contains('bg-slate-900/65') || target.classList.contains('bg-slate-950/80'));
      if (isBackdropOverlay) {
        // Close the active foreground dialog box
        if (activeProduct) { setActiveProduct(null); return; }
        if (activeNegotiationProduct) { setActiveNegotiationProduct(null); return; }
        if (activeInspectionProduct) { setActiveInspectionProduct(null); return; }
        if (isPriceAlertModalOpen) { setIsPriceAlertModalOpen(false); setActivePriceAlertProduct(null); return; }
        if (selectedSellerProfile) { setSelectedSellerProfile(null); return; }
        if (isMarketTrendsOpen) { setIsMarketTrendsOpen(false); return; }
        if (isOrderTrackingOpen) { setIsOrderTrackingOpen(false); return; }
        if (isInventoryAlertOpen) { setIsInventoryAlertOpen(false); return; }
        if (isDisputeCenterOpen) { setIsDisputeCenterOpen(false); return; }
        if (isInteriorDuctModalOpen) { setIsInteriorDuctModalOpen(false); return; }
        if (isPrototypesOpen) { setIsPrototypesOpen(false); return; }
        if (isVideoDemoOpen) { setIsVideoDemoOpen(false); return; }
        if (isVideoUploadOpen) { setIsVideoUploadOpen(false); return; }
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [
    activeProduct, activeNegotiationProduct, activeInspectionProduct,
    isPriceAlertModalOpen, selectedSellerProfile, isMarketTrendsOpen,
    isOrderTrackingOpen, isInventoryAlertOpen, isDisputeCenterOpen,
    isInteriorDuctModalOpen, isPrototypesOpen, isVideoDemoOpen, isVideoUploadOpen,
    setActiveProduct, setActiveNegotiationProduct, setActiveInspectionProduct,
    setIsPriceAlertModalOpen, setActivePriceAlertProduct, setSelectedSellerProfile,
    setIsMarketTrendsOpen, setIsOrderTrackingOpen, setIsInventoryAlertOpen,
    setIsDisputeCenterOpen, setIsInteriorDuctModalOpen, setIsPrototypesOpen,
    setIsVideoDemoOpen, setIsVideoUploadOpen
  ]);

  React.useEffect(() => {
    // Global draggable/movable handler for ALL modal containers
    let activeModal: HTMLElement | null = null;
    let isMoving = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Left-click only
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if interactive element was clicked to prevent hijacking drag
      if (target.closest('button, input, select, textarea, a, [role="button"], .no-drag, svg, img')) {
        return;
      }

      // Find the modal container (any child of fixed inset-0 overlay)
      const modal = target.closest('div[class*="fixed"][class*="inset-0"]:not(#mobile-nav-overlay) > div:not([aria-hidden="true"])') as HTMLElement;
      if (!modal) return;

      // Drag from header area (top 85px)
      const rect = modal.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      if (clickY > 85) return;

      activeModal = modal;
      isMoving = true;
      startX = e.clientX;
      startY = e.clientY;

      // Parse existing style.transform
      const transform = modal.style.transform;
      const match = transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px/i) || transform.match(/translate\(([-\d.]+)px,\s*([-[0-9.]+)px/i);
      if (match) {
        initialX = parseFloat(match[1]);
        initialY = parseFloat(match[2]);
      } else {
        initialX = 0;
        initialY = 0;
      }

      modal.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMoving || !activeModal) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newX = initialX + dx;
      const newY = initialY + dy;
      activeModal.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
      activeModal.style.transition = 'none';
    };

    const handleMouseUp = () => {
      if (activeModal) {
        activeModal.style.cursor = '';
      }
      isMoving = false;
      activeModal = null;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement;
      if (!target) return;
      if (target.closest('button, input, select, textarea, a, [role="button"], .no-drag, svg, img')) return;

      const modal = target.closest('div[class*="fixed"][class*="inset-0"]:not(#mobile-nav-overlay) > div:not([aria-hidden="true"])') as HTMLElement;
      if (!modal) return;

      const rect = modal.getBoundingClientRect();
      const clickY = e.touches[0].clientY - rect.top;
      if (clickY > 85) return;

      activeModal = modal;
      isMoving = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;

      const transform = modal.style.transform;
      const match = transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px/i) || transform.match(/translate\(([-\d.]+)px,\s*([-[0-9.]+)px/i);
      if (match) {
        initialX = parseFloat(match[1]);
        initialY = parseFloat(match[2]);
      } else {
        initialX = 0;
        initialY = 0;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMoving || !activeModal || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      const newX = initialX + dx;
      const newY = initialY + dy;
      activeModal.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
      activeModal.style.transition = 'none';
    };

    window.addEventListener('mousedown', handleMouseDown, { passive: false });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [
    setActiveProduct,
    setActiveNegotiationProduct,
    setActiveInspectionProduct,
    setIsPriceAlertModalOpen,
    setActivePriceAlertProduct,
    setIsAIAdvisorOpen,
    setIsSellModalOpen,
    setIsPrototypesOpen,
    setSelectedSellerProfile,
    setIsInteriorDuctModalOpen,
    setIsMarketTrendsOpen,
    setIsOrderTrackingOpen,
    setIsInventoryAlertOpen,
    setIsDisputeCenterOpen,
    setIsForecastingOpen,
    setIsBulkImportOpen,
    setIsCartOpen,
    setIsCompareOpen,
    setIsNotificationsOpen,
    setIsQrScannerOpen,
    setIsQuickReorderOpen,
    setIsTermsModalOpen,
    setIsSupportHubOpen,
    setIsVrShowroomOpen,
    setIsArPlacementOpen,
    setIsEnergyCalculatorOpen,
    setIsUnitConverterOpen,
    setIsMaintenanceAlertsOpen,
    setIsIoTSensorModalOpen,
    setIsPurchaseOrderModalOpen,
    setIsMtmAgentOpen,
    setIsVideoDemoOpen,
    setIsVideoUploadOpen,
    setActiveView
  ]);

  // Featured and liquidation selections for the Home view
  const featuredMachines = products.filter(p => p.category === 'Machines').slice(0, 6);
  const featuredTools = products.filter(p => p.category === 'Tools').slice(0, 4);
  const liquidationSpotlight = products.filter(p => p.isLiquidation).slice(0, 3);

  const renderCurrentView = () => {
    switch (activeView) {
      case 'machines':
        return <ProductCatalogView title="Industrial Machinery" categoryFilter="Machines" />;
      case 'tools':
        return <ProductCatalogView title="Workshop Tools" categoryFilter="Tools" />;
      case 'materials':
        return <ProductCatalogView title="Industrial Materials & Supplies" categoryFilter="Materials" />;
      case 'category-feed':
        return <ProductCatalogView title={filterState.category !== 'All' ? filterState.category : 'Industrial Equipment Catalog'} />;
      case 'deals':
        return <LiquidationDealsView />;
      case 'categories':
        return <CategoriesView />;
      case 'services':
        return <ServicesView />;
      case 'about':
        return <AboutView />;
      case 'account':
        return <AccountView />;
      case 'leaderboard':
        return <SellerLeaderboard isFullView={true} />;
      case 'home':
      default:
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <Hero />

            {/* 3 Pillar Taxonomy */}
            <FeaturedCategories />

            {/* Liquidation Spotlight Banner */}
            {liquidationSpotlight.length > 0 && (
              <section className="max-w-7xl mx-auto px-4">
                <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 text-[#8B1520] font-mono text-xs font-bold uppercase tracking-wider">
                        <Flame className="w-4 h-4 fill-[#8B1520] text-[#8B1520]" />
                        <span>Featured Liquidation Deals</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                        Factory Clearance & Surplus Equipment
                      </h2>
                    </div>

                    <button
                      onClick={() => setActiveView('deals')}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#8B1520] hover:text-[#72111A] transition cursor-pointer"
                    >
                      <span>View All Clearance Lots</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liquidationSpotlight.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Featured Machinery Lineup */}
            <section className="max-w-7xl mx-auto px-4 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center space-x-2 text-[#8B1520] font-mono text-xs font-bold uppercase tracking-wider">
                    <Cpu className="w-4 h-4" />
                    <span>Verified Workshop Machinery</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    Featured Industrial Machines
                  </h2>
                  <p className="text-slate-600 text-xs mt-1">
                    Sliding panel saws, CNC lathes, hydraulic press brakes, diesel power plants & woodworking machinery.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('Machines');
                    setFilterState(prev => ({ ...prev, category: 'Machines', subcategory: 'All' }));
                    setActiveView('machines');
                  }}
                  className="mt-2 sm:mt-0 inline-flex items-center space-x-1 text-xs font-bold text-[#8B1520] hover:text-[#72111A] transition cursor-pointer"
                >
                  <span>Explore All Machines ({products.filter(p => p.category === 'Machines').length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Verified Workshop Machinery Strategic Image Banner */}
              <div className="relative h-48 sm:h-60 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                <img 
                  src="/images/scm_panel_saw_1790001707902.jpg" 
                  alt="Verified Workshop Machinery - SCM Sliding Panel Saw & CNC Lathe" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#8B1520] text-white">
                      NBTE & MTM Certified Plant Inspection
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold mt-1">
                      Heavy Woodworking Saws, CNC Lathes & Diesel Power Stations
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                      Live Telemetry & Escrow Protection
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredMachines.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* AI Search Grounded Industry News, Supply Chain & Price Trends */}
            <IndustryMarketplaceNews />

            {/* AI Advisor Promotional Banner */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs relative">
                {/* Workshop AI Banner Background Thumbnail */}
                <div className="relative h-44 sm:h-56 overflow-hidden">
                  <img
                    src="/images/ai_workshop_matchmaker_1790179152499.jpg"
                    alt="AI Workshop Matchmaker"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/scm_panel_saw_1790179186875.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute top-4 left-6 right-6 flex items-center justify-between">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/95 text-[#8B1520] border border-rose-200 text-xs font-bold shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#8B1520]" />
                      <span>MTM AI Industrial Matchmaker</span>
                    </div>
                    <span className="hidden sm:inline-block text-[11px] font-mono text-slate-200 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                      Automated Capex & Generator kVA Calculator
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Equip an entire workshop with intelligent AI matching.
                    </h2>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 text-slate-900">
                  <div className="space-y-3 max-w-xl">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Specify your production target (joinery, metal fabrication, civil contracting) and capex budget. MTM AI calculates generator kVA requirements, inrush current compensation, and compiles a complete verified machine package.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setIsAIAdvisorOpen(true)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-extrabold text-xs flex items-center space-x-2 transition shadow-md active:scale-95 cursor-pointer border border-[#7A101A]/30"
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Launch AI Workshop Matchmaker</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                      <Zap className="w-4 h-4 text-[#8B1520]" />
                      <strong className="text-slate-900 block font-bold">kVA Generator Sizing</strong>
                      <p className="text-[11px] text-slate-600">Automatic starting inrush power calculation</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <strong className="text-slate-900 block font-bold">Inspection Protocols</strong>
                      <p className="text-[11px] text-slate-600">Pre-purchase diagnostic checkpoints</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                      <Truck className="w-4 h-4 text-[#8B1520]" />
                      <strong className="text-slate-900 block font-bold">Freight & Rigging</strong>
                      <p className="text-[11px] text-slate-600">Crane offloading & low-bed logistics</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                      <Layers className="w-4 h-4 text-slate-700" />
                      <strong className="text-slate-900 block font-bold">Local Spare Parts</strong>
                      <p className="text-[11px] text-slate-600">Market availability in Lagos & Kano</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Strategic Top Industrial Seller Leaderboard */}
            <SellerLeaderboard isFullView={false} />

            {/* MTM Specialist About & Administrative Control Panel Section */}
            <AboutAndAdminSection />

            {/* Industrial Tools Showcase */}
            <section className="max-w-7xl mx-auto px-4 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center space-x-2 text-[#8B1520] font-mono text-xs font-bold uppercase tracking-wider">
                    <Wrench className="w-4 h-4" />
                    <span>Heavy Workshop Tooling</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    Industrial Power & Hand Tools
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('Tools');
                    setFilterState(prev => ({ ...prev, category: 'Tools', subcategory: 'All' }));
                    setActiveView('tools');
                  }}
                  className="mt-2 sm:mt-0 inline-flex items-center space-x-1 text-xs font-bold text-[#8B1520] hover:text-[#72111A] transition cursor-pointer"
                >
                  <span>Explore All Tools ({products.filter(p => p.category === 'Tools').length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Power & Hand Tools Banner Thumbnail */}
              <div className="relative h-40 sm:h-48 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                <img
                  src="/images/fiber_laser_cutter_1790206259976.jpg"
                  alt="Industrial Power & Hand Tools"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#8B1520] text-white">
                      Heavy Duty Tooling
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold mt-1">
                      Pneumatic, Cordless & Precision Hand Tools for Industrial Joinery & Fabrication
                    </h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredTools.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-[#1E40AF] selection:text-white font-sans relative">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div id="offline-global-banner" className="bg-red-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between gap-4 shadow-inner z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Running Offline Mode: Using local IndexedDB cache of heavy machinery assets. Remote escrow validation requests are queued.</span>
          </div>
          <button
            onClick={() => setIsOffline(false)}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider cursor-pointer transition"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Main Dynamic View */}
      <div className="flex-1">
        {renderCurrentView()}
      </div>

      {/* Modals and Drawers */}
      <div className={`transition-opacity duration-700 ease-in-out ${areModalsHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {activeModalsExist && (
          <button
            onClick={() => setAreModalsHidden(true)}
            className="fixed top-[18px] right-[76px] z-[99999] px-3 py-1.5 bg-white hover:bg-slate-50 text-[#8B1520] text-[10px] font-black uppercase tracking-wider rounded-lg border border-slate-200 hover:border-[#8B1520]/20 shadow-lg flex items-center gap-1 cursor-pointer no-drag transition-all active:scale-95"
            title="Minimize active window to background"
          >
            <Minus className="w-3.5 h-3.5 stroke-[3px]" />
            <span>Minimize</span>
          </button>
        )}
        {activeProduct && (
        <div style={{ zIndex: getModalZIndex('productDetail'), position: 'relative' }} onMouseDown={() => bringModalToFront('productDetail')}>
          <ProductDetailModal
            product={activeProduct}
            onClose={() => setActiveProduct(null)}
          />
        </div>
      )}

      {activeNegotiationProduct && (
        <div style={{ zIndex: getModalZIndex('negotiate'), position: 'relative' }} onMouseDown={() => bringModalToFront('negotiate')}>
          <NegotiateModal
            product={activeNegotiationProduct}
            onClose={() => setActiveNegotiationProduct(null)}
          />
        </div>
      )}

      {activeInspectionProduct && (
        <div style={{ zIndex: getModalZIndex('inspection'), position: 'relative' }} onMouseDown={() => bringModalToFront('inspection')}>
          <InspectionBookingModal
            product={activeInspectionProduct}
            onClose={() => setActiveInspectionProduct(null)}
          />
        </div>
      )}

      {isPriceAlertModalOpen && activePriceAlertProduct && (
        <div style={{ zIndex: getModalZIndex('priceAlert'), position: 'relative' }} onMouseDown={() => bringModalToFront('priceAlert')}>
          <PriceAlertModal
            product={activePriceAlertProduct}
            onClose={() => {
              setIsPriceAlertModalOpen(false);
              setActivePriceAlertProduct(null);
            }}
          />
        </div>
      )}

      <NotificationsDrawer />
      <AIEquipmentAdvisor />
      <ComparisonModal />
      <SellListingModal />
      <MarketTrendsModal isOpen={isMarketTrendsOpen} onClose={() => setIsMarketTrendsOpen(false)} />
      
      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
        initialOrderId={orderTrackingId}
        onOpenDispute={(ordNumber) => {
          setIsOrderTrackingOpen(false);
          openDisputeCenter(ordNumber);
        }}
      />

      <InventoryAlertModal
        isOpen={isInventoryAlertOpen}
        onClose={() => setIsInventoryAlertOpen(false)}
      />

      <DisputeCenterModal
        isOpen={isDisputeCenterOpen}
        onClose={() => setIsDisputeCenterOpen(false)}
        prefilledOrderId={disputeOrderId}
      />

      <TermsModal />
      <SupportHubModal />

      <CartDrawer />

      {isPrototypesOpen && (
        <PrototypesDashboard
          initialRole={prototypeInitialRole}
          onClose={() => setIsPrototypesOpen(false)}
        />
      )}

      {selectedSellerProfile && (
        <SellerProfileModal
          seller={selectedSellerProfile}
          onClose={() => setSelectedSellerProfile(null)}
        />
      )}

      <InteriorDuctVerifiedProfile
        isOpen={isInteriorDuctModalOpen}
        onClose={() => setIsInteriorDuctModalOpen(false)}
      />

      {/* Industrial QR Scanner & Quick Reorder Modals */}
      <QrScannerModal />
      <QuickReorderModal />

      {/* New Features Modals, Popups & Floating Triggers */}
      <SmartForecastingModal />
      <BulkImportModal />
      <FlashSalePopup />
      <VrShowroomModal />
      <ArPlacementModal />
      <EnergyCalculatorModal />
      <UnitConverterModal />
      <MaintenanceAlertsModal />
      <IoTSensorModal />
      <PurchaseOrderModal />

      {/* Video Streaming Hub & Demo Walkthrough Modals */}
      {isVideoDemoOpen && (
        <MarketplaceDemoVideoModal
          initialVideoId={activeDemoVideoId}
          onClose={() => setIsVideoDemoOpen(false)}
        />
      )}

      {isVideoUploadOpen && (
        <VideoUploadStreamModal
          onClose={() => setIsVideoUploadOpen(false)}
        />
      )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 sm:top-auto sm:bottom-6 right-4 sm:right-6 z-[2000] bg-slate-900/95 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-fadeIn backdrop-blur-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Global MtmAiAgent */}
      <MtmAiAgent />

      {/* Global Modal Resize Corner Drag Handle Observer */}
      <ModalResizeObserver />

      {/* Global Footer & Mobile Navigation Overlay */}
      <Footer />
      <MobileFooterOverlay />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MainContent />
    </MarketplaceProvider>
  );
}
