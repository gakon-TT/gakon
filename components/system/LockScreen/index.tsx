import { type FC, memo, useCallback, useEffect, useState } from "react";
import { StyledLockScreen } from "components/system/LockScreen/StyledLockScreen";

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


const LockScreen: FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // Live time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);

      const dateStr = new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(now);

      setCurrentTime(timeStr);
      setCurrentDate(dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
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

  // Unlock sequence with smooth animation and activation trigger
  const handleUnlock = useCallback(() => {
    if (isUnlocking || !isLocked) return;
    setIsUnlocking(true);
    (window as unknown as { __daedalOS_unlocked?: boolean }).__daedalOS_unlocked = true;

    // Prime Web Audio context synchronously during user gesture so browser grants audio autoplay permission immediately
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

    // Notify apps (e.g. Gakon music player) to begin playback seamlessly
    window.dispatchEvent(new CustomEvent("daedalOS:unlock"));

    setTimeout(() => {
      setIsLocked(false);
      setIsUnlocking(false);
    }, 450);
  }, [isLocked, isUnlocking]);

  // Global keydown listener — Enter or any key unlocks
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
      {/* Top Bar Indicators */}
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

      {/* Clock Section */}
      <div className="clock-section">
        <div className="lock-time">{currentTime}</div>
        <div className="lock-date">{currentDate}</div>
      </div>

      {/* Center User Profile */}
      <div className="user-section">
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
          title="Nhấn để vào"
        >
          <ArrowRightIcon />
          <span>Nhấn để mở khóa</span>
        </button>
      </div>

    </StyledLockScreen>
  );
};

export default memo(LockScreen);
