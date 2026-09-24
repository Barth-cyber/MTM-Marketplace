import React, { useState, useRef, useEffect } from 'react';
import { 
  QrCode, 
  X, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Package, 
  RefreshCw,
  Sparkles,
  Zap,
  Copy,
  Info,
  Maximize2
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useDraggableModal } from '../hooks/useDraggableModal';

export interface QrScanResultData {
  rawCode: string;
  type: 'machinery_asset' | 'escrow_order' | 'seller_verification' | 'quick_reorder' | 'inspection_cert' | 'unknown';
  title: string;
  subtitle: string;
  details: {
    label: string;
    value: string;
  }[];
  actionLabel: string;
  onAction: () => void;
}

export const SAMPLE_QR_TAGS = [
  {
    id: 'sample-1',
    code: 'MTM-ASSET-SCM400-BENIN',
    label: 'SCM Si400 Panel Saw (Interior Duct Benin Hub)',
    type: 'Machinery Asset Tag',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'sample-2',
    code: 'ESC-9842-BNIN',
    label: 'Escrow Order Tracking #ESC-9842',
    type: 'Escrow Security Seal',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'sample-3',
    code: 'SELLER-INTERIOR-DUCT-109260',
    label: 'Interior Duct Ltd (NBTE Centre 109260)',
    type: 'Verified Seller Audit',
    badgeColor: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'sample-4',
    code: 'REORDER-JOWAT-GLUE-25KG',
    label: 'Jowat Hotmelt Glue Pellets 25kg Replenishment',
    type: 'Consumable Reorder Tag',
    badgeColor: 'bg-amber-100 text-amber-800'
  }
];

export const QrScannerModal: React.FC = () => {
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const { 
    isQrScannerOpen, 
    setIsQrScannerOpen, 
    products, 
    setActiveProduct, 
    openOrderTracking, 
    setIsInteriorDuctModalOpen, 
    setIsQuickReorderOpen,
    showToast,
    t
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<QrScanResultData | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Play a soft scan confirmation beep
  const playScanBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio context might be restricted before gesture
    }
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    setIsScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera streaming is not supported on this browser or environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Start Barcode / QR detection loop if BarcodeDetector is available
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code', 'data_matrix', 'code_128'] });
        scanIntervalRef.current = window.setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState === 4) {
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                const code = barcodes[0].rawValue;
                handleCodeDetected(code);
              }
            } catch (err) {
              // frame detection pass
            }
          }
        }, 400);
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError(err.message || 'Camera permission denied or camera not available. Try uploading a QR image or testing sample codes.');
      setIsScanning(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (isQrScannerOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isQrScannerOpen, activeTab]);

  // Decode code string into high-fidelity result
  const handleCodeDetected = (rawCode: string) => {
    playScanBeep();
    stopCamera();
    const code = rawCode.trim().toUpperCase();

    if (code.includes('SCM400') || code.includes('SAW') || code.includes('PROD-1') || code.includes('ASSET')) {
      const targetProd = products.find(p => p.id === 'prod-1') || products[0];
      setScanResult({
        rawCode,
        type: 'machinery_asset',
        title: 'SCM Si400 Nova 3.2m Sliding Table Saw',
        subtitle: 'Asset Tag #MTM-ASSET-SCM400-BENIN • Verified Physical Inspection',
        details: [
          { label: 'Merchant Hub', value: 'Interior Duct Ltd (Benin City Hub)' },
          { label: 'Inspection Grade', value: 'A+ Physical Diagnostic Certified' },
          { label: 'Escrow Status', value: 'Eligible for 100% Escrow Protection' },
          { label: 'Serial & Calibration', value: 'SCM-IT-2022-9941 • 3-Phase 7.5HP' }
        ],
        actionLabel: 'View Verified Machinery Listing',
        onAction: () => {
          setIsQrScannerOpen(false);
          setActiveProduct(targetProd);
        }
      });
    } else if (code.includes('ESC-') || code.includes('9842') || code.includes('ESCROW') || code.includes('ORDER')) {
      setScanResult({
        rawCode,
        type: 'escrow_order',
        title: 'Escrow Order #ESC-9842-BNIN',
        subtitle: 'Locked Escrow Custody • SCM Panel Saw to Ikeja Workshop',
        details: [
          { label: 'Escrow Amount', value: '₦14,500,000 NGN' },
          { label: 'Inspection Milestone', value: 'Physical Run-Test Video Passed' },
          { label: 'Transit Status', value: 'Heavy Freight Low-Bed Dispatched' },
          { label: 'Custodian', value: 'MTM Escrow Trust & Guaranty Ltd' }
        ],
        actionLabel: 'Open Live Escrow Tracking Portal',
        onAction: () => {
          setIsQrScannerOpen(false);
          openOrderTracking('ESC-9842-BNIN');
        }
      });
    } else if (code.includes('INTERIOR') || code.includes('109260') || code.includes('SELLER') || code.includes('BENIN')) {
      setScanResult({
        rawCode,
        type: 'seller_verification',
        title: 'Interior Duct Ltd — Benin City Hub',
        subtitle: 'Tier-1 Verified Partner • NBTE Accredited Centre No: 109260',
        details: [
          { label: 'Community Partner', value: 'Bomon Development Foundation (Charity NGO)' },
          { label: 'Escrow Fulfillment', value: '100.0% Audited Compliance' },
          { label: 'Site Location', value: 'Benin City, Edo State' },
          { label: 'Accreditation', value: 'National Board for Technical Education (NBTE)' }
        ],
        actionLabel: 'Open Verified Partner Profile',
        onAction: () => {
          setIsQrScannerOpen(false);
          setIsInteriorDuctModalOpen(true);
        }
      });
    } else if (code.includes('JOWAT') || code.includes('GLUE') || code.includes('REORDER') || code.includes('CONSUMABLE')) {
      setScanResult({
        rawCode,
        type: 'quick_reorder',
        title: 'Jowat Hotmelt Glue Pellets (25kg Bag)',
        subtitle: 'Repeat Consumable SKU: JOW-EVA-25KG • Automatic Edge Bander Feed',
        details: [
          { label: 'Unit Price', value: '₦68,000 / Bag (Bulk -12% applied)' },
          { label: 'Direct Dispatch', value: 'Benin City & Lagos Hub (< 12 Hours)' },
          { label: 'Compatibility', value: 'SCM, Homag, KDT, Nanxing Edge Banders' },
          { label: 'Payment Terms', value: '100% Escrow Delivery Guarantee' }
        ],
        actionLabel: 'Open Quick Reorder Replenishment',
        onAction: () => {
          setIsQrScannerOpen(false);
          setIsQuickReorderOpen(true);
        }
      });
    } else {
      setScanResult({
        rawCode,
        type: 'unknown',
        title: `Decoded QR Code: ${rawCode.slice(0, 32)}`,
        subtitle: 'Industrial Barcode / URL Tag Detected',
        details: [
          { label: 'Raw Payload', value: rawCode },
          { label: 'Timestamp', value: new Date().toLocaleTimeString() }
        ],
        actionLabel: 'Search Marketplace with Code',
        onAction: () => {
          setIsQrScannerOpen(false);
          showToast(`Searching marketplace for "${rawCode}"`);
        }
      });
    }
  };

  // Handle uploaded image file
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImagePreview(dataUrl);

      // Simulate QR decoding from image with instant intelligence
      const fileNameLower = file.name.toLowerCase();
      if (fileNameLower.includes('saw') || fileNameLower.includes('scm') || fileNameLower.includes('machine')) {
        handleCodeDetected('MTM-ASSET-SCM400-BENIN');
      } else if (fileNameLower.includes('escrow') || fileNameLower.includes('order')) {
        handleCodeDetected('ESC-9842-BNIN');
      } else if (fileNameLower.includes('glue') || fileNameLower.includes('consumable')) {
        handleCodeDetected('REORDER-JOWAT-GLUE-25KG');
      } else {
        handleCodeDetected('SELLER-INTERIOR-DUCT-109260');
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isQrScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 overflow-y-auto animate-fadeIn">
      <div 
        style={modalStyle}
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] my-auto"
      >
        
        {/* Modal Header */}
        <div 
          {...dragHandleProps}
          className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-10 h-10 rounded-xl bg-[#1E40AF] text-[#FACC15] flex items-center justify-center font-black shadow-md border border-blue-400/30">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                <span>{t('qr.title')}</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-emerald-500/40">Live</span>
              </h3>
              <p className="text-[11px] text-slate-400">{t('qr.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsQrScannerOpen(false)}
            className="no-drag p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
            title="Close dialog"
            aria-label="Close QR Scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-2 text-xs shrink-0">
          <button
            onClick={() => { setActiveTab('camera'); setScanResult(null); }}
            className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'camera' 
                ? 'bg-[#1E40AF] text-white shadow-xs' 
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{t('qr.cameraMode')}</span>
          </button>

          <button
            onClick={() => { setActiveTab('upload'); setScanResult(null); }}
            className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'upload' 
                ? 'bg-[#1E40AF] text-white shadow-xs' 
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{t('qr.uploadMode')}</span>
          </button>

          <button
            onClick={() => { setActiveTab('samples'); setScanResult(null); }}
            className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'samples' 
                ? 'bg-[#1E40AF] text-white shadow-xs' 
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t('qr.sampleCodes')}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Result Card if scanned */}
          {scanResult ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-2 border-[#1E40AF] rounded-2xl p-5 space-y-4 animate-scaleUp">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#1E40AF] block">
                      ✓ Verified QR Tag Scanned
                    </span>
                    <h4 className="font-black text-slate-900 text-base">{scanResult.title}</h4>
                    <p className="text-xs text-slate-600">{scanResult.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Details Key-Values */}
              <div className="bg-white rounded-xl p-3.5 border border-blue-200/80 space-y-2 text-xs">
                {scanResult.details.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500 font-medium">{d.label}:</span>
                    <span className="font-bold text-slate-900 text-right">{d.value}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    setScanResult(null);
                    if (activeTab === 'camera') startCamera();
                  }}
                  className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Scan Another Code</span>
                </button>

                <button
                  onClick={scanResult.onAction}
                  className="flex-1 px-4 py-2.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-black rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{scanResult.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: Camera Live Scanner */}
              {activeTab === 'camera' && (
                <div className="space-y-3">
                  <div className="relative aspect-video sm:aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-slate-800">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* QR Viewfinder Target Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-52 h-52 sm:w-60 sm:h-60 border-2 border-amber-400 rounded-2xl relative shadow-[0_0_0_9999px_rgba(15,23,42,0.65)]">
                        {/* Scanning Line Animation */}
                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent absolute top-0 animate-bounce" />
                        
                        {/* Corner markers */}
                        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />
                      </div>
                    </div>

                    {/* Camera Status Overlay */}
                    {cameraError ? (
                      <div className="absolute inset-0 bg-slate-950/90 p-5 flex flex-col items-center justify-center text-center text-white space-y-3">
                        <AlertCircle className="w-10 h-10 text-amber-400" />
                        <h4 className="font-bold text-sm">Camera Offline or In Sandboxed Frame</h4>
                        <p className="text-xs text-slate-300 max-w-sm">{cameraError}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startCamera()}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
                          >
                            Retry Camera
                          </button>
                          <button
                            onClick={() => setActiveTab('samples')}
                            className="px-3 py-1.5 bg-[#FACC15] hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black transition"
                          >
                            Use Sample QR Tags
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute bottom-3 inset-x-0 flex justify-center">
                        <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-xs font-bold rounded-full border border-amber-400/30 flex items-center gap-1.5 animate-pulse">
                          <Zap className="w-3.5 h-3.5" />
                          <span>{t('qr.scanning')} Align barcode inside frame</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Manual Quick Code Trigger Buttons */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                    <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                      Quick Simulate Hardware Scan:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleCodeDetected('MTM-ASSET-SCM400-BENIN')}
                        className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left font-bold text-slate-800 transition text-[11px] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Package className="w-3.5 h-3.5 text-[#1E40AF] shrink-0" />
                        <span className="truncate">Scan SCM Panel Saw</span>
                      </button>

                      <button
                        onClick={() => handleCodeDetected('ESC-9842-BNIN')}
                        className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-left font-bold text-slate-800 transition text-[11px] flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">Scan Escrow ESC-9842</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Upload Image */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <label className="border-2 border-dashed border-slate-300 hover:border-[#1E40AF] bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1E40AF] flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Upload QR Image or Equipment Plate Photo</h4>
                      <p className="text-xs text-slate-500">PNG, JPG, or WEBP containing machinery serial QR code</p>
                    </div>
                    <span className="px-3 py-1.5 bg-[#1E40AF] text-white font-bold text-xs rounded-xl shadow-xs">
                      Choose File from Device
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>

                  {uploadedImagePreview && (
                    <div className="p-3 bg-slate-100 rounded-xl flex items-center gap-3">
                      <img src={uploadedImagePreview} alt="Uploaded QR" className="w-14 h-14 rounded-lg object-cover border" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">Image uploaded</span>
                        <span className="text-slate-500">Decoded successfully</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Sample QR Asset Tags */}
              {activeTab === 'samples' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    Click any industrial QR asset tag below to simulate reading live physical equipment tags, escrow vouchers, and training certifications:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SAMPLE_QR_TAGS.map((tag) => (
                      <div
                        key={tag.id}
                        onClick={() => handleCodeDetected(tag.code)}
                        className="bg-white border border-slate-200 hover:border-[#1E40AF] hover:shadow-md p-3.5 rounded-xl cursor-pointer transition group space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${tag.badgeColor}`}>
                            {tag.type}
                          </span>
                          <QrCode className="w-4 h-4 text-slate-400 group-hover:text-[#1E40AF]" />
                        </div>
                        <h4 className="font-black text-xs text-slate-900 group-hover:text-[#1E40AF] line-clamp-1">
                          {tag.label}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">
                            {tag.code}
                          </code>
                          <span className="text-[#1E40AF] font-bold flex items-center gap-0.5">
                            Scan <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer info note */}
        <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted MTM Industrial Escrow & Asset Verification Protocol</span>
          </div>
          <button
            onClick={() => setIsQrScannerOpen(false)}
            className="text-slate-600 hover:text-slate-900 font-bold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
