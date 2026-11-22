'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Globe,
} from 'lucide-react';
import { useAdminT } from '@/cms/adminTranslations';
import { updateAdminPassword } from '@/cms/cmsService';
import { AtlasLogo } from '@/components/AtlasLogo';
import { SeoHead } from '@/components/SeoHead';

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const { t, uiLang, setUiLang } = useAdminT();
  const l = t.login;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError(l.passwordTooShort);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(l.passwordMismatch);
      return;
    }

    setLoading(true);
    const res = await updateAdminPassword(newPassword);
    setLoading(false);

    if (!res.ok) {
      setError(res.error || l.loginFailed);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.replace('/admin/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-atlas-grey flex flex-col justify-center items-center p-6">
      <SeoHead noIndex title={`${l.resetPageTitle} | Atlas Holland B.V.`} />

      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-atlas-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{l.backToLogin}</span>
          </Link>

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
              {l.resetPageTitle}
            </h1>
            <p className="text-sm text-neutral-600 mt-1">{l.resetPageSub}</p>
          </div>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 flex items-start gap-2.5 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{l.passwordUpdatedSuccess}</span>
            </div>
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
                  htmlFor="new-password"
                  className="block text-xs font-bold text-atlas-black mb-1.5"
                >
                  {l.newPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-atlas-orange"
                  />
                  <button
                    type="button"
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

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-bold text-atlas-black mb-1.5"
                >
                  {l.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-atlas-orange"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-atlas-black hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-colors cursor-pointer"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? l.updatingPassword : l.updatePasswordBtn}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
