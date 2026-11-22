'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Check, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { getLocalizedPath } from '@/i18n/routes';
import { PUBLIC_UI } from '@/i18n/dictionary';
import {
  PageHero,
  CtaBand,
  ProcessSteps,
  FaqAccordion,
  ServiceCard,
  DynamicIcon,
  FadeIn,
} from '@/components/SharedSections';

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { services, adminUser, locale } = useCms();
  const ui = PUBLIC_UI[locale];

  const service = services.find(
    (s) =>
      (s.slug === slug || s.slugEn === slug) &&
      (s.status === 'published' || Boolean(adminUser))
  );

  if (!service) {
    return (
      <div className="min-h-[60vh] bg-atlas-grey flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-[24px] p-8 sm:p-12 border border-neutral-200 max-w-lg text-center space-y-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
            {locale === 'en' ? 'SERVICE NOT FOUND' : 'DIENST NIET GEVONDEN'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-atlas-black">
            {locale === 'en'
              ? 'This service does not exist or is not published'
              : 'Deze dienst bestaat niet of is niet gepubliceerd'}
          </h1>
          <p className="text-sm sm:text-base text-atlas-ink/80">
            {locale === 'en'
              ? 'View our complete overview of certified traffic and safety services.'
              : 'Bekijk ons volledige overzicht van gecertificeerde verkeers- en veiligheidsdiensten.'}
          </p>
          <div className="pt-2">
            <Link
              href={getLocalizedPath('services', locale)}
              className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm px-6 py-3.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{ui.services.backToServices}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const relatedServices = service.relatedSlugs
    .map((relSlug) =>
      services.find(
        (s) =>
          (s.slug === relSlug || s.slugEn === relSlug) && s.status === 'published'
      )
    )
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const heroImgUrl = service.heroImage?.url || service.cardImage?.url || service.imageUrl;
  const heroImgAlt = service.heroImage?.alt || service.cardImage?.alt || service.imageAlt || service.title;
  const quoteHref =
    locale === 'en'
      ? `/en/request-quote?service=${service.slug}`
      : `/offerte-aanvragen?dienst=${service.slug}`;

  return (
    <div>
      {service.status === 'draft' && (
        <div className="bg-atlas-orange text-white px-4 py-2.5 text-center text-xs sm:text-sm font-bold">
          {locale === 'en'
            ? 'Preview (Draft service — visible to administrators only)'
            : 'Voorvertoning (Conceptdienst — alleen zichtbaar voor beheerders)'}
        </div>
      )}

      <PageHero
        eyebrow={locale === 'en' ? 'OUR SERVICES' : 'ONZE DIENSTEN'}
        titleLine1={service.title}
        subtitle={service.heroPromise}
        imageUrl={heroImgUrl}
        imageAlt={heroImgAlt}
        primaryCta={{
          label: ui.nav.requestQuote,
          href: quoteHref,
        }}
        showPhoneCta
      />

      {/* WAT WIJ DOEN */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
                {ui.services.whatWeDo}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-atlas-black tracking-tight text-balance">
                {locale === 'en' ? 'Specialist in ' : 'Specialist in '}
                <span className="text-atlas-orange">
                  {service.title.toLowerCase()}
                </span>
              </h2>
              {service.whatWeDoParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base sm:text-lg text-atlas-ink/90 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}

              <div className="pt-4">
                <Link
                  href={quoteHref}
                  className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-full transition-colors"
                >
                  <span>
                    {locale === 'en'
                      ? `Request ${service.title.toLowerCase()} now`
                      : `Direct ${service.title.toLowerCase()} aanvragen`}
                  </span>
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-atlas-grey rounded-[20px] p-7 sm:p-9 border border-neutral-200">
              <h3 className="text-lg font-extrabold text-atlas-black mb-5">
                {locale === 'en'
                  ? 'Your guarantees with Atlas Holland'
                  : 'Uw zekerheden bij Atlas Holland'}
              </h3>
              <ul className="space-y-4">
                {service.whatWeDoBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <span className="w-6 h-6 rounded-full bg-atlas-orange text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </span>
                    <span className="text-sm sm:text-base text-atlas-ink font-medium leading-snug">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TOEPASSINGEN */}
      {service.applications.length > 0 && (
        <section className="bg-atlas-grey py-16 md:py-24 border-y border-neutral-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-2">
                {locale === 'en' ? 'PRACTICAL USE CASES' : 'PRAKTIJKSITUATIES'}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-atlas-black tracking-tight">
                {locale === 'en' ? (
                  <>
                    Common <span className="text-atlas-orange">applications</span>
                  </>
                ) : (
                  <>
                    Veelvoorkomende{' '}
                    <span className="text-atlas-orange">toepassingen</span>
                  </>
                )}
              </h2>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                service.applications.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
              } gap-6`}
            >
              {service.applications.map((app, index) => (
                <FadeIn key={`${app.title}-${index}`} delay={index * 0.08}>
                  <div className="bg-white rounded-[18px] p-7 border border-neutral-200/80 shadow-sm h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-atlas-orange-soft text-atlas-orange flex items-center justify-center mb-5">
                        <DynamicIcon name={app.iconName} className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-extrabold text-atlas-black">
                        {app.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-atlas-ink/85 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ZO WERKEN WIJ */}
      <ProcessSteps bgClass="bg-white" />

      {/* ORANGE CTA BAND */}
      <CtaBand
        headline={
          locale === 'en'
            ? `Need ${service.title.toLowerCase()} for your project?`
            : `${service.title} nodig voor uw project?`
        }
        buttonLabel={ui.nav.requestQuote}
        buttonHref={quoteHref}
      />

      {/* FAQ ACCORDION */}
      {service.faqs.length > 0 && (
        <section className="bg-atlas-grey py-16 md:py-24 border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FaqAccordion
              eyebrow={locale === 'en' ? 'FREQUENTLY ASKED QUESTIONS' : 'VEELGESTELDE VRAGEN'}
              title={
                locale === 'en'
                  ? `Questions about ${service.title.toLowerCase()}`
                  : `Vragen over ${service.title.toLowerCase()}`
              }
              faqs={service.faqs}
            />
          </div>
        </section>
      )}

      {/* ANDERE DIENSTEN */}
      {relatedServices.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-2">
                  {locale === 'en' ? 'RELATED EXPERTISE' : 'GERELATEERDE EXPERTISE'}
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-atlas-black">
                  {locale === 'en' ? (
                    <>
                      Other <span className="text-atlas-orange">services</span>
                    </>
                  ) : (
                    <>
                      Andere <span className="text-atlas-orange">diensten</span>
                    </>
                  )}
                </h2>
              </div>
              <Link
                href={getLocalizedPath('services', locale)}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-atlas-orange hover:text-atlas-orange-dark"
              >
                <span>{ui.services.allServices}</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedServices.map((relService) => (
                <ServiceCard key={relService.id || relService.slug} service={relService} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
