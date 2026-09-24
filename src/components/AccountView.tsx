import React, { useState } from 'react';
import { 
  ShoppingCart, 
  ArrowRightLeft, 
  FileCheck, 
  PlusCircle, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Package,
  Bell,
  TrendingDown,
  Zap,
  Trash2,
  ExternalLink,
  ArrowLeft,
  Truck,
  AlertTriangle,
  Scale,
  Award,
  FileText,
  Download,
  Activity
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { MtmProRewardsComponent } from './MtmProRewardsComponent';
import { generatePurchaseOrderPdf } from '../utils/pdfReportGenerator';

export const AccountView: React.FC = () => {
  const {
    offers,
    inspections,
    userListings,
    priceAlerts,
    removePriceAlert,
    triggerSimulatedPriceDrop,
    setActiveProduct,
    products,
    cart,
    formatPrice,
    setIsSellModalOpen,
    setActiveView,
    openOrderTracking,
    setIsInventoryAlertOpen,
    openDisputeCenter,
    setIsTermsModalOpen,
    hasAcceptedTerms,
    acceptedTermsTimestamp,
    purchaseOrders,
    openPurchaseOrderModal,
    deletePurchaseOrder,
    openIoTSensorModal,
    showToast,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'orders' | 'purchase_orders' | 'offers' | 'inspections' | 'alerts' | 'listings' | 'rewards'>('rewards');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-rose-50 text-[#8B1520] border border-rose-200 flex items-center justify-center font-black text-xl shadow-2xs">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900">Apex Industrial Fabrication Nig Ltd</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Industrial Buyer & Seller
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Corporate Account • RC 1498224 • Ikeja Industrial Zone, Lagos
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsTermsModalOpen(true)}
            className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer border ${
              hasAcceptedTerms
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
            }`}
            title="Review MTM Escrow & Transaction Guarantee Agreement"
          >
            <ShieldCheck className={`w-4 h-4 ${hasAcceptedTerms ? 'text-emerald-600' : 'text-amber-600'}`} />
            <span>{hasAcceptedTerms ? 'Escrow Terms Accepted' : 'Accept Escrow Terms'}</span>
          </button>

          <button
            onClick={() => openOrderTracking()}
            className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#8B1520] font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer border border-rose-200"
          >
            <Truck className="w-4 h-4 text-[#8B1520]" />
            <span>Order Tracking</span>
          </button>

          <button
            id="account-open-iot-monitor-btn"
            onClick={() => openIoTSensorModal()}
            className="px-3 py-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer border border-cyan-200"
            title="Real-time Vibration and Temperature IoT Telemetry Analytics"
          >
            <Activity className="w-4 h-4 text-cyan-700 animate-pulse" />
            <span>IoT Sensor Monitor</span>
          </button>

          <button
            onClick={() => setIsInventoryAlertOpen(true)}
            className="px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer border border-amber-200"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Inventory Alerts</span>
          </button>

          <button
            onClick={() => openDisputeCenter()}
            className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer border border-rose-200"
          >
            <Scale className="w-4 h-4 text-rose-600" />
            <span>Dispute Desk</span>
          </button>

          <button
            onClick={() => openPurchaseOrderModal()}
            className="px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer border border-indigo-200"
            title="Generate Formal Corporate Purchase Order PDF"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Generate PO (PDF)</span>
          </button>

          <button
            onClick={() => setIsSellModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition shadow-sm border border-[#7A101A]/30 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Equipment Listing</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'rewards' ? 'border-amber-500 text-amber-700 font-black' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>MTM Pro Rewards & Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab('purchase_orders')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'purchase_orders' ? 'border-[#8B1520] text-[#8B1520] font-black' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-[#8B1520]" />
          <span>Purchase Orders ({purchaseOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'orders' ? 'border-[#8B1520] text-[#8B1520]' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Active Escrow Orders ({cart.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'offers' ? 'border-[#8B1520] text-[#8B1520]' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Negotiated Offers / RFQs ({offers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inspections')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'inspections' ? 'border-[#8B1520] text-[#8B1520]' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Inspection Bookings ({inspections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'alerts' ? 'border-amber-500 text-amber-700 font-black' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-500" />
          <span>Price Drop Alerts ({priceAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'listings' ? 'border-[#8B1520] text-[#8B1520]' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Seller Listings ({userListings.length})</span>
        </button>
      </div>

      {/* TAB 0: REWARDS */}
      {activeTab === 'rewards' && (
        <MtmProRewardsComponent />
      )}

      {/* TAB 0.5: PURCHASE ORDERS */}
      {activeTab === 'purchase_orders' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Corporate Purchase Orders & Pro-Forma Ledger</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage, verify, and export official PDF Purchase Orders for corporate approval routing & escrow locking.
              </p>
            </div>
            <button
              onClick={() => openPurchaseOrderModal()}
              className="px-4 py-2 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition shadow-sm border border-[#7A101A]/30 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>+ Generate New PO</span>
            </button>
          </div>

          {purchaseOrders.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3 bg-white rounded-xl border border-slate-200 p-6">
              <FileText className="w-12 h-12 mx-auto text-slate-300" />
              <h4 className="text-sm font-bold text-slate-800">No Corporate Purchase Orders Saved Yet</h4>
              <p className="text-xs max-w-sm mx-auto text-slate-500">
                Generate formal, itemized Purchase Orders with pre-dispatch inspection protocols, heavy flatbed haulage, and executive sign-off blocks.
              </p>
              <button
                onClick={() => openPurchaseOrderModal()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs transition inline-flex items-center space-x-2 shadow-sm border border-[#7A101A]/30 cursor-pointer"
              >
                <span>Open PO Generator</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {purchaseOrders.map((po) => (
                <div
                  key={po.id || po.poNumber}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-rose-300 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-xs text-[#8B1520] bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                        {po.poNumber}
                      </span>
                      <span className="font-bold text-slate-900">{po.buyerCompany}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {po.approvalStatus || 'Submitted for Review'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Date Issued: {po.createdAt}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-600 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Officer:</span>
                      <span className="font-medium text-slate-800">{po.buyerContactName} ({po.buyerTitle})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Destination:</span>
                      <span className="font-medium text-slate-800">{po.deliveryHub} • {po.deliveryAddress?.slice(0, 30)}...</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment / Escrow Route:</span>
                      <span className="font-medium text-slate-800">{po.paymentTerms}</span>
                    </div>
                  </div>

                  {/* Items list preview */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Included Equipment Items ({po.items.length}):
                    </span>
                    {po.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-800 truncate mr-2">
                          • {item.quantity}x {item.title} ({item.brand})
                        </span>
                        <span className="text-slate-600 font-mono shrink-0">
                          ₦{item.totalLineNGN?.toLocaleString() || (item.unitPriceNGN * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 font-bold">Total Requisition:</span>
                      <span className="text-base font-black text-[#8B1520]">
                        ₦{po.grandTotalNGN.toLocaleString()}
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold">
                        (~${po.grandTotalUSD.toLocaleString()} USD)
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          generatePurchaseOrderPdf(po);
                          showToast(`✓ Re-downloaded PDF for Purchase Order ${po.poNumber}`);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm border border-[#7A101A]/30 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF Document</span>
                      </button>
                      <button
                        onClick={() => deletePurchaseOrder(po.id || po.poNumber)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                        title="Archive Purchase Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4 text-xs">
          {cart.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2 bg-white rounded-xl border border-slate-200">
              <ShoppingCart className="w-10 h-10 mx-auto text-slate-300" />
              <p>No active escrow orders. Browse machines and tools to order with escrow safety.</p>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-[#8B1520]">ESC-9823-LAG</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">Today, 2:15 PM</span>
                    </div>
                    <span className="text-[11px] text-slate-500">Delivery Hub: {item.product.location.city}, {item.product.location.state}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Funds Locked in MTM Escrow</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <img src={item.product.images[0]} alt={item.product.title} className="w-20 h-16 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{item.product.title}</h3>
                    <div className="text-slate-500 text-xs mt-0.5">
                      Seller: {item.product.seller.name} • Quantity: {item.quantity}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px]">
                      {item.includePhysicalInspection && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                          ✓ Physical Inspection Included
                        </span>
                      )}
                      {item.includeFreightAssistance && (
                        <span className="bg-rose-50 text-[#8B1520] border border-rose-200 px-2 py-0.5 rounded font-medium">
                          ✓ Flatbed Logistics Assisted
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div>
                      <span className="text-base font-black text-slate-900">
                        {formatPrice(item.product.priceNGN * item.quantity, item.product.priceUSD * item.quantity)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Total Escrow Value</span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openOrderTracking('ESC-9842-BNIN')}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-[11px] rounded-lg transition flex items-center space-x-1 shadow-sm border border-[#7A101A]/30 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Live Freight</span>
                      </button>

                      <button
                        onClick={() => openIoTSensorModal(item.product.id)}
                        className="px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-[11px] rounded-lg transition flex items-center space-x-1 cursor-pointer border border-cyan-200"
                        title="Link to Industrial Vibration & Temperature Sensor"
                      >
                        <Activity className="w-3.5 h-3.5 text-cyan-600" />
                        <span>IoT Sensor</span>
                      </button>

                      <button
                        onClick={() => openDisputeCenter('ESC-9842-BNIN')}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-[11px] rounded-lg transition flex items-center space-x-1 cursor-pointer border border-rose-200"
                        title="Open Dispute in 48-Hour Trial Window"
                      >
                        <Scale className="w-3.5 h-3.5 text-rose-600" />
                        <span>Dispute</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: OFFERS */}
      {activeTab === 'offers' && (
        <div className="space-y-4 text-xs">
          {offers.map(offer => (
            <div
              key={offer.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{offer.productTitle}</h3>
                  <span className="text-slate-500 text-[11px]">Seller: {offer.sellerName} • {offer.createdAt}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px] flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{offer.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Listed Asking Price:</span>
                  <span className="font-semibold text-slate-700">{formatPrice(offer.originalPrice)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Your Submitted Offer:</span>
                  <span className="font-black text-[#8B1520]">{formatPrice(offer.offeredPrice)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Contingency:</span>
                  <span className="text-emerald-700 font-bold">
                    {offer.requiresInspection ? 'Physical Inspection Required' : 'Standard Escrow'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: INSPECTIONS */}
      {activeTab === 'inspections' && (
        <div className="space-y-4 text-xs">
          {inspections.map(insp => (
            <div
              key={insp.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{insp.productTitle}</h3>
                  <span className="text-slate-500 text-[11px]">Scheduled Date: {insp.inspectionDate} • {insp.sellerLocation}</span>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                  {insp.status}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-700 font-semibold">
                  <span>Inspection Protocol:</span>
                  <span className="text-slate-900 font-bold">{insp.inspectorType}</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Dial-gauge runout test, 3-phase insulation test, and video run-report scheduled.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: PRICE DROP ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4 text-xs">
          {priceAlerts.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2 bg-white rounded-xl border border-slate-200">
              <Bell className="w-10 h-10 mx-auto text-amber-400" />
              <h3 className="font-bold text-slate-800 text-sm">No Active Price Alerts</h3>
              <p className="max-w-md mx-auto text-slate-500 text-xs">
                Browse our industrial catalog and click "Set Price Alert" on any machine to monitor price drops and get immediate notifications.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {priceAlerts.map(alert => {
                const prod = products.find(p => p.id === alert.productId);
                return (
                  <div
                    key={alert.id}
                    className={`bg-white rounded-xl border p-4 sm:p-5 space-y-3.5 shadow-xs transition ${
                      alert.triggered
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            alert.triggered 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {alert.triggered ? 'Target Price Reached!' : 'Radar Active'}
                          </span>
                          <span className="text-[10px] text-slate-400">Created: {alert.createdAt}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mt-1">
                          {alert.productTitle}
                        </h3>
                      </div>

                      <button
                        onClick={() => removePriceAlert(alert.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100 transition"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price Comparison Block */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Baseline When Set:</span>
                        <span className="font-bold text-slate-700">
                          {formatPrice(alert.initialPriceNGN, alert.initialPriceUSD)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Target Trigger Price:</span>
                        <span className="font-black text-amber-700">
                          {formatPrice(alert.targetPriceNGN, alert.targetPriceUSD)}
                        </span>
                      </div>
                    </div>

                    {/* Channels & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                        <span>Channels:</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase">
                          {alert.notificationChannel || 'in_app'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Interactive simulation trigger */}
                        {!alert.triggered && (
                          <button
                            onClick={() => triggerSimulatedPriceDrop(alert.productId, alert.targetPriceNGN * 0.95)}
                            className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center space-x-1 transition shadow-2xs"
                            title="Simulate seller lowering price below target"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Simulate Drop</span>
                          </button>
                        )}

                        {prod && (
                          <button
                            onClick={() => setActiveProduct(prod)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#8B1520] font-bold text-[11px] flex items-center space-x-1 transition cursor-pointer"
                          >
                            <span>View Product</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: MY LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4 text-xs">
          {userListings.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2 bg-white rounded-xl border border-slate-200">
              <Package className="w-10 h-10 mx-auto text-slate-300" />
              <p>You have not posted any equipment listings yet.</p>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold transition text-xs shadow-md border border-[#7A101A]/30 cursor-pointer"
              >
                Create First Listing
              </button>
            </div>
          ) : (
            userListings.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <img src={product.images[0]} alt={product.title} className="w-16 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{product.title}</h3>
                    <span className="text-[11px] text-slate-500">{product.category} • {product.condition}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-[#8B1520] text-sm">{formatPrice(product.priceNGN, product.priceUSD)}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">● Live on MTM</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
