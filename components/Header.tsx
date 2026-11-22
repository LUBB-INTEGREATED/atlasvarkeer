'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Edit3,
  LayoutDashboard,
  Globe,
} from 'lucide-react';
import { useCms, formatPhoneHref } from '@/cms/CmsContext';
import { ServiceGroupKey } from '@/cms/types';
import { AtlasLogo } from './AtlasLogo';
import { SeoHead } from './SeoHead';
import {
  getLocalizedPath,
  getAlternatePath,
} from '@/i18n/routes';
import { PUBLIC_UI } from '@/i18n/dictionary';

export function Header() {
  const pathname = usePathname() || '/';
  const {
    locale,
    setEditLocale,
    settings,
    services,
    pages,
    adminUser,
    bilingualProjects,
    bilingualServices,
    bilingualVacancies,
  } = useCms();

  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const entities = useMemo(
    () => ({
      services: bilingualServices,
      projects: bilingualProjects,
      vacancies: bilingualVacancies,
    }),
    [bilingualServices, bilingualProjects, bilingualVacancies]
  );

  const nlAlternate = useMemo(
    () => getAlternatePath(pathname, 'nl', entities),
    [pathname, entities]
  );
  const enAlternate = useMemo(
    () => getAlternatePath(pathname, 'en', entities),
    [pathname, entities]
  );

  // Do not render public Header on /admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const ui = PUBLIC_UI[locale];

  const navItems = [
    { label: ui.nav.home, href: getLocalizedPath('home', locale) },
    {
      label: ui.nav.services,
      href: getLocalizedPath('services', locale),
      hasMegaMenu: true,
    },
    { label: ui.nav.projects, href: getLocalizedPath('projects', locale) },
    { label: ui.nav.training, href: getLocalizedPath('training', locale) },
    { label: ui.nav.about, href: getLocalizedPath('about', locale) },
    { label: ui.nav.careers, href: getLocalizedPath('careers', locale) },
    { label: ui.nav.contact, href: getLocalizedPath('contact', locale) },
  ];

  const publishedServices = services
    .filter((s) => s.status === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const getGroupServices = (groupKey: ServiceGroupKey) =>
    publishedServices.filter((s) => s.group === groupKey);

  const handleMegaEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMegaLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 150);
  };

  // Resolve deep-link to Admin CMS editor for the current public page
  const getAdminEditHref = () => {
    if (pathname === '/' || pathname === '/en') return '/admin/paginas?tab=home';
    if (pathname === '/diensten' || pathname === '/en/services')
      return '/admin/paginas?tab=servicesOverview';
    if (pathname.startsWith('/diensten/') || pathname.startsWith('/en/services/'))
      return '/admin/diensten';
    if (pathname === '/projecten' || pathname === '/en/projects')
      return '/admin/paginas?tab=projectsOverview';
    if (pathname.startsWith('/projecten/') || pathname.startsWith('/en/projects/'))
      return '/admin/projecten';
    if (pathname === '/opleidingen' || pathname === '/en/training')
      return '/admin/paginas?tab=courses';
    if (pathname === '/over-ons' || pathname === '/en/about')
      return '/admin/paginas?tab=about';
    if (pathname === '/werken-bij' || pathname === '/en/careers')
      return '/admin/paginas?tab=careers';
    if (pathname.startsWith('/werken-bij/') || pathname.startsWith('/en/careers/'))
      return '/admin/vacatures';
    if (pathname === '/offerte-aanvragen' || pathname === '/en/request-quote')
      return '/admin/paginas?tab=quote';
    if (pathname === '/contact' || pathname === '/en/contact')
      return '/admin/paginas?tab=contact';
    if (
      pathname === '/privacy' ||
      pathname === '/en/privacy' ||
      pathname === '/algemene-voorwaarden' ||
      pathname === '/en/terms'
    )
      return '/admin/paginas?tab=legal';
    return '/admin';
  };

  return (
    <>
      <SeoHead />
      <header className="sticky top-0 z-50 w-full">
        {/* Thin Top Utility Bar */}
        <div className="bg-atlas-black text-white border-b border-white/10 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              {settings.phoneDisplay && (
                <>
                  <Phone className="w-3.5 h-3.5 text-atlas-orange shrink-0" strokeWidth={1.75} />
                  <span className="text-neutral-300 truncate">{settings.utilityBarUrgentLabel}</span>
                  <a
                    href={formatPhoneHref(settings.phoneDisplay)}
                    className="font-semibold text-white hover:text-atlas-orange transition-colors whitespace-nowrap"
                  >
                    {settings.phoneDisplay}
                  </a>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-neutral-300">
                <Link
                  href={getLocalizedPath('about', locale)}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  {ui.nav.about}
                </Link>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <Link
                  href={getLocalizedPath('projects', locale)}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  {ui.nav.projects}
                </Link>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <Link
                  href={getLocalizedPath('contact', locale)}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  {ui.nav.contact}
                </Link>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <Link
                  href={getLocalizedPath('careers', locale)}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  {ui.nav.careers}
                </Link>
              </div>

              {/* Clean, Accessible NL | EN Language Switcher */}
              <nav
                aria-label="Language switcher"
                className="flex items-center gap-1.5 pl-3 border-l border-white/15"
              >
                <Globe className="w-3.5 h-3.5 text-atlas-orange shrink-0" strokeWidth={1.75} />
                <Link
                  href={nlAlternate.path}
                  hrefLang="nl"
                  aria-current={locale === 'nl' ? 'true' : undefined}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    locale === 'nl'
                      ? 'font-extrabold text-white bg-atlas-orange/20 border-b-2 border-atlas-orange'
                      : 'font-medium text-neutral-400 hover:text-white'
                  }`}
                >
                  NL
                </Link>
                <span aria-hidden="true" className="text-neutral-600">|</span>
                <Link
                  href={enAlternate.path}
                  hrefLang="en"
                  aria-current={locale === 'en' ? 'true' : undefined}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    locale === 'en'
                      ? 'font-extrabold text-white bg-atlas-orange/20 border-b-2 border-atlas-orange'
                      : 'font-medium text-neutral-400 hover:text-white'
                  }`}
                >
                  EN
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Sticky Navigation Bar */}
        <div
          className={`w-full transition-all duration-200 bg-white ${
            isScrolled
              ? 'shadow-md border-b border-neutral-200/80 py-2.5'
              : 'border-b border-neutral-100 py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
            {/* Zone 1: Brand Logo */}
            <AtlasLogo variant="dark-on-light" size={isScrolled ? 'sm' : 'md'} />

            {/* Zone 2: Center Main Navigation (Desktop) */}
            <nav
              aria-label={locale === 'en' ? 'Main navigation' : 'Hoofdnavigatie'}
              className="hidden lg:flex items-center gap-6 text-sm font-semibold text-atlas-ink"
            >
              {navItems.map((item) => {
                const isHome = item.href === '/' || item.href === '/en';
                const isActive = isHome
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                if (item.hasMegaMenu) {
                  return (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={handleMegaEnter}
                      onMouseLeave={handleMegaLeave}
                    >
                      <div className="flex items-center gap-1">
                        <Link
                          href={item.href}
                          className={`py-2 transition-colors whitespace-nowrap shrink-0 ${
                            isActive
                              ? 'text-atlas-orange'
                              : 'text-atlas-ink hover:text-atlas-orange'
                          }`}
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          aria-expanded={megaMenuOpen}
                          aria-label={
                            locale === 'en' ? 'Open services submenu' : 'Open diensten submenu'
                          }
                          onClick={() => setMegaMenuOpen((prev) => !prev)}
                          className={`p-1 rounded hover:text-atlas-orange transition-colors ${
                            isActive ? 'text-atlas-orange' : 'text-atlas-ink'
                          }`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-150 ${
                              megaMenuOpen ? 'rotate-180 text-atlas-orange' : ''
                            }`}
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`py-2 transition-colors whitespace-nowrap shrink-0 relative ${
                      isActive
                        ? 'text-atlas-orange after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-atlas-orange'
                        : 'text-atlas-ink hover:text-atlas-orange'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Zone 3: Primary CTA Button (Desktop) & Mobile Hamburger */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={getLocalizedPath('quote', locale)}
                className="hidden sm:inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors whitespace-nowrap shrink-0 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-atlas-orange"
              >
                <span>{settings.headerCtaLabel || ui.nav.requestQuote}</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label={locale === 'en' ? 'Open menu' : 'Menu openen'}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-neutral-200 text-atlas-black hover:border-atlas-orange hover:text-atlas-orange transition-colors"
              >
                <Menu className="w-6 h-6" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Desktop Mega-Menu for Diensten / Services */}
          {megaMenuOpen && (
            <div
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
              className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-neutral-200 shadow-xl"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                  {pages.servicesOverview.groups.map((group) => {
                    const groupServices = getGroupServices(group.key);
                    const groupHeading =
                      (group as { title?: string; label?: string }).title ||
                      (group as { title?: string; label?: string }).label ||
                      ui.nav.groups[group.key];
                    return (
                      <div key={group.key} className="space-y-4">
                        <div className="border-b border-neutral-200 pb-3">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
                            {groupHeading}
                          </p>
                          <p className="text-xs text-neutral-600 mt-1">{group.description}</p>
                        </div>
                        <ul className="space-y-2">
                          {groupServices.map((service) => (
                            <li key={service.slug}>
                              <Link
                                href={getLocalizedPath('serviceDetail', locale, service.slug)}
                                onClick={() => setMegaMenuOpen(false)}
                                className="group flex items-center justify-between py-1.5 px-2.5 -mx-2.5 rounded-lg hover:bg-atlas-orange-soft/70 transition-colors"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-atlas-black group-hover:text-atlas-orange transition-colors">
                                    {service.title}
                                  </p>
                                  <p className="text-xs text-neutral-600 line-clamp-1">
                                    {service.oneLiner}
                                  </p>
                                </div>
                                <ArrowRight
                                  className="w-4 h-4 text-neutral-400 group-hover:text-atlas-orange group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
                                  strokeWidth={1.75}
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Mega-Menu Action Strip */}
                <div className="mt-8 pt-5 border-t border-neutral-200 flex items-center justify-between bg-atlas-grey -mx-8 -mb-8 px-8 py-4">
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-semibold text-atlas-black flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-atlas-orange" strokeWidth={1.75} />
                      {locale === 'en'
                        ? 'Tailored proposal within 24 hours'
                        : 'Binnen 24 uur een offerte op maat'}
                    </span>
                    {settings.phoneDisplay && (
                      <span className="text-neutral-600">
                        {locale === 'en' ? 'Urgent deployment? Call ' : 'Spoedinzet nodig? Bel direct '}
                        <a
                          href={formatPhoneHref(settings.phoneDisplay)}
                          className="font-semibold text-atlas-black hover:text-atlas-orange underline"
                        >
                          {settings.phoneDisplay}
                        </a>
                      </span>
                    )}
                  </div>
                  <Link
                    href={getLocalizedPath('services', locale)}
                    onClick={() => setMegaMenuOpen(false)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-atlas-orange hover:text-atlas-orange-dark"
                  >
                    <span>
                      {locale === 'en'
                        ? `Overview of all ${publishedServices.length} services`
                        : `Overzicht van alle ${publishedServices.length} diensten`}
                    </span>
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full-Screen Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={locale === 'en' ? 'Mobile navigation menu' : 'Mobiel navigatiemenu'}
            className="fixed inset-0 z-50 lg:hidden bg-white flex flex-col justify-between overflow-y-auto"
          >
            <div>
              <div className="px-4 sm:px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <AtlasLogo variant="dark-on-light" size="sm" />
                <div className="flex items-center gap-2">
                  {/* Mobile Language Switcher */}
                  <nav
                    aria-label="Mobile language switcher"
                    className="flex items-center gap-1 bg-atlas-grey px-2.5 py-1.5 rounded-xl border border-neutral-200 text-xs"
                  >
                    <Link
                      href={nlAlternate.path}
                      hrefLang="nl"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={locale === 'nl' ? 'true' : undefined}
                      className={`px-2 py-1 rounded-lg transition-colors ${
                        locale === 'nl'
                          ? 'bg-atlas-orange text-white font-extrabold'
                          : 'text-atlas-ink font-medium'
                      }`}
                    >
                      NL
                    </Link>
                    <Link
                      href={enAlternate.path}
                      hrefLang="en"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={locale === 'en' ? 'true' : undefined}
                      className={`px-2 py-1 rounded-lg transition-colors ${
                        locale === 'en'
                          ? 'bg-atlas-orange text-white font-extrabold'
                          : 'text-atlas-ink font-medium'
                      }`}
                    >
                      EN
                    </Link>
                  </nav>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label={locale === 'en' ? 'Close menu' : 'Menu sluiten'}
                    className="w-11 h-11 rounded-xl border border-neutral-200 flex items-center justify-center text-atlas-black hover:border-atlas-orange"
                  >
                    <X className="w-6 h-6" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              <nav className="px-4 sm:px-6 py-6 space-y-2">
                {navItems.map((item) => {
                  if (item.hasMegaMenu) {
                    return (
                      <div key={item.href} className="border-b border-neutral-100 pb-2">
                        <div className="flex items-center justify-between">
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-3 text-xl font-bold text-atlas-black hover:text-atlas-orange flex-1"
                          >
                            {item.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setMobileServicesExpanded((prev) => !prev)}
                            aria-expanded={mobileServicesExpanded}
                            aria-label={locale === 'en' ? 'Show all services' : 'Toon alle diensten'}
                            className="w-11 h-11 flex items-center justify-center rounded-lg bg-atlas-grey text-atlas-black"
                          >
                            <ChevronDown
                              className={`w-5 h-5 transition-transform ${
                                mobileServicesExpanded ? 'rotate-180 text-atlas-orange' : ''
                              }`}
                              strokeWidth={1.75}
                            />
                          </button>
                        </div>

                        {mobileServicesExpanded && (
                          <div className="mt-2 pl-3 space-y-5 pb-3">
                            {pages.servicesOverview.groups.map((group) => {
                              const groupHeading =
                                (group as { title?: string; label?: string }).title ||
                                (group as { title?: string; label?: string }).label ||
                                ui.nav.groups[group.key];
                              return (
                                <div key={group.key}>
                                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-2">
                                    {groupHeading}
                                  </p>
                                  <ul className="space-y-1.5 border-l-2 border-neutral-200 pl-3">
                                    {getGroupServices(group.key).map((s) => (
                                      <li key={s.slug}>
                                        <Link
                                          href={getLocalizedPath('serviceDetail', locale, s.slug)}
                                          onClick={() => setMobileMenuOpen(false)}
                                          className="block py-1.5 text-base font-medium text-atlas-ink hover:text-atlas-orange"
                                        >
                                          {s.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 text-xl font-bold text-atlas-black hover:text-atlas-orange border-b border-neutral-100"
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 sm:p-6 bg-atlas-grey border-t border-neutral-200 space-y-3">
              <Link
                href={getLocalizedPath('quote', locale)}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-base py-3.5 px-6 rounded-full transition-colors"
              >
                <span>{settings.headerCtaLabel || ui.nav.requestQuote}</span>
                <ArrowUpRight className="w-5 h-5" strokeWidth={2} />
              </Link>

              {settings.phoneDisplay && (
                <a
                  href={formatPhoneHref(settings.phoneDisplay)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-atlas-black text-white font-semibold text-base py-3.5 px-6 rounded-full"
                >
                  <Phone className="w-4 h-4 text-atlas-orange" strokeWidth={1.75} />
                  <span>
                    {locale === 'en' ? '24/7 Emergency:' : 'Spoed 24/7:'} {settings.phoneDisplay}
                  </span>
                </a>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Admin Quick-Edit Bar (shown only when an authenticated admin browses public pages) */}
      {adminUser && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-atlas-black/95 backdrop-blur-md text-white px-3.5 py-2 rounded-full shadow-2xl border border-white/15 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-atlas-orange" />
          <Link
            href={getAdminEditHref()}
            onClick={() => setEditLocale(locale)}
            className="inline-flex items-center gap-1.5 text-white hover:text-atlas-orange transition-colors py-1 px-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-atlas-orange" strokeWidth={2} />
            <span>
              {ui.nav.adminEditPage} ({locale.toUpperCase()})
            </span>
          </Link>
          <span aria-hidden="true" className="text-neutral-600">|</span>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors py-1 px-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Dashboard</span>
          </Link>
        </div>
      )}
    </>
  );
}
