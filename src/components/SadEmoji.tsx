import React from 'react';

export const SadEmoji: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Main sphere gradient */}
          <radialGradient
            id="faceGrad"
            cx="40%"
            cy="35%"
            r="65%"
            fx="35%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#FFE785" />
            <stop offset="55%" stopColor="#FFBA35" />
            <stop offset="85%" stopColor="#F9941F" />
            <stop offset="100%" stopColor="#DF7314" />
          </radialGradient>

          {/* Eye pupil gradient */}
          <linearGradient id="eyeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A1C0E" />
            <stop offset="100%" stopColor="#1E0D06" />
          </linearGradient>

          {/* Eyebrow shadow */}
          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Soft shadow underneath */}
        <ellipse cx="60" cy="112" rx="42" ry="6" fill="#000000" opacity="0.12" filter="blur(3px)" />

        {/* Face sphere */}
        <circle cx="60" cy="58" r="48" fill="url(#faceGrad)" />

        {/* Top glossy highlight */}
        <ellipse cx="50" cy="24" rx="28" ry="12" fill="#FFFFFF" opacity="0.32" />

        {/* Soft pink blush cheeks */}
        <ellipse cx="30" cy="68" rx="10" ry="6" fill="#FF7043" opacity="0.22" filter="blur(2px)" />
        <ellipse cx="90" cy="68" rx="10" ry="6" fill="#FF7043" opacity="0.22" filter="blur(2px)" />

        {/* Eyebrows angled sadly (worried/pleading) */}
        <path
          d="M 32 36 C 38 31, 46 34, 49 37"
          stroke="#7A3E12"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 88 36 C 82 31, 74 34, 71 37"
          stroke="#7A3E12"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left Eye */}
        <circle cx="44" cy="54" r="11" fill="#FFFFFF" />
        <circle cx="44" cy="54" r="8.5" fill="url(#eyeGrad)" />
        {/* Large shiny highlights */}
        <circle cx="41" cy="51" r="3.2" fill="#FFFFFF" />
        <circle cx="46" cy="57" r="1.6" fill="#FFFFFF" />

        {/* Right Eye */}
        <circle cx="76" cy="54" r="11" fill="#FFFFFF" />
        <circle cx="76" cy="54" r="8.5" fill="url(#eyeGrad)" />
        {/* Large shiny highlights */}
        <circle cx="73" cy="51" r="3.2" fill="#FFFFFF" />
        <circle cx="78" cy="57" r="1.6" fill="#FFFFFF" />

        {/* Sad, small downward-curved mouth */}
        <path
          d="M 49 81 C 55 76, 65 76, 71 81"
          stroke="#522409"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
