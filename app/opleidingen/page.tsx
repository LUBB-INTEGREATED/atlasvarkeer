'use client';

import React from 'react';
import { useCms } from '@/cms/CmsContext';
import { PageHero, CtaBand } from '@/components/SharedSections';
import { OpleidingenClient } from '@/components/OpleidingenClient';

export default function OpleidingenPage() {
  const { pages } = useCms();
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
          label: 'Direct inschrijven',
          href: '#aanmelden',
        }}
        showPhoneCta
      />

      <OpleidingenClient />

      <CtaBand
        headline={pageData.ctaHeadline}
        buttonLabel={pageData.ctaButtonLabel}
        buttonHref="/contact"
      />
    </div>
  );
}
