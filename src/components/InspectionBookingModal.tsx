import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  FileCheck, 
  Truck, 
  UserCheck 
} from 'lucide-react';
import { Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { BackNavigation } from './BackNavigation';
import { useDraggableModal } from '../hooks/useDraggableModal';

interface InspectionBookingModalProps {
  product: Product;
  onClose: () => void;
}

export const InspectionBookingModal: React.FC<InspectionBookingModalProps> = ({ product, onClose }) => {
  const { bookInspection, showToast } = useMarketplace();
  const { modalStyle, dragHandleProps } = useDraggableModal();

  const [date, setDate] = useState('Tomorrow (10:00 AM – 1:00 PM)');
  const [inspectorTier, setInspectorTier] = useState('Senior Electro-Mechanical Engineer (Full 42-Point Audit)');
  const [contactPhone, setContactPhone] = useState('+234 803 555 0192');
  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookInspection(
      product.id,
      product.title,
      `${product.location.city}, ${product.location.state}`,
      date,
      inspectorTier
    );
    setIsBooked(true);
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
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Book On-Site Technical Inspection</h3>
              <p className="text-[11px] text-slate-500">Independent physical testing before payment release</p>
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
        {isBooked ? (
          <div className="p-6 text-center space-y-4 animate-fadeIn text-xs flex-1 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Inspection Scheduled!</h4>
            <p className="text-slate-600 leading-relaxed">
              Our certified engineer in <strong>{product.location.city}, {product.location.state}</strong> has been assigned. You will receive real-time SMS updates and an interactive 4K video run-test report.
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 text-left space-y-1">
              <span className="font-semibold text-slate-900 block">Inspection Includes:</span>
              <div>✓ Dial-gauge spindle runout & slideway flatness measurements</div>
              <div>✓ 3-Phase motor windings Megger insulation test</div>
              <div>✓ High-pressure hydraulic load run-test</div>
              <div>✓ Signed MTM Certificate PDF</div>
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
            {/* Machine Summary */}
            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <img src={product.images[0]} alt={product.title} className="w-14 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-xs truncate">{product.title}</h4>
                <div className="flex items-center space-x-1 text-slate-500 text-[11px] mt-0.5">
                  <MapPin className="w-3 h-3 text-[#1E40AF]" />
                  <span>Workshop Location: {product.location.city}, {product.location.state}</span>
                </div>
              </div>
            </div>

            {/* Schedule Date Selection */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Preferred Inspection Slot</label>
              <select
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#1E40AF] cursor-pointer"
              >
                <option value="Tomorrow (10:00 AM – 1:00 PM)">Tomorrow (10:00 AM – 1:00 PM) [Fast-Track]</option>
                <option value="Tomorrow (2:00 PM – 5:00 PM)">Tomorrow (2:00 PM – 5:00 PM)</option>
                <option value="In 2 Days (Morning Slot)">In 2 Days (Morning Slot)</option>
                <option value="In 3 Days (Weekend Schedule)">In 3 Days (Weekend Schedule)</option>
              </select>
            </div>

            {/* Inspection Tier */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Inspection Protocol</label>
              <select
                value={inspectorTier}
                onChange={e => setInspectorTier(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#1E40AF] cursor-pointer"
              >
                <option value="Senior Electro-Mechanical Engineer (Full 42-Point Audit)">
                  Comprehensive 42-Point Diagnostic (₦45,000 / $30)
                </option>
                <option value="Advanced Laser Alignment & Hydraulic Pressure Testing">
                  Advanced Laser Alignment & Hydraulic Overhaul Audit (₦75,000 / $50)
                </option>
              </select>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Buyer Representative Phone (for Live Video Stream)</label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#1E40AF]"
              />
            </div>

            {/* Trust points */}
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-[11px] text-emerald-800 space-y-1">
              <div className="flex items-center space-x-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>MTM Escrow Guarantee Included</span>
              </div>
              <p className="text-slate-600 text-[10px]">
                If the machine fails mechanical or electrical tolerance checks, your purchase deposit is refunded 100% immediately.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-sm transition flex items-center justify-center space-x-1.5 shadow-xs active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Dispatch Inspector</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
