import React, { useEffect, useRef, useState } from 'react';

interface BrandedLoadingScreenProps {
  onFinish: () => void;
  videoSrc?: string;
}

export const BrandedLoadingScreen: React.FC<BrandedLoadingScreenProps> = ({
  onFinish,
  videoSrc = '/loading-page-spiher.mp4',
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
    }, 300);
  };

  useEffect(() => {
    // Generous fallback safety (20s) so full 8+ second video is NEVER cut off prematurely
    const safetyTimer = setTimeout(() => {
      handleComplete();
    }, 20000);

    return () => clearTimeout(safetyTimer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.defaultMuted = true;
      video.playbackRate = 1.0;
      video
        .play()
        .catch(() => {
          // Browser autoplay fallback
        });
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 w-screen h-screen flex items-center justify-center bg-white select-none transition-opacity duration-300 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#ffffff',
        margin: 0,
        padding: 0,
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
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
        className="w-full h-full bg-white block"
        style={{
          backgroundColor: '#ffffff',
          width: '100vw',
          height: '100vh',
          objectFit: 'contain',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          borderRadius: '0px',
          margin: 0,
          padding: 0,
          WebkitTapHighlightColor: 'transparent',
        }}
      />
    </div>
  );
};

export default BrandedLoadingScreen;
