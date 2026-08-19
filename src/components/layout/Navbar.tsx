'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Building2, 
  FileText, 
  LogOut, 
  ChevronDown, 
  PlusCircle, 
  Menu, 
  X, 
  CheckCircle2,
  Search
} from 'lucide-react';
import { useSession } from '@/lib/session';

export function Navbar() {
  const { user: session, signOut } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    signOut();
    setDropdownOpen(false);
    router.push('/sign-in');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isAdmin = session?.role === 'admin' || session?.userType === 'admin';
  const isOwner = session?.userType === 'owner';
  const isRenter = session?.userType === 'renter';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Role-Based Navigation */}
        <div className="flex items-center gap-8">
          <Link href={isAdmin ? "/admin/listings" : "/"} className="flex items-center gap-3 group">
            <img
              src="/the-rental-circle-logo-mark-black.svg"
              alt="The Rental Circle"
              className="h-6 w-6 transition-transform duration-200 group-hover:scale-105"
              width={24}
              height={24}
            />
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-black tracking-tight text-midnight uppercase">
                The Rental Circle
              </span>
              <span className="hidden sm:inline-block rounded-[2px] bg-surface-muted border border-border px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-text-muted uppercase">
                {isAdmin ? "ADMIN DESK" : "HYDERABAD"}
              </span>
            </div>
          </Link>

          {/* Navigation Links (Strictly Scoped by User Role) */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-text-secondary">
            {/* 1. ADMIN Navigation */}
            {isAdmin && (
              <>
                <Link 
                  href="/admin/listings" 
                  className={"hover:text-midnight transition-colors flex items-center gap-1.5 " + (pathname.startsWith("/admin") ? "text-midnight font-bold" : "")}
                >
                  <ShieldCheck className="h-4 w-4 text-cobalt" />
                  <span>Moderation Queue</span>
                </Link>
                <Link 
                  href="/safety" 
                  className={"hover:text-midnight transition-colors " + (pathname === "/safety" ? "text-midnight font-bold" : "")}
                >
                  Verification Protocol
                </Link>
              </>
            )}

            {/* 2. OWNER Navigation */}
            {isOwner && (
              <>
                <Link 
                  href="/owner/listings" 
                  className={"hover:text-midnight transition-colors " + (pathname === "/owner/listings" ? "text-midnight font-bold" : "")}
                >
                  Manage Properties
                </Link>
                <Link 
                  href="/owner/listings/new" 
                  className={"hover:text-midnight transition-colors " + (pathname === "/owner/listings/new" ? "text-midnight font-bold" : "")}
                >
                  List New Property
                </Link>
                <Link 
                  href="/how-it-works" 
                  className={"hover:text-midnight transition-colors " + (pathname === "/how-it-works" ? "text-midnight font-bold" : "")}
                >
                  How It Works
                </Link>
              </>
            )}

            {/* 3. RENTER Navigation */}
            {isRenter && (
              <>
                <Link 
                  href="/homes" 
                  className={"hover:text-midnight transition-colors " + (pathname.startsWith("/homes") ? "text-midnight font-bold" : "")}
                >
                  Browse Homes
                </Link>
                <Link 
                  href="/requests" 
                  className={"hover:text-midnight transition-colors " + (pathname === "/requests" ? "text-midnight font-bold" : "")}
                >
                  My Applications
                </Link>
                <Link 
                  href="/how-it-works" 
                  className={"hover:text-midnight transition-colors " + (pathname === "/how-it-works" ? "text-midnight font-bold" : "")}
                >
                  How It Works
                </Link>
                <Link 
                  href="/safety" 
                  className={"hover:text-midnight transition-colors " + (pathname === "/safety" ? "text-midnight font-bold" : "")}
                >
                  Trust & Safety
                </Link>
              </>
            )}

            {/* 4. GUEST Navigation */}
            {!session && (
              <>
                <Link 
                  href="/homes" 
                  className={"hover:text-midnight transition-colors " + (pathname.startsWith("/homes") ? "text-midnight font-bold" : "")}
                >
                  Browse Homes
                </Link>
                <Link 
                  href="/how-it-works" 
                  className={"hover:text-midnight transition-colors " + (pathname === "/how-it-works" ? "text-midnight font-bold" : "")}
                >
                  How It Works
                </Link>
                <Link 
                  href="/safety" 
                  className={"hover:text-midnight transition-colors " + (pathname === "/safety" ? "text-midnight font-bold" : "")}
                >
                  Trust & Safety
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Action CTAs / User Session */}
        <div className="flex items-center gap-3">
          {session ? (
            /* Active User Session Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-[3px] border border-border bg-white px-2.5 py-1.5 text-left text-xs font-semibold text-midnight hover:border-midnight hover:bg-surface-subtle transition-all focus:outline-none"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {/* Avatar */}
                <div className="h-7 w-7 rounded-full bg-midnight text-white flex items-center justify-center font-mono text-[11px] font-bold overflow-hidden shrink-0 ring-1 ring-border">
                  {session.avatarUrl ? (
                    <img src={session.avatarUrl} alt={session.name} className="h-full w-full object-cover" />
                  ) : (
                    <span>{getInitials(session.name)}</span>
                  )}
                </div>

                {/* Email / Label */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-midnight max-w-[130px] truncate">
                    {session.name}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted leading-tight max-w-[130px] truncate">
                    {session.email}
                  </span>
                </div>

                {/* Role badge */}
                <span
                  className={"hidden sm:inline-flex rounded-[2px] px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider " + (isAdmin ? "bg-cobalt text-white" : isOwner ? "bg-surface-muted text-midnight border border-border" : "bg-surface-muted text-text-muted")}
                >
                  {isAdmin ? "ADMIN" : isOwner ? "OWNER" : "RENTER"}
                </span>

                <ChevronDown className={"h-3.5 w-3.5 text-text-muted transition-transform duration-200 " + (dropdownOpen ? "rotate-180" : "")} />
              </button>

              {/* Dropdown Menu (Strictly Isolated by Role) */}
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 origin-top-right rounded-[2px] border border-border-strong bg-white p-1.5 shadow-[0_10px_30px_rgba(11,21,55,0.12)] ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  {/* User Profile Header in Dropdown */}
                  <div className="px-3 py-2.5 border-b border-border mb-1 bg-surface-subtle/60 rounded-[2px]">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-midnight truncate">{session.name}</p>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white border border-border text-cobalt">
                        {isAdmin ? "Admin" : isOwner ? "Owner" : "Renter"}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-text-muted truncate mt-0.5">{session.email}</p>
                  </div>

                  {/* Navigation Actions (Role Scoped) */}
                  <div className="space-y-0.5 text-xs font-semibold text-midnight">
                    {/* ADMIN MENU */}
                    {isAdmin && (
                      <>
                        <Link
                          href="/admin/listings"
                          className={"flex items-center justify-between px-3 py-2 rounded-[2px] transition-colors " + (pathname.startsWith("/admin") ? "bg-cobalt/10 text-cobalt font-bold" : "hover:bg-surface-muted hover:text-cobalt")}
                          role="menuitem"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShieldCheck className="h-4 w-4 text-cobalt" />
                            <span>Moderation Queue</span>
                          </div>
                          <span className="rounded bg-citrus px-1.5 py-0.2 text-[9px] font-mono font-black text-midnight uppercase tracking-wider">
                            Desk
                          </span>
                        </Link>
                        <Link
                          href="/safety"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-[2px] hover:bg-surface-muted hover:text-cobalt transition-colors"
                          role="menuitem"
                        >
                          <CheckCircle2 className="h-4 w-4 text-text-muted" />
                          <span>Verification Protocol</span>
                        </Link>
                      </>
                    )}

                    {/* OWNER MENU */}
                    {isOwner && (
                      <>
                        <Link
                          href="/owner/listings"
                          className={"flex items-center gap-2.5 px-3 py-2 rounded-[2px] transition-colors " + (pathname === "/owner/listings" ? "bg-cobalt/10 text-cobalt font-bold" : "hover:bg-surface-muted hover:text-cobalt")}
                          role="menuitem"
                        >
                          <Building2 className="h-4 w-4 text-text-muted" />
                          <span>Manage Properties</span>
                        </Link>
                        <Link
                          href="/owner/listings/new"
                          className={"flex items-center gap-2.5 px-3 py-2 rounded-[2px] transition-colors " + (pathname === "/owner/listings/new" ? "bg-cobalt/10 text-cobalt font-bold" : "hover:bg-surface-muted hover:text-cobalt")}
                          role="menuitem"
                        >
                          <PlusCircle className="h-4 w-4 text-text-muted" />
                          <span>List New Property</span>
                        </Link>
                      </>
                    )}

                    {/* RENTER MENU */}
                    {isRenter && (
                      <>
                        <Link
                          href="/homes"
                          className={"flex items-center gap-2.5 px-3 py-2 rounded-[2px] transition-colors " + (pathname.startsWith("/homes") ? "bg-cobalt/10 text-cobalt font-bold" : "hover:bg-surface-muted hover:text-cobalt")}
                          role="menuitem"
                        >
                          <Search className="h-4 w-4 text-text-muted" />
                          <span>Browse Homes</span>
                        </Link>
                        <Link
                          href="/requests"
                          className={"flex items-center gap-2.5 px-3 py-2 rounded-[2px] transition-colors " + (pathname === "/requests" ? "bg-cobalt/10 text-cobalt font-bold" : "hover:bg-surface-muted hover:text-cobalt")}
                          role="menuitem"
                        >
                          <FileText className="h-4 w-4 text-text-muted" />
                          <span>My Applications</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="border-t border-border my-1"></div>

                  {/* Sign Out Action */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-tangerine-dark hover:bg-tangerine-surface rounded-[2px] transition-colors text-left"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4 text-tangerine" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out CTAs */
            <>
              <Link
                href="/list-your-property"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-[3px] border border-border bg-white px-3.5 py-2 text-xs font-bold tracking-wide text-midnight hover:border-midnight hover:bg-surface-muted active:scale-[0.98] transition-all"
              >
                List Property
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-[3px] bg-midnight px-4 py-2 text-xs font-bold tracking-wide text-white hover:bg-cobalt active:scale-[0.98] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
              >
                Sign In
              </Link>
            </>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-midnight hover:bg-surface-muted rounded-[2px]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel (Role Scoped) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-white px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-text-secondary">
            {isAdmin ? (
              <>
                <Link href="/admin/listings" className="py-2 text-cobalt font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Moderation Queue
                </Link>
                <Link href="/safety" className="py-2 hover:text-midnight">
                  Verification Protocol
                </Link>
              </>
            ) : isOwner ? (
              <>
                <Link href="/owner/listings" className="py-2 text-midnight font-bold flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Manage Properties
                </Link>
                <Link href="/owner/listings/new" className="py-2 text-midnight font-bold flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" /> List New Property
                </Link>
                <Link href="/how-it-works" className="py-2 hover:text-midnight">
                  How It Works
                </Link>
              </>
            ) : isRenter ? (
              <>
                <Link href="/homes" className="py-2 hover:text-midnight">
                  Browse Homes
                </Link>
                <Link href="/requests" className="py-2 text-midnight font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4" /> My Applications
                </Link>
                <Link href="/how-it-works" className="py-2 hover:text-midnight">
                  How It Works
                </Link>
                <Link href="/safety" className="py-2 hover:text-midnight">
                  Trust & Safety
                </Link>
              </>
            ) : (
              <>
                <Link href="/homes" className="py-2 hover:text-midnight">
                  Browse Homes
                </Link>
                <Link href="/how-it-works" className="py-2 hover:text-midnight">
                  How It Works
                </Link>
                <Link href="/safety" className="py-2 hover:text-midnight">
                  Trust & Safety
                </Link>
                <div className="border-t border-border pt-2"></div>
                <Link href="/list-your-property" className="py-2 text-midnight font-bold">
                  List Property
                </Link>
                <Link href="/sign-in" className="py-2 text-cobalt font-bold">
                  Sign In / Register
                </Link>
              </>
            )}

            {session && (
              <>
                <div className="border-t border-border pt-2"></div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 py-2 text-tangerine-dark font-bold text-left"
                >
                  <LogOut className="h-4 w-4 text-tangerine" /> Sign Out ({session.email})
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
