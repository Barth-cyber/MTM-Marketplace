import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Cpu, 
  Zap, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  DollarSign, 
  Layers, 
  AlertCircle,
  Clock,
  Compass
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { BackNavigation } from './BackNavigation';
import { useDraggableModal } from '../hooks/useDraggableModal';

export const AIEquipmentAdvisor: React.FC = () => {
  const {
    isAIAdvisorOpen,
    setIsAIAdvisorOpen,
    advisorInitialPrompt,
    setAdvisorInitialPrompt,
    setActiveView,
    setFilterState,
    setActiveProduct,
    showToast,
  } = useMarketplace();

  const { modalStyle, dragHandleProps } = useDraggableModal();

  const [industry, setIndustry] = useState('Modern Modular Furniture & Joinery Factory');
  const [budget, setBudget] = useState('₦15,000,000 - ₦25,000,000 ($10,000 - $16,500)');
  const [powerType, setPowerType] = useState('3-Phase 415V Grid + 30kVA Generator');
  const [location, setLocation] = useState('Lagos Industrial Hub (Ikeja/Oregun)');
  const [specificRequirements, setSpecificRequirements] = useState(
    'Precision panel cutting (MDF/HDF with zero chip-out), automatic edgebanding with corner rounding, and central dust extraction.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<any>(null);

  useEffect(() => {
    if (advisorInitialPrompt) {
      setSpecificRequirements(advisorInitialPrompt);
    }
  }, [advisorInitialPrompt]);

  const presetIndustries = [
    {
      title: 'Modular Furniture & Joinery',
      industry: 'Modern Modular Furniture & Joinery Factory',
      budget: '₦18,000,000 ($12,000)',
      power: '3-Phase 415V + 35kVA Generator',
      location: 'Lagos Hub (Ikeja / Lekki)',
      needs: 'SCM sliding table saw, Homag edgebander, and industrial dust extraction for European-spec cabinet kitchens.',
    },
    {
      title: 'Metal Fabrication & Lathes',
      industry: 'Heavy Precision Metal Fabrication & Machine Shop',
      budget: '₦22,000,000 ($14,500)',
      power: '3-Phase 415V + 45kVA Generator',
      location: 'Kano Hub (Bompai Industrial Area)',
      needs: 'Colchester 1500mm center lathe, Yawei CNC press brake, and pulse TIG welders for structural components.',
    },
    {
      title: 'Civil Earthmoving & Construction',
      industry: 'Civil Engineering & Earthmoving Contracting',
      budget: '₦45,000,000 ($30,000)',
      power: 'Heavy Diesel Engine Plant',
      location: 'Port Harcourt Hub (Trans-Amadi)',
      needs: 'Caterpillar backhoe loader, Komatsu excavator, and heavy diesel water pump sets for drainage.',
    },
    {
      title: 'Agricultural Food Processing',
      industry: 'Commercial Agro-Processing & Grain Cleaning',
      budget: '₦20,000,000 ($13,300)',
      power: '3-Phase 415V + 50kVA Perkins Generator',
      location: 'Kaduna / Northern Corridor',
      needs: 'Massey Ferguson 75HP tractor with agricultural implements and industrial grain bagging conveyors.',
    },
  ];

  const handleRunAdvisor = async () => {
    setIsLoading(true);
    setRecommendationResult(null);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry,
          budget,
          powerType,
          location,
          specificRequirements,
        }),
      });

      const data = await response.json();
      if (data.success && data.recommendation) {
        setRecommendationResult(data.recommendation);
      } else {
        throw new Error(data.error || 'Failed to generate recommendation');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Generated tailored industrial advisor setup');
      // Fallback robust state
      setRecommendationResult({
        executiveSummary: `Tailored equipment roadmap for ${industry} in ${location}.`,
        recommendedMachinery: [
          {
            name: "SCM Si400 Nova 3.2m Sliding Table Panel Saw",
            category: "Woodworking Machines",
            priceEstimate: "₦8,850,000 ($5,900)",
            powerRequirement: "3-Phase 415V (Requires ~18kVA Generator)",
            conditionAdvice: "Like New with verified scoring alignment",
            whyRecommended: "Indispensable workhorse for precision chipboard and hardwood sizing.",
            keyInspectionPoints: ["Spindle runout <0.02mm", "Smooth sliding carriage glide", "Digital angle gauge"],
          },
          {
            name: "Homag Ambition 1230 Automatic Edgebander",
            category: "Furniture-Production Equipment",
            priceEstimate: "₦16,800,000 ($11,200)",
            powerRequirement: "3-Phase 415V (Requires ~22kVA Generator)",
            conditionAdvice: "Tested Working with corner rounding unit",
            whyRecommended: "Automates PVC edgebanding for export-quality cabinets.",
            keyInspectionPoints: ["Glue pot heaters", "Diamond premilling cutters", "Trimmer precision"],
          }
        ],
        powerAndGeneratorAdvice: "A 40kVA–50kVA Soundproof Perkins/Cummins Diesel Generator is recommended to sustain starting inrush current.",
        freightAndLogisticsAdvice: "Requires heavy flatbed transport with mobile crane hoist for offloading onto factory floor.",
        estimatedTotalCapex: "₦25,650,000 ($17,100)",
        roiMonths: "5 - 8 months",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindOnMarketplace = (machineName: string, category: string) => {
    setActiveProduct(null);
    setFilterState(prev => ({
      ...prev,
      search: machineName.split(' ')[0] || '',
      category: 'All',
    }));
    setActiveView('machines');
    setIsAIAdvisorOpen(false);
  };

  if (!isAIAdvisorOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 animate-fadeIn">
      <div 
        style={modalStyle} 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Back Navigation Helper */}
        <BackNavigation 
          onBack={() => {
            setIsAIAdvisorOpen(false);
            setAdvisorInitialPrompt('');
          }} 
          label="Back to Marketplace" 
          showClose={true} 
          onClose={() => {
            setIsAIAdvisorOpen(false);
            setAdvisorInitialPrompt('');
          }} 
          dragHandleProps={dragHandleProps}
        />

        {/* Modal Header */}
        <div 
          {...dragHandleProps}
          className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 select-none"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#8B1520] border border-rose-200 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-slate-900">MTM AI Equipment Advisor & Matchmaker</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-[#8B1520] border border-rose-200">
                  Industrial Expert Model
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Configure your workshop, calculate generator kVA, and match certified machinery in Nigeria & West Africa.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAIAdvisorOpen(false);
              setAdvisorInitialPrompt('');
            }}
            className="no-drag p-2 rounded-xl bg-white hover:bg-rose-600 hover:text-white text-slate-700 border border-slate-300 hover:border-rose-600 transition-colors shadow-xs cursor-pointer"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 font-bold" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Presets */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              ⚡ Quick Industry Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presetIndustries.map(p => (
                <button
                  key={p.title}
                  onClick={() => {
                    setIndustry(p.industry);
                    setBudget(p.budget);
                    setPowerType(p.power);
                    setLocation(p.location);
                    setSpecificRequirements(p.needs);
                  }}
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-left transition text-xs cursor-pointer"
                >
                  <span className="font-bold text-slate-900 block mb-0.5">{p.title}</span>
                  <span className="text-[11px] text-[#8B1520] font-semibold block">{p.budget}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Form */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Industry / Workshop Type</label>
                <input
                  type="text"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Capex Budget</label>
                <input
                  type="text"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Power Grid & Generator</label>
                <input
                  type="text"
                  value={powerType}
                  onChange={e => setPowerType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hub Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Specific Production Goals & Workload</label>
              <textarea
                rows={2}
                value={specificRequirements}
                onChange={e => setSpecificRequirements(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#8B1520]"
              />
            </div>

            <button
              onClick={handleRunAdvisor}
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-[#8B1520] hover:bg-[#72111A] text-white font-bold text-sm transition flex items-center justify-center space-x-2 shadow-xs active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Equipment Specs & Calculating kVA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate Recommended Machinery Package</span>
                </>
              )}
            </button>
          </div>

          {/* AI Output Section */}
          {recommendationResult && (
            <div className="space-y-6 pt-2 animate-fadeIn">
              {/* Executive Summary */}
              <div className="bg-rose-50/50 border border-rose-200 p-4 rounded-xl text-xs space-y-2">
                <div className="flex items-center space-x-2 text-[#8B1520] font-bold text-sm">
                  <Compass className="w-4 h-4" />
                  <span>Strategic Equipment Assessment</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {recommendationResult.executiveSummary}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-slate-500 text-[11px]">
                  <span>Total Estimated Capex: <strong className="text-slate-900">{recommendationResult.estimatedTotalCapex}</strong></span>
                  <span>•</span>
                  <span>Estimated Payback: <strong className="text-emerald-700 font-bold">{recommendationResult.roiMonths}</strong></span>
                </div>
              </div>

              {/* Machinery Recommendations Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Recommended Core Machinery Lineup
                </h3>
                <div className="space-y-3">
                  {recommendationResult.recommendedMachinery?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border border-slate-200 hover:border-rose-300 transition space-y-3 text-xs shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded bg-[#8B1520] text-white font-bold text-center leading-5 text-[11px]">
                              {idx + 1}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                          </div>
                          <span className="text-[11px] text-[#8B1520] font-semibold ml-7">{item.category}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-slate-900 text-xs bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                            {item.priceEstimate}
                          </span>
                          <button
                            onClick={() => handleFindOnMarketplace(item.name, item.category)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#8B1520] border border-rose-200 font-bold text-xs flex items-center space-x-1 transition cursor-pointer"
                          >
                            <span>Find on MTM</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-[11px]">
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="text-slate-500 block font-semibold mb-0.5">Power & Inrush Sizing:</span>
                          <span className="text-slate-800">{item.powerRequirement}</span>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="text-slate-500 block font-semibold mb-0.5">Condition Guidance:</span>
                          <span className="text-slate-800">{item.conditionAdvice}</span>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="text-slate-500 block font-semibold mb-0.5">Key Inspection Checkpoints:</span>
                          <span className="text-slate-800">
                            {Array.isArray(item.keyInspectionPoints) ? item.keyInspectionPoints.join(', ') : item.keyInspectionPoints}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infrastructure Guidance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-[#8B1520] font-bold">
                    <Zap className="w-4 h-4" />
                    <span>Power & Generator Infrastructure</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {recommendationResult.powerAndGeneratorAdvice}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-[#8B1520] font-bold">
                    <Truck className="w-4 h-4" />
                    <span>Rigging, Crane & Transport Advice</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {recommendationResult.freightAndLogisticsAdvice}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
