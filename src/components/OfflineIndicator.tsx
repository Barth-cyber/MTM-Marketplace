import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOffline, setIsOffline, showToast } = useMarketplace();

  const handleToggle = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    if (nextState) {
      showToast('⚠️ Offline Mode Activated: Running on local IndexedDB/ServiceWorker Cache.');
    } else {
      showToast('⚡ Back Online: Syncing local Escrow state with MTM Hub servers...');
    }
  };

  return (
    <div id="offline-simulator-widget" className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
          isOffline
            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 animate-pulse'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
        }`}
        title={isOffline ? "Currently simulating offline behavior" : "Click to simulate offline mode"}
      >
        {isOffline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">Offline</span>
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
            <span className="hidden sm:inline">Online</span>
          </>
        )}
      </button>

      {isOffline && (
        <span className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
          <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
          <span>Using Local Cache</span>
        </span>
      )}
    </div>
  );
};
