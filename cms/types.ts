export type ServiceGroupKey = 'operationeel' | 'planning-advies' | 'totaaloplossingen';

export interface CmsImage {
  url: string;
  alt: string;
}

export interface CmsSeo {
  title: string;
  description: string;
  ogImage?: string;
}

export interface SocialChannelConfig {
  label: string;
  url: string;
  enabled: boolean;
}

export interface SiteSettings {
  companyName: string;
  shortName: string;
  tagline: string;
  foundingYear: string;
  logoLightUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  phoneDisplay: string;
  emailGeneral: string;
  emailCareers: string;
  addressStreet: string;
  addressPostalCity: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  kvk: string;
  btw: string;
  socials: {
    instagram: SocialChannelConfig;
    linkedin: SocialChannelConfig;
    tiktok: SocialChannelConfig;
    facebook: SocialChannelConfig;
  };
  utilityBarUrgentLabel: string;
  headerCtaLabel: string;
  mobileCallLabel: string;
  footerTagline: string;
  footerColServicesTitle: string;
  footerColCompanyTitle: string;
  footerColContactTitle: string;
  footerCopyright: string;
  defaultSeo: CmsSeo;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectGalleryItem {
  url: string;
  alt: string;
  caption?: string;
}

export interface ProjectQuote {
  text: string;
  author: string;
  role: string;
  organisation?: string;
}

export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface ProjectItem {
  id: string;
  slug: string;
  slugEn?: string;
  title: string;
  status: ProjectStatus;
  statusEn?: ProjectStatus;
  featured: boolean;
  displayOrder: number;
  category: string;
  serviceSlugs: string[];
  clientName: string;
  location: string;
  period: string;
  deploymentSummary: string;
  summary: string;
  challenge: string;
  approach: string;
  result: string;
  highlights: string[];
  metrics: ProjectMetric[];
  coverImage: CmsImage;
  gallery: ProjectGalleryItem[];
  quote?: ProjectQuote;
  seo: CmsSeo;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsServiceItem {
  id: string;
  slug: string;
  group: ServiceGroupKey;
  title: string;
  shortTitle: string;
  oneLiner: string;
  heroPromise: string;
  imageUrl: string;
  imageAlt: string;
  cardImage: CmsImage;
  heroImage: CmsImage;
  whatWeDoParagraphs: string[];
  whatWeDoBullets: string[];
  applications: {
    title: string;
    description: string;
    iconName: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedSlugs: string[];
  featuredOnHome: boolean;
  status: 'draft' | 'published';
  statusEn?: 'draft' | 'published';
  displayOrder: number;
  seo: CmsSeo;
  slugEn?: string;
}

export interface CmsVacancyItem {
  id: string;
  slug: string;
  slugEn?: string;
  title: string;
  region: string;
  hours: string;
  employmentType: string;
  startDate: string;
  tags: string[];
  summary: string;
  intro: string;
  whatYouDo: string[];
  whatWeAsk: string[];
  whatWeOffer: string[];
  heroImage: CmsImage;
  status: 'draft' | 'published';
  statusEn?: 'draft' | 'published';
  displayOrder: number;
}

export interface CmsCourseItem {
  id: string;
  title: string;
  duration: string;
  audience: string;
  description: string;
  highlights: string[];
  image: CmsImage;
  active: boolean;
  displayOrder: number;
}

export interface CmsTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  linkedinUrl: string;
  image: CmsImage;
  visible: boolean;
  displayOrder: number;
}

export interface CmsCertificateItem {
  id: string;
  code: string;
  title: string;
  description: string;
  visible: boolean;
}

export interface CmsClientLogoItem {
  id: string;
  name: string;
  imageUrl?: string;
  url?: string;
}

export interface CmsTestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  organisation: string;
  photoUrl?: string;
}

export interface HomePageContent {
  seo: CmsSeo;
  hero: {
    visible: boolean;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    trustBadges: string[];
    heroImage: CmsImage;
    sideCardImage: CmsImage;
    sideCardBadge: string;
  };
  keyFigures: {
    visible: boolean;
    items: {
      id: string;
      value: string;
      numericTarget: number | null;
      prefix?: string;
      suffix?: string;
      label: string;
      sublabel: string;
    }[];
  };
  servicesSection: {
    visible: boolean;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    allServicesLabel: string;
  };
  ctaBand: {
    visible: boolean;
    badge: string;
    headline: string;
    urgentPrefix: string;
    buttonLabel: string;
    buttonHref: string;
  };
  processSection: {
    visible: boolean;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    steps: {
      number: string;
      title: string;
      subtitle: string;
      description: string;
    }[];
  };
  featuredProjectsSection: {
    visible: boolean;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    buttonLabel: string;
    maxItems: 3 | 6;
  };
  audiencesSection: {
    visible: boolean;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    items: {
      title: string;
      benefit: string;
      iconName: string;
    }[];
  };
  whyAtlasSection: {
    visible: boolean;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: CmsImage;
    usps: {
      title: string;
      description: string;
      iconName: string;
    }[];
  };
  qualitySection: {
    visible: boolean;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    quote: string;
    certificates: CmsCertificateItem[];
  };
  photoBand: {
    visible: boolean;
    image: CmsImage;
    overlayQuote: string;
  };
  clientsSection: {
    visible: boolean;
    eyebrow: string;
    title: string;
    logos: CmsClientLogoItem[];
  };
  testimonialsSection: {
    visible: boolean;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    items: CmsTestimonialItem[];
  };
  recruitmentTeaser: {
    visible: boolean;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    highlights: string[];
    buttonLabel: string;
    buttonHref: string;
    image: CmsImage;
  };
  closingContact: {
    visible: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    buttonLabel: string;
    buttonHref: string;
    secondaryButtonLabel: string;
  };
}

export interface ServicesOverviewPageContent {
  seo: CmsSeo;
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: CmsImage;
  };
  groups: {
    key: ServiceGroupKey;
    title: string;
    description: string;
  }[];
}

export interface ProjectsOverviewPageContent {
  seo: CmsSeo;
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: CmsImage;
  };
  categories: string[];
  ctaHeadline: string;
  ctaButtonLabel: string;
}

export interface CoursesPageContent {
  seo: CmsSeo;
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: CmsImage;
  };
  introEyebrow: string;
  introTitleLine1: string;
  introTitleLine2: string;
  introText: string;
  formEyebrow: string;
  formTitleLine1: string;
  formTitleLine2: string;
  formSubtitle: string;
  formSuccessTitle: string;
  formSuccessMessage: string;
  ctaHeadline: string;
  ctaButtonLabel: string;
  courses: CmsCourseItem[];
}

export interface AboutPageContent {
  seo: CmsSeo;
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: CmsImage;
  };
  story: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
  };
  allUnderOneRoof: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    items: string[];
  };
  coreValues: {
    title: string;
    description: string;
    iconName: string;
  }[];
  pillars: {
    number: string;
    title: string;
    subtitle: string;
    description: string;
  }[];
  teamSection: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    members: CmsTeamMember[];
  };
}

export interface CareersPageContent {
  seo: CmsSeo;
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    buttonLabel: string;
    image: CmsImage;
  };
  whyAtlas: {
    title: string;
    description: string;
    iconName: string;
  }[];
  traits: {
    title: string;
    description: string;
  }[];
  processSteps: {
    number: string;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  formSection: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    successTitle: string;
    successMessage: string;
  };
}

export interface QuotePageContent {
  seo: CmsSeo;
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: CmsImage;
  };
  step1Title: string;
  step1Subtitle: string;
  step2Title: string;
  step2Subtitle: string;
  step3Title: string;
  step3Subtitle: string;
  sidebarBadge: string;
  sidebarTitle: string;
  sidebarText: string;
  sidebarCertificates: string[];
  successTitle: string;
  successMessage: string;
}

export interface ContactPageContent {
  seo: CmsSeo;
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: CmsImage;
  };
  cardsEyebrow: string;
  cardsTitle: string;
  phoneCardLabel: string;
  phoneCardSubtext: string;
  formEyebrow: string;
  formTitle: string;
  formSubtitle: string;
  formPrivacyNote: string;
  formSuccessTitle: string;
  formSuccessMessage: string;
  mapEyebrow: string;
}

export interface LegalDocumentContent {
  seo: CmsSeo;
  eyebrow: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: {
    heading: string;
    body: string;
    bullets?: string[];
  }[];
}

export interface PagesContent {
  home: HomePageContent;
  servicesOverview: ServicesOverviewPageContent;
  projectsOverview: ProjectsOverviewPageContent;
  courses: CoursesPageContent;
  about: AboutPageContent;
  careers: CareersPageContent;
  quote: QuotePageContent;
  contact: ContactPageContent;
  privacy: LegalDocumentContent;
  terms: LegalDocumentContent;
}

export interface MediaAsset {
  id: string;
  url: string;
  storagePath: string;
  filename: string;
  alt: string;
  altEn?: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  createdAt: string;
}

export type SubmissionType = 'quote' | 'contact' | 'application' | 'course';
export type SubmissionStatus = 'new' | 'in_progress' | 'handled';

export interface FormSubmission {
  id: string;
  type: SubmissionType;
  name: string;
  email: string;
  phone: string;
  payload: Record<string, unknown>;
  status: SubmissionStatus;
  createdAt: string;
}

export interface CmsSnapshot {
  settings: SiteSettings;
  pages: PagesContent;
  projects: ProjectItem[];
  services: CmsServiceItem[];
  vacancies: CmsVacancyItem[];
  settingsEn?: SiteSettings;
  pagesEn?: PagesContent;
  projectsEn?: ProjectItem[];
  servicesEn?: CmsServiceItem[];
  vacanciesEn?: CmsVacancyItem[];
  media: MediaAsset[];
  submissions: FormSubmission[];
}
