import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface InputScreenProps {
  claimInput: string;
  setClaimInput: (val: string) => void;
  onCheckClaim: () => void;
  isLoading?: boolean;
}

const SAMPLE_CLAIMS = [
  "Eating sugar causes hyperactivity in kids",
  "Eating carrots improves your eyesight",
  "Cracking knuckles causes arthritis",
  "Cold weather causes the common cold",
  "You need to drink 8 glasses of water every day",
  "Humans only use 10% of their brain"
];

export const InputScreen: React.FC<InputScreenProps> = ({
  claimInput,
  setClaimInput,
  onCheckClaim,
  isLoading = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (claimInput.trim()) {
        onCheckClaim();
      }
    }
  };

  return (
    <div className="relative flex flex-col justify-between flex-1 px-6 py-6 overflow-y-auto">
      {/* Background Watermark Cross (soft medical icon as seen in screenshot) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 200 200"
          fill="currentColor"
          className="w-96 h-96 text-slate-900"
        >
          <path d="M80 20 h40 v60 h60 v40 h-60 v60 h-40 v-60 h-60 v-40 h60 z" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col space-y-5">
        {/* Subtitle / Prompt */}
        <p className="text-base text-slate-700 font-normal leading-snug">
          Enter a <span className="font-semibold text-slate-900">health claim</span> to check if it's true or false
        </p>

        {/* Claim Text Input Container */}
        <div className="relative">
          <textarea
            value={claimInput}
            onChange={(e) => setClaimInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Eating carrots improves your eyesight"
            rows={5}
            className="w-full p-4 rounded-xl border border-slate-300/80 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-xs resize-none text-base leading-relaxed transition-all"
          />
          {claimInput && (
            <button
              onClick={() => setClaimInput('')}
              className="absolute top-3 right-3 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md px-1.5 py-0.5 cursor-pointer transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Check Claim Button */}
        <button
          onClick={onCheckClaim}
          disabled={!claimInput.trim() || isLoading}
          className="w-full py-3.5 px-4 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Checking...</span>
            </div>
          ) : (
            <span>Check Claim</span>
          )}
        </button>

        {/* Quick Sample Claims to Click */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-500" />
              Try Popular Claims
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {SAMPLE_CLAIMS.slice(0, 4).map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setClaimInput(sample);
                }}
                className="text-left text-xs text-slate-600 hover:text-sky-700 bg-slate-50 hover:bg-sky-50/70 border border-slate-200/70 rounded-lg px-3 py-2 transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="truncate pr-2">{sample}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Italic Caption (Screenshot 1: "Evidence-based health facts, at your fingertips.") */}
      <div className="relative z-10 pt-8 pb-2 text-center">
        <p className="text-xs italic text-slate-400 font-serif">
          Evidence-based health facts, at your fingertips.
        </p>
      </div>
    </div>
  );
};
