import React, { useEffect, useRef, useState } from 'react';

interface BrandedLoadingScreenProps {
  onFinish: () => void;
  videoSrc?: string;
  collegeName?: string;
  symposiumName?: string;
}

export const BrandedLoadingScreen: React.FC<BrandedLoadingScreenProps> = ({
  onFinish,
  videoSrc = '/college_logo_reveal_video.mp4',
}) => {
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasFinishedRef = useRef(false);

  const handleComplete = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setFadeOut(true);
    setTimeout(() => {
      onFinish();
    }, 400);
  };

  useEffect(() => {
    // Safety fallback timer so loading never hangs indefinitely
    const safetyTimer = setTimeout(() => {
      handleComplete();
    }, 12000);

    return () => clearTimeout(safetyTimer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.defaultMuted = true;
      video.playbackRate = 1.0;
      video.play().catch(() => {
        // Fallback if browser autoplay is blocked
      });
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 w-screen h-screen flex items-center justify-center bg-white select-none transition-opacity duration-400 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#ffffff',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        onEnded={handleComplete}
        className="w-full h-full object-contain block bg-white"
        style={{
          backgroundColor: '#ffffff',
          width: '100vw',
          height: '100vh',
          objectFit: 'contain',
        }}
      />

      {/* Subtle Skip button for instantaneous access */}
      <button
        type="button"
        onClick={handleComplete}
        className="absolute top-5 right-5 z-20 px-3.5 py-1.5 rounded-full bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider uppercase transition-all cursor-pointer border border-white/20 active:scale-95"
      >
        Skip ✕
      </button>
    </div>
  );
};

export default BrandedLoadingScreen;
