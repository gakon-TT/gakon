import styled from "styled-components";

type StyledTaskbarEntriesProps = {
  $clockWidth: number;
  $hasAI: boolean;
};

const StyledTaskbarEntries = styled.ol<StyledTaskbarEntriesProps>`
  align-items: center;
  column-gap: 6px;
  display: flex;
  height: 100%;
  margin: 0;
  overflow: visible;
  position: relative;
`;

export default StyledTaskbarEntries;

