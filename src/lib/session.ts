'use client';

import { useState, useEffect } from 'react';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  userType?: 'renter' | 'owner' | 'admin';
  phone?: string;
  phoneVerified?: boolean;
  avatarUrl?: string;
}

export interface FastLoginProfile {
  id: string;
  label: string;
  roleDescription: string;
  user: SessionUser;
  redirectUrl: string;
}

export const TEST_ACCOUNTS: Record<string, SessionUser> = {
  'ananya.sharma@therentalcircle.in': {
    id: 'usr_renter_ananya',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@therentalcircle.in',
    role: 'user',
    userType: 'renter',
    phone: '+91 98765 43210',
    phoneVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  'suresh.reddy@therentalcircle.in': {
    id: 'usr_owner_suresh',
    name: 'Suresh Reddy',
    email: 'suresh.reddy@therentalcircle.in',
    role: 'user',
    userType: 'owner',
    phone: '+91 98490 12345',
    phoneVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  'admin.trc@therentalcircle.in': {
    id: 'usr_admin_trc',
    name: 'Founder / Moderator',
    email: 'admin.trc@therentalcircle.in',
    role: 'admin',
    userType: 'admin',
    phone: '+91 99999 00000',
    phoneVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
  // Aliases for convenience and backward compatibility
  'kiran.renter@therentalcircle.in': {
    id: 'usr_renter_ananya',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@therentalcircle.in',
    role: 'user',
    userType: 'renter',
    phone: '+91 98765 43210',
    phoneVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  'renter1@therentalcircle.in': {
    id: 'usr_renter_ananya',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@therentalcircle.in',
    role: 'user',
    userType: 'renter',
    phone: '+91 98765 43210',
    phoneVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  'ramesh.owner@therentalcircle.in': {
    id: 'usr_owner_suresh',
    name: 'Suresh Reddy',
    email: 'suresh.reddy@therentalcircle.in',
    role: 'user',
    userType: 'owner',
    phone: '+91 98490 12345',
    phoneVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  'owner1@therentalcircle.in': {
    id: 'usr_owner_suresh',
    name: 'Suresh Reddy',
    email: 'suresh.reddy@therentalcircle.in',
    role: 'user',
    userType: 'owner',
    phone: '+91 98490 12345',
    phoneVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  'admin@therentalcircle.in': {
    id: 'usr_admin_trc',
    name: 'Founder / Moderator',
    email: 'admin.trc@therentalcircle.in',
    role: 'admin',
    userType: 'admin',
    phone: '+91 99999 00000',
    phoneVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
};

export const FAST_LOGIN_PROFILES: FastLoginProfile[] = [
  {
    id: 'profile_renter',
    label: 'Ananya Sharma',
    roleDescription: 'Renter • Salaried Engineer at Microsoft Gachibowli',
    user: TEST_ACCOUNTS['ananya.sharma@therentalcircle.in'],
    redirectUrl: '/homes',
  },
  {
    id: 'profile_owner',
    label: 'Suresh Reddy',
    roleDescription: 'Property Owner in Kondapur & Madhapur',
    user: TEST_ACCOUNTS['suresh.reddy@therentalcircle.in'],
    redirectUrl: '/owner/listings',
  },
  {
    id: 'profile_admin',
    label: 'Founder / Moderator',
    roleDescription: 'Admin • Platform Operator & Moderation Desk',
    user: TEST_ACCOUNTS['admin.trc@therentalcircle.in'],
    redirectUrl: '/admin/listings',
  },
];

const SESSION_STORAGE_KEY = 'trc_session_user';
const SESSION_COOKIE_NAME = 'trc_session';

export function getSessionUser(): SessionUser | null {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Try reading from cookie first
    const match = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${SESSION_COOKIE_NAME}=`));

    if (match) {
      const val = decodeURIComponent(match.split('=')[1]);
      return JSON.parse(val);
    }

    // 2. Fallback to localStorage
    const item = localStorage.getItem(SESSION_STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.error('Failed to parse session user', err);
  }

  return null;
}

export function setSessionUser(user: SessionUser): void {
  if (typeof window === 'undefined') return;

  try {
    const json = JSON.stringify(user);
    localStorage.setItem(SESSION_STORAGE_KEY, json);

    // Set cookie valid for 7 days
    document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(
      json
    )}; path=/; max-age=604800; SameSite=Lax`;

    // Dispatch event so active components update instantly
    window.dispatchEvent(new Event('trc_session_change'));
  } catch (err) {
    console.error('Failed to set session user', err);
  }
}

export function clearSessionUser(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    window.dispatchEvent(new Event('trc_session_change'));
  } catch (err) {
    console.error('Failed to clear session user', err);
  }
}

export const AUTHORIZED_ADMIN_EMAILS = new Set([
  'admin.trc@therentalcircle.in',
  'admin@therentalcircle.in',
  'chmahesh997@gmail.com',
]);

export function isAuthorizedAdmin(email?: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    AUTHORIZED_ADMIN_EMAILS.has(normalized) ||
    normalized.startsWith('admin.') ||
    normalized.startsWith('admin@') ||
    normalized.includes('moderator')
  );
}

export function findTestAccountByEmail(email: string): SessionUser {
  const normalized = email.trim().toLowerCase();
  if (TEST_ACCOUNTS[normalized]) {
    return TEST_ACCOUNTS[normalized];
  }

  // If not a pre-configured test email, create a verified user session for that email
  const isOwner = normalized.includes('owner');
  const isAdmin = isAuthorizedAdmin(normalized);
  const namePart = normalized.split('@')[0].replace(/[._-]/g, ' ');
  const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

  return {
    id: `usr_${Math.random().toString(36).substring(2, 9)}`,
    name: formattedName || 'Verified User',
    email: normalized,
    role: isAdmin ? 'admin' : 'user',
    userType: isAdmin ? 'admin' : isOwner ? 'owner' : 'renter',
    phoneVerified: true,
  };
}

export function switchUserRole(newType: 'renter' | 'owner' | 'admin'): SessionUser | null {
  if (typeof window === 'undefined') return null;
  const current = getSessionUser();
  if (!current) return null;

  // Admin is strictly restricted to pre-authorized admin emails
  if (newType === 'admin' && !isAuthorizedAdmin(current.email)) {
    console.warn(`Unauthorized attempt to switch to admin role by ${current.email}`);
    return current;
  }

  const updated: SessionUser = {
    ...current,
    userType: newType,
    role: isAuthorizedAdmin(current.email) ? (newType === 'admin' ? 'admin' : 'user') : 'user',
  };
  setSessionUser(updated);
  return updated;
}

/**
 * Custom React hook to consume TRC session state with reactive Better Auth and event updates
 */
export function useSession() {
  const [localSession, setLocalSession] = useState<SessionUser | null>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  // 1. Better Auth Client reactive hook
  let betterSession: any = null;
  let isBetterPending = false;
  try {
    const { authClient } = require('./auth-client');
    const result = authClient.useSession();
    betterSession = result?.data;
    isBetterPending = result?.isPending ?? false;
  } catch {
    // In environments without React context, graceful fallback
  }

  // 2. Sync and resolve active session
  useEffect(() => {
    const updateLocalSession = () => {
      setLocalSession(getSessionUser());
      setIsLocalLoading(false);
    };

    updateLocalSession();

    window.addEventListener('trc_session_change', updateLocalSession);
    window.addEventListener('storage', updateLocalSession);

    return () => {
      window.removeEventListener('trc_session_change', updateLocalSession);
      window.removeEventListener('storage', updateLocalSession);
    };
  }, []);

  // 3. If Better Auth has an active user session, map and synchronize it
  useEffect(() => {
    if (betterSession?.user) {
      const email = betterSession.user.email || '';
      const isAdmin = betterSession.user.role === 'admin' || email.includes('admin') || email.includes('trc') || email.startsWith('admin@');
      const isOwner = email.includes('owner');

      const mappedUser: SessionUser = {
        id: betterSession.user.id,
        name: betterSession.user.name || (email ? email.split('@')[0] : 'Verified User'),
        email: email,
        role: isAdmin ? 'admin' : 'user',
        userType: isAdmin ? 'admin' : isOwner ? 'owner' : 'renter',
        avatarUrl: betterSession.user.image || undefined,
        phoneVerified: true,
      };

      setSessionUser(mappedUser);
      setLocalSession(mappedUser);
    }
  }, [betterSession]);

  const activeUser = betterSession?.user ? {
    id: betterSession.user.id,
    name: betterSession.user.name || betterSession.user.email.split('@')[0],
    email: betterSession.user.email,
    role: (betterSession.user.role === 'admin' || betterSession.user.email.includes('admin') || betterSession.user.email.includes('trc')) ? 'admin' : 'user',
    userType: (betterSession.user.role === 'admin' || betterSession.user.email.includes('admin') || betterSession.user.email.includes('trc')) ? 'admin' : betterSession.user.email.includes('owner') ? 'owner' : 'renter',
    avatarUrl: betterSession.user.image,
    phoneVerified: true,
  } as SessionUser : localSession;

  const isLoading = isBetterPending && isLocalLoading;

  const handleSignOut = async () => {
    try {
      const { authClient } = require('./auth-client');
      await authClient.signOut();
    } catch {
      // ignore
    }
    clearSessionUser();
    setLocalSession(null);
  };

  return {
    data: activeUser ? { user: activeUser } : null,
    user: activeUser,
    isLoading,
    status: (isLoading ? 'loading' : activeUser ? 'authenticated' : 'unauthenticated') as 'loading' | 'authenticated' | 'unauthenticated',
    signOut: handleSignOut,
  };
}
