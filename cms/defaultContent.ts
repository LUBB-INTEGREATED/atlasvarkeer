import { NL_CONTENT } from '@/content/nl';
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
import {
  DEFAULT_SETTINGS_EN,
  DEFAULT_PAGES_EN,
  DEFAULT_PROJECTS_EN,
  DEFAULT_SERVICES_EN,
  DEFAULT_VACANCIES_EN,
} from './defaultContentEn';

export const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'Atlas Holland B.V.',
  shortName: 'Atlas Holland',
  tagline: 'Van verkeersplan tot uitvoering. Volledig ontzorgd.',
  foundingYear: '2018',
  logoLightUrl: '/assets/aistudio/image_2652d4a1.png',
  logoDarkUrl: '',
  faviconUrl: '/favicon.ico',
  phoneDisplay: '085 - 060 24 70',
  emailGeneral: 'info@atlasholland.nl',
  emailCareers: 'werkenbij@atlasholland.nl',
  addressStreet: 'ambachtsweg 14',
  addressPostalCity: '3542 AD Utrecht',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Atlas+Holland+BV+Nederland',
  googleMapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d623755.349013426!2d4.4922854!3d52.1551723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c3db87e4bb%3A0xb3a175ceffbd0a9f!2sNederland!5e0!3m2!1snl!2snl!4v1710000000000!5m2!1snl!2snl',
  kvk: '89140219',
  btw: 'NL864891402B01',
  socials: {
    instagram: {
      label: '@atlasholland',
      url: 'https://instagram.com',
      enabled: true,
    },
    linkedin: {
      label: 'Atlas Holland B.V.',
      url: 'https://linkedin.com',
      enabled: true,
    },
    tiktok: {
      label: '@atlasholland',
      url: 'https://tiktok.com',
      enabled: true,
    },
    facebook: {
      label: 'Atlas Holland',
      url: 'https://facebook.com',
      enabled: true,
    },
  },
  utilityBarUrgentLabel: 'Spoed? Bel 24/7:',
  headerCtaLabel: 'Offerte aanvragen',
  mobileCallLabel: 'Bel direct',
  footerTagline: 'Van verkeersplan tot uitvoering. Volledig ontzorgd.',
  footerColServicesTitle: 'Diensten',
  footerColCompanyTitle: 'Atlas',
  footerColContactTitle: 'Contact & 24/7 Spoed',
  footerCopyright: '© 2026 Atlas Holland B.V. Alle rechten voorbehouden.',
  defaultSeo: {
    title: 'Atlas Holland B.V. | Verkeersregelaars, Verkeersplannen & Infra Veiligheid',
    description:
      'Gecertificeerde verkeersregelaars en complete verkeersoplossingen voor infra, bouw, evenementen en calamiteiten. Landelijk inzetbaar en 24/7 bereikbaar.',
    ogImage: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
  },
};

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    slug: 'kruispuntreconstructie-n201-noord-holland',
    title: 'Gefaseerde kruispuntreconstructie & asfaltwerk N201',
    status: 'published',
    featured: true,
    displayOrder: 1,
    category: 'Infra & wegenbouw',
    serviceSlugs: [
      'verkeersregelaars',
      'tijdelijke-verkeersmaatregelen',
      'verkeersplannen',
      'projectcoordinatie',
    ],
    clientName: 'Hoofdaannemer Wegenbouw & Provincie Noord-Holland',
    location: 'Regio Aalsmeer / Uithoorn (N201)',
    period: 'Voorjaar & Zomer 2026 (6 weken)',
    deploymentSummary: '14 verkeersregelaars · 6 weken · 24/7 fasering',
    summary:
      'Volledige verkeersregie, CROW 96b-conforme afzettingen en 24-uurs inzet van gecertificeerde verkeersregelaars tijdens een complexe meerfasige kruispuntreconstructie.',
    challenge:
      'De N201 is een van de drukste provinciale verkeersaders in de regio, met zwaar vrachtverkeer naar de bloemenveiling, hoogfrequent busvervoer en kruisende schoolfietsroutes. Tijdens de herinrichting van drie opeenvolgende kruispunten moest ten minste één rijrichting plus een vrije HOV-busbaan continu operationeel blijven.',
    approach:
      'Atlas Holland stelde vooraf voor alle vier de bouwfasen gedetailleerde verkeersplannen en bebordingstekeningen op. Tijdens de uitvoering werkten wij met een vaste poule van 14 landelijk gecertificeerde beroepsverkeersregelaars en één vaste projectcoördinator op locatie die dagelijks schakelde met de hoofduitvoerder.',
    result:
      'Het project is binnen de geplande zes weken opgeleverd met nul veiligheidsincidenten, een stipte doorgang voor lijnbussen en nood- en hulpdiensten, en minimale wachtrijvorming in de ochtend- en avondspits.',
    highlights: [
      'Volledig CROW 96b-conform verkeersplan inclusief goedkeuring wegbeheerder binnen 5 werkdagen',
      'Vaste poule van 14 gecertificeerde verkeersregelaars in dag-, avond- en weekenddiensten',
      'Prioriteitsregeling voor HOV-buslijnen en hulpdiensten via onderlinge portofoonverbinding',
      'Dagelijkse schouwronde en onderhoud van alle geleidebakens, tekstkarren en vooraankondigingen',
    ],
    metrics: [
      { label: 'Verkeersregelaars', value: '14 vakmensen' },
      { label: 'Looptijd project', value: '6 weken' },
      { label: 'Veiligheidsincidenten', value: '0 incidenten' },
      { label: 'Voertuigen per etmaal', value: 'ca. 32.000' },
    ],
    coverImage: {
      url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
      alt: 'Tijdelijke verkeersmaatregelen en geleidebakens bij kruispuntreconstructie N201',
    },
    gallery: [
      {
        url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
        alt: 'CROW-conforme rijbaanafzetting met geleidebakens en barriers',
        caption: 'Fase 1: Scheiding van werkvak en doorgaande rijstrook met CROW-geleidebakens.',
      },
      {
        url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
        alt: 'Dagelijkse afstemming van het verkeersplan op locatie',
        caption: 'Onze projectcoördinator stemt de weekendfasering af met de hoofduitvoerder.',
      },
      {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: 'Verkeersregelaars begeleiden fietsers en autoverkeer',
        caption: 'Veilige begeleiding van kruisend fietsverkeer tijdens de spitsuren.',
      },
    ],
    quote: {
      text: 'Tijdens onze zesweekse reconstructie zorgde Atlas Holland niet alleen voor een waterdicht verkeersplan, maar ook voor een vast team verkeersregelaars dat elke fase tot in de puntjes kende.',
      author: 'Mark van den Berg',
      role: 'Senior Projectleider Infra',
      organisation: 'Wegenbouw Combinatie Noord-Holland',
    },
    seo: {
      title: 'Project: Kruispuntreconstructie N201 | Atlas Holland B.V.',
      description:
        'Bekijk hoe Atlas Holland B.V. met 14 verkeersregelaars en CROW-conforme verkeersmaatregelen de reconstructie van de N201 veilig en volgens planning begeleidde.',
    },
    publishedAt: '2026-09-15T09:00:00Z',
    createdAt: '2026-09-10T09:00:00Z',
    updatedAt: '2026-09-15T09:00:00Z',
  },
  {
    id: 'proj-2',
    slug: 'binnenstedelijke-bouwlogistiek-en-bouwportiers-rotterdam',
    title: 'Binnenstedelijke bouwlogistiek, BLVC & bouwportiers hoogbouwproject',
    status: 'published',
    featured: true,
    displayOrder: 2,
    category: 'Bouw',
    serviceSlugs: ['bouwportier', 'blvc-plannen', 'verkeersregelaars'],
    clientName: 'Ontwikkelende Bouwgroep Randstad',
    location: 'Rotterdam Centrum',
    period: 'Doorlopend sinds januari 2026 (18 maanden)',
    deploymentSummary: '4 vaste bouwportiers · BLVC-plan · Dagdienst',
    summary:
      'Integrale poortregie, bezoekersregistratie en veilige kruising met een druk stedelijk fietspad voor een binnenstedelijke woontoren in hartje Rotterdam.',
    challenge:
      'De enige bouwinrit van dit hoogbouwproject grenst direct aan een hoofdroute voor stadsfietsers, voetgangers en een trambaan. Met gemiddeld 45 zware beton- en prefabtransporten per dag was strikte just-in-time toegangscontrole en verkeersbegeleiding essentieel voor de gemeentelijke BLVC-vergunning.',
    approach:
      'Atlas Holland schreef het uitvoeringsgerichte BLVC-plan en bemant beide bouwpoorten dagelijks met vaste bouwportiers die tevens een landelijke aanstellingspas als beroepsverkeersregelaar bezitten. Bij elk in- en uitrijdend vrachttransport zetten zij het kruisende fiets- en autoverkeer kort en veilig stil.',
    result:
      'Een strak georganiseerde bouwplaats zonder opstoppingen op de openbare weg, 100% sluitende digitale poortregistratie en hoge waardering vanuit de gemeentelijke BLVC-toezichthouder en omwonenden.',
    highlights: [
      'Dubbelfunctie aan de poort: toegangscontrole én landelijk bevoegd verkeersregelaar',
      'Uitvoeringsgericht BLVC-plan goedgekeurd door Gemeente Rotterdam',
      'Veilige begeleiding van meer dan 200 zware bouwtransporten per week',
      'Strikte controle op bouwplaatskaarten, ID-plicht en verplichte PBM’s',
    ],
    metrics: [
      { label: 'Vaste bouwportiers', value: '4 specialisten' },
      { label: 'Transporten per week', value: '220+ vrachten' },
      { label: 'Projectduur', value: '18 maanden' },
      { label: 'BLVC-audits', value: '100% conform' },
    ],
    coverImage: {
      url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
      alt: 'Bouwportier van Atlas Holland begeleidt vrachtwagen bij bouwinrit in Rotterdam',
    },
    gallery: [
      {
        url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
        alt: 'Bouwportier bij Bouwinrit 1 in Rotterdam',
        caption: 'Vaste bouwportier begeleidt just-in-time vrachtverkeer bij Bouwinrit 1.',
      },
      {
        url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
        alt: 'BLVC-afstemming en bouwlogistieke routekaart',
        caption: 'Wekelijkse afstemming van kraanmomenten en aanrijroutes op de bouwplaats.',
      },
    ],
    quote: {
      text: 'Onze bouwportiers van Atlas zijn het visitekaartje aan de poort. Ze kennen elke vaste chauffeur, houden het fietspad veilig en zorgen dat de bouwlogistiek nooit stilvalt.',
      author: 'Sander Korteweg',
      role: 'Hoofduitvoerder Hoogbouw',
      organisation: 'Bouwgroep Randstad',
    },
    seo: {
      title: 'Project: Bouwportiers & BLVC Hoogbouw Rotterdam | Atlas Holland B.V.',
      description:
        'Hoe Atlas Holland B.V. met vaste gecertificeerde bouwportiers en een sluitend BLVC-plan de bouwlogistiek in Rotterdam Centrum veilig in goede banen leidt.',
    },
    publishedAt: '2026-10-02T10:00:00Z',
    createdAt: '2026-09-28T10:00:00Z',
    updatedAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'proj-3',
    slug: 'verkeersmanagement-en-parkeerregie-stadsfestival-utrecht',
    title: 'Compleet verkeers- en parkeermanagement driedaags stadsfestival',
    status: 'published',
    featured: true,
    displayOrder: 3,
    category: 'Evenementen',
    serviceSlugs: ['evenementen', 'parkeerbegeleiding', 'verkeersregelaars', 'verkeersplannen'],
    clientName: 'Festivalorganisatie & Gemeente Utrecht',
    location: 'Utrecht',
    period: 'Augustus 2026 (3 dagen)',
    deploymentSummary: '28 medewerkers · 35.000 bezoekers · Mobiliteitsplan',
    summary:
      'Van het vergunningsgerede mobiliteitsplan tot gastvrije parkeerbegeleiding, Kiss & Ride-regie en een veilige nachtelijke uitstroom voor 35.000 bezoekers.',
    challenge:
      'Met 35.000 bezoekers verspreid over drie festivaldagen moesten bezoekersstromen, pendelbussen, fietsers en artiestenlogistiek strikt van elkaar worden gescheiden, terwijl de omliggende woonwijken vrij bleven van zoekverkeer en de calamiteitenroute 100% vrij bleef.',
    approach:
      'Atlas Holland verzorgde het evenementenverkeersplan voor de gemeentelijke vergunning, plaatste alle tekstkarren en geleoliede parkeerverwijzingen, en zette een team van 28 verkeersregelaars en parkeerbegeleiders in onder leiding van twee terreincoördinatoren.',
    result:
      'Vlotte instroom zonder wachtrijen op de hoofdrijbaan, een gemiddelde uitrijtijd van minder dan 15 minuten bij sluiting en complimenten van zowel bezoekers als de veiligheidsregio.',
    highlights: [
      'Scheiding van pendelbussen, Kiss & Ride, fietsers en crew-transport',
      '28 gastvrije verkeersregelaars en parkeerbegeleiders tijdens piekuren',
      'Continue vrijhouding van de calamiteitenroute voor hulpdiensten',
      'Volledige plaatsing en na afloop directe verwijdering van tekstwagens en bebording',
    ],
    metrics: [
      { label: 'Bezoekers', value: '35.000 gasten' },
      { label: 'Ingezet team', value: '28 medewerkers' },
      { label: 'Gem. uitstroomtijd', value: '< 15 minuten' },
      { label: 'Festivaldagen', value: '3 dagen' },
    ],
    coverImage: {
      url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
      alt: 'Verkeersregelaars van Atlas Holland begeleiden bezoekersstromen in Utrecht',
    },
    gallery: [
      {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: 'Gastvrije verkeersregelaars op de aanrijroute van het evenement',
        caption: 'Duidelijke en vriendelijke verwijzing voor fietsers en automobilisten.',
      },
      {
        url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
        alt: 'Coördinatieteam van Atlas Holland voor aanvang van de dienst',
        caption: 'Ons evenemententeam vlak voor de briefing aan het begin van de festivaldag.',
      },
    ],
    quote: {
      text: 'Voor ons festival heeft Atlas Holland de volledige parkeer- en pendelbusstroom begeleid. Gastvrije mensen die ook op het drukste uitstroommoment rust en overzicht bewaren.',
      author: 'Eva Lindeman',
      role: 'Operationeel Producent',
      organisation: 'Stadsfestival Utrecht',
    },
    seo: {
      title: 'Project: Verkeersmanagement Stadsfestival Utrecht | Atlas Holland B.V.',
      description:
        'Ontdek hoe Atlas Holland B.V. met 28 verkeersregelaars en parkeerbegeleiders 35.000 festivalbezoekers in Utrecht veilig en gastvrij begeleidde.',
    },
    publishedAt: '2026-10-18T14:00:00Z',
    createdAt: '2026-10-15T14:00:00Z',
    updatedAt: '2026-10-18T14:00:00Z',
  },
  {
    id: 'proj-4',
    slug: 'spoedinzet-hoofdwaterleidingbreuk-amsterdam-zuid',
    title: '24/7 Spoedinzet & noodafzetting bij hoofdwaterleidingbreuk',
    status: 'draft',
    featured: false,
    displayOrder: 4,
    category: 'Calamiteiten',
    serviceSlugs: ['calamiteiten', 'verkeersregelaars', 'tijdelijke-verkeersmaatregelen'],
    clientName: 'Regionaal Nutsbedrijf & Netbeheerder',
    location: 'Amsterdam-Zuid',
    period: 'Oktober 2026 (72 uur spoedinzet)',
    deploymentSummary: '6 verkeersregelaars · Binnen 75 min ter plaatse · 24/7',
    summary:
      'Directe nachtelijke spoedafzetting en 72-uurs verkeersregeling na een acute leidingbreuk op een stedelijk hoofdkruispunt in Amsterdam-Zuid.',
    challenge:
      'Op vrijdagavond om 22:15 uur ontstond een grote waterleidingbreuk waardoor een kruispunt en trambaan deels onderliepen. Storingsmonteurs moesten direct een veilig werkvak krijgen terwijl het avondverkeer en nachtbussen veilig moesten worden omgeleid.',
    approach:
      'Binnen 75 minuten na de spoedmelding op onze 24/7 centrale stonden vier verkeersregelaars en onze calamiteitenwagen met noodbebording en bakens op locatie. Gedurende het hele weekend is de locatie 24 uur per dag bemand in ploegendiensten.',
    result:
      'De storingsploegen konden onmiddellijk veilig graven en herstellen. Maandagochtend vóór de ochtendspits was het kruispunt hersteld en volledig vrijgegeven.',
    highlights: [
      'Binnen 75 minuten na telefonische spoedmelding volledig operationeel op locatie',
      '72 uur onafgebroken bezetting in dag- en nachtdiensten',
      'Directe afstemming met hulpdiensten, gemeentelijke handhaving en OV-verkeersleiding',
    ],
    metrics: [
      { label: 'Aanrijtijd spoed', value: '75 minuten' },
      { label: 'Continue bezetting', value: '72 uur (24/7)' },
      { label: 'Verkeersregelaars', value: '6 per etmaal' },
    ],
    coverImage: {
      url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
      alt: 'Spoedafzetting bij calamiteit en herstelwerkzaamheden',
    },
    gallery: [
      {
        url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
        alt: 'Spoedafzetting langs de rijbaan',
        caption: 'Noodafzetting en veilige werkzone voor de storingsmonteurs.',
      },
    ],
    seo: {
      title: 'Project: 24/7 Spoedinzet Calamiteit Amsterdam | Atlas Holland B.V.',
      description:
        'Case study van een 24/7 calamiteiteninzet door Atlas Holland B.V. in Amsterdam-Zuid.',
    },
    publishedAt: '',
    createdAt: '2026-11-01T11:00:00Z',
    updatedAt: '2026-11-01T11:00:00Z',
  },
];

export const DEFAULT_SERVICES: CmsServiceItem[] = NL_CONTENT.services.map((s, idx) => ({
  id: `srv-${idx + 1}`,
  slug: s.slug,
  group: s.group,
  title: s.title,
  shortTitle: s.shortTitle,
  oneLiner: s.oneLiner,
  heroPromise: s.heroPromise,
  imageUrl: s.imageUrl,
  imageAlt: s.imageAlt,
  cardImage: {
    url: s.imageUrl,
    alt: s.imageAlt,
  },
  heroImage: {
    url: s.imageUrl,
    alt: s.imageAlt,
  },
  whatWeDoParagraphs: s.whatWeDoParagraphs,
  whatWeDoBullets: s.whatWeDoBullets,
  applications: s.applications,
  faqs: s.faqs,
  relatedSlugs: s.relatedSlugs,
  featuredOnHome: s.featuredOnHome,
  status: 'published',
  displayOrder: idx + 1,
  seo: {
    title: `${s.title} | Diensten | Atlas Holland B.V.`,
    description: s.heroPromise,
  },
}));

export const DEFAULT_VACANCIES: CmsVacancyItem[] = NL_CONTENT.werkenBijPage.vacancies.map(
  (v, idx) => ({
    id: `vac-${idx + 1}`,
    slug: v.slug,
    title: v.title,
    region: v.region.replace('[PLAATS]', 'Utrecht'),
    hours: v.hours,
    employmentType: 'Fulltime / Parttime',
    startDate: v.startDate,
    tags: v.tags,
    summary: v.summary,
    intro: v.intro,
    whatYouDo: v.whatYouDo,
    whatWeAsk: v.whatWeAsk,
    whatWeOffer: v.whatWeOffer.map((b) =>
      b
        .replace('[€ XX,XX – € XX,XX]', '€ 16,50 – € 21,50')
        .replace('[€ X.XXX – € X.XXX]', '€ 3.100 – € 4.200')
    ),
    heroImage: {
      url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
      alt: v.title,
    },
    status: 'published',
    displayOrder: idx + 1,
  })
);

export const DEFAULT_PAGES: PagesContent = {
  home: {
    seo: NL_CONTENT.home.seo,
    hero: {
      visible: true,
      eyebrow: NL_CONTENT.home.hero.eyebrow,
      titleLine1: NL_CONTENT.home.hero.titleLine1,
      titleLine2: NL_CONTENT.home.hero.titleLine2,
      subtitle: NL_CONTENT.home.hero.subtitle,
      primaryCtaLabel: NL_CONTENT.home.hero.primaryCta.label,
      primaryCtaHref: NL_CONTENT.home.hero.primaryCta.href,
      secondaryCtaLabel: NL_CONTENT.home.hero.secondaryCta.label,
      secondaryCtaHref: NL_CONTENT.home.hero.secondaryCta.href,
      trustBadges: NL_CONTENT.home.hero.trustBadges,
      heroImage: {
        url: NL_CONTENT.home.hero.heroImage,
        alt: NL_CONTENT.home.hero.heroImageAlt,
      },
      sideCardImage: {
        url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
        alt: 'Atlas Holland verkeersregelaar en bouwportier in actie op locatie',
      },
      sideCardBadge: '24/7 Landelijke Inzet',
    },
    keyFigures: {
      visible: true,
      items: [
        {
          id: 'kf-1',
          value: '100+',
          numericTarget: 100,
          prefix: '',
          suffix: '+',
          label: 'verkeersregelaars inzetbaar',
          sublabel: 'Door heel Nederland paraat',
        },
        {
          id: 'kf-2',
          value: '24/7',
          numericTarget: null,
          label: 'bereikbaar',
          sublabel: 'Direct contact met de planning',
        },
        {
          id: 'kf-3',
          value: 'Binnen 24 uur',
          numericTarget: null,
          label: 'reactie op uw aanvraag',
          sublabel: 'Heldere offerte op maat',
        },
        {
          id: 'kf-4',
          value: '350+',
          numericTarget: null,
          label: 'projecten per jaar',
          sublabel: 'Infra, bouw & evenementen',
        },
      ],
    },
    servicesSection: {
      visible: true,
      eyebrow: NL_CONTENT.home.servicesSection.eyebrow,
      titleLine1: NL_CONTENT.home.servicesSection.titleLine1,
      titleLine2: NL_CONTENT.home.servicesSection.titleLine2,
      subtitle: NL_CONTENT.home.servicesSection.subtitle,
      allServicesLabel: NL_CONTENT.home.servicesSection.allServicesLabel,
    },
    ctaBand: {
      visible: true,
      badge: NL_CONTENT.home.ctaBand.badge,
      headline: NL_CONTENT.home.ctaBand.headline,
      urgentPrefix: NL_CONTENT.home.ctaBand.urgentPrefix,
      buttonLabel: NL_CONTENT.home.ctaBand.buttonLabel,
      buttonHref: '/offerte-aanvragen',
    },
    processSection: {
      visible: true,
      eyebrow: NL_CONTENT.home.processSection.eyebrow,
      titleLine1: NL_CONTENT.home.processSection.titleLine1,
      titleLine2: NL_CONTENT.home.processSection.titleLine2,
      subtitle: NL_CONTENT.home.processSection.subtitle,
      steps: NL_CONTENT.home.processSection.steps,
    },
    featuredProjectsSection: {
      visible: true,
      eyebrow: 'UITGELICHTE PROJECTEN',
      titleLine1: 'Recent uitgevoerde',
      titleLine2: 'projecten',
      subtitle:
        'Van meerweekse provinciale wegwerkzaamheden en binnenstedelijke bouwlogistiek tot grote publieksevenementen: bekijk hoe wij veiligheid en doorstroming in de praktijk waarborgen.',
      buttonLabel: 'Bekijk alle projecten',
      maxItems: 3,
    },
    audiencesSection: {
      visible: true,
      eyebrow: NL_CONTENT.home.audiencesSection.eyebrow,
      titleLine1: NL_CONTENT.home.audiencesSection.titleLine1,
      titleLine2: NL_CONTENT.home.audiencesSection.titleLine2,
      items: NL_CONTENT.home.audiencesSection.items,
    },
    whyAtlasSection: {
      visible: true,
      eyebrow: NL_CONTENT.home.whyAtlasSection.eyebrow,
      titleLine1: NL_CONTENT.home.whyAtlasSection.titleLine1,
      titleLine2: NL_CONTENT.home.whyAtlasSection.titleLine2,
      subtitle: NL_CONTENT.home.whyAtlasSection.subtitle,
      image: {
        url: NL_CONTENT.home.whyAtlasSection.imageUrl,
        alt: NL_CONTENT.home.whyAtlasSection.imageAlt,
      },
      usps: NL_CONTENT.home.whyAtlasSection.usps,
    },
    qualitySection: {
      visible: true,
      eyebrow: NL_CONTENT.home.qualitySection.eyebrow,
      titleLine1: NL_CONTENT.home.qualitySection.titleLine1,
      titleLine2: NL_CONTENT.home.qualitySection.titleLine2,
      quote: NL_CONTENT.home.qualitySection.quote,
      certificates: [
        {
          id: 'cert-1',
          code: 'VCA / VCA**',
          title: 'Veiligheid, Gezondheid en Milieu Checklist Aannemers',
          description:
            'Al onze medewerkers werken volgens gecertificeerde veiligheidsprocedures voor risicovolle werkomgevingen.',
          visible: true,
        },
        {
          id: 'cert-2',
          code: 'BRL 9101 / BRL 9102',
          title: 'Beoordelingsrichtlijn Tijdelijke Verkeersmaatregelen',
          description:
            'Vakbekwame plaatsing, controle en instandhouding van tijdelijke verkeersmaatregelen en verkeersregeling.',
          visible: true,
        },
        {
          id: 'cert-3',
          code: 'SVNL / Landelijke Aanstelling',
          title: 'Erkende Beroepsverkeersregelaars',
          description:
            'Inzet van volledig opgeleide en landelijk aangestelde verkeersregelaars met geldige aanstellingspas.',
          visible: true,
        },
        {
          id: 'cert-4',
          code: 'ISO 9001',
          title: 'Kwaliteitsmanagementsysteem',
          description:
            'Gestructureerde werkprocessen, continue kwaliteitsbewaking en betrouwbare projectevaluatie.',
          visible: true,
        },
        {
          id: 'cert-5',
          code: 'ISO 14001',
          title: 'Milieumanagementsysteem',
          description:
            'Duurzame inzet van materieel en bewuste beperking van milieubelasting op en rond het project.',
          visible: false,
        },
      ],
    },
    photoBand: {
      visible: true,
      image: {
        url: NL_CONTENT.home.photoBand.imageUrl,
        alt: NL_CONTENT.home.photoBand.imageAlt,
      },
      overlayQuote: NL_CONTENT.home.photoBand.overlayQuote,
    },
    clientsSection: {
      visible: true,
      eyebrow: NL_CONTENT.home.clientsSection.eyebrow,
      title: NL_CONTENT.home.clientsSection.title,
      logos: [
        { id: 'cl-1', name: 'Gemeente & Overheid' },
        { id: 'cl-2', name: 'Infra & Wegenbouw' },
        { id: 'cl-3', name: 'Netbeheer & Nutsbedrijven' },
        { id: 'cl-4', name: 'Bouwgroep Randstad' },
        { id: 'cl-5', name: 'Evenementen & Festivals' },
        { id: 'cl-6', name: 'Provinciale Wegbeheerders' },
        { id: 'cl-7', name: 'Spoor & Stadsvervoer' },
        { id: 'cl-8', name: 'Civiele Aannemers' },
      ],
    },
    testimonialsSection: {
      visible: true,
      eyebrow: NL_CONTENT.home.testimonialsSection.eyebrow,
      titleLine1: NL_CONTENT.home.testimonialsSection.titleLine1,
      titleLine2: NL_CONTENT.home.testimonialsSection.titleLine2,
      items: [
        {
          id: 'test-1',
          quote:
            '“Tijdens onze meerweekse kruispuntreconstructie zorgde Atlas Holland niet alleen voor het verkeersplan, maar ook voor een vast team verkeersregelaars dat de buurt kende. Nul incidenten en volop complimenten van omwonenden.”',
          name: 'Mark van den Berg',
          role: 'Projectleider Infra',
          organisation: 'Wegenbouw Combinatie Noord-Holland',
        },
        {
          id: 'test-2',
          quote:
            '“Bij een acute leidingbreuk op vrijdagavond stonden er binnen anderhalf uur gecertificeerde verkeersregelaars en een afzetting op locatie. Die 24/7 bereikbaarheid maakt in ons werk het verschil.”',
          name: 'Jeroen de Jong',
          role: 'Coördinator Netbeheer',
          organisation: 'Regionaal Nutsbedrijf',
        },
        {
          id: 'test-3',
          quote:
            '“Voor ons stadsfestival heeft Atlas Holland de volledige parkeer- en pendelbusstroom begeleid. Gastvrije mensen die ook op piekmomenten overzicht houden.”',
          name: 'Eva Lindeman',
          role: 'Operationeel Producent',
          organisation: 'Stadsfestival Utrecht',
        },
      ],
    },
    recruitmentTeaser: {
      visible: true,
      eyebrow: NL_CONTENT.home.recruitmentTeaser.eyebrow,
      titleLine1: NL_CONTENT.home.recruitmentTeaser.titleLine1,
      titleLine2: NL_CONTENT.home.recruitmentTeaser.titleLine2,
      description: NL_CONTENT.home.recruitmentTeaser.description,
      highlights: NL_CONTENT.home.recruitmentTeaser.highlights,
      buttonLabel: NL_CONTENT.home.recruitmentTeaser.buttonLabel,
      buttonHref: NL_CONTENT.home.recruitmentTeaser.buttonHref,
      image: {
        url: NL_CONTENT.home.recruitmentTeaser.imageUrl,
        alt: NL_CONTENT.home.recruitmentTeaser.imageAlt,
      },
    },
    closingContact: {
      visible: true,
      eyebrow: NL_CONTENT.home.closingContact.eyebrow,
      title: NL_CONTENT.home.closingContact.title,
      subtitle: NL_CONTENT.home.closingContact.subtitle,
      buttonLabel: NL_CONTENT.home.closingContact.buttonLabel,
      buttonHref: NL_CONTENT.home.closingContact.buttonHref,
      secondaryButtonLabel: 'Direct contact',
    },
  },
  servicesOverview: {
    seo: {
      title: 'Onze Diensten | Verkeersregelaars, Verkeersplannen & TVM | Atlas Holland B.V.',
      description:
        'Van één gecertificeerde verkeersregelaar tot een compleet verkeersplan en BLVC-advies — maatwerk voor infra, bouw, evenementen en calamiteiten.',
    },
    hero: {
      eyebrow: 'EXPERTISE & VAKMANSCHAP',
      titleLine1: 'Onze',
      titleLine2: 'diensten',
      subtitle:
        'Van één verkeersregelaar tot een compleet verkeersplan — maatwerk voor infra, bouw, evenementen en calamiteiten.',
      image: {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: 'Overzicht van de verkeers- en infradiensten van Atlas Holland B.V.',
      },
    },
    groups: NL_CONTENT.navigation.serviceGroups,
  },
  projectsOverview: {
    seo: {
      title: 'Onze Projecten | Verkeer, Infra, Bouw & Evenementen | Atlas Holland B.V.',
      description:
        'Bekijk gerealiseerde projecten van Atlas Holland B.V.: van kruispuntreconstructies en BLVC-bouwlogistiek tot evenementenverkeersmanagement en 24/7 spoedinzet.',
    },
    hero: {
      eyebrow: 'ONZE PROJECTEN',
      titleLine1: 'Gerealiseerde',
      titleLine2: 'projecten',
      subtitle:
        'Ontdek hoe wij gemeenten, wegenbouwers, aannemers, nutsbedrijven en evenementen door heel Nederland ondersteunen met vakmensen en doordachte verkeersmaatregelen.',
      image: {
        url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
        alt: 'Uitgevoerde verkeers- en infraprojecten van Atlas Holland B.V.',
      },
    },
    categories: [
      'Alle',
      'Infra & wegenbouw',
      'Bouw',
      'Evenementen',
      'Calamiteiten',
      'Verkeersplannen',
    ],
    ctaHeadline: 'Een soortgelijk project in voorbereiding? Spar direct met onze planning.',
    ctaButtonLabel: 'Vraag een offerte aan',
  },
  courses: {
    seo: NL_CONTENT.opleidingenPage.seo,
    hero: {
      eyebrow: NL_CONTENT.opleidingenPage.hero.eyebrow,
      titleLine1: NL_CONTENT.opleidingenPage.hero.titleLine1,
      titleLine2: NL_CONTENT.opleidingenPage.hero.titleLine2,
      subtitle: NL_CONTENT.opleidingenPage.hero.subtitle,
      image: {
        url: NL_CONTENT.opleidingenPage.hero.imageUrl,
        alt: NL_CONTENT.opleidingenPage.hero.imageAlt,
      },
    },
    introEyebrow: 'ERKENDE PRAKTIJKTRAININGEN',
    introTitleLine1: 'Ons',
    introTitleLine2: 'opleidingsaanbod',
    introText: NL_CONTENT.opleidingenPage.introText,
    formEyebrow: 'DIRECT AANMELDEN',
    formTitleLine1: 'Inschrijven voor een',
    formTitleLine2: 'opleiding',
    formSubtitle:
      'Meld uzelf of uw medewerkers aan. Wij nemen binnen 24 uur contact met u op om de eerstvolgende beschikbare startdata en locatie te bevestigen.',
    formSuccessTitle: 'Bedankt voor uw inschrijving!',
    formSuccessMessage:
      'Wij hebben uw aanmelding goed ontvangen. Onze opleidingscoördinator neemt binnen 24 uur contact met u op.',
    ctaHeadline: 'Meerdere medewerkers tegelijk opleiden of een incompany-training plannen?',
    ctaButtonLabel: 'Vraag een opleidingsvoorstel aan',
    courses: NL_CONTENT.opleidingenPage.courses.map((c, idx) => ({
      id: c.id,
      title: c.title,
      duration: idx === 1 ? '3 dagen + praktijk' : '1 tot 2 dagen',
      audience: c.audience,
      description: c.description,
      highlights: c.highlights,
      image: {
        url: c.imageUrl,
        alt: c.title,
      },
      active: true,
      displayOrder: idx + 1,
    })),
  },
  about: {
    seo: NL_CONTENT.overOnsPage.seo,
    hero: {
      eyebrow: NL_CONTENT.overOnsPage.hero.eyebrow,
      titleLine1: NL_CONTENT.overOnsPage.hero.titleLine1,
      titleLine2: NL_CONTENT.overOnsPage.hero.titleLine2,
      subtitle: NL_CONTENT.overOnsPage.hero.subtitle,
      image: {
        url: NL_CONTENT.overOnsPage.hero.imageUrl,
        alt: NL_CONTENT.overOnsPage.hero.imageAlt,
      },
    },
    story: {
      eyebrow: 'ONS VERHAAL & MISSIE',
      heading: NL_CONTENT.overOnsPage.story.heading,
      paragraphs: [
        'Atlas Holland B.V. is opgericht vanuit één duidelijke overtuiging: verkeersveiligheid bij bouw- en infraprojecten vraagt om méér dan alleen een hesje of een bord langs de weg. Het vraagt om vakmensen die hun verantwoordelijkheid voelen, planners die meedenken met de uitvoerder en afspraken waar u blind op kunt vertrouwen.',
        'Wat begon met de inzet van gecertificeerde verkeersregelaars in de Randstad, is uitgegroeid tot een landelijk opererende organisatie voor tijdelijke verkeersmaatregelen, verkeersplannen, BLVC-advies en projectcoördinatie.',
        'Of het nu gaat om een spoedafzetting midden in de nacht, een drukke binnenstedelijke bouwplaats of een meerdaags publieksevenement: bij Atlas Holland heeft u altijd direct contact met mensen die weten wat er buiten op straat speelt.',
      ],
    },
    allUnderOneRoof: NL_CONTENT.overOnsPage.allUnderOneRoof,
    coreValues: NL_CONTENT.overOnsPage.coreValues,
    pillars: NL_CONTENT.overOnsPage.pillars,
    teamSection: {
      eyebrow: 'DE MENSEN ACHTER ATLAS',
      titleLine1: 'Ons',
      titleLine2: 'kantoorteam & regie',
      subtitle:
        'Vaste gezichten op de planning, werkvoorbereiding en buitendienstcoördinatie.',
      members: [
        {
          id: 'tm-1',
          name: 'Daan van Vliet',
          role: 'Algemeen Directeur',
          email: 'info@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
            alt: 'Daan van Vliet — Algemeen Directeur',
          },
          visible: true,
          displayOrder: 1,
        },
        {
          id: 'tm-2',
          name: 'Sanne Vermeer',
          role: 'Operationeel Manager',
          email: 'info@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
            alt: 'Sanne Vermeer — Operationeel Manager',
          },
          visible: true,
          displayOrder: 2,
        },
        {
          id: 'tm-3',
          name: 'Bram Hoekstra',
          role: 'Hoofd Planning 24/7',
          email: 'info@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
            alt: 'Bram Hoekstra — Hoofd Planning 24/7',
          },
          visible: true,
          displayOrder: 3,
        },
        {
          id: 'tm-4',
          name: 'Laura Meijer',
          role: 'Verkeerskundig Ontwerper / BLVC',
          email: 'info@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
            alt: 'Laura Meijer — Verkeerskundig Ontwerper / BLVC',
          },
          visible: true,
          displayOrder: 4,
        },
        {
          id: 'tm-5',
          name: 'Karim El Amrani',
          role: 'Projectcoördinator Buitendienst',
          email: 'info@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
            alt: 'Karim El Amrani — Projectcoördinator Buitendienst',
          },
          visible: true,
          displayOrder: 5,
        },
        {
          id: 'tm-6',
          name: 'Romy Bakker',
          role: 'Recruiter & Opleidingscoördinator',
          email: 'werkenbij@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
            alt: 'Romy Bakker — Recruiter & Opleidingscoördinator',
          },
          visible: true,
          displayOrder: 6,
        },
      ],
    },
  },
  careers: {
    seo: NL_CONTENT.werkenBijPage.seo,
    hero: {
      eyebrow: NL_CONTENT.werkenBijPage.hero.eyebrow,
      titleLine1: NL_CONTENT.werkenBijPage.hero.titleLine1,
      titleLine2: NL_CONTENT.werkenBijPage.hero.titleLine2,
      subtitle: NL_CONTENT.werkenBijPage.hero.subtitle,
      buttonLabel: NL_CONTENT.werkenBijPage.hero.buttonLabel,
      image: {
        url: NL_CONTENT.werkenBijPage.hero.imageUrl,
        alt: NL_CONTENT.werkenBijPage.hero.imageAlt,
      },
    },
    whyAtlas: NL_CONTENT.werkenBijPage.whyAtlas,
    traits: NL_CONTENT.werkenBijPage.traits,
    processSteps: NL_CONTENT.werkenBijPage.processSteps,
    faqs: NL_CONTENT.werkenBijPage.faqs.map((f) => ({
      question: f.question,
      answer: f.answer.replace('[€ XX,XX – € XX,XX]', '€ 16,50 – € 21,50'),
    })),
    formSection: {
      eyebrow: 'DIRECT SOLLICITEREN',
      titleLine1: 'Zet vandaag de eerste stap naar',
      titleLine2: 'het Atlas team',
      subtitle:
        'Laat hieronder je gegevens achter. We bellen je binnen 24 uur op voor een kennismaking!',
      successTitle: 'Bedankt voor je sollicitatie!',
      successMessage:
        'We hebben je gegevens goed ontvangen. Onze recruiter neemt binnen 24 uur telefonisch contact met je op om kennis te maken!',
    },
  },
  quote: {
    seo: NL_CONTENT.offertePage.seo,
    hero: {
      eyebrow: NL_CONTENT.offertePage.hero.eyebrow,
      titleLine1: NL_CONTENT.offertePage.hero.titleLine1,
      titleLine2: NL_CONTENT.offertePage.hero.titleLine2,
      subtitle: NL_CONTENT.offertePage.hero.subtitle,
      image: {
        url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
        alt: 'Offerte aanvragen bij Atlas Holland B.V.',
      },
    },
    step1Title: 'Stap 1: Welke dienst(en) heeft u nodig?',
    step1Subtitle: 'Meerdere opties selecteren is mogelijk.',
    step2Title: 'Stap 2: Vertel ons over uw project',
    step2Subtitle: 'Waar en wanneer mogen wij u ondersteunen?',
    step3Title: 'Stap 3: Uw contactgegevens',
    step3Subtitle: 'Waar mogen wij het voorstel naartoe sturen?',
    sidebarBadge: 'Binnen 24 uur reactie ✓',
    sidebarTitle: 'Directe inzet of spoedaanvraag?',
    sidebarText:
      'Heeft u vandaag of vannacht nog gecertificeerde verkeersregelaars of een spoedafzetting nodig? Bel direct onze 24/7 centrale planning.',
    sidebarCertificates: [
      'VCA / VCA** gecertificeerd',
      'BRL 9101 / BRL 9102 conformiteit',
      'Landelijk aangestelde verkeersregelaars',
      'Volledige CROW 96a/96b werkwijze',
    ],
    successTitle: 'Bedankt! We nemen binnen 24 uur contact met u op.',
    successMessage:
      'Uw offerteaanvraag is ontvangen door onze centrale planning. U ontvangt binnen 24 uur een passend voorstel.',
  },
  contact: {
    seo: NL_CONTENT.contactPage.seo,
    hero: {
      eyebrow: NL_CONTENT.contactPage.hero.eyebrow,
      titleLine1: NL_CONTENT.contactPage.hero.titleLine1,
      titleLine2: NL_CONTENT.contactPage.hero.titleLine2,
      subtitle: NL_CONTENT.contactPage.hero.subtitle,
      image: {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: 'Neem contact op met Atlas Holland B.V.',
      },
    },
    cardsEyebrow: 'DIRECT BEREIKBAAR',
    cardsTitle: 'Onze contactgegevens',
    phoneCardLabel: '24/7 Telefoon & Spoedinzet',
    phoneCardSubtext: 'Dag en nacht direct verbonden met onze centrale planning.',
    formEyebrow: 'STUUR EEN BERICHT',
    formTitle: 'Stel uw vraag aan ons team',
    formSubtitle: 'Vul het formulier in en wij nemen zo snel mogelijk contact met u op.',
    formPrivacyNote: 'We gebruiken uw gegevens om uw bericht te beantwoorden.',
    formSuccessTitle: 'Bedankt voor uw bericht!',
    formSuccessMessage:
      'Wij hebben uw bericht goed ontvangen en reageren doorgaans binnen enkele uren (uiterlijk binnen 24 uur).',
    mapEyebrow: 'LANDELIJKE DEKKING VANUIT CENTRAAL NEDERLAND',
  },
  privacy: {
    seo: {
      title: 'Privacyverklaring | Atlas Holland B.V.',
      description:
        'Lees hoe Atlas Holland B.V. zorgvuldig en conform de AVG omgaat met uw persoonsgegevens bij offerteaanvragen, opleidingen en sollicitaties.',
    },
    eyebrow: 'JURIDISCH & AVG',
    title: 'Privacyverklaring',
    subtitle:
      'Hoe Atlas Holland B.V. zorgvuldig omgaat met persoonsgegevens van opdrachtgevers, websitebezoekers, cursisten en sollicitanten.',
    lastUpdated: 'November 2026',
    sections: [
      {
        heading: '1. Welke persoonsgegevens verwerken wij?',
        body: 'Wanneer u gebruikmaakt van onze diensten of formulieren op deze website invult (zoals het offerteformulier, het contactformulier, het inschrijfformulier voor opleidingen of het sollicitatieformulier), verwerken wij uitsluitend de gegevens die u zelf aan ons verstrekt:',
        bullets: [
          'Voor- en achternaam en eventuele bedrijfsnaam;',
          'E-mailadres en telefoonnummer;',
          'Woonplaats of projectlocatie;',
          'Bij sollicitaties: beschikbaarheid, rijbewijs, ervaring en eventueel uw CV en motivatie;',
          'Overige informatie die u zelf invult in het opmerkingenveld.',
        ],
      },
      {
        heading: '2. Doeleinden van de gegevensverwerking',
        body: 'Wij gebruiken uw gegevens uitsluitend voor de volgende doelen:',
        bullets: [
          'Het opstellen en bespreken van een offerte of projectplanning op maat;',
          'Het beantwoorden van uw vragen via het contactformulier;',
          'Het verwerken van uw aanmelding voor een vakopleiding of cursus;',
          'Het beoordelen en afhandelen van uw sollicitatie bij Atlas Holland B.V.',
        ],
      },
      {
        heading: '3. Bewaartermijnen',
        body: 'Wij bewaren uw persoonsgegevens niet langer dan strikt noodzakelijk is om de doelen te realiseren waarvoor uw gegevens worden verzameld. Sollicitatiegegevens worden uiterlijk 4 weken na afronding van de sollicitatieprocedure verwijderd, tenzij u toestemming geeft om uw gegevens maximaal 1 jaar in portefeuille te houden.',
      },
      {
        heading: '4. Delen van persoonsgegevens met derden',
        body: 'Atlas Holland B.V. verkoopt uw gegevens nooit aan derden en verstrekt deze uitsluitend indien dit nodig is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting.',
      },
      {
        heading: '5. Uw rechten (inzage, correctie en verwijdering)',
        body: 'U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te laten verwijderen. U kunt een verzoek hiertoe sturen naar ons algemene e-mailadres.',
      },
    ],
  },
  terms: {
    seo: {
      title: 'Algemene Voorwaarden | Atlas Holland B.V.',
      description:
        'Algemene voorwaarden van Atlas Holland B.V. voor de inzet van verkeersregelaars, tijdelijke verkeersmaatregelen, verkeersplannen en opleidingen.',
    },
    eyebrow: 'JURIDISCHE VOORWAARDEN',
    title: 'Algemene voorwaarden',
    subtitle: 'Van toepassing op alle offertes, opdrachten en dienstverlening van Atlas Holland B.V.',
    lastUpdated: 'November 2026',
    sections: [
      {
        heading: 'Artikel 1. Toepasselijkheid',
        body: 'Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes, werkzaamheden en overeenkomsten tussen Atlas Holland B.V. en opdrachtgevers betreffende de inzet van verkeersregelaars, bouwportiers, veiligheidspersonen, tijdelijke verkeersmaatregelen, verkeersplannen en opleidingen.',
      },
      {
        heading: 'Artikel 2. Offertes en totstandkoming van de opdracht',
        body: 'Alle offertes van Atlas Holland B.V. zijn vrijblijvend en 30 dagen geldig, tenzij schriftelijk anders aangegeven. Een overeenkomst komt tot stand op het moment dat de opdrachtgever de offerte schriftelijk of per e-mail bevestigt, of zodra Atlas Holland B.V. op verzoek van de opdrachtgever (bijvoorbeeld bij een 24/7 spoedaanvraag) met de uitvoering is gestart.',
      },
      {
        heading: 'Artikel 3. Uitvoering en veiligheid op locatie',
        body: 'Atlas Holland B.V. zet gekwalificeerde en gecertificeerde medewerkers in. De opdrachtgever draagt zorg voor tijdige en juiste informatie over de werklocatie, specifieke risico’s en eventuele vergunningsvoorwaarden.',
      },
      {
        heading: 'Artikel 4. Wijziging of annulering van geplande inzet',
        body: 'Indien een geplande inzet door omstandigheden wijzigt of wordt geannuleerd, dient de opdrachtgever dit zo spoedig mogelijk telefonisch en per e-mail door te geven aan de centrale planning. Voor annuleringen binnen 24 uur voor aanvang van de dienst kunnen gereserveerde uren conform de gemaakte tariefafspraken in rekening worden gebracht.',
      },
      {
        heading: 'Artikel 5. Opvragen volledige voorwaarden',
        body: 'Wilt u een volledig exemplaar van onze algemene voorwaarden als PDF per e-mail ontvangen? Neem dan contact op via ons algemene e-mailadres.',
      },
    ],
  },
};

export const DEFAULT_MEDIA: MediaAsset[] = [
  {
    id: 'media-1',
    url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
    storagePath: 'seed/atlas_hero_verkeersregelaars.jpg',
    filename: 'atlas_hero_verkeersregelaars.jpg',
    alt: 'Gecertificeerde verkeersregelaars van Atlas Holland B.V. in RWS-signaalkleding',
    mimeType: 'image/jpeg',
    sizeBytes: 342000,
    width: 1600,
    height: 900,
    createdAt: '2026-11-01T10:00:00Z',
  },
  {
    id: 'media-2',
    url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
    storagePath: 'seed/atlas_tijdelijke_verkeersmaatregelen.jpg',
    filename: 'atlas_tijdelijke_verkeersmaatregelen.jpg',
    alt: 'Tijdelijke verkeersmaatregelen met CROW-geleidebakens en barriers',
    mimeType: 'image/jpeg',
    sizeBytes: 318000,
    width: 1200,
    height: 900,
    createdAt: '2026-11-01T10:05:00Z',
  },
  {
    id: 'media-3',
    url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
    storagePath: 'seed/atlas_verkeersplannen_coordinatie.jpg',
    filename: 'atlas_verkeersplannen_coordinatie.jpg',
    alt: 'Projectcoördinator en uitvoerder bespreken verkeersplan op locatie',
    mimeType: 'image/jpeg',
    sizeBytes: 329000,
    width: 1200,
    height: 900,
    createdAt: '2026-11-01T10:10:00Z',
  },
  {
    id: 'media-4',
    url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
    storagePath: 'seed/atlas_bouwportier_evenementen.jpg',
    filename: 'atlas_bouwportier_evenementen.jpg',
    alt: 'Bouwportier begeleidt vrachtverkeer bij binnenstedelijke bouwinrit',
    mimeType: 'image/jpeg',
    sizeBytes: 310000,
    width: 1200,
    height: 900,
    createdAt: '2026-11-01T10:15:00Z',
  },
  {
    id: 'media-5',
    url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
    storagePath: 'seed/atlas_team_werken_bij.jpg',
    filename: 'atlas_team_werken_bij.jpg',
    alt: 'Team van verkeersregelaars bij Atlas Holland B.V.',
    mimeType: 'image/jpeg',
    sizeBytes: 295000,
    width: 1200,
    height: 900,
    createdAt: '2026-11-01T10:20:00Z',
  },
  {
    id: 'media-6',
    url: '/assets/aistudio/image_2652d4a1.png',
    storagePath: 'seed/atlas_logo.png',
    filename: 'atlas_holland_logo.png',
    alt: 'Atlas Holland B.V. Officiële Logo',
    mimeType: 'image/png',
    sizeBytes: 98000,
    width: 800,
    height: 550,
    createdAt: '2026-11-01T10:00:00Z',
  },
];

export const DEFAULT_SUBMISSIONS: FormSubmission[] = [
  {
    id: 'sub-1',
    type: 'quote',
    name: 'Hendrik de Groot',
    email: 'h.degroot@infra-aannemer.nl',
    phone: '06 - 4189 2310',
    status: 'new',
    createdAt: '2026-11-20T14:22:00Z',
    payload: {
      bedrijf: 'De Groot Wegenbouw B.V.',
      gekozenDiensten: ['verkeersregelaars', 'tijdelijke-verkeersmaatregelen'],
      locatie: 'Provincialeweg N201, Aalsmeer',
      uitvoerdatum: '2026-12-04',
      begintijd: '07:00',
      eindtijd: '16:30',
      meerdaagseInzet: true,
      einddatum: '2026-12-18',
      aantalVerkeersregelaars: '3-4',
      soortWerkzaamheden: 'Asfaltonderhoud en kruispuntafzetting',
      opmerkingen: 'Graag inclusief tekstkar en CROW 96b bebordingsplan.',
    },
  },
  {
    id: 'sub-2',
    type: 'application',
    name: 'Yassin El Idrissi',
    email: 'yassin.elidrissi@gmail.com',
    phone: '06 - 2910 8841',
    status: 'new',
    createdAt: '2026-11-21T09:15:00Z',
    payload: {
      vacature: 'Verkeersregelaar (Ervaren of in opleiding)',
      woonplaats: 'Rotterdam',
      ervaringAlsVerkeersregelaar: 'Ervaren en gecertificeerd',
      beschikbaarheid: 'Fulltime',
      rijbewijs: 'B',
      motivatie:
        'Ik heb 3 jaar ervaring als landelijk beroepsverkeersregelaar en VCA-VOL. Ik zoek een vast en hecht team in regio Zuid-Holland.',
    },
  },
  {
    id: 'sub-3',
    type: 'course',
    name: 'Peter van Dijk',
    email: 'p.vandijk@gemeentewerken.nl',
    phone: '06 - 1184 9023',
    status: 'in_progress',
    createdAt: '2026-11-18T11:40:00Z',
    payload: {
      gewensteOpleiding: 'BRL 9101 — Tijdelijke Verkeersmaatregelen',
      bedrijf: 'Gemeentewerken Midden-Nederland',
      aanvullendeInformatie: 'Wij willen graag 4 buitendienstmedewerkers tegelijk aanmelden.',
    },
  },
];

const LINKED_PROJECTS_NL: ProjectItem[] = DEFAULT_PROJECTS.map((p) => {
  const enMatch = DEFAULT_PROJECTS_EN.find((e) => e.id === p.id);
  return {
    ...p,
    slugEn: enMatch?.slugEn || enMatch?.slug || p.slug,
    statusEn: enMatch?.status || p.status,
  };
});

const LINKED_SERVICES_NL: CmsServiceItem[] = DEFAULT_SERVICES.map((s) => {
  const enMatch = DEFAULT_SERVICES_EN.find((e) => e.id === s.id);
  return {
    ...s,
    slugEn: enMatch?.slugEn || enMatch?.slug || s.slug,
    statusEn: enMatch?.status || s.status,
  };
});

const LINKED_VACANCIES_NL: CmsVacancyItem[] = DEFAULT_VACANCIES.map((v) => {
  const enMatch = DEFAULT_VACANCIES_EN.find((e) => e.id === v.id);
  return {
    ...v,
    slugEn: enMatch?.slugEn || enMatch?.slug || v.slug,
    statusEn: enMatch?.status || v.status,
  };
});

export const DEFAULT_CMS_SNAPSHOT: CmsSnapshot = {
  settings: DEFAULT_SETTINGS,
  pages: DEFAULT_PAGES,
  projects: LINKED_PROJECTS_NL,
  services: LINKED_SERVICES_NL,
  vacancies: LINKED_VACANCIES_NL,
  settingsEn: DEFAULT_SETTINGS_EN,
  pagesEn: DEFAULT_PAGES_EN,
  projectsEn: DEFAULT_PROJECTS_EN,
  servicesEn: DEFAULT_SERVICES_EN,
  vacanciesEn: DEFAULT_VACANCIES_EN,
  media: DEFAULT_MEDIA,
  submissions: DEFAULT_SUBMISSIONS,
};
