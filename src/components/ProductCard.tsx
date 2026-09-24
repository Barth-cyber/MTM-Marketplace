import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Video, 
  MapPin, 
  ArrowRightLeft, 
  ShoppingCart, 
  Star, 
  Eye, 
  Zap,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { getCategoryTheme } from '../utils/categoryThemes';

interface ProductCardProps {
  product: Product;
  onSelect?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const {
    formatPrice,
    addToCart,
    isInCart,
    toggleCart,
    addToCompare,
    compareList,
    setActiveProduct,
    setActiveNegotiationProduct,
    setIsCartOpen,
    showToast,
  } = useMarketplace();

  const [isFavorite, setIsFavorite] = useState(false);
  const theme = getCategoryTheme(product.category || product.subcategory);
  const isCompared = compareList.some(p => p.id === product.id);
  const inCart = isInCart(product.id);

  const handleCardClick = () => {
    if (onSelect) onSelect();
    else setActiveProduct(product);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inCart) {
      addToCart(product);
    }
    setIsCartOpen(true);
    showToast(`⚡ Quick Buy: Initiating direct checkout for "${product.title}"`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    showToast(
      !isFavorite
        ? `Added "${product.title}" to saved wishlist`
        : `Removed "${product.title}" from saved wishlist`
    );
  };

  // Render Stars
  const ratingValue = product.rating || 4.8;
  const fullStars = Math.floor(ratingValue);
  const hasHalfStar = ratingValue % 1 >= 0.5;

  return (
    <div 
      className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-2xs"
    >
      {/* ── 1. MACHINE IMAGE & FAVORITE ♡ ── */}
      <div 
        className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <img
          src={product.images[0] || '/images/scm_panel_saw_1790179186875.jpg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/scm_panel_saw_1790179186875.jpg';
          }}
        />

        {/* Top Floating Category Tag & Wishlist Heart */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Category-Specific Themed Tag */}
          <span 
            className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border bg-white/95 text-slate-800 border-slate-200 shadow-2xs backdrop-blur-xs"
          >
            {product.category || product.subcategory}
          </span>

          {/* Favorite Heart Toggle Button ♡ */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className="pointer-events-auto p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-[#8B1520] transition shadow-2xs"
            title={isFavorite ? 'Remove from Saved' : 'Save Machine to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart 
              className={`w-4 h-4 transition ${
                isFavorite ? 'fill-[#8B1520] text-[#8B1520]' : 'text-slate-500 hover:text-[#8B1520]'
              }`} 
            />
          </button>
        </div>

        {/* Bottom Feature Badges (Inspection / Video) */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
          {product.hasInspectionCertificate && (
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/95 text-slate-800 border border-slate-200 text-[10px] font-bold shadow-2xs backdrop-blur-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Verified {product.inspectionScore || 85}%</span>
            </div>
          )}

          {product.hasVideoTest && (
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/95 text-slate-800 border border-slate-200 text-[10px] font-bold shadow-2xs backdrop-blur-xs">
              <Video className="w-3 h-3 text-[#8B1520]" />
              <span>Run Video</span>
            </div>
          )}

          {product.isLiquidation && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#8B1520] text-white flex items-center space-x-0.5 shadow-2xs ml-auto">
              <span>-{product.liquidationDiscount || 25}%</span>
            </span>
          )}
        </div>
      </div>

      {/* ── 2. PRODUCT SPECIFICATION & DETAILS BODY ── */}
      <div className="p-4 flex-1 flex flex-col justify-between border-t border-slate-100">
        <div>
          {/* Brand & Subcategory Micro-Header */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-slate-700">
              {product.brand}
            </span>
            <span className="truncate ml-2 text-slate-500">{product.subcategory}</span>
          </div>

          {/* Title */}
          <h3
            onClick={handleCardClick}
            className="text-base font-black text-slate-900 group-hover:text-[#8B1520] line-clamp-1 transition cursor-pointer mb-1.5 leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Star Rating Display */}
          <div className="flex items-center space-x-1.5 mb-2.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < fullStars
                      ? 'fill-amber-400 text-amber-400'
                      : i === fullStars && hasHalfStar
                      ? 'fill-amber-200 text-amber-200'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700">{ratingValue.toFixed(1)}</span>
            {product.ratingCount && (
              <span className="text-[10px] text-slate-400 font-normal">({product.ratingCount})</span>
            )}
          </div>

          {/* Price */}
          <div className="mb-2">
            <div className="text-lg font-black text-slate-900 leading-tight">
              {formatPrice(product.priceNGN, product.priceUSD)}
            </div>
            {product.originalPriceNGN && (
              <span className="text-xs text-slate-400 line-through font-normal">
                {formatPrice(product.originalPriceNGN, product.originalPriceUSD)}
              </span>
            )}
          </div>

          {/* Condition Line */}
          <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B1520]" />
            <span>{product.condition}</span>
          </div>

          {/* Location Line */}
          <div className="flex items-center space-x-1 text-xs text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {product.location.city}, {product.location.state === 'Edo State' || product.location.state === 'Lagos' ? 'Nigeria' : product.location.state}
            </span>
          </div>

          {/* Seller Trust Badge */}
          {product.seller && (
            <div className="mb-3 flex items-center">
              <span className="text-[10px] bg-slate-100 text-slate-700 font-bold border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Seller: {product.seller.name}</span>
              </span>
            </div>
          )}
        </div>

        {/* ── 3. ACTIONS: [VIEW DETAILS] / [QUICK BUY] ── */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleCardClick}
              className="py-2 px-2.5 rounded-lg bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-bold text-xs transition flex items-center justify-center space-x-1 cursor-pointer shadow-sm border border-[#7A101A]/30"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>

            <button
              onClick={handleQuickBuy}
              className="py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition flex items-center justify-center space-x-1 cursor-pointer shadow-3xs"
              title="Quick Buy & Checkout immediately"
            >
              <Zap className="w-3.5 h-3.5 text-[#8B1520]" />
              <span>Quick Buy</span>
            </button>
          </div>

          {/* Secondary Quick Action Bar */}
          <div className="grid grid-cols-3 gap-1 pt-1 text-[11px]">
            <button
              onClick={() => setActiveNegotiationProduct(product)}
              className="py-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold transition text-center cursor-pointer"
              title="Make Offer"
            >
              Offer
            </button>

            <button
              onClick={() => toggleCart(product, true, false)}
              className={`py-1 px-1 rounded font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                inCart
                  ? 'bg-rose-50 hover:bg-rose-100 text-[#8B1520] border border-rose-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }`}
              title={inCart ? 'Remove from Cart (Uncart)' : 'Add to Cart / Order'}
            >
              {inCart ? (
                <>
                  <Check className="w-3 h-3 text-[#8B1520]" />
                  <span>Uncart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3" />
                  <span>+ Cart</span>
                </>
              )}
            </button>

            <button
              onClick={() => addToCompare(product)}
              className={`py-1 px-1.5 rounded border transition flex items-center justify-center space-x-0.5 text-center cursor-pointer ${
                isCompared
                  ? 'bg-slate-200 text-slate-900 border-slate-400 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title="Compare"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>{isCompared ? 'Added' : 'Compare'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
