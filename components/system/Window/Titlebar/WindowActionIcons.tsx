import { memo } from "react";

export const MinimizeIcon = memo(() => (
  <svg aria-hidden="true" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6h8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
  </svg>
));

export const MaximizeIcon = memo(() => (
  <svg aria-hidden="true" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8.5L8.5 2M4.5 2h4v4M7.5 10H3.5V6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
  </svg>
));

export const MaximizedIcon = memo(() => (
  <svg aria-hidden="true" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8.5L8.5 2M4.5 2h4v4M7.5 10H3.5V6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
  </svg>
));

export const CloseIcon = memo(() => (
  <svg aria-hidden="true" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
  </svg>
));

