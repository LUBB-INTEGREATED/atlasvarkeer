'use client';

import React from 'react';
import { useCms } from '@/cms/CmsContext';
import { getLocalizedPath } from '@/i18n/routes';
import { PUBLIC_UI } from '@/i18n/dictionary';
import {
  PageHero,
  ServiceCard,
  CtaBand,
  ProcessSteps,
  FadeIn,
} from '@/components/SharedSections';

export default function DienstenOverviewPage() {
  const { pages, services, locale } = useCms();
  const ui = PUBLIC_UI[locale];
  const { hero, groups } = pages.servicesOverview;

  const publishedServices = [...services]
    .filter((s) => s.status === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div>
      <PageHero
        eyebrow={hero.eyebrow}
        titleLine1={hero.titleLine1}
        titleLine2={hero.titleLine2}
        subtitle={hero.subtitle}
        imageUrl={hero.image.url}
        imageAlt={hero.image.alt}
        primaryCta={{
          label: ui.nav.requestQuote,
          href: getLocalizedPath('requestQuote', locale),
        }}
        showPhoneCta
      />

      {groups.map((group, groupIndex) => {
        const groupServices = publishedServices.filter((s) => s.group === group.key);
        const bgClass = groupIndex % 2 === 0 ? 'bg-white' : 'bg-atlas-grey';

        return (
          <section
            key={group.key}
            id={group.key}
            className={`${bgClass} py-16 md:py-24 border-b border-neutral-200/70`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mb-12">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-2">
                  {locale === 'en' ? 'SERVICE CATEGORY' : 'DIENSTEN CATEGORIE'} 0{groupIndex + 1}
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-atlas-black tracking-tight">
                  {group.title}
                </h2>
                <p className="mt-3 text-base sm:text-lg text-atlas-ink/85">
                  {group.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupServices.map((service, idx) => (
                  <FadeIn key={service.id || service.slug} delay={idx * 0.06}>
                    <ServiceCard service={service} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <CtaBand />

      <ProcessSteps bgClass="bg-white" />
    </div>
  );
}
