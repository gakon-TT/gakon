import { useEffect, useLayoutEffect, useState } from "react";
import { type Props } from "react-rnd";
import { useTheme } from "styled-components";
import { minMaxSize } from "components/system/Window/functions";
import useDefaultSize from "components/system/Window/RndWindow/useDefaultSize";
import useMinMaxRef from "components/system/Window/RndWindow/useMinMaxRef";
import { useProcess } from "contexts/process";
import { useWindowState } from "contexts/session";

export type Size = NonNullable<Props["size"]>;

type Resizable = [Size, React.Dispatch<React.SetStateAction<Size>>];

const useResizable = (id: string, autoSizing = false): Resizable => {
  const defaultSize = useDefaultSize(id);
  const { size: stateSize = defaultSize } = useWindowState(id);
  const { lockAspectRatio = false } = useProcess(id);
  const {
    sizes: { titleBar },
  } = useTheme();
  const [size, setSize] = useState<Size>(() =>
    minMaxSize(stateSize, lockAspectRatio, titleBar.height)
  );
  const blockAutoSizeRef = useMinMaxRef(id);

  useLayoutEffect(() => {
    if (id === "Gakon" && !blockAutoSizeRef.current) {
      if (typeof window !== "undefined") {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const isLaptop = vh < 820 || vw < 1500;
        if (isLaptop) {
          const maxAllowedHeight = vh - 105;
          setSize({
            height: Math.min(470, Math.max(360, maxAllowedHeight)),
            width: Math.max(390, Math.min(430, Math.round(vw * 0.38))),
          });
          return;
        }
      }
      setSize(minMaxSize(stateSize, lockAspectRatio, titleBar.height));
      return;
    }

    if (autoSizing && !blockAutoSizeRef.current) {
      setSize(minMaxSize(stateSize, lockAspectRatio, titleBar.height));
    }
  }, [
    autoSizing,
    blockAutoSizeRef,
    id,
    lockAspectRatio,
    stateSize,
    titleBar.height,
  ]);

  useEffect(() => {
    if (id !== "Gakon") return;

    const handleResize = () => {
      if (blockAutoSizeRef.current) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const isLaptop = vh < 820 || vw < 1500;
      if (isLaptop) {
        const maxAllowedHeight = vh - 105;
        setSize({
          height: Math.min(470, Math.max(360, maxAllowedHeight)),
          width: Math.max(390, Math.min(430, Math.round(vw * 0.38))),
        });
      } else {
        setSize(minMaxSize(stateSize, lockAspectRatio, titleBar.height));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [blockAutoSizeRef, id, lockAspectRatio, stateSize, titleBar.height]);

  return [size, setSize];
};

export default useResizable;
