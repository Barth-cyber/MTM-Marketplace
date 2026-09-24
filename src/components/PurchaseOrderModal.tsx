import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Truck, 
  Wrench, 
  CreditCard, 
  Save, 
  Eye, 
  FileSpreadsheet, 
  AlertCircle,
  Clock,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Hash
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { PurchaseOrder, PurchaseOrderItem } from '../types';
import { generatePurchaseOrderPdf } from '../utils/pdfReportGenerator';

export const PurchaseOrderModal: React.FC = () => {
  const { 
    isPurchaseOrderModalOpen, 
    setIsPurchaseOrderModalOpen, 
    cart, 
    cartTotal, 
    formatPrice, 
    currency,
    selectedHub,
    purchaseOrders,
    savePurchaseOrder,
    deletePurchaseOrder,
    showToast,
    setIsCartOpen
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'generate' | 'ledger'>('generate');
  const [poNumber, setPoNumber] = useState<string>(() => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `PO-${dateStr}-${rand}`;
  });

  const [buyerCompany, setBuyerCompany] = useState<string>('Apex Industrial Fabrication Nig Ltd');
  const [buyerTIN, setBuyerTIN] = useState<string>('TIN-14982240-001');
  const [buyerContactName, setBuyerContactName] = useState<string>('Engr. Dapo Alabi');
  const [buyerTitle, setBuyerTitle] = useState<string>('Lead Procurement & Asset Manager');
  const [buyerEmail, setBuyerEmail] = useState<string>('procurement@apexindustrial.ng');
  const [buyerPhone, setBuyerPhone] = useState<string>('+234 803 319 2284');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Plot 14, Commercial Avenue, Ikeja Industrial Estate, Lagos');
  const [deliveryHub, setDeliveryHub] = useState<string>(selectedHub || 'Lagos Hub');
  const [paymentTerms, setPaymentTerms] = useState<string>('MTM Guaranteed Escrow (48h Acceptance Release)');
  const [notes, setNotes] = useState<string>('Requisition for Factory Line Expansion 2026. Certified pre-dispatch run test required prior to haulage.');
  const [approvalStatus, setApprovalStatus] = useState<PurchaseOrder['approvalStatus']>('Submitted for Internal Review');
  const [approverName, setApproverName] = useState<string>('Chief K. Okonkwo (Director of Operations)');

  // Selected item custom states
  const [includedInspection, setIncludedInspection] = useState<Record<string, boolean>>({});
  const [includedFreight, setIncludedFreight] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (cart.length > 0) {
      const inspMap: Record<string, boolean> = {};
      const freightMap: Record<string, boolean> = {};
      cart.forEach(item => {
        inspMap[item.product.id] = item.includePhysicalInspection;
        freightMap[item.product.id] = item.includeFreightAssistance;
      });
      setIncludedInspection(inspMap);
      setIncludedFreight(freightMap);
    }
  }, [cart]);

  if (!isPurchaseOrderModalOpen) return null;

  // Build items array from Cart
  const poItems: PurchaseOrderItem[] = cart.map(item => {
    const isInsp = includedInspection[item.product.id] ?? item.includePhysicalInspection;
    const isFreight = includedFreight[item.product.id] ?? item.includeFreightAssistance;
    const inspFee = isInsp ? (item.inspectionFeeNGN || 45000) : 0;
    const freightFee = isFreight ? (item.estimatedFreightNGN || 85000) : 0;
    const lineSubtotal = (item.product.priceNGN * item.quantity);
    
    return {
      productId: item.product.id,
      title: item.product.title,
      brand: item.product.brand,
      model: item.product.model || 'Standard Edition',
      condition: item.product.condition,
      category: item.product.category,
      unitPriceNGN: item.product.priceNGN,
      unitPriceUSD: item.product.priceUSD || Math.round(item.product.priceNGN / 1500),
      quantity: item.quantity,
      includePhysicalInspection: isInsp,
      inspectionFeeNGN: inspFee,
      includeFreightAssistance: isFreight,
      freightFeeNGN: freightFee,
      sellerName: item.product.seller?.name || 'Verified Vendor',
      sellerLocation: item.product.seller?.location || 'Lagos Hub',
      totalLineNGN: lineSubtotal + inspFee + freightFee
    };
  });

  const subtotalNGN = poItems.reduce((acc, item) => acc + (item.unitPriceNGN * item.quantity), 0);
  const totalInspectionNGN = poItems.reduce((acc, item) => acc + item.inspectionFeeNGN, 0);
  const totalFreightNGN = poItems.reduce((acc, item) => acc + item.freightFeeNGN, 0);
  const vatTaxNGN = Math.round(subtotalNGN * 0.075);
  const grandTotalNGN = subtotalNGN + totalInspectionNGN + totalFreightNGN + vatTaxNGN;
  const grandTotalUSD = Math.round(grandTotalNGN / 1500);

  const currentDateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const validUntilDate = new Date();
  validUntilDate.setDate(validUntilDate.getDate() + 30);
  const validUntilStr = validUntilDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const currentPoData: PurchaseOrder = {
    id: `po-${Date.now()}`,
    poNumber,
    createdAt: currentDateStr,
    validUntil: validUntilStr,
    buyerCompany,
    buyerContactName,
    buyerTitle,
    buyerEmail,
    buyerPhone,
    buyerAddress: deliveryAddress,
    buyerTIN,
    deliveryHub,
    deliveryAddress,
    paymentTerms,
    items: poItems,
    subtotalNGN,
    totalInspectionNGN,
    totalFreightNGN,
    vatTaxNGN,
    grandTotalNGN,
    grandTotalUSD,
    notes,
    approvalStatus,
    approverName,
    approverTitle: 'Executive Signatory'
  };

  const handleExportPdf = () => {
    if (poItems.length === 0) {
      showToast('⚠️ Please add at least 1 equipment item to cart to generate a PO.');
      return;
    }
    generatePurchaseOrderPdf(currentPoData);
    savePurchaseOrder(currentPoData);
    showToast(`✓ Official Purchase Order ${poNumber} downloaded successfully!`);
  };

  const handleSaveToLedger = () => {
    if (poItems.length === 0) {
      showToast('⚠️ No items in cart to save.');
      return;
    }
    savePurchaseOrder(currentPoData);
    setActiveTab('ledger');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-[9999] overflow-y-auto animate-in fade-in duration-200"
      id="purchase-order-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsPurchaseOrderModalOpen(false);
      }}
    >
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-white text-slate-900 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B1520] flex items-center justify-center text-white font-black shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">Corporate Purchase Order (PO) Generator</h2>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-[#8B1520] border border-rose-200 text-[11px] font-semibold">
                  Procurement Desk
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official enterprise requisition document with escrow verification & signature matrices
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'generate'
                    ? 'bg-[#8B1520] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>PO Editor</span>
              </button>
              <button
                onClick={() => setActiveTab('ledger')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'ledger'
                    ? 'bg-[#8B1520] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>PO Ledger ({purchaseOrders.length})</span>
              </button>
            </div>

            <button
              onClick={() => setIsPurchaseOrderModalOpen(false)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 border border-slate-200 hover:border-rose-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              title="Close dialog"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Generate & Edit PO */}
        {activeTab === 'generate' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 bg-rose-50 text-[#8B1520] rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Your Cart is Currently Empty</h3>
                <p className="text-xs text-slate-500">
                  Add industrial machines, welding equipment, or workshop tools to your cart to generate an official Corporate Purchase Order with full technical specifications.
                </p>
                <button
                  onClick={() => {
                    setIsPurchaseOrderModalOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#8B1520] hover:bg-[#72111A] text-white font-bold text-xs shadow-md transition inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Browse Equipment Catalog</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side: PO Configuration Form (5 cols) */}
                <div className="lg:col-span-5 space-y-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-[#1E40AF]" />
                      <span>Requisition & Enterprise Specs</span>
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {poNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        PO Number
                      </label>
                      <input
                        type="text"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Buyer TIN / RC No.
                      </label>
                      <input
                        type="text"
                        value={buyerTIN}
                        onChange={(e) => setBuyerTIN(e.target.value)}
                        placeholder="RC 1498224"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Issuing Enterprise / Company
                    </label>
                    <input
                      type="text"
                      value={buyerCompany}
                      onChange={(e) => setBuyerCompany(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Procurement Officer
                      </label>
                      <input
                        type="text"
                        value={buyerContactName}
                        onChange={(e) => setBuyerContactName(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Corporate Procurement Email
                    </label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Destination Hub
                      </label>
                      <select
                        value={deliveryHub}
                        onChange={(e) => setDeliveryHub(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                      >
                        <option value="Lagos Hub">Lagos Hub (Ikeja/Apapa)</option>
                        <option value="Benin Hub">Benin City Hub (Edo State)</option>
                        <option value="Port Harcourt Hub">Port Harcourt Hub (Rivers)</option>
                        <option value="Kano Hub">Kano Industrial Hub</option>
                        <option value="Abuja Hub">Abuja FCT Central Hub</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Approval State
                      </label>
                      <select
                        value={approvalStatus}
                        onChange={(e) => setApprovalStatus(e.target.value as any)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                      >
                        <option value="Draft">Draft Requisition</option>
                        <option value="Submitted for Internal Review">Submitted for Review</option>
                        <option value="Approved by CFO">Approved by CFO / Board</option>
                        <option value="Issued to MTM Escrow">Issued to MTM Escrow</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Factory Delivery Floor Address
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Payment & Escrow Route
                    </label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                    >
                      <option value="MTM Guaranteed Escrow (48h Acceptance Release)">MTM Guaranteed Escrow (48h Acceptance Window)</option>
                      <option value="Corporate Net-30 via Bank Guarantee">Corporate Net-30 via Bank Guarantee</option>
                      <option value="Direct Institutional Wire / Form M (USD)">Direct Institutional Wire / Form M (USD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Internal Requisition Memo / Notes
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Right Side: Live Interactive Document Preview (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-700">Official Document Preview</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveToLedger}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save to Ledger</span>
                      </button>
                      <button
                        onClick={handleExportPdf}
                        className="px-4 py-1.5 rounded-lg bg-[#8B1520] hover:bg-[#72111A] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Document Sheet Container */}
                  <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-5 sm:p-6 space-y-4 font-sans text-slate-800 text-xs">
                    {/* Header Strip */}
                    <div className="bg-[#8B1520] text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.5 rounded bg-white text-[#8B1520] font-black text-xs">MTM</span>
                          <h4 className="font-black text-sm tracking-wide">MTM INDUSTRIAL MARKETPLACE</h4>
                        </div>
                        <p className="text-[10px] text-rose-200 mt-0.5">
                          OFFICIAL CORPORATE PURCHASE ORDER • RC 1498224
                        </p>
                      </div>
                      <div className="text-right sm:text-right bg-black/20 px-3 py-1.5 rounded-lg border border-white/20">
                        <div className="text-xs font-mono font-bold text-white">{poNumber}</div>
                        <div className="text-[10px] text-rose-200">Date: {currentDateStr}</div>
                      </div>
                    </div>

                    {/* Parties Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                          Marketplace Vendor:
                        </span>
                        <div className="font-bold text-slate-900">MTM - Marketplace</div>
                        <div className="text-[11px] text-slate-500">Ikeja Industrial Zone, Lagos, Nigeria</div>
                        <div className="text-[11px] text-slate-500">Escrow Desk: escrow@mtm-marketplace.com</div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                          Issuing Enterprise (Buyer):
                        </span>
                        <div className="font-bold text-slate-900">{buyerCompany}</div>
                        <div className="text-[11px] text-slate-500">Attn: {buyerContactName} ({buyerTitle})</div>
                        <div className="text-[11px] text-slate-500">{buyerEmail} • {buyerPhone}</div>
                      </div>
                    </div>

                    {/* Equipment Line Items Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase border-b border-slate-200">
                            <th className="p-2.5">Item & Specs</th>
                            <th className="p-2.5 text-center">Qty</th>
                            <th className="p-2.5 text-right">Unit Price</th>
                            <th className="p-2.5 text-center">Add-ons</th>
                            <th className="p-2.5 text-right">Line Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-[11px]">
                          {poItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-2.5">
                                <div className="font-bold text-slate-900">{item.title}</div>
                                <div className="text-[10px] text-slate-500">
                                  {item.brand} • {item.condition} • Seller: {item.sellerName}
                                </div>
                              </td>
                              <td className="p-2.5 text-center font-bold text-slate-800">
                                {item.quantity}
                              </td>
                              <td className="p-2.5 text-right font-medium text-slate-700">
                                {formatPrice(item.unitPriceNGN, item.unitPriceUSD)}
                              </td>
                              <td className="p-2.5 text-center">
                                <div className="flex flex-col items-center space-y-1">
                                  <label className="inline-flex items-center space-x-1 text-[10px] cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={includedInspection[item.productId] ?? true}
                                      onChange={(e) => setIncludedInspection(prev => ({ ...prev, [item.productId]: e.target.checked }))}
                                      className="rounded text-blue-600 focus:ring-blue-500 w-3 h-3"
                                    />
                                    <span>Inspection</span>
                                  </label>
                                  <label className="inline-flex items-center space-x-1 text-[10px] cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={includedFreight[item.productId] ?? false}
                                      onChange={(e) => setIncludedFreight(prev => ({ ...prev, [item.productId]: e.target.checked }))}
                                      className="rounded text-blue-600 focus:ring-blue-500 w-3 h-3"
                                    />
                                    <span>Haulage</span>
                                  </label>
                                </div>
                              </td>
                              <td className="p-2.5 text-right font-bold text-slate-900">
                                ₦{item.totalLineNGN.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                      <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-200 text-[10px] text-slate-600 space-y-1 flex-1">
                        <div className="font-bold text-[#1E40AF] flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>100% Escrow Guarantee Protocol</span>
                        </div>
                        <p>Funds remain secured until buyer signs 48h on-site testing verification.</p>
                        <p>PO valid for 30 calendar days through {validUntilStr}.</p>
                      </div>

                      <div className="w-full sm:w-64 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-right text-[11px]">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal:</span>
                          <span className="font-medium text-slate-700">₦{subtotalNGN.toLocaleString()}</span>
                        </div>
                        {totalInspectionNGN > 0 && (
                          <div className="flex justify-between text-slate-500">
                            <span>Pre-Dispatch Inspections:</span>
                            <span className="font-medium text-slate-700">+₦{totalInspectionNGN.toLocaleString()}</span>
                          </div>
                        )}
                        {totalFreightNGN > 0 && (
                          <div className="flex justify-between text-slate-500">
                            <span>Flatbed Haulage:</span>
                            <span className="font-medium text-slate-700">+₦{totalFreightNGN.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-500">
                          <span>VAT / Duties (7.5%):</span>
                          <span className="font-medium text-slate-700">₦{vatTaxNGN.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-slate-300 pt-1.5 flex justify-between font-bold text-slate-900 text-xs">
                          <span className="text-[#1E40AF]">Grand Total:</span>
                          <span className="text-[#1E40AF]">₦{grandTotalNGN.toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          (~ ${grandTotalUSD.toLocaleString()} USD Equivalent)
                        </div>
                      </div>
                    </div>

                    {/* Corporate Sign-off Matrix */}
                    <div className="border-t border-slate-200 pt-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Authorization & Sign-off Matrix
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="border border-slate-200 p-2 rounded bg-slate-50">
                          <div className="font-bold text-slate-700">Requisition Officer</div>
                          <div className="text-slate-500 mt-1">{buyerContactName}</div>
                          <div className="text-emerald-600 font-bold mt-0.5">✓ Electronically Signed</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded bg-slate-50">
                          <div className="font-bold text-slate-700">Operations Head</div>
                          <div className="text-slate-500 mt-1">Engr. Technical Review</div>
                          <div className="text-slate-400 mt-0.5">Pending Batch Run</div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded bg-blue-50 border-blue-200">
                          <div className="font-bold text-blue-900">MTM Escrow Stamp</div>
                          <div className="text-blue-700 font-mono font-bold mt-1">VERIFIED</div>
                          <div className="text-blue-600 text-[9px] mt-0.5">100% Protected</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Purchase Orders Ledger */}
        {activeTab === 'ledger' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Corporate Purchase Order Ledger</h3>
                <p className="text-xs text-slate-500">History of all formal procurement orders generated for corporate approval</p>
              </div>
              <button
                onClick={() => setActiveTab('generate')}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm border border-[#7A101A]/30"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>+ Create New PO</span>
              </button>
            </div>

            {purchaseOrders.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="text-sm font-bold text-slate-700">No Purchase Orders in Ledger Yet</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you generate or save Purchase Orders, they will be archived here for instant tracking and PDF re-download.
                </p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white text-xs font-bold transition cursor-pointer shadow-sm border border-[#7A101A]/30"
                >
                  Generate First PO
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {purchaseOrders.map((po) => (
                  <div 
                    key={po.id || po.poNumber}
                    className="p-4 rounded-xl border border-slate-200 hover:border-rose-300 bg-white shadow-2xs hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs text-[#8B1520] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {po.poNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{po.buyerCompany}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {po.approvalStatus || 'Approved by CFO'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center space-x-3">
                        <span>Issued: {po.createdAt}</span>
                        <span>•</span>
                        <span>{po.items.length} Equipment Item(s)</span>
                        <span>•</span>
                        <span>Dest: {po.deliveryHub}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-sm text-slate-900">
                          ₦{po.grandTotalNGN.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ~${po.grandTotalUSD.toLocaleString()} USD
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            generatePurchaseOrderPdf(po);
                            showToast(`✓ Re-downloading PDF for ${po.poNumber}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#8B1520] font-bold text-xs transition flex items-center space-x-1.5 border border-rose-200 cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
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

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Escrow Protected Purchase Requisitions comply with CAMA & NITDA guidelines.</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setIsPurchaseOrderModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold transition flex-1 sm:flex-initial cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleExportPdf}
              disabled={cart.length === 0}
              className={`px-5 py-2 rounded-xl font-bold transition flex items-center justify-center space-x-2 shadow-md flex-1 sm:flex-initial border ${
                cart.length > 0
                  ? 'bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white border-[#7A101A]/40 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Download Official PO (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
