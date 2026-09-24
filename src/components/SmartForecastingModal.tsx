import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { X, TrendingUp, AlertTriangle, CheckCircle, HelpCircle, BarChart3, Calendar, Sparkles, ShoppingBag, GripHorizontal } from 'lucide-react';
import { INDUSTRIAL_HUBS } from '../data/mockData';
import { useDraggableModal } from '../hooks/useDraggableModal';

interface ForecastItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  monthlyVelocity: number;
  predictedDemandNextMonth: number;
  safetyStock: number;
  recommendedOrder: number;
  status: 'Critical Risk' | 'Healthy' | 'Overstocked';
  hub: string;
  leadTimeDays: number;
}

const INITIAL_FORECASTS: ForecastItem[] = [
  {
    id: 'f-1',
    name: 'Jowat PUR Edgebanding Glue Pellets (25kg)',
    category: 'Materials',
    currentStock: 12,
    monthlyVelocity: 45,
    predictedDemandNextMonth: 58,
    safetyStock: 15,
    recommendedOrder: 61,
    status: 'Critical Risk',
    hub: 'Benin City Hub',
    leadTimeDays: 5
  },
  {
    id: 'f-2',
    name: 'Freud Professional Carbide Saw Blades',
    category: 'Workshop Tools',
    currentStock: 48,
    monthlyVelocity: 30,
    predictedDemandNextMonth: 52,
    safetyStock: 20,
    recommendedOrder: 24,
    status: 'Healthy',
    hub: 'Lagos Hub',
    leadTimeDays: 7
  },
  {
    id: 'f-3',
    name: 'PVC Edgebanding Coil Walnut (2mm x 100m)',
    category: 'Materials',
    currentStock: 5,
    monthlyVelocity: 25,
    predictedDemandNextMonth: 35,
    safetyStock: 10,
    recommendedOrder: 40,
    status: 'Critical Risk',
    hub: 'Benin City Hub',
    leadTimeDays: 4
  },
  {
    id: 'f-4',
    name: 'Tellus ISO 68 Hydraulic Oil (20L)',
    category: 'Consumables',
    currentStock: 90,
    monthlyVelocity: 20,
    predictedDemandNextMonth: 18,
    safetyStock: 15,
    recommendedOrder: 0,
    status: 'Overstocked',
    hub: 'Lagos Hub',
    leadTimeDays: 10
  },
  {
    id: 'f-5',
    name: 'Solid Carbide Straight Router Bits (12mm)',
    category: 'Workshop Tools',
    currentStock: 19,
    monthlyVelocity: 35,
    predictedDemandNextMonth: 44,
    safetyStock: 12,
    recommendedOrder: 37,
    status: 'Critical Risk',
    hub: 'Benin City Hub',
    leadTimeDays: 6
  }
];

export const SmartForecastingModal: React.FC = () => {
  const { isForecastingOpen, setIsForecastingOpen, showToast, addToCart } = useMarketplace();
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const [selectedHubFilter, setSelectedHubFilter] = useState<string>('All Hubs');
  const [confidenceInterval, setConfidenceInterval] = useState<number>(95);
  const [forecastMonths, setForecastMonths] = useState<number>(1);
  const [forecasts, setForecasts] = useState<ForecastItem[]>(INITIAL_FORECASTS);

  if (!isForecastingOpen) return null;

  const filteredForecasts = forecasts.filter(item => {
    if (selectedHubFilter === 'All Hubs') return true;
    return item.hub === selectedHubFilter;
  });

  const handleTriggerReorder = (item: ForecastItem) => {
    // Simulate reordering item by adding to cart
    showToast(`🛒 Added suggested reorder of ${item.recommendedOrder}x ${item.name.slice(0, 25)}... to cart.`);
    // Close forecasting or stay open
  };

  const handleRecalculate = () => {
    // Simulate updating calculations based on confidence interval
    const adjusted = forecasts.map(item => {
      const multiplier = confidenceInterval / 95;
      const predicted = Math.round(item.predictedDemandNextMonth * multiplier * forecastMonths);
      const recommended = Math.max(0, predicted + item.safetyStock - item.currentStock);
      const status = item.currentStock < item.safetyStock 
        ? 'Critical Risk' 
        : item.currentStock > predicted * 1.5 
          ? 'Overstocked' 
          : 'Healthy';
      return {
        ...item,
        predictedDemandNextMonth: predicted,
        recommendedOrder: recommended,
        status: status as any
      };
    });
    setForecasts(adjusted);
    showToast(`📊 Recalculated forecasting metrics using ${confidenceInterval}% confidence interval for ${forecastMonths} month(s).`);
  };

  return (
    <div id="smart-forecasting-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 overflow-y-auto animate-fadeIn">
      <div 
        id="smart-forecasting-container" 
        style={modalStyle}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-100 my-auto animate-slideUp"
      >
        
        {/* Header */}
        <div 
          {...dragHandleProps}
          className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between select-none shrink-0"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">AI-Powered Smart Inventory Forecasting</h2>
              </div>
              <p className="text-xs text-slate-500">Predictive demand velocity & automatic stock replenishment suggestions</p>
            </div>
          </div>
          <button
            onClick={() => setIsForecastingOpen(false)}
            className="no-drag p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 border border-slate-200 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="p-5 bg-indigo-50/40 border-b border-indigo-100/50 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-indigo-800 tracking-wider mb-1.5">Industrial Warehouse Hub</label>
            <select
              value={selectedHubFilter}
              onChange={(e) => setSelectedHubFilter(e.target.value)}
              className="w-full bg-white text-xs border border-indigo-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All Hubs">All Hubs & Locations</option>
              <option value="Benin City Hub">Benin City Hub (Edo State)</option>
              <option value="Lagos Hub">Lagos Hub (Ikeja Estate)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-indigo-800 tracking-wider mb-1.5">Statistical Confidence</label>
            <select
              value={confidenceInterval}
              onChange={(e) => setConfidenceInterval(Number(e.target.value))}
              className="w-full bg-white text-xs border border-indigo-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={80}>80% Confidence (Aggressive)</option>
              <option value={90}>90% Confidence (Moderate)</option>
              <option value={95}>95% Confidence (Recommended)</option>
              <option value={99}>99% Confidence (Conservative)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-indigo-800 tracking-wider mb-1.5">Forecast Horizon</label>
            <select
              value={forecastMonths}
              onChange={(e) => setForecastMonths(Number(e.target.value))}
              className="w-full bg-white text-xs border border-indigo-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={1}>1 Month (Sept 2026)</option>
              <option value={2}>2 Months (Sept-Oct 2026)</option>
              <option value={3}>3 Months (Q4 2026)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRecalculate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Update Projections</span>
            </button>
          </div>
        </div>

        {/* Main Forecasting List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-900">Seasonal Demand Surge Warning (Benin City Hub)</h3>
              <p className="text-[11px] text-amber-800 mt-1">
                Regional data shows a woodworking and furniture-production surge of <strong>+38%</strong> beginning mid-September due to regional construction cycles. 
                Edgebanding glue and Carbide saw blades are at <strong>high risk of stockouts</strong>. Safety threshold adjustments recommended.
              </p>
            </div>
          </div>

          {/* Forecasting List */}
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Predictive Demand</th>
                  <th className="py-3 px-4">Forecasting Status</th>
                  <th className="py-3 px-4">Suggested Reorder</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredForecasts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded">{item.category}</span>
                        <span>•</span>
                        <span>{item.hub}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{item.currentStock} units</div>
                      <div className="text-[10px] text-slate-500">Min Safety: {item.safetyStock}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-indigo-700 flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>{item.predictedDemandNextMonth} units</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Velocity: {item.monthlyVelocity}/mo</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === 'Critical Risk' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 font-bold text-[10px] rounded-full border border-red-100">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
                          Critical Risk
                        </span>
                      ) : item.status === 'Overstocked' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full border border-amber-100">
                          Overstocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-100">
                          Healthy Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.recommendedOrder > 0 ? (
                        <div className="font-black text-emerald-700">+{item.recommendedOrder} units</div>
                      ) : (
                        <div className="text-slate-400">—</div>
                      )}
                      <div className="text-[10px] text-slate-500">Lead time: {item.leadTimeDays}d</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.recommendedOrder > 0 ? (
                        <button
                          onClick={() => handleTriggerReorder(item)}
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition text-[10px] flex items-center gap-1 inline-flex cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Replenish</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Adequate</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Forecasting algorithms sync with Benin City, Edo State Hub and Lagos Hub every 6 hours.</span>
          </div>
          <button
            onClick={() => {
              showToast("📧 Exported inventory forecasting projections report (PDF & CSV) successfully.");
            }}
            className="font-bold text-indigo-700 hover:underline cursor-pointer"
          >
            Export CSV Forecast
          </button>
        </div>

      </div>
    </div>
  );
};
