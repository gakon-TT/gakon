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
`;

export default StyledTaskbar;

