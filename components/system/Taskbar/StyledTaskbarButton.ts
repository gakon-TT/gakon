import styled from "styled-components";
import Button from "styles/common/Button";

type StyledTaskbarButtonProps = {
  $active: boolean;
  $highlight?: boolean;
  $left?: number;
};

const StyledTaskbarButton = styled(Button)<StyledTaskbarButtonProps>`
  align-items: center;
  background-color: transparent;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  height: 48px;
  justify-content: center;
  min-width: 48px;
  padding: 0;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.2, 1);
  width: 48px;

  svg {
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
    height: 40px;
    width: 40px;
  }

  &:hover {
    transform: scale(1.18) translateY(-6px);
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: 768px) {
    height: 38px;
    min-width: 38px;
    width: 38px;

    svg {
      height: 32px;
      width: 32px;
    }
  }
`;

export default StyledTaskbarButton;

