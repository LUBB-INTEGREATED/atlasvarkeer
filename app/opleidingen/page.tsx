'use client';

import React from 'react';
import { useCms } from '@/cms/CmsContext';
import { getLocalizedPath } from '@/i18n/routes';
import { PageHero, CtaBand } from '@/components/SharedSections';
import { OpleidingenClient } from '@/components/OpleidingenClient';

export default function OpleidingenPage() {
  const { pages, locale } = useCms();
  const pageData = pages.courses;
  const { hero } = pageData;

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
          label: locale === 'en' ? 'Register now' : 'Direct inschrijven',
          href: '#aanmelden',
        }}
        showPhoneCta
      />

      <OpleidingenClient />

      <CtaBand
        headline={pageData.ctaHeadline}
        buttonLabel={pageData.ctaButtonLabel}
        buttonHref={getLocalizedPath('contact', locale)}
      />
    </div>
  );
}
