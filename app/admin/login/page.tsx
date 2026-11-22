'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Globe,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { requestAdminPasswordReset } from '@/cms/cmsService';
import { AtlasLogo } from '@/components/AtlasLogo';
import { SeoHead } from '@/components/SeoHead';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, adminUser, isLoaded, isSupabaseMode } = useCms();
  const { t, uiLang, setUiLang } = useAdminT();
  const l = t.login;

  // Empty by default — never prefilled
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const isVerifiedAdmin = Boolean(adminUser && adminUser.isVerifiedAdmin);

  if (isLoaded && isVerifiedAdmin) {
    return (
      <div className="min-h-screen bg-atlas-grey flex items-center justify-center p-6">
        <SeoHead noIndex title="Atlas Holland CMS" />
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8 max-w-md w-full text-center space-y-5">
          <div className="flex justify-center">
            <AtlasLogo variant="light" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-atlas-black">
              {l.alreadyLoggedIn}
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {l.loggedInAs} <strong>{adminUser?.email}</strong>
            </p>
          </div>
          <Link
            href="/admin"
            className="w-full inline-flex items-center justify-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-colors"
          >
            <span>{l.openDashboard}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseMode) {
      setError(l.notConfiguredError);
      return;
    }

    setLoading(true);
    const res = await loginAdmin(email, password);
    setLoading(false);

    if (!res.ok) {
      setError(res.error || l.invalidCredentials);
      return;
    }
    router.replace('/admin');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (!isSupabaseMode) {
      setResetError(l.notConfiguredError);
      return;
    }

    setResetLoading(true);
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/admin/reset-password`
        : '/admin/reset-password';

    const res = await requestAdminPasswordReset(resetEmail, redirectTo);
    setResetLoading(false);

    if (!res.ok) {
      setResetError(res.error || l.invalidCredentials);
      return;
    }
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-atlas-grey flex flex-col justify-center items-center p-6">
      <SeoHead noIndex title={`CMS Login | Atlas Holland B.V.`} />

      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-atlas-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{l.backToPublic}</span>
          </Link>

          {/* CMS UI Language Switcher on Login Screen */}
          <div className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg px-2 py-1 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <div className="inline-flex rounded-md bg-neutral-100 p-0.5">
              <button
                type="button"
                onClick={() => setUiLang('nl')}
                className={`px-2 py-0.5 rounded text-[11px] font-extrabold transition-colors cursor-pointer ${
                  uiLang === 'nl'
                    ? 'bg-atlas-black text-white'
                    : 'text-neutral-600 hover:text-atlas-black'
                }`}
              >
                NL
              </button>
              <button
                type="button"
                onClick={() => setUiLang('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-extrabold transition-colors cursor-pointer ${
                  uiLang === 'en'
                    ? 'bg-atlas-black text-white'
                    : 'text-neutral-600 hover:text-atlas-black'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl p-8 sm:p-10">
          <div className="flex flex-col items-center text-center mb-7">
            <AtlasLogo variant="light" />
            <span className="mt-4 inline-block bg-atlas-orange-soft text-atlas-orange text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-md">
              {l.badge}
            </span>
            <h1 className="text-2xl font-extrabold text-atlas-black mt-3">
              {forgotMode ? l.forgotPasswordTitle : l.title}
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {forgotMode ? l.forgotPasswordSub : l.subtitle}
            </p>
          </div>

          {/* Fail closed if Supabase environment variables are missing */}
          {isLoaded && !isSupabaseMode && (
            <div
              role="alert"
              className="mb-6 bg-red-50 border border-red-200 text-red-900 rounded-2xl p-4 flex items-start gap-3"
            >
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-extrabold text-red-950 mb-0.5">
                  {l.notConfiguredTitle}
                </p>
                <p className="font-medium text-red-800">{l.notConfiguredError}</p>
              </div>
            </div>
          )}

          {forgotMode ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              {resetError && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-medium"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 flex items-start gap-2.5 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{l.resetEmailSent}</span>
                </div>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-xs font-bold text-atlas-black mb-1.5"
                    >
                      {l.emailLabel}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="reset-email"
                        type="email"
                        required
                        disabled={!isSupabaseMode || resetLoading}
                        autoComplete="email"
                        placeholder={l.emailPlaceholder}
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-atlas-orange disabled:bg-neutral-100 disabled:text-neutral-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!isSupabaseMode || resetLoading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-atlas-black hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-colors cursor-pointer"
                  >
                    {resetLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{resetLoading ? l.sendingReset : l.sendResetBtn}</span>
                  </button>
                </>
              )}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setForgotMode(false);
                    setResetSent(false);
                    setResetError(null);
                  }}
                  className="text-xs font-bold text-neutral-600 hover:text-atlas-black transition-colors cursor-pointer"
                >
                  ← {l.backToLogin}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-medium"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-bold text-atlas-black mb-1.5"
                >
                  {l.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    disabled={!isSupabaseMode || loading}
                    autoComplete="username"
                    placeholder={l.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-atlas-orange disabled:bg-neutral-100 disabled:text-neutral-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-bold text-atlas-black"
                  >
                    {l.passwordLabel}
                  </label>
                  <button
                    type="button"
                    disabled={!isSupabaseMode}
                    onClick={() => {
                      setForgotMode(true);
                      setResetEmail(email);
                      setError(null);
                    }}
                    className="text-xs font-semibold text-atlas-orange hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    {l.forgotPasswordLink}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={!isSupabaseMode || loading}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-atlas-orange disabled:bg-neutral-100 disabled:text-neutral-400"
                  />
                  <button
                    type="button"
                    disabled={!isSupabaseMode || loading}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? l.hidePassword : l.showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-atlas-black p-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isSupabaseMode || loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-atlas-black hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-colors cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{l.loggingIn}</span>
                  </>
                ) : (
                  <>
                    <span>{l.submitBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
