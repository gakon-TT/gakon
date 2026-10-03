import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  100% {
    opacity: 1;
    backdrop-filter: blur(48px) saturate(180%) brightness(0.72);
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

export const StyledLockScreen = styled.div<{ $isUnlocking?: boolean }>`
  align-items: center;
  animation: ${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  backdrop-filter: blur(48px) saturate(180%) brightness(0.72);
  -webkit-backdrop-filter: blur(48px) saturate(180%) brightness(0.72);
  background: radial-gradient(
    ellipse at 50% 25%,
    rgba(15, 10, 30, 0.45) 0%,
    rgba(5, 3, 12, 0.78) 100%
  );
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif;
  height: 100vh;
  justify-content: flex-start;
  left: 0;
  padding: 48px 24px 36px;
  position: fixed;
  top: 0;
  user-select: none;
  width: 100vw;
  z-index: 999999;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: ${({ $isUnlocking }) => ($isUnlocking ? "none" : "auto")};

  ${({ $isUnlocking }) =>
    $isUnlocking &&
    `
    opacity: 0;
    transform: scale(1.08);
    filter: blur(20px);
  `}

  /* Top Right Status Icons */
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
    opacity: 0.9;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);

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

  /* Center Clock and Date Header */
  .clock-section {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    text-align: center;
    cursor: default;

    .lock-time {
      font-size: 88px;
      font-weight: 200;
      letter-spacing: -2px;
      line-height: 1;
      text-shadow: 0 4px 32px rgba(0, 0, 0, 0.7);
    }

    .lock-date {
      font-size: 21px;
      font-weight: 500;
      letter-spacing: 0.2px;
      margin-top: 8px;
      opacity: 0.92;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
    }
  }

  /* Main User Profile Card */
  .user-section {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: auto 0;
    transform: translateY(-20px);

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
      display: flex;
      flex-shrink: 0;
      height: 112px;
      justify-content: center;
      margin-bottom: 18px;
      padding: 3.5px;
      position: relative;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      width: 112px;

      &:hover {
        transform: scale(1.05);
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
      margin-bottom: 18px;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);

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
      margin-top: -12px;
      margin-bottom: 20px;
      text-shadow: 0 1px 8px rgba(0, 0, 0, 0.7);
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
      height: 48px;
      justify-content: center;
      letter-spacing: 0.3px;
      padding: 0 28px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

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
`;
