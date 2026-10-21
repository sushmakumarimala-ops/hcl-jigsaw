import React from 'react';
import { Bookmark, LogIn, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onResetToInput: () => void;
  onOpenInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenProfile,
  onResetToInput,
  onOpenInstall,
}) => {
  const { user, profile, bookmarks } = useAuth();

  return (
    <header className="w-full flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-xs select-none">
      {/* Title */}
      <button
        onClick={onResetToInput}
        className="flex items-center gap-2 group text-left cursor-pointer transition-opacity hover:opacity-85"
      >
        <h1 className="text-xl font-bold tracking-tight text-slate-800">
          Health <span className="text-slate-900 font-extrabold">Myth Buster</span>
        </h1>
      </button>

      {/* Right icons: Install Download, User Profile, Medical Plus */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Install / Download button */}
        <button
          onClick={onOpenInstall}
          title="Download & Install App"
          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* User Auth / Profile trigger */}
        {user ? (
          <button
            onClick={onOpenProfile}
            title="Open Profile"
            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-sky-500 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            {bookmarks.length > 0 && (
              <span className="hidden sm:inline-flex items-center text-[11px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-md">
                <Bookmark className="w-3 h-3 mr-0.5" />
                {bookmarks.length}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            title="Sign In / Register"
            className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 px-2.5 py-1.5 rounded-lg hover:bg-sky-50 transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}

        {/* Medical Plus Cross (as shown in Screenshots 1, 2, 3) */}
        <div
          title="Health Myth Buster"
          className="w-7 h-7 flex items-center justify-center text-sky-500 transition-transform active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-sky-500"
          >
            <path
              d="M10.5 4a1.5 1.5 0 0 1 3 0v6.5H20a1.5 1.5 0 0 1 0 3h-6.5V20a1.5 1.5 0 0 1-3 0v-6.5H4a1.5 1.5 0 0 1 0-3h6.5V4z"
              rx="1.5"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};
