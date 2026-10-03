import { m as motion } from "motion/react";
import styled from "styled-components";
import Button from "styles/common/Button";

type StyledTaskbarEntryProps = {
  $foreground: boolean;
  $progress?: number;
};

const StyledTaskbarEntry = styled(motion.li)<StyledTaskbarEntryProps>`
  align-items: center;
  display: flex;
  height: 48px;
  justify-content: center;
  min-width: 48px;
  overflow: visible;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.2, 1);
  width: 48px;

  &::after {
    background-color: ${({ $foreground }) =>
      $foreground ? "#ffffff" : "rgba(255, 255, 255, 0.65)"};
    border-radius: 50%;
    bottom: -3px;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.9);
    content: "";
    height: 4px;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
    width: 4px;
  }

  &:hover {
    transform: scale(1.18) translateY(-6px);
  }

  &:active {
    transform: scale(0.96);
  }

  figure {
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;

    figcaption {
      display: none;
    }

    picture {
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
      height: 38px;
      position: relative;
      width: 38px;
    }
  }

  > ${Button} {
    align-items: center;
    background: transparent;
    border-radius: 12px;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;

    figure {
      width: 100%;
    }
  }
`;

export default StyledTaskbarEntry;

