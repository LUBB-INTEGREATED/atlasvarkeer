'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  X,
  Save,
  MapPin,
  Clock,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { CmsVacancyItem } from '@/cms/types';
import { AdminShell } from '@/components/admin/AdminShell';
import { ImageField } from '@/components/admin/ImageField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export default function AdminVacaturesPage() {
  const { vacancies, saveVacancy, deleteVacancy } = useCms();
  const { t, editLocale, isEn } = useAdminT();

  const [editingVacancy, setEditingVacancy] = useState<CmsVacancyItem | null>(
    null
  );
  const [vacancyToDelete, setVacancyToDelete] =
    useState<CmsVacancyItem | null>(null);

  const sorted = [...vacancies].sort((a, b) => a.displayOrder - b.displayOrder);

  const useEnDefaults = editLocale === 'en' || isEn;
  const vacancyBasePath = editLocale === 'en' ? '/en/careers' : '/werken-bij';

  const handleCreateNew = () => {
    setEditingVacancy({
      id: `vac-${Date.now()}`,
      slug: useEnDefaults
        ? `vacancy-${Date.now().toString().slice(-4)}`
        : `vacature-${Date.now().toString().slice(-4)}`,
      title: useEnDefaults ? 'New Vacancy' : 'Nieuwe Vacature',
      region: useEnDefaults
        ? 'Nationwide / Region flexible'
        : 'Landelijk / Regio in overleg',
      hours: useEnDefaults ? '16 – 40 hours per week' : '16 – 40 uur per week',
      employmentType: 'Full-time / Part-time',
      startDate: useEnDefaults
        ? 'Immediate or by arrangement'
        : 'Per direct of in overleg',
      tags: useEnDefaults
        ? ['Full-time / Part-time', 'Nationwide', 'Competitive pay']
        : ['Fulltime / Parttime', 'Landelijk', 'Goed salaris'],
      summary: useEnDefaults
        ? 'Short engaging summary of this role at Atlas Holland.'
        : 'Korte wervende samenvatting van deze functie bij Atlas Holland.',
      intro: useEnDefaults
        ? 'Detailed introduction about this role and the team.'
        : 'Uitgebreide introductie over deze functie en het team.',
      whatYouDo: useEnDefaults
        ? [
            'Safely and hospitably guide traffic flows on site',
            'Collaborate closely with site managers and fellow traffic controllers',
          ]
        : [
            'Veilig en gastvrij begeleiden van verkeersstromen op locatie',
            'Samenwerken met uitvoerders en collega-verkeersregelaars',
          ],
      whatWeAsk: useEnDefaults
        ? [
            'Strong sense of responsibility and professional attitude',
            'Good communication skills',
          ]
        : [
            'Verantwoordelijkheidsgevoel en representatieve houding',
            'Goede beheersing van de Nederlandse taal',
          ],
      whatWeOffer: useEnDefaults
        ? [
            'Excellent hourly wage and punctual payments',
            'Free accredited training and complete high-visibility workwear kit',
          ]
        : [
            'Uitstekend uurloon en stipte betaling',
            'Gratis erkende opleiding en compleet kledingpakket',
          ],
      heroImage: {
        url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
        alt: useEnDefaults
          ? 'Careers at Atlas Holland B.V.'
          : 'Werken bij Atlas Holland B.V.',
      },
      status: 'published',
      displayOrder: vacancies.length + 1,
    });
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
              {t.vacancies.eyebrow}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-atlas-black">
              {t.vacancies.title} ({vacancies.length})
            </h1>
          </div>

          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.vacancies.addNew}</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-200">
          {sorted.map((vac) => (
            <div
              key={vac.id}
              className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-atlas-grey/30"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                      vac.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {vac.status === 'published'
                      ? t.common.statusPublished
                      : t.common.statusDraft}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin className="w-3.5 h-3.5 text-atlas-orange" />
                    {vac.region}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
                    <Clock className="w-3.5 h-3.5 text-atlas-orange" />
                    {vac.hours}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-atlas-black">
                  {vac.title}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-1">
                  {vac.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    saveVacancy({
                      ...vac,
                      status:
                        vac.status === 'published' ? 'draft' : 'published',
                    })
                  }
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold text-atlas-ink hover:bg-neutral-50 cursor-pointer"
                >
                  {vac.status === 'published'
                    ? t.common.setDraft
                    : t.common.publish}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditingVacancy(JSON.parse(JSON.stringify(vac)))
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-atlas-black hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 text-atlas-orange" />
                  <span>{t.common.edit}</span>
                </button>

                <Link
                  href={`${vacancyBasePath}/${vac.slug}`}
                  target="_blank"
                  title={t.common.viewLive}
                  className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-atlas-orange"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setVacancyToDelete(vac)}
                  title={t.common.delete}
                  className="p-2 rounded-lg border border-neutral-200 text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VACANCY EDITOR MODAL */}
      {editingVacancy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-atlas-black/65 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-atlas-black">
                {t.vacancies.editModalTitle} {editingVacancy.title}
              </h2>
              <button
                type="button"
                onClick={() => setEditingVacancy(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-atlas-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-atlas-black mb-1">
                    {t.vacancies.fieldTitle}
                  </label>
                  <input
                    type="text"
                    value={editingVacancy.title}
                    onChange={(e) =>
                      setEditingVacancy({
                        ...editingVacancy,
                        title: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-atlas-black mb-1">
                    {t.vacancies.fieldSlug}
                  </label>
                  <input
                    type="text"
                    value={editingVacancy.slug}
                    onChange={(e) =>
                      setEditingVacancy({
                        ...editingVacancy,
                        slug: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-atlas-black mb-1">
                    {t.vacancies.fieldRegion}
                  </label>
                  <input
                    type="text"
                    value={editingVacancy.region}
                    onChange={(e) =>
                      setEditingVacancy({
                        ...editingVacancy,
                        region: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-atlas-black mb-1">
                    {t.vacancies.fieldHours}
                  </label>
                  <input
                    type="text"
                    value={editingVacancy.hours}
                    onChange={(e) =>
                      setEditingVacancy({
                        ...editingVacancy,
                        hours: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-atlas-black mb-1">
                    {t.vacancies.fieldStartDate}
                  </label>
                  <input
                    type="text"
                    value={editingVacancy.startDate}
                    onChange={(e) =>
                      setEditingVacancy({
                        ...editingVacancy,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {t.vacancies.fieldSummary}
                </label>
                <textarea
                  rows={2}
                  value={editingVacancy.summary}
                  onChange={(e) =>
                    setEditingVacancy({
                      ...editingVacancy,
                      summary: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {t.vacancies.fieldIntro}
                </label>
                <textarea
                  rows={3}
                  value={editingVacancy.intro}
                  onChange={(e) =>
                    setEditingVacancy({
                      ...editingVacancy,
                      intro: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Bullet lists */}
              {(
                [
                  { key: 'whatYouDo', label: t.vacancies.fieldWhatYouDo },
                  { key: 'whatWeAsk', label: t.vacancies.fieldWhatWeAsk },
                  { key: 'whatWeOffer', label: t.vacancies.fieldWhatWeOffer },
                ] as const
              ).map((section) => (
                <div key={section.key}>
                  <label className="block text-xs font-bold text-atlas-black mb-1">
                    {section.label}
                  </label>
                  <textarea
                    rows={4}
                    value={editingVacancy[section.key].join('\n')}
                    onChange={(e) =>
                      setEditingVacancy({
                        ...editingVacancy,
                        [section.key]: e.target.value
                          .split('\n')
                          .filter((line) => line.trim().length > 0),
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
              ))}

              <ImageField
                label={t.vacancies.fieldHeroImage}
                value={editingVacancy.heroImage}
                onChange={(img) =>
                  setEditingVacancy({
                    ...editingVacancy,
                    heroImage: img,
                  })
                }
              />
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-end gap-3 bg-atlas-grey/50">
              <button
                type="button"
                onClick={() => setEditingVacancy(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-bold text-atlas-ink bg-white cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await saveVacancy(editingVacancy);
                  setEditingVacancy(null);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-atlas-orange hover:bg-atlas-orange-dark text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.vacancies.saveVacancy}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(vacancyToDelete)}
        title={t.vacancies.deleteTitle}
        description={`${t.vacancies.deleteDescPrefix} "${vacancyToDelete?.title}" ${t.vacancies.deleteDescSuffix}`}
        onCancel={() => setVacancyToDelete(null)}
        onConfirm={async () => {
          if (vacancyToDelete) {
            await deleteVacancy(vacancyToDelete.id);
            setVacancyToDelete(null);
          }
        }}
      />
    </AdminShell>
  );
}
