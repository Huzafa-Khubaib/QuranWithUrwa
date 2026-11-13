export function LoginIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="180" cy="290" rx="110" ry="18" fill="#E8D4C0" opacity="0.5" />
      {/* Soft blocks */}
      <rect x="28" y="40" width="44" height="44" rx="14" fill="#F8C9B5" />
      <rect x="290" y="60" width="36" height="36" rx="12" fill="#BFE0D0" />
      <rect x="40" y="200" width="32" height="32" rx="10" fill="#FBE7A8" />
      <rect x="300" y="190" width="28" height="28" rx="10" fill="#BFD7EA" />

      {/* Crescent + star */}
      <path
        d="M250 88c-18 2-32 18-32 36 0 20 16 36 36 36 8 0 16-2 22-6-14 8-32 4-42-10-10-14-8-34 4-46 4-4 8-6 12-10Z"
        fill="#FBE7A8"
      />
      <path d="M268 78l4 10 10 2-8 7 3 10-9-5-9 5 3-10-8-7 10-2 4-10Z" fill="#BFE0D0" />

      {/* Kid with backpack / book */}
      <path d="M120 210c8-48 40-78 70-78s62 30 70 78v40H120v-40Z" fill="#BFE0D0" />
      <circle cx="190" cy="118" r="52" fill="#F8C9B5" />
      <path
        d="M145 112c6-48 35-68 50-68 14 0 28 8 38 22 14-6 30 4 36 22 4 14 0 30-8 40-8-22-28-36-48-36-28 0-52 18-62 42-6-8-10-14-6-22Z"
        fill="#5A3A2E"
      />
      <ellipse cx="190" cy="82" rx="42" ry="16" fill="#FBE7A8" />
      <path d="M150 82c6-20 22-30 40-30s34 10 40 30" fill="#F5D878" />
      <circle cx="172" cy="118" r="5" fill="#3D2C29" />
      <circle cx="208" cy="118" r="5" fill="#3D2C29" />
      <path
        d="M178 136c6 8 18 8 24 0"
        stroke="#C47A6A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="155" y="200" width="70" height="48" rx="12" fill="#BFD7EA" />
      <text x="190" y="230" textAnchor="middle" fill="#3D2C29" fontSize="16" fontFamily="serif">
        عروة
      </text>
    </svg>
  );
}
