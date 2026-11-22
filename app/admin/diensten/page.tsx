'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  ExternalLink,
  X,
  Save,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { CmsServiceItem, ServiceGroupKey } from '@/cms/types';
import { AdminShell } from '@/components/admin/AdminShell';
import { ImageField } from '@/components/admin/ImageField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export default function AdminDienstenPage() {
  const { services, saveService, saveAllServices, deleteService } = useCms();
  const { t, editLocale, isEn } = useAdminT();

  const [editingService, setEditingService] = useState<CmsServiceItem | null>(
    null
  );
  const [serviceToDelete, setServiceToDelete] =
    useState<CmsServiceItem | null>(null);

  const groups: { key: ServiceGroupKey; label: string }[] = [
    { key: 'operationeel', label: t.services.groupOperationeel },
    { key: 'planning-advies', label: t.services.groupPlanning },
    { key: 'totaaloplossingen', label: t.services.groupTotaal },
  ];

  const getGroupLabel = (key: ServiceGroupKey) => {
    const found = groups.find((g) => g.key === key);
    return found ? found.label : key;
  };

  const sortedServices = [...services].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const useEnDefaults = editLocale === 'en' || isEn;
  const serviceBasePath = editLocale === 'en' ? '/en/services' : '/diensten';

  const handleCreateNew = () => {
    const newSrv: CmsServiceItem = {
      id: `srv-${Date.now()}`,
      slug: useEnDefaults
        ? `new-service-${Date.now().toString().slice(-3)}`
        : `nieuwe-dienst-${Date.now().toString().slice(-3)}`,
      group: 'operationeel',
      title: useEnDefaults ? 'New Service' : 'Nieuwe Dienst',
      shortTitle: useEnDefaults ? 'New Service' : 'Nieuwe Dienst',
      oneLiner: useEnDefaults
        ? 'Short description of this service for the overview card.'
        : 'Korte omschrijving van deze dienst voor op de overzichtskaart.',
      heroPromise: useEnDefaults
        ? 'Professional deployment and tailored traffic safety across the Netherlands.'
        : 'Professionele inzet en maatwerk voor uw project door heel Nederland.',
      imageUrl: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
      imageAlt: 'Atlas Holland service',
      cardImage: {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: 'Atlas Holland service',
      },
      heroImage: {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: 'Atlas Holland service',
      },
      whatWeDoParagraphs: [
        useEnDefaults
          ? 'First paragraph describing what Atlas Holland delivers within this service.'
          : 'Eerste alinea over wat Atlas Holland binnen deze dienst verzorgt.',
      ],
      whatWeDoBullets: useEnDefaults
        ? ['100% certified traffic professionals', '24/7 nationwide coverage']
        : ['100% gecertificeerde vakmensen', '24/7 landelijk inzetbaar'],
      applications: [
        {
          title: useEnDefaults
            ? 'Roadworks & Infrastructure'
            : 'Wegenbouw & Infra',
          description: useEnDefaults
            ? 'Safe traffic management during roadworks.'
            : 'Veilige begeleiding bij wegwerkzaamheden.',
          iconName: 'Route',
        },
      ],
      faqs: [
        {
          question: useEnDefaults
            ? 'How quickly can this service be deployed?'
            : 'Hoe snel kan deze dienst worden ingezet?',
          answer: useEnDefaults
            ? 'Standard requests within 24 hours; emergency deployment immediately via our 24/7 dispatch.'
            : 'Reguliere aanvragen binnen 24 uur, spoedinzet direct via onze 24/7 meldkamer.',
        },
      ],
      relatedSlugs: useEnDefaults
        ? ['traffic-controllers', 'traffic-plans']
        : ['verkeersregelaars', 'verkeersplannen'],
      featuredOnHome: false,
      status: 'published',
      displayOrder: services.length + 1,
      seo: {
        title: useEnDefaults
          ? 'New Service | Atlas Holland B.V.'
          : 'Nieuwe Dienst | Atlas Holland B.V.',
        description: useEnDefaults
          ? 'Professional traffic management and safety service by Atlas Holland B.V.'
          : 'Professionele verkeers- en veiligheidsdienst van Atlas Holland B.V.',
      },
    };
    setEditingService(newSrv);
  };

  const moveServiceOrder = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sortedServices.length) return;
    const copy = [...sortedServices];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    const reindexed = copy.map((s, idx) => ({ ...s, displayOrder: idx + 1 }));
    await saveAllServices(reindexed);
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
              {t.services.eyebrow}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-atlas-black">
              {t.services.title} ({services.length})
            </h1>
          </div>

          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.services.addNew}</span>
          </button>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-200 overflow-hidden">
          {sortedServices.map((srv, idx) => (
            <div
              key={srv.id}
              className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-atlas-grey/30 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={srv.cardImage?.url || srv.imageUrl}
                    alt={srv.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase bg-atlas-orange-soft text-atlas-orange px-2 py-0.5 rounded">
                      {getGroupLabel(srv.group)}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        srv.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {srv.status === 'published'
                        ? t.common.statusPublished
                        : t.common.statusDraft}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-atlas-black truncate mt-1">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate">{srv.oneLiner}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    saveService({
                      ...srv,
                      featuredOnHome: !srv.featuredOnHome,
                    })
                  }
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
                    srv.featuredOnHome
                      ? 'bg-atlas-orange-soft border-atlas-orange text-atlas-orange'
                      : 'bg-white border-neutral-200 text-neutral-500'
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      srv.featuredOnHome ? 'fill-atlas-orange text-atlas-orange' : ''
                    }`}
                  />
                  <span>{t.services.onHomepage}</span>
                </button>

                <button
                  type="button"
                  onClick={() => moveServiceOrder(idx, -1)}
                  disabled={idx === 0}
                  aria-label={t.common.moveUp}
                  className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-atlas-black disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => moveServiceOrder(idx, 1)}
                  disabled={idx === sortedServices.length - 1}
                  aria-label={t.common.moveDown}
                  className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-atlas-black disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditingService(JSON.parse(JSON.stringify(srv)))
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-atlas-black hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 text-atlas-orange" />
                  <span>{t.common.edit}</span>
                </button>

                <Link
                  href={`${serviceBasePath}/${srv.slug}`}
                  target="_blank"
                  title={t.common.viewLive}
                  className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-atlas-orange"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setServiceToDelete(srv)}
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

      {/* SERVICE EDITOR MODAL */}
      {editingService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-atlas-black/65 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-atlas-black">
                {t.services.editModalTitle} {editingService.title}
              </h2>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-atlas-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-atlas-black mb-1">
                    {t.services.fieldTitle}
                  </label>
                  <input
                    type="text"
                    value={editingService.title}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        title: e.target.value,
                        shortTitle: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-atlas-black mb-1">
                    {t.services.fieldSlug}
                  </label>
                  <input
                    type="text"
                    value={editingService.slug}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        slug: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-atlas-black mb-1">
                    {t.services.fieldGroup}
                  </label>
                  <select
                    value={editingService.group}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        group: e.target.value as ServiceGroupKey,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
                  >
                    {groups.map((g) => (
                      <option key={g.key} value={g.key}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {t.services.fieldOneLiner}
                </label>
                <input
                  type="text"
                  value={editingService.oneLiner}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      oneLiner: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {t.services.fieldHeroPromise}
                </label>
                <textarea
                  rows={2}
                  value={editingService.heroPromise}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      heroPromise: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageField
                  label={t.services.fieldCardImage}
                  value={editingService.cardImage}
                  onChange={(img) =>
                    setEditingService({
                      ...editingService,
                      cardImage: img,
                      imageUrl: img.url,
                      imageAlt: img.alt,
                    })
                  }
                />
                <ImageField
                  label={t.services.fieldHeroImage}
                  value={editingService.heroImage}
                  onChange={(img) =>
                    setEditingService({
                      ...editingService,
                      heroImage: img,
                    })
                  }
                />
              </div>

              {/* What we do paragraphs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-atlas-black">
                  {t.services.fieldParagraphs}
                </label>
                {editingService.whatWeDoParagraphs.map((par, idx) => (
                  <textarea
                    key={idx}
                    rows={3}
                    value={par}
                    onChange={(e) => {
                      const next = [...editingService.whatWeDoParagraphs];
                      next[idx] = e.target.value;
                      setEditingService({
                        ...editingService,
                        whatWeDoParagraphs: next,
                      });
                    }}
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  />
                ))}
              </div>

              {/* Bullets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-atlas-black">
                    {t.services.fieldBullets}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingService({
                        ...editingService,
                        whatWeDoBullets: [
                          ...editingService.whatWeDoBullets,
                          t.services.newBulletDefault,
                        ],
                      })
                    }
                    className="text-xs font-bold text-atlas-orange hover:underline"
                  >
                    {t.services.addBullet}
                  </button>
                </div>
                {editingService.whatWeDoBullets.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const next = [...editingService.whatWeDoBullets];
                        next[idx] = e.target.value;
                        setEditingService({
                          ...editingService,
                          whatWeDoBullets: next,
                        });
                      }}
                      className="flex-1 rounded-xl border border-neutral-300 px-3 py-1.5 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingService({
                          ...editingService,
                          whatWeDoBullets: editingService.whatWeDoBullets.filter(
                            (_, i) => i !== idx
                          ),
                        })
                      }
                      className="p-1.5 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-bold text-atlas-black mb-1">
                    {t.services.fieldStatus}
                  </label>
                  <select
                    value={editingService.status}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        status: e.target.value as 'draft' | 'published',
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
                  >
                    <option value="published">{t.common.statusPublished}</option>
                    <option value="draft">{t.common.statusDraft}</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 pt-5 cursor-pointer text-sm font-bold text-atlas-black">
                  <input
                    type="checkbox"
                    checked={editingService.featuredOnHome}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        featuredOnHome: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-atlas-orange"
                  />
                  <span>{t.services.fieldFeaturedHome}</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-end gap-3 bg-atlas-grey/50">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-bold text-atlas-ink bg-white cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await saveService(editingService);
                  setEditingService(null);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-atlas-orange hover:bg-atlas-orange-dark text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.services.saveService}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(serviceToDelete)}
        title={t.services.deleteTitle}
        description={`${t.services.deleteDescPrefix} "${serviceToDelete?.title}" ${t.services.deleteDescSuffix}`}
        onCancel={() => setServiceToDelete(null)}
        onConfirm={async () => {
          if (serviceToDelete) {
            await deleteService(serviceToDelete.id);
            setServiceToDelete(null);
          }
        }}
      />
    </AdminShell>
  );
}
