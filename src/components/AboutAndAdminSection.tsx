import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  ShieldCheck, 
  Cpu, 
  Truck, 
  Zap, 
  FileSpreadsheet, 
  Trash2, 
  Save, 
  Check, 
  Layers, 
  X, 
  Database, 
  UserX, 
  AlertTriangle,
  Flame,
  Archive,
  Eye,
  EyeOff,
  Settings,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckSquare,
  Square,
  Lock,
  Key
} from 'lucide-react';
import { Product } from '../types';

export const AboutAndAdminSection: React.FC = () => {
  const {
    products,
    setProducts,
    usersList,
    toggleDecommissionUser,
    siteSettings,
    updateSiteSettings,
    showToast,
    formatPrice,
    setActiveView,
    isAdminAuthenticated,
    loginAsAdmin,
    logoutAdmin,
    adminPassword,
    updateAdminPassword
  } = useMarketplace();

  // Settings State matching requested parameters as default fallbacks
  const [siteTitle, setSiteTitle] = useState(siteSettings?.siteTitle || 'MTM - Marketplace');
  const [landingHeadline, setLandingHeadline] = useState(siteSettings?.landingHeadline || 'Equip Your Factory. Empower Your Build.');
  const [landingSubheadline, setLandingSubheadline] = useState(siteSettings?.landingSubheadline || 'The first industrial-grade marketplace for Nigeria’s manufacturing ecosystem. Verified physical testing, escrow safety, and heavy freight logistics.');
  const [primaryColor, setPrimaryColor] = useState(siteSettings?.primaryColor || 'Horse Blood Red');
  const [helplinePhone, setHelplinePhone] = useState(siteSettings?.helplinePhone || '+234 803 685 0229');
  const [systemStatus, setSystemStatus] = useState(siteSettings?.systemStatus || 'Operational');

  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.siteTitle) setSiteTitle(siteSettings.siteTitle);
      if (siteSettings.landingHeadline) setLandingHeadline(siteSettings.landingHeadline);
      if (siteSettings.landingSubheadline) setLandingSubheadline(siteSettings.landingSubheadline);
      if (siteSettings.primaryColor) setPrimaryColor(siteSettings.primaryColor);
      if (siteSettings.helplinePhone) setHelplinePhone(siteSettings.helplinePhone);
      if (siteSettings.systemStatus) setSystemStatus(siteSettings.systemStatus);
    }
  }, [siteSettings]);

  // Admin Portal Local States
  const [activePanelTab, setActivePanelTab] = useState<'about' | 'admin'>('about');
  const [adminInputPassword, setAdminInputPassword] = useState('');
  const [rotatePassInput, setRotatePassInput] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Bulk Product Action State
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkCategoryFilter, setBulkCategoryFilter] = useState<string>('All');
  const [bulkStatusFilter, setBulkStatusFilter] = useState<string>('All');

  // New Listing creation in Admin panel
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Machines');
  const [newSubcategory, setNewSubcategory] = useState('All');
  const [newBrand, setNewBrand] = useState('GENERIC');
  const [newPrice, setNewPrice] = useState('');
  const [newLocation, setNewLocation] = useState('Lagos Hub (Ikeja)');
  const [newImageUrl, setNewImageUrl] = useState('/images/scm_panel_saw_1790179186875.jpg');

  // Filtered products specifically for the Admin bulk list
  const adminFilteredProducts = products.filter(p => {
    const matchCat = bulkCategoryFilter === 'All' || p.category === bulkCategoryFilter;
    let matchStatus = true;
    if (bulkStatusFilter === 'Liquidation') matchStatus = p.isLiquidation === true;
    if (bulkStatusFilter === 'Normal') matchStatus = !p.isLiquidation && !p.isArchived;
    if (bulkStatusFilter === 'Archived') matchStatus = p.isArchived === true;
    return matchCat && matchStatus;
  });

  // Handle saving of site parameters
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      siteTitle,
      landingHeadline,
      landingSubheadline,
      primaryColor,
      helplinePhone,
      systemStatus
    });
    showToast('💾 Website administrative configuration updated successfully!');
  };

  // Toggle selection for bulk operations
  const toggleSelectProduct = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const toggleSelectAllVisible = () => {
    const allVisibleIds = adminFilteredProducts.map(p => p.id);
    const areAllSelected = allVisibleIds.every(id => selectedProductIds.includes(id));
    if (areAllSelected) {
      setSelectedProductIds(prev => prev.filter(id => !allVisibleIds.includes(id)));
    } else {
      setSelectedProductIds(prev => Array.from(new Set([...prev, ...allVisibleIds])));
    }
  };

  // Bulk actions
  const handleBulkSetLiquidation = (isLiquidation: boolean) => {
    if (selectedProductIds.length === 0) {
      showToast('⚠️ No products selected for bulk action.');
      return;
    }
    setProducts(prev =>
      prev.map(p => selectedProductIds.includes(p.id) ? { ...p, isLiquidation } : p)
    );
    showToast(`⚡ Set ${selectedProductIds.length} items to ${isLiquidation ? 'Liquidation Clearance' : 'Standard Sale'}.`);
    setSelectedProductIds([]);
  };

  const handleBulkSetArchive = (isArchived: boolean) => {
    if (selectedProductIds.length === 0) {
      showToast('⚠️ No products selected for bulk action.');
      return;
    }
    setProducts(prev =>
      prev.map(p => selectedProductIds.includes(p.id) ? { ...p, isArchived } : p)
    );
    showToast(`📦 ${isArchived ? 'Archived' : 'Unarchived'} ${selectedProductIds.length} items successfully.`);
    setSelectedProductIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) {
      showToast('⚠️ No products selected for deletion.');
      return;
    }
    setProducts(prev => prev.filter(p => !selectedProductIds.includes(p.id)));
    showToast(`🗑️ Permanently removed ${selectedProductIds.length} items from the database.`);
    setSelectedProductIds([]);
  };

  // Export Inventory & Seller report to CSV
  const handleExportCSV = () => {
    const csvRows = [];
    // Header
    csvRows.push(['Product ID', 'Title', 'Category', 'Subcategory', 'Brand', 'Price (NGN)', 'Location Hub', 'Condition', 'Status', 'Has Inspection Cert', 'Seller Name', 'Seller Type', 'Seller Rating'].join(','));

    products.forEach(p => {
      const row = [
        `"${p.id}"`,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        `"${p.subcategory || 'General'}"`,
        `"${p.brand}"`,
        p.priceNGN,
        `"${p.locationHub || p.location?.city || 'Lagos Hub'}"`,
        `"${p.condition}"`,
        p.isArchived ? 'Archived' : p.isLiquidation ? 'Liquidation' : 'Active',
        p.hasInspectionCertificate ? 'Yes' : 'No',
        `"${p.seller?.name?.replace(/"/g, '""') || 'MTM Certified'}"`,
        `"${p.seller?.businessType || 'Dealer'}"`,
        p.seller?.rating || '5.0'
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mtm_inventory_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📊 CSV Inventory Report downloaded! Saved current machine listings and seller statuses.');
  };

  // Handle individual listing creation
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice.trim()) {
      showToast('⚠️ Please enter a title and price.');
      return;
    }

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('⚠️ Please enter a valid number for price.');
      return;
    }

    const newListing: Product = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newCategory,
      subcategory: newSubcategory || 'All',
      brand: newBrand,
      model: 'MTM-PRO',
      priceNGN: priceNum,
      priceUSD: Math.round(priceNum / 1600),
      locationHub: newLocation,
      condition: 'Tested Working',
      images: [newImageUrl],
      hasVideoTest: false,
      hasInspectionCertificate: true,
      inspectionScore: 92,
      location: {
        city: 'Benin City',
        state: 'Edo State',
        industrialArea: 'Benin City Hub'
      },
      powerSpecs: {
        voltage: '380V / 3-Phase',
        kwRating: 7.5,
        phase: '3-Phase'
      },
      technicalSpecs: {
        'Year': '2021',
        'Usage Hours': '250h',
        'Country of Origin': 'Germany'
      },
      tags: ['Heavy Machinery', 'Escrow Certified'],
      description: 'Heavy duty workshop machinery listed via the MTM administrative panel.',
      stockQuantity: 1,
      unit: 'Unit',
      deliveryOptions: {
        escrowProtected: true,
        inspectionBeforePayment: true,
        freightAssisted: true,
        estimatedDays: '3-5 Days',
        originHub: 'Lagos Hub'
      },
      seller: {
        id: 'usr-admin-uploaded',
        name: 'MTM Direct Depot',
        businessType: 'Dealer / Importer',
        isVerified: true,
        rating: 4.9,
        reviewCount: 42,
        joinedYear: 2023,
        location: 'Lagos, Nigeria',
        verifiedBadges: ['MTM Verified', 'Escrow Shield'],
        responseTime: '10 mins'
      }
    };

    setProducts(prev => [newListing, ...prev]);
    showToast(`🆕 Machine "${newTitle}" created & listed on public catalog!`);
    
    // Reset listing input
    setNewTitle('');
    setNewPrice('');
  };

  return (
    <div id="about-and-admin-panel-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-200 mt-16 space-y-10 bg-slate-50/50">
      
      {/* ================= ABOUT MTM ARCHITECTURE SECTION ================= */}
      <section className="space-y-8 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#8B1520] text-xs font-mono font-bold tracking-wider uppercase">
              <Layers className="w-3.5 h-3.5" />
              <span>Industrial Information Blueprints</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              About MTM Specialist Architecture
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Industrial machinery cannot be listed or traded like simple consumer goods. MTM handles heavy machinery procurement using specialized multi-corridor validation systems.
            </p>
          </div>

          {/* Authentic Used Machinery Architectural Banner */}
          <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
            <img 
              src="/images/engineering_blueprints_1790206304051.jpg" 
              alt="MTM Specialist Architecture & Blueprints" 
              className="w-full h-full object-cover filter contrast-110"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/engineering_blueprints_1790206304051.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#8B1520] text-white">
                  Verified Inspection Protocol
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold mt-1">
                  Reconditioned Industrial Plants & Engineering Compliance
                </h3>
              </div>
              <div className="text-xs text-slate-200 font-mono bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                Active Corridors: Lagos • Kano • Port Harcourt
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-[#8B1520]">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">1. Engineering Indexes</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Every equipment catalog list matches active electrical, structural & operating hour indices. Calculates startup power starting currents (inrush kVA).
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">2. Escrow Process Protection</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                MTM locks fund releases until a physical test load on-site has run completely and shipping crane logistics have been cleared.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">3. Low-bed Rigging Corridors</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Integrated heavy transport trailers spanning industrial zones in Lagos (Ikeja, Ikorodu), Kano (Bompai), and Port Harcourt (Trans-Amadi).
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">4. AI Diagnostic Scoring</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Automatic inspection scoring utilizing advanced predictive models to predict parts wear, spindle alignment, and mechanical life expectancy.
              </p>
            </div>
          </div>
        </section>
    </div>
  );
};
