import { m as motion } from "motion/react";
import styled from "styled-components";
import StyledLoading from "components/system/Apps/StyledLoading";

type StyledWindowProps = {
  $backgroundBlur?: string;
  $backgroundColor?: string;
  $isForeground: boolean;
};

const StyledWindow = styled(motion.section)<StyledWindowProps>`
  background-color: ${({ $backgroundColor, theme }) =>
    $backgroundColor || theme.colors.window.background};
  border-radius: 12px;
  box-shadow: ${({ $isForeground }) =>
    $isForeground
      ? "0 22px 60px rgba(0, 0, 0, 0.52), 0 0 0 1px rgba(255, 255, 255, 0.15)"
      : "0 10px 30px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08)"};
  contain: strict;
  height: 100%;
  outline: none;
  overflow: hidden;
  position: absolute;
  width: 100%;

  header + * {
    height: ${({ theme }) => `calc(100% - ${theme.sizes.titleBar.height}px)`};
  }

  ${StyledLoading} {
    backdrop-filter: ${({ $backgroundBlur }) =>
      $backgroundBlur ? `blur(${$backgroundBlur})` : undefined};
  }
`;

export default StyledWindow;
