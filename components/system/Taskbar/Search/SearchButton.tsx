import { memo, useCallback } from "react";
import { useTheme } from "styled-components";
import {
  importSearch,
  SEARCH_BUTTON_TITLE,
} from "components/system/Taskbar/functions";
import StyledSearchButton from "components/system/Taskbar/Search/StyledSearchButton";
import useTaskbarContextMenu from "components/system/Taskbar/useTaskbarContextMenu";
import { useMenuPreload } from "hooks/useMenuPreload";
import { CLICK_FOCUSABLE_ELEMENT } from "utils/constants";
import { label } from "utils/functions";

type StartButtonProps = {
  searchVisible: boolean;
  toggleSearch: (showMenu?: boolean) => void;
};

const SearchIcon = memo(() => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="launchpadBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4f4f56" />
        <stop offset="100%" stopColor="#2c2c30" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#launchpadBg)" />
    <path
      d="M50 20 C60 35 62 55 60 66 L40 66 C38 55 40 35 50 20 Z"
      fill="#f5f5f7"
    />
    <circle cx="50" cy="42" r="5" fill="#30b4f8" />
    <path d="M40 55 L28 66 L39 66 Z" fill="#e03e3e" />
    <path d="M60 55 L72 66 L61 66 Z" fill="#e03e3e" />
    <path d="M44 68 Q50 82 56 68 Z" fill="#ff9f0a" />
  </svg>
));

const SearchButton: FC<StartButtonProps> = ({
  searchVisible,
  toggleSearch,
}) => {
  const onClick = useCallback(() => toggleSearch(), [toggleSearch]);

  return (
    <StyledSearchButton
      $active={searchVisible}
      aria-expanded={searchVisible}
      aria-haspopup="dialog"
      {...(searchVisible && { "aria-controls": "searchMenu" })}
      onClick={onClick}
      {...CLICK_FOCUSABLE_ELEMENT}
      {...label("Launchpad")}
      {...useTaskbarContextMenu()}
      {...useMenuPreload(importSearch)}
    >
      <SearchIcon />
    </StyledSearchButton>
  );
};

export default memo(SearchButton);

