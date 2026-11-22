export type Locale = 'nl' | 'en';

export type RouteKey =
  | 'home'
  | 'services'
  | 'serviceDetail'
  | 'projects'
  | 'projectDetail'
  | 'training'
  | 'about'
  | 'careers'
  | 'vacancyDetail'
  | 'quote'
  | 'requestQuote'
  | 'contact'
  | 'privacy'
  | 'terms';

export const STATIC_ROUTES: Record<RouteKey, { nl: string; en: string }> = {
  home: { nl: '/', en: '/en' },
  services: { nl: '/diensten', en: '/en/services' },
  serviceDetail: { nl: '/diensten/:slug', en: '/en/services/:slug' },
  projects: { nl: '/projecten', en: '/en/projects' },
  projectDetail: { nl: '/projecten/:slug', en: '/en/projects/:slug' },
  training: { nl: '/opleidingen', en: '/en/training' },
  about: { nl: '/over-ons', en: '/en/about' },
  careers: { nl: '/werken-bij', en: '/en/careers' },
  vacancyDetail: { nl: '/werken-bij/:slug', en: '/en/careers/:slug' },
  quote: { nl: '/offerte-aanvragen', en: '/en/request-quote' },
  requestQuote: { nl: '/offerte-aanvragen', en: '/en/request-quote' },
  contact: { nl: '/contact', en: '/en/contact' },
  privacy: { nl: '/privacy', en: '/en/privacy' },
  terms: { nl: '/algemene-voorwaarden', en: '/en/terms' },
};

export const SERVICE_SLUG_MAP_NL_TO_EN: Record<string, string> = {
  verkeersregelaars: 'traffic-controllers',
  'tijdelijke-verkeersmaatregelen': 'temporary-traffic-measures',
  verkeersplannen: 'traffic-plans',
  'blvc-plannen': 'blvc-plans',
  projectcoordinatie: 'project-coordination',
  bouwportier: 'site-access-control',
  'veiligheidspersoon-tram': 'tram-safety-officer',
  evenementen: 'event-traffic-management',
  parkeerbegeleiding: 'parking-management',
  motorbegeleiding: 'motorcycle-escort',
  calamiteiten: 'emergency-response',
};

export const SERVICE_SLUG_MAP_EN_TO_NL: Record<string, string> = Object.fromEntries(
  Object.entries(SERVICE_SLUG_MAP_NL_TO_EN).map(([nl, en]) => [en, nl])
);

export function getLocaleFromPathname(pathname: string): Locale {
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return 'en';
  }
  return 'nl';
}

export function getLocalizedPath(
  routeKey: RouteKey,
  locale: Locale,
  slug?: string,
  queryParams?: Record<string, string>
): string {
  const template = STATIC_ROUTES[routeKey][locale];
  let path = slug ? template.replace(':slug', slug) : template;
  if (queryParams && Object.keys(queryParams).length > 0) {
    const usp = new URLSearchParams(queryParams);
    path += `?${usp.toString()}`;
  }
  return path;
}

/**
 * Translates any internal Dutch or English href into the active locale's URL.
 */
export function localizeHref(
  href: string,
  locale: Locale,
  entities?: {
    services?: { slug: string; slugEn?: string }[];
    projects?: { slug: string; slugEn?: string }[];
    vacancies?: { slug: string; slugEn?: string }[];
  }
): string {
  if (!href || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('#')) {
    return href;
  }

  const [rawPath, rawQuery] = href.split('?');
  const path = rawPath || '/';

  // Convert to target locale via getAlternatePath
  const converted = getAlternatePath(path, locale, entities);
  if (!rawQuery) return converted.path;

  // Localize query param dienst <-> service
  const params = new URLSearchParams(rawQuery);
  if (locale === 'en' && params.has('dienst')) {
    const nlSlug = params.get('dienst') || '';
    const srv = entities?.services?.find((s) => s.slug === nlSlug || s.slugEn === nlSlug);
    const enSlug = srv?.slugEn || SERVICE_SLUG_MAP_NL_TO_EN[nlSlug] || nlSlug;
    params.delete('dienst');
    params.set('service', enSlug);
  } else if (locale === 'nl' && params.has('service')) {
    const enSlug = params.get('service') || '';
    const srv = entities?.services?.find((s) => s.slugEn === enSlug || s.slug === enSlug);
    const nlSlug = srv?.slug || SERVICE_SLUG_MAP_EN_TO_NL[enSlug] || enSlug;
    params.delete('service');
    params.set('dienst', nlSlug);
  }

  const qs = params.toString();
  return qs ? `${converted.path}?${qs}` : converted.path;
}

export interface AlternatePathResult {
  path: string;
  isExactAlternate: boolean;
  routeKey: RouteKey;
}

/**
 * Given the current pathname and a target locale ('nl' | 'en'),
 * resolves the exact equivalent path in the target language, including dynamic slugs
 * and checking whether the target language version is published.
 */
export function getAlternatePath(
  currentPathname: string,
  targetLocale: Locale,
  entities?: {
    services?: { slug: string; slugEn?: string; status?: string; statusEn?: string }[];
    projects?: { slug: string; slugEn?: string; status?: string; statusEn?: string }[];
    vacancies?: { slug: string; slugEn?: string; status?: string; statusEn?: string }[];
  }
): AlternatePathResult {
  const clean = currentPathname.replace(/\/+$/, '') || '/';

  // 1. Check static routes
  for (const [key, pair] of Object.entries(STATIC_ROUTES) as [
    RouteKey,
    { nl: string; en: string },
  ][]) {
    if (pair.nl.includes(':slug')) continue;
    if (clean === pair.nl || clean === pair.en) {
      return {
        path: pair[targetLocale],
        isExactAlternate: true,
        routeKey: key,
      };
    }
  }

  // 2. Service detail: /diensten/:slug or /en/services/:slug
  const nlServiceMatch = clean.match(/^\/diensten\/([^/]+)$/);
  const enServiceMatch = clean.match(/^\/en\/services\/([^/]+)$/);
  if (nlServiceMatch || enServiceMatch) {
    const currentSlug = decodeURIComponent((nlServiceMatch || enServiceMatch)![1]);
    const matched = entities?.services?.find(
      (s) => s.slug === currentSlug || s.slugEn === currentSlug
    );
    if (targetLocale === 'en') {
      const enSlug =
        matched?.slugEn || SERVICE_SLUG_MAP_NL_TO_EN[currentSlug] || currentSlug;
      return {
        path: `/en/services/${enSlug}`,
        isExactAlternate: true,
        routeKey: 'serviceDetail',
      };
    } else {
      const nlSlug =
        matched?.slug || SERVICE_SLUG_MAP_EN_TO_NL[currentSlug] || currentSlug;
      return {
        path: `/diensten/${nlSlug}`,
        isExactAlternate: true,
        routeKey: 'serviceDetail',
      };
    }
  }

  // 3. Project detail: /projecten/:slug or /en/projects/:slug
  const nlProjMatch = clean.match(/^\/projecten\/([^/]+)$/);
  const enProjMatch = clean.match(/^\/en\/projects\/([^/]+)$/);
  if (nlProjMatch || enProjMatch) {
    const currentSlug = decodeURIComponent((nlProjMatch || enProjMatch)![1]);
    const matched = entities?.projects?.find(
      (p) => p.slug === currentSlug || p.slugEn === currentSlug
    );
    if (!matched) {
      return {
        path: STATIC_ROUTES.projects[targetLocale],
        isExactAlternate: false,
        routeKey: 'projects',
      };
    }
    const targetPublished =
      targetLocale === 'en'
        ? (matched.statusEn || matched.status) === 'published'
        : matched.status === 'published';
    if (!targetPublished) {
      return {
        path: STATIC_ROUTES.projects[targetLocale],
        isExactAlternate: false,
        routeKey: 'projects',
      };
    }
    const targetSlug =
      targetLocale === 'en' ? matched.slugEn || matched.slug : matched.slug;
    return {
      path: getLocalizedPath('projectDetail', targetLocale, targetSlug),
      isExactAlternate: true,
      routeKey: 'projectDetail',
    };
  }

  // 4. Vacancy detail: /werken-bij/:slug or /en/careers/:slug
  const nlVacMatch = clean.match(/^\/werken-bij\/([^/]+)$/);
  const enVacMatch = clean.match(/^\/en\/careers\/([^/]+)$/);
  if (nlVacMatch || enVacMatch) {
    const currentSlug = decodeURIComponent((nlVacMatch || enVacMatch)![1]);
    const matched = entities?.vacancies?.find(
      (v) => v.slug === currentSlug || v.slugEn === currentSlug
    );
    if (!matched) {
      return {
        path: STATIC_ROUTES.careers[targetLocale],
        isExactAlternate: false,
        routeKey: 'careers',
      };
    }
    const targetPublished =
      targetLocale === 'en'
        ? (matched.statusEn || matched.status) === 'published'
        : matched.status === 'published';
    if (!targetPublished) {
      return {
        path: STATIC_ROUTES.careers[targetLocale],
        isExactAlternate: false,
        routeKey: 'careers',
      };
    }
    const targetSlug =
      targetLocale === 'en' ? matched.slugEn || matched.slug : matched.slug;
    return {
      path: getLocalizedPath('vacancyDetail', targetLocale, targetSlug),
      isExactAlternate: true,
      routeKey: 'vacancyDetail',
    };
  }

  return {
    path: STATIC_ROUTES.home[targetLocale],
    isExactAlternate: true,
    routeKey: 'home',
  };
}
