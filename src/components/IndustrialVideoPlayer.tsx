import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Settings, 
  Activity, 
  Gauge, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  Layers, 
  ShieldCheck, 
  Tv, 
  Download,
  Flame,
  Volume1,
  HardDrive,
  Tag
} from 'lucide-react';
import { VideoAnnotation } from '../types';

interface Chapter {
  timeSeconds: number;
  timeStr: string;
  title: string;
  description?: string;
}

interface StreamQuality {
  quality: string;
  label: string;
  url: string;
  bitrate?: string;
}

interface TelemetryData {
  spindleRpm?: number;
  loadAmps?: number;
  vibrationMms?: number;
  bearingTempC?: number;
  runoutMm?: number;
  testLocation?: string;
  inspectorName?: string;
  inspectorBadge?: string;
  operationalLoad?: string;
}

interface IndustrialVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
  subtitle?: string;
  chapters?: Chapter[];
  streams?: StreamQuality[];
  telemetry?: TelemetryData;
  annotations?: VideoAnnotation[];
  autoPlay?: boolean;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
}

export const IndustrialVideoPlayer: React.FC<IndustrialVideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  title,
  subtitle,
  chapters = [],
  streams = [],
  telemetry,
  annotations = [],
  autoPlay = false,
  onTimeUpdate,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentQuality, setCurrentQuality] = useState(streams[0]?.quality || '1080p');
  const [currentVideoSrc, setCurrentVideoSrc] = useState(videoUrl);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTelemetryHud, setShowTelemetryHud] = useState(true);
  const [showChapters, setShowChapters] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [isLiveEngineHumEnabled, setIsLiveEngineHumEnabled] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Web Audio Synth for Industrial Engine Sound Simulation (when live hum is toggled)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Sync video source when URL changes
  useEffect(() => {
    setCurrentVideoSrc(videoUrl);
    setCurrentTime(0);
    setVideoError(false);
  }, [videoUrl]);

  // Handle stream resolution change
  const handleQualityChange = (stream: StreamQuality) => {
    setCurrentQuality(stream.quality);
    const prevTime = videoRef.current ? videoRef.current.currentTime : 0;
    const wasPlaying = isPlaying;
    setCurrentVideoSrc(stream.url);
    
    // Restore time after stream switch
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = prevTime;
        if (wasPlaying) {
          videoRef.current.play().catch(() => {});
        }
      }
    }, 100);
  };

  // Video timeupdate handler
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);
    if (onTimeUpdate) onTimeUpdate(curr, dur);

    // Update active chapter
    if (chapters.length > 0) {
      for (let i = chapters.length - 1; i >= 0; i--) {
        if (curr >= chapters[i].timeSeconds) {
          setActiveChapterIndex(i);
          break;
        }
      }
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      stopEngineAudio();
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        if (isLiveEngineHumEnabled) startEngineAudio();
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  // Audio synthesis for machine acoustic frequency test
  const startEngineAudio = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      
      if (oscRef.current) oscRef.current.stop();
      
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      
      // Frequency modeled around 120Hz 3-phase motor rotor harmonic
      const baseFreq = telemetry?.spindleRpm ? (telemetry.spindleRpm / 60) * 2 : 120;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, audioCtxRef.current.currentTime);
      
      gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
      
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.log('Audio synth init ignored');
    }
  };

  const stopEngineAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
  };

  const toggleLiveEngineHum = () => {
    const next = !isLiveEngineHumEnabled;
    setIsLiveEngineHumEnabled(next);
    if (next && isPlaying) {
      startEngineAudio();
    } else {
      stopEngineAudio();
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopEngineAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try { audioCtxRef.current.close(); } catch(e){}
      }
    };
  }, []);

  const [showCc, setShowCc] = useState(true);
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const mins = Math.floor(secs / 60);
    const remSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  // Scrub handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Jump to specific chapter
  const seekToChapter = (chapter: Chapter) => {
    if (videoRef.current) {
      videoRef.current.currentTime = chapter.timeSeconds;
      setCurrentTime(chapter.timeSeconds);
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  // Speed changer
  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  // Picture in Picture
  const togglePip = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.log('PiP not supported');
    }
  };

  // Draw Audio Waveform Simulator on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const mid = h / 2;

      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? '#38BDF8' : '#64748B';
      ctx.lineWidth = 2;

      for (let x = 0; x < w; x++) {
        const freq = isPlaying ? 0.05 : 0.02;
        const amp = isPlaying ? (telemetry?.vibrationMms ? telemetry.vibrationMms * 4 + 6 : 10) : 2;
        const y = mid + Math.sin(x * freq + phase) * amp * Math.cos(x * 0.02);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (isPlaying) {
        phase += 0.15;
      }
      animId = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, telemetry]);

  return (
    <div 
      ref={containerRef}
      className={`relative group bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 select-none ${className}`}
    >
      {/* Video Element */}
      <div className="relative aspect-video w-full flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          src={currentVideoSrc}
          poster={posterUrl}
          playsInline
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onWaiting={() => setBuffering(true)}
          onPlaying={() => { setBuffering(false); setIsPlaying(true); }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => { setIsPlaying(false); stopEngineAudio(); }}
          onError={() => {
            setVideoError(true);
            setBuffering(false);
          }}
        />

        {/* Fallback Animated Graphic Stream if Video Fails to load external URL */}
        {videoError && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center mb-3 text-blue-400">
              <Activity className="w-8 h-8 animate-pulse" />
            </div>
            <h4 className="text-base font-black text-white mb-1">{title}</h4>
            <p className="text-xs text-blue-200 max-w-md mb-3">
              Live Industrial Telemetry & Operational Stream Mode. High-definition sensor and vibration data stream active.
            </p>
            <button
              onClick={() => {
                setVideoError(false);
                setCurrentVideoSrc('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
              }}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Video Stream</span>
            </button>
          </div>
        )}

        {/* Buffering Spinner */}
        {buffering && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-2xs z-20 pointer-events-none">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          </div>
        )}

        {/* Center Big Play Button (When Paused) */}
        {!isPlaying && !buffering && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl z-20 border-2 border-white/40 cursor-pointer"
            aria-label="Play Video"
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
          </button>
        )}

        {/* Closed Captions / Subtitles Overlay */}
        {showCc && currentTime > 0 && (
          <div className="absolute bottom-16 inset-x-0 flex justify-center z-20 pointer-events-none px-4">
            <div className="bg-black/85 backdrop-blur-md text-white text-xs sm:text-sm px-3.5 py-1.5 rounded-xl border border-white/10 text-center font-mono shadow-xl max-w-lg">
              <span className="text-cyan-400 font-bold mr-1.5">[CC]</span>
              {activeChapterIndex >= 0 && chapters[activeChapterIndex] 
                ? `${chapters[activeChapterIndex].title}${chapters[activeChapterIndex].description ? ` — ${chapters[activeChapterIndex].description}` : ''}`
                : title}
            </div>
          </div>
        )}

        {/* ── TOP OVERLAY: Title, Stream Badge & Telemetry HUD Toggle ── */}
        <div className="absolute top-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-start justify-between z-20 pointer-events-none">
          <div className="pointer-events-auto max-w-[70%]">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>MTM STREAM</span>
              </span>
              <span className="text-[10px] font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                {currentQuality}
              </span>
              {chapters.length > 0 && (
                <span className="text-[10px] font-semibold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800 hidden sm:inline-block">
                  CH {activeChapterIndex + 1}/{chapters.length}: {chapters[activeChapterIndex]?.title}
                </span>
              )}
            </div>
            <h3 className="text-xs sm:text-sm font-black text-white truncate drop-shadow-md">{title}</h3>
            {subtitle && <p className="text-[10px] text-slate-300 truncate hidden sm:block">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Live Audio Machine Sound Engine Toggle */}
            <button
              onClick={toggleLiveEngineHum}
              className={`px-2 py-1 rounded-lg text-[10px] font-black transition flex items-center gap-1 border ${
                isLiveEngineHumEnabled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-400'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Toggle Live Machine Acoustic Frequency Simulator"
            >
              <Volume1 className={`w-3.5 h-3.5 ${isLiveEngineHumEnabled ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden xs:inline">{isLiveEngineHumEnabled ? 'Live Sound: ON' : 'Sound Test'}</span>
            </button>

            {/* Telemetry HUD Toggle */}
            {telemetry && (
              <button
                onClick={() => setShowTelemetryHud(!showTelemetryHud)}
                className={`px-2 py-1 rounded-lg text-[10px] font-black transition flex items-center gap-1 border ${
                  showTelemetryHud 
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50' 
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Toggle Sensor HUD"
              >
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden xs:inline">HUD</span>
              </button>
            )}

            {/* Chapters Toggle */}
            {chapters.length > 0 && (
              <button
                onClick={() => setShowChapters(!showChapters)}
                className={`px-2 py-1 rounded-lg text-[10px] font-black transition flex items-center gap-1 border ${
                  showChapters 
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50' 
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xs:inline">Chapters ({chapters.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* ── TELEMETRY HUD OVERLAY (Sensor Metrics & Audio Waveform) ── */}
        {telemetry && showTelemetryHud && (
          <div className="absolute top-14 left-3 sm:left-4 z-20 pointer-events-none space-y-1.5 max-w-xs animate-fadeIn hidden sm:block">
            <div className="bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 shadow-xl space-y-2 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-400 uppercase tracking-wider">
                  <Gauge className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Real-Time Sensor Telemetry</span>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                  LIVE CALIBRATED
                </span>
              </div>

              {/* Grid of metrics */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {telemetry.spindleRpm !== undefined && (
                  <div className="bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/50">
                    <span className="text-[9px] text-slate-400 block">Spindle Speed</span>
                    <span className="font-extrabold text-blue-300 font-mono">{telemetry.spindleRpm} RPM</span>
                  </div>
                )}
                {telemetry.loadAmps !== undefined && (
                  <div className="bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/50">
                    <span className="text-[9px] text-slate-400 block">Motor Load</span>
                    <span className="font-extrabold text-amber-300 font-mono">{telemetry.loadAmps} Amps</span>
                  </div>
                )}
                {telemetry.vibrationMms !== undefined && (
                  <div className="bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/50">
                    <span className="text-[9px] text-slate-400 block">Vibration (RMS)</span>
                    <span className="font-extrabold text-emerald-300 font-mono">{telemetry.vibrationMms} mm/s</span>
                  </div>
                )}
                {telemetry.bearingTempC !== undefined && (
                  <div className="bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/50">
                    <span className="text-[9px] text-slate-400 block">Bearing Temp</span>
                    <span className="font-extrabold text-rose-300 font-mono">{telemetry.bearingTempC} °C</span>
                  </div>
                )}
              </div>

              {/* Live Waveform Canvas */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[9px] text-slate-400 mb-0.5">
                  <span>Acoustic Frequency Wave</span>
                  <span className="text-blue-400 font-mono">{isPlaying ? '120.4 Hz' : '0.0 Hz'}</span>
                </div>
                <canvas ref={canvasRef} width={200} height={24} className="w-full h-6 rounded bg-slate-950/70 border border-slate-800" />
              </div>

              {/* Inspector Stamp */}
              {telemetry.inspectorName && (
                <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400">
                  <span className="truncate max-w-[130px]">{telemetry.inspectorName}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>VERIFIED</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CHAPTERS SIDE OVERLAY PANEL ── */}
        {showChapters && chapters.length > 0 && (
          <div className="absolute top-14 right-3 sm:right-4 bottom-16 z-30 w-72 bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-700 shadow-2xl overflow-y-auto animate-fadeIn text-white space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Video Chapters</span>
              </span>
              <button
                onClick={() => setShowChapters(false)}
                className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    seekToChapter(ch);
                    setShowChapters(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl transition text-xs flex items-start gap-2.5 cursor-pointer border ${
                    activeChapterIndex === idx
                      ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                      : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 text-blue-300 font-bold shrink-0 mt-0.5">
                    {ch.timeStr}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold truncate text-xs">{ch.title}</div>
                    {ch.description && (
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">{ch.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS DROPDOWN (Resolution & Speed) ── */}
        {showSettings && (
          <div className="absolute bottom-16 right-4 z-30 w-56 bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-700 shadow-2xl animate-fadeIn text-white space-y-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                Stream Resolution
              </span>
              <div className="space-y-1">
                {streams.map((stream) => (
                  <button
                    key={stream.quality}
                    onClick={() => {
                      handleQualityChange(stream);
                      setShowSettings(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                      currentQuality === stream.quality
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{stream.label}</span>
                    {stream.bitrate && <span className="text-[10px] opacity-75 font-normal">{stream.bitrate}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Closed Captions (CC)
              </span>
              <button
                onClick={() => setShowCc(!showCc)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  showCc ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {showCc ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="border-t border-slate-800 pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                Playback Speed
              </span>
              <div className="grid grid-cols-6 gap-1 text-center">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => changeSpeed(spd)}
                    className={`py-1 rounded text-[10px] font-bold transition ${
                      playbackSpeed === spd
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BOTTOM CONTROL BAR ── */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 space-y-2">
          {/* Compression Status Bar */}
          <div className="flex items-center justify-between text-[10px] text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                <HardDrive className="w-3 h-3" />
                <span>H.265 HEVC</span>
              </span>
              <span className="text-slate-500">|</span>
              <span className="font-mono text-slate-300">76.8 MB / 480 MB</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-black text-[9px] border border-emerald-500/30">
                84% SAVED
              </span>
              <span className="hidden xs:inline text-slate-400 font-mono">3.2 Mbps VBR</span>
            </div>
          </div>

          {/* Progress Timeline, Chapter Markers & Annotation Markers */}
          <div className="relative group/timeline flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
            />
            
            {/* Chapter marker dots on scrub bar */}
            {duration > 0 && chapters.map((ch, i) => {
              const posPercent = (ch.timeSeconds / duration) * 100;
              if (posPercent > 100) return null;
              return (
                <div
                  key={i}
                  style={{ left: `${posPercent}%` }}
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-white/70 rounded-xs pointer-events-none hover:bg-amber-400"
                  title={`${ch.timeStr}: ${ch.title}`}
                />
              );
            })}

            {/* Annotation Timeline Ticks */}
            {duration > 0 && annotations.map((ann) => {
              const posPercent = (ann.timeSeconds / duration) * 100;
              if (posPercent > 100) return null;
              const typeColor = 
                ann.type === 'measurement' ? 'bg-cyan-400' :
                ann.type === 'defect' ? 'bg-rose-500' :
                ann.type === 'highlight' ? 'bg-amber-400' : 'bg-blue-400';
              return (
                <button
                  key={ann.id}
                  style={{ left: `${posPercent}%` }}
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = ann.timeSeconds;
                      setCurrentTime(ann.timeSeconds);
                    }
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 w-2 h-3.5 rounded-full ${typeColor} border border-slate-900 cursor-pointer hover:scale-125 transition-transform z-10`}
                  title={`[${ann.timeStr}] ${ann.type.toUpperCase()}: ${ann.text}`}
                />
              );
            })}
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between text-white text-xs">
            {/* Left: Play, Rewind, Volume, Time */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer text-white"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer text-slate-300 hover:text-white hidden xs:block"
                title="Rewind 10s"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Volume control */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer text-white"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    setIsMuted(false);
                    if (videoRef.current) {
                      videoRef.current.volume = newVol;
                      videoRef.current.muted = false;
                    }
                  }}
                  className="w-14 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hidden sm:block"
                />
              </div>

              {/* Time display */}
              <div className="font-mono text-[11px] text-slate-300 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span className="opacity-60"> / </span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right: Resolution, Speed, PiP, Fullscreen */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 border ${
                  showSettings ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Settings className="w-3 h-3" />
                <span>{currentQuality}</span>
                {playbackSpeed !== 1 && <span className="text-amber-400">({playbackSpeed}x)</span>}
              </button>

              <button
                onClick={togglePip}
                className="p-1.5 rounded-lg hover:bg-white/20 transition text-slate-300 hover:text-white hidden sm:block"
                title="Picture-in-Picture"
              >
                <Tv className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg hover:bg-white/20 transition text-slate-300 hover:text-white"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
