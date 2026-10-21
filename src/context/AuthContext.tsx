import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { HealthClaim } from '../data/healthMyths';

export interface UserProfileData {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BookmarkItem {
  id: string;
  userId: string;
  claim: string;
  verdict: string;
  source?: string;
  explanation: string;
  createdAt: string;
}

export interface ReportedClaimItem {
  id: string;
  claim: string;
  userId?: string;
  userEmail?: string;
  status: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  bookmarks: BookmarkItem[];
  userReports: ReportedClaimItem[];
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (newName: string) => Promise<void>;
  toggleBookmark: (claim: HealthClaim) => Promise<boolean>;
  isBookmarked: (claimId: string) => boolean;
  submitReportedClaim: (claimText: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [userReports, setUserReports] = useState<ReportedClaimItem[]>([]);

  // 1. Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user doc
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfileData);
          } else {
            const initialProfile: UserProfileData = {
              id: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Health Explorer',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, initialProfile);
            setProfile(initialProfile);
          }
        } catch (error) {
          console.error("Failed fetching user profile:", error);
        }
      } else {
        setProfile(null);
        setBookmarks([]);
        setUserReports([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time bookmarks listener when authenticated
  useEffect(() => {
    if (!user) return;
    const bookmarksColRef = collection(db, 'users', user.uid, 'bookmarks');
    const unsub = onSnapshot(
      bookmarksColRef,
      (snapshot) => {
        const items: BookmarkItem[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...d.data() } as BookmarkItem);
        });
        setBookmarks(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/bookmarks`);
      }
    );

    return () => unsub();
  }, [user]);

  // 3. Real-time reports listener for current user
  useEffect(() => {
    if (!user) return;
    const reportsColRef = collection(db, 'reportedClaims');
    const q = query(reportsColRef, where('userId', '==', user.uid));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items: ReportedClaimItem[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...d.data() } as ReportedClaimItem);
        });
        setUserReports(items);
      },
      (error) => {
        console.warn("Could not load user reports snapshot:", error);
      }
    );

    return () => unsub();
  }, [user]);

  // Sign up with Email & Password
  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    await updateProfile(cred.user, { displayName: name.trim() });
    const profileData: UserProfileData = {
      id: cred.user.uid,
      email: cred.user.email || email.trim(),
      displayName: name.trim() || 'Health Explorer',
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'users', cred.user.uid), profileData);
      setProfile(profileData);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${cred.user.uid}`);
    }
  };

  // Login with Email & Password
  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), pass);
  };

  // Password reset email
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  // Google sign in
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const userDocRef = doc(db, 'users', cred.user.uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      const initialProfile: UserProfileData = {
        id: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || 'Health Explorer',
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, initialProfile);
      setProfile(initialProfile);
    }
  };

  // Sign out
  const logout = async () => {
    await signOut(auth);
  };

  // Update display name
  const updateDisplayName = async (newName: string) => {
    if (!user) return;
    const trimmed = newName.trim();
    await updateProfile(user, { displayName: trimmed });
    const updated: UserProfileData = {
      ...(profile || { id: user.uid, email: user.email || '', createdAt: new Date().toISOString() }),
      displayName: trimmed,
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'users', user.uid), updated);
      setProfile(updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  // Check if claim is bookmarked
  const isBookmarked = (claimId: string): boolean => {
    return bookmarks.some((b) => b.id === claimId);
  };

  // Toggle bookmark
  const toggleBookmark = async (claim: HealthClaim): Promise<boolean> => {
    if (!user) {
      throw new Error("Please sign in to save health claims to your profile.");
    }
    const bookmarkDocRef = doc(db, 'users', user.uid, 'bookmarks', claim.id);
    const existing = bookmarks.find((b) => b.id === claim.id);
    if (existing) {
      try {
        await deleteDoc(bookmarkDocRef);
        return false;
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/bookmarks/${claim.id}`);
      }
    } else {
      const newBookmark: BookmarkItem = {
        id: claim.id,
        userId: user.uid,
        claim: claim.claim,
        verdict: claim.verdict,
        source: claim.source,
        explanation: claim.explanation,
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(bookmarkDocRef, newBookmark);
        return true;
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/bookmarks/${claim.id}`);
      }
    }
  };

  // Submit reported claim
  const submitReportedClaim = async (claimText: string) => {
    const reportId = 'rep_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const reportData: ReportedClaimItem = {
      id: reportId,
      claim: claimText.trim().substring(0, 500),
      userId: user?.uid || 'anonymous',
      userEmail: user?.email || '',
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'reportedClaims', reportId), reportData);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `reportedClaims/${reportId}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        bookmarks,
        userReports,
        signUpWithEmail,
        loginWithEmail,
        resetPassword,
        loginWithGoogle,
        logout,
        updateDisplayName,
        toggleBookmark,
        isBookmarked,
        submitReportedClaim
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
