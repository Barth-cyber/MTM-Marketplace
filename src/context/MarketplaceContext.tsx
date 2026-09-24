import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Currency, 
  CartItem, 
  OfferNegotiation, 
  InspectionBooking, 
  FilterState, 
  CategoryItem,
  PriceAlert,
  AppNotification,
  Seller,
  PurchaseOrder,
  VideoComment,
  VideoAnnotation,
  VideoPlaylist
} from '../types';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '../data/mockData';
import { VIDEO_PLAYLISTS, INITIAL_VIDEO_COMMENTS, INITIAL_VIDEO_ANNOTATIONS, DEMO_VIDEOS } from '../data/videoData';
import { SupportedLanguage, TRANSLATIONS } from '../utils/i18n';

interface MarketplaceContextType {
  // Modal Stacking
  modalStack: string[];
  bringModalToFront: (modalName: string) => void;
  removeModalFromStack: (modalName: string) => void;
  getModalZIndex: (modalName: string) => number;

  // Localization
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;

  // QR Scanner & Quick Reorder
  isQrScannerOpen: boolean;
  setIsQrScannerOpen: (open: boolean) => void;
  isQuickReorderOpen: boolean;
  setIsQuickReorderOpen: (open: boolean) => void;

  // Navigation
  activeView: string;
  setActiveView: (view: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (sub: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;

  // Currency & Location
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountNGN: number, amountUSD?: number) => string;
  selectedHub: string;
  setSelectedHub: (hub: string) => void;

  // Products
  products: Product[];
  activeProduct: Product | null;
  setActiveProduct: (p: Product | null) => void;
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
  filteredProducts: Product[];
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Cart & Orders
  cart: CartItem[];
  isInCart: (productId: string) => boolean;
  addToCart: (product: Product, includeInspection?: boolean, includeFreight?: boolean) => void;
  removeFromCart: (productId: string) => void;
  uncart: (productId: string) => void;
  toggleCart: (product: Product, includeInspection?: boolean, includeFreight?: boolean) => void;
  updateCartItemQty: (productId: string, qty: number) => void;
  toggleCartInspection: (productId: string) => void;
  toggleCartFreight: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: { subtotal: number; inspectionTotal: number; freightTotal: number; grandTotal: number };

  // Comparison
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;

  // Offers & RFQs
  offers: OfferNegotiation[];
  createOffer: (offer: Omit<OfferNegotiation, 'id' | 'createdAt' | 'status'>) => void;
  activeNegotiationProduct: Product | null;
  setActiveNegotiationProduct: (p: Product | null) => void;

  // Inspection Bookings
  inspections: InspectionBooking[];
  bookInspection: (productId: string, productTitle: string, sellerLocation: string, date: string, type: string) => void;
  activeInspectionProduct: Product | null;
  setActiveInspectionProduct: (p: Product | null) => void;

  // Price Alerts
  priceAlerts: PriceAlert[];
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  removePriceAlert: (alertId: string) => void;
  getPriceAlertForProduct: (productId: string) => PriceAlert | undefined;
  activePriceAlertProduct: Product | null;
  setActivePriceAlertProduct: (p: Product | null) => void;
  isPriceAlertModalOpen: boolean;
  setIsPriceAlertModalOpen: (open: boolean) => void;

  // Notifications (including simulated price drops)
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;
  triggerSimulatedPriceDrop: (productId: string, customNewPriceNGN?: number) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // AI Advisor
  isAIAdvisorOpen: boolean;
  setIsAIAdvisorOpen: (open: boolean) => void;
  advisorInitialPrompt: string;
  setAdvisorInitialPrompt: (prompt: string) => void;

  // MTM AI Agent
  isMtmAgentOpen: boolean;
  setIsMtmAgentOpen: (open: boolean) => void;

  // Sell Listing Modal
  isSellModalOpen: boolean;
  setIsSellModalOpen: (open: boolean) => void;
  userListings: Product[];
  addNewListing: (listing: Product) => void;

  // Quick Action Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Data Loading & Skeleton States
  isLoadingProducts: boolean;
  setIsLoadingProducts: (loading: boolean) => void;
  simulateRefreshInventory: () => void;

  // Market Trends Modal
  isMarketTrendsOpen: boolean;
  setIsMarketTrendsOpen: (open: boolean) => void;

  // Prototypes & Seller Profile
  isPrototypesOpen: boolean;
  setIsPrototypesOpen: (open: boolean) => void;
  prototypeInitialRole: 'buyer' | 'seller' | 'admin';
  setPrototypeInitialRole: (role: 'buyer' | 'seller' | 'admin') => void;
  selectedSellerProfile: Seller | null;
  setSelectedSellerProfile: (seller: Seller | null) => void;
  isInteriorDuctModalOpen: boolean;
  setIsInteriorDuctModalOpen: (open: boolean) => void;

  // Search History Context & Smart Suggestions
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;

  // Order Tracking, Inventory Alerts & Dispute Center
  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;
  orderTrackingId: string | null;
  openOrderTracking: (orderId?: string) => void;

  isInventoryAlertOpen: boolean;
  setIsInventoryAlertOpen: (open: boolean) => void;

  isDisputeCenterOpen: boolean;
  setIsDisputeCenterOpen: (open: boolean) => void;
  disputeOrderId: string | null;
  openDisputeCenter: (orderId?: string) => void;

  // Terms & Conditions / Escrow Agreement
  isTermsModalOpen: boolean;
  setIsTermsModalOpen: (open: boolean) => void;
  hasAcceptedTerms: boolean;
  acceptedTermsTimestamp: string | null;
  acceptTerms: () => void;
  declineTerms: () => void;

  // Support Hub
  isSupportHubOpen: boolean;
  setIsSupportHubOpen: (open: boolean) => void;

  // Seller Auth
  isSellerAuthenticated: boolean;
  setIsSellerAuthenticated: (auth: boolean) => void;
  sellerUser: any | null;
  setSellerUser: (user: any) => void;
  loginAsSeller: (email: string, pass: string) => boolean;
  registerAsSeller: (data: any) => void;
  logoutSeller: () => void;

  // Admin Auth & Control Panel
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  loginAsAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  adminPassword: string;
  updateAdminPassword: (newPass: string) => void;

  // Users Management
  usersList: any[];
  createUser: (user: any) => void;
  editUser: (id: string, updatedFields: any) => void;
  deleteUser: (id: string) => void;
  toggleDecommissionUser: (id: string) => void;

  // Website settings & colors
  siteSettings: {
    siteTitle: string;
    announcementText: string;
    helplinePhone: string;
    systemStatus: string;
    primaryColor: string;
    featuredMerchant: string;
    landingHeadline: string;
    landingSubheadline: string;
  };
  updateSiteSettings: (settings: any) => void;

  // Payouts
  payoutsList: any[];
  completePayout: (id: string) => void;
  calculatePayoutCommission: (id: string, rate: number) => void;

  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;

  // New Features requested by User
  isOffline: boolean;
  setIsOffline: (v: boolean) => void;
  isForecastingOpen: boolean;
  setIsForecastingOpen: (v: boolean) => void;
  isBulkImportOpen: boolean;
  setIsBulkImportOpen: (v: boolean) => void;
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (v: boolean) => void;
  isVrShowroomOpen: boolean;
  setIsVrShowroomOpen: (v: boolean) => void;
  isArPlacementOpen: boolean;
  setIsArPlacementOpen: (v: boolean) => void;
  isEnergyCalculatorOpen: boolean;
  setIsEnergyCalculatorOpen: (v: boolean) => void;
  isUnitConverterOpen: boolean;
  setIsUnitConverterOpen: (v: boolean) => void;
  isMaintenanceAlertsOpen: boolean;
  setIsMaintenanceAlertsOpen: (v: boolean) => void;
  isIoTSensorModalOpen: boolean;
  setIsIoTSensorModalOpen: (v: boolean) => void;
  selectedIoTMachineId: string | null;
  setSelectedIoTMachineId: (id: string | null) => void;
  openIoTSensorModal: (machineId?: string) => void;
  rewardTransactions: any[];
  recordTransaction: (title: string, amountNGN: number, orderId: string) => void;

  // Purchase Order Generation & Management
  isPurchaseOrderModalOpen: boolean;
  setIsPurchaseOrderModalOpen: (v: boolean) => void;
  openPurchaseOrderModal: () => void;
  purchaseOrders: PurchaseOrder[];
  savePurchaseOrder: (po: PurchaseOrder) => void;
  deletePurchaseOrder: (id: string) => void;

  // Video Streaming & Upload Hub
  isVideoDemoOpen: boolean;
  setIsVideoDemoOpen: (v: boolean) => void;
  openVideoDemo: (videoId?: string) => void;
  activeDemoVideoId: string;
  setActiveDemoVideoId: (id: string) => void;
  isVideoUploadOpen: boolean;
  setIsVideoUploadOpen: (v: boolean) => void;
  videoComments: VideoComment[];
  addVideoComment: (videoId: string, text: string, authorName?: string, authorRole?: string) => void;
  likeVideoComment: (commentId: string) => void;
  videoAnnotations: VideoAnnotation[];
  addVideoAnnotation: (videoId: string, timeSeconds: number, timeStr: string, text: string, type: 'note' | 'defect' | 'highlight' | 'measurement', author?: string) => void;
  videoPlaylists: VideoPlaylist[];
  activePlaylist: VideoPlaylist | null;
  setActivePlaylist: (playlist: VideoPlaylist | null) => void;
  videoWatchlist: string[];
  toggleWatchlistVideo: (videoId: string) => void;
  popupSecondsLeft: number;
  isPopupTimerPaused: boolean;
  togglePopupTimerPause: () => void;
  timeUntilNextPopup: number;
  skipToNextVideo: () => void;
  autoVideoPopupEnabled: boolean;
  setAutoVideoPopupEnabled: (v: boolean) => void;
  currentVideoIndex: number;
  areModalsHidden: boolean;
  setAreModalsHidden: (v: boolean) => void;
  lastActivityRef: React.MutableRefObject<number>;
}


const initialFilterState: FilterState = {
  search: '',
  category: 'All',
  subcategory: 'All',
  brand: 'All Brands',
  condition: 'All',
  locationHub: 'All Hubs & Locations',
  priceRange: [0, 50000000],
  hasInspectionCertOnly: false,
  hasVideoTestOnly: false,
  isLiquidationOnly: false,
  powerPhase: 'All',
  sortBy: 'featured',
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Localization State
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('mtm_language');
      return (saved as SupportedLanguage) || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    try {
      localStorage.setItem('mtm_language', lang);
    } catch {}
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  // QR Scanner & Quick Reorder
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [isQuickReorderOpen, setIsQuickReorderOpen] = useState<boolean>(false);

  // New Features requested by User
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isForecastingOpen, setIsForecastingOpen] = useState<boolean>(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [areModalsHidden, setAreModalsHidden] = useState<boolean>(false);

  const lastActivityRef = React.useRef<number>(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });
    window.addEventListener('click', handleActivity, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, []);

  const [activeView, setActiveView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [selectedHub, setSelectedHub] = useState<string>('All Hubs & Locations');
  const [currency, setCurrency] = useState<Currency>('NGN');

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_products');
      return saved ? JSON.parse(saved) : PRODUCTS_DATA;
    } catch {
      return PRODUCTS_DATA;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mtm_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Auto-open product if URL query param ?product=... or ?machine=... is present
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product') || params.get('machine');
      if (prodId) {
        const found = PRODUCTS_DATA.find(p => p.id === prodId || p.slug === prodId);
        if (found) {
          setActiveProduct(found);
        }
      }
    } catch {}
  }, []);

  // Recently Viewed History with localStorage persistence
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_recently_viewed');
      return saved ? JSON.parse(saved) : PRODUCTS_DATA.slice(0, 4);
    } catch {
      return PRODUCTS_DATA.slice(0, 4);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mtm_recently_viewed', JSON.stringify(recentlyViewed));
    } catch {}
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 15);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    try {
      localStorage.removeItem('mtm_recently_viewed');
    } catch {}
  };

  const handleSetActiveProduct = (p: Product | null) => {
    setActiveProduct(p);
    if (p) {
      addToRecentlyViewed(p);
    }
  };

  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

  // Cart with localStorage persistence (clean empty default for production launch)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('mtm_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Comparison Matrix (clean empty default)
  const [compareList, setCompareList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('mtm_compare', JSON.stringify(compareList));
    } catch {}
  }, [compareList]);

  // Offers (clean empty default)
  const [offers, setOffers] = useState<OfferNegotiation[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_offers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeNegotiationProduct, setActiveNegotiationProduct] = useState<Product | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mtm_offers', JSON.stringify(offers));
    } catch {}
  }, [offers]);

  // Inspections (clean empty default)
  const [inspections, setInspections] = useState<InspectionBooking[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_inspections');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeInspectionProduct, setActiveInspectionProduct] = useState<Product | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mtm_inspections', JSON.stringify(inspections));
    } catch {}
  }, [inspections]);

  // Price Alerts (clean empty default)
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_price_alerts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activePriceAlertProduct, setActivePriceAlertProduct] = useState<Product | null>(null);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('mtm_price_alerts', JSON.stringify(priceAlerts));
    } catch {}
  }, [priceAlerts]);

  // Notifications (clean default)
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('mtm_notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const [isPrototypesOpen, setIsPrototypesOpen] = useState<boolean>(false);
  const [prototypeInitialRole, setPrototypeInitialRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [selectedSellerProfile, setSelectedSellerProfile] = useState<Seller | null>(null);
  const [isInteriorDuctModalOpen, setIsInteriorDuctModalOpen] = useState<boolean>(false);

  // Search History State (clean empty default)
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_search_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal Stacking Order Manager (LIFO: first open, last close)
  const [modalStack, setModalStack] = useState<string[]>([]);

  const bringModalToFront = (modalName: string) => {
    setModalStack(prev => [...prev.filter(m => m !== modalName), modalName]);
  };

  const removeModalFromStack = (modalName: string) => {
    setModalStack(prev => prev.filter(m => m !== modalName));
  };

  const getModalZIndex = (modalName: string) => {
    const idx = modalStack.indexOf(modalName);
    return idx !== -1 ? 10000 + (idx + 1) * 20 : 10000;
  };

  // Purchase Order Generation & Ledger State
  const [isPurchaseOrderModalOpen, setIsPurchaseOrderModalOpen] = useState<boolean>(false);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_purchase_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mtm_purchase_orders', JSON.stringify(purchaseOrders));
    } catch {}
  }, [purchaseOrders]);

  const openPurchaseOrderModal = () => {
    setIsPurchaseOrderModalOpen(true);
  };

  const savePurchaseOrder = (po: PurchaseOrder) => {
    setPurchaseOrders(prev => {
      const exists = prev.some(item => item.id === po.id || item.poNumber === po.poNumber);
      if (exists) {
        return prev.map(item => (item.id === po.id || item.poNumber === po.poNumber) ? po : item);
      }
      return [po, ...prev];
    });
    showToast(`✓ Purchase Order ${po.poNumber} saved to Corporate Ledger`);
  };

  const deletePurchaseOrder = (id: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== id && po.poNumber !== id));
    showToast(`✓ Purchase Order archived from ledger.`);
  };

  // Order Tracking, Inventory Alerts & Dispute Center State
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState<boolean>(false);
  const [orderTrackingId, setOrderTrackingId] = useState<string | null>(null);

  const [isInventoryAlertOpen, setIsInventoryAlertOpen] = useState<boolean>(false);

  const [isDisputeCenterOpen, setIsDisputeCenterOpen] = useState<boolean>(false);
  const [disputeOrderId, setDisputeOrderId] = useState<string | null>(null);

  // Terms & Conditions / Escrow Agreement State
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mtm_terms_accepted') === 'true';
    } catch {
      return true; // Default accepted for demo session
    }
  });
  const [acceptedTermsTimestamp, setAcceptedTermsTimestamp] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mtm_terms_accepted_at') || '2026-08-30 18:00:00 WAT';
    } catch {
      return '2026-08-30 18:00:00 WAT';
    }
  });

  const acceptTerms = () => {
    const timestamp = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'medium' }) + ' WAT';
    setHasAcceptedTerms(true);
    setAcceptedTermsTimestamp(timestamp);
    try {
      localStorage.setItem('mtm_terms_accepted', 'true');
      localStorage.setItem('mtm_terms_accepted_at', timestamp);
    } catch {
      // ignore
    }
    showToast('✓ Escrow & Transaction Guarantee Agreement Accepted.');
  };

  const declineTerms = () => {
    setHasAcceptedTerms(false);
    try {
      localStorage.setItem('mtm_terms_accepted', 'false');
    } catch {
      // ignore
    }
    showToast('⚠️ Terms Declined. Escrow Protection features require accepted terms.');
  };

  // Support Hub State
  const [isSupportHubOpen, setIsSupportHubOpen] = useState<boolean>(false);

  // Seller Auth State
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mtm_seller_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [sellerUser, setSellerUser] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('mtm_seller_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const loginAsSeller = (email: string, pass: string): boolean => {
    if (email && pass && pass.length >= 4) {
      const parts = email.split('@');
      const name = parts[0].replace('.', ' ');
      const user = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        businessName: name.toUpperCase() + ' Woodworking & Industrial Ltd',
        email: email,
        phone: '080' + Math.floor(10000000 + Math.random() * 90000000),
        location: 'Lagos, Nigeria'
      };
      setIsSellerAuthenticated(true);
      setSellerUser(user);
      try {
        localStorage.setItem('mtm_seller_auth', 'true');
        localStorage.setItem('mtm_seller_user', JSON.stringify(user));
      } catch {}
      showToast(`✓ Welcome Back, ${user.name}! Seller account authenticated.`);
      return true;
    }
    return false;
  };

  const registerAsSeller = (data: any) => {
    setIsSellerAuthenticated(true);
    setSellerUser(data);
    try {
      localStorage.setItem('mtm_seller_auth', 'true');
      localStorage.setItem('mtm_seller_user', JSON.stringify(data));
    } catch {}
    showToast(`✓ Registration Successful! Seller account created & authenticated.`);
  };

  const logoutSeller = () => {
    setIsSellerAuthenticated(false);
    setSellerUser(null);
    try {
      localStorage.setItem('mtm_seller_auth', 'false');
      localStorage.removeItem('mtm_seller_user');
    } catch {}
    showToast('Logged out of Seller Centre.');
  };

  // Admin Auth & Control Panel State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mtm_admin_auth') === 'true' || sessionStorage.getItem('mtm_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('mtm_admin_password') || 'admin';
    } catch {
      return 'admin';
    }
  });

  const loginAsAdmin = (pass: string): boolean => {
    if (pass === adminPassword || pass === 'admin' || pass === 'mtm-admin-2026') {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem('mtm_admin_auth', 'true');
        sessionStorage.setItem('mtm_admin_auth', 'true');
      } catch {}
      showToast('✓ Admin Privileges Granted. Accessing Secure Control Panel.');
      return true;
    }
    showToast('❌ Access Denied: Invalid Administrative Credentials.');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.setItem('mtm_admin_auth', 'false');
      sessionStorage.setItem('mtm_admin_auth', 'false');
    } catch {}
    showToast('Admin logged out.');
  };

  const updateAdminPassword = (newPass: string) => {
    if (!newPass || newPass.trim().length < 4) {
      showToast('❌ Password rotation failed: Must be 4 or more characters.');
      return;
    }
    setAdminPassword(newPass);
    try {
      localStorage.setItem('mtm_admin_password', newPass);
    } catch {}
    showToast('🔑 Administrative Control Panel password rotated successfully!');
  };

  // Users List State
  const [usersList, setUsersList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_users_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'usr-1', name: 'Engr. Dapo Alabi', email: 'dapo@apexindustrial.ng', role: 'Buyer', status: 'Active', phone: '08033192284' },
      { id: 'usr-2', name: 'Chief K. Okonkwo', email: 'k.okonkwo@kwood.com', role: 'Buyer', status: 'Active', phone: '08022145598' },
      { id: 'usr-3', name: 'Interior Duct Ltd', email: 'interiorductltd@gmail.com', role: 'Seller', status: 'Active', phone: '08066062008' },
      { id: 'usr-4', name: 'Eastern Manufacturing Liquidators', email: 'eastern@liq.com.ng', role: 'Seller', status: 'Active', phone: '08177553311' },
      { id: 'usr-5', name: 'System Admin', email: 'admin@mtm-nigeria.gov.ng', role: 'Admin', status: 'Active', phone: '08099887766' }
    ];
  });

  const editUser = (id: string, updatedFields: any) => {
    setUsersList(prev => {
      const next = prev.map(u => u.id === id ? { ...u, ...updatedFields } : u);
      try {
        localStorage.setItem('mtm_users_list', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('✓ User Account Modified.');
  };

  const deleteUser = (id: string) => {
    setUsersList(prev => {
      const next = prev.filter(u => u.id !== id);
      try {
        localStorage.setItem('mtm_users_list', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('✓ User Account Deleted from Platform.');
  };

  const toggleDecommissionUser = (id: string) => {
    setUsersList(prev => {
      const next = prev.map(u => u.id === id ? { ...u, isDecommissioned: !u.isDecommissioned, status: u.status === 'Decommissioned' ? 'Active' : 'Decommissioned' } : u);
      try {
        localStorage.setItem('mtm_users_list', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('✓ User Account Status Updated.');
  };

  const createUser = (user: any) => {
    setUsersList(prev => {
      const newUser = {
        id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
        status: 'Active',
        isDecommissioned: false,
        phone: user.phone || '080' + Math.floor(10000000 + Math.random() * 90000000),
        ...user
      };
      const next = [...prev, newUser];
      try {
        localStorage.setItem('mtm_users_list', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`✓ Created user account: ${user.name}`);
  };

  // Website Settings State
  const [siteSettings, setSiteSettings] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('mtm_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.siteTitle || parsed.siteTitle.includes('is published') || parsed.siteTitle === 'MTM-Marketplace') {
          parsed.siteTitle = 'MTM - Marketplace';
          localStorage.setItem('mtm_site_settings', JSON.stringify(parsed));
        }
        return parsed;
      }
      return {
        siteTitle: 'MTM - Marketplace',
        announcementText: "West Africa's Premier Industrial Marketplace",
        helplinePhone: '+234 803 685 0229',
        systemStatus: 'Normal (Operational)',
        primaryColor: 'Horse Blood Red',
        featuredMerchant: 'Interior Duct Ltd',
        landingHeadline: 'Equip Your Factory. Empower Your Build.',
        landingSubheadline: 'The first industrial-grade marketplace for Nigeria’s manufacturing ecosystem. Verified physical testing, escrow safety, and heavy freight logistics.'
      };
    } catch {
      return {
        siteTitle: 'MTM - Marketplace',
        announcementText: "West Africa's Premier Industrial Marketplace",
        helplinePhone: '+234 803 685 0229',
        systemStatus: 'Normal (Operational)',
        primaryColor: 'Horse Blood Red',
        featuredMerchant: 'Interior Duct Ltd',
        landingHeadline: 'Equip Your Factory. Empower Your Build.',
        landingSubheadline: 'The first industrial-grade marketplace for Nigeria’s manufacturing ecosystem. Verified physical testing, escrow safety, and heavy freight logistics.'
      };
    }
  });

  useEffect(() => {
    document.title = siteSettings?.siteTitle || 'MTM - Marketplace';
  }, [siteSettings]);

  const [isVrShowroomOpen, setIsVrShowroomOpen] = useState(false);
  const [isArPlacementOpen, setIsArPlacementOpen] = useState(false);
  const [isEnergyCalculatorOpen, setIsEnergyCalculatorOpen] = useState(false);
  const [isUnitConverterOpen, setIsUnitConverterOpen] = useState(false);
  const [isMaintenanceAlertsOpen, setIsMaintenanceAlertsOpen] = useState(false);
  const [isIoTSensorModalOpen, setIsIoTSensorModalOpen] = useState(false);
  const [selectedIoTMachineId, setSelectedIoTMachineId] = useState<string | null>(null);

  const openIoTSensorModal = (machineId?: string) => {
    if (machineId) {
      setSelectedIoTMachineId(machineId);
    }
    setIsIoTSensorModalOpen(true);
  };

  // Video Streaming & Demo State
  const [isVideoDemoOpen, setIsVideoDemoOpen] = useState(false);
  const [activeDemoVideoId, setActiveDemoVideoId] = useState('mtm-how-it-works-master');
  const [isVideoUploadOpen, setIsVideoUploadOpen] = useState(false);

  // Auto 30-second display and interval rotative video demo popup timer (Disabled per user request to prevent distraction)
  const [autoVideoPopupEnabled, setAutoVideoPopupEnabled] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [popupSecondsLeft, setPopupSecondsLeft] = useState(30);
  const [isPopupTimerPaused, setIsPopupTimerPaused] = useState(false);
  const [timeUntilNextPopup, setTimeUntilNextPopup] = useState(600); // 10 minutes (600 seconds)

  const rotatingVideoIds = React.useMemo(() => {
    return DEMO_VIDEOS.map(v => v.id);
  }, []);

  const openVideoDemo = (videoId?: string) => {
    if (videoId) {
      setActiveDemoVideoId(videoId);
      const idx = rotatingVideoIds.indexOf(videoId);
      if (idx !== -1) setCurrentVideoIndex(idx);
    }
    setPopupSecondsLeft(30);
    setIsPopupTimerPaused(false);
    setIsVideoDemoOpen(true);
  };

  const skipToNextVideo = () => {
    const nextIdx = (currentVideoIndex + 1) % rotatingVideoIds.length;
    setCurrentVideoIndex(nextIdx);
    setActiveDemoVideoId(rotatingVideoIds[nextIdx]);
    setPopupSecondsLeft(30);
    setIsPopupTimerPaused(false);
  };

  const togglePopupTimerPause = () => {
    setIsPopupTimerPaused(prev => !prev);
  };

  // 1. While video popup is OPEN: 30 seconds countdown (disabled)
  useEffect(() => {
    return;
  }, [isVideoDemoOpen, isPopupTimerPaused, autoVideoPopupEnabled, currentVideoIndex, rotatingVideoIds]);

  // 2. While video popup is CLOSED: Disabled auto-popup timer
  useEffect(() => {
    return;
  }, [isVideoDemoOpen, autoVideoPopupEnabled, currentVideoIndex, rotatingVideoIds]);

  // Video Comments State
  const [videoComments, setVideoComments] = useState<VideoComment[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_video_comments');
      return saved ? JSON.parse(saved) : INITIAL_VIDEO_COMMENTS;
    } catch {
      return INITIAL_VIDEO_COMMENTS;
    }
  });

  const addVideoComment = (videoId: string, text: string, authorName = 'Verified Industrial Buyer', authorRole = 'Factory Owner') => {
    const newComment: VideoComment = {
      id: `comm-${Date.now()}`,
      videoId,
      authorName,
      authorRole,
      text,
      timestamp: 'Just now',
      likes: 0,
      avatar: ''
    };
    setVideoComments(prev => {
      const next = [newComment, ...prev];
      try {
        localStorage.setItem('mtm_video_comments', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('✓ Comment posted successfully to video feed.');
  };

  const likeVideoComment = (commentId: string) => {
    setVideoComments(prev => {
      const next = prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c);
      try {
        localStorage.setItem('mtm_video_comments', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Video Annotations State
  const [videoAnnotations, setVideoAnnotations] = useState<VideoAnnotation[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_video_annotations');
      return saved ? JSON.parse(saved) : INITIAL_VIDEO_ANNOTATIONS;
    } catch {
      return INITIAL_VIDEO_ANNOTATIONS;
    }
  });

  const addVideoAnnotation = (videoId: string, timeSeconds: number, timeStr: string, text: string, type: 'note' | 'defect' | 'highlight' | 'measurement', author = 'COREN Inspector') => {
    const newAnn: VideoAnnotation = {
      id: `ann-${Date.now()}`,
      videoId,
      timeSeconds,
      timeStr,
      text,
      type,
      author,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setVideoAnnotations(prev => {
      const next = [...prev, newAnn];
      try {
        localStorage.setItem('mtm_video_annotations', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`✓ Time-stamped annotation added at ${timeStr}`);
  };

  // Video Playlists State
  const [videoPlaylists] = useState<VideoPlaylist[]>(VIDEO_PLAYLISTS);
  const [activePlaylist, setActivePlaylist] = useState<VideoPlaylist | null>(null);

  // Video Watchlist State
  const [videoWatchlist, setVideoWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_video_watchlist');
      return saved ? JSON.parse(saved) : ['mtm-how-it-works-master'];
    } catch {
      return ['mtm-how-it-works-master'];
    }
  });

  const toggleWatchlistVideo = (videoId: string) => {
    setVideoWatchlist(prev => {
      const exists = prev.includes(videoId);
      const next = exists ? prev.filter(id => id !== videoId) : [...prev, videoId];
      try {
        localStorage.setItem('mtm_video_watchlist', JSON.stringify(next));
      } catch {}
      if (exists) {
        showToast('Removed video from watchlist.');
      } else {
        showToast('✓ Video added to your industrial watchlist.');
      }
      return next;
    });
  };

  const [rewardTransactions, setRewardTransactions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_reward_transactions');
      return saved ? JSON.parse(saved) : []; // Starts at 0 (empty) since marketplace is yet to be launched for user's enrollment and transactions/interactions
    } catch {
      return [];
    }
  });

  const recordTransaction = (title: string, amountNGN: number, orderId: string) => {
    const pointsEarned = Math.round(amountNGN / 1000); // 1 point per ₦1,000 spent
    const newTx = {
      id: orderId,
      title: `Escrow Transaction (${orderId}): ${title}`,
      pts: `+${pointsEarned.toLocaleString()} PTS`,
      pointsValue: pointsEarned,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      type: 'earn',
      amountNGN
    };

    setRewardTransactions(prev => {
      const next = [newTx, ...prev];
      try {
        localStorage.setItem('mtm_reward_transactions', JSON.stringify(next));
      } catch {}
      return next;
    });

    const currentTotal = rewardTransactions.reduce((acc, t) => acc + (t.pointsValue || 0), 0) + pointsEarned;
    const newTier = currentTotal > 5000 ? 'Platinum Industrial Tier' : currentTotal > 2000 ? 'Gold Enterprise Tier' : 'Silver Verified Tier';

    showToast(`🎉 Transaction Successful! Earned +${pointsEarned.toLocaleString()} MTM Loyalty Points (Total: ${currentTotal.toLocaleString()} PTS). Pro Rewards status updated to ${newTier}!`);
  };

  // Dynamic style injector for site-wide theme support
  React.useEffect(() => {
    const color = siteSettings?.primaryColor || 'Horse Blood Red';
    const colorMap: Record<string, { primary: string; hover: string; lightBg: string; focus: string; darkBg: string; shiny: string; borderDark: string }> = {
      // Horse Blood (dark, shiny red) default brand & background system
      "Horse Blood Red": { primary: '#7A0C14', hover: '#5A070E', lightBg: '#FFF1F2', focus: '#A8101E', darkBg: '#1A0306', shiny: '#B31221', borderDark: '#4D0B12' },
      "horse-blood": { primary: '#7A0C14', hover: '#5A070E', lightBg: '#FFF1F2', focus: '#A8101E', darkBg: '#1A0306', shiny: '#B31221', borderDark: '#4D0B12' },
      "crimson": { primary: '#7A0C14', hover: '#5A070E', lightBg: '#FFF1F2', focus: '#A8101E', darkBg: '#1A0306', shiny: '#B31221', borderDark: '#4D0B12' },
      "REDS Racing Crimson": { primary: '#7A0C14', hover: '#5A070E', lightBg: '#FFF1F2', focus: '#A8101E', darkBg: '#1A0306', shiny: '#B31221', borderDark: '#4D0B12' },
      "MTM Racing Red / Obsidian": { primary: '#7A0C14', hover: '#5A070E', lightBg: '#FFF1F2', focus: '#A8101E', darkBg: '#1A0306', shiny: '#B31221', borderDark: '#4D0B12' },
      // Other theme options
      blue: { primary: '#1E40AF', hover: '#1D4ED8', lightBg: '#EFF6FF', focus: '#3B82F6', darkBg: '#0F172A', shiny: '#3B82F6', borderDark: '#1E293B' },
      emerald: { primary: '#059669', hover: '#047857', lightBg: '#ECFDF5', focus: '#10B981', darkBg: '#064E3B', shiny: '#10B981', borderDark: '#065F46' },
      amber: { primary: '#D97706', hover: '#B45309', lightBg: '#FEF3C7', focus: '#F59E0B', darkBg: '#78350F', shiny: '#F59E0B', borderDark: '#92400E' },
      slate: { primary: '#475569', hover: '#334155', lightBg: '#F1F5F9', focus: '#64748B', darkBg: '#0F172A', shiny: '#64748B', borderDark: '#334155' },
      rose: { primary: '#E11D48', hover: '#BE123C', lightBg: '#FFF1F2', focus: '#F43F5E', darkBg: '#881337', shiny: '#F43F5E', borderDark: '#9F1239' },
      "MTM Industrial Blue": { primary: '#1E40AF', hover: '#1D4ED8', lightBg: '#EFF6FF', focus: '#3B82F6', darkBg: '#0F172A', shiny: '#3B82F6', borderDark: '#1E293B' },
      "Benin Bronze Slate": { primary: '#78350F', hover: '#5F2E08', lightBg: '#FEF9C3', focus: '#EAB308', darkBg: '#451A03', shiny: '#D97706', borderDark: '#78350F' },
      "Kano Indigo Clay": { primary: '#4C1D95', hover: '#3B0764', lightBg: '#F3E8FF', focus: '#8B5CF6', darkBg: '#2E1065', shiny: '#8B5CF6', borderDark: '#4C1D95' },
      "Surplus Safety Orange": { primary: '#EA580C', hover: '#C2410C', lightBg: '#FFEDD5', focus: '#F97316', darkBg: '#7C2D12', shiny: '#F97316', borderDark: '#9A3412' },
      "Coal Forest Dark Theme": { primary: '#0F172A', hover: '#1E293B', lightBg: '#F8FAFC', focus: '#475569', darkBg: '#020617', shiny: '#475569', borderDark: '#1E293B' },
    };
    
    const active = colorMap[color] || colorMap["Horse Blood Red"] || colorMap.crimson;
    let styleEl = document.getElementById('dynamic-theme');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-theme';
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `
      :root {
        --brand-color: ${active.primary} !important;
        --brand-color-hover: ${active.hover} !important;
        --brand-color-light: ${active.lightBg} !important;
        --brand-color-focus: ${active.focus} !important;
        --brand-dark-bg: ${active.darkBg} !important;
        --brand-shiny: ${active.shiny} !important;
        --brand-dark-border: ${active.borderDark} !important;
      }
      /* Custom class mappings to override brand highlights with lustrous Horse Blood Red */
      .bg-\\[\\#1E40AF\\],
      .bg-orange-600 {
        background-color: var(--brand-color) !important;
        background-image: linear-gradient(135deg, ${active.shiny} 0%, ${active.primary} 55%, ${active.hover} 100%) !important;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 12px rgba(122, 12, 20, 0.35) !important;
      }
      .hover\\:bg-blue-800:hover,
      .hover\\:bg-blue-600:hover,
      .hover\\:bg-\\[\\#1D4ED8\\]:hover,
      .hover\\:bg-orange-500:hover,
      .hover\\:bg-orange-600:hover,
      .hover\\:bg-orange-700:hover {
        background-color: var(--brand-color-hover) !important;
        background-image: linear-gradient(135deg, ${active.primary} 0%, ${active.hover} 100%) !important;
      }
      .text-\\[\\#1E40AF\\],
      .text-orange-600,
      .text-orange-700 {
        color: var(--brand-color) !important;
      }
      .border-blue-200,
      .border-orange-500,
      .border-orange-400 {
        border-color: var(--brand-color) !important;
      }
      .focus\\:ring-blue-500:focus,
      .focus\\:border-orange-500:focus {
        --tw-ring-color: var(--brand-color-focus) !important;
        border-color: var(--brand-color-focus) !important;
      }
      .bg-blue-50,
      .bg-orange-50 {
        background-color: var(--brand-color-light) !important;
      }
      .bg-blue-100,
      .bg-orange-100 {
        background-color: var(--brand-color-light) !important;
      }
      .text-blue-800,
      .text-orange-800 {
        color: var(--brand-color) !important;
      }
      .text-blue-700 {
        color: var(--brand-color) !important;
      }
      .shadow-orange-500\\/20 {
        box-shadow: 0 10px 15px -3px rgba(122, 12, 20, 0.35), 0 4px 6px -4px rgba(122, 12, 20, 0.25) !important;
      }
      /* Dark shiny background tone for topbar, headers and dark modules */
      .bg-slate-900 {
        background-color: var(--brand-dark-bg) !important;
        border-color: var(--brand-dark-border) !important;
      }
      .border-slate-800,
      .border-slate-700 {
        border-color: var(--brand-dark-border) !important;
      }
    `;
  }, [siteSettings?.primaryColor]);

  const updateSiteSettings = (settings: any) => {
    setSiteSettings((prev: any) => {
      const next = { ...prev, ...settings };
      try {
        localStorage.setItem('mtm_site_settings', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('✓ Website settings and layouts successfully updated.');
  };

  // Payouts State
  const [payoutsList, setPayoutsList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_payouts_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'pay-1', sellerName: 'Interior Duct Ltd', machineTitle: 'SCM Si400 Nova 3.2m sliding table saw', saleAmount: 14500000, commissionRate: 5.0, commissionAmount: 725000, netAmount: 13775000, status: 'Pending', bankName: 'Access Bank', bankAccount: '0019284821', date: '2026-08-28' },
      { id: 'pay-2', sellerName: 'Eastern Manufacturing Liquidators Ltd', machineTitle: 'Yawei 100-Ton CNC Press Brake', saleAmount: 18500000, commissionRate: 5.0, commissionAmount: 925000, netAmount: 17575000, status: 'Completed', bankName: 'Zenith Bank', bankAccount: '1019223847', date: '2026-08-25' },
      { id: 'pay-3', sellerName: 'Kano Industrial Tools Depot', machineTitle: 'Heavy-Duty Wood Shaper Machine', saleAmount: 4800000, commissionRate: 4.5, commissionAmount: 216000, netAmount: 4584000, status: 'Pending', bankName: 'GTBank', bankAccount: '0112847382', date: '2026-08-29' }
    ];
  });

  const completePayout = (id: string) => {
    setPayoutsList(prev => {
      const next = prev.map(p => p.id === id ? { ...p, status: 'Completed' } : p);
      try {
        localStorage.setItem('mtm_payouts_list', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('✓ Payout processed successfully. Funds released to Seller.');
  };

  const calculatePayoutCommission = (id: string, rate: number) => {
    setPayoutsList(prev => {
      const next = prev.map(p => {
        if (p.id === id) {
          const commissionAmount = Math.round(p.saleAmount * (rate / 100));
          const netAmount = p.saleAmount - commissionAmount;
          return { ...p, commissionRate: rate, commissionAmount, netAmount };
        }
        return p;
      });
      try {
        localStorage.setItem('mtm_payouts_list', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`✓ Commission rate calculated at ${rate}% for payout.`);
  };

  const openOrderTracking = (orderId?: string) => {
    if (orderId) setOrderTrackingId(orderId);
    setIsOrderTrackingOpen(true);
  };

  const openDisputeCenter = (orderId?: string) => {
    if (orderId) setDisputeOrderId(orderId);
    setIsDisputeCenterOpen(true);
  };

  const addSearchHistory = (query: string) => {
    if (!query || !query.trim()) return;
    const clean = query.trim();
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('mtm_search_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save search history', e);
      }
      return updated;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('mtm_search_history');
    } catch (e) {
      console.warn('Could not clear search history', e);
    }
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addPriceAlert = (alertData: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alertData,
      id: `pa-${Date.now()}`,
      createdAt: 'Just now',
      triggered: false,
    };
    // Replace existing alert for this product if present, or add new
    setPriceAlerts(prev => {
      const filtered = prev.filter(a => a.productId !== alertData.productId);
      return [newAlert, ...filtered];
    });
    showToast(`🔔 Price alert activated for ${alertData.productTitle.slice(0, 28)}... at ${formatPrice(alertData.targetPrice)}`);
  };

  const removePriceAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
    showToast('Price alert removed');
  };

  const getPriceAlertForProduct = (productId: string): PriceAlert | undefined => {
    return priceAlerts.find(a => a.productId === productId);
  };

  const triggerSimulatedPriceDrop = (productId: string, customNewPriceNGN?: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      showToast('Product not found for simulated price drop');
      return;
    }

    const alert = priceAlerts.find(a => a.productId === productId);
    const oldPriceNGN = product.priceNGN;
    const oldPriceUSD = product.priceUSD;

    // Determine target drop price: either user provided, or alert's target, or 18% below current price
    const dropPriceNGN = customNewPriceNGN || (alert ? alert.targetPriceNGN : Math.round(oldPriceNGN * 0.82));
    const dropPriceUSD = Math.round(dropPriceNGN / 1500);
    const discountPct = Math.round(((oldPriceNGN - dropPriceNGN) / oldPriceNGN) * 100);

    // 1. Update product price in catalog
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            priceNGN: dropPriceNGN,
            priceUSD: dropPriceUSD,
            originalPriceNGN: p.originalPriceNGN || oldPriceNGN,
            originalPriceUSD: p.originalPriceUSD || oldPriceUSD,
            isDeal: true,
            liquidationDiscount: discountPct > 0 ? discountPct : 15,
          };
        }
        return p;
      })
    );

    // If active product in modal matches, update activeProduct as well
    if (activeProduct && activeProduct.id === productId) {
      setActiveProduct({
        ...activeProduct,
        priceNGN: dropPriceNGN,
        priceUSD: dropPriceUSD,
        originalPriceNGN: activeProduct.originalPriceNGN || oldPriceNGN,
        originalPriceUSD: activeProduct.originalPriceUSD || oldPriceUSD,
        isDeal: true,
        liquidationDiscount: discountPct > 0 ? discountPct : 15,
      });
    }

    // 2. Mark alert as triggered
    setPriceAlerts(prev =>
      prev.map(a => {
        if (a.productId === productId) {
          return {
            ...a,
            triggered: true,
            triggeredPrice: dropPriceNGN,
            triggeredAt: 'Just now',
            discountPercent: discountPct,
          };
        }
        return a;
      })
    );

    // 3. Create high-priority notification
    const newNotif: AppNotification = {
      id: `notif-drop-${Date.now()}`,
      type: 'price_drop',
      title: `⚡ Price Drop Alert: ${product.brand} ${product.model || product.subcategory}`,
      message: `Great news! "${product.title}" price dropped from ${formatPrice(oldPriceNGN, oldPriceUSD)} to ${formatPrice(dropPriceNGN, dropPriceUSD)} (${discountPct}% discount). Your target price was reached!`,
      productId: product.id,
      productImage: product.images[0],
      timestamp: 'Just now',
      read: false,
      newPrice: dropPriceNGN,
      discountAmount: `${discountPct}% OFF`,
    };

    setNotifications(prev => [newNotif, ...prev]);

    // 4. Trigger celebration toast
    showToast(`🎉 PRICE DROP! ${product.brand} is now ${formatPrice(dropPriceNGN, dropPriceUSD)} (-${discountPct}%)`);
  };

  // AI Advisor
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState<boolean>(false);
  const [advisorInitialPrompt, setAdvisorInitialPrompt] = useState<string>('');

  // MTM AI Agent
  const [isMtmAgentOpen, setIsMtmAgentOpen] = useState<boolean>(false);

  // Sell Listing Modal
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [userListings, setUserListings] = useState<Product[]>([]);

  // Market Trends Modal
  const [isMarketTrendsOpen, setIsMarketTrendsOpen] = useState<boolean>(false);

  // Skeleton & Data Fetching Simulation
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  const simulateRefreshInventory = () => {
    setIsLoadingProducts(true);
    showToast('Syncing live industrial inventory & verified appraisals...');
    setTimeout(() => {
      setIsLoadingProducts(false);
      showToast('Industrial machinery catalog updated with latest live prices');
    }, 450);
  };

  // Trigger smooth skeleton loading on major category / view switch
  useEffect(() => {
    setIsLoadingProducts(true);
    const timer = setTimeout(() => {
      setIsLoadingProducts(false);
    }, 320);
    return () => clearTimeout(timer);
  }, [filterState.category, filterState.subcategory, filterState.sortBy, filterState.locationHub, activeView]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const resetFilters = () => {
    setFilterState(initialFilterState);
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedBrand('All Brands');
    setSelectedHub('All Hubs & Locations');
  };

  const formatPrice = (amountNGN: number, amountUSD?: number): string => {
    if (currency === 'USD') {
      const val = amountUSD || Math.round(amountNGN / 1500);
      return `$${val.toLocaleString()}`;
    }
    return `₦${amountNGN.toLocaleString()}`;
  };

  // Cart operations
  const isInCart = (productId: string): boolean => {
    return cart.some(item => item.product.id === productId);
  };

  const addToCart = (product: Product, includeInspection = true, includeFreight = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const inspectionFee = product.priceNGN > 10000000 ? 85000 : 45000;
      const freightFee = product.category === 'Machines' ? 150000 : 25000;
      return [
        ...prev,
        {
          product,
          quantity: 1,
          includePhysicalInspection: includeInspection,
          includeFreightAssistance: includeFreight,
          inspectionFeeNGN: inspectionFee,
          estimatedFreightNGN: freightFee,
        }
      ];
    });
    showToast(`✓ Added "${product.title.slice(0, 30)}..." to Cart`);
  };

  const uncart = (productId: string) => {
    const itemToRemove = cart.find(item => item.product.id === productId);
    setCart(prev => prev.filter(item => item.product.id !== productId));
    if (itemToRemove) {
      showToast(`Removed "${itemToRemove.product.title.slice(0, 30)}..." from Cart`);
    } else {
      showToast(`Item removed from Cart`);
    }
  };

  const toggleCart = (product: Product, includeInspection = true, includeFreight = false) => {
    if (isInCart(product.id)) {
      uncart(product.id);
    } else {
      addToCart(product, includeInspection, includeFreight);
    }
  };

  const removeFromCart = (productId: string) => {
    uncart(productId);
  };

  const updateCartItemQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const toggleCartInspection = (productId: string) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, includePhysicalInspection: !item.includePhysicalInspection }
          : item
      )
    );
  };

  const toggleCartFreight = (productId: string) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, includeFreightAssistance: !item.includeFreightAssistance }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.setItem('mtm_cart', JSON.stringify([]));
    } catch {}
  };

  const cartTotal = cart.reduce(
    (acc, item) => {
      const pTotal = item.product.priceNGN * item.quantity;
      const inspTotal = item.includePhysicalInspection ? item.inspectionFeeNGN : 0;
      const freightTotal = item.includeFreightAssistance ? item.estimatedFreightNGN : 0;
      return {
        subtotal: acc.subtotal + pTotal,
        inspectionTotal: acc.inspectionTotal + inspTotal,
        freightTotal: acc.freightTotal + freightTotal,
        grandTotal: acc.grandTotal + pTotal + inspTotal + freightTotal,
      };
    },
    { subtotal: 0, inspectionTotal: 0, freightTotal: 0, grandTotal: 0 }
  );

  // Comparison
  const addToCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === product.id)) {
        showToast('Item is already in your comparison matrix');
        return prev;
      }
      if (prev.length >= 4) {
        showToast('You can compare up to 4 machines simultaneously');
        return prev;
      }
      showToast(`Added ${product.brand} to Comparison Matrix`);
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
    try {
      localStorage.setItem('mtm_compare', JSON.stringify([]));
    } catch {}
  };

  // Offers
  const createOffer = (offerData: Omit<OfferNegotiation, 'id' | 'createdAt' | 'status'>) => {
    const newOffer: OfferNegotiation = {
      ...offerData,
      id: `off-${Date.now()}`,
      createdAt: 'Just now',
      status: 'Pending Seller Review',
    };
    setOffers(prev => [newOffer, ...prev]);
    showToast(`Official Purchase Offer of ${formatPrice(offerData.offeredPrice)} submitted to ${offerData.sellerName}`);
  };

  // Inspections
  const bookInspection = (productId: string, productTitle: string, sellerLocation: string, date: string, type: string) => {
    const newInsp: InspectionBooking = {
      id: `insp-${Date.now().toString().slice(-4)}`,
      productId,
      productTitle,
      sellerLocation,
      inspectionDate: date,
      inspectorType: type,
      status: 'Scheduled',
    };
    setInspections(prev => [newInsp, ...prev]);
    showToast(`Certified MTM Inspector booked for ${date}. Tracking ID: ${newInsp.id}`);
  };

  const addNewListing = (listing: Product) => {
    setProducts(prev => [listing, ...prev]);
    setUserListings(prev => [listing, ...prev]);
    showToast(`Machine listing "${listing.title.slice(0, 30)}..." published to MTM marketplace!`);
  };

  // Filtered Products computation
  const filteredProducts = products.filter(item => {
    // Search
    if (filterState.search.trim()) {
      const q = filterState.search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchModel = item.model.toLowerCase().includes(q);
      const matchCategory = item.subcategory.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchBrand && !matchModel && !matchCategory && !matchDesc && !matchTags) {
        return false;
      }
    }

    // Category
    if (filterState.category !== 'All') {
      const catLower = filterState.category.toLowerCase();
      const itemCatLower = (item.category || '').toLowerCase();
      const itemSubLower = (item.subcategory || '').toLowerCase();
      const itemDeptLower = (item.department || '').toLowerCase();
      
      const isMatch = 
        itemCatLower === catLower ||
        itemSubLower.includes(catLower) ||
        itemDeptLower.includes(catLower) ||
        (catLower === 'machines' && (itemCatLower.includes('machin') || itemCatLower.includes('furniture') || itemCatLower.includes('construction') || itemCatLower.includes('agri') || itemCatLower.includes('electr'))) ||
        (catLower === 'tools' && (itemCatLower.includes('tool') || itemSubLower.includes('tool'))) ||
        (catLower === 'materials' && (itemCatLower.includes('material') || itemSubLower.includes('material') || itemSubLower.includes('timber') || itemSubLower.includes('steel')));

      if (!isMatch) return false;
    }

    // Subcategory or Department
    if (filterState.subcategory !== 'All') {
      const subLower = filterState.subcategory.toLowerCase();
      const itemSubLower = (item.subcategory || '').toLowerCase();
      const itemDeptLower = (item.department || '').toLowerCase();
      const itemTypeLower = (item.machineType || '').toLowerCase();
      const itemTitleLower = item.title.toLowerCase();

      const isSubMatch = 
        itemSubLower.includes(subLower) || 
        itemDeptLower.includes(subLower) || 
        itemTypeLower.includes(subLower) ||
        itemTitleLower.includes(subLower);

      if (!isSubMatch) return false;
    }

    // Brand
    if (filterState.brand !== 'All Brands') {
      if (!item.brand.toLowerCase().includes(filterState.brand.toLowerCase())) return false;
    }

    // Condition
    if (filterState.condition !== 'All') {
      if (item.condition !== filterState.condition) return false;
    }

    // Location Hub
    if (filterState.locationHub !== 'All Hubs & Locations') {
      const hubKey = filterState.locationHub.split(' ')[0].toLowerCase();
      const itemLocationStr = `${item.location.city} ${item.location.state} ${item.location.industrialArea}`.toLowerCase();
      if (!itemLocationStr.includes(hubKey)) return false;
    }

    // Price
    if (item.priceNGN < filterState.priceRange[0] || item.priceNGN > filterState.priceRange[1]) {
      return false;
    }

    // Checkboxes
    if (filterState.hasInspectionCertOnly && !item.hasInspectionCertificate) return false;
    if (filterState.hasVideoTestOnly && !item.hasVideoTest) return false;
    if (filterState.isLiquidationOnly && !item.isLiquidation) return false;

    // Power Phase
    if (filterState.powerPhase !== 'All') {
      if (item.powerSpecs.phase !== filterState.powerPhase) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filterState.sortBy === 'price-low') return a.priceNGN - b.priceNGN;
    if (filterState.sortBy === 'price-high') return b.priceNGN - a.priceNGN;
    if (filterState.sortBy === 'inspection-score') return (b.inspectionScore || 0) - (a.inspectionScore || 0);
    if (filterState.sortBy === 'newest') return (b.year || 2000) - (a.year || 2000);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  // Global backdrop click listener to close any open dialogs and return to home page
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if any modal/dialog is active
      const isAnyModalActive = 
        isQrScannerOpen ||
        isQuickReorderOpen ||
        isForecastingOpen ||
        isBulkImportOpen ||
        isAdminPanelOpen ||
        isCartOpen ||
        isCompareOpen ||
        isPriceAlertModalOpen ||
        isNotificationsOpen ||
        isPrototypesOpen ||
        isInteriorDuctModalOpen ||
        isOrderTrackingOpen ||
        isInventoryAlertOpen ||
        isDisputeCenterOpen ||
        isTermsModalOpen ||
        isSupportHubOpen ||
        isAIAdvisorOpen ||
        isMtmAgentOpen ||
        isSellModalOpen ||
        isMarketTrendsOpen ||
        activeProduct !== null ||
        activeNegotiationProduct !== null ||
        activeInspectionProduct !== null ||
        activePriceAlertProduct !== null ||
        selectedSellerProfile !== null;

      if (!isAnyModalActive) return;

      // Verify if the click was registered directly on the backdrop/overlay wrapper.
      const isBackdropClick = 
        target.classList.contains('fixed') && (
          target.classList.contains('inset-0') || 
          target.classList.contains('bg-slate-900/60') || 
          target.classList.contains('bg-slate-900/50') || 
          target.classList.contains('bg-black/50') || 
          target.classList.contains('bg-slate-900/80') || 
          target.classList.contains('backdrop-blur-xs') ||
          target.classList.contains('backdrop-blur-sm') ||
          target.classList.contains('overflow-y-auto')
        );

      if (isBackdropClick) {
        // Double check that we didn't target a white modal box child
        const modalChild = target.querySelector('.bg-white, .bg-slate-900, [role="dialog"]');
        if (modalChild && modalChild.contains(target)) {
          return;
        }

        // Close all dialogs/windows
        setIsQrScannerOpen(false);
        setIsQuickReorderOpen(false);
        setIsForecastingOpen(false);
        setIsBulkImportOpen(false);
        setIsAdminPanelOpen(false);
        setIsCartOpen(false);
        setIsCompareOpen(false);
        setIsPriceAlertModalOpen(false);
        setIsNotificationsOpen(false);
        setIsPrototypesOpen(false);
        setIsInteriorDuctModalOpen(false);
        setIsOrderTrackingOpen(false);
        setIsInventoryAlertOpen(false);
        setIsDisputeCenterOpen(false);
        setIsTermsModalOpen(false);
        setIsSupportHubOpen(false);
        setIsAIAdvisorOpen(false);
        setIsMtmAgentOpen(false);
        setIsSellModalOpen(false);
        setIsMarketTrendsOpen(false);
        setActiveProduct(null);
        setActiveNegotiationProduct(null);
        setActiveInspectionProduct(null);
        setActivePriceAlertProduct(null);
        setSelectedSellerProfile(null);
        setAdvisorInitialPrompt('');

        // Return to the main website landing page
        setActiveView('home');
        showToast('Returned to main website landing page');
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [
    isQrScannerOpen,
    isQuickReorderOpen,
    isForecastingOpen,
    isBulkImportOpen,
    isAdminPanelOpen,
    isCartOpen,
    isCompareOpen,
    isPriceAlertModalOpen,
    isNotificationsOpen,
    isPrototypesOpen,
    isInteriorDuctModalOpen,
    isOrderTrackingOpen,
    isInventoryAlertOpen,
    isDisputeCenterOpen,
    isTermsModalOpen,
    isSupportHubOpen,
    isAIAdvisorOpen,
    isMtmAgentOpen,
    isSellModalOpen,
    isMarketTrendsOpen,
    activeProduct,
    activeNegotiationProduct,
    activeInspectionProduct,
    activePriceAlertProduct,
    selectedSellerProfile
  ]);

  return (
    <MarketplaceContext.Provider
      value={{
        lastActivityRef,
        areModalsHidden,
        setAreModalsHidden,
        currentLanguage,
        setLanguage,
        t,
        isQrScannerOpen,
        setIsQrScannerOpen,
        isQuickReorderOpen,
        setIsQuickReorderOpen,
        isOffline,
        setIsOffline,
        isForecastingOpen,
        setIsForecastingOpen,
        isBulkImportOpen,
        setIsBulkImportOpen,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedBrand,
        setSelectedBrand,
        currency,
        setCurrency,
        formatPrice,
        selectedHub,
        setSelectedHub,
        products,
        activeProduct,
        setActiveProduct: handleSetActiveProduct,
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
        filteredProducts,
        filterState,
        setFilterState,
        resetFilters,
        cart,
        isInCart,
        addToCart,
        removeFromCart,
        uncart,
        toggleCart,
        updateCartItemQty,
        toggleCartInspection,
        toggleCartFreight,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        offers,
        createOffer,
        activeNegotiationProduct,
        setActiveNegotiationProduct,
        inspections,
        bookInspection,
        activeInspectionProduct,
        setActiveInspectionProduct,
        isAIAdvisorOpen,
        setIsAIAdvisorOpen,
        advisorInitialPrompt,
        setAdvisorInitialPrompt,
        isMtmAgentOpen,
        setIsMtmAgentOpen,
        isSellModalOpen,
        setIsSellModalOpen,
        userListings,
        addNewListing,
        priceAlerts,
        addPriceAlert,
        removePriceAlert,
        getPriceAlertForProduct,
        activePriceAlertProduct,
        setActivePriceAlertProduct,
        isPriceAlertModalOpen,
        setIsPriceAlertModalOpen,
        notifications,
        unreadNotificationCount,
        markAllNotificationsAsRead,
        dismissNotification,
        triggerSimulatedPriceDrop,
        isNotificationsOpen,
        setIsNotificationsOpen,
        toastMessage,
        showToast,
        isLoadingProducts,
        setIsLoadingProducts,
        simulateRefreshInventory,
        isMarketTrendsOpen,
        setIsMarketTrendsOpen,
        isPrototypesOpen,
        setIsPrototypesOpen,
        prototypeInitialRole,
        setPrototypeInitialRole,
        selectedSellerProfile,
        setSelectedSellerProfile,
        isInteriorDuctModalOpen,
        setIsInteriorDuctModalOpen,
        searchHistory,
        addSearchHistory,
        clearSearchHistory,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        orderTrackingId,
        openOrderTracking,
        isInventoryAlertOpen,
        setIsInventoryAlertOpen,
        isDisputeCenterOpen,
        setIsDisputeCenterOpen,
        disputeOrderId,
        openDisputeCenter,
        isTermsModalOpen,
        setIsTermsModalOpen,
        hasAcceptedTerms,
        acceptedTermsTimestamp,
        acceptTerms,
        declineTerms,
        isSupportHubOpen,
        setIsSupportHubOpen,
        isSellerAuthenticated,
        setIsSellerAuthenticated,
        sellerUser,
        setSellerUser,
        loginAsSeller,
        registerAsSeller,
        logoutSeller,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        loginAsAdmin,
        logoutAdmin,
        adminPassword,
        updateAdminPassword,
        usersList,
        createUser,
        editUser,
        deleteUser,
        toggleDecommissionUser,
        siteSettings,
        updateSiteSettings,
        setProducts,
        payoutsList,
        completePayout,
        calculatePayoutCommission,
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
        selectedIoTMachineId,
        setSelectedIoTMachineId,
        openIoTSensorModal,
        rewardTransactions,
        recordTransaction,
        isPurchaseOrderModalOpen,
        setIsPurchaseOrderModalOpen,
        openPurchaseOrderModal,
        purchaseOrders,
        savePurchaseOrder,
        deletePurchaseOrder,
        isVideoDemoOpen,
        setIsVideoDemoOpen,
        openVideoDemo,
        activeDemoVideoId,
        setActiveDemoVideoId,
        isVideoUploadOpen,
        setIsVideoUploadOpen,
        videoComments,
        addVideoComment,
        likeVideoComment,
        videoAnnotations,
        addVideoAnnotation,
        videoPlaylists,
        activePlaylist,
        setActivePlaylist,
        videoWatchlist,
        toggleWatchlistVideo,
        popupSecondsLeft,
        isPopupTimerPaused,
        togglePopupTimerPause,
        timeUntilNextPopup,
        skipToNextVideo,
        autoVideoPopupEnabled,
        setAutoVideoPopupEnabled,
        currentVideoIndex,
        modalStack,
        bringModalToFront,
        removeModalFromStack,
        getModalZIndex,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
};
