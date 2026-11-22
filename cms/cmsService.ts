import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  CmsSnapshot,
  SiteSettings,
  PagesContent,
  ProjectItem,
  CmsServiceItem,
  CmsVacancyItem,
  MediaAsset,
  FormSubmission,
} from './types';
import { DEFAULT_CMS_SNAPSHOT } from './defaultContent';
import {
  loadLocalSnapshot,
  saveLocalSnapshot,
  clearLocalSnapshot,
  processImageFileToDataUrl,
} from './localStore';

export function normalizeSupabaseUrl(raw: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed || trimmed.includes('MY_')) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

let runtimeSupabaseUrl = normalizeSupabaseUrl(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
);
let runtimeSupabaseAnonKey = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();
if (runtimeSupabaseAnonKey.includes('MY_')) {
  runtimeSupabaseAnonKey = '';
}

export let isSupabaseConfigured = Boolean(
  runtimeSupabaseUrl && runtimeSupabaseAnonKey
);

let supabaseClient: SupabaseClient | null = null;
let configFetched = false;

export function getSupabaseUrl(): string {
  return runtimeSupabaseUrl;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!runtimeSupabaseUrl || !runtimeSupabaseAnonKey) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(runtimeSupabaseUrl, runtimeSupabaseAnonKey);
  }
  return supabaseClient;
}

/**
 * Ensures that if env variables were injected at runtime after build,
 * the client fetches them from /api/cms/config once.
 */
export async function ensureSupabaseConfig(): Promise<boolean> {
  if (runtimeSupabaseUrl && runtimeSupabaseAnonKey) {
    isSupabaseConfigured = true;
    return true;
  }
  if (typeof window === 'undefined' || configFetched) {
    return isSupabaseConfigured;
  }
  configFetched = true;
  try {
    const res = await fetch('/api/cms/config', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.supabaseUrl && data.supabaseAnonKey) {
        runtimeSupabaseUrl = normalizeSupabaseUrl(data.supabaseUrl);
        runtimeSupabaseAnonKey = String(data.supabaseAnonKey).trim();
        isSupabaseConfigured = Boolean(runtimeSupabaseUrl && runtimeSupabaseAnonKey);
        supabaseClient = null;
      }
    }
  } catch {
    // Ignore fetch error and stay in local mode
  }
  return isSupabaseConfigured;
}

export interface AdminUserSession {
  id: string;
  email: string;
  mode: 'supabase';
  isVerifiedAdmin: true;
}

export type AdminSignInErrorCode =
  | 'NOT_CONFIGURED'
  | 'INVALID_CREDENTIALS'
  | 'NOT_ADMIN';

async function checkUserIsAuthorizedAdmin(
  sb: SupabaseClient,
  user: {
    id: string;
    email?: string;
    app_metadata?: Record<string, unknown>;
    user_metadata?: Record<string, unknown>;
  }
): Promise<boolean> {
  // Block if explicitly revoked in Supabase Auth metadata
  if (
    user.app_metadata?.is_admin === false ||
    user.user_metadata?.is_admin === false ||
    user.app_metadata?.role === 'revoked' ||
    user.user_metadata?.role === 'revoked'
  ) {
    return false;
  }

  try {
    const { data, error } = await sb
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data?.user_id) {
      return true;
    }

    // If the user was created in Supabase Dashboard (Authentication -> Users)
    // and isn't in public.admin_users yet, attempt to sync their row automatically.
    if (!error && !data) {
      await sb
        .from('admin_users')
        .upsert(
          { user_id: user.id, email: user.email || '' },
          { onConflict: 'user_id' }
        );
    }

    // Valid authenticated Supabase Auth user (public sign-up is disabled)
    return Boolean(user.id && user.email);
  } catch {
    return Boolean(user.id && user.email);
  }
}

export interface SupabaseDiagnosticResult {
  configured: boolean;
  url: string;
  authReachable: boolean;
  tablesAccessible: boolean;
  permissionDenied: boolean;
  missingTables: boolean;
  errorCode?: string;
  errorMessage?: string;
  counts: {
    siteContent: number;
    projects: number;
    services: number;
    vacancies: number;
    media: number;
    submissions: number;
  };
}

export async function testSupabaseConnection(): Promise<SupabaseDiagnosticResult> {
  await ensureSupabaseConfig();
  const sb = getSupabaseClient();
  const emptyCounts = {
    siteContent: 0,
    projects: 0,
    services: 0,
    vacancies: 0,
    media: 0,
    submissions: 0,
  };

  if (!sb) {
    return {
      configured: false,
      url: '',
      authReachable: false,
      tablesAccessible: false,
      permissionDenied: false,
      missingTables: false,
      counts: emptyCounts,
    };
  }

  try {
    const { error: authErr } = await sb.auth.getSession();
    const authReachable = !authErr;

    const [siteRes, projRes, srvRes, vacRes, mediaRes, subRes] = await Promise.all([
      sb.from('site_content').select('key'),
      sb.from('projects').select('id'),
      sb.from('services').select('id'),
      sb.from('vacancies').select('id'),
      sb.from('media_assets').select('id'),
      sb.from('form_submissions').select('id'),
    ]);

    const firstError =
      siteRes.error ||
      projRes.error ||
      srvRes.error ||
      vacRes.error ||
      mediaRes.error;

    if (firstError) {
      const code = String(firstError.code || '');
      const msg = String(firstError.message || '');
      const isPerm =
        code === '42501' || msg.toLowerCase().includes('permission denied');
      const isMissing =
        code === '42P01' ||
        msg.toLowerCase().includes('does not exist') ||
        msg.toLowerCase().includes('schema cache');

      return {
        configured: true,
        url: runtimeSupabaseUrl,
        authReachable,
        tablesAccessible: false,
        permissionDenied: isPerm,
        missingTables: isMissing,
        errorCode: code,
        errorMessage: msg,
        counts: emptyCounts,
      };
    }

    return {
      configured: true,
      url: runtimeSupabaseUrl,
      authReachable,
      tablesAccessible: true,
      permissionDenied: false,
      missingTables: false,
      counts: {
        siteContent: siteRes.data?.length || 0,
        projects: projRes.data?.length || 0,
        services: srvRes.data?.length || 0,
        vacancies: vacRes.data?.length || 0,
        media: mediaRes.data?.length || 0,
        submissions: subRes.data?.length || 0,
      },
    };
  } catch (err) {
    return {
      configured: true,
      url: runtimeSupabaseUrl,
      authReachable: false,
      tablesAccessible: false,
      permissionDenied: false,
      missingTables: false,
      errorMessage: err instanceof Error ? err.message : 'Onbekende verbindingsfout',
      counts: emptyCounts,
    };
  }
}

export async function getAdminSession(): Promise<AdminUserSession | null> {
  await ensureSupabaseConfig();
  const sb = getSupabaseClient();
  if (!sb) {
    return null;
  }

  const { data, error } = await sb.auth.getSession();
  if (error || !data.session?.user?.id || !data.session.user.email) {
    return null;
  }

  const isAuthorized = await checkUserIsAuthorizedAdmin(sb, data.session.user);
  if (!isAuthorized) {
    await sb.auth.signOut();
    return null;
  }

  return {
    id: data.session.user.id,
    email: data.session.user.email,
    mode: 'supabase',
    isVerifiedAdmin: true,
  };
}

export async function signInAdmin(
  email: string,
  password: string
): Promise<{ user: AdminUserSession | null; errorCode?: AdminSignInErrorCode }> {
  await ensureSupabaseConfig();
  const sb = getSupabaseClient();
  if (!sb) {
    return { user: null, errorCode: 'NOT_CONFIGURED' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await sb.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error || !data.user?.id || !data.user.email) {
    return { user: null, errorCode: 'INVALID_CREDENTIALS' };
  }

  const isAuthorized = await checkUserIsAuthorizedAdmin(sb, data.user);
  if (!isAuthorized) {
    await sb.auth.signOut();
    return { user: null, errorCode: 'NOT_ADMIN' };
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      mode: 'supabase',
      isVerifiedAdmin: true,
    },
  };
}

export async function signOutAdmin(): Promise<void> {
  await ensureSupabaseConfig();
  const sb = getSupabaseClient();
  if (sb) {
    await sb.auth.signOut();
  }
}

export async function requestAdminPasswordReset(
  email: string,
  redirectTo: string
): Promise<{ ok: boolean; error?: string }> {
  await ensureSupabaseConfig();
  const sb = getSupabaseClient();
  if (!sb) {
    return { ok: false, error: 'NOT_CONFIGURED' };
  }

  const { error } = await sb.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function updateAdminPassword(
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  await ensureSupabaseConfig();
  const sb = getSupabaseClient();
  if (!sb) {
    return { ok: false, error: 'NOT_CONFIGURED' };
  }

  const { error } = await sb.auth.updateUser({ password: newPassword });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

function mapRowToProject(r: Record<string, unknown>): ProjectItem {
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title),
    status: (r.status as ProjectItem['status']) || 'draft',
    featured: Boolean(r.featured),
    displayOrder: Number(r.display_order || 0),
    category: String(r.category || 'Infra & wegenbouw'),
    serviceSlugs: (r.service_slugs as string[]) || [],
    clientName: String(r.client_name || ''),
    location: String(r.location || ''),
    period: String(r.period || ''),
    deploymentSummary: String(r.deployment_summary || ''),
    summary: String(r.summary || ''),
    challenge: String(r.challenge || ''),
    approach: String(r.approach || ''),
    result: String(r.result || ''),
    highlights: (r.highlights as string[]) || [],
    metrics: (r.metrics as ProjectItem['metrics']) || [],
    coverImage: (r.cover_image as ProjectItem['coverImage']) || { url: '', alt: '' },
    gallery: (r.gallery as ProjectItem['gallery']) || [],
    quote: (r.quote as ProjectItem['quote']) || undefined,
    seo: (r.seo as ProjectItem['seo']) || { title: '', description: '' },
    publishedAt: String(r.published_at || ''),
    createdAt: String(r.created_at || ''),
    updatedAt: String(r.updated_at || ''),
  };
}

function mapRowToService(r: Record<string, unknown>): CmsServiceItem {
  const cardImg = (r.card_image as CmsServiceItem['cardImage']) || { url: '', alt: '' };
  const heroImg = (r.hero_image as CmsServiceItem['heroImage']) || cardImg;
  const whatWeDo = (r.what_we_do as { paragraphs?: string[]; bullets?: string[] }) || {};
  const seo = (r.seo as CmsServiceItem['seo']) || {
    title: String(r.title || ''),
    description: String(r.short_description || ''),
  };
  return {
    id: String(r.id),
    slug: String(r.slug),
    group: (r.group_key as CmsServiceItem['group']) || 'operationeel',
    title: String(r.title || ''),
    shortTitle: String(r.title || ''),
    oneLiner: String(r.short_description || ''),
    heroPromise: String(r.hero_promise || ''),
    imageUrl: cardImg.url,
    imageAlt: cardImg.alt,
    cardImage: cardImg,
    heroImage: heroImg,
    whatWeDoParagraphs: whatWeDo.paragraphs || [],
    whatWeDoBullets: whatWeDo.bullets || [],
    applications: (r.applications as CmsServiceItem['applications']) || [],
    faqs: (r.faqs as CmsServiceItem['faqs']) || [],
    relatedSlugs: (r.related_slugs as string[]) || [],
    featuredOnHome: Boolean(r.featured_on_home),
    status: (r.status as CmsServiceItem['status']) || 'published',
    displayOrder: Number(r.display_order || 0),
    seo,
  };
}

function mapRowToVacancy(r: Record<string, unknown>): CmsVacancyItem {
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title || ''),
    region: String(r.region || ''),
    hours: String(r.hours || ''),
    employmentType: String(r.employment_type || 'Fulltime / Parttime'),
    startDate: String(r.start_date || 'Per direct'),
    tags: (r.tags as string[]) || [],
    summary: String(r.summary || ''),
    intro: String(r.intro || ''),
    whatYouDo: (r.responsibilities as string[]) || [],
    whatWeAsk: (r.requirements as string[]) || [],
    whatWeOffer: (r.benefits as string[]) || [],
    heroImage: (r.hero_image as CmsVacancyItem['heroImage']) || { url: '', alt: '' },
    status: (r.status as CmsVacancyItem['status']) || 'published',
    displayOrder: Number(r.display_order || 0),
  };
}

function mapRowToMedia(r: Record<string, unknown>): MediaAsset {
  return {
    id: String(r.id),
    url: String(r.url || ''),
    storagePath: String(r.storage_path || ''),
    filename: String(r.filename || ''),
    alt: String(r.alt || ''),
    mimeType: String(r.mime_type || 'image/jpeg'),
    sizeBytes: Number(r.size_bytes || 0),
    width: Number(r.width || 0),
    height: Number(r.height || 0),
    createdAt: String(r.created_at || new Date().toISOString()),
  };
}

function mapRowToSubmission(r: Record<string, unknown>): FormSubmission {
  return {
    id: String(r.id),
    type: (r.type as FormSubmission['type']) || 'contact',
    name: String(r.name || ''),
    email: String(r.email || ''),
    phone: String(r.phone || ''),
    payload: (r.payload as Record<string, unknown>) || {},
    status: (r.status as FormSubmission['status']) || 'new',
    createdAt: String(r.created_at || new Date().toISOString()),
  };
}

/**
 * Load the entire CMS snapshot from Supabase (if configured & accessible) or IndexedDB local fallback.
 */
export async function fetchCmsSnapshot(): Promise<CmsSnapshot> {
  await ensureSupabaseConfig();
  const localSnap = await loadLocalSnapshot();
  const sb = getSupabaseClient();
  if (!sb) {
    return localSnap;
  }

  try {
    const [siteRes, projRes, srvRes, vacRes, mediaRes, subRes] = await Promise.all([
      sb.from('site_content').select('*'),
      sb.from('projects').select('*').order('display_order', { ascending: true }),
      sb.from('services').select('*').order('display_order', { ascending: true }),
      sb.from('vacancies').select('*').order('display_order', { ascending: true }),
      sb.from('media_assets').select('*').order('created_at', { ascending: false }),
      sb.from('form_submissions').select('*').order('created_at', { ascending: false }),
    ]);

    if (siteRes.error && projRes.error) {
      // e.g. 42501 permission denied or tables not seeded yet — fall back gracefully to local snapshot
      return localSnap;
    }

    const siteMap = new Map<string, unknown>();
    (siteRes.data || []).forEach((row: { key: string; data: unknown }) => {
      siteMap.set(row.key, row.data);
    });

    const settings =
      (siteMap.get('settings') as SiteSettings) || localSnap.settings;
    const pages = (siteMap.get('pages') as PagesContent) || localSnap.pages;
    const settingsEn =
      (siteMap.get('settings_en') as SiteSettings) ||
      localSnap.settingsEn ||
      DEFAULT_CMS_SNAPSHOT.settingsEn;
    const pagesEn =
      (siteMap.get('pages_en') as PagesContent) ||
      localSnap.pagesEn ||
      DEFAULT_CMS_SNAPSHOT.pagesEn;

    const projectsEn: ProjectItem[] =
      (siteMap.get('projects_en_backup') as ProjectItem[]) ||
      localSnap.projectsEn ||
      DEFAULT_CMS_SNAPSHOT.projectsEn ||
      [];

    const servicesEn: CmsServiceItem[] =
      (siteMap.get('services_en_backup') as CmsServiceItem[]) ||
      localSnap.servicesEn ||
      DEFAULT_CMS_SNAPSHOT.servicesEn ||
      [];

    const vacanciesEn: CmsVacancyItem[] =
      (siteMap.get('vacancies_en_backup') as CmsVacancyItem[]) ||
      localSnap.vacanciesEn ||
      DEFAULT_CMS_SNAPSHOT.vacanciesEn ||
      [];

    const rawProjects: ProjectItem[] =
      projRes.data && projRes.data.length > 0
        ? projRes.data.map((r) => mapRowToProject(r as Record<string, unknown>))
        : (siteMap.get('projects_backup') as ProjectItem[]) || localSnap.projects;

    const projects: ProjectItem[] = rawProjects.map((p, idx) => {
      const enMatch =
        projectsEn.find((e) => e.id === p.id) || projectsEn[idx];
      return {
        ...p,
        slugEn: p.slugEn || enMatch?.slugEn || enMatch?.slug || p.slug,
        statusEn: p.statusEn || enMatch?.status || p.status,
      };
    });

    const rawServices: CmsServiceItem[] =
      srvRes.data && srvRes.data.length > 0
        ? srvRes.data.map((r) => mapRowToService(r as Record<string, unknown>))
        : (siteMap.get('services_backup') as CmsServiceItem[]) || localSnap.services;

    const services: CmsServiceItem[] = rawServices.map((s, idx) => {
      const enMatch =
        servicesEn.find((e) => e.id === s.id) || servicesEn[idx];
      return {
        ...s,
        slugEn: s.slugEn || enMatch?.slugEn || enMatch?.slug || s.slug,
        statusEn: s.statusEn || enMatch?.status || s.status,
      };
    });

    const rawVacancies: CmsVacancyItem[] =
      vacRes.data && vacRes.data.length > 0
        ? vacRes.data.map((r) => mapRowToVacancy(r as Record<string, unknown>))
        : (siteMap.get('vacancies_backup') as CmsVacancyItem[]) || localSnap.vacancies;

    const vacancies: CmsVacancyItem[] = rawVacancies.map((v, idx) => {
      const enMatch =
        vacanciesEn.find((e) => e.id === v.id) || vacanciesEn[idx];
      return {
        ...v,
        slugEn: v.slugEn || enMatch?.slugEn || enMatch?.slug || v.slug,
        statusEn: v.statusEn || enMatch?.status || v.status,
      };
    });

    const media: MediaAsset[] =
      mediaRes.data && mediaRes.data.length > 0
        ? mediaRes.data.map((r) => mapRowToMedia(r as Record<string, unknown>))
        : (siteMap.get('media_backup') as MediaAsset[]) || localSnap.media;

    const submissions: FormSubmission[] =
      subRes.data && subRes.data.length > 0
        ? subRes.data.map((r) => mapRowToSubmission(r as Record<string, unknown>))
        : localSnap.submissions;

    const merged: CmsSnapshot = {
      settings,
      pages,
      projects,
      services,
      vacancies,
      settingsEn,
      pagesEn,
      projectsEn,
      servicesEn,
      vacanciesEn,
      media,
      submissions,
    };

    await saveLocalSnapshot(merged);
    return merged;
  } catch (err) {
    console.warn('[Atlas CMS] Fallback naar lokale IndexedDB opslag:', err);
    return localSnap;
  }
}

export async function persistCmsSnapshot(snapshot: CmsSnapshot): Promise<void> {
  await saveLocalSnapshot(snapshot);

  const sb = getSupabaseClient();
  if (sb) {
    try {
      const now = new Date().toISOString();
      await sb.from('site_content').upsert([
        { key: 'settings', data: snapshot.settings, updated_at: now },
        { key: 'pages', data: snapshot.pages, updated_at: now },
        { key: 'projects_backup', data: snapshot.projects, updated_at: now },
        { key: 'services_backup', data: snapshot.services, updated_at: now },
        { key: 'vacancies_backup', data: snapshot.vacancies, updated_at: now },
        { key: 'settings_en', data: snapshot.settingsEn || DEFAULT_CMS_SNAPSHOT.settingsEn, updated_at: now },
        { key: 'pages_en', data: snapshot.pagesEn || DEFAULT_CMS_SNAPSHOT.pagesEn, updated_at: now },
        { key: 'projects_en_backup', data: snapshot.projectsEn || DEFAULT_CMS_SNAPSHOT.projectsEn, updated_at: now },
        { key: 'services_en_backup', data: snapshot.servicesEn || DEFAULT_CMS_SNAPSHOT.servicesEn, updated_at: now },
        { key: 'vacancies_en_backup', data: snapshot.vacanciesEn || DEFAULT_CMS_SNAPSHOT.vacanciesEn, updated_at: now },
        { key: 'media_backup', data: snapshot.media, updated_at: now },
      ]);
    } catch (err) {
      console.warn('[Atlas CMS Supabase] Opslaan in site_content overgeslagen:', err);
    }
  }
}

/**
 * Push the complete current CMS snapshot into all 6 Supabase tables (seed / sync).
 */
export async function syncSnapshotToSupabase(
  snapshot: CmsSnapshot
): Promise<{ ok: boolean; error?: string }> {
  await ensureSupabaseConfig();
  const sb = getSupabaseClient();
  if (!sb) {
    return { ok: false, error: 'Supabase is niet geconfigureerd.' };
  }

  try {
    const now = new Date().toISOString();
    const { error: siteErr } = await sb.from('site_content').upsert([
      { key: 'settings', data: snapshot.settings, updated_at: now },
      { key: 'pages', data: snapshot.pages, updated_at: now },
      { key: 'projects_backup', data: snapshot.projects, updated_at: now },
      { key: 'services_backup', data: snapshot.services, updated_at: now },
      { key: 'vacancies_backup', data: snapshot.vacancies, updated_at: now },
      { key: 'settings_en', data: snapshot.settingsEn || DEFAULT_CMS_SNAPSHOT.settingsEn, updated_at: now },
      { key: 'pages_en', data: snapshot.pagesEn || DEFAULT_CMS_SNAPSHOT.pagesEn, updated_at: now },
      { key: 'projects_en_backup', data: snapshot.projectsEn || DEFAULT_CMS_SNAPSHOT.projectsEn, updated_at: now },
      { key: 'services_en_backup', data: snapshot.servicesEn || DEFAULT_CMS_SNAPSHOT.servicesEn, updated_at: now },
      { key: 'vacancies_en_backup', data: snapshot.vacanciesEn || DEFAULT_CMS_SNAPSHOT.vacanciesEn, updated_at: now },
      { key: 'media_backup', data: snapshot.media, updated_at: now },
    ]);

    if (siteErr) {
      return {
        ok: false,
        error: `${siteErr.message} (Code: ${siteErr.code || 'onbekend'})`,
      };
    }

    // Upsert projects by slug
    if (snapshot.projects.length > 0) {
      const projectRows = snapshot.projects.map((p) => ({
        slug: p.slug,
        title: p.title,
        status: p.status,
        featured: p.featured,
        display_order: p.displayOrder,
        category: p.category,
        service_slugs: p.serviceSlugs,
        client_name: p.clientName,
        location: p.location,
        period: p.period,
        deployment_summary: p.deploymentSummary,
        summary: p.summary,
        challenge: p.challenge,
        approach: p.approach,
        result: p.result,
        highlights: p.highlights,
        metrics: p.metrics,
        cover_image: p.coverImage,
        gallery: p.gallery,
        quote: p.quote || {},
        seo: p.seo,
        published_at: p.publishedAt || null,
        updated_at: now,
      }));
      await sb.from('projects').upsert(projectRows, { onConflict: 'slug' });
    }

    // Upsert services by slug
    if (snapshot.services.length > 0) {
      const serviceRows = snapshot.services.map((s) => ({
        slug: s.slug,
        group_key: s.group,
        title: s.title,
        short_description: s.oneLiner,
        hero_promise: s.heroPromise,
        card_image: s.cardImage,
        hero_image: s.heroImage,
        what_we_do: {
          paragraphs: s.whatWeDoParagraphs,
          bullets: s.whatWeDoBullets,
        },
        applications: s.applications,
        faqs: s.faqs,
        related_slugs: s.relatedSlugs,
        featured_on_home: s.featuredOnHome,
        status: s.status,
        display_order: s.displayOrder,
        seo: s.seo,
        updated_at: now,
      }));
      await sb.from('services').upsert(serviceRows, { onConflict: 'slug' });
    }

    // Upsert vacancies by slug
    if (snapshot.vacancies.length > 0) {
      const vacancyRows = snapshot.vacancies.map((v) => ({
        slug: v.slug,
        title: v.title,
        region: v.region,
        hours: v.hours,
        employment_type: v.employmentType,
        start_date: v.startDate,
        tags: v.tags,
        summary: v.summary,
        intro: v.intro,
        responsibilities: v.whatYouDo,
        requirements: v.whatWeAsk,
        benefits: v.whatWeOffer,
        hero_image: v.heroImage,
        status: v.status,
        display_order: v.displayOrder,
        updated_at: now,
      }));
      await sb.from('vacancies').upsert(vacancyRows, { onConflict: 'slug' });
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Synchronisatie naar Supabase mislukt.',
    };
  }
}

export async function uploadMediaFile(
  file: File,
  altText?: string,
  compressLarge = true
): Promise<MediaAsset> {
  await ensureSupabaseConfig();
  const processed = await processImageFileToDataUrl(file, compressLarge);
  const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const cleanAlt =
    altText?.trim() ||
    file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .trim();

  const sb = getSupabaseClient();
  if (sb) {
    try {
      const storagePath = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { error: uploadErr } = await sb.storage
        .from('atlas-media')
        .upload(storagePath, file, { upsert: true });

      if (!uploadErr) {
        const { data: pubUrl } = sb.storage.from('atlas-media').getPublicUrl(storagePath);
        const asset: MediaAsset = {
          id,
          url: pubUrl.publicUrl,
          storagePath,
          filename: file.name,
          alt: cleanAlt,
          mimeType: file.type || 'image/jpeg',
          sizeBytes: file.size,
          width: processed.width,
          height: processed.height,
          createdAt: new Date().toISOString(),
        };
        await sb.from('media_assets').insert({
          url: asset.url,
          storage_path: asset.storagePath,
          filename: asset.filename,
          alt: asset.alt,
          mime_type: asset.mimeType,
          size_bytes: asset.sizeBytes,
          width: asset.width,
          height: asset.height,
        });
        return asset;
      }
    } catch (err) {
      console.warn('[Atlas CMS] Fallback naar IndexedDB media opslag:', err);
    }
  }

  return {
    id,
    url: processed.dataUrl,
    storagePath: `local/${file.name}`,
    filename: file.name,
    alt: cleanAlt,
    mimeType: file.type || 'image/jpeg',
    sizeBytes: processed.sizeBytes,
    width: processed.width,
    height: processed.height,
    createdAt: new Date().toISOString(),
  };
}

export async function resetCmsToDefaults(): Promise<CmsSnapshot> {
  return clearLocalSnapshot();
}
