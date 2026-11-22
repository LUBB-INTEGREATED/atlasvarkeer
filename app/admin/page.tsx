'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  FileEdit,
  Briefcase,
  Users,
  Images,
  Inbox,
  Plus,
  ExternalLink,
  ArrowRight,
  Star,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { AdminShell } from '@/components/admin/AdminShell';

export default function AdminDashboardPage() {
  const { projects, services, vacancies, submissions, media } = useCms();
  const { t, editLocale } = useAdminT();

  const publishedProjects = projects.filter((p) => p.status === 'published');
  const draftProjects = projects.filter((p) => p.status === 'draft');
  const publishedServices = services.filter((s) => s.status === 'published');
  const publishedVacancies = vacancies.filter((v) => v.status === 'published');
  const newSubmissions = submissions.filter((s) => s.status === 'new');

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const recentSubmissions = [...submissions].slice(0, 4);

  return (
    <AdminShell>
      <div className="space-y-8">
        {/* Header & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
              {t.dashboard.eyebrow}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-atlas-black tracking-tight mt-0.5">
              {t.dashboard.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/projecten/nieuw"
              className="inline-flex items-center gap-1.5 bg-atlas-orange hover:bg-atlas-orange-dark text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t.dashboard.newProject}</span>
            </Link>
            <Link
              href="/admin/paginas?page=home"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-atlas-black border border-neutral-300 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <FileEdit className="w-4 h-4 text-atlas-orange" />
              <span>{t.dashboard.editHome}</span>
            </Link>
            <Link
              href="/admin/media"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-atlas-black border border-neutral-300 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Images className="w-4 h-4 text-atlas-orange" />
              <span>
                {t.dashboard.mediaLibrary} ({media.length})
              </span>
            </Link>
            <Link
              href={editLocale === 'en' ? '/en' : '/'}
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-atlas-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <span>{t.dashboard.viewLiveSite}</span>
              <ExternalLink className="w-3.5 h-3.5 text-atlas-orange" />
            </Link>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            href="/admin/projecten"
            className="bg-white rounded-2xl p-5 border border-neutral-200 hover:border-atlas-orange transition-colors"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {t.dashboard.statLiveProjects}
              </span>
              <FolderKanban className="w-4 h-4 text-atlas-orange" />
            </div>
            <p className="text-3xl font-black text-atlas-black tabular-nums">
              {publishedProjects.length}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {t.dashboard.statLiveProjectsSub}
            </p>
          </Link>

          <Link
            href="/admin/projecten"
            className="bg-white rounded-2xl p-5 border border-neutral-200 hover:border-atlas-orange transition-colors"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {t.dashboard.statDrafts}
              </span>
              <FolderKanban className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-atlas-black tabular-nums">
              {draftProjects.length}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {t.dashboard.statDraftsSub}
            </p>
          </Link>

          <Link
            href="/admin/diensten"
            className="bg-white rounded-2xl p-5 border border-neutral-200 hover:border-atlas-orange transition-colors"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {t.dashboard.statServices}
              </span>
              <Briefcase className="w-4 h-4 text-atlas-orange" />
            </div>
            <p className="text-3xl font-black text-atlas-black tabular-nums">
              {publishedServices.length}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {t.dashboard.statServicesSub}
            </p>
          </Link>

          <Link
            href="/admin/vacatures"
            className="bg-white rounded-2xl p-5 border border-neutral-200 hover:border-atlas-orange transition-colors"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {t.dashboard.statVacancies}
              </span>
              <Users className="w-4 h-4 text-atlas-orange" />
            </div>
            <p className="text-3xl font-black text-atlas-black tabular-nums">
              {publishedVacancies.length}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {t.dashboard.statVacanciesSub}
            </p>
          </Link>

          <Link
            href="/admin/inzendingen"
            className="bg-white rounded-2xl p-5 border border-neutral-200 hover:border-atlas-orange transition-colors col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {t.dashboard.statSubmissions}
              </span>
              <Inbox className="w-4 h-4 text-atlas-orange" />
            </div>
            <p className="text-3xl font-black text-atlas-orange tabular-nums">
              {newSubmissions.length}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {t.dashboard.statSubmissionsSubPrefix} {submissions.length}{' '}
              {t.dashboard.statSubmissionsSubSuffix}
            </p>
          </Link>
        </div>

        {/* Two-Column Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Projects (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-base font-extrabold text-atlas-black">
                {t.dashboard.recentProjectsTitle}
              </h2>
              <Link
                href="/admin/projecten"
                className="inline-flex items-center gap-1 text-xs font-bold text-atlas-orange hover:underline"
              >
                <span>{t.dashboard.allProjectsLink}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-neutral-100">
              {recentProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proj.coverImage.url}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/projecten/${proj.id}`}
                          className="text-sm font-bold text-atlas-black hover:text-atlas-orange truncate"
                        >
                          {proj.title}
                        </Link>
                        {proj.featured && (
                          <Star className="w-3.5 h-3.5 text-atlas-orange fill-atlas-orange shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 truncate">
                        {proj.category} · {proj.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                        proj.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {proj.status === 'published'
                        ? t.common.statusPublished
                        : t.common.statusDraft}
                    </span>
                    <Link
                      href={`/admin/projecten/${proj.id}`}
                      className="text-xs font-bold text-atlas-orange hover:underline px-2 py-1"
                    >
                      {t.common.edit}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Form Submissions (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-base font-extrabold text-atlas-black">
                {t.dashboard.recentSubmissionsTitle}
              </h2>
              <Link
                href="/admin/inzendingen"
                className="inline-flex items-center gap-1 text-xs font-bold text-atlas-orange hover:underline"
              >
                <span>{t.dashboard.openInboxLink}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-neutral-100">
              {recentSubmissions.map((sub) => (
                <Link
                  key={sub.id}
                  href="/admin/inzendingen"
                  className="py-3 flex items-center justify-between gap-3 hover:bg-atlas-grey/40 rounded-lg px-2 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-atlas-black truncate">
                      {sub.name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {sub.email} · {sub.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold uppercase bg-atlas-orange-soft text-atlas-orange px-2 py-0.5 rounded">
                      {sub.type === 'quote'
                        ? t.dashboard.typeQuote
                        : sub.type === 'application'
                        ? t.dashboard.typeApplication
                        : sub.type === 'course'
                        ? t.dashboard.typeCourse
                        : t.dashboard.typeContact}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
