import styled from "styled-components";

export const StyledTopBar = styled.header`
  align-items: center;
  background: transparent;
  border-bottom: none;
  color: #f5f5f7;
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  height: 28px;
  justify-content: space-between;
  left: 0;
  padding: 0 10px;
  position: fixed;
  right: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.75);
  top: 0;
  user-select: none;
  width: 100vw;
  z-index: 100000;

  svg {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.7));
  }

  .left-section,
  .right-section {
    align-items: center;
    display: flex;
    gap: 2px;
    height: 100%;
  }

  .apple-logo-btn {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    display: flex;
    height: 22px;
    justify-content: center;
    padding: 0 8px;
    transition: background 0.15s ease;

    svg {
      fill: currentColor;
      height: 14px;
      width: 14px;
    }

    &:hover,
    &.active {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .app-name {
    align-items: center;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    font-weight: 700;
    height: 22px;
    padding: 0 8px;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  .menu-item {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    display: flex;
    font-family: inherit;
    font-size: 13px;
    font-weight: 400;
    height: 22px;
    padding: 0 8px;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  .status-icon-btn {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.92);
    cursor: pointer;
    display: flex;
    font-family: inherit;
    font-size: 12px;
    gap: 5px;
    height: 22px;
    padding: 0 6px;
    transition: background 0.15s ease;

    svg {
      fill: currentColor;
      height: 14px;
      width: 14px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  .clock-btn {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.95);
    cursor: pointer;
    display: flex;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    height: 22px;
    letter-spacing: -0.01em;
    padding: 0 8px;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`;

export const StyledAppleMenu = styled.div<{ $left?: string; $right?: string }>`
  background: rgba(30, 30, 34, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
  font-size: 13px;
  left: ${({ $left, $right }) => ($right ? "auto" : $left || "8px")};
  right: ${({ $right }) => $right || "auto"};
  min-width: 220px;
  padding: 5px;
  position: fixed;
  top: 32px;
  z-index: 100002;

  .menu-entry {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 5px;
    color: rgba(255, 255, 255, 0.92);
    cursor: pointer;
    display: flex;
    font-family: inherit;
    font-size: 13px;
    justify-content: space-between;
    padding: 5px 12px;
    text-align: left;
    width: 100%;

    &:hover {
      background: #007aff;
      color: #fff;
    }
  }

  .divider {
    background: rgba(255, 255, 255, 0.12);
    height: 1px;
    margin: 4px 6px;
  }
`;

export const StyledAboutModal = styled.div`
  align-items: center;
  background: rgba(30, 30, 34, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  box-shadow: 0 25px 65px rgba(0, 0, 0, 0.6);
  color: #f5f5f7;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
  left: 50%;
  padding: 30px 40px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 380px;
  z-index: 100005;

  .close-icon-btn {
    background: transparent;
    border: none;
    color: #8e8e93;
    cursor: pointer;
    font-size: 16px;
    position: absolute;
    right: 14px;
    top: 14px;

    &:hover {
      color: #fff;
    }
  }

  .apple-icon-big {
    fill: #f5f5f7;
    height: 64px;
    margin-bottom: 16px;
    width: 64px;
  }

  h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 6px;
  }

  .sub {
    color: #8e8e93;
    font-size: 12px;
    margin-bottom: 20px;
  }

  .info-table {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;

    .info-row {
      display: flex;
      font-size: 12px;
      justify-content: space-between;

      .label {
        color: #8e8e93;
      }

      .value {
        color: #f5f5f7;
        font-weight: 500;
      }
    }
  }
`;
