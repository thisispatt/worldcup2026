// Minimalist line icons used by the prize cards and the sweepstakes hover card.
// Colour comes from the parent via `currentColor`, so set `color` on the wrapper.

export function Trophy({ className = "", style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h12v4a6 6 0 0 1-12 0V4z" />
      <path d="M6 5H4a2 2 0 0 0 2 4" />
      <path d="M18 5h2a2 2 0 0 1-2 4" />
      <path d="M12 14v3" />
      <path d="M10 17h4l.5 3h-5z" />
      <path d="M9 20h6" />
    </svg>
  );
}

export function Medal({ className = "", style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 2.5l2.5 6" />
      <path d="M15.5 2.5l-2.5 6" />
      <circle cx="12" cy="15" r="6" />
      <path d="M12 12.2 L12.71 14.03 L14.66 14.14 L13.14 15.37 L13.65 17.27 L12 16.2 L10.35 17.27 L10.86 15.37 L9.34 14.14 L11.29 14.03 Z"
            fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Crown({ className = "", style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9l4 4 4-7 4 7 4-4-1.5 9.5H5.5z" />
      <path d="M5.5 18.5h13" />
    </svg>
  );
}

// One laurel half; pass side="right" to mirror it.
export function Laurel({ side = "left", className = "", style }) {
  return (
    <svg
      className={className}
      style={{ ...style, transform: side === "right" ? "scaleX(-1)" : undefined }}
      viewBox="0 0 16 30" fill="currentColor" stroke="none"
    >
      <path d="M9 8 A 8 8 0 0 0 9 22" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="6.6" cy="9.5"  rx="3" ry="1.5" transform="rotate(-35 6.6 9.5)" />
      <ellipse cx="5.4" cy="12.4" rx="3" ry="1.5" transform="rotate(-18 5.4 12.4)" />
      <ellipse cx="5"   cy="15.3" rx="3" ry="1.5" transform="rotate(-2 5 15.3)" />
      <ellipse cx="5.4" cy="18.2" rx="3" ry="1.5" transform="rotate(16 5.4 18.2)" />
      <ellipse cx="6.6" cy="21"   rx="3" ry="1.5" transform="rotate(33 6.6 21)" />
    </svg>
  );
}
