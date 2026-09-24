export type Currency = 'NGN' | 'USD';

export type MainCategory = 
  | 'Furniture Manufacturing'
  | 'Metal Welding and Fabrication'
  | 'Metal Welding & Fabrication'
  | 'Industrial Machinery'
  | 'Construction'
  | 'Agriculture'
  | 'Electrical'
  | 'Workshop Tools'
  | 'Materials'
  | 'Machines'
  | 'Tools';

export type EquipmentCondition = 
  | 'Brand New' 
  | 'Like New' 
  | 'Refurbished' 
  | 'Tested Working' 
  | 'Good'
  | 'Used • Good Condition'
  | 'Needs Servicing';

export type BusinessType = 
  | 'Factory' 
  | 'Workshop' 
  | 'Dealer / Importer' 
  | 'Contractor' 
  | 'Liquidator' 
  | 'Artisan Hub';

export interface SellerReview {
  id: string;
  buyerName: string;
  buyerCompany: string;
  rating: number;
  date: string;
  comment: string;
  machinePurchased: string;
  verifiedPurchase: boolean;
  inspectionPassed: boolean;
}

export interface Seller {
  id: string;
  name: string;
  businessType: BusinessType;
  isVerified: boolean;
  rating: number; // e.g. 4.8
  reviewCount: number;
  joinedYear: number | string; // e.g. 2026 or 2021
  verifiedSince?: string | number; // e.g. 2026
  location: string; // e.g. "Benin City, Nigeria"
  state?: string; // e.g. "Edo State"
  city?: string; // e.g. "Benin City"
  phone?: string;
  email?: string;
  responseTime: string; // e.g. "14 mins"
  responseRate?: string; // e.g. "96%"
  productsCount?: number; // e.g. 46
  completedSales?: number; // e.g. 128
  verifiedBadges: string[];
  cacNumber?: string; // e.g. "RC 1498224"
  warehouseAddress?: string;
  craneCapacity?: string;
  backupPower?: string;
  bio?: string;
  bannerImage?: string;
  logo?: string;
  reviews?: SellerReview[];
}

export interface PowerSpecs {
  voltage: string; // e.g. "3-Phase 380V-415V", "Single-Phase 220V", "Diesel 1500 RPM", "Pneumatic 8-Bar"
  minGeneratorKVA?: number;
  kwRating?: number;
  phase?: '1-Phase' | '3-Phase' | 'Engine Driven' | 'Manual / Air';
  fuelType?: 'Diesel' | 'Petrol' | 'Electric' | 'Hydraulic' | 'Pneumatic';
}

export interface DeliveryOptions {
  escrowProtected: boolean;
  inspectionBeforePayment: boolean;
  freightAssisted: boolean;
  estimatedDays: string;
  originHub: string;
}

export interface ConditionReport {
  overall: string; // e.g. "Good", "Like New", "Refurbished"
  overallScore: number; // e.g. 80 (%)
  mechanical: number; // e.g. 80 (%)
  electrical: number; // e.g. 70 (%)
  cosmetic: number; // e.g. 60 (%)
  operational: number; // e.g. 80 (%)
  inspectorNotes?: string;
  inspectionDate?: string;
  inspectorName?: string;
  certifiedGrade?: string; // e.g. "Grade A - Industrial Certified"
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string; // e.g. 'Furniture Manufacturing', 'Industrial Machinery', 'Construction', 'Agriculture', 'Electrical', 'Workshop Tools', 'Materials'
  pillar?: string; // legacy or top pillar
  department?: string; // e.g. 'Cutting', 'Panel processing', 'Wood shaping', 'Sanding', 'Finishing', 'Upholstery', 'Assembly', 'Material handling'
  subcategory: string; // e.g. 'Panel Saw', 'Edge Bander', 'CNC Router'
  machineType?: string; // e.g. 'Edge Bander', 'Sliding Table Panel Saw'
  brand: string;
  model: string;
  year?: number;
  priceNGN: number;
  priceUSD: number;
  originalPriceNGN?: number;
  originalPriceUSD?: number;
  condition: EquipmentCondition;
  usage?: string; // e.g. 'Previously used in commercial joinery facility'
  availability?: string; // e.g. 'In Stock • Immediate Rigging & Dispatch'
  rating?: number; // e.g. 4.8
  ratingCount?: number; // e.g. 19
  location: {
    city: string;
    state: string;
    industrialArea: string;
  };
  seller: Seller;
  images: string[];
  hasVideoTest: boolean;
  videoTestUrl?: string;
  videoTestDuration?: string;
  videoTestTelemetry?: {
    spindleRpm?: number;
    loadAmps?: number;
    vibrationMms?: number;
    bearingTempC?: number;
    runoutMm?: number;
    testLocation?: string;
    inspectorName?: string;
    inspectorBadge?: string;
    operationalLoad?: string;
    chapters?: { time: string; label: string }[];
  };
  hasInspectionCertificate: boolean;
  inspectionScore?: number; // e.g. 94%
  conditionReport?: ConditionReport;
  powerSpecs: PowerSpecs;
  technicalSpecs: Record<string, string>;
  description: string;
  tags: string[];
  isDeal?: boolean;
  isLiquidation?: boolean;
  isArchived?: boolean;
  locationHub?: string;
  liquidationDiscount?: number; // e.g. 25 (%)
  stockQuantity: number;
  moq?: number;
  unit: string; // e.g. 'Unit', 'Tons', 'Bundles', 'Pack of 50'
  hoursUsed?: number;
  deliveryOptions: DeliveryOptions;
  featured?: boolean;
  brandSourceUrl?: string; // e.g. "https://www.scmgroup.com"
  brandSourceName?: string; // e.g. "SCM Group Official OEM Portal"
  isLiveCrawled?: boolean;
  lastCrawledAt?: string; // e.g. "Just now" or "2 mins ago"
  crawlSourceHub?: string; // e.g. "Lagos Alaba Industrial Hub" or "European Machinery Exchange"
}

export interface SubcategoryGroup {
  name: string; // e.g. 'Cutting', 'Panel processing'
  description?: string;
  items: string[]; // ['Panel Saw', 'Table Saw', 'Beam Saw', ...]
}

export interface CategoryTreeItem {
  id: string;
  name: string; // e.g. 'Furniture Manufacturing'
  slug: string;
  iconName: string;
  tagline: string;
  description: string;
  colorTheme: 'amber' | 'blue' | 'yellow' | 'emerald' | 'cyan' | 'rose' | 'purple';
  itemCount: number;
  image: string;
  isSpecialistVertical?: boolean;
  departments?: SubcategoryGroup[]; // for rich vertical grouping like furniture
  subcategories: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  pillar: MainCategory;
  iconName: string;
  description: string;
  subcategories: string[];
  itemCount: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  includePhysicalInspection: boolean;
  includeFreightAssistance: boolean;
  inspectionFeeNGN: number;
  estimatedFreightNGN: number;
}

export interface OfferNegotiation {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  sellerName: string;
  buyerName: string;
  buyerCompany: string;
  originalPrice: number;
  offeredPrice: number;
  currency: Currency;
  status: 'Pending Seller Review' | 'Counter-Offer Received' | 'Accepted' | 'Declined';
  notes: string;
  requiresInspection: boolean;
  counterPrice?: number;
  createdAt: string;
}

export interface InspectionBooking {
  id: string;
  productId: string;
  productTitle: string;
  sellerLocation: string;
  inspectionDate: string;
  inspectorType: string;
  status: 'Scheduled' | 'Inspector Dispatched' | 'Report Ready';
  reportUrl?: string;
  score?: number;
}

export interface FilterState {
  search: string;
  category: string;
  subcategory: string;
  brand: string;
  condition: string;
  locationHub: string;
  priceRange: [number, number];
  hasInspectionCertOnly: boolean;
  hasVideoTestOnly: boolean;
  isLiquidationOnly: boolean;
  powerPhase: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest' | 'inspection-score';
}

export interface PriceAlert {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productCategory?: string;
  initialPriceNGN: number;
  initialPriceUSD: number;
  targetPriceNGN: number;
  targetPriceUSD?: number;
  targetPrice: number;
  currency: Currency;
  notificationChannel: 'in_app' | 'email' | 'whatsapp' | 'all';
  contactValue?: string;
  createdAt: string;
  triggered?: boolean;
  triggeredPrice?: number;
  triggeredAt?: string;
  discountPercent?: number;
}

export interface AppNotification {
  id: string;
  type: 'price_drop' | 'offer_update' | 'inspection_update' | 'system';
  title: string;
  message: string;
  productId?: string;
  productImage?: string;
  timestamp: string;
  read: boolean;
  discountAmount?: string;
  newPrice?: number;
}

export interface PriceTrendDataPoint {
  period: string;
  priceNGN: number;
  priceUSD: number;
  marketAverageNGN: number;
  volumeIndex?: number;
  eventNote?: string;
}

export interface RegionalDemandMetric {
  hub: string;
  demandScore: number; // 0 - 100
  demandLevel: 'Surging' | 'Very High' | 'High' | 'Moderate';
  activeBuyers: number;
  avgDaysOnMarket: number;
}

export interface SmartProductTrend {
  historicalPrices: PriceTrendDataPoint[];
  twelveMonthChangePct: number;
  threeMonthVelocity: number;
  demandVelocity: 'Surging' | 'High' | 'Stable' | 'Cooling';
  marketScarcity: 'Critically Scarce' | 'High Scarcity (Few Units)' | 'Balanced Supply' | 'Surplus Stock';
  residualRetention2Yr: number; // e.g. 76%
  residualRetention4Yr: number; // e.g. 58%
  replacementCostNewNGN: number;
  replacementSavingsPct: number;
  aiBuyingVerdict: 'Strong Buy Now' | 'Favorable Entry' | 'Fair Market Value' | 'Negotiate Target';
  aiVerdictExplanation: string;
  regionalDemand: RegionalDemandMetric[];
  industrialInflationIndexPct: number;
}

export interface MarketCategoryTrend {
  category: string;
  growthRatePct: number;
  demandRank: number;
  averageDepreciationRate: string;
  topSoughtModel: string;
  sentiment: 'Bullish Demand' | 'High Liquidity' | 'Stable Manufacturing' | 'Clearance Momentum';
  activeListingsCount: number;
}

export interface PurchaseOrderItem {
  productId: string;
  title: string;
  brand: string;
  model: string;
  condition: string;
  category: string;
  unitPriceNGN: number;
  unitPriceUSD: number;
  quantity: number;
  includePhysicalInspection: boolean;
  inspectionFeeNGN: number;
  includeFreightAssistance: boolean;
  freightFeeNGN: number;
  sellerName: string;
  sellerLocation: string;
  totalLineNGN: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  createdAt: string;
  validUntil: string;
  buyerCompany: string;
  buyerContactName: string;
  buyerTitle: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerTIN?: string;
  deliveryHub: string;
  deliveryAddress: string;
  paymentTerms: string;
  items: PurchaseOrderItem[];
  subtotalNGN: number;
  totalInspectionNGN: number;
  totalFreightNGN: number;
  vatTaxNGN: number;
  grandTotalNGN: number;
  grandTotalUSD: number;
  notes: string;
  approvalStatus: 'Draft' | 'Submitted for Internal Review' | 'Approved by CFO' | 'Issued to MTM Escrow';
  approverName?: string;
  approverTitle?: string;
}

export interface DemoVideoItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  videoUrl: string;
  posterUrl: string;
  badge: string;
  category: string;
  description: string;
  keyTakeaways: string[];
  chapters: { timeSeconds: number; timeStr: string; title: string; description: string }[];
  resolutionStreams: { quality: string; label: string; url: string; bitrate: string }[];
}

export interface VideoUploadData {
  id: string;
  title: string;
  fileName: string;
  fileSizeMb: number;
  duration: string;
  videoBlobUrl?: string;
  thumbnailUrl?: string;
  resolution: string;
  uploadedAt: string;
  status: 'Uploading' | 'Transcoding' | 'Ready' | 'Failed';
  transcodeProgress: number;
  spindleRpm?: number;
  loadAmps?: number;
  vibrationMms?: number;
  bearingTempC?: number;
  inspectorName?: string;
  inspectorBadge?: string;
  hubLocation: string;
  compressionStats?: VideoCompressionStats;
}

export interface VideoComment {
  id: string;
  videoId: string;
  authorName: string;
  authorRole: string;
  text: string;
  timestamp: string;
  likes: number;
  avatar?: string;
}

export interface VideoAnnotation {
  id: string;
  videoId: string;
  timeSeconds: number;
  timeStr: string;
  text: string;
  type: 'note' | 'defect' | 'highlight' | 'measurement';
  author: string;
  createdAt: string;
}

export interface VideoPlaylist {
  id: string;
  title: string;
  description: string;
  videoIds: string[];
  thumbnail: string;
  category: string;
  durationTotal: string;
}

export interface VideoCompressionStats {
  originalSizeMb: number;
  compressedSizeMb: number;
  savingsPercent: number;
  codec: string;
  bitrate: string;
  status: 'Optimized' | 'Transcoding' | 'Ultra-Compressed';
}
