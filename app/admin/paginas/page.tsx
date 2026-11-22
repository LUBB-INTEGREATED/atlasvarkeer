'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { PagesContent } from '@/cms/types';
import { AdminShell } from '@/components/admin/AdminShell';
import { ImageField } from '@/components/admin/ImageField';

type PageTabKey =
  | 'home'
  | 'about'
  | 'courses'
  | 'careers'
  | 'quote'
  | 'contact'
  | 'projectsOverview'
  | 'servicesOverview'
  | 'legal';

const PAGE_TAB_KEYS: PageTabKey[] = [
  'home',
  'about',
  'courses',
  'careers',
  'quote',
  'contact',
  'projectsOverview',
  'servicesOverview',
  'legal',
];

function SectionCard({
  title,
  subtitle,
  visible,
  onToggleVisible,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  visible?: boolean;
  onToggleVisible?: (next: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { t } = useAdminT();

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
      <div className="px-6 py-4 flex items-center justify-between gap-4 bg-white border-b border-neutral-100">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex-1 text-left flex items-center gap-3 cursor-pointer"
        >
          <ChevronDown
            className={`w-5 h-5 text-atlas-orange transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          />
          <div>
            <h3 className="text-base font-extrabold text-atlas-black">{title}</h3>
            {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
          </div>
        </button>

        {typeof visible === 'boolean' && onToggleVisible && (
          <button
            type="button"
            onClick={() => onToggleVisible(!visible)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              visible
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-neutral-100 border-neutral-200 text-neutral-500'
            }`}
          >
            {visible ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>{t.common.visible}</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>{t.common.hidden}</span>
              </>
            )}
          </button>
        )}
      </div>

      {open && <div className="p-6 space-y-5">{children}</div>}
    </div>
  );
}

function AdminPaginasInner() {
  const searchParams = useSearchParams();
  const initialPageParam = searchParams.get('page') as PageTabKey | null;

  const { pages, updatePages } = useCms();
  const { t, tx, editLocale } = useAdminT();

  const pageTabs: { key: PageTabKey; label: string; publicPath: string }[] = [
    {
      key: 'home',
      label: t.pages.tabs.home,
      publicPath: editLocale === 'en' ? '/en' : '/',
    },
    {
      key: 'about',
      label: t.pages.tabs.about,
      publicPath: editLocale === 'en' ? '/en/about' : '/over-ons',
    },
    {
      key: 'courses',
      label: t.pages.tabs.courses,
      publicPath: editLocale === 'en' ? '/en/training' : '/opleidingen',
    },
    {
      key: 'careers',
      label: t.pages.tabs.careers,
      publicPath: editLocale === 'en' ? '/en/careers' : '/werken-bij',
    },
    {
      key: 'quote',
      label: t.pages.tabs.quote,
      publicPath: editLocale === 'en' ? '/en/request-quote' : '/offerte-aanvragen',
    },
    {
      key: 'contact',
      label: t.pages.tabs.contact,
      publicPath: editLocale === 'en' ? '/en/contact' : '/contact',
    },
    {
      key: 'projectsOverview',
      label: t.pages.tabs.projectsOverview,
      publicPath: editLocale === 'en' ? '/en/projects' : '/projecten',
    },
    {
      key: 'servicesOverview',
      label: t.pages.tabs.servicesOverview,
      publicPath: editLocale === 'en' ? '/en/services' : '/diensten',
    },
    {
      key: 'legal',
      label: t.pages.tabs.legal,
      publicPath: editLocale === 'en' ? '/en/privacy' : '/privacy',
    },
  ];

  const [activeTab, setActiveTab] = useState<PageTabKey>(() =>
    initialPageParam && PAGE_TAB_KEYS.includes(initialPageParam)
      ? initialPageParam
      : 'home'
  );
  const [draft, setDraft] = useState<PagesContent>(() =>
    JSON.parse(JSON.stringify(pages))
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const markDirty = (updater: (prev: PagesContent) => PagesContent) => {
    setDraft((prev) => updater(prev));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updatePages(draft);
    setIsDirty(false);
    setIsSaving(false);
  };

  const handleRevert = () => {
    setDraft(JSON.parse(JSON.stringify(pages)));
    setIsDirty(false);
  };

  const currentTabInfo =
    pageTabs.find((tabItem) => tabItem.key === activeTab) || pageTabs[0];

  return (
    <div className="space-y-6 pb-20">
      {/* STICKY HEADER & SAVE BAR */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200 px-5 py-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
            {t.pages.eyebrow}
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-atlas-black">
            {t.pages.titlePrefix} {currentTabInfo.label}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={currentTabInfo.publicPath}
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-atlas-grey hover:bg-neutral-200 text-atlas-black text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl transition-colors"
          >
            <span>{t.pages.viewPage}</span>
            <ExternalLink className="w-3.5 h-3.5 text-atlas-orange" />
          </Link>

          {isDirty && (
            <button
              type="button"
              onClick={handleRevert}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.common.revert}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 bg-atlas-orange hover:bg-atlas-orange-dark text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? t.common.saving : t.common.save}</span>
          </button>
        </div>
      </div>

      {/* PAGE TABS */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-2 flex flex-wrap items-center gap-1.5">
        {pageTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'bg-atlas-orange text-white shadow-xs'
                : 'text-neutral-600 hover:bg-atlas-grey hover:text-atlas-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: HOME PAGE EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'home' && (
        <div className="space-y-4">
          {/* 1. Hero Section */}
          <SectionCard
            title={tx(
              '1. Hero Sectie (Bovenaan homepagina)',
              '1. Hero Section (Top of homepage)'
            )}
            subtitle={tx(
              "Hoofdtitel, ondertitel, knoppen, 4 zekerheden en achtergrondsfoto's",
              'Main headline, subtitle, CTA buttons, 4 trust badges and background photos'
            )}
            visible={draft.home.hero.visible}
            onToggleVisible={(v) =>
              markDirty((prev) => ({
                ...prev,
                home: { ...prev.home, hero: { ...prev.home.hero, visible: v } },
              }))
            }
            defaultOpen
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Oranje bovenlabel (Eyebrow)', 'Orange Eyebrow Label')}
                </label>
                <input
                  type="text"
                  value={draft.home.hero.eyebrow}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        hero: { ...p.home.hero, eyebrow: e.target.value },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-atlas-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Hoofdtitel regel 1 (Wit)', 'Main Headline Line 1 (White)')}
                </label>
                <input
                  type="text"
                  value={draft.home.hero.titleLine1}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        hero: { ...p.home.hero, titleLine1: e.target.value },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx(
                    'Hoofdtitel regel 2 (Oranje + Swoosh)',
                    'Main Headline Line 2 (Orange + Swoosh)'
                  )}
                </label>
                <input
                  type="text"
                  value={draft.home.hero.titleLine2}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        hero: { ...p.home.hero, titleLine2: e.target.value },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {tx('Ondertitel (Introductietekst)', 'Subtitle (Introduction copy)')}
              </label>
              <textarea
                rows={3}
                value={draft.home.hero.subtitle}
                onChange={(e) =>
                  markDirty((p) => ({
                    ...p,
                    home: {
                      ...p.home,
                      hero: { ...p.home.hero, subtitle: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-atlas-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Primaire knop tekst & link', 'Primary button label & link')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={draft.home.hero.primaryCtaLabel}
                    onChange={(e) =>
                      markDirty((p) => ({
                        ...p,
                        home: {
                          ...p.home,
                          hero: {
                            ...p.home.hero,
                            primaryCtaLabel: e.target.value,
                          },
                        },
                      }))
                    }
                    className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={draft.home.hero.primaryCtaHref}
                    onChange={(e) =>
                      markDirty((p) => ({
                        ...p,
                        home: {
                          ...p.home,
                          hero: {
                            ...p.home.hero,
                            primaryCtaHref: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-40 rounded-xl border border-neutral-300 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Secundaire knop tekst & link', 'Secondary button label & link')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={draft.home.hero.secondaryCtaLabel}
                    onChange={(e) =>
                      markDirty((p) => ({
                        ...p,
                        home: {
                          ...p.home,
                          hero: {
                            ...p.home.hero,
                            secondaryCtaLabel: e.target.value,
                          },
                        },
                      }))
                    }
                    className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={draft.home.hero.secondaryCtaHref}
                    onChange={(e) =>
                      markDirty((p) => ({
                        ...p,
                        home: {
                          ...p.home,
                          hero: {
                            ...p.home.hero,
                            secondaryCtaHref: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-40 rounded-xl border border-neutral-300 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1.5">
                {tx(
                  '4 Zekerheden / Trust Badges onder knoppen',
                  '4 Trust Badges below buttons'
                )}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {draft.home.hero.trustBadges.map((badge, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={badge}
                    onChange={(e) =>
                      markDirty((p) => {
                        const next = [...p.home.hero.trustBadges];
                        next[idx] = e.target.value;
                        return {
                          ...p,
                          home: {
                            ...p.home,
                            hero: { ...p.home.hero, trustBadges: next },
                          },
                        };
                      })
                    }
                    className="rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-atlas-black"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageField
                label={tx('Hero Achtergrondfoto', 'Hero Background Photo')}
                value={draft.home.hero.heroImage}
                onChange={(img) =>
                  markDirty((p) => ({
                    ...p,
                    home: { ...p.home, hero: { ...p.home.hero, heroImage: img } },
                  }))
                }
              />
              <ImageField
                label={tx('Rechter Hero Fotokaart', 'Right Hero Photo Card')}
                value={draft.home.hero.sideCardImage}
                onChange={(img) =>
                  markDirty((p) => ({
                    ...p,
                    home: {
                      ...p.home,
                      hero: { ...p.home.hero, sideCardImage: img },
                    },
                  }))
                }
                aspectHint={tx(
                  'Aanbevolen: 4:5 portret',
                  'Recommended: 4:5 portrait'
                )}
              />
            </div>
          </SectionCard>

          {/* 2. Key Figures */}
          <SectionCard
            title={tx(
              '2. Kerncijfers Balk (4 animerende tellers)',
              '2. Key Figures Bar (4 animated counters)'
            )}
            subtitle={tx(
              '500+ Projecten, 24/7 Bereikbaar, 100% Gecertificeerd, Landelijk',
              '500+ Projects, 24/7 Dispatch, 100% Certified, Nationwide'
            )}
            visible={draft.home.keyFigures.visible}
            onToggleVisible={(v) =>
              markDirty((p) => ({
                ...p,
                home: {
                  ...p.home,
                  keyFigures: { ...p.home.keyFigures, visible: v },
                },
              }))
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {draft.home.keyFigures.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-atlas-grey/60 rounded-xl p-4 border border-neutral-200 space-y-2.5"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500">
                        {tx('Weergavewaarde', 'Display value')}
                      </label>
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) =>
                          markDirty((p) => {
                            const next = [...p.home.keyFigures.items];
                            next[idx] = { ...next[idx], value: e.target.value };
                            return {
                              ...p,
                              home: {
                                ...p.home,
                                keyFigures: {
                                  ...p.home.keyFigures,
                                  items: next,
                                },
                              },
                            };
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-extrabold text-atlas-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500">
                        {tx('Titel', 'Label')}
                      </label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) =>
                          markDirty((p) => {
                            const next = [...p.home.keyFigures.items];
                            next[idx] = { ...next[idx], label: e.target.value };
                            return {
                              ...p,
                              home: {
                                ...p.home,
                                keyFigures: {
                                  ...p.home.keyFigures,
                                  items: next,
                                },
                              },
                            };
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-bold text-atlas-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500">
                      {tx('Subtekst', 'Sublabel')}
                    </label>
                    <input
                      type="text"
                      value={item.sublabel}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.home.keyFigures.items];
                          next[idx] = { ...next[idx], sublabel: e.target.value };
                          return {
                            ...p,
                            home: {
                              ...p.home,
                              keyFigures: {
                                ...p.home.keyFigures,
                                items: next,
                              },
                            },
                          };
                        })
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 3. Services Section + CTA Band */}
          <SectionCard
            title={tx(
              '3. Diensten Intro & Oranje CTA Band',
              '3. Services Intro & Orange CTA Band'
            )}
            subtitle={tx(
              'Kopteksten boven de 6 uitgelichte diensten en de oranje spoed-balk',
              'Headings above the 6 featured services and the orange emergency banner'
            )}
            visible={draft.home.servicesSection.visible}
            onToggleVisible={(v) =>
              markDirty((p) => ({
                ...p,
                home: {
                  ...p.home,
                  servicesSection: {
                    ...p.home.servicesSection,
                    visible: v,
                  },
                },
              }))
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Diensten Eyebrow', 'Services Eyebrow')}
                </label>
                <input
                  type="text"
                  value={draft.home.servicesSection.eyebrow}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        servicesSection: {
                          ...p.home.servicesSection,
                          eyebrow: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Titel regel 1', 'Title Line 1')}
                </label>
                <input
                  type="text"
                  value={draft.home.servicesSection.titleLine1}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        servicesSection: {
                          ...p.home.servicesSection,
                          titleLine1: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Titel regel 2 (Oranje)', 'Title Line 2 (Orange)')}
                </label>
                <input
                  type="text"
                  value={draft.home.servicesSection.titleLine2}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        servicesSection: {
                          ...p.home.servicesSection,
                          titleLine2: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {tx('Diensten ondertitel', 'Services subtitle')}
              </label>
              <textarea
                rows={2}
                value={draft.home.servicesSection.subtitle}
                onChange={(e) =>
                  markDirty((p) => ({
                    ...p,
                    home: {
                      ...p.home,
                      servicesSection: {
                        ...p.home.servicesSection,
                        subtitle: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Oranje CTA Band Badge', 'Orange CTA Band Badge')}
                </label>
                <input
                  type="text"
                  value={draft.home.ctaBand.badge}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        ctaBand: { ...p.home.ctaBand, badge: e.target.value },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Oranje CTA Band Hoofdzin', 'Orange CTA Band Headline')}
                </label>
                <input
                  type="text"
                  value={draft.home.ctaBand.headline}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        ctaBand: { ...p.home.ctaBand, headline: e.target.value },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
                />
              </div>
            </div>
          </SectionCard>

          {/* 4. Process 3 Steps */}
          <SectionCard
            title={tx(
              '4. Onze Werkwijze (3 Genummerde Stappen)',
              '4. How We Work (3 Numbered Steps)'
            )}
            subtitle={tx(
              'Van verkeersplan tot uitvoering',
              'From traffic plan to on-site execution'
            )}
            visible={draft.home.processSection.visible}
            onToggleVisible={(v) =>
              markDirty((p) => ({
                ...p,
                home: {
                  ...p.home,
                  processSection: { ...p.home.processSection, visible: v },
                },
              }))
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {draft.home.processSection.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-atlas-grey/60 rounded-xl p-4 border border-neutral-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-atlas-orange">
                      {tx('Stap', 'Step')} {step.number}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) =>
                      markDirty((p) => {
                        const next = [...p.home.processSection.steps];
                        next[idx] = { ...next[idx], title: e.target.value };
                        return {
                          ...p,
                          home: {
                            ...p.home,
                            processSection: {
                              ...p.home.processSection,
                              steps: next,
                            },
                          },
                        };
                      })
                    }
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-bold"
                  />
                  <input
                    type="text"
                    value={step.subtitle}
                    onChange={(e) =>
                      markDirty((p) => {
                        const next = [...p.home.processSection.steps];
                        next[idx] = { ...next[idx], subtitle: e.target.value };
                        return {
                          ...p,
                          home: {
                            ...p.home,
                            processSection: {
                              ...p.home.processSection,
                              steps: next,
                            },
                          },
                        };
                      })
                    }
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-atlas-orange"
                  />
                  <textarea
                    rows={3}
                    value={step.description}
                    onChange={(e) =>
                      markDirty((p) => {
                        const next = [...p.home.processSection.steps];
                        next[idx] = {
                          ...next[idx],
                          description: e.target.value,
                        };
                        return {
                          ...p,
                          home: {
                            ...p.home,
                            processSection: {
                              ...p.home.processSection,
                              steps: next,
                            },
                          },
                        };
                      })
                    }
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 5. Featured Projects Section */}
          <SectionCard
            title={tx(
              '5. Uitgelichte Projecten op Homepagina',
              '5. Featured Projects on Homepage'
            )}
            subtitle={tx(
              'Kopteksten en maximaal aantal getoonde projecten (3 of 6)',
              'Headings and maximum number of displayed projects (3 or 6)'
            )}
            visible={draft.home.featuredProjectsSection.visible}
            onToggleVisible={(v) =>
              markDirty((p) => ({
                ...p,
                home: {
                  ...p.home,
                  featuredProjectsSection: {
                    ...p.home.featuredProjectsSection,
                    visible: v,
                  },
                },
              }))
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  Eyebrow
                </label>
                <input
                  type="text"
                  value={draft.home.featuredProjectsSection.eyebrow}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        featuredProjectsSection: {
                          ...p.home.featuredProjectsSection,
                          eyebrow: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Titel deel 1', 'Title Part 1')}
                </label>
                <input
                  type="text"
                  value={draft.home.featuredProjectsSection.titleLine1}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        featuredProjectsSection: {
                          ...p.home.featuredProjectsSection,
                          titleLine1: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Titel deel 2 (Oranje)', 'Title Part 2 (Orange)')}
                </label>
                <input
                  type="text"
                  value={draft.home.featuredProjectsSection.titleLine2}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        featuredProjectsSection: {
                          ...p.home.featuredProjectsSection,
                          titleLine2: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Ondertitel', 'Subtitle')}
                </label>
                <input
                  type="text"
                  value={draft.home.featuredProjectsSection.subtitle}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        featuredProjectsSection: {
                          ...p.home.featuredProjectsSection,
                          subtitle: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Max. aantal projecten', 'Max. projects shown')}
                </label>
                <select
                  value={draft.home.featuredProjectsSection.maxItems}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        featuredProjectsSection: {
                          ...p.home.featuredProjectsSection,
                          maxItems: Number(e.target.value) === 6 ? 6 : 3,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
                >
                  <option value={3}>{tx('3 projecten', '3 projects')}</option>
                  <option value={6}>{tx('6 projecten', '6 projects')}</option>
                </select>
              </div>
            </div>
          </SectionCard>

          {/* 6. Why Atlas + Certifications + Photo Band */}
          <SectionCard
            title={tx(
              '6. Waarom Atlas, Certificering & Fotoband',
              '6. Why Atlas, Certifications & Photo Band'
            )}
            subtitle={tx(
              "4 USP's, foto's en certificaatkaarten (verberg lege certificaten met 1 klik)",
              '4 USPs, photos and certificate cards (hide unused certificates with 1 click)'
            )}
            visible={draft.home.whyAtlasSection.visible}
            onToggleVisible={(v) =>
              markDirty((p) => ({
                ...p,
                home: {
                  ...p.home,
                  whyAtlasSection: { ...p.home.whyAtlasSection, visible: v },
                },
              }))
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageField
                label={tx('Waarom Atlas zijfoto', 'Why Atlas Side Photo')}
                value={draft.home.whyAtlasSection.image}
                onChange={(img) =>
                  markDirty((p) => ({
                    ...p,
                    home: {
                      ...p.home,
                      whyAtlasSection: {
                        ...p.home.whyAtlasSection,
                        image: img,
                      },
                    },
                  }))
                }
              />
              <ImageField
                label={tx(
                  'Paginabrede Sfeerfoto Band',
                  'Full-width Atmosphere Photo Band'
                )}
                value={draft.home.photoBand.image}
                onChange={(img) =>
                  markDirty((p) => ({
                    ...p,
                    home: {
                      ...p.home,
                      photoBand: { ...p.home.photoBand, image: img },
                    },
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {tx(
                  'Citaat op de paginabrede fotoband',
                  'Quote on full-width photo band'
                )}
              </label>
              <input
                type="text"
                value={draft.home.photoBand.overlayQuote}
                onChange={(e) =>
                  markDirty((p) => ({
                    ...p,
                    home: {
                      ...p.home,
                      photoBand: {
                        ...p.home.photoBand,
                        overlayQuote: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
              />
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-atlas-orange">
                {tx(
                  'Kwaliteit & Certificaten (Vink uit om een certificaat te verbergen)',
                  'Quality & Certificates (Uncheck to hide a certificate)'
                )}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {draft.home.qualitySection.certificates.map((cert, idx) => (
                  <div
                    key={cert.id}
                    className="bg-atlas-grey/60 rounded-xl p-3.5 border border-neutral-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={cert.code}
                        onChange={(e) =>
                          markDirty((p) => {
                            const next = [...p.home.qualitySection.certificates];
                            next[idx] = { ...next[idx], code: e.target.value };
                            return {
                              ...p,
                              home: {
                                ...p.home,
                                qualitySection: {
                                  ...p.home.qualitySection,
                                  certificates: next,
                                },
                              },
                            };
                          })
                        }
                        className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-extrabold text-atlas-black"
                      />
                      <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cert.visible}
                          onChange={(e) =>
                            markDirty((p) => {
                              const next = [
                                ...p.home.qualitySection.certificates,
                              ];
                              next[idx] = {
                                ...next[idx],
                                visible: e.target.checked,
                              };
                              return {
                                ...p,
                                home: {
                                  ...p.home,
                                  qualitySection: {
                                    ...p.home.qualitySection,
                                    certificates: next,
                                  },
                                },
                              };
                            })
                          }
                          className="rounded text-atlas-orange"
                        />
                        <span>{t.common.show}</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.home.qualitySection.certificates];
                          next[idx] = { ...next[idx], title: e.target.value };
                          return {
                            ...p,
                            home: {
                              ...p.home,
                              qualitySection: {
                                ...p.home.qualitySection,
                                certificates: next,
                              },
                            },
                          };
                        })
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs text-atlas-orange font-semibold"
                    />
                    <textarea
                      rows={2}
                      value={cert.description}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.home.qualitySection.certificates];
                          next[idx] = {
                            ...next[idx],
                            description: e.target.value,
                          };
                          return {
                            ...p,
                            home: {
                              ...p.home,
                              qualitySection: {
                                ...p.home.qualitySection,
                                certificates: next,
                              },
                            },
                          };
                        })
                      }
                      className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* 7. Clients Marquee & Testimonials */}
          <SectionCard
            title={tx(
              '7. Opdrachtgevers Logo Marquee & Referenties',
              '7. Client Logo Marquee & Testimonials'
            )}
            subtitle={tx(
              'Beheer de partners in de lopende band en klantervaringen',
              'Manage partner logos in the scrolling marquee and client testimonials'
            )}
            visible={draft.home.clientsSection.visible}
            onToggleVisible={(v) =>
              markDirty((p) => ({
                ...p,
                home: {
                  ...p.home,
                  clientsSection: { ...p.home.clientsSection, visible: v },
                },
              }))
            }
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-atlas-black">
                  {tx(
                    'Opdrachtgevers / Partners in Marquee',
                    'Clients / Partners in Marquee'
                  )}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        clientsSection: {
                          ...p.home.clientsSection,
                          logos: [
                            ...p.home.clientsSection.logos,
                            {
                              id: `cl-${Date.now()}`,
                              name: tx('Nieuwe Opdrachtgever', 'New Client'),
                            },
                          ],
                        },
                      },
                    }))
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold text-atlas-orange hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tx('Partner toevoegen', 'Add partner')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {draft.home.clientsSection.logos.map((logo, idx) => (
                  <div key={logo.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={logo.name}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.home.clientsSection.logos];
                          next[idx] = { ...next[idx], name: e.target.value };
                          return {
                            ...p,
                            home: {
                              ...p.home,
                              clientsSection: {
                                ...p.home.clientsSection,
                                logos: next,
                              },
                            },
                          };
                        })
                      }
                      className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        markDirty((p) => ({
                          ...p,
                          home: {
                            ...p.home,
                            clientsSection: {
                              ...p.home.clientsSection,
                              logos: p.home.clientsSection.logos.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          },
                        }))
                      }
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-atlas-black">
                  {tx('Referenties / Testimonials', 'Client Testimonials')}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        testimonialsSection: {
                          ...p.home.testimonialsSection,
                          items: [
                            ...p.home.testimonialsSection.items,
                            {
                              id: `test-${Date.now()}`,
                              quote: tx('Nieuwe referentie...', 'New testimonial...'),
                              name: tx('Naam', 'Name'),
                              role: tx('Functie', 'Role'),
                              organisation: tx('Organisatie', 'Organisation'),
                            },
                          ],
                        },
                      },
                    }))
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold text-atlas-orange hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tx('Referentie toevoegen', 'Add testimonial')}</span>
                </button>
              </div>

              {draft.home.testimonialsSection.items.map((testItem, idx) => (
                <div
                  key={testItem.id}
                  className="bg-atlas-grey/60 rounded-xl p-4 border border-neutral-200 space-y-2"
                >
                  <textarea
                    rows={2}
                    value={testItem.quote}
                    onChange={(e) =>
                      markDirty((p) => {
                        const next = [...p.home.testimonialsSection.items];
                        next[idx] = { ...next[idx], quote: e.target.value };
                        return {
                          ...p,
                          home: {
                            ...p.home,
                            testimonialsSection: {
                              ...p.home.testimonialsSection,
                              items: next,
                            },
                          },
                        };
                      })
                    }
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={testItem.name}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.home.testimonialsSection.items];
                          next[idx] = { ...next[idx], name: e.target.value };
                          return {
                            ...p,
                            home: {
                              ...p.home,
                              testimonialsSection: {
                                ...p.home.testimonialsSection,
                                items: next,
                              },
                            },
                          };
                        })
                      }
                      placeholder={tx('Naam', 'Name')}
                      className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={testItem.role}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.home.testimonialsSection.items];
                          next[idx] = { ...next[idx], role: e.target.value };
                          return {
                            ...p,
                            home: {
                              ...p.home,
                              testimonialsSection: {
                                ...p.home.testimonialsSection,
                                items: next,
                              },
                            },
                          };
                        })
                      }
                      placeholder={tx('Functie', 'Role')}
                      className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testItem.organisation}
                        onChange={(e) =>
                          markDirty((p) => {
                            const next = [...p.home.testimonialsSection.items];
                            next[idx] = {
                              ...next[idx],
                              organisation: e.target.value,
                            };
                            return {
                              ...p,
                              home: {
                                ...p.home,
                                testimonialsSection: {
                                  ...p.home.testimonialsSection,
                                  items: next,
                                },
                              },
                            };
                          })
                        }
                        placeholder={tx('Organisatie', 'Organisation')}
                        className="flex-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          markDirty((p) => ({
                            ...p,
                            home: {
                              ...p.home,
                              testimonialsSection: {
                                ...p.home.testimonialsSection,
                                items: p.home.testimonialsSection.items.filter(
                                  (_, i) => i !== idx
                                ),
                              },
                            },
                          }))
                        }
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 8. Careers Teaser & Final Contact */}
          <SectionCard
            title={tx(
              '8. Werken bij Teaser & Afsluitend Contactblok',
              '8. Careers Teaser & Final Contact Block'
            )}
            subtitle={tx(
              'Werving sectie en onderste contactkaart',
              'Recruitment teaser section and bottom contact card'
            )}
            visible={draft.home.recruitmentTeaser.visible}
            onToggleVisible={(v) =>
              markDirty((p) => ({
                ...p,
                home: {
                  ...p.home,
                  recruitmentTeaser: {
                    ...p.home.recruitmentTeaser,
                    visible: v,
                  },
                },
              }))
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Titel regel 1', 'Title Line 1')}
                </label>
                <input
                  type="text"
                  value={draft.home.recruitmentTeaser.titleLine1}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        recruitmentTeaser: {
                          ...p.home.recruitmentTeaser,
                          titleLine1: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Titel regel 2 (Oranje)', 'Title Line 2 (Orange)')}
                </label>
                <input
                  type="text"
                  value={draft.home.recruitmentTeaser.titleLine2}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      home: {
                        ...p.home,
                        recruitmentTeaser: {
                          ...p.home.recruitmentTeaser,
                          titleLine2: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-orange"
                />
              </div>
            </div>

            <textarea
              rows={2}
              value={draft.home.recruitmentTeaser.description}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  home: {
                    ...p.home,
                    recruitmentTeaser: {
                      ...p.home.recruitmentTeaser,
                      description: e.target.value,
                    },
                  },
                }))
              }
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />

            <ImageField
              label={tx('Werken bij Teaser Foto', 'Careers Teaser Photo')}
              value={draft.home.recruitmentTeaser.image}
              onChange={(img) =>
                markDirty((p) => ({
                  ...p,
                  home: {
                    ...p.home,
                    recruitmentTeaser: {
                      ...p.home.recruitmentTeaser,
                      image: img,
                    },
                  },
                }))
              }
            />
          </SectionCard>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: ABOUT US & TEAM EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'about' && (
        <div className="space-y-4">
          <SectionCard
            title={tx('1. Over ons Hero & Verhaal', '1. About Us Hero & Story')}
            subtitle={tx(
              "Hero afbeelding, ons verhaal en 'Alles onder één dak'",
              'Hero image, company story and turnkey pillars'
            )}
            defaultOpen
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Hero Titel deel 1', 'Hero Title Part 1')}
                </label>
                <input
                  type="text"
                  value={draft.about.hero.titleLine1}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      about: {
                        ...p.about,
                        hero: { ...p.about.hero, titleLine1: e.target.value },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1">
                  {tx('Hero Titel deel 2 (Oranje)', 'Hero Title Part 2 (Orange)')}
                </label>
                <input
                  type="text"
                  value={draft.about.hero.titleLine2}
                  onChange={(e) =>
                    markDirty((p) => ({
                      ...p,
                      about: {
                        ...p.about,
                        hero: { ...p.about.hero, titleLine2: e.target.value },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-orange"
                />
              </div>
            </div>

            <textarea
              rows={2}
              value={draft.about.hero.subtitle}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  about: {
                    ...p.about,
                    hero: { ...p.about.hero, subtitle: e.target.value },
                  },
                }))
              }
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />

            <ImageField
              label={tx('Over ons Hero Foto', 'About Us Hero Photo')}
              value={draft.about.hero.image}
              onChange={(img) =>
                markDirty((p) => ({
                  ...p,
                  about: { ...p.about, hero: { ...p.about.hero, image: img } },
                }))
              }
            />

            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <label className="block text-xs font-bold text-atlas-black">
                {tx(
                  "Ons Verhaal Koptekst & Alinea's",
                  'Our Story Heading & Paragraphs'
                )}
              </label>
              <input
                type="text"
                value={draft.about.story.heading}
                onChange={(e) =>
                  markDirty((p) => ({
                    ...p,
                    about: {
                      ...p.about,
                      story: { ...p.about.story, heading: e.target.value },
                    },
                  }))
                }
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
              />
              {draft.about.story.paragraphs.map((par, idx) => (
                <textarea
                  key={idx}
                  rows={3}
                  value={par}
                  onChange={(e) =>
                    markDirty((p) => {
                      const next = [...p.about.story.paragraphs];
                      next[idx] = e.target.value;
                      return {
                        ...p,
                        about: {
                          ...p.about,
                          story: { ...p.about.story, paragraphs: next },
                        },
                      };
                    })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title={tx(
              '2. Teamleden Beheer (Kantoorteam & Regie)',
              '2. Team Members Management (Office & Dispatch Team)'
            )}
            subtitle={tx(
              "Voeg teamleden toe, upload portretfoto's of verberg kaarten",
              'Add team members, upload portraits or hide cards'
            )}
            defaultOpen
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  markDirty((p) => ({
                    ...p,
                    about: {
                      ...p.about,
                      teamSection: {
                        ...p.about.teamSection,
                        members: [
                          ...p.about.teamSection.members,
                          {
                            id: `team-${Date.now()}`,
                            name: tx('Nieuw Teamlid', 'New Team Member'),
                            role: tx('Functietitel', 'Job Title'),
                            email: 'info@atlasholland.nl',
                            linkedinUrl: 'https://linkedin.com',
                            image: {
                              url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
                              alt: 'Team Atlas Holland',
                            },
                            visible: true,
                            displayOrder:
                              p.about.teamSection.members.length + 1,
                          },
                        ],
                      },
                    },
                  }))
                }
                className="inline-flex items-center gap-1.5 bg-atlas-orange hover:bg-atlas-orange-dark text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{tx('Teamlid toevoegen', 'Add team member')}</span>
              </button>
            </div>

            <div className="space-y-4">
              {draft.about.teamSection.members.map((member, idx) => (
                <div
                  key={member.id}
                  className="bg-atlas-grey/50 rounded-2xl p-4 border border-neutral-200 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-atlas-black">
                      {idx + 1}. {member.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={member.visible}
                          onChange={(e) =>
                            markDirty((p) => {
                              const next = [...p.about.teamSection.members];
                              next[idx] = {
                                ...next[idx],
                                visible: e.target.checked,
                              };
                              return {
                                ...p,
                                about: {
                                  ...p.about,
                                  teamSection: {
                                    ...p.about.teamSection,
                                    members: next,
                                  },
                                },
                              };
                            })
                          }
                          className="rounded text-atlas-orange"
                        />
                        <span>{tx('Zichtbaar op pagina', 'Visible on page')}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          markDirty((p) => ({
                            ...p,
                            about: {
                              ...p.about,
                              teamSection: {
                                ...p.about.teamSection,
                                members: p.about.teamSection.members.filter(
                                  (_, i) => i !== idx
                                ),
                              },
                            },
                          }))
                        }
                        className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.about.teamSection.members];
                          next[idx] = { ...next[idx], name: e.target.value };
                          return {
                            ...p,
                            about: {
                              ...p.about,
                              teamSection: {
                                ...p.about.teamSection,
                                members: next,
                              },
                            },
                          };
                        })
                      }
                      placeholder={tx('Naam', 'Name')}
                      className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-bold"
                    />
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.about.teamSection.members];
                          next[idx] = { ...next[idx], role: e.target.value };
                          return {
                            ...p,
                            about: {
                              ...p.about,
                              teamSection: {
                                ...p.about.teamSection,
                                members: next,
                              },
                            },
                          };
                        })
                      }
                      placeholder={tx('Rol / Functie', 'Role / Job Title')}
                      className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-atlas-orange font-semibold"
                    />
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.about.teamSection.members];
                          next[idx] = { ...next[idx], email: e.target.value };
                          return {
                            ...p,
                            about: {
                              ...p.about,
                              teamSection: {
                                ...p.about.teamSection,
                                members: next,
                              },
                            },
                          };
                        })
                      }
                      placeholder={tx('E-mailadres', 'Email address')}
                      className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>

                  <ImageField
                    label={`${tx('Foto van', 'Photo of')} ${member.name}`}
                    value={member.image}
                    onChange={(img) =>
                      markDirty((p) => {
                        const next = [...p.about.teamSection.members];
                        next[idx] = { ...next[idx], image: img };
                        return {
                          ...p,
                          about: {
                            ...p.about,
                            teamSection: {
                              ...p.about.teamSection,
                              members: next,
                            },
                          },
                        };
                      })
                    }
                    aspectHint={tx(
                      'Aanbevolen: 4:3 portret',
                      'Recommended: 4:3 portrait'
                    )}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: TRAINING & ACADEMY EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <SectionCard
            title={tx(
              '1. Opleidingen Hero & Introductie',
              '1. Training Hero & Introduction'
            )}
            defaultOpen
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={draft.courses.hero.titleLine1}
                onChange={(e) =>
                  markDirty((p) => ({
                    ...p,
                    courses: {
                      ...p.courses,
                      hero: { ...p.courses.hero, titleLine1: e.target.value },
                    },
                  }))
                }
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
              />
              <input
                type="text"
                value={draft.courses.hero.titleLine2}
                onChange={(e) =>
                  markDirty((p) => ({
                    ...p,
                    courses: {
                      ...p.courses,
                      hero: { ...p.courses.hero, titleLine2: e.target.value },
                    },
                  }))
                }
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-orange"
              />
            </div>
            <textarea
              rows={2}
              value={draft.courses.introText}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  courses: { ...p.courses, introText: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
            <ImageField
              label={tx('Opleidingen Hero Foto', 'Training Hero Photo')}
              value={draft.courses.hero.image}
              onChange={(img) =>
                markDirty((p) => ({
                  ...p,
                  courses: {
                    ...p.courses,
                    hero: { ...p.courses.hero, image: img },
                  },
                }))
              }
            />
          </SectionCard>

          <SectionCard
            title={tx(
              '2. Opleidingskaarten (Cursusaanbod)',
              '2. Course Cards (Training Catalogue)'
            )}
            subtitle={tx(
              "Voeg opleidingen toe, wijzig duur, foto's en kernpunten",
              'Add training courses, edit duration, photos and highlights'
            )}
            defaultOpen
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  markDirty((p) => ({
                    ...p,
                    courses: {
                      ...p.courses,
                      courses: [
                        ...p.courses.courses,
                        {
                          id: `course-${Date.now()}`,
                          title: tx('Nieuwe Opleiding', 'New Training Course'),
                          duration: tx('1 dag', '1 day'),
                          audience: tx(
                            'Voor verkeers- en inframedewerkers',
                            'For traffic and infrastructure staff'
                          ),
                          description: tx(
                            'Omschrijving van de opleiding...',
                            'Description of the training course...'
                          ),
                          highlights: [
                            tx('Erkend certificaat', 'Accredited certificate'),
                            tx('Praktijkgericht', 'Hands-on training'),
                          ],
                          image: {
                            url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
                            alt: 'Training Atlas Holland',
                          },
                          active: true,
                          displayOrder: p.courses.courses.length + 1,
                        },
                      ],
                    },
                  }))
                }
                className="inline-flex items-center gap-1.5 bg-atlas-orange hover:bg-atlas-orange-dark text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{tx('Opleiding toevoegen', 'Add course')}</span>
              </button>
            </div>

            <div className="space-y-4">
              {draft.courses.courses.map((course, idx) => (
                <div
                  key={course.id}
                  className="bg-atlas-grey/50 rounded-2xl p-4 border border-neutral-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-atlas-black">
                      {idx + 1}. {course.title}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={course.active}
                          onChange={(e) =>
                            markDirty((p) => {
                              const next = [...p.courses.courses];
                              next[idx] = {
                                ...next[idx],
                                active: e.target.checked,
                              };
                              return {
                                ...p,
                                courses: { ...p.courses, courses: next },
                              };
                            })
                          }
                          className="rounded text-atlas-orange"
                        />
                        <span>{t.common.active}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          markDirty((p) => ({
                            ...p,
                            courses: {
                              ...p.courses,
                              courses: p.courses.courses.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          }))
                        }
                        className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={course.title}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.courses.courses];
                          next[idx] = { ...next[idx], title: e.target.value };
                          return {
                            ...p,
                            courses: { ...p.courses, courses: next },
                          };
                        })
                      }
                      placeholder={tx('Titel opleiding', 'Course title')}
                      className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-bold"
                    />
                    <input
                      type="text"
                      value={course.duration}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.courses.courses];
                          next[idx] = {
                            ...next[idx],
                            duration: e.target.value,
                          };
                          return {
                            ...p,
                            courses: { ...p.courses, courses: next },
                          };
                        })
                      }
                      placeholder={tx(
                        'Duur (bijv. 1 tot 3 dagen)',
                        'Duration (e.g. 1 to 3 days)'
                      )}
                      className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={course.audience}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.courses.courses];
                          next[idx] = {
                            ...next[idx],
                            audience: e.target.value,
                          };
                          return {
                            ...p,
                            courses: { ...p.courses, courses: next },
                          };
                        })
                      }
                      placeholder={tx('Doelgroep', 'Target audience')}
                      className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={course.description}
                    onChange={(e) =>
                      markDirty((p) => {
                        const next = [...p.courses.courses];
                        next[idx] = {
                          ...next[idx],
                          description: e.target.value,
                        };
                        return {
                          ...p,
                          courses: { ...p.courses, courses: next },
                        };
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm"
                  />

                  <ImageField
                    label={`${tx('Foto:', 'Photo:')} ${course.title}`}
                    value={course.image}
                    onChange={(img) =>
                      markDirty((p) => {
                        const next = [...p.courses.courses];
                        next[idx] = { ...next[idx], image: img };
                        return {
                          ...p,
                          courses: { ...p.courses, courses: next },
                        };
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: CAREERS EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'careers' && (
        <div className="space-y-4">
          <SectionCard
            title={tx(
              '1. Werken bij Hero & Sollicitatieformulier Teksten',
              '1. Careers Hero & Application Form Copy'
            )}
            subtitle={tx(
              "Voor individuele vacatures gaat u naar het menu-item 'Vacatures'",
              "To manage individual job openings, go to 'Vacancies' in the left sidebar"
            )}
            defaultOpen
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={draft.careers.hero.titleLine1}
                onChange={(e) =>
                  markDirty((p) => ({
                    ...p,
                    careers: {
                      ...p.careers,
                      hero: { ...p.careers.hero, titleLine1: e.target.value },
                    },
                  }))
                }
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
              />
              <input
                type="text"
                value={draft.careers.hero.titleLine2}
                onChange={(e) =>
                  markDirty((p) => ({
                    ...p,
                    careers: {
                      ...p.careers,
                      hero: { ...p.careers.hero, titleLine2: e.target.value },
                    },
                  }))
                }
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-orange"
              />
            </div>

            <textarea
              rows={2}
              value={draft.careers.hero.subtitle}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  careers: {
                    ...p.careers,
                    hero: { ...p.careers.hero, subtitle: e.target.value },
                  },
                }))
              }
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />

            <ImageField
              label={tx('Werken bij Hero Foto', 'Careers Hero Photo')}
              value={draft.careers.hero.image}
              onChange={(img) =>
                markDirty((p) => ({
                  ...p,
                  careers: {
                    ...p.careers,
                    hero: { ...p.careers.hero, image: img },
                  },
                }))
              }
            />
          </SectionCard>

          <SectionCard
            title={tx(
              '2. Veelgestelde Vragen (FAQ op Werken bij)',
              '2. Frequently Asked Questions (Careers FAQ)'
            )}
            defaultOpen
          >
            <div className="space-y-3">
              {draft.careers.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-atlas-grey/50 rounded-xl p-3.5 border border-neutral-200 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) =>
                        markDirty((p) => {
                          const next = [...p.careers.faqs];
                          next[idx] = {
                            ...next[idx],
                            question: e.target.value,
                          };
                          return {
                            ...p,
                            careers: { ...p.careers, faqs: next },
                          };
                        })
                      }
                      className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-bold"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        markDirty((p) => ({
                          ...p,
                          careers: {
                            ...p.careers,
                            faqs: p.careers.faqs.filter((_, i) => i !== idx),
                          },
                        }))
                      }
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) =>
                      markDirty((p) => {
                        const next = [...p.careers.faqs];
                        next[idx] = { ...next[idx], answer: e.target.value };
                        return {
                          ...p,
                          careers: { ...p.careers, faqs: next },
                        };
                      })
                    }
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  markDirty((p) => ({
                    ...p,
                    careers: {
                      ...p.careers,
                      faqs: [
                        ...p.careers.faqs,
                        {
                          question: tx('Nieuwe vraag?', 'New question?'),
                          answer: tx('Antwoord...', 'Answer...'),
                        },
                      ],
                    },
                  }))
                }
                className="inline-flex items-center gap-1 text-xs font-bold text-atlas-orange hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{tx('Vraag toevoegen', 'Add question')}</span>
              </button>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: REQUEST QUOTE EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'quote' && (
        <SectionCard
          title={tx(
            'Offerte aanvragen Pagina & Zijpaneel',
            'Request a Quote Page & Sidebar'
          )}
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={draft.quote.hero.titleLine1}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  quote: {
                    ...p.quote,
                    hero: { ...p.quote.hero, titleLine1: e.target.value },
                  },
                }))
              }
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
            />
            <input
              type="text"
              value={draft.quote.hero.titleLine2}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  quote: {
                    ...p.quote,
                    hero: { ...p.quote.hero, titleLine2: e.target.value },
                  },
                }))
              }
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-orange"
            />
          </div>

          <textarea
            rows={2}
            value={draft.quote.hero.subtitle}
            onChange={(e) =>
              markDirty((p) => ({
                ...p,
                quote: {
                  ...p.quote,
                  hero: { ...p.quote.hero, subtitle: e.target.value },
                },
              }))
            }
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />

          <ImageField
            label={tx('Offerte Hero Foto', 'Request a Quote Hero Photo')}
            value={draft.quote.hero.image}
            onChange={(img) =>
              markDirty((p) => ({
                ...p,
                quote: { ...p.quote, hero: { ...p.quote.hero, image: img } },
              }))
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {tx(
                  'Bevestigingstitel na verzenden',
                  'Confirmation title after submission'
                )}
              </label>
              <input
                type="text"
                value={draft.quote.successTitle}
                onChange={(e) =>
                  markDirty((p) => ({
                    ...p,
                    quote: { ...p.quote, successTitle: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-atlas-black mb-1">
                {tx('Zijpaneel Spoed Titel', 'Sidebar Emergency Title')}
              </label>
              <input
                type="text"
                value={draft.quote.sidebarTitle}
                onChange={(e) =>
                  markDirty((p) => ({
                    ...p,
                    quote: { ...p.quote, sidebarTitle: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
              />
            </div>
          </div>
        </SectionCard>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: CONTACT EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'contact' && (
        <SectionCard
          title={tx('Contactpagina Teksten & Hero', 'Contact Page Copy & Hero')}
          subtitle={tx(
            "Telefoonnummer, e-mail en adres wijzigt u centraal bij 'Bedrijfsgegevens & Instellingen'",
            "Phone number, email and address are managed centrally under 'Company & Settings'"
          )}
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={draft.contact.hero.titleLine1}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  contact: {
                    ...p.contact,
                    hero: { ...p.contact.hero, titleLine1: e.target.value },
                  },
                }))
              }
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
            />
            <input
              type="text"
              value={draft.contact.hero.titleLine2}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  contact: {
                    ...p.contact,
                    hero: { ...p.contact.hero, titleLine2: e.target.value },
                  },
                }))
              }
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-orange"
            />
          </div>

          <textarea
            rows={2}
            value={draft.contact.hero.subtitle}
            onChange={(e) =>
              markDirty((p) => ({
                ...p,
                contact: {
                  ...p.contact,
                  hero: { ...p.contact.hero, subtitle: e.target.value },
                },
              }))
            }
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />

          <ImageField
            label={tx('Contactpagina Hero Foto', 'Contact Page Hero Photo')}
            value={draft.contact.hero.image}
            onChange={(img) =>
              markDirty((p) => ({
                ...p,
                contact: {
                  ...p.contact,
                  hero: { ...p.contact.hero, image: img },
                },
              }))
            }
          />
        </SectionCard>
      )}

      {/* ===================================================================== */}
      {/* TAB 7: PROJECTS OVERVIEW EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'projectsOverview' && (
        <SectionCard
          title={tx(
            'Projecten Overzichtspagina (/projecten)',
            'Projects Overview Page (/en/projects)'
          )}
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={draft.projectsOverview.hero.titleLine1}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  projectsOverview: {
                    ...p.projectsOverview,
                    hero: {
                      ...p.projectsOverview.hero,
                      titleLine1: e.target.value,
                    },
                  },
                }))
              }
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
            />
            <input
              type="text"
              value={draft.projectsOverview.hero.titleLine2}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  projectsOverview: {
                    ...p.projectsOverview,
                    hero: {
                      ...p.projectsOverview.hero,
                      titleLine2: e.target.value,
                    },
                  },
                }))
              }
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-orange"
            />
          </div>

          <textarea
            rows={2}
            value={draft.projectsOverview.hero.subtitle}
            onChange={(e) =>
              markDirty((p) => ({
                ...p,
                projectsOverview: {
                  ...p.projectsOverview,
                  hero: {
                    ...p.projectsOverview.hero,
                    subtitle: e.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />

          <ImageField
            label={tx(
              'Projecten Overzicht Hero Foto',
              'Projects Overview Hero Photo'
            )}
            value={draft.projectsOverview.hero.image}
            onChange={(img) =>
              markDirty((p) => ({
                ...p,
                projectsOverview: {
                  ...p.projectsOverview,
                  hero: { ...p.projectsOverview.hero, image: img },
                },
              }))
            }
          />
        </SectionCard>
      )}

      {/* ===================================================================== */}
      {/* TAB 8: SERVICES OVERVIEW EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'servicesOverview' && (
        <SectionCard
          title={tx(
            'Diensten Overzichtspagina (/diensten)',
            'Services Overview Page (/en/services)'
          )}
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={draft.servicesOverview.hero.titleLine1}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  servicesOverview: {
                    ...p.servicesOverview,
                    hero: {
                      ...p.servicesOverview.hero,
                      titleLine1: e.target.value,
                    },
                  },
                }))
              }
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold"
            />
            <input
              type="text"
              value={draft.servicesOverview.hero.titleLine2}
              onChange={(e) =>
                markDirty((p) => ({
                  ...p,
                  servicesOverview: {
                    ...p.servicesOverview,
                    hero: {
                      ...p.servicesOverview.hero,
                      titleLine2: e.target.value,
                    },
                  },
                }))
              }
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-bold text-atlas-orange"
            />
          </div>

          <textarea
            rows={2}
            value={draft.servicesOverview.hero.subtitle}
            onChange={(e) =>
              markDirty((p) => ({
                ...p,
                servicesOverview: {
                  ...p.servicesOverview,
                  hero: {
                    ...p.servicesOverview.hero,
                    subtitle: e.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />

          <ImageField
            label={tx(
              'Diensten Overzicht Hero Foto',
              'Services Overview Hero Photo'
            )}
            value={draft.servicesOverview.hero.image}
            onChange={(img) =>
              markDirty((p) => ({
                ...p,
                servicesOverview: {
                  ...p.servicesOverview,
                  hero: { ...p.servicesOverview.hero, image: img },
                },
              }))
            }
          />
        </SectionCard>
      )}

      {/* ===================================================================== */}
      {/* TAB 9: PRIVACY & TERMS EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'legal' && (
        <div className="space-y-4">
          <SectionCard
            title={tx(
              '1. Privacyverklaring (/privacy)',
              '1. Privacy Policy (/en/privacy)'
            )}
            defaultOpen
          >
            {draft.privacy.sections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-atlas-grey/50 rounded-xl p-4 border border-neutral-200 space-y-2"
              >
                <input
                  type="text"
                  value={sec.heading}
                  onChange={(e) =>
                    markDirty((p) => {
                      const next = [...p.privacy.sections];
                      next[idx] = { ...next[idx], heading: e.target.value };
                      return {
                        ...p,
                        privacy: { ...p.privacy, sections: next },
                      };
                    })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-bold"
                />
                <textarea
                  rows={3}
                  value={sec.body}
                  onChange={(e) =>
                    markDirty((p) => {
                      const next = [...p.privacy.sections];
                      next[idx] = { ...next[idx], body: e.target.value };
                      return {
                        ...p,
                        privacy: { ...p.privacy, sections: next },
                      };
                    })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs"
                />
              </div>
            ))}
          </SectionCard>

          <SectionCard
            title={tx(
              '2. Algemene Voorwaarden (/algemene-voorwaarden)',
              '2. Terms & Conditions (/en/terms)'
            )}
            defaultOpen
          >
            {draft.terms.sections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-atlas-grey/50 rounded-xl p-4 border border-neutral-200 space-y-2"
              >
                <input
                  type="text"
                  value={sec.heading}
                  onChange={(e) =>
                    markDirty((p) => {
                      const next = [...p.terms.sections];
                      next[idx] = { ...next[idx], heading: e.target.value };
                      return {
                        ...p,
                        terms: { ...p.terms, sections: next },
                      };
                    })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-bold"
                />
                <textarea
                  rows={3}
                  value={sec.body}
                  onChange={(e) =>
                    markDirty((p) => {
                      const next = [...p.terms.sections];
                      next[idx] = { ...next[idx], body: e.target.value };
                      return {
                        ...p,
                        terms: { ...p.terms, sections: next },
                      };
                    })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs"
                />
              </div>
            ))}
          </SectionCard>
        </div>
      )}
    </div>
  );
}

export default function AdminPaginasPage() {
  const { editLocale } = useCms();
  const { t } = useAdminT();
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-sm">{t.shell.loading}</div>}>
        <AdminPaginasInner key={editLocale} />
      </Suspense>
    </AdminShell>
  );
}
