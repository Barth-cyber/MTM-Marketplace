export type SupportedLanguage = 'en' | 'ha' | 'yo' | 'ig' | 'pcm' | 'fr' | 'bin' | 'zh';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇳🇬', region: 'National & Global' },
  { code: 'pcm', name: 'Nigerian Pidgin', nativeName: 'Naija Pidgin', flag: '🇳🇬', region: 'Commercial & Markets' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬', region: 'Kano, Kaduna, Arewa' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬', region: 'Lagos, Ibadan, South-West' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬', region: 'Aba, Onitsha, South-East' },
  { code: 'bin', name: 'Bini (Edo)', nativeName: 'Ẹ̀dó / Isang', flag: '🇳🇬', region: 'Benin Kingdom, Edo State' },
  { code: 'fr', name: 'French', nativeName: 'Français (ECOWAS)', flag: '🌍', region: 'West Africa Trade' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', region: 'Global Industrial & Import Trade' }
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Header & Navigation
    'nav.home': 'Home',
    'nav.catalog': 'Browse Machinery',
    'nav.categories': 'All Categories',
    'nav.deals': 'Liquidation Lots',
    'nav.services': 'Inspections & Freight',
    'nav.trends': 'Smart Trends',
    'nav.leaderboard': 'Seller Leaderboard',
    'nav.about': 'About MTM',
    'nav.sell': 'Sell Machine / Post Lot',
    'nav.account': 'Buyer & Seller Portal',
    'nav.agent': 'MTM Agent',
    'nav.qrScanner': 'QR Scanner',
    'nav.quickReorder': 'Quick Reorder',
    'search.placeholder': 'Search industrial machines, spare parts, tooling, hubs (e.g. SCM Panel Saw, Benin City)...',
    'escrow.shield': '100% Escrow Protection Guaranteed',
    'currency.toggle': 'NGN (₦) / USD ($)',
    
    // Quick Reorder
    'reorder.title': 'Quick Reorder Consumables & Spares',
    'reorder.subtitle': '1-Click repeat replenishment for workshop consumables, adhesives, tooling blades, and machine spare parts.',
    'reorder.addToCart': 'Add to Escrow Cart',
    'reorder.instantReorder': 'Instant Reorder Now',
    'reorder.bulkDiscount': 'Bulk Discount Active',
    'reorder.unit': 'Unit',
    'reorder.qty': 'Quantity',

    // QR Scanner
    'qr.title': 'Industrial Asset & Escrow QR Scanner',
    'qr.subtitle': 'Scan physical machine diagnostic plates, escrow tracking codes, or verified seller certification tags.',
    'qr.cameraMode': 'Live Camera Scan',
    'qr.uploadMode': 'Upload QR Image',
    'qr.sampleCodes': 'Test Sample QR Asset Badges',
    'qr.scanning': 'Scanning with camera...',
    'qr.grantPermission': 'Camera permission required for live scanning',

    // Seller Leaderboard
    'leaderboard.title': 'Top Industrial Seller Leaderboard',
    'leaderboard.subtitle': 'Ranked by audited Escrow Fulfillment, transaction volume, and verified inspections.',
    'leaderboard.rank': 'Rank',
    'leaderboard.fulfillment': 'Escrow Fulfillment',
    'leaderboard.inventory': 'Browse Inventory',

    // MTM Agent
    'agent.title': 'MTM Agent Assistant',
    'agent.alert': 'Equipment Alert',
    'agent.voice': 'Voice Search',
    'agent.audioTranscript': 'Audio Transcript'
  },
  pcm: {
    // Header & Navigation
    'nav.home': 'Home',
    'nav.catalog': 'Check All Machine',
    'nav.categories': 'All Category',
    'nav.deals': 'Clearance & Cheap Deals',
    'nav.services': 'Inspection & Carry Load',
    'nav.trends': 'Market Price Trend',
    'nav.leaderboard': 'Top Seller Ranking',
    'nav.about': 'About MTM Nigeria',
    'nav.sell': 'Sell Your Machine Here',
    'nav.account': 'My Portal & Orders',
    'nav.agent': 'MTM AI Agent',
    'nav.qrScanner': 'Scan QR Code',
    'nav.quickReorder': 'Quick Order Again',
    'search.placeholder': 'Find heavy machine, spare parts, cutting tools, factory items...',
    'escrow.shield': '100% Escrow Money Protection Dey Gurantee am',
    'currency.toggle': 'Naira (₦) / Dollar ($)',

    // Quick Reorder
    'reorder.title': 'Quick Order Workshop Spares & Glue Again',
    'reorder.subtitle': '1-Click sharp sharp order for glue pellets, saw blades, edge tapes, and machine spares.',
    'reorder.addToCart': 'Put Inside Escrow Cart',
    'reorder.instantReorder': 'Order Am Sharp Sharp Now',
    'reorder.bulkDiscount': 'Bulk Discount Dey Inside',
    'reorder.unit': 'Pack/Bag',
    'reorder.qty': 'Number',

    // QR Scanner
    'qr.title': 'Industrial Machine & Escrow QR Scanner',
    'qr.subtitle': 'Scan machine plate, escrow tracking paper, or verified seller stamp.',
    'qr.cameraMode': 'Use Phone/Laptop Camera',
    'qr.uploadMode': 'Upload Picture of QR',
    'qr.sampleCodes': 'Test Sample QR Badges',
    'qr.scanning': 'Camera dey scan...',
    'qr.grantPermission': 'Allow camera so you fit scan direct',

    // Seller Leaderboard
    'leaderboard.title': 'Top Seller Ranking for Naija',
    'leaderboard.subtitle': 'Correct ranking based on fast delivery, good machines, and clean escrow record.',
    'leaderboard.rank': 'Position',
    'leaderboard.fulfillment': 'Escrow Fulfillment',
    'leaderboard.inventory': 'See Machine Stock',

    // MTM Agent
    'agent.title': 'MTM Agent Assistant',
    'agent.alert': 'Set Machine Alert',
    'agent.voice': 'Talk With Voice',
    'agent.audioTranscript': 'Voice Written Text'
  },
  ha: {
    // Header & Navigation
    'nav.home': 'Babban Shafi',
    'nav.catalog': 'Bincika Kayan Aiki',
    'nav.categories': 'Dukkan Rukunoni',
    'nav.deals': 'Kayan Rangwame & Sauki',
    'nav.services': 'Binciken Na\'ura & Safara',
    'nav.trends': 'Farashin Kasuwa',
    'nav.leaderboard': 'Gwarazan Masu Sayarwa',
    'nav.about': 'Game da MTM',
    'nav.sell': 'Siyar da Inji / Kaya',
    'nav.account': 'Asusun Mai Sayayya & Sayarwa',
    'nav.agent': 'MTM AI Agent',
    'nav.qrScanner': 'Sikanin QR Code',
    'nav.quickReorder': 'Sake Sayen Kayan Aiki Cikin Sauri',
    'search.placeholder': 'Nemi manyan injina, sassan gyara, kayan aiki a Kano, Lagos...',
    'escrow.shield': '100% Tsaron Kudi na Escrow',
    'currency.toggle': 'Naira (₦) / Dala ($)',

    // Quick Reorder
    'reorder.title': 'Sake Sayen Kayan Aiki Cikin Sauri',
    'reorder.subtitle': 'Sauki da sauri wajen sake sayen dankon katako, ruwan zarto, da sassan injina.',
    'reorder.addToCart': 'Saka a Kwandon Escrow',
    'reorder.instantReorder': 'Sake Saya Yanzu',
    'reorder.bulkDiscount': 'Akwai Rangwamen Sari',
    'reorder.unit': 'Raka\'a',
    'reorder.qty': 'Adadi',

    // QR Scanner
    'qr.title': 'Sikanin QR na Inji da Lambar Escrow',
    'qr.subtitle': 'Duba lambar jikin inji, takardar escrow, ko shaidar mai sayarwa.',
    'qr.cameraMode': 'Amfani da Kyamara',
    'qr.uploadMode': 'Loda Hoton QR',
    'qr.sampleCodes': 'Gwada Misalan Lambobin QR',
    'qr.scanning': 'Ana duba lambar...',
    'qr.grantPermission': 'Bada izinin kyamara don sikanin',

    // Seller Leaderboard
    'leaderboard.title': 'Gwarazan Masu Sayar da Manyan Injina',
    'leaderboard.subtitle': 'Dangane da amana, tsaron escrow, da ingancin kayan aiki.',
    'leaderboard.rank': 'Matsayi',
    'leaderboard.fulfillment': 'Cikar Aiki da Escrow',
    'leaderboard.inventory': 'Duba Kayayyaki',

    // MTM Agent
    'agent.title': 'MTM Agent Assistant',
    'agent.alert': 'Sanarwar Kayan Aiki',
    'agent.voice': 'Bincike da Murya',
    'agent.audioTranscript': 'Rubutun Murya'
  },
  yo: {
    // Header & Navigation
    'nav.home': 'Ilé',
    'nav.catalog': 'Ṣawari Awọn Ẹrọ',
    'nav.categories': 'Gbogbo Ẹka',
    'nav.deals': 'Awọn Ẹrọ Idinku Owo',
    'nav.services': 'Ayẹwo Ẹrọ & Gbigbe Ẹrù',
    'nav.trends': 'Itupalẹ Owo Ọja',
    'nav.leaderboard': 'Awọn Olutaja To Tayo',
    'nav.about': 'Nipa MTM',
    'nav.sell': 'Ta Ẹrọ Rẹ Nibi',
    'nav.account': 'Aaye Olura & Olutaja',
    'nav.agent': 'MTM AI Agent',
    'nav.qrScanner': 'Ọlọjẹ QR Code',
    'nav.quickReorder': 'Tun Bere Ni Kiakia',
    'search.placeholder': 'Wa awọn ẹrọ nla, ohun elo iṣẹ, ẹya ara ẹrọ ni Eko, Benin...',
    'escrow.shield': '100% Idabobo Owo Escrow Ti O Daju',
    'currency.toggle': 'Naira (₦) / Dọla ($)',

    // Quick Reorder
    'reorder.title': 'Tun Bere Awọn Ohun Elo Ni Kiakia',
    'reorder.subtitle': 'Bọtini kan lati tun ra gulu igi, abẹ ayun, ati awọn ẹya ara ẹrọ.',
    'reorder.addToCart': 'Fi Si Agbọn Escrow',
    'reorder.instantReorder': 'Tun Ra Lẹsẹkẹsẹ',
    'reorder.bulkDiscount': 'Idinku Owo Wa Fun Rira Pupọ',
    'reorder.unit': 'Ẹyọ',
    'reorder.qty': 'Iye',

    // QR Scanner
    'qr.title': 'Ọlọjẹ QR Fun Ẹrọ & Aabo Escrow',
    'qr.subtitle': 'Ṣayẹwo aami ẹrọ, iwe adehun escrow, tabi ijẹrisi olutaja.',
    'qr.cameraMode': 'Lo Kamẹra Foonu/Kọmputa',
    'qr.uploadMode': 'Gbe Aworan QR Wọle',
    'qr.sampleCodes': 'Ṣe Idanwo Pẹlu Awọn Aami QR',
    'qr.scanning': 'Kamẹra n ṣayẹwo...',
    'qr.grantPermission': 'Gba kamẹra laaye lati ṣayẹwo',

    // Seller Leaderboard
    'leaderboard.title': 'Ipele Awọn Olutaja To Gbajumo',
    'leaderboard.subtitle': 'Ipele ti o da lori ifijiṣẹ escrow to yara ati awọn ẹrọ to daju.',
    'leaderboard.rank': 'Ipo',
    'leaderboard.fulfillment': 'Ifijiṣẹ Escrow',
    'leaderboard.inventory': 'Wo Awọn Ẹrọ',

    // MTM Agent
    'agent.title': 'MTM Agent Assistant',
    'agent.alert': 'Itaniji Ẹrọ',
    'agent.voice': 'Wiwa Pẹlu Ohun',
    'agent.audioTranscript': 'Akọsilẹ Ohun'
  },
  ig: {
    // Header & Navigation
    'nav.home': 'Ulo',
    'nav.catalog': 'Chọgharịa Ngwa Igwe',
    'nav.categories': 'Ụdị Niile',
    'nav.deals': 'Ngwa Nwere Mbelata Ego',
    'nav.services': 'Nnyocha Igwe & Ibu Ibu',
    'nav.trends': 'Ọnụego Ahịa Igwe',
    'nav.leaderboard': 'Ndị Na-ere Ahịa Kachasị Mma',
    'nav.about': 'Gbasara MTM',
    'nav.sell': 'Ree Igwe Gị Ebe A',
    'nav.account': 'Ọnụ Ụzọ Onye Ọzụzụ & Onye Na-ere',
    'nav.agent': 'MTM AI Agent',
    'nav.qrScanner': 'Nyocha Koodu QR',
    'nav.quickReorder': 'Tụọ Ahịa Ọzọ Ọsọ Ọsọ',
    'search.placeholder': 'Chọọ nnukwu igwe ụlọ ọrụ, ngwa ọrụ, na Aba, Lagos...',
    'escrow.shield': '100% Nchedo Ego Escrow',
    'currency.toggle': 'Naira (₦) / Dọla ($)',

    // Quick Reorder
    'reorder.title': 'Tụọ Ngwa Ọrụ Ọzọ Ngwa Ngwa',
    'reorder.subtitle': 'Pịa otu ugboro tụọ mmanụ igwe, gluu, na ngwa mgbakwunye.',
    'reorder.addToCart': 'Tinye na Nkata Escrow',
    'reorder.instantReorder': 'Tụọ Ọzọ Ugbu A',
    'reorder.bulkDiscount': 'Mbelata Ego Maka Ịzụ Ọtụtụ',
    'reorder.unit': 'Otu',
    'reorder.qty': 'Ọnụọgụgụ',

    // QR Scanner
    'qr.title': 'Nyocha Koodu QR nke Igwe na Escrow',
    'qr.subtitle': 'Nyochaa efere igwe, nọmba escrow, ma ọ bụ stampụ onye na-ere ahịa.',
    'qr.cameraMode': 'Jiri Igwefoto Nyochaa',
    'qr.uploadMode': 'Bulite Foto QR',
    'qr.sampleCodes': 'Nwalee Koodu QR Dị Iche Iche',
    'qr.scanning': 'Na-enyocha koodu...',
    'qr.grantPermission': 'Nye ikike igwefoto',

    // Seller Leaderboard
    'leaderboard.title': 'Ọkwa Ndị Na-ere Ahịa Kachasị Mma',
    'leaderboard.subtitle': 'Ndekọ dabere na nnyefe ngwa ngwa na nchekwa ego escrow.',
    'leaderboard.rank': 'Ọkwa',
    'leaderboard.fulfillment': 'Mmezu Escrow',
    'leaderboard.inventory': 'Lee Ngwa Ahịa',

    // MTM Agent
    'agent.title': 'MTM Agent Assistant',
    'agent.alert': 'Ọkwa Ngwa Igwe',
    'agent.voice': 'Chọọ Site n\'Olu',
    'agent.audioTranscript': 'Ederede Olu'
  },
  fr: {
    // Header & Navigation
    'nav.home': 'Accueil',
    'nav.catalog': 'Parcourir Machines',
    'nav.categories': 'Toutes Catégories',
    'nav.deals': 'Lots de Liquidation',
    'nav.services': 'Inspections & Fret',
    'nav.trends': 'Tendances des Prix',
    'nav.leaderboard': 'Classement Vendeurs',
    'nav.about': 'À Propos de MTM',
    'nav.sell': 'Vendre Machine / Lot',
    'nav.account': 'Portail Acheteur & Vendeur',
    'nav.agent': 'Agent MTM AI',
    'nav.qrScanner': 'Scanner QR',
    'nav.quickReorder': 'Réapprovisionnement Rapide',
    'search.placeholder': 'Rechercher machines industrielles, pièces de rechange, outils à Lagos, Bénin...',
    'escrow.shield': '100% Protection Séquestre Escrow Garantie',
    'currency.toggle': 'NGN (₦) / USD ($)',

    // Quick Reorder
    'reorder.title': 'Réapprovisionnement Rapide de Consommables',
    'reorder.subtitle': '1-Clic pour commander colles thermofusibles, lames de scie, bandes de chant et pièces.',
    'reorder.addToCart': 'Ajouter au Panier Séquestre',
    'reorder.instantReorder': 'Commander Maintenant',
    'reorder.bulkDiscount': 'Remise Gros Active',
    'reorder.unit': 'Unité/Sac',
    'reorder.qty': 'Quantité',

    // QR Scanner
    'qr.title': 'Scanner QR d\'Équipement & Séquestre',
    'qr.subtitle': 'Scannez les plaques de machines industrielles, codes de suivi escrow ou certifications.',
    'qr.cameraMode': 'Caméra en Direct',
    'qr.uploadMode': 'Téléverser Image QR',
    'qr.sampleCodes': 'Tester des Badges QR d\'Exemple',
    'qr.scanning': 'Numérisation en cours...',
    'qr.grantPermission': 'Autorisation de la caméra requise pour le scan en direct',

    // Seller Leaderboard
    'leaderboard.title': 'Classement des Meilleurs Vendeurs Industriels',
    'leaderboard.subtitle': 'Classé selon le taux de conformité du séquestre escrow et les volumes vérifiés.',
    'leaderboard.rank': 'Rang',
    'leaderboard.fulfillment': 'Exécution Séquestre',
    'leaderboard.inventory': 'Voir l\'Inventaire',

    // MTM Agent
    'agent.title': 'Agent MTM Assistant',
    'agent.alert': 'Alerte Équipement',
    'agent.voice': 'Recherche Vocale',
    'agent.audioTranscript': 'Transcription Audio'
  },
  bin: {
    // Header & Navigation
    'nav.home': 'Kona',
    'nav.catalog': 'Ghe Iwinna',
    'nav.categories': 'Ehe Iwinna',
    'nav.deals': 'Ego Ne Otọ',
    'nav.services': 'Ẹvbo Na Ghe Iwiẹ',
    'nav.trends': 'Emwi Ne O rre Ekama',
    'nav.leaderboard': 'Ne Gbe-Ekpen Eseller',
    'nav.about': 'Gbe MTM',
    'nav.sell': 'Khonmwan Iwinna',
    'nav.account': 'Egbẹe Na Re/Dẹ',
    'nav.agent': 'Agbada MTM AI',
    'nav.qrScanner': 'Scan QR Code',
    'nav.quickReorder': 'Dẹ Kakabọ Kakabọ',
    'search.placeholder': 'Ghe ẹvbo ne rre Edo, Lagos, SCM Saw...',
    'escrow.shield': '100% Escrow Ake-Okpan Awan',
    'currency.toggle': 'Naira (₦) / Dollar ($)',

    // Quick Reorder
    'reorder.title': 'Dẹ Kaka Iwinna Spares & Glue',
    'reorder.subtitle': 'Pia ọgbọ na dẹ glue pellets, saw blades, edge tapes, vbe spares kakabọ.',
    'reorder.addToCart': 'Yọ rre Escrow Cart',
    'reorder.instantReorder': 'Dẹ Kakabọ Yanzu',
    'reorder.bulkDiscount': 'O rre Ego Otọ',
    'reorder.unit': 'Oka',
    'reorder.qty': 'Ivbiyeke',

    // QR Scanner
    'qr.title': 'Industrial Asset & Escrow QR Scanner',
    'qr.subtitle': 'Scan physical machine diagnostic plates, escrow tracking codes, or verified seller certification tags.',
    'qr.cameraMode': 'Live Camera Scan',
    'qr.uploadMode': 'Upload QR Image',
    'qr.sampleCodes': 'Test Sample QR Asset Badges',
    'qr.scanning': 'Scanning with camera...',
    'qr.grantPermission': 'Camera permission required for live scanning',

    // Seller Leaderboard
    'leaderboard.title': 'Eseller Rank vbe Edo, Lagos',
    'leaderboard.subtitle': 'Amana, Escrow a ke okpan gbegbe.',
    'leaderboard.rank': 'Ipo',
    'leaderboard.fulfillment': 'Escrow Fulfillment',
    'leaderboard.inventory': 'Ghe Iwinna',

    // MTM Agent
    'agent.title': 'Agbada MTM Assistant',
    'agent.alert': 'Eho Iwinna Alert',
    'agent.voice': 'Zẹ oviọhẹ',
    'agent.audioTranscript': 'Rubutun Murya'
  },
  zh: {
    // Header & Navigation
    'nav.home': '首页',
    'nav.catalog': '浏览机械',
    'nav.categories': '所有类别',
    'nav.deals': '清仓特价',
    'nav.services': '检测与货运',
    'nav.trends': '智能价格趋势',
    'nav.leaderboard': '卖家排行榜',
    'nav.about': '关于 MTM',
    'nav.sell': '发布出售机器',
    'nav.account': '买家和卖家门户',
    'nav.agent': 'MTM 智能助手',
    'nav.qrScanner': '二维码扫描',
    'nav.quickReorder': '快速重复订购',
    'search.placeholder': '搜索工业机械、备件、刀具、枢纽（例如 SCM 裁板锯、贝宁城）...',
    'escrow.shield': '100% 托管担保保护',
    'currency.toggle': '尼日利亚奈拉 (₦) / 美元 ($)',

    // Quick Reorder
    'reorder.title': '快速订购耗材与备件',
    'reorder.subtitle': '一键重复补给车间耗材、粘合剂、锯片及机器备件。',
    'reorder.addToCart': '添加到托管购物车',
    'reorder.instantReorder': '立即快速订购',
    'reorder.bulkDiscount': '批量折扣已激活',
    'reorder.unit': '单位',
    'reorder.qty': '数量',

    // QR Scanner
    'qr.title': '工业资产与托管二维码扫描仪',
    'qr.subtitle': '扫描实体机器铭牌、托管追踪码或已认证卖家标签。',
    'qr.cameraMode': '实时相机扫描',
    'qr.uploadMode': '上传二维码图片',
    'qr.sampleCodes': '测试二维码资产样本',
    'qr.scanning': '正在使用相机扫描...',
    'qr.grantPermission': '实时扫描需要相机权限',

    // Seller Leaderboard
    'leaderboard.title': '顶级工业卖家排行榜',
    'leaderboard.subtitle': '按经审计的托管履行、交易额和验证检测排名。',
    'leaderboard.rank': '排名',
    'leaderboard.fulfillment': '托管履行',
    'leaderboard.inventory': '浏览库存',

    // MTM Agent
    'agent.title': 'MTM 智能助手',
    'agent.alert': '设备警报',
    'agent.voice': '语音搜索',
    'agent.audioTranscript': '语音转录'
  }
};
