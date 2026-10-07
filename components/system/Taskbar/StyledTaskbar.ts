import styled from "styled-components";

const TASKBAR_Z_INDEX = 100000;

const StyledTaskbar = styled.nav`
  align-items: center;
  background: rgba(26, 26, 32, 0.68);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 20px;
  bottom: 10px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.28);
  display: flex;
  gap: 8px;
  height: 60px;
  justify-content: center;
  left: 50%;
  max-width: 92vw;
  padding: 0 12px;
  position: fixed;
  transform: translateX(-50%);
  width: max-content;
  z-index: ${TASKBAR_Z_INDEX};

  &::after {
    display: none;
  }

  @media (max-width: 768px) {
    background: rgba(28, 28, 38, 0.76);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 22px;
    bottom: 14px;
    box-shadow: 0 16px 45px rgba(0, 0, 0, 0.55), inset 0 1px 1.5px rgba(255, 255, 255, 0.35);
    gap: 6px;
    height: 54px;
    justify-content: flex-start;
    max-width: 96vw;
    overflow-x: auto;
    padding: 0 8px;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const IPadHomeBar = styled.div`
  display: none;

  @media (max-width: 768px) {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    border-radius: 10px;
    bottom: 3px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    display: block;
    height: 5px;
    left: 50%;
    pointer-events: none;
    position: fixed;
    transform: translateX(-50%);
    width: 134px;
    z-index: 100005;
  }
`;

export default StyledTaskbar;

