import React from 'react';
import { 
  Armchair, 
  Cpu, 
  HardHat, 
  Tractor, 
  Zap, 
  Wrench, 
  Layers, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { MTM_CATEGORY_TREE } from '../data/categoryTreeData';
import { getCategoryTheme } from '../utils/categoryThemes';

export const FeaturedCategories: React.FC = () => {
  const { setActiveView, setSelectedCategory, setSelectedSubcategory, setFilterState, setActiveProduct } = useMarketplace();

  const handleSubcategoryClick = (categoryName: string, sub: string) => {
    setActiveProduct(null);
    setSelectedCategory(categoryName);
    setSelectedSubcategory(sub);
    setFilterState(prev => ({
      ...prev,
      category: categoryName,
      subcategory: sub,
    }));
    setActiveView('category-feed');
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveProduct(null);
    setSelectedCategory(categoryName);
    setSelectedSubcategory('All');
    setFilterState(prev => ({
      ...prev,
      category: categoryName,
      subcategory: 'All',
    }));
    setActiveView('category-feed');
  };

  const specialistVerticals = MTM_CATEGORY_TREE.filter(c => c.isSpecialistVertical);
  const otherCategories = MTM_CATEGORY_TREE.filter(c => !c.isSpecialistVertical);

  return (
    <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      
      {/* Section Header (High Contrast on Light Canvas) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-slate-300">
        <div>
          <span className="text-[#7A0C14] font-black text-xs uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B31221]" />
            <span>Industrial Marketplace Taxonomy</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Featured Categories & Specialist Verticals
          </h2>
          <p className="text-slate-600 font-medium text-xs sm:text-sm mt-1">
            Deep technical categorization designed for joinery plants, civil contractors, agro-processors, and factories.
          </p>
        </div>

        <button
          id="explore-all-categories-link"
          onClick={() => setActiveView('categories')}
          className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-[#7A0C14] hover:text-[#990F1B] transition cursor-pointer"
        >
          <span>View Complete Industrial Tree</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── 1. FLAGSHIP SPECIALIST VERTICALS (MATCHING OTHER MTM INDUSTRIAL VERTICALS LAYOUT & ARRANGEMENT) ── */}
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Flagship Specialist Verticals
            </h3>
            <p className="text-xs text-slate-600">
              Heavy woodworking joinery & precision metal fabrication plants with verified inspection and escrow protection.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialistVerticals.map((vert) => {
            const isWelding = vert.id === 'cat-metal-welding';
            const Icon = isWelding ? Zap : Armchair;

            return (
              <div
                key={vert.id}
                className="bg-white rounded-xl overflow-hidden flex flex-col group shadow-xs hover:border-slate-300 border border-slate-200 transition-all duration-300"
              >
                {/* Banner & Icon with Authentic Used Industrial Patina */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={isWelding ? "/images/metal_welding_plant_1790179162965.jpg" : "/images/ai_workshop_matchmaker_1790179152499.jpg"}
                    alt={vert.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/scm_panel_saw_1790179186875.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#8B1520] border border-rose-200 shadow-xs flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Specialist Vertical</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2.5 rounded-lg text-white font-bold shadow bg-[#8B1520]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg text-white">
                          {vert.name}
                        </h4>
                        <span className="text-[11px] text-slate-200 font-medium">
                          {vert.itemCount}+ Verified Units Listed (Used / Reconditioned)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Departments / Subcategories List */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {vert.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vert.departments?.slice(0, 4).map((dept) => (
                      <button
                        key={dept.name}
                        onClick={() => handleSubcategoryClick(vert.name, dept.name)}
                        className="text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-rose-50 hover:text-[#8B1520] flex items-center justify-between transition border border-slate-200 group/sub cursor-pointer"
                      >
                        <span className="truncate">{dept.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/sub:text-[#8B1520]" />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCategoryClick(vert.name)}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white cursor-pointer shadow-md border border-[#7A101A]/30"
                  >
                    <span>Explore All {vert.name} Departments</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. OTHER MTM INDUSTRIAL CATEGORIES TREE (LIGHT SLATE FINISH) ── */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900">
            Other MTM Industrial Verticals
          </h3>
          <p className="text-xs text-slate-600">
            Full heavy plant, power generation, civil engineering, agricultural mechanization, and fabrication sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherCategories.map((cat) => {
            const theme = getCategoryTheme(cat.name);
            const Icon = theme.icon;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl overflow-hidden flex flex-col group shadow-xs hover:border-slate-300 border border-slate-200 transition-all duration-300"
              >
                {/* Banner & Icon */}
                <div className="relative h-36 overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-lg text-white font-bold shadow bg-[#8B1520]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-white">
                          {cat.name}
                        </h4>
                        <span className="text-[11px] text-slate-200 font-medium">
                          {cat.itemCount}+ Units Listed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subcategory List */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1 mb-4">
                    {cat.subcategories.slice(0, 6).map((sub) => (
                      <button
                        key={sub}
                        onClick={() => handleSubcategoryClick(cat.name, sub)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-700 font-semibold hover:text-[#8B1520] hover:bg-slate-50 flex items-center justify-between transition group/sub cursor-pointer"
                      >
                        <span className="truncate">{sub}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/sub:text-[#8B1520] group-hover/sub:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                    {cat.subcategories.length > 6 && (
                      <button
                        onClick={() => handleCategoryClick(cat.name)}
                        className="w-full text-left px-2.5 py-1 text-[11px] font-bold text-[#8B1520] hover:underline cursor-pointer"
                      >
                        +{cat.subcategories.length - 6} more sub-sectors...
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    className="w-full py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white cursor-pointer shadow-md border border-[#7A101A]/30"
                  >
                    <span>Browse All {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
