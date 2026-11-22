'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  CmsSnapshot,
  SiteSettings,
  PagesContent,
  ProjectItem,
  CmsServiceItem,
  CmsVacancyItem,
  MediaAsset,
  FormSubmission,
  SubmissionType,
  SubmissionStatus,
} from './types';
import { DEFAULT_CMS_SNAPSHOT } from './defaultContent';
import {
  fetchCmsSnapshot,
  persistCmsSnapshot,
  syncSnapshotToSupabase,
  uploadMediaFile,
  resetCmsToDefaults,
  getAdminSession,
  signInAdmin,
  signOutAdmin,
  AdminUserSession,
  isSupabaseConfigured,
  ensureSupabaseConfig,
  getSupabaseClient,
} from './cmsService';
import { Locale, getLocaleFromPathname } from '@/i18n/routes';

export interface CmsToast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface BilingualEntityPair {
  id: string;
  slug: string;
  slugEn: string;
  status: string;
  statusEn: string;
}

interface CmsContextValue {
  snapshot: CmsSnapshot;
  // Active locale ('nl' or 'en' based on URL on public pages, or editLocale inside /admin)
  locale: Locale;
  editLocale: Locale;
  setEditLocale: (loc: Locale) => void;
  adminLocale: Locale;
  setAdminLocale: (loc: Locale) => void;
  // Active locale's data
  settings: SiteSettings;
  pages: PagesContent;
  projects: ProjectItem[];
  services: CmsServiceItem[];
  vacancies: CmsVacancyItem[];
  // Paired entity maps for language switching & hreflang
  bilingualProjects: BilingualEntityPair[];
  bilingualServices: BilingualEntityPair[];
  bilingualVacancies: BilingualEntityPair[];
  media: MediaAsset[];
  submissions: FormSubmission[];
  isLoaded: boolean;
  isSupabaseMode: boolean;
  adminUser: AdminUserSession | null;
  toasts: CmsToast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  // Auth
  loginAdmin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  // Settings & Pages
  updateSettings: (nextSettings: SiteSettings) => Promise<void>;
  updatePages: (nextPages: PagesContent) => Promise<void>;
  updatePageSection: <K extends keyof PagesContent>(
    pageKey: K,
    pageData: PagesContent[K]
  ) => Promise<void>;
  // Projects CRUD
  saveProject: (project: ProjectItem) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<ProjectItem | null>;
  // Services CRUD
  saveService: (service: CmsServiceItem) => Promise<void>;
  saveAllServices: (services: CmsServiceItem[]) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  // Vacancies CRUD
  saveVacancy: (vacancy: CmsVacancyItem) => Promise<void>;
  deleteVacancy: (id: string) => Promise<void>;
  // Media CRUD
  uploadMedia: (file: File, altText?: string, compressLarge?: boolean) => Promise<MediaAsset>;
  updateMediaAlt: (id: string, alt: string, altEn?: string) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  // Form Submissions
  submitPublicForm: (input: {
    type: SubmissionType;
    name: string;
    email: string;
    phone?: string;
    payload: Record<string, unknown>;
  }) => Promise<void>;
  updateSubmissionStatus: (id: string, status: SubmissionStatus) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
  // Backup, Restore & Supabase Sync
  syncToSupabase: () => Promise<{ ok: boolean; error?: string }>;
  importSnapshotJson: (jsonString: string) => Promise<{ ok: boolean; error?: string }>;
  resetAllToDefaults: () => Promise<void>;
}

const CmsContext = createContext<CmsContextValue | null>(null);

const ADMIN_UI_LOCALE_KEY = 'atlas_cms_admin_ui_locale_v1';
const ADMIN_EDIT_LOCALE_KEY = 'atlas_cms_edit_locale_v1';

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const publicLocale: Locale = getLocaleFromPathname(pathname);

  const [snapshot, setSnapshot] = useState<CmsSnapshot>(DEFAULT_CMS_SNAPSHOT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [supabaseActive, setSupabaseActive] = useState(isSupabaseConfigured);
  const [adminUser, setAdminUser] = useState<AdminUserSession | null>(null);
  const [toasts, setToasts] = useState<CmsToast[]>([]);
  const [editLocale, setEditLocaleState] = useState<Locale>('nl');
  const [adminLocale, setAdminLocaleState] = useState<Locale>('nl');

  const setEditLocale = useCallback((loc: Locale) => {
    setEditLocaleState(loc);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADMIN_EDIT_LOCALE_KEY, loc);
    }
  }, []);

  const setAdminLocale = useCallback((loc: Locale) => {
    setAdminLocaleState(loc);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADMIN_UI_LOCALE_KEY, loc);
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'error' = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3600);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    let mounted = true;
    let unsubscribeAuth: (() => void) | undefined;

    async function init() {
      if (typeof window !== 'undefined') {
        const savedUi = window.localStorage.getItem(ADMIN_UI_LOCALE_KEY);
        if (savedUi === 'nl' || savedUi === 'en') setAdminLocaleState(savedUi);
        const savedEdit = window.localStorage.getItem(ADMIN_EDIT_LOCALE_KEY);
        if (savedEdit === 'nl' || savedEdit === 'en') setEditLocaleState(savedEdit);
      }

      const configured = await ensureSupabaseConfig();
      const [loadedSnapshot, session] = await Promise.all([
        fetchCmsSnapshot(),
        getAdminSession(),
      ]);
      if (!mounted) return;
      setSupabaseActive(configured);
      setSnapshot(loadedSnapshot);
      setAdminUser(session);
      setIsLoaded(true);

      const sb = getSupabaseClient();
      if (sb) {
        const { data: sub } = sb.auth.onAuthStateChange(async (event) => {
          if (!mounted) return;
          if (event === 'SIGNED_OUT') {
            setAdminUser(null);
            return;
          }
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            const verified = await getAdminSession();
            if (mounted) {
              setAdminUser(verified);
            }
          }
        });
        unsubscribeAuth = () => sub.subscription.unsubscribe();
      }
    }
    init();
    return () => {
      mounted = false;
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const commit = useCallback(async (next: CmsSnapshot) => {
    setSnapshot(next);
    await persistCmsSnapshot(next);
  }, []);

  const activeLocale: Locale = isAdminRoute ? editLocale : publicLocale;

  const activeSettings: SiteSettings = useMemo(() => {
    if (activeLocale === 'en') {
      return snapshot.settingsEn || DEFAULT_CMS_SNAPSHOT.settingsEn || snapshot.settings;
    }
    return snapshot.settings;
  }, [activeLocale, snapshot.settings, snapshot.settingsEn]);

  const activePages: PagesContent = useMemo(() => {
    if (activeLocale === 'en') {
      return snapshot.pagesEn || DEFAULT_CMS_SNAPSHOT.pagesEn || snapshot.pages;
    }
    return snapshot.pages;
  }, [activeLocale, snapshot.pages, snapshot.pagesEn]);

  const bilingualProjects: BilingualEntityPair[] = useMemo(() => {
    const nlList = snapshot.projects;
    const enList = snapshot.projectsEn || DEFAULT_CMS_SNAPSHOT.projectsEn || [];
    return nlList.map((nlProj, idx) => {
      const enProj = enList.find((e) => e.id === nlProj.id) || enList[idx];
      return {
        id: nlProj.id,
        slug: nlProj.slug,
        slugEn: enProj?.slug || nlProj.slugEn || nlProj.slug,
        status: nlProj.status,
        statusEn: enProj?.status || nlProj.statusEn || nlProj.status,
      };
    });
  }, [snapshot.projects, snapshot.projectsEn]);

  const bilingualServices: BilingualEntityPair[] = useMemo(() => {
    const nlList = snapshot.services;
    const enList = snapshot.servicesEn || DEFAULT_CMS_SNAPSHOT.servicesEn || [];
    return nlList.map((nlSrv, idx) => {
      const enSrv = enList.find((e) => e.id === nlSrv.id) || enList[idx];
      return {
        id: nlSrv.id,
        slug: nlSrv.slug,
        slugEn: enSrv?.slug || nlSrv.slugEn || nlSrv.slug,
        status: nlSrv.status,
        statusEn: enSrv?.status || nlSrv.statusEn || nlSrv.status,
      };
    });
  }, [snapshot.services, snapshot.servicesEn]);

  const bilingualVacancies: BilingualEntityPair[] = useMemo(() => {
    const nlList = snapshot.vacancies;
    const enList = snapshot.vacanciesEn || DEFAULT_CMS_SNAPSHOT.vacanciesEn || [];
    return nlList.map((nlVac, idx) => {
      const enVac = enList.find((e) => e.id === nlVac.id) || enList[idx];
      return {
        id: nlVac.id,
        slug: nlVac.slug,
        slugEn: enVac?.slug || nlVac.slugEn || nlVac.slug,
        status: nlVac.status,
        statusEn: enVac?.status || nlVac.statusEn || nlVac.status,
      };
    });
  }, [snapshot.vacancies, snapshot.vacanciesEn]);

  const activeProjects: ProjectItem[] = useMemo(() => {
    if (activeLocale === 'en') {
      const enList = snapshot.projectsEn || DEFAULT_CMS_SNAPSHOT.projectsEn || snapshot.projects;
      return enList.map((p) => {
        const pair = bilingualProjects.find((bp) => bp.id === p.id);
        return {
          ...p,
          slugEn: p.slug,
          statusEn: p.status,
          ...(pair ? {} : {}),
        };
      });
    }
    return snapshot.projects.map((p) => {
      const pair = bilingualProjects.find((bp) => bp.id === p.id);
      return {
        ...p,
        slugEn: pair?.slugEn || p.slugEn || p.slug,
        statusEn: (pair?.statusEn as ProjectItem['status']) || p.statusEn || p.status,
      };
    });
  }, [activeLocale, snapshot.projects, snapshot.projectsEn, bilingualProjects]);

  const activeServices: CmsServiceItem[] = useMemo(() => {
    if (activeLocale === 'en') {
      return snapshot.servicesEn || DEFAULT_CMS_SNAPSHOT.servicesEn || snapshot.services;
    }
    return snapshot.services;
  }, [activeLocale, snapshot.services, snapshot.servicesEn]);

  const activeVacancies: CmsVacancyItem[] = useMemo(() => {
    if (activeLocale === 'en') {
      return snapshot.vacanciesEn || DEFAULT_CMS_SNAPSHOT.vacanciesEn || snapshot.vacancies;
    }
    return snapshot.vacancies;
  }, [activeLocale, snapshot.vacancies, snapshot.vacanciesEn]);

  const loginAdmin = useCallback(
    async (email: string, password: string) => {
      const { user, errorCode } = await signInAdmin(email, password);
      if (!user) {
        let errorMsg: string;
        if (errorCode === 'NOT_CONFIGURED') {
          errorMsg =
            adminLocale === 'en'
              ? 'CMS authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.'
              : 'CMS-authenticatie is niet geconfigureerd. Voeg VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY toe in Vercel.';
        } else if (errorCode === 'NOT_ADMIN') {
          errorMsg =
            adminLocale === 'en'
              ? 'No administrator permissions for this account.'
              : 'Geen beheerdersrechten voor dit account.';
        } else {
          errorMsg =
            adminLocale === 'en'
              ? 'Invalid email or password.'
              : 'Onjuist e-mailadres of wachtwoord.';
        }
        return { ok: false, error: errorMsg };
      }
      setAdminUser(user);
      showToast(
        adminLocale === 'en'
          ? 'Welcome back to the Atlas Holland CMS ✓'
          : 'Welkom terug in het Atlas Holland CMS ✓'
      );
      return { ok: true };
    },
    [showToast, adminLocale]
  );

  const logoutAdmin = useCallback(async () => {
    await signOutAdmin();
    setAdminUser(null);
    showToast(adminLocale === 'en' ? 'You have been signed out.' : 'U bent uitgelogd.', 'info');
  }, [showToast, adminLocale]);

  const updateSettings = useCallback(
    async (nextSettings: SiteSettings) => {
      const next =
        editLocale === 'en'
          ? { ...snapshot, settingsEn: nextSettings }
          : { ...snapshot, settings: nextSettings };
      await commit(next);
      showToast(
        adminLocale === 'en'
          ? `Company settings (${editLocale.toUpperCase()}) saved ✓`
          : `Bedrijfsgegevens & instellingen (${editLocale.toUpperCase()}) opgeslagen ✓`
      );
    },
    [snapshot, editLocale, commit, showToast, adminLocale]
  );

  const updatePages = useCallback(
    async (nextPages: PagesContent) => {
      const next =
        editLocale === 'en'
          ? { ...snapshot, pagesEn: nextPages }
          : { ...snapshot, pages: nextPages };
      await commit(next);
      showToast(
        adminLocale === 'en'
          ? `Page content (${editLocale.toUpperCase()}) saved ✓`
          : `Pagina-inhoud (${editLocale.toUpperCase()}) opgeslagen ✓`
      );
    },
    [snapshot, editLocale, commit, showToast, adminLocale]
  );

  const updatePageSection = useCallback(
    async <K extends keyof PagesContent>(pageKey: K, pageData: PagesContent[K]) => {
      if (editLocale === 'en') {
        const baseEn = snapshot.pagesEn || DEFAULT_CMS_SNAPSHOT.pagesEn || snapshot.pages;
        const nextPagesEn = { ...baseEn, [pageKey]: pageData };
        await commit({ ...snapshot, pagesEn: nextPagesEn });
      } else {
        const nextPages = { ...snapshot.pages, [pageKey]: pageData };
        await commit({ ...snapshot, pages: nextPages });
      }
      showToast(
        adminLocale === 'en'
          ? `Changes (${editLocale.toUpperCase()}) saved ✓`
          : `Wijzigingen (${editLocale.toUpperCase()}) opgeslagen ✓`
      );
    },
    [snapshot, editLocale, commit, showToast, adminLocale]
  );

  // Projects CRUD (bilingual-aware)
  const saveProject = useCallback(
    async (project: ProjectItem) => {
      const now = new Date().toISOString();
      const updatedProject: ProjectItem = {
        ...project,
        updatedAt: now,
        publishedAt:
          project.status === 'published' && !project.publishedAt
            ? now
            : project.publishedAt,
      };

      const nlList = snapshot.projects;
      const enList = snapshot.projectsEn || DEFAULT_CMS_SNAPSHOT.projectsEn || [];

      let nextNl = nlList;
      let nextEn = enList;

      if (editLocale === 'en') {
        const existsEn = enList.some((p) => p.id === updatedProject.id);
        nextEn = existsEn
          ? enList.map((p) => (p.id === updatedProject.id ? updatedProject : p))
          : [updatedProject, ...enList];

        // Also ensure a paired item exists in NL (or sync featured/displayOrder/slugEn/statusEn)
        const existsNl = nlList.some((p) => p.id === updatedProject.id);
        nextNl = existsNl
          ? nlList.map((p) =>
              p.id === updatedProject.id
                ? {
                    ...p,
                    featured: updatedProject.featured,
                    displayOrder: updatedProject.displayOrder,
                    coverImage: updatedProject.coverImage,
                    slugEn: updatedProject.slug,
                    statusEn: updatedProject.status,
                  }
                : p
            )
          : [
              {
                ...updatedProject,
                slugEn: updatedProject.slug,
                statusEn: updatedProject.status,
              },
              ...nlList,
            ];
      } else {
        const existsNl = nlList.some((p) => p.id === updatedProject.id);
        nextNl = existsNl
          ? nlList.map((p) => (p.id === updatedProject.id ? updatedProject : p))
          : [updatedProject, ...nlList];

        const existsEn = enList.some((p) => p.id === updatedProject.id);
        nextEn = existsEn
          ? enList.map((p) =>
              p.id === updatedProject.id
                ? {
                    ...p,
                    featured: updatedProject.featured,
                    displayOrder: updatedProject.displayOrder,
                    coverImage: updatedProject.coverImage,
                    slug: updatedProject.slugEn || p.slug,
                    status: updatedProject.statusEn || p.status,
                  }
                : p
            )
          : [
              {
                ...updatedProject,
                slug: updatedProject.slugEn || updatedProject.slug,
                status: updatedProject.statusEn || updatedProject.status,
              },
              ...enList,
            ];
      }

      await commit({ ...snapshot, projects: nextNl, projectsEn: nextEn });

      const sb = getSupabaseClient();
      const nlTarget = nextNl.find((p) => p.id === updatedProject.id) || updatedProject;
      if (sb) {
        await sb.from('projects').upsert(
          {
            slug: nlTarget.slug,
            title: nlTarget.title,
            status: nlTarget.status,
            featured: nlTarget.featured,
            display_order: nlTarget.displayOrder,
            category: nlTarget.category,
            service_slugs: nlTarget.serviceSlugs,
            client_name: nlTarget.clientName,
            location: nlTarget.location,
            period: nlTarget.period,
            deployment_summary: nlTarget.deploymentSummary,
            summary: nlTarget.summary,
            challenge: nlTarget.challenge,
            approach: nlTarget.approach,
            result: nlTarget.result,
            highlights: nlTarget.highlights,
            metrics: nlTarget.metrics,
            cover_image: nlTarget.coverImage,
            gallery: nlTarget.gallery,
            quote: nlTarget.quote || {},
            seo: nlTarget.seo,
            published_at: nlTarget.publishedAt || null,
            updated_at: nlTarget.updatedAt,
          },
          { onConflict: 'slug' }
        );
      }

      showToast(
        adminLocale === 'en'
          ? updatedProject.status === 'published'
            ? `Project (${editLocale.toUpperCase()}) published ✓`
            : `Project (${editLocale.toUpperCase()}) saved as draft ✓`
          : updatedProject.status === 'published'
          ? `Project (${editLocale.toUpperCase()}) gepubliceerd ✓`
          : `Project (${editLocale.toUpperCase()}) opgeslagen als concept ✓`
      );
    },
    [snapshot, editLocale, commit, showToast, adminLocale]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      const target = snapshot.projects.find((p) => p.id === id);
      const nextProjects = snapshot.projects.filter((p) => p.id !== id);
      const nextProjectsEn = (snapshot.projectsEn || []).filter((p) => p.id !== id);
      await commit({ ...snapshot, projects: nextProjects, projectsEn: nextProjectsEn });
      const sb = getSupabaseClient();
      if (sb && target) {
        await sb.from('projects').delete().eq('slug', target.slug);
      }
      showToast(
        adminLocale === 'en' ? 'Project deleted.' : 'Project verwijderd.',
        'info'
      );
    },
    [snapshot, commit, showToast, adminLocale]
  );

  const duplicateProject = useCallback(
    async (id: string): Promise<ProjectItem | null> => {
      const list = editLocale === 'en' ? snapshot.projectsEn || snapshot.projects : snapshot.projects;
      const original = list.find((p) => p.id === id);
      if (!original) return null;
      const now = new Date().toISOString();
      const newId = `proj-${Date.now()}`;
      const suffix = Date.now().toString().slice(-4);
      const copy: ProjectItem = {
        ...original,
        id: newId,
        title: `${original.title} (${editLocale === 'en' ? 'Copy' : 'Kopie'})`,
        slug: `${original.slug}-copy-${suffix}`,
        slugEn: `${original.slugEn || original.slug}-copy-${suffix}`,
        status: 'draft',
        statusEn: 'draft',
        featured: false,
        publishedAt: '',
        createdAt: now,
        updatedAt: now,
      };
      const nextNl = [copy, ...snapshot.projects];
      const nextEn = [copy, ...(snapshot.projectsEn || DEFAULT_CMS_SNAPSHOT.projectsEn || [])];
      await commit({ ...snapshot, projects: nextNl, projectsEn: nextEn });
      showToast(
        adminLocale === 'en'
          ? 'Project duplicated as draft ✓'
          : 'Project gedupliceerd als concept ✓'
      );
      return copy;
    },
    [snapshot, editLocale, commit, showToast, adminLocale]
  );

  // Services CRUD
  const saveService = useCallback(
    async (service: CmsServiceItem) => {
      const synced: CmsServiceItem = {
        ...service,
        imageUrl: service.cardImage.url || service.imageUrl,
        imageAlt: service.cardImage.alt || service.imageAlt,
      };

      if (editLocale === 'en') {
        const enList = snapshot.servicesEn || DEFAULT_CMS_SNAPSHOT.servicesEn || [];
        const exists = enList.some((s) => s.id === service.id);
        const nextEn = exists
          ? enList.map((s) => (s.id === service.id ? synced : s))
          : [...enList, synced];
        await commit({ ...snapshot, servicesEn: nextEn });
      } else {
        const exists = snapshot.services.some((s) => s.id === service.id);
        const nextServices = exists
          ? snapshot.services.map((s) => (s.id === service.id ? synced : s))
          : [...snapshot.services, synced];
        await commit({ ...snapshot, services: nextServices });

        const sb = getSupabaseClient();
        if (sb) {
          await sb.from('services').upsert(
            {
              slug: synced.slug,
              group_key: synced.group,
              title: synced.title,
              short_description: synced.oneLiner,
              hero_promise: synced.heroPromise,
              card_image: synced.cardImage,
              hero_image: synced.heroImage,
              what_we_do: {
                paragraphs: synced.whatWeDoParagraphs,
                bullets: synced.whatWeDoBullets,
              },
              applications: synced.applications,
              faqs: synced.faqs,
              related_slugs: synced.relatedSlugs,
              featured_on_home: synced.featuredOnHome,
              status: synced.status,
              display_order: synced.displayOrder,
              seo: synced.seo,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'slug' }
          );
        }
      }

      showToast(
        adminLocale === 'en'
          ? `Service "${service.title}" (${editLocale.toUpperCase()}) saved ✓`
          : `Dienst "${service.title}" (${editLocale.toUpperCase()}) opgeslagen ✓`
      );
    },
    [snapshot, editLocale, commit, showToast, adminLocale]
  );

  const saveAllServices = useCallback(
    async (services: CmsServiceItem[]) => {
      if (editLocale === 'en') {
        await commit({ ...snapshot, servicesEn: services });
      } else {
        await commit({ ...snapshot, services });
      }
      showToast(
        adminLocale === 'en'
          ? 'Service order updated ✓'
          : 'Volgorde en diensten bijgewerkt ✓'
      );
    },
    [snapshot, editLocale, commit, showToast, adminLocale]
  );

  const deleteService = useCallback(
    async (id: string) => {
      const target = snapshot.services.find((s) => s.id === id);
      const nextServices = snapshot.services.filter((s) => s.id !== id);
      const nextServicesEn = (snapshot.servicesEn || []).filter((s) => s.id !== id);
      await commit({ ...snapshot, services: nextServices, servicesEn: nextServicesEn });
      const sb = getSupabaseClient();
      if (sb && target) {
        await sb.from('services').delete().eq('slug', target.slug);
      }
      showToast(
        adminLocale === 'en' ? 'Service deleted.' : 'Dienst verwijderd.',
        'info'
      );
    },
    [snapshot, commit, showToast, adminLocale]
  );

  // Vacancies CRUD
  const saveVacancy = useCallback(
    async (vacancy: CmsVacancyItem) => {
      if (editLocale === 'en') {
        const enList = snapshot.vacanciesEn || DEFAULT_CMS_SNAPSHOT.vacanciesEn || [];
        const exists = enList.some((v) => v.id === vacancy.id);
        const nextEn = exists
          ? enList.map((v) => (v.id === vacancy.id ? vacancy : v))
          : [...enList, vacancy];
        await commit({ ...snapshot, vacanciesEn: nextEn });
      } else {
        const exists = snapshot.vacancies.some((v) => v.id === vacancy.id);
        const nextVacancies = exists
          ? snapshot.vacancies.map((v) => (v.id === vacancy.id ? vacancy : v))
          : [...snapshot.vacancies, vacancy];
        await commit({ ...snapshot, vacancies: nextVacancies });

        const sb = getSupabaseClient();
        if (sb) {
          await sb.from('vacancies').upsert(
            {
              slug: vacancy.slug,
              title: vacancy.title,
              region: vacancy.region,
              hours: vacancy.hours,
              employment_type: vacancy.employmentType,
              start_date: vacancy.startDate,
              tags: vacancy.tags,
              summary: vacancy.summary,
              intro: vacancy.intro,
              responsibilities: vacancy.whatYouDo,
              requirements: vacancy.whatWeAsk,
              benefits: vacancy.whatWeOffer,
              hero_image: vacancy.heroImage,
              status: vacancy.status,
              display_order: vacancy.displayOrder,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'slug' }
          );
        }
      }

      showToast(
        adminLocale === 'en'
          ? `Vacancy "${vacancy.title}" (${editLocale.toUpperCase()}) saved ✓`
          : `Vacature "${vacancy.title}" (${editLocale.toUpperCase()}) opgeslagen ✓`
      );
    },
    [snapshot, editLocale, commit, showToast, adminLocale]
  );

  const deleteVacancy = useCallback(
    async (id: string) => {
      const target = snapshot.vacancies.find((v) => v.id === id);
      const nextVacancies = snapshot.vacancies.filter((v) => v.id !== id);
      const nextVacanciesEn = (snapshot.vacanciesEn || []).filter((v) => v.id !== id);
      await commit({ ...snapshot, vacancies: nextVacancies, vacanciesEn: nextVacanciesEn });
      const sb = getSupabaseClient();
      if (sb && target) {
        await sb.from('vacancies').delete().eq('slug', target.slug);
      }
      showToast(
        adminLocale === 'en' ? 'Vacancy deleted.' : 'Vacature verwijderd.',
        'info'
      );
    },
    [snapshot, commit, showToast, adminLocale]
  );

  // Media CRUD
  const uploadMedia = useCallback(
    async (file: File, altText?: string, compressLarge = true): Promise<MediaAsset> => {
      const asset = await uploadMediaFile(file, altText, compressLarge);
      const nextMedia = [asset, ...snapshot.media];
      await commit({ ...snapshot, media: nextMedia });
      showToast(
        adminLocale === 'en'
          ? `Image "${file.name}" uploaded ✓`
          : `Afbeelding "${file.name}" geüpload ✓`
      );
      return asset;
    },
    [snapshot, commit, showToast, adminLocale]
  );

  const updateMediaAlt = useCallback(
    async (id: string, alt: string, altEn?: string) => {
      const nextMedia = snapshot.media.map((m) =>
        m.id === id ? { ...m, alt, ...(altEn !== undefined ? { altEn } : {}) } : m
      );
      await commit({ ...snapshot, media: nextMedia });
      showToast(
        adminLocale === 'en' ? 'Alt text updated ✓' : 'Alt-tekst bijgewerkt ✓'
      );
    },
    [snapshot, commit, showToast, adminLocale]
  );

  const deleteMedia = useCallback(
    async (id: string) => {
      const nextMedia = snapshot.media.filter((m) => m.id !== id);
      await commit({ ...snapshot, media: nextMedia });
      showToast(
        adminLocale === 'en'
          ? 'Image removed from media library.'
          : 'Afbeelding verwijderd uit mediabibliotheek.',
        'info'
      );
    },
    [snapshot, commit, showToast, adminLocale]
  );

  // Form Submissions
  const submitPublicForm = useCallback(
    async (input: {
      type: SubmissionType;
      name: string;
      email: string;
      phone?: string;
      payload: Record<string, unknown>;
    }) => {
      const newSub: FormSubmission = {
        id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: input.type,
        name: input.name,
        email: input.email,
        phone: input.phone || '',
        payload: { ...input.payload, taal: publicLocale.toUpperCase() },
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      const nextSubmissions = [newSub, ...snapshot.submissions];
      await commit({ ...snapshot, submissions: nextSubmissions });

      const sb = getSupabaseClient();
      if (sb) {
        await sb.from('form_submissions').insert({
          type: newSub.type,
          name: newSub.name,
          email: newSub.email,
          phone: newSub.phone,
          payload: newSub.payload,
          status: 'new',
        });
      }
    },
    [snapshot, publicLocale, commit]
  );

  const updateSubmissionStatus = useCallback(
    async (id: string, status: SubmissionStatus) => {
      const nextSubmissions = snapshot.submissions.map((s) =>
        s.id === id ? { ...s, status } : s
      );
      await commit({ ...snapshot, submissions: nextSubmissions });
      const sb = getSupabaseClient();
      if (sb && !id.startsWith('sub-')) {
        await sb.from('form_submissions').update({ status }).eq('id', id);
      }
      showToast(
        adminLocale === 'en'
          ? 'Submission status updated ✓'
          : 'Status van inzending bijgewerkt ✓'
      );
    },
    [snapshot, commit, showToast, adminLocale]
  );

  const deleteSubmission = useCallback(
    async (id: string) => {
      const nextSubmissions = snapshot.submissions.filter((s) => s.id !== id);
      await commit({ ...snapshot, submissions: nextSubmissions });
      const sb = getSupabaseClient();
      if (sb && !id.startsWith('sub-')) {
        await sb.from('form_submissions').delete().eq('id', id);
      }
      showToast(
        adminLocale === 'en' ? 'Submission deleted.' : 'Inzending verwijderd.',
        'info'
      );
    },
    [snapshot, commit, showToast, adminLocale]
  );

  const syncToSupabase = useCallback(async () => {
    const res = await syncSnapshotToSupabase(snapshot);
    if (res.ok) {
      showToast(
        adminLocale === 'en'
          ? 'Full content (NL + EN) synced to Supabase ✓'
          : 'Volledige inhoud (NL + EN) gesynchroniseerd naar Supabase ✓'
      );
    } else {
      showToast(
        adminLocale === 'en'
          ? `Supabase sync error: ${res.error}`
          : `Supabase synchronisatie fout: ${res.error}`,
        'error'
      );
    }
    return res;
  }, [snapshot, showToast, adminLocale]);

  const importSnapshotJson = useCallback(
    async (jsonString: string) => {
      try {
        const parsed = JSON.parse(jsonString) as Partial<CmsSnapshot>;
        if (!parsed.settings || !parsed.pages) {
          return {
            ok: false,
            error:
              adminLocale === 'en'
                ? 'Invalid backup file: settings or pages missing.'
                : 'Ongeldig back-upbestand: settings of pages ontbreekt.',
          };
        }
        const merged: CmsSnapshot = {
          settings: { ...DEFAULT_CMS_SNAPSHOT.settings, ...parsed.settings },
          pages: { ...DEFAULT_CMS_SNAPSHOT.pages, ...parsed.pages },
          projects: parsed.projects || snapshot.projects,
          services: parsed.services || snapshot.services,
          vacancies: parsed.vacancies || snapshot.vacancies,
          settingsEn: parsed.settingsEn || snapshot.settingsEn || DEFAULT_CMS_SNAPSHOT.settingsEn,
          pagesEn: parsed.pagesEn || snapshot.pagesEn || DEFAULT_CMS_SNAPSHOT.pagesEn,
          projectsEn: parsed.projectsEn || snapshot.projectsEn || DEFAULT_CMS_SNAPSHOT.projectsEn,
          servicesEn: parsed.servicesEn || snapshot.servicesEn || DEFAULT_CMS_SNAPSHOT.servicesEn,
          vacanciesEn: parsed.vacanciesEn || snapshot.vacanciesEn || DEFAULT_CMS_SNAPSHOT.vacanciesEn,
          media: parsed.media || snapshot.media,
          submissions: parsed.submissions || snapshot.submissions,
        };
        await commit(merged);
        showToast(
          adminLocale === 'en'
            ? 'CMS backup imported successfully ✓'
            : 'CMS back-up succesvol geïmporteerd ✓'
        );
        return { ok: true };
      } catch {
        return {
          ok: false,
          error:
            adminLocale === 'en'
              ? 'Invalid JSON file.'
              : 'Ongeldig JSON-bestand.',
        };
      }
    },
    [snapshot, commit, showToast, adminLocale]
  );

  const resetAllToDefaults = useCallback(async () => {
    const fresh = await resetCmsToDefaults();
    setSnapshot(fresh);
    showToast(
      adminLocale === 'en'
        ? 'Default content (NL + EN) restored ✓'
        : 'Standaardinhoud (NL + EN) hersteld ✓',
      'info'
    );
  }, [showToast, adminLocale]);

  return (
    <CmsContext.Provider
      value={{
        snapshot,
        locale: publicLocale,
        editLocale,
        setEditLocale,
        adminLocale,
        setAdminLocale,
        settings: activeSettings,
        pages: activePages,
        projects: activeProjects,
        services: activeServices,
        vacancies: activeVacancies,
        bilingualProjects,
        bilingualServices,
        bilingualVacancies,
        media: snapshot.media,
        submissions: snapshot.submissions,
        isLoaded,
        isSupabaseMode: supabaseActive,
        adminUser,
        toasts,
        showToast,
        dismissToast,
        loginAdmin,
        logoutAdmin,
        updateSettings,
        updatePages,
        updatePageSection,
        saveProject,
        deleteProject,
        duplicateProject,
        saveService,
        saveAllServices,
        deleteService,
        saveVacancy,
        deleteVacancy,
        uploadMedia,
        updateMediaAlt,
        deleteMedia,
        submitPublicForm,
        updateSubmissionStatus,
        deleteSubmission,
        syncToSupabase,
        importSnapshotJson,
        resetAllToDefaults,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error('useCms() moet binnen een <CmsProvider> worden gebruikt.');
  }
  return ctx;
}

export function formatPhoneHref(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, '');
  return `tel:${cleaned || phone}`;
}

export function formatMailHref(email: string, subject?: string): string {
  if (!subject) return `mailto:${email}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
