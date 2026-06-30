import { useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Maximize } from 'lucide-react';

export default function VideoDialog({ project, onClose }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Autoplay
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    // ESC to close
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const isYouTube = project.video && (
    project.video.includes('youtube.com') || project.video.includes('youtu.be')
  );

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 video-modal-overlay"
    >
      <div className="video-modal-content relative w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-white text-lg">{project.title}</h3>
            <p className="text-slate-400 text-sm">{project.badge} Demo</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video container */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
          {!project.video ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
              <div className="w-20 h-20 rounded-full bg-surface-200 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-slate-600" stroke="currentColor">
                  <path d="M15 10l4.553-2.369A1 1 0 0121 8.535v6.93a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-slate-400 font-medium">No demo video uploaded yet</p>
                <p className="text-slate-600 text-sm mt-1">Upload a video in the Creator Dashboard</p>
              </div>
            </div>
          ) : isYouTube ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(project.video)}?autoplay=1&mute=0&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={project.title}
            />
          ) : (
            <video
              ref={videoRef}
              src={project.video}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
            />
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {project.tech.map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <div className="text-xs text-slate-600 font-mono">
            Press ESC to close
          </div>
        </div>
      </div>
    </div>
  );
}
