import { useEffect, useRef } from "react";
import { getProcessByFileExtension } from "components/system/Files/FileEntry/functions";
import { useFileSystemActions, useFs } from "contexts/fileSystem";
import { useProcessesActions } from "contexts/process";
import processDirectory from "contexts/process/directory";
import { useSessionActions } from "contexts/session";
import { getExtension, getSearchParam, isYouTubeUrl } from "utils/functions";

const isBrowserUrl = (url: string): boolean =>
  url.startsWith("http://") ||
  url.startsWith("https://") ||
  url.startsWith("chrome://");

const useUrlLoader = (): void => {
  const { exists, stat } = useFileSystemActions();
  const fs = useFs();
  const { open } = useProcessesActions();
  const { setWindowStates } = useSessionActions();
  const loadedInitialAppRef = useRef(false);
  const terminalTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(
    () => () => {
      if (terminalTimerRef.current) {
        clearTimeout(terminalTimerRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (loadedInitialAppRef.current || !fs || !exists || !open) return;

    const startInitialApps = (): void => {
      if (loadedInitialAppRef.current) return;
      loadedInitialAppRef.current = true;

      const app = getSearchParam("app");
      const url = getSearchParam("url");

      const loadInitialApp = async (initialApp: string): Promise<void> => {
        if (!initialApp) return;

        let urlExists = false;

        try {
          urlExists =
            (initialApp === "Browser" && isBrowserUrl(url)) ||
            (initialApp === "VideoPlayer" && isYouTubeUrl(url)) ||
            (await exists(url));
        } catch {
          // Ignore error checking if url exists
        }

        if (initialApp === "FileExplorer" && url && !urlExists) return;

        if (initialApp === "Gakon") {
          const vw = typeof window === "undefined" ? 1440 : window.innerWidth;
          const vh = typeof window === "undefined" ? 900 : window.innerHeight;
          const isLaptop = vh < 820 || vw < 1500;
          const width = isLaptop
            ? Math.max(340, Math.min(390, Math.round(vw * 0.32)))
            : 480;
          const maxAllowedHeight = Math.max(360, vh - 115);
          const height = isLaptop
            ? Math.min(480, maxAllowedHeight)
            : Math.min(720, vh - 110);
          const x = isLaptop
            ? Math.max(20, Math.min(vw - width - 25, Math.round(vw * 0.54)))
            : Math.max(20, Math.min(vw - width - 35, Math.round(vw * 0.55)));
          const y = 34;

          setWindowStates((prev) => ({
            ...prev,
            Gakon: {
              ...prev?.Gakon,
              position: { x, y },
              size: { height, width },
            },
          }));
        }

        open(initialApp, urlExists ? { url } : undefined);
      };

      if (app) {
        const lcAppNames = Object.fromEntries(
          Object.entries(processDirectory)
            .filter(([, { dialogProcess }]) => !dialogProcess)
            .map(([name]) => [name.toLowerCase(), name])
        );

        loadInitialApp(lcAppNames[app.toLowerCase()]);
      } else if (url) {
        if (isYouTubeUrl(url)) {
          loadInitialApp("VideoPlayer");
        } else if (isBrowserUrl(url)) {
          loadInitialApp("Browser");
        } else {
          try {
            stat(url).then((stats) =>
              loadInitialApp(
                stats.isDirectory()
                  ? "FileExplorer"
                  : getProcessByFileExtension(getExtension(url))
              )
            );
          } catch {
            // Ignore error getting url
          }
        }
      } else {
        loadInitialApp("Gakon");

        const scheduleTerminal = (): void => {
          terminalTimerRef.current = setTimeout(() => {
            const vw = typeof window === "undefined" ? 1440 : window.innerWidth;
            const vh = typeof window === "undefined" ? 900 : window.innerHeight;
            const isLaptop = vh < 820 || vw < 1500;
            const termWidth = isLaptop
              ? Math.max(360, Math.min(620, Math.round(vw * 0.48)))
              : Math.min(720, Math.round(vw * 0.48));
            const maxTermHeight = Math.max(360, vh - 115);
            const termHeight = isLaptop
              ? Math.min(460, maxTermHeight)
              : Math.min(520, maxTermHeight);
            const termX = isLaptop ? 25 : 40;
            const termY = 40;

            setWindowStates((prev) => ({
              ...prev,
              Terminal: {
                ...prev?.Terminal,
                position: { x: termX, y: termY },
                size: { height: termHeight, width: termWidth },
              },
            }));

            open("Terminal");
          }, 3000);
        };

        if (
          typeof window !== "undefined" &&
          (window as unknown as { __daedalOS_unlocked?: boolean }).__daedalOS_unlocked
        ) {
          scheduleTerminal();
        } else {
          window.addEventListener("daedalOS:unlock", scheduleTerminal, { once: true });
        }
      }
    };

    startInitialApps();
  }, [exists, fs, open, setWindowStates, stat]);
};

export default useUrlLoader;
