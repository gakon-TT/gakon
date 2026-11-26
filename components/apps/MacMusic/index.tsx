import { type FC, memo, useCallback, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import { useSessionActions } from "contexts/session";

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.9;
    filter: drop-shadow(0 0 16px rgba(0, 210, 255, 0.6));
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
    filter: drop-shadow(0 0 28px rgba(0, 210, 255, 0.95));
  }
`;

const waveAnim = keyframes`
  0%, 100% { height: 6px; }
  50% { height: 26px; }
`;

const Container = styled.div`
  background: #070d18;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  user-select: none;
  width: 100%;

  .music-iframe {
    background: #070d18;
    border: none;
    height: 100%;
    position: relative;
    width: 100%;
    z-index: 1;
  }

  .loading-overlay {
    align-items: center;
    background: radial-gradient(circle at 50% 40%, #0c1b33 0%, #070d18 75%);
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 0.4s ease-out;
    z-index: 2;

    &.hidden {
      opacity: 0;
      pointer-events: none;
    }

    .brand-logo {
      animation: ${pulse} 2.4s ease-in-out infinite;
      height: 100px;
      margin-bottom: 22px;
      object-fit: contain;
      width: 100px;
    }

    .brand-title {
      background: linear-gradient(135deg, #00f5d4 0%, #00a2ff 50%, #7928ca 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 2.5px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .brand-subtitle {
      color: rgba(255, 255, 255, 0.65);
      font-size: 13.5px;
      font-weight: 500;
      letter-spacing: 0.5px;
      margin-bottom: 22px;
    }

    .equalizer-bars {
      align-items: flex-end;
      display: flex;
      gap: 4px;
      height: 28px;

      span {
        animation: ${waveAnim} 0.6s ease-in-out infinite alternate;
        background: linear-gradient(to top, #00d2ff, #7928ca);
        border-radius: 2px;
        height: 6px;
        width: 3.5px;

        &:nth-child(1) { animation-delay: 0.1s; }
        &:nth-child(2) { animation-delay: 0.25s; }
        &:nth-child(3) { animation-delay: 0.4s; }
        &:nth-child(4) { animation-delay: 0.15s; }
        &:nth-child(5) { animation-delay: 0.35s; }
      }
    }
  }
`;

const MacMusic: FC<ComponentProcessProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setWindowStates } = useSessionActions();

  // Reset any old small cached window size to full desktop PC size
  useEffect(() => {
    if (typeof window === "undefined") return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetWidth = Math.min(1240, Math.max(1040, Math.round(vw * 0.85)));
    const targetHeight = Math.min(780, Math.max(620, Math.round(vh * 0.82)));
    const posX = Math.max(20, Math.round((vw - targetWidth) / 2));
    const posY = Math.max(34, Math.round((vh - targetHeight) / 2) - 15);

    setWindowStates((prev) => {
      const currentWidth = Number(prev?.MacMusic?.size?.width || 0);
      if (!currentWidth || currentWidth < 1000) {
        return {
          ...prev,
          MacMusic: {
            ...prev?.MacMusic,
            position: { x: posX, y: posY },
            size: { height: targetHeight, width: targetWidth },
          },
        };
      }
      return prev;
    });
  }, [setWindowStates]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <Container>
      <div className={`loading-overlay ${isLoading ? "" : "hidden"}`}>
        <img
          alt="Gakon Music"
          className="brand-logo"
          src="/System/GakonWeb/gakon-music-logo.png"
        />
        <div className="brand-title">GAKON MUSIC</div>
        <div className="brand-subtitle">
          Nền Tảng Nghe Nhạc Trực Tuyến Miễn Phí
        </div>
        <div className="equalizer-bars">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <iframe
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write; microphone; web-share"
        className="music-iframe"
        onLoad={handleIframeLoad}
        sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-storage-access-by-user-activation"
        src="https://music.gakon.dev/"
        title="GAKON MUSIC"
      />
    </Container>
  );
};

export default memo(MacMusic);
