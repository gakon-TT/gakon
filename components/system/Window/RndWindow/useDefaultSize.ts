import { useMemo } from "react";
import { useTheme } from "styled-components";
import { type Size } from "components/system/Window/RndWindow/useResizable";
import { useProcess } from "contexts/process";
import { DEFAULT_WINDOW_SIZE } from "utils/constants";

const useDefaultSize = (id: string): Size => {
  const { defaultSize } = useProcess(id);
  const {
    sizes: { titleBar },
  } = useTheme();

  return useMemo(() => {
    if (id === "Gakon" && typeof window !== "undefined") {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw <= 768;
      const isLaptop = vh < 820 || vw < 1500;
      if (isMobile) {
        return {
          height: Math.min(vh - 95, 680),
          width: Math.min(vw - 16, 430),
        };
      }
      if (isLaptop) {
        const maxAllowedHeight = vh - 105;
        return {
          height: Math.min(470, Math.max(360, maxAllowedHeight)),
          width: Math.max(390, Math.min(430, Math.round(vw * 0.38))),
        };
      }
    }

    return defaultSize
      ? {
          height: Number(defaultSize.height) + titleBar.height,
          width: defaultSize.width,
        }
      : DEFAULT_WINDOW_SIZE;
  }, [defaultSize, id, titleBar.height]);
};

export default useDefaultSize;
