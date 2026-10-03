import { memo, useCallback } from "react";
import StartButtonIcon from "components/system/Taskbar/StartButton/StartButtonIcon";
import StyledTaskbarButton from "components/system/Taskbar/StyledTaskbarButton";
import useTaskbarContextMenu from "components/system/Taskbar/useTaskbarContextMenu";
import { useProcessesActions } from "contexts/process";
import { CLICK_FOCUSABLE_ELEMENT } from "utils/constants";
import { label } from "utils/functions";

type StartButtonProps = {
  startMenuVisible: boolean;
  toggleStartMenu: (showMenu?: boolean) => void;
};

const StartButton: FC<StartButtonProps> = () => {
  const { open } = useProcessesActions();
  const onClick = useCallback((): void => {
    open("FileExplorer");
  }, [open]);

  return (
    <StyledTaskbarButton
      $active={false}
      onClick={onClick}
      {...CLICK_FOCUSABLE_ELEMENT}
      {...label("Finder")}
      {...useTaskbarContextMenu(true)}
    >
      <StartButtonIcon />
    </StyledTaskbarButton>
  );
};


export default memo(StartButton);
