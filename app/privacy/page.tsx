'use client';

import React from 'react';
import { useCms, formatMailHref, formatPhoneHref } from '@/cms/CmsContext';
import { PageHero } from '@/components/SharedSections';

export default function PrivacyPage() {
  const { pages, settings, locale } = useCms();
  const doc = pages.privacy;

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
              {locale === 'en' ? 'Data Controller:' : 'Verwerkingsverantwoordelijke:'}
            </p>
            <p className="mt-1">
              {settings.companyName}
              {fullAddress ? ` · ${fullAddress}` : ''}
              {settings.kvk ? ` · KvK: ${settings.kvk}` : ''}
            </p>
            <p className="mt-1">
              {settings.emailGeneral && (
                <>
                  E-mail:{' '}
                  <a
                    href={formatMailHref(settings.emailGeneral)}
                    className="text-atlas-orange underline font-semibold"
                  >
                    {settings.emailGeneral}
                  </a>
                </>
              )}
              {settings.emailGeneral && settings.phoneDisplay && ' · '}
              {settings.phoneDisplay && (
                <>
                  {locale === 'en' ? 'Phone:' : 'Telefoon:'}{' '}
                  <a
                    href={formatPhoneHref(settings.phoneDisplay)}
                    className="text-atlas-orange underline font-semibold"
                  >
                    {settings.phoneDisplay}
                  </a>
                </>
              )}
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
