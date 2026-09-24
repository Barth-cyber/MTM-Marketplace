import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  ShieldCheck, 
  Star, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  TrendingUp, 
  Filter, 
  Search, 
  Award, 
  Sparkles, 
  ExternalLink,
  Package,
  Truck,
  Heart,
  Bot
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export interface LeaderboardSeller {
  id: string;
  rank: number;
  name: string;
  hub: string;
  region: string;
  specialty: string;
  category: 'Machines' | 'Tools' | 'Materials' | 'All';
  escrowFulfillmentRate: number;
  totalOrders: number;
  transactedVolumeNGN: number;
  rating: number;
  reviewCount: number;
  dispatchSpeed: string;
  activeListingsCount: number;
  tierBadge: string;
  isTier1: boolean;
  isNBTE: boolean;
  communityImpactPartner?: string;
  isInteriorDuct?: boolean;
  sellerId?: string;
}

export const LEADERBOARD_SELLERS: LeaderboardSeller[] = [
  {
    id: 'lead-1',
    rank: 1,
    name: 'Interior Duct Ltd',
    hub: 'Benin City, Edo State',
    region: 'Benin City',
    specialty: 'Industrial Woodworking Machinery, CNC Systems & Custom Furniture',
    category: 'Machines',
    escrowFulfillmentRate: 100.0,
    totalOrders: 0,
    transactedVolumeNGN: 0,
    rating: 5.0,
    reviewCount: 0,
    dispatchSpeed: '< 24 Hours',
    activeListingsCount: 14,
    tierBadge: 'Tier-1 Verified Partner',
    isTier1: true,
    isNBTE: true,
    communityImpactPartner: 'Bomon Development Foundation (Charity NGO)',
    isInteriorDuct: true,
    sellerId: 'usr-3'
  },
  {
    id: 'lead-2',
    rank: 2,
    name: 'Oregun Machinery & Tooling Hub',
    hub: 'Oregun Industrial Estate, Ikeja, Lagos',
    region: 'Lagos',
    specialty: 'Metalworking Lathes, Milling Centers & Heavy Diesel Generators',
    category: 'Machines',
    escrowFulfillmentRate: 100.0,
    totalOrders: 0,
    transactedVolumeNGN: 0,
    rating: 5.0,
    reviewCount: 0,
    dispatchSpeed: '< 48 Hours',
    activeListingsCount: 22,
    tierBadge: 'Tier-1 Verified Merchant',
    isTier1: true,
    isNBTE: false,
    sellerId: 'usr-1'
  },
  {
    id: 'lead-3',
    rank: 3,
    name: 'Bompai Industrial Equipment Ltd',
    hub: 'Bompai Industrial Layout, Kano',
    region: 'Kano',
    specialty: 'Agricultural Processing Mills, Heavy Diesel Power & Tooling',
    category: 'Machines',
    escrowFulfillmentRate: 100.0,
    totalOrders: 0,
    transactedVolumeNGN: 0,
    rating: 5.0,
    reviewCount: 0,
    dispatchSpeed: '< 48 Hours',
    activeListingsCount: 18,
    tierBadge: 'Tier-1 Verified Merchant',
    isTier1: true,
    isNBTE: false,
    sellerId: 'usr-2'
  },
  {
    id: 'lead-4',
    rank: 4,
    name: 'Trans-Amadi Equipment Co.',
    hub: 'Trans-Amadi Industrial Layout, Port Harcourt',
    region: 'Port Harcourt',
    specialty: 'Hydraulic Press Brakes, Industrial Air Compressors & Heavy Rigging',
    category: 'Machines',
    escrowFulfillmentRate: 100.0,
    totalOrders: 0,
    transactedVolumeNGN: 0,
    rating: 5.0,
    reviewCount: 0,
    dispatchSpeed: '< 72 Hours',
    activeListingsCount: 11,
    tierBadge: 'Tier-2 Audited Merchant',
    isTier1: false,
    isNBTE: false,
    sellerId: 'usr-4'
  },
  {
    id: 'lead-5',
    rank: 5,
    name: 'Aba Fabrication & Tools Yard',
    hub: 'Factory Road Industrial Zone, Aba',
    region: 'Aba',
    specialty: 'Precision Workshop Tooling, Inverter Welders & Carbide Cutters',
    category: 'Tools',
    escrowFulfillmentRate: 100.0,
    totalOrders: 0,
    transactedVolumeNGN: 0,
    rating: 5.0,
    reviewCount: 0,
    dispatchSpeed: '< 48 Hours',
    activeListingsCount: 9,
    tierBadge: 'Tier-2 Audited Merchant',
    isTier1: false,
    isNBTE: false,
    sellerId: 'usr-5'
  },
  {
    id: 'lead-6',
    rank: 6,
    name: 'Midwest Woodworks & Tooling',
    hub: 'Benin City, Edo State',
    region: 'Benin City',
    specialty: 'Band Saws, Spindle Moulders & Edge Banders',
    category: 'Machines',
    escrowFulfillmentRate: 100.0,
    totalOrders: 0,
    transactedVolumeNGN: 0,
    rating: 5.0,
    reviewCount: 0,
    dispatchSpeed: '< 48 Hours',
    activeListingsCount: 8,
    tierBadge: 'Tier-2 Audited Merchant',
    isTier1: false,
    isNBTE: true,
    sellerId: 'usr-6'
  }
];

interface SellerLeaderboardProps {
  isFullView?: boolean;
}

export const SellerLeaderboard: React.FC<SellerLeaderboardProps> = ({ isFullView = false }) => {
  const { 
    formatPrice, 
    setIsInteriorDuctModalOpen, 
    setSelectedSellerProfile, 
    setActiveView, 
    setFilterState,
    setIsMtmAgentOpen
  } = useMarketplace();

  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSellers = LEADERBOARD_SELLERS.filter(seller => {
    const matchRegion = selectedRegion === 'All' || seller.region === selectedRegion;
    const matchCat = selectedCategoryFilter === 'All' || seller.category === selectedCategoryFilter;
    const matchSearch = !searchQuery.trim() || 
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.hub.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRegion && matchCat && matchSearch;
  });

  const handleSellerClick = (seller: LeaderboardSeller) => {
    if (seller.isInteriorDuct) {
      setIsInteriorDuctModalOpen(true);
    } else {
      setSelectedSellerProfile({
        id: seller.sellerId || seller.id,
        name: seller.name,
        businessType: 'Factory',
        isVerified: true,
        rating: seller.rating,
        reviewCount: seller.reviewCount,
        joinedYear: 2024,
        location: seller.hub,
        phone: '080-MTM-VERIFIED',
        email: `${seller.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@mtm-hub.ng`,
        responseTime: seller.dispatchSpeed,
        productsCount: seller.activeListingsCount,
        completedSales: seller.totalOrders,
        verifiedBadges: [
          seller.tierBadge,
          '100% Escrow Guaranteed',
          'Physical Inspection Certified'
        ],
        bio: `${seller.name} is a top-ranked industrial merchant specializing in ${seller.specialty}. Physical site inspections conducted with full Escrow fulfillment compliance.`
      });
    }
  };

  const handleBrowseCatalog = (seller: LeaderboardSeller) => {
    setFilterState(prev => ({
      ...prev,
      search: seller.name.includes('Interior') ? 'Interior Duct' : seller.name.split(' ')[0],
      locationHub: seller.hub.includes('Benin') ? 'Benin City Hub' : seller.hub.includes('Lagos') ? 'Lagos Hub' : 'All Hubs'
    }));
    setActiveView('category-feed');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-6">
      
      {/* Strategic Header Banner */}
      <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#8B1520] text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Verified Nigerian Industrial Equipment Leaders</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Top Industrial Seller Leaderboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ranked by audited <strong className="text-slate-900">Escrow Fulfillment Rates</strong>, heavy machinery transaction volume, certified physical inspection reports, and verified buyer satisfaction across Nigeria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          <button
            onClick={() => setIsMtmAgentOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <Bot className="w-4 h-4 text-amber-500" />
            <span>Ask MTM Agent</span>
          </button>
          {!isFullView && (
            <button
              onClick={() => setActiveView('leaderboard')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-black text-xs flex items-center gap-2 transition shadow-md border border-[#7A101A]/30 cursor-pointer"
            >
              <span>View Full Leaderboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Controls (Silver Finish) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchant, industrial hub, or specialty..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#8B1520] focus:ring-1 focus:ring-[#8B1520]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <span className="text-slate-600 font-bold px-2 text-[11px]">Region:</span>
            {['All', 'Benin City', 'Lagos', 'Kano', 'Port Harcourt', 'Aba'].map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer text-[11px] ${
                  selectedRegion === region 
                    ? 'bg-[#8B1520] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <span className="text-slate-600 font-bold px-2 text-[11px]">Category:</span>
            {['All', 'Machines', 'Tools'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer text-[11px] ${
                  selectedCategoryFilter === cat 
                    ? 'bg-[#8B1520] text-white shadow-xs' 
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-4">
        {filteredSellers.map((seller) => {
          const isTop1 = seller.rank === 1;
          const isTop2 = seller.rank === 2;
          const isTop3 = seller.rank === 3;

          return (
            <div 
              key={seller.id}
              className="p-5 rounded-2xl transition-all duration-300 bg-white border border-slate-200 hover:border-slate-300 shadow-xs"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Left: Rank & Merchant Info */}
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black text-base shrink-0 shadow-xs border ${
                    isTop1 
                      ? 'bg-gradient-to-b from-[#FACC15] to-amber-500 text-slate-950 border-amber-400 shadow-amber-200' 
                      : isTop2 
                      ? 'bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 border-slate-300' 
                      : isTop3 
                      ? 'bg-gradient-to-b from-amber-100 to-amber-200 text-amber-900 border-amber-300' 
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {isTop1 ? <Trophy className="w-5 h-5" /> : isTop2 || isTop3 ? <Medal className="w-5 h-5" /> : <span>#{seller.rank}</span>}
                    <span className="text-[9px] font-black uppercase leading-none">Rank</span>
                  </div>

                  {/* Merchant Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 
                        onClick={() => handleSellerClick(seller)}
                        className="font-black text-slate-900 text-base sm:text-lg hover:text-[#8B1520] cursor-pointer transition flex items-center gap-1.5"
                      >
                        <span>{seller.name}</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      </h3>

                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide border ${
                        seller.isTier1 
                          ? 'bg-rose-50 text-[#8B1520] border-rose-200' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {seller.tierBadge}
                      </span>

                      {seller.isNBTE && (
                        <span className="bg-purple-50 text-purple-900 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Award className="w-3 h-3 text-purple-700" />
                          NBTE Centre No: 109260
                        </span>
                      )}

                      {seller.communityImpactPartner && (
                        <span className="bg-rose-50 text-[#8B1520] border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Heart className="w-3 h-3 text-[#8B1520] fill-[#8B1520]" />
                          Partner: {seller.communityImpactPartner}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-snug">
                      {seller.specialty}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 text-[#8B1520] font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                        {seller.hub}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-amber-700 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {seller.rating.toFixed(1)} ({seller.reviewCount} inspections)
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <Truck className="w-3.5 h-3.5 text-slate-500" />
                        Dispatch: <strong className="text-slate-900 font-bold">{seller.dispatchSpeed}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics & Actions */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-end lg:self-center w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                  
                  {/* Escrow Fulfillment Metric */}
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Escrow Fulfillment</span>
                    <span className="font-black text-base sm:text-lg text-emerald-700 block">
                      {seller.escrowFulfillmentRate.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{seller.totalOrders} Orders Guaranteed</span>
                  </div>

                  {/* Volume Transacted Metric */}
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Transacted Volume</span>
                    <span className="font-black text-sm sm:text-base text-slate-900 block">
                      {formatPrice(seller.transactedVolumeNGN)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{seller.activeListingsCount} Active Listings</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSellerClick(seller)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => handleBrowseCatalog(seller)}
                      className="px-3.5 py-2 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white text-xs font-extrabold rounded-xl transition shadow-md border border-[#7A101A]/30 cursor-pointer flex items-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Inventory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Guarantee Footer Note */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4 text-xs text-slate-700 shadow-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#8B1520] shrink-0" />
          <p>
            <strong className="text-slate-900">How are sellers ranked?</strong> Rankings update dynamically based on physical diagnostic inspection scores, 100% dispute-free escrow deliveries, verified company incorporation, and dispatch speed compliance.
          </p>
        </div>
        <button
          onClick={() => setIsMtmAgentOpen(true)}
          className="text-[#8B1520] font-bold hover:underline shrink-0 whitespace-nowrap cursor-pointer"
        >
          Ask MTM Agent about Sellers →
        </button>
      </div>

    </section>
  );
};
