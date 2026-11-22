'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, AlertCircle, Sparkles, ArrowLeft, Globe } from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/cms/cmsService';
import { AtlasLogo, SwooshArcBackdrop } from '@/components/AtlasLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, isSupabaseMode, adminUser } = useCms();
  const { t, uiLang, setUiLang } = useAdminT();

  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEMO_ADMIN_PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (adminUser) {
    return (
      <div className="min-h-screen bg-atlas-black text-white flex items-center justify-center p-4">
        <div className="bg-white text-atlas-black rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
          <div className="flex justify-center">
            <AtlasLogo variant="dark-on-light" />
          </div>
          <h1 className="text-2xl font-extrabold">{t.login.alreadyLoggedIn}</h1>
          <p className="text-sm text-neutral-600">
            {t.login.loggedInAs} <strong>{adminUser.email}</strong>
          </p>
          <Link
            href="/admin"
            className="w-full inline-flex items-center justify-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-colors"
          >
            <span>{t.login.openDashboard}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await loginAdmin(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || t.login.loginFailed);
      return;
    }
    router.push('/admin');
  };

  const handleOneClickDemo = async () => {
    setError(null);
    setLoading(true);
    const res = await loginAdmin(DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD);
    setLoading(false);
    if (res.ok) {
      router.push('/admin');
    } else {
      setError(res.error || t.login.loginFailed);
    }
  };

  return (
    <div className="min-h-screen bg-atlas-black text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <SwooshArcBackdrop className="absolute -right-28 -bottom-28 w-[520px] h-[520px] opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href={uiLang === 'en' ? '/en' : '/'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-atlas-orange transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.login.backToPublic}</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-xl px-2.5 py-1">
            <Globe className="w-3.5 h-3.5 text-atlas-orange" />
            <div className="inline-flex text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setUiLang('nl')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  uiLang === 'nl'
                    ? 'bg-atlas-orange text-white'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                NL
              </button>
              <button
                type="button"
                onClick={() => setUiLang('en')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  uiLang === 'en'
                    ? 'bg-atlas-orange text-white'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white text-atlas-black rounded-[24px] p-8 sm:p-10 shadow-2xl border border-neutral-200 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <AtlasLogo variant="dark-on-light" />
            <span className="inline-flex items-center gap-1.5 bg-atlas-orange-soft text-atlas-orange text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-md">
              <Lock className="w-3.5 h-3.5" />
              <span>{t.login.badge}</span>
            </span>
            <h1 className="text-2xl font-extrabold text-atlas-black">
              {t.login.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600">
              {t.login.subtitle}
            </p>
          </div>

          <div className="bg-atlas-orange-soft/80 border border-atlas-orange/30 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-atlas-black">
              <Sparkles className="w-4 h-4 text-atlas-orange shrink-0" />
              <span>
                {isSupabaseMode ? t.login.supabaseQuick : t.login.previewQuick}
              </span>
            </div>
            <p className="text-xs text-atlas-ink leading-relaxed">
              {t.login.adminAccountLabel}{' '}
              <code className="font-mono font-bold">{DEMO_ADMIN_EMAIL}</code> /{' '}
              {t.login.passwordInlineLabel}{' '}
              <code className="font-mono font-bold">{DEMO_ADMIN_PASSWORD}</code>
            </p>
            <button
              type="button"
              onClick={handleOneClickDemo}
              className="w-full inline-flex items-center justify-center gap-2 bg-atlas-black hover:bg-neutral-800 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
            >
              <span>
                {t.login.oneClickLogin} ({DEMO_ADMIN_EMAIL})
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-atlas-orange" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-atlas-black mb-1.5"
              >
                {t.login.emailLabel}
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@atlasholland.nl"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-atlas-black mb-1.5"
              >
                {t.login.passwordLabel}
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-colors shadow-md cursor-pointer"
            >
              <span>{loading ? t.login.loggingIn : t.login.submitBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
