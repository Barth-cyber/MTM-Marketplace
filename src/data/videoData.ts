import { DemoVideoItem } from '../types';

export const DEMO_VIDEOS: DemoVideoItem[] = [
  {
    id: 'mtm-how-it-works-master',
    title: 'How MTM Industrial Marketplace Works: The Complete Guide',
    subtitle: 'From Industrial Search & Live Video Tests to Escrow, Heavy Rigging & 48-Hour Payout',
    duration: '03:45',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    posterUrl: '/images/edge_bander_banner.jpg',
    badge: 'OFFICIAL PLATFORM DEMO',
    category: 'Marketplace Operations & Escrow',
    description: 'A comprehensive visual walkthrough of Africa\'s premier verified industrial machinery marketplace. Discover how MTM eliminates buying risks through verified sellers, on-site certified engineering inspections, milestone escrow protection, and specialized heavy haulage logistics across industrial hubs.',
    keyTakeaways: [
      '100% Protected Escrow: Funds remain locked until machine passes factory floor test',
      'On-site 42-Point Certified Engineering Inspection before any money moves',
      'Specialized Heavy Lowbed Rigging & Transit Insurance across all 36 States',
      'Corporate Purchase Orders (PO) with VAT invoice & CFO approval workflows',
      'Instant Payout to Verified Sellers within 24 hours of buyer acceptance'
    ],
    chapters: [
      {
        timeSeconds: 0,
        timeStr: '00:00',
        title: 'Introduction & Industrial Landscape',
        description: 'The challenges of purchasing high-value industrial machinery in Nigeria and how MTM solves trust, logistics, and verification.'
      },
      {
        timeSeconds: 35,
        timeStr: '00:35',
        title: 'Searching Machinery & Telemetry Specs',
        description: 'Filter by industrial hub, generator kVA requirements, voltage phase, and review live load-test video streams.'
      },
      {
        timeSeconds: 78,
        timeStr: '01:18',
        title: 'Certified On-Site 42-Point Inspection',
        description: 'MTM mechanical and electrical engineers verify spindle runout, thermal camera heat dissipation, and motor insulation.'
      },
      {
        timeSeconds: 132,
        timeStr: '02:12',
        title: 'Escrow Milestone Deposit & PO Generation',
        description: 'Depositing into secure neutral escrow via corporate bank transfer or card with dual authorization.'
      },
      {
        timeSeconds: 175,
        timeStr: '02:55',
        title: 'Heavy Haulage Rigging & Factory Delivery',
        description: 'Crane hoisting, lowbed transport with real-time GPS tracking, and factory bay rigging.'
      },
      {
        timeSeconds: 210,
        timeStr: '03:30',
        title: '48-Hour Acceptance & Bank Payout',
        description: 'Buyer powers up machine on factory floor, confirms working parameters, and funds are disbursed to seller.'
      }
    ],
    resolutionStreams: [
      { quality: '1080p', label: '1080p 60fps (Full HD)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', bitrate: '6.2 Mbps' },
      { quality: '720p', label: '720p HD (Data Saver)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', bitrate: '3.1 Mbps' },
      { quality: '480p', label: '480p SD (Low Bandwidth)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', bitrate: '1.4 Mbps' }
    ]
  },
  {
    id: 'mtm-inspection-runtest',
    title: 'Certified 42-Point Engineering Run-Test in Action',
    subtitle: 'How MTM Mechanical & Electrical Inspectors Test Machinery Under Full Operational Load',
    duration: '02:30',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    posterUrl: '/images/scm_panel_saw_1790179186875.jpg',
    badge: 'ENGINEERING & QUALITY',
    category: 'Inspection & Verification',
    description: 'See our certified inspectors conduct vibration analysis, laser spindle runout calibration, high-load amp draw measurement, and hydraulic pressure testing at vendor workshops before shipping.',
    keyTakeaways: [
      'Digital vibration sensors (mm/s RMS) to detect premature bearing wear',
      'Current clamp meters measuring starting vs. continuous full-load amperage',
      'Thermal imaging of gearboxes and motor windings for hot spots',
      'Digital condition certificate stamped and attached to buyer portal'
    ],
    chapters: [
      {
        timeSeconds: 0,
        timeStr: '00:00',
        title: 'Inspector Arrival & Serial Verification',
        description: 'Verifying OEM serial plates, CAC registration, and physical machine chassis.'
      },
      {
        timeSeconds: 30,
        timeStr: '00:30',
        title: 'Cold Electrical & Phase Balance Test',
        description: 'Megger insulation testing and phase-to-phase voltage balancing on 3-Phase 380V/415V supply.'
      },
      {
        timeSeconds: 70,
        timeStr: '01:10',
        title: 'High-Load Live Material Cut / Press',
        description: 'Running hardwood timber, 6mm carbon steel plate, or continuous panel processing under full operational feed.'
      },
      {
        timeSeconds: 120,
        timeStr: '02:00',
        title: 'Certificate Issuance & Buyer Telemetry Log',
        description: 'Publishing the high-definition telemetry video and PDF inspection certificate to the marketplace.'
      }
    ],
    resolutionStreams: [
      { quality: '1080p', label: '1080p 60fps (Full HD)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', bitrate: '5.8 Mbps' },
      { quality: '720p', label: '720p HD (Data Saver)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', bitrate: '2.9 Mbps' },
      { quality: '480p', label: '480p SD (Low Bandwidth)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', bitrate: '1.2 Mbps' }
    ]
  },
  {
    id: 'mtm-heavy-logistics-haulage',
    title: 'Heavy Machinery Rigging & Lowbed Interstate Haulage',
    subtitle: 'From Industrial Bay Crane Lifting to Factory Floor Positioning Across Nigeria',
    duration: '02:15',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: '/images/industrial_forklift_1790206270683.jpg',
    badge: 'LOGISTICS & RIGGING',
    category: 'Haulage & Transport',
    description: 'Learn how MTM handles multi-ton heavy machinery logistics. We manage telescopic crane hoisting, specialized lowbed and air-ride flatbed trailers, certified lashing, and comprehensive transit insurance.',
    keyTakeaways: [
      'Multi-ton crane mobilization at seller warehouse and buyer factory',
      'Air-ride lowbed trucks protecting delicate CNC electronics & linear guides',
      'All-risk goods-in-transit insurance covering full declared equipment value',
      'GPS live tracking with ETA alerts sent directly to production managers'
    ],
    chapters: [
      {
        timeSeconds: 0,
        timeStr: '00:00',
        title: 'Pre-Rigging Clearance & Weight Calculation',
        description: 'Measuring factory doorway heights, floor load ratings, and crane arm radius.'
      },
      {
        timeSeconds: 40,
        timeStr: '00:40',
        title: 'Crane Loading & Certified Lashing',
        description: 'Securing machines with grade-80 chain tensioners and heavy-duty corner protectors.'
      },
      {
        timeSeconds: 85,
        timeStr: '01:25',
        title: 'Interstate Transport & Route Escort',
        description: 'Navigating highway transit routes between industrial centers with continuous telematics.'
      },
      {
        timeSeconds: 110,
        timeStr: '01:50',
        title: 'Unloading & Precision Factory Bay Skidding',
        description: 'Using hydraulic machinery skates and leveling jacks to position equipment on foundations.'
      }
    ],
    resolutionStreams: [
      { quality: '1080p', label: '1080p 60fps (Full HD)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', bitrate: '5.5 Mbps' },
      { quality: '720p', label: '720p HD (Data Saver)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', bitrate: '2.8 Mbps' },
      { quality: '480p', label: '480p SD (Low Bandwidth)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', bitrate: '1.2 Mbps' }
    ]
  },
  {
    id: 'mtm-po-escrow-finance',
    title: 'Corporate Purchase Orders & Escrow Milestone Settlement',
    subtitle: 'How Enterprise Procurement Teams and CFOs Approve and Protect Capital Expenditure',
    duration: '02:00',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterUrl: '/images/metal_welding_plant_1790179162965.jpg',
    badge: 'CORPORATE ESCROW',
    category: 'Procurement & Finance',
    description: 'A step-by-step financial overview for corporate controllers, procurement directors, and SME owners. See how MTM generates branded Purchase Orders with VAT tax calculations, manages escrow milestone deposits, and guarantees zero financial loss.',
    keyTakeaways: [
      'Instant branded PDF Purchase Order generation with corporate VAT/TIN',
      'Dual signature blocks for CFO approval & Procurement Manager authorization',
      'Direct integration with commercial bank escrow accounts',
      'Full refund guarantee if equipment fails on-site engineering acceptance test'
    ],
    chapters: [
      {
        timeSeconds: 0,
        timeStr: '00:00',
        title: 'Generating Enterprise PO Requisition',
        description: 'Adding machines, certified inspection fees, and freight assistance to itemized PO.'
      },
      {
        timeSeconds: 30,
        timeStr: '00:30',
        title: 'Corporate Approval & Escrow Funding',
        description: 'Executing payment via dedicated NGN / USD escrow account with formal payment receipt.'
      },
      {
        timeSeconds: 70,
        timeStr: '01:10',
        title: 'Milestone Tracking on Buyer Dashboard',
        description: 'Live status: Inspection Passed -> Rigging Dispatched -> Factory Delivered -> Acceptance Pending.'
      },
      {
        timeSeconds: 95,
        timeStr: '01:35',
        title: 'Final Acceptance & Instant Vendor Settlement',
        description: 'One-click sign-off releasing payment directly to vendor with automated tax invoice.'
      }
    ],
    resolutionStreams: [
      { quality: '1080p', label: '1080p 60fps (Full HD)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', bitrate: '5.2 Mbps' },
      { quality: '720p', label: '720p HD (Data Saver)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', bitrate: '2.6 Mbps' },
      { quality: '480p', label: '480p SD (Low Bandwidth)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', bitrate: '1.1 Mbps' }
    ]
  }
];

export const SAMPLE_EQUIPMENT_RUNTEST_VIDEOS = [
  {
    id: 'sample-scm-saw',
    machineTitle: 'SCM Nova Si400 Sliding Table Panel Saw 3.2m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    posterUrl: '/images/edge_bander_banner.jpg',
    duration: '01:45',
    spindleRpm: 4000,
    loadAmps: 14.8,
    vibrationMms: 1.2,
    bearingTempC: 38.5,
    runoutMm: 0.02,
    testLocation: 'Ikeja Industrial Hub, Lagos',
    inspectorName: 'Engr. D. Adeleke (COREN #34912)',
    inspectorBadge: 'Grade A - Certified',
    operationalLoad: '100% Full Load - 38mm Hardwood Plywood'
  },
  {
    id: 'sample-hydraulic-press',
    machineTitle: 'Heavy Duty 100-Ton Hydraulic Press Brake CNC',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    posterUrl: '/images/hydraulic_press_brake_1790179207683.jpg',
    duration: '02:10',
    spindleRpm: 1800,
    loadAmps: 28.4,
    vibrationMms: 1.8,
    bearingTempC: 44.2,
    runoutMm: 0.04,
    testLocation: 'Edo Production Centre, Benin City',
    inspectorName: 'Engr. K. Obasogie (COREN #29104)',
    inspectorBadge: 'Grade A - Certified',
    operationalLoad: '100-Ton Full Pressure Cycle - 8mm Mild Steel Plate'
  },
  {
    id: 'sample-diesel-gen',
    machineTitle: 'Perkins 150 kVA Silent Heavy Industrial Diesel Generator',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: '/images/perkins_diesel_gen_1790179175839.jpg',
    duration: '01:55',
    spindleRpm: 1500,
    loadAmps: 198.0,
    vibrationMms: 2.1,
    bearingTempC: 52.0,
    runoutMm: 0.01,
    testLocation: 'Trans-Amadi Industrial Layout, Port Harcourt',
    inspectorName: 'Engr. F. Briggs (COREN #40281)',
    inspectorBadge: 'Grade A - Certified',
    operationalLoad: '100% Resistive Load Bank Test (120 kW)'
  }
];

export const VIDEO_PLAYLISTS = [
  {
    id: 'playlist-masterclass',
    title: 'MTM Industrial Buyer Masterclass Series',
    description: 'Complete 3-part guide covering marketplace search, 42-point inspection, and secure escrow disbursement.',
    videoIds: ['mtm-how-it-works-master', 'mtm-inspection-runtest', 'mtm-heavy-logistics-haulage'],
    thumbnail: '/images/edge_bander_banner.jpg',
    category: 'Official Guide',
    durationTotal: '08:30'
  },
  {
    id: 'playlist-cnc-fabrication',
    title: 'CNC & Heavy Fabrication Live Run-Tests',
    description: 'Watch high-precision CNC routers, lathes, and press brakes tested under maximum industrial load.',
    videoIds: ['mtm-inspection-runtest', 'sample-scm-saw', 'sample-hydraulic-press'],
    thumbnail: '/images/heavy_cnc_router_1790206292970.jpg',
    category: 'Run-Test Audits',
    durationTotal: '06:20'
  },
  {
    id: 'playlist-logistics-escrow',
    title: 'Interstate Rigging & Secure Escrow Protection',
    description: 'Step-by-step documentation of multi-ton crane hoisting, lowbed transit, and corporate PO financing.',
    videoIds: ['mtm-heavy-logistics-haulage', 'mtm-how-it-works-master', 'sample-diesel-gen'],
    thumbnail: '/images/industrial_forklift_1790206270683.jpg',
    category: 'Logistics & Safety',
    durationTotal: '07:55'
  }
];

export const INITIAL_VIDEO_COMMENTS = [
  {
    id: 'comm-1',
    videoId: 'mtm-how-it-works-master',
    authorName: 'Alhaji Bello Danbatta',
    authorRole: 'Managing Director, Northern Agro-Allied Mills Kano',
    text: 'The milestone escrow release gives us total peace of mind before transferring ₦45M for our milling line.',
    timestamp: '2 hours ago',
    likes: 14,
    avatar: ''
  },
  {
    id: 'comm-2',
    videoId: 'mtm-how-it-works-master',
    authorName: 'Dr. Chioma Nnamani',
    authorRole: 'Chief Engineer, Enugu Precision Machining Ltd',
    text: 'Very clear explanation of the 42-point COREN inspection checklist. Can we request a custom video for a 5-axis router in Nnewi?',
    timestamp: 'Yesterday',
    likes: 8,
    avatar: ''
  },
  {
    id: 'comm-3',
    videoId: 'mtm-inspection-runtest',
    authorName: 'Engr. Tunde Fashola',
    authorRole: 'Operations Lead, Ikeja Industrial Cluster',
    text: 'Notice the vibration reading stayed below 1.2 mm/s RMS under full load. Excellent spindle bearing balance.',
    timestamp: '3 days ago',
    likes: 21,
    avatar: ''
  }
];

export const INITIAL_VIDEO_ANNOTATIONS = [
  {
    id: 'ann-1',
    videoId: 'mtm-how-it-works-master',
    timeSeconds: 78,
    timeStr: '01:18',
    text: 'COREN Inspector verifies spindle runout tolerance within 0.015mm.',
    type: 'measurement' as const,
    author: 'Engr. D. Adeleke',
    createdAt: 'Sep 2, 2026'
  },
  {
    id: 'ann-2',
    videoId: 'mtm-how-it-works-master',
    timeSeconds: 132,
    timeStr: '02:12',
    text: 'Escrow funds deposited into Zenith Bank Neutral Escrow Account #1092837491.',
    type: 'highlight' as const,
    author: 'MTM Escrow Desk',
    createdAt: 'Sep 2, 2026'
  },
  {
    id: 'ann-3',
    videoId: 'mtm-inspection-runtest',
    timeSeconds: 45,
    timeStr: '00:45',
    text: 'Thermal camera check shows motor winding temperature stabilized at 42.5°C.',
    type: 'note' as const,
    author: 'Engr. K. Obasogie',
    createdAt: 'Sep 1, 2026'
  }
];
