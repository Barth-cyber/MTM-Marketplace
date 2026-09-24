import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Send, 
  Paperclip, 
  Scale, 
  ChevronRight, 
  Sparkles, 
  UserCheck, 
  Download,
  AlertCircle
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useDraggableModal } from '../hooks/useDraggableModal';

export interface DisputeMessage {
  id: string;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'mediator';
  timestamp: string;
  content: string;
  attachmentName?: string;
}

export interface DisputeCase {
  id: string;
  caseNumber: string;
  orderNumber: string;
  machineTitle: string;
  amountNGN: number;
  sellerName: string;
  reason: string;
  requestedResolution: string;
  status: 'Under MTM Mediation Review' | 'Awaiting Seller Response' | 'Technician Re-visit Scheduled' | 'Resolved';
  openedDate: string;
  lastUpdated: string;
  evidenceFiles: string[];
  messages: DisputeMessage[];
}

const INITIAL_DISPUTES: DisputeCase[] = [
  {
    id: 'dsp-1',
    caseNumber: 'DSP-2026-0891',
    orderNumber: 'ESC-9842-BNIN',
    machineTitle: 'Heavy Duty Sliding Table Panel Saw (MJ6132TY)',
    amountNGN: 6800000,
    sellerName: 'Interior Duct Ltd',
    reason: 'Scoring blade alignment divergence during 48-hour trial run',
    requestedResolution: 'On-site independent technician re-visit for laser fence recalibration',
    status: 'Technician Re-visit Scheduled',
    openedDate: '29 Aug 2026',
    lastUpdated: '30 Aug 2026',
    evidenceFiles: [
      'trial_cutting_laser_alignment_log.pdf',
      'panel_saw_fence_vibration_video.mp4'
    ],
    messages: [
      {
        id: 'msg-1',
        senderName: 'Apex Industrial Fab (Buyer)',
        senderRole: 'buyer',
        timestamp: '29 Aug 2026 • 06:15 PM',
        content: 'During our 48-hour trial, the main saw blade runs smoothly but the scoring blade produces a 0.5mm variance on 18mm MDF boards. Requesting technician re-calibration under MTM Guarantee.',
        attachmentName: 'panel_saw_fence_vibration_video.mp4'
      },
      {
        id: 'msg-2',
        senderName: 'Engr. Olabisi Adeleke (MTM Lead Mediator)',
        senderRole: 'mediator',
        timestamp: '30 Aug 2026 • 09:30 AM',
        content: 'MTM Dispute Desk has reviewed the trial video. Per our Transaction Process Guarantee, Escrow funds of ₦6,800,000 are locked. We have scheduled senior technician Engr. Victor Osagie from Benin Hub to inspect and adjust the scoring arbor on site tomorrow at 10:00 AM.'
      },
      {
        id: 'msg-3',
        senderName: 'Interior Duct Ltd (Seller)',
        senderRole: 'seller',
        timestamp: '30 Aug 2026 • 11:10 AM',
        content: 'We acknowledge the report. The scoring belt tensioner may have shifted slightly during flatbed transport. We approve the technician re-visit and will provide a new backup belt free of charge.'
      }
    ]
  }
];

interface DisputeCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledOrderId?: string | null;
}

export const DisputeCenterModal: React.FC<DisputeCenterModalProps> = ({
  isOpen,
  onClose,
  prefilledOrderId
}) => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const { formatPrice, showToast } = useMarketplace();
  const [disputes, setDisputes] = useState<DisputeCase[]>(INITIAL_DISPUTES);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(INITIAL_DISPUTES[0].id);
  const [activeTab, setActiveTab] = useState<'cases' | 'new_dispute'>('cases');

  // New dispute form state
  const [orderNumber, setOrderNumber] = useState(prefilledOrderId || 'ESC-9842-BNIN');
  const [reason, setReason] = useState('Machine Operation Divergence from Pre-Dispatch Report');
  const [requestedResolution, setRequestedResolution] = useState('On-Site Independent Engineer Re-visit & Adjustment');
  const [description, setDescription] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  // Chat message state
  const [chatMessage, setChatMessage] = useState('');

  if (!isOpen) return null;

  const activeDispute = disputes.find(d => d.id === selectedDisputeId) || disputes[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMsg: DisputeMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'Apex Industrial Fab (Buyer)',
      senderRole: 'buyer',
      timestamp: 'Just now',
      content: chatMessage
    };

    setDisputes(prev => prev.map(d => {
      if (d.id === activeDispute.id) {
        return {
          ...d,
          messages: [...d.messages, newMsg],
          lastUpdated: 'Just now'
        };
      }
      return d;
    }));

    setChatMessage('');
    showToast('Diagnostic comment added to dispute thread');
  };

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please describe the diagnostic variance or issue');
      return;
    }

    const newCase: DisputeCase = {
      id: `dsp-${Date.now()}`,
      caseNumber: `DSP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber,
      machineTitle: orderNumber.includes('9842') ? 'Heavy Duty Sliding Table Panel Saw' : 'Automatic Heavy Duty Edge Bander',
      amountNGN: 6800000,
      sellerName: orderNumber.includes('9842') ? 'Interior Duct Ltd' : 'Oregun Machinery Hub',
      reason,
      requestedResolution,
      status: 'Under MTM Mediation Review',
      openedDate: '30 Aug 2026',
      lastUpdated: 'Just now',
      evidenceFiles: attachedFileName ? [attachedFileName] : ['diagnostic_photo_log.jpg'],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: 'Apex Industrial Fab (Buyer)',
          senderRole: 'buyer',
          timestamp: 'Just now',
          content: description,
          attachmentName: attachedFileName || undefined
        },
        {
          id: `msg-${Date.now() + 1}`,
          senderName: 'MTM Dispute Desk (Automated)',
          senderRole: 'mediator',
          timestamp: 'Just now',
          content: 'Dispute registered under MTM Transaction Process Guarantee. Escrow release paused. MTM Senior Engineer assigned for review within 4 hours.'
        }
      ]
    };

    setDisputes([newCase, ...disputes]);
    setSelectedDisputeId(newCase.id);
    setActiveTab('cases');
    setDescription('');
    showToast(`Dispute Case ${newCase.caseNumber} opened! Escrow payout locked safely.`);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 bg-slate-900/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        style={modalStyle}
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 my-auto"
      >
        
        {/* Header */}
        <div 
          {...dragHandleProps}
          className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-rose-950 to-slate-950 text-white flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">MTM Escrow Dispute & Resolution Center</h2>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[10px] font-mono font-bold uppercase">
                  Evidence-Based Guarantee
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Independent mediation, diagnostic trial audits & controlled escrow protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="no-drag p-2 rounded-xl bg-white/15 hover:bg-rose-600 hover:text-white text-slate-200 border border-white/20 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 pt-3 flex space-x-3 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('cases')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'cases' ? 'border-rose-600 text-rose-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Active Disputes ({disputes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new_dispute')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'new_dispute' ? 'border-rose-600 text-rose-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>+ Open New Dispute / Report Issue</span>
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto">

          {/* TAB 1: CASES VIEW */}
          {activeTab === 'cases' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              
              {/* Left Column: Dispute Case List */}
              <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider block pb-1">
                  Dispute Registry
                </span>

                <div className="space-y-2">
                  {disputes.map(c => {
                    const isSelected = c.id === activeDispute.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedDisputeId(c.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-white border-rose-600 shadow-md ring-2 ring-rose-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-rose-700">{c.caseNumber}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                            {c.status}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{c.machineTitle}</h4>
                        <p className="text-[11px] text-slate-500 font-mono">Order: {c.orderNumber}</p>
                        <p className="text-[10px] text-slate-400">Opened: {c.openedDate}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <Scale className="w-4 h-4 text-rose-600" />
                    <span>Process Protection Policy</span>
                  </div>
                  <p className="text-[11px] text-rose-950/80 leading-relaxed">
                    Under MTM Guarantee, escrow funds remain 100% frozen until dispute claims are verified by independent engineers or mutually resolved.
                  </p>
                </div>
              </div>

              {/* Right Column: Case Details & Chat Thread */}
              <div className="lg:col-span-8 p-5 flex flex-col justify-between space-y-5">
                
                {/* Case Banner Header */}
                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-rose-400 text-sm">{activeDispute.caseNumber}</span>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded border border-amber-400/30">
                          {activeDispute.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold mt-0.5">{activeDispute.machineTitle}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Frozen Escrow Funds</span>
                      <span className="text-base font-black text-emerald-400">{formatPrice(activeDispute.amountNGN)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Dispute Reason</span>
                      <p className="font-medium text-slate-200 text-[11px] mt-0.5">{activeDispute.reason}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Requested Remedy</span>
                      <p className="font-medium text-slate-200 text-[11px] mt-0.5">{activeDispute.requestedResolution}</p>
                    </div>
                  </div>

                  {activeDispute.evidenceFiles.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Attached Evidence:</span>
                      {activeDispute.evidenceFiles.map((file, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-800 text-blue-300 rounded text-[10px] font-mono border border-slate-700">
                          📎 {file}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mediation Chat Thread */}
                <div className="space-y-3 flex-1">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-rose-600" />
                    <span>Independent Mediation Thread</span>
                  </h4>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 max-h-[280px] overflow-y-auto">
                    {activeDispute.messages.map(msg => {
                      const isMediator = msg.senderRole === 'mediator';
                      const isBuyer = msg.senderRole === 'buyer';

                      return (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-xl space-y-1 text-xs ${
                            isMediator
                              ? 'bg-amber-50/90 border border-amber-200/80 text-amber-950'
                              : isBuyer
                              ? 'bg-blue-50 border border-blue-200/80 text-slate-900 ml-4'
                              : 'bg-white border border-slate-200 text-slate-900 mr-4'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-1 border-b border-black/5">
                            <span className={`font-bold text-[11px] flex items-center gap-1 ${
                              isMediator ? 'text-amber-800' : isBuyer ? 'text-[#1E40AF]' : 'text-slate-800'
                            }`}>
                              {isMediator && <UserCheck className="w-3.5 h-3.5 text-amber-600" />}
                              <span>{msg.senderName}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                          </div>

                          <p className="leading-relaxed text-[11px] pt-1">{msg.content}</p>

                          {msg.attachmentName && (
                            <div className="pt-1.5 flex items-center gap-1 text-[10px] text-blue-700 font-mono font-bold">
                              <span>📎 Attachment: {msg.attachmentName}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Send Message Form */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Add diagnostic notes or respond to MTM mediator..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-xs font-medium bg-white"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-md border border-[#7A101A]/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: NEW DISPUTE FORM */}
          {activeTab === 'new_dispute' && (
            <form onSubmit={handleCreateDispute} className="p-6 space-y-4 max-w-3xl mx-auto">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>MTM 48-Hour Trial Guarantee Notice</span>
                </div>
                <p>
                  Opening a dispute immediately freezes escrow release for this order. MTM assigned senior machinery engineers will review trial videos and diagnostic logs.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Escrow Order</label>
                  <select
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white font-bold text-slate-800"
                  >
                    <option value="ESC-9842-BNIN">ESC-9842-BNIN — Panel Saw (Interior Duct Ltd)</option>
                    <option value="ESC-7719-LAG">ESC-7719-LAG — Automatic Edge Bander (Oregun Machinery Hub)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dispute Reason</label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white font-medium text-slate-800"
                    >
                      <option value="Machine Operation Divergence from Pre-Dispatch Report">Machine Operation Divergence from Pre-Dispatch Report</option>
                      <option value="Missing Tooling / Blades / Accessories">Missing Tooling / Blades / Accessories</option>
                      <option value="Freight Transit Damage">Freight Transit Damage</option>
                      <option value="Power Voltage / Electrical Spec Incompatibility">Power Voltage / Electrical Spec Incompatibility</option>
                      <option value="Unsatisfactory 48-Hour Trial Performance">Unsatisfactory 48-Hour Trial Performance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Requested Resolution</label>
                    <select
                      value={requestedResolution}
                      onChange={(e) => setRequestedResolution(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white font-medium text-slate-800"
                    >
                      <option value="On-Site Independent Engineer Re-visit & Adjustment">On-Site Independent Engineer Re-visit & Adjustment</option>
                      <option value="Replacement Spare Parts / Tooling Free Dispatch">Replacement Spare Parts / Tooling Free Dispatch</option>
                      <option value="Partial Refund / Escrow Adjustment">Partial Refund / Escrow Adjustment</option>
                      <option value="Full Order Cancellation & 100% Escrow Refund">Full Order Cancellation & 100% Escrow Refund</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Detailed Diagnostic Observations</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe specific trial findings (e.g., motor noise under load, blade arbor runout, fence alignment shift, missing accessories)..."
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white font-medium text-slate-800"
                    required
                  />
                </div>

                {/* Evidence Upload Simulator */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attach Diagnostic Evidence (Video / Photo / PDF)</label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-rose-400 bg-slate-50 p-4 rounded-xl text-center space-y-2 cursor-pointer transition">
                    <Upload className="w-6 h-6 mx-auto text-slate-400" />
                    <p className="text-xs text-slate-600 font-bold">
                      {attachedFileName ? `Attached: ${attachedFileName}` : 'Click to attach trial run video, fence measurement photo, or technician log'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachedFileName('trial_run_laser_alignment_log.mp4');
                        showToast('Evidence video attached to dispute draft');
                      }}
                      className="px-3 py-1 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      {attachedFileName ? 'Change File' : 'Attach Sample Trial Video'}
                    </button>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cases')}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-black text-xs rounded-xl transition shadow-md border border-[#7A101A]/30 flex items-center space-x-2 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Submit Dispute & Freeze Escrow Payout</span>
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
