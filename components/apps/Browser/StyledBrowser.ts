import styled from "styled-components";

type StyledBrowserProps = {
  $hasSrcDoc: boolean;
  $sidebarOpen: boolean;
};

const StyledBrowser = styled.div<StyledBrowserProps>`
  background-color: #1a1a1d;
  color: #f5f5f7;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif;
  height: 100%;
  overflow: hidden;
  position: relative;
  user-select: none;
  width: 100%;

  /* Safari Top Toolbar */
  .safari-toolbar {
    align-items: center;
    background: linear-gradient(180deg, #323236 0%, #28282b 100%);
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    display: flex;
    gap: 8px;
    height: 48px;
    padding: 0 10px;
    position: relative;
    z-index: 10;

    .toolbar-group {
      align-items: center;
      display: flex;
      gap: 4px;

      &.left {
        min-width: 108px;
      }

      &.right {
        gap: 3px;
        justify-content: flex-end;
        min-width: 120px;
      }
    }

    button.safari-tool-btn {
      align-items: center;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 6px;
      color: #d1d1d6;
      cursor: pointer;
      display: flex;
      height: 28px;
      justify-content: center;
      padding: 0;
      transition: all 0.15s ease;
      width: 28px;

      svg {
        stroke: currentColor;
        transition: transform 0.1s ease;
      }

      &:hover:not(:disabled) {
        background-color: rgba(255, 255, 255, 0.12);
        color: #ffffff;
      }

      &:active:not(:disabled) {
        background-color: rgba(255, 255, 255, 0.18);
        transform: scale(0.95);
      }

      &:disabled {
        color: rgba(255, 255, 255, 0.25);
        cursor: default;
      }

      &.active {
        background-color: rgba(0, 122, 255, 0.25);
        border-color: rgba(0, 122, 255, 0.4);
        color: #2997ff;
      }
    }

    /* Safari Smart Search Address Capsule */
    .safari-address-capsule {
      align-items: center;
      background: rgba(0, 0, 0, 0.28);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.35);
      cursor: text;
      display: flex;
      flex: 1;
      height: 30px;
      max-width: 620px;
      margin: 0 auto;
      padding: 0 8px;
      position: relative;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        background: rgba(0, 0, 0, 0.36);
        border-color: rgba(255, 255, 255, 0.18);
      }

      &.is-focused {
        background: rgba(18, 18, 20, 0.95);
        border-color: #007aff;
        box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.35),
          inset 0 1px 2px rgba(0, 0, 0, 0.4);
      }

      .capsule-icon-left {
        align-items: center;
        color: #8e8e93;
        display: flex;
        justify-content: center;
        margin-right: 6px;
        min-width: 16px;

        &.secure {
          color: #30d158;
        }
      }

      .capsule-display {
        align-items: center;
        color: #ffffff;
        display: flex;
        flex: 1;
        font-size: 13px;
        font-weight: 400;
        justify-content: center;
        letter-spacing: -0.01em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .domain-bold {
          font-weight: 500;
        }

        .path-dimmed {
          color: #8e8e93;
          font-size: 12px;
          margin-left: 2px;
        }
      }

      input.safari-address-input {
        background: transparent;
        border: none;
        color: #ffffff;
        flex: 1;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
          sans-serif;
        font-size: 13px;
        height: 100%;
        outline: none;
        padding: 0;
        text-align: left;
        width: 100%;

        &::selection {
          background-color: #007aff;
          color: #ffffff;
        }
      }

      button.capsule-action-btn {
        align-items: center;
        background: transparent;
        border: none;
        border-radius: 4px;
        color: #8e8e93;
        cursor: pointer;
        display: flex;
        height: 20px;
        justify-content: center;
        margin-left: 4px;
        padding: 0;
        transition: color 0.15s ease, background 0.15s ease;
        width: 20px;

        &:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        svg {
          stroke: currentColor;
        }

        .spin-loader {
          animation: safariSpin 0.9s linear infinite;
        }
      }
    }
  }

  /* Safari Tab Bar */
  .safari-tabs-bar {
    align-items: flex-end;
    background: #202023;
    border-bottom: 1px solid rgba(0, 0, 0, 0.45);
    display: flex;
    height: 32px;
    overflow-x: auto;
    padding: 0 8px 0 10px;
    user-select: none;
    z-index: 9;

    &::-webkit-scrollbar {
      display: none;
    }

    .safari-tab {
      align-items: center;
      background: #1c1c1e;
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-bottom: none;
      border-radius: 7px 7px 0 0;
      color: #98989f;
      cursor: pointer;
      display: flex;
      font-size: 12px;
      font-weight: 400;
      height: 27px;
      margin-right: 4px;
      max-width: 200px;
      min-width: 110px;
      padding: 0 6px 0 10px;
      position: relative;
      transition: all 0.15s ease;

      &:hover:not(.active) {
        background: #27272b;
        color: #d1d1d6;
      }

      &.active {
        background: #2e2e32;
        border-color: rgba(255, 255, 255, 0.12);
        border-bottom: 1px solid #2e2e32;
        color: #ffffff;
        font-weight: 500;
        margin-bottom: -1px;
        z-index: 2;

        &::after {
          background: #007aff;
          border-radius: 2px 2px 0 0;
          content: "";
          height: 2px;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }
      }

      .tab-favicon {
        align-items: center;
        display: flex;
        height: 14px;
        justify-content: center;
        margin-right: 6px;
        min-width: 14px;
        width: 14px;

        img {
          height: 14px;
          width: 14px;
        }

        .default-icon {
          color: #007aff;
          font-size: 11px;
        }
      }

      .tab-title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .tab-close-btn {
        align-items: center;
        background: transparent;
        border: none;
        border-radius: 50%;
        color: #8e8e93;
        cursor: pointer;
        display: flex;
        height: 16px;
        justify-content: center;
        margin-left: 4px;
        opacity: 0.6;
        padding: 0;
        transition: opacity 0.12s ease, background 0.12s ease;
        width: 16px;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          opacity: 1;
        }
      }
    }

    .safari-add-tab-btn {
      align-items: center;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: #98989f;
      cursor: pointer;
      display: flex;
      height: 22px;
      justify-content: center;
      margin-bottom: 2px;
      margin-left: 2px;
      padding: 0;
      transition: all 0.15s ease;
      width: 22px;

      &:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
      }
    }
  }

  /* Safari Favorites Bar */
  .safari-favorites-bar {
    align-items: center;
    background: #19191c;
    border-bottom: 1px solid rgba(0, 0, 0, 0.35);
    display: flex;
    gap: 2px;
    height: 26px;
    overflow-x: auto;
    padding: 0 10px;
    user-select: none;
    z-index: 8;

    &::-webkit-scrollbar {
      display: none;
    }

    button.favorite-pill {
      align-items: center;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: #b0b0b8;
      cursor: pointer;
      display: flex;
      font-size: 11.5px;
      gap: 5px;
      height: 20px;
      padding: 0 7px;
      transition: background 0.12s ease, color 0.12s ease;
      white-space: nowrap;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
      }

      &:active {
        background: rgba(255, 255, 255, 0.15);
      }

      img {
        border-radius: 2px;
        height: 12px;
        width: 12px;
      }
    }
  }

  /* Main Browser Body (Sidebar + Content) */
  .safari-main-body {
    display: flex;
    flex: 1;
    height: calc(100% - 48px - 32px - 26px);
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  /* Safari Sidebar */
  .safari-sidebar {
    background: #1e1e21;
    border-right: 1px solid rgba(0, 0, 0, 0.4);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    padding: 12px 10px;
    transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.2s ease;
    width: ${({ $sidebarOpen }) => ($sidebarOpen ? "220px" : "0px")};
    opacity: ${({ $sidebarOpen }) => ($sidebarOpen ? 1 : 0)};
    pointer-events: ${({ $sidebarOpen }) => ($sidebarOpen ? "auto" : "none")};
    z-index: 15;

    .sidebar-header {
      color: #8e8e93;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
      margin-bottom: 8px;
      padding: 0 6px;
      text-transform: uppercase;
    }

    .sidebar-item {
      align-items: center;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: #d1d1d6;
      cursor: pointer;
      display: flex;
      font-size: 12.5px;
      gap: 8px;
      padding: 6px 8px;
      text-align: left;
      transition: background 0.12s ease, color 0.12s ease;
      width: 100%;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
      }

      &.active {
        background: #007aff;
        color: #ffffff;
      }

      img {
        height: 14px;
        width: 14px;
      }

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .sidebar-divider {
      background: rgba(255, 255, 255, 0.08);
      height: 1px;
      margin: 10px 0;
    }
  }

  /* Content Area */
  .safari-content-area {
    background-color: ${({ $hasSrcDoc }) => ($hasSrcDoc ? "#fff" : "#121214")};
    flex: 1;
    height: 100%;
    position: relative;
    width: 100%;

    iframe {
      border: none;
      height: 100%;
      width: 100%;
    }
  }

  /* Notification Toast */
  .safari-toast {
    animation: safariToastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    background: rgba(30, 30, 34, 0.92);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;
    bottom: 24px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
    color: #ffffff;
    font-size: 12.5px;
    font-weight: 500;
    left: 50%;
    padding: 8px 16px;
    pointer-events: none;
    position: absolute;
    transform: translateX(-50%);
    z-index: 99;
  }

  @keyframes safariSpin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes safariToastIn {
    from {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

export default StyledBrowser;
