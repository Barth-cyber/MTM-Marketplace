import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  Package, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Zap, 
  Layers, 
  MapPin, 
  Smartphone, 
  Mail, 
  Sparkles,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useDraggableModal } from '../hooks/useDraggableModal';

export interface InventoryAlertItem {
  id: string;
  itemName: string;
  category: string;
  hub: string;
  thresholdType: 'low_stock' | 'restock' | 'price_threshold';
  thresholdValue: number;
  unit: string;
  channels: ('whatsapp' | 'email' | 'in_app')[];
  active: boolean;
  createdAt: string;
  lastTriggered?: string;
  currentStockInHub?: number;
}

const INITIAL_ALERTS: InventoryAlertItem[] = [
  {
    id: 'inv-1',
    itemName: '300mm Carbide Panel Saw Scoring Blades (Pair)',
    category: 'Workshop Tools',
    hub: 'Benin City, Edo State',
    thresholdType: 'low_stock',
    thresholdValue: 5,
    unit: 'Pairs',
    channels: ['whatsapp', 'email', 'in_app'],
    active: true,
    createdAt: '24 Aug 2026',
    currentStockInHub: 3,
    lastTriggered: '2 Hours Ago (Stock dropped to 3)'
  },
  {
    id: 'inv-2',
    itemName: 'EVA Hot-Melt Transparent Glue Pellets (25kg Bag)',
    category: 'Materials',
    hub: 'Oregun Industrial Area, Lagos',
    thresholdType: 'low_stock',
    thresholdValue: 10,
    unit: 'Bags',
    channels: ['whatsapp', 'in_app'],
    active: true,
    createdAt: '20 Aug 2026',
    currentStockInHub: 4,
    lastTriggered: 'Yesterday'
  },
  {
    id: 'inv-3',
    itemName: '4-Axis Heavy Duty CNC Wood Router (Used)',
    category: 'Industrial Machinery',
    hub: 'All Hubs & Locations',
    thresholdType: 'restock',
    thresholdValue: 1,
    unit: 'Units',
    channels: ['whatsapp', 'email', 'in_app'],
    active: true,
    createdAt: '15 Aug 2026',
    currentStockInHub: 0,
  }
];

// Low stock items currently in catalog
const LOW_STOCK_CATALOG_PREVIEWS = [
  {
    id: 'p-101',
    title: '300mm TCT Carbide Scoring Blades for Panel Saw',
    category: 'Workshop Tools',
    hub: 'Benin City Hub',
    stock: 3,
    minThreshold: 5,
    priceNGN: 145000,
    image: '/images/scm_panel_saw_1790179186875.jpg'
  },
  {
    id: 'p-102',
    title: 'EVA Hot-Melt Edge Banding Glue Pellets (25kg)',
    category: 'Materials',
    hub: 'Lagos Hub',
    stock: 2,
    minThreshold: 10,
    priceNGN: 185000,
    image: '/images/edge_bander_banner.jpg'
  },
  {
    id: 'p-103',
    title: '3-Phase 15HP Electric Dust Collector Motor',
    category: 'Electrical',
    hub: 'Kano Hub',
    stock: 1,
    minThreshold: 3,
    priceNGN: 820000,
    image: '/images/rotary_screw_compressor_1790179219452.jpg'
  }
];

interface InventoryAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryAlertModal: React.FC<InventoryAlertModalProps> = ({
  isOpen,
  onClose
}) => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const { formatPrice, showToast } = useMarketplace();
  const [alerts, setAlerts] = useState<InventoryAlertItem[]>(INITIAL_ALERTS);
  const [activeTab, setActiveTab] = useState<'my_alerts' | 'create_alert' | 'low_stock_monitor'>('my_alerts');

  // New alert form state
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Furniture Manufacturing');
  const [hub, setHub] = useState('All Hubs & Locations');
  const [thresholdType, setThresholdType] = useState<'low_stock' | 'restock' | 'price_threshold'>('low_stock');
  const [thresholdValue, setThresholdValue] = useState<number>(5);
  const [unit, setUnit] = useState('Units');
  const [whatsapp, setWhatsapp] = useState(true);
  const [email, setEmail] = useState(true);
  const [inApp, setInApp] = useState(true);

  if (!isOpen) return null;

  const handleToggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    showToast('Inventory alert status updated');
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Inventory alert removed');
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      showToast('Please enter an equipment or spare part name');
      return;
    }

    const newAlert: InventoryAlertItem = {
      id: `inv-${Date.now()}`,
      itemName,
      category,
      hub,
      thresholdType,
      thresholdValue,
      unit,
      channels: [
        ...(whatsapp ? ['whatsapp' as const] : []),
        ...(email ? ['email' as const] : []),
        ...(inApp ? ['in_app' as const] : []),
      ],
      active: true,
      createdAt: 'Just now',
      currentStockInHub: 2
    };

    setAlerts([newAlert, ...alerts]);
    setItemName('');
    setActiveTab('my_alerts');
    showToast(`Inventory alert active for "${itemName}"`);
  };

  const handleSimulateAlertTrigger = (itemNameStr: string) => {
    showToast(`🔔 ALERT TRIGGERED: "${itemNameStr}" stock dropped below threshold! WhatsApp notification dispatched.`);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        style={modalStyle}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 my-auto"
      >
        
        {/* Header */}
        <div 
          {...dragHandleProps}
          className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 text-white flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">Smart Inventory & Stock Alert System</h2>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold uppercase">
                  Real-Time
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Automated stock monitoring, low-level warnings & restock alerts across Nigerian hubs
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

        {/* Sub-Header Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 pt-3 flex space-x-3 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('my_alerts')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'my_alerts' ? 'border-amber-600 text-amber-800 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-600" />
            <span>My Configured Alerts ({alerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('low_stock_monitor')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'low_stock_monitor' ? 'border-amber-600 text-amber-800 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Hub Low Stock Monitor</span>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-full font-bold">3 Low</span>
          </button>

          <button
            onClick={() => setActiveTab('create_alert')}
            className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'create_alert' ? 'border-amber-600 text-amber-800 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>+ Set New Stock Alert</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">

          {/* TAB 1: MY CONFIGURED ALERTS */}
          {activeTab === 'my_alerts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Active Stock Level Rules
                </span>
                <button
                  onClick={() => setActiveTab('create_alert')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Alert Rule</span>
                </button>
              </div>

              {alerts.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Bell className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="text-xs">No active inventory alerts configured. Click "Set New Stock Alert" to track spare parts or machinery availability.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map(a => (
                    <div
                      key={a.id}
                      className={`p-4 rounded-xl border transition space-y-3 ${
                        a.active ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{a.itemName}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1E40AF]">
                              {a.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{a.hub}</span>
                          </p>
                        </div>

                        {/* Active Toggle Switch */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleAlert(a.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                              a.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${a.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span>{a.active ? 'Active' : 'Paused'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteAlert(a.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Remove Alert"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Trigger Rule</span>
                          <span className="font-bold text-slate-800">
                            {a.thresholdType === 'low_stock' && `Notify when Stock < ${a.thresholdValue} ${a.unit}`}
                            {a.thresholdType === 'restock' && `Notify when Restocked / Available`}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Notification Channels</span>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-bold text-slate-700">
                            {a.channels.includes('whatsapp') && (
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">WhatsApp</span>
                            )}
                            {a.channels.includes('email') && (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">Email</span>
                            )}
                            {a.channels.includes('in_app') && (
                              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded">In-App</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Hub Stock State</span>
                            <span className="font-extrabold text-amber-700">
                              {a.currentStockInHub !== undefined ? `${a.currentStockInHub} ${a.unit} Available` : 'Checking...'}
                            </span>
                          </div>

                          <button
                            onClick={() => handleSimulateAlertTrigger(a.itemName)}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] rounded transition cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Test Alert</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HUB LOW STOCK MONITOR */}
          {activeTab === 'low_stock_monitor' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Marketplace Low Stock Warning:</strong> These high-demand tooling items have dropped below safety thresholds across Nigerian industrial hubs.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {LOW_STOCK_CATALOG_PREVIEWS.map(item => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-3 shadow-2xs">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-28 object-cover rounded-lg border border-slate-100"
                    />
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded">
                        Critical: Only {item.stock} left
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">{item.hub}</p>
                      <p className="text-xs font-black text-[#1E40AF]">{formatPrice(item.priceNGN)}</p>
                    </div>

                    <button
                      onClick={() => {
                        setItemName(item.title);
                        setActiveTab('create_alert');
                      }}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      <span>Set Restock Alert</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE NEW STOCK ALERT FORM */}
          {activeTab === 'create_alert' && (
            <form onSubmit={handleCreateAlert} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Configure New Equipment / Part Stock Threshold</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Equipment / Spare Part Title</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g., Sliding Table Panel Saw Scoring Blades, Polyurethane Glue, 15HP Compressor"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="Furniture Manufacturing">Furniture Manufacturing</option>
                      <option value="Industrial Machinery">Industrial Machinery</option>
                      <option value="Workshop Tools">Workshop Tools</option>
                      <option value="Materials">Materials & Supplies</option>
                      <option value="Electrical">Electrical & Power</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Industrial Hub</label>
                    <select
                      value={hub}
                      onChange={(e) => setHub(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="All Hubs & Locations">All Hubs & Locations</option>
                      <option value="Benin City, Edo State">Benin City, Edo State</option>
                      <option value="Oregun Industrial Area, Lagos">Oregun Industrial Area, Lagos</option>
                      <option value="Bompai Industrial Area, Kano">Bompai Industrial Area, Kano</option>
                      <option value="Trans-Amadi Layout, Port Harcourt">Trans-Amadi Layout, Port Harcourt</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Trigger Condition</label>
                    <select
                      value={thresholdType}
                      onChange={(e) => setThresholdType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="low_stock">Low Stock Warning</option>
                      <option value="restock">Restock / New Arrival</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Quantity Threshold</label>
                    <input
                      type="number"
                      min={1}
                      value={thresholdValue}
                      onChange={(e) => setThresholdValue(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Unit</label>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="e.g., Units, Bags, Pairs"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-2">Notification Channels</label>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="text-emerald-800">WhatsApp Instant Alert</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={email}
                        onChange={(e) => setEmail(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Email Digest</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={inApp}
                        onChange={(e) => setInApp(e.target.checked)}
                        className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                      />
                      <span>In-App Banner</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('my_alerts')}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition shadow-md flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Activate Stock Alert Rule</span>
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
