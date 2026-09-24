import React from 'react';
import { ArrowLeft, X, GripHorizontal, Minus } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface BackNavigationProps {
  onBack: () => void;
  label?: string;
  showClose?: boolean;
  onClose?: () => void;
  dragHandleProps?: any;
  customTitle?: string;
}

export const BackNavigation: React.FC<BackNavigationProps> = ({ 
  onBack, 
  label = 'Back', 
  showClose = true, 
  onClose,
  dragHandleProps,
  customTitle
}) => {
  const { setAreModalsHidden } = useMarketplace();
  const displayTitle = customTitle && customTitle !== 'Move Window' ? customTitle : null;
  const handleClose = onClose || onBack;

  return (
    <div 
      className="flex items-center justify-between py-2.5 px-3 sm:px-4 bg-slate-100 border-b border-slate-200 select-none shrink-0"
      {...dragHandleProps}
    >
      <button
        onClick={onBack}
        className="no-drag inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs transition cursor-pointer"
        title="Go back"
      >
        <ArrowLeft className="w-4 h-4 text-[#1E40AF]" />
        <span>{label}</span>
      </button>

      {/* Center header title if provided */}
      {displayTitle ? (
        <div className="flex items-center gap-1.5 text-slate-500 transition px-2 py-0.5 rounded-md">
          <span className="text-[11px] font-bold tracking-wide text-slate-600 hidden sm:inline">
            {displayTitle}
          </span>
        </div>
      ) : (
        <div className="w-4" />
      )}

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setAreModalsHidden(true)}
          className="no-drag inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer shadow-2xs text-[10px] font-extrabold uppercase tracking-wider"
          title="Minimize window"
        >
          <Minus className="w-3.5 h-3.5 text-[#1E40AF]" />
          <span>Minimize</span>
        </button>

        {showClose && handleClose ? (
          <button
            onClick={handleClose}
            className="no-drag p-1.5 sm:p-2 rounded-xl bg-white hover:bg-rose-600 hover:text-white text-slate-700 hover:border-rose-600 border border-slate-300 transition-all duration-150 cursor-pointer shadow-xs flex items-center justify-center group"
            title="Close dialog (Esc)"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 font-bold transition-transform group-hover:scale-110" />
          </button>
        ) : null}
      </div>
    </div>
  );
};
