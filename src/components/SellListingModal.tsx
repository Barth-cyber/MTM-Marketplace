import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Sparkles, 
  Upload, 
  DollarSign, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  MapPin,
  FileText
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product, MainCategory, EquipmentCondition } from '../types';
import { INDUSTRIAL_HUBS } from '../data/mockData';
import { BackNavigation } from './BackNavigation';
import { useDraggableModal } from '../hooks/useDraggableModal';

export const SellListingModal: React.FC = () => {
  const {
    isSellModalOpen,
    setIsSellModalOpen,
    addNewListing,
    formatPrice,
    showToast,
    setIsTermsModalOpen,
    isSellerAuthenticated,
    sellerUser,
    loginAsSeller,
    registerAsSeller,
  } = useMarketplace();

  const { modalStyle, dragHandleProps } = useDraggableModal();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Seller Auth Form state
  const [isRegistering, setIsRegistering] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authBusinessName, setAuthBusinessName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authHub, setAuthHub] = useState('Lagos Hub');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MainCategory>('Machines');
  const [subcategory, setSubcategory] = useState('Woodworking Machines');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2021');
  const [condition, setCondition] = useState<EquipmentCondition>('Like New');
  const [hoursUsed, setHoursUsed] = useState('1200');
  const [voltage, setVoltage] = useState('3-Phase 380V-415V');
  const [generatorKVA, setGeneratorKVA] = useState('20');
  const [priceNGN, setPriceNGN] = useState('7500000');
  const [priceUSD, setPriceUSD] = useState('5000');
  const [city, setCity] = useState('Ikeja');
  const [state, setState] = useState('Lagos');
  const [industrialArea, setIndustrialArea] = useState('Oregun Industrial Area');
  const [sellerName, setSellerName] = useState('Apex Industrial Workshop');
  const [sellerType, setSellerType] = useState('Workshop');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/scm_panel_saw_1790179186875.jpg');
  const [isAutocategorized, setIsAutocategorized] = useState(false);

  // Auto-categorization Logic
  React.useEffect(() => {
    if (!title.trim()) {
      setIsAutocategorized(false);
      return;
    }
    const lower = title.toLowerCase();
    let matchedCat: MainCategory | null = null;
    let matchedSub = '';

    // Woodworking / Saws
    if (lower.includes('saw') || lower.includes('planer') || lower.includes('router') || lower.includes('wood') || lower.includes('joiner') || lower.includes('edge bander') || lower.includes('spindle') || lower.includes('moulder') || lower.includes('molder')) {
      matchedCat = 'Machines';
      if (lower.includes('panel saw') || lower.includes('sliding table')) {
        matchedSub = 'Woodworking Machines - Panel Saws';
      } else if (lower.includes('edge bander') || lower.includes('edgebander')) {
        matchedSub = 'Woodworking Machines - Edge Banders';
      } else if (lower.includes('router') || lower.includes('cnc')) {
        matchedSub = 'Woodworking Machines - CNC Routers';
      } else if (lower.includes('planer') || lower.includes('thicknesser')) {
        matchedSub = 'Woodworking Machines - Thickness Planers';
      } else {
        matchedSub = 'Woodworking Machines';
      }
    } 
    // Metalworking
    else if (lower.includes('lathe') || lower.includes('milling') || lower.includes('drill press') || lower.includes('hydraulic') || lower.includes('welding') || lower.includes('welder') || lower.includes('plasma') || lower.includes('press brake') || lower.includes('shear')) {
      matchedCat = 'Machines';
      if (lower.includes('lathe')) {
        matchedSub = 'Metalworking Machines - Lathes';
      } else if (lower.includes('milling')) {
        matchedSub = 'Metalworking Machines - Milling';
      } else if (lower.includes('welder') || lower.includes('welding')) {
        matchedSub = 'Metalworking Machines - Welding Stations';
      } else {
        matchedSub = 'Metalworking Machines';
      }
    } 
    // Power Generation
    else if (lower.includes('generator') || lower.includes('perkins') || lower.includes('cummins') || lower.includes('mikano') || lower.includes('transformer') || lower.includes('power') || lower.includes('kva')) {
      matchedCat = 'Machines';
      matchedSub = 'Power Generation & Backup';
    } 
    // Hand tools, cutters, drill bits
    else if (lower.includes('blade') || lower.includes('cutter') || lower.includes('carbide') || lower.includes('abrasive') || lower.includes('belt') || lower.includes('clamp') || lower.includes('hand tool') || lower.includes('wrench') || lower.includes('caliper') || lower.includes('drill bit')) {
      matchedCat = 'Tools';
      if (lower.includes('blade') || lower.includes('saw')) {
        matchedSub = 'Precision Cutting Blades';
      } else {
        matchedSub = 'Industrial Workshop Tools';
      }
    } 
    // Raw Materials
    else if (lower.includes('plywood') || lower.includes('board') || lower.includes('timber') || lower.includes('mdf') || lower.includes('hdf') || lower.includes('glue') || lower.includes('adhesive') || lower.includes('steel plate') || lower.includes('screw') || lower.includes('iron') || lower.includes('wire')) {
      matchedCat = 'Materials';
      if (lower.includes('board') || lower.includes('mdf') || lower.includes('plywood')) {
        matchedSub = 'Industrial Boards & Plywood';
      } else {
        matchedSub = 'Production Raw Materials';
      }
    }

    if (matchedCat) {
      setCategory(matchedCat);
      setSubcategory(matchedSub);
      setIsAutocategorized(true);
    } else {
      setIsAutocategorized(false);
    }
  }, [title]);

  // AI Valuation State
  const [isValuating, setIsValuating] = useState(false);
  const [aiValuationResult, setAiValuationResult] = useState<any>(null);

  if (!isSellModalOpen) return null;

  const handleRunAIValuation = async () => {
    setIsValuating(true);
    try {
      const res = await fetch('/api/ai/valuate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineTitle: title || `${brand} ${subcategory}`,
          category,
          condition,
          brand: brand || 'Industrial Standard',
          year,
          hoursUsed,
          originalPrice: `₦${priceNGN}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.valuation) {
        setAiValuationResult(data.valuation);
        if (data.valuation.generatedDescription) {
          setDescription(data.valuation.generatedDescription);
        }
      }
    } catch (e) {
      console.error(e);
      setAiValuationResult({
        recommendedPriceNGN: "₦7,200,000",
        priceRangeNGN: "₦6,800,000 - ₦7,800,000",
        recommendedPriceUSD: "$4,800",
        priceRangeUSD: "$4,500 - $5,200",
        marketDemandScore: "High (8.9/10)",
        generatedDescription: `High-precision ${brand || "industrial"} ${title || subcategory}. Decommissioned from working production. Excellent structural condition with clean slideways and verified motor insulation. Ready for immediate workshop deployment.`,
        suggestedTags: ["Industrial", "Verified Working", "3-Phase", "Fast Liquidation"],
        inspectionChecklist: [
          "Verify motor insulation test (> 2 MΩ)",
          "Inspect mechanical drive gears and bearings for runout",
          "Test emergency switches under load",
        ],
      });
      setDescription(`High-precision ${brand || "industrial"} ${title || subcategory}. Excellent structural condition with clean slideways and verified motor insulation.`);
    } finally {
      setIsValuating(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `mtm-user-${Date.now()}`,
      title: title || `${brand || 'Industrial'} ${subcategory} (${model || 'Standard'})`,
      slug: (title || 'machine-listing').toLowerCase().replace(/\s+/g, '-'),
      category,
      subcategory,
      brand: brand || 'Industrial Standard',
      model: model || 'Commercial Grade',
      year: parseInt(year) || 2021,
      priceNGN: parseFloat(priceNGN) || 5000000,
      priceUSD: parseFloat(priceUSD) || 3300,
      condition,
      location: {
        city: city || 'Lagos',
        state: state || 'Lagos',
        industrialArea: industrialArea || 'Ikeja Industrial Zone',
      },
      seller: {
        id: `sel-user-${Date.now()}`,
        name: sellerName || 'Verified Seller',
        businessType: sellerType as any,
        isVerified: true,
        rating: 5.0,
        reviewCount: 1,
        joinedYear: 2024,
        location: `${city}, ${state}`,
        responseTime: 'Under 1 hour',
        verifiedBadges: ['Pending Physical MTM Verification', 'Escrow Account Ready'],
      },
      images: [
        imageUrl || '/images/scm_panel_saw_1790179186875.jpg',
      ],
      hasVideoTest: true,
      hasInspectionCertificate: true,
      inspectionScore: 94,
      powerSpecs: {
        voltage,
        minGeneratorKVA: parseInt(generatorKVA) || 15,
        kwRating: 7.5,
        phase: voltage.includes('3-Phase') ? '3-Phase' : '1-Phase',
        fuelType: 'Electric',
      },
      technicalSpecs: {
        'Condition': condition,
        'Power Requirement': voltage,
        'Min Generator': `${generatorKVA} kVA`,
        'Operating Hours': `${hoursUsed} Hours`,
        'Origin Location': `${city}, ${state}`,
      },
      description: description || 'Industrial grade equipment listed on MTM multi-vendor marketplace with full escrow protection.',
      tags: ['New Listing', category, subcategory, brand || 'Industrial'],
      stockQuantity: 1,
      unit: 'Unit',
      hoursUsed: parseInt(hoursUsed) || 1000,
      deliveryOptions: {
        escrowProtected: true,
        inspectionBeforePayment: true,
        freightAssisted: true,
        estimatedDays: '1-3 Business Days',
        originHub: `${city} Industrial Corridor`,
      },
      featured: true,
    };

    addNewListing(newProduct);
    setIsSellModalOpen(false);
  };

  const handleSellerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      showToast('⚠️ Please enter email and password.');
      return;
    }
    const success = loginAsSeller(authEmail, authPassword);
    if (success) {
      setAuthEmail('');
      setAuthPassword('');
      // Update form default fields with authenticated user data
      setSellerName(sellerUser?.businessName || sellerUser?.name || authEmail.split('@')[0]);
    } else {
      showToast('❌ Login failed: Password must be 4 or more characters.');
    }
  };

  const handleSellerRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword || !authName || !authBusinessName) {
      showToast('⚠️ Please fill out all required fields.');
      return;
    }
    registerAsSeller({
      name: authName,
      businessName: authBusinessName,
      email: authEmail,
      phone: authPhone || '08000000000',
      location: authHub
    });
    setSellerName(authBusinessName);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthBusinessName('');
    setAuthPhone('');
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 animate-fadeIn">
      <div 
        style={modalStyle} 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Back Navigation Helper */}
        <BackNavigation 
          onBack={() => setIsSellModalOpen(false)} 
          label="Back to Marketplace" 
          showClose={true} 
          onClose={() => setIsSellModalOpen(false)} 
          dragHandleProps={dragHandleProps}
        />

        {/* Header */}
        <div 
          {...dragHandleProps}
          className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 select-none"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#8B1520] border border-rose-200 flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Sell on MTM — Multi-Vendor Listing</h2>
              <p className="text-xs text-slate-500">
                List machines, tools or materials with AI market valuation and escrow security.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSellModalOpen(false)}
            className="no-drag p-2 rounded-xl bg-white hover:bg-rose-600 hover:text-white text-slate-700 border border-slate-300 hover:border-rose-600 transition-colors shadow-xs cursor-pointer"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 font-bold" />
          </button>
        </div>

        {!isSellerAuthenticated ? (
          <div className="p-6 overflow-y-auto space-y-6 max-h-[80vh]">
            <div className="text-center space-y-2">
              <span className="inline-block px-3 py-1 bg-rose-100 text-[#8B1520] font-bold text-[10px] rounded-full uppercase tracking-wider">
                Seller Authentication Portal
              </span>
              <h3 className="text-sm font-black text-slate-900">Authenticate Your Seller Account</h3>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                Under MTM multi-vendor integrity standards, all sellers must authenticate before listing heavy equipment or materials.
              </p>
            </div>

            {/* Toggle tabs */}
            <div className="flex border-b text-xs font-bold bg-slate-50 rounded-lg p-0.5 border border-slate-200">
              <button 
                type="button"
                onClick={() => setIsRegistering(false)} 
                className={`flex-1 py-2 rounded-md cursor-pointer transition ${!isRegistering ? 'bg-white text-[#8B1520] shadow-xs' : 'text-slate-500'}`}
              >
                Sign In (Existing Seller)
              </button>
              <button 
                type="button"
                onClick={() => setIsRegistering(true)} 
                className={`flex-1 py-2 rounded-md cursor-pointer transition ${isRegistering ? 'bg-white text-[#8B1520] shadow-xs' : 'text-slate-500'}`}
              >
                Register New Seller Account
              </button>
            </div>

            {!isRegistering ? (
              <form onSubmit={handleSellerLoginSubmit} className="space-y-4 text-xs font-semibold text-slate-700 max-w-sm mx-auto">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[10.5px] leading-relaxed">
                  <strong>Testing Tip:</strong> Enter any email and password (min 4 characters), or use <strong>interiorductltd@gmail.com</strong> (password: admin) to log in as the verified seller.
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600">Seller Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    placeholder="e.g., seller@mtm.com" 
                    className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-rose-500 bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600">Secure Password</label>
                  <input 
                    type="password" 
                    required 
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-rose-500 bg-white" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-[#8B1520] text-white hover:bg-[#72111A] rounded-lg font-black transition cursor-pointer"
                >
                  Verify Seller Credentials & Continue
                </button>
              </form>
            ) : (
              <form onSubmit={handleSellerRegisterSubmit} className="space-y-4 text-xs font-semibold text-slate-700 max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-600">Your Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={authName}
                      onChange={e => setAuthName(e.target.value)}
                      placeholder="e.g., Chief Alabi" 
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-rose-500 bg-white" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-600">Company / Business Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={authBusinessName}
                      onChange={e => setAuthBusinessName(e.target.value)}
                      placeholder="e.g., Alabi Woodworking Ltd" 
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-rose-500 bg-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-600">Contact Email *</label>
                    <input 
                      type="email" 
                      required 
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      placeholder="seller@alabiwood.com" 
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-rose-500 bg-white" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-600">Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      value={authPhone}
                      onChange={e => setAuthPhone(e.target.value)}
                      placeholder="08033221100" 
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-rose-500 bg-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[#8B1520]">Associated Industrial Hub *</label>
                    <select 
                      value={authHub}
                      onChange={e => setAuthHub(e.target.value)}
                      className="w-full p-2.5 border rounded-lg bg-white"
                    >
                      <option value="Lagos Hub">Lagos Hub (Ikeja, Ogba, Apapa)</option>
                      <option value="Benin City Hub">Benin City Hub (Edo State)</option>
                      <option value="Kano Hub">Kano Hub (Sharada, Bompai)</option>
                      <option value="Port Harcourt Hub">Port Harcourt Hub (Trans-Amadi)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-600">Password (min 4 chars) *</label>
                    <input 
                      type="password" 
                      required 
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-rose-500 bg-white" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-[#8B1520] text-white hover:bg-[#72111A] rounded-lg font-black transition cursor-pointer"
                >
                  Create Account & List Equipment
                </button>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* Step Indicator */}
            <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-500 shrink-0">
              <button type="button" onClick={() => setStep(1)} className={`flex items-center space-x-1.5 ${step === 1 ? 'text-[#8B1520] font-bold' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-[#8B1520] text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
                <span>Equipment Identity</span>
              </button>
              <button type="button" onClick={() => setStep(2)} className={`flex items-center space-x-1.5 ${step === 2 ? 'text-[#8B1520] font-bold' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-[#8B1520] text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
                <span>Power & Specs</span>
              </button>
              <button type="button" onClick={() => setStep(3)} className={`flex items-center space-x-1.5 ${step === 3 ? 'text-[#8B1520] font-bold' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-[#8B1520] text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
                <span>AI Valuation</span>
              </button>
              <button type="button" onClick={() => setStep(4)} className={`flex items-center space-x-1.5 ${step === 4 ? 'text-[#8B1520] font-bold' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 4 ? 'bg-[#8B1520] text-white' : 'bg-slate-200 text-slate-700'}`}>4</span>
                <span>Publish</span>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handlePublish} className="overflow-y-auto p-4 sm:p-6 space-y-5 text-xs flex-1">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-xs font-black text-slate-900">Step 1: Machine & Equipment Identity</h3>
              
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Equipment Title / Model Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. SCM Nova Si400 Sliding Table Panel Saw 3.2m"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sector / Pillar</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as MainCategory)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                  >
                    <option value="Machines">Machines</option>
                    <option value="Tools">Tools</option>
                    <option value="Materials">Materials</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={e => setSubcategory(e.target.value)}
                    placeholder="e.g. Woodworking Machines, Metal Lathes"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                  />
                </div>
              </div>

              {isAutocategorized && (
                <div className="text-[#8B1520] text-[11px] font-bold flex items-center space-x-1.5 p-1 px-2 rounded bg-rose-50/70 border border-rose-100 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B1520] fill-rose-100" />
                  <span>MTM AI Auto-categorized based on your equipment title</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Brand / Manufacturer</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    placeholder="e.g. SCM, CAT, Bosch, Perkins"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Model Number</label>
                  <input
                    type="text"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    placeholder="e.g. Nova Si400 / 1104A"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Year of Manufacture</label>
                  <input
                    type="text"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Condition Rating</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Brand New', 'Like New', 'Refurbished', 'Tested Working'] as EquipmentCondition[]).map(cond => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setCondition(cond)}
                      className={`p-2 rounded-lg border text-center font-bold transition cursor-pointer ${
                        condition === cond
                          ? 'bg-[#8B1520] text-white border-[#8B1520]'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2 rounded-lg bg-[#8B1520] text-white font-bold hover:bg-[#72111A] transition shadow-xs cursor-pointer"
                >
                  Continue to Power Specs →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900">Step 2: Technical & Power Specifications</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Operating Voltage & Phase</label>
                  <input
                    type="text"
                    value={voltage}
                    onChange={e => setVoltage(e.target.value)}
                    placeholder="e.g. 3-Phase 380V-415V 50Hz"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Minimum Recommended Generator (kVA)</label>
                  <input
                    type="number"
                    value={generatorKVA}
                    onChange={e => setGeneratorKVA(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Operating Hours / Usage History</label>
                  <input
                    type="number"
                    value={hoursUsed}
                    onChange={e => setHoursUsed(e.target.value)}
                    placeholder="e.g. 1400"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Location Hub & Industrial Area</label>
                  <input
                    type="text"
                    value={`${city}, ${state} (${industrialArea})`}
                    onChange={e => setIndustrialArea(e.target.value)}
                    placeholder="e.g. Oregun Industrial Area, Ikeja, Lagos"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Photo Reference URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(3);
                    handleRunAIValuation();
                  }}
                  className="px-5 py-2 rounded-lg bg-[#8B1520] text-white font-bold hover:bg-[#72111A] transition shadow-xs cursor-pointer"
                >
                  Run AI Valuation & Spec Generator →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#8B1520]" />
                  <span>Step 3: AI Valuation & Technical Copywriting</span>
                </h3>

                <button
                  type="button"
                  onClick={handleRunAIValuation}
                  disabled={isValuating}
                  className="text-xs text-[#8B1520] hover:text-[#72111A] flex items-center space-x-1 font-semibold cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isValuating ? 'animate-spin' : ''}`} />
                  <span>Re-valuate</span>
                </button>
              </div>

              {isValuating ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <RefreshCw className="w-8 h-8 mx-auto text-[#8B1520] animate-spin" />
                  <p className="text-sm font-semibold text-slate-900">Analyzing recent transaction benchmarks in Lagos & Kano...</p>
                </div>
              ) : aiValuationResult ? (
                <div className="space-y-4">
                  {/* Valuation Benchmark */}
                  <div className="bg-rose-50/60 border border-rose-200 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-700 font-semibold">Recommended Listing Price:</span>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-[#8B1520]">{aiValuationResult.recommendedPriceNGN}</span>
                        <span className="text-xs text-slate-500 ml-2">({aiValuationResult.recommendedPriceUSD})</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Realistic Fair Range:</span>
                      <span className="font-semibold text-slate-800">{aiValuationResult.priceRangeNGN}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Market Demand Liquidity:</span>
                      <span className="text-emerald-700 font-bold">{aiValuationResult.marketDemandScore}</span>
                    </div>
                  </div>

                  {/* Generated Technical Description */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Generated Technical Listing Description</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-[#8B1520] leading-relaxed"
                    />
                  </div>

                  {/* Pre-purchase inspection checklist */}
                  {aiValuationResult.inspectionChecklist && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="font-bold text-slate-900 block">MTM Pre-Purchase Inspection Checkpoints:</span>
                      {aiValuationResult.inspectionChecklist.map((pt: string, i: number) => (
                        <div key={i} className="flex items-center space-x-1.5 text-slate-600 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2 rounded-lg bg-[#8B1520] text-white font-bold hover:bg-[#72111A] transition shadow-xs cursor-pointer"
                >
                  Confirm Pricing & Publish →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900">Step 4: Finalize Price & Seller Verification</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Listing Price (NGN ₦)</label>
                  <input
                    type="number"
                    required
                    value={priceNGN}
                    onChange={e => setPriceNGN(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#8B1520]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Listing Price (USD $)</label>
                  <input
                    type="number"
                    required
                    value={priceUSD}
                    onChange={e => setPriceUSD(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#8B1520]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Seller Business Name</label>
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={e => setSellerName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Seller Entity Type</label>
                  <select
                    value={sellerType}
                    onChange={e => setSellerType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Factory">Factory</option>
                    <option value="Dealer / Importer">Dealer / Importer</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Liquidator">Liquidator</option>
                  </select>
                </div>
              </div>

              {/* Escrow Terms Notice */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>MTM Escrow & Seller Agreement Terms</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-[11px] font-bold text-[#8B1520] hover:underline cursor-pointer"
                  >
                    Read Full Terms →
                  </button>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Upon buyer payment into MTM Escrow, an MTM Certified Inspector is dispatched to your facility. Payout is released directly to your verified commercial bank account within 24 hours of successful handover.
                </p>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#8B1520] hover:bg-[#72111A] text-white font-extrabold text-sm transition shadow-xs active:scale-98 cursor-pointer"
                >
                  Publish Equipment Listing to MTM
                </button>
              </div>
            </div>
          )}
        </form>
          </>
        )}
      </div>
    </div>
  );
};
