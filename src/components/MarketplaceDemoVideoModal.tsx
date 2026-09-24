import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  ShieldCheck, 
  CheckCircle2, 
  Wrench, 
  Truck, 
  FileText, 
  DollarSign, 
  Clock, 
  Layers, 
  Sparkles, 
  ArrowRight,
  Tv,
  Share2,
  FileDown,
  Info,
  MessageSquare,
  ListVideo,
  Tag,
  Cpu,
  ThumbsUp,
  Send,
  Plus,
  HardDrive,
  Bookmark,
  Pause,
  RotateCcw,
  SkipForward,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { DEMO_VIDEOS } from '../data/videoData';
import { IndustrialVideoPlayer } from './IndustrialVideoPlayer';
import { useDraggableModal } from '../hooks/useDraggableModal';

interface MarketplaceDemoVideoModalProps {
  initialVideoId?: string;
  onClose: () => void;
}

export const MarketplaceDemoVideoModal: React.FC<MarketplaceDemoVideoModalProps> = ({
  initialVideoId = 'mtm-how-it-works-master',
  onClose
}) => {
  const { 
    showToast, 
    setIsSellModalOpen,
    setActiveView,
    setSelectedCategory,
    setFilterState,
    openPurchaseOrderModal,
    videoComments,
    addVideoComment,
    likeVideoComment,
    videoAnnotations,
    addVideoAnnotation,
    videoPlaylists,
    activePlaylist,
    setActivePlaylist,
    videoWatchlist,
    toggleWatchlistVideo,
    popupSecondsLeft,
    isPopupTimerPaused,
    togglePopupTimerPause,
    skipToNextVideo,
    currentVideoIndex,
    activeDemoVideoId,
    setActiveDemoVideoId
  } = useMarketplace();

  const { modalStyle, dragHandleProps } = useDraggableModal();

  const [selectedVideoId, setSelectedVideoId] = useState(activeDemoVideoId || initialVideoId);

  // Sync selected video if activeDemoVideoId changes from context rotation
  useEffect(() => {
    if (activeDemoVideoId) {
      setSelectedVideoId(activeDemoVideoId);
    }
  }, [activeDemoVideoId]);

  const activeVideo = DEMO_VIDEOS.find(v => v.id === selectedVideoId) || DEMO_VIDEOS[0];

  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'playlists' | 'ai-summary' | 'comments' | 'annotations' | 'compression'>('ai-summary');
  const [newCommentText, setNewCommentText] = useState('');
  const [newAnnText, setNewAnnText] = useState('');
  const [newAnnTime, setNewAnnTime] = useState('00:30');
  const [newAnnType, setNewAnnType] = useState<'note' | 'defect' | 'highlight' | 'measurement'>('measurement');

  const handleShareDemo = () => {
    navigator.clipboard.writeText(`${window.location.origin}?demo=${activeVideo.id}`);
    showToast("🔗 Demo video link copied to clipboard!");
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addVideoComment(activeVideo.id, newCommentText.trim());
    setNewCommentText('');
  };

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnText.trim()) return;
    const [mins, secs] = newAnnTime.split(':').map(Number);
    const timeSecs = (isNaN(mins) ? 0 : mins * 60) + (isNaN(secs) ? 0 : secs);
    addVideoAnnotation(activeVideo.id, timeSecs, newAnnTime, newAnnText.trim(), newAnnType);
    setNewAnnText('');
  };

  const currentVideoComments = videoComments.filter(c => c.videoId === activeVideo.id);
  const currentVideoAnnotations = videoAnnotations.filter(a => a.videoId === activeVideo.id);

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-2 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        style={modalStyle}
        className={`relative w-full transition-all duration-200 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
          isMaximized ? 'max-w-[96vw] h-[95vh]' : 'max-w-5xl max-h-[92vh]'
        }`}
      >
        {/* Top 30-Second Rotative Timer Status Bar (Light Color Theme) */}
        <div 
          {...dragHandleProps}
          className="bg-gradient-to-r from-orange-50 via-sky-50 to-orange-50 border-b border-orange-200/80 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-4 text-xs select-none cursor-move overflow-x-auto scrollbar-none whitespace-nowrap"
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-600 text-white uppercase tracking-wider shadow-2xs">
              Auto-Play Video Tour
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] sm:text-xs">
              <span>Video {currentVideoIndex + 1} of {DEMO_VIDEOS.length}:</span>
              <span className="text-orange-700 font-extrabold truncate max-w-[180px] sm:max-w-[260px]">
                {activeVideo.title.split(':')[0]}
              </span>
            </div>

            {/* Countdown duration progress bar */}
            <div className="flex items-center gap-2 pl-1">
              <div className="w-20 sm:w-32 bg-slate-200/80 h-2 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 rounded-full ${
                    isPopupTimerPaused 
                      ? 'bg-emerald-500' 
                      : 'bg-gradient-to-r from-orange-500 to-sky-500'
                  }`}
                  style={{ width: `${isPopupTimerPaused ? 100 : Math.max(0, (popupSecondsLeft / 30) * 100)}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-black text-slate-700 min-w-[58px]">
                {isPopupTimerPaused ? (
                  <span className="text-emerald-700 font-bold">Paused</span>
                ) : (
                  <span>{popupSecondsLeft}s left</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Pause / Keep Open Toggle */}
            <button
              onClick={togglePopupTimerPause}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                isPopupTimerPaused 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'
              }`}
              title={isPopupTimerPaused ? "Resume 30-second auto-close countdown" : "Keep video open permanently without 30s auto-close"}
            >
              {isPopupTimerPaused ? (
                <>
                  <Play className="w-3 h-3 text-emerald-700 fill-current" />
                  <span>Resume Auto-Tour</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-slate-600" />
                  <span>Keep Open</span>
                </>
              )}
            </button>

            {/* Next Rotated Video Button */}
            <button
              onClick={() => {
                skipToNextVideo();
                showToast("⏩ Advanced to next video tour.");
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white transition flex items-center gap-1 shadow-2xs cursor-pointer"
              title="Skip immediately to next video in 2-min interval"
            >
              <span>Next Video</span>
              <SkipForward className="w-3 h-3" />
            </button>

            {/* Expand / Fullscreen Video Window Button */}
            <button
              onClick={() => {
                setIsMaximized(!isMaximized);
                showToast(isMaximized ? "Restored standard video window size." : "Expanded video window for full theater experience.");
              }}
              className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition flex items-center gap-1 cursor-pointer"
              title={isMaximized ? "Restore Window Size" : "Expand Video Window"}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isMaximized ? "Standard" : "Expand"}</span>
            </button>
            <div className="w-[1px] h-6 bg-slate-300 mx-1"></div>
            <button
              id="close-demo-video-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 border border-slate-300 hover:border-rose-600 transition-colors shadow-xs cursor-pointer shrink-0"
              title="Close dialog"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        

        {/* Video Switcher Bar (Tabs) */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {DEMO_VIDEOS.map((vid) => (
            <button
              key={vid.id}
              onClick={() => {
                setSelectedVideoId(vid.id);
                setActiveDemoVideoId(vid.id);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer border ${
                selectedVideoId === vid.id
                  ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-3xs'
              }`}
            >
              <Play className={`w-3 h-3 ${selectedVideoId === vid.id ? 'fill-white' : 'text-slate-500'}`} />
              <span className="truncate">{vid.title.split(':')[0]}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                selectedVideoId === vid.id ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {vid.duration}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Body: Main Video Theater + Interactive Side Panel */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 bg-slate-50/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ── LEFT: VIDEO PLAYER THEATER (8 cols) ── */}
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-black">
                <IndustrialVideoPlayer
                  key={activeVideo.id}
                  videoUrl={activeVideo.videoUrl}
                  posterUrl={activeVideo.posterUrl}
                  title={activeVideo.title}
                  subtitle={activeVideo.subtitle}
                  chapters={activeVideo.chapters}
                  streams={activeVideo.resolutionStreams}
                  annotations={currentVideoAnnotations}
                  autoPlay={false}
                />
              </div>

              {/* Video Details & Summary (Light Color Scheme) */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200 uppercase">
                        {activeVideo.badge}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">• {activeVideo.category}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                      {activeVideo.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWatchlistVideo(activeVideo.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                        videoWatchlist.includes(activeVideo.id)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${videoWatchlist.includes(activeVideo.id) ? 'fill-current text-emerald-600' : ''}`} />
                      <span>{videoWatchlist.includes(activeVideo.id) ? 'Watchlisted' : 'Watchlist'}</span>
                    </button>
                    <button
                      onClick={handleShareDemo}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeVideo.description}
                </p>

                {/* Key Takeaways */}
                <div className="pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>Key Process Guarantees & Takeaways</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeVideo.keyTakeaways.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-start gap-2 text-xs text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: TABS & INTERACTIVE SIDE PANEL (4 cols) ── */}
            <div className="lg:col-span-4 space-y-4 flex flex-col">
              {/* Tab Selector (Light Theme) */}
              <div className="grid grid-cols-6 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600 text-center">
                <button
                  onClick={() => setActiveTab('chapters')}
                  className={`py-2 rounded-lg transition cursor-pointer flex flex-col items-center gap-1 ${
                    activeTab === 'chapters' ? 'bg-orange-600 text-white shadow-2xs' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                  title="Chapters"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chapters</span>
                </button>
                <button
                  onClick={() => setActiveTab('playlists')}
                  className={`py-2 rounded-lg transition cursor-pointer flex flex-col items-center gap-1 ${
                    activeTab === 'playlists' ? 'bg-orange-600 text-white shadow-2xs' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                  title="Playlists"
                >
                  <ListVideo className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Playlists</span>
                </button>
                <button
                  onClick={() => setActiveTab('ai-summary')}
                  className={`py-2 rounded-lg transition cursor-pointer flex flex-col items-center gap-1 ${
                    activeTab === 'ai-summary' ? 'bg-purple-600 text-white shadow-2xs' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                  title="AI Summary"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">AI Summary</span>
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`py-2 rounded-lg transition cursor-pointer flex flex-col items-center gap-1 relative ${
                    activeTab === 'comments' ? 'bg-orange-600 text-white shadow-2xs' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                  title="Comments"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chat</span>
                  {currentVideoComments.length > 0 && (
                    <span className="absolute top-1 right-1 px-1 bg-amber-500 text-white text-[8px] font-extrabold rounded-full">
                      {currentVideoComments.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('annotations')}
                  className={`py-2 rounded-lg transition cursor-pointer flex flex-col items-center gap-1 ${
                    activeTab === 'annotations' ? 'bg-orange-600 text-white shadow-2xs' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                  title="Annotations"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Notes</span>
                </button>
                <button
                  onClick={() => setActiveTab('compression')}
                  className={`py-2 rounded-lg transition cursor-pointer flex flex-col items-center gap-1 ${
                    activeTab === 'compression' ? 'bg-orange-600 text-white shadow-2xs' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                  title="Compression"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Stats</span>
                </button>
              </div>

              {/* Tab Content: AI Summary (Light Theme) */}
              {activeTab === 'ai-summary' && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex-1 flex flex-col max-h-[350px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Gemini AI Video Insights</span>
                    </span>
                    <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-black">
                      99.4% VERIFIED
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto pr-1 flex-1 text-xs">
                    <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200 space-y-2">
                      <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Executive Summary & Risk Assessment</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        This video demonstrates core industrial verification parameters. AI analysis confirms 100% compliance with Nigerian COREN machinery safety regulations, secure escrow transfer protocols, and certified electrical phase stability.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Key Highlights & Takeaways:</span>
                      {activeVideo.keyTakeaways.map((takeaway, i) => (
                        <div key={i} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('✨ AI video summary re-analyzed successfully!')}
                    className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Regenerate AI Analysis</span>
                  </button>
                </div>
              )}

              {/* Tab Content: Chapters */}
              {activeTab === 'chapters' && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex-1">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-orange-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-orange-600" />
                      <span>Timeline Chapters</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {activeVideo.chapters.length} Segments
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {activeVideo.chapters.map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50/40 border border-slate-200 transition space-y-1 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-orange-700 transition">
                            {ch.title}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white text-orange-700 font-bold border border-slate-200 shrink-0">
                            {ch.timeStr}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {ch.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content: Playlists */}
              {activeTab === 'playlists' && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex-1">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                      <ListVideo className="w-3.5 h-3.5 text-purple-600" />
                      <span>Curated Playlists</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {videoPlaylists.length} Series
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {videoPlaylists.map((pl) => (
                      <div
                        key={pl.id}
                        onClick={() => setActivePlaylist(pl)}
                        className={`p-3 rounded-xl border transition cursor-pointer space-y-1.5 ${
                          activePlaylist?.id === pl.id
                            ? 'bg-purple-50 border-purple-300 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-900">
                            {pl.title}
                          </span>
                          <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-black">
                            {pl.durationTotal}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {pl.description}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {pl.videoIds.length} videos included
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVideoId(pl.videoIds[0]);
                              setActiveDemoVideoId(pl.videoIds[0]);
                              setActivePlaylist(pl);
                              showToast(`▶ Loaded playlist: ${pl.title}`);
                            }}
                            className="text-[10px] text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Play Series</span>
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content: Comments */}
              {activeTab === 'comments' && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex-1 flex flex-col max-h-[350px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                      <span>Buyer & Engineer Q&A</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {currentVideoComments.length} Comments
                    </span>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                    {currentVideoComments.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        No comments yet on this video. Be the first industrial buyer to ask a question!
                      </div>
                    ) : (
                      currentVideoComments.map((comm) => (
                        <div key={comm.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={comm.avatar} alt={comm.authorName} className="w-5 h-5 rounded-full object-cover" />
                              <div>
                                <div className="text-xs font-bold text-slate-900">{comm.authorName}</div>
                                <div className="text-[9px] text-slate-500">{comm.authorRole}</div>
                              </div>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">{comm.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-snug pl-7">
                            {comm.text}
                          </p>
                          <div className="flex items-center justify-end gap-2 pl-7 pt-1">
                            <button
                              onClick={() => likeVideoComment(comm.id)}
                              className="text-[10px] text-slate-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer transition"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{comm.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Comment Input Form */}
                  <form onSubmit={handlePostComment} className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ask an engineering question..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition cursor-pointer shadow-2xs"
                      title="Post Comment"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* Tab Content: Annotations */}
              {activeTab === 'annotations' && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex-1 flex flex-col max-h-[350px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Inspection Annotations</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {currentVideoAnnotations.length} Markers
                    </span>
                  </div>

                  <div className="space-y-2 overflow-y-auto pr-1 flex-1">
                    {currentVideoAnnotations.map((ann) => (
                      <div key={ann.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black">
                            {ann.timeStr}
                          </span>
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold uppercase">
                            {ann.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 leading-snug">
                          {ann.text}
                        </p>
                        <div className="text-[9px] text-slate-500 flex items-center justify-between pt-1">
                          <span>{ann.author}</span>
                          <span>{ann.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Annotation Form */}
                  <form onSubmit={handleAddAnnotation} className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Time (mm:ss)"
                        value={newAnnTime}
                        onChange={(e) => setNewAnnTime(e.target.value)}
                        className="w-24 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-mono"
                      />
                      <select
                        value={newAnnType}
                        onChange={(e) => setNewAnnType(e.target.value as any)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900"
                      >
                        <option value="measurement">Measurement</option>
                        <option value="defect">Defect Check</option>
                        <option value="highlight">Highlight</option>
                        <option value="note">Note</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Annotation note..."
                        value={newAnnText}
                        onChange={(e) => setNewAnnText(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab Content: Compression Stats */}
              {activeTab === 'compression' && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex-1">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-sky-600" />
                      <span>Video Compression & Transcoding</span>
                    </span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black">
                      84% SAVINGS
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between text-slate-600">
                        <span>Original Raw File Size:</span>
                        <span className="font-mono font-bold text-slate-900">480.0 MB (ProRes 422)</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Optimized Stream Size:</span>
                        <span className="font-mono font-bold text-emerald-700">76.8 MB (H.265 / HEVC)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-sky-500 h-full w-[84%]" />
                      </div>
                      <div className="text-[10px] text-slate-500 text-right">84% bandwidth reduction for low-latency West African mobile networks</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-500">Adaptive Bitrate</div>
                        <div className="text-xs font-bold text-slate-900 font-mono">1.4 - 6.2 Mbps VBR</div>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-500">Hardware Acceleration</div>
                        <div className="text-xs font-bold text-emerald-700 font-mono">NVENC HEVC 60fps</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instant Next Steps Action Box (Light Theme) */}
              <div className="bg-gradient-to-br from-orange-50 via-sky-50 to-white p-4 rounded-2xl border border-orange-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-600 text-white shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Ready to Get Started?</h4>
                    <p className="text-[10px] text-slate-600">Explore verified machinery or submit your requisition</p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      setSelectedCategory('Machines');
                      setFilterState(prev => ({ ...prev, category: 'Machines', subcategory: 'All' }));
                      setActiveView('machines');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>Browse Verified Machines</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      openPurchaseOrderModal();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>Generate Corporate Purchase Order</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      setIsSellModalOpen(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <span>List Equipment for Sale</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};
