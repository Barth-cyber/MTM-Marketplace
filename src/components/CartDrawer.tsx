import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  Building2, 
  AlertCircle,
  FileCheck,
  FileText,
  Download
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartItemQty,
    toggleCartInspection,
    toggleCartFreight,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    formatPrice,
    currency,
    showToast,
    setIsTermsModalOpen,
    hasAcceptedTerms,
    recordTransaction,
    openPurchaseOrderModal,
    setIsPurchaseOrderModalOpen,
  } = useMarketplace();

  const [paymentMethod, setPaymentMethod] = useState<'escrow_transfer' | 'corporate_po' | 'usd_wire'>('escrow_transfer');
  const [buyerOrg, setBuyerOrg] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isCartOpen) return null;

  const totalProductsNGN = cart.reduce((acc, item) => acc + item.product.priceNGN * item.quantity, 0);
  const totalProductsUSD = cart.reduce((acc, item) => acc + item.product.priceUSD * item.quantity, 0);

  const totalInspectionNGN = cart.reduce((acc, item) => acc + (item.includePhysicalInspection ? 45000 * item.quantity : 0), 0);
  const totalInspectionUSD = cart.reduce((acc, item) => acc + (item.includePhysicalInspection ? 30 * item.quantity : 0), 0);

  const totalFreightNGN = cart.reduce((acc, item) => acc + (item.includeFreightAssistance ? 120000 * item.quantity : 0), 0);
  const totalFreightUSD = cart.reduce((acc, item) => acc + (item.includeFreightAssistance ? 80 * item.quantity : 0), 0);

  const grandTotalNGN = totalProductsNGN + totalInspectionNGN + totalFreightNGN;
  const grandTotalUSD = totalProductsUSD + totalInspectionUSD + totalFreightUSD;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!hasAcceptedTerms) {
      showToast('⚠️ Please review & accept MTM Escrow Terms & Conditions before checkout.');
      setIsTermsModalOpen(true);
      return;
    }

    const generatedOrderId = `MTM-ESC-${Date.now().toString().slice(-6)}`;
    setOrderId(generatedOrderId);
    
    const itemsSummary = cart.map(i => `${i.product.title} (x${i.quantity})`).join(', ');
    recordTransaction(itemsSummary, grandTotalNGN, generatedOrderId);

    // Save newly created order to mtm_orders for real-time tracking
    const firstItem = cart[0];
    const newOrder = {
      id: generatedOrderId,
      orderNumber: generatedOrderId,
      machineTitle: firstItem ? (cart.length > 1 ? `${firstItem.product.title} (+${cart.length - 1} more)` : firstItem.product.title) : 'Industrial Equipment Order',
      image: firstItem?.product?.images?.[0] || '/images/scm_panel_saw_1790179186875.jpg',
      sellerName: firstItem?.product?.seller?.name || 'Verified Industrial Seller',
      sellerLocation: `${firstItem?.product?.location?.city || 'Lagos'}, ${firstItem?.product?.location?.state || 'Nigeria'}`,
      destinationAddress: deliveryAddress || 'Customer Facility Address, Nigeria',
      amountNGN: grandTotalNGN,
      orderDate: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      estimatedDelivery: 'In 2-3 Business Days',
      currentStepIndex: 1,
      status: 'In Escrow' as const,
      timeline: [
        {
          title: 'Escrow Payment Locked',
          description: `Total ₦${grandTotalNGN.toLocaleString()} held in MTM Escrow Protection Vault.`,
          timestamp: 'Just now',
          completed: true,
          current: true
        },
        {
          title: 'Technical Pre-Dispatch Inspection',
          description: 'MTM certified inspector assigned for on-site diagnostic appraisal.',
          timestamp: 'Pending',
          completed: false
        },
        {
          title: 'Heavy Freight Flatbed Rigging',
          description: 'Crane loading and transport dispatch to destination facility.',
          timestamp: 'Pending',
          completed: false
        },
        {
          title: '48-Hour Factory Floor Operational Trial',
          description: 'Buyer inspection and test run window before escrow release.',
          timestamp: 'Pending',
          completed: false
        },
        {
          title: 'Escrow Funds Settlement',
          description: 'Payment released to seller upon buyer confirmation.',
          timestamp: 'Pending',
          completed: false
        }
      ]
    };

    try {
      const existingOrdersStr = localStorage.getItem('mtm_orders');
      const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
      localStorage.setItem('mtm_orders', JSON.stringify([newOrder, ...existingOrders]));
    } catch {}

    setIsSuccess(true);
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden bg-slate-950/75 backdrop-blur-sm animate-fadeIn flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsCartOpen(false)} 
        aria-hidden="true"
      />

      {/* Centered / Framed Modal Window (flex flex-col h-full within viewport bounds) */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-full max-h-[95vh] sm:max-h-[88vh] z-10 animate-scaleUp">
        {/* Header - Always visible with Close button, sticky top-0, shrink-0 */}
        <div className="p-3 sm:p-4 md:p-5 border-b border-slate-200 bg-slate-50/95 backdrop-blur-xs flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-blue-100/80 text-[#1E40AF] border border-blue-200 shrink-0">
              <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">Escrow Order & Checkout</h3>
                <span className="text-[10px] bg-blue-100 text-blue-900 font-black px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                  {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate block">Guaranteed industrial machinery escrow & rigging</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-2">
            {cart.length > 0 && !isSuccess && (
              <button
                id="cart-unselect-all-btn"
                onClick={() => {
                  clearCart();
                  showToast('Emptied all items from cart.');
                }}
                className="text-[10px] sm:text-[11px] text-rose-700 hover:text-rose-900 font-bold px-2 sm:px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-300 transition cursor-pointer flex items-center gap-1 shadow-3xs"
                title="Unselect all items from cart"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden xs:inline">Unselect All</span>
              </button>
            )}
            <button
              id="close-cart-modal-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-200/80 hover:bg-rose-600 hover:text-white text-slate-700 transition cursor-pointer shadow-3xs min-w-[36px] min-h-[36px] flex items-center justify-center"
              title="Close Cart (Esc)"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Item List / Body with overflow-y-auto and min-h-0 flex-1 */}
        <div className="flex-1 overflow-y-auto min-h-0 p-3.5 sm:p-6 space-y-4 sm:space-y-5 text-xs scrollbar-thin">
            {isSuccess ? (
              <div className="py-8 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Escrow Order Initialized</h4>
                <div className="inline-block bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 font-mono text-[#1E40AF] font-bold text-sm">
                  Tracking Code: {orderId}
                </div>
                <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Your funds are secured in MTM Guaranteed Escrow. An MTM inspector is being dispatched for pre-delivery verification.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-slate-600">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>MTM Escrow Guarantee Protocol:</span>
                  </div>
                  <div>1. Seller prepares machine for certified physical run-test.</div>
                  <div>2. Inspector issues digital 42-point test report to your portal.</div>
                  <div>3. Flatbed freight dispatched to your facility.</div>
                  <div>4. Payout released to seller only after 48hr on-site signoff.</div>
                </div>

                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3 rounded-lg bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-sm transition shadow-xs"
                >
                  View Orders in Account Portal
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-20 text-center text-slate-500 space-y-3">
                <ShoppingCart className="w-12 h-12 mx-auto text-slate-300" />
                <h4 className="text-sm font-bold text-slate-900">Your Industrial Order Tray is Empty</h4>
                <p className="text-xs max-w-xs mx-auto">
                  Add machines, tools or materials to calculate escrow totals, physical inspection, and heavy transport rigging.
                </p>
              </div>
            ) : (
              <>
                {/* Item List */}
                <div className="space-y-4">
                  {cart.map(item => (
                    <div
                      key={item.product.id}
                      className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
                    >
                      <div className="flex space-x-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-16 h-14 rounded-lg object-cover bg-slate-200 border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-slate-900 text-xs line-clamp-2">{item.product.title}</h4>
                            <button
                              id={`remove-cart-item-${item.product.id}`}
                              onClick={() => {
                                removeFromCart(item.product.id);
                                showToast(`Removed "${item.product.title.slice(0, 28)}..." from cart.`);
                              }}
                              className="text-rose-700 hover:text-white hover:bg-rose-600 bg-rose-50 hover:border-rose-600 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 border border-rose-200 transition cursor-pointer shadow-3xs"
                              title="Remove this item from your cart"
                              aria-label={`Remove ${item.product.title} from cart`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove from Cart</span>
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                            <span className="text-[#1E40AF] font-black text-xs">
                              {formatPrice(item.product.priceNGN, item.product.priceUSD)}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">Qty:</span>
                              {/* Quantity Stepper */}
                              <div className="flex items-center space-x-1.5 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                                <button
                                  onClick={() => {
                                    if (item.quantity <= 1) {
                                      removeFromCart(item.product.id);
                                      showToast(`Removed "${item.product.title.slice(0, 28)}..." from cart.`);
                                    } else {
                                      updateCartItemQty(item.product.id, item.quantity - 1);
                                    }
                                  }}
                                  className="w-4 h-4 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 font-black text-xs cursor-pointer"
                                  title={item.quantity <= 1 ? "Remove item from cart" : "Decrease quantity"}
                                >
                                  -
                                </button>
                                <span className="text-[11px] font-bold text-slate-800 min-w-[16px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartItemQty(item.product.id, item.quantity + 1)}
                                  className="w-4 h-4 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 font-black text-xs cursor-pointer"
                                  title="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Add-ons per item */}
                      <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px]">
                        <label className="flex items-center justify-between text-slate-700 hover:text-slate-900 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={item.includePhysicalInspection}
                              onChange={() => toggleCartInspection(item.product.id)}
                              className="rounded bg-white border-slate-300 text-[#1E40AF] focus:ring-0 cursor-pointer"
                            />
                            <span>Physical On-Site MTM Inspection</span>
                          </div>
                          <span className="text-emerald-700 font-bold">+₦45,000 ($30)</span>
                        </label>

                        <label className="flex items-center justify-between text-slate-700 hover:text-slate-900 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={item.includeFreightAssistance}
                              onChange={() => toggleCartFreight(item.product.id)}
                              className="rounded bg-white border-slate-300 text-[#1E40AF] focus:ring-0 cursor-pointer"
                            />
                            <span>Flatbed Transport & Crane Hoist</span>
                          </div>
                          <span className="text-[#1E40AF] font-bold">+₦120,000 ($80)</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Buyer & Delivery Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs">Delivery & Procurement Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1 font-semibold">Company / Buyer Name</label>
                      <input
                        type="text"
                        value={buyerOrg}
                        onChange={e => setBuyerOrg(e.target.value)}
                        placeholder="e.g. Apex Industrial Manufacturing Ltd"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E40AF]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1 font-semibold">Corporate Email</label>
                      <input
                        type="email"
                        value={buyerEmail}
                        onChange={e => setBuyerEmail(e.target.value)}
                        placeholder="e.g. procurement@company.ng"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E40AF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1 font-semibold">Factory Floor Delivery Address</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Plot 14, Trans-Amadi Industrial Layout, Port Harcourt, Rivers State"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E40AF]"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">Payment & Escrow Route</span>
                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                    {[
                      { id: 'escrow_transfer', label: 'NIBSS Escrow Transfer', sub: 'Instant Verified' },
                      { id: 'corporate_po', label: 'Corporate PO', sub: 'Invoice 30-Day' },
                      { id: 'usd_wire', label: 'USD LC / Wire', sub: 'Cross-Border' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMethod(opt.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          paymentMethod === opt.id
                            ? 'bg-blue-50 border-[#1E40AF] text-[#1E40AF] font-bold ring-1 ring-blue-400/30'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] font-bold">{opt.label}</div>
                        <div className="text-[9px] text-slate-500">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sticky Footer with Checkout Totals */}
          {!isSuccess && cart.length > 0 && (
            <div className="p-3.5 sm:p-5 border-t border-slate-200 bg-slate-50/95 backdrop-blur-xs space-y-3 shrink-0 sticky bottom-0 z-20 shadow-2xs">
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Equipment Base Cost:</span>
                  <span className="text-slate-900 font-semibold">{formatPrice(totalProductsNGN, totalProductsUSD)}</span>
                </div>
                {totalInspectionNGN > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>On-Site Physical Inspections:</span>
                    <span>+{formatPrice(totalInspectionNGN, totalInspectionUSD)}</span>
                  </div>
                )}
                {totalFreightNGN > 0 && (
                  <div className="flex justify-between text-[#1E40AF] font-medium">
                    <span>Flatbed Rigging & Freight:</span>
                    <span>+{formatPrice(totalFreightNGN, totalFreightUSD)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Total Escrow Amount:</span>
                  <span className="text-[#1E40AF] text-base">{formatPrice(grandTotalNGN, grandTotalUSD)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  id="cart-export-po-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    openPurchaseOrderModal();
                  }}
                  className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center space-x-1.5 border border-slate-300 shadow-2xs cursor-pointer"
                  title="Generate Formal Corporate Purchase Order PDF for Internal Approval"
                >
                  <FileText className="w-4 h-4 text-[#1E40AF] shrink-0" />
                  <span className="truncate">Generate Formal PO (PDF)</span>
                </button>

                <button
                  id="cart-submit-order-btn"
                  onClick={handleCheckout}
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-md active:scale-98 cursor-pointer border border-[#7A101A]/40"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span className="truncate">Lock in Escrow</span>
                </button>
              </div>

              <div className="flex flex-col items-center justify-center space-y-0.5 text-[10px] text-slate-500">
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-center">Funds 100% Protected by MTM Industrial Escrow Protocol</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-[#1E40AF] font-bold hover:underline cursor-pointer"
                >
                  View & Review MTM Escrow Terms
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
