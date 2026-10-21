import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { SadEmoji } from './SadEmoji';
import { useAuth } from '../context/AuthContext';

interface NotFoundScreenProps {
  unfoundClaim: string;
  onCheckAnother: () => void;
}

export const NotFoundScreen: React.FC<NotFoundScreenProps> = ({
  unfoundClaim,
  onCheckAnother,
}) => {
  const { submitReportedClaim } = useAuth();
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const handleReport = async () => {
    setIsSubmittingReport(true);
    setReportError(null);
    try {
      await submitReportedClaim(unfoundClaim);
      setReportSuccess(true);
    } catch (err: any) {
      setReportError(err.message || 'Could not send report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-between flex-1 px-6 py-6 overflow-y-auto">
      {/* Central Content (Screenshot 3) */}
      <div className="flex flex-col items-center justify-center text-center my-auto space-y-4 pt-4">
        {/* Pleading / Sad 3D Emoji Icon */}
        <SadEmoji className="w-28 h-28" />

        {/* Claim snippet if present */}
        {unfoundClaim && (
          <div className="max-w-xs px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-lg text-xs text-slate-500 italic truncate">
            "{unfoundClaim}"
          </div>
        )}

        {/* Heading (Screenshot 3: "Oops! We don't have information about this claim yet.") */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug px-2">
          Oops! We don't have information about this claim yet.
        </h2>

        {/* Subtext (Screenshot 3: "Our team is working hard to expand our database.") */}
        <p className="text-xs sm:text-sm italic text-slate-500 font-serif max-w-xs">
          Our team is working hard to expand our database.
        </p>

        {/* Report Status Messages */}
        {reportSuccess && (
          <div className="w-full max-w-xs p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Claim reported! Our research team has added this to our verification database.
            </span>
          </div>
        )}

        {reportError && (
          <div className="w-full max-w-xs p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{reportError}</span>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons (Screenshot 3: "Report to Our Team" (blue) & "Check Another Claim" (gray)) */}
      <div className="grid grid-cols-2 gap-3 pt-6 pb-2 mt-auto">
        <button
          onClick={handleReport}
          disabled={isSubmittingReport || reportSuccess}
          className="w-full py-3 px-3 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer"
        >
          {isSubmittingReport ? (
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Reporting...</span>
            </div>
          ) : reportSuccess ? (
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Reported</span>
            </div>
          ) : (
            <span>Report to Our Team</span>
          )}
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
