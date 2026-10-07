import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  100% {
    opacity: 1;
    backdrop-filter: blur(12px) brightness(0.85);
  }
`;

const pulseHalo = keyframes`
  0%, 100% {
    box-shadow: 0 0 25px rgba(0, 245, 212, 0.4), 0 0 50px rgba(168, 85, 247, 0.25);
  }
  50% {
    box-shadow: 0 0 35px rgba(0, 245, 212, 0.65), 0 0 65px rgba(244, 114, 182, 0.4);
  }
`;

const soundWaveAnim = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 26px; }
`;

const floatSlow = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

export const StyledLockScreen = styled.div<{ $isUnlocking?: boolean }>`
  align-items: center;
  animation: ${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  backdrop-filter: blur(12px) brightness(0.85);
  -webkit-backdrop-filter: blur(12px) brightness(0.85);
  background: rgba(0, 0, 0, 0.28);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif;
  height: 100vh;
  justify-content: space-between;
  left: 0;
  overflow: hidden;
  padding: 24px 32px 32px;
  position: fixed;
  top: 0;
  user-select: none;
  width: 100vw;
  z-index: 999999;
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: ${({ $isUnlocking }) => ($isUnlocking ? "none" : "auto")};

  ${({ $isUnlocking }) =>
    $isUnlocking &&
    `
    opacity: 0;
    transform: scale(1.06);
    filter: blur(24px);
  `}

  /* 1. Top Bar Status Icons (Top Right) */
  .lock-top-bar {
    align-items: center;
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    position: absolute;
    right: 28px;
    top: 20px;
    font-size: 13px;
    font-weight: 500;
    opacity: 0.95;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
    z-index: 10;

    .status-group {
      align-items: center;
      display: flex;
      gap: 6px;

      svg {
        fill: currentColor;
        height: 16px;
        width: 16px;
        filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8));
      }
    }
  }

  /* 2. Top-Left Quote & Brush Clock Widget */
  .top-left-widget {
    display: flex;
    flex-direction: column;
    left: 70px;
    position: absolute;
    top: 28px;
    z-index: 10;

    @media (max-width: 768px) {
      left: 18px;
      top: 64px;
    }

    .brush-clock {
      color: #ffffff;
      font-family: "Caveat", "Outfit", cursive, sans-serif;
      font-size: 58px;
      font-weight: 700;
      letter-spacing: 1px;
      line-height: 1;
      text-shadow: 0 0 16px rgba(255, 255, 255, 0.6), 0 2px 10px rgba(0, 0, 0, 0.8);

      @media (max-width: 768px) {
        font-size: 44px;
      }
    }

    .quote-text {
      color: rgba(255, 255, 255, 0.95);
      font-size: 12.5px;
      font-weight: 600;
      letter-spacing: 0.3px;
      margin-top: 6px;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.9);

      @media (max-width: 768px) {
        font-size: 11px;
        margin-top: 3px;
      }
    }

    .quote-author {
      color: rgba(255, 255, 255, 0.75);
      font-size: 11.5px;
      font-weight: 500;
      margin-top: 4px;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);

      @media (max-width: 768px) {
        font-size: 10px;
        margin-top: 2px;
      }
    }
  }

  /* 3. Top-Center Cursive Day Calligraphy */
  .top-center-banner {
    color: rgba(255, 255, 255, 0.95);
    font-family: "Great Vibes", "Alex Brush", "Dancing Script", cursive;
    font-size: 72px;
    left: 50%;
    letter-spacing: 2px;
    pointer-events: none;
    position: absolute;
    top: 18px;
    transform: translateX(-50%);
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 255, 255, 0.4);
    z-index: 10;
    white-space: nowrap;

    @media (max-width: 768px) {
      display: block;
      font-size: 42px;
      top: 14px;
      text-shadow: 0 2px 14px rgba(0, 0, 0, 0.9), 0 0 24px rgba(255, 255, 255, 0.6);
    }
  }

  /* 4. Left Sidebar Quick Actions Column */
  .left-actions-column {
    display: flex;
    flex-direction: column;
    gap: 14px;
    left: 20px;
    position: absolute;
    top: 36px;
    z-index: 12;

    @media (max-width: 768px) {
      display: none;
    }

    .action-icon-btn {
      align-items: center;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 50%;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
      color: #ffffff;
      cursor: pointer;
      display: flex;
      height: 38px;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      width: 38px;

      svg {
        fill: currentColor;
        height: 18px;
        width: 18px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.28);
        border-color: rgba(255, 255, 255, 0.6);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        transform: scale(1.12);
      }
    }
  }

  /* 5. Center User Profile Card */
  .user-section {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: auto 0;
    position: relative;
    z-index: 15;

    @media (max-width: 768px) {
      margin: auto 0;
      transform: translateY(-30px);
    }

    .cursive-day-title {
      color: rgba(255, 255, 255, 0.96);
      font-family: "Great Vibes", "Alex Brush", "Dancing Script", cursive;
      font-size: 68px;
      letter-spacing: 2px;
      line-height: 1;
      margin-bottom: 16px;
      pointer-events: none;
      text-shadow: 0 4px 24px rgba(0, 0, 0, 0.8), 0 0 32px rgba(255, 255, 255, 0.5);
      white-space: nowrap;

      @media (max-width: 768px) {
        font-size: 48px;
        margin-bottom: 12px;
        text-shadow: 0 2px 16px rgba(0, 0, 0, 0.9), 0 0 24px rgba(255, 255, 255, 0.6);
      }
    }

    .avatar-wrapper {
      align-items: center;
      animation: ${pulseHalo} 4s ease-in-out infinite;
      aspect-ratio: 1 / 1;
      background: linear-gradient(
        135deg,
        #00f5d4 0%,
        #38bdf8 30%,
        #a855f7 65%,
        #f472b6 100%
      );
      border-radius: 50%;
      box-sizing: border-box;
      cursor: pointer;
      display: flex;
      flex-shrink: 0;
      height: 108px;
      justify-content: center;
      margin-bottom: 16px;
      padding: 3.5px;
      position: relative;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      width: 108px;

      @media (max-width: 768px) {
        height: 88px;
        width: 88px;
        margin-bottom: 12px;
      }

      &:hover {
        transform: scale(1.06);
      }

      .avatar-img {
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        display: block;
        height: 100%;
        object-fit: cover;
        width: 100%;
      }

      .online-badge {
        background: #00f5d4;
        border: 2.5px solid #0b0f19;
        border-radius: 50%;
        bottom: 3px;
        box-shadow: 0 0 10px #00f5d4;
        height: 18px;
        position: absolute;
        right: 3px;
        width: 18px;
        z-index: 2;
      }
    }

    .user-name {
      align-items: center;
      display: flex;
      font-size: 22px;
      font-weight: 600;
      gap: 7px;
      letter-spacing: 0.2px;
      margin-bottom: 16px;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);

      @media (max-width: 768px) {
        font-size: 20px;
        margin-bottom: 10px;
      }

      .badge-verified {
        background: #0095f6;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 149, 246, 0.6);
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        height: 18px;
        width: 18px;
      }
    }

    .user-sub {
      color: rgba(255, 255, 255, 0.75);
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.3px;
      margin-top: -10px;
      margin-bottom: 20px;
      text-shadow: 0 1px 8px rgba(0, 0, 0, 0.7);

      @media (max-width: 768px) {
        font-size: 12px;
        margin-bottom: 14px;
      }
    }

    .unlock-enter-btn {
      align-items: center;
      background: rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(28px) saturate(200%);
      -webkit-backdrop-filter: blur(28px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 28px;
      box-shadow:
        0 12px 32px rgba(0, 0, 0, 0.5),
        inset 0 1px 1px rgba(255, 255, 255, 0.4);
      color: #ffffff;
      cursor: pointer;
      display: flex;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      gap: 10px;
      height: 46px;
      justify-content: center;
      letter-spacing: 0.3px;
      padding: 0 26px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

      @media (max-width: 768px) {
        height: 40px;
        padding: 0 22px;
        font-size: 13px;
      }

      svg {
        fill: none;
        height: 16px;
        stroke: currentColor;
        width: 16px;
      }

      &:hover {
        background: rgba(0, 245, 212, 0.22);
        border-color: rgba(0, 245, 212, 0.8);
        box-shadow:
          0 14px 40px rgba(0, 0, 0, 0.6),
          0 0 24px rgba(0, 245, 212, 0.45),
          inset 0 1px 1.5px rgba(255, 255, 255, 0.6);
        transform: scale(1.04);
      }

      &:active {
        transform: scale(0.97);
      }
    }
  }

  /* 6. Bottom Music Player & Spectrum Wave Visualizer */
  .bottom-left-music-deck {
    bottom: 200px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    left: 32px;
    position: absolute;
    z-index: 12;

    @media (max-width: 768px) {
      bottom: 204px;
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      width: calc(100vw - 32px);
      max-width: 350px;
    }

    /* Soundwave Audio Equalizer Bar */
    .soundwave-line {
      align-items: flex-end;
      display: flex;
      gap: 2.5px;
      height: 24px;
      margin-left: 4px;

      @media (max-width: 768px) {
        height: 18px;
        justify-content: center;
        margin-left: 0;
        max-width: 100%;
        overflow: hidden;
      }

      span {
        background: linear-gradient(to top, #00f5d4, #ec4899);
        border-radius: 2px;
        height: 4px;
        opacity: 0.85;
        width: 2.5px;

        &.active {
          animation: ${soundWaveAnim} 0.75s ease-in-out infinite alternate;
        }

        &:nth-child(2n) { animation-delay: 0.1s; }
        &:nth-child(3n) { animation-delay: 0.25s; }
        &:nth-child(5n) { animation-delay: 0.4s; }
      }
    }

    /* Music Player Card */
    .music-glass-card {
      align-items: center;
      background: rgba(24, 24, 34, 0.68);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 18px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
      display: flex;
      gap: 14px;
      padding: 10px 18px 10px 10px;
      width: 320px;

      @media (max-width: 768px) {
        width: 100%;
        max-width: 100%;
        padding: 8px 14px 8px 8px;
        gap: 10px;
      }

      .cover-img {
        border-radius: 12px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        height: 52px;
        object-fit: cover;
        width: 52px;
      }

      .music-info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: hidden;

        .music-title {
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.01em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .music-artist {
          color: rgba(255, 255, 255, 0.6);
          font-size: 11.5px;
          font-weight: 500;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .music-controls {
          align-items: center;
          display: flex;
          gap: 14px;
          margin-top: 6px;

          button {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            display: flex;
            font-size: 12px;
            padding: 0;
            transition: transform 0.15s ease, color 0.15s ease;

            &:hover {
              color: #00f5d4;
              transform: scale(1.2);
            }
          }
        }
      }
    }
  }

  /* 7. Bottom-Right Date Widget Removed per user request */
  .bottom-right-date-widget {
    display: none;
  }
`;
