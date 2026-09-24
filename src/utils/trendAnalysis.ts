import { Product, SmartProductTrend, MarketCategoryTrend, PriceTrendDataPoint, RegionalDemandMetric } from '../types';

export const MARKET_CATEGORY_TRENDS: MarketCategoryTrend[] = [
  {
    category: 'Furniture Manufacturing',
    growthRatePct: 14.8,
    demandRank: 1,
    averageDepreciationRate: '5.2% / year (Premium European brands)',
    topSoughtModel: 'Altendorf F45 & SCM Si400 Panel Saws',
    sentiment: 'Bullish Demand',
    activeListingsCount: 18,
  },
  {
    category: 'Industrial Machinery',
    growthRatePct: 9.4,
    demandRank: 2,
    averageDepreciationRate: '6.8% / year (CNC & Metalworking)',
    topSoughtModel: 'Yawei 100-Ton CNC Press Brake',
    sentiment: 'High Liquidity',
    activeListingsCount: 24,
  },
  {
    category: 'Electrical & Power',
    growthRatePct: 22.5,
    demandRank: 3,
    averageDepreciationRate: '4.1% / year (Perkins/Cummins Diesel)',
    topSoughtModel: 'Perkins 250kVA Heavy Duty Soundproof Genset',
    sentiment: 'Bullish Demand',
    activeListingsCount: 16,
  },
  {
    category: 'Construction Plant',
    growthRatePct: 8.1,
    demandRank: 4,
    averageDepreciationRate: '7.5% / year (Heavy Earthmoving)',
    topSoughtModel: 'CAT 320D Hydraulic Excavator',
    sentiment: 'Stable Manufacturing',
    activeListingsCount: 12,
  },
  {
    category: 'Agriculture',
    growthRatePct: 18.2,
    demandRank: 5,
    averageDepreciationRate: '4.8% / year (Milling & Tractors)',
    topSoughtModel: 'Massey Ferguson 375 4WD Tractor',
    sentiment: 'Bullish Demand',
    activeListingsCount: 15,
  },
  {
    category: 'Workshop Tools',
    growthRatePct: 11.0,
    demandRank: 6,
    averageDepreciationRate: '8.0% / year (Heavy Power Tooling)',
    topSoughtModel: 'Bosch Professional & Makita Cordless Kits',
    sentiment: 'High Liquidity',
    activeListingsCount: 32,
  },
];

/**
 * Generate deep Smart Trend Analysis for any given product
 */
export function getProductTrendAnalysis(product: Product): SmartProductTrend {
  const currentPriceNGN = product.priceNGN;
  const currentPriceUSD = product.priceUSD;

  // Base brand reputation multiplier for residual value
  const brand = (product.brand || '').toLowerCase();
  const isPremiumBrand = 
    brand.includes('altendorf') || 
    brand.includes('scm') || 
    brand.includes('biesse') || 
    brand.includes('homag') || 
    brand.includes('caterpillar') || 
    brand.includes('cat') || 
    brand.includes('perkins') ||
    brand.includes('cummins') ||
    brand.includes('bosch');

  // Residual Value Retention
  const residualRetention2Yr = isPremiumBrand ? 78 : 64;
  const residualRetention4Yr = isPremiumBrand ? 62 : 46;

  // Historical price point simulations (last 12 months in 4 periods)
  const isLiquidation = !!product.isLiquidation || !!product.liquidationDiscount;
  
  // Historical data points
  const p1_priceNGN = Math.round(currentPriceNGN * (isLiquidation ? 1.35 : 0.88));
  const p2_priceNGN = Math.round(currentPriceNGN * (isLiquidation ? 1.25 : 0.94));
  const p3_priceNGN = Math.round(currentPriceNGN * (isLiquidation ? 1.15 : 0.98));
  const p4_priceNGN = currentPriceNGN;

  const historicalPrices: PriceTrendDataPoint[] = [
    {
      period: 'Q3 2025 (12m ago)',
      priceNGN: p1_priceNGN,
      priceUSD: Math.round(p1_priceNGN / 1400),
      marketAverageNGN: Math.round(currentPriceNGN * 1.12),
      volumeIndex: 4,
      eventNote: 'Pre-tariff benchmark pricing',
    },
    {
      period: 'Q4 2025 (9m ago)',
      priceNGN: p2_priceNGN,
      priceUSD: Math.round(p2_priceNGN / 1450),
      marketAverageNGN: Math.round(currentPriceNGN * 1.08),
      volumeIndex: 6,
      eventNote: 'End of year manufacturing capex cycle',
    },
    {
      period: 'Q1 2026 (6m ago)',
      priceNGN: p3_priceNGN,
      priceUSD: Math.round(p3_priceNGN / 1480),
      marketAverageNGN: Math.round(currentPriceNGN * 1.04),
      volumeIndex: 9,
      eventNote: 'Industrial import tariff adjustments',
    },
    {
      period: 'Q2 2026 (3m ago)',
      priceNGN: Math.round(currentPriceNGN * (isLiquidation ? 1.08 : 0.99)),
      priceUSD: Math.round(currentPriceNGN / 1500),
      marketAverageNGN: Math.round(currentPriceNGN * 1.02),
      volumeIndex: 12,
      eventNote: 'MTM certified appraisal baseline',
    },
    {
      period: 'Current (Aug 2026)',
      priceNGN: p4_priceNGN,
      priceUSD: currentPriceUSD,
      marketAverageNGN: Math.round(currentPriceNGN * (isLiquidation ? 1.22 : 1.01)),
      volumeIndex: 15,
      eventNote: isLiquidation ? '⚡ Clearance Markdown Active' : 'Live Seller Asking Price',
    },
  ];

  const twelveMonthChangePct = Math.round(((p4_priceNGN - p1_priceNGN) / p1_priceNGN) * 100);
  const threeMonthVelocity = Math.round(((p4_priceNGN - p3_priceNGN) / p3_priceNGN) * 100);

  // Replacement Cost if ordered brand-new CIF Lagos (typically 1.6x to 2.4x the used price)
  const replacementMultiplier = isPremiumBrand ? 2.1 : 1.7;
  const replacementCostNewNGN = Math.round(currentPriceNGN * replacementMultiplier);
  const replacementSavingsPct = Math.round(((replacementCostNewNGN - currentPriceNGN) / replacementCostNewNGN) * 100);

  // Demand Velocity & Scarcity Assessment
  let demandVelocity: SmartProductTrend['demandVelocity'] = 'High';
  let marketScarcity: SmartProductTrend['marketScarcity'] = 'High Scarcity (Few Units)';
  let aiBuyingVerdict: SmartProductTrend['aiBuyingVerdict'] = 'Strong Buy Now';
  let aiVerdictExplanation = '';

  if (isLiquidation) {
    demandVelocity = 'Surging';
    marketScarcity = 'Critically Scarce';
    aiBuyingVerdict = 'Strong Buy Now';
    aiVerdictExplanation = `This unit is priced ${Math.abs(twelveMonthChangePct)}% below its 12-month trailing valuation due to factory liquidation consignment. Given new equipment import tariffs and a replacement cost of ₦${(replacementCostNewNGN / 1_000_000).toFixed(1)}M, acquiring this verified unit represents an immediate ${replacementSavingsPct}% capital expenditure savings.`;
  } else if (product.inspectionScore && product.inspectionScore >= 90) {
    demandVelocity = 'High';
    marketScarcity = 'High Scarcity (Few Units)';
    aiBuyingVerdict = 'Strong Buy Now';
    aiVerdictExplanation = `With an MTM certified diagnostic score of ${product.inspectionScore}%, this ${product.brand} machine possesses top-tier mechanical alignment and motor insulation. Historical demand for ${product.subcategory} in Lagos and Kano clusters indicates an estimated resale liquidity within 18 days.`;
  } else {
    demandVelocity = 'Stable';
    marketScarcity = 'Balanced Supply';
    aiBuyingVerdict = 'Favorable Entry';
    aiVerdictExplanation = `The asking price aligns with current Nigerian industrial hub transactions. The machine retains strong residual value (${residualRetention2Yr}% expected at 24 months). Submitting an MTM RFQ offer 5%–8% below asking is recommended.`;
  }

  // Regional Industrial Hubs Demand Velocity
  const regionalDemand: RegionalDemandMetric[] = [
    {
      hub: 'Lagos (Ikeja / Oregun / Agbara)',
      demandScore: isPremiumBrand ? 94 : 88,
      demandLevel: 'Surging',
      activeBuyers: isPremiumBrand ? 28 : 19,
      avgDaysOnMarket: 14,
    },
    {
      hub: 'Kano (Bompai / Sharada Industrial)',
      demandScore: product.category === 'Agriculture' || product.category === 'Electrical & Power' ? 96 : 82,
      demandLevel: 'Very High',
      activeBuyers: 21,
      avgDaysOnMarket: 19,
    },
    {
      hub: 'Port Harcourt (Trans-Amadi)',
      demandScore: product.category === 'Industrial Machinery' || product.category === 'Electrical & Power' ? 92 : 76,
      demandLevel: 'High',
      activeBuyers: 15,
      avgDaysOnMarket: 22,
    },
    {
      hub: 'Anambra (Nnewi / Onitsha Cluster)',
      demandScore: product.category === 'Industrial Machinery' || product.category === 'Workshop Tools' ? 90 : 79,
      demandLevel: 'Very High',
      activeBuyers: 18,
      avgDaysOnMarket: 17,
    },
    {
      hub: 'Oyo (Ibadan Industrial Hub)',
      demandScore: 74,
      demandLevel: 'Moderate',
      activeBuyers: 11,
      avgDaysOnMarket: 28,
    },
  ];

  return {
    historicalPrices,
    twelveMonthChangePct,
    threeMonthVelocity,
    demandVelocity,
    marketScarcity,
    residualRetention2Yr,
    residualRetention4Yr,
    replacementCostNewNGN,
    replacementSavingsPct,
    aiBuyingVerdict,
    aiVerdictExplanation,
    regionalDemand,
    industrialInflationIndexPct: 18.6,
  };
}
