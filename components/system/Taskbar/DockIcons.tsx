import { memo } from "react";

export const SafariIcon = memo(() => (
  <svg viewBox="0 0 100 100" width="40" height="40">
    <defs>
      <linearGradient id="safariBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#25b4ff" />
        <stop offset="100%" stopColor="#0064e6" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#safariBg)" />
    {/* Compass outer ring */}
    <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    <circle cx="50" cy="50" r="36" fill="rgba(255,255,255,0.1)" />
    {/* Compass ticks */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
      <line
        key={deg}
        x1="50"
        y1="16"
        x2="50"
        y2={deg % 90 === 0 ? "22" : "19"}
        stroke="rgba(255,255,255,0.85)"
        strokeWidth={deg % 90 === 0 ? "2.5" : "1.5"}
        transform={`rotate(${deg} 50 50)`}
      />
    ))}
    {/* Compass Needle - 45 deg angle */}
    <polygon points="50,18 57,50 50,47" fill="#ff3b30" transform="rotate(45 50 50)" />
    <polygon points="50,18 43,50 50,47" fill="#e02020" transform="rotate(45 50 50)" />
    <polygon points="50,82 57,50 50,53" fill="#f5f5f7" transform="rotate(45 50 50)" />
    <polygon points="50,82 43,50 50,53" fill="#d2d2d7" transform="rotate(45 50 50)" />
    <circle cx="50" cy="50" r="4" fill="#ffffff" />
    <circle cx="50" cy="50" r="2" fill="#0064e6" />
  </svg>
));

export const MessagesIcon = memo(() => (
  <svg viewBox="0 0 100 100" width="40" height="40">
    <defs>
      <linearGradient id="msgBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#43e97b" />
        <stop offset="100%" stopColor="#25c654" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#msgBg)" />
    {/* Speech bubble */}
    <path
      d="M24 48 C24 34 35 24 50 24 C65 24 76 34 76 48 C76 62 65 72 50 72 C45 72 40 70.5 36 68 L24 73 L27 62 C25 58 24 53 24 48 Z"
      fill="#ffffff"
    />
  </svg>
));

export const PhotosIcon = memo(() => (
  <svg viewBox="0 0 100 100" width="40" height="40">
    <rect width="100" height="100" rx="22" fill="#ffffff" />
    {/* Flower petals */}
    <g transform="translate(50, 50)">
      <path d="M0,0 C-7,-18 7,-18 0,0" fill="#ffcc00" transform="rotate(0)" />
      <path d="M0,0 C-7,-18 7,-18 0,0" fill="#ff9500" transform="rotate(45)" />
      <path d="M0,0 C-7,-18 7,-18 0,0" fill="#ff3b30" transform="rotate(90)" />
      <path d="M0,0 C-7,-18 7,-18 0,0" fill="#ff2d55" transform="rotate(135)" />
      <path d="M0,0 C-7,-18 7,-18 0,0" fill="#af52de" transform="rotate(180)" />
      <path d="M0,0 C-7,-18 7,-18 0,0" fill="#5856d6" transform="rotate(225)" />
      <path d="M0,0 C-7,-18 7,-18 0,0" fill="#007aff" transform="rotate(270)" />
      <path d="M0,0 C-7,-18 7,-18 0,0" fill="#34c759" transform="rotate(315)" />
      <circle cx="0" cy="0" r="5" fill="#ffffff" />
    </g>
  </svg>
));

export const NotesIcon = memo(() => (
  <svg viewBox="0 0 100 100" width="40" height="40">
    <defs>
      <linearGradient id="notesBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fffcf0" />
        <stop offset="100%" stopColor="#f5f0d8" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#notesBg)" />
    {/* Yellow top stripe */}
    <path d="M0 22 C0 10 10 0 22 0 L78 0 C90 0 100 10 100 22 L100 30 L0 30 Z" fill="#ffd60a" />
    {/* Ruled lines */}
    <line x1="16" y1="44" x2="84" y2="44" stroke="#e0dbb8" strokeWidth="2.5" />
    <line x1="16" y1="56" x2="84" y2="56" stroke="#e0dbb8" strokeWidth="2.5" />
    <line x1="16" y1="68" x2="84" y2="68" stroke="#e0dbb8" strokeWidth="2.5" />
    <line x1="16" y1="80" x2="65" y2="80" stroke="#e0dbb8" strokeWidth="2.5" />
    {/* Left margin red line */}
    <line x1="28" y1="30" x2="28" y2="100" stroke="#ff9f9f" strokeWidth="1.5" />
  </svg>
));

export const MusicIcon = memo(() => (
  <svg viewBox="0 0 100 100" width="40" height="40">
    <defs>
      <linearGradient id="musicBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fc3d6f" />
        <stop offset="100%" stopColor="#fa233b" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#musicBg)" />
    {/* Eighth Notes */}
    <path
      d="M68 25 L42 32 L42 62 C39 60 35 59 31 60 C24 62 20 68 22 74 C24 80 31 83 38 81 C43 79 46 74 46 68 L46 44 L64 39 L64 56 C61 54 57 53 53 54 C46 56 42 62 44 68 C46 74 53 77 60 75 C65 73 68 68 68 62 Z"
      fill="#ffffff"
    />
  </svg>
));

export const TerminalIcon = memo(() => (
  <svg viewBox="0 0 100 100" width="40" height="40">
    <defs>
      <linearGradient id="termBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2c2c30" />
        <stop offset="100%" stopColor="#121214" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#termBg)" />
    <path d="M0 22 C0 10 10 0 22 0 L78 0 C90 0 100 10 100 22 L100 24 L0 24 Z" fill="rgba(255,255,255,0.12)" />
    {/* Prompt >_ */}
    <path
      d="M26 38 L42 50 L26 62"
      fill="none"
      stroke="#30d158"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="48" y1="64" x2="68" y2="64" stroke="#f5f5f7" strokeWidth="5" strokeLinecap="round" />
  </svg>
));

export const AppStoreIcon = memo(() => (
  <svg viewBox="0 0 100 100" width="40" height="40">
    <defs>
      <linearGradient id="appStoreBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1a94ff" />
        <stop offset="100%" stopColor="#0066ee" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#appStoreBg)" />
    {/* Letter A with overlapping craft sticks */}
    <g stroke="#ffffff" strokeWidth="7" strokeLinecap="round">
      <line x1="32" y1="74" x2="48" y2="28" />
      <line x1="68" y1="74" x2="52" y2="28" />
      <line x1="26" y1="62" x2="74" y2="62" />
    </g>
  </svg>
));

export const SettingsIcon = memo(() => (
  <svg viewBox="0 0 100 100" width="40" height="40">
    <defs>
      <linearGradient id="settingsBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8e8e93" />
        <stop offset="100%" stopColor="#48484a" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#settingsBg)" />
    {/* Gear */}
    <g fill="#f5f5f7">
      <circle cx="50" cy="50" r="16" fill="none" stroke="#f5f5f7" strokeWidth="8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect
          key={deg}
          x="46"
          y="20"
          width="8"
          height="12"
          rx="2"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
    </g>
  </svg>
));

export const DownloadsIcon = memo(() => (
  <svg viewBox="0 0 100 100" width="40" height="40">
    <defs>
      <linearGradient id="dlBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#30b4f8" />
        <stop offset="100%" stopColor="#007aff" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#dlBg)" />
    {/* Folder shape */}
    <path
      d="M22 34 L38 34 L46 42 L78 42 C82 42 85 45 85 49 L85 70 C85 74 82 77 78 77 L22 77 C18 77 15 74 15 70 L15 41 C15 37 18 34 22 34 Z"
      fill="#ffffff"
      opacity="0.9"
    />
    {/* Down arrow circle badge */}
    <circle cx="50" cy="60" r="14" fill="#007aff" />
    <path
      d="M45 58 L50 63 L55 58 M50 52 L50 62"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

export const TrashIcon = memo(() => (
  <svg viewBox="0 0 100 100" width="40" height="40">
    <defs>
      <linearGradient id="trashBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#636366" />
        <stop offset="100%" stopColor="#3a3a3c" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#trashBg)" />
    {/* Metal bin */}
    <g fill="none" stroke="#f5f5f7" strokeWidth="3" strokeLinecap="round">
      <path d="M28 32 L72 32" strokeWidth="4" />
      <path d="M42 26 L58 26" strokeWidth="3.5" />
      <path d="M34 34 L38 76 C38 80 42 82 46 82 L54 82 C58 82 62 80 62 76 L66 34" fill="rgba(255,255,255,0.12)" />
      <line x1="44" y1="42" x2="45" y2="72" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <line x1="50" y1="42" x2="50" y2="72" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <line x1="56" y1="42" x2="55" y2="72" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
    </g>
  </svg>
));
