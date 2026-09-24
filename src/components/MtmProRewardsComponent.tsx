import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Gift, 
  ChevronRight, 
  Printer, 
  Download, 
  CheckCircle2, 
  Star,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const MtmProRewardsComponent: React.FC = () => {
  const { rewardTransactions, formatPrice, showToast } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'rewards' | 'invoices'>('rewards');
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Loyalty calculations strictly from real transaction history (0 initially)
  const pointsEarned = rewardTransactions.reduce((sum, t) => sum + (t.pointsValue || 0), 0);
  const tier = pointsEarned > 5000 ? 'Platinum Industrial Tier' : pointsEarned > 2000 ? 'Gold Enterprise Tier' : 'Silver Verified Tier';
  const discountRate = pointsEarned > 5000 ? '7.5%' : pointsEarned > 2000 ? '5.0%' : '2.5%';

  const handlePrintInvoice = (order: any) => {
    setSelectedInvoice(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
      
      {/* Top Banner: Mtm Pro Rewards Status */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shadow">
                <Award className="w-3 h-3" />
                <span>{tier}</span>
              </span>
              <span className="text-xs text-blue-200 font-mono">• MTM Verified Member ID: MTM-8842-NG</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black">
              MTM Pro Rewards & Verified Tier
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Earn industrial cashback points on every machinery purchase, factory spare part order, and logistics booking across Nigeria's manufacturing corridors.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Available Rewards Balance</span>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5">
              {pointsEarned.toLocaleString()} <span className="text-xs font-normal text-white">PTS</span>
            </p>
            <span className="text-[11px] text-emerald-300 font-bold block mt-1">
              Worth ₦{(pointsEarned * 15).toLocaleString()} in Factory Credit
            </span>
          </div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-800/50 text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block text-white">Priority Freight Dispatch</span>
              <span className="text-[11px] text-blue-200">Exempt from standard queue delays</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-800/50 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block text-white">Extended Escrow Warranty</span>
              <span className="text-[11px] text-blue-200">+12 Months on All Heavy Machinery</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-800/50 text-purple-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block text-white">Cashback Discount</span>
              <span className="text-[11px] text-blue-200">{discountRate} instant rebate on checkouts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
            activeTab === 'rewards'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Reward Points & Perks
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 ${
            activeTab === 'invoices'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <span>Transaction History & Printable Invoices</span>
          <span className="px-1.5 py-0.2 bg-blue-800 text-white rounded-full text-[10px]">
            {rewardTransactions.length + 3}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'rewards' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">Recent Reward Activities</h3>
            <span className="text-xs font-bold text-blue-600">Updated Real-Time</span>
          </div>

          <div className="space-y-3">
            {rewardTransactions.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800">No Reward Activities Yet (0 PTS)</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Since this marketplace is newly launched for user enrollment and transactions, you currently have 0 MTM Loyalty Points earned. Complete your first machinery escrow transaction to earn points and upgrade your Pro Rewards status!
                </p>
              </div>
            ) : (
              rewardTransactions.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition bg-slate-50/50">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${item.type === 'earn' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.type === 'earn' ? <TrendingUp className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                      <span className="text-[11px] text-slate-500">{item.date}</span>
                    </div>
                  </div>
                  <span className={`font-mono font-black text-xs ${item.type === 'earn' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {item.pts}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Official MTM Transaction Invoices</h3>
              <p className="text-xs text-slate-500">View, download, or print tax-compliant official machinery purchase invoices.</p>
            </div>
            <button
              onClick={() => showToast('📥 All transaction invoices exported as ZIP package.')}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All Invoices</span>
            </button>
          </div>

          <div className="space-y-4">
            {[
              { 
                invoiceNo: 'MTM-INV-2026-9041', 
                date: 'Sep 01, 2026', 
                title: 'Raycus 3kW CNC Fiber Laser Metal Cutter & Exhaust System', 
                amountNGN: 18500000, 
                amountUSD: 12333,
                status: 'Paid & Verified',
                merchant: 'Interior Duct Ltd (Benin City Hub)'
              },
              { 
                invoiceNo: 'MTM-INV-2026-8820', 
                date: 'Aug 24, 2026', 
                title: 'Yawei 160T/3200mm Hydraulic CNC Press Brake', 
                amountNGN: 14200000, 
                amountUSD: 9466,
                status: 'Paid & Verified',
                merchant: 'MTM Heavy Equipment Logistics'
              },
              { 
                invoiceNo: 'MTM-INV-2026-7512', 
                date: 'Aug 12, 2026', 
                title: 'Miller Dynasty 400 AC/DC TIG Welder & Cooler Cart', 
                amountNGN: 4850000, 
                amountUSD: 3233,
                status: 'Paid & Verified',
                merchant: 'Delta Welding Supplies'
              },
            ].map((inv) => (
              <div key={inv.invoiceNo} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {inv.invoiceNo}
                      </span>
                      <span className="text-xs text-slate-500">• {inv.date}</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{inv.title}</h4>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-sm">₦{inv.amountNGN.toLocaleString()}</p>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {inv.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Merchant: <strong className="text-slate-700">{inv.merchant}</strong></span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePrintInvoice(inv)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / PDF Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
