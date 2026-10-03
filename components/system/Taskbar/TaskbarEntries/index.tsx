import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { type FC, memo } from "react";
import { PINNED_PROCESS_IDS } from "components/system/Taskbar/PinnedDockApps";
import StyledTaskbarEntries from "components/system/Taskbar/TaskbarEntries/StyledTaskbarEntries";
import { useProcesses } from "contexts/process";

const TaskbarEntry = dynamic(
  () => import("components/system/Taskbar/TaskbarEntry")
);

type TaskbarEntriesProps = {
  clockWidth: number;
  hasAI: boolean;
};

const TaskbarEntries: FC<TaskbarEntriesProps> = ({ clockWidth, hasAI }) => {
  const processes = useProcesses();

  return (
    <StyledTaskbarEntries
      $clockWidth={clockWidth}
      $hasAI={hasAI}
      aria-label="Running applications"
    >
      <AnimatePresence initial={false} presenceAffectsLayout={false}>
        {Object.entries(processes)
          .filter(
            ([id, { closing, hideTaskbarEntry }]) =>
              !closing &&
              !hideTaskbarEntry &&
              !PINNED_PROCESS_IDS.has(id.split("__")[0])
          )
          .map(([id, { icon, title }]) => (
            <TaskbarEntry key={id} icon={icon} id={id} title={title} />
          ))}
      </AnimatePresence>
    </StyledTaskbarEntries>
  );
};


export default memo(TaskbarEntries);
