'use client';

import React, { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useCms } from '@/cms/CmsContext';
import { getAlternatePath, getLocaleFromPathname, Locale } from '@/i18n/routes';
import { PUBLIC_UI } from '@/i18n/dictionary';

interface SeoHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function SeoHead({ title, description, ogImage, noIndex }: SeoHeadProps) {
  const pathname = usePathname() || '/';
  const {
    settings,
    pages,
    projects,
    services,
    vacancies,
    bilingualProjects,
    bilingualServices,
    bilingualVacancies,
  } = useCms();

  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const locale: Locale = getLocaleFromPathname(pathname);

  const entities = useMemo(
    () => ({
      services: bilingualServices,
      projects: bilingualProjects,
      vacancies: bilingualVacancies,
    }),
    [bilingualServices, bilingualProjects, bilingualVacancies]
  );

  const nlAlt = useMemo(
    () => getAlternatePath(pathname, 'nl', entities),
    [pathname, entities]
  );
  const enAlt = useMemo(
    () => getAlternatePath(pathname, 'en', entities),
    [pathname, entities]
  );

  // Resolve automatic SEO title & description for the current route if not explicitly passed
  const resolvedSeo = useMemo(() => {
    if (title && description) {
      return {
        title,
        description,
        ogImage: ogImage || settings.defaultSeo.ogImage,
      };
    }

    const clean = pathname.replace(/\/+$/, '') || '/';

    if (clean === '/' || clean === '/en') {
      return {
        title: title || pages.home.seo.title || settings.defaultSeo.title,
        description:
          description || pages.home.seo.description || settings.defaultSeo.description,
        ogImage: ogImage || pages.home.hero.heroImage.url || settings.defaultSeo.ogImage,
      };
    }

    if (clean === '/diensten' || clean === '/en/services') {
      return {
        title: title || pages.servicesOverview.seo.title,
        description: description || pages.servicesOverview.seo.description,
        ogImage: ogImage || pages.servicesOverview.hero.image.url,
      };
    }

    if (clean === '/projecten' || clean === '/en/projects') {
      return {
        title: title || pages.projectsOverview.seo.title,
        description: description || pages.projectsOverview.seo.description,
        ogImage: ogImage || pages.projectsOverview.hero.image.url,
      };
    }

    if (clean === '/opleidingen' || clean === '/en/training') {
      return {
        title: title || pages.courses.seo.title,
        description: description || pages.courses.seo.description,
        ogImage: ogImage || pages.courses.hero.image.url,
      };
    }

    if (clean === '/over-ons' || clean === '/en/about') {
      return {
        title: title || pages.about.seo.title,
        description: description || pages.about.seo.description,
        ogImage: ogImage || pages.about.hero.image.url,
      };
    }

    if (clean === '/werken-bij' || clean === '/en/careers') {
      return {
        title: title || pages.careers.seo.title,
        description: description || pages.careers.seo.description,
        ogImage: ogImage || pages.careers.hero.image.url,
      };
    }

    if (clean === '/offerte-aanvragen' || clean === '/en/request-quote') {
      return {
        title: title || pages.quote.seo.title,
        description: description || pages.quote.seo.description,
        ogImage: ogImage || pages.quote.hero.image.url,
      };
    }

    if (clean === '/contact' || clean === '/en/contact') {
      return {
        title: title || pages.contact.seo.title,
        description: description || pages.contact.seo.description,
        ogImage: ogImage || pages.contact.hero.image.url,
      };
    }

    if (clean === '/privacy' || clean === '/en/privacy') {
      return {
        title: title || pages.privacy.seo.title,
        description: description || pages.privacy.seo.description,
        ogImage: ogImage || settings.defaultSeo.ogImage,
      };
    }

    if (clean === '/algemene-voorwaarden' || clean === '/en/terms') {
      return {
        title: title || pages.terms.seo.title,
        description: description || pages.terms.seo.description,
        ogImage: ogImage || settings.defaultSeo.ogImage,
      };
    }

    // Dynamic Service Detail
    const srvMatch = clean.match(/^\/(?:diensten|en\/services)\/([^/]+)$/);
    if (srvMatch) {
      const slug = decodeURIComponent(srvMatch[1]);
      const srv = services.find((s) => s.slug === slug || s.slugEn === slug);
      if (srv) {
        return {
          title: title || srv.seo?.title || `${srv.title} | ${settings.companyName}`,
          description: description || srv.seo?.description || srv.heroPromise,
          ogImage: ogImage || srv.heroImage.url,
        };
      }
    }

    // Dynamic Project Detail
    const projMatch = clean.match(/^\/(?:projecten|en\/projects)\/([^/]+)$/);
    if (projMatch) {
      const slug = decodeURIComponent(projMatch[1]);
      const proj = projects.find((p) => p.slug === slug || p.slugEn === slug);
      if (proj) {
        return {
          title: title || proj.seo?.title || `${proj.title} | ${settings.companyName}`,
          description: description || proj.seo?.description || proj.summary,
          ogImage: ogImage || proj.coverImage.url,
        };
      }
    }

    // Dynamic Vacancy Detail
    const vacMatch = clean.match(/^\/(?:werken-bij|en\/careers)\/([^/]+)$/);
    if (vacMatch) {
      const slug = decodeURIComponent(vacMatch[1]);
      const vac = vacancies.find((v) => v.slug === slug || v.slugEn === slug);
      if (vac) {
        return {
          title: title || `${vac.title} | ${settings.companyName}`,
          description: description || vac.summary,
          ogImage: ogImage || vac.heroImage.url,
        };
      }
    }

    return {
      title: title || settings.defaultSeo.title,
      description: description || settings.defaultSeo.description,
      ogImage: ogImage || settings.defaultSeo.ogImage,
    };
  }, [
    title,
    description,
    ogImage,
    pathname,
    pages,
    settings,
    services,
    projects,
    vacancies,
  ]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Document language
    document.documentElement.lang = isAdmin ? 'nl' : locale;

    // 2. Title
    if (resolvedSeo.title) {
      document.title = resolvedSeo.title;
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VITE_SITE_URL ||
      window.location.origin;

    const isPreviewQuery = window.location.search.includes('preview=true');
    const shouldNoIndex = Boolean(noIndex || isAdmin || isPreviewQuery);

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', resolvedSeo.description);
    setMeta(
      'name',
      'robots',
      shouldNoIndex ? 'noindex, nofollow' : 'index, follow'
    );

    // 3. Open Graph & Twitter
    const canonicalUrl = `${origin}${pathname}`;
    setMeta('property', 'og:title', resolvedSeo.title);
    setMeta('property', 'og:description', resolvedSeo.description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:locale', locale === 'en' ? 'en_GB' : 'nl_NL');
    setMeta('property', 'og:locale:alternate', locale === 'en' ? 'nl_NL' : 'en_GB');
    if (resolvedSeo.ogImage) {
      const fullImg = resolvedSeo.ogImage.startsWith('http')
        ? resolvedSeo.ogImage
        : `${origin}${resolvedSeo.ogImage}`;
      setMeta('property', 'og:image', fullImg);
    }

    // 4. Canonical & Reciprocal hreflang links
    let canonicalLink = document.head.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Clear old managed hreflang tags
    document.head
      .querySelectorAll('link[data-atlas-hreflang="true"]')
      .forEach((n) => n.remove());

    if (!isAdmin && !shouldNoIndex) {
      const addHreflang = (lang: string, path: string) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', lang);
        link.setAttribute('href', `${origin}${path}`);
        link.setAttribute('data-atlas-hreflang', 'true');
        document.head.appendChild(link);
      };

      if (locale === 'nl' || nlAlt.isExactAlternate) {
        addHreflang('nl', nlAlt.path);
        addHreflang('x-default', nlAlt.path);
      }
      if (locale === 'en' || enAlt.isExactAlternate) {
        addHreflang('en', enAlt.path);
      }
    }
  }, [pathname, locale, isAdmin, noIndex, resolvedSeo, nlAlt, enAlt]);

  if (isAdmin) return null;

  const ui = PUBLIC_UI[locale];
  const origin = 'https://www.atlasholland.nl';

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.companyName,
    description: resolvedSeo.description,
    url: `${origin}${locale === 'en' ? '/en' : '/'}`,
    telephone: settings.phoneDisplay,
    email: settings.emailGeneral,
    inLanguage: locale === 'en' ? 'en-GB' : 'nl-NL',
    availableLanguage: ['Dutch', 'English'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.addressStreet,
      addressLocality: 'Utrecht',
      postalCode: '3542 AD',
      addressCountry: 'NL',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  };

  const breadcrumbItems: {
    '@type': string;
    position: number;
    name: string;
    item: string;
  }[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: ui.nav.home,
      item: `${origin}${locale === 'en' ? '/en' : '/'}`,
    },
  ];
  if (pathname !== '/' && pathname !== '/en') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: resolvedSeo.title.split('|')[0].trim(),
      item: `${origin}${pathname}`,
    });
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
