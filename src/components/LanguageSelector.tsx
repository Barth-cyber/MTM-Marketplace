import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../utils/i18n';

interface LanguageSelectorProps {
  variant?: 'header' | 'topbar' | 'mobile';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'topbar' }) => {
  const { currentLanguage, setLanguage, showToast } = useMarketplace();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
    const selected = SUPPORTED_LANGUAGES.find(l => l.code === code);
    showToast(`🌐 Language switched to ${selected?.name} (${selected?.nativeName})`);
  };

  if (variant === 'mobile') {
    return (
      <div className="space-y-2 py-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#1E40AF]" />
          <span>Select Regional Language</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`p-2 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                currentLanguage === lang.code
                  ? 'bg-blue-50 border-[#1E40AF] text-[#1E40AF]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span>{lang.flag}</span>
                <span className="truncate">{lang.name}</span>
              </div>
              {currentLanguage === lang.code && <Check className="w-3.5 h-3.5 text-[#1E40AF] shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        id="language-selector-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
          variant === 'topbar'
            ? 'px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
            : 'px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
        }`}
        title="Switch Marketplace Language"
        aria-label="Switch Marketplace Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#FACC15]" />
        <span className="flex items-center gap-1">
          <span>{activeLang.flag}</span>
          <span className="font-semibold">{activeLang.name}</span>
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-2xl border border-slate-200 py-1 z-[10000] animate-fadeIn">
          <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Nigerian Regional & Trade Languages
          </div>
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition cursor-pointer ${
                  currentLanguage === lang.code ? 'bg-blue-50/70 text-[#1E40AF] font-black' : 'text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <div>
                    <div className="flex items-center gap-1">
                      <span>{lang.name}</span>
                      <span className="text-[10px] text-slate-400">({lang.nativeName})</span>
                    </div>
                    <span className="text-[9.5px] text-slate-400 block">{lang.region}</span>
                  </div>
                </div>
                {currentLanguage === lang.code && (
                  <Check className="w-4 h-4 text-[#1E40AF] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
