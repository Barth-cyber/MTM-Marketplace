import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  ExternalLink,
  Building2,
  Award,
  ArrowRight
} from 'lucide-react';
import { Seller, Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { BackNavigation } from './BackNavigation';
import { useDraggableModal } from '../hooks/useDraggableModal';

interface SellerProfileModalProps {
  seller: Seller;
  onClose: () => void;
}

export const SellerProfileModal: React.FC<SellerProfileModalProps> = ({ seller, onClose }) => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const { products, setActiveProduct, formatPrice, addToCart, showToast } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'inventory' | 'reviews' | 'about'>('inventory');

  // Filter products belonging to this seller or mock if none
  const sellerProducts = products.filter(p => p.seller.id === seller.id || p.seller.name === seller.name);
  const displayProducts = sellerProducts.length > 0 ? sellerProducts : products.slice(0, 4);

  const reviews = seller.reviews || [
    {
      id: 'rev-01',
      buyerName: 'Engr. Emeka Okafor',
      buyerCompany: 'Okafor Heavy Joinery Ltd, Lagos',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Extremely professional machinery dealer based in Benin. Inspected the panel saw physically before escrow payment. Working perfectly after 3 months of continuous 10-hour shifts.',
      machinePurchased: 'Used SCM Panel Saw (Si400 Nova)',
      verifiedPurchase: true,
      inspectionPassed: true
    },
    {
      id: 'rev-02',
      buyerName: 'Alhaji Bello Sani',
      buyerCompany: 'Sani Woodworks & Furniture, Kano',
      rating: 5,
      date: '1 month ago',
      comment: 'Fast response and accurate machine condition declaration. Freight assistance to Kano was prompt and secure.',
      machinePurchased: 'Heavy Duty Spindle Moulder',
      verifiedPurchase: true,
      inspectionPassed: true
    },
    {
      id: 'rev-03',
      buyerName: 'Mrs. Folake Adebayo',
      buyerCompany: 'Adebayo Bespoke Interiors, Ibadan',
      rating: 4,
      date: '2 months ago',
      comment: 'Good communication and reliable escrow transaction. Minor delay in clearing freight due to interstate road checks, but seller followed up closely.',
      machinePurchased: 'Dust Extraction Unit 3HP',
      verifiedPurchase: true,
      inspectionPassed: true
    }
  ];

  const isInteriorDuct = seller.name.toLowerCase().includes('interior duct');

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 overflow-y-auto animate-fadeIn">
      <div 
        style={modalStyle}
        className={`bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border ${isInteriorDuct ? 'border-blue-200' : 'border-slate-200'} my-auto`}
      >
        {/* Back Navigation Helper */}
        <BackNavigation 
          onBack={onClose} 
          label="Back to Marketplace" 
          showClose={true} 
          onClose={onClose} 
          dragHandleProps={dragHandleProps}
        />
        
        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Banner Header */}
          <div 
            {...dragHandleProps}
            className={`p-6 sm:p-8 relative ${isInteriorDuct ? 'bg-[#F3F4F6] border-b border-blue-100' : 'bg-slate-900 text-white'} select-none`}
          >
            <button
              onClick={onClose}
              className={`no-drag absolute top-4 right-4 p-2 rounded-xl transition-colors cursor-pointer shadow-xs ${
                isInteriorDuct 
                  ? 'bg-white hover:bg-rose-600 hover:text-white text-slate-700 border border-slate-200' 
                  : 'bg-white/20 hover:bg-rose-600 hover:text-white text-white'
              }`}
              title="Close dialog"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl font-black text-[#1E40AF] border border-slate-200 shrink-0">
              {seller.logo ? (
                <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Building2 className="w-10 h-10 text-[#1E40AF]" />
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#1E40AF] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FACC15]" />
                  MTM VERIFIED SELLER
                </span>
                {isInteriorDuct && (
                  <span className="bg-blue-100 text-[#1E40AF] border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Featured Partner • Benin City
                  </span>
                )}
              </div>

              <h1 className={`text-2xl sm:text-3xl font-black ${isInteriorDuct ? 'text-slate-900' : 'text-white'}`}>
                {seller.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                <div className="flex items-center space-x-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className={isInteriorDuct ? 'text-slate-900 font-bold' : 'text-white font-bold'}>
                    {seller.rating || 4.8}
                  </span>
                  <span className="text-slate-500 font-normal">({seller.reviewCount || 38} reviews)</span>
                </div>

                <div className={`flex items-center space-x-1 ${isInteriorDuct ? 'text-slate-600' : 'text-slate-300'}`}>
                  <MapPin className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>{seller.location || 'Benin City, Nigeria'}</span>
                </div>

                <div className={`flex items-center space-x-1 ${isInteriorDuct ? 'text-slate-600' : 'text-slate-300'}`}>
                  <Award className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>Verified since {seller.verifiedSince || seller.joinedYear || 2026}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metric Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/80">
            <div className={`p-3 rounded-xl border ${isInteriorDuct ? 'bg-white border-blue-100 shadow-2xs' : 'bg-slate-800/80 border-slate-700'}`}>
              <span className="text-[11px] text-slate-500 block mb-0.5">Active Products</span>
              <span className={`text-lg font-black ${isInteriorDuct ? 'text-slate-900' : 'text-white'}`}>
                {seller.productsCount || displayProducts.length || 46}
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isInteriorDuct ? 'bg-white border-blue-100 shadow-2xs' : 'bg-slate-800/80 border-slate-700'}`}>
              <span className="text-[11px] text-slate-500 block mb-0.5">Completed Sales</span>
              <span className={`text-lg font-black ${isInteriorDuct ? 'text-slate-900' : 'text-white'}`}>
                {seller.completedSales ?? 0}
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isInteriorDuct ? 'bg-white border-blue-100 shadow-2xs' : 'bg-slate-800/80 border-slate-700'}`}>
              <span className="text-[11px] text-slate-500 block mb-0.5">Response Rate</span>
              <span className={`text-lg font-black ${isInteriorDuct ? 'text-emerald-700' : 'text-emerald-400'}`}>
                {seller.responseRate || '96%'}
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isInteriorDuct ? 'bg-white border-blue-100 shadow-2xs' : 'bg-slate-800/80 border-slate-700'}`}>
              <span className="text-[11px] text-slate-500 block mb-0.5">Average Response</span>
              <span className={`text-lg font-black ${isInteriorDuct ? 'text-slate-900' : 'text-white'}`}>
                {seller.responseTime || '14 mins'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => {
                showToast(`Opening secure direct chat with ${seller.name}`);
              }}
              className="bg-[#1E40AF] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg font-extrabold text-xs flex items-center space-x-2 shadow-sm transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Seller</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('inventory');
                showToast(`Viewing all listings from ${seller.name}`);
              }}
              className="bg-white hover:bg-slate-100 text-[#1E40AF] border border-blue-300 px-5 py-2.5 rounded-lg font-extrabold text-xs flex items-center space-x-2 shadow-2xs transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Store ({displayProducts.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3.5 px-4 border-b-2 transition ${
              activeTab === 'inventory' ? 'border-[#1E40AF] text-[#1E40AF] font-black' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Store Inventory ({displayProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-4 border-b-2 transition ${
              activeTab === 'reviews' ? 'border-[#1E40AF] text-[#1E40AF] font-black' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Customer Reviews & Ratings ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3.5 px-4 border-b-2 transition ${
              activeTab === 'about' ? 'border-[#1E40AF] text-[#1E40AF] font-black' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Company & Verification Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">
                  Active Machines & Tools Listed by {seller.name}
                </h3>
                <span className="text-xs text-slate-500">Escrow Protected & Verified Inspection</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayProducts.map(p => (
                  <div key={p.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:shadow-md transition flex flex-col justify-between space-y-3">
                    <div className="flex space-x-3">
                      <img src={p.images[0]} alt={p.title} className="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1E40AF]">
                          {p.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-2">{p.title}</h4>
                        <span className="text-xs font-black text-[#1E40AF] block">
                          {formatPrice(p.priceNGN, p.priceUSD)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-emerald-700 font-semibold">{p.condition}</span>
                      <button
                        onClick={() => {
                          onClose();
                          setActiveProduct(p);
                        }}
                        className="text-[#1E40AF] hover:underline font-bold flex items-center space-x-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Verified Buyer Feedback & Ratings</h3>
                <div className="flex items-center space-x-1 text-amber-500 font-black text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.8 / 5.0 overall rating</span>
                </div>
              </div>

              <div className="space-y-3">
                {reviews.map(rev => (
                  <div key={rev.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">{rev.buyerName}</span>
                        <span className="text-[10px] text-slate-500">({rev.buyerCompany})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>

                    <div className="flex items-center justify-between pt-2 text-[10px] border-t border-slate-200">
                      <span className="font-semibold text-[#1E40AF]">Purchased: {rev.machinePurchased}</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        ✓ Verified Escrow Purchase
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <h4 className="font-black text-[#1E40AF] text-sm">Corporate & Industrial Verification</h4>
                <p className="leading-relaxed">
                  {seller.name} is a fully verified corporate entity registered under Nigerian Corporate Affairs Commission (CAC). All listings undergo rigorous engineering inspection by MTM-certified technical personnel before publishing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-3 space-y-1">
                  <span className="text-slate-400 block">CAC Registration</span>
                  <span className="font-bold text-slate-900">{seller.cacNumber || 'RC 1498224 (Verified)'}</span>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 space-y-1">
                  <span className="text-slate-400 block">Warehouse & Testing Facility</span>
                  <span className="font-bold text-slate-900">{seller.warehouseAddress || 'Uselu Industrial Axis, Benin City, Edo State'}</span>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 space-y-1">
                  <span className="text-slate-400 block">Heavy Lifting Equipment</span>
                  <span className="font-bold text-slate-900">{seller.craneCapacity || '15-Ton Overhead Crane & Forklift on Site'}</span>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 space-y-1">
                  <span className="text-slate-400 block">Backup Generator Power</span>
                  <span className="font-bold text-slate-900">{seller.backupPower || '250kVA Perkins Industrial Generator for Live Machine Testing'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Protected by MTM Escrow Buyer Protection Policy</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
