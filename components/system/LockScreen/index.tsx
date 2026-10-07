import { type FC, memo, useCallback, useEffect, useState } from "react";
import { StyledLockScreen } from "components/system/LockScreen/StyledLockScreen";
import { useProcessesActions } from "contexts/process";

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

const ArrowRightIcon = memo(() => (
  <svg viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
));

const ChromeIcon = memo(() => (
  <svg viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
  </svg>
));

const DisplayIcon = memo(() => (
  <svg viewBox="0 0 24 24">
    <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
  </svg>
));

const PaperPlaneIcon = memo(() => (
  <svg viewBox="0 0 24 24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
));

const SyncIcon = memo(() => (
  <svg viewBox="0 0 24 24">
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
  </svg>
));

const LockScreen: FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentSubTime, setCurrentSubTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentDayUpper, setCurrentDayUpper] = useState("");
  const [currentDayCursive, setCurrentDayCursive] = useState("");

  // Music state synced with Gakon App
  const [trackTitle, setTrackTitle] = useState("MƯỜI NĂM NHÂN GIANG 十年人間 - GNAB REMIX");
  const [trackArtist, setTrackArtist] = useState("GNAB");
  const [trackCover, setTrackCover] = useState("/System/GakonWeb/lockscreen-avatar.jpg");
  const [isPlaying, setIsPlaying] = useState(true);

  const { open } = useProcessesActions();

  // Listen for real-time music updates from Gakon App
  useEffect(() => {
    const handleState = (e: Event) => {
      const detail = (
        e as CustomEvent<{
          artist?: string;
          cover?: string;
          isPlaying?: boolean;
          title?: string;
        }>
      ).detail;
      if (detail) {
        if (detail.title) setTrackTitle(detail.title);
        if (detail.artist) setTrackArtist(detail.artist);
        if (detail.cover) setTrackCover(detail.cover);
        if (typeof detail.isPlaying === "boolean") setIsPlaying(detail.isPlaying);
      }
    };

    const initial = (
      window as unknown as {
        __gakonMusicState?: {
          artist?: string;
          cover?: string;
          isPlaying?: boolean;
          title?: string;
        };
      }
    ).__gakonMusicState;

    if (initial) {
      handleState({ detail: initial } as unknown as Event);
    }

    window.addEventListener("daedalOS:musicState", handleState);
    return () => window.removeEventListener("daedalOS:musicState", handleState);
  }, []);

  const sendMusicCommand = (action: "next" | "prev" | "toggle") => {
    if (action === "toggle") setIsPlaying((prev) => !prev);
    window.dispatchEvent(
      new CustomEvent("daedalOS:musicCommand", { detail: { action } })
    );
  };

  // Live time and date formatting matching design
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);

      const subTimeStr = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(now);

      const monthStr = new Intl.DateTimeFormat("en-US", {
        month: "long",
      }).format(now).toUpperCase();

      const dayStr = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(now);

      setCurrentTime(timeStr);
      setCurrentSubTime(subTimeStr);
      setCurrentMonth(monthStr);
      setCurrentDayUpper(dayStr.toUpperCase());
      setCurrentDayCursive(dayStr);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for lock event
  useEffect(() => {
    const handleLock = () => {
      setIsUnlocking(false);
      setIsLocked(true);
    };

    window.addEventListener("daedalOS:lock", handleLock);
    return () => window.removeEventListener("daedalOS:lock", handleLock);
  }, []);

  // Unlock sequence with smooth animation and audio activation
  const handleUnlock = useCallback(() => {
    if (isUnlocking || !isLocked) return;
    setIsUnlocking(true);
    (window as unknown as { __daedalOS_unlocked?: boolean }).__daedalOS_unlocked = true;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        ctx.resume().then(() => ctx.close()).catch(() => {});
      }
    } catch {}

    window.dispatchEvent(new CustomEvent("daedalOS:unlock"));

    setTimeout(() => {
      setIsLocked(false);
      setIsUnlocking(false);
    }, 450);
  }, [isLocked, isUnlocking]);

  // Global keydown listener — Enter or Space unlocks
  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleUnlock();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUnlock, isLocked]);

  if (!isLocked) return null;

  return (
    <StyledLockScreen $isUnlocking={isUnlocking}>
      {/* 1. Top Right Status Bar Indicators */}
      <div className="lock-top-bar">
        <div className="status-group">
          <span>VIE</span>
        </div>
        <div className="status-group">
          <WifiIcon />
        </div>
        <div className="status-group">
          <span>100%</span>
          <BatteryIcon />
        </div>
      </div>

      {/* 2. Top-Left Quote & Stylized Brush Clock */}
      <div className="top-left-widget">
        <div className="brush-clock">{currentTime}</div>
        <div className="quote-text">&ldquo;With Great Power Comes Great Responsibility&rdquo;</div>
        <div className="quote-author">- Peter Parker -</div>
      </div>

      {/* 3. Center User Profile Section */}
      <div className="user-section">
        <div className="cursive-day-title">{currentDayCursive}</div>
        <div className="avatar-wrapper" onClick={handleUnlock} title="Nhấp để mở khóa">
          <img
            src="/System/GakonWeb/lockscreen-avatar.jpg"
            alt="Ga kon"
            className="avatar-img"
          />
          <div className="online-badge" />
        </div>

        <div className="user-name">
          Ga kon
          <span className="badge-verified" title="Đã xác minh">✓</span>
        </div>
        <div className="user-sub">@g4kon.gg • Digital Creator</div>

        <button
          className="unlock-enter-btn"
          type="button"
          onClick={handleUnlock}
          title="Nhấn để mở khóa"
        >
          <ArrowRightIcon />
          <span>Nhấn để mở khóa</span>
        </button>
      </div>

      {/* 4. Left Sidebar Quick Action Icons Column */}
      <div className="left-actions-column">
        <button
          className="action-icon-btn"
          type="button"
          title="Trình duyệt Safari"
          onClick={() => {
            handleUnlock();
            open("Browser");
          }}
        >
          <ChromeIcon />
        </button>
        <button
          className="action-icon-btn"
          type="button"
          title="Ứng dụng Ga kon"
          onClick={() => {
            handleUnlock();
            open("Gakon");
          }}
        >
          <DisplayIcon />
        </button>
        <button
          className="action-icon-btn"
          type="button"
          title="Tin nhắn"
          onClick={() => {
            handleUnlock();
            open("MacMessages");
          }}
        >
          <PaperPlaneIcon />
        </button>
        <button
          className="action-icon-btn"
          type="button"
          title="Bật/Tắt nhạc"
          onClick={() => sendMusicCommand("toggle")}
        >
          <SyncIcon />
        </button>
      </div>

      {/* 5. Bottom Music Player & Equalizer Wave (Centered & Clean) */}
      <div className="bottom-left-music-deck">
        <div className="soundwave-line">
          {Array.from({ length: 48 }).map((_, i) => (
            <span key={i} className={isPlaying ? "active" : ""} style={{ animationDelay: `${(i % 7) * 0.12}s` }} />
          ))}
        </div>
        <div className="music-glass-card">
          <img
            src={trackCover}
            alt="Music Cover"
            className="cover-img"
          />
          <div className="music-info">
            <div className="music-title">{trackTitle}</div>
            <div className="music-artist">{trackArtist}</div>
            <div className="music-controls">
              <button type="button" onClick={() => sendMusicCommand("prev")} title="Bài trước">⏮</button>
              <button type="button" onClick={() => sendMusicCommand("toggle")} title={isPlaying ? "Tạm dừng" : "Phát nhạc"}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button type="button" onClick={() => sendMusicCommand("next")} title="Bài tiếp">⏭</button>
            </div>
          </div>
        </div>
      </div>
    </StyledLockScreen>
  );
};

export default memo(LockScreen);
