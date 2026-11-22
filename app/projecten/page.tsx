'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { getLocalizedPath } from '@/i18n/routes';
import { PUBLIC_UI } from '@/i18n/dictionary';
import {
  PageHero,
  ProjectCard,
  CtaBand,
  FadeIn,
} from '@/components/SharedSections';

export default function ProjectenOverviewPage() {
  const { pages, projects, locale } = useCms();
  const ui = PUBLIC_UI[locale];
  const overview = pages.projectsOverview;

  const allLabel = overview.categories?.[0] || ui.projects.allCategories;
  const [selectedCategory, setSelectedCategory] = useState<string>(allLabel);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const publishedProjects = [...projects]
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const categories = overview.categories?.length
    ? overview.categories
    : [
        allLabel,
        'Infra & wegenbouw',
        'Bouw',
        'Evenementen',
        'Calamiteiten',
        'Verkeersplannen',
      ];

  const activeCategory = categories.includes(selectedCategory)
    ? selectedCategory
    : categories[0];

  const filteredProjects = publishedProjects.filter((project) => {
    const matchesCat =
      activeCategory === categories[0] ||
      activeCategory === 'Alle' ||
      activeCategory === 'All' ||
      project.category === activeCategory;
    if (!matchesCat) return false;

    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    return (
      project.title.toLowerCase().includes(q) ||
      project.location.toLowerCase().includes(q) ||
      project.clientName.toLowerCase().includes(q) ||
      project.summary.toLowerCase().includes(q) ||
      project.category.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <PageHero
        eyebrow={overview.hero.eyebrow}
        titleLine1={overview.hero.titleLine1}
        titleLine2={overview.hero.titleLine2}
        subtitle={overview.hero.subtitle}
        imageUrl={overview.hero.image.url}
        imageAlt={overview.hero.image.alt}
        primaryCta={{
          label: ui.nav.requestQuote,
          href: getLocalizedPath('requestQuote', locale),
        }}
        showPhoneCta
      />

      {/* Filter & Search Bar + Projects Grid */}
      <section className="bg-atlas-grey py-14 md:py-24 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-neutral-200/85 shadow-sm mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div
              role="tablist"
              aria-label={
                locale === 'en'
                  ? 'Filter projects by category'
                  : 'Filter projecten op categorie'
              }
              className="flex flex-wrap items-center gap-2"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-atlas-orange text-white shadow-sm'
                        : 'bg-atlas-grey hover:bg-neutral-200/80 text-atlas-ink'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search
                className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={2}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={ui.projects.searchPlaceholder}
                aria-label={ui.projects.searchPlaceholder}
                className="w-full rounded-full border border-neutral-300 bg-atlas-grey/60 focus:bg-white pl-10 pr-9 py-2.5 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none focus:ring-2 focus:ring-atlas-orange/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={locale === 'en' ? 'Clear search' : 'Zoekopdracht wissen'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-atlas-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-[22px] p-12 text-center border border-neutral-200 max-w-xl mx-auto space-y-4">
              <p className="text-lg font-extrabold text-atlas-black">
                {ui.projects.noProjectsFound}
              </p>
              <p className="text-sm text-atlas-ink/80">
                {locale === 'en'
                  ? 'Adjust your search query or display all project categories.'
                  : 'Pas uw zoekterm aan of toon alle projectcategorieën.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(categories[0]);
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm px-6 py-3 rounded-full transition-colors cursor-pointer"
              >
                {ui.projects.resetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, idx) => (
                <FadeIn key={project.id} delay={idx * 0.06}>
                  <ProjectCard project={project} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        headline={overview.ctaHeadline}
        buttonLabel={overview.ctaButtonLabel}
        buttonHref={getLocalizedPath('requestQuote', locale)}
      />
    </div>
  );
}
