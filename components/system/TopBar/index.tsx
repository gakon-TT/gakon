import { type FC, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  StyledAboutModal,
  StyledAppleMenu,
  StyledTopBar,
} from "components/system/TopBar/StyledTopBar";
import { useProcess, useProcesses, useProcessesActions } from "contexts/process";
import { useForegroundId } from "contexts/session";

const AppleIcon = memo(() => (
  <svg viewBox="0 0 170 170">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12-14.42-6.09-9.35-10.76-20.02-14-32.02-3.24-12-4.86-23.36-4.86-34.08 0-14.56 3.66-26.73 10.98-36.5 7.32-9.78 16.66-14.77 28.02-14.99 4.9 0 10.45 1.34 16.66 4.02 6.21 2.68 10.15 4.09 11.82 4.23 2.12-.34 6.31-1.85 12.56-4.54 6.25-2.68 11.75-3.88 16.51-3.6 13.01.63 23.36 5.58 31.05 14.86-11.45 6.9-17.07 16.48-16.86 28.74.22 9.69 3.96 17.7 11.22 24.03 7.26 6.33 15.93 10.02 26.01 11.08-2.12 6.21-4.72 12.74-7.8 19.59zM119.22 31.84c0-7.37 2.68-14.36 8.04-20.97 5.36-6.61 12.01-10.87 19.95-12.79.22 1.34.33 2.68.33 4.02 0 7.48-2.76 14.72-8.28 21.72-5.52 7-12.29 11.39-20.31 13.17-.22-1.68-.33-3.4-.33-5.15z" />
  </svg>
));

const WifiIcon = memo(() => (
  <svg viewBox="0 0 24 24">
    <path d="M12 3c-4.97 0-9.49 2.03-12.73 5.32l1.41 1.41C3.35 7.12 7.43 5.3 12 5.3s8.65 1.82 11.32 4.43l1.41-1.41C21.49 5.03 16.97 3 12 3zm0 4.5c-3.69 0-7.05 1.51-9.46 3.96l1.41 1.41C5.81 11.02 8.74 9.8 12 9.8s6.19 1.22 8.05 3.07l1.41-1.41C19.05 9.01 15.69 7.5 12 7.5zm0 4.5c-2.42 0-4.61 1-6.19 2.61l1.41 1.41C8.28 15.02 10.02 14.3 12 14.3s3.72.72 4.78 1.72l1.41-1.41C16.61 13 14.42 12 12 12zm0 4.5c-1.15 0-2.19.48-2.93 1.25l2.93 2.93 2.93-2.93C14.19 16.98 13.15 16.5 12 16.5z" />
  </svg>
));

const BatteryIcon = memo(() => (
  <svg viewBox="0 0 24 24">
    <path d="M17 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2v-1.5h1.5c.83 0 1.5-.67 1.5-1.5v-2c0-.83-.67-1.5-1.5-1.5H19V8c0-1.1-.9-2-2-2zm0 10H4V8h13v8zm-2-7H6v6h9V9z" />
  </svg>
));

const ControlCenterIcon = memo(() => (
  <svg viewBox="0 0 24 24">
    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
  </svg>
));

const SpotlightIcon = memo(() => (
  <svg viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
));

const TopBar: FC = () => {
  const foregroundId = useForegroundId();
  const process = useProcess(foregroundId);
  const processes = useProcesses();
  const { closeWithTransition, maximize, minimize, open } =
    useProcessesActions();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const activeAppName = useMemo(() => {
    if (!process?.title) return "Ga kon";
    return process.title;
  }, [process?.title]);

  const minimizeAll = useCallback(() => {
    Object.keys(processes).forEach((pid) => {
      minimize(pid);
    });
    setActiveMenu(null);
  }, [minimize, processes]);

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const toggleMenu = useCallback((menuKey: string) => {
    setActiveMenu((prev) => (prev === menuKey ? null : menuKey));
  }, []);

  const handleMenuHover = useCallback(
    (menuKey: string) => {
      if (activeMenu) {
        setActiveMenu(menuKey);
      }
    },
    [activeMenu]
  );

  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        month: "short",
        weekday: "short",
      };
      setCurrentTime(new Intl.DateTimeFormat("vi-VN", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveMenu(null);
      }
    };
    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  const openAbout = useCallback(() => {
    setActiveMenu(null);
    setAboutOpen(true);
  }, []);

  const restartSystem = useCallback(() => {
    window.location.reload();
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    closeMenu();
  }, [closeMenu]);

  return (
    <div ref={containerRef}>
      <StyledTopBar aria-label="macOS Menu Bar">
        <div className="left-section">
          {/*  Apple Menu */}
          <button
            className={`apple-logo-btn ${activeMenu === "apple" ? "active" : ""}`}
            onClick={() => toggleMenu("apple")}
            onMouseEnter={() => handleMenuHover("apple")}
            title="Apple Menu"
            type="button"
          >
            <AppleIcon />
          </button>

          {/* Active App Name */}
          <div
            className="app-name"
            onClick={() => toggleMenu("apple")}
            style={{ cursor: "pointer" }}
          >
            {activeAppName}
          </div>

          {/* Tập tin (File) */}
          <button
            className={`menu-item ${activeMenu === "file" ? "active" : ""}`}
            onClick={() => toggleMenu("file")}
            onMouseEnter={() => handleMenuHover("file")}
            type="button"
          >
            Tập tin
          </button>

          {/* Sửa (Edit) */}
          <button
            className={`menu-item ${activeMenu === "edit" ? "active" : ""}`}
            onClick={() => toggleMenu("edit")}
            onMouseEnter={() => handleMenuHover("edit")}
            type="button"
          >
            Sửa
          </button>

          {/* Xem (View) */}
          <button
            className={`menu-item ${activeMenu === "view" ? "active" : ""}`}
            onClick={() => toggleMenu("view")}
            onMouseEnter={() => handleMenuHover("view")}
            type="button"
          >
            Xem
          </button>

          {/* Đi (Go) */}
          <button
            className={`menu-item ${activeMenu === "go" ? "active" : ""}`}
            onClick={() => toggleMenu("go")}
            onMouseEnter={() => handleMenuHover("go")}
            type="button"
          >
            Đi
          </button>

          {/* Cửa sổ (Window) */}
          <button
            className={`menu-item ${activeMenu === "window" ? "active" : ""}`}
            onClick={() => toggleMenu("window")}
            onMouseEnter={() => handleMenuHover("window")}
            type="button"
          >
            Cửa sổ
          </button>

          {/* Trợ giúp (Help) */}
          <button
            className={`menu-item ${activeMenu === "help" ? "active" : ""}`}
            onClick={() => toggleMenu("help")}
            onMouseEnter={() => handleMenuHover("help")}
            type="button"
          >
            Trợ giúp
          </button>
        </div>

        <div className="right-section">
          {/* Battery */}
          <button
            className="status-icon-btn"
            onClick={() => toggleMenu("battery")}
            title="Pin 100%"
            type="button"
          >
            <span>100%</span>
            <BatteryIcon />
          </button>

          {/* Wi-Fi */}
          <button
            className="status-icon-btn"
            onClick={() => toggleMenu("wifi")}
            title="Wi-Fi"
            type="button"
          >
            <WifiIcon />
          </button>

          {/* Spotlight Search */}
          <button
            className="status-icon-btn"
            onClick={() => toggleMenu("spotlight")}
            title="Tìm kiếm Spotlight"
            type="button"
          >
            <SpotlightIcon />
          </button>

          {/* Control Center */}
          <button
            className="status-icon-btn"
            onClick={() => toggleMenu("control")}
            title="Trung tâm điều khiển"
            type="button"
          >
            <ControlCenterIcon />
          </button>

          {/* Clock */}
          <div className="clock-btn">{currentTime}</div>
        </div>
      </StyledTopBar>

      {/* 1. Apple Dropdown Menu */}
      {activeMenu === "apple" && (
        <StyledAppleMenu $left="8px">
          <button className="menu-entry" onClick={openAbout} type="button">
            <span>Giới thiệu về máy Mac này</span>
          </button>
          <div className="divider" />
          <button
            className="menu-entry"
            onClick={() => {
              open("MacSettings");
              closeMenu();
            }}
            type="button"
          >
            <span>Cài đặt hệ thống...</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              open("Browser");
              closeMenu();
            }}
            type="button"
          >
            <span>App Store...</span>
          </button>
          <div className="divider" />
          <button className="menu-entry" onClick={minimizeAll} type="button">
            <span>Hiện Màn hình chính</span>
          </button>
          {foregroundId && foregroundId !== "Finder" && (
            <button
              className="menu-entry"
              onClick={() => {
                closeWithTransition(foregroundId);
                closeMenu();
              }}
              type="button"
            >
              <span>Thoát {activeAppName}</span>
              <span>⌘Q</span>
            </button>
          )}
          <div className="divider" />
          <button
            className="menu-entry"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("daedalOS:lock"));
              closeMenu();
            }}
            type="button"
          >
            <span>Khóa màn hình</span>
            <span>⌘L</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              restartSystem();
            }}
            type="button"
          >
            <span>Khởi động lại...</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            type="button"
          >
            <span>Tắt máy (Khôi phục gốc)...</span>
          </button>
        </StyledAppleMenu>
      )}

      {/* 2. Tập tin (File) Dropdown Menu */}
      {activeMenu === "file" && (
        <StyledAppleMenu $left="78px">
          <button
            className="menu-entry"
            onClick={() => {
              open("FileExplorer");
              closeMenu();
            }}
            type="button"
          >
            <span>Cửa sổ Finder mới</span>
            <span>⌘N</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              open("Terminal");
              closeMenu();
            }}
            type="button"
          >
            <span>Cửa sổ Terminal mới</span>
            <span>⌘T</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              open("Browser");
              closeMenu();
            }}
            type="button"
          >
            <span>Trình duyệt Safari</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              open("MacMusic");
              closeMenu();
            }}
            type="button"
          >
            <span>Apple Music</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              open("Gakon");
              closeMenu();
            }}
            type="button"
          >
            <span>Ứng dụng Ga kon</span>
          </button>
          <div className="divider" />
          <button
            className="menu-entry"
            onClick={() => {
              if (foregroundId) closeWithTransition(foregroundId);
              closeMenu();
            }}
            type="button"
          >
            <span>Đóng cửa sổ hiện tại</span>
            <span>⌘W</span>
          </button>
        </StyledAppleMenu>
      )}

      {/* 3. Sửa (Edit) Dropdown Menu */}
      {activeMenu === "edit" && (
        <StyledAppleMenu $left="128px">
          <button
            className="menu-entry"
            onClick={() => {
              try { document.execCommand("undo"); } catch {}
              closeMenu();
            }}
            type="button"
          >
            <span>Hoàn tác</span>
            <span>⌘Z</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              try { document.execCommand("redo"); } catch {}
              closeMenu();
            }}
            type="button"
          >
            <span>Làm lại</span>
            <span>⇧⌘Z</span>
          </button>
          <div className="divider" />
          <button
            className="menu-entry"
            onClick={() => {
              try { document.execCommand("cut"); } catch {}
              closeMenu();
            }}
            type="button"
          >
            <span>Cắt</span>
            <span>⌘X</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              try { document.execCommand("copy"); } catch {}
              closeMenu();
            }}
            type="button"
          >
            <span>Sao chép</span>
            <span>⌘C</span>
          </button>
          <button
            className="menu-entry"
            onClick={async () => {
              try { await navigator.clipboard?.readText(); } catch {}
              closeMenu();
            }}
            type="button"
          >
            <span>Dán</span>
            <span>⌘V</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              try { document.execCommand("selectAll"); } catch {}
              closeMenu();
            }}
            type="button"
          >
            <span>Chọn tất cả</span>
            <span>⌘A</span>
          </button>
        </StyledAppleMenu>
      )}

      {/* 4. Xem (View) Dropdown Menu */}
      {activeMenu === "view" && (
        <StyledAppleMenu $left="164px">
          <button
            className="menu-entry"
            onClick={toggleFullscreen}
            type="button"
          >
            <span>Bật / Tắt Toàn màn hình</span>
            <span>^⌘F</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              window.location.reload();
            }}
            type="button"
          >
            <span>Tải lại trang</span>
            <span>⌘R</span>
          </button>
          <div className="divider" />
          <button
            className="menu-entry"
            onClick={() => {
              open("Gakon");
              closeMenu();
            }}
            type="button"
          >
            <span>Mở cửa sổ Ga kon</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              minimizeAll();
              closeMenu();
            }}
            type="button"
          >
            <span>Hiện Màn hình chính</span>
            <span>⌘D</span>
          </button>
        </StyledAppleMenu>
      )}

      {/* 5. Đi (Go) Dropdown Menu */}
      {activeMenu === "go" && (
        <StyledAppleMenu $left="204px">
          <button
            className="menu-entry"
            onClick={() => {
              open("FileExplorer", { url: "/Users/Public/Desktop" });
              closeMenu();
            }}
            type="button"
          >
            <span>Màn hình chính (Desktop)</span>
            <span>⇧⌘D</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              open("FileExplorer", { url: "/Users/Public/Documents" });
              closeMenu();
            }}
            type="button"
          >
            <span>Tài liệu (Documents)</span>
            <span>⇧⌘O</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              open("FileExplorer", { url: "/Users/Public/Downloads" });
              closeMenu();
            }}
            type="button"
          >
            <span>Tệp tải về (Downloads)</span>
            <span>⌥⌘L</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              open("FileExplorer", { url: "/" });
              closeMenu();
            }}
            type="button"
          >
            <span>Bộ nhớ máy (My PC)</span>
            <span>⇧⌘C</span>
          </button>
          <div className="divider" />
          <button
            className="menu-entry"
            onClick={() => {
              open("FileExplorer", { url: "/Trash" });
              closeMenu();
            }}
            type="button"
          >
            <span>Thùng rác (Trash)</span>
          </button>
        </StyledAppleMenu>
      )}

      {/* 6. Cửa sổ (Window) Dropdown Menu */}
      {activeMenu === "window" && (
        <StyledAppleMenu $left="232px">
          <button
            className="menu-entry"
            onClick={() => {
              if (foregroundId) minimize(foregroundId);
              closeMenu();
            }}
            type="button"
          >
            <span>Thu nhỏ xuống Dock</span>
            <span>⌘M</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              if (foregroundId) maximize(foregroundId);
              closeMenu();
            }}
            type="button"
          >
            <span>Phóng to / Thu nhỏ</span>
          </button>
          <div className="divider" />
          <button
            className="menu-entry"
            onClick={() => {
              minimizeAll();
              closeMenu();
            }}
            type="button"
          >
            <span>Hiện Màn hình chính (Ẩn tất cả)</span>
          </button>
          <div className="divider" />
          <button
            className="menu-entry"
            onClick={() => {
              if (foregroundId) closeWithTransition(foregroundId);
              closeMenu();
            }}
            type="button"
          >
            <span>Đóng cửa sổ này</span>
            <span>⌘W</span>
          </button>
        </StyledAppleMenu>
      )}

      {/* 7. Trợ giúp (Help) Dropdown Menu */}
      {activeMenu === "help" && (
        <StyledAppleMenu $left="284px">
          <button className="menu-entry" onClick={openAbout} type="button">
            <span>Giới thiệu về máy Mac này</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              open("Gakon");
              closeMenu();
            }}
            type="button"
          >
            <span>Hồ sơ Cyberpunk Ga kon</span>
          </button>
          <div className="divider" />
          <button
            className="menu-entry"
            onClick={() => {
              open("Gakon");
              closeMenu();
            }}
            type="button"
          >
            <span>Hồ sơ cá nhân (Ga kon)</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              restartSystem();
            }}
            type="button"
          >
            <span>Khởi động lại giao diện</span>
          </button>
        </StyledAppleMenu>
      )}

      {/* 8. Pin (Battery) Popover */}
      {activeMenu === "battery" && (
        <StyledAppleMenu $right="130px" style={{ minWidth: "240px" }}>
          <div style={{ padding: "6px 12px 2px", fontWeight: 700, fontSize: "12px", color: "#34d399" }}>
            ⚡ Nguồn điện: Bộ chuyển đổi USB-C
          </div>
          <div className="divider" />
          <div style={{ padding: "4px 12px", fontSize: "12.5px" }}>
            Mức pin: <strong>100%</strong>
          </div>
          <div style={{ padding: "4px 12px", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
            Tình trạng: Bình thường (Tuổi thọ 100%)
          </div>
          <div className="divider" />
          <div style={{ padding: "4px 12px", fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
            Không có ứng dụng nào dùng năng lượng đáng kể
          </div>
        </StyledAppleMenu>
      )}

      {/* 9. Wi-Fi Popover */}
      {activeMenu === "wifi" && (
        <StyledAppleMenu $right="95px" style={{ minWidth: "240px" }}>
          <div style={{ padding: "6px 12px 2px", fontWeight: 700, fontSize: "12px", color: "#38bdf8" }}>
            📶 Wi-Fi: Đang bật
          </div>
          <div className="divider" />
          <div style={{ padding: "5px 12px", fontSize: "12.5px", display: "flex", justifyContent: "space-between" }}>
            <span>✓ daedalOS 5GHz Fast</span>
            <span style={{ color: "#34d399" }}>Đã kết nối</span>
          </div>
          <div style={{ padding: "4px 12px", fontSize: "11.5px", color: "rgba(255,255,255,0.6)" }}>
            Bảo mật: WPA3 Cá nhân • 1.2 Gbps
          </div>
          <div className="divider" />
          <button
            className="menu-entry"
            onClick={() => {
              open("Browser");
              closeMenu();
            }}
            type="button"
          >
            <span>Mở Trình duyệt Safari...</span>
          </button>
        </StyledAppleMenu>
      )}

      {/* 10. Spotlight Search Popover */}
      {activeMenu === "spotlight" && (
        <StyledAppleMenu $right="60px" style={{ minWidth: "280px", padding: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px 10px" }}>
            <span style={{ fontSize: "14px" }}>🔍</span>
            <input
              autoFocus
              onChange={(e) => setSpotlightQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = spotlightQuery.toLowerCase();
                  if (q.includes("gak") || q.includes("ga")) open("Gakon");
                  else if (q.includes("mus") || q.includes("nhac")) open("MacMusic");
                  else if (q.includes("term")) open("Terminal");
                  else if (q.includes("file") || q.includes("find")) open("FileExplorer");
                  else open("Browser");
                  closeMenu();
                }
              }}
              placeholder="Tìm kiếm ứng dụng, tệp..."
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
                width: "100%",
              }}
              value={spotlightQuery}
            />
          </div>
          <div style={{ marginTop: "8px", fontSize: "11px", color: "rgba(255,255,255,0.5)", padding: "0 4px" }}>
            Ứng dụng gợi ý:
          </div>
          <button
            className="menu-entry"
            onClick={() => {
              open("Gakon");
              closeMenu();
            }}
            style={{ marginTop: "4px" }}
            type="button"
          >
            <span>✨ Ga kon (Vision.OS Profile)</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              open("MacMusic");
              closeMenu();
            }}
            type="button"
          >
            <span>🎵 Apple Music (US-UK)</span>
          </button>
          <button
            className="menu-entry"
            onClick={() => {
              open("Terminal");
              closeMenu();
            }}
            type="button"
          >
            <span>📟 Terminal</span>
          </button>
        </StyledAppleMenu>
      )}

      {/* 11. Trung tâm điều khiển (Control Center) Popover */}
      {activeMenu === "control" && (
        <StyledAppleMenu $right="15px" style={{ minWidth: "260px", padding: "10px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div style={{ background: "rgba(255,255,255,0.08)", padding: "10px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>📶</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700 }}>Wi-Fi</div>
                <div style={{ fontSize: "10px", color: "#34d399" }}>Đã kết nối</div>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", padding: "10px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>🔷</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700 }}>Bluetooth</div>
                <div style={{ fontSize: "10px", color: "#38bdf8" }}>Bật</div>
              </div>
            </div>
          </div>
          <div className="divider" style={{ margin: "10px 0" }} />
          <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
            ☀️ Độ sáng màn hình: 100%
          </div>
          <input
            defaultValue="100"
            max="100"
            min="20"
            style={{ width: "100%", accentColor: "#007aff", cursor: "pointer" }}
            type="range"
          />
          <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.8)", margin: "8px 0 4px" }}>
            🔊 Âm lượng âm thanh: 85%
          </div>
          <input
            defaultValue="85"
            max="100"
            min="0"
            style={{ width: "100%", accentColor: "#007aff", cursor: "pointer" }}
            type="range"
          />
        </StyledAppleMenu>
      )}

      {/* About Modal */}
      {aboutOpen && (
        <StyledAboutModal>
          <button
            className="close-icon-btn"
            onClick={() => setAboutOpen(false)}
            type="button"
          >
            ✕
          </button>
          <div className="apple-icon-big">
            <AppleIcon />
          </div>
          <h2>macOS Sequoia</h2>
          <div className="sub">Ga kon Edition (v15.3)</div>
          <div className="info-table">
            <div className="info-row">
              <span className="label">Chủ sở hữu:</span>
              <span className="value">Ga kon</span>
            </div>
            <div className="info-row">
              <span className="label">Tài khoản:</span>
              <span className="value">@g4kon.gg</span>
            </div>
            <div className="info-row">
              <span className="label">Vị trí:</span>
              <span className="value">TP. Hồ Chí Minh</span>
            </div>
            <div className="info-row">
              <span className="label">Chip:</span>
              <span className="value">Apple M3 Max (WebAssembly)</span>
            </div>
            <div className="info-row">
              <span className="label">Bộ nhớ:</span>
              <span className="value">64 GB Unified Memory</span>
            </div>
            <div className="info-row">
              <span className="label">Đồ họa:</span>
              <span className="value">WebGL 2.0 / Three.js</span>
            </div>
          </div>
        </StyledAboutModal>
      )}
    </div>
  );
};

export default memo(TopBar);
