'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Instagram,
  Linkedin,
  Facebook,
  Share2,
  ArrowUpRight,
} from 'lucide-react';
import { useCms, formatPhoneHref, formatMailHref } from '@/cms/CmsContext';
import { AtlasLogo } from './AtlasLogo';
import { getLocalizedPath } from '@/i18n/routes';
import { PUBLIC_UI } from '@/i18n/dictionary';

export function Footer() {
  const pathname = usePathname() || '/';
  const { locale, settings, services, pages } = useCms();

  // Hide public footer on /admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const ui = PUBLIC_UI[locale];

  const featuredServices = services
    .filter((s) => s.status === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 5);

  const visibleCertificates = pages.home.qualitySection.certificates.filter(
    (c) => c.visible
  );

  return (
    <footer className="bg-atlas-black text-white border-t-4 border-atlas-orange">
      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Light Logo, Tagline, Socials (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <AtlasLogo variant="light-on-dark" size="lg" />
            <p className="text-neutral-300 text-sm leading-relaxed max-w-sm">
              {settings.footerTagline || settings.tagline}
            </p>
            <div className="pt-1">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-3">
                {locale === 'en' ? 'Follow' : 'Volg'} {settings.shortName || settings.companyName}
              </p>
              <div className="flex items-center gap-3">
                {settings.socials.instagram.enabled && (
                  <a
                    href={settings.socials.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram ${settings.socials.instagram.label}`}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-atlas-orange text-white flex items-center justify-center transition-colors border border-white/10"
                  >
                    <Instagram className="w-4 h-4" strokeWidth={1.75} />
                  </a>
                )}
                {settings.socials.linkedin.enabled && (
                  <a
                    href={settings.socials.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn ${settings.socials.linkedin.label}`}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-atlas-orange text-white flex items-center justify-center transition-colors border border-white/10"
                  >
                    <Linkedin className="w-4 h-4" strokeWidth={1.75} />
                  </a>
                )}
                {settings.socials.tiktok.enabled && (
                  <a
                    href={settings.socials.tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`TikTok ${settings.socials.tiktok.label}`}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-atlas-orange text-white flex items-center justify-center transition-colors border border-white/10"
                  >
                    <Share2 className="w-4 h-4" strokeWidth={1.75} />
                  </a>
                )}
                {settings.socials.facebook.enabled && (
                  <a
                    href={settings.socials.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Facebook ${settings.socials.facebook.label}`}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-atlas-orange text-white flex items-center justify-center transition-colors border border-white/10"
                  >
                    <Facebook className="w-4 h-4" strokeWidth={1.75} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Diensten / Services (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-4">
              {settings.footerColServicesTitle || ui.nav.services}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {featuredServices.map((srv) => (
                <li key={srv.slug}>
                  <Link
                    href={getLocalizedPath('serviceDetail', locale, srv.slug)}
                    className="text-neutral-300 hover:text-atlas-orange transition-colors"
                  >
                    {srv.shortTitle || srv.title}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href={getLocalizedPath('services', locale)}
                  className="inline-flex items-center gap-1 text-atlas-orange hover:underline font-semibold"
                >
                  <span>{ui.nav.allServices}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Atlas (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-4">
              {settings.footerColCompanyTitle || 'Atlas'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={getLocalizedPath('about', locale)}
                  className="text-neutral-300 hover:text-atlas-orange transition-colors"
                >
                  {ui.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('projects', locale)}
                  className="text-neutral-300 hover:text-atlas-orange transition-colors"
                >
                  {ui.nav.projects}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('training', locale)}
                  className="text-neutral-300 hover:text-atlas-orange transition-colors"
                >
                  {ui.nav.training}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('careers', locale)}
                  className="text-neutral-300 hover:text-atlas-orange transition-colors"
                >
                  {ui.nav.careers}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('quote', locale)}
                  className="text-neutral-300 hover:text-atlas-orange transition-colors"
                >
                  {ui.nav.requestQuote}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('contact', locale)}
                  className="text-neutral-300 hover:text-atlas-orange transition-colors"
                >
                  {ui.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Bedrijfsgegevens (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-sm">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-4">
              {settings.footerColContactTitle}
            </h3>

            {settings.phoneDisplay && (
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-atlas-orange shrink-0 mt-1" strokeWidth={1.75} />
                <div>
                  <p className="text-xs text-neutral-400">
                    {locale === 'en' ? '24/7 Dispatch & Emergency:' : '24/7 Planning & Spoed:'}
                  </p>
                  <a
                    href={formatPhoneHref(settings.phoneDisplay)}
                    className="font-bold text-white hover:text-atlas-orange transition-colors"
                  >
                    {settings.phoneDisplay}
                  </a>
                </div>
              </div>
            )}

            {settings.emailGeneral && (
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-atlas-orange shrink-0 mt-1" strokeWidth={1.75} />
                <div>
                  <p className="text-xs text-neutral-400">
                    {locale === 'en' ? 'General email:' : 'E-mail algemeen:'}
                  </p>
                  <a
                    href={formatMailHref(settings.emailGeneral)}
                    className="text-neutral-200 hover:text-atlas-orange transition-colors break-all"
                  >
                    {settings.emailGeneral}
                  </a>
                </div>
              </div>
            )}

            {(settings.addressStreet || settings.addressPostalCity) && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-atlas-orange shrink-0 mt-1" strokeWidth={1.75} />
                <div>
                  <p className="text-xs text-neutral-400">
                    {locale === 'en' ? 'Office & postal address:' : 'Bezoek- & postadres:'}
                  </p>
                  {settings.addressStreet && (
                    <p className="text-neutral-200">{settings.addressStreet}</p>
                  )}
                  {settings.addressPostalCity && (
                    <p className="text-neutral-200">{settings.addressPostalCity}</p>
                  )}
                </div>
              </div>
            )}

            {(settings.kvk || settings.btw) && (
              <div className="pt-3 border-t border-white/10 text-xs text-neutral-400 space-y-1">
                {settings.kvk && (
                  <p>
                    {ui.footer.kvkLabel}:{' '}
                    <span className="text-neutral-200 font-medium">{settings.kvk}</span>
                  </p>
                )}
                {settings.btw && (
                  <p>
                    {ui.footer.btwLabel}:{' '}
                    <span className="text-neutral-200 font-medium">{settings.btw}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Certification Strip */}
        {visibleCertificates.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-atlas-orange shrink-0" strokeWidth={1.75} />
              <span>
                {locale === 'en' ? 'Quality & Certifications:' : 'Kwaliteit & Certificering:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-neutral-300">
              {visibleCertificates.map((cert, idx) => (
                <React.Fragment key={cert.id}>
                  {idx > 0 && (
                    <span aria-hidden="true" className="text-neutral-600">
                      ·
                    </span>
                  )}
                  <span>{cert.code}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Legal Bar */}
      <div className="bg-black/50 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>{settings.footerCopyright}</p>
          <div className="flex items-center gap-4">
            <Link
              href={getLocalizedPath('privacy', locale)}
              className="hover:text-white transition-colors"
            >
              {ui.footer.privacy}
            </Link>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <Link
              href={getLocalizedPath('terms', locale)}
              className="hover:text-white transition-colors"
            >
              {ui.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
