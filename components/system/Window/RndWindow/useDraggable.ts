import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { type Position } from "react-rnd";
import { useTheme } from "styled-components";
import {
  cascadePosition,
  centerPosition,
  isWindowOutsideBounds,
  WINDOW_OFFSCREEN_BUFFER_PX,
} from "components/system/Window/functions";
import useMinMaxRef from "components/system/Window/RndWindow/useMinMaxRef";
import { type Size } from "components/system/Window/RndWindow/useResizable";
import { useProcess, useProcessesRef } from "contexts/process";
import { useStackOrder, useWindowState } from "contexts/session";
import {
  calcInitialPosition,
  getWindowViewport,
  pxToNum,
} from "utils/functions";

type Draggable = [Position, React.Dispatch<React.SetStateAction<Position>>];

const useDraggable = (id: string, size: Size): Draggable => {
  const {
    sizes: {
      window: { cascadeOffset },
    },
  } = useTheme();
  const { autoSizing, closing, componentWindow, initialRelativePosition } =
    useProcess(id);
  const processesRef = useProcessesRef();
  const stackOrder = useStackOrder();
  const windowState = useWindowState(id);
  const { position: sessionPosition, size: sessionSize } = windowState;
  const isOffscreen = useMemo(
    () => isWindowOutsideBounds(windowState, getWindowViewport()),
    [windowState]
  );
  const [position, setPosition] = useState<Position>(() => {
    if (id === "Gakon" && typeof window !== "undefined") {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const isMobile = vw <= 768;
      const isLaptop = vh < 820 || vw < 1500;
      if (isMobile) {
        const curWidth = pxToNum(size.width);
        return {
          x: Math.max(4, Math.round((vw - curWidth) / 2)),
          y: 34,
        };
      }
      if (isLaptop) {
        const curWidth = pxToNum(size.width);
        return {
          x: Math.max(20, Math.min(vw - curWidth - 25, Math.round(vw * 0.54))),
          y: 34,
        };
      }
    }
    return (
      (!isOffscreen && sessionPosition) ||
      cascadePosition(id, processesRef.current, stackOrder, cascadeOffset) ||
      centerPosition(size)
    );
  });
  const positionRef = useRef(position);
  const sizeRef = useRef(size);
  const blockAutoPositionRef = useMinMaxRef(id);

  positionRef.current = position;
  sizeRef.current = size;

  useEffect(() => {
    const monitorViewportResize = (): void => {
      const vwSize = getWindowViewport();
      const windowBounds = {
        position: positionRef.current,
        size: sizeRef.current,
      };

      if (isWindowOutsideBounds(windowBounds, vwSize, true)) {
        setPosition(({ x, y }) => {
          const xOffset = vwSize.x - WINDOW_OFFSCREEN_BUFFER_PX.RIGHT;
          const yOffset = vwSize.y - WINDOW_OFFSCREEN_BUFFER_PX.BOTTOM;

          return {
            x: Math.min(x, xOffset),
            y: Math.min(y, yOffset),
          };
        });
      }
    };

    window.addEventListener("resize", monitorViewportResize, { passive: true });

    return () => window.removeEventListener("resize", monitorViewportResize);
  }, []);

  useLayoutEffect(() => {
    if (
      autoSizing &&
      !closing &&
      sessionSize &&
      !sessionPosition &&
      !blockAutoPositionRef.current
    ) {
      setPosition(centerPosition(sessionSize));
    }
  }, [autoSizing, blockAutoPositionRef, closing, sessionPosition, sessionSize]);

  useLayoutEffect(() => {
    if (initialRelativePosition && componentWindow && size) {
      setPosition(
        calcInitialPosition(componentWindow, initialRelativePosition, size)
      );
    }
  }, [componentWindow, initialRelativePosition, size]);

  useLayoutEffect(() => {
    if (id === "Gakon" && !blockAutoPositionRef.current) {
      if (typeof window !== "undefined") {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const isMobile = vw <= 768;
        const isLaptop = vh < 820 || vw < 1500;
        if (isMobile) {
          const curWidth = pxToNum(size.width);
          const x = Math.max(4, Math.round((vw - curWidth) / 2));
          const y = 34;
          setPosition({ x, y });
          return;
        }
        if (isLaptop) {
          const curWidth = pxToNum(size.width);
          const x = Math.max(20, Math.min(vw - curWidth - 25, Math.round(vw * 0.54)));
          const y = 34;
          setPosition({ x, y });
          return;
        }
      }
      if (sessionPosition) {
        setPosition((prev) =>
          prev.x === sessionPosition.x && prev.y === sessionPosition.y
            ? prev
            : sessionPosition
        );
      }
    }
  }, [blockAutoPositionRef, id, sessionPosition, size]);

  useEffect(() => {
    if (id !== "Gakon") return;

    const handleResize = () => {
      if (blockAutoPositionRef.current) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const isMobile = vw <= 768;
      const isLaptop = vh < 820 || vw < 1500;
      if (isMobile) {
        const curWidth = pxToNum(sizeRef.current.width);
        const x = Math.max(4, Math.round((vw - curWidth) / 2));
        const y = 34;
        setPosition({ x, y });
      } else if (isLaptop) {
        const curWidth = pxToNum(sizeRef.current.width);
        const x = Math.max(20, Math.min(vw - curWidth - 25, Math.round(vw * 0.54)));
        const y = 34;
        setPosition({ x, y });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [blockAutoPositionRef, id]);

  return [position, setPosition];
};

export default useDraggable;
