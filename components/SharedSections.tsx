'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useInView } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Landmark,
  HardHat,
  Zap,
  CalendarCheck,
  Clock,
  ShieldCheck,
  UserCheck,
  PhoneCall,
  Route,
  Building2,
  Signpost,
  Wrench,
  ShieldAlert,
  Cone,
  Footprints,
  FileCheck2,
  Layers,
  MapPinned,
  Building,
  Award,
  Compass,
  GitBranch,
  Network,
  Timer,
  Truck,
  ClipboardCheck,
  Lock,
  TrainTrack,
  TreePine,
  AlertTriangle,
  Music,
  Users,
  Flag,
  ParkingCircle,
  ShoppingBag,
  Briefcase,
  Bike,
  Trophy,
  Navigation,
  Siren,
  Hammer,
  TrafficCone,
  HeartHandshake,
  RefreshCw,
  Wallet,
  GraduationCap,
  Shirt,
  Quote,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useCms, formatPhoneHref } from '@/cms/CmsContext';
import { CmsServiceItem, ProjectItem } from '@/cms/types';
import { getLocalizedPath, localizeHref } from '@/i18n/routes';
import { PUBLIC_UI } from '@/i18n/dictionary';
import { AtlasPhoto } from './AtlasPhoto';
import { SwooshArcBackdrop, SwooshUnderline } from './AtlasLogo';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Landmark,
  HardHat,
  Zap,
  CalendarCheck,
  Clock,
  ShieldCheck,
  UserCheck,
  PhoneCall,
  Route,
  Building2,
  Signpost,
  Wrench,
  ShieldAlert,
  Cone,
  Footprints,
  FileCheck2,
  Layers,
  MapPinned,
  Building,
  Award,
  Compass,
  GitBranch,
  Network,
  Timer,
  Truck,
  ClipboardCheck,
  Lock,
  TrainTrack,
  TreePine,
  AlertTriangle,
  Music,
  Users,
  Flag,
  ParkingCircle,
  ShoppingBag,
  Briefcase,
  Bike,
  Trophy,
  Navigation,
  Siren,
  Hammer,
  TrafficCone,
  HeartHandshake,
  RefreshCw,
  Wallet,
  GraduationCap,
  Shirt,
};

export function DynamicIcon({
  name,
  className = 'w-6 h-6',
}: {
  name: string;
  className?: string;
}) {
  const IconComp = ICON_MAP[name] || ShieldCheck;
  return <IconComp className={className} strokeWidth={1.75} />;
}

/**
 * Scroll-reveal wrapper that respects prefers-reduced-motion.
 */
export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Reusable PageHero for inner pages and service detail pages.
 */
export function PageHero({
  eyebrow,
  titleLine1,
  titleLine2,
  subtitle,
  imageUrl,
  imageAlt,
  primaryCta,
  secondaryCta,
  showPhoneCta = false,
}: {
  eyebrow: string;
  titleLine1: string;
  titleLine2?: string;
  subtitle: string;
  imageUrl?: string;
  imageAlt?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  showPhoneCta?: boolean;
}) {
  const { settings } = useCms();

  return (
    <section className="relative bg-atlas-black text-white overflow-hidden py-16 md:py-24">
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <AtlasPhoto
            src={imageUrl}
            alt={imageAlt || titleLine1}
            priority
            className="w-full h-full"
            imgClassName="opacity-35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-atlas-black via-atlas-black/90 to-atlas-black/55"
          />
        </div>
      )}

      <SwooshArcBackdrop className="absolute -right-24 -bottom-28 w-[420px] h-[420px] opacity-25 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-atlas-orange mb-3">
            {eyebrow}
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-balance">
            <span className="block text-white">{titleLine1}</span>
            {titleLine2 && (
              <span className="inline-block text-atlas-orange mt-1">
                {titleLine2}
                <SwooshUnderline />
              </span>
            )}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          {(primaryCta || secondaryCta || (showPhoneCta && settings.phoneDisplay)) && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-full transition-colors shadow-md whitespace-nowrap"
                >
                  <span>{primaryCta.label}</span>
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              )}

              {showPhoneCta && settings.phoneDisplay && (
                <a
                  href={formatPhoneHref(settings.phoneDisplay)}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full transition-colors whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-atlas-orange" strokeWidth={1.75} />
                  <span>Bel direct: {settings.phoneDisplay}</span>
                </a>
              )}

              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full transition-colors whitespace-nowrap"
                >
                  <span>{secondaryCta.label}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Photo-led Service Card:
 * rounded corners (18px), image on top, bold title, one-line description,
 * text link "Meer info →", soft shadow and lift on hover.
 */
export function ServiceCard({ service }: { service: CmsServiceItem }) {
  const imgUrl = service.cardImage?.url || service.imageUrl;
  const imgAlt = service.cardImage?.alt || service.imageAlt || service.title;

  return (
    <Link
      href={`/diensten/${service.slug}`}
      className="group bg-white rounded-[18px] border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-atlas-orange"
    >
      <div className="aspect-[16/10] w-full overflow-hidden">
        <AtlasPhoto
          src={imgUrl}
          alt={imgAlt}
          className="w-full h-full"
          imgClassName="group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xl font-bold text-atlas-black group-hover:text-atlas-orange transition-colors">
            {service.title}
          </h3>
          <p className="mt-2 text-sm text-atlas-ink/85 leading-relaxed line-clamp-2">
            {service.oneLiner}
          </p>
        </div>
        <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-atlas-orange group-hover:gap-2.5 transition-all">
            <span>Meer info</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Photo-led Project Card:
 * Matches the Atlas Holland visual system with 16:10 cover photo, category label,
 * location & period metadata, bold Montserrat title, deployment highlight, and "Bekijk project →".
 */
export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <Link
      href={`/projecten/${project.slug}`}
      className="group bg-white rounded-[18px] border border-neutral-200/85 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-atlas-orange"
    >
      <div className="aspect-[16/10] w-full overflow-hidden relative">
        <AtlasPhoto
          src={project.coverImage?.url}
          alt={project.coverImage?.alt || project.title}
          className="w-full h-full"
          imgClassName="group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 z-10 bg-atlas-black/85 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/15">
          {project.category}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 font-medium mb-2.5">
            {project.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-atlas-orange shrink-0" strokeWidth={1.75} />
                <span>{project.location}</span>
              </span>
            )}
            {project.location && project.period && (
              <span aria-hidden="true">·</span>
            )}
            {project.period && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-atlas-orange shrink-0" strokeWidth={1.75} />
                <span>{project.period}</span>
              </span>
            )}
          </div>

          <h3 className="text-xl font-extrabold text-atlas-black group-hover:text-atlas-orange transition-colors leading-snug">
            {project.title}
          </h3>

          <p className="mt-2.5 text-sm text-atlas-ink/85 leading-relaxed line-clamp-2">
            {project.summary}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-neutral-100 space-y-3">
          {project.deploymentSummary && (
            <p className="text-xs font-bold text-atlas-ink bg-atlas-orange-soft/75 px-3 py-1.5 rounded-lg inline-block">
              {project.deploymentSummary}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-atlas-orange group-hover:gap-2.5 transition-all">
              <span>Bekijk project</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Repeated Orange CTA Band (reads defaults from CMS pages.home.ctaBand & settings.phoneDisplay)
 */
export function CtaBand({
  headline,
  buttonLabel,
  buttonHref,
}: {
  headline?: string;
  buttonLabel?: string;
  buttonHref?: string;
}) {
  const { pages, settings } = useCms();
  const band = pages.home.ctaBand;

  const finalHeadline = headline || band.headline;
  const finalButtonLabel = buttonLabel || band.buttonLabel;
  const finalButtonHref = buttonHref || band.buttonHref || '/offerte-aanvragen';

  return (
    <section className="bg-atlas-orange text-white py-10 md:py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            {band.badge && (
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-atlas-black/20 text-white px-3 py-1 rounded-md">
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>{band.badge}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
              {finalHeadline}
            </h2>
            {settings.phoneDisplay && (
              <p className="text-sm sm:text-base text-white/95 font-medium">
                {band.urgentPrefix}{' '}
                <a
                  href={formatPhoneHref(settings.phoneDisplay)}
                  className="font-extrabold underline hover:text-atlas-black transition-colors whitespace-nowrap"
                >
                  {settings.phoneDisplay}
                </a>{' '}
                (24/7 bereikbaar)
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href={finalButtonHref}
              className="inline-flex items-center gap-2 bg-atlas-black hover:bg-neutral-900 text-white font-bold text-sm sm:text-base px-7 py-4 rounded-full transition-colors shadow-lg whitespace-nowrap"
            >
              <span>{finalButtonLabel}</span>
              <ArrowUpRight className="w-4 h-4 text-atlas-orange" strokeWidth={2.25} />
            </Link>
            {settings.phoneDisplay && (
              <a
                href={formatPhoneHref(settings.phoneDisplay)}
                className="inline-flex items-center gap-2 bg-white hover:bg-atlas-orange-soft text-atlas-black font-bold text-sm sm:text-base px-6 py-4 rounded-full transition-colors whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-atlas-orange" strokeWidth={2} />
                <span>{settings.phoneDisplay}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 3-Step Process Section ("Van verkeersplan tot uitvoering. Volledig ontzorgd.")
 */
export function ProcessSteps({
  eyebrow,
  titleLine1,
  titleLine2,
  subtitle,
  bgClass = 'bg-white',
}: {
  eyebrow?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  bgClass?: string;
}) {
  const { pages } = useCms();
  const proc = pages.home.processSection;

  const finalEyebrow = eyebrow || proc.eyebrow;
  const finalTitle1 = titleLine1 || proc.titleLine1;
  const finalTitle2 = titleLine2 || proc.titleLine2;
  const finalSubtitle = subtitle !== undefined ? subtitle : proc.subtitle;

  return (
    <section className={`${bgClass} py-16 md:py-24`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-3">
            {finalEyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-atlas-black tracking-tight text-balance">
            {finalTitle1}{' '}
            <span className="text-atlas-orange">{finalTitle2}</span>
          </h2>
          {finalSubtitle && (
            <p className="mt-4 text-base sm:text-lg text-atlas-ink/85 leading-relaxed">
              {finalSubtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {proc.steps.map((step, index) => (
            <FadeIn key={`${step.number}-${index}`} delay={index * 0.1}>
              <div className="relative bg-atlas-grey rounded-[20px] p-8 h-full border border-neutral-200/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="text-5xl font-black text-atlas-orange tabular-nums tracking-tight">
                      {step.number}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      Stap {index + 1} van {proc.steps.length}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-atlas-black">
                    {step.title}
                  </h3>
                  <p className="text-sm font-semibold text-atlas-orange mt-1">
                    {step.subtitle}
                  </p>
                  <p className="mt-4 text-sm sm:text-base text-atlas-ink/85 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Animated Key Figures Strip with Count-Up (CMS driven)
 */
export function KeyFiguresStrip() {
  const { pages } = useCms();
  const { items, visible } = pages.home.keyFigures;

  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;
    let current = 0;
    const interval = setInterval(() => {
      current += 4;
      if (current >= 100) {
        setProgress(100);
        clearInterval(interval);
      } else {
        setProgress(current);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [isInView, shouldReduceMotion]);

  if (!visible || items.length === 0) return null;

  const ratio = shouldReduceMotion ? 1 : progress / 100;

  return (
    <section
      ref={ref}
      aria-label="Kerncijfers Atlas Holland B.V."
      className="bg-atlas-black text-white border-b border-white/10 py-10 md:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-center border-l-2 border-atlas-orange/60 pl-5"
            >
              <p className="text-2xl sm:text-4xl font-black text-atlas-orange tabular-nums tracking-tight">
                {item.numericTarget
                  ? `${item.prefix || ''}${Math.round(item.numericTarget * ratio)}${item.suffix || ''}`
                  : item.value}
              </p>
              <p className="mt-1 text-sm sm:text-base font-bold text-white">
                {item.label}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">{item.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Infinite Greyscale Logo Marquee (CMS driven; supports uploaded logo images or clean text lockups)
 */
export function LogoMarquee() {
  const { pages } = useCms();
  const { visible, eyebrow, title, logos } = pages.home.clientsSection;

  if (!visible || logos.length === 0) return null;

  const doubled = [...logos, ...logos];

  return (
    <section className="bg-white py-16 md:py-20 border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-2">
          {eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-atlas-black">
          {title}
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee flex items-center gap-6 px-4">
          {doubled.map((logoItem, index) => (
            <div
              key={`${logoItem.id}-${index}`}
              className="group shrink-0 h-20 px-8 rounded-2xl bg-atlas-grey border border-neutral-200 flex items-center justify-center grayscale hover:grayscale-0 hover:border-atlas-orange hover:bg-atlas-orange-soft/50 transition-all duration-200 cursor-default"
            >
              <div className="flex items-center gap-3">
                {logoItem.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoItem.imageUrl}
                    alt={logoItem.name}
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-atlas-orange/20 group-hover:bg-atlas-orange text-atlas-orange group-hover:text-white flex items-center justify-center font-black text-xs transition-colors">
                    NL
                  </div>
                )}
                <span className="text-xs sm:text-sm font-bold text-neutral-600 group-hover:text-atlas-black tracking-wide whitespace-nowrap transition-colors">
                  {logoItem.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Testimonial Slider (CMS driven)
 */
export function TestimonialSlider() {
  const { pages } = useCms();
  const { visible, eyebrow, titleLine1, titleLine2, items } =
    pages.home.testimonialsSection;
  const [activeIndex, setActiveIndex] = useState(0);

  if (!visible || items.length === 0) return null;

  const safeIndex = activeIndex >= items.length ? 0 : activeIndex;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev >= items.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-atlas-grey py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-3">
              {eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-atlas-black tracking-tight">
              {titleLine1}{' '}
              <span className="text-atlas-orange">{titleLine2}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Vorige referentie"
              className="w-11 h-11 rounded-full bg-white border border-neutral-200 hover:border-atlas-orange text-atlas-black hover:text-atlas-orange flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Volgende referentie"
              className="w-11 h-11 rounded-full bg-white border border-neutral-200 hover:border-atlas-orange text-atlas-black hover:text-atlas-orange flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const isActive = idx === safeIndex;
            return (
              <div
                key={item.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={`rounded-[20px] p-8 transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-2 border-atlas-orange shadow-lg'
                    : 'bg-white/80 border border-neutral-200 opacity-90 hover:opacity-100'
                }`}
              >
                <div>
                  <Quote
                    className="w-8 h-8 text-atlas-orange mb-4"
                    strokeWidth={1.75}
                  />
                  <p className="text-base text-atlas-ink leading-relaxed italic">
                    {item.quote}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-3">
                  {item.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-bold text-atlas-black text-sm">{item.name}</p>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      {item.role}
                      {item.organisation && (
                        <>
                          {' '}
                          ·{' '}
                          <span className="font-semibold text-atlas-orange">
                            {item.organisation}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Reusable FAQ Accordion
 */
export function FaqAccordion({
  eyebrow = 'VEELGESTELDE VRAGEN',
  title = 'Antwoorden op uw vragen',
  faqs,
}: {
  eyebrow?: string;
  title?: string;
  faqs: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange mb-2">
          {eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-atlas-black">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden transition-colors"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-atlas-grey/50 transition-colors"
              >
                <span className="font-bold text-base sm:text-lg text-atlas-black">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-atlas-orange shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  strokeWidth={2}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-atlas-ink/90 leading-relaxed border-t border-neutral-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
