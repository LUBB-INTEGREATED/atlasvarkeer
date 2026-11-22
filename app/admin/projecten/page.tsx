'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Star,
  Pencil,
  ExternalLink,
  Copy,
  Trash2,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { ProjectItem, ProjectStatus } from '@/cms/types';
import { AdminShell } from '@/components/admin/AdminShell';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export default function AdminProjectsListPage() {
  const router = useRouter();
  const { projects, saveProject, deleteProject, duplicateProject } = useCms();
  const { t, editLocale } = useAdminT();

  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);

  const sortedProjects = [...projects].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const filtered = sortedProjects.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const toggleFeatured = async (proj: ProjectItem) => {
    await saveProject({ ...proj, featured: !proj.featured });
  };

  const togglePublishStatus = async (proj: ProjectItem) => {
    const nextStatus: ProjectStatus =
      proj.status === 'published' ? 'draft' : 'published';
    await saveProject({
      ...proj,
      status: nextStatus,
      publishedAt:
        nextStatus === 'published' && !proj.publishedAt
          ? new Date().toISOString()
          : proj.publishedAt,
    });
  };

  const projectBasePath = editLocale === 'en' ? '/en/projects' : '/projecten';

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
              {t.projects.eyebrow}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-atlas-black tracking-tight">
              {t.projects.title} ({projects.length})
            </h1>
          </div>

          <Link
            href="/admin/projecten/nieuw"
            className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t.projects.createNew}</span>
          </Link>
        </div>

        {/* Filter Tabs & Search */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: 'all', label: `${t.projects.tabAll} (${projects.length})` },
              {
                key: 'published',
                label: `${t.projects.tabPublished} (${
                  projects.filter((p) => p.status === 'published').length
                })`,
              },
              {
                key: 'draft',
                label: `${t.projects.tabDrafts} (${
                  projects.filter((p) => p.status === 'draft').length
                })`,
              },
              {
                key: 'archived',
                label: `${t.projects.tabArchived} (${
                  projects.filter((p) => p.status === 'archived').length
                })`,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() =>
                  setStatusFilter(tab.key as 'all' | ProjectStatus)
                }
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-atlas-orange text-white'
                    : 'bg-atlas-grey text-neutral-600 hover:text-atlas-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.projects.searchPlaceholder}
              className="w-full rounded-xl border border-neutral-300 pl-9 pr-3 py-2 text-xs sm:text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
            />
          </div>
        </div>

        {/* Projects List Table / Cards */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-base font-bold text-atlas-black">
                {t.projects.emptyTitle}
              </p>
              <Link
                href="/admin/projecten/nieuw"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-atlas-orange hover:underline"
              >
                <Plus className="w-4 h-4" />
                <span>{t.projects.emptyCreateFirst}</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filtered.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-atlas-grey/30 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proj.coverImage.url}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                            proj.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : proj.status === 'archived'
                              ? 'bg-neutral-100 text-neutral-600'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {proj.status === 'published'
                            ? t.common.statusPublished
                            : proj.status === 'archived'
                            ? t.common.statusArchived
                            : t.common.statusDraft}
                        </span>
                        <span className="text-xs font-bold text-atlas-orange bg-atlas-orange-soft px-2 py-0.5 rounded">
                          {proj.category}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {proj.location} · {proj.period}
                        </span>
                      </div>

                      <Link
                        href={`/admin/projecten/${proj.id}`}
                        className="block text-base font-extrabold text-atlas-black hover:text-atlas-orange truncate"
                      >
                        {proj.title}
                      </Link>

                      <p className="text-xs text-neutral-500 truncate">
                        {t.projects.clientPrefix} {proj.clientName} ·{' '}
                        {proj.gallery.length} {t.projects.galleryPhotosSuffix}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(proj)}
                      title={t.projects.featuredTooltip}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                        proj.featured
                          ? 'bg-atlas-orange-soft border-atlas-orange text-atlas-orange'
                          : 'bg-white border-neutral-200 text-neutral-500 hover:text-atlas-black'
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          proj.featured ? 'fill-atlas-orange text-atlas-orange' : ''
                        }`}
                      />
                      <span>Home</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => togglePublishStatus(proj)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                        proj.status === 'published'
                          ? 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                          : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {proj.status === 'published' ? (
                        <>
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t.common.unpublish}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.common.publish}</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/admin/projecten/${proj.id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-atlas-black hover:bg-neutral-800 text-white text-xs font-bold transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5 text-atlas-orange" />
                      <span>{t.common.edit}</span>
                    </Link>

                    <Link
                      href={
                        proj.status === 'published'
                          ? `${projectBasePath}/${proj.slug}`
                          : `${projectBasePath}/${proj.slug}?preview=true`
                      }
                      target="_blank"
                      className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-atlas-orange hover:border-atlas-orange transition-colors"
                      title={t.common.viewLive}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        const copy = await duplicateProject(proj.id);
                        if (copy) router.push(`/admin/projecten/${copy.id}`);
                      }}
                      className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-atlas-black transition-colors cursor-pointer"
                      title={t.common.duplicate}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setProjectToDelete(proj)}
                      className="p-2 rounded-lg border border-neutral-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(projectToDelete)}
        title={t.projects.deleteTitle}
        description={`${t.projects.deleteDescPrefix} "${projectToDelete?.title}" ${t.projects.deleteDescSuffix}`}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={async () => {
          if (projectToDelete) {
            await deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }
        }}
      />
    </AdminShell>
  );
}
