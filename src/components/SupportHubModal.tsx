import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Mail, 
  FileCheck, 
  ShieldAlert, 
  Truck, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Send 
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useDraggableModal } from '../hooks/useDraggableModal';

export const SupportHubModal: React.FC = () => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const { 
    isSupportHubOpen, 
    setIsSupportHubOpen, 
    siteSettings, 
    showToast 
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'contact' | 'faqs' | 'safety' | 'ticket'>('contact');
  
  // Ticket form state
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Escrow & Payment');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [currentRefId, setCurrentRefId] = useState('');

  if (!isSupportHubOpen) return null;

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketMessage) {
      showToast('⚠️ Please fill out all required fields.');
      return;
    }
    const generatedId = `MTM-${Math.floor(100000 + Math.random() * 900000)}`;
    setCurrentRefId(generatedId);
    setTicketSubmitted(true);
    showToast(`✓ Ticket ${generatedId} dispatched successfully to mtmmachinetoolsmaterials@gmail.com.`);
  };

  const resetTicketForm = () => {
    setTicketName('');
    setTicketEmail('');
    setTicketCategory('Escrow & Payment');
    setTicketMessage('');
    setTicketSubmitted(false);
    setCurrentRefId('');
  };

  const faqs = [
    {
      q: "How does the MTM Escrow Guarantee protect my funds?",
      a: "When you place an order, your funds are held securely in the MTM Escrow Account. Funds are only disbursed to the seller after the machinery has been physically delivered, certified by our technicians, and after your 48-hour operational trial has completed without disputes."
    },
    {
      q: "What is included in the Pre-Purchase Technical Inspection?",
      a: "Our certified engineers perform complete electrical insulation tests, mechanical runout measurements on gears, bearing temperature tracking, and safety control audits under load. A detailed report with a certified rating score is uploaded directly to your account before dispatch."
    },
    {
      q: "Who handles the heavy logistics and crane offloading?",
      a: "MTM partners with heavy freight operators across Nigeria. During checkout, you can opt for Freight Assistance. Our team will coordinate flatbed heavy transport, specialized rigging, and crane offloading directly at your factory site."
    },
    {
      q: "How do I raise an evidence-based dispute if a machine arrives faulty?",
      a: "Within your 48-hour trial window, go to the Dispute Center on your dashboard. Upload diagnostic logs, physical test videos, and inspector reports. MTM Legal & Technical board will review the evidence and hold or refund your escrow funds as appropriate."
    }
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 overflow-y-auto animate-fadeIn">
      <div 
        style={modalStyle}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-auto"
      >
        
        {/* Header */}
        <div 
          {...dragHandleProps}
          className="bg-slate-900 text-white p-5 flex items-center justify-between sticky top-0 z-10 cursor-grab active:cursor-grabbing select-none shrink-0"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">MTM Industrial Support Hub</h2>
              <p className="text-xs text-slate-400">Escrow verification, logistics assistance, and technical hotlines</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSupportHubOpen(false)}
            className="no-drag p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 px-5 bg-slate-50 flex overflow-x-auto text-xs font-bold scrollbar-none shrink-0">
          <button 
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-3.5 border-b-2 transition whitespace-nowrap ${activeTab === 'contact' ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-slate-500 hover:text-slate-850'}`}
          >
            Helpline & Chat
          </button>
          <button 
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-3.5 border-b-2 transition whitespace-nowrap ${activeTab === 'faqs' ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-slate-500 hover:text-slate-850'}`}
          >
            Frequently Asked FAQs
          </button>
          <button 
            onClick={() => setActiveTab('safety')}
            className={`px-4 py-3.5 border-b-2 transition whitespace-nowrap ${activeTab === 'safety' ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-slate-500 hover:text-slate-850'}`}
          >
            Escrow & Safety Guide
          </button>
          <button 
            onClick={() => setActiveTab('ticket')}
            className={`px-4 py-3.5 border-b-2 transition whitespace-nowrap ${activeTab === 'ticket' ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-slate-500 hover:text-slate-850'}`}
          >
            Submit Support Ticket
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 text-slate-800">
          
          {/* TAB 1: Helpline */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-1">Live Support Status: Active</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  MTM technical representatives and logistics coordinators are standing by to assist with transaction guarantees, 3-phase heavy power tests, and flatbed transport.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between hover:border-slate-350 transition">
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">Immediate Phone Hotline</h5>
                    <p className="text-[11px] text-slate-500">Call for urgent technical validation or escrow status inquiries.</p>
                  </div>
                  <a href={`tel:${siteSettings.helplinePhone}`} className="text-xs font-black text-[#1E40AF] hover:underline flex items-center gap-1">
                    <span>{siteSettings.helplinePhone}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between hover:border-slate-350 transition">
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">WhatsApp Escrow Desk</h5>
                    <p className="text-[11px] text-slate-500">Send equipment inspection videos or ask about bank guarantees.</p>
                  </div>
                  <a href="https://wa.me/2348066062008" target="_blank" rel="noreferrer" className="text-xs font-black text-emerald-700 hover:underline flex items-center gap-1">
                    <span>Chat on WhatsApp</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between hover:border-slate-350 transition">
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">Corporate Email Support</h5>
                    <p className="text-[11px] text-slate-500">Request formal corporate invoice quotes, contracts or listings audits.</p>
                  </div>
                  <a href="mailto:support@mtm-nigeria.gov.ng" className="text-xs font-black text-purple-700 hover:underline flex items-center gap-1">
                    <span>support@mtm.ng</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="p-4 border border-dashed rounded-xl space-y-2 bg-slate-50">
                <h5 className="text-xs font-black text-slate-900">MTM Online Marketplace Hub — Benin City, Edo State</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Location: Benin City, Edo State.<br />
                  As an online e-commerce business, MTM Marketplace serves sellers, buyers, suppliers, dealers, and the general public both locally and internationally within and beyond the industrial ecosystem.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: FAQs */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 mb-2">Frequently Asked Technical & Transactional Questions</h3>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 border border-slate-150 rounded-xl bg-slate-50/50 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" />
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">{faq.q}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pl-6">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Escrow Guide */}
          {activeTab === 'safety' && (
            <div className="space-y-5">
              <h3 className="text-sm font-black text-slate-900">The MTM 6-Step Escrow Guarantee Journey</h3>
              
              <div className="space-y-3 font-medium text-xs text-slate-700">
                <div className="p-3 border rounded-xl flex items-center gap-3 bg-white shadow-3xs">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold shrink-0 text-xs">1</div>
                  <p><strong>Buyer Places Funds:</strong> Buyer pays invoice. Funds lock safely in MTM central escrow.</p>
                </div>
                <div className="p-3 border rounded-xl flex items-center gap-3 bg-white shadow-3xs">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold shrink-0 text-xs">2</div>
                  <p><strong>Rigorous Technical Inspection:</strong> Certified engineer checks motor insulation and wear before loading.</p>
                </div>
                <div className="p-3 border rounded-xl flex items-center gap-3 bg-white shadow-3xs">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold shrink-0 text-xs">3</div>
                  <p><strong>Secure Flatbed Transit:</strong> Heavy transit partners coordinate transport and on-site crane offloading.</p>
                </div>
                <div className="p-3 border rounded-xl flex items-center gap-3 bg-white shadow-3xs">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold shrink-0 text-xs">4</div>
                  <p><strong>48-Hour Operational Trial:</strong> Buyer receives 48 hours to run machine under load in their workshop.</p>
                </div>
                <div className="p-3 border rounded-xl flex items-center gap-3 bg-white shadow-3xs">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold shrink-0 text-xs">5</div>
                  <p><strong>Dispute Desk (Optional):</strong> If issue occurs, funds stay frozen until diagnostics evidence is reviewed.</p>
                </div>
                <div className="p-3 border rounded-xl flex items-center gap-3 bg-white shadow-3xs">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold shrink-0 text-xs">6</div>
                  <p><strong>Funds Released:</strong> Upon confirmation or trial timeout, funds disburse securely to the seller.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Submit Ticket */}
          {activeTab === 'ticket' && (
            <div className="space-y-4">
              {ticketSubmitted ? (
                <div className="p-8 text-center space-y-5 border rounded-xl bg-slate-50/50">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-base text-slate-900">Support Ticket Received!</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Your ticket has been dispatched to MTM Logistics & Escrow Desk.
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      All notifications are securely routed to <strong className="text-slate-800">mtmmachinetoolsmaterials@gmail.com</strong>.
                    </p>
                    <div className="pt-2">
                      <p className="text-[12px] font-mono font-black text-slate-700 bg-white border border-slate-200 inline-block px-4 py-1.5 rounded-lg shadow-2xs">
                        Reference ID: {currentRefId || 'MTM-826811'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 space-y-4">
                    <button 
                      onClick={resetTicketForm}
                      className="px-5 py-2.5 bg-[#1E40AF] text-white text-xs font-black rounded-lg hover:bg-blue-800 transition shadow-2xs cursor-pointer"
                    >
                      Submit Another Ticket
                    </button>
                    <p className="text-[10px] text-amber-700 font-extrabold block">
                      MTM support hotline is active 24/7 for escrow safety holds.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block">Your Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={ticketName}
                        onChange={e => setTicketName(e.target.value)}
                        placeholder="e.g., Aliyu Yusuf"
                        className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block">Contact Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={ticketEmail}
                        onChange={e => setTicketEmail(e.target.value)}
                        placeholder="e.g., aliyu@yusuf-industries.com"
                        className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block">Support Category *</label>
                    <select 
                      value={ticketCategory}
                      onChange={e => setTicketCategory(e.target.value)}
                      className="w-full p-2.5 border rounded-lg bg-white focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Escrow & Payment">Escrow Guarantee & Bank Transfer Verification</option>
                      <option value="Technical Inspection">Pre-purchase Engineering Inspections</option>
                      <option value="Logistics & Crane Help">Heavy Transport & Offloading Logistics</option>
                      <option value="Seller Account">Seller Account & Listing Moderation</option>
                      <option value="Technical Dispute">Buyer Trial Issue & Escrow Lock</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block">Detailed Description *</label>
                    <textarea 
                      required
                      rows={4}
                      value={ticketMessage}
                      onChange={e => setTicketMessage(e.target.value)}
                      placeholder="Please describe your technical issue, transaction ID, or transport coordinates in full detail."
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-blue-500 bg-white text-xs"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-lg font-black flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Support Ticket</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>MTM support hotline is active 24/7 for escrow safety holds.</span>
          <button 
            onClick={() => setIsSupportHubOpen(false)}
            className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
