'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  User, 
  Building2, 
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  Check,
  Search,
  Phone,
  UserPlus
} from 'lucide-react';
import { 
  setSessionUser, 
  findTestAccountByEmail, 
  FAST_LOGIN_PROFILES, 
  type FastLoginProfile,
  type SessionUser
} from '@/lib/session';

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Sign In form states
  const [email, setEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Register form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUserType, setRegUserType] = useState<'renter' | 'owner'>('renter');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'register') {
      setActiveTab('register');
    }
  }, [searchParams]);

  // Resend timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpSent && resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [isOtpSent, resendCountdown]);

  const getRedirectUrlForUser = (user: SessionUser): string => {
    const redirectParam = searchParams.get('redirect');
    if (redirectParam) {
      return redirectParam;
    }
    if (user.role === 'admin' || user.userType === 'admin') {
      return '/admin/listings';
    }
    if (user.userType === 'owner') {
      return '/owner/listings';
    }
    return '/homes';
  };

  const handleFastLogin = (profile: FastLoginProfile) => {
    setSelectedProfileId(profile.id);
    setIsLoading(true);

    const user = profile.user;
    setSessionUser(user);
    setSuccessMessage("Authenticated as " + user.name + " (" + profile.label + ")");

    setTimeout(() => {
      const redirectParam = searchParams.get('redirect');
      router.push(redirectParam || profile.redirectUrl);
    }, 400);
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      const googleUser: SessionUser = {
        id: "usr_google_" + Math.random().toString(36).substring(2, 8),
        name: 'Ananya Sharma',
        email: 'ananya.sharma@gmail.com',
        role: 'user',
        userType: 'renter',
        phone: '+91 98765 43210',
        phoneVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };

      setSessionUser(googleUser);
      setSuccessMessage('Signed in via Google OAuth successfully');

      setTimeout(() => {
        router.push(getRedirectUrlForUser(googleUser));
      }, 400);
    }, 500);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      setOtp('123456');
      setResendCountdown(30);
      setCanResend(false);
    }, 400);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtp('123456');
      setResendCountdown(30);
      setCanResend(false);
    }, 300);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setIsLoading(true);

    const user = findTestAccountByEmail(email);
    setSessionUser(user);
    setSuccessMessage("Authenticated successfully as " + user.name);

    const targetUrl = getRedirectUrlForUser(user);
    setTimeout(() => {
      router.push(targetUrl);
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;
    setIsLoading(true);

    const newUser: SessionUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      role: 'user',
      userType: regUserType,
      phone: regPhone.trim() || '+91 98000 00000',
      phoneVerified: true,
    };

    setSessionUser(newUser);
    setSuccessMessage("Account created successfully as " + newUser.name + " (" + (regUserType === 'owner' ? 'Property Owner' : 'Renter') + ")");

    const targetUrl = regUserType === 'owner' ? '/owner/listings' : '/homes';
    setTimeout(() => {
      router.push(targetUrl);
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-canvas text-midnight font-sans antialiased flex flex-col justify-center py-8 lg:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full space-y-6">
        
        {/* Main Authentication Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-border rounded-[2px] overflow-hidden bg-white shadow-[0_4px_24px_rgba(11,21,55,0.06)]">
          {/* Left Column: Interactive Auth Methods (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 border border-border bg-surface-subtle px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cobalt rounded-[2px]">
                <span className="h-1.5 w-1.5 rounded-full bg-citrus"></span>
                Secure Access • Hyderabad Pilot
              </div>
              
              {/* Tab Switcher */}
              <div className="flex items-center gap-2 border-b border-border pb-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setSuccessMessage(null); }}
                  className={"pb-2.5 text-sm font-bold tracking-tight transition-all border-b-2 " + (activeTab === 'signin' ? "border-midnight text-midnight" : "border-transparent text-text-muted hover:text-midnight")}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setSuccessMessage(null); }}
                  className={"pb-2.5 text-sm font-bold tracking-tight transition-all border-b-2 " + (activeTab === 'register' ? "border-midnight text-midnight" : "border-transparent text-text-muted hover:text-midnight")}
                >
                  Create Account (Register)
                </button>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-midnight tracking-tight leading-[1.1]">
                  {activeTab === 'signin' ? 'Sign in to The Rental Circle' : 'Create your verified account'}
                </h1>
                <p className="text-xs text-text-secondary leading-relaxed font-normal mt-1">
                  {activeTab === 'signin' 
                    ? 'Access your reviewed properties, tenant applications, and moderation queue.'
                    : 'Join the verified Hyderabad residential marketplace as a renter or property owner.'}
                </p>
              </div>
            </div>

            {successMessage && (
              <div className="rounded-[2px] border border-verified-border bg-verified-surface p-3 text-xs font-bold text-verified flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {activeTab === 'signin' && (
              <div className="space-y-6">
                {/* 1-Click Fast Pilot Personas */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">
                      1-Click Pilot Test Personas
                    </label>
                    <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[9px] font-mono font-bold text-cobalt border border-border">
                      INSTANT DEMO
                    </span>
                  </div>

                  <div className="space-y-2">
                    {FAST_LOGIN_PROFILES.map(profile => {
                      const isSelected = selectedProfileId === profile.id;
                      const isProfileAdmin = profile.user.role === 'admin' || profile.user.userType === 'admin';
                      const isProfileOwner = profile.user.userType === 'owner';

                      return (
                        <button
                          key={profile.id}
                          type="button"
                          onClick={() => handleFastLogin(profile)}
                          disabled={isLoading}
                          className={"w-full text-left p-3 rounded-[2px] border transition-all flex items-center justify-between group " + (
                            isSelected 
                              ? "border-cobalt bg-cobalt/5 shadow-sm ring-1 ring-cobalt/20" 
                              : "border-border bg-white hover:border-midnight hover:bg-surface-subtle"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " + (
                              isProfileAdmin 
                                ? "bg-cobalt text-white" 
                                : isProfileOwner 
                                ? "bg-midnight text-white" 
                                : "bg-surface-muted text-midnight border border-border"
                            )}>
                              {profile.user.name[0]}
                            </div>
                            <div className="space-y-0.5 text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-midnight">{profile.label}</span>
                                <span className={"text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded " + (
                                  isProfileAdmin 
                                    ? "bg-citrus text-midnight" 
                                    : isProfileOwner 
                                    ? "bg-surface-muted text-midnight border border-border" 
                                    : "bg-surface-muted text-text-muted"
                                )}>
                                  {isProfileAdmin ? 'ADMIN DESK' : isProfileOwner ? 'OWNER' : 'RENTER'}
                                </span>
                              </div>
                              <p className="text-[11px] text-text-muted line-clamp-1">{profile.roleDescription}</p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-text-faint group-hover:text-midnight group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-mono text-text-faint uppercase tracking-wider">or sign in with credentials</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full flex items-center justify-center gap-3 rounded-[2px] border border-border bg-white py-2.5 px-4 text-xs font-bold text-midnight hover:bg-surface-muted hover:border-border-strong transition-all focus:outline-none"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z" />
                  </svg>
                  <span>{isGoogleLoading ? 'Connecting with Google...' : 'Continue with Google Account'}</span>
                </button>

                {/* Email OTP Form */}
                {!isOtpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                      Email Passcode Login
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="name@company.com or email"
                          className="w-full rounded-[2px] border border-border bg-white pl-9 pr-3 py-2 text-xs font-medium text-midnight placeholder:text-text-faint focus:border-midnight focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading || !email.trim()}
                        className="rounded-[2px] bg-midnight px-4 py-2 text-xs font-bold text-white hover:bg-cobalt transition-colors disabled:opacity-50"
                      >
                        Send OTP
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-text-muted">
                        6-Digit OTP sent to {email}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsOtpSent(false)}
                        className="text-[10px] text-cobalt font-bold hover:underline"
                      >
                        Change Email
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full rounded-[2px] border border-border bg-white px-3 py-2 text-xs font-mono font-bold tracking-widest text-center text-midnight focus:border-midnight focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !otp.trim()}
                        className="rounded-[2px] bg-cobalt px-5 py-2 text-xs font-bold uppercase text-white hover:bg-cobalt-hover transition-colors"
                      >
                        Verify
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-5">
                {/* Account Type Selection */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                    I am registering as:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegUserType('renter')}
                      className={"p-3 rounded-[2px] border text-left flex flex-col justify-between transition-all " + (
                        regUserType === 'renter' 
                          ? "border-cobalt bg-cobalt/5 ring-1 ring-cobalt/30" 
                          : "border-border bg-white hover:border-midnight"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Search className={"h-4 w-4 " + (regUserType === 'renter' ? "text-cobalt" : "text-text-muted")} />
                        <span className={"text-[9px] font-mono font-bold uppercase " + (regUserType === 'renter' ? "text-cobalt" : "text-text-muted")}>
                          RENTER
                        </span>
                      </div>
                      <span className="text-xs font-black text-midnight">Home Seeker</span>
                      <span className="text-[11px] text-text-muted">Search & apply for homes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegUserType('owner')}
                      className={"p-3 rounded-[2px] border text-left flex flex-col justify-between transition-all " + (
                        regUserType === 'owner' 
                          ? "border-cobalt bg-cobalt/5 ring-1 ring-cobalt/30" 
                          : "border-border bg-white hover:border-midnight"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Building2 className={"h-4 w-4 " + (regUserType === 'owner' ? "text-cobalt" : "text-text-muted")} />
                        <span className={"text-[9px] font-mono font-bold uppercase " + (regUserType === 'owner' ? "text-cobalt" : "text-text-muted")}>
                          OWNER
                        </span>
                      </div>
                      <span className="text-xs font-black text-midnight">Property Owner</span>
                      <span className="text-[11px] text-text-muted">List property & review tenants</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-midnight mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Reddy"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      className="w-full rounded-[2px] border border-border bg-white px-3 py-2 text-xs font-medium text-midnight focus:border-midnight focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-midnight mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="w-full rounded-[2px] border border-border bg-white px-3 py-2 text-xs font-medium text-midnight focus:border-midnight focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-midnight mb-1">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98490 12345"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      className="w-full rounded-[2px] border border-border bg-white px-3 py-2 text-xs font-mono font-medium text-midnight focus:border-midnight focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !regName.trim() || !regEmail.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-[2px] bg-cobalt py-3 px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-cobalt-hover active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" /> Create Account & Continue <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Platform Standards & Transparency (5 cols) */}
          <div className="lg:col-span-5 bg-surface-subtle p-8 sm:p-10 border-t lg:border-t-0 lg:border-l border-border flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                <ShieldCheck className="h-4 w-4 text-cobalt" /> Verification Architecture
              </div>
              <h3 className="text-xl font-bold text-midnight tracking-tight">
                Role-Gated Security
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed font-normal">
                The Rental Circle enforces strict role separation so owners, renters, and moderators interact transparently without broker solicitation.
              </p>

              <div className="space-y-3 pt-2">
                <div className="rounded-[2px] border border-border bg-white p-3.5 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-cobalt block">For Renters</span>
                  <p className="text-xs text-text-secondary">Browse human-reviewed listings, send structured move-in requests, and unlock direct owner WhatsApp contact upon mutual acceptance.</p>
                </div>

                <div className="rounded-[2px] border border-border bg-white p-3.5 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-midnight block">For Owners</span>
                  <p className="text-xs text-text-secondary">Publish verified residential homes with utility records and review tenant profiles in a dedicated inbox with zero broker spam.</p>
                </div>

                <div className="rounded-[2px] border border-border bg-white p-3.5 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">For Moderators</span>
                  <p className="text-xs text-text-secondary">Dedicated Trust Desk queue to verify TSSPDCL electricity bills, telephone verification logs, and room photographs.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 text-[11px] text-text-muted">
              By accessing the platform, you agree to The Rental Circle Terms and Zero-Spam Direct Communication Policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center">
          <div className="h-6 w-6 border-2 border-cobalt border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
