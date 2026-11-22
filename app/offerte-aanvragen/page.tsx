'use client';

import React, { Suspense } from 'react';
import { useCms } from '@/cms/CmsContext';
import { PageHero } from '@/components/SharedSections';
import { OfferteFormClient } from '@/components/OfferteFormClient';

export default function OfferteAanvragenPage() {
  const { pages, locale } = useCms();
  const { hero } = pages.quote;

  return (
    <div>
      <PageHero
        eyebrow={hero.eyebrow}
        titleLine1={hero.titleLine1}
        titleLine2={hero.titleLine2}
        subtitle={hero.subtitle}
        imageUrl={hero.image.url}
        imageAlt={hero.image.alt}
        showPhoneCta
      />

      <Suspense
        fallback={
          <div className="py-20 text-center text-sm text-neutral-500">
            {locale === 'en' ? 'Loading quote form...' : 'Offerteformulier laden...'}
          </div>
        }
      >
        <OfferteFormClient />
      </Suspense>
    </div>
  );
}
