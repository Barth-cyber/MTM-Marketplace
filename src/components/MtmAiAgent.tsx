import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  ExternalLink,
  Globe,
  Building2,
  ShieldCheck,
  Heart,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Mic,
  Trophy,
  CheckCircle2,
  Zap,
  MapPin,
  Smartphone,
  Mail,
  Plus,
  RefreshCw,
  QrCode,
  Repeat,
  Menu,
  Calculator,
  Database,
  Sliders,
  Settings,
  Truck,
  GripHorizontal,
  Move,
  MessageSquare,
  Phone,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  Gift,
  Smile,
  Volume1
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ReactMarkdown from 'react-markdown';
import { useMarketplace } from '../context/MarketplaceContext';
import { VoiceInputButton } from './VoiceInputButton';
import { getHumanExpertWhatsappUrl } from '../utils/whatsappHelper';
import { humanizedSpeechEngine } from '../utils/speechEngine';

const DEFAULT_NIGERIAN_TRANSCRIPT = {
  text: "Welcome to MTM Machinery & Tooling Marketplace. I am your MTM AI Procurement Assistant. All verified industrial machines on our platform undergo a rigorous 42-point inspection by certified COREN engineers, with full telemetry run-tests, secure CBN-licensed banking escrow protection, and turnkey interstate heavy haulage across all Nigerian industrial hubs. How may I assist your factory or workshop today?",
  sourceText: "Welcome to MTM Machinery & Tooling Marketplace. I am your MTM AI Procurement Assistant. All verified industrial machines on our platform undergo a rigorous 42-point inspection by certified COREN engineers, with full telemetry run-tests, secure CBN-licensed banking escrow protection, and turnkey interstate heavy haulage across all Nigerian industrial hubs. How may I assist your factory or workshop today?",
  timestamp: "Verified Initial Transcript",
  voiceLabel: "🇳🇬 Nigerian Female Tone (Calibrated & Retained)"
};

export const MtmAiAgent: React.FC = () => {
  const { 
    products, 
    activeProduct,
    cart,
    compareList,
    selectedCategory,
    formatPrice, 
    setActiveProduct, 
    filterState, 
    setFilterState,
    isMtmAgentOpen, 
    setIsMtmAgentOpen,
    showToast,
    setIsInventoryAlertOpen,
    setIsInteriorDuctModalOpen,
    setActiveView,
    setIsQrScannerOpen,
    setIsQuickReorderOpen,
    setIsCartOpen,
    setIsSellModalOpen,
    t
  } = useMarketplace();

  // Movable Floating Trigger Button States
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX - btnPos.x, y: e.clientY - btnPos.y };
    setIsDragging(true);
    setHasDragged(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    
    if (Math.abs(newX - btnPos.x) > 4 || Math.abs(newY - btnPos.y) > 4) {
      setHasDragged(true);
    }
    setBtnPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Movable Chat Window States
  const [windowPos, setWindowPos] = useState({ x: 0, y: 0 });
  const [isWindowDragging, setIsWindowDragging] = useState(false);
  const windowDragStart = useRef({ x: 0, y: 0 });

  const handleWindowPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Don't drag if clicking buttons, select menus, input boxes or textareas inside header
    if (target.closest('button') || target.closest('select') || target.closest('input') || target.closest('textarea')) {
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    windowDragStart.current = { x: e.clientX - windowPos.x, y: e.clientY - windowPos.y };
    setIsWindowDragging(true);
  };

  const handleWindowPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isWindowDragging) return;
    setWindowPos({
      x: e.clientX - windowDragStart.current.x,
      y: e.clientY - windowDragStart.current.y
    });
  };

  const handleWindowPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsWindowDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Resizable & Expandable Window Height and Width States
  const [windowHeight, setWindowHeight] = useState<number>(760); // height in pixels
  const [windowWidth, setWindowWidth] = useState<number>(480); // width in pixels
  const [isMaximized, setIsMaximized] = useState<boolean>(false); // Fullscreen / Large mode toggle
  const [isResizingHeight, setIsResizingHeight] = useState<boolean>(false);
  const [isResizingWidth, setIsResizingWidth] = useState<boolean>(false);
  const heightResizeStart = useRef<{ startY: number; startHeight: number }>({ startY: 0, startHeight: 760 });
  const widthResizeStart = useRef<{ startX: number; startWidth: number }>({ startX: 0, startWidth: 480 });
  const [isSpinningWheel, setIsSpinningWheel] = useState<boolean>(false);

  // Height Resizer Handlers
  const handleHeightResizeDown = (e: React.PointerEvent<HTMLDivElement>, direction: 'top' | 'bottom') => {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    heightResizeStart.current = { startY: e.clientY, startHeight: windowHeight };
    setIsResizingHeight(true);
  };

  const handleHeightResizeMove = (e: React.PointerEvent<HTMLDivElement>, direction: 'top' | 'bottom') => {
    if (!isResizingHeight) return;
    const deltaY = direction === 'bottom' ? e.clientY - heightResizeStart.current.startY : heightResizeStart.current.startY - e.clientY;
    const maxH = Math.floor(window.innerHeight * 0.94);
    const newHeight = Math.min(Math.max(400, heightResizeStart.current.startHeight + deltaY), maxH);
    setWindowHeight(newHeight);
  };

  const handleHeightResizeUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isResizingHeight) {
      setIsResizingHeight(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Left Width Resizer Handlers
  const handleWidthResizeDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    widthResizeStart.current = { startX: e.clientX, startWidth: windowWidth };
    setIsResizingWidth(true);
  };

  const handleWidthResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizingWidth) return;
    const deltaX = widthResizeStart.current.startX - e.clientX;
    const maxW = Math.min(880, Math.floor(window.innerWidth * 0.96));
    const newWidth = Math.min(Math.max(340, widthResizeStart.current.startWidth + deltaX), maxW);
    setWindowWidth(newWidth);
  };

  const handleWidthResizeUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isResizingWidth) {
      setIsResizingWidth(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Cycle height presets: Compact (480px), Medium (720px), Tall (880px)
  const cycleHeightPreset = () => {
    if (windowHeight < 550) {
      setWindowHeight(720);
      showToast('📐 Height updated to Medium (720px)');
    } else if (windowHeight < 800) {
      setWindowHeight(880);
      showToast('📐 Height updated to Tall (880px)');
    } else {
      setWindowHeight(480);
      showToast('📐 Height updated to Compact (480px)');
    }
  };

  // Fun Lucky Equipment Coupon Spin Game
  const handleSpinLuckyDeal = () => {
    setIsSpinningWheel(true);
    showToast('🎰 Spinning Lucky MTM Equipment Wheel...');
    setTimeout(() => {
      setIsSpinningWheel(false);
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
      const prizes = [
        '🎉 WINNER: 10% OFF Heavy Freight Logistics Voucher (Code: MTM-FREIGHT-10)',
        '🎉 WINNER: Free Factory Machinery Inspection Certificate (Code: MTM-INSPECT-FREE)',
        '🎉 WINNER: ₦100,000 Rebate on Perkins/Cummins Diesel Gensets (Code: POWER-REBATE-100K)',
        '🎉 WINNER: Free Spare Blades Package with Woodworking CNC Order (Code: CNC-BONUS-BLADES)'
      ];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `### 🎰 Congratulations! You Won an Exclusive MTM Marketplace Voucher!\n\n${prize}\n\n*Applied to your active session. Quote this code when negotiating or adding to cart for instant savings!*`
        }
      ]);
    }, 1200);
  };

  const [messages, setMessages] = useState<Array<{
    sender: 'ai' | 'user';
    text: string;
    sources?: Array<{ title: string; uri: string }>;
    recommendations?: typeof products;
    isAlertCard?: boolean;
    alertData?: {
      keyword: string;
      budget: number;
      hub: string;
    };
  }>>([
    {
      sender: 'ai',
      text: 'Hello! How can I assist you with industrial machinery specifications, market trends, or platform inquiries today?'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpeakingText, setActiveSpeakingText] = useState<string | null>(null);
  const [speechProgress, setSpeechProgress] = useState<{ current: number; total: number; text: string } | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  
  // Custom Equipment Alert State
  const [alertKeyword, setAlertKeyword] = useState('SCM Sliding Table Saw');
  const [alertMaxBudget, setAlertMaxBudget] = useState(15000000);
  const [alertHub, setAlertHub] = useState('All Hubs');
  const [alertPhone, setAlertPhone] = useState('08066062008');
  const [alertEmail, setAlertEmail] = useState('buyer@industrial.ng');
  const [alertChannels, setAlertChannels] = useState<{ whatsapp: boolean; email: boolean; inApp: boolean }>({
    whatsapp: true,
    email: true,
    inApp: true
  });
  const [alertSubscribed, setAlertSubscribed] = useState(false);

  // Voice Accent, Speed & Retained Nigerian Female Audio Transcript States (Persisted)
  const [voiceAccent, setVoiceAccent] = useState<'ng-female' | 'uk-female' | 'us-female'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mtm_agent_voice_accent');
      if (saved === 'ng-female' || saved === 'uk-female' || saved === 'us-female') {
        return saved;
      }
    }
    return 'ng-female';
  });

  const [voiceSpeed, setVoiceSpeed] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mtm_agent_voice_speed');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0.6 && parsed <= 1.5) return parsed;
      }
    }
    return 0.98;
  });

  const [retainedTranscript, setRetainedTranscript] = useState<{
    text: string;
    sourceText: string;
    timestamp: string;
    voiceLabel: string;
  }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mtm_agent_retained_transcript');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_NIGERIAN_TRANSCRIPT;
  });

  const [isTranscriptBannerVisible, setIsTranscriptBannerVisible] = useState<boolean>(true);

  // Keep settings persisted even across reloads & site publishing
  useEffect(() => {
    try {
      localStorage.setItem('mtm_agent_voice_accent', voiceAccent);
    } catch {
      // ignore
    }
  }, [voiceAccent]);

  useEffect(() => {
    try {
      localStorage.setItem('mtm_agent_voice_speed', voiceSpeed.toString());
    } catch {
      // ignore
    }
  }, [voiceSpeed]);

  useEffect(() => {
    if (retainedTranscript) {
      try {
        localStorage.setItem('mtm_agent_retained_transcript', JSON.stringify(retainedTranscript));
      } catch {
        // ignore
      }
    }
  }, [retainedTranscript]);

  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);
  const [activeQuickAction, setActiveQuickAction] = useState<'none' | 'quote' | 'shipping' | 'material'>('none');

  // Interactive Quick Action Form States
  const [calcCost, setCalcCost] = useState<number>(15000000);
  const [calcPeriod, setCalcPeriod] = useState<number>(12);
  const [calcEscrow, setCalcEscrow] = useState<boolean>(true);

  // Context-aware WhatsApp URL for Human Expert live chat
  const expertWhatsappUrl = getHumanExpertWhatsappUrl({
    activeProduct,
    messages,
    cart,
    compareList,
    filterState,
    selectedCategory
  });

  const [shipWeight, setShipWeight] = useState<number>(5);
  const [shipDistance, setShipDistance] = useState<number>(150);
  const [shipCrane, setShipCrane] = useState<boolean>(true);

  const [selectedMaterial, setSelectedMaterial] = useState<string>('Iroko');

  const materialSpecs: Record<string, { density: string; hardness: string; feedSpeed: string; sawTooth: string; description: string }> = {
    'Iroko': {
      density: '660 kg/m³ (Hardwood)',
      hardness: 'Medium-High (1,260 lbf)',
      feedSpeed: '12 - 18 m/min',
      sawTooth: 'ATB (Alternate Top Bevel) - 60T to 80T',
      description: 'Extremely durable West African wood. Requires sturdy feed force on spindle moulders.'
    },
    'Obeche': {
      density: '380 kg/m³ (Soft Hardwood)',
      hardness: 'Very Low (430 lbf)',
      feedSpeed: '18 - 25 m/min',
      sawTooth: 'Flat Tooth (FT) or ATB - 40T to 60T',
      description: 'Extremely lightweight, easy to saw. High risk of fiber tearing if blades are dull.'
    },
    'Mahogany': {
      density: '530 kg/m³ (Medium Hardwood)',
      hardness: 'Medium (900 lbf)',
      feedSpeed: '15 - 20 m/min',
      sawTooth: 'ATB - 60T',
      description: 'Excellent working properties. Smooth finishes when run through edgebanders.'
    },
    'MDF / HDF': {
      density: '750 - 900 kg/m³ (Composite)',
      hardness: 'High Surface Hardness',
      feedSpeed: '10 - 15 m/min',
      sawTooth: 'TCG (Triple Chip Grind) - Carbide Tipped 80T+',
      description: 'Highly abrasive due to resins. Requires TCG saw blades to prevent chipping on laminate edges.'
    }
  };

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMtmAgentOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMtmAgentOpen, isTyping]);

  // Clean up speech synthesis on unmount or close
  useEffect(() => {
    if (!isMtmAgentOpen) {
      humanizedSpeechEngine.stop();
      setIsSpeaking(false);
      setActiveSpeakingText(null);
      setSpeechProgress(null);
    }
  }, [isMtmAgentOpen]);

  // 🎙️ Dynamic Speech Synthesis Communicator with Fine-Tuned Nigerian Female Tone & Natural Customer Service Flow
  const speakNigerianText = (textToSpeak: string) => {
    const voiceLabel = humanizedSpeechEngine.getActiveVoiceLabel(voiceAccent);
    const cleanedTranscriptChunks = humanizedSpeechEngine.prepareTranscriptForSpeech(textToSpeak);
    const readableText = cleanedTranscriptChunks.join(' ');

    const newTranscript = {
      text: readableText || textToSpeak,
      sourceText: textToSpeak,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      voiceLabel,
    };
    setRetainedTranscript(newTranscript);
    setIsTranscriptBannerVisible(true);

    humanizedSpeechEngine.speakTranscript(textToSpeak, {
      voiceAccent,
      voiceSpeed,
      onStart: () => {
        setIsSpeaking(true);
        setActiveSpeakingText(textToSpeak);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setActiveSpeakingText(null);
        setSpeechProgress(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setActiveSpeakingText(null);
        setSpeechProgress(null);
      },
      onSentenceChange: (currentIdx, total, currentText) => {
        setSpeechProgress({ current: currentIdx + 1, total, text: currentText });
      }
    });
  };

  // Process voice commands to navigate sections or perform quick searches
  const processVoiceCommand = (rawText: string): boolean => {
    const text = rawText.toLowerCase().trim();
    
    // Quick Reorder command
    if (text.includes('reorder') || text.includes('order again') || text.includes('order parts') || text.includes('consumables')) {
      setIsQuickReorderOpen(true);
      setIsMtmAgentOpen(false);
      speakNigerianText("Right away! I have opened the Quick Reorder dashboard for workshop spares and wood glue.");
      showToast("🎙️ Voice Command: Opening Quick Reorder");
      return true;
    }
    
    // QR Scanner command
    if (text.includes('scanner') || text.includes('scan') || text.includes('qr code')) {
      setIsQrScannerOpen(true);
      setIsMtmAgentOpen(false);
      speakNigerianText("Sure, let's open the escrow and industrial asset QR Scanner.");
      showToast("🎙️ Voice Command: Opening QR Scanner");
      return true;
    }

    // Escrow Cart command
    if (text.includes('cart') || text.includes('basket') || text.includes('my order') || text.includes('checkout')) {
      setIsCartOpen(true);
      setIsMtmAgentOpen(false);
      speakNigerianText("Opening your secure escrow cart now.");
      showToast("🎙️ Voice Command: Opening Cart");
      return true;
    }

    // Sell Machine command
    if (text.includes('sell') || text.includes('post machine') || text.includes('post listing') || text.includes('post lot')) {
      setIsSellModalOpen(true);
      setIsMtmAgentOpen(false);
      speakNigerianText("Certainly. Opening the sell machine portal for you.");
      showToast("🎙️ Voice Command: Opening Sell Portal");
      return true;
    }

    // Heavy machinery Catalog/Browse navigation
    if (text.includes('catalog') || text.includes('browse') || text.includes('machines') || text.includes('equipment')) {
      setActiveView('catalog');
      setIsMtmAgentOpen(false);
      speakNigerianText("Navigating to our complete heavy machinery catalog. Take a look!");
      showToast("🎙️ Voice Command: Navigating to Catalog");
      return true;
    }

    // Liquidation/Deals navigation
    if (text.includes('deal') || text.includes('liquidation') || text.includes('clearance') || text.includes('discount')) {
      setActiveView('deals');
      setIsMtmAgentOpen(false);
      speakNigerianText("Navigating to liquidation lots and warehouse clearance deals.");
      showToast("🎙️ Voice Command: Navigating to Deals");
      return true;
    }

    // Categories list navigation
    if (text.includes('category') || text.includes('categories')) {
      setActiveView('categories');
      setIsMtmAgentOpen(false);
      speakNigerianText("Opening machinery and spares categories.");
      showToast("🎙️ Voice Command: Navigating to Categories");
      return true;
    }

    // Services (inspections and logistics)
    if (text.includes('service') || text.includes('inspection') || text.includes('freight') || text.includes('logistics')) {
      setActiveView('services');
      setIsMtmAgentOpen(false);
      speakNigerianText("Opening inspected freight, logistics, and verification services.");
      showToast("🎙️ Voice Command: Navigating to Services");
      return true;
    }

    // Smart Trends navigation
    if (text.includes('trend') || text.includes('price trend') || text.includes('market trend')) {
      setActiveView('trends');
      setIsMtmAgentOpen(false);
      speakNigerianText("Displaying the latest smart market trends and price forecasts.");
      showToast("🎙️ Voice Command: Navigating to Smart Trends");
      return true;
    }

    // Leaderboard navigation
    if (text.includes('leaderboard') || text.includes('sellers') || text.includes('top sellers')) {
      setActiveView('leaderboard');
      setIsMtmAgentOpen(false);
      speakNigerianText("Opening the audited seller leaderboard.");
      showToast("🎙️ Voice Command: Navigating to Leaderboard");
      return true;
    }

    // About Page
    if (text.includes('about mtm') || text.includes('about us') || text.includes('specialist architecture')) {
      setActiveView('about');
      setIsMtmAgentOpen(false);
      speakNigerianText("Opening About MTM, showing our specialist architecture.");
      showToast("🎙️ Voice Command: Navigating to About");
      return true;
    }

    // Voice search command: e.g., "search for SCM saw" or "find edgebander"
    const searchMatch = rawText.match(/(?:search for|find|look for|show me)\s+(.+)/i);
    if (searchMatch && searchMatch[1]) {
      const searchTerm = searchMatch[1].trim();
      setFilterState(prev => ({ ...prev, search: searchTerm }));
      setActiveView('catalog');
      setIsMtmAgentOpen(false);
      speakNigerianText(`Searching the catalog for ${searchTerm}. Here are the matching listings.`);
      showToast(`🎙️ Voice Search: "${searchTerm}"`);
      return true;
    }

    return false;
  };

  const handleSpeakText = (rawText: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Audio speech playback is not supported in this browser.');
      return;
    }

    if (isSpeaking && activeSpeakingText === rawText) {
      handleStopSpeech();
      return;
    }

    speakNigerianText(rawText);
  };

  const handleStopSpeech = () => {
    humanizedSpeechEngine.stop();
    setIsSpeaking(false);
    setActiveSpeakingText(null);
    setSpeechProgress(null);
  };

  const handleCreateEquipmentAlert = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAlertSubscribed(true);
    showToast(`✓ Equipment Alert active for "${alertKeyword}" under ${formatPrice(alertMaxBudget)}!`);
    
    // Add AI confirmation message into chat
    const channelsList = [
      alertChannels.whatsapp ? 'WhatsApp' : null,
      alertChannels.email ? 'Email' : null,
      alertChannels.inApp ? 'In-App Notifications' : null
    ].filter(Boolean).join(', ');

    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: `### 🔔 Equipment Alert Created Successfully!\n\nI have registered an active **Real-Time Equipment Alert** for **"${alertKeyword}"**:\n\n* **Max Budget Cap:** ${formatPrice(alertMaxBudget)}\n* **Monitored Hub:** ${alertHub}\n* **Notification Channels:** ${channelsList}\n* **Matching Engine:** Auto-scans incoming industrial factory liquidations, workshop equipment clearances, and verified merchant arrivals across Edo, Lagos, Kano, and Port Harcourt.\n\nYou will be notified instantly when matching machinery passes physical diagnostics!`,
        isAlertCard: false
      }
    ]);

    setTimeout(() => {
      setIsAlertModalOpen(false);
      setAlertSubscribed(false);
    }, 1200);
  };

  const handleSend = async (e: React.FormEvent | string) => {
    if (typeof e !== 'string') {
      e.preventDefault();
    }
    const userQuery = typeof e === 'string' ? e : input;
    if (!userQuery.trim()) return;

    const userMsg = userQuery.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    if (typeof e !== 'string') setInput('');
    setIsTyping(true);

    const historyPayload = messages.map(m => ({ sender: m.sender, text: m.text }));

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: historyPayload,
          agentData: {
            activeSearch: filterState?.search || '',
            activeCategory: filterState?.category || 'All',
            selectedHub: filterState?.locationHub || 'All Hubs',
            priceRange: filterState?.priceRange || [0, 50000000],
            totalProductsInCatalog: products.length,
            catalogSummary: products.map(p => `${p.title} (${p.category}, ₦${p.priceNGN?.toLocaleString() || 0}, ${p.location?.city || 'Nigeria'}, Condition: ${p.condition})`).slice(0, 40),
            availableCategories: ['Machines', 'Tools', 'Materials'],
            verifiedHubs: [
              'Benin City, Edo State',
              'Lagos (Ikeja, Oregun, Apapa, Lekki)',
              'Kano (Bompai, Sharada)',
              'Port Harcourt (Trans-Amadi)',
              'Aba (Industrial Layout)'
            ]
          }
        })
      });

      const data = await res.json();
      setIsTyping(false);

      if (data && data.success) {
        let matchedProducts = undefined;
        const lower = userMsg.toLowerCase();
        if (lower.includes('cnc') || lower.includes('saw') || lower.includes('panel') || lower.includes('machine') || lower.includes('bander')) {
          matchedProducts = products.filter(p => p.category === 'Machines').slice(0, 2);
        }

        const isAlertPrompt = lower.includes('alert') || lower.includes('notify') || lower.includes('price drop');

        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: data.text || "No response text received.",
            sources: data.sources || [],
            recommendations: matchedProducts,
            isAlertCard: isAlertPrompt,
            alertData: isAlertPrompt ? {
              keyword: userMsg.replace(/(alert|notify|me|for|when|available|price|drop)/gi, '').trim() || 'Industrial Machinery',
              budget: 15000000,
              hub: filterState.locationHub || 'All Hubs'
            } : undefined
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: "I encountered a minor connection issue, but I am standing by to assist with your industrial queries. Please try resending your message."
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to query MTM Agent backend:", err);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I was unable to reach the server. Please check your network or try again."
        }
      ]);
    }
  };

  return (
    <>
      {/* Floating AI Agent Trigger Button */}
      <button
        id="floating-mtm-agent-btn"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={(e) => {
          if (hasDragged) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          setIsMtmAgentOpen(true);
        }}
        style={{
          transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
          touchAction: 'none',
        }}
        className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[99999] bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white p-3 sm:px-4 sm:py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 transition-all transform hover:scale-105 active:scale-95 group cursor-pointer border-2 border-rose-300 ring-4 ring-[#7A101A]/30 select-none"
        title="MTM Agent • Voice, Specs, Alerts & Escrow"
        aria-label="Open MTM Agent Assistant"
      >
        <div className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#48060C] animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#48060C]" />
        </div>
        <div className="flex flex-col items-start leading-none text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs tracking-tight">MTM Agent</span>
          </div>
          <span className="text-[9.5px] text-rose-100 font-semibold hidden sm:inline">Voice, Alerts & Escrow</span>
        </div>
      </button>

      {/* AI Chat Drawer / Modal */}
      {isMtmAgentOpen && (
        <div className="fixed inset-0 z-[10000] bg-slate-900/40 backdrop-blur-xs flex items-center justify-end p-3 sm:p-4 md:pr-8 md:py-6 animate-fadeIn">
          <div 
            style={{
              transform: `translate(${windowPos.x}px, ${windowPos.y}px)`,
              height: isMaximized ? '94vh' : `${windowHeight}px`,
              width: isMaximized ? undefined : `${windowWidth}px`,
              maxHeight: '95vh',
              transition: isResizingHeight || isResizingWidth ? 'none' : 'height 0.2s ease, width 0.2s ease, transform 0.1s ease-out'
            }}
            className={`bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden relative max-w-[96vw] ${
              isMaximized 
                ? 'w-[96vw] max-w-5xl md:w-[860px]' 
                : 'w-full'
            }`}
          >
            {/* Left Width Drag Resizer Handle */}
            <div
              onPointerDown={handleWidthResizeDown}
              onPointerMove={handleWidthResizeMove}
              onPointerUp={handleWidthResizeUp}
              className="absolute left-0 top-0 bottom-0 w-2 hover:bg-amber-500/50 cursor-ew-resize z-30 flex items-center justify-center group transition select-none"
              title="Click and drag left/right to adjust window width"
            >
              <div className="w-0.5 h-8 bg-slate-300 group-hover:bg-amber-400 rounded-full transition" />
            </div>

            {/* Top Height Drag Resizer Handle */}
            <div
              onPointerDown={(e) => handleHeightResizeDown(e, 'top')}
              onPointerMove={(e) => handleHeightResizeMove(e, 'top')}
              onPointerUp={handleHeightResizeUp}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 py-1 flex items-center justify-center cursor-ns-resize transition group select-none shrink-0 border-b border-slate-200"
              title="Click and drag up/down to adjust window height"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase">
                <GripHorizontal className="w-4 h-3 group-hover:scale-125 transition" />
              </div>
            </div>
            
            {/* Header */}
            <div 
              onPointerDown={handleWindowPointerDown}
              onPointerMove={handleWindowPointerMove}
              onPointerUp={handleWindowPointerUp}
              style={{ touchAction: 'none', cursor: 'default' }}
              className="bg-white text-slate-900 p-3 sm:p-3.5 flex items-center justify-between border-b border-slate-200 shrink-0 select-none"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#8B1520] border border-rose-200 flex items-center justify-center font-black shadow-xs shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-xs sm:text-sm flex items-center gap-1 text-slate-900">
                    <span>MTM Agent</span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-1.5">
                {/* Spin Lucky Deal Game Button */}
                <button
                  type="button"
                  onClick={handleSpinLuckyDeal}
                  disabled={isSpinningWheel}
                  className="px-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs transition cursor-pointer active:scale-95 animate-pulse"
                  title="Spin Lucky Deal Wheel for Instant Equipment Vouchers & Discounts!"
                >
                  <Gift className={`w-3.5 h-3.5 ${isSpinningWheel ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Lucky Deal</span>
                </button>

                {/* MTM Expert Live Chat WhatsApp Action in Header */}
                <a
                  href={expertWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="Speak directly with MTM Human Expert on WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-100" />
                  <span className="hidden sm:inline">Human Expert</span>
                </a>

                {/* Retained Audio Transcript Status/Toggle in Header */}
                {retainedTranscript && (
                  <button
                    type="button"
                    onClick={() => setIsTranscriptBannerVisible(prev => !prev)}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs ${
                      isTranscriptBannerVisible
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                    title={isTranscriptBannerVisible ? "Hide Audio Voice Transcript" : "Show Retained Nigerian Female Audio Transcript"}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Transcript</span>
                  </button>
                )}

                {/* Cycle Height Preset Button */}
                <button
                  type="button"
                  onClick={cycleHeightPreset}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center justify-center border border-slate-200"
                  title={`Cycle Height Presets (Current: ${windowHeight}px)`}
                >
                  {windowHeight > 780 ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>

                {/* Expand / Fullscreen Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMaximized(!isMaximized);
                    showToast(isMaximized ? 'Restored standard chat window.' : 'Expanded chat window to full workspace size.');
                  }}
                  className={`p-1.5 rounded-xl transition cursor-pointer border border-slate-200 ${isMaximized ? 'bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'}`}
                  title={isMaximized ? "Restore Window Size" : "Expand Window to Full Size"}
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Hamburger Dropdown Button */}
                <button
                  type="button"
                  onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
                  className={`p-2 rounded-xl transition cursor-pointer relative border border-slate-200 ${isHamburgerOpen ? 'bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                  title="Voice Settings & Quick Tools"
                >
                  <Menu className="w-4 h-4" />
                  {activeQuickAction !== 'none' && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#D83A46] rounded-full animate-ping" />
                  )}
                </button>

                {/* Equipment Alert Action in Header */}
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(!isAlertModalOpen)}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#8B1520] border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Create Custom Equipment Alert"
                >
                  <Bell className="w-3.5 h-3.5 text-[#8B1520]" />
                  <span className="hidden sm:inline">Alerts</span>
                </button>

                {/* Voice Speech Control Stop */}
                {isSpeaking && (
                  <button
                    type="button"
                    onClick={handleStopSpeech}
                    className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer animate-pulse"
                    title="Stop Audio Playback"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsMtmAgentOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 hover:border-rose-600 transition-colors cursor-pointer border border-slate-200 shadow-xs"
                  title="Close MTM Agent"
                  aria-label="Close MTM Agent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Hamburger Dropdown Panel */}
            {isHamburgerOpen && (
              <div className="absolute top-[68px] inset-x-0 z-50 bg-slate-900/95 backdrop-blur-xl text-white p-4 border-b border-slate-700 space-y-4 shadow-2xl animate-fadeIn max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> MTM Specialist Controls
                  </span>
                  <button type="button" onClick={() => setIsHamburgerOpen(false)} className="text-slate-400 hover:text-white text-xs font-bold">✕ Close</button>
                </div>

                {/* MTM Expert Live Chat WhatsApp Connect Card */}
                <div className="p-3 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-700/60 rounded-xl space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg font-bold">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-white">MTM Senior Human Expert Live Chat</h4>
                        <p className="text-[10px] text-emerald-300">Direct technical help from Lagos & Benin City engineers</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-bold uppercase tracking-wider">Online</span>
                  </div>

                  <div className="flex items-center justify-end text-xs pt-1.5 border-t border-emerald-800/80">
                    <a
                      href={expertWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>Connect on WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 1. Voice Settings Accent & Speed Controls (Retained) */}
                <div className="space-y-2.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>🎙️ Audio Voice Settings (Retained)</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                      {humanizedSpeechEngine.getActiveVoiceLabel(voiceAccent)}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-snug">
                    Calibrated specifically for natural Nigerian female enunciation, Naira currency formatting, and engineering specifications. Automatically saved and retained across all sessions and website publishing.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <label className="text-slate-400 block mb-1">Select Voice Accent</label>
                      <select 
                        value={voiceAccent}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setVoiceAccent(val);
                          showToast(`✓ Voice set to ${val === 'ng-female' ? 'Nigerian Female (Retained)' : val === 'uk-female' ? 'UK English' : 'US English'}`);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="ng-female">🇳🇬 Nigerian Female (Consistent & Retained)</option>
                        <option value="uk-female">🇬🇧 UK English Accent</option>
                        <option value="us-female">🇺🇸 US English Accent</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Speech Speed ({voiceSpeed}x)</label>
                      <input 
                        type="range"
                        min="0.6"
                        max="1.5"
                        step="0.02"
                        value={voiceSpeed}
                        onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 bg-slate-800 mt-2"
                      />
                    </div>
                  </div>

                  {retainedTranscript && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Retained transcript saved: {retainedTranscript.timestamp}</span>
                      <button
                        type="button"
                        onClick={() => {
                          speakNigerianText(retainedTranscript.sourceText);
                          showToast("🎙️ Replaying retained audio voice transcript...");
                        }}
                        className="text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        Replay Saved Transcript
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Quick Actions Tab Options */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">🛠️ Quick Actions:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveQuickAction(activeQuickAction === 'quote' ? 'none' : 'quote')}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                        activeQuickAction === 'quote' ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Quote Calc</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveQuickAction(activeQuickAction === 'shipping' ? 'none' : 'shipping')}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                        activeQuickAction === 'shipping' ? 'bg-blue-600 text-white border-blue-500 font-extrabold' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>Shipping Est</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveQuickAction(activeQuickAction === 'material' ? 'none' : 'material')}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                        activeQuickAction === 'material' ? 'bg-purple-600 text-white border-purple-500 font-extrabold' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Database className="w-4 h-4" />
                      <span>Material Specs</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Tool Content Area */}
                {activeQuickAction !== 'none' && (
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3 animate-fadeIn text-xs">
                    
                    {/* QUOTE CALCULATOR */}
                    {activeQuickAction === 'quote' && (
                      <div className="space-y-3 text-left">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                          <span className="font-bold text-amber-400 flex items-center gap-1"><Calculator className="w-4 h-4" /> MTM Escrow Quote Calculator</span>
                          <span className="text-[10px] text-slate-400">secured fund lock</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Machinery Capex (₦)</label>
                            <input 
                              type="number"
                              value={calcCost}
                              onChange={(e) => setCalcCost(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded-md text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Repayment Term</label>
                            <select 
                              value={calcPeriod}
                              onChange={(e) => setCalcPeriod(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded-md text-white text-xs"
                            >
                              <option value="6">6 Months Lease-to-Own</option>
                              <option value="12">12 Months Lease-to-Own</option>
                              <option value="18">18 Months Lease-to-Own</option>
                              <option value="24">24 Months Lease-to-Own</option>
                            </select>
                          </div>
                        </div>

                        <div className="bg-slate-900 p-2.5 rounded-lg space-y-1.5 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Principal Cost:</span>
                            <span className="font-black text-white">₦{calcCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">MTM Escrow Security Fee (1.5%):</span>
                            <span className="text-emerald-400 font-bold">₦{(calcCost * 0.015).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">VAT (7.5%):</span>
                            <span className="text-slate-300">₦{(calcCost * 0.075).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold text-amber-300">
                            <span>Estimated Monthly Payment:</span>
                            <span>₦{Math.round(((calcCost * 1.08) / calcPeriod)).toLocaleString()} / mo</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const descText = `### 🧮 Custom MTM Escrow Quote\n\n* **Capex Cost:** ₦${calcCost.toLocaleString()}\n* **Security Escrow Protection:** Active\n* **Lease Period:** ${calcPeriod} Months\n* **Est. Monthly Repayments:** ₦${Math.round(((calcCost * 1.08) / calcPeriod)).toLocaleString()} per month.\n\n_MTM financing enforces locked-fund protection until onsite machine load test and commissioning are complete._`;
                            setMessages(prev => [...prev, { sender: 'ai', text: descText }]);
                            setIsHamburgerOpen(false);
                            speakNigerianText("Quote successfully generated and calculated. Here is the escrow schedule.");
                          }}
                          className="w-full p-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-lg text-center transition"
                        >
                          Send Quote To Chat Agent
                        </button>
                      </div>
                    )}

                    {/* SHIPPING ESTIMATOR */}
                    {activeQuickAction === 'shipping' && (
                      <div className="space-y-3 text-left">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                          <span className="font-bold text-blue-400 flex items-center gap-1"><Truck className="w-4 h-4" /> MTM Freight & Rigging Estimator</span>
                          <span className="text-[10px] text-slate-400">lowbed trailer rates</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Machine Weight (Tons)</label>
                            <input 
                              type="number"
                              value={shipWeight}
                              onChange={(e) => setShipWeight(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded-md text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Transit Distance (km)</label>
                            <input 
                              type="number"
                              value={shipDistance}
                              onChange={(e) => setShipDistance(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded-md text-white text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 py-1">
                          <input 
                            type="checkbox"
                            checked={shipCrane}
                            onChange={(e) => setShipCrane(e.target.checked)}
                            id="shipCrane"
                            className="rounded accent-blue-500"
                          />
                          <label htmlFor="shipCrane" className="text-[10.5px] text-slate-300 cursor-pointer">Require heavy crane offloading & rigging at destination</label>
                        </div>

                        <div className="bg-slate-900 p-2.5 rounded-lg space-y-1.5 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Base Lowbed Transport:</span>
                            <span>₦{(shipDistance * 1800).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Heavy Weight Class Surcharge:</span>
                            <span>₦{(shipWeight * 45000).toLocaleString()}</span>
                          </div>
                          {shipCrane && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Mobilization & Crane Rigging:</span>
                              <span className="text-amber-400">₦250,000</span>
                            </div>
                          )}
                          <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold text-blue-400">
                            <span>Estimated Total Freight Cost:</span>
                            <span>₦{((shipDistance * 1800) + (shipWeight * 45000) + (shipCrane ? 250000 : 0)).toLocaleString()}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const descText = `### 🚚 Heavy Freight & Rigging Estimate\n\n* **Distance:** ${shipDistance} km\n* **Machine Weight:** ${shipWeight} Tons\n* **Crane Assistance:** ${shipCrane ? 'Yes' : 'No'}\n* **Est. Transport Fee:** ₦${((shipDistance * 1800) + (shipWeight * 45000) + (shipCrane ? 250000 : 0)).toLocaleString()}\n\n_MTM transport includes certified rigger validation and transit-risk escrow protection._`;
                            setMessages(prev => [...prev, { sender: 'ai', text: descText }]);
                            setIsHamburgerOpen(false);
                            speakNigerianText("Shipping estimate calculated. We have logged the rigger dispatch schedule.");
                          }}
                          className="w-full p-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-lg text-center transition"
                        >
                          Send Shipping Estimate To Chat
                        </button>
                      </div>
                    )}

                    {/* MATERIAL SPECS SEARCH */}
                    {activeQuickAction === 'material' && (
                      <div className="space-y-3 text-left">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                          <span className="font-bold text-purple-400 flex items-center gap-1"><Database className="w-4 h-4" /> Wood Material Density & Feed Calculator</span>
                          <span className="text-[10px] text-slate-400">machinist specs</span>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Choose Wood Species</label>
                          <select
                            value={selectedMaterial}
                            onChange={(e) => setSelectedMaterial(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded-md text-white text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                          >
                            <option value="Iroko">Iroko Hardwood</option>
                            <option value="Obeche">Obeche Soft Hardwood</option>
                            <option value="Mahogany">Mahogany Medium Hardwood</option>
                            <option value="MDF / HDF">MDF / HDF Laminates</option>
                          </select>
                        </div>

                        <div className="bg-slate-900 p-2.5 rounded-lg space-y-1.5 text-[11px]">
                          <div>
                            <span className="text-slate-400 block text-[9.5px]">Density Class:</span>
                            <span className="font-bold text-white">{materialSpecs[selectedMaterial].density}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9.5px]">Hardness Rating:</span>
                            <span className="font-bold text-white">{materialSpecs[selectedMaterial].hardness}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9.5px]">Optimal Feed Rate (Spindles/CNC):</span>
                            <span className="font-bold text-purple-400">{materialSpecs[selectedMaterial].feedSpeed}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9.5px]">Recommended Saw Blade:</span>
                            <span className="font-bold text-amber-400">{materialSpecs[selectedMaterial].sawTooth}</span>
                          </div>
                          <p className="text-slate-300 italic text-[10.5px] mt-1 pt-1 border-t border-slate-800">{materialSpecs[selectedMaterial].description}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const specInfo = materialSpecs[selectedMaterial];
                            const descText = `### 📚 Machinist Material Specs: ${selectedMaterial}\n\n* **Density:** ${specInfo.density}\n* **Hardness:** ${specInfo.hardness}\n* **Optimal Feed Rate:** ${specInfo.feedSpeed}\n* **Recommended Saw Blade:** ${specInfo.sawTooth}\n\n_${specInfo.description}_`;
                            setMessages(prev => [...prev, { sender: 'ai', text: descText }]);
                            setIsHamburgerOpen(false);
                            speakNigerianText(`Retrieved technical properties for ${selectedMaterial}. Cutting feed rate is ${specInfo.feedSpeed}.`);
                          }}
                          className="w-full p-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-lg text-center transition"
                        >
                          Send Specs To Chat
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}

            {/* Quick Action Prompt Chips */}
            <div className="bg-slate-100/95 backdrop-blur-md p-2.5 border-b border-slate-200 flex flex-wrap items-center gap-1.5 text-[11px] shrink-0">
              <a 
                href={expertWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-black transition flex items-center gap-1 cursor-pointer shadow-xs border border-emerald-500"
                title="Connect with Human Expert on WhatsApp"
              >
                <MessageSquare className="w-3 h-3 text-emerald-200 fill-emerald-200/20" />
                💬 Speak with Human Expert
              </a>
              <button 
                type="button"
                onClick={() => setIsAlertModalOpen(true)} 
                className="px-2.5 py-1 bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-950 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <BellRing className="w-3 h-3 text-amber-600" />
                🔔 Set Alert
              </button>
              <button 
                type="button"
                onClick={() => {
                  setActiveView('leaderboard');
                  setIsMtmAgentOpen(false);
                }} 
                className="px-2.5 py-1 bg-white border border-blue-300 hover:bg-blue-50 text-blue-900 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <Trophy className="w-3 h-3 text-[#1E40AF]" />
                🏆 Leaderboard
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsHamburgerOpen(true);
                  setActiveQuickAction(activeQuickAction === 'quote' ? 'none' : 'quote');
                }} 
                className="px-2.5 py-1 bg-purple-50 border border-purple-300 hover:bg-purple-100 text-purple-950 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Calculator className="w-3 h-3 text-purple-600 animate-pulse" />
                🛠️ Quick Actions
              </button>
              <button 
                type="button"
                onClick={() => handleSend("Show me active escrow-guaranteed machinery listings")} 
                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-blue-50 text-slate-800 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                ⚡ Escrow Deals
              </button>
            </div>


            {/* Live Audio Transcript Display Banner (if voice search was performed) */}
            {audioTranscript && (
              <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between text-xs text-blue-900 animate-fadeIn shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <Mic className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span className="font-bold">Audio Transcript:</span>
                  <span className="italic text-slate-700 font-medium">"{audioTranscript}"</span>
                </div>
                <button 
                  onClick={() => setAudioTranscript(null)}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear audio transcript"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Integrated Equipment Alert Creator Panel (Slide-down toggle) */}
            {isAlertModalOpen && (
              <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-white p-4 border-b border-blue-800 shadow-xl space-y-3 shrink-0 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-400 text-slate-950 rounded-lg">
                      <BellRing className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-white">Create Real-Time Equipment Alert</h4>
                      <p className="text-[10.5px] text-blue-200">Get notified via WhatsApp & Email when machinery arrives or prices drop</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAlertModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateEquipmentAlert} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Equipment Name / Model</label>
                      <input
                        type="text"
                        value={alertKeyword}
                        onChange={(e) => setAlertKeyword(e.target.value)}
                        placeholder="e.g. SCM Panel Saw, CNC Router..."
                        className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Max Budget (₦ NGN)</label>
                      <input
                        type="number"
                        value={alertMaxBudget}
                        onChange={(e) => setAlertMaxBudget(Number(e.target.value))}
                        step="500000"
                        className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Monitored Industrial Hub</label>
                      <select
                        value={alertHub}
                        onChange={(e) => setAlertHub(e.target.value)}
                        className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none"
                      >
                        <option value="All Hubs">All Nigerian Hubs</option>
                        <option value="Benin City Hub">Benin City Hub (Edo Industrial Centre)</option>
                        <option value="Lagos Hub">Lagos Hub (Ikeja/Oregun)</option>
                        <option value="Kano Hub">Kano Hub (Bompai)</option>
                        <option value="Port Harcourt Hub">Port Harcourt Hub</option>
                        <option value="Aba Hub">Aba Industrial Yard</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800">
                    <div className="flex items-center gap-3 text-[11px]">
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                        <input
                          type="checkbox"
                          checked={alertChannels.whatsapp}
                          onChange={(e) => setAlertChannels(c => ({ ...c, whatsapp: e.target.checked }))}
                          className="rounded text-emerald-500"
                        />
                        <Smartphone className="w-3 h-3 text-emerald-400" />
                        <span>WhatsApp</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                        <input
                          type="checkbox"
                          checked={alertChannels.email}
                          onChange={(e) => setAlertChannels(c => ({ ...c, email: e.target.checked }))}
                          className="rounded text-blue-500"
                        />
                        <Mail className="w-3 h-3 text-blue-400" />
                        <span>Email</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAlertModalOpen(false);
                          setIsInventoryAlertOpen(true);
                        }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold transition"
                      >
                        Open Full Alert Center
                      </button>
                      <button
                        type="submit"
                        disabled={alertSubscribed}
                        className="px-4 py-1.5 bg-[#FACC15] hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs transition shadow-md flex items-center gap-1 cursor-pointer"
                      >
                        {alertSubscribed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{alertSubscribed ? 'Alert Active!' : 'Activate Alert'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* 🇳🇬 Retained Nigerian Female Audio Voice Transcript Panel */}
            {retainedTranscript && isTranscriptBannerVisible && (
              <div className="bg-slate-900 border-b border-emerald-500/40 text-white p-3 shrink-0 shadow-sm relative z-10 transition-all duration-200">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-2.5 w-2.5 relative shrink-0">
                      {isSpeaking ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </>
                      ) : (
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500/80"></span>
                      )}
                    </span>
                    <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wide truncate">
                      🇳🇬 Nigerian Female Audio Voice Transcript (Retained)
                    </span>
                    <span className="hidden sm:inline-block text-[9.5px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/50 rounded-full font-semibold">
                      {retainedTranscript.voiceLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (isSpeaking) {
                          handleStopSpeech();
                        } else {
                          speakNigerianText(retainedTranscript.sourceText);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer shadow-xs ${
                        isSpeaking
                          ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                      title={isSpeaking ? "Stop speech" : "Replay retained transcript in authentic Nigerian female cadence"}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Replay Voice</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsTranscriptBannerVisible(false)}
                      className="text-slate-400 hover:text-white p-1 rounded-md text-xs hover:bg-slate-800 transition"
                      title="Hide transcript banner (can re-open anytime from header)"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="text-[11.5px] text-slate-200 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 max-h-24 overflow-y-auto leading-relaxed shadow-inner">
                  {speechProgress ? (
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Enunciating sentence {speechProgress.current} of {speechProgress.total}:</span>
                      </div>
                      <p className="text-white font-medium">{speechProgress.text}</p>
                    </div>
                  ) : (
                    <p className="text-slate-300">{retainedTranscript.text}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                  <span>Saved at {retainedTranscript.timestamp} • Retained across sessions</span>
                  <span className="text-emerald-400 font-bold">{voiceSpeed}x cadence • Calibrated female pitch</span>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
                  <div className={`flex items-start space-x-2.5 max-w-[92%] ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      m.sender === 'user' ? 'bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] text-white shadow-xs' : 'bg-slate-900 text-white shadow-xs'
                    }`}>
                      {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-[#FACC15]" />}
                    </div>
                    
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user' 
                        ? 'bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] text-white rounded-tr-none shadow-xs' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                    }`}>
                      {m.sender === 'user' ? (
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      ) : (
                        <div>
                          <div className="prose prose-xs max-w-none text-slate-800 [&_h3]:font-black [&_h3]:text-sm [&_h3]:text-[#1E40AF] [&_h3]:mb-1.5 [&_h4]:font-bold [&_h4]:text-xs [&_h4]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1 [&_p]:mb-2 [&_strong]:text-slate-900">
                            <ReactMarkdown>{m.text}</ReactMarkdown>
                          </div>

                          {/* Audio Transcript Speech Playback Control */}
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleSpeakText(m.text)}
                                className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                  isSpeaking && activeSpeakingText === m.text
                                    ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200'
                                }`}
                                title={isSpeaking && activeSpeakingText === m.text ? "Stop reading aloud" : "Listen to audio transcript with natural Nigerian female voice intonation (Retained)"}
                              >
                                {isSpeaking && activeSpeakingText === m.text ? (
                                  <>
                                    <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Stop Speech</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Listen in Nigerian Female Voice</span>
                                  </>
                                )}
                              </button>

                              {isSpeaking && activeSpeakingText === m.text && speechProgress && (
                                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                  <span>Reading {speechProgress.current}/{speechProgress.total}</span>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                setAlertKeyword(m.text.split('**')[1] || 'Industrial Machinery');
                                setIsAlertModalOpen(true);
                              }}
                              className="text-[10.5px] font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
                            >
                              <Bell className="w-3 h-3 text-amber-500" />
                              <span>Set Alert for this Equipment</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Grounding Sources / Links */}
                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-blue-600" /> Grounded Search Sources:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {m.sources.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-900 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200 transition line-clamp-1 max-w-[220px]"
                              >
                                <span>{src.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommendations Cards if present */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="w-full pl-9 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Platform Machinery:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.recommendations.map(prod => (
                          <div 
                            key={prod.id}
                            onClick={() => {
                              setIsMtmAgentOpen(false);
                              setActiveProduct(prod);
                            }}
                            className="bg-white border border-slate-200 hover:border-[#1E40AF] p-2.5 rounded-xl shadow-2xs flex items-center justify-between cursor-pointer transition group"
                          >
                            <div className="flex items-center space-x-2.5">
                              <img src={prod.images[0]} alt={prod.title} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                              <div>
                                <h4 className="font-bold text-slate-900 text-xs group-hover:text-[#1E40AF] line-clamp-1">{prod.title}</h4>
                                <span className="text-xs font-black text-[#1E40AF]">{formatPrice(prod.priceNGN, prod.priceUSD)}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E40AF]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-2 text-slate-500 text-xs italic bg-white p-3 rounded-2xl border border-slate-200 w-fit shadow-2xs">
                  <Bot className="w-4 h-4 animate-bounce text-[#1E40AF]" />
                  <span>MTM Agent is searching web & verified platform databases...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Form with Voice Search & Speech-to-Text */}
            <form onSubmit={e => handleSend(e)} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about machinery specs, set equipment alerts..."
                className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#8B1520] focus:ring-1 focus:ring-[#8B1520]"
              />

              {/* Voice Search with Instant Audio Transcript Record */}
              <VoiceInputButton
                onTranscript={(transcript) => {
                  setAudioTranscript(transcript);
                  
                  // Run voice command router first
                  const isCommand = processVoiceCommand(transcript);
                  
                  if (!isCommand) {
                    setInput(transcript);
                    handleSend(transcript);
                  }
                }}
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] disabled:opacity-50 text-white p-2.5 rounded-xl transition cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Height Drag Resizer Handle */}
            <div
              onPointerDown={(e) => handleHeightResizeDown(e, 'bottom')}
              onPointerMove={(e) => handleHeightResizeMove(e, 'bottom')}
              onPointerUp={handleHeightResizeUp}
              className="w-full bg-slate-900 hover:bg-amber-600 text-slate-400 hover:text-white py-1 flex items-center justify-center cursor-ns-resize transition group select-none shrink-0 border-t border-slate-800"
              title="Click and drag up/down to adjust window height"
            >
              <div className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider uppercase">
                <GripHorizontal className="w-4 h-3 group-hover:scale-125 transition" />
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
