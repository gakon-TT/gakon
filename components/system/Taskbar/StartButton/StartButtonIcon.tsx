import { memo } from "react";

const StartButtonIcon = memo(() => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="finderBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#43b2ff" />
        <stop offset="100%" stopColor="#0066ee" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#finderBg)" />
    <path
      d="M20 22 C20 18 24 16 28 16 L50 16 L50 84 L28 84 C24 84 20 82 20 78 Z"
      fill="#d6ecff"
      opacity="0.9"
    />
    <path
      d="M50 16 L72 16 C76 16 80 18 80 22 L80 78 C80 82 76 84 72 84 L50 84 Z"
      fill="#96d0ff"
      opacity="0.9"
    />
    <path
      d="M50 20 L50 60"
      stroke="#123d6a"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="34" cy="40" r="4.5" fill="#123d6a" />
    <circle cx="66" cy="40" r="4.5" fill="#123d6a" />
    <path
      d="M28 58 Q50 86 72 58"
      fill="none"
      stroke="#123d6a"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
  </svg>
));

export default StartButtonIcon;

