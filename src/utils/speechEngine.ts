/**
 * Fine-Tuned Speech Synthesis Engine for MTM AI Agent
 * Specializes in natural, humanized Nigerian female customer service cadence.
 * Features:
 * - Zero spoken punctuation marks or symbols
 * - Seamless connection between list numbers (1, 2, 3...) and item details
 * - Calibrated natural human breath pause (90ms) between items (neither too fast nor too slow)
 * - Warm, articulate Nigerian female customer assistant intonation
 */

// Format currency into natural spoken words for Nigerian English
function formatSpokenNaira(amountStr: string): string {
  const clean = amountStr.replace(/,/g, '').trim();
  const val = parseFloat(clean);
  if (isNaN(val)) return `${amountStr} Naira`;
  if (val >= 1_000_000_000) {
    const b = (val / 1_000_000_000).toFixed(1).replace(/\.0$/, '');
    return `${b} billion Naira`;
  }
  if (val >= 1_000_000) {
    const m = (val / 1_000_000).toFixed(1).replace(/\.0$/, '');
    return `${m} million Naira`;
  }
  if (val >= 1_000) {
    const k = (val / 1_000).toFixed(0);
    return `${k} thousand Naira`;
  }
  return `${val} Naira`;
}

export interface SpeechEngineOptions {
  voiceAccent?: 'ng-female' | 'uk-female' | 'us-female';
  voiceSpeed?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: unknown) => void;
  onSentenceChange?: (sentenceIndex: number, totalSentences: number, text: string) => void;
}

class HumanizedSpeechEngine {
  private isPlaying = false;
  private isPaused = false;
  private currentQueue: string[] = [];
  private currentIndex = 0;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private currentOptions: SpeechEngineOptions | null = null;
  private pauseTimer: number | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.cachedVoices && this.cachedVoices.length > 0) return this.cachedVoices;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
    }
    return this.cachedVoices || [];
  }

  /**
   * Pre-process raw markdown and transcript text to introduce humanized, fluent phrasing:
   * 1. Strips all punctuation symbols and raw markdown so punctuation marks are NEVER spoken aloud.
   * 2. Formats numbered and bulleted lists so there is NO pause between the number and its information.
   * 3. Sets up clean item and sentence chunks for balanced human-paced reading (90ms between items).
   */
  public prepareTranscriptForSpeech(rawText: string): string[] {
    if (!rawText || !rawText.trim()) return [];

    let text = rawText;

    // 0. Remove all emojis, icons, and non-spoken graphic glyphs
    text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1FA00}-\u{1FA6F}\u{2300}-\u{23FF}\u{2B50}\u{2B06}\u{2B07}\u{2934}\u{2935}\u{3030}\u{303D}\u{3297}\u{3299}\u{FF0E}]/gu, '');
    text = text.replace(/[🏭💰⚙️📍🛡️🖼️🔗🔔📁📊🎓🌟🚛🛍️📸🎵💡✓🎙️✨⚡🇳🇬🇬🇧🇺🇸•▶❚©®™]/gu, '');

    // 1. Remove markdown media, links, code blocks
    text = text.replace(/!\[.*?\]\(.*?\)/g, '');
    text = text.replace(/https?:\/\/\S+/g, '');
    text = text.replace(/```[\s\S]*?```/g, ' ');
    text = text.replace(/`([^`]+)`/g, '$1');
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // 2. Strip headings markup (### Title -> Title.)
    text = text.replace(/^#{1,6}\s*(.+)$/gm, '$1.');

    // 3. Spoken Currency: Format Naira without reading symbol
    text = text.replace(/₦\s*([\d,]+(\.\d+)?)/g, (_, num) => formatSpokenNaira(num));
    text = text.replace(/₦/g, ' Naira ');
    text = text.replace(/\$\s*([\d,]+(\.\d+)?)/g, '$1 US dollars');
    text = text.replace(/£\s*([\d,]+(\.\d+)?)/g, '$1 pounds');
    text = text.replace(/€\s*([\d,]+(\.\d+)?)/g, '$1 euros');

    // 4. Numbered Lists: Connect number seamlessly to the item details with a light comma (Number 1, [details].)
    text = text.replace(/^(\d+)[\.\)]\s*(.+)$/gm, 'Number $1, $2.');
    text = text.replace(/\b(\d+)[\.\)]\s+([A-Za-z])/g, 'Number $1, $2');

    // 5. Bullet points: Connect smoothly
    text = text.replace(/^[\*\-•]\s+(.+)$/gm, '$1.');

    // 6. Expand Technical Specifications & Units for smooth spoken delivery
    text = text.replace(/\b(\d+)\s*kVA\b/gi, '$1 K V A');
    text = text.replace(/\b(\d+(\.\d+)?)\s*kW\b/gi, '$1 kilowatts');
    text = text.replace(/\b(\d+(\.\d+)?)\s*HP\b/gi, '$1 horsepower');
    text = text.replace(/\b(\d+)\s*RPM\b/gi, '$1 R P M');
    text = text.replace(/\b(\d+)\s*V\b/gi, '$1 volts');
    text = text.replace(/\b(\d+)\s*Hz\b/gi, '$1 hertz');
    text = text.replace(/\b3-Phase\b/gi, 'three phase');
    text = text.replace(/\b3-phase\b/gi, 'three phase');
    text = text.replace(/\b1-Phase\b/gi, 'single phase');
    text = text.replace(/\b(\d+)\s*Amps?\b/gi, '$1 amperes');
    text = text.replace(/\b(\d+)\s*dB\b/gi, '$1 decibels');
    text = text.replace(/\b(\d+)\s*kg\b/gi, '$1 kilograms');
    text = text.replace(/\b(\d+(\.\d+)?)\s*mm\b/gi, '$1 millimeters');
    text = text.replace(/\b(\d+(\.\d+)?)\s*cm\b/gi, '$1 centimeters');
    text = text.replace(/\b(\d+)\s*T\b/gi, '$1 tonnes');
    text = text.replace(/\bCFM\b/gi, 'C F M');
    text = text.replace(/\bPSI\b/gi, 'P S I');

    // 7. Industry Acronyms & Nigerian Procurement Bodies
    text = text.replace(/\bMTM\b/gi, 'M T M');
    text = text.replace(/\bCNC\b/gi, 'C N C');
    text = text.replace(/\bDRO\b/gi, 'D R O');
    text = text.replace(/\bPLC\b/gi, 'P L C');
    text = text.replace(/\bAVR\b/gi, 'A V R');
    text = text.replace(/\bAMF\b/gi, 'A M F');
    text = text.replace(/\bATS\b/gi, 'A T S');
    text = text.replace(/\bPID\b/gi, 'P I D');
    text = text.replace(/\bSCM\b/gi, 'S C M');
    text = text.replace(/\bKDT\b/gi, 'K D T');
    text = text.replace(/\bCOREN\b/gi, 'Core-en');
    text = text.replace(/\bNBTE\b/gi, 'N B T E');
    text = text.replace(/\bCAC\b/gi, 'C A C');
    text = text.replace(/\bCBN\b/gi, 'Central Bank of Nigeria');
    text = text.replace(/\bSON\b/gi, 'Standards Organisation of Nigeria');
    text = text.replace(/\bOEM\b/gi, 'O E M');
    text = text.replace(/\bRFQ\b/gi, 'R F Q');
    text = text.replace(/\be\.g\.\b/gi, 'for example,');
    text = text.replace(/\bi\.e\.\b/gi, 'that is,');
    text = text.replace(/\betc\.\b/gi, 'and so on.');
    text = text.replace(/\bvs\.?\b/gi, 'versus');
    text = text.replace(/\bw\/\b/gi, 'with');
    text = text.replace(/\bw\/o\b/gi, 'without');

    // 8. Replace contextual punctuation marks with natural spoken connectors
    text = text.replace(/\s*&\s*/g, ' and ');
    text = text.replace(/\s*\+\s*/g, ' plus ');
    text = text.replace(/\s*%\s*/g, ' percent ');
    text = text.replace(/\s*=\s*/g, ' equals ');
    text = text.replace(/\s*@\s*/g, ' at ');
    text = text.replace(/km\/h/gi, 'kilometers per hour');
    text = text.replace(/and\/or/gi, 'and or');
    text = text.replace(/\//g, ' or ');

    // 9. Completely strip quotes, brackets, parentheses, and formatting marks so TTS NEVER speaks punctuation names
    text = text.replace(/[*_~`#^|\\<>\[\]{}()""'“”‘’«»]/g, ' ');

    // 10. Replace colons, semicolons, and dashes with a soft comma for seamless breathing intonation
    text = text.replace(/[:;]/g, ', ');
    text = text.replace(/[-–—]+/g, ' ');

    // 11. Normalize multiple punctuation or spaces
    text = text.replace(/\.{2,}/g, '. ');
    text = text.replace(/,{2,}/g, ', ');
    text = text.replace(/,\s*\./g, '.');
    text = text.replace(/\.\s*,/g, '.');
    text = text.replace(/\s+/g, ' ').trim();

    // 12. Split into distinct natural item and sentence chunks
    // Splitting on full stops, question marks, and exclamation marks preserves clean sentence boundaries
    const rawChunks = text
      .split(/(?<=[.!?\n])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    return rawChunks;
  }

  /**
   * Find the most authentic Nigerian female voice available in the browser,
   * with graceful fallback to Commonwealth / British female voices tuned for Nigerian cadence.
   */
  public selectBestVoice(accent: string = 'ng-female'): SpeechSynthesisVoice | null {
    if (!('speechSynthesis' in window)) return null;
    const voices = this.getVoices();
    if (!voices || voices.length === 0) return null;

    if (accent === 'ng-female') {
      // 1. Direct Nigerian English voices (Windows Blessing, Android Google Nigerian, macOS Ada, etc.)
      const ngVoice = 
        voices.find(v => (v.lang === 'en-NG' || v.lang.replace('_', '-').toLowerCase() === 'en-ng') && (v.name.toLowerCase().includes('blessing') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('ngozi') || v.name.toLowerCase().includes('ada') || v.name.toLowerCase().includes('chioma'))) ||
        voices.find(v => v.lang === 'en-NG' || v.lang.replace('_', '-').toLowerCase() === 'en-ng') ||
        voices.find(v => v.name.toLowerCase().includes('nigeria') || v.name.toLowerCase().includes('nigerian'));
      
      if (ngVoice) return ngVoice;

      // 2. South African English female voice (warm, syllable-timed melodic African cadence)
      const zaVoice = voices.find(v => (v.lang === 'en-ZA' || v.lang.toLowerCase().includes('en-za')) && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('ayanda'))) ||
                      voices.find(v => v.lang === 'en-ZA' || v.lang.toLowerCase().includes('en-za'));
      if (zaVoice) return zaVoice;

      // 3. British / Commonwealth natural female voice (Hazel, Sonia, Serena, Google UK Female)
      const gbVoice = 
        voices.find(v => v.lang.toLowerCase().includes('en-gb') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('hazel') || v.name.toLowerCase().includes('sonia') || v.name.toLowerCase().includes('serena') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('tessa') || v.name.toLowerCase().includes('libby') || v.name.toLowerCase().includes('victoria'))) ||
        voices.find(v => v.lang.toLowerCase().includes('en-gb'));
      if (gbVoice) return gbVoice;
    } else if (accent === 'uk-female') {
      const gbVoice = voices.find(v => v.lang.toLowerCase().includes('en-gb') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('hazel') || v.name.toLowerCase().includes('tessa')));
      if (gbVoice) return gbVoice;
    } else if (accent === 'us-female') {
      const usVoice = voices.find(v => v.lang.toLowerCase().includes('en-us') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('natural')));
      if (usVoice) return usVoice;
    }

    // Default fallback to any English female or English voice
    return voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
           voices.find(v => v.lang.startsWith('en')) ||
           voices[0] || null;
  }

  public getActiveVoiceLabel(accent: string = 'ng-female'): string {
    const v = this.selectBestVoice(accent);
    if (!v) return 'Default Speech Engine';
    if (v.lang.toLowerCase().includes('en-ng') || v.name.toLowerCase().includes('nigeria')) {
      return `🇳🇬 ${v.name} (Native Nigerian English)`;
    }
    return `🇳🇬 Nigerian Female Tone (${v.name} calibrated)`;
  }

  /**
   * Speak the prepared transcript with perfectly calibrated, human-like pacing:
   * - 90ms natural breath pause between items (neither rushed nor dragging)
   * - Smooth conversational cadence
   */
  public speakTranscript(rawText: string, options: SpeechEngineOptions = {}): void {
    if (!('speechSynthesis' in window)) {
      options.onError?.('SpeechSynthesis is not supported in this browser.');
      return;
    }

    // Stop any existing speech immediately
    this.stop();

    const chunks = this.prepareTranscriptForSpeech(rawText);
    if (chunks.length === 0) {
      options.onEnd?.();
      return;
    }

    this.currentQueue = chunks;
    this.currentIndex = 0;
    this.isPlaying = true;
    this.isPaused = false;
    this.currentOptions = options;

    options.onStart?.();
    this.playNextChunk();
  }

  private playNextChunk(): void {
    if (!this.isPlaying || this.isPaused) return;

    if (this.currentIndex >= this.currentQueue.length) {
      this.isPlaying = false;
      this.currentOptions?.onEnd?.();
      return;
    }

    const chunkText = this.currentQueue[this.currentIndex];
    const total = this.currentQueue.length;
    this.currentOptions?.onSentenceChange?.(this.currentIndex, total, chunkText);

    const utterance = new SpeechSynthesisUtterance(chunkText);
    const accent = this.currentOptions?.voiceAccent || 'ng-female';
    const selectedVoice = this.selectBestVoice(accent);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = accent === 'ng-female' ? 'en-NG' : accent === 'uk-female' ? 'en-GB' : 'en-US';
    }

    // Paced at 0.98x - 1.0x with warm pitch (1.06) for authentic human customer service delivery
    utterance.rate = this.currentOptions?.voiceSpeed ?? (accent === 'ng-female' ? 0.98 : 1.0);
    utterance.pitch = this.currentOptions?.pitch ?? (accent === 'ng-female' ? 1.06 : 1.0);

    utterance.onend = () => {
      this.currentIndex++;
      if (this.currentIndex < this.currentQueue.length) {
        // Natural human breath pause (90ms) - neither too fast nor too slow
        const naturalPauseDuration = 90;
        this.pauseTimer = window.setTimeout(() => {
          this.playNextChunk();
        }, naturalPauseDuration);
      } else {
        this.isPlaying = false;
        this.currentOptions?.onEnd?.();
      }
    };

    utterance.onerror = (e) => {
      // Ignore user cancellation errors
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      console.warn('SpeechSynthesis error on chunk:', e);
      this.isPlaying = false;
      this.currentOptions?.onError?.(e);
    };

    this.activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause(): void {
    if ('speechSynthesis' in window && this.isPlaying) {
      if (this.pauseTimer) {
        clearTimeout(this.pauseTimer);
        this.pauseTimer = null;
      }
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  public resume(): void {
    if ('speechSynthesis' in window && this.isPlaying && this.isPaused) {
      this.isPaused = false;
      window.speechSynthesis.resume();
    }
  }

  public stop(): void {
    if (this.pauseTimer) {
      clearTimeout(this.pauseTimer);
      this.pauseTimer = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.currentQueue = [];
    this.activeUtterance = null;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }
}

export const humanizedSpeechEngine = new HumanizedSpeechEngine();
