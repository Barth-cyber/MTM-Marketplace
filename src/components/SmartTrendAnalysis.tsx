import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Layers, 
  DollarSign, 
  Activity, 
  BarChart3, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Building2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Product, SmartProductTrend } from '../types';
import { getProductTrendAnalysis } from '../utils/trendAnalysis';
import { useMarketplace } from '../context/MarketplaceContext';

interface SmartTrendAnalysisProps {
  product: Product;
  onSetPriceAlert?: () => void;
  onAskAI?: () => void;
}

export const SmartTrendAnalysis: React.FC<SmartTrendAnalysisProps> = ({
  product,
  onSetPriceAlert,
  onAskAI,
}) => {
  const { formatPrice, currency } = useMarketplace();
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number | null>(null);

  const trend: SmartProductTrend = getProductTrendAnalysis(product);
  const isPositiveVelocity = trend.twelveMonthChangePct >= 0;

  // Maximum price in historical dataset for scaling the SVG chart
  const maxPrice = Math.max(...trend.historicalPrices.map(p => p.priceNGN), trend.replacementCostNewNGN * 0.85);

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* ── 1. AI BUYING VERDICT & TOP METRIC CARDS ── */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden border border-blue-800/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-800/40">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block">
                  MTM AI Market Valuation Index
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Smart Trend & Valuation Dossier
                </h3>
              </div>
            </div>

            {/* Verdict Badge */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-300">Procurement Timing:</span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-xs flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{trend.aiBuyingVerdict}</span>
              </span>
            </div>
          </div>

          {/* 4 Metric Summary Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            
            {/* 1. 12-Month Trajectory */}
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-300 block">12-Month Trajectory</span>
              <div className="flex items-center space-x-1.5">
                {isPositiveVelocity ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                )}
                <span className={`text-sm font-black ${isPositiveVelocity ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositiveVelocity ? `+${trend.twelveMonthChangePct}%` : `${trend.twelveMonthChangePct}%`}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                {isPositiveVelocity ? 'Market appreciation' : 'Clearance discount'}
              </span>
            </div>

            {/* 2. Demand Velocity */}
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-300 block">Demand Velocity</span>
              <div className="flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-black text-amber-300">{trend.demandVelocity}</span>
              </div>
              <span className="text-[10px] text-slate-400 block">{trend.marketScarcity}</span>
            </div>

            {/* 3. 2-Year Residual Value */}
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-300 block">2-Yr Residual Value</span>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-black text-white">{trend.residualRetention2Yr}%</span>
              </div>
              <span className="text-[10px] text-slate-400 block">{trend.residualRetention4Yr}% at 48 Months</span>
            </div>

            {/* 4. Replacement Cost Savings */}
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-300 block">Vs. Brand New Import</span>
              <div className="flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-black text-emerald-300">-{trend.replacementSavingsPct}%</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Capex capital preserved</span>
            </div>
          </div>

          {/* AI Explanation Paragraph */}
          <div className="p-3.5 rounded-xl bg-blue-900/30 border border-blue-700/40 text-xs text-slate-200 leading-relaxed flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">AI Industrial Economics Assessment:</strong>
              <p>{trend.aiVerdictExplanation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. 12-MONTH HISTORICAL PRICE TRAJECTORY & CHART ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#1E40AF]" />
              <span>12-Month Historical Price Trajectory & Market Benchmark</span>
            </h4>
            <p className="text-xs text-slate-500">
              Audited transaction indices from Nigerian industrial hubs & pre-tariff import averages
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#1E40AF]" />
              <span className="text-slate-600 font-medium">Asking / Recorded Price</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-300" />
              <span className="text-slate-600 font-medium">Market Average</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end h-44 border-b border-slate-200 pb-3">
            {trend.historicalPrices.map((point, index) => {
              const heightPct = Math.round((point.priceNGN / maxPrice) * 100);
              const avgHeightPct = Math.round((point.marketAverageNGN / maxPrice) * 100);
              const isSelected = selectedPeriodIndex === index;
              const isCurrent = index === trend.historicalPrices.length - 1;

              return (
                <div 
                  key={point.period}
                  onClick={() => setSelectedPeriodIndex(index)}
                  className="flex flex-col items-center h-full justify-end cursor-pointer group relative"
                >
                  {/* Tooltip on Hover / Selected */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none">
                    {formatPrice(point.priceNGN, point.priceUSD)}
                  </div>

                  {/* Dual Bars (Price & Benchmark) */}
                  <div className="w-full flex items-end justify-center space-x-1 sm:space-x-2 h-36">
                    {/* Market Avg Bar */}
                    <div 
                      className="w-2.5 sm:w-4 bg-slate-200 group-hover:bg-slate-300 rounded-t-sm transition-all"
                      style={{ height: `${avgHeightPct}%` }}
                      title={`Market Average: ${formatPrice(point.marketAverageNGN, Math.round(point.marketAverageNGN / 1480))}`}
                    />

                    {/* Actual Price Bar */}
                    <div 
                      className={`w-3 sm:w-6 rounded-t-md transition-all shadow-xs ${
                        isCurrent 
                          ? 'bg-[#1E40AF] group-hover:bg-[#1D4ED8] ring-2 ring-blue-300 ring-offset-1' 
                          : 'bg-blue-600/80 group-hover:bg-blue-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  {/* Period Label */}
                  <div className="mt-2 text-center">
                    <span className={`text-[10px] font-bold block truncate max-w-full ${
                      isCurrent ? 'text-[#1E40AF] font-black' : 'text-slate-600'
                    }`}>
                      {point.period.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-400 hidden sm:block">
                      {point.period.split(' ')[1] || ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Replacement Cost Reference Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium text-[11px] block">
                Brand-New Replacement Benchmark (CIF Lagos + Clearing):
              </span>
              <div className="text-base font-black text-slate-900">
                {formatPrice(trend.replacementCostNewNGN, Math.round(trend.replacementCostNewNGN / 1500))}
              </div>
              <p className="text-[10px] text-slate-400">
                Based on current 2026 manufacturer catalogue prices and port tariff schedules.
              </p>
            </div>

            <div className="flex flex-col justify-center sm:items-end space-y-1">
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-block">
                Immediate ₦{( (trend.replacementCostNewNGN - product.priceNGN) / 1_000_000 ).toFixed(1)}M Capex Advantage
              </span>
              <p className="text-[11px] text-slate-600 font-medium">
                Saves <strong className="text-emerald-700 font-extrabold">{trend.replacementSavingsPct}%</strong> compared to new plant acquisition.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. REGIONAL INDUSTRIAL HUB DEMAND VELOCITY ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Nigerian Industrial Clusters Demand Velocity</span>
            </h4>
            <p className="text-xs text-slate-500">
              Active verified buyer searches and average liquidity speed by industrial district
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            High Regional Demand
          </span>
        </div>

        <div className="space-y-3">
          {trend.regionalDemand.map(hub => {
            const isHighDemand = hub.demandScore >= 85;

            return (
              <div key={hub.hub} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <strong className="text-slate-900 font-bold">{hub.hub}</strong>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="text-slate-500">
                      Active RFQs: <strong className="text-slate-800 font-bold">{hub.activeBuyers} buyers</strong>
                    </span>
                    <span className="text-slate-500">
                      Liquidity: <strong className="text-slate-800 font-bold">~{hub.avgDaysOnMarket} days</strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isHighDemand 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-blue-100 text-[#1E40AF]'
                    }`}>
                      {hub.demandLevel}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isHighDemand ? 'bg-emerald-500' : 'bg-[#1E40AF]'
                    }`}
                    style={{ width: `${hub.demandScore}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. QUICK ACTION PROMPTS ── */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 block font-bold">Need a custom capex appraisal?</strong>
            <span className="text-slate-500">Ask the MTM AI Equipment Advisor to run power, output, and payback math.</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {onSetPriceAlert && (
            <button
              onClick={onSetPriceAlert}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition shadow-2xs"
            >
              Monitor Price
            </button>
          )}
          {onAskAI && (
            <button
              onClick={onAskAI}
              className="px-3.5 py-1.5 rounded-lg bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold transition shadow-2xs flex items-center space-x-1"
            >
              <span>Consult AI Advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
