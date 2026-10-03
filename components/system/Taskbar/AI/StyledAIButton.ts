import styled from "styled-components";

const StyledAIButton = styled.button.attrs({ type: "button" })`
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

  svg {
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
    height: 38px;
    width: 38px;
  }

  &:hover {
    transform: scale(1.18) translateY(-6px);
  }

  &:active {
    transform: scale(0.96);
  }
`;


export default StyledAIButton;
