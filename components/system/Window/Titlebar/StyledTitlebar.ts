import styled from "styled-components";

type StyledTitlebarProps = {
  $foreground: boolean;
};

const StyledTitlebar = styled.header<StyledTitlebarProps>`
  align-items: center;
  background: ${({ $foreground }) =>
    $foreground
      ? "linear-gradient(180deg, #323236 0%, #252528 100%)"
      : "linear-gradient(180deg, #28282b 0%, #1e1e20 100%)"};
  border-bottom: 1px solid rgba(0, 0, 0, 0.45);
  display: flex;
  height: ${({ theme }) => theme.sizes.titleBar.height || 32}px;
  position: relative;
  top: 0;
  user-select: none;
  z-index: 2;

  nav.macos-controls {
    align-items: center;
    display: flex;
    gap: 8px;
    padding-left: 12px;
    z-index: 3;

    button {
      align-items: center;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      height: 12px;
      justify-content: center;
      min-width: 12px;
      padding: 0;
      position: relative;
      transition: filter 0.15s ease, transform 0.1s ease;
      width: 12px;

      svg {
        height: 8px;
        opacity: 0;
        transition: opacity 0.15s ease;
        width: 8px;
      }

      &.close {
        background-color: ${({ $foreground }) =>
          $foreground ? "#ff5f56" : "#696969"};
        border: 1px solid
          ${({ $foreground }) => ($foreground ? "#e0443e" : "#555")};
        color: #4d0000;
      }

      &.minimize {
        background-color: ${({ $foreground }) =>
          $foreground ? "#ffbd2e" : "#696969"};
        border: 1px solid
          ${({ $foreground }) => ($foreground ? "#dea123" : "#555")};
        color: #5e3b00;
      }

      &.maximize {
        background-color: ${({ $foreground }) =>
          $foreground ? "#27c93f" : "#696969"};
        border: 1px solid
          ${({ $foreground }) => ($foreground ? "#1aab29" : "#555")};
        color: #004d00;
      }

      &:active {
        transform: scale(0.92);
      }
    }

    &:hover button svg {
      opacity: 1;
    }
  }

  > button.title-button {
    align-items: center;
    color: ${({ $foreground }) => ($foreground ? "#f5f5f7" : "#86868b")};
    display: flex;
    flex-grow: 1;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
      Roboto, sans-serif;
    font-size: 13px;
    font-weight: 500;
    justify-content: center;
    letter-spacing: -0.01em;
    min-width: 0;
    text-align: center;

    figure {
      align-items: center;
      display: flex;
      gap: 6px;
      justify-content: center;
      margin: 0;
      pointer-events: none;
      position: relative;

      picture {
        height: ${({ theme }) => theme.sizes.titleBar.iconSize};
        width: ${({ theme }) => theme.sizes.titleBar.iconSize};
      }

      img,
      picture {
        pointer-events: all;
      }

      figcaption {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .title-spacer {
    pointer-events: none;
    width: 68px;
  }
`;

export default StyledTitlebar;

