import React, { useState } from 'react';
import { ShieldCheck, Bookmark, Check, Share2 } from 'lucide-react';
import { HealthClaim } from '../data/healthMyths';
import { useAuth } from '../context/AuthContext';

interface ResultScreenProps {
  claim: HealthClaim;
  onCheckAnother: () => void;
  onOpenAuth: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  claim,
  onCheckAnother,
  onOpenAuth,
}) => {
  const { user, isBookmarked, toggleBookmark } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const bookmarked = isBookmarked(claim.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = async () => {
    const shareText = `Health Myth Buster Check:\n"${claim.claim}"\nVerdict: ${claim.verdict}\n\n${claim.explanation}\n\nEvidence-based health facts at your fingertips.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Health Myth Buster: ${claim.claim}`,
          text: shareText,
          url: window.location.href,
        });
        showToast("Shared successfully!");
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      showToast("Result copied to clipboard!");
    } catch {
      showToast("Claim summary ready to share!");
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setIsSaving(true);
    try {
      const added = await toggleBookmark(claim);
      showToast(added ? "Saved to your profile bookmarks!" : "Removed from bookmarks");
    } catch (err: any) {
      showToast(err.message || "Failed to update bookmark");
    } finally {
      setIsSaving(false);
    }
  };

  // Color logic for verdict
  const isFalse = claim.verdict === 'FALSE' || claim.verdict === 'MYTH';
  const isTrue = claim.verdict === 'TRUE';
  const isPartial = claim.verdict === 'PARTIALLY TRUE' || claim.verdict === 'UNPROVEN';

  const verdictBorderColor = isFalse
    ? 'border-emerald-600'
    : isTrue
    ? 'border-blue-600'
    : 'border-amber-500';

  const verdictTextColor = isFalse
    ? 'text-emerald-600'
    : isTrue
    ? 'text-blue-600'
    : 'text-amber-600';

  return (
    <div className="relative flex flex-col justify-between flex-1 px-6 py-6 overflow-y-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-2 left-6 right-6 z-50 py-2 px-3 bg-slate-900/90 text-white text-xs font-medium rounded-lg text-center shadow-lg transition-all animate-fade-in flex items-center justify-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col space-y-5">
        {/* Top Claim Text (Screenshot 2: "Eating sugar causes hyperactivity in kids") */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-normal text-slate-800 leading-snug tracking-tight">
            {claim.claim}
          </h2>
          <button
            onClick={handleBookmark}
            disabled={isSaving}
            title={bookmarked ? "Bookmarked in profile" : "Save to profile bookmarks"}
            className={`p-2 rounded-lg border transition-all cursor-pointer shrink-0 ${
              bookmarked
                ? 'bg-sky-50 border-sky-300 text-sky-600 shadow-xs'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-sky-500 text-sky-500' : ''}`} />
          </button>
        </div>

        {/* Big Verdict Box (Screenshot 2: Rounded rectangle with "FALSE") */}
        <div className="w-full">
          <div
            className={`w-full py-3.5 px-4 rounded-xl border-2 ${verdictBorderColor} bg-white flex items-center justify-center shadow-xs transition-transform active:scale-[0.99]`}
          >
            <span
              className={`text-2xl sm:text-3xl font-extrabold tracking-wider ${verdictTextColor}`}
            >
              {claim.verdict}
            </span>
          </div>

          {/* Source Citation Line (Screenshot 2: "Source: Multiple studies reviewed by health experts") */}
          <p className="text-xs italic text-slate-500 font-serif mt-2.5">
            Source: {claim.source}
          </p>
        </div>

        {/* Explanation Paragraph (Screenshot 2: "Research shows sugar does not directly cause...") */}
        <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          <p>{claim.explanation}</p>
        </div>

        {/* Divider hairline */}
        <div className="border-t border-slate-100 my-1" />

        {/* Cross-verified Badge (Screenshot 2: Green shield check + "Cross-verified by medical professionals") */}
        <div className="flex items-center gap-2.5 py-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs sm:text-sm italic font-medium text-emerald-800">
            Cross-verified by medical professionals
          </span>
        </div>
      </div>

      {/* Bottom Action Buttons (Screenshot 2: "Share Result" (blue) & "Check Another Claim" (gray)) */}
      <div className="grid grid-cols-2 gap-3 pt-6 pb-2 mt-auto">
        <button
          onClick={handleShare}
          className="w-full py-3 px-3 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Result</span>
        </button>

        <button
          onClick={onCheckAnother}
          className="w-full py-3 px-3 bg-[#cbd5e1] hover:bg-[#94a3b8] active:bg-[#64748b] text-slate-700 hover:text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer"
        >
          <span>Check Another Claim</span>
        </button>
      </div>
    </div>
  );
};
