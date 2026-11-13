export function KidIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="210" cy="360" rx="120" ry="22" fill="#E8D4C0" opacity="0.55" />
      {/* Body */}
      <path
        d="M120 250c10-55 50-90 90-90s80 35 90 90v70H120v-70Z"
        fill="#BFE0D0"
      />
      <path
        d="M145 250c8-40 35-65 65-65s57 25 65 65"
        fill="#A8D4C0"
      />
      {/* Arms */}
      <ellipse cx="108" cy="280" rx="28" ry="42" fill="#F8C9B5" transform="rotate(-18 108 280)" />
      <ellipse cx="312" cy="280" rx="28" ry="42" fill="#F8C9B5" transform="rotate(18 312 280)" />
      {/* Book */}
      <rect x="155" y="255" width="110" height="78" rx="14" fill="#FFF4E6" />
      <rect x="160" y="260" width="100" height="68" rx="10" fill="#BFD7EA" />
      <path d="M210 260v68" stroke="#FFF4E6" strokeWidth="4" />
      <text
        x="210"
        y="302"
        textAnchor="middle"
        fill="#3D2C29"
        fontSize="22"
        fontFamily="serif"
      >
        قرآن
      </text>
      {/* Head */}
      <circle cx="210" cy="145" r="72" fill="#F8C9B5" />
      {/* Hair */}
      <path
        d="M140 140c8-70 50-95 70-95 18 0 35 8 48 22 20-8 42 2 52 28 8 20 4 42-6 55-12-30-38-48-64-48-36 0-68 24-80 58-8-8-16-14-20-20Z"
        fill="#5A3A2E"
      />
      {/* Cap / topi */}
      <ellipse cx="210" cy="95" rx="58" ry="22" fill="#FBE7A8" />
      <path
        d="M155 95c8-28 30-42 55-42s47 14 55 42"
        fill="#F5D878"
      />
      <circle cx="210" cy="78" r="8" fill="#BFE0D0" />
      {/* Face */}
      <circle cx="185" cy="145" r="7" fill="#3D2C29" />
      <circle cx="235" cy="145" r="7" fill="#3D2C29" />
      <circle cx="187" cy="143" r="2.5" fill="white" />
      <circle cx="237" cy="143" r="2.5" fill="white" />
      <path
        d="M195 168c8 12 22 12 30 0"
        stroke="#C47A6A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="168" cy="160" r="10" fill="#F2A090" opacity="0.55" />
      <circle cx="252" cy="160" r="10" fill="#F2A090" opacity="0.55" />
      {/* Sparkles */}
      <circle cx="70" cy="120" r="10" fill="#FBE7A8" />
      <circle cx="350" cy="140" r="8" fill="#BFE0D0" />
      <circle cx="60" cy="220" r="6" fill="#BFD7EA" />
      <circle cx="360" cy="230" r="7" fill="#F8C9B5" />
    </svg>
  );
}
