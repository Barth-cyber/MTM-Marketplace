import React from 'react';
import { 
  ArrowRight, 
  ChevronRight, 
  Armchair, 
  Layers, 
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Flame
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { MTM_CATEGORY_TREE } from '../data/categoryTreeData';
import { getCategoryTheme } from '../utils/categoryThemes';

export const CategoriesView: React.FC = () => {
  const { setActiveView, setSelectedCategory, setSelectedSubcategory, setFilterState, setActiveProduct } = useMarketplace();

  const handleSubSelect = (catName: string, subName: string) => {
    setActiveProduct(null);
    setSelectedCategory(catName);
    setSelectedSubcategory(subName);
    setFilterState(prev => ({
      ...prev,
      category: catName,
      subcategory: subName,
    }));
    setActiveView('category-feed');
  };

  const handlePillarSelect = (catName: string) => {
    setActiveProduct(null);
    setSelectedCategory(catName);
    setSelectedSubcategory('All');
    setFilterState(prev => ({
      ...prev,
      category: catName,
      subcategory: 'All',
    }));
    setActiveView('category-feed');
  };

  const furnitureCat = MTM_CATEGORY_TREE.find(c => c.id === 'cat-furniture');
  const metalWeldingCat = MTM_CATEGORY_TREE.find(c => c.id === 'cat-metal-welding');
  const otherCats = MTM_CATEGORY_TREE.filter(c => c.id !== 'cat-furniture' && c.id !== 'cat-metal-welding');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Directory Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center space-x-2 text-[#8B1520] font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Industrial Equipment & Supply Taxonomy</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          MTM Complete Industrial Category Directory
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
          Comprehensive multi-vendor classification for heavy machinery, specialized production lines, woodworking verticals, construction plant, and industrial raw stock across Nigeria and West Africa.
        </p>
      </div>

      {/* ── 1. METAL WELDING AND FABRICATION SPECIALIST VERTICAL SECTION ── */}
      {metalWeldingCat && (
        <div className="bg-rose-50/65 rounded-2xl border border-rose-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-200/80">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-xl bg-[#8B1520] text-white shadow-xs">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#8B1520] text-white">
                    Specialist Vertical
                  </span>
                  <span className="text-xs font-bold text-rose-900">
                    Precision Metalworking & Heavy Fabrication
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  1. Metal Welding and Fabrication
                </h2>
                <p className="text-xs text-slate-600 max-w-2xl mt-0.5">
                  {metalWeldingCat.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handlePillarSelect('Metal Welding and Fabrication')}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shrink-0 self-start sm:self-auto shadow-md border border-[#7A101A]/30 cursor-pointer"
            >
              <span>Browse All Welding Machinery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metalWeldingCat.departments?.map((dept) => (
              <div
                key={dept.name}
                className="bg-white rounded-xl border border-rose-200 p-4 shadow-2xs hover:border-rose-500 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-rose-700 transition">
                    {dept.name}
                  </h3>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    {dept.items.length} items
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  {dept.description}
                </p>

                <div className="space-y-1">
                  {dept.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSubSelect('Metal Welding and Fabrication', item)}
                      className="w-full text-left px-2 py-1 rounded text-xs text-slate-700 hover:text-rose-800 hover:bg-rose-50 transition flex items-center justify-between group/item"
                    >
                      <span className="truncate">{item}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover/item:text-rose-600" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. FURNITURE MANUFACTURING SPECIALIST VERTICAL SECTION ── */}
      {furnitureCat && (
        <div className="bg-amber-50/60 rounded-2xl border-2 border-amber-300 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-xl bg-amber-600 text-white shadow">
                <Armchair className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-600 text-white">
                    Specialist Vertical
                  </span>
                  <span className="text-xs font-bold text-amber-900">
                    Joinery & Industrial Woodworking
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  6. Furniture Manufacturing Category
                </h2>
                <p className="text-xs text-slate-600 max-w-2xl mt-0.5">
                  {furnitureCat.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handlePillarSelect('Furniture Manufacturing')}
              className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shrink-0 self-start sm:self-auto"
            >
              <span>Browse All Furniture Machinery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 8 Manufacturing Departments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {furnitureCat.departments?.map((dept) => (
              <div
                key={dept.name}
                className="bg-white rounded-xl border border-amber-200 p-4 shadow-2xs hover:border-amber-500 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-700 transition">
                    {dept.name}
                  </h3>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {dept.items.length} items
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  {dept.description}
                </p>

                <div className="space-y-1">
                  {dept.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSubSelect('Furniture Manufacturing', item)}
                      className="w-full text-left px-2 py-1 rounded text-xs text-slate-700 hover:text-amber-800 hover:bg-amber-50 transition flex items-center justify-between group/item"
                    >
                      <span className="truncate">{item}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover/item:text-amber-600" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. OTHER MTM CATEGORY TREE (A - E + MATERIALS) ── */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            7. Other MTM Category Tree
          </h2>
          <p className="text-xs text-slate-500">
            Complete technical breakdown for Industrial Machinery, Construction, Agriculture, Electrical, Workshop Tools, and Materials.
          </p>
        </div>

        <div className="space-y-6">
          {otherCats.map((cat) => {
            const theme = getCategoryTheme(cat.name);
            const Icon = theme.icon;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 transition-all hover:border-slate-300"
              >
                {/* Category Header with Dynamic Color Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-2.5 rounded-xl text-white shadow ${theme.accentBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                          Sector
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {cat.tagline}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePillarSelect(cat.name)}
                    className={`py-2 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 shrink-0 border ${theme.badgeBg} ${theme.accentText} ${theme.badgeBorder} hover:opacity-90 self-start sm:self-auto`}
                  >
                    <span>Browse {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subcategory Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => handleSubSelect(cat.name, sub)}
                      className={`p-3 rounded-lg ${theme.lightBg} hover:bg-white border border-slate-200 ${theme.borderHover} text-left transition flex items-center justify-between group shadow-2xs`}
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-slate-950 transition block">
                          {sub}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Verified Units
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
