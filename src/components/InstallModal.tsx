import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, Share2, Copy, Check, Apple, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'desktop'>('android');

  const appUrl = window.location.href;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Auto detect OS
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setActivePlatform('ios');
    } else if (/android/.test(userAgent)) {
      setActivePlatform('android');
    } else {
      setActivePlatform('desktop');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      onClose();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Download & Install App
              </h3>
              <p className="text-[11px] text-slate-500">
                Install Health Myth Buster on your smartphone or PC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Quick Native Install Button if supported */}
          {deferredPrompt && (
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-center space-y-2">
              <p className="text-xs font-semibold text-sky-900">
                Instant One-Click Install Available
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Install Health Myth Buster Now</span>
              </button>
            </div>
          )}

          {/* Platform Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setActivePlatform('android')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activePlatform === 'android'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Android</span>
            </button>

            <button
              onClick={() => setActivePlatform('ios')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activePlatform === 'ios'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Apple className="w-3.5 h-3.5 text-slate-700" />
              <span>iPhone / iOS</span>
            </button>

            <button
              onClick={() => setActivePlatform('desktop')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activePlatform === 'desktop'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-blue-600" />
              <span>Desktop</span>
            </button>
          </div>

          {/* Platform-Specific Step Guide */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
            {activePlatform === 'android' && (
              <div className="space-y-2 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">How to install on Android (Chrome):</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Open this link in <strong>Chrome</strong> on your Android phone.</li>
                  <li>Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.</li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>The app icon will appear directly on your home screen and app drawer!</li>
                </ol>
              </div>
            )}

            {activePlatform === 'ios' && (
              <div className="space-y-2 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">How to install on iPhone & iPad (Safari):</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Open this link in <strong>Safari</strong> on your iPhone or iPad.</li>
                  <li>Tap the <strong>Share</strong> button <Share2 className="w-3 h-3 inline mx-0.5" /> (square with arrow pointing up) at the bottom toolbar.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tap <strong>"Add"</strong> in the top right. You can now open it full-screen anytime!</li>
                </ol>
              </div>
            )}

            {activePlatform === 'desktop' && (
              <div className="space-y-2 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">How to install on Windows, Mac, or Chromebook:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>In Chrome or Edge, click the <strong>Install</strong> icon in the address bar (far right of URL).</li>
                  <li>Click <strong>Install</strong> to run Health Myth Buster in its own standalone window.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Copy App Link to Open on Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Open on your Smartphone
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-600 truncate font-mono select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
