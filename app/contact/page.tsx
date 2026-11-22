'use client';

import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  ArrowUpRight,
  Instagram,
  Linkedin,
  Share2,
} from 'lucide-react';
import { useCms, formatPhoneHref, formatMailHref } from '@/cms/CmsContext';
import { PageHero } from '@/components/SharedSections';
import { ContactFormClient } from '@/components/ContactFormClient';
import { getLocalizedPath } from '@/i18n/routes';
import { PUBLIC_UI } from '@/i18n/dictionary';

export default function ContactPage() {
  const { pages, settings, locale } = useCms();
  const ui = PUBLIC_UI[locale];
  const contact = pages.contact;
  const { hero } = contact;

  const fullAddress = [settings.addressStreet, settings.addressPostalCity]
    .filter(Boolean)
    .join(', ');

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
          href: getLocalizedPath('quote', locale),
        }}
        showPhoneCta
      />

      {/* Two-Column Contact Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Contact Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-2">
                  {contact.cardsEyebrow}
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-atlas-black tracking-tight">
                  {contact.cardsTitle}
                </h2>
              </div>

              {/* Card 1: 24/7 Telefoon */}
              {settings.phoneDisplay && (
                <div className="bg-atlas-black text-white rounded-[20px] p-6 flex items-start gap-4 shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-atlas-orange text-white flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-atlas-orange">
                      {contact.phoneCardLabel}
                    </p>
                    <a
                      href={formatPhoneHref(settings.phoneDisplay)}
                      className="text-xl font-extrabold text-white hover:text-atlas-orange transition-colors block mt-1"
                    >
                      {settings.phoneDisplay}
                    </a>
                    <p className="text-xs text-neutral-400 mt-1">
                      {contact.phoneCardSubtext}
                    </p>
                  </div>
                </div>
              )}

              {/* Card 2: E-mail */}
              {(settings.emailGeneral || settings.emailCareers) && (
                <div className="bg-atlas-grey rounded-[20px] p-6 border border-neutral-200 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-atlas-orange-soft text-atlas-orange flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <div className="space-y-2">
                    {settings.emailGeneral && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                          {locale === 'en' ? 'General & Planning' : 'Algemeen & Planning'}
                        </p>
                        <a
                          href={formatMailHref(settings.emailGeneral)}
                          className="text-base font-extrabold text-atlas-black hover:text-atlas-orange transition-colors break-all"
                        >
                          {settings.emailGeneral}
                        </a>
                      </div>
                    )}
                    {settings.emailCareers && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                          {locale === 'en' ? 'Careers & Training' : 'Vacatures & Opleidingen'}
                        </p>
                        <a
                          href={formatMailHref(settings.emailCareers)}
                          className="text-sm font-bold text-atlas-ink hover:text-atlas-orange transition-colors break-all"
                        >
                          {settings.emailCareers}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Card 3: Adres + Route */}
              {fullAddress && (
                <div className="bg-atlas-grey rounded-[20px] p-6 border border-neutral-200 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-atlas-orange-soft text-atlas-orange flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      {locale === 'en' ? 'Visiting Address' : 'Bezoekadres'}
                    </p>
                    <p className="text-base font-extrabold text-atlas-black mt-1">
                      {settings.companyName}
                    </p>
                    {settings.addressStreet && (
                      <p className="text-sm text-atlas-ink">{settings.addressStreet}</p>
                    )}
                    {settings.addressPostalCity && (
                      <p className="text-sm text-atlas-ink">{settings.addressPostalCity}</p>
                    )}
                    {settings.googleMapsUrl && (
                      <a
                        href={settings.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-atlas-orange hover:underline mt-3"
                      >
                        <span>
                          {locale === 'en'
                            ? 'View directions in Google Maps'
                            : 'Bekijk de route in Google Maps'}
                        </span>
                        <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Card 4: KvK, BTW & Socials */}
              <div className="bg-atlas-grey rounded-[20px] p-6 border border-neutral-200 space-y-4">
                {(settings.kvk || settings.btw) && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-atlas-orange-soft text-atlas-orange flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6" strokeWidth={1.75} />
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        {locale === 'en' ? 'Company Registration' : 'Bedrijfsregistratie'}
                      </p>
                      {settings.kvk && (
                        <p className="text-atlas-ink">
                          {locale === 'en' ? 'Chamber of Commerce (KvK): ' : 'KvK-nummer: '}
                          <strong className="text-atlas-black">{settings.kvk}</strong>
                        </p>
                      )}
                      {settings.btw && (
                        <p className="text-atlas-ink">
                          {locale === 'en' ? 'VAT number: ' : 'BTW-nummer: '}
                          <strong className="text-atlas-black">{settings.btw}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Social media:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {settings.socials.instagram.enabled && settings.socials.instagram.url && (
                      <a
                        href={settings.socials.instagram.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-atlas-black hover:text-atlas-orange bg-white px-3 py-1.5 rounded-lg border border-neutral-200"
                      >
                        <Instagram className="w-3.5 h-3.5 text-atlas-orange" />
                        <span>{settings.socials.instagram.label}</span>
                      </a>
                    )}
                    {settings.socials.linkedin.enabled && settings.socials.linkedin.url && (
                      <a
                        href={settings.socials.linkedin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-atlas-black hover:text-atlas-orange bg-white px-3 py-1.5 rounded-lg border border-neutral-200"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-atlas-orange" />
                        <span>{settings.socials.linkedin.label}</span>
                      </a>
                    )}
                    {settings.socials.tiktok.enabled && settings.socials.tiktok.url && (
                      <a
                        href={settings.socials.tiktok.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-atlas-black hover:text-atlas-orange bg-white px-3 py-1.5 rounded-lg border border-neutral-200"
                      >
                        <Share2 className="w-3.5 h-3.5 text-atlas-orange" />
                        <span>{settings.socials.tiktok.label}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-atlas-grey rounded-[24px] p-8 sm:p-10 border border-neutral-200">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-2">
                  {contact.formEyebrow}
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-atlas-black tracking-tight">
                  {contact.formTitle}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-atlas-ink/85">
                  {contact.formSubtitle}
                </p>
              </div>

              <ContactFormClient />
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Google Map Section */}
      {settings.googleMapsEmbedUrl && (
        <section className="bg-atlas-grey py-12 md:py-16 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[24px] overflow-hidden border border-neutral-200 shadow-sm">
              <div className="p-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
                    {contact.mapEyebrow}
                  </p>
                  <h3 className="text-xl font-extrabold text-atlas-black mt-0.5">
                    {locale === 'en' ? 'Visiting address' : 'Bezoekadres'}: {fullAddress || settings.companyName}
                  </h3>
                </div>
                {settings.googleMapsUrl && (
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-atlas-orange hover:underline shrink-0"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                  </a>
                )}
              </div>
              <div className="w-full h-[380px] bg-neutral-200 relative">
                <iframe
                  title={
                    locale === 'en'
                      ? `Location of ${settings.companyName} on Google Maps`
                      : `Locatie van ${settings.companyName} op Google Maps`
                  }
                  src={settings.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
