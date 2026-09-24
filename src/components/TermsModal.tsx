import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Truck, 
  Clock, 
  Scale, 
  HelpCircle,
  Download,
  Building2,
  Check,
  Ban,
  ChevronRight
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useDraggableModal } from '../hooks/useDraggableModal';

export const TermsModal: React.FC = () => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const { 
    isTermsModalOpen, 
    setIsTermsModalOpen, 
    hasAcceptedTerms, 
    acceptedTermsTimestamp,
    acceptTerms, 
    declineTerms 
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<string>('golden-rule');
  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState<boolean>(hasAcceptedTerms);

  if (!isTermsModalOpen) return null;

  const handleAccept = () => {
    acceptTerms();
    setIsTermsModalOpen(false);
  };

  const handleDecline = () => {
    declineTerms();
    setIsTermsModalOpen(false);
  };

  const tabs = [
    { id: 'golden-rule', label: '1. Golden Rule & Workflow', icon: ShieldCheck },
    { id: 'parties-purpose', label: '2. Parties & Protections', icon: Building2 },
    { id: 'off-platform', label: '3. Anti Off-Platform Rule', icon: Ban },
    { id: 'inspection', label: '4. Physical On-Site Testing', icon: FileText },
    { id: 'trial-period', label: '5. 48-Hour Trial Rules', icon: Clock },
    { id: 'refunds-fccpa', label: '6. Refunds & FCCPA Rights', icon: CheckCircle2 },
    { id: 'repairs-materials', label: '7. Repairs & Materials', icon: Truck },
    { id: 'disputes', label: '8. Dispute Desk & Escrow Freeze', icon: Scale },
    { id: 'legal-nitda', label: '9. Governance & NITDA NPKI', icon: Lock },
    { id: 'matrix', label: '10. Transaction Classes', icon: HelpCircle },
  ];

  return (
    <div id="terms-conditions-modal" className="fixed inset-0 z-[1000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 overflow-y-auto animate-fadeIn">
      <div 
        style={modalStyle}
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto"
      >
        
        {/* Header */}
        <div 
          {...dragHandleProps}
          className="bg-slate-900 text-white p-4 sm:p-6 flex items-start justify-between border-b border-slate-800 shrink-0 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-start space-x-3 pointer-events-none">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-500/30">
                  Version 1.0 • Federal Republic of Nigeria
                </span>
                {hasAcceptedTerms ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Accepted & Binding ({acceptedTermsTimestamp})
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1 border border-amber-500/30">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    Pending Acceptance
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                MTM Escrow & Transaction Guarantee Agreement
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                MTM - Marketplace • Terms, Conditions & Operational Safeguards
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsTermsModalOpen(false)}
            className="no-drag p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
            title="Close dialog"
            aria-label="Close Terms Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 48-Hour Golden Rule Highlight Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-800/50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">
                THE MTM 48-HOUR GOLDEN RULE
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-tight">
                No seller receives purchase funds until the equipment has been physically delivered and successfully completed the agreed 48-hour verification/trial period.
              </p>
            </div>
          </div>
          <a
            href="#printable-agreement"
            onClick={(e) => { e.preventDefault(); window.print(); }}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center space-x-1.5 shrink-0 border border-white/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </a>
        </div>

        {/* Main Body Layout with Sidebar Navigation */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-2 sm:p-3 space-y-1 overflow-y-auto shrink-0 max-h-48 md:max-h-full border-b md:border-b-0">
            <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Agreement Sections
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    isActive 
                      ? 'bg-[#1E40AF] text-white shadow-xs' 
                      : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto text-slate-700 text-sm leading-relaxed space-y-6">
            
            {activeTab === 'golden-rule' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-[#1E40AF] pl-4 py-1">
                  <h3 className="text-lg font-black text-slate-900">
                    1. Core Escrow Protection & Fund Release Workflow
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clauses 3, 4, 25 & 106 • MTM Escrow & Transaction Guarantee
                  </p>
                </div>

                <p>
                  MTM Escrow is a transaction-protection mechanism under which purchase funds are held in a secure, regulated account pending physical delivery and successful completion of pre-delivery inspection and 48-hour operational trial.
                </p>

                {/* Workflow Diagram */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-black uppercase text-slate-500 tracking-wider">
                    Sequential Escrow Release Lifecycle
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                      <div className="font-extrabold text-[#1E40AF]">1. Buyer Payment</div>
                      <div className="text-[10px] text-slate-500">Funds Protected</div>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                      <div className="font-extrabold text-[#1E40AF]">2. On-Site Test</div>
                      <div className="text-[10px] text-slate-500">Diagnostic Inspection</div>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                      <div className="font-extrabold text-[#1E40AF]">3. Freight Delivery</div>
                      <div className="text-[10px] text-slate-500">Logistics Confirmation</div>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                      <div className="font-extrabold text-emerald-600">4. 48-Hr Trial</div>
                      <div className="text-[10px] text-slate-500">Buyer Accepts & Release</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs space-y-2 text-blue-900">
                  <div className="font-extrabold flex items-center space-x-1.5 text-[#1E40AF]">
                    <ShieldCheck className="w-4 h-4 text-[#1E40AF]" />
                    <span>Core MTM Guarantee Statement</span>
                  </div>
                  <p>
                    MTM guarantees the transaction-protection process. MTM does not release funds to the Seller before physical delivery and successful verification, except where the Buyer voluntarily confirms early release or a contractually disclosed exception applies.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'parties-purpose' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-slate-800 pl-4 py-1">
                  <h3 className="text-lg font-black text-slate-900">
                    2. Parties, Scope & Mutual Protections
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clauses 1, 2, 55, 56 & 57 • Platform Scope & User Responsibilities
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                    <div className="font-extrabold text-emerald-900 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Buyer Protections</span>
                    </div>
                    <ul className="list-disc list-inside text-emerald-800 space-y-1">
                      <li>Protection against material misdescription & undisclosed defects</li>
                      <li>Protection against non-delivery or wrong equipment substitution</li>
                      <li>Right to physical pre-delivery testing and 48-hour operational trial</li>
                      <li>Guaranteed 100% refund or repair remedy for qualifying defects</li>
                    </ul>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs space-y-2">
                    <div className="font-extrabold text-indigo-900 flex items-center space-x-1">
                      <ShieldCheck className="w-4 h-4 text-[#1E40AF]" />
                      <span>Seller Protections</span>
                    </div>
                    <ul className="list-disc list-inside text-indigo-800 space-y-1">
                      <li>Proof of full buyer escrow funding prior to dispatch</li>
                      <li>Documented objective pre-delivery diagnostic reports</li>
                      <li>Protection against arbitrary refusal or buyer trial misuse</li>
                      <li>Guaranteed automatic release upon successful trial expiry</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'off-platform' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-rose-600 pl-4 py-1">
                  <h3 className="text-lg font-black text-slate-900">
                    3. Strict Prohibition on Off-Platform Payment
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clause 7 • Payment Integrity & Circumvention Rules
                  </p>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 space-y-2">
                  <div className="font-extrabold text-rose-800 flex items-center space-x-1.5">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>Zero Tolerance for Direct Cash Transfers</span>
                  </div>
                  <p>
                    Neither Sellers nor Buyers shall instruct, pressure, or arrange payments outside MTM (e.g., personal bank transfers, cash payments, cryptocurrency, or off-platform splitting).
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="font-extrabold text-slate-900">Consequences of Off-Platform Payment Attempts:</div>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Immediate forfeiture of MTM Escrow & Transaction Guarantee protection.</li>
                    <li>Instant cancellation of active orders and suspension of marketplace listings.</li>
                    <li>Permanent account suspension for fraud attempt or platform circumvention.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'inspection' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-amber-500 pl-4 py-1">
                  <h3 className="text-lg font-black text-slate-900">
                    4. Physical On-Site Inspection & Operational Testing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clauses 8, 9, 12, 13 & 14 • Pre-Dispatch Diagnostic Protocols
                  </p>
                </div>

                <p>
                  Every protected machinery or heavy equipment transaction undergoes physical diagnostic testing before dispatch by MTM Certified Senior Mechanical Engineers or authorized specialists.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-extrabold text-slate-900">CNC Press Brake / Router</div>
                    <div className="text-slate-600 mt-1">Power-up, controller diagnostics, spindle operation, hydraulic pressure test, emergency stop test.</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-extrabold text-slate-900">Woodworking Edge Bander</div>
                    <div className="text-slate-600 mt-1">Heating element temperature reach, glue tank feed rate, end trimming, flush trimming, buffing unit test.</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-extrabold text-slate-900">Industrial Diesel Generator</div>
                    <div className="text-slate-600 mt-1">Cold/warm starting, AVR voltage output stability, 100% load bank response test, oil pressure check.</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-extrabold text-slate-900">Air Compressor / Receiver</div>
                    <div className="text-slate-600 mt-1">Pressure build-up speed, cutoff switch calibration, pressure retention over 60 mins, leak checks.</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trial-period' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-indigo-600 pl-4 py-1">
                  <h3 className="text-lg font-black text-slate-900">
                    5. 48-Hour Verification & Operational Trial Period
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clauses 18, 19, 20, 21, 23 & 24 • Operational Trial Rules
                  </p>
                </div>

                <p>
                  The 48-hour trial begins upon confirmed physical delivery (or completion of contractual installation/commissioning). It affords the Buyer a practical window to test equipment under normal factory working conditions.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                  <div className="font-extrabold text-slate-900">Buyer Duties & Prohibitions During Trial:</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1 text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                      <div className="font-bold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Permitted Action</span>
                      </div>
                      <p>Run standard materials, test control parameters, verify motor load, verify tolerances with qualified operators.</p>
                    </div>
                    <div className="space-y-1 text-rose-800 bg-rose-50 p-3 rounded-lg border border-rose-200">
                      <div className="font-bold flex items-center space-x-1">
                        <Ban className="w-3.5 h-3.5" />
                        <span>Prohibited Action</span>
                      </div>
                      <p>Dismantling major assemblies, substituting components, modifying wiring, or operating outside rated capacity.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'refunds-fccpa' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-blue-600 pl-4 py-1">
                  <h3 className="text-lg font-black text-slate-900">
                    6. Refund Policy & Statutory FCCPA Compliance
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clauses 28, 29, 30 & 93 • Nigerian Consumer Law Protections
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-2">
                  <div className="font-extrabold text-[#1E40AF]">Federal Competition & Consumer Protection Act (FCCPA) Preservation</div>
                  <p>
                    Nothing in this agreement excludes or restricts mandatory statutory consumer rights under the FCCPA of the Federal Republic of Nigeria. Consumers retain full legal rights concerning goods being reasonably suitable, of good quality, and in good working order.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="font-extrabold text-emerald-900">Refundable Conditions</div>
                    <ul className="list-disc list-inside text-emerald-800 mt-1 space-y-0.5">
                      <li>Non-delivery by seller within agreed timeframe</li>
                      <li>Material misdescription or wrong equipment model</li>
                      <li>Un-disclosed material mechanical defect</li>
                      <li>Failure to meet agreed operational trial criteria</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-extrabold text-slate-900">Non-Refundable Exceptions</div>
                    <ul className="list-disc list-inside text-slate-700 mt-1 space-y-0.5">
                      <li>Custom-cut timber, metal sheets, or processed goods</li>
                      <li>Special import equipment pre-approved for buyer specs</li>
                      <li>Normal wear & tear disclosed prior to sale</li>
                      <li>Mobilization costs already incurred for completed services</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'repairs-materials' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-amber-600 pl-4 py-1">
                  <h3 className="text-lg font-black text-slate-900">
                    7. Repair-First Remedy, Consumables & Custom Orders
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clauses 31, 32, 42, 43 & 44 • Remedial Options
                  </p>
                </div>

                <p>
                  Where minor defects occur during trial, the parties may elect a <strong>Repair-First Remedy</strong> or partial escrow adjustment (e.g., funding replacement parts or engineer dispatch) before contract cancellation.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                  <div className="font-extrabold">Exclusion of Wear & Tear Consumables</div>
                  <p>
                    Standard consumable components (blades, drill bits, drive belts, air filters, glue, cutting oils) are excluded from extended return rights unless proven defective at initial unboxing.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'disputes' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-rose-600 pl-4 py-1">
                  <h3 className="text-lg font-black text-slate-900">
                    8. MTM Dispute Center & Escrow Freeze
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clauses 48, 51, 53 & 94 • Independent 3-Party Mediation Desk
                  </p>
                </div>

                <p>
                  If a buyer submits a qualifying defect report prior to trial expiry, the transaction status immediately transitions to <strong>ESCROW DISPUTED</strong>.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="font-extrabold text-slate-900">Escrow Freeze Protocol:</div>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Funds remain frozen in escrow until formal 3-party resolution.</li>
                    <li>MTM Senior Engineers review diagnostic video/photo evidence submitted by both parties.</li>
                    <li>Possible outcomes include Full Refund, Partial Escrow Adjustment, Seller Machine Repair, or Machine Replacement.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'legal-nitda' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-indigo-700 pl-4 py-1">
                  <h3 className="text-lg font-black text-slate-900">
                    9. Governance, NITDA NPKI Framework & Audit Trails
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clauses 87, 88, 99 & 110 • Digital Signature & Legal Enforceability
                  </p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-900 space-y-2">
                  <div className="font-extrabold">NITDA Public Key Infrastructure (NPKI) Recognition</div>
                  <p>
                    In accordance with the NITDA NPKI framework of the Federal Republic of Nigeria, electronic acceptances, timestamps, IP records, cryptographic transaction certificates, and digital logs generated by MTM serve as legally binding non-repudiation evidence.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'matrix' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-emerald-600 pl-4 py-1">
                  <h3 className="text-lg font-black text-slate-900">
                    10. Protected Transaction Classes Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clause 115 • Escrow Safeguard Schedule
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase text-[10px]">
                      <tr>
                        <th className="p-3 border-b">Transaction Class</th>
                        <th className="p-3 border-b">Physical Inspection</th>
                        <th className="p-3 border-b">48-Hour Trial</th>
                        <th className="p-3 border-b">Escrow Release Timing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Used Machinery</td>
                        <td className="p-3 text-emerald-700 font-bold">Mandatory</td>
                        <td className="p-3 text-emerald-700 font-bold">Mandatory</td>
                        <td className="p-3">After 48-hr trial completion</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Power Equipment & Gensets</td>
                        <td className="p-3 text-emerald-700 font-bold">Mandatory</td>
                        <td className="p-3 text-emerald-700 font-bold">Mandatory</td>
                        <td className="p-3">After 48-hr load test trial</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Industrial Raw Materials</td>
                        <td className="p-3 text-blue-700 font-bold">Quantity & Grade Check</td>
                        <td className="p-3 text-slate-400">N/A (Unboxing Check)</td>
                        <td className="p-3">After delivery verification</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Servicing & Installation</td>
                        <td className="p-3 text-blue-700 font-bold">Service Verification</td>
                        <td className="p-3 text-slate-400">Where Applicable</td>
                        <td className="p-3">After sign-off certificate</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Action / Acceptance Footer */}
        <div className="bg-slate-900 text-white p-4 sm:px-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* Checkbox confirmation */}
          <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-slate-300">
            <input 
              type="checkbox"
              checked={hasConfirmedCheckbox}
              onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span>
              I have read, understood, and agree to the <strong>MTM Escrow & Transaction Guarantee Agreement</strong> (Version 1.0, Federal Republic of Nigeria, NITDA NPKI & FCCPA Compliant).
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 w-full sm:w-auto shrink-0 justify-end">
            <button
              onClick={handleDecline}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-rose-300 hover:text-rose-200 border border-slate-700 hover:border-rose-800 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Ban className="w-4 h-4 text-rose-400" />
              <span>Decline / Reject</span>
            </button>

            <button
              onClick={handleAccept}
              disabled={!hasConfirmedCheckbox}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition shadow-md flex items-center space-x-2 cursor-pointer ${
                hasConfirmedCheckbox 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Accept & Confirm Agreement</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
