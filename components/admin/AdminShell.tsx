'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  FileEdit,
  Briefcase,
  Users,
  Images,
  Inbox,
  Settings,
  ExternalLink,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Menu,
  Database,
  Globe,
  Languages,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { AtlasLogo } from '@/components/AtlasLogo';
import { SeoHead } from '@/components/SeoHead';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    adminUser,
    isLoaded,
    isSupabaseMode,
    submissions,
    logoutAdmin,
    toasts,
    dismissToast,
  } = useCms();
  const { t, uiLang, setUiLang, editLocale, setEditLocale } = useAdminT();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isVerifiedAdmin = Boolean(adminUser && adminUser.isVerifiedAdmin);

  useEffect(() => {
    if (isLoaded && !isVerifiedAdmin) {
      router.replace('/admin/login');
    }
  }, [isLoaded, isVerifiedAdmin, router]);

  const navItems = [
    { label: t.nav.dashboard, href: '/admin', icon: LayoutDashboard, exact: true },
    { label: t.nav.projects, href: '/admin/projecten', icon: FolderKanban },
    { label: t.nav.pages, href: '/admin/paginas', icon: FileEdit },
    { label: t.nav.services, href: '/admin/diensten', icon: Briefcase },
    { label: t.nav.vacancies, href: '/admin/vacatures', icon: Users },
    { label: t.nav.media, href: '/admin/media', icon: Images },
    { label: t.nav.submissions, href: '/admin/inzendingen', icon: Inbox, showBadge: true },
    {
      label: t.nav.settings,
      href: '/admin/instellingen',
      icon: Settings,
    },
  ];

  // Show the top Editing Content Language bar ONLY on content-editing pages
  const showContentLangBar =
    pathname.startsWith('/admin/paginas') ||
    pathname.startsWith('/admin/projecten') ||
    pathname.startsWith('/admin/diensten') ||
    pathname.startsWith('/admin/vacatures') ||
    pathname.startsWith('/admin/instellingen');

  const unreadSubmissionsCount = submissions.filter((s) => s.status === 'new').length;

  // Never render any admin UI before Supabase session & admin_users verification succeeds
  if (!isLoaded || !adminUser || !adminUser.isVerifiedAdmin) {
    return (
      <div className="min-h-screen bg-atlas-grey flex items-center justify-center p-6">
        <SeoHead noIndex title="Atlas Holland CMS" />
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-3 border-atlas-orange border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            {t.shell.loading}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-atlas-grey text-atlas-ink flex flex-col lg:flex-row">
      <SeoHead noIndex title="Atlas Holland CMS" />

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden bg-atlas-black text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <AtlasLogo variant="dark" />
          <span className="bg-atlas-orange text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded">
            CMS
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Open CMS menu"
          className="p-2 rounded-lg bg-white/10 text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* DARK LEFT SIDEBAR */}
      <aside
        className={`w-full lg:w-72 bg-atlas-black text-white shrink-0 flex flex-col justify-between lg:sticky lg:top-0 lg:h-screen z-30 ${
          mobileMenuOpen ? 'block' : 'hidden lg:flex'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-white/10 hidden lg:flex items-center justify-between">
            <AtlasLogo variant="dark" />
            <span className="bg-atlas-orange text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md">
              {t.shell.cmsBadge}
            </span>
          </div>

          {/* Navigation Links */}
          <nav aria-label="CMS Navigation" className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-atlas-orange text-white shadow-sm'
                      : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>{item.label}</span>
                  </span>
                  {item.showBadge && unreadSubmissionsCount > 0 && (
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded-full tabular-nums ${
                        isActive
                          ? 'bg-atlas-black text-white'
                          : 'bg-atlas-orange text-white'
                      }`}
                    >
                      {unreadSubmissionsCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom CMS Language Switcher, User & Live Site Links */}
        <div className="p-4 pb-6 border-t border-white/10 space-y-2.5 bg-neutral-950/50">
          {/* CMS UI Language Selector */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-neutral-300">
              <Globe className="w-3.5 h-3.5 text-atlas-orange shrink-0" />
              <span>{t.shell.cmsLanguageLabel}</span>
            </span>
            <div className="inline-flex rounded-lg bg-black/50 p-0.5 border border-white/10 text-[11px] font-extrabold">
              <button
                type="button"
                onClick={() => setUiLang('nl')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  uiLang === 'nl'
                    ? 'bg-atlas-orange text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                NL
              </button>
              <button
                type="button"
                onClick={() => setUiLang('en')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  uiLang === 'en'
                    ? 'bg-atlas-orange text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="px-3 py-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              {t.shell.loggedInAs}
            </p>
            <p className="text-xs font-bold text-white truncate mt-0.5">
              {adminUser.email}
            </p>
          </div>

          <Link
            href={editLocale === 'en' ? '/en' : '/'}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
          >
            <span>
              {t.shell.viewLiveSite} ({editLocale.toUpperCase()})
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-atlas-orange" />
          </Link>

          <button
            type="button"
            onClick={async () => {
              await logoutAdmin();
              router.push('/admin/login');
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.shell.logout}</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP EDITING CONTENT LANGUAGE BAR — Shown ONLY on content-editing pages */}
        {showContentLangBar && (
          <div className="bg-white border-b border-neutral-200 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-atlas-black">
                <Languages className="w-4 h-4 text-atlas-orange" />
                <span>{t.shell.editingContentLabel}</span>
              </span>
              <div className="inline-flex rounded-xl bg-atlas-grey p-1 border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditLocale('nl')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                    editLocale === 'nl'
                      ? 'bg-atlas-orange text-white shadow-xs'
                      : 'text-neutral-600 hover:text-atlas-black'
                  }`}
                >
                  NL — Nederlands ( / )
                </button>
                <button
                  type="button"
                  onClick={() => setEditLocale('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                    editLocale === 'en'
                      ? 'bg-atlas-orange text-white shadow-xs'
                      : 'text-neutral-600 hover:text-atlas-black'
                  }`}
                >
                  EN — English ( /en )
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Storage Mode Notice Banner */}
        {!isSupabaseMode && (
          <div className="bg-atlas-orange-soft border-b border-atlas-orange/25 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-atlas-black">
            <div className="flex items-center gap-2 font-medium">
              <Database className="w-4 h-4 text-atlas-orange shrink-0" />
              <span>
                <strong>{t.shell.localModeNotice}</strong> — {t.shell.localModeSub}
              </span>
            </div>
            <Link
              href="/admin/instellingen"
              className="font-bold text-atlas-orange hover:underline shrink-0"
            >
              {t.shell.backupExport}
            </Link>
          </div>
        )}

        <div className="p-4 sm:p-8 max-w-6xl w-full mx-auto flex-1">
          {children}
        </div>
      </div>

      {/* TOAST NOTIFICATIONS (aria-live="polite") */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toastItem) => (
          <div
            key={toastItem.id}
            className={`pointer-events-auto rounded-xl px-4 py-3 shadow-xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-bold ${
              toastItem.type === 'error'
                ? 'bg-red-600 text-white border-red-700'
                : toastItem.type === 'info'
                ? 'bg-atlas-black text-white border-white/15'
                : 'bg-atlas-black text-white border-atlas-orange'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toastItem.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-white shrink-0" />
              ) : toastItem.type === 'info' ? (
                <Info className="w-4 h-4 text-atlas-orange shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-atlas-orange shrink-0" />
              )}
              <span>{toastItem.message}</span>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toastItem.id)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
