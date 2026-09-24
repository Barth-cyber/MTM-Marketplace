import React, { useState } from 'react';
import { 
  Repeat, 
  X, 
  Search, 
  Plus, 
  Minus, 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Zap, 
  Tag, 
  Building2, 
  Calendar,
  AlertCircle,
  ArrowRight,
  Filter,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { QUICK_REORDER_CATALOG, ReorderItem } from '../data/reorderItems';
import { Product } from '../types';
import { useDraggableModal } from '../hooks/useDraggableModal';

export const QuickReorderModal: React.FC = () => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const { 
    isQuickReorderOpen, 
    setIsQuickReorderOpen, 
    addToCart, 
    formatPrice, 
    showToast,
    setIsCartOpen,
    t
  } = useMarketplace();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({
    'reord-1': 3, // Jowat Glue 25kg
    'reord-2': 2, // Freud Blade
    'reord-3': 5, // Woodgrain Tape
    'reord-4': 1, // Mobil Oil
    'reord-5': 2,
    'reord-6': 2,
    'reord-7': 1,
    'reord-8': 1
  });

  const [scheduledFrequencies, setScheduledFrequencies] = useState<Record<string, string>>({
    'reord-1': 'Every 30 Days'
  });

  const [orderedItems, setOrderedItems] = useState<Record<string, boolean>>({});

  const categories = [
    'All',
    'Adhesives & Chemicals',
    'Cutting Blades',
    'Edge Banding',
    'Lubricants',
    'CNC Tooling',
    'Welding & Spare Parts'
  ];

  const filteredItems = QUICK_REORDER_CATALOG.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.compatibleMachinery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleQtyChange = (id: string, delta: number) => {
    setItemQuantities(prev => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const createProductFromReorderItem = (item: ReorderItem, qty: number, isBulk: boolean): Product => {
    const effectivePriceNGN = isBulk 
      ? item.unitPriceNGN * (1 - item.bulkDiscountPct / 100) 
      : item.unitPriceNGN;
    const effectivePriceUSD = isBulk
      ? item.unitPriceUSD * (1 - item.bulkDiscountPct / 100)
      : item.unitPriceUSD;

    const isBenin = item.hubLocation.toLowerCase().includes('benin');

    return {
      id: item.id,
      title: `${item.name} (${qty}x ${item.packSize})`,
      slug: `reorder-${item.id}`,
      category: item.category === 'Cutting Blades' || item.category === 'CNC Tooling' ? 'Workshop Tools' : 'Materials',
      subcategory: item.category,
      brand: item.brand,
      model: item.sku,
      priceNGN: effectivePriceNGN * qty,
      priceUSD: effectivePriceUSD * qty,
      condition: 'Brand New',
      location: {
        city: isBenin ? 'Benin City' : 'Lagos',
        state: isBenin ? 'Edo State' : 'Lagos State',
        industrialArea: isBenin ? 'Edo Production Centre' : 'Ikeja Industrial Estate'
      },
      seller: {
        id: 'usr-consumables',
        name: item.vendorName,
        businessType: 'Dealer / Importer',
        isVerified: true,
        rating: item.rating,
        reviewCount: 48,
        joinedYear: 2023,
        location: item.hubLocation,
        responseTime: '10 mins',
        verifiedBadges: ['Verified Consumable Supplier', 'Fast Dispatch']
      },
      images: [item.image],
      hasVideoTest: false,
      hasInspectionCertificate: true,
      powerSpecs: {
        voltage: 'N/A Consumable',
        phase: 'Manual / Air'
      },
      technicalSpecs: {
        'SKU Code': item.sku,
        'Brand / Manufacturer': item.brand,
        'Packaging Spec': item.packSize,
        'Compatible Machines': item.compatibleMachinery,
        'Bulk Pricing Applied': isBulk ? `${item.bulkDiscountPct}% Discount` : 'Standard Price'
      },
      description: `${item.name} manufactured by ${item.brand}. Compatible with ${item.compatibleMachinery}. Stock level: ${item.stockLevel}. Fast hub dispatch within ${item.estimatedDispatchHours} hours from ${item.hubLocation}.`,
      tags: ['Consumables', 'Quick Reorder', item.category, item.brand],
      stockQuantity: 100,
      unit: item.packSize,
      deliveryOptions: {
        escrowProtected: true,
        inspectionBeforePayment: false,
        freightAssisted: true,
        estimatedDays: '1-2 Days',
        originHub: item.hubLocation
      }
    };
  };

  const handleAddToCart = (item: ReorderItem) => {
    const qty = itemQuantities[item.id] || 1;
    const isBulk = qty >= item.bulkDiscountThreshold;
    const product = createProductFromReorderItem(item, qty, isBulk);

    addToCart(product);

    setOrderedItems(prev => ({ ...prev, [item.id]: true }));
    showToast(`✓ Added ${qty}x ${item.name.slice(0, 30)}... to Escrow Cart!`);
    
    setTimeout(() => {
      setOrderedItems(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const handleInstantReorderAllPast = () => {
    const pastItems = QUICK_REORDER_CATALOG.filter(i => i.lastOrderedDate);
    pastItems.forEach(item => {
      const qty = itemQuantities[item.id] || item.lastOrderedQty || 1;
      const isBulk = qty >= item.bulkDiscountThreshold;
      const product = createProductFromReorderItem(item, qty, isBulk);
      addToCart(product);
    });

    showToast(`✓ Added ${pastItems.length} past consumable items to Escrow Cart!`);
    setIsQuickReorderOpen(false);
    setIsCartOpen(true);
  };

  if (!isQuickReorderOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 overflow-y-auto animate-fadeIn">
      <div 
        style={modalStyle}
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] my-auto"
      >
        
        {/* Header */}
        <div 
          {...dragHandleProps}
          className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Repeat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  {t('reorder.title')}
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/40 uppercase">
                  1-Click Repeat
                </span>
              </div>
              <p className="text-xs text-slate-400">{t('reorder.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstantReorderAllPast}
              className="no-drag hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Reorder All Past Items (3)</span>
            </button>

            <button
              onClick={() => setIsQuickReorderOpen(false)}
              className="no-drag p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
              title="Close dialog"
              aria-label="Close Quick Reorder"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 p-3 sm:p-4 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search consumables (e.g. Jowat Glue, Freud Blade, Edge tape, Mobil oil)..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#1E40AF]"
              />
            </div>

            {/* Hub Fast Dispatch Badge */}
            <div className="flex items-center gap-2 text-xs bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-blue-900 font-semibold shrink-0">
              <Truck className="w-4 h-4 text-[#1E40AF]" />
              <span>Direct Hub Dispatches &lt; 24h</span>
            </div>

          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition cursor-pointer text-xs ${
                  selectedCategory === cat
                    ? 'bg-[#1E40AF] text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Item Cards List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-slate-100/60">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800">No consumable items matched your search</h4>
              <p className="text-xs text-slate-500">Try clearing filters or search terms.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="px-4 py-2 bg-[#1E40AF] text-white font-bold text-xs rounded-xl"
              >
                Reset Catalog
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const qty = itemQuantities[item.id] || 1;
              const isBulk = qty >= item.bulkDiscountThreshold;
              const unitPrice = isBulk 
                ? item.unitPriceNGN * (1 - item.bulkDiscountPct / 100) 
                : item.unitPriceNGN;
              const totalPrice = unitPrice * qty;
              const isJustAdded = orderedItems[item.id];

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-4 border transition-all duration-200 hover:shadow-md ${
                    item.lastOrderedDate ? 'border-amber-300 ring-1 ring-amber-400/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Item Image & Info */}
                    <div className="flex items-start gap-3.5 flex-1">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0" 
                        />
                        {item.lastOrderedDate && (
                          <span className="absolute -top-2 -left-2 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase">
                            Recent
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                            {item.sku}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                            {item.brand}
                          </span>
                          {isBulk && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {item.bulkDiscountPct}% Bulk Savings
                            </span>
                          )}
                        </div>

                        <h4 className="font-black text-slate-900 text-sm leading-snug">
                          {item.name}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          Compatible: <strong className="text-slate-700">{item.compatibleMachinery}</strong>
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-0.5">
                          <span className="flex items-center gap-1 text-[#1E40AF] font-bold">
                            <Building2 className="w-3 h-3" />
                            {item.vendorName}
                          </span>
                          <span>•</span>
                          <span className="text-slate-500">Pack: {item.packSize}</span>
                          {item.lastOrderedDate && (
                            <>
                              <span>•</span>
                              <span className="text-amber-700 font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Ordered on {item.lastOrderedDate} ({item.lastOrderedQty} bags)
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pricing, Quantity & 1-Click Action */}
                    <div className="flex flex-wrap sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      
                      {/* Price Display */}
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 block line-through">
                          {isBulk ? formatPrice(item.unitPriceNGN * qty) : null}
                        </span>
                        <span className="font-black text-base sm:text-lg text-slate-900 block">
                          {formatPrice(totalPrice)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {formatPrice(unitPrice)} / {item.packSize.split(' ')[0]}
                        </span>
                      </div>

                      {/* Controls Group */}
                      <div className="flex items-center gap-2">
                        
                        {/* Stepper */}
                        <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                          <button
                            onClick={() => handleQtyChange(item.id, -1)}
                            className="p-2 hover:bg-slate-100 text-slate-600 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-black text-slate-900 min-w-[28px] text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item.id, 1)}
                            className="p-2 hover:bg-slate-100 text-slate-600 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 1-Click Add / Reorder Button */}
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={isJustAdded}
                          className={`px-4 py-2 text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#1E40AF] hover:bg-[#1D4ED8] text-white'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{t('reorder.addToCart')}</span>
                            </>
                          )}
                        </button>

                      </div>

                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>All repeat orders protected by <strong>100% Escrow Delivery Guarantee</strong>.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsQuickReorderOpen(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              Back to Marketplace
            </button>
            <button
              onClick={() => {
                setIsQuickReorderOpen(false);
                setIsCartOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              <span>View Escrow Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
