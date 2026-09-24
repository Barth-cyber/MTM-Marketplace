import React, { useState } from 'react';
import { 
  X, 
  ArrowRightLeft, 
  Building2, 
  ShieldCheck, 
  Send, 
  DollarSign, 
  CheckCircle2,
  Calendar,
  Truck
} from 'lucide-react';
import { Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { BackNavigation } from './BackNavigation';
import { useDraggableModal } from '../hooks/useDraggableModal';

interface NegotiateModalProps {
  product: Product;
  onClose: () => void;
}

export const NegotiateModal: React.FC<NegotiateModalProps> = ({ product, onClose }) => {
  const {
    formatPrice,
    currency,
    createOffer,
  } = useMarketplace();
  const { modalStyle, dragHandleProps } = useDraggableModal();

  const [offeredPriceNGN, setOfferedPriceNGN] = useState((product.priceNGN * 0.9).toString());
  const [buyerName, setBuyerName] = useState('Chief Segun Adeleke');
  const [buyerCompany, setBuyerCompany] = useState('West Coast Industrial Joinery Ltd');
  const [inspectionContingency, setInspectionContingency] = useState(true);
  const [notes, setNotes] = useState('We are ready for immediate payment via MTM Escrow upon passing spindle run-test inspection.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const offeredAmount = parseFloat(offeredPriceNGN) || product.priceNGN * 0.9;

    createOffer({
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      sellerName: product.seller.name,
      buyerName,
      buyerCompany,
      originalPrice: product.priceNGN,
      offeredPrice: offeredAmount,
      currency: 'NGN',
      notes,
      requiresInspection: inspectionContingency,
    });

    setIsSubmitted(true);
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
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back Navigation Helper */}
        <BackNavigation 
          onBack={onClose} 
          label="Back to Machine" 
          showClose={true} 
          onClose={onClose} 
          dragHandleProps={dragHandleProps}
        />

        {/* Header */}
        <div 
          {...dragHandleProps}
          className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between select-none shrink-0"
        >
          <div className="flex items-center space-x-2.5 pointer-events-none">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#8B1520] border border-rose-200 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Make an Official Offer / RFQ</h3>
              <p className="text-[11px] text-slate-500">Direct multi-vendor price negotiation via MTM Escrow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="no-drag p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 border border-slate-200 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-6 text-center space-y-4 animate-fadeIn text-xs flex-1 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Offer Transmitted to {product.seller.name}</h4>
            <p className="text-slate-600 leading-relaxed">
              Your offer of <strong className="text-slate-900">{formatPrice(parseFloat(offeredPriceNGN))}</strong> has been registered in your MTM Portal.
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 text-left space-y-1">
              <span className="font-semibold text-slate-900 block">Next Steps:</span>
              <div>1. Seller has 24 hours to accept, counter, or decline.</div>
              <div>2. If accepted, payment is held safely in MTM Escrow until physical delivery.</div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold transition shadow-xs"
            >
              Done / Return to Marketplace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs flex-1 overflow-y-auto">
            {/* Product Summary */}
            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <img src={product.images[0]} alt={product.title} className="w-14 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-xs truncate">{product.title}</h4>
                <div className="flex justify-between items-baseline mt-0.5">
                  <span className="text-[11px] text-slate-500">Listed Price:</span>
                  <span className="font-extrabold text-[#1E40AF]">
                    {formatPrice(product.priceNGN, product.priceUSD)}
                  </span>
                </div>
              </div>
            </div>

            {/* Offer Input */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Your Offered Price (NGN ₦)</label>
              <input
                type="number"
                required
                value={offeredPriceNGN}
                onChange={e => setOfferedPriceNGN(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 font-extrabold text-sm focus:outline-none focus:border-[#1E40AF]"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Discount requested: {Math.round((1 - parseFloat(offeredPriceNGN) / product.priceNGN) * 100)}% off listed price
              </span>
            </div>

            {/* Company & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Buyer Business / Name</label>
                <input
                  type="text"
                  required
                  value={buyerCompany}
                  onChange={e => setBuyerCompany(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#1E40AF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Representative Name</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={e => setBuyerName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#1E40AF]"
                />
              </div>
            </div>

            {/* Contingencies */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inspectionContingency}
                  onChange={e => setInspectionContingency(e.target.checked)}
                  className="rounded bg-white border-slate-300 text-[#1E40AF] focus:ring-0"
                />
                <span className="font-medium">Contingent on passing MTM Certified Physical Inspection</span>
              </label>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Offer Terms / Notes to Seller</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#1E40AF] leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-sm transition flex items-center justify-center space-x-1.5 shadow-xs active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Submit Formal Offer via MTM Escrow</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
