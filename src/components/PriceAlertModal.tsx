import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Zap, 
  ArrowDownRight, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  DollarSign,
  TrendingDown,
  Info,
  Radio
} from 'lucide-react';
import { Product, PriceAlert } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { getCategoryTheme } from '../utils/categoryThemes';
import { BackNavigation } from './BackNavigation';
import { useDraggableModal } from '../hooks/useDraggableModal';

interface PriceAlertModalProps {
  product: Product;
  onClose: () => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ product, onClose }) => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const {
    currency,
    formatPrice,
    addPriceAlert,
    removePriceAlert,
    getPriceAlertForProduct,
    triggerSimulatedPriceDrop,
    showToast,
    setIsNotificationsOpen,
  } = useMarketplace();

  const existingAlert = getPriceAlertForProduct(product.id);
  const theme = getCategoryTheme(product.category || product.subcategory);

  const currentPrice = currency === 'USD' ? product.priceUSD : product.priceNGN;
  
  // Default target price is 15% lower
  const defaultTarget = Math.round(currentPrice * 0.85);

  const [targetPriceInput, setTargetPriceInput] = useState<number>(
    existingAlert ? (currency === 'USD' ? (existingAlert.targetPriceUSD || Math.round(existingAlert.targetPriceNGN / 1500)) : existingAlert.targetPriceNGN) : defaultTarget
  );
  const [selectedChannel, setSelectedChannel] = useState<'in_app' | 'email' | 'whatsapp' | 'all'>(
    existingAlert?.notificationChannel || 'all'
  );
  const [contactValue, setContactValue] = useState<string>(
    existingAlert?.contactValue || 'barthsheyin@gmail.com'
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState<string | null>(null);

  // Sync with currency change
  useEffect(() => {
    if (!existingAlert) {
      setTargetPriceInput(Math.round(currentPrice * 0.85));
    }
  }, [currency, currentPrice]);

  const discountPercent = Math.max(
    1,
    Math.round(((currentPrice - targetPriceInput) / currentPrice) * 100)
  );
  const potentialSavings = Math.max(0, currentPrice - targetPriceInput);

  const handleQuickPercent = (percent: number) => {
    const newTarget = Math.round(currentPrice * (1 - percent / 100));
    setTargetPriceInput(newTarget);
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPriceInput >= currentPrice) {
      showToast('Target price must be lower than current asking price');
      return;
    }
    if (targetPriceInput <= 0) {
      showToast('Please enter a valid target price');
      return;
    }

    const targetPriceNGN = currency === 'USD' ? targetPriceInput * 1500 : targetPriceInput;
    const targetPriceUSD = currency === 'USD' ? targetPriceInput : Math.round(targetPriceInput / 1500);

    addPriceAlert({
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      productCategory: product.category,
      initialPriceNGN: product.priceNGN,
      initialPriceUSD: product.priceUSD,
      targetPriceNGN,
      targetPriceUSD,
      targetPrice: targetPriceNGN,
      currency,
      notificationChannel: selectedChannel,
      contactValue,
    });

    onClose();
  };

  const handleSimulateDropNow = () => {
    setIsSimulating(true);
    setSimulationSuccess(null);

    const targetPriceNGN = currency === 'USD' ? targetPriceInput * 1500 : targetPriceInput;

    // Ensure alert exists first
    addPriceAlert({
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      productCategory: product.category,
      initialPriceNGN: product.priceNGN,
      initialPriceUSD: product.priceUSD,
      targetPriceNGN,
      targetPriceUSD: currency === 'USD' ? targetPriceInput : Math.round(targetPriceInput / 1500),
      targetPrice: targetPriceNGN,
      currency,
      notificationChannel: selectedChannel,
      contactValue,
    });

    setTimeout(() => {
      triggerSimulatedPriceDrop(product.id, targetPriceNGN);
      setIsSimulating(false);
      setSimulationSuccess(`Price drop simulated! New price: ${formatPrice(targetPriceNGN)} (-${discountPercent}%). Push notification sent.`);
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        style={modalStyle}
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative my-auto"
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
          className={`px-6 py-4 border-b border-slate-200 ${theme.lightBg} flex items-center justify-between shrink-0 select-none`}
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Price Radar
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Instant Drop Alerts
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                Set Industrial Price Alert
              </h2>
            </div>
          </div>

          <button
            id="close-price-alert-modal-btn"
            onClick={onClose}
            className="no-drag p-2 rounded-xl bg-white hover:bg-rose-600 hover:text-white text-slate-700 border border-slate-300 hover:border-rose-600 transition-colors shadow-xs cursor-pointer"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 font-bold" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Product Mini Dossier */}
          <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black text-slate-500 uppercase">{product.brand}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-semibold text-slate-500">{product.condition}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                {product.title}
              </h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-500">Current Asking Price:</span>
                <span className="text-sm font-black text-slate-900">
                  {formatPrice(product.priceNGN, product.priceUSD)}
                </span>
              </div>
            </div>
          </div>

          {/* Active Status Badge if Alert already exists */}
          {existingAlert && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                <div>
                  <div className="text-xs font-bold text-blue-900">
                    Active Radar Target: {formatPrice(existingAlert.targetPriceNGN, existingAlert.targetPriceUSD)}
                  </div>
                  <div className="text-[11px] text-blue-700">
                    Set {existingAlert.createdAt} • Channel: {existingAlert.notificationChannel.toUpperCase()}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  removePriceAlert(existingAlert.id);
                  onClose();
                }}
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center space-x-1 p-1 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel Alert</span>
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSaveAlert} className="space-y-4">
            
            {/* Quick Discount Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Discount Shortcuts:
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 15, 20, 25].map(pct => {
                  const calculated = Math.round(currentPrice * (1 - pct / 100));
                  const isSelected = targetPriceInput === calculated;
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleQuickPercent(pct)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition border text-center ${
                        isSelected
                          ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      -{pct}%
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Price Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="target-price-input" className="text-xs font-bold text-slate-800">
                  Your Target Alert Price ({currency}):
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Current: {formatPrice(product.priceNGN, product.priceUSD)}
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  {currency === 'NGN' ? '₦' : '$'}
                </div>
                <input
                  id="target-price-input"
                  type="number"
                  min={1}
                  max={currentPrice - 1}
                  value={targetPriceInput || ''}
                  onChange={e => setTargetPriceInput(Number(e.target.value))}
                  placeholder={`e.g. ${defaultTarget}`}
                  className="w-full pl-9 pr-24 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#1E40AF] focus:outline-none text-base font-black text-slate-900 bg-white"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    -{discountPercent}% OFF
                  </span>
                </div>
              </div>

              {/* Savings Breakdown */}
              <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center space-x-1.5 font-bold">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>Target Savings:</span>
                </div>
                <span className="font-black text-emerald-800">
                  Save {formatPrice(currency === 'USD' ? potentialSavings * 1500 : potentialSavings, potentialSavings)} ({discountPercent}%)
                </span>
              </div>
            </div>

            {/* Notification Delivery Channels */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Notification Delivery Channels:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label className={`p-2.5 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition ${
                  selectedChannel === 'in_app' || selectedChannel === 'all'
                    ? 'border-blue-500 bg-blue-50/60 text-blue-950 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="alert-channel"
                    checked={selectedChannel === 'in_app' || selectedChannel === 'all'}
                    onChange={() => setSelectedChannel('all')}
                    className="text-[#1E40AF]"
                  />
                  <div className="flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#1E40AF]" />
                    <span>In-App & Email</span>
                  </div>
                </label>

                <label className={`p-2.5 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition ${
                  selectedChannel === 'email'
                    ? 'border-blue-500 bg-blue-50/60 text-blue-950 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="alert-channel"
                    checked={selectedChannel === 'email'}
                    onChange={() => setSelectedChannel('email')}
                    className="text-[#1E40AF]"
                  />
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email Only</span>
                  </div>
                </label>

                <label className={`p-2.5 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition ${
                  selectedChannel === 'whatsapp'
                    ? 'border-blue-500 bg-blue-50/60 text-blue-950 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="alert-channel"
                    checked={selectedChannel === 'whatsapp'}
                    onChange={() => setSelectedChannel('whatsapp')}
                    className="text-[#1E40AF]"
                  />
                  <div className="flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp / SMS</span>
                  </div>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={contactValue}
                  onChange={e => setContactValue(e.target.value)}
                  placeholder="Enter email or WhatsApp phone (+234...)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#1E40AF] focus:outline-none text-slate-900 bg-white"
                />
              </div>
            </div>

            {/* Simulation Feedback Banner */}
            {simulationSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 space-y-1.5 animate-fadeIn">
                <div className="flex items-center space-x-1.5 font-black text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Simulation Complete!</span>
                </div>
                <p className="text-[11px] leading-relaxed">{simulationSuccess}</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsNotificationsOpen(true);
                  }}
                  className="text-[11px] font-bold text-[#1E40AF] underline mt-1 block"
                >
                  View in Notification Drawer →
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                id="submit-price-alert-btn"
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-black text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-sm"
              >
                <Bell className="w-4 h-4" />
                <span>{existingAlert ? 'Update Price Alert Radar' : 'Activate Price Alert Radar'}</span>
              </button>

              {/* Instant Simulation Trigger Button */}
              <button
                id="simulate-price-drop-btn"
                type="button"
                onClick={handleSimulateDropNow}
                disabled={isSimulating}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <Zap className={`w-3.5 h-3.5 text-amber-600 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>
                  {isSimulating ? 'Simulating Seller Price Reduction...' : '⚡ Test Simulated Price Drop Notification Now'}
                </span>
              </button>
            </div>

          </form>

          {/* Footer Informational Note */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-start space-x-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              MTM monitors factory liquidation batches, clearance auctions, and direct seller price markdowns daily. When this machine reaches your target price, you'll be instantly alerted.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
