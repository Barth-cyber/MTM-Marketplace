import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Store, 
  ShieldAlert, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Heart, 
  Clock, 
  Bookmark, 
  Star, 
  Settings, 
  PlusCircle, 
  DollarSign, 
  Users, 
  Layers, 
  AlertTriangle, 
  BarChart3, 
  CheckCircle2, 
  FileText, 
  TrendingUp,
  Building2,
  Sparkles,
  Lock,
  Trash2,
  Edit3,
  ShieldCheck,
  PhoneCall,
  Image,
  Palette,
  History
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useDraggableModal } from '../hooks/useDraggableModal';

interface PrototypesDashboardProps {
  initialRole?: 'buyer' | 'seller' | 'admin';
  onClose: () => void;
}

export const PrototypesDashboard: React.FC<PrototypesDashboardProps> = ({ initialRole = 'buyer', onClose }) => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const { 
    products, 
    cart, 
    offers, 
    inspections, 
    userListings, 
    priceAlerts, 
    setIsSellModalOpen, 
    formatPrice, 
    showToast,
    openOrderTracking,
    setIsInventoryAlertOpen,
    openDisputeCenter,
    isAdminAuthenticated,
    loginAsAdmin,
    logoutAdmin,
    usersList,
    createUser,
    editUser,
    deleteUser,
    toggleDecommissionUser,
    siteSettings,
    updateSiteSettings,
    payoutsList,
    completePayout,
    calculatePayoutCommission,
    isSellerAuthenticated,
    sellerUser,
    logoutSeller,
    recentlyViewed,
    clearRecentlyViewed,
    setActiveProduct,
  } = useMarketplace();
  const [role, setRole] = useState<'buyer' | 'seller' | 'admin'>(initialRole);
  
  // Buyer tabs
  const [buyerTab, setBuyerTab] = useState<'orders' | 'saved' | 'messages' | 'recent' | 'searches' | 'reviews' | 'settings'>('orders');
  // Seller tabs
  const [sellerTab, setSellerTab] = useState<'overview' | 'products' | 'add' | 'orders' | 'messages' | 'brm' | 'customers' | 'sales' | 'reviews' | 'payouts' | 'settings' | 'verification'>('overview');
  // Admin tabs
  const [adminTab, setAdminTab] = useState<'dashboard' | 'users' | 'sellers' | 'products' | 'categories' | 'orders' | 'payments' | 'reviews' | 'disputes' | 'reports' | 'moderation' | 'analytics' | 'settings' | 'media' | 'theme' | 'audit_logs'>('dashboard');

  const [auditLogs, setAuditLogs] = useState<any[]>(() => {
    const cached = localStorage.getItem('mtm_admin_audit_logs');
    if (cached) {
      try { return JSON.parse(cached); } catch(e) {}
    }
    return [
      { id: 'log-1', timestamp: '2026-08-30 18:24:12', actor: 'admin@mtm.ng', action: 'System Config', details: 'Updated Lagos Hub commission fee from 4.5% to 4.0%', hub: 'Lagos Hub' },
      { id: 'log-2', timestamp: '2026-08-30 17:41:05', actor: 'admin@mtm.ng', action: 'User Moderate', details: 'Decommissioned seller account Apex Industrial Workshop', hub: 'Lagos Hub' },
      { id: 'log-3', timestamp: '2026-08-30 16:15:30', actor: 'admin@mtm.ng', action: 'Payout Process', details: 'Disbursed ₦7,500,000 escrow balance payout to SCM Woodwork Benin Ltd', hub: 'Benin City Hub' },
      { id: 'log-4', timestamp: '2026-08-30 15:02:45', actor: 'admin@mtm.ng', action: 'Security Audit', details: 'Root physical site inspection audit report filed for Interior Duct Ltd', hub: 'Benin City Hub' },
    ];
  });

  const addAuditLog = (action: string, details: string, hub: string = 'Lagos Hub') => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'admin@mtm.ng',
      action,
      details,
      hub
    };
    setAuditLogs(prev => {
      const next = [newLog, ...prev];
      localStorage.setItem('mtm_admin_audit_logs', JSON.stringify(next));
      return next;
    });
  };

  // Admin local states
  const [adminPin, setAdminPin] = useState('');
  
  // User Creation State
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState('Buyer');
  const [searchUserQuery, setSearchUserQuery] = useState('');

  // Media Manager Local State
  const [mediaList, setMediaList] = useState<any[]>(() => {
    return [
      { id: 'media-1', title: 'SCM Panel Saw High Resolution', url: '/images/scm_panel_saw_1790179186875.jpg', size: '2.4 MB', category: 'Machinery', date: '2026-08-20' },
      { id: 'media-2', title: 'CNC Router Axis Detail', url: '/images/heavy_cnc_router_1790206292970.jpg', size: '1.8 MB', category: 'Machinery', date: '2026-08-22' },
      { id: 'media-3', title: 'Dust Extraction Unit Profile', url: '/images/rotary_screw_compressor_1790179219452.jpg', size: '920 KB', category: 'Peripherals', date: '2026-08-25' },
      { id: 'media-4', title: 'Industrial Warehouse Mockup', url: '/images/industrial_forklift_1790206270683.jpg', size: '4.2 MB', category: 'Logistics', date: '2026-08-18' }
    ];
  });
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState('Machinery');
  const [searchMediaQuery, setSearchMediaQuery] = useState('');

  // User Editing State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserRole, setEditUserRole] = useState('Buyer');

  // Website Customizer Local State
  const [settTitle, setSettTitle] = useState(siteSettings?.siteTitle || 'MTM Nigeria');
  const [settAnnouncement, setSettAnnouncement] = useState(siteSettings?.announcementText || '');
  const [settHeadline, setSettHeadline] = useState(siteSettings?.landingHeadline || '');
  const [settSubheadline, setSettSubheadline] = useState(siteSettings?.landingSubheadline || '');
  const [settMerchant, setSettMerchant] = useState(siteSettings?.featuredMerchant || '');
  const [settPhone, setSettPhone] = useState(siteSettings?.helplinePhone || '08066062008');
  const [settStatus, setSettStatus] = useState(siteSettings?.systemStatus || 'Operational');

  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.siteTitle) setSettTitle(siteSettings.siteTitle);
      if (siteSettings.announcementText !== undefined) setSettAnnouncement(siteSettings.announcementText);
      if (siteSettings.landingHeadline) setSettHeadline(siteSettings.landingHeadline);
      if (siteSettings.landingSubheadline) setSettSubheadline(siteSettings.landingSubheadline);
      if (siteSettings.featuredMerchant) setSettMerchant(siteSettings.featuredMerchant);
      if (siteSettings.helplinePhone) setSettPhone(siteSettings.helplinePhone);
      if (siteSettings.systemStatus) setSettStatus(siteSettings.systemStatus);
    }
  }, [siteSettings]);

  const startEditingUser = (u: any) => {
    setEditingUserId(u.id);
    setEditUserName(u.name);
    setEditUserEmail(u.email);
    setEditUserPhone(u.phone || '');
    setEditUserRole(u.role);
  };

  const saveUserEdit = () => {
    if (!editUserName || !editUserEmail) {
      showToast('⚠️ Name and Email are required.');
      return;
    }
    editUser(editingUserId!, {
      name: editUserName,
      email: editUserEmail,
      phone: editUserPhone,
      role: editUserRole
    });
    setEditingUserId(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      siteTitle: settTitle,
      announcementText: settAnnouncement,
      landingHeadline: settHeadline,
      landingSubheadline: settSubheadline,
      featuredMerchant: settMerchant,
      helplinePhone: settPhone,
      systemStatus: settStatus
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 pt-14 sm:pt-16 pb-8 overflow-y-auto animate-fadeIn">
      <div 
        style={modalStyle}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-auto"
      >
        
        {/* Top Header Bar with Draggable Handle */}
        <div 
          {...dragHandleProps}
          className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-10 h-10 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center font-black">
              MTM
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">MTM Command Centre & Portals</h2>
              <p className="text-xs text-slate-400">Interactive multi-tier portal for Buyers, Sellers, and Platform Operations</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Role Switcher */}
            <div className="no-drag bg-slate-800 p-1 rounded-xl flex items-center space-x-1 border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setRole('buyer')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                  role === 'buyer' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Buyer Dashboard</span>
              </button>

              <button
                onClick={() => setRole('seller')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                  role === 'seller' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller Centre</span>
              </button>

              <button
                onClick={() => setRole('admin')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                  role === 'admin' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="no-drag p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
              title="Close dialog"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── ROLE 1: BUYER DASHBOARD ── */}
        {role === 'buyer' && (
          <div className="flex flex-col md:flex-row flex-1">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-1 text-xs font-bold shrink-0">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase px-3 pb-2">My Account</div>
              
              <button
                onClick={() => setBuyerTab('orders')}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${
                  buyerTab === 'orders' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Orders ({cart.length})</span>
              </button>

              <button
                onClick={() => setBuyerTab('saved')}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${
                  buyerTab === 'saved' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Saved Machines ({products.slice(0, 3).length})</span>
              </button>

              <button
                onClick={() => setBuyerTab('messages')}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${
                  buyerTab === 'messages' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Messages (2 unread)</span>
              </button>

              <button
                onClick={() => setBuyerTab('recent')}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${
                  buyerTab === 'recent' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Recently Viewed</span>
              </button>

              <button
                onClick={() => setBuyerTab('searches')}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${
                  buyerTab === 'searches' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Saved Searches ({priceAlerts.length})</span>
              </button>

              <button
                onClick={() => setBuyerTab('reviews')}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${
                  buyerTab === 'reviews' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Reviews & Ratings</span>
              </button>

              <button
                onClick={() => setBuyerTab('settings')}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${
                  buyerTab === 'settings' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </button>
            </div>

            {/* Buyer Main Area */}
            <div className="flex-1 p-6 space-y-6 bg-white">
              {buyerTab === 'orders' && (
                <div className="space-y-4">
                  <h3 className="text-base font-black text-slate-900">Active Escrow Orders & RFQs</h3>
                  {cart.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-700">No active orders in cart</p>
                      <p className="text-xs text-slate-500 mt-1">Browse our industrial catalog to place escrow orders or request quotes.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.product.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50">
                          <div className="flex items-center space-x-3">
                            <img src={item.product.images[0]} alt={item.product.title} className="w-14 h-14 rounded-lg object-cover border" />
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs">{item.product.title}</h4>
                              <span className="text-[11px] text-slate-500">Qty: {item.quantity} • Escrow Protected</span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-[#1E40AF]">
                            {formatPrice(item.product.priceNGN * item.quantity, item.product.priceUSD ? item.product.priceUSD * item.quantity : undefined)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {buyerTab === 'saved' && (
                <div className="space-y-4">
                  <h3 className="text-base font-black text-slate-900">Saved Machines & Wishlist</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.slice(0, 4).map(p => (
                      <div key={p.id} className="p-3 border border-slate-200 rounded-xl flex items-center space-x-3 bg-white">
                        <img src={p.images[0]} alt={p.title} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{p.title}</h4>
                          <span className="text-xs font-black text-[#1E40AF]">{formatPrice(p.priceNGN, p.priceUSD)}</span>
                          <span className="text-[10px] text-emerald-700 block mt-1">In Stock • Benin City Hub</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {buyerTab === 'messages' && (
                <div className="space-y-4">
                  <h3 className="text-base font-black text-slate-900">Buyer & Seller Direct Messages</h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-slate-900">Midwest Woodworks & Machinery Ltd</span>
                        <span className="text-slate-400 text-[10px]">14 mins ago</span>
                      </div>
                      <p className="text-xs text-slate-700">"Your inspection booking for the SCM Panel Saw has been confirmed for Tuesday at 10:00 AM at our Uselu Industrial Axis warehouse."</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-slate-900">Premier Woodtech & Machinery</span>
                        <span className="text-slate-400 text-[10px]">Yesterday</span>
                      </div>
                      <p className="text-xs text-slate-700">"Counter-offer of ₦6,500,000 accepted for the Edge Bander. Ready for escrow checkout."</p>
                    </div>
                  </div>
                </div>
              )}

              {buyerTab === 'recent' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Recently Viewed Machinery</h3>
                      <p className="text-[11px] text-slate-500">Persisted across sessions in localStorage</p>
                    </div>
                    {recentlyViewed.length > 0 && (
                      <button
                        onClick={() => {
                          clearRecentlyViewed();
                          showToast('🗑️ Cleared recently viewed history.');
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-1 bg-rose-50 rounded-lg transition"
                      >
                        Clear History
                      </button>
                    )}
                  </div>

                  {recentlyViewed.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
                      <p className="text-xs text-slate-500">No recently viewed machinery found. Click on any product in the catalog or showroom to track your browsing history.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {recentlyViewed.map(p => (
                        <div 
                          key={p.id} 
                          onClick={() => {
                            setActiveProduct(p);
                            onClose();
                            showToast(`🔍 Opening: ${p.title}`);
                          }}
                          className="p-3 border border-slate-200 rounded-xl space-y-2 bg-white hover:border-blue-400 transition cursor-pointer group shadow-2xs"
                        >
                          <img src={p.images[0]} alt={p.title} className="w-full h-28 object-cover rounded-lg group-hover:scale-[1.02] transition" />
                          <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-blue-600">{p.title}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-[#1E40AF]">{formatPrice(p.priceNGN, p.priceUSD)}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{p.deliveryOptions?.originHub || p.location?.city || 'Benin Hub'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {buyerTab === 'searches' && (
                <div className="space-y-4">
                  <h3 className="text-base font-black text-slate-900">Saved Searches & Price Alerts</h3>
                  <div className="space-y-2">
                    <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">Query: "used CNC machine under ₦5 million"</span>
                        <span className="text-[10px] text-slate-500">Alert active • Notifying on price drops</span>
                      </div>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Active</span>
                    </div>
                  </div>
                </div>
              )}

              {buyerTab === 'reviews' && (
                <div className="space-y-4">
                  <h3 className="text-base font-black text-slate-900">My Submitted Reviews</h3>
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">SCM Panel Saw Si400 Nova</span>
                      <span className="text-amber-500 font-black">★★★★★ 5.0</span>
                    </div>
                    <p className="text-slate-600">"Flawless cutting precision and robust escrow safety."</p>
                  </div>
                </div>
              )}

              {buyerTab === 'settings' && (
                <div className="space-y-4 text-xs">
                  <h3 className="text-base font-black text-slate-900">Account & Corporate Settings</h3>
                  <div className="space-y-3 max-w-lg">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                      <input type="text" defaultValue="Apex Industrial Fabrication Nig Ltd" className="w-full p-2.5 border rounded-lg bg-slate-50" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">CAC Registration Number</label>
                      <input type="text" defaultValue="RC 1498224" className="w-full p-2.5 border rounded-lg bg-slate-50" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Industrial Hub / Location</label>
                      <input type="text" defaultValue="Ikeja Industrial Zone, Lagos" className="w-full p-2.5 border rounded-lg bg-slate-50" />
                    </div>
                    <button onClick={() => showToast('Buyer profile settings updated successfully')} className="px-4 py-2 bg-[#1E40AF] text-white font-bold rounded-lg">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ROLE 2: SELLER CENTRE ── */}
        {role === 'seller' && (
          <div className="flex flex-col md:flex-row flex-1">
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-1 text-xs font-bold shrink-0">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase px-3 pb-2">Seller Centre</div>
              
              <button onClick={() => setSellerTab('overview')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${sellerTab === 'overview' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}>
                <BarChart3 className="w-4 h-4" /><span>Overview</span>
              </button>
              <button onClick={() => setSellerTab('products')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${sellerTab === 'products' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}>
                <Package className="w-4 h-4" /><span>Products ({userListings.length + 3})</span>
              </button>
              <button onClick={() => { setIsSellModalOpen(true); }} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition text-emerald-700 hover:bg-emerald-50`}>
                <PlusCircle className="w-4 h-4 text-emerald-600" /><span>Add Product</span>
              </button>
              <button onClick={() => setSellerTab('orders')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${sellerTab === 'orders' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}>
                <ShoppingCart className="w-4 h-4" /><span>Orders (12)</span>
              </button>
              <button onClick={() => setSellerTab('messages')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${sellerTab === 'messages' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}>
                <MessageSquare className="w-4 h-4" /><span>Messages & RFQs (5)</span>
              </button>
              <button onClick={() => setSellerTab('brm')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${sellerTab === 'brm' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100'}`}>
                <Sparkles className="w-4 h-4 text-[#1E40AF]" /><span>AI Support & BRM Copilot</span>
              </button>
              <button onClick={() => setSellerTab('customers')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${sellerTab === 'customers' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}>
                <Users className="w-4 h-4" /><span>Corporate Customers</span>
              </button>
              <button onClick={() => setSellerTab('sales')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${sellerTab === 'sales' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}>
                <DollarSign className="w-4 h-4" /><span>Sales & Payouts</span>
              </button>
              <button onClick={() => setSellerTab('reviews')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${sellerTab === 'reviews' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}>
                <Star className="w-4 h-4" /><span>Reviews (4.8 ★)</span>
              </button>
              <button onClick={() => setSellerTab('verification')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${sellerTab === 'verification' ? 'bg-[#1E40AF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}>
                <CheckCircle2 className="w-4 h-4" /><span>MTM Verification</span>
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6 bg-white">
              {sellerTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Seller Centre Dashboard</h3>
                      <p className="text-xs text-slate-500">Interior Duct Ltd / Midwest Woodworks (Benin City Hub)</p>
                    </div>
                    <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-black">
                      MTM Verified Tier 1 Seller
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border bg-slate-50">
                      <span className="text-xs text-slate-500">Total Revenue (30d)</span>
                      <span className="text-xl font-black text-slate-900 block mt-1">₦0</span>
                      <span className="text-[10px] text-slate-400">Ready for initial live orders</span>
                    </div>
                    <div className="p-4 rounded-xl border bg-slate-50">
                      <span className="text-xs text-slate-500">Completed Sales</span>
                      <span className="text-xl font-black text-slate-900 block mt-1">0 Machines</span>
                      <span className="text-[10px] text-slate-400">0 pending shipments</span>
                    </div>
                    <div className="p-4 rounded-xl border bg-slate-50">
                      <span className="text-xs text-slate-500">Response Rate</span>
                      <span className="text-xl font-black text-emerald-700 block mt-1">100% (Instant)</span>
                      <span className="text-[10px] text-emerald-600">Online & ready</span>
                    </div>
                  </div>
                </div>
              )}

              {sellerTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">My Machinery & Tool Listings</h3>
                    <button onClick={() => setIsSellModalOpen(true)} className="px-3 py-1.5 bg-[#1E40AF] text-white rounded-lg text-xs font-bold">
                      + Add New Listing
                    </button>
                  </div>
                  <div className="space-y-3">
                    {products.slice(0, 3).map(p => (
                      <div key={p.id} className="p-3 border rounded-xl flex items-center justify-between bg-slate-50 text-xs">
                        <div className="flex items-center space-x-3">
                          <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded object-cover" />
                          <div>
                            <h4 className="font-bold text-slate-900">{p.title}</h4>
                            <span className="text-slate-500">Stock: {p.stockQuantity || 1} Unit • Status: <strong className="text-emerald-700">Published</strong></span>
                          </div>
                        </div>
                        <span className="font-black text-[#1E40AF]">{formatPrice(p.priceNGN, p.priceUSD)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sellerTab === 'brm' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#1E40AF]" />
                        <h3 className="text-base font-black text-slate-900">AI Customer Support & BRM Copilot</h3>
                      </div>
                      <p className="text-xs text-slate-500">Autonomous customer relationship management, lead scoring, and instant AI response drafting</p>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-100 text-[#1E40AF] text-[11px] font-black rounded-full border border-blue-200">
                      AI Engine Active
                    </span>
                  </div>

                  {/* AI Lead Scoring & Intent Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Hot Inquiries (High Intent)</span>
                      <span className="text-xl font-black text-[#1E40AF]">4 Active Leads</span>
                      <p className="text-[11px] text-slate-600 font-medium">Average purchase intent score: 94%</p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">AI Auto-Draft Efficiency</span>
                      <span className="text-xl font-black text-emerald-700">92% Time Saved</span>
                      <p className="text-[11px] text-slate-600 font-medium">Instant technical specs & freight lookup</p>
                    </div>
                    <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Escrow Conversion Rate</span>
                      <span className="text-xl font-black text-amber-800">+38% Boost</span>
                      <p className="text-[11px] text-slate-600 font-medium">Automated inspection video sharing</p>
                    </div>
                  </div>

                  {/* Active Inquiries & Instant AI Response Assistant */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Priority Buyer Inquiries & RFQs</h4>

                    {/* Inquiry 1 */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-extrabold text-slate-900">Engr. Dapo Alabi (Apex Metal Fab, Lagos)</span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded">98% High Intent</span>
                        </div>
                        <span className="text-slate-400 text-[11px]">10 mins ago</span>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-slate-900 block">Inquiry regarding: Automatic Heavy Duty Edge Bander (₦6.8M)</span>
                        <p className="italic">"Good day, we require an edge bander for 1mm-3mm PVC edging on 18mm MDF panels in our Ikeja factory. Can you confirm if delivery includes technical calibration and if escrow release is done after test run?"</p>
                      </div>

                      {/* AI Response Preview */}
                      <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1E40AF] flex items-center gap-1 text-[11px]">
                            <Sparkles className="w-3.5 h-3.5 text-[#1E40AF]" /> AI Recommended Response Draft:
                          </span>
                          <span className="text-[10px] text-blue-700 font-bold">Includes 3-Phase testing info & Freight to Ikeja</span>
                        </div>
                        <p className="text-slate-800 leading-relaxed font-mono text-[11px] bg-white/80 p-2.5 rounded border border-blue-100">
                          "Hello Engr. Dapo! Thank you for contacting Interior Duct Ltd (Benin City). Yes, our Automatic Heavy Duty Edge Bander is fully calibrated for 0.4mm–3mm PVC/ABS edging on 18mm MDF. We provide MTM Pre-Shipment 4K Video Run-Test and include physical setup assistance. Through MTM Escrow, funds are held securely until your technical team confirms test run at your Ikeja facility. We can dispatch via heavy transport within 48 hours."
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => showToast('AI response sent to Engr. Dapo Alabi via MTM Escrow Chat')}
                            className="bg-[#1E40AF] hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>Send Draft to Buyer</span>
                          </button>
                          <button
                            onClick={() => showToast('AI updated response with custom 5% freight discount')}
                            className="bg-white hover:bg-slate-100 text-[#1E40AF] border border-blue-200 px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer"
                          >
                            Regenerate with Freight Discount
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Inquiry 2 */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <span className="font-extrabold text-slate-900">Chief K. Okonkwo (K-Wood Works, Port Harcourt)</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-[#1E40AF] text-[10px] font-black rounded">88% Medium Intent</span>
                        </div>
                        <span className="text-slate-400 text-[11px]">2 hours ago</span>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-slate-900 block">Inquiry regarding: SCM Si400 Nova Sliding Table Panel Saw</span>
                        <p className="italic">"What is the maximum scoring saw blade diameter and can MTM arrange heavy freight to Trans-Amadi Industrial Layout?"</p>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                        <span className="text-slate-600">AI Support Status: <strong className="text-slate-900">Freight quote ready (₦180,000 to Port Harcourt)</strong></span>
                        <button
                          onClick={() => showToast('AI auto-response dispatched to Chief K. Okonkwo')}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer"
                        >
                          Send Instant AI Response
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {sellerTab === 'verification' && (
                <div className="space-y-4 text-xs">
                  <h3 className="text-base font-black text-slate-900">MTM Physical Inspection & Verification Status</h3>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-800 font-black text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Verified Industrial Seller Badge Active</span>
                    </div>
                    <p className="text-slate-700">Your Benin City warehouse and showroom have passed MTM physical safety and machinery audit. 3-phase generator testing capabilities certified.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ROLE 3: ADMIN ADMINISTRATION ── */}
        {role === 'admin' && !isAdminAuthenticated && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 min-h-[480px]">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-5 animate-fadeIn">
              <div className="w-12 h-12 bg-blue-100 text-[#1E40AF] rounded-xl flex items-center justify-center mx-auto border border-blue-200">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900">Admin Command Centre</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Enter your secure administrator PIN code to access user moderation, site customization, and commission payouts.
                </p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const success = loginAsAdmin(adminPin);
                if (success) {
                  showToast('🔓 Access Granted! Welcome to the Master Admin Panel.');
                  setAdminPin('');
                } else {
                  showToast('❌ Access Denied: Invalid Administrator PIN code.');
                }
              }} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1 text-left">
                  <label className="block text-slate-600">Enter PIN</label>
                  <input
                    type="password"
                    required
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder=""
                    className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-blue-500 bg-slate-50 font-mono text-center text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1E40AF] text-white hover:bg-blue-800 rounded-lg font-black text-xs transition cursor-pointer"
                >
                  Verify PIN & Open Panel
                </button>
              </form>
            </div>
          </div>
        )}

        {role === 'admin' && isAdminAuthenticated && (
          <div className="flex flex-col md:flex-row flex-1">
            <div className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-4 space-y-1 text-xs font-bold shrink-0">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase px-3 pb-2 flex items-center justify-between">
                <span>MTM Administration</span>
                <button 
                  onClick={() => {
                    logoutAdmin();
                    showToast('🔒 Admin session closed.');
                  }}
                  className="text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                >
                  Log Out
                </button>
              </div>
              
              <button onClick={() => setAdminTab('dashboard')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${adminTab === 'dashboard' ? 'bg-[#1E40AF] text-white shadow-xs' : 'hover:bg-slate-800'}`}>
                <BarChart3 className="w-4 h-4" /><span>Dashboard Overview</span>
              </button>
              <button onClick={() => setAdminTab('users')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${adminTab === 'users' ? 'bg-[#1E40AF] text-white shadow-xs' : 'hover:bg-slate-800'}`}>
                <Users className="w-4 h-4" /><span>Manage Users ({usersList.length})</span>
              </button>
              <button onClick={() => setAdminTab('payments')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${adminTab === 'payments' ? 'bg-[#1E40AF] text-white shadow-xs' : 'hover:bg-slate-800'}`}>
                <DollarSign className="w-4 h-4" /><span>Admin Payouts</span>
              </button>
              <button onClick={() => setAdminTab('settings')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${adminTab === 'settings' ? 'bg-[#1E40AF] text-white shadow-xs' : 'hover:bg-slate-800'}`}>
                <Settings className="w-4 h-4" /><span>Site Customizer</span>
              </button>
              <button onClick={() => setAdminTab('media')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${adminTab === 'media' ? 'bg-[#1E40AF] text-white shadow-xs' : 'hover:bg-slate-800'}`}>
                <Image className="w-4 h-4" /><span>Media Manager ({mediaList.length})</span>
              </button>
              <button onClick={() => setAdminTab('theme')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${adminTab === 'theme' ? 'bg-[#1E40AF] text-white shadow-xs' : 'hover:bg-slate-800'}`}>
                <Palette className="w-4 h-4" /><span>Admin Color Scheme</span>
              </button>
              <button onClick={() => setAdminTab('sellers')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${adminTab === 'sellers' ? 'bg-[#1E40AF] text-white shadow-xs' : 'hover:bg-slate-800'}`}>
                <Store className="w-4 h-4" /><span>Sellers Verification Queue</span>
              </button>
              <button onClick={() => setAdminTab('audit_logs')} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 transition ${adminTab === 'audit_logs' ? 'bg-[#1E40AF] text-white shadow-xs' : 'hover:bg-slate-800'}`}>
                <History className="w-4 h-4" /><span>Admin Audit Logs ({auditLogs.length})</span>
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6 bg-white text-slate-900 overflow-y-auto max-h-[80vh]">
              
              {/* ADMIN TAB 1: DASHBOARD OVERVIEW */}
              {adminTab === 'dashboard' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">MTM Platform Control Tower</h3>
                      <p className="text-xs text-slate-500">Live operational oversight, user verification metrics, and commission ledger</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-200">
                      Master Session Secure
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border bg-slate-50/80 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">Gross GMV (YTD)</span>
                      <span className="text-xl font-black text-slate-900">₦0</span>
                      <p className="text-[10px] text-slate-400 font-bold">0 transactions (clean ledger ready)</p>
                    </div>
                    <div className="p-4 rounded-xl border bg-slate-50/80 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">Platform Comm. (YTD)</span>
                      <span className="text-xl font-black text-[#1E40AF]">₦0</span>
                      <p className="text-[10px] text-slate-400 font-bold">Dynamic escrow commission ready</p>
                    </div>
                    <div className="p-4 rounded-xl border bg-slate-50/80 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">Verified Users</span>
                      <span className="text-xl font-black text-slate-900">{usersList.length} Accounts</span>
                      <p className="text-[10px] text-emerald-600 font-bold">100% physically audited</p>
                    </div>
                    <div className="p-4 rounded-xl border bg-slate-50/80 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">System Health</span>
                      <span className="text-xl font-black text-emerald-700">99.98% OK</span>
                      <p className="text-[10px] text-slate-400 font-bold">Nigeria Local Hubs connected</p>
                    </div>
                  </div>

                  {/* Quick Action Matrix */}
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
                    <h4 className="text-xs font-black text-[#1E40AF] uppercase tracking-wider">Secure Administrative Capabilities</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      As an authenticated master administrator, you possess overriding credentials to edit or delete any user profiles, decommission malicious operators, dynamically alter commission margins with real-time recalculation, and modify site-wide marketing/headline layouts instantly. Use the tabs in the left sidebar to navigate.
                    </p>
                  </div>
                </div>
              )}

              {/* ADMIN TAB 2: USER MANAGEMENT (EDIT, CREATE, SEARCH, DELETE, DECOMMISSION) */}
              {adminTab === 'users' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900">User Profile Directory & Override Controls</h3>
                      <p className="text-xs text-slate-500">Edit credentials, create new users, or decommission accounts with overriding administrator privileges</p>
                    </div>
                    <button
                      onClick={() => setShowCreateUser(!showCreateUser)}
                      className="px-3.5 py-2 bg-[#1E40AF] hover:bg-blue-800 text-white font-extrabold text-xs rounded-lg shadow-2xs self-start transition"
                    >
                      {showCreateUser ? 'Hide Creator' : '+ Create User Profile'}
                    </button>
                  </div>

                  {/* Create New User Profile Form */}
                  {showCreateUser && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-slideDown">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#1E40AF] uppercase tracking-wider flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> Provision New User Account
                        </span>
                        <button 
                          onClick={() => setShowCreateUser(false)}
                          className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                        >
                          Dismiss Form
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-700">
                        <div className="space-y-1 font-semibold text-slate-700">
                          <label>Full Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Alhaji Mustapha Kano"
                            value={newUserName}
                            onChange={e => setNewUserName(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-slate-900 font-medium" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label>Email Address</label>
                          <input 
                            type="email" 
                            placeholder="mustapha@kano-heavy.ng"
                            value={newUserEmail}
                            onChange={e => setNewUserEmail(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-slate-900 font-medium" 
                          />
                        </div>
                        <div className="space-y-1 font-semibold text-slate-700">
                          <label>Phone Number</label>
                          <input 
                            type="text" 
                            placeholder="08033001122"
                            value={newUserPhone}
                            onChange={e => setNewUserPhone(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-slate-900 font-medium" 
                          />
                        </div>
                        <div className="space-y-1 font-semibold text-slate-700">
                          <label>Access Role</label>
                          <select 
                            value={newUserRole}
                            onChange={e => setNewUserRole(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-slate-900 font-medium"
                          >
                            <option value="Buyer">Buyer</option>
                            <option value="Seller">Seller</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => {
                            setShowCreateUser(false);
                            setNewUserName('');
                            setNewUserEmail('');
                            setNewUserPhone('');
                          }}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            if (!newUserName || !newUserEmail) {
                              showToast('⚠️ Name and Email are required.');
                              return;
                            }
                            createUser({
                              name: newUserName,
                              email: newUserEmail,
                              phone: newUserPhone,
                              role: newUserRole
                            });
                            addAuditLog('User Create', `Created new ${newUserRole} account for ${newUserName} (${newUserEmail})`);
                            setNewUserName('');
                            setNewUserEmail('');
                            setNewUserPhone('');
                            setShowCreateUser(false);
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs transition"
                        >
                          Provision Account
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline User Editor Form */}
                  {editingUserId && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-4 animate-slideDown">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#1E40AF] uppercase tracking-wider flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5" /> Editing User Account Credentials
                        </span>
                        <button 
                          onClick={() => setEditingUserId(null)}
                          className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                        >
                          Cancel Editing
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-700">
                        <div className="space-y-1">
                          <label>Full Name</label>
                          <input 
                            type="text" 
                            value={editUserName}
                            onChange={e => setEditUserName(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-slate-900 font-medium" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label>Email Address</label>
                          <input 
                            type="email" 
                            value={editUserEmail}
                            onChange={e => setEditUserEmail(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-slate-900 font-medium" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label>Phone Number</label>
                          <input 
                            type="text" 
                            value={editUserPhone}
                            onChange={e => setEditUserPhone(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-slate-900 font-medium" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label>Access Role</label>
                          <select 
                            value={editUserRole}
                            onChange={e => setEditUserRole(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-slate-900 font-medium"
                          >
                            <option value="Buyer">Buyer</option>
                            <option value="Seller">Seller</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => setEditingUserId(null)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                        >
                          Discard
                        </button>
                        <button 
                          onClick={saveUserEdit}
                          className="px-4 py-1.5 bg-[#1E40AF] text-white font-extrabold rounded-lg text-xs"
                        >
                          Save Credentials Override
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Search bar inside directory */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="🔍 Search users by name, email, or telephone..."
                      value={searchUserQuery}
                      onChange={e => setSearchUserQuery(e.target.value)}
                      className="w-full p-2.5 border rounded-lg text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {searchUserQuery && (
                      <button
                        onClick={() => setSearchUserQuery('')}
                        className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Users Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold">
                          <th className="p-3">User Details</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Administrative Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList
                          .filter(usr => {
                            if (!searchUserQuery.trim()) return true;
                            const query = searchUserQuery.toLowerCase();
                            return (
                              usr.name?.toLowerCase().includes(query) ||
                              usr.email?.toLowerCase().includes(query) ||
                              usr.phone?.toLowerCase().includes(query) ||
                              usr.role?.toLowerCase().includes(query)
                            );
                          })
                          .map(usr => (
                            <tr key={usr.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                              <td className="p-3">
                                <span className="font-bold text-slate-900 block">{usr.name}</span>
                                <span className="text-slate-400 text-[10.5px] font-medium">{usr.email}</span>
                              </td>
                              <td className="p-3 text-slate-600 font-mono">{usr.phone || '—'}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                  usr.role === 'Admin' ? 'bg-red-50 text-red-700 border border-red-100' :
                                  usr.role === 'Seller' ? 'bg-blue-50 text-[#1E40AF] border border-blue-100' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {usr.role}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  usr.isDecommissioned ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {usr.isDecommissioned ? '⚠️ Decommissioned' : '✓ Active & Verified'}
                                </span>
                              </td>
                              <td className="p-3 text-right space-x-1">
                                <button
                                  onClick={() => startEditingUser(usr)}
                                  className="px-2 py-1 border border-slate-200 bg-white text-slate-600 font-bold rounded-md hover:bg-slate-50 transition cursor-pointer"
                                  title="Edit user settings"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    toggleDecommissionUser(usr.id);
                                    addAuditLog('User Moderate', `${usr.isDecommissioned ? 'Re-activated' : 'Decommissioned'} account for user ${usr.name} (${usr.email})`);
                                    showToast(usr.isDecommissioned ? '🔓 User account re-activated.' : '⚠️ User decommissioned successfully.');
                                  }}
                                  className={`px-2 py-1 rounded-md font-bold text-white transition cursor-pointer ${
                                    usr.isDecommissioned ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                                  }`}
                                >
                                  {usr.isDecommissioned ? 'Re-activate' : 'Decommission'}
                                </button>
                                <button
                                  onClick={() => {
                                    if(confirm(`Are you absolutely sure you want to delete user ${usr.name}? This cannot be undone.`)) {
                                      deleteUser(usr.id);
                                      addAuditLog('User Delete', `Deleted user account permanently: ${usr.name} (${usr.email})`);
                                      showToast('🗑️ User account deleted permanently.');
                                    }
                                  }}
                                  className="px-2 py-1 bg-red-50 text-red-600 border border-red-100 rounded-md hover:bg-red-100 transition cursor-pointer"
                                  title="Delete permanently"
                                >
                                  <Trash2 className="w-3.5 h-3.5 inline" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADMIN TAB 3: ADMIN PAYOUTS & DYNAMIC COMMISSION CALCULATOR */}
              {adminTab === 'payments' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Admin Payouts Ledger & Commission Rules</h3>
                      <p className="text-xs text-slate-500">Calculate platform commission fees dynamically and disburse funds to sellers securely</p>
                    </div>
                  </div>

                  {/* Commission Rules Info & Adjustable Slate */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 col-span-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Commission Margins Rule Setup</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Under current platform guidelines, administrators can adjust the active commission rate (0% - 15%) in real-time. Adjustments instantly recalculate the net payout due to the seller across all pending escrow disbursements.
                      </p>
                    </div>
                    
                    {/* Live platform commission counter */}
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex flex-col justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Global Commission Pool</span>
                      <div>
                        <span className="text-2xl font-black text-[#1E40AF] block">
                          ₦{payoutsList.reduce((acc, p) => acc + (p.status === 'Completed' ? p.commissionAmount : 0), 0).toLocaleString()}
                        </span>
                        <p className="text-[10px] text-slate-400 font-bold">Successfully collected from completed sales</p>
                      </div>
                    </div>
                  </div>

                  {/* Payout Ledger Table with Interactive Commission Sliders */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Escrow Disbursements & Bank Routing Queue</h4>

                    <div className="space-y-4">
                      {payoutsList.map(pay => (
                        <div key={pay.id} className={`p-4 border rounded-xl bg-white shadow-xs space-y-4 transition ${
                          pay.status === 'Completed' ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200 hover:border-slate-300'
                        }`}>
                          
                          {/* Top Row: Seller and Product Identity */}
                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-2">
                            <div>
                              <span className="font-extrabold text-slate-900 block text-sm">{pay.sellerName}</span>
                              <span className="text-slate-400 text-[10.5px]">Product: <strong>{pay.machineTitle || pay.productTitle}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 text-[10.5px]">Bank Account: <strong className="text-slate-700 font-mono">{pay.bankAccount} ({pay.bankName})</strong></span>
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                pay.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                              }`}>
                                {pay.status === 'Completed' ? 'Payout Disbursed' : 'Awaiting Payout'}
                              </span>
                            </div>
                          </div>

                          {/* Middle Row: Calculations Matrix */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                            <div className="bg-slate-50 p-2.5 rounded-lg border">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sale Amount</span>
                              <span className="text-sm font-extrabold text-slate-900">₦{pay.saleAmount.toLocaleString()}</span>
                            </div>

                            <div className="bg-slate-50 p-2.5 rounded-lg border">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Commission Rate (%)</span>
                              <span className="text-sm font-extrabold text-[#1E40AF]">{pay.commissionRate.toFixed(1)}%</span>
                            </div>

                            <div className="bg-slate-50 p-2.5 rounded-lg border">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Commission Fee (₦)</span>
                              <span className="text-sm font-extrabold text-red-600">₦{pay.commissionAmount.toLocaleString()}</span>
                            </div>

                            <div className="bg-slate-50 p-2.5 rounded-lg border">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Seller Net Payout</span>
                              <span className="text-sm font-extrabold text-emerald-700">₦{(pay.netAmount ?? pay.netPayoutAmount ?? 0).toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Bottom Row: Dynamic commission rates slider for Pending payouts */}
                          {pay.status === 'Pending' ? (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-3 rounded-lg border border-dashed text-xs font-semibold">
                              <div className="flex-1 w-full space-y-1">
                                <div className="flex justify-between text-[11px] text-slate-600">
                                  <span>Adjust Platform Commission Rate</span>
                                  <span className="text-[#1E40AF] font-bold">Rule Value: {pay.commissionRate}%</span>
                                </div>
                                <input 
                                  type="range"
                                  min="0"
                                  max="15"
                                  step="0.5"
                                  value={pay.commissionRate}
                                  onChange={e => {
                                    calculatePayoutCommission(pay.id, parseFloat(e.target.value));
                                  }}
                                  className="w-full accent-[#1E40AF] cursor-pointer"
                                />
                              </div>

                              <button
                                onClick={() => {
                                  completePayout(pay.id);
                                  addAuditLog('Payout Process', `Disbursed escrow balance payout of ₦${(pay.netAmount ?? pay.netPayoutAmount ?? 0).toLocaleString()} to ${pay.sellerName} Bank`, 'Lagos Hub');
                                  showToast(`💸 Success! Payout of ₦${(pay.netAmount ?? pay.netPayoutAmount ?? 0).toLocaleString()} disbursed to ${pay.sellerName} Bank.`);
                                }}
                                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg shadow-xs transition duration-150 cursor-pointer whitespace-nowrap"
                              >
                                Mark Payout Completed
                              </button>
                            </div>
                          ) : (
                            <div className="p-2 bg-emerald-50/60 text-[11px] text-emerald-800 rounded-lg flex items-center justify-center gap-1.5 font-bold">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>Platform commission of ₦{pay.commissionAmount.toLocaleString()} has been retained. ₦{(pay.netAmount ?? pay.netPayoutAmount ?? 0).toLocaleString()} transferred to bank route.</span>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN TAB 4: SITE CUSTOMIZATION (TITLE, ANNOUNCEMENTS, HERO TEXT) */}
              {adminTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 text-xs font-semibold text-slate-700 animate-fadeIn">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Platform Customization & Branding Editor</h3>
                    <p className="text-xs text-slate-500">Edit layout labels, update brand titles, announcements, hero text, and telephone support contacts</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-slate-600">Platform Portal Title / Brand Name</label>
                      <input 
                        type="text"
                        required
                        value={settTitle}
                        onChange={e => setSettTitle(e.target.value)}
                        className="w-full p-2.5 border rounded-lg bg-white text-slate-900 font-bold focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., MTM Nigeria"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-600">Support Helpline Telephone Contact</label>
                      <input 
                        type="text"
                        required
                        value={settPhone}
                        onChange={e => setSettPhone(e.target.value)}
                        className="w-full p-2.5 border rounded-lg bg-white text-slate-900 font-bold focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., 08066062008"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-600">Top Header Announcement Slider Text</label>
                    <input 
                      type="text"
                      value={settAnnouncement}
                      onChange={e => setSettAnnouncement(e.target.value)}
                      className="w-full p-2.5 border rounded-lg bg-white text-slate-900 font-bold focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., West Africa's Premier Industrial Machinery Marketplace"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-600">Landing Page Headline (Hero Header)</label>
                    <input 
                      type="text"
                      required
                      value={settHeadline}
                      onChange={e => setSettHeadline(e.target.value)}
                      className="w-full p-2.5 border rounded-lg bg-white text-slate-900 font-bold focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Buy & Sell Verified Heavy Duty Industrial Equipment"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-600">Landing Page Subheadline (Hero Paragraph)</label>
                    <textarea
                      required
                      rows={3}
                      value={settSubheadline}
                      onChange={e => setSettSubheadline(e.target.value)}
                      className="w-full p-2.5 border rounded-lg bg-white text-slate-900 font-medium focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Direct Escrow transactions with physically verified machinery..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-slate-600">Featured Partner Merchant (Partner Section)</label>
                      <input 
                        type="text"
                        value={settMerchant}
                        onChange={e => setSettMerchant(e.target.value)}
                        className="w-full p-2.5 border rounded-lg bg-white text-slate-900 focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., Interior Duct Ltd"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-600">System Operational Status</label>
                      <select 
                        value={settStatus}
                        onChange={e => setSettStatus(e.target.value)}
                        className="w-full p-2.5 border rounded-lg bg-white text-slate-900 font-bold focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Operational">Operational (All Services Normal)</option>
                        <option value="Under Maintenance">Under Maintenance (Disbursement Delayed)</option>
                        <option value="Degraded Performance">Degraded Performance (Network Lag)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-2">
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider">Preview Instant Customization Engine</h4>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Saving these configurations writes immediately to the persistent global context. The announcement bar, landing banner, and safety helpdesk will synchronize with these customized credentials immediately.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition duration-150 cursor-pointer"
                  >
                    Save & Push Customizations Live
                  </button>
                </form>
              )}

              {/* ADMIN TAB 6: MEDIA MANAGER */}
              {adminTab === 'media' && (
                <div className="space-y-6 animate-fadeIn text-xs">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Media & Digital Asset Repository Manager</h3>
                    <p className="text-slate-500 text-xs">Manage product graphics, safety audit files, physical machinery photos, and logistics reference documents in real-time</p>
                  </div>

                  {/* Media Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">Total Digital Assets</span>
                      <span className="text-lg font-black text-slate-900">{mediaList.length} Files</span>
                      <p className="text-[10px] text-emerald-600 font-bold">100% cloud-synced</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">Storage Footprint</span>
                      <span className="text-lg font-black text-[#1E40AF]">9.32 MB</span>
                      <p className="text-[10px] text-slate-400 font-bold">Optimized CDN caching active</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">System Sync Integrity</span>
                      <span className="text-lg font-black text-emerald-700">100% Normal</span>
                      <p className="text-[10px] text-slate-400 font-bold">All thumbnails cached</p>
                    </div>
                  </div>

                  {/* Add Media Item Form */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5 text-[#1E40AF]" /> Register Digital Asset
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-700">
                      <div className="space-y-1 font-semibold text-slate-700">
                        <label>Asset Title</label>
                        <input
                          type="text"
                          placeholder="e.g. SCM Nova Sliding Table Side View"
                          value={newMediaTitle}
                          onChange={e => setNewMediaTitle(e.target.value)}
                          className="w-full p-2 border rounded bg-white text-slate-900 font-medium"
                        />
                      </div>
                      <div className="space-y-1 font-semibold text-slate-700">
                        <label>Asset Remote Image URL</label>
                        <input
                          type="text"
                          placeholder="https://example.com/machine-photo.jpg"
                          value={newMediaUrl}
                          onChange={e => setNewMediaUrl(e.target.value)}
                          className="w-full p-2 border rounded bg-white text-slate-900 font-medium"
                        />
                      </div>
                      <div className="space-y-1 font-semibold text-slate-700">
                        <label>Media Category</label>
                        <select
                          value={newMediaCategory}
                          onChange={e => setNewMediaCategory(e.target.value)}
                          className="w-full p-2 border rounded bg-white text-slate-900 font-medium"
                        >
                          <option value="Machinery">Machinery Photos</option>
                          <option value="Peripherals">Peripherals / Tools</option>
                          <option value="Logistics">Logistics / Freight</option>
                          <option value="Audits">Technical Audits</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newMediaTitle || !newMediaUrl) {
                            showToast('⚠️ Asset title and remote image URL are required.');
                            return;
                          }
                          const newAsset = {
                            id: 'media-' + Math.floor(1000 + Math.random() * 9000),
                            title: newMediaTitle,
                            url: newMediaUrl,
                            size: (Math.random() * 3 + 0.5).toFixed(1) + ' MB',
                            category: newMediaCategory,
                            date: new Date().toISOString().split('T')[0]
                          };
                          setMediaList(prev => [newAsset, ...prev]);
                          setNewMediaTitle('');
                          setNewMediaUrl('');
                          showToast(`✓ Registered new asset: "${newMediaTitle}"`);
                        }}
                        className="px-4 py-1.5 bg-[#1E40AF] hover:bg-blue-800 text-white font-extrabold rounded-lg shadow-2xs text-xs transition cursor-pointer"
                      >
                        Register Asset
                      </button>
                    </div>
                  </div>

                  {/* Media Directory Search & Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="🔍 Filter digital assets inside registry..."
                        value={searchMediaQuery}
                        onChange={e => setSearchMediaQuery(e.target.value)}
                        className="w-full p-2.5 border rounded-lg text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mediaList
                        .filter(item => {
                          if (!searchMediaQuery.trim()) return true;
                          const query = searchMediaQuery.toLowerCase();
                          return (
                            item.title.toLowerCase().includes(query) ||
                            item.category.toLowerCase().includes(query)
                          );
                        })
                        .map(item => (
                          <div key={item.id} className="p-3 border rounded-xl flex items-start space-x-3 bg-white shadow-2xs hover:shadow-xs transition">
                            <img src={item.url} alt={item.title} className="w-16 h-16 rounded object-cover border border-slate-100 shrink-0" referrerPolicy="no-referrer" />
                            <div className="space-y-1.5 flex-1 min-w-0 text-[11px]">
                              <div className="flex items-center justify-between gap-2">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold tracking-wide uppercase text-[9px] shrink-0">
                                  {item.category}
                                </span>
                                <span className="text-slate-400 font-mono text-[9.5px] shrink-0">{item.size}</span>
                              </div>
                              <h4 className="font-extrabold text-slate-900 truncate" title={item.title}>{item.title}</h4>
                              <p className="text-slate-400 font-mono text-[9px] truncate">{item.url}</p>
                              
                              <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                                <span className="text-slate-400">Registered: {item.date}</span>
                                <div className="space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(item.url);
                                      showToast('✓ Direct asset URL copied to clipboard.');
                                    }}
                                    className="text-[#1E40AF] hover:underline font-bold transition cursor-pointer"
                                  >
                                    Copy URL
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete asset "${item.title}"?`)) {
                                        setMediaList(prev => prev.filter(m => m.id !== item.id));
                                        showToast('🗑️ Asset deleted from digital registry.');
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-700 font-bold transition cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN TAB 7: THEME COLOR SCHEME PICKER */}
              {adminTab === 'theme' && (
                <div className="space-y-6 animate-fadeIn text-xs">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Platform Theme & Color Scheme Tool</h3>
                    <p className="text-slate-500 text-xs">Dynamically configure the primary branding highlights and visual identity of the MTM Nigeria portal instantly</p>
                  </div>

                  {/* Active Theme Preview Banner */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Live Theme Accent Preview</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-white border rounded-xl shadow-2xs space-y-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rendered Primary Action Control</span>
                        <div className="space-y-2">
                          <button type="button" className="w-full bg-[#1E40AF] hover:bg-blue-800 text-white font-extrabold p-2.5 rounded-lg text-center transition cursor-pointer">
                            Action Button Control
                          </button>
                          <span className="text-slate-400 font-medium block text-center">Hover for active highlight transition</span>
                        </div>
                      </div>
                      <div className="p-4 bg-white border rounded-xl shadow-2xs space-y-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rendered Badges & Indicators</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                            MTM Verified Badge
                          </span>
                          <span className="text-slate-600 font-medium">Text highlight link: <strong className="text-[#1E40AF] cursor-pointer hover:underline">Format Price Here</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Color Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-3.5">
                    {[
                      { key: 'Horse Blood Red', name: 'Horse Blood (Shiny Red)', bg: 'bg-[#7A0C14]', description: 'Deep, lustrous dark equine blood red with shiny specular sheen.' },
                      { key: 'blue', name: 'MTM Royal Blue', bg: 'bg-[#1E40AF]', description: 'Default industrial trust palette.' },
                      { key: 'emerald', name: 'Nigerian Emerald', bg: 'bg-emerald-600', description: 'Vibrant organic growth & power.' },
                      { key: 'amber', name: 'Sahara Amber', bg: 'bg-amber-500', description: 'Earthy luxury & hot physical test.' },
                      { key: 'slate', name: 'Precision Slate', bg: 'bg-slate-700', description: 'Heavy machinery & steel workspace.' },
                      { key: 'rose', name: 'Delta Sunset', bg: 'bg-rose-600', description: 'Energy, bold accent & sunset red.' }
                    ].map(themeOpt => {
                      const currentTheme = siteSettings?.primaryColor || 'Horse Blood Red';
                      const isActive = currentTheme === themeOpt.key || (themeOpt.key === 'Horse Blood Red' && (currentTheme === 'horse-blood' || currentTheme === 'crimson' || currentTheme === 'Horse Blood Red'));
                      return (
                        <button
                          type="button"
                          key={themeOpt.key}
                          onClick={() => {
                            updateSiteSettings({ primaryColor: themeOpt.key });
                            addAuditLog('System Config', `Updated global platform brand accent color scheme to ${themeOpt.name}`, 'Lagos Hub');
                            showToast(`🎨 Site-wide theme color updated to "${themeOpt.name}"!`);
                          }}
                          className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-4 hover:shadow-md transition bg-white cursor-pointer ${
                            isActive ? 'border-[#7A0C14] ring-2 ring-[#7A0C14]/20 shadow-sm' : 'border-slate-200'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="font-extrabold text-slate-900 block text-xs">{themeOpt.name}</span>
                            <span className="text-slate-400 text-[10.5px] font-medium block leading-normal">{themeOpt.description}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className={`w-6 h-6 rounded-full shadow-2xs ${themeOpt.bg}`} />
                            {isActive && (
                              <span className="text-[10px] text-[#7A0C14] font-black uppercase tracking-wider">Active</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                      💡 <strong>Design Sync:</strong> Theme updates are saved to the local store and apply to all buyers, sellers, and admin views instantly across all panels and screens.
                    </p>
                  </div>
                </div>
              )}

              {/* ADMIN TAB 5: SELLER APPROVALS */}
              {adminTab === 'sellers' && (
                <div className="space-y-4 text-xs animate-fadeIn">
                  <h3 className="text-base font-black text-slate-900">Seller Verification Queue</h3>
                  <p className="text-slate-500">Audit and approve physical site locations and 3-phase generator tests before granting seller listings priority visibility.</p>
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-extrabold text-slate-900 block text-sm">Interior Duct Ltd (Benin City Hub)</span>
                      <span className="text-slate-500">Contact: interiorductltd@gmail.com | Status: <strong className="text-amber-700">Awaiting Physical Inspection Verification</strong></span>
                    </div>
                    <button 
                      onClick={() => {
                        showToast('✓ Verified Seller status approved for Interior Duct Ltd!');
                        addAuditLog('Seller Approve', 'Approved physically audited Verified Seller status for Interior Duct Ltd', 'Benin City Hub');
                      }} 
                      className="px-4 py-2 bg-[#1E40AF] hover:bg-blue-800 text-white font-extrabold rounded-lg shadow-xs transition cursor-pointer"
                    >
                      Audit & Approve Seller
                    </button>
                  </div>
                </div>
              )}

              {/* ADMIN TAB 8: AUDIT LOGS */}
              {adminTab === 'audit_logs' && (
                <div className="space-y-4 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Platform Administrative Audit Trail</h3>
                      <p className="text-slate-500 text-xs">Chronological ledger of overriding admin commands, seller listings moderation, payouts, and system state modifications</p>
                    </div>
                    <button
                      onClick={() => {
                        setAuditLogs([
                          { id: `log-${Date.now()}`, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), actor: 'System Core', action: 'Logs Flushed', details: 'Cleared active administrative log memory history.', hub: 'Lagos Hub' }
                        ]);
                        localStorage.setItem('mtm_admin_audit_logs', JSON.stringify([]));
                        showToast('✓ Administrative audit logs flushed successfully.');
                      }}
                      className="px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-extrabold rounded-lg transition"
                    >
                      Flush Logs Ledger
                    </button>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                    <div className="p-3 bg-slate-100 border-b border-slate-200 grid grid-cols-12 gap-2 text-slate-500 font-black uppercase tracking-wider text-[10px]">
                      <div className="col-span-3">Timestamp</div>
                      <div className="col-span-2">Action / Class</div>
                      <div className="col-span-2">Actor IP/Email</div>
                      <div className="col-span-3">Log Details</div>
                      <div className="col-span-2 text-right">Associated Hub</div>
                    </div>

                    <div className="divide-y divide-slate-150 max-h-[480px] overflow-y-auto bg-white">
                      {auditLogs.map((log: any) => (
                        <div key={log.id} className="p-3 grid grid-cols-12 gap-2 items-center text-slate-700 hover:bg-slate-50 transition">
                          <div className="col-span-3 text-slate-500 font-mono text-[10.5px]">{log.timestamp}</div>
                          <div className="col-span-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.action.includes('Payout') ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              log.action.includes('Settings') || log.action.includes('Theme') ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              log.action.includes('User') || log.action.includes('Account') ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              'bg-slate-100 text-slate-800 border border-slate-200'
                            }`}>
                              {log.action}
                            </span>
                          </div>
                          <div className="col-span-2 font-semibold text-slate-900 truncate">{log.actor}</div>
                          <div className="col-span-3 text-slate-600 font-medium leading-relaxed">{log.details}</div>
                          <div className="col-span-2 text-right font-bold text-slate-500">{log.hub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>MTM Industrial Ecosystem Prototype v2.6 • Secured with End-to-End Escrow</span>
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800">
            Close Command Centre
          </button>
        </div>

      </div>
    </div>
  );
};
