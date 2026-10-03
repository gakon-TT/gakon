import styled from "styled-components";

type StyledClockProps = {
  $hasAI: boolean;
  $width: number;
};

const StyledClock = styled.button.attrs({
  type: "button",
})<StyledClockProps>`
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  height: 48px;
  justify-content: center;
  padding: 0;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.2, 1);
  width: 48px;

  canvas {
    display: none !important;
  }

  &:hover {
    transform: scale(1.18) translateY(-6px);
  }

  &:active {
    transform: scale(0.96);
  }
`;

export default StyledClock;

