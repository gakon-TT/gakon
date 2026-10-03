import { type FC, memo, useCallback, useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import { SONGS_DATA, type Song } from "components/apps/MacMusic/songsData";
import { useSessionActions } from "contexts/session";

// Animations
const auroraShift = keyframes`
  0% { transform: scale(1) translate(0, 0); }
  33% { transform: scale(1.2) translate(40px, -30px); }
  66% { transform: scale(0.9) translate(-30px, 40px); }
  100% { transform: scale(1) translate(0, 0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const soundWave = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 18px; }
`;

const floatAnim = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const textShimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const radarPing = keyframes`
  0% { transform: scale(0.9); opacity: 0.9; }
  100% { transform: scale(2.4); opacity: 0; }
`;

const Container = styled.div`
  background: radial-gradient(circle at 50% 10%, #15082a 0%, #070310 50%, #020106 100%);
  color: #f5f5f7;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  user-select: none;
  width: 100%;

  /* VisionOS Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.22);
    border-radius: 3px;
  }

  /* 1. Spatial Fluid Aurora Ambient */
  .aurora-layer {
    filter: blur(90px);
    height: 100%;
    left: 0;
    opacity: 0.75;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 0;

    .aurora-blob-1 {
      animation: ${auroraShift} 16s ease-in-out infinite;
      background: radial-gradient(circle, #8b5cf6 0%, rgba(139, 92, 246, 0) 70%);
      border-radius: 50%;
      height: 520px;
      left: -120px;
      position: absolute;
      top: -100px;
      width: 520px;
    }

    .aurora-blob-2 {
      animation: ${auroraShift} 22s ease-in-out infinite reverse;
      background: radial-gradient(circle, #ec4899 0%, rgba(236, 72, 153, 0) 70%);
      border-radius: 50%;
      bottom: -120px;
      height: 560px;
      position: absolute;
      right: -100px;
      width: 560px;
    }

    .aurora-blob-3 {
      animation: ${auroraShift} 18s ease-in-out infinite;
      background: radial-gradient(circle, #06b6d4 0%, rgba(6, 182, 212, 0) 70%);
      border-radius: 50%;
      height: 440px;
      left: 35%;
      position: absolute;
      top: 25%;
      width: 440px;
    }
  }

  /* 2. Interactive Constellation Particle Canvas */
  .particles-canvas {
    height: 100%;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
  }

  /* 3. Cyber Scanline & Vignette */
  .visual-overlay {
    background: 
      radial-gradient(circle at 50% 50%, transparent 60%, rgba(0, 0, 0, 0.6) 100%),
      linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
    background-size: 100% 100%, 100% 4px;
    height: 100%;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 2;
  }

  /* 4. Main Spatial Perspective Viewport */
  .spatial-viewport {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: 640px;
    min-height: 100%;
    padding: 20px 14px 44px;
    perspective: 1200px;
    position: relative;
    width: 100%;
    z-index: 3;
    transition: transform 0.2s ease, padding 0.2s ease;

    @media (max-height: 820px), (max-width: 1440px) {
      padding: 8px 10px 12px;
    }
  }

  /* Top Spatial Status & Audio Bar */
  .spatial-top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    position: relative;
    width: 100%;
    z-index: 15;

    @media (max-height: 820px), (max-width: 1440px) {
      margin-bottom: 8px;
    }
  }

  /* Top-Left Corner Compact Volume Pill */
  .corner-volume-control {
    align-items: center;
    background: rgba(20, 20, 30, 0.88);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.5),
      inset 0 1px 1.5px rgba(255, 255, 255, 0.3);
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    gap: 6px;
    height: 28px;
    padding: 0 9px 0 7px;
    position: relative;
    transition: all 0.2s ease;

    @media (max-height: 820px), (max-width: 1440px) {
      gap: 5px;
      height: 24px;
      padding: 0 8px 0 6px;
    }

    &:hover {
      background: rgba(28, 28, 42, 0.96);
      border-color: rgba(0, 245, 212, 0.5);
      box-shadow: 
        0 10px 28px rgba(0, 0, 0, 0.6),
        0 0 15px rgba(0, 245, 212, 0.3);
    }

    .vol-btn {
      align-items: center;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      display: flex;
      justify-content: center;
      padding: 2px;
      transition: all 0.2s ease;

      &:hover {
        color: #00f5d4;
        transform: scale(1.15);
      }
    }

    .vol-track {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      cursor: pointer;
      display: block;
      height: 4px;
      position: relative;
      transition: height 0.15s ease;
      width: 44px;

      @media (max-height: 820px), (max-width: 1440px) {
        width: 36px;
      }

      &:hover {
        height: 6px;

        .vol-thumb {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.25);
        }
      }

      .vol-fill {
        background: linear-gradient(90deg, #00f5d4, #38bdf8);
        border-radius: 3px;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        transition: width 0.05s linear;
      }

      .vol-thumb {
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(0, 245, 212, 0.8);
        height: 9px;
        opacity: 0.85;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: opacity 0.15s ease, transform 0.15s ease;
        width: 9px;
      }
    }

    .vol-text {
      color: #38bdf8;
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.2px;
      min-width: 22px;
      text-align: right;
    }
  }

  /* 5. Dynamic Island Audio Pill */
  .dynamic-island {
    align-items: center;
    background: rgba(22, 22, 30, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 30px;
    box-shadow: 
      0 12px 36px rgba(0, 0, 0, 0.55),
      inset 0 1px 1.5px rgba(255, 255, 255, 0.4),
      0 0 20px rgba(139, 92, 246, 0.2);
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    gap: 8px;
    margin: 0;
    padding: 6px 14px 6px 8px;
    position: relative;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 10;

    @media (max-height: 820px), (max-width: 1440px) {
      gap: 6px;
      margin: 0;
      padding: 3px 10px 3px 6px;
      .island-art {
        height: 26px;
        width: 26px;
      }
      .track-title {
        font-size: 11px;
      }
      .track-artist {
        font-size: 10px;
      }
      .island-btn {
        height: 24px;
        width: 24px;
      }
    }

    &:hover {
      background: rgba(30, 30, 42, 0.88);
      border-color: rgba(0, 245, 212, 0.5);
      box-shadow: 
        0 16px 42px rgba(0, 0, 0, 0.65),
        0 0 25px rgba(0, 245, 212, 0.35),
        inset 0 1px 2px rgba(255, 255, 255, 0.5);
      transform: translateY(-2px) scale(1.02);
    }

    .island-art {
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      height: 34px;
      object-fit: cover;
      width: 34px;

      &.spinning {
        animation: ${spin} 6s linear infinite;
      }
    }

    .island-info {
      display: flex;
      flex-direction: column;
      max-width: 105px;
      overflow: hidden;

      @media (max-height: 820px), (max-width: 1440px) {
        max-width: 85px;
      }

      .track-title {
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: -0.01em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .track-artist {
        color: rgba(255, 255, 255, 0.55);
        font-size: 11px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .island-equalizer {
      align-items: flex-end;
      display: flex;
      gap: 2.5px;
      height: 16px;
      margin-left: 8px;

      span {
        background: linear-gradient(to top, #00f5d4, #8b5cf6);
        border-radius: 1.5px;
        height: 3px;
        width: 2.5px;

        &.active {
          animation: ${soundWave} 0.55s ease-in-out infinite alternate;
        }

        &:nth-child(1) { animation-delay: 0.1s; }
        &:nth-child(2) { animation-delay: 0.28s; }
        &:nth-child(3) { animation-delay: 0.42s; }
        &:nth-child(4) { animation-delay: 0.18s; }
      }
    }

    .island-btn {
      align-items: center;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      height: 30px;
      justify-content: center;
      margin-left: 6px;
      transition: all 0.15s ease;
      width: 30px;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
        transform: scale(1.1);
      }
    }
  }

  /* 6. 3D Spatial Profile Glass Card with Hologram Refraction */
  .spatial-card {
    background:
      radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%),
      rgba(22, 22, 32, 0.78);
    background-size: 20px 20px, 100% 100%, 100% 100%;
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 32px;
    box-shadow: 
      0 28px 70px rgba(0, 0, 0, 0.7),
      inset 0 1px 2px rgba(255, 255, 255, 0.45),
      inset 0 -1px 2px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    padding: 38px 28px 28px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.12s ease-out, box-shadow 0.25s ease;
    width: 100%;

    @media (max-height: 820px), (max-width: 1440px) {
      margin-bottom: 6px;
      padding: 10px 14px 8px;
      border-radius: 18px;
    }

    &:hover {
      box-shadow: 
        0 35px 80px rgba(0, 0, 0, 0.8),
        0 0 45px rgba(139, 92, 246, 0.3),
        inset 0 1px 2.5px rgba(255, 255, 255, 0.6);
    }

    /* Top Glow Bar Arc */
    .card-glow-bar {
      background: linear-gradient(90deg, transparent, #00f5d4, #ec4899, transparent);
      box-shadow: 0 0 14px #00f5d4;
      height: 2px;
      left: 20%;
      position: absolute;
      top: 0;
      width: 60%;
      z-index: 2;
    }

    /* Corner Cyber Tech Brackets */
    .card-corner {
      height: 12px;
      opacity: 0.7;
      pointer-events: none;
      position: absolute;
      width: 12px;
      z-index: 3;

      &.top-left {
        border-left: 2px solid #00f5d4;
        border-top: 2px solid #00f5d4;
        border-top-left-radius: 4px;
        left: 14px;
        top: 14px;
      }

      &.top-right {
        border-right: 2px solid #ec4899;
        border-top: 2px solid #ec4899;
        border-top-right-radius: 4px;
        right: 14px;
        top: 14px;
      }

      &.bottom-left {
        border-bottom: 2px solid #ec4899;
        border-left: 2px solid #ec4899;
        border-bottom-left-radius: 4px;
        bottom: 14px;
        left: 14px;
      }

      &.bottom-right {
        border-bottom: 2px solid #00f5d4;
        border-right: 2px solid #00f5d4;
        border-bottom-right-radius: 4px;
        bottom: 14px;
        right: 14px;
      }
    }

    /* Top Tech Badges */
    .card-tech-badge {
      align-items: center;
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.5);
      display: flex;
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 10px;
      font-weight: 700;
      gap: 5px;
      letter-spacing: 0.5px;
      padding: 3px 10px;
      position: absolute;
      top: 14px;
      z-index: 3;

      &.left {
        left: 22px;
      }

      &.right {
        color: #10b981;
        right: 22px;
      }

      .pulse-dot {
        background: #10b981;
        border-radius: 50%;
        box-shadow: 0 0 8px #10b981;
        height: 6px;
        width: 6px;
      }
    }

    /* Moving Holographic Specular Glare */
    .prismatic-rim {
      border-radius: 32px;
      inset: 0;
      pointer-events: none;
      position: absolute;
      background: radial-gradient(
        500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(255, 255, 255, 0.16),
        rgba(0, 245, 212, 0.05) 40%,
        transparent 70%
      );
      z-index: 1;
    }

    .profile-hero {
      align-items: center;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 2;

      .card-bio-text {
        color: rgba(255, 255, 255, 0.65);
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.2px;
        margin-bottom: 10px;
        text-align: center;
      }

      .card-accent-divider {
        background: linear-gradient(90deg, transparent, #00f5d4, #ec4899, transparent);
        border-radius: 2px;
        height: 1.5px;
        margin-bottom: 14px;
        opacity: 0.8;
        width: 70px;
      }

      /* Avatar with Rotating Rainbow Conic Halo (Still - no float animation) */
      .avatar-wrapper {
        margin-bottom: 16px;
        position: relative;

        @media (max-height: 850px) {
          margin-bottom: 10px;
        }

        .avatar-conic-halo {
          align-items: center;
          aspect-ratio: 1 / 1;
          background: conic-gradient(
            from 0deg,
            #ff007f,
            #7928ca,
            #0070f3,
            #00dfd8,
            #7928ca,
            #ff007f
          );
          border-radius: 50%;
          display: flex;
          filter: drop-shadow(0 0 20px rgba(0, 223, 216, 0.55));
          flex-shrink: 0;
          height: 136px;
          justify-content: center;
          padding: 3.5px;
          position: relative;
          width: 136px;

          @media (max-height: 820px), (max-width: 1440px) {
            height: 74px;
            width: 74px;
          }

          &::before {
            background: inherit;
            border-radius: 50%;
            content: "";
            filter: blur(12px);
            inset: -4px;
            opacity: 0.6;
            position: absolute;
            z-index: 0;
          }
        }

        .avatar-img {
          border: 3px solid #0f071e;
          border-radius: 50%;
          height: 100%;
          object-fit: cover;
          position: relative;
          transition: transform 0.25s ease;
          width: 100%;
          z-index: 1;

          &:hover {
            transform: scale(1.04);
          }
        }

        /* Pulsating Radar Beacon */
        .status-badge {
          align-items: center;
          background: #10b981;
          border: 2.5px solid #0f071e;
          border-radius: 50%;
          bottom: 5px;
          box-shadow: 0 0 12px #10b981;
          display: flex;
          height: 18px;
          justify-content: center;
          position: absolute;
          right: 5px;
          width: 18px;
          z-index: 2;

          &::after {
            animation: ${radarPing} 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            border: 2px solid #10b981;
            border-radius: 50%;
            content: "";
            height: 100%;
            position: absolute;
            width: 100%;
          }
        }
      }

      /* Hologram Shimmer Headline */
      .name-headline {
        align-items: center;
        background: linear-gradient(
          90deg,
          #ffffff 0%,
          #00f5d4 25%,
          #ec4899 50%,
          #a855f7 75%,
          #ffffff 100%
        );
        background-size: 200% auto;
        animation: ${textShimmer} 5s linear infinite;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: flex;
        font-size: 28px;
        font-weight: 800;
        gap: 8px;
        letter-spacing: -0.02em;
        margin: 0 0 4px;

        @media (max-height: 820px), (max-width: 1440px) {
          font-size: 19px;
          margin: 0 0 2px;
        }

        .verified-tick {
          -webkit-text-fill-color: initial;
          align-items: center;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.7);
          color: #ffffff;
          display: inline-flex;
          font-size: 10.5px;
          font-weight: 900;
          height: 20px;
          justify-content: center;
          width: 20px;
        }
      }

      .user-handle {
        color: #38bdf8;
        font-family: "SF Mono", "Fira Code", monospace;
        font-size: 14.5px;
        font-weight: 600;
        letter-spacing: 0.5px;
        margin: 0 0 14px;
        text-shadow: 0 0 12px rgba(56, 189, 248, 0.6);

        @media (max-height: 820px), (max-width: 1440px) {
          font-size: 11.5px;
          margin: 0 0 4px;
        }
      }

      /* Location Pill with Radar Blip */
      .location-badge {
        align-items: center;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 20px;
        color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        display: flex;
        font-size: 12px;
        font-weight: 500;
        gap: 8px;
        padding: 6px 16px;
        margin-bottom: 0;
        transition: all 0.2s ease;

        @media (max-height: 820px), (max-width: 1440px) {
          font-size: 10px;
          padding: 3px 10px;
        }

        svg {
          color: #ec4899;
          filter: drop-shadow(0 0 6px #ec4899);
          height: 14px;
          width: 14px;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(236, 72, 153, 0.4);
          box-shadow: 0 0 18px rgba(236, 72, 153, 0.35);
          transform: translateY(-2px);
        }
      }

      /* VisionOS 3 Segmented Tabs (Removed "Dự án") */
      .segmented-tabs {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 16px;
        display: flex;
        gap: 6px;
        padding: 5px;
        width: 100%;
        max-width: 380px;

        .tab-btn {
          align-items: center;
          background: none;
          border: none;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          display: flex;
          flex: 1;
          font-size: 12.5px;
          font-weight: 600;
          gap: 6px;
          justify-content: center;
          padding: 9px 12px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

          &:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.08);
          }

          &.active {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.12));
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4);
            color: #ffffff;
          }
        }
      }
    }
  }

  /* 7. Tab Viewport Content */
  .tab-viewport {
    position: relative;
    width: 100%;
    z-index: 2;

    /* Compact Visits Footer Badge */
    .compact-visits-badge {
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      cursor: pointer;
      display: flex;
      font-size: 11.5px;
      font-weight: 600;
      gap: 7px;
      justify-content: center;
      margin: 12px auto 0;
      padding: 6px 16px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      width: fit-content;

      @media (max-height: 820px), (max-width: 1440px) {
        margin: 2px auto 0;
        padding: 2px 8px;
        font-size: 9px;
      }

      &:hover {
        background: rgba(244, 114, 182, 0.15);
        border-color: rgba(244, 114, 182, 0.4);
        box-shadow: 0 0 16px rgba(244, 114, 182, 0.3);
        transform: translateY(-2px);
      }

      .visits-icon {
        font-size: 13px;
      }

      .visits-text {
        color: #f472b6;
        letter-spacing: 0.3px;
      }
    }


    /* Compact Spatial Music Controller Deck */
    .spatial-music-deck {
      background: rgba(20, 20, 30, 0.82);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 24px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 24px;
      padding: 18px 22px;

      @media (max-height: 820px), (max-width: 1440px) {
        gap: 4px;
        margin-bottom: 6px;
        padding: 6px 12px;
        border-radius: 16px;
      }

      /* Top track info row */
      .track-header-row {
        align-items: center;
        display: flex;
        gap: 14px;

        .player-art {
          border: 2px solid rgba(0, 245, 212, 0.4);
          border-radius: 50%;
          box-shadow: 0 0 14px rgba(0, 245, 212, 0.25);
          flex-shrink: 0;
          height: 44px;
          overflow: hidden;
          width: 44px;

          @media (max-height: 820px), (max-width: 1440px) {
            height: 32px;
            width: 32px;
          }

          &.spinning img {
            animation: ${spin} 6s linear infinite;
          }

          img {
            height: 100%;
            object-fit: cover;
            width: 100%;
          }
        }

        .player-meta {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;

          .p-title {
            color: #ffffff;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: -0.01em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .p-artist {
            color: rgba(255, 255, 255, 0.55);
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .player-eq {
          align-items: flex-end;
          display: flex;
          gap: 2.5px;
          height: 16px;

          span {
            animation: ${soundWave} 0.55s ease-in-out infinite alternate;
            background: linear-gradient(to top, #00f5d4, #8b5cf6);
            border-radius: 1.5px;
            height: 3px;
            width: 2.5px;

            &:nth-child(1) { animation-delay: 0.1s; }
            &:nth-child(2) { animation-delay: 0.28s; }
            &:nth-child(3) { animation-delay: 0.42s; }
            &:nth-child(4) { animation-delay: 0.18s; }
          }
        }
      }

      /* Middle player controls row */
      .player-controls-row {
        align-items: center;
        display: flex;
        justify-content: center;
        gap: 22px;

        @media (max-height: 820px), (max-width: 1440px) {
          gap: 14px;
        }

        .sub-ctrl-btn {
          align-items: center;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;
          display: flex;
          justify-content: center;
          padding: 6px;
          transition: all 0.2s ease;

          &:hover {
            color: #ffffff;
            transform: scale(1.15);
          }

          &.active {
            color: #00f5d4;
            filter: drop-shadow(0 0 6px rgba(0, 245, 212, 0.6));
          }
        }

        .main-play-btn {
          align-items: center;
          background: #ffffff;
          border: none;
          border-radius: 50%;
          box-shadow: 0 4px 18px rgba(255, 255, 255, 0.35);
          cursor: pointer;
          display: flex;
          height: 42px;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          width: 42px;

          @media (max-height: 820px), (max-width: 1440px) {
            height: 32px;
            width: 32px;
            svg {
              height: 16px;
              width: 16px;
            }
          }

          &:hover {
            box-shadow: 0 6px 24px rgba(255, 255, 255, 0.6);
            transform: scale(1.08);
          }

          &:active {
            transform: scale(0.95);
          }
        }
      }

      /* Bottom progress bar row */
      .progress-bar-row {
        align-items: center;
        display: flex;
        gap: 12px;
        width: 100%;

        .time-label {
          font-family: "SF Mono", "Fira Code", monospace;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.2px;
          min-width: 32px;

          &.current {
            color: #38bdf8;
          }

          &.total {
            color: #38bdf8;
            text-align: right;
          }
        }

        .progress-bar-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          cursor: pointer;
          flex: 1;
          height: 4px;
          position: relative;
          transition: height 0.15s ease;

          &:hover {
            height: 6px;

            .progress-bar-thumb {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1.2);
            }
          }

          .progress-bar-fill {
            background: #ffffff;
            border-radius: 3px;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            transition: width 0.1s linear;
          }

          .progress-bar-thumb {
            background: #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
            height: 10px;
            opacity: 0;
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            transition: opacity 0.15s ease, transform 0.15s ease;
            width: 10px;
          }
        }
      }
    }

    /* TAB 3: SOCIAL LINKS */
    .social-links-grid {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 28px;
      justify-content: center;
      margin: 16px 0 28px;

      @media (max-height: 820px), (max-width: 1440px) {
        gap: 12px;
        margin: 2px 0 4px;
      }

      .social-item-col {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .social-circle-btn {
        align-items: center;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(28px);
        border: 1.5px solid rgba(255, 255, 255, 0.18);
        border-radius: 50%;
        box-shadow: 
          0 10px 24px rgba(0, 0, 0, 0.4),
          inset 0 1px 1.5px rgba(255, 255, 255, 0.4);
        color: inherit;
        cursor: pointer;
        display: flex;
        height: 64px;
        justify-content: center;
        position: relative;
        text-decoration: none;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        width: 64px;

        @media (max-height: 820px), (max-width: 1440px) {
          height: 38px;
          width: 38px;
          svg {
            height: 18px;
            width: 18px;
          }
        }

        svg {
          height: 28px;
          width: 28px;
          transition: transform 0.2s ease;
        }

        &:hover {
          transform: translateY(-5px) scale(1.1);
          border-color: rgba(255, 255, 255, 0.45);

          svg {
            transform: scale(1.12);
          }
        }

        &.discord:hover {
          background: rgba(88, 101, 242, 0.28);
          border-color: #5865f2;
          box-shadow: 0 0 28px rgba(88, 101, 242, 0.65), 0 12px 30px rgba(0, 0, 0, 0.5);
        }

        &.spotify:hover {
          background: rgba(29, 185, 84, 0.28);
          border-color: #1db954;
          box-shadow: 0 0 28px rgba(29, 185, 84, 0.65), 0 12px 30px rgba(0, 0, 0, 0.5);
        }

        &.facebook:hover {
          background: rgba(24, 119, 242, 0.28);
          border-color: #1877f2;
          box-shadow: 0 0 28px rgba(24, 119, 242, 0.65), 0 12px 30px rgba(0, 0, 0, 0.5);
        }

        &.steam:hover {
          background: rgba(102, 192, 244, 0.28);
          border-color: #66c0f4;
          box-shadow: 0 0 28px rgba(102, 192, 244, 0.65), 0 12px 30px rgba(0, 0, 0, 0.5);
        }
      }

      .social-label {
        color: rgba(255, 255, 255, 0.85);
        font-size: 12.5px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
    }
  }

  /* VisionOS Floating HUD Toast */
  .vision-hud-toast {
    align-items: center;
    background: rgba(24, 24, 34, 0.94);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 22px;
    bottom: 24px;
    box-shadow: 
      0 16px 48px rgba(0, 0, 0, 0.7),
      0 0 25px rgba(0, 245, 212, 0.3);
    color: #ffffff;
    display: flex;
    font-size: 13px;
    font-weight: 600;
    gap: 10px;
    padding: 11px 22px;
    position: fixed;
    z-index: 100;
    animation: ${floatAnim} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const USUK_PLAYLIST: Song[] = SONGS_DATA.filter((s) => s.category === "usuk");

const Gakon: FC<ComponentProcessProps> = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() =>
    Math.floor(Math.random() * USUK_PLAYLIST.length)
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(
    () => USUK_PLAYLIST[currentTrackIndex]?.durationSec || 200
  );
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [visitCount, setVisitCount] = useState<number>(382);
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const isYtReadyRef = useRef<boolean>(false);
  const pendingPlayRef = useRef<Song | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const volumeTrackRef = useRef<HTMLDivElement | null>(null);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const { setWindowStates } = useSessionActions();

  // Dynamically responsive window size & position for laptop vs 24" desktop
  useEffect(() => {
    const updateResponsiveWindow = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isLaptop = vh < 820 || vw < 1500;
      const width = isLaptop
        ? Math.max(340, Math.min(390, Math.round(vw * 0.32)))
        : 480;
      const maxAllowedHeight = Math.max(360, vh - 115);
      const height = isLaptop
        ? Math.min(480, maxAllowedHeight)
        : Math.min(720, vh - 110);
      const x = isLaptop
        ? Math.max(20, Math.min(vw - width - 25, Math.round(vw * 0.54)))
        : Math.max(20, Math.min(vw - width - 35, Math.round(vw * 0.55)));
      const y = 34;

      setWindowStates((prev) => ({
        ...prev,
        Gakon: {
          ...prev?.Gakon,
          position: { x, y },
          size: { height, width },
        },
      }));
    };

    updateResponsiveWindow();
    window.addEventListener("resize", updateResponsiveWindow);
    return () => window.removeEventListener("resize", updateResponsiveWindow);
  }, [setWindowStates]);

  const currentTrackIndexRef = useRef(currentTrackIndex);
  currentTrackIndexRef.current = currentTrackIndex;
  const isRepeatRef = useRef(isRepeat);
  isRepeatRef.current = isRepeat;
  const isShuffleRef = useRef(isShuffle);
  isShuffleRef.current = isShuffle;
  const hasUserPausedRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const currentTrack = USUK_PLAYLIST[currentTrackIndex] || USUK_PLAYLIST[0];
  const currentTrackRef = useRef(currentTrack);
  currentTrackRef.current = currentTrack;

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec) || !isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;

  // Web Audio Synthesizer Fallback
  const stopSynth = useCallback(() => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  }, []);

  const startSynth = useCallback((song: Song) => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const scale = [
        261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25,
      ];
      let step = 0;

      const playStep = () => {
        if (!ctx || ctx.state === "closed") return;
        const now = ctx.currentTime;
        const root = scale[(song.id + step) % scale.length];
        const fifth = root * 1.5;
        const bass = root / 2;

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(root, now);
        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.6);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(fifth, now);
        gain2.gain.setValueAtTime(0.12, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.5);

        if (step % 2 === 0) {
          const oscB = ctx.createOscillator();
          const gainB = ctx.createGain();
          oscB.type = "sine";
          oscB.frequency.setValueAtTime(bass, now);
          gainB.gain.setValueAtTime(0.25, now);
          gainB.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          oscB.connect(gainB);
          gainB.connect(ctx.destination);
          oscB.start(now);
          oscB.stop(now + 0.85);
        }

        step = (step + 1) % 8;
      };

      playStep();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = setInterval(playStep, 500);
    } catch {
      // audio fallback
    }
  }, []);

  const handleVolumeChange = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVol)));
    setVolume(clamped);
    if (clamped > 0 && isMutedRef.current) {
      setIsMuted(false);
    }
    if (ytPlayerRef.current && isYtReadyRef.current) {
      try {
        if (clamped === 0) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(clamped);
        }
      } catch {}
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted || volume === 0) {
      const restoreVol = volume === 0 ? 80 : volume;
      setIsMuted(false);
      if (volume === 0) setVolume(restoreVol);
      if (ytPlayerRef.current && isYtReadyRef.current) {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(restoreVol);
        } catch {}
      }
      showToast(`🔊 Âm lượng: ${restoreVol}%`);
    } else {
      setIsMuted(true);
      if (ytPlayerRef.current && isYtReadyRef.current) {
        try {
          ytPlayerRef.current.mute();
        } catch {}
      }
      showToast("🔇 Đã tắt tiếng");
    }
  }, [isMuted, volume]);

  const calculateVolumeFromEvent = useCallback(
    (clientX: number) => {
      if (!volumeTrackRef.current) return;
      const rect = volumeTrackRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const percent = Math.max(
        0,
        Math.min(100, Math.round((clickX / rect.width) * 100))
      );
      handleVolumeChange(percent);
    },
    [handleVolumeChange]
  );

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    calculateVolumeFromEvent(e.clientX);
  };

  const handleVolumeDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    calculateVolumeFromEvent(e.clientX);
    const onMouseMove = (moveEv: MouseEvent) => {
      calculateVolumeFromEvent(moveEv.clientX);
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const loadAndPlaySong = useCallback(
    (song: Song) => {
      stopSynth();
      setCurrentTimeSec(0);
      setDurationSec(song.durationSec || 200);
      hasUserPausedRef.current = false;
      setIsPlaying(true);

      if (song.youtubeId && ytPlayerRef.current && isYtReadyRef.current) {
        try {
          ytPlayerRef.current.loadVideoById({
            videoId: song.youtubeId,
            startSeconds: 0,
          });
          if (isMutedRef.current || volumeRef.current === 0) {
            ytPlayerRef.current.mute();
          } else {
            ytPlayerRef.current.unMute();
            ytPlayerRef.current.setVolume(volumeRef.current);
          }
          ytPlayerRef.current.playVideo();
          return;
        } catch {
          // fallback
        }
      }

      if (!isYtReadyRef.current && song.youtubeId) {
        pendingPlayRef.current = song;
      }
    },
    [stopSynth]
  );

  const handleNextTrack = useCallback(() => {
    let nextIdx = (currentTrackIndexRef.current + 1) % USUK_PLAYLIST.length;
    if (isShuffleRef.current && USUK_PLAYLIST.length > 1) {
      let randIdx = currentTrackIndexRef.current;
      while (randIdx === currentTrackIndexRef.current) {
        randIdx = Math.floor(Math.random() * USUK_PLAYLIST.length);
      }
      nextIdx = randIdx;
    }
    setCurrentTrackIndex(nextIdx);
    const nextSong = USUK_PLAYLIST[nextIdx];
    if (isPlaying) {
      loadAndPlaySong(nextSong);
    } else {
      setCurrentTimeSec(0);
      setDurationSec(nextSong.durationSec || 200);
    }
    showToast(`⏭ Bài tiếp: ${nextSong.title}`);
  }, [isPlaying, loadAndPlaySong]);

  const handleNextTrackRef = useRef(handleNextTrack);
  handleNextTrackRef.current = handleNextTrack;

  const handlePrevTrack = useCallback(() => {
    const prevIdx =
      (currentTrackIndexRef.current - 1 + USUK_PLAYLIST.length) %
      USUK_PLAYLIST.length;
    setCurrentTrackIndex(prevIdx);
    const prevSong = USUK_PLAYLIST[prevIdx];
    if (isPlaying) {
      loadAndPlaySong(prevSong);
    } else {
      setCurrentTimeSec(0);
      setDurationSec(prevSong.durationSec || 200);
    }
    showToast(`⏮ Bài trước: ${prevSong.title}`);
  }, [isPlaying, loadAndPlaySong]);

  const handleTrackEnded = useCallback(() => {
    if (isRepeatRef.current) {
      if (
        ytPlayerRef.current &&
        typeof ytPlayerRef.current.seekTo === "function"
      ) {
        try {
          ytPlayerRef.current.seekTo(0, true);
          ytPlayerRef.current.playVideo();
          return;
        } catch {}
      }
      setCurrentTimeSec(0);
    } else {
      handleNextTrackRef.current();
    }
  }, []);

  const handleTrackEndedRef = useRef(handleTrackEnded);
  handleTrackEndedRef.current = handleTrackEnded;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!durationSec) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = Math.floor(newPercent * durationSec);
    setCurrentTimeSec(newTime);
    if (
      ytPlayerRef.current &&
      typeof ytPlayerRef.current.seekTo === "function"
    ) {
      try {
        ytPlayerRef.current.seekTo(newTime, true);
      } catch {}
    }
  };

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      hasUserPausedRef.current = true;
      if (
        ytPlayerRef.current &&
        typeof ytPlayerRef.current.pauseVideo === "function"
      ) {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch {}
      }
      stopSynth();
      setIsPlaying(false);
    } else {
      hasUserPausedRef.current = false;
      setIsPlaying(true);
      if (
        ytPlayerRef.current &&
        isYtReadyRef.current &&
        typeof ytPlayerRef.current.playVideo === "function"
      ) {
        try {
          if (isMutedRef.current || volumeRef.current === 0) {
            ytPlayerRef.current.mute();
          } else {
            ytPlayerRef.current.unMute();
            ytPlayerRef.current.setVolume(volumeRef.current);
          }
          ytPlayerRef.current.playVideo();
        } catch {
          loadAndPlaySong(currentTrack);
        }
      } else {
        loadAndPlaySong(currentTrack);
      }
      showToast(`▶ Đang phát: ${currentTrack.title}`);
    }
  }, [currentTrack, isPlaying, loadAndPlaySong, stopSynth]);

  // YouTube Iframe API initialization
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;

    const initYt = () => {
      if (!window.YT || !window.YT.Player) return;
      if (ytPlayerRef.current) return;

      try {
        ytPlayerRef.current = new window.YT.Player("gakon-yt-player-slot", {
          width: "100%",
          height: "100%",
          videoId: currentTrackRef.current?.youtubeId || "fHI8X4OXluQ",
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: (event: any) => {
              isYtReadyRef.current = true;
              try {
                if (isMutedRef.current || volumeRef.current === 0) {
                  event.target.mute();
                } else {
                  event.target.unMute();
                  event.target.setVolume(volumeRef.current);
                }
              } catch {}

              if (pendingPlayRef.current) {
                const song = pendingPlayRef.current;
                pendingPlayRef.current = null;
                loadAndPlaySong(song);
                return;
              }

              if (!hasUserPausedRef.current) {
                try {
                  if (isMutedRef.current || volumeRef.current === 0) {
                    event.target.mute();
                  } else {
                    event.target.unMute();
                    event.target.setVolume(volumeRef.current);
                  }
                  event.target.playVideo();
                } catch {}
              }
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                setIsPlaying(true);
                if (!hasUserPausedRef.current) {
                  try {
                    if (isMutedRef.current || volumeRef.current === 0) {
                      event.target.mute();
                    } else {
                      event.target.unMute();
                      event.target.setVolume(volumeRef.current);
                    }
                  } catch {}
                }
              } else if (event.data === 2) {
                if (hasUserPausedRef.current) {
                  setIsPlaying(false);
                }
              } else if (event.data === 0) {
                handleTrackEndedRef.current();
              }
            },
            onError: (err: any) => {
              console.warn("YouTube player error, skipping track:", err);
              handleNextTrackRef.current();
            },
          },
        });
      } catch {
        // fallback
      }
    };

    if (window.YT && window.YT.Player) {
      setTimeout(initYt, 50);
    } else {
      if (!document.getElementById("yt-iframe-api-script")) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      const prevOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevOnReady === "function") prevOnReady();
        setTimeout(initYt, 50);
      };

      // Periodic check in case script was already loaded by another component
      pollInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          if (pollInterval) clearInterval(pollInterval);
          initYt();
        }
      }, 150);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      stopSynth();
      if (
        ytPlayerRef.current &&
        typeof ytPlayerRef.current.destroy === "function"
      ) {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
        ytPlayerRef.current = null;
        isYtReadyRef.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global user gesture activation to unlock audio instantly on cold page visits
  useEffect(() => {
    const handleUserActivation = () => {
      if (hasUserPausedRef.current) return;
      if (
        ytPlayerRef.current &&
        isYtReadyRef.current &&
        typeof ytPlayerRef.current.playVideo === "function"
      ) {
        try {
          if (isMutedRef.current || volumeRef.current === 0) {
            ytPlayerRef.current.mute();
          } else {
            ytPlayerRef.current.unMute();
            ytPlayerRef.current.setVolume(volumeRef.current);
          }
          if (ytPlayerRef.current.getPlayerState?.() !== 1) {
            ytPlayerRef.current.playVideo();
          }
          setIsPlaying(true);
        } catch {}
      }
    };

    window.addEventListener("pointerdown", handleUserActivation, { capture: true });
    window.addEventListener("mousedown", handleUserActivation, { capture: true });
    window.addEventListener("keydown", handleUserActivation, { capture: true });
    window.addEventListener("touchstart", handleUserActivation, { capture: true });
    window.addEventListener("click", handleUserActivation, { capture: true });
    window.addEventListener("daedalOS:unlock", handleUserActivation);

    return () => {
      window.removeEventListener("pointerdown", handleUserActivation, { capture: true });
      window.removeEventListener("mousedown", handleUserActivation, { capture: true });
      window.removeEventListener("keydown", handleUserActivation, { capture: true });
      window.removeEventListener("touchstart", handleUserActivation, { capture: true });
      window.removeEventListener("click", handleUserActivation, { capture: true });
      window.removeEventListener("daedalOS:unlock", handleUserActivation);
    };
  }, []);

  // Time sync interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (ytPlayerRef.current && isYtReadyRef.current) {
          try {
            const t = ytPlayerRef.current.getCurrentTime();
            if (typeof t === "number" && !isNaN(t)) {
              setCurrentTimeSec(Math.floor(t));
            }
            const d = ytPlayerRef.current.getDuration();
            if (typeof d === "number" && !isNaN(d) && d > 0) {
              setDurationSec(Math.floor(d));
            }
          } catch {}
        } else {
          setCurrentTimeSec((prev) => {
            if (prev >= durationSec && durationSec > 0) {
              handleTrackEndedRef.current();
              return 0;
            }
            return prev + 1;
          });
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSec]);

  // Persistent Visit Counter Increment
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gakon_visit_count");
      const baseCount = stored ? parseInt(stored, 10) : 382;
      const nextCount = isNaN(baseCount) ? 383 : baseCount + 1;
      localStorage.setItem("gakon_visit_count", nextCount.toString());
      setVisitCount(nextCount);
    } catch {
      setVisitCount(383);
    }
  }, []);

  // 3D Parallax Tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 8;
    const rotY = (x / (rect.width / 2)) * 8;

    setTilt({ x: rotX, y: rotY });

    cardRef.current.style.setProperty("--mouse-x", `${((x + rect.width / 2) / rect.width) * 100}%`);
    cardRef.current.style.setProperty("--mouse-y", `${((y + rect.height / 2) / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Interactive Particle Constellation Matrix (Optimized 30fps lightweight loop)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const isLowPower =
      typeof navigator !== "undefined" &&
      ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        (window.devicePixelRatio && window.devicePixelRatio > 1.5) ||
        window.innerWidth < 1000);
    const particleCount = isLowPower ? 12 : 22;

    const particles: Array<{
      color: string;
      radius: number;
      vx: number;
      vy: number;
      x: number;
      y: number;
    }> = [];

    const colors = ["#00f5d4", "#f472b6", "#a855f7", "#38bdf8", "#ffffff"];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        color: colors[i % colors.length],
        radius: Math.random() * 1.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.15,
        x: Math.random() * width,
        y: Math.random() * height,
      });
    }

    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30; // 30 FPS cap saves 50% GPU/CPU overhead

    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      if (document.hidden) return;
      if (time - lastFrame < FRAME_INTERVAL) return;
      lastFrame = time;

      ctx.clearRect(0, 0, width, height);

      // Constellation lines - distance squared check avoids heavy Math.sqrt
      const maxDistSq = 75 * 75;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist / 75) * 0.2})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Crisp glowing dots without expensive ctx.shadowBlur
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      {/* Hidden YouTube Iframe Player for Apple Music USUK Streaming */}
      <div
        style={{
          bottom: 0,
          height: 200,
          opacity: 0.001,
          overflow: "hidden",
          pointerEvents: "none",
          position: "absolute",
          right: 0,
          width: 320,
          zIndex: -1,
        }}
      >
        <div id="gakon-yt-player-slot" style={{ height: "100%", width: "100%" }} />
      </div>

      {/* 1. Spatial Aurora Ambient Glows */}
      <div className="aurora-layer">
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
        <div className="aurora-blob-3" />
      </div>

      {/* 2. Interactive Constellation Particle Canvas */}
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* 3. Cyber Scanline & Vignette */}
      <div className="visual-overlay" />

      {/* 4. Main Spatial Viewport */}
      <div className="spatial-viewport">
        {/* Top Spatial Status & Audio Bar */}
        <div className="spatial-top-row">
          {/* Top-Left Corner Compact Volume Pill */}
          <div className="corner-volume-control">
            <button
              type="button"
              className="vol-btn"
              onClick={toggleMute}
              title={isMuted || volume === 0 ? "Bật âm thanh" : "Tắt tiếng"}
            >
              {isMuted || volume === 0 ? (
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : volume < 50 ? (
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M7 9v6h4l5 5V4L11 9H7zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              )}
            </button>

            <div
              className="vol-track"
              ref={volumeTrackRef}
              onClick={handleVolumeClick}
              onMouseDown={handleVolumeDragStart}
              title={`Âm lượng: ${isMuted ? 0 : volume}%`}
            >
              <div
                className="vol-fill"
                style={{ width: `${isMuted ? 0 : volume}%` }}
              />
              <div
                className="vol-thumb"
                style={{ left: `${isMuted ? 0 : volume}%` }}
              />
            </div>

            <span className="vol-text">{isMuted ? 0 : volume}%</span>
          </div>

          {/* Dynamic Island Music Pill */}
          <div className="dynamic-island" onClick={togglePlay}>
            <img
              src="/System/GakonWeb/cyber-chick-optimized.webp"
              alt="Track"
              className={`island-art ${isPlaying ? "spinning" : ""}`}
            />
            <div className="island-info">
              <span className="track-title">{currentTrack.title}</span>
              <span className="track-artist">{currentTrack.artist}</span>
            </div>

            <div className="island-equalizer">
              <span className={isPlaying ? "active" : ""} />
              <span className={isPlaying ? "active" : ""} />
              <span className={isPlaying ? "active" : ""} />
              <span className={isPlaying ? "active" : ""} />
            </div>

            <button
              className="island-btn"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
              type="button"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>
        </div>

        {/* 3D Spatial Profile Card */}
        <div
          ref={cardRef}
          className="spatial-card"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Top Arc Glow */}
          <div className="card-glow-bar" />

          {/* Corner Cyber Brackets */}
          <div className="card-corner top-left" />
          <div className="card-corner top-right" />
          <div className="card-corner bottom-left" />
          <div className="card-corner bottom-right" />

          {/* Top Tech Badges */}
          <div className="card-tech-badge left">❖ VISION.OS</div>
          <div className="card-tech-badge right">
            <span className="pulse-dot" /> ONLINE
          </div>

          {/* Moving Holographic Specular Glare */}
          <div className="prismatic-rim" />

          {/* Profile Hero Header */}
          <div className="profile-hero">
            {/* Avatar with Rotating Rainbow Conic Halo (Still) */}
            <div className="avatar-wrapper">
              <div className="avatar-conic-halo">
                <img
                  src="/System/GakonWeb/avt-optimized.webp"
                  alt="Ga kon"
                  className="avatar-img"
                />
              </div>
              <div className="status-badge" title="Đang hoạt động" />
            </div>

            <h1 className="name-headline">
              Ga kon
              <span className="verified-tick" title="Đã xác minh">✓</span>
            </h1>
            <div className="user-handle">@g4kon.gg</div>

            <div className="card-bio-text">✨ Digital Creator & Cyberpunk Architect</div>
            <div className="card-accent-divider" />

            <div
              className="location-badge"
              onClick={() => showToast("📍 Tọa độ TP.HCM: 10.8231° N, 106.6297° E")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              TP. Hồ Chí Minh • 10.82°N, 106.63°E
            </div>
          </div>
        </div>

        {/* Tab Viewport Content */}
        <div className="tab-viewport">


          {/* Compact Spatial Music Deck */}
          <div className="spatial-music-deck">
            {/* Track Info (Keep Icon and Track Name) */}
            <div className="track-header-row">
              <div className={`player-art ${isPlaying ? "spinning" : ""}`}>
                <img src="/System/GakonWeb/cyber-chick-optimized.webp" alt="Cover" />
              </div>
              <div className="player-meta">
                <div className="p-title">{currentTrack.title}</div>
                <div className="p-artist">{currentTrack.artist}</div>
              </div>
              {isPlaying && (
                <div className="player-eq">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>

            {/* Control Buttons Row matching screenshot */}
            <div className="player-controls-row">
              <button
                type="button"
                className={`sub-ctrl-btn ${isShuffle ? "active" : ""}`}
                onClick={() => {
                  setIsShuffle((prev) => !prev);
                  showToast(!isShuffle ? "🔀 Bật phát ngẫu nhiên" : "➡️ Tắt phát ngẫu nhiên");
                }}
                title={isShuffle ? "Tắt ngẫu nhiên" : "Bật ngẫu nhiên"}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                </svg>
              </button>

              <button
                type="button"
                className="sub-ctrl-btn"
                onClick={handlePrevTrack}
                title="Bài trước"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              <button
                type="button"
                className="main-play-btn"
                onClick={togglePlay}
                title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#000000">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#000000" style={{ marginLeft: "2px" }}>
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <button
                type="button"
                className="sub-ctrl-btn"
                onClick={handleNextTrack}
                title="Bài tiếp"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>

              <button
                type="button"
                className={`sub-ctrl-btn ${isRepeat ? "active" : ""}`}
                onClick={() => {
                  setIsRepeat((prev) => !prev);
                  showToast(!isRepeat ? "🔁 Bật lặp lại bài" : "➡️ Tắt lặp lại bài");
                }}
                title={isRepeat ? "Tắt lặp lại" : "Lặp lại bài hát"}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                </svg>
              </button>
            </div>

            {/* Timeline Progress Bar Row */}
            <div className="progress-bar-row">
              <span className="time-label current">{formatTime(currentTimeSec)}</span>
              <div
                className="progress-bar-track"
                onClick={handleSeek}
              >
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                />
                <div
                  className="progress-bar-thumb"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>
              <span className="time-label total">{formatTime(durationSec)}</span>
            </div>
          </div>

          {/* Social Links Grid */}
          <div className="social-links-grid">
              <div className="social-item-col">
                <a
                  className="social-circle-btn discord"
                  href="https://discord.com/users/882230994499948625"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast("🎮 Đang mở Discord: _gakon");
                  }}
                  title="Discord: _gakon"
                >
                  <svg viewBox="0 0 24 24" fill="#5865f2">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
                <span className="social-label">Discord</span>
              </div>

              <div className="social-item-col">
                <a
                  className="social-circle-btn spotify"
                  href="https://open.spotify.com/user/31hfwjh4pvtpsiz5wujs6fnkb4ai?si=79c4d27140014c82"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast("🎧 Đang mở Spotify: _gakon");
                  }}
                  title="Spotify: _gakon"
                >
                  <svg viewBox="0 0 24 24" fill="#1db954">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.218.358-.684.474-1.042.256-2.86-1.747-6.46-2.143-10.7-1.173-.41.094-.816-.164-.91-.574-.094-.41.164-.816.574-.91 4.636-1.06 8.604-.616 11.822 1.359.358.218.474.684.256 1.042zm1.47-3.264c-.276.448-.864.59-1.312.314-3.274-2.012-8.266-2.595-12.138-1.419-.504.153-1.041-.133-1.194-.637-.153-.504.133-1.041.637-1.194 4.428-1.344 9.923-.695 13.693 1.624.448.276.59.864.314 1.312zm.126-3.41c-3.926-2.332-10.395-2.547-14.152-1.406-.602.183-1.24-.162-1.423-.764-.183-.602.162-1.24.764-1.423 4.316-1.31 11.455-1.055 15.969 1.623.542.321.722 1.022.4 1.564-.321.542-1.022.722-1.564.4z" />
                  </svg>
                </a>
                <span className="social-label">Spotify</span>
              </div>

              <div className="social-item-col">
                <a
                  className="social-circle-btn facebook"
                  href="https://www.facebook.com/gak0nn"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast("🌐 Đang mở Facebook: Ga kon");
                  }}
                  title="Facebook: Ga kon"
                >
                  <svg viewBox="0 0 24 24" fill="#1877f2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <span className="social-label">Facebook</span>
              </div>

              <div className="social-item-col">
                <a
                  className="social-circle-btn steam"
                  href="https://steamcommunity.com/profiles/76561199245171581/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast("🎮 Đang mở Steam: _gakon");
                  }}
                  title="Steam: _gakon"
                >
                  <svg viewBox="0 0 24 24" fill="#66c0f4">
                    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.03 4.524 4.524s-2.03 4.524-4.524 4.524h-.105l-4.076 2.911c0 .052.005.105.005.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.155-3.331-2.677L.437 15.07C1.86 20.315 6.47 24 11.979 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zM8.366 17.477c-.943 0-1.708-.765-1.708-1.708 0-.944.765-1.709 1.708-1.709.944 0 1.709.765 1.709 1.709 0 .943-.765 1.708-1.709 1.708zm7.573-6.273c-1.248 0-2.261-1.014-2.261-2.262 0-1.247 1.013-2.261 2.261-2.261 1.247 0 2.262 1.014 2.262 2.261 0 1.248-1.015 2.262-2.262 2.262z" />
                  </svg>
                </a>
                <span className="social-label">Steam</span>
              </div>
            </div>

          {/* Compact Visits Footer Badge */}
          <div
            className="compact-visits-badge"
            onClick={() => showToast(`👁️ Hồ sơ đạt ${visitCount}+ lượt xem!`)}
            title="Lượt truy cập hồ sơ"
          >
            <span className="visits-icon">👁️</span>
            <span className="visits-text">{visitCount}+ Visits</span>
          </div>
        </div>
      </div>

      {/* Floating Vision HUD Notification */}
      {toast && (
        <div className="vision-hud-toast">
          <span>✨</span>
          <span>{toast}</span>
        </div>
      )}
    </Container>
  );
};

export default memo(Gakon);
