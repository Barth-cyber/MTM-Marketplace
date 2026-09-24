export interface ReorderItem {
  id: string;
  sku: string;
  name: string;
  category: 'Adhesives & Chemicals' | 'Cutting Blades' | 'Edge Banding' | 'Lubricants' | 'CNC Tooling' | 'Welding & Spare Parts';
  brand: string;
  compatibleMachinery: string;
  unitPriceNGN: number;
  unitPriceUSD: number;
  packSize: string;
  minOrderQty: number;
  stockLevel: 'In Stock (Direct Hub)' | 'Low Stock' | 'Bulk Available';
  hubLocation: string;
  vendorName: string;
  image: string;
  rating: number;
  bulkDiscountThreshold: number;
  bulkDiscountPct: number;
  estimatedDispatchHours: number;
  lastOrderedDate?: string;
  lastOrderedQty?: number;
}

export const QUICK_REORDER_CATALOG: ReorderItem[] = [
  {
    id: 'reord-1',
    sku: 'JOW-EVA-25KG',
    name: 'High-Strength EVA/PUR Hotmelt Edgebanding Glue Pellets (25kg Bag)',
    category: 'Adhesives & Chemicals',
    brand: 'Jowat Industrial Germany',
    compatibleMachinery: 'Automatic Edge Banders (SCM, Homag, KDT, Nanxing)',
    unitPriceNGN: 68000,
    unitPriceUSD: 45,
    packSize: '25kg Heavy Duty Kraft Sack',
    minOrderQty: 1,
    stockLevel: 'Bulk Available',
    hubLocation: 'Benin City Hub (Interior Duct Ltd) & Lagos Hub',
    vendorName: 'Interior Duct Ltd',
    image: '/images/edge_bander_banner.jpg',
    rating: 5.0,
    bulkDiscountThreshold: 5,
    bulkDiscountPct: 12,
    estimatedDispatchHours: 12,
    lastOrderedDate: '2026-08-14',
    lastOrderedQty: 3
  },
  {
    id: 'reord-2',
    sku: 'FRD-TCT-300-96T',
    name: '300mm x 30mm Carbide TCT Sliding Panel Saw Main Blade (96T Triple Chip)',
    category: 'Cutting Blades',
    brand: 'Freud Industrial Pro',
    compatibleMachinery: 'Sliding Table Saws (SCM Si400, Altendorf F45, Robland, Felder)',
    unitPriceNGN: 95000,
    unitPriceUSD: 63,
    packSize: '1 Blade / Protective Wooden Casing',
    minOrderQty: 1,
    stockLevel: 'In Stock (Direct Hub)',
    hubLocation: 'Benin City Hub & Lagos Hub',
    vendorName: 'Interior Duct Ltd',
    image: '/images/scm_panel_saw_1790179186875.jpg',
    rating: 4.9,
    bulkDiscountThreshold: 3,
    bulkDiscountPct: 10,
    estimatedDispatchHours: 18,
    lastOrderedDate: '2026-08-02',
    lastOrderedQty: 2
  },
  {
    id: 'reord-3',
    sku: 'PRD-PVC-WOD-100M',
    name: '0.8mm x 22mm Premium Walnut Woodgrain PVC Edge Banding Tape (100m Roll)',
    category: 'Edge Banding',
    brand: 'Proadec Architectural Edging',
    compatibleMachinery: 'Manual & Automatic Edge Banders',
    unitPriceNGN: 24500,
    unitPriceUSD: 16,
    packSize: '100m Continuous Roll',
    minOrderQty: 2,
    stockLevel: 'Bulk Available',
    hubLocation: 'Benin City Hub (Interior Duct Ltd)',
    vendorName: 'Interior Duct Ltd',
    image: '/images/edge_bander_banner.jpg',
    rating: 4.8,
    bulkDiscountThreshold: 10,
    bulkDiscountPct: 15,
    estimatedDispatchHours: 24,
    lastOrderedDate: '2026-07-28',
    lastOrderedQty: 5
  },
  {
    id: 'reord-4',
    sku: 'MO-HYD-DTE24-20L',
    name: 'Mobil DTE 24 ISO VG 32 Heavy Industrial Hydraulic Oil (20L Drum)',
    category: 'Lubricants',
    brand: 'Mobil Industrial Lubricants',
    compatibleMachinery: 'Hydraulic Press Brakes, Guillotine Shears, CNC Lathes',
    unitPriceNGN: 115000,
    unitPriceUSD: 76,
    packSize: '20L Sealed Steel Drum',
    minOrderQty: 1,
    stockLevel: 'In Stock (Direct Hub)',
    hubLocation: 'Oregun Industrial Hub, Lagos',
    vendorName: 'Oregun Machinery & Tooling Hub',
    image: '/images/hydraulic_press_brake_1790179207683.jpg',
    rating: 4.9,
    bulkDiscountThreshold: 4,
    bulkDiscountPct: 8,
    estimatedDispatchHours: 24,
    lastOrderedDate: '2026-07-15',
    lastOrderedQty: 1
  },
  {
    id: 'reord-5',
    sku: 'AMN-CNC-12MM-DIA',
    name: 'Solid Diamond PCD Compression CNC Router Bit (12mm Shank x 35mm Cut)',
    category: 'CNC Tooling',
    brand: 'Amana Tool Industrial',
    compatibleMachinery: '3-Axis & 5-Axis CNC Nesting Centers',
    unitPriceNGN: 42000,
    unitPriceUSD: 28,
    packSize: '1 Bit with Protective Sleeve',
    minOrderQty: 1,
    stockLevel: 'In Stock (Direct Hub)',
    hubLocation: 'Benin City Hub & Lagos Hub',
    vendorName: 'Midwest Woodworks & Tooling',
    image: '/images/heavy_cnc_router_1790206292970.jpg',
    rating: 5.0,
    bulkDiscountThreshold: 5,
    bulkDiscountPct: 10,
    estimatedDispatchHours: 12
  },
  {
    id: 'reord-6',
    sku: 'OER-WELD-6013-5KG',
    name: 'Heavy Duty Mild Steel Welding Electrodes E6013 3.2mm (5kg Pack)',
    category: 'Welding & Spare Parts',
    brand: 'Oerlikon Bohler Welding',
    compatibleMachinery: 'Industrial ARC / MMA / TIG Inverter Welders',
    unitPriceNGN: 18500,
    unitPriceUSD: 12,
    packSize: '5kg Moisture-Proof Carton',
    minOrderQty: 2,
    stockLevel: 'Bulk Available',
    hubLocation: 'Trans-Amadi Hub, Port Harcourt & Aba Yard',
    vendorName: 'Trans-Amadi Equipment Co.',
    image: '/images/welding_machine_1790001750091.jpg',
    rating: 4.8,
    bulkDiscountThreshold: 10,
    bulkDiscountPct: 12,
    estimatedDispatchHours: 24
  },
  {
    id: 'reord-7',
    sku: 'CMT-SCOR-120MM-2P',
    name: 'CMT Split 2-Piece Diamond Scoring Blade Set 120mm x 20mm (Conical Teeth)',
    category: 'Cutting Blades',
    brand: 'CMT Orange Tools',
    compatibleMachinery: 'Panel Saws (Prevent bottom chip-out on double-faced melamine)',
    unitPriceNGN: 54000,
    unitPriceUSD: 36,
    packSize: '1 Split Twin Set with Shims',
    minOrderQty: 1,
    stockLevel: 'In Stock (Direct Hub)',
    hubLocation: 'Benin City Hub (Interior Duct Ltd)',
    vendorName: 'Interior Duct Ltd',
    image: '/images/scm_panel_saw_1790001707902.jpg',
    rating: 5.0,
    bulkDiscountThreshold: 3,
    bulkDiscountPct: 8,
    estimatedDispatchHours: 12
  },
  {
    id: 'reord-8',
    sku: 'SCM-FEED-ROLR-SET',
    name: 'High-Traction Vulcanized Rubber Feed Roller Set for Edge Banders (4-Pack)',
    category: 'Welding & Spare Parts',
    brand: 'SCM / KDT Compatible Heavy Spares',
    compatibleMachinery: 'Edge Bander Drive Conveyors & Top Pressure Beams',
    unitPriceNGN: 32000,
    unitPriceUSD: 21,
    packSize: 'Set of 4 Rollers',
    minOrderQty: 1,
    stockLevel: 'In Stock (Direct Hub)',
    hubLocation: 'Benin City Hub & Lagos Hub',
    vendorName: 'Interior Duct Ltd',
    image: '/images/industrial_wood_planer_1790179230947.jpg',
    rating: 4.9,
    bulkDiscountThreshold: 3,
    bulkDiscountPct: 10,
    estimatedDispatchHours: 18
  }
];
