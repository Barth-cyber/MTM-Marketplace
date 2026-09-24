import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  ArrowRight,
  PackageCheck,
  ChevronRight,
  Sparkles,
  Download
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useDraggableModal } from '../hooks/useDraggableModal';

export interface OrderTrackItem {
  id: string;
  orderNumber: string;
  machineTitle: string;
  image: string;
  sellerName: string;
  sellerLocation: string;
  destinationAddress: string;
  amountNGN: number;
  orderDate: string;
  estimatedDelivery: string;
  currentStepIndex: number; // 0 to 5
  status: 'In Escrow' | 'Pre-Dispatch Inspection' | 'In Transit' | '48-Hr Trial Active' | 'Escrow Released' | 'Disputed';
  trialHoursRemaining?: number;
  driverName?: string;
  driverPhone?: string;
  truckReg?: string;
  craneTeam?: string;
  waybillUrl?: string;
  timeline: Array<{
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
  }>;
}

const MOCK_ORDERS: OrderTrackItem[] = [];

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string | null;
  onOpenDispute?: (orderId: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
  onOpenDispute
}) => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const { formatPrice, showToast, setActiveView } = useMarketplace();
  const [orders, setOrders] = useState<OrderTrackItem[]>(() => {
    try {
      const saved = localStorage.getItem('mtm_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Refresh orders list when modal opens or initialOrderId changes
  React.useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('mtm_orders');
        const list = saved ? JSON.parse(saved) : [];
        setOrders(list);
        if (initialOrderId) {
          setSelectedOrderId(initialOrderId);
        } else if (list.length > 0 && !selectedOrderId) {
          setSelectedOrderId(list[0].id);
        }
      } catch {}
    }
  }, [isOpen, initialOrderId]);

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialOrderId || ''
  );
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'trial'>('all');

  if (!isOpen) return null;

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const handleConfirmEarlyRelease = () => {
    if (activeOrder) {
      showToast(`Order ${activeOrder.orderNumber} confirmed! Escrow funds released to ${activeOrder.sellerName}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        style={modalStyle}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 my-auto"
      >
        
        {/* Header */}
        <div 
          {...dragHandleProps}
          className="p-4 sm:p-5 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[#8B1520]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-slate-900">Real-Time Heavy Equipment Tracking</h2>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold uppercase">
                  GPS & Escrow Live
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Track flatbed freight, crane offloading, diagnostic inspections & 48-hour trial window
              </p>
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

        {/* Modal Main Content Body */}
        {orders.length === 0 ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1E40AF] border border-blue-200 flex items-center justify-center shadow-xs">
              <Truck className="w-8 h-8" />
            </div>
            
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>0 Active Marketplace Transactions</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Escrow Ledger Ready for Live Transactions
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md">
                No active orders are currently in transit. As soon as you purchase equipment or lock escrow funds for machinery with certified crane dispatch, live real-time GPS tracking and 48-hour trial telemetry will be reflected here.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full pt-2 text-left">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Active Escrows</span>
                <span className="text-sm font-black text-slate-900">0</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">In Transit</span>
                <span className="text-sm font-black text-slate-900">0</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Completed</span>
                <span className="text-sm font-black text-slate-900">0</span>
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                onClick={() => {
                  onClose();
                  setActiveView('catalog');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs transition shadow-md border border-[#7A101A]/30 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Browse Live Equipment Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Panel: Orders List */}
            <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Your Escrow Orders</span>
                <span className="text-[10px] bg-rose-50 text-[#8B1520] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                  {orders.length} Active
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-slate-200/70 p-1 rounded-xl text-[11px] font-bold">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`flex-1 py-1 text-center rounded-lg transition ${
                    filterTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterTab('active')}
                  className={`flex-1 py-1 text-center rounded-lg transition ${
                    filterTab === 'active' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  In Transit
                </button>
                <button
                  onClick={() => setFilterTab('trial')}
                  className={`flex-1 py-1 text-center rounded-lg transition ${
                    filterTab === 'trial' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  48h Trial
                </button>
              </div>

              {/* Orders Cards */}
              <div className="space-y-2.5">
                {orders.map(ord => {
                  const isSelected = ord.id === activeOrder?.id;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-white border-[#1E40AF] shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-[#1E40AF]">{ord.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.status === '48-Hr Trial Active'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="flex gap-2.5 items-center">
                        <img
                          src={ord.image}
                          alt={ord.machineTitle}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{ord.machineTitle}</h4>
                          <p className="text-[11px] text-slate-500">{ord.sellerName}</p>
                          <p className="text-xs font-extrabold text-[#1E40AF] mt-0.5">
                            {formatPrice(ord.amountNGN)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>MTM Process Protection Guarantee</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Funds remain safely held in escrow throughout delivery, crane offloading, and the 48-hour trial window.
                </p>
              </div>
            </div>

            {/* Right Panel: Detailed Timeline & Logistics */}
            {activeOrder && (
              <div className="lg:col-span-8 p-5 space-y-6">
                
                {/* Order Summary Box */}
                <div className="bg-slate-50 text-slate-900 p-4 rounded-xl space-y-3 border border-slate-200 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#8B1520] text-sm">{activeOrder.orderNumber}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                          100% MTM Escrow Protected
                        </span>
                      </div>
                      <h3 className="text-sm font-bold mt-0.5 text-slate-900">{activeOrder.machineTitle}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Escrow Value</span>
                      <span className="text-base font-black text-[#8B1520]">{formatPrice(activeOrder.amountNGN)}</span>
                    </div>
                  </div>

                  {/* Logistics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-[#8B1520]" />
                        <span>Origin Dispatch Hub</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-[11px] truncate">{activeOrder.sellerLocation}</p>
                    </div>

                    <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Destination Factory Site</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-[11px] truncate">{activeOrder.destinationAddress}</p>
                    </div>
                  </div>

                  {/* Live Driver & Crane Contact */}
                  {activeOrder.driverName && (
                    <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#8B1520] block tracking-wider">
                          Assigned Heavy Freight Driver & Crane Unit
                        </span>
                        <p className="font-bold text-slate-900 mt-0.5">
                          {activeOrder.driverName} • {activeOrder.truckReg}
                        </p>
                        <p className="text-[11px] text-slate-600">{activeOrder.craneTeam}</p>
                      </div>

                      <a
                        href={`tel:${activeOrder.driverPhone}`}
                        className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-sm border border-[#7A101A]/30"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Driver ({activeOrder.driverPhone})</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* 48-Hour Trial Banner if Active */}
                {activeOrder.status === '48-Hr Trial Active' && activeOrder.trialHoursRemaining && (
                  <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-2 border-amber-400/60 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-sm">
                        <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                        <span>48-Hour Trial Window in Progress</span>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black rounded-lg text-xs font-mono shadow-xs">
                        ⏳ {activeOrder.trialHoursRemaining} Hours Remaining
                      </span>
                    </div>

                    <p className="text-xs text-amber-900/90 leading-relaxed">
                      Operate machine under load in your factory. Test fence calibration, dust extraction, motor performance, and cutting precision against the diagnostic report.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={handleConfirmEarlyRelease}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Satisfaction & Release Escrow</span>
                      </button>

                      {onOpenDispute && (
                        <button
                          onClick={() => onOpenDispute(activeOrder.orderNumber)}
                          className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-lg transition flex items-center space-x-1.5 cursor-pointer"
                        >
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Report Issue / Open Dispute</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Tracking Timeline */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-[#8B1520]" />
                    <span>Live Milestone Timeline</span>
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {activeOrder.timeline.map((step, idx) => (
                      <div key={idx} className="relative flex items-start space-x-3">
                        {/* Status Dot */}
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-2xs ${
                          step.completed
                            ? 'bg-emerald-600 text-white'
                            : step.current
                            ? 'bg-[#8B1520] text-white ring-4 ring-rose-100 animate-pulse'
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          {step.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-current" />
                          )}
                        </div>

                        <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <h5 className={`text-xs font-bold ${step.current ? 'text-[#8B1520]' : 'text-slate-900'}`}>
                              {step.title}
                            </h5>
                            <span className="text-[10px] font-mono text-slate-400">{step.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => showToast(`Waybill receipt downloaded for ${activeOrder.orderNumber}`)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-[#8B1520] transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official Waybill & Escrow Receipt</span>
                  </button>

                  {onOpenDispute && activeOrder.status !== '48-Hr Trial Active' && (
                    <button
                      onClick={() => onOpenDispute(activeOrder.orderNumber)}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 transition cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Report Transit/Order Issue</span>
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

