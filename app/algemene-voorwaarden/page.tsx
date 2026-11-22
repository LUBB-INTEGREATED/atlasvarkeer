'use client';

import React from 'react';
import { useCms } from '@/cms/CmsContext';
import { PageHero } from '@/components/SharedSections';

export default function AlgemeneVoorwaardenPage() {
  const { pages, settings, locale } = useCms();
  const doc = pages.terms;

  const fullAddress = [settings.addressStreet, settings.addressPostalCity]
    .filter(Boolean)
    .join(', ');

  return (
    <div>
      <PageHero
        eyebrow={doc.eyebrow}
        titleLine1={doc.title}
        subtitle={doc.subtitle}
      />

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-atlas-ink leading-relaxed">
          <div className="bg-atlas-grey rounded-2xl p-6 border border-neutral-200 text-sm">
            <p className="font-bold text-atlas-black">
              {locale === 'en' ? 'Company details:' : 'Bedrijfsgegevens:'}
            </p>
            <p className="mt-1">
              {settings.companyName}
              {fullAddress ? ` · ${fullAddress}` : ''}
              {settings.kvk ? ` · KvK: ${settings.kvk}` : ''}
              {settings.btw ? ` · ${locale === 'en' ? 'VAT' : 'BTW'}: ${settings.btw}` : ''}
            </p>
            {doc.lastUpdated && (
              <p className="text-xs text-neutral-500 mt-2">
                {locale === 'en' ? 'Last updated:' : 'Laatst bijgewerkt:'} {doc.lastUpdated}
              </p>
            )}
          </div>

          {doc.sections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="text-2xl font-extrabold text-atlas-black">
                {sec.heading}
              </h2>
              <p className="whitespace-pre-line">{sec.body}</p>
              {sec.bullets && sec.bullets.length > 0 && (
                <ul className="list-disc pl-6 space-y-1.5">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
