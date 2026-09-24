import { CategoryTreeItem } from '../types';

export const MTM_CATEGORY_TREE: CategoryTreeItem[] = [
  // METAL WELDING AND FABRICATION (SPECIALIST VERTICAL)
  {
    id: 'cat-metal-welding',
    name: 'Metal Welding and Fabrication',
    slug: 'metal-welding-fabrication',
    iconName: 'Flame',
    tagline: 'Precision Metalworking, CNC Plasma, Arc & Heavy Structural Fabrication',
    description: 'Heavy duty welding inverters (MIG, TIG, MMA, Submerged Arc), CNC fiber laser & plasma cutting, hydraulic press brakes, plate rolls, lathe turning, milling, and fabrication jigs.',
    colorTheme: 'rose',
    itemCount: 395,
    image: '/images/metal_welding_plant_1790179162965.jpg',
    isSpecialistVertical: true,
    departments: [
      {
        name: 'Welding Equipment',
        description: 'Industrial inverters, pulse MIG/MAG systems, AC/DC TIG for aluminum/stainless, and heavy diesel engine welders',
        items: [
          'MIG / MAG Welder',
          'TIG Welder (AC/DC)',
          'MMA Stick Welder',
          'Multi-Process Inverter',
          'Submerged Arc Welder',
          'Spot Welder',
          'Stud Welder',
          'Engine Driven Welder'
        ]
      },
      {
        name: 'Metal Cutting & Slicing',
        description: 'CNC fiber lasers, high-definition plasma tables, cold circular saws, and hydraulic guillotine shears',
        items: [
          'CNC Fiber Laser Cutter',
          'CNC Plasma Cutter',
          'Hydraulic Guillotine Shear',
          'Metal Band Saw',
          'Cold Circular Saw',
          'Ironworker & Punch-Shear',
          'Oxy-Fuel Profile Cutter'
        ]
      },
      {
        name: 'Bending & Forming',
        description: 'Synchronized CNC hydraulic press brakes, 3-roll & 4-roll plate bending, profile & pipe tube benders',
        items: [
          'Hydraulic CNC Press Brake',
          'Plate Rolling Machine',
          'Pipe & Tube Bender',
          'Profile Bending Rolls',
          'Pan & Box Folder',
          'Hydraulic Deep Draw Press'
        ]
      },
      {
        name: 'Machining & Milling',
        description: 'Heavy industrial metal lathes, vertical machining centers (VMC), radial arm drills, and surface grinders',
        items: [
          'Metalworking Lathe',
          'Universal Milling Machine',
          'Radial Arm Drill',
          'Surface Grinder',
          'Cylindrical Grinder',
          'Slotting & Shaping Machine'
        ]
      },
      {
        name: 'Finishing & Surface Prep',
        description: 'Industrial sandblasting & shot blast cabinets, deburring machines, vibratory polishers, and electro-pickling units',
        items: [
          'Shot Blasting Cabinet',
          'Metal Deburring Machine',
          'Weld Seam Cleaner',
          'Polishing & Buffing Lathe',
          'Magnetic Tumbler'
        ]
      },
      {
        name: 'Welding Consumables & PPE',
        description: 'Auto-darkening PAPR helmets, ER70S-6 wire spools, shielding gas regulators, tungsten rods, and 3D modular clamping tables',
        items: [
          '3D Modular Welding Table',
          'Auto-Darkening Helmet',
          'MIG Wire Spools (ER70S-6)',
          'Tungsten & Argon Regulators',
          'Heavy Magnetic Clamps',
          'Welding Fume Extractor'
        ]
      }
    ],
    subcategories: [
      'MIG / MAG Welder',
      'TIG Welder (AC/DC)',
      'MMA Stick Welder',
      'Multi-Process Inverter',
      'Submerged Arc Welder',
      'Spot Welder',
      'Stud Welder',
      'Engine Driven Welder',
      'CNC Fiber Laser Cutter',
      'CNC Plasma Cutter',
      'Hydraulic Guillotine Shear',
      'Metal Band Saw',
      'Cold Circular Saw',
      'Ironworker & Punch-Shear',
      'Oxy-Fuel Profile Cutter',
      'Hydraulic CNC Press Brake',
      'Plate Rolling Machine',
      'Pipe & Tube Bender',
      'Profile Bending Rolls',
      'Pan & Box Folder',
      'Hydraulic Deep Draw Press',
      'Metalworking Lathe',
      'Universal Milling Machine',
      'Radial Arm Drill',
      'Surface Grinder',
      'Cylindrical Grinder',
      'Slotting & Shaping Machine',
      'Shot Blasting Cabinet',
      'Metal Deburring Machine',
      'Weld Seam Cleaner',
      'Polishing & Buffing Lathe',
      'Magnetic Tumbler',
      '3D Modular Welding Table',
      'Auto-Darkening Helmet',
      'MIG Wire Spools (ER70S-6)',
      'Tungsten & Argon Regulators',
      'Heavy Magnetic Clamps',
      'Welding Fume Extractor'
    ]
  },

  // 6. FURNITURE MANUFACTURING (SPECIALIST VERTICAL)
  {
    id: 'cat-furniture',
    name: 'Furniture Manufacturing',
    slug: 'furniture-manufacturing',
    iconName: 'Armchair',
    tagline: 'MTM Flagship Specialist Vertical',
    description: 'Complete industrial woodworking, panel processing, solid timber shaping, upholstery, finishing, and furniture assembly production systems.',
    colorTheme: 'amber',
    itemCount: 420,
    image: '/images/scm_panel_saw_1790179186875.jpg',
    isSpecialistVertical: true,
    departments: [
      {
        name: 'Cutting',
        description: 'Primary board and lumber breakdown equipment with precision scoring units',
        items: [
          'Panel Saw',
          'Table Saw',
          'Beam Saw',
          'Circular Saw',
          'Band Saw',
          'Cross-Cut Saw',
          'Precision Saw'
        ]
      },
      {
        name: 'Panel processing',
        description: 'High-yield cabinet sheet sizing, automatic edge banding, and CNC nest routing',
        items: [
          'CNC Router',
          'CNC Machining Centre',
          'Edge Bander',
          'Panel Saw',
          'Drilling Machine',
          'Boring Machine'
        ]
      },
      {
        name: 'Wood shaping',
        description: 'Solid wood surfacing, thickness calibration, profiling, moulding, and joinery',
        items: [
          'Surface Planer',
          'Thicknesser',
          'Spindle Moulder',
          'Router',
          'Wood Lathe',
          'Copy Shaper',
          'Tenoner',
          'Mortiser'
        ]
      },
      {
        name: 'Sanding',
        description: 'Calibration, veneer thicknessing, lacquer preparation, and curve edge sanders',
        items: [
          'Wide Belt Sander',
          'Drum Sander',
          'Orbital Sander',
          'Belt Sander',
          'Edge Sander'
        ]
      },
      {
        name: 'Finishing',
        description: 'Spray booths, curing tunnels, spray guns, explosion-proof compressors, and extraction',
        items: [
          'Spray Booth',
          'Spray Gun',
          'Compressor',
          'Drying Oven',
          'Dust Extraction System',
          'Paint Mixing Equipment'
        ]
      },
      {
        name: 'Upholstery',
        description: 'Heavy duty walking-foot sewing, contour foam slicing, staple tacking, and button presses',
        items: [
          'Industrial Sewing Machine',
          'Foam Cutting Machine',
          'Foam Saw',
          'Stapling Gun',
          'Upholstery Compressor',
          'Button Machine'
        ]
      },
      {
        name: 'Assembly',
        description: 'Carcass clamps, hydraulic door presses, pneumatic frame jigs, and heavy workbenches',
        items: [
          'Pneumatic Clamps',
          'Frame Press',
          'Hydraulic Press',
          'Assembly Tables',
          'Workbenches'
        ]
      },
      {
        name: 'Material handling',
        description: 'Heavy board vacuum lifters, hydraulic scissor lifts, forklifts, and factory pallet trucks',
        items: [
          'Pallet Truck',
          'Forklift',
          'Hand Trolley',
          'Hydraulic Lift',
          'Warehouse Racking'
        ]
      }
    ],
    subcategories: [
      'Panel Saw',
      'Table Saw',
      'Beam Saw',
      'Circular Saw',
      'Band Saw',
      'Cross-Cut Saw',
      'Precision Saw',
      'CNC Router',
      'CNC Machining Centre',
      'Edge Bander',
      'Drilling Machine',
      'Boring Machine',
      'Surface Planer',
      'Thicknesser',
      'Spindle Moulder',
      'Router',
      'Wood Lathe',
      'Copy Shaper',
      'Tenoner',
      'Mortiser',
      'Wide Belt Sander',
      'Drum Sander',
      'Orbital Sander',
      'Belt Sander',
      'Edge Sander',
      'Spray Booth',
      'Spray Gun',
      'Compressor',
      'Drying Oven',
      'Dust Extraction System',
      'Paint Mixing Equipment',
      'Industrial Sewing Machine',
      'Foam Cutting Machine',
      'Foam Saw',
      'Stapling Gun',
      'Upholstery Compressor',
      'Button Machine',
      'Pneumatic Clamps',
      'Frame Press',
      'Hydraulic Press',
      'Assembly Tables',
      'Workbenches',
      'Pallet Truck',
      'Forklift',
      'Hand Trolley',
      'Hydraulic Lift',
      'Warehouse Racking'
    ]
  },

  // 7A. Industrial Machinery
  {
    id: 'cat-industrial-machinery',
    name: 'Industrial Machinery',
    slug: 'industrial-machinery',
    iconName: 'Cpu',
    tagline: 'High Precision Plant & Heavy Production Lines',
    description: 'Engineered machinery, CNC lathes, machining centers, plastic injection, metal forming, and automated production units.',
    colorTheme: 'blue',
    itemCount: 380,
    image: '/images/cnc_metal_lathe_1790001722561.jpg',
    subcategories: [
      'Manufacturing Machines',
      'CNC Machines',
      'Metalworking',
      'Woodworking',
      'Packaging',
      'Printing',
      'Food Processing',
      'Plastic Processing',
      'Textile Machinery',
      'Chemical/Processing Equipment'
    ]
  },

  // 7B. Construction
  {
    id: 'cat-construction',
    name: 'Construction',
    slug: 'construction-equipment',
    iconName: 'HardHat',
    tagline: 'Earthmoving, Concrete Plant & Civil Equipment',
    description: 'Heavy civil machinery, concrete batching, crawler excavators, diesel air compressors, scaffolding, and site lifting.',
    colorTheme: 'yellow',
    itemCount: 290,
    image: '/images/industrial_forklift_1790206270683.jpg',
    subcategories: [
      'Concrete Equipment',
      'Excavators',
      'Compressors',
      'Generators',
      'Mixers',
      'Compactors',
      'Lifting Equipment',
      'Scaffolding',
      'Site Equipment'
    ]
  },

  // 7C. Agriculture
  {
    id: 'cat-agriculture',
    name: 'Agriculture',
    slug: 'agricultural-machinery',
    iconName: 'Tractor',
    tagline: 'Mechanized Farming, Harvesting & Agro-Processing',
    description: 'Farm tractors, rotary tillers, grain harvesters, solar irrigation pumps, feed mills, and grain post-harvest processors.',
    colorTheme: 'emerald',
    itemCount: 215,
    image: '/images/rotary_screw_compressor_1790179219452.jpg',
    subcategories: [
      'Tractors',
      'Tillers',
      'Harvesters',
      'Irrigation Equipment',
      'Processing Machines',
      'Pumps',
      'Feed Mills',
      'Agricultural Tools'
    ]
  },

  // 7D. Electrical
  {
    id: 'cat-electrical',
    name: 'Electrical',
    slug: 'electrical-equipment',
    iconName: 'Zap',
    tagline: 'Industrial Power, Grid Switchgear & Generation',
    description: 'Diesel generators (Mikano, Perkins, Cummins), high-voltage step-down transformers, 3-phase electric motors, switchgears, and armored cables.',
    colorTheme: 'cyan',
    itemCount: 310,
    image: '/images/perkins_diesel_gen_1790179175839.jpg',
    subcategories: [
      'Generators',
      'Transformers',
      'Motors',
      'Control Panels',
      'Inverters',
      'Switchgear',
      'Cables',
      'Industrial Electrical Components'
    ]
  },

  // 7E. Workshop Tools
  {
    id: 'cat-workshop-tools',
    name: 'Workshop Tools',
    slug: 'workshop-tools',
    iconName: 'Wrench',
    tagline: 'Fabrication, Welding, Cutting & Hand Tools',
    description: 'Heavy duty magnetic drills, angle grinders, MIG/TIG/MMA welders, pneumatic torque wrenches, hydraulic pullers, and modular storage cabinets.',
    colorTheme: 'rose',
    itemCount: 450,
    image: '/images/welding_machine_1790001750091.jpg',
    subcategories: [
      'Drills',
      'Grinders',
      'Welders',
      'Cutters',
      'Compressors',
      'Hydraulic Tools',
      'Pneumatic Tools',
      'Measuring Equipment',
      'Tool Storage'
    ]
  },

  // Materials & Supplies
  {
    id: 'cat-materials',
    name: 'Materials',
    slug: 'materials-supplies',
    iconName: 'Layers',
    tagline: 'Raw Stock, Industrial Consumables & Fasteners',
    description: 'Kiln-dried teak, mahogany, HDF/MDF boards, laminates, structural steel H-beams, high-tensile fasteners, and industrial lubricants.',
    colorTheme: 'purple',
    itemCount: 340,
    image: '/images/engineering_blueprints_1790206304051.jpg',
    subcategories: [
      'Timber & Wood Supplies',
      'Metal & Structural Steel',
      'Hardware & Fasteners',
      'Electrical Materials',
      'Industrial Consumables & Oils',
      'Furniture Materials & Boards',
      'Pipes & Industrial Valves'
    ]
  }
];
