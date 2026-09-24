import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Video, 
  Camera, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Gauge, 
  Activity, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw, 
  FileCheck, 
  Layers, 
  Tv, 
  Flame, 
  Wrench, 
  ArrowRight
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SAMPLE_EQUIPMENT_RUNTEST_VIDEOS } from '../data/videoData';
import { IndustrialVideoPlayer } from './IndustrialVideoPlayer';
import { useDraggableModal } from '../hooks/useDraggableModal';

interface VideoUploadStreamModalProps {
  onClose: () => void;
  onVideoPublished?: (videoData: any) => void;
}

export const VideoUploadStreamModal: React.FC<VideoUploadStreamModalProps> = ({
  onClose,
  onVideoPublished
}) => {
  const { showToast, products } = useMarketplace();
  const { modalStyle, dragHandleProps } = useDraggableModal();

  const [activeTab, setActiveTab] = useState<'upload' | 'record' | 'samples' | 'telemetry'>('upload');
  
  // Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [transcodeStep, setTranscodeStep] = useState<string>('');
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [videoTitle, setVideoTitle] = useState('SCM Nova Si400 Full Load 4,000 RPM Spindle Run-Test');
  const [selectedTargetProduct, setSelectedTargetProduct] = useState(products[0]?.id || '');

  // Live Camera Recording State
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Telemetry Metrics State
  const [spindleRpm, setSpindleRpm] = useState<number>(4000);
  const [loadAmps, setLoadAmps] = useState<number>(14.8);
  const [vibrationMms, setVibrationMms] = useState<number>(1.2);
  const [bearingTempC, setBearingTempC] = useState<number>(38.5);
  const [runoutMm, setRunoutMm] = useState<number>(0.02);
  const [inspectorName, setInspectorName] = useState('Engr. D. Adeleke (COREN #34912)');
  const [testLocation, setTestLocation] = useState('Ikeja Industrial Hub, Lagos');
  const [operationalLoad, setOperationalLoad] = useState('100% Full Load - 38mm Hardwood Plywood');

  // File drop handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startSimulatedUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startSimulatedUpload(e.dataTransfer.files[0]);
    }
  };

  const startSimulatedUpload = (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    setTranscodeStep('Uploading chunked video stream (16.4 MB/s)...');

    // Create local object URL for instant preview
    const objectUrl = URL.createObjectURL(file);
    setUploadedVideoUrl(objectUrl);
    setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      if (progress <= 60) {
        setUploadProgress(progress);
        setTranscodeStep(`Uploading raw video chunks... ${progress}%`);
      } else if (progress <= 85) {
        setUploadProgress(progress);
        setTranscodeStep('Transcoding to multi-bitrate H.264 (1080p, 720p, 480p)...');
      } else if (progress < 100) {
        setUploadProgress(progress);
        setTranscodeStep('Extracting audio frequency & acoustic sensor fingerprint...');
      } else {
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
        setTranscodeStep('Stream Ready & Verified!');
        showToast('✅ Video uploaded and transcoded to adaptive stream!');
      }
    }, 300);
  };

  // Camera Recording Handlers
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      setCameraError('Unable to access camera or microphone. Please check browser permissions.');
    }
  };

  const stopCamera = () => {
    if (videoPreviewRef.current && videoPreviewRef.current.srcObject) {
      const stream = videoPreviewRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoPreviewRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startRecording = () => {
    if (!videoPreviewRef.current || !videoPreviewRef.current.srcObject) return;
    const stream = videoPreviewRef.current.srcObject as MediaStream;
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setUploadedVideoUrl(url);
      setRecordedChunks(chunks);
      showToast('🎥 Machine run-test video recorded successfully!');
    };

    recorder.start(1000);
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopCamera();
    }
  };

  // Timer for recording
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Load sample preset
  const loadPresetVideo = (preset: typeof SAMPLE_EQUIPMENT_RUNTEST_VIDEOS[0]) => {
    setUploadedVideoUrl(preset.videoUrl);
    setVideoTitle(preset.machineTitle);
    setSpindleRpm(preset.spindleRpm);
    setLoadAmps(preset.loadAmps);
    setVibrationMms(preset.vibrationMms);
    setBearingTempC(preset.bearingTempC);
    setRunoutMm(preset.runoutMm);
    setInspectorName(preset.inspectorName);
    setTestLocation(preset.testLocation);
    setOperationalLoad(preset.operationalLoad);
    showToast(`Loaded sample test run for ${preset.machineTitle.slice(0, 30)}...`);
  };

  const handlePublishStream = () => {
    const streamData = {
      videoUrl: uploadedVideoUrl,
      title: videoTitle,
      productId: selectedTargetProduct,
      telemetry: {
        spindleRpm,
        loadAmps,
        vibrationMms,
        bearingTempC,
        runoutMm,
        inspectorName,
        testLocation,
        operationalLoad,
        inspectorBadge: 'Grade A - Certified'
      }
    };

    if (onVideoPublished) {
      onVideoPublished(streamData);
    }

    showToast(`🚀 Equipment Run-Test Stream published successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1055] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        style={modalStyle}
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 text-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Modal Header */}
        <div 
          {...dragHandleProps}
          className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 flex items-center justify-between cursor-move select-none"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-widest">
                  VIDEO STREAMING & UPLOAD HUB
                </span>
                <span className="text-xs text-emerald-400 font-bold">• 1080p Transcoder Active</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white truncate">
                Equipment Run-Test Video Studio
              </h2>
            </div>
          </div>

          <button
            id="close-video-upload-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700 hover:border-rose-600 transition-colors shadow-xs cursor-pointer shrink-0 ml-2"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-3 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File (MP4/WebM)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('record');
              if (!cameraActive) startCamera();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'record'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            <span>Live Camera Recorder</span>
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'samples'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sample Run-Test Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sensors & Inspector Telemetry</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 bg-slate-900/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ── LEFT: INPUT CONTROLS / UPLOAD / CAMERA (6 cols) ── */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* TAB 1: UPLOAD FILE */}
              {activeTab === 'upload' && (
                <div className="space-y-4 animate-fadeIn">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 sm:p-8 bg-slate-950/60 hover:bg-slate-950/80 transition flex flex-col items-center justify-center text-center cursor-pointer group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-black text-white mb-1">
                      Upload Machine Run-Test Video or Click to Browse
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mb-3">
                      Supports MP4, WebM, MOV, MKV up to 500MB. Auto-transcoded to adaptive 1080p HLS stream.
                    </p>
                    <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-700">
                      Select Video File
                    </span>
                  </div>

                  {/* Upload / Transcode Status */}
                  {(isUploading || uploadProgress > 0) && (
                    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300">{transcodeStep}</span>
                        <span className="font-mono text-blue-400 font-extrabold">{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${uploadProgress}%` }}
                          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: LIVE CAMERA RECORDER */}
              {activeTab === 'record' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700 flex items-center justify-center">
                    <video
                      ref={videoPreviewRef}
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Camera Offline Overlay */}
                    {!cameraActive && (
                      <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
                        <Camera className="w-10 h-10 text-slate-500 mb-2" />
                        <p className="text-xs text-slate-400 mb-3">Camera stream is inactive</p>
                        <button
                          onClick={startCamera}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Radio className="w-3.5 h-3.5" />
                          <span>Enable Factory Floor Camera</span>
                        </button>
                      </div>
                    )}

                    {/* Recording Status Pill */}
                    {isRecording && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
                        <span className="w-2.5 h-2.5 rounded-full bg-white" />
                        <span>REC: {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                      </div>
                    )}
                  </div>

                  {cameraError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{cameraError}</span>
                    </div>
                  )}

                  {/* Recorder Controls */}
                  <div className="flex flex-wrap gap-2">
                    {cameraActive && !isRecording && (
                      <button
                        onClick={startRecording}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white font-extrabold text-xs transition flex items-center gap-2 shadow-md border border-[#7A101A]/30 cursor-pointer"
                      >
                        <Radio className="w-4 h-4" />
                        <span>Start Recording Run-Test</span>
                      </button>
                    )}

                    {isRecording && (
                      <button
                        onClick={stopRecording}
                        className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <Pause className="w-4 h-4" />
                        <span>Stop & Save Recording</span>
                      </button>
                    )}

                    {cameraActive && (
                      <button
                        onClick={stopCamera}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                      >
                        Turn Off Camera
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SAMPLE RUN-TEST PRESETS */}
              {activeTab === 'samples' && (
                <div className="space-y-3 animate-fadeIn">
                  <p className="text-xs text-slate-400">
                    Select a pre-calibrated industrial machinery test run to demonstrate live video streaming with authentic telemetry:
                  </p>

                  <div className="space-y-2.5">
                    {SAMPLE_EQUIPMENT_RUNTEST_VIDEOS.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => loadPresetVideo(preset)}
                        className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-blue-500/80 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition" />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-white group-hover:text-blue-300 transition">
                              {preset.machineTitle}
                            </h5>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span>⏱ {preset.duration}</span>
                              <span>• ⚡ {preset.spindleRpm} RPM</span>
                              <span>• 🛡️ {preset.inspectorBadge}</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition">
                          Load Preset
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SENSOR & TELEMETRY EDITOR */}
              {activeTab === 'telemetry' && (
                <div className="space-y-3 animate-fadeIn text-xs">
                  <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-blue-400" />
                    <span>Industrial Sensor Parameters</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-400 block mb-1">Spindle Speed (RPM)</label>
                      <input
                        type="number"
                        value={spindleRpm}
                        onChange={e => setSpindleRpm(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Full Motor Load (Amps)</label>
                      <input
                        type="number"
                        value={loadAmps}
                        onChange={e => setLoadAmps(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Vibration RMS (mm/s)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={vibrationMms}
                        onChange={e => setVibrationMms(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Bearing Temp (°C)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={bearingTempC}
                        onChange={e => setBearingTempC(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Inspector / Certifying Engineer</label>
                      <input
                        type="text"
                        value={inspectorName}
                        onChange={e => setInspectorName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Testing Facility / Hub Location</label>
                      <input
                        type="text"
                        value={testLocation}
                        onChange={e => setTestLocation(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Title & Target Machine Selector */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Stream Title / Equipment Label</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={e => setVideoTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs font-semibold focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Attach to Listed Equipment</label>
                  <select
                    value={selectedTargetProduct}
                    onChange={e => setSelectedTargetProduct(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.brand} {p.model})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* ── RIGHT: LIVE STREAM PLAYER PREVIEW (6 cols) ── */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Real-Time Stream Preview</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>LIVE READY</span>
                </span>
              </div>

              {/* Stream Preview Player */}
              <IndustrialVideoPlayer
                key={uploadedVideoUrl}
                videoUrl={uploadedVideoUrl}
                title={videoTitle}
                subtitle={`${testLocation} • Certified Operational Load Test`}
                telemetry={{
                  spindleRpm,
                  loadAmps,
                  vibrationMms,
                  bearingTempC,
                  runoutMm,
                  inspectorName,
                  testLocation,
                  operationalLoad,
                  inspectorBadge: 'Grade A - Certified'
                }}
                streams={[
                  { quality: '1080p', label: '1080p 60fps (Source)', url: uploadedVideoUrl, bitrate: '6.5 Mbps' },
                  { quality: '720p', label: '720p HD (Adaptive)', url: uploadedVideoUrl, bitrate: '3.2 Mbps' }
                ]}
              />

              {/* Inspection Seal Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-blue-950/60 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-extrabold text-white block">MTM Verified Engineering Stream</span>
                    <span className="text-[11px] text-slate-300">Certified by {inspectorName.split('(')[0]}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED GRADE A
                </span>
              </div>

              {/* Publish Action Button */}
              <button
                id="publish-video-stream-btn"
                onClick={handlePublishStream}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-98"
              >
                <span>Publish Video Stream & Attach to Listing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-400" />
            <span>All uploaded videos undergo automatic audio vibration and optical telemetry indexing.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
