import React from 'react';
import { 
  X, 
  Bell, 
  Check, 
  Trash2, 
  TrendingDown, 
  FileCheck, 
  ArrowRight, 
  Sparkles, 
  Tag,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const NotificationsDrawer: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    markAllNotificationsAsRead,
    dismissNotification,
    isNotificationsOpen,
    setIsNotificationsOpen,
    setActiveProduct,
    products,
    formatPrice,
  } = useMarketplace();

  if (!isNotificationsOpen) return null;

  const handleOpenProduct = (productId?: string) => {
    if (!productId) return;
    const found = products.find(p => p.id === productId);
    if (found) {
      setActiveProduct(found);
      setIsNotificationsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200 animate-slideLeft">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm sm:text-base">
                Marketplace Notifications
              </h3>
              <p className="text-[11px] text-slate-500">
                {unreadNotificationCount > 0 
                  ? `${unreadNotificationCount} unread price alerts & updates`
                  : 'All notifications caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {unreadNotificationCount > 0 && (
              <button
                id="mark-all-read-btn"
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-bold text-[#1E40AF] hover:underline px-2 py-1 rounded bg-blue-50"
                title="Mark all as read"
              >
                Mark Read
              </button>
            )}
            <button
              id="close-notifications-drawer-btn"
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 border border-slate-200 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
              title="Close notifications"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No notifications yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Set price alerts on machinery or book inspections to receive real-time updates here.
              </p>
            </div>
          ) : (
            notifications.map(notif => {
              const isPriceDrop = notif.type === 'price_drop';

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-xl border transition relative space-y-2 ${
                    !notif.read
                      ? 'bg-blue-50/40 border-blue-200 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-2.5">
                      {isPriceDrop ? (
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <TrendingDown className="w-4 h-4 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#1E40AF] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <FileCheck className="w-4 h-4 text-[#1E40AF]" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-black text-slate-900 leading-snug">
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => dismissNotification(notif.id)}
                      className="text-slate-400 hover:text-red-500 p-1 transition"
                      title="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pl-9">
                    {notif.message}
                  </p>

                  {/* If price drop has target product, offer quick direct view button */}
                  {notif.productId && (
                    <div className="pl-9 pt-1 flex items-center justify-between">
                      {notif.discountAmount && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {notif.discountAmount}
                        </span>
                      )}
                      <button
                        onClick={() => handleOpenProduct(notif.productId)}
                        className="text-xs font-bold text-[#1E40AF] hover:underline flex items-center space-x-1 ml-auto"
                      >
                        <span>View Updated Price & Specs</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
          <span>MTM Real-Time Price & Inspection Dispatch Feed</span>
        </div>

      </div>
    </div>
  );
};
