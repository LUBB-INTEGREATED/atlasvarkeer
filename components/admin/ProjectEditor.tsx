'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Eye,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  FolderOpen,
  Star,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { ProjectItem, ProjectStatus, ProjectGalleryItem } from '@/cms/types';
import { ImageField } from './ImageField';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const DEFAULT_CATEGORIES_NL = [
  'Infra & wegenbouw',
  'Bouw',
  'Evenementen',
  'Calamiteiten',
  'Verkeersplannen',
];

const DEFAULT_CATEGORIES_EN = [
  'Infrastructure & Roadworks',
  'Construction',
  'Events',
  'Emergency Response',
  'Traffic Plans',
];

export function ProjectEditor({
  initialProject,
  isNew = false,
}: {
  initialProject: ProjectItem;
  isNew?: boolean;
}) {
  const router = useRouter();
  const { services, pages, media, saveProject, uploadMedia } = useCms();
  const { t, editLocale, isEn } = useAdminT();
  const ed = t.projects.editor;

  const [form, setForm] = useState<ProjectItem>(initialProject);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!isNew);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const defaultCats =
    editLocale === 'en' ? DEFAULT_CATEGORIES_EN : DEFAULT_CATEGORIES_NL;
  const categories =
    pages.projectsOverview.categories?.filter(
      (c) => c !== 'Alle' && c !== 'All'
    ) || defaultCats;

  const projectPathPrefix = editLocale === 'en' ? '/en/projects/' : '/projecten/';

  const updateField = useCallback(
    <K extends keyof ProjectItem>(key: K, value: ProjectItem[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setIsDirty(true);
    },
    []
  );

  const handleTitleChange = (title: string) => {
    setForm((prev) => {
      const nextSlug = !slugManuallyEdited ? slugify(title) : prev.slug;
      const suffix =
        editLocale === 'en'
          ? 'Projects | Atlas Holland B.V.'
          : 'Projecten | Atlas Holland B.V.';
      const nextSeoTitle =
        !prev.seo.title || prev.seo.title.startsWith(prev.title)
          ? `${title} | ${suffix}`
          : prev.seo.title;
      return {
        ...prev,
        title,
        slug: nextSlug,
        seo: {
          ...prev.seo,
          title: nextSeoTitle,
        },
      };
    });
    setIsDirty(true);
  };

  const handleSave = useCallback(
    async (targetStatus?: ProjectStatus) => {
      if (!form.title.trim()) return;
      setIsSaving(true);
      const finalSlug =
        form.slug.trim() || slugify(form.title) || `project-${Date.now()}`;
      const nextStatus = targetStatus || form.status;
      const nowIso = new Date().toISOString();
      const finalId =
        isNew && (!form.id || form.id === 'proj-new')
          ? `proj-${Date.now()}`
          : form.id;
      const toSave: ProjectItem = {
        ...form,
        id: finalId,
        slug: finalSlug,
        status: nextStatus,
        createdAt: form.createdAt || nowIso,
        updatedAt: nowIso,
        publishedAt:
          nextStatus === 'published' && !form.publishedAt
            ? nowIso
            : form.publishedAt,
      };
      await saveProject(toSave);
      setForm(toSave);
      setIsDirty(false);
      setIsSaving(false);
      if (isNew) {
        router.push(`/admin/projecten/${toSave.id}`);
      }
    },
    [form, isNew, router, saveProject]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSave]);

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingGallery(true);
    try {
      const added: ProjectGalleryItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const asset = await uploadMedia(files[i], `${form.title} photo`, true);
        added.push({
          url: asset.url,
          alt: asset.alt || form.title,
          caption: '',
        });
      }
      updateField('gallery', [...form.gallery, ...added]);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const moveGalleryItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= form.gallery.length) return;
    const copy = [...form.gallery];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    updateField('gallery', copy);
  };

  const moveHighlight = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= form.highlights.length) return;
    const copy = [...form.highlights];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    updateField('highlights', copy);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* STICKY TOP BAR */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200 px-5 py-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projecten"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-600 hover:text-atlas-black bg-atlas-grey px-3 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{ed.allProjects}</span>
          </Link>

          <span
            className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md ${
              form.status === 'published'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : form.status === 'archived'
                ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {form.status === 'published'
              ? t.common.statusPublished
              : form.status === 'archived'
              ? t.common.statusArchived
              : t.common.statusDraft}
          </span>

          {isDirty && (
            <span className="text-xs font-semibold text-amber-600">
              ● {t.common.unsavedChanges}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {form.slug && (
            <Link
              href={`${projectPathPrefix}${form.slug}?preview=true`}
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-atlas-grey hover:bg-neutral-200 text-atlas-black text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Eye className="w-4 h-4 text-atlas-orange" />
              <span>{t.common.preview}</span>
            </Link>
          )}

          <button
            type="button"
            disabled={isSaving || !form.title.trim()}
            onClick={() => handleSave('draft')}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-atlas-black border border-neutral-300 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{t.common.saveDraft}</span>
          </button>

          <button
            type="button"
            disabled={isSaving || !form.title.trim()}
            onClick={() => handleSave('published')}
            className="inline-flex items-center gap-1.5 bg-atlas-orange hover:bg-atlas-orange-dark text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isSaving
                ? t.common.saving
                : form.status === 'published'
                ? t.common.publishChanges
                : t.common.publish}
            </span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN EDITOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (~68% / 8 cols): Writing & Media Canvas */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Basic Details */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
              {ed.sec1Title}
            </h2>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1.5">
                {ed.projectTitleLabel} <span className="text-atlas-orange">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder={ed.projectTitlePlaceholder}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base font-bold text-atlas-black focus:border-atlas-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1.5">
                {ed.slugLabel}
              </label>
              <div className="flex items-center rounded-xl border border-neutral-300 overflow-hidden bg-atlas-grey/50">
                <span className="px-3.5 py-2.5 text-xs font-mono text-neutral-500 border-r border-neutral-300 bg-neutral-100">
                  {projectPathPrefix}
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    updateField('slug', slugify(e.target.value));
                  }}
                  placeholder="project-url-slug"
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-atlas-black bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1.5">
                {ed.summaryLabel}
              </label>
              <textarea
                rows={3}
                value={form.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder={ed.summaryPlaceholder}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Client & Location */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
              {ed.sec2Title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1.5">
                  {ed.clientLabel}
                </label>
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  placeholder={ed.clientPlaceholder}
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1.5">
                  {ed.locationLabel}
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder={ed.locationPlaceholder}
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1.5">
                  {ed.periodLabel}
                </label>
                <input
                  type="text"
                  value={form.period}
                  onChange={(e) => updateField('period', e.target.value)}
                  placeholder={ed.periodPlaceholder}
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1.5">
                  {ed.deploymentLabel}
                </label>
                <input
                  type="text"
                  value={form.deploymentSummary}
                  onChange={(e) =>
                    updateField('deploymentSummary', e.target.value)
                  }
                  placeholder={ed.deploymentPlaceholder}
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Case Study Story */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
              {ed.sec3Title}
            </h2>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1.5">
                {ed.challengeLabel}
              </label>
              <textarea
                rows={4}
                value={form.challenge}
                onChange={(e) => updateField('challenge', e.target.value)}
                placeholder={ed.challengePlaceholder}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1.5">
                {ed.approachLabel}
              </label>
              <textarea
                rows={4}
                value={form.approach}
                onChange={(e) => updateField('approach', e.target.value)}
                placeholder={ed.approachPlaceholder}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1.5">
                {ed.resultLabel}
              </label>
              <textarea
                rows={4}
                value={form.result}
                onChange={(e) => updateField('result', e.target.value)}
                placeholder={ed.resultPlaceholder}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
              />
            </div>
          </div>

          {/* 4. Highlights, Metrics & Quote */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
            <h2 className="text-lg font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
              {ed.sec4Title}
            </h2>

            {/* Highlights */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-atlas-black">
                  {ed.highlightsLabel}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateField('highlights', [
                      ...form.highlights,
                      ed.newHighlightDefault,
                    ])
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold text-atlas-orange hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{ed.addHighlight}</span>
                </button>
              </div>

              {form.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={hl}
                    onChange={(e) => {
                      const next = [...form.highlights];
                      next[idx] = e.target.value;
                      updateField('highlights', next);
                    }}
                    className="flex-1 rounded-xl border border-neutral-300 px-3.5 py-2 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => moveHighlight(idx, -1)}
                    disabled={idx === 0}
                    aria-label={t.common.moveUp}
                    className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:text-atlas-black disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveHighlight(idx, 1)}
                    disabled={idx === form.highlights.length - 1}
                    aria-label={t.common.moveDown}
                    className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:text-atlas-black disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        'highlights',
                        form.highlights.filter((_, i) => i !== idx)
                      )
                    }
                    aria-label={t.common.delete}
                    className="p-2 rounded-lg border border-neutral-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-atlas-black">
                  {ed.metricsLabel}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateField('metrics', [
                      ...form.metrics,
                      {
                        value: '24/7',
                        label: isEn
                          ? 'Continuous staffing'
                          : 'Continue bezetting',
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold text-atlas-orange hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{ed.addMetric}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {form.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-atlas-grey/60 p-2.5 rounded-xl border border-neutral-200"
                  >
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => {
                          const next = [...form.metrics];
                          next[idx] = { ...next[idx], value: e.target.value };
                          updateField('metrics', next);
                        }}
                        placeholder={ed.metricValuePlaceholder}
                        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-extrabold text-atlas-orange focus:border-atlas-orange focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-7">
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => {
                          const next = [...form.metrics];
                          next[idx] = { ...next[idx], label: e.target.value };
                          updateField('metrics', next);
                        }}
                        placeholder={ed.metricLabelPlaceholder}
                        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          updateField(
                            'metrics',
                            form.metrics.filter((_, i) => i !== idx)
                          )
                        }
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Quote */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <label className="block text-xs font-bold text-atlas-black">
                {ed.quoteLabel}
              </label>
              <textarea
                rows={2}
                value={form.quote?.text || ''}
                onChange={(e) =>
                  updateField('quote', {
                    text: e.target.value,
                    author: form.quote?.author || '',
                    role: form.quote?.role || '',
                    organisation: form.quote?.organisation || '',
                  })
                }
                placeholder={ed.quotePlaceholder}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={form.quote?.author || ''}
                  onChange={(e) =>
                    updateField('quote', {
                      text: form.quote?.text || '',
                      author: e.target.value,
                      role: form.quote?.role || '',
                      organisation: form.quote?.organisation || '',
                    })
                  }
                  placeholder={ed.quoteAuthorPlaceholder}
                  className="rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                />
                <input
                  type="text"
                  value={form.quote?.role || ''}
                  onChange={(e) =>
                    updateField('quote', {
                      text: form.quote?.text || '',
                      author: form.quote?.author || '',
                      role: e.target.value,
                      organisation: form.quote?.organisation || '',
                    })
                  }
                  placeholder={ed.quoteRolePlaceholder}
                  className="rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                />
                <input
                  type="text"
                  value={form.quote?.organisation || ''}
                  onChange={(e) =>
                    updateField('quote', {
                      text: form.quote?.text || '',
                      author: form.quote?.author || '',
                      role: form.quote?.role || '',
                      organisation: e.target.value,
                    })
                  }
                  placeholder={ed.quoteOrgPlaceholder}
                  className="rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 5. Cover Image & Photo Gallery */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
            <h2 className="text-lg font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
              {ed.sec5Title}
            </h2>

            <ImageField
              label={ed.coverImageLabel}
              value={form.coverImage}
              onChange={(next) => updateField('coverImage', next)}
            />

            {/* Gallery Manager */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-atlas-black">
                    {ed.galleryTitle} ({form.gallery.length} {ed.photosUnit})
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {ed.galleryHelper}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGalleryPickerOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 bg-atlas-grey hover:bg-neutral-200 text-atlas-black text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-atlas-orange" />
                    <span>{ed.chooseFromMedia}</span>
                  </button>

                  <label className="inline-flex items-center gap-1.5 bg-atlas-orange hover:bg-atlas-orange-dark text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {isUploadingGallery ? ed.uploading : ed.uploadPhotos}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleGalleryUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {galleryPickerOpen && (
                <div className="bg-atlas-grey rounded-xl p-4 border border-neutral-200 space-y-3">
                  <p className="text-xs font-bold text-atlas-black">
                    {ed.pickPhotoInstruction}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-h-56 overflow-y-auto">
                    {media.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => {
                          updateField('gallery', [
                            ...form.gallery,
                            {
                              url: asset.url,
                              alt: asset.alt || form.title,
                              caption: asset.alt || '',
                            },
                          ]);
                          setGalleryPickerOpen(false);
                        }}
                        className="group rounded-lg overflow-hidden border border-neutral-300 hover:border-atlas-orange bg-white text-left cursor-pointer"
                      >
                        <div className="aspect-[16/10] bg-neutral-100 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset.url}
                            alt={asset.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="p-1.5 text-[10px] font-bold text-atlas-black truncate">
                          {asset.filename}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {form.gallery.length === 0 ? (
                <div className="bg-atlas-grey/50 rounded-xl p-6 text-center text-xs text-neutral-500 border border-dashed border-neutral-300">
                  {ed.emptyGallery}
                </div>
              ) : (
                <div className="space-y-3">
                  {form.gallery.map((item, idx) => (
                    <div
                      key={`${item.url}-${idx}`}
                      className="bg-atlas-grey/60 rounded-xl p-3.5 border border-neutral-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                    >
                      <div className="sm:col-span-3 aspect-[16/10] rounded-lg overflow-hidden bg-neutral-200 border border-neutral-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.alt || `Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="sm:col-span-7 space-y-2">
                        <input
                          type="text"
                          value={item.caption || ''}
                          onChange={(e) => {
                            const next = [...form.gallery];
                            next[idx] = { ...next[idx], caption: e.target.value };
                            updateField('gallery', next);
                          }}
                          placeholder={ed.captionPlaceholder}
                          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs sm:text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                        />
                        <input
                          type="text"
                          value={item.alt || ''}
                          onChange={(e) => {
                            const next = [...form.gallery];
                            next[idx] = { ...next[idx], alt: e.target.value };
                            updateField('gallery', next);
                          }}
                          placeholder={ed.altPlaceholder}
                          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-600 focus:border-atlas-orange focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveGalleryItem(idx, -1)}
                          disabled={idx === 0}
                          className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-atlas-black disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryItem(idx, 1)}
                          disabled={idx === form.gallery.length - 1}
                          className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-atlas-black disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              'gallery',
                              form.gallery.filter((_, i) => i !== idx)
                            )
                          }
                          className="p-2 rounded-lg bg-white border border-neutral-200 text-red-600 hover:bg-red-50"
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
        </div>

        {/* RIGHT COLUMN (~32% / 4 cols): Sticky Status, Category, Services & SEO */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          {/* 1. Publishing & Visibility */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="text-base font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
              {ed.sidebarPublishTitle}
            </h3>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1.5">
                {ed.statusLabel}
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  updateField('status', e.target.value as ProjectStatus)
                }
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-bold text-atlas-black focus:border-atlas-orange focus:outline-none"
              >
                <option value="draft">{ed.statusDraftOpt}</option>
                <option value="published">{ed.statusPublishedOpt}</option>
                <option value="archived">{ed.statusArchivedOpt}</option>
              </select>
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-atlas-orange-soft/60 border border-atlas-orange/25 cursor-pointer">
              <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-atlas-black">
                <Star className="w-4 h-4 text-atlas-orange fill-atlas-orange" />
                <span>{ed.featuredOnHome}</span>
              </span>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-atlas-orange focus:ring-atlas-orange"
              />
            </label>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1.5">
                {ed.displayOrderLabel}
              </label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) =>
                  updateField('displayOrder', Number(e.target.value) || 1)
                }
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Category & Services */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="text-base font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
              {ed.sidebarCategoryTitle}
            </h3>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1.5">
                {ed.categoryLabel}
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-medium text-atlas-black focus:border-atlas-orange focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-xs font-bold text-atlas-black mb-2">
                {ed.deployedServicesLabel}
              </span>
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {services.map((srv) => {
                  const checked = form.serviceSlugs.includes(srv.slug);
                  return (
                    <label
                      key={srv.id || srv.slug}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                        checked
                          ? 'bg-atlas-orange-soft/60 border-atlas-orange text-atlas-black'
                          : 'bg-atlas-grey/40 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...form.serviceSlugs, srv.slug]
                            : form.serviceSlugs.filter((s) => s !== srv.slug);
                          updateField('serviceSlugs', next);
                        }}
                        className="rounded border-neutral-300 text-atlas-orange focus:ring-atlas-orange"
                      />
                      <span>{srv.title}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. SEO & Google Snippet Preview */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="text-base font-extrabold text-atlas-black border-b border-neutral-100 pb-3">
              {ed.sidebarSeoTitle}
            </h3>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {ed.seoTitleLabel}
              </label>
              <input
                type="text"
                value={form.seo.title}
                onChange={(e) =>
                  updateField('seo', { ...form.seo, title: e.target.value })
                }
                placeholder={`${form.title || 'Project'} | Atlas Holland B.V.`}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {ed.seoDescLabel}
              </label>
              <textarea
                rows={3}
                value={form.seo.description}
                onChange={(e) =>
                  updateField('seo', { ...form.seo, description: e.target.value })
                }
                placeholder={form.summary || ed.seoDescPlaceholder}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-atlas-black focus:border-atlas-orange focus:outline-none"
              />
            </div>

            {/* Live Google Preview */}
            <div className="bg-atlas-grey rounded-xl p-3.5 border border-neutral-200 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {ed.googlePreviewLabel}
              </p>
              <p className="text-xs text-emerald-700 truncate">
                atlasholland.nl › {editLocale === 'en' ? 'en › projects' : 'projecten'} ›{' '}
                {form.slug || 'project'}
              </p>
              <p className="text-sm font-bold text-blue-800 line-clamp-1">
                {form.seo.title ||
                  `${form.title || ed.projectTitleLabel} | Atlas Holland B.V.`}
              </p>
              <p className="text-xs text-neutral-600 line-clamp-2">
                {form.seo.description ||
                  form.summary ||
                  (isEn
                    ? 'Read more about this traffic management and site safety project by Atlas Holland B.V.'
                    : 'Lees meer over dit verkeers- en veiligheidsproject van Atlas Holland B.V.')}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
