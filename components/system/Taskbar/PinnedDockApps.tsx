import { type FC, memo, useCallback } from "react";
import styled from "styled-components";
import {
  AppStoreIcon,
  DownloadsIcon,
  MessagesIcon,
  MusicIcon,
  NotesIcon,
  PhotosIcon,
  SafariIcon,
  SettingsIcon,
  TerminalIcon,
  TrashIcon,
} from "components/system/Taskbar/DockIcons";
import StyledTaskbarButton from "components/system/Taskbar/StyledTaskbarButton";
import { useProcesses, useProcessesActions } from "contexts/process";
import { useForegroundId, useSessionActions } from "contexts/session";

const DockItemWrapper = styled.div<{ $isRunning?: boolean }>`
  align-items: center;
  display: flex;
  height: 48px;
  justify-content: center;
  position: relative;
  width: 48px;

  ${({ $isRunning }) =>
    $isRunning &&
    `
    &::after {
      background-color: #ffffff;
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
  `}
`;

export const DockDivider = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
  height: 36px;
  margin: 0 2px;
  width: 1px;
`;

type PinnedDockAppsProps = {
  calendarVisible: boolean;
  toggleCalendar: () => void;
};

export const PINNED_PROCESS_IDS = new Set([
  "Browser",
  "Gakon",
  "MacMessages",
  "Photos",
  "MacNotes",
  "MacMusic",
  "Terminal",
  "DevTools",
  "MacSettings",
]);

const PinnedDockApps: FC<PinnedDockAppsProps> = ({
  calendarVisible,
  toggleCalendar,
}) => {
  const processes = useProcesses();
  const foregroundId = useForegroundId();
  const { setForegroundId } = useSessionActions();
  const { minimize, open } = useProcessesActions();

  const handleAppClick = useCallback(
    (pid: string, defaultUrl?: string) => {
      const isRunning = Boolean(processes[pid]);
      if (isRunning) {
        if (foregroundId === pid) {
          minimize(pid);
        } else {
          setForegroundId(pid);
        }
      } else {
        open(pid, defaultUrl ? { url: defaultUrl } : undefined);
      }
    },
    [foregroundId, minimize, open, processes, setForegroundId]
  );

  const today = new Date();
  const month = today.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = today.getDate();

  return (
    <>
      {/* Safari */}
      <DockItemWrapper $isRunning={Boolean(processes.Browser)}>
        <StyledTaskbarButton
          $active={processes.Browser && foregroundId === "Browser"}
          onClick={() => handleAppClick("Browser", "safari:startpage")}
          title="Safari"
          type="button"
        >
          <SafariIcon />
        </StyledTaskbarButton>
      </DockItemWrapper>

      {/* Messages */}
      <DockItemWrapper $isRunning={Boolean(processes.MacMessages)}>
        <StyledTaskbarButton
          $active={processes.MacMessages && foregroundId === "MacMessages"}
          onClick={() => handleAppClick("MacMessages")}
          title="Tin nhắn (Messages)"
          type="button"
        >
          <MessagesIcon />
        </StyledTaskbarButton>
      </DockItemWrapper>

      {/* Photos */}
      <DockItemWrapper $isRunning={Boolean(processes.Photos)}>
        <StyledTaskbarButton
          $active={processes.Photos && foregroundId === "Photos"}
          onClick={() => handleAppClick("Photos")}
          title="Ảnh (Photos)"
          type="button"
        >
          <PhotosIcon />
        </StyledTaskbarButton>
      </DockItemWrapper>

      {/* Notes */}
      <DockItemWrapper $isRunning={Boolean(processes.MacNotes)}>
        <StyledTaskbarButton
          $active={processes.MacNotes && foregroundId === "MacNotes"}
          onClick={() => handleAppClick("MacNotes")}
          title="Ghi chú (Notes)"
          type="button"
        >
          <NotesIcon />
        </StyledTaskbarButton>
      </DockItemWrapper>

      {/* Music */}
      <DockItemWrapper $isRunning={Boolean(processes.MacMusic)}>
        <StyledTaskbarButton
          $active={processes.MacMusic && foregroundId === "MacMusic"}
          onClick={() => handleAppClick("MacMusic")}
          title="Nhạc (Apple Music)"
          type="button"
        >
          <MusicIcon />
        </StyledTaskbarButton>
      </DockItemWrapper>

      {/* Gakon Bio App */}
      <DockItemWrapper $isRunning={Boolean(processes.Gakon)}>
        <StyledTaskbarButton
          $active={processes.Gakon && foregroundId === "Gakon"}
          onClick={() => handleAppClick("Gakon")}
          title="Ga kon"
          type="button"
        >
          <img
            src="/System/Icons/gakon.png"
            alt="Gakon"
            style={{
              borderRadius: "50%",
              border: "2px solid #ff2a85",
              boxShadow: "0 0 10px rgba(255, 42, 133, 0.7)",
              height: 44,
              objectFit: "cover",
              width: 44,
            }}
          />
        </StyledTaskbarButton>
      </DockItemWrapper>

      {/* Terminal */}
      <DockItemWrapper $isRunning={Boolean(processes.Terminal)}>
        <StyledTaskbarButton
          $active={processes.Terminal && foregroundId === "Terminal"}
          onClick={() => handleAppClick("Terminal")}
          title="Terminal"
          type="button"
        >
          <TerminalIcon />
        </StyledTaskbarButton>
      </DockItemWrapper>

      {/* Calendar */}
      <DockItemWrapper $isRunning={calendarVisible}>
        <StyledTaskbarButton
          $active={calendarVisible}
          onClick={() => toggleCalendar()}
          title="Lịch (Calendar)"
          type="button"
        >
          <div
            style={{
              alignItems: "center",
              background: "#ffffff",
              borderRadius: 11,
              boxShadow: "0 3px 8px rgba(0,0,0,0.35)",
              display: "flex",
              flexDirection: "column",
              height: 40,
              overflow: "hidden",
              width: 40,
            }}
          >
            <div
              style={{
                background: "#ff3b30",
                color: "#ffffff",
                fontSize: 8,
                fontWeight: 800,
                height: 12,
                letterSpacing: "0.5px",
                lineHeight: "12px",
                textAlign: "center",
                width: "100%",
              }}
            >
              {month}
            </div>
            <div
              style={{
                alignItems: "center",
                color: "#1c1c1e",
                display: "flex",
                flex: 1,
                fontSize: 19,
                fontWeight: 600,
                justifyContent: "center",
              }}
            >
              {day}
            </div>
          </div>
        </StyledTaskbarButton>
      </DockItemWrapper>

      {/* App Store */}
      <DockItemWrapper $isRunning={Boolean(processes.DevTools)}>
        <StyledTaskbarButton
          $active={processes.DevTools && foregroundId === "DevTools"}
          onClick={() => handleAppClick("DevTools")}
          title="App Store"
          type="button"
        >
          <AppStoreIcon />
        </StyledTaskbarButton>
      </DockItemWrapper>

      {/* System Settings */}
      <DockItemWrapper $isRunning={Boolean(processes.MacSettings)}>
        <StyledTaskbarButton
          $active={processes.MacSettings && foregroundId === "MacSettings"}
          onClick={() => handleAppClick("MacSettings")}
          title="Cài đặt hệ thống (System Settings)"
          type="button"
        >
          <SettingsIcon />
        </StyledTaskbarButton>
      </DockItemWrapper>

      {/* Divider */}
      <DockDivider />

      {/* Downloads Folder */}
      <DockItemWrapper>
        <StyledTaskbarButton
          $active={false}
          onClick={() => handleAppClick("FileExplorer", "/Users/Public")}
          title="Tải về (Downloads)"
          type="button"
        >
          <DownloadsIcon />
        </StyledTaskbarButton>
      </DockItemWrapper>

      {/* Trash */}
      <DockItemWrapper>
        <StyledTaskbarButton
          $active={false}
          onClick={() => handleAppClick("FileExplorer", "/Users/Public/Desktop")}
          title="Thùng rác (Trash)"
          type="button"
        >
          <TrashIcon />
        </StyledTaskbarButton>
      </DockItemWrapper>
    </>
  );
};

export default memo(PinnedDockApps);
