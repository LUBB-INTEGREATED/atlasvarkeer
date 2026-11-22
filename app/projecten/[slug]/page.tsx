'use client';

import React, { use, useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  MapPin,
  Calendar,
  Users,
  Check,
  Quote,
  ChevronLeft,
  ChevronRight,
  X,
  Expand,
  Eye,
  Pencil,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { useCms, formatPhoneHref } from '@/cms/CmsContext';
import { getLocalizedPath } from '@/i18n/routes';
import { PUBLIC_UI } from '@/i18n/dictionary';
import { AtlasPhoto } from '@/components/AtlasPhoto';
import { SwooshArcBackdrop } from '@/components/AtlasLogo';
import { ProjectCard, CtaBand, FadeIn } from '@/components/SharedSections';

function ProjectDetailInner({ slug }: { slug: string }) {
  const { projects, services, settings, adminUser, saveProject, locale } = useCms();
  const ui = PUBLIC_UI[locale];
  const searchParams = useSearchParams();
  const isPreviewParam = searchParams.get('preview') === 'true';

  const project = projects.find((p) => p.slug === slug || p.slugEn === slug);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const gallery = project?.gallery || [];
  const galleryLength = gallery.length;

  const handlePrevImage = useCallback(() => {
    if (galleryLength === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? null : prev <= 0 ? galleryLength - 1 : prev - 1
    );
  }, [galleryLength]);

  const handleNextImage = useCallback(() => {
    if (galleryLength === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? null : prev >= galleryLength - 1 ? 0 : prev + 1
    );
  }, [galleryLength]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, handlePrevImage, handleNextImage]);

  const canViewDraft = Boolean(adminUser) || isPreviewParam;

  if (!project || (project.status !== 'published' && !canViewDraft)) {
    return (
      <div className="min-h-[65vh] bg-atlas-grey flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-[24px] p-8 sm:p-12 border border-neutral-200 max-w-lg text-center space-y-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
            {locale === 'en' ? 'PROJECT NOT FOUND' : 'PROJECT NIET GEVONDEN'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-atlas-black">
            {locale === 'en'
              ? 'This project does not exist or is not published yet'
              : 'Dit project bestaat niet of is nog niet gepubliceerd'}
          </h1>
          <p className="text-sm sm:text-base text-atlas-ink/80">
            {locale === 'en'
              ? 'View our published reference projects in the projects overview.'
              : 'Bekijk onze gepubliceerde referentieprojecten in het projectenoverzicht.'}
          </p>
          <div className="pt-2">
            <Link
              href={getLocalizedPath('projects', locale)}
              className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm px-6 py-3.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{ui.projects.backToProjects}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const linkedServices = project.serviceSlugs
    .map((sSlug) =>
      services.find((srv) => srv.slug === sSlug || srv.slugEn === sSlug)
    )
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const relatedProjects = [...projects]
    .filter((p) => p.status === 'published' && p.id !== project.id)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 3);

  const primaryServiceSlug =
    linkedServices[0]?.slug ||
    project.serviceSlugs[0] ||
    (locale === 'en' ? 'traffic-controllers' : 'verkeersregelaars');

  const quoteHref =
    locale === 'en'
      ? `/en/request-quote?service=${primaryServiceSlug}`
      : `/offerte-aanvragen?dienst=${primaryServiceSlug}`;

  const handlePublishNow = async () => {
    setIsPublishing(true);
    await saveProject({
      ...project,
      status: 'published',
      publishedAt: project.publishedAt || new Date().toISOString(),
    });
    setIsPublishing(false);
  };

  return (
    <div>
      {/* DRAFT / PREVIEW BANNER */}
      {(project.status !== 'published' || isPreviewParam) && (
        <div className="bg-atlas-orange text-white px-4 py-3 shadow-md sticky top-20 z-30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
              <Eye className="w-4 h-4 shrink-0" />
              <span>
                {project.status === 'published'
                  ? locale === 'en'
                    ? 'Preview Mode — This project is published live'
                    : 'Voorvertoningsmodus — Dit project is live gepubliceerd'
                  : ui.projects.draftPreviewBanner}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href={`/admin/projecten/${project.id}`}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{ui.projects.editInCms}</span>
              </Link>
              {project.status !== 'published' && (
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={handlePublishNow}
                  className="inline-flex items-center gap-1.5 bg-atlas-black hover:bg-neutral-900 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-atlas-orange" />
                  <span>
                    {isPublishing
                      ? locale === 'en'
                        ? 'Publishing...'
                        : 'Publiceren...'
                      : ui.projects.publishNow}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1. PROJECT HERO */}
      <section className="relative bg-atlas-black text-white pt-14 pb-24 md:pt-20 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AtlasPhoto
            src={project.coverImage.url}
            alt={project.coverImage.alt || project.title}
            priority
            className="w-full h-full"
            imgClassName="opacity-40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-atlas-black via-atlas-black/90 to-atlas-black/50"
          />
        </div>

        <SwooshArcBackdrop className="absolute -right-24 -bottom-28 w-[460px] h-[460px] opacity-25 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label={locale === 'en' ? 'Breadcrumb' : 'Kruimelpad'}
            className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-300 mb-6"
          >
            <Link
              href={getLocalizedPath('home', locale)}
              className="hover:text-atlas-orange transition-colors"
            >
              {ui.nav.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={getLocalizedPath('projects', locale)}
              className="hover:text-atlas-orange transition-colors"
            >
              {ui.nav.projects}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white font-semibold truncate max-w-xs sm:max-w-md">
              {project.title}
            </span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block bg-atlas-orange text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg mb-4">
              {project.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-white text-balance">
              {project.title}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-neutral-200 leading-relaxed">
              {project.summary}
            </p>
          </div>
        </div>
      </section>

      {/* 2. METADATA STRIP OVERLAPPING HERO */}
      <section className="relative z-20 -mt-12 md:-mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[22px] p-6 sm:p-8 border border-neutral-200 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-atlas-orange-soft text-atlas-orange flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {ui.projects.client}
              </p>
              <p className="text-sm sm:text-base font-extrabold text-atlas-black mt-0.5">
                {project.clientName || (locale === 'en' ? 'On request' : 'Op aanvraag')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-atlas-orange-soft text-atlas-orange flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {ui.projects.location}
              </p>
              <p className="text-sm sm:text-base font-extrabold text-atlas-black mt-0.5">
                {project.location}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-atlas-orange-soft text-atlas-orange flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {ui.projects.period}
              </p>
              <p className="text-sm sm:text-base font-extrabold text-atlas-black mt-0.5">
                {project.period}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-atlas-orange-soft text-atlas-orange flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {ui.projects.deployment}
              </p>
              <p className="text-sm sm:text-base font-extrabold text-atlas-black mt-0.5">
                {project.deploymentSummary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TWO-COLUMN CASE STUDY CONTENT */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column (8 cols): Challenge, Approach, Result, Highlights, Quote */}
            <div className="lg:col-span-8 space-y-12">
              {project.challenge && (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
                    {locale === 'en'
                      ? '01 · SITUATION & REQUIREMENT'
                      : '01 · SITUATIE & VRAAGSTUK'}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-atlas-black tracking-tight">
                    {ui.projects.challenge}
                  </h2>
                  <p className="text-base sm:text-lg text-atlas-ink/90 leading-relaxed whitespace-pre-line">
                    {project.challenge}
                  </p>
                </div>
              )}

              {project.approach && (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
                    {locale === 'en'
                      ? '02 · PREPARATION & EXECUTION'
                      : '02 · VOORBEREIDING & UITVOERING'}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-atlas-black tracking-tight">
                    {ui.projects.approach}
                  </h2>
                  <p className="text-base sm:text-lg text-atlas-ink/90 leading-relaxed whitespace-pre-line">
                    {project.approach}
                  </p>
                </div>
              )}

              {project.result && (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
                    {locale === 'en'
                      ? '03 · DELIVERY & SAFETY'
                      : '03 · OPLEVERING & VEILIGHEID'}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-atlas-black tracking-tight">
                    {ui.projects.result}
                  </h2>
                  <p className="text-base sm:text-lg text-atlas-ink/90 leading-relaxed whitespace-pre-line">
                    {project.result}
                  </p>
                </div>
              )}

              {/* Highlights Bullets */}
              {project.highlights.length > 0 && (
                <div className="bg-atlas-grey rounded-[22px] p-7 sm:p-9 border border-neutral-200">
                  <h3 className="text-xl font-extrabold text-atlas-black mb-5">
                    {ui.projects.highlights}
                  </h3>
                  <ul className="space-y-3.5">
                    {project.highlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-3.5">
                        <span className="w-6 h-6 rounded-full bg-atlas-orange text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </span>
                        <span className="text-sm sm:text-base font-medium text-atlas-black leading-snug">
                          {hl}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Optional Client Quote Card */}
              {project.quote && project.quote.text && (
                <div className="bg-atlas-orange-soft/75 border-2 border-atlas-orange/30 rounded-[22px] p-8 sm:p-10 relative">
                  <Quote
                    className="w-10 h-10 text-atlas-orange mb-4"
                    strokeWidth={1.75}
                  />
                  <p className="text-lg sm:text-xl font-bold text-atlas-black italic leading-relaxed">
                    &ldquo;{project.quote.text}&rdquo;
                  </p>
                  <div className="mt-5 pt-4 border-t border-atlas-orange/20">
                    <p className="font-extrabold text-atlas-black text-sm sm:text-base">
                      {project.quote.author}
                    </p>
                    <p className="text-xs sm:text-sm text-atlas-ink/80">
                      {project.quote.role}
                      {project.quote.organisation && (
                        <>
                          {' '}
                          ·{' '}
                          <span className="font-bold text-atlas-orange">
                            {project.quote.organisation}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (4 cols sticky sidebar): Key Metrics, Linked Services, CTA */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              {/* Metrics Card */}
              {project.metrics.length > 0 && (
                <div className="bg-atlas-black text-white rounded-[22px] p-7 space-y-5 shadow-xl">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
                    {locale === 'en' ? 'PROJECT KEY FIGURES' : 'PROJECTKERNCIJFERS'}
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {project.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="border-l-2 border-atlas-orange pl-4 py-1"
                      >
                        <p className="text-2xl sm:text-3xl font-black text-atlas-orange tabular-nums tracking-tight">
                          {metric.value}
                        </p>
                        <p className="text-xs sm:text-sm text-neutral-300 font-semibold mt-0.5">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Services Card */}
              {linkedServices.length > 0 && (
                <div className="bg-atlas-grey rounded-[22px] p-7 border border-neutral-200 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
                    {ui.projects.deployedServices.toUpperCase()}
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {linkedServices.map((srv) => (
                      <Link
                        key={srv.slug}
                        href={getLocalizedPath('serviceDetail', locale, srv.slug)}
                        className="group bg-white hover:bg-atlas-orange-soft/60 border border-neutral-200 hover:border-atlas-orange rounded-xl px-4 py-3 flex items-center justify-between transition-all"
                      >
                        <span className="text-sm font-bold text-atlas-black group-hover:text-atlas-orange">
                          {srv.title}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-atlas-orange shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Box */}
              <div className="bg-atlas-orange text-white rounded-[22px] p-7 space-y-4 shadow-lg">
                <h3 className="text-xl font-extrabold text-white leading-snug">
                  {ui.projects.similarProjectTitle}
                </h3>
                <p className="text-sm text-white/95 leading-relaxed">
                  {ui.projects.similarProjectSub}
                </p>
                <Link
                  href={quoteHref}
                  className="w-full inline-flex items-center justify-center gap-2 bg-atlas-black hover:bg-neutral-900 text-white font-bold text-sm py-3.5 px-6 rounded-full transition-colors shadow-md"
                >
                  <span>{ui.nav.requestQuote}</span>
                  <ArrowUpRight className="w-4 h-4 text-atlas-orange" />
                </Link>
                {settings.phoneDisplay && (
                  <a
                    href={formatPhoneHref(settings.phoneDisplay)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-atlas-orange-soft text-atlas-black font-bold text-sm py-3 px-6 rounded-full transition-colors"
                  >
                    <Phone className="w-4 h-4 text-atlas-orange" />
                    <span>
                      {locale === 'en' ? 'Call:' : 'Bel:'} {settings.phoneDisplay}
                    </span>
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 4. FOTOGALERIJ (PHOTO GALLERY WITH LIGHTBOX) */}
      {gallery.length > 0 && (
        <section className="bg-atlas-grey py-16 md:py-24 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-2">
                {locale === 'en' ? 'ON-SITE PHOTOGRAPHY' : 'BEELDEN VANAF DE LOCATIE'}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-atlas-black tracking-tight">
                {locale === 'en' ? (
                  <>
                    Project <span className="text-atlas-orange">photo gallery</span>
                  </>
                ) : (
                  <>
                    Project <span className="text-atlas-orange">fotogalerij</span>
                  </>
                )}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, idx) => (
                <button
                  key={`${item.url}-${idx}`}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className="group text-left bg-white rounded-[18px] overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-atlas-orange"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <AtlasPhoto
                      src={item.url}
                      alt={item.alt || `${project.title} ${idx + 1}`}
                      className="w-full h-full"
                      imgClassName="group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-atlas-black/0 group-hover:bg-atlas-black/35 transition-colors flex items-center justify-center">
                      <span className="w-11 h-11 rounded-full bg-white/95 text-atlas-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Expand className="w-5 h-5 text-atlas-orange" />
                      </span>
                    </div>
                  </div>
                  {item.caption && (
                    <div className="p-4">
                      <p className="text-xs sm:text-sm font-medium text-atlas-ink line-clamp-2">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'en' ? 'Enlarged project photo' : 'Vergrote projectfoto'}
          className="fixed inset-0 z-50 bg-atlas-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
        >
          <div className="flex items-center justify-between text-white">
            <span className="text-xs sm:text-sm font-bold text-neutral-300">
              {locale === 'en'
                ? `Photo ${lightboxIndex + 1} of ${gallery.length}`
                : `Foto ${lightboxIndex + 1} van ${gallery.length}`}
            </span>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label={locale === 'en' ? 'Close photo view' : 'Sluit fotoweergave'}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-atlas-orange text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 max-h-[75vh]">
            {gallery.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label={locale === 'en' ? 'Previous photo' : 'Vorige foto'}
                className="absolute left-2 sm:left-4 z-10 w-12 h-12 rounded-full bg-atlas-black/75 hover:bg-atlas-orange text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative w-full max-w-5xl h-[65vh] rounded-2xl overflow-hidden">
              <AtlasPhoto
                src={gallery[lightboxIndex].url}
                alt={gallery[lightboxIndex].alt || project.title}
                className="w-full h-full"
                imgClassName="object-contain"
              />
            </div>

            {gallery.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                aria-label={locale === 'en' ? 'Next photo' : 'Volgende foto'}
                className="absolute right-2 sm:right-4 z-10 w-12 h-12 rounded-full bg-atlas-black/75 hover:bg-atlas-orange text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="text-center max-w-2xl mx-auto">
            {gallery[lightboxIndex].caption && (
              <p className="text-sm sm:text-base font-medium text-white">
                {gallery[lightboxIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 5. GERELATEERDE PROJECTEN */}
      {relatedProjects.length > 0 && (
        <section className="bg-white py-16 md:py-24 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-2">
                  {locale === 'en' ? 'MORE REFERENCES' : 'MEER REFERENTIES'}
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-atlas-black">
                  {locale === 'en' ? (
                    <>
                      Related <span className="text-atlas-orange">projects</span>
                    </>
                  ) : (
                    <>
                      Gerelateerde <span className="text-atlas-orange">projecten</span>
                    </>
                  )}
                </h2>
              </div>
              <Link
                href={getLocalizedPath('projects', locale)}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-atlas-orange hover:text-atlas-orange-dark"
              >
                <span>{ui.projects.allProjects}</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((rel, idx) => (
                <FadeIn key={rel.id} delay={idx * 0.06}>
                  <ProjectCard project={rel} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. ORANGE CTA BAND */}
      <CtaBand
        headline={
          locale === 'en'
            ? 'Need certified traffic controllers or a traffic plan for your project too?'
            : 'Ook voor uw project gecertificeerde verkeersregelaars of een verkeersplan nodig?'
        }
        buttonLabel={ui.nav.requestQuote}
        buttonHref={quoteHref}
      />
    </div>
  );
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm text-neutral-500">
          Loading...
        </div>
      }
    >
      <ProjectDetailInner slug={slug} />
    </Suspense>
  );
}
