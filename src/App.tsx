import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { InputScreen } from './components/InputScreen';
import { ResultScreen } from './components/ResultScreen';
import { NotFoundScreen } from './components/NotFoundScreen';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { InstallModal } from './components/InstallModal';
import { HEALTH_MYTHS_DATABASE, findHealthClaim, HealthClaim } from './data/healthMyths';
import { Download } from 'lucide-react';

type ScreenView = 'input' | 'result' | 'not_found';

const MainApp: React.FC = () => {
  const { user } = useAuth();

  // Screen view state
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('input');
  const [claimInput, setClaimInput] = useState<string>('Eating carrots improves your eyesight');
  const [activeClaim, setActiveClaim] = useState<HealthClaim>(
    HEALTH_MYTHS_DATABASE.find(m => m.id === 'sugar-hyperactivity') || HEALTH_MYTHS_DATABASE[0]
  );
  const [unfoundClaimText, setUnfoundClaimText] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isInstallOpen, setIsInstallOpen] = useState<boolean>(false);

  // Check claim logic
  const handleCheckClaim = (overrideClaim?: string) => {
    const textToCheck = overrideClaim !== undefined ? overrideClaim : claimInput;
    if (!textToCheck.trim()) return;

    setIsChecking(true);
    setTimeout(() => {
      const match = findHealthClaim(textToCheck);
      if (match) {
        setActiveClaim(match);
        setCurrentScreen('result');
      } else {
        setUnfoundClaimText(textToCheck.trim());
        setCurrentScreen('not_found');
      }
      setIsChecking(false);
    }, 200);
  };

  const handleResetToInput = () => {
    setCurrentScreen('input');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 text-slate-800 antialiased font-sans">
      {/* Top Bar on Desktop */}
      <div className="w-full max-w-[420px] mb-3 hidden sm:flex items-center justify-between text-xs text-slate-600 px-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Health Myth Buster</span>
        </div>

        {/* Quick test buttons to see each reference screen + Install button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsInstallOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </button>

          <button
            onClick={() => {
              setClaimInput('Eating carrots improves your eyesight');
              setCurrentScreen('input');
            }}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              currentScreen === 'input'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Input
          </button>
          <button
            onClick={() => {
              const sugarClaim = HEALTH_MYTHS_DATABASE.find(m => m.id === 'sugar-hyperactivity') || HEALTH_MYTHS_DATABASE[0];
              setActiveClaim(sugarClaim);
              setCurrentScreen('result');
            }}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              currentScreen === 'result'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Result
          </button>
          <button
            onClick={() => {
              setUnfoundClaimText('Drinking ionized alkaline battery water restores youthful energy');
              setCurrentScreen('not_found');
            }}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              currentScreen === 'not_found'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Not Found
          </button>
        </div>
      </div>

      {/* Main Mobile App Container (Identical to Screenshots 1, 2, and 3) */}
      <div className="w-full h-screen sm:h-[780px] sm:max-w-[390px] bg-white sm:rounded-3xl sm:shadow-2xl sm:border sm:border-slate-200/80 flex flex-col overflow-hidden relative">
        {/* Top Speaker / Dynamic Notch for phone mockup on desktop */}
        <div className="hidden sm:flex w-full pt-2.5 pb-1 justify-center items-center shrink-0 bg-white">
          <div className="w-20 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* App Header (with Title, Plus Icon, Install trigger, and Auth Avatar) */}
        <Header
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onResetToInput={handleResetToInput}
          onOpenInstall={() => setIsInstallOpen(true)}
        />

        {/* Screen 1: Input Screen (Screenshot 1) */}
        {currentScreen === 'input' && (
          <InputScreen
            claimInput={claimInput}
            setClaimInput={setClaimInput}
            onCheckClaim={() => handleCheckClaim()}
            isLoading={isChecking}
          />
        )}

        {/* Screen 2: Result Screen (Screenshot 2) */}
        {currentScreen === 'result' && activeClaim && (
          <ResultScreen
            claim={activeClaim}
            onCheckAnother={handleResetToInput}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {/* Screen 3: Not Found Screen (Screenshot 3) */}
        {currentScreen === 'not_found' && (
          <NotFoundScreen
            unfoundClaim={unfoundClaimText}
            onCheckAnother={handleResetToInput}
          />
        )}

        {/* Bottom Home Indicator Bar on phone mockup */}
        <div className="hidden sm:flex w-full pb-2 pt-1 justify-center items-center shrink-0 bg-white">
          <div className="w-32 h-1 bg-slate-200 rounded-full" />
        </div>
      </div>

      {/* Auth Modal (Login, Signup, Reset Password) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Profile Modal (Profile info, Bookmarks, Reported claims, Logout) */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSelectSavedClaim={(claim) => {
          setActiveClaim(claim);
          setCurrentScreen('result');
        }}
      />

      {/* Download / Install PWA Modal */}
      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
