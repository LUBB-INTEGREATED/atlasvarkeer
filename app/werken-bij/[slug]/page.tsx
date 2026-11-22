'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Calendar,
  Check,
  ArrowLeft,
  Phone,
  Mail,
} from 'lucide-react';
import { useCms, formatPhoneHref, formatMailHref } from '@/cms/CmsContext';
import { getLocalizedPath } from '@/i18n/routes';
import { PUBLIC_UI } from '@/i18n/dictionary';
import { PageHero } from '@/components/SharedSections';
import { ApplicationForm } from '@/components/ApplicationForm';

export default function VacancyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { vacancies, settings, adminUser, locale } = useCms();
  const ui = PUBLIC_UI[locale];

  const vacancy = vacancies.find(
    (v) =>
      (v.slug === slug || v.slugEn === slug) &&
      (v.status === 'published' || Boolean(adminUser))
  );

  const careersVacanciesHref = `${getLocalizedPath('careers', locale)}#vacatures`;

  if (!vacancy) {
    return (
      <div className="min-h-[60vh] bg-atlas-grey flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-[24px] p-8 sm:p-12 border border-neutral-200 max-w-lg text-center space-y-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
            {locale === 'en' ? 'VACANCY NOT FOUND' : 'VACATURE NIET GEVONDEN'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-atlas-black">
            {locale === 'en'
              ? 'This vacancy is no longer available'
              : 'Deze vacature is niet (meer) beschikbaar'}
          </h1>
          <p className="text-sm sm:text-base text-atlas-ink/80">
            {locale === 'en'
              ? 'View all our open positions on the Careers page.'
              : 'Bekijk al onze openstaande functies op de Werken bij pagina.'}
          </p>
          <div className="pt-2">
            <Link
              href={careersVacanciesHref}
              className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm px-6 py-3.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{ui.careers.backToCareers}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {vacancy.status === 'draft' && (
        <div className="bg-atlas-orange text-white px-4 py-2.5 text-center text-xs sm:text-sm font-bold">
          {locale === 'en'
            ? 'Preview (Draft vacancy — visible to administrators only)'
            : 'Voorvertoning (Conceptvacature — alleen zichtbaar voor beheerders)'}
        </div>
      )}

      <PageHero
        eyebrow={
          locale === 'en' ? 'VACANCY AT ATLAS HOLLAND' : 'VACATURE BIJ ATLAS HOLLAND'
        }
        titleLine1={vacancy.title}
        subtitle={vacancy.summary}
        imageUrl={vacancy.heroImage?.url}
        imageAlt={vacancy.heroImage?.alt || vacancy.title}
        primaryCta={{
          label: `${ui.careers.applyDirect} ↓`,
          href: '#solliciteer-nu',
        }}
      />

      <section className="bg-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href={careersVacanciesHref}
              className="inline-flex items-center gap-2 text-sm font-bold text-atlas-ink hover:text-atlas-orange transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              <span>{ui.careers.backToCareers}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Main Vacancy Content */}
            <div className="lg:col-span-8 space-y-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-atlas-black mb-4">
                  {locale === 'en' ? 'About this role' : 'Over deze functie'}
                </h2>
                <p className="text-base sm:text-lg text-atlas-ink/90 leading-relaxed">
                  {vacancy.intro}
                </p>
              </div>

              {/* Wat ga je doen */}
              <div className="bg-atlas-grey rounded-[20px] p-7 sm:p-8 border border-neutral-200">
                <h3 className="text-xl font-extrabold text-atlas-black mb-4">
                  {ui.careers.whatYouDo}
                </h3>
                <ul className="space-y-3">
                  {vacancy.whatYouDo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-atlas-orange text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm sm:text-base text-atlas-ink">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Wat vragen wij */}
              <div>
                <h3 className="text-xl font-extrabold text-atlas-black mb-4">
                  {ui.careers.whatWeAsk}
                </h3>
                <ul className="space-y-3">
                  {vacancy.whatWeAsk.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-atlas-orange/20 text-atlas-orange flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm sm:text-base text-atlas-ink">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Wat bieden wij */}
              <div className="bg-atlas-orange-soft/60 rounded-[20px] p-7 sm:p-8 border border-atlas-orange/25">
                <h3 className="text-xl font-extrabold text-atlas-black mb-4">
                  {ui.careers.whatWeOffer}
                </h3>
                <ul className="space-y-3">
                  {vacancy.whatWeOffer.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-atlas-orange text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm sm:text-base font-medium text-atlas-black">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sticky Sidebar with Location, Hours, Start Date & Contact */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <div className="bg-atlas-black text-white rounded-[22px] p-7 space-y-5 shadow-xl">
                <h3 className="text-lg font-extrabold text-white border-b border-white/15 pb-3">
                  {locale === 'en' ? 'Job summary' : 'Functiegegevens'}
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-atlas-orange shrink-0 mt-0.5" strokeWidth={1.75} />
                    <div>
                      <p className="text-xs text-neutral-400">
                        {locale === 'en' ? 'Location / Region' : 'Standplaats / Regio'}
                      </p>
                      <p className="font-bold text-white">{vacancy.region}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-atlas-orange shrink-0 mt-0.5" strokeWidth={1.75} />
                    <div>
                      <p className="text-xs text-neutral-400">
                        {locale === 'en' ? 'Hours per week' : 'Uren per week'}
                      </p>
                      <p className="font-bold text-white">{vacancy.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-atlas-orange shrink-0 mt-0.5" strokeWidth={1.75} />
                    <div>
                      <p className="text-xs text-neutral-400">
                        {locale === 'en' ? 'Start date' : 'Startdatum'}
                      </p>
                      <p className="font-bold text-white">{vacancy.startDate}</p>
                    </div>
                  </div>
                </div>

                <a
                  href="#solliciteer-nu"
                  className="w-full inline-flex items-center justify-center bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm py-3.5 px-6 rounded-full transition-colors"
                >
                  {ui.careers.applyDirect} ↓
                </a>

                <div className="pt-4 border-t border-white/15 space-y-2 text-xs text-neutral-300">
                  <p className="font-semibold text-white">
                    {locale === 'en' ? 'Have a question first?' : 'Eerst een vraag stellen?'}
                  </p>
                  {settings.phoneDisplay && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-atlas-orange" />
                      <a
                        href={formatPhoneHref(settings.phoneDisplay)}
                        className="hover:text-atlas-orange"
                      >
                        {settings.phoneDisplay}
                      </a>
                    </p>
                  )}
                  {settings.emailCareers && (
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-atlas-orange" />
                      <a
                        href={formatMailHref(settings.emailCareers)}
                        className="hover:text-atlas-orange break-all"
                      >
                        {settings.emailCareers}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Embedded Application Form */}
          <div
            id="solliciteer-nu"
            className="mt-16 pt-12 border-t border-neutral-200 max-w-4xl scroll-mt-24"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-atlas-black mb-2">
              {locale === 'en'
                ? 'Apply directly for this position'
                : 'Solliciteer direct op deze functie'}
            </h2>
            <p className="text-sm sm:text-base text-atlas-ink/85 mb-8">
              {locale === 'en'
                ? 'Fill in your details and we will contact you within 24 hours.'
                : 'Vul je gegevens in en we nemen binnen 24 uur contact met je op.'}
            </p>
            <div className="bg-atlas-grey rounded-[24px] p-8 sm:p-10 border border-neutral-200">
              <ApplicationForm defaultVacancyTitle={vacancy.title} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
