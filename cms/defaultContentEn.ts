import {
  SiteSettings,
  PagesContent,
  ProjectItem,
  CmsServiceItem,
  CmsVacancyItem,
} from './types';

export const DEFAULT_SETTINGS_EN: SiteSettings = {
  companyName: 'Atlas Holland B.V.',
  shortName: 'Atlas Holland',
  tagline: 'From traffic plan to on-site execution. Fully managed.',
  foundingYear: '2018',
  logoLightUrl: '/assets/aistudio/image_2652d4a1.png',
  logoDarkUrl: '',
  faviconUrl: '/favicon.ico',
  phoneDisplay: '+31 (0)85 - 060 24 70',
  emailGeneral: 'info@atlasholland.nl',
  emailCareers: 'werkenbij@atlasholland.nl',
  addressStreet: 'Ambachtsweg 14',
  addressPostalCity: '3542 AD Utrecht, The Netherlands',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Atlas+Holland+BV+Nederland',
  googleMapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d623755.349013426!2d4.4922854!3d52.1551723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c3db87e4bb%3A0xb3a175ceffbd0a9f!2sNederland!5e0!3m2!1sen!2snl!4v1710000000000!5m2!1sen!2snl',
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
  utilityBarUrgentLabel: 'Urgent deployment? Call 24/7:',
  headerCtaLabel: 'Request a quote',
  mobileCallLabel: 'Call 24/7',
  footerTagline: 'From traffic plan to on-site execution. Fully managed.',
  footerColServicesTitle: 'Services',
  footerColCompanyTitle: 'Atlas Holland',
  footerColContactTitle: 'Contact & 24/7 Emergency',
  footerCopyright: '© 2026 Atlas Holland B.V. All rights reserved.',
  defaultSeo: {
    title: 'Atlas Holland B.V. | Certified Traffic Controllers, Traffic Plans & Site Safety',
    description:
      'Certified traffic controllers, temporary traffic measures, CROW traffic plans and construction site safety across the Netherlands. Available nationwide 24/7.',
    ogImage: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
  },
};

export const DEFAULT_PROJECTS_EN: ProjectItem[] = [
  {
    id: 'proj-1',
    slug: 'intersection-reconstruction-n201-north-holland',
    slugEn: 'intersection-reconstruction-n201-north-holland',
    title: 'Phased Intersection Reconstruction & Asphalt Works N201',
    status: 'published',
    statusEn: 'published',
    featured: true,
    displayOrder: 1,
    category: 'Infra & Roadworks',
    serviceSlugs: [
      'verkeersregelaars',
      'tijdelijke-verkeersmaatregelen',
      'verkeersplannen',
      'projectcoordinatie',
    ],
    clientName: 'Main Civil Contractor & Province of North Holland',
    location: 'Aalsmeer / Uithoorn Region (N201)',
    period: 'Spring & Summer 2026 (6 weeks)',
    deploymentSummary: '14 traffic controllers · 6 weeks · 24/7 phasing',
    summary:
      'End-to-end traffic management, CROW 96b-compliant lane closures and 24-hour deployment of certified traffic controllers during a complex multi-phase provincial road reconstruction.',
    challenge:
      'Provincial road N201 is one of the busiest freight and commuter arteries in the region, connecting the flower auction hub with major motorways, high-frequency BRT bus corridors and school cycle crossings. Throughout the reconstruction of three consecutive intersections, at least one main lane and the dedicated public transport corridor had to remain continuously operational.',
    approach:
      'Atlas Holland engineered detailed CROW 96b traffic plans and signage drawings for all four construction phases ahead of schedule. On site, we deployed a dedicated pool of 14 nationally certified professional traffic controllers supervised by a permanent on-site project coordinator who liaised daily with the site manager.',
    result:
      'The reconstruction was completed on schedule within six weeks with zero safety incidents, uninterrupted transit for regional bus lines and emergency services, and minimal queue build-up during morning and evening peak hours.',
    highlights: [
      'Full CROW 96b traffic management plan approved by the road authority within 5 business days',
      'Dedicated team of 14 certified traffic controllers across day, evening and weekend shifts',
      'Priority corridor management for BRT buses and emergency vehicles via two-way radio dispatch',
      'Daily inspection and maintenance of all delineation beacons, variable message signs and barriers',
    ],
    metrics: [
      { label: 'Traffic controllers', value: '14 specialists' },
      { label: 'Project duration', value: '6 weeks' },
      { label: 'Safety incidents', value: '0 incidents' },
      { label: 'Vehicles per day', value: 'approx. 32,000' },
    ],
    coverImage: {
      url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
      alt: 'Temporary traffic measures and CROW delineation beacons during N201 intersection reconstruction',
    },
    gallery: [
      {
        url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
        alt: 'CROW-compliant lane closure with delineation beacons and road barriers',
        caption: 'Phase 1: Separation of the active work zone and through traffic lane using CROW beacons.',
      },
      {
        url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
        alt: 'Daily traffic plan briefing on site with the civil site manager',
        caption: 'Our project coordinator aligning the weekend phasing schedule with the main contractor.',
      },
      {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: 'Certified traffic controllers guiding cyclists and motorist traffic',
        caption: 'Safe guidance of crossing cycle traffic during weekday peak hours.',
      },
    ],
    quote: {
      text: 'Throughout our six-week reconstruction, Atlas Holland delivered not only a watertight traffic plan, but a consistent team of traffic controllers who knew every phase inside out.',
      author: 'Mark van den Berg',
      role: 'Senior Civil Project Manager',
      organisation: 'North Holland Road Construction Consortium',
    },
    seo: {
      title: 'Case Study: N201 Intersection Reconstruction | Atlas Holland B.V.',
      description:
        'See how Atlas Holland B.V. safely managed the 6-week N201 provincial road reconstruction with 14 certified traffic controllers and CROW 96b traffic measures.',
    },
    publishedAt: '2026-09-15T09:00:00Z',
    createdAt: '2026-09-10T09:00:00Z',
    updatedAt: '2026-09-15T09:00:00Z',
  },
  {
    id: 'proj-2',
    slug: 'inner-city-construction-logistics-site-access-rotterdam',
    slugEn: 'inner-city-construction-logistics-site-access-rotterdam',
    title: 'Inner-City Construction Logistics, BLVC & Gate Access Control Rotterdam',
    status: 'published',
    statusEn: 'published',
    featured: true,
    displayOrder: 2,
    category: 'Construction',
    serviceSlugs: ['bouwportier', 'blvc-plannen', 'verkeersregelaars'],
    clientName: 'Randstad High-Rise Construction Group',
    location: 'Rotterdam City Centre',
    period: 'Ongoing since January 2026 (18 months)',
    deploymentSummary: '4 dedicated gatekeepers · BLVC plan · Daily shifts',
    summary:
      'Integrated construction gate management, visitor registration and safe heavy-freight crossing across a busy municipal cycle artery for a high-rise residential tower in central Rotterdam.',
    challenge:
      'The sole construction access gate borders a primary commuter cycle path, pedestrian boulevard and active tramway. With an average of 45 heavy concrete and precast deliveries per day, strict just-in-time gate control and certified traffic guidance were mandatory to meet municipal BLVC permit conditions.',
    approach:
      'Atlas Holland authored the execution-ready BLVC plan and staffs both construction gates daily with permanent construction gatekeepers who also hold national professional traffic controller certification. For every arriving and departing freight vehicle, they briefly and safely hold crossing cyclists and road traffic.',
    result:
      'A tightly run construction site with zero congestion on the public roadway, 100% digital gate registration compliance, and positive feedback from municipal BLVC inspectors and local residents.',
    highlights: [
      'Dual-certified gate personnel: construction site access controller + certified traffic controller',
      'Execution-ready BLVC plan approved by the Municipality of Rotterdam',
      'Safe guidance of more than 220 heavy construction transport movements per week',
      'Strict verification of site passes, ID compliance and mandatory PPE at the gate',
    ],
    metrics: [
      { label: 'Site gatekeepers', value: '4 specialists' },
      { label: 'Weekly freight movements', value: '220+ trucks' },
      { label: 'Contract duration', value: '18 months' },
      { label: 'BLVC compliance audits', value: '100% passed' },
    ],
    coverImage: {
      url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
      alt: 'Atlas Holland construction gatekeeper guiding heavy transport at Rotterdam high-rise site',
    },
    gallery: [
      {
        url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
        alt: 'Construction gatekeeper managing Gate 1 in Rotterdam',
        caption: 'Dedicated gatekeeper guiding just-in-time heavy freight at Construction Gate 1.',
      },
      {
        url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
        alt: 'BLVC logistics alignment and delivery routing review',
        caption: 'Weekly alignment of crane lifting windows and freight approach routes on site.',
      },
    ],
    quote: {
      text: 'Our Atlas construction gatekeepers are the front line of our site. They know every regular driver, keep the cycle lane safe and ensure construction logistics never stall.',
      author: 'Sander Korteweg',
      role: 'Chief Site Superintendent',
      organisation: 'Randstad Construction Group',
    },
    seo: {
      title: 'Case Study: High-Rise Construction Gatekeepers & BLVC Rotterdam | Atlas Holland B.V.',
      description:
        'Discover how Atlas Holland B.V. manages inner-city construction logistics in Rotterdam with dual-certified site gatekeepers and an approved BLVC plan.',
    },
    publishedAt: '2026-10-02T10:00:00Z',
    createdAt: '2026-09-28T10:00:00Z',
    updatedAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'proj-3',
    slug: 'event-traffic-and-parking-management-city-festival-utrecht',
    slugEn: 'event-traffic-and-parking-management-city-festival-utrecht',
    title: 'Full Event Traffic & Parking Management for 3-Day City Festival',
    status: 'published',
    statusEn: 'published',
    featured: true,
    displayOrder: 3,
    category: 'Events',
    serviceSlugs: ['evenementen', 'parkeerbegeleiding', 'verkeersregelaars', 'verkeersplannen'],
    clientName: 'Festival Production & Municipality of Utrecht',
    location: 'Utrecht',
    period: 'August 2026 (3 days)',
    deploymentSummary: '28 staff members · 35,000 visitors · Mobility plan',
    summary:
      'From the permit-ready event mobility plan to hospitable parking guidance, Kiss & Ride management and safe late-night egress for 35,000 festival visitors.',
    challenge:
      'With 35,000 visitors across three festival days, visitor flows, shuttle buses, cyclists and stage production trucks had to be strictly separated while keeping surrounding residential neighbourhoods free from overflow parking and maintaining a 100% clear emergency access route.',
    approach:
      'Atlas Holland drafted the municipal event traffic plan, deployed mobile LED variable message signs and temporary directional signage, and staffed the venue perimeter with 28 traffic controllers and parking stewards led by two on-site event coordinators.',
    result:
      'Smooth arrival peaks without tailbacks on the main arterial roads, an average egress time under 15 minutes at closing time, and commendations from both festival organisers and regional emergency services.',
    highlights: [
      'Complete separation of shuttle buses, Kiss & Ride drop-offs, bicycles and production logistics',
      '28 hospitable traffic controllers and parking stewards deployed during peak hours',
      'Continuous preservation of emergency service lanes for ambulance and fire brigades',
      'Full installation and rapid post-event removal of LED message trailers and directional signage',
    ],
    metrics: [
      { label: 'Total visitors', value: '35,000 guests' },
      { label: 'Deployed staff', value: '28 specialists' },
      { label: 'Average exit time', value: '< 15 minutes' },
      { label: 'Event duration', value: '3 days' },
    ],
    coverImage: {
      url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
      alt: 'Atlas Holland event traffic controllers guiding visitor flows in Utrecht',
    },
    gallery: [
      {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: 'Hospitable traffic controllers on the festival approach route',
        caption: 'Clear and welcoming guidance for cyclists, shuttle buses and motorists.',
      },
      {
        url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
        alt: 'Atlas Holland coordination team prior to shift start',
        caption: 'Our event traffic team right before the pre-shift safety briefing.',
      },
    ],
    quote: {
      text: 'Atlas Holland managed the entire parking and shuttle bus operation for our festival. Welcoming professionals who stay calm and in control even during peak evening exit crowds.',
      author: 'Eva Lindeman',
      role: 'Head of Live Operations',
      organisation: 'Utrecht City Festival',
    },
    seo: {
      title: 'Case Study: Event Traffic Management Utrecht City Festival | Atlas Holland B.V.',
      description:
        'Read how Atlas Holland B.V. safely guided 35,000 festival visitors in Utrecht with 28 event traffic controllers, parking stewards and a permit-ready mobility plan.',
    },
    publishedAt: '2026-10-18T14:00:00Z',
    createdAt: '2026-10-15T14:00:00Z',
    updatedAt: '2026-10-18T14:00:00Z',
  },
  {
    id: 'proj-4',
    slug: 'emergency-deployment-water-main-burst-amsterdam-south',
    slugEn: 'emergency-deployment-water-main-burst-amsterdam-south',
    title: '24/7 Emergency Response & Road Closure for Major Water Main Burst',
    status: 'draft',
    statusEn: 'draft',
    featured: false,
    displayOrder: 4,
    category: 'Emergency Response',
    serviceSlugs: ['calamiteiten', 'verkeersregelaars', 'tijdelijke-verkeersmaatregelen'],
    clientName: 'Regional Utility & Grid Operator',
    location: 'Amsterdam-South',
    period: 'October 2026 (72-hour continuous deployment)',
    deploymentSummary: '6 traffic controllers · On site within 75 mins · 24/7',
    summary:
      'Immediate late-night emergency road closure and 72-hour traffic management following a sudden water main rupture at a major urban intersection in Amsterdam-South.',
    challenge:
      'At 22:15 on a Friday night, a high-pressure water main ruptured, flooding a busy urban junction and tram corridor. Emergency utility repair crews needed an immediate safe excavation zone while night buses and city traffic had to be safely diverted.',
    approach:
      'Within 75 minutes of the call to our 24/7 dispatch desk, four certified traffic controllers and our rapid-response unit equipped with emergency signage and beacons were on site. We maintained continuous 24-hour shift coverage throughout the entire weekend.',
    result:
      'Utility engineers were able to excavate and repair the main without delay. By Monday morning prior to rush hour, the intersection was resurfaced and reopened to all traffic.',
    highlights: [
      'Fully operational on site within 75 minutes of the initial emergency call',
      '72 hours of uninterrupted day and night shift coverage',
      'Direct coordination with municipal enforcement, emergency services and public transit dispatch',
    ],
    metrics: [
      { label: 'Emergency response time', value: '75 minutes' },
      { label: 'Continuous coverage', value: '72 hours (24/7)' },
      { label: 'Traffic controllers', value: '6 per 24h cycle' },
    ],
    coverImage: {
      url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
      alt: 'Emergency lane closure and safety perimeter during utility repair works',
    },
    gallery: [
      {
        url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
        alt: 'Emergency barrier setup along the carriageway',
        caption: 'Rapid emergency safety perimeter protecting utility repair crews.',
      },
    ],
    seo: {
      title: 'Case Study: 24/7 Emergency Utility Deployment Amsterdam | Atlas Holland B.V.',
      description:
        'Case study of a 72-hour emergency traffic management deployment by Atlas Holland B.V. in Amsterdam-South.',
    },
    publishedAt: '',
    createdAt: '2026-11-01T11:00:00Z',
    updatedAt: '2026-11-01T11:00:00Z',
  },
];

export const DEFAULT_SERVICES_EN: CmsServiceItem[] = [
  {
    id: 'srv-1',
    slug: 'traffic-controllers',
    slugEn: 'traffic-controllers',
    group: 'operationeel',
    title: 'Certified Traffic Controllers',
    shortTitle: 'Traffic Controllers',
    oneLiner:
      'Nationally certified professional traffic controllers for roadworks, construction sites, events and emergencies.',
    heroPromise:
      'Nationally certified, VCA-trained traffic controllers who combine strict safety compliance with smooth traffic flow and clear communication on site.',
    imageUrl: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
    imageAlt: 'Certified traffic controllers of Atlas Holland B.V. in high-visibility RWS safety gear',
    cardImage: {
      url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
      alt: 'Certified traffic controllers of Atlas Holland B.V. in high-visibility RWS safety gear',
    },
    heroImage: {
      url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
      alt: 'Certified traffic controllers of Atlas Holland B.V. in high-visibility RWS safety gear',
    },
    whatWeDoParagraphs: [
      'Where roadworks, crane operations or excavations impact the public road, certified traffic controllers are indispensable. Atlas Holland B.V. supplies nationally appointed professional traffic controllers (SVNL certified) who actively protect both your site crew and road users.',
      'Our professionals arrive fully equipped in compliant RWS high-visibility workwear with two-way radios, valid appointment passes and VCA certification. Whether you need a single traffic controller for a day or a coordinated team of twenty for a multi-month infrastructure project, our 24/7 planning desk scales effortlessly with your schedule.',
    ],
    whatWeDoBullets: [
      'Nationally certified professional traffic controllers (SVNL & valid appointment pass)',
      'VCA-certified and dressed in full RWS-compliant high-visibility safety gear',
      'Flexible deployment: from planned multi-month infrastructure works to 24/7 emergency response',
      'Consistent team allocation on long-term projects for maximum local familiarity',
      'Proactive, hospitable communication towards residents, cyclists and motorists',
    ],
    applications: [
      {
        title: 'Roadworks & Civil Infrastructure',
        description:
          'Safe guidance of traffic flows during asphalt resurfacing, intersection reconstructions, bridge maintenance and utility trenching.',
        iconName: 'HardHat',
      },
      {
        title: 'Inner-City Construction & Crane Lifts',
        description:
          'Holding and guiding cyclists, pedestrians and motorists during heavy freight manoeuvres and mobile crane operations.',
        iconName: 'Building2',
      },
      {
        title: '24/7 Utility & Grid Emergencies',
        description:
          'Immediate on-site traffic management during unplanned water, power, gas or telecom disruptions.',
        iconName: 'Siren',
      },
    ],
    faqs: [
      {
        question: 'Are all Atlas Holland traffic controllers officially certified?',
        answer:
          'Yes. Every professional traffic controller we deploy holds an official SVNL diploma, a valid national appointment pass (Landelijke Aanstelling) and VCA certification.',
      },
      {
        question: 'How quickly can you deploy traffic controllers for an urgent job?',
        answer:
          'Through our 24/7 emergency dispatch desk (+31 85 060 24 70), we can deploy certified traffic controllers across the Netherlands on the same day — and for acute incidents often within 60 to 90 minutes.',
      },
      {
        question: 'Can we get a fixed team of traffic controllers for a longer project?',
        answer:
          'Absolutely. For multi-week or multi-month projects we assign a dedicated core team and an on-site project coordinator so our staff know your site rules and phasing inside out.',
      },
    ],
    relatedSlugs: ['temporary-traffic-measures', 'traffic-plans', 'site-access-control'],
    featuredOnHome: true,
    status: 'published',
    statusEn: 'published',
    displayOrder: 1,
    seo: {
      title: 'Certified Traffic Controllers | Nationwide 24/7 Deployment | Atlas Holland B.V.',
      description:
        'Hire nationally certified professional traffic controllers (verkeersregelaars) in the Netherlands for infrastructure, construction, events and 24/7 emergency works.',
    },
  },
  {
    id: 'srv-2',
    slug: 'temporary-traffic-measures',
    slugEn: 'temporary-traffic-measures',
    group: 'operationeel',
    title: 'Temporary Traffic Measures (TVM)',
    shortTitle: 'Temporary Traffic Measures',
    oneLiner:
      'Complete supply, installation, inspection and removal of CROW 96a/96b-compliant signage, barriers and beacons.',
    heroPromise:
      'Safe work zones and crystal-clear diversion routes with CROW 96a/96b and BRL 9101 compliant temporary traffic measures.',
    imageUrl: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
    imageAlt: 'Temporary traffic measures with CROW delineation beacons and barriers by Atlas Holland',
    cardImage: {
      url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
      alt: 'Temporary traffic measures with CROW delineation beacons and barriers by Atlas Holland',
    },
    heroImage: {
      url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
      alt: 'Temporary traffic measures with CROW delineation beacons and barriers by Atlas Holland',
    },
    whatWeDoParagraphs: [
      'A safe work zone starts with physical separation and unmistakable visual guidance. Atlas Holland B.V. handles the turnkey placement, maintenance and dismantling of Temporary Traffic Measures (TVM) in full compliance with CROW 96a/96b guidelines and BRL 9101 standards.',
      'From RVV road signs, delineation beacons and road barriers to mobile LED text trailers and temporary traffic lights: we deliver the equipment to your site, install it according to the approved traffic plan, and conduct periodic inspections throughout your project.',
    ],
    whatWeDoBullets: [
      'Installation and removal in strict accordance with CROW 96a / 96b and BRL 9101',
      'Supply of official RVV signage, delineation beacons, barriers and safety fencing',
      'Deployment of mobile LED variable message signs (tekstkarren) and arrow trailers',
      'Periodic on-site inspections and 24/7 fault or storm-damage rectification',
      'Seamless integration with our traffic plans and on-site traffic controllers',
    ],
    applications: [
      {
        title: 'Lane & Road Closures',
        description:
          'Safe demarcation of work zones along municipal, provincial and national roads.',
        iconName: 'Cone',
      },
      {
        title: 'Diversion & Advance Warning Routes',
        description:
          'Clear yellow diversion signage and LED text trailers informing road users well ahead of the work zone.',
        iconName: 'Route',
      },
      {
        title: 'Emergency Perimeter Closures',
        description:
          'Rapid placement of barriers and warning signs following utility ruptures, storm damage or accidents.',
        iconName: 'ShieldCheck',
      },
    ],
    faqs: [
      {
        question: 'Do you also take care of the traffic plan required for the signage permit?',
        answer:
          'Yes. Our traffic engineers draft the CROW-compliant traffic & signage plan and, once approved by the road authority, our field crew installs all equipment on site.',
      },
      {
        question: 'Who maintains the signage during multi-week roadworks?',
        answer:
          'Atlas Holland conducts scheduled inspection rounds to ensure all signs, beacons and lighting remain properly positioned and visible, including 24/7 call-out support after storms.',
      },
    ],
    relatedSlugs: ['traffic-plans', 'traffic-controllers', 'emergency-response'],
    featuredOnHome: true,
    status: 'published',
    statusEn: 'published',
    displayOrder: 2,
    seo: {
      title: 'Temporary Traffic Measures (TVM) & Road Signage | Atlas Holland B.V.',
      description:
        'Turnkey installation, maintenance and removal of CROW 96a/96b compliant temporary traffic measures, road barriers, beacons and LED text trailers.',
    },
  },
  {
    id: 'srv-3',
    slug: 'traffic-plans',
    slugEn: 'traffic-plans',
    group: 'planning-advies',
    title: 'Traffic Plans & Signage Drawings',
    shortTitle: 'Traffic Plans',
    oneLiner:
      'Permit-ready CROW 96a/96b traffic plans, diversion drawings and stakeholder coordination with road authorities.',
    heroPromise:
      'Fast, permit-ready traffic plans and CROW signage drawings that win smooth approval from municipalities and provincial road authorities.',
    imageUrl: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
    imageAlt: 'Traffic engineer and project coordinator reviewing a CROW traffic plan on site',
    cardImage: {
      url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
      alt: 'Traffic engineer and project coordinator reviewing a CROW traffic plan on site',
    },
    heroImage: {
      url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
      alt: 'Traffic engineer and project coordinator reviewing a CROW traffic plan on site',
    },
    whatWeDoParagraphs: [
      'Before a single cone is placed on the public road, municipalities and road authorities require a technically sound traffic plan. Atlas Holland B.V. designs clear, realistic traffic management plans and CAD signage drawings according to CROW 96a and 96b standards.',
      'Because our designers work closely with our field coordinators every day, our drawings are not merely theoretical exercises — they are practical, buildable and immediately ready for permit submission (MOOR / Melvin / municipal portals) and on-site execution.',
    ],
    whatWeDoBullets: [
      'Detailed CROW 96a and 96b traffic and signage drawings (VMT)',
      'Phasing plans, diversion routes and emergency service access guarantees',
      'Direct support with municipal permit applications and road authority reviews',
      'Fast turnaround times so your project preparation never stalls',
      'Direct handover from our traffic engineering desk to our field deployment team',
    ],
    applications: [
      {
        title: 'Municipal & Provincial Permit Applications',
        description:
          'Complete drawing packages for temporary road closures, excavation permits and crane permits.',
        iconName: 'FileCheck2',
      },
      {
        title: 'Multi-Phase Infrastructure Works',
        description:
          'Phased traffic circulation plans keeping neighbourhoods, businesses and bus lines accessible.',
        iconName: 'MapPin',
      },
      {
        title: 'Event Mobility & Egress Plans',
        description:
          'Integrated arrival, parking, shuttle and emergency route plans for large public events.',
        iconName: 'Compass',
      },
    ],
    faqs: [
      {
        question: 'How fast can you deliver a traffic plan?',
        answer:
          'Standard single-phase traffic drawings are typically delivered within 2 to 4 working days. For urgent works we offer a fast-track engineering service.',
      },
      {
        question: 'Do your traffic plans comply with CROW 96a and 96b?',
        answer:
          'Yes, all our traffic plans and signage drawings are engineered in full accordance with the current CROW 96a (highways) and CROW 96b (non-highways & urban roads) guidelines.',
      },
    ],
    relatedSlugs: ['blvc-plans', 'temporary-traffic-measures', 'project-coordination'],
    featuredOnHome: true,
    status: 'published',
    statusEn: 'published',
    displayOrder: 3,
    seo: {
      title: 'CROW Traffic Plans & Signage Drawings | Atlas Holland B.V.',
      description:
        'Permit-ready CROW 96a/96b traffic plans, diversion drawings and road authority coordination for infrastructure, construction and events in the Netherlands.',
    },
  },
  {
    id: 'srv-4',
    slug: 'blvc-plans',
    slugEn: 'blvc-plans',
    group: 'planning-advies',
    title: 'BLVC Plans (Accessibility, Liveability, Safety & Communication)',
    shortTitle: 'BLVC Plans',
    oneLiner:
      'Comprehensive BLVC plans and construction logistics routing for complex inner-city building and infrastructure projects.',
    heroPromise:
      'Win municipal approval and keep the surrounding neighbourhood running smoothly with a practical, execution-focused BLVC plan.',
    imageUrl: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
    imageAlt: 'BLVC consultancy and construction logistics planning by Atlas Holland B.V.',
    cardImage: {
      url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
      alt: 'BLVC consultancy and construction logistics planning by Atlas Holland B.V.',
    },
    heroImage: {
      url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
      alt: 'BLVC consultancy and construction logistics planning by Atlas Holland B.V.',
    },
    whatWeDoParagraphs: [
      'For inner-city construction and infrastructure projects, Dutch municipalities increasingly require a comprehensive BLVC plan (Bereikbaarheid, Leefbaarheid, Veiligheid en Communicatie — Accessibility, Liveability, Safety & Communication) prior to granting building permits.',
      'Atlas Holland translates municipal BLVC frameworks into concrete, workable logistics plans: from freight approach routes, loading zones and school-hour restrictions to construction gatekeepers, resident communication and emergency access.',
    ],
    whatWeDoBullets: [
      'Complete BLVC plans tailored to municipal frameworks (Amsterdam, Rotterdam, Utrecht, The Hague and nationwide)',
      'Construction site layout drawings, freight routing and just-in-time delivery protocols',
      'Safety assessments for vulnerable road users (schools, cyclists and pedestrians)',
      'Stakeholder and resident communication planning',
      'Direct execution on site with our certified construction gatekeepers and traffic controllers',
    ],
    applications: [
      {
        title: 'Inner-City High-Rise & Redevelopment',
        description:
          'Managing tight site footprints, crane windows and heavy transport movements in dense urban areas.',
        iconName: 'Building2',
      },
      {
        title: 'EMVI / Tender Submissions & Permits',
        description:
          'Strong BLVC sections for tender bids and municipal building permit approvals.',
        iconName: 'ClipboardCheck',
      },
    ],
    faqs: [
      {
        question: 'Can Atlas Holland also execute the measures described in the BLVC plan?',
        answer:
          'Yes. Unlike purely advisory consultancies, we also supply the certified construction gatekeepers, traffic controllers and temporary signage to execute the BLVC plan on site.',
      },
    ],
    relatedSlugs: ['site-access-control', 'traffic-plans', 'project-coordination'],
    featuredOnHome: true,
    status: 'published',
    statusEn: 'published',
    displayOrder: 4,
    seo: {
      title: 'BLVC Plans & Inner-City Construction Logistics | Atlas Holland B.V.',
      description:
        'Permit-ready BLVC plans (Accessibility, Liveability, Safety & Communication) for urban construction and infrastructure projects across the Netherlands.',
    },
  },
  {
    id: 'srv-5',
    slug: 'project-coordination',
    slugEn: 'project-coordination',
    group: 'planning-advies',
    title: 'Traffic Project Coordination',
    shortTitle: 'Project Coordination',
    oneLiner:
      'One dedicated on-site traffic coordinator bridging your site management, traffic controllers, municipalities and subcontractors.',
    heroPromise:
      'Total operational peace of mind: a dedicated project coordinator who oversees your traffic measures, staffing and phase transitions on site.',
    imageUrl: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
    imageAlt: 'On-site traffic project coordinator from Atlas Holland B.V.',
    cardImage: {
      url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
      alt: 'On-site traffic project coordinator from Atlas Holland B.V.',
    },
    heroImage: {
      url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
      alt: 'On-site traffic project coordinator from Atlas Holland B.V.',
    },
    whatWeDoParagraphs: [
      'On complex infrastructure or construction sites, your site superintendent has enough to manage without micromanaging daily sign changes or shift handovers. Our Traffic Project Coordinators take full operational ownership of all traffic and safety measures on and around your site.',
      'Your coordinator briefs the traffic controllers each morning, verifies CROW signage compliance before each phase switch, and serves as the single point of contact for your site manager and municipal inspectors.',
    ],
    whatWeDoBullets: [
      'Single point of contact for your project manager and site superintendent',
      'Daily on-site briefings, quality audits and phase-transition checks',
      'Direct coordination with municipal enforcement, public transit operators and emergency services',
      'Proactive scaling of personnel and signage when construction schedules shift',
    ],
    applications: [
      {
        title: 'Multi-Phase Civil & Road Projects',
        description:
          'Seamless coordination across changing road closures, weekend possessions and night shifts.',
        iconName: 'Compass',
      },
      {
        title: 'Large-Scale Public Events',
        description:
          'Field command of multiple traffic controller teams, parking zones and shuttle corridors.',
        iconName: 'Users',
      },
    ],
    faqs: [
      {
        question: 'When is a dedicated project coordinator recommended?',
        answer:
          'Whenever a project involves multiple phases, 4 or more traffic controllers simultaneously, or high-density urban traffic interfaces with public transport and municipal enforcement.',
      },
    ],
    relatedSlugs: ['traffic-controllers', 'traffic-plans', 'temporary-traffic-measures'],
    featuredOnHome: false,
    status: 'published',
    statusEn: 'published',
    displayOrder: 5,
    seo: {
      title: 'On-Site Traffic Project Coordination | Atlas Holland B.V.',
      description:
        'Dedicated traffic project coordinators overseeing traffic controllers, CROW signage and stakeholder alignment on complex Dutch construction and infra sites.',
    },
  },
  {
    id: 'srv-6',
    slug: 'site-access-control',
    slugEn: 'site-access-control',
    group: 'operationeel',
    title: 'Construction Gatekeeper & Site Access Control',
    shortTitle: 'Site Access Control',
    oneLiner:
      'Dual-certified construction gatekeepers combining strict gate registration, PPE checks and safe freight guidance onto the public road.',
    heroPromise:
      'Keep your construction site secure and your freight movements safe with gatekeepers who are also certified traffic controllers.',
    imageUrl: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
    imageAlt: 'Construction gatekeeper of Atlas Holland B.V. managing heavy freight access',
    cardImage: {
      url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
      alt: 'Construction gatekeeper of Atlas Holland B.V. managing heavy freight access',
    },
    heroImage: {
      url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
      alt: 'Construction gatekeeper of Atlas Holland B.V. managing heavy freight access',
    },
    whatWeDoParagraphs: [
      'The construction gate is the most critical bottleneck of any urban building site: heavy trucks enter and exit across cycle lanes and pavements while dozens of subcontractors arrive every morning. Atlas Holland B.V. supplies specialized construction gatekeepers (bouwportiers) who hold full national certification as professional traffic controllers.',
      'This dual qualification means one specialist manages your gate security, visitor registration, ID/building-pass verification and PPE enforcement while legally authorized to regulate public traffic whenever freight vehicles manoeuvre in or out of the gate.',
    ],
    whatWeDoBullets: [
      'Dual-certified: construction gatekeeper + nationally appointed professional traffic controller',
      'Access control, visitor registration, ID checks and mandatory PPE verification',
      'Coordination of delivery time slots (just-in-time construction logistics) and loading zones',
      'Safe guidance of reversing or turning construction trucks across cycle paths and walkways',
    ],
    applications: [
      {
        title: 'Inner-City Construction Sites',
        description:
          'Preventing congestion and unsafe conflicts with cyclists and pedestrians at busy urban site gates.',
        iconName: 'Building2',
      },
      {
        title: 'Industrial Turnarounds & Renovations',
        description:
          'Strict gate registration, safety induction checks and logistics routing on industrial sites.',
        iconName: 'ShieldCheck',
      },
    ],
    faqs: [
      {
        question: 'Can a regular security guard direct traffic on the public road outside the gate?',
        answer:
          'No. Under Dutch law, only a certified traffic controller with a valid national appointment pass is legally authorized to stop or direct traffic on the public road. Our construction gatekeepers hold both qualifications.',
      },
    ],
    relatedSlugs: ['blvc-plans', 'traffic-controllers', 'project-coordination'],
    featuredOnHome: true,
    status: 'published',
    statusEn: 'published',
    displayOrder: 6,
    seo: {
      title: 'Construction Gatekeeper (Bouwportier) & Site Access Control | Atlas Holland B.V.',
      description:
        'Dual-certified construction gatekeepers in the Netherlands: combining gate access control and PPE checks with certified public road traffic guidance.',
    },
  },
  {
    id: 'srv-7',
    slug: 'tram-safety-officer',
    slugEn: 'tram-safety-officer',
    group: 'operationeel',
    title: 'Tram & Light-Rail Safety Officer (VPT)',
    shortTitle: 'Tram Safety Officer',
    oneLiner:
      'Certified Tram Safety Officers (Veiligheidspersoon Tram) safeguarding crews working on or immediately adjacent to urban tram tracks.',
    heroPromise:
      'Certified protection for construction and maintenance crews working within the hazard zone of active urban tramways.',
    imageUrl: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
    imageAlt: 'Tram safety officer overseeing work adjacent to an urban tram track',
    cardImage: {
      url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
      alt: 'Tram safety officer overseeing work adjacent to an urban tram track',
    },
    heroImage: {
      url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
      alt: 'Tram safety officer overseeing work adjacent to an urban tram track',
    },
    whatWeDoParagraphs: [
      'Working on or near active tram and light-rail tracks in cities such as Amsterdam, Rotterdam, The Hague and Utrecht entails strict rail-safety regulations. Atlas Holland B.V. deploys certified Tram Safety Officers (Veiligheidspersoon Tram / VPT) whose sole focus is monitoring the track clearance profile and warning work crews in time.',
      'Before work commences, our safety officer conducts the mandatory pre-start briefing, maintains direct communication with municipal transit control, and ensures both rail traffic and road traffic pass the work zone safely.',
    ],
    whatWeDoBullets: [
      'Certified Tram Safety Officers (VPT) familiar with municipal light-rail safety protocols',
      'Continuous monitoring of the tramway clearance profile and overhead catenary safety distances',
      'Clear acoustic and visual warning signals for ground crews and machine operators',
      'Often combined with national traffic controller certification for integrated intersection safety',
    ],
    applications: [
      {
        title: 'Civil & Utility Works Near Tramways',
        description:
          'Safe excavation, paving and cable works along active tram corridors in major Dutch cities.',
        iconName: 'TrainFront',
      },
      {
        title: 'Crane & Facade Maintenance Along Tracks',
        description:
          'Safeguarding aerial work platforms and crane operations near tram tracks and overhead wires.',
        iconName: 'ShieldCheck',
      },
    ],
    faqs: [
      {
        question: 'In which cities do you supply Tram Safety Officers?',
        answer:
          'We deploy certified Tram Safety Officers across all Dutch tram and light-rail networks, including Amsterdam (GVB), Rotterdam (RET), The Hague (HTM) and Utrecht (U-OV).',
      },
    ],
    relatedSlugs: ['traffic-controllers', 'temporary-traffic-measures', 'project-coordination'],
    featuredOnHome: false,
    status: 'published',
    statusEn: 'published',
    displayOrder: 7,
    seo: {
      title: 'Tram Safety Officer (Veiligheidspersoon Tram) | Atlas Holland B.V.',
      description:
        'Certified Tram Safety Officers (VPT) for safe construction, utility and maintenance works near active tram tracks in Amsterdam, Rotterdam, The Hague and Utrecht.',
    },
  },
  {
    id: 'srv-8',
    slug: 'event-traffic-management',
    slugEn: 'event-traffic-management',
    group: 'totaaloplossingen',
    title: 'Event Traffic Management',
    shortTitle: 'Event Traffic',
    oneLiner:
      'End-to-end event mobility: from municipal traffic plans and signage to hospitable traffic controllers and shuttle management.',
    heroPromise:
      'A warm welcome and a safe journey home for your visitors — complete event traffic management from permit drawing to the final exit wave.',
    imageUrl: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
    imageAlt: 'Event traffic management by Atlas Holland B.V.',
    cardImage: {
      url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
      alt: 'Event traffic management by Atlas Holland B.V.',
    },
    heroImage: {
      url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
      alt: 'Event traffic management by Atlas Holland B.V.',
    },
    whatWeDoParagraphs: [
      'A visitor’s first and last impression of your event happens on the approach road and parking lot. Atlas Holland B.V. takes care of the complete external mobility operation for festivals, sporting events, trade fairs, concerts and corporate gatherings.',
      'We draft the municipal event traffic plan, place LED variable message signs and temporary routing signage, and deploy hospitable certified traffic controllers and parking stewards who keep traffic flowing while keeping emergency routes 100% clear.',
    ],
    whatWeDoBullets: [
      'Permit-ready event mobility and traffic circulation plans',
      'Hospitable event traffic controllers and on-site zone coordinators',
      'Dedicated routing for Kiss & Ride, shuttle buses, VIPs, crew and bicycles',
      'Uncompromised protection of emergency service access routes',
      'Complete deployment of LED text trailers, barriers and directional signs',
    ],
    applications: [
      {
        title: 'Festivals, Concerts & Public Events',
        description:
          'Managing peak arrival and nighttime egress waves for thousands of visitors safely and smoothly.',
        iconName: 'Calendar',
      },
      {
        title: 'Sporting Events & Road Races',
        description:
          'Dynamic intersection closures and route protection along marathons, cycling tours and stadium events.',
        iconName: 'Flag',
      },
    ],
    faqs: [
      {
        question: 'Can you assist with the municipal event permit application?',
        answer:
          'Yes. We supply the complete event traffic and signage plan required by the municipality and regional safety authority (Veiligheidsregio).',
      },
    ],
    relatedSlugs: ['parking-management', 'traffic-controllers', 'traffic-plans'],
    featuredOnHome: true,
    status: 'published',
    statusEn: 'published',
    displayOrder: 8,
    seo: {
      title: 'Event Traffic Management & Mobility Plans | Atlas Holland B.V.',
      description:
        'Turnkey event traffic management in the Netherlands: permit mobility plans, event traffic controllers, LED signage, Kiss & Ride and parking guidance.',
    },
  },
  {
    id: 'srv-9',
    slug: 'parking-management',
    slugEn: 'parking-management',
    group: 'totaaloplossingen',
    title: 'Parking Guidance & Stewarding',
    shortTitle: 'Parking Management',
    oneLiner:
      'Hospitable parking stewards, capacity optimization and structured traffic flow on event venues, P+R hubs and commercial sites.',
    heroPromise:
      'Maximum parking capacity, zero tailbacks on the access road and a hospitable welcome for every visitor.',
    imageUrl: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
    imageAlt: 'Parking guidance and stewards from Atlas Holland B.V.',
    cardImage: {
      url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
      alt: 'Parking guidance and stewards from Atlas Holland B.V.',
    },
    heroImage: {
      url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
      alt: 'Parking guidance and stewards from Atlas Holland B.V.',
    },
    whatWeDoParagraphs: [
      'Without active supervision, parking lots quickly fill inefficiently and cause queues spilling back onto public roads. Our trained parking stewards and traffic controllers guide motorists directly to the next available space, keep fire lanes unobstructed and ensure an orderly, rapid exit at the end of the day.',
    ],
    whatWeDoBullets: [
      'Up to 25% higher parking lot utilization through systematic lane-by-lane filling',
      'Representative, service-minded parking stewards and certified traffic controllers',
      'Clear separation of VIP parking, disabled access, coaches, crew and bicycles',
      'Temporary parking signage, lighting and drive-lane demarcation',
    ],
    applications: [
      {
        title: 'Event & Festival Parking Fields',
        description:
          'Fast, structured in- and outflow on temporary meadow or hardstand parking venues.',
        iconName: 'Car',
      },
      {
        title: 'Retail Openings, Trade Fairs & P+R Hubs',
        description:
          'Hospitable overflow parking guidance during peak commercial days or garage renovations.',
        iconName: 'Compass',
      },
    ],
    faqs: [
      {
        question: 'Can parking stewards also regulate traffic on the public road leading to the car park?',
        answer:
          'When public road intersections need to be regulated, we deploy nationally certified traffic controllers at the road junction working in radio contact with the parking stewards on the lot.',
      },
    ],
    relatedSlugs: ['event-traffic-management', 'traffic-controllers', 'temporary-traffic-measures'],
    featuredOnHome: false,
    status: 'published',
    statusEn: 'published',
    displayOrder: 9,
    seo: {
      title: 'Parking Management & Event Parking Stewards | Atlas Holland B.V.',
      description:
        'Professional parking guidance, parking stewards and traffic flow management for events, trade fairs and commercial venues across the Netherlands.',
    },
  },
  {
    id: 'srv-10',
    slug: 'motorcycle-escort',
    slugEn: 'motorcycle-escort',
    group: 'totaaloplossingen',
    title: 'Mobile Motorcycle Traffic Escort',
    shortTitle: 'Motorcycle Escort',
    oneLiner:
      'Mobile motorcycle traffic controllers for road races, parades, convoys and dynamic rolling road closures.',
    heroPromise:
      'Dynamic, agile traffic protection for moving columns, cycling races, convoys and rolling events.',
    imageUrl: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
    imageAlt: 'Motorcycle traffic escort by Atlas Holland B.V.',
    cardImage: {
      url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
      alt: 'Motorcycle traffic escort by Atlas Holland B.V.',
    },
    heroImage: {
      url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
      alt: 'Motorcycle traffic escort by Atlas Holland B.V.',
    },
    whatWeDoParagraphs: [
      'When an event or transport moves along a route — such as a cycling race, marathon, charity convoy or parade — static intersection posts alone are not enough. Atlas Holland B.V. deploys certified motorcycle traffic controllers who move ahead of the column using the leapfrog method to secure intersections just in time and reopen them immediately after passage.',
    ],
    whatWeDoBullets: [
      'Nationally certified motorcycle traffic controllers with conspicuous RWS-marked motorcycles',
      'Rolling intersection protection (leapfrog system) minimizing disruption to public traffic',
      'Continuous radio communication between lead riders, race direction and static posts',
    ],
    applications: [
      {
        title: 'Cycling Tours, Marathons & Parades',
        description:
          'Safe, rolling route protection for participants and spectators along public roads.',
        iconName: 'Flag',
      },
      {
        title: 'Special Convoys & Mobile Productions',
        description:
          'Dynamic intersection assistance for special route movements and film shoots.',
        iconName: 'Route',
      },
    ],
    faqs: [
      {
        question: 'Are your motorcycle riders officially certified as national traffic controllers?',
        answer:
          'Yes, all our motorcycle traffic controllers hold a valid national professional appointment pass and specialized motorcycle traffic guidance training.',
      },
    ],
    relatedSlugs: ['event-traffic-management', 'traffic-controllers', 'traffic-plans'],
    featuredOnHome: false,
    status: 'published',
    statusEn: 'published',
    displayOrder: 10,
    seo: {
      title: 'Motorcycle Traffic Escort & Rolling Closures | Atlas Holland B.V.',
      description:
        'Certified motorcycle traffic controllers for road races, tours, convoys and mobile events in the Netherlands.',
    },
  },
  {
    id: 'srv-11',
    slug: 'emergency-response',
    slugEn: 'emergency-response',
    group: 'totaaloplossingen',
    title: '24/7 Emergency & Incident Traffic Response',
    shortTitle: '24/7 Emergency Response',
    oneLiner:
      'Day and night rapid deployment of certified traffic controllers and emergency signage for utility bursts, accidents and storm damage.',
    heroPromise:
      'When every minute counts: our 24/7 emergency dispatch puts certified traffic controllers and road closures on site across the Netherlands.',
    imageUrl: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
    imageAlt: '24/7 emergency traffic response by Atlas Holland B.V.',
    cardImage: {
      url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
      alt: '24/7 emergency traffic response by Atlas Holland B.V.',
    },
    heroImage: {
      url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
      alt: '24/7 emergency traffic response by Atlas Holland B.V.',
    },
    whatWeDoParagraphs: [
      'A ruptured water main, power grid failure, malfunctioning traffic signal intersection, sinkhole or storm damage never waits for office hours. That is why Atlas Holland B.V. operates a manned 24/7 emergency dispatch desk 365 days a year.',
      'Upon your call, we immediately mobilize the nearest standby traffic controllers and rapid-response signage vehicle so your repair crews can start working safely without delay.',
    ],
    whatWeDoBullets: [
      'Direct 24/7 telephone line manned by an experienced dispatch planner (+31 85 060 24 70)',
      'Rapid nationwide mobilization of standby certified traffic controllers',
      'Immediate emergency work-zone demarcation with beacons, signs and lighting',
      'Seamless handover to multi-day shift coverage until repair works are completed',
    ],
    applications: [
      {
        title: 'Utility & Grid Failures (Water, Power, Gas, Telecom)',
        description:
          'Immediate safe work zones for emergency repair contractors on busy urban and provincial roads.',
        iconName: 'Siren',
      },
      {
        title: 'Traffic Signal Outages & Storm Damage',
        description:
          'Manual intersection control during traffic light failures (VRI outages) or emergency road hazards.',
        iconName: 'AlertTriangle',
      },
    ],
    faqs: [
      {
        question: 'How do we request an immediate emergency deployment at night or on weekends?',
        answer:
          'Call our 24/7 emergency number +31 (0)85 - 060 24 70 directly. You speak immediately with our on-duty planner who dispatches the nearest standby team.',
      },
    ],
    relatedSlugs: ['traffic-controllers', 'temporary-traffic-measures', 'project-coordination'],
    featuredOnHome: true,
    status: 'published',
    statusEn: 'published',
    displayOrder: 11,
    seo: {
      title: '24/7 Emergency Traffic Controllers & Incident Closures | Atlas Holland B.V.',
      description:
        'Immediate 24/7 emergency deployment of certified traffic controllers and road closures for utility failures, VRI outages and infrastructure incidents across the Netherlands.',
    },
  },
];

export const DEFAULT_VACANCIES_EN: CmsVacancyItem[] = [
  {
    id: 'vac-1',
    slug: 'traffic-controller-experienced-or-trainee',
    slugEn: 'traffic-controller-experienced-or-trainee',
    title: 'Traffic Controller (Experienced or Paid Training)',
    region: 'Nationwide / Randstad / Utrecht Region',
    hours: '16 – 40 hours per week',
    employmentType: 'Full-time / Part-time',
    startDate: 'Immediate start',
    tags: ['Paid training possible', 'Flexible or fixed hours', 'Company car option'],
    summary:
      'Keep traffic moving safely around major infrastructure works, inner-city construction projects and events. No certificate yet? We pay for your official training!',
    intro:
      'As a Traffic Controller at Atlas Holland B.V., you are the face of safety outdoors. Together with your colleagues, you ensure road crews can work safely while motorists, cyclists and emergency vehicles pass smoothly. Whether you already hold your national appointment pass or want to earn it through our paid academy: you are welcome on our team.',
    whatYouDo: [
      'Independently and as part of a team regulate traffic at roadworks, construction sites and events',
      'Actively ensure a safe work zone for road workers, crane operators and surrounding road users',
      'Provide clear, friendly directions to motorists, cyclists and local residents',
      'Coordinate on site via two-way radio with your team lead, site manager or fellow controllers',
    ],
    whatWeAsk: [
      'You are at least 18 years old and hold a proactive, responsible attitude',
      'An official Traffic Controller appointment pass (or willingness to complete our paid training)',
      'Good command of Dutch or English and strong communication skills outdoors',
      'Driving licence B is a plus (company car possible for full-time deployment)',
    ],
    whatWeOffer: [
      'Attractive gross hourly wage between € 16.50 and € 21.50 (depending on experience), plus evening, night and weekend allowances',
      'Full training to become a Nationally Certified Professional Traffic Controller + VCA paid by Atlas Holland',
      'Premium RWS high-visibility workwear gear package for all seasons',
      'Weekly or monthly punctual salary payment and travel allowance (or company car)',
      'A close-knit team with 24/7 back-office support that truly knows you by name',
    ],
    heroImage: {
      url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
      alt: 'Traffic controller vacancy at Atlas Holland B.V.',
    },
    status: 'published',
    statusEn: 'published',
    displayOrder: 1,
  },
  {
    id: 'vac-2',
    slug: 'construction-gatekeeper-site-access-controller',
    slugEn: 'construction-gatekeeper-site-access-controller',
    title: 'Construction Gatekeeper / Site Access Controller',
    region: 'Amsterdam / Rotterdam / Utrecht / The Hague',
    hours: '32 – 40 hours per week',
    employmentType: 'Full-time / Part-time',
    startDate: 'Immediate start',
    tags: ['Fixed daytime hours', 'Fixed project location', 'Dual certification'],
    summary:
      'Be the host and safety guardian at the gate of prestigious inner-city construction projects. Fixed daytime hours on a dedicated long-term site.',
    intro:
      'As a Construction Gatekeeper at Atlas Holland B.V., you manage the main entrance of high-profile urban building projects. You welcome deliveries and visitors, verify site passes and mandatory PPE, and — using your national traffic controller certification — safely guide heavy construction trucks across adjoining cycle paths and roads.',
    whatYouDo: [
      'Manage gate access, visitor registration and building-pass verification at the construction site entrance',
      'Coordinate arriving and departing heavy freight according to the daily logistics schedule',
      'Safely hold and guide crossing cyclists, pedestrians and motorists during truck manoeuvres',
      'Monitor mandatory PPE compliance (hard hat, safety boots, hi-vis) at the gate',
    ],
    whatYouDoTitle: undefined,
    whatWeAsk: [
      'A representative, hospitable attitude combined with natural authority when enforcing safety rules',
      'National Traffic Controller certificate and VCA (or willingness to obtain them via Atlas Holland)',
      'Reliable availability during standard construction daytime hours (approx. 06:30 – 16:00)',
    ],
    whatWeOffer: [
      'Gross hourly wage between € 17.50 and € 22.00 plus travel reimbursement',
      'Fixed daytime working hours on a consistent long-term construction project',
      'Paid certifications (National Traffic Controller, VCA and Construction Gatekeeper module)',
      'Direct career progression opportunities toward Senior Gatekeeper or Field Coordinator',
    ],
    heroImage: {
      url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
      alt: 'Construction gatekeeper vacancy at Atlas Holland B.V.',
    },
    status: 'published',
    statusEn: 'published',
    displayOrder: 2,
  } as CmsVacancyItem,
  {
    id: 'vac-3',
    slug: 'event-traffic-controller-part-time-weekend',
    slugEn: 'event-traffic-controller-part-time-weekend',
    title: 'Event Traffic Controller (Part-time / Weekends / Side Job)',
    region: 'Nationwide (Festivals & Stadiums)',
    hours: '8 – 32 hours per week (flexible)',
    employmentType: 'Part-time / Flexible',
    startDate: 'Immediate start',
    tags: ['Choose your own shifts', 'Great festivals & events', 'Fast onboarding'],
    summary:
      'Work outdoors at the biggest festivals, concerts and sporting events in the Netherlands. Flexible scheduling ideal alongside studies or another job.',
    intro:
      'Love the energy of festivals, concerts and major sporting events? As an Event Traffic Controller and Parking Steward at Atlas Holland B.V., you ensure thousands of visitors arrive with a smile and get home safely after the show.',
    whatYouDo: [
      'Guide visitor cars, shuttle buses, artists and cyclists around festival venues and stadiums',
      'Provide hospitable parking guidance on event parking lots and Kiss & Ride zones',
      'Keep emergency access routes clear for ambulance and fire services',
    ],
    whatWeAsk: [
      'An enthusiastic, hospitable mindset and team spirit',
      'Availability on weekends, evenings or during the event season (you pick your own shifts)',
      'At least 18 years old',
    ],
    whatWeOffer: [
      'Competitive hourly pay plus weekend and evening bonuses',
      'Quick official event traffic controller certification provided by Atlas Holland',
      'Travel together with colleagues from central pick-up points',
      'Work at the most exciting venues and festivals across the Netherlands',
    ],
    heroImage: {
      url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
      alt: 'Event traffic controller vacancy at Atlas Holland B.V.',
    },
    status: 'published',
    statusEn: 'published',
    displayOrder: 3,
  },
  {
    id: 'vac-4',
    slug: 'project-coordinator-traffic-planner',
    slugEn: 'project-coordinator-traffic-planner',
    title: 'Project Coordinator / Traffic Measures Technician (BRL 9101)',
    region: 'Utrecht Office & Nationwide Field Operations',
    hours: '36 – 40 hours per week',
    employmentType: 'Full-time',
    startDate: 'By agreement',
    tags: ['Company van / car', ' € 3,100 – € 4,200 / month', 'Permanent contract sight'],
    summary:
      'Coordinate temporary traffic measures, supervise field teams and act as the daily sparring partner for civil contractors and road authorities.',
    intro:
      'As a Project Coordinator at Atlas Holland B.V., you connect our planning desk with execution outdoors. You inspect work zones, coordinate phase switches, guide our traffic controller teams and ensure every CROW 96b / BRL 9101 setup is 100% compliant.',
    whatYouDo: [
      'Supervise and inspect temporary traffic measures and traffic controller deployments on site',
      'Act as the primary operational contact for site managers, civil contractors and municipalities',
      'Conduct pre-start safety briefings, toolbox meetings and workplace audits',
      'Assist with rapid emergency call-outs and phasing adjustments',
    ],
    whatWeAsk: [
      'Practical experience in traffic management, infrastructure works or BRL 9101 temporary traffic measures',
      'VCA-VOL certification and valid driving licence B (BE is a plus)',
      'Decisive, solution-oriented leadership style',
    ],
    whatWeOffer: [
      'Gross monthly salary between € 3,100 and € 4,200 depending on experience',
      'Fully equipped company vehicle, laptop and smartphone',
      'Freedom, responsibility and a key role within a fast-growing traffic specialist',
    ],
    heroImage: {
      url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
      alt: 'Project coordinator vacancy at Atlas Holland B.V.',
    },
    status: 'published',
    statusEn: 'published',
    displayOrder: 4,
  },
];

export const DEFAULT_PAGES_EN: PagesContent = {
  home: {
    seo: {
      title: 'Atlas Holland B.V. | Certified Traffic Controllers, Traffic Plans & Site Safety',
      description:
        'Your partner in traffic management and on-site safety across the Netherlands. Certified traffic controllers, temporary traffic measures, CROW traffic plans & BLVC.',
    },
    hero: {
      visible: true,
      eyebrow: 'TRAFFIC & INFRASTRUCTURE SAFETY ACROSS THE NETHERLANDS',
      titleLine1: 'Your partner in traffic',
      titleLine2: 'and on-site safety.',
      subtitle:
        'From traffic plan to on-site execution. Certified traffic controllers, temporary traffic measures and turnkey traffic solutions for infrastructure, construction, events and 24/7 emergencies.',
      primaryCtaLabel: 'Request a quote',
      primaryCtaHref: '/en/request-quote',
      secondaryCtaLabel: 'Work as a traffic controller',
      secondaryCtaHref: '/en/careers',
      trustBadges: [
        '24/7 available',
        'Nationwide deployment',
        'Certified specialists',
        'Quote within 24 hours',
      ],
      heroImage: {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: 'Certified Atlas Holland traffic controllers in orange high-visibility vests at a Dutch road intersection',
      },
      sideCardImage: {
        url: '/assets/images/atlas_bouwportier_evenementen_1794215805236.jpg',
        alt: 'Atlas Holland traffic controller and construction gatekeeper on site',
      },
      sideCardBadge: '24/7 Nationwide Coverage',
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
          label: 'certified traffic controllers',
          sublabel: 'Ready across the Netherlands',
        },
        {
          id: 'kf-2',
          value: '24/7',
          numericTarget: null,
          label: 'dispatch availability',
          sublabel: 'Direct line to our planners',
        },
        {
          id: 'kf-3',
          value: 'Within 24h',
          numericTarget: null,
          label: 'response to your request',
          sublabel: 'Clear, tailored proposal',
        },
        {
          id: 'kf-4',
          value: '350+',
          numericTarget: null,
          label: 'projects per year',
          sublabel: 'Infra, construction & events',
        },
      ],
    },
    servicesSection: {
      visible: true,
      eyebrow: 'OUR EXPERTISE',
      titleLine1: 'Complete solutions for',
      titleLine2: 'every traffic challenge',
      subtitle:
        'Whether you need immediate certified traffic controllers on site or a permit-ready CROW traffic plan: Atlas Holland takes care of the entire process.',
      allServicesLabel: 'View all 11 services',
    },
    ctaBand: {
      visible: true,
      badge: 'FAST DEPLOYMENT & TAILORED ADVICE',
      headline:
        'Need traffic controllers or a traffic plan? We respond within 24 hours.',
      urgentPrefix: 'Urgent? Call 24/7:',
      buttonLabel: 'Request a quote',
      buttonHref: '/en/request-quote',
    },
    processSection: {
      visible: true,
      eyebrow: 'OUR APPROACH',
      titleLine1: 'Arranged in 4',
      titleLine2: 'clear steps',
      subtitle:
        'Short communication lines, rapid preparation and flawless execution outdoors on site.',
      steps: [
        {
          number: '01',
          title: 'Request & Intake',
          subtitle: 'Within 2 minutes online or 24/7 by phone',
          description:
            'Submit your request online in 2 minutes or call our planning desk directly. For urgent incidents we mobilize immediately.',
        },
        {
          number: '02',
          title: 'Plan & Proposal within 24h',
          subtitle: 'Tailored traffic advice & transparent pricing',
          description:
            'We assess the site situation, draft the CROW traffic plan or staffing schedule and send a clear proposal within 24 hours.',
        },
        {
          number: '03',
          title: 'Certified On-Site Execution',
          subtitle: 'Punctual, VCA-certified & fully equipped',
          description:
            'Our certified traffic controllers, gatekeepers and signage crews arrive fully briefed and equipped on location.',
        },
        {
          number: '04',
          title: 'Monitoring, Handover & Evaluation',
          subtitle: 'One fixed point of contact throughout',
          description:
            'One fixed contact oversees quality during execution, handles dismantling upon completion and evaluates the project with you.',
        },
      ],
    },
    featuredProjectsSection: {
      visible: true,
      eyebrow: 'FEATURED PROJECTS',
      titleLine1: 'Recently delivered',
      titleLine2: 'projects',
      subtitle:
        'From multi-week provincial road reconstructions and inner-city construction logistics to major public festivals: explore how we safeguard safety and traffic flow in practice.',
      buttonLabel: 'View all projects',
      maxItems: 3,
    },
    audiencesSection: {
      visible: true,
      eyebrow: 'WHO WE WORK FOR',
      titleLine1: 'Trusted by public authorities',
      titleLine2: 'and leading contractors',
      items: [
        {
          title: 'Municipalities & Road Authorities',
          benefit:
            'Reliable execution of temporary traffic measures, CROW-compliant traffic plans and safe neighbourhood circulation.',
          iconName: 'Landmark',
        },
        {
          title: 'Infra, Civil & Construction Contractors',
          benefit:
            'VCA-certified traffic controllers, dual-trained construction gatekeepers and practical BLVC logistics plans.',
          iconName: 'HardHat',
        },
        {
          title: 'Utility & Grid Operators',
          benefit:
            '24/7 emergency response for cable and pipeline repairs, plus planned maintenance closures.',
          iconName: 'Zap',
        },
        {
          title: 'Event & Festival Organisers',
          benefit:
            'Permit-ready mobility plans, hospitable traffic controllers, shuttle routing and parking stewarding.',
          iconName: 'Calendar',
        },
      ],
    },
    whyAtlasSection: {
      visible: true,
      eyebrow: 'WHY ATLAS HOLLAND',
      titleLine1: 'Safety without',
      titleLine2: 'compromise',
      subtitle:
        'At Atlas Holland you never deal with anonymous call centres. You work directly with planners and field specialists who take ownership of your project.',
      image: {
        url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
        alt: 'Atlas Holland project coordinator aligning traffic measures on site',
      },
      usps: [
        {
          title: '100% Certified & VCA-Trained Staff',
          description:
            'Every traffic controller holds a valid national appointment pass, SVNL diploma, VCA certificate and compliant RWS workwear.',
          iconName: 'ShieldCheck',
        },
        {
          title: 'Genuine 24/7 Emergency Dispatch',
          description:
            'Day, night and weekends: you speak directly with an experienced traffic planner who can mobilize staff immediately.',
          iconName: 'Clock',
        },
        {
          title: 'Everything Under One Roof',
          description:
            'From CROW traffic drawings and BLVC permits to temporary road signage, barriers and on-site personnel.',
          iconName: 'Layers',
        },
        {
          title: 'Single Point of Contact',
          description:
            'Short lines of communication, transparent pricing and consistent teams on long-running construction projects.',
          iconName: 'UserCheck',
        },
      ],
    },
    qualitySection: {
      visible: true,
      eyebrow: 'QUALITY & COMPLIANCE',
      titleLine1: 'Certified safety',
      titleLine2: 'on every site',
      quote:
        '“In traffic management, reliability is not a nice-to-have — it is the foundation of every safe working day.”',
      certificates: [
        {
          id: 'cert-1',
          code: 'VCA / VCA**',
          title: 'Safety, Health & Environment Checklist Contractors',
          description:
            'All our personnel operate according to certified safety procedures for high-risk work environments.',
          visible: true,
        },
        {
          id: 'cert-2',
          code: 'BRL 9101 / CROW 96b',
          title: 'Temporary Traffic Measures Guidelines',
          description:
            'Expert placement, inspection and maintenance of temporary traffic measures and road closures.',
          visible: true,
        },
        {
          id: 'cert-3',
          code: 'SVNL / National Appointment',
          title: 'Accredited Professional Traffic Controllers',
          description:
            'Deployment of fully trained and nationally appointed traffic controllers with valid identification passes.',
          visible: true,
        },
        {
          id: 'cert-4',
          code: 'ISO 9001',
          title: 'Quality Management System',
          description:
            'Structured operational workflows, continuous quality assurance and transparent project evaluation.',
          visible: true,
        },
        {
          id: 'cert-5',
          code: 'ISO 14001',
          title: 'Environmental Management System',
          description:
            'Sustainable deployment of equipment and conscious reduction of environmental impact on site.',
          visible: false,
        },
      ],
    },
    photoBand: {
      visible: true,
      image: {
        url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
        alt: 'Dutch roadworks and temporary traffic measures managed by Atlas Holland B.V.',
      },
      overlayQuote:
        'Every day on the road across the Netherlands — for safety, traffic flow and total peace of mind.',
    },
    clientsSection: {
      visible: true,
      eyebrow: 'PARTNERS & SECTORS',
      title: 'Deployed daily for leading contractors, municipalities & events',
      logos: [
        { id: 'cl-1', name: 'Municipalities & Government' },
        { id: 'cl-2', name: 'Infra & Road Construction' },
        { id: 'cl-3', name: 'Grid & Utility Operators' },
        { id: 'cl-4', name: 'Randstad Construction Group' },
        { id: 'cl-5', name: 'Festivals & Live Events' },
        { id: 'cl-6', name: 'Provincial Road Authorities' },
        { id: 'cl-7', name: 'Rail & Urban Transit' },
        { id: 'cl-8', name: 'Civil Engineering Contractors' },
      ],
    },
    testimonialsSection: {
      visible: true,
      eyebrow: 'CLIENT EXPERIENCES',
      titleLine1: 'What project managers say',
      titleLine2: 'about Atlas Holland',
      items: [
        {
          id: 'test-1',
          quote:
            '“During our multi-week intersection reconstruction, Atlas Holland delivered not only the traffic plan, but a consistent team of traffic controllers who knew the neighbourhood. Zero incidents and plenty of compliments from residents.”',
          name: 'Mark van den Berg',
          role: 'Civil Project Manager',
          organisation: 'North Holland Road Construction Consortium',
        },
        {
          id: 'test-2',
          quote:
            '“When a major water main ruptured on a Friday night, certified traffic controllers and a safe road closure were on site within 75 minutes. That genuine 24/7 availability makes all the difference in our work.”',
          name: 'Jeroen de Jong',
          role: 'Grid Operations Coordinator',
          organisation: 'Regional Utility Operator',
        },
        {
          id: 'test-3',
          quote:
            '“Atlas Holland managed the entire parking and shuttle bus operation for our city festival. Welcoming professionals who stay calm and keep complete oversight even at peak closing hours.”',
          name: 'Eva Lindeman',
          role: 'Head of Live Operations',
          organisation: 'Utrecht City Festival',
        },
      ],
    },
    recruitmentTeaser: {
      visible: true,
      eyebrow: 'JOIN OUR TEAM',
      titleLine1: 'Work at Atlas.',
      titleLine2: 'Keep the Netherlands moving safely.',
      description:
        'Looking for an active outdoor job with real responsibility, great pay and a close-knit team? Join Atlas Holland as a traffic controller or construction gatekeeper — even if you do not have your certificate yet!',
      highlights: [
        'Official training paid by Atlas Holland',
        'Good hourly pay (€ 16.50 – € 21.50/h) + allowances',
        'Flexible or fixed full-time hours',
        'Work across your own region in a close-knit team',
      ],
      buttonLabel: 'View open vacancies',
      buttonHref: '/en/careers',
      image: {
        url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
        alt: 'Team of Atlas Holland traffic controllers smiling on site',
      },
    },
    closingContact: {
      visible: true,
      eyebrow: 'READY FOR DEPLOYMENT',
      title: 'Need immediate advice or a tailored proposal?',
      subtitle:
        'Our planning desk is available 24/7 for urgent deployments and scheduled infrastructure, construction or event projects.',
      buttonLabel: 'Request a quote',
      buttonHref: '/en/request-quote',
      secondaryButtonLabel: 'Contact us directly',
    },
  },
  servicesOverview: {
    seo: {
      title: 'Our Services | Traffic Controllers, Traffic Plans & TVM | Atlas Holland B.V.',
      description:
        'From a single certified traffic controller to turnkey CROW traffic plans, BLVC consultancy and temporary traffic measures across the Netherlands.',
    },
    hero: {
      eyebrow: 'EXPERTISE & CRAFTSMANSHIP',
      titleLine1: 'Our',
      titleLine2: 'services',
      subtitle:
        'From a single certified traffic controller to a turnkey traffic plan — tailored solutions for infrastructure, construction, events and emergencies.',
      image: {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: 'Overview of traffic management and site safety services by Atlas Holland B.V.',
      },
    },
    groups: [
      {
        key: 'operationeel',
        title: 'On-site Operations',
        description:
          'Certified professionals and physical traffic measures deployed directly on your project site.',
      },
      {
        key: 'planning-advies',
        title: 'Planning & Consultancy',
        description:
          'Permit-ready CROW traffic drawings, BLVC logistics plans and dedicated on-site project coordination.',
      },
      {
        key: 'totaaloplossingen',
        title: 'Turnkey Traffic Solutions',
        description:
          'Complete mobility operations for festivals, events, parking venues, convoys and 24/7 emergency response.',
      },
    ],
  },
  projectsOverview: {
    seo: {
      title: 'Our Projects & Case Studies | Infra, Construction & Events | Atlas Holland B.V.',
      description:
        'Explore delivered traffic management projects by Atlas Holland B.V.: intersection reconstructions, inner-city BLVC logistics, festival mobility and 24/7 emergency response.',
    },
    hero: {
      eyebrow: 'OUR PROJECTS',
      titleLine1: 'Delivered',
      titleLine2: 'projects',
      subtitle:
        'Discover how we support municipalities, civil contractors, construction groups, utilities and event organisers across the Netherlands with certified staff and smart traffic measures.',
      image: {
        url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
        alt: 'Completed traffic management and infrastructure projects by Atlas Holland B.V.',
      },
    },
    categories: [
      'All',
      'Infra & Roadworks',
      'Construction',
      'Events',
      'Emergency Response',
      'Traffic Plans',
    ],
    ctaHeadline: 'Preparing a similar project? Discuss your phasing directly with our planners.',
    ctaButtonLabel: 'Request a quote',
  },
  courses: {
    seo: {
      title: 'Training & Academy | Traffic Controller, BRL 9101 & VCA | Atlas Holland B.V.',
      description:
        'Accredited practical training courses at Atlas Holland B.V.: become a certified professional traffic controller, BRL 9101 specialist or obtain your VCA diploma.',
    },
    hero: {
      eyebrow: 'ATLAS HOLLAND ACADEMY',
      titleLine1: 'Practical',
      titleLine2: 'training & courses',
      subtitle:
        'Invest in certified safety on site. Recognised training programs for aspiring traffic controllers, construction staff and civil site coordinators.',
      image: {
        url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
        alt: 'Practical traffic management and safety training at Atlas Holland B.V.',
      },
    },
    introEyebrow: 'ACCREDITED PRACTICAL TRAINING',
    introTitleLine1: 'Our',
    introTitleLine2: 'training programs',
    introText:
      'Safe execution starts with solid practical training. Whether you want to start a career at Atlas Holland as a certified traffic controller or train your own field staff in BRL 9101, VCA or BHV: our instructors teach from real-world street experience.',
    formEyebrow: 'ENROL DIRECTLY',
    formTitleLine1: 'Register for a',
    formTitleLine2: 'training course',
    formSubtitle:
      'Register yourself or your team members below. Our training coordinator will contact you within 24 hours to confirm the next available start dates and location.',
    formSuccessTitle: 'Thank you for your registration!',
    formSuccessMessage:
      'We have received your course registration. Our training coordinator will contact you within 24 hours.',
    ctaHeadline: 'Want to train multiple employees at once or schedule an in-company course?',
    ctaButtonLabel: 'Request an in-company training proposal',
    courses: [
      {
        id: 'opleiding-verkeersregelaar',
        title: 'Professional Traffic Controller Course (National Appointment)',
        duration: '3 days + practical exam',
        audience: 'Aspiring professional traffic controllers, construction gatekeepers and career switchers',
        description:
          'Complete theoretical and practical street training compliant with SVNL guidelines, preparing you for the official exam and national appointment pass (Landelijke Aanstellingspas).',
        highlights: [
          'Theory (e-learning + classroom instruction) & real intersection practice',
          'Official SVNL examination for the National Appointment Pass',
          'Job guarantee at Atlas Holland B.V. upon successful completion',
        ],
        image: {
          url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
          alt: 'Professional Traffic Controller Course',
        },
        active: true,
        displayOrder: 1,
      },
      {
        id: 'brl-9101',
        title: 'BRL 9101 — Temporary Traffic Measures Specialist',
        duration: '2 days + examination',
        audience: 'Field technicians, road workers and traffic project coordinators',
        description:
          'Learn how to safely place, inspect, maintain and remove temporary traffic measures along public roads in compliance with CROW 96a/96b and BRL 9101.',
        highlights: [
          'Practical application of CROW 96a & 96b guidelines',
          'Safe placement and dismantling sequences in live traffic',
          'Recognised KIWA / BRL 9101 certificate upon passing',
        ],
        image: {
          url: '/assets/images/atlas_tijdelijke_verkeersmaatregelen_1794215801255.jpg',
          alt: 'BRL 9101 Temporary Traffic Measures Course',
        },
        active: true,
        displayOrder: 2,
      },
      {
        id: 'vca-basis-vol',
        title: 'VCA Basic & VCA-VOL (Safety for Operational Supervisors)',
        duration: '1 day + exam',
        audience: 'Traffic controllers, construction staff, gatekeepers and site supervisors',
        description:
          'Essential safety certification for working safely on construction, infrastructure and industrial sites across the Netherlands.',
        highlights: [
          'Classroom preparation day including official VCA exam at the end of the day',
          'Available for both VCA Basic (B-VCA) and VCA-VOL',
          'Official diploma valid for 10 years and registered in the Central Diploma Register',
        ],
        image: {
          url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
          alt: 'VCA Basic and VCA-VOL Course',
        },
        active: true,
        displayOrder: 3,
      },
      {
        id: 'bhv',
        title: 'Company Emergency Response (BHV Basic & Refresher)',
        duration: '1 day',
        audience: 'Field coordinators, construction gatekeepers and event staff',
        description:
          'Hands-on training in first aid, CPR/AED use, incipient fire fighting and safe evacuation procedures on site.',
        highlights: [
          'Hands-on CPR, AED operation and life-saving first aid',
          'Fire extinguishing practice and incident evacuation drills',
          'Official BHV certificate issued immediately upon completion',
        ],
        image: {
          url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
          alt: 'BHV Emergency Response Training',
        },
        active: true,
        displayOrder: 4,
      },
    ],
  },
  about: {
    seo: {
      title: 'About Atlas Holland B.V. | Our Story, Mission & Team',
      description:
        'Meet Atlas Holland B.V.: nationwide specialist in certified traffic controllers, temporary traffic measures, CROW traffic plans and construction site safety.',
    },
    hero: {
      eyebrow: 'ABOUT ATLAS HOLLAND B.V.',
      titleLine1: 'Specialists in traffic',
      titleLine2: 'and on-site safety',
      subtitle:
        'Built on craftsmanship, short communication lines and an unwavering commitment to road safety across the Netherlands.',
      image: {
        url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
        alt: 'The Atlas Holland B.V. operations and field team',
      },
    },
    story: {
      eyebrow: 'OUR STORY & MISSION',
      heading: 'Safety outdoors starts with people who take ownership.',
      paragraphs: [
        'Atlas Holland B.V. was founded on one clear conviction: traffic safety around construction and infrastructure projects requires far more than just a high-visibility vest or a sign by the roadside. It demands certified professionals who feel ownership of their post, planners who think ahead with the site manager, and commitments you can rely on 24/7.',
        'What started with deploying certified traffic controllers in the Randstad region has grown into a nationwide partner for temporary traffic measures, CROW traffic plans, BLVC consultancy, construction gatekeepers and project coordination.',
        'Whether it is a 2:00 AM emergency utility closure, a high-rise construction gate in central Rotterdam or a three-day festival with 35,000 visitors: with Atlas Holland you always have direct contact with specialists who know what happens outdoors on the street.',
      ],
    },
    allUnderOneRoof: {
      eyebrow: 'TURNKEY EXPERTISE',
      titleLine1: 'From initial drawing to the final barrier',
      titleLine2: 'all under one roof',
      description:
        'Why coordinate three separate suppliers when one partner can engineer the traffic plan, install the CROW signage and staff the intersection with certified controllers?',
      items: [
        'Traffic engineering, CROW 96a/96b signage drawings & BLVC plans',
        'Supply, placement and maintenance of temporary traffic measures (TVM)',
        'Nationally certified traffic controllers, construction gatekeepers & tram safety officers',
        '24/7 central dispatch desk and dedicated on-site project coordination',
      ],
    },
    coreValues: [
      {
        title: 'Safety First',
        description:
          'We never cut corners on CROW guidelines, VCA protocols or protective equipment — for road workers and road users alike.',
        iconName: 'ShieldCheck',
      },
      {
        title: 'Reliability & Punctuality',
        description:
          'A deal is a deal. Our people arrive on site on time, fully briefed and properly equipped.',
        iconName: 'Clock',
      },
      {
        title: 'Hospitable Authority',
        description:
          'Clear, decisive traffic directions delivered with a friendly, de-escalating attitude toward drivers, cyclists and residents.',
        iconName: 'Users',
      },
      {
        title: '24/7 Flexibility',
        description:
          'Projects change and emergencies happen unexpectedly. Our planning desk adapts immediately.',
        iconName: 'Zap',
      },
    ],
    pillars: [
      {
        number: '01',
        title: 'Plan & Advise',
        subtitle: 'CROW & BLVC Engineering',
        description:
          'CROW 96a/96b traffic plans, BLVC construction logistics and permit coordination with road authorities.',
      },
      {
        number: '02',
        title: 'Equip & Protect',
        subtitle: 'Temporary Traffic Measures',
        description:
          'Complete placement of road barriers, delineation beacons, RVV signage and LED variable message trailers.',
      },
      {
        number: '03',
        title: 'Staff & Coordinate',
        subtitle: 'Certified Field Specialists',
        description:
          'Certified traffic controllers, construction gatekeepers, tram safety officers and on-site project coordinators.',
      },
    ],
    teamSection: {
      eyebrow: 'THE PEOPLE BEHIND ATLAS',
      titleLine1: 'Our',
      titleLine2: 'operations & planning team',
      subtitle:
        'Dedicated points of contact for 24/7 dispatch, traffic engineering and field coordination.',
      members: [
        {
          id: 'tm-1',
          name: 'Daan van Vliet',
          role: 'Managing Director',
          email: 'info@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
            alt: 'Daan van Vliet — Managing Director',
          },
          visible: true,
          displayOrder: 1,
        },
        {
          id: 'tm-2',
          name: 'Sanne Vermeer',
          role: 'Operations Manager',
          email: 'info@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
            alt: 'Sanne Vermeer — Operations Manager',
          },
          visible: true,
          displayOrder: 2,
        },
        {
          id: 'tm-3',
          name: 'Bram Hoekstra',
          role: 'Head of 24/7 Dispatch & Planning',
          email: 'info@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
            alt: 'Bram Hoekstra — Head of 24/7 Dispatch & Planning',
          },
          visible: true,
          displayOrder: 3,
        },
        {
          id: 'tm-4',
          name: 'Laura Meijer',
          role: 'Lead Traffic Engineer / BLVC',
          email: 'info@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
            alt: 'Laura Meijer — Lead Traffic Engineer / BLVC',
          },
          visible: true,
          displayOrder: 4,
        },
        {
          id: 'tm-5',
          name: 'Karim El Amrani',
          role: 'Senior Field Project Coordinator',
          email: 'info@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
            alt: 'Karim El Amrani — Senior Field Project Coordinator',
          },
          visible: true,
          displayOrder: 5,
        },
        {
          id: 'tm-6',
          name: 'Romy Bakker',
          role: 'Recruiter & Academy Coordinator',
          email: 'werkenbij@atlasholland.nl',
          linkedinUrl: 'https://linkedin.com',
          image: {
            url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
            alt: 'Romy Bakker — Recruiter & Academy Coordinator',
          },
          visible: true,
          displayOrder: 6,
        },
      ],
    },
  },
  careers: {
    seo: {
      title: 'Careers at Atlas Holland B.V. | Become a Traffic Controller or Gatekeeper',
      description:
        'Join Atlas Holland B.V.! View our open vacancies for traffic controllers (paid training available), construction gatekeepers, event staff and project coordinators.',
    },
    hero: {
      eyebrow: 'CAREERS AT ATLAS HOLLAND',
      titleLine1: 'Join our team.',
      titleLine2: 'Keep the Netherlands moving safely.',
      subtitle:
        'Good pay, paid official training, premium gear and a close-knit team that has your back. Discover our vacancies and apply in 1 minute.',
      buttonLabel: 'View open vacancies',
      image: {
        url: '/assets/images/atlas_team_werken_bij_1794215805378.jpg',
        alt: 'Careers as a traffic controller at Atlas Holland B.V.',
      },
    },
    whyAtlas: [
      {
        title: 'Strong Hourly Pay & Allowances',
        description:
          'Earn between € 16.50 and € 21.50 gross per hour plus attractive bonuses for evening, night and weekend shifts.',
        iconName: 'Wallet',
      },
      {
        title: 'Paid Official Training',
        description:
          'No certificate yet? We pay for your official SVNL Traffic Controller course and VCA diploma.',
        iconName: 'GraduationCap',
      },
      {
        title: 'Flexible or Fixed Schedule',
        description:
          'Choose full-time stability on long-running construction projects or flexible part-time/weekend shifts.',
        iconName: 'CalendarCheck',
      },
      {
        title: 'Premium Gear & Mobility',
        description:
          'Full four-season RWS high-visibility workwear package, travel allowance or a company car for full-time roles.',
        iconName: 'Car',
      },
    ],
    traits: [
      {
        title: 'At least 18 years old & outdoor-minded',
        description: 'You enjoy working outdoors in a dynamic environment with real responsibility.',
      },
      {
        title: 'Calm, clear & hospitable',
        description: 'You stay calm, decisive and friendly even during busy rush-hour moments.',
      },
      {
        title: '100% reliable team player',
        description: 'When you are scheduled on site, your team and client can count on you.',
      },
      {
        title: 'Certified or eager to learn',
        description: 'You hold a Traffic Controller pass or want to complete our paid 3-day training.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Apply in 1 minute',
        description: 'Fill in the short form below — no long cover letter required.',
      },
      {
        number: '02',
        title: 'Phone intro within 24h',
        description: 'Our recruiter Romy calls you within 1 working day to get acquainted.',
      },
      {
        number: '03',
        title: 'Coffee & gear fitting',
        description: 'We discuss your hours, region and fit your complete workwear package (or start your paid training).',
      },
      {
        number: '04',
        title: 'Start outdoors on site!',
        description: 'Your first shift starts alongside an experienced Atlas colleague.',
      },
    ],
    faqs: [
      {
        question: 'Can I apply if I do not have a traffic controller certificate yet?',
        answer:
          'Yes! Through the Atlas Holland Academy we train you in just a few days for your official National Appointment Pass and VCA certificate — completely paid by us.',
      },
      {
        question: 'What does a traffic controller earn at Atlas Holland?',
        answer:
          'Depending on your experience and role, you earn between € 16.50 and € 21.50 gross per hour, excluding holiday pay, travel allowance and evening/weekend bonuses.',
      },
      {
        question: 'Do I need a driving licence?',
        answer:
          'A driving licence B is very helpful (and makes you eligible for a company car on full-time schedules), but for urban and event locations accessible by public transport or carpooling it is not always mandatory.',
      },
    ],
    formSection: {
      eyebrow: 'APPLY DIRECTLY',
      titleLine1: 'Take your first step toward',
      titleLine2: 'the Atlas team today',
      subtitle:
        'Leave your contact details below. We will call you within 24 hours for an informal introduction!',
      successTitle: 'Thank you for your application!',
      successMessage:
        'We have received your application. Our recruiter will call you within 24 hours to get acquainted!',
    },
  },
  quote: {
    seo: {
      title: 'Request a Quote | Response Within 24 Hours | Atlas Holland B.V.',
      description:
        'Request a tailored quote for certified traffic controllers, temporary traffic measures, CROW traffic plans or BLVC consultancy. Clear proposal within 24 hours.',
    },
    hero: {
      eyebrow: 'TAILORED PROPOSAL WITHIN 24 HOURS',
      titleLine1: 'Request a',
      titleLine2: 'quote',
      subtitle:
        'Tell us which services, location and schedule you have in mind. Our planning desk will send you a clear, no-obligation proposal within 24 hours.',
      image: {
        url: '/assets/images/atlas_verkeersplannen_coordinatie_1794215803555.jpg',
        alt: 'Request a quote from Atlas Holland B.V.',
      },
    },
    step1Title: 'Step 1: Which service(s) do you require?',
    step1Subtitle: 'You can select multiple services.',
    step2Title: 'Step 2: Tell us about your project',
    step2Subtitle: 'Where and when can we support your operation?',
    step3Title: 'Step 3: Your contact details',
    step3Subtitle: 'Where should we send your tailored proposal?',
    sidebarBadge: 'Response within 24 hours ✓',
    sidebarTitle: 'Immediate deployment or emergency call-out?',
    sidebarText:
      'Need certified traffic controllers or an emergency road closure today or tonight? Call our 24/7 central dispatch desk directly.',
    sidebarCertificates: [
      'VCA / VCA** certified personnel',
      'BRL 9101 / CROW 96a & 96b compliance',
      'Nationally appointed traffic controllers',
      '24/7 nationwide mobilization',
    ],
    successTitle: 'Thank you! We will contact you within 24 hours.',
    successMessage:
      'Your quote request has been received by our central planning desk. You will receive a tailored proposal within 24 hours.',
  },
  contact: {
    seo: {
      title: 'Contact & 24/7 Emergency Dispatch | Atlas Holland B.V.',
      description:
        'Contact Atlas Holland B.V. in Utrecht. Available 24/7 by phone (+31 85 060 24 70) for urgent traffic controller deployments, quote inquiries and general questions.',
    },
    hero: {
      eyebrow: 'DIRECT CONTACT & 24/7 DISPATCH',
      titleLine1: 'Get in touch with',
      titleLine2: 'Atlas Holland',
      subtitle:
        'Short lines of communication. Call our 24/7 planning desk directly or send us a message below.',
      image: {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: 'Contact Atlas Holland B.V.',
      },
    },
    cardsEyebrow: 'DIRECTLY REACHABLE',
    cardsTitle: 'Our contact details',
    phoneCardLabel: '24/7 Dispatch & Emergency Line',
    phoneCardSubtext: 'Connected day and night directly to our duty traffic planner.',
    formEyebrow: 'SEND A MESSAGE',
    formTitle: 'Ask our team a question',
    formSubtitle: 'Complete the form below and we will get back to you as quickly as possible.',
    formPrivacyNote: 'We only use your details to respond to your inquiry.',
    formSuccessTitle: 'Thank you for your message!',
    formSuccessMessage:
      'We have received your message and typically respond within a few hours (always within 24 hours).',
    mapEyebrow: 'NATIONWIDE COVERAGE FROM CENTRAL NETHERLANDS (UTRECHT)',
  },
  privacy: {
    seo: {
      title: 'Privacy Policy | Atlas Holland B.V.',
      description:
        'Read how Atlas Holland B.V. carefully processes and protects personal data in compliance with the GDPR (AVG) for quotes, training registrations and job applications.',
    },
    eyebrow: 'LEGAL & GDPR COMPLIANCE',
    title: 'Privacy Policy',
    subtitle:
      'How Atlas Holland B.V. protects the personal data of clients, website visitors, course participants and job applicants.',
    lastUpdated: 'November 2026',
    sections: [
      {
        heading: '1. What personal data do we process?',
        body: 'When you use our services or complete a form on this website (such as the quote request form, contact form, training registration form or job application form), we only process the information you voluntarily provide to us:',
        bullets: [
          'First and last name and company/organisation name;',
          'Email address and telephone number;',
          'City of residence or project location;',
          'For job applications: availability, driving licence, experience and optional CV/motivation;',
          'Any additional details you enter in the message or remarks field.',
        ],
      },
      {
        heading: '2. Purposes of processing',
        body: 'We use your personal data exclusively for the following legitimate purposes:',
        bullets: [
          'Preparing and discussing a tailored quote or traffic management schedule;',
          'Answering your questions submitted via the contact form;',
          'Processing your enrolment in a professional training course;',
          'Evaluating and handling your job application at Atlas Holland B.V.',
        ],
      },
      {
        heading: '3. Data retention periods',
        body: 'We do not retain your personal data longer than strictly necessary for the purpose for which it was collected. Application data is deleted within 4 weeks after completion of the recruitment procedure unless you explicitly consent to us keeping your profile on file for up to 1 year.',
      },
      {
        heading: '4. Sharing with third parties',
        body: 'Atlas Holland B.V. never sells your personal data to third parties and only shares data when strictly necessary to execute our agreement with you or to comply with a statutory obligation.',
      },
      {
        heading: '5. Your rights (access, rectification and erasure)',
        body: 'Under the GDPR, you have the right to access, correct or request deletion of your personal data at any time by contacting our general email address.',
      },
    ],
  },
  terms: {
    seo: {
      title: 'Terms & Conditions | Atlas Holland B.V.',
      description:
        'General terms and conditions of Atlas Holland B.V. for the deployment of certified traffic controllers, temporary traffic measures, traffic plans and training.',
    },
    eyebrow: 'LEGAL TERMS',
    title: 'Terms & Conditions',
    subtitle: 'Applicable to all quotations, assignments and services provided by Atlas Holland B.V.',
    lastUpdated: 'November 2026',
    sections: [
      {
        heading: 'Article 1. Applicability',
        body: 'These general terms and conditions apply to all proposals, quotations, assignments and agreements between Atlas Holland B.V. and clients regarding the deployment of traffic controllers, construction gatekeepers, safety officers, temporary traffic measures, traffic plans and training courses.',
      },
      {
        heading: 'Article 2. Quotations and formation of agreement',
        body: 'All quotations issued by Atlas Holland B.V. are non-binding and valid for 30 days unless stated otherwise in writing. An agreement is formed upon written or email confirmation by the client, or as soon as Atlas Holland B.V. commences execution at the client’s request (for example during a 24/7 emergency call-out).',
      },
      {
        heading: 'Article 3. Execution and on-site safety',
        body: 'Atlas Holland B.V. deploys qualified and certified personnel. The client shall ensure timely and accurate information regarding the project location, specific site hazards and applicable municipal permit conditions.',
      },
      {
        heading: 'Article 4. Rescheduling or cancellation of scheduled deployments',
        body: 'If a scheduled deployment changes or is cancelled, the client must notify our central planning desk as soon as possible by phone and email. For cancellations within 24 hours prior to shift start, reserved hours may be invoiced in accordance with the agreed rate schedule.',
      },
      {
        heading: 'Article 5. Full PDF copy of our Terms & Conditions',
        body: 'Would you like to receive the complete PDF version of our general terms and conditions by email? Please contact us via our general email address.',
      },
    ],
  },
};
