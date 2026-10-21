import React, { useState } from 'react';
import {
  X,
  User,
  Bookmark,
  Send,
  LogOut,
  KeyRound,
  Trash2,
  ExternalLink,
  Edit2,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth, BookmarkItem } from '../context/AuthContext';
import { HealthClaim } from '../data/healthMyths';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSavedClaim: (claim: HealthClaim) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onSelectSavedClaim,
}) => {
  const {
    user,
    profile,
    bookmarks,
    userReports,
    logout,
    updateDisplayName,
    resetPassword,
    toggleBookmark,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'reports' | 'settings'>('bookmarks');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.displayName || user?.displayName || '');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSavingName, setIsSavingName] = useState(false);

  if (!isOpen || !user) return null;

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setIsSavingName(true);
    try {
      await updateDisplayName(nameInput.trim());
      setEditingName(false);
      showStatus('Display name updated successfully!');
    } catch (err: any) {
      showStatus(err.message || 'Failed to update name', 'error');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!user.email) return;
    try {
      await resetPassword(user.email);
      showStatus(`Password reset email sent to ${user.email}`);
    } catch (err: any) {
      showStatus(err.message || 'Failed to send reset email', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleRemoveBookmark = async (e: React.MouseEvent, item: BookmarkItem) => {
    e.stopPropagation();
    try {
      const mockClaim: HealthClaim = {
        id: item.id,
        claim: item.claim,
        verdict: item.verdict as any,
        source: item.source || '',
        explanation: item.explanation,
        crossVerified: true,
        category: 'Nutrition',
        tags: []
      };
      await toggleBookmark(mockClaim);
      showStatus('Claim removed from bookmarks');
    } catch (err: any) {
      showStatus(err.message || 'Failed to remove', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-sky-400 text-white font-bold text-base flex items-center justify-center shadow-xs">
              {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800 leading-tight">
                  {profile?.displayName || user.displayName || 'Health Explorer'}
                </h3>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-md">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div
            className={`px-4 py-2 text-xs flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
                : 'bg-red-50 text-red-800 border-b border-red-100'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-100 px-6 bg-white shrink-0">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'bookmarks'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Claims ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'reports'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Reported ({userReports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'settings'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* TAB 1: Bookmarks */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-3">
              {bookmarks.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-medium text-slate-700">No saved claims yet</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    When you check a health claim, click the bookmark icon on the top right to save it here for reference.
                  </p>
                </div>
              ) : (
                bookmarks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      onSelectSavedClaim({
                        id: b.id,
                        claim: b.claim,
                        verdict: b.verdict as any,
                        source: b.source || 'Medical studies',
                        explanation: b.explanation,
                        crossVerified: true,
                        category: 'Nutrition',
                        tags: []
                      });
                      onClose();
                    }}
                    className="p-3.5 rounded-xl border border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/30 transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            b.verdict === 'FALSE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.verdict === 'TRUE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.verdict}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Saved {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-sky-700 truncate">
                        {b.claim}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {b.explanation}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleRemoveBookmark(e, b)}
                        title="Remove bookmark"
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: User Reported Claims */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              {userReports.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <Send className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-medium text-slate-700">No submitted claims</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    When you check a claim not yet in our database, click "Report to Our Team" to send it to our health research queue.
                  </p>
                </div>
              ) : (
                userReports.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                          Queued for Fact-Check
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        "{r.claim}"
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Our medical research team evaluates claims against peer-reviewed journals.
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Account Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Display Name Section */}
              <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Display Name
                </label>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 cursor-pointer disabled:opacity-50"
                    >
                      {isSavingName ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-800">
                      {profile?.displayName || user.displayName || 'Health Explorer'}
                    </span>
                    <button
                      onClick={() => {
                        setNameInput(profile?.displayName || user.displayName || '');
                        setEditingName(true);
                      }}
                      className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Password Reset Section */}
              <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2">
                <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-600" />
                  <span>Security & Password</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Send a password reset email to your account email address.
                </p>
                <button
                  onClick={handleSendPasswordReset}
                  className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Send Password Reset Link
                </button>
              </div>

              {/* Sign Out */}
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
