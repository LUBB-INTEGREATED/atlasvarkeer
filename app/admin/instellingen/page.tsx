'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Save,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  Database,
  CheckCircle2,
  RefreshCw,
  Copy,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import {
  testSupabaseConnection,
  SupabaseDiagnosticResult,
} from '@/cms/cmsService';
import { SiteSettings } from '@/cms/types';
import { AdminShell } from '@/components/admin/AdminShell';
import { ImageField } from '@/components/admin/ImageField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

const GRANT_FIX_SQL = `grant usage on schema public to anon, authenticated, service_role;
grant select on public.site_content, public.projects, public.services, public.vacancies, public.media_assets to anon, authenticated, service_role;
grant insert on public.form_submissions to anon, authenticated, service_role;
grant select on public.admin_users to authenticated, service_role;
grant all on public.site_content, public.projects, public.services, public.vacancies, public.media_assets, public.form_submissions to authenticated, service_role;`;

export default function AdminInstellingenPage() {
  const {
    settings,
    snapshot,
    updateSettings,
    syncToSupabase,
    importSnapshotJson,
    resetAllToDefaults,
    showToast,
    editLocale,
    bilingualProjects,
    bilingualServices,
    bilingualVacancies,
  } = useCms();
  const { t, tx } = useAdminT();
  const s = t.settings;

  const [form, setForm] = useState<SiteSettings>(() =>
    JSON.parse(JSON.stringify(settings))
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [diag, setDiag] = useState<SupabaseDiagnosticResult | null>(null);
  const [diagLoading, setDiagLoading] = useState(false);
  const [syncingSupabase, setSyncingSupabase] = useState(false);

  const [lastEditLocale, setLastEditLocale] = useState(editLocale);
  if (lastEditLocale !== editLocale) {
    setLastEditLocale(editLocale);
    setForm(JSON.parse(JSON.stringify(settings)));
    setIsDirty(false);
  }

  const runDiagnostics = useCallback(async () => {
    setDiagLoading(true);
    const res = await testSupabaseConnection();
    setDiag(res);
    setDiagLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    testSupabaseConnection().then((res) => {
      if (active) {
        setDiag(res);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSyncToSupabase = async () => {
    setSyncingSupabase(true);
    await syncToSupabase();
    await runDiagnostics();
    setSyncingSupabase(false);
  };

  const updateField = <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(form);
    setIsDirty(false);
    setIsSaving(false);
  };

  const handleExportJson = () => {
    const jsonString = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-holland-cms-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(
      tx(
        'Volledige CMS back-up gedownload als JSON ✓',
        'Complete CMS backup downloaded as JSON ✓'
      )
    );
  };

  const handleDownloadSitemapXml = () => {
    const base = 'https://www.atlasholland.nl';
    const staticPairs = [
      { nl: '/', en: '/en', prio: '1.0' },
      { nl: '/diensten', en: '/en/services', prio: '0.9' },
      { nl: '/projecten', en: '/en/projects', prio: '0.9' },
      { nl: '/opleidingen', en: '/en/training', prio: '0.8' },
      { nl: '/over-ons', en: '/en/about', prio: '0.8' },
      { nl: '/werken-bij', en: '/en/careers', prio: '0.8' },
      { nl: '/offerte-aanvragen', en: '/en/request-quote', prio: '0.9' },
      { nl: '/contact', en: '/en/contact', prio: '0.8' },
      { nl: '/privacy', en: '/en/privacy', prio: '0.4' },
      { nl: '/algemene-voorwaarden', en: '/en/terms', prio: '0.4' },
    ];

    const servicePairs = bilingualServices
      .filter((srv) => !srv.status || srv.status === 'published')
      .map((srv) => ({
        nl: `/diensten/${srv.slug}`,
        en: `/en/services/${srv.slugEn || srv.slug}`,
        prio: '0.8',
      }));

    const projectPairs = bilingualProjects
      .filter((p) => !p.status || p.status === 'published')
      .map((p) => ({
        nl: `/projecten/${p.slug}`,
        en: `/en/projects/${p.slugEn || p.slug}`,
        prio: '0.8',
      }));

    const vacancyPairs = bilingualVacancies
      .filter((v) => !v.status || v.status === 'published')
      .map((v) => ({
        nl: `/werken-bij/${v.slug}`,
        en: `/en/careers/${v.slugEn || v.slug}`,
        prio: '0.7',
      }));

    const allPairs = [
      ...staticPairs,
      ...servicePairs,
      ...projectPairs,
      ...vacancyPairs,
    ];

    const entries = allPairs
      .map(
        (pair) => `  <url>
    <loc>${base}${pair.nl}</loc>
    <xhtml:link rel="alternate" hreflang="nl" href="${base}${pair.nl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${base}${pair.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${pair.nl}"/>
    <changefreq>weekly</changefreq>
    <priority>${pair.prio}</priority>
  </url>
  <url>
    <loc>${base}${pair.en}</loc>
    <xhtml:link rel="alternate" hreflang="nl" href="${base}${pair.nl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${base}${pair.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${pair.nl}"/>
    <changefreq>weekly</changefreq>
    <priority>${pair.prio}</priority>
  </url>`
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(
      tx(
        'Tweetalige sitemap.xml (NL + EN hreflang) gedownload ✓',
        'Bilingual sitemap.xml (NL + EN hreflang) downloaded ✓'
      )
    );
  };

  const handleImportJsonFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const res = await importSnapshotJson(text);
    if (!res.ok) {
      showToast(
        res.error || tx('Import mislukt', 'Import failed'),
        'error'
      );
    } else {
      setForm(JSON.parse(text).settings);
    }
  };

  return (
    <AdminShell>
      <form onSubmit={handleSave} className="space-y-6 pb-20">
        {/* STICKY TOP BAR */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200 px-5 py-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
              {s.eyebrow}
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-atlas-black">
              {s.title}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {isDirty && (
              <button
                type="button"
                onClick={() => {
                  setForm(JSON.parse(JSON.stringify(settings)));
                  setIsDirty(false);
                }}
                className="inline-flex items-center gap-1.5 bg-white border border-neutral-300 text-neutral-700 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.common.cancel}</span>
              </button>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 bg-atlas-orange hover:bg-atlas-orange-dark text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? t.common.saving : s.saveSettings}</span>
            </button>
          </div>
        </div>

        {/* 1. Brand Identity & Logos */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
          <h2 className="text-lg font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
            {s.sec1Title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.companyName}
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.shortName}
              </label>
              <input
                type="text"
                value={form.shortName}
                onChange={(e) => updateField('shortName', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.foundingYear}
              </label>
              <input
                type="text"
                value={form.foundingYear}
                onChange={(e) => updateField('foundingYear', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageField
              label={s.logoLight}
              value={{ url: form.logoLightUrl, alt: form.companyName }}
              onChange={(img) => updateField('logoLightUrl', img.url)}
              aspectHint={s.logoLightHint}
            />
            <ImageField
              label={s.logoDark}
              value={{ url: form.logoDarkUrl, alt: form.companyName }}
              onChange={(img) => updateField('logoDarkUrl', img.url)}
              aspectHint={s.optionalHint}
            />
          </div>
        </div>

        {/* 2. Contact Details, Address & Registration */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
          <div>
            <h2 className="text-lg font-extrabold text-atlas-black">
              {s.sec2Title}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {s.sec2Helper}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.phoneDisplay}
              </label>
              <input
                type="text"
                value={form.phoneDisplay}
                onChange={(e) => updateField('phoneDisplay', e.target.value)}
                placeholder="085 - 060 44 80"
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-bold text-atlas-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.emailGeneral}
              </label>
              <input
                type="email"
                value={form.emailGeneral}
                onChange={(e) => updateField('emailGeneral', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.emailCareers}
              </label>
              <input
                type="email"
                value={form.emailCareers}
                onChange={(e) => updateField('emailCareers', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.addressStreet}
              </label>
              <input
                type="text"
                value={form.addressStreet}
                onChange={(e) => updateField('addressStreet', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.addressPostalCity}
              </label>
              <input
                type="text"
                value={form.addressPostalCity}
                onChange={(e) =>
                  updateField('addressPostalCity', e.target.value)
                }
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.kvk}
              </label>
              <input
                type="text"
                value={form.kvk}
                onChange={(e) => updateField('kvk', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.btw}
              </label>
              <input
                type="text"
                value={form.btw}
                onChange={(e) => updateField('btw', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.googleMapsUrl}
              </label>
              <input
                type="url"
                value={form.googleMapsUrl}
                onChange={(e) => updateField('googleMapsUrl', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.googleMapsEmbedUrl}
              </label>
              <input
                type="url"
                value={form.googleMapsEmbedUrl}
                onChange={(e) =>
                  updateField('googleMapsEmbedUrl', e.target.value)
                }
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Social Media Channels */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
            {s.sec3Title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              ['instagram', 'linkedin', 'tiktok', 'facebook'] as const
            ).map((key) => {
              const item = form.socials[key];
              return (
                <div
                  key={key}
                  className="bg-atlas-grey/50 rounded-xl p-4 border border-neutral-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-atlas-black capitalize">
                      {item.label}
                    </span>
                    <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(e) =>
                          updateField('socials', {
                            ...form.socials,
                            [key]: { ...item, enabled: e.target.checked },
                          })
                        }
                        className="rounded text-atlas-orange"
                      />
                      <span>{t.common.active}</span>
                    </label>
                  </div>
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) =>
                      updateField('socials', {
                        ...form.socials,
                        [key]: { ...item, url: e.target.value },
                      })
                    }
                    placeholder={`https://${key}.com/...`}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Header, Utility Bar & Footer Copy */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
            {s.sec4Title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.utilityUrgent}
              </label>
              <input
                type="text"
                value={form.utilityBarUrgentLabel}
                onChange={(e) =>
                  updateField('utilityBarUrgentLabel', e.target.value)
                }
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.headerCta}
              </label>
              <input
                type="text"
                value={form.headerCtaLabel}
                onChange={(e) => updateField('headerCtaLabel', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {s.mobileCall}
              </label>
              <input
                type="text"
                value={form.mobileCallLabel}
                onChange={(e) => updateField('mobileCallLabel', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-atlas-black mb-1">
              {s.footerTagline}
            </label>
            <textarea
              rows={2}
              value={form.footerTagline}
              onChange={(e) => updateField('footerTagline', e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-atlas-black mb-1">
              {s.footerCopyright}
            </label>
            <input
              type="text"
              value={form.footerCopyright}
              onChange={(e) => updateField('footerCopyright', e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* 5. Supabase Database Connection & Sync */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-atlas-orange" />
              <h2 className="text-lg font-extrabold text-atlas-black">
                {s.sec5Title}
              </h2>
            </div>
            <button
              type="button"
              onClick={runDiagnostics}
              disabled={diagLoading}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-atlas-black hover:text-atlas-orange border border-neutral-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${diagLoading ? 'animate-spin' : ''}`}
              />
              <span>{s.testConnectionAgain}</span>
            </button>
          </div>

          {diag && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-neutral-200 p-3.5 bg-neutral-50">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    {s.supabaseUrlLabel}
                  </p>
                  <p className="text-xs font-extrabold text-atlas-black truncate mt-1">
                    {diag.url || s.notSet}
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-200 p-3.5 bg-neutral-50">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    {s.supabaseAuthLabel}
                  </p>
                  <p className="text-xs font-extrabold mt-1 flex items-center gap-1.5">
                    {diag.authReachable ? (
                      <span className="text-emerald-700 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> {s.connected}
                      </span>
                    ) : (
                      <span className="text-amber-700">{s.notReachable}</span>
                    )}
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-200 p-3.5 bg-neutral-50">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    {s.postgresTablesLabel}
                  </p>
                  <p className="text-xs font-extrabold mt-1">
                    {diag.tablesAccessible ? (
                      <span className="text-emerald-700 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> {s.activeCountPrefix} (
                        {diag.counts.projects} {s.projectsUnit},{' '}
                        {diag.counts.services} {s.servicesUnit})
                      </span>
                    ) : diag.permissionDenied ? (
                      <span className="text-amber-700">{s.grantRequired}</span>
                    ) : (
                      <span className="text-red-700">
                        {diag.errorMessage || s.notReachable}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {diag.permissionDenied && (
                <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-extrabold text-amber-950">
                        {tx(
                          'Actie vereist in Supabase SQL Editor: Tabelrechten (GRANT) toekennen',
                          'Action required in Supabase SQL Editor: Grant table permissions (GRANT)'
                        )}
                      </p>
                      <p className="text-xs text-amber-900">
                        {tx(
                          'Uw Supabase tabellen bestaan al, maar de rollen anon en authenticated hebben nog geen GRANT-rechten. Voer onderstaande 4 regels uit in uw Supabase SQL Editor:',
                          'Your Supabase tables already exist, but the anon and authenticated roles do not have GRANT permissions yet. Run the 4 lines below in your Supabase SQL Editor:'
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(GRANT_FIX_SQL);
                        showToast(
                          tx(
                            'SQL GRANT-script gekopieerd naar klembord ✓',
                            'SQL GRANT script copied to clipboard ✓'
                          )
                        );
                      }}
                      className="shrink-0 inline-flex items-center gap-1.5 bg-amber-900 hover:bg-black text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{s.copySqlFix}</span>
                    </button>
                  </div>
                  <pre className="bg-amber-950/90 text-amber-100 text-[11px] p-3 rounded-lg overflow-x-auto font-mono">
                    {GRANT_FIX_SQL}
                  </pre>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSyncToSupabase}
                  disabled={!diag.configured || syncingSupabase}
                  className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark disabled:opacity-50 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  <span>
                    {syncingSupabase
                      ? s.syncingToSupabase
                      : s.syncToSupabaseBtn}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 6. Backup, JSON Export & Restore */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
            {s.sec6Title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">{s.sec6Helper}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-2 bg-atlas-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-atlas-orange" />
              <span>{s.exportJsonBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSitemapXml}
              className="inline-flex items-center gap-2 bg-atlas-orange-soft hover:bg-atlas-orange hover:text-white text-atlas-orange border border-atlas-orange/30 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{s.exportSitemapBtn}</span>
            </button>

            <label className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-atlas-black border border-neutral-300 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-atlas-orange" />
              <span>{s.importJsonBtn}</span>
              <input
                type="file"
                accept="application/json,.json"
                onChange={handleImportJsonFile}
                className="sr-only"
              />
            </label>

            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer ml-auto"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{s.resetDefaultsBtn}</span>
            </button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmResetOpen}
        title={s.resetConfirmTitle}
        description={s.resetConfirmDesc}
        confirmLabel={s.resetConfirmBtn}
        onCancel={() => setConfirmResetOpen(false)}
        onConfirm={async () => {
          await resetAllToDefaults();
          setConfirmResetOpen(false);
          window.location.reload();
        }}
      />
    </AdminShell>
  );
}
