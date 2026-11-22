import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import './globals.css';
import { DEFAULT_SETTINGS } from '@/cms/defaultContent';
import { CmsProvider } from '@/cms/CmsContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCallButton } from '@/components/FloatingCallButton';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: DEFAULT_SETTINGS.defaultSeo.title,
  description: DEFAULT_SETTINGS.defaultSeo.description,
  openGraph: {
    title: DEFAULT_SETTINGS.defaultSeo.title,
    description: DEFAULT_SETTINGS.defaultSeo.description,
    type: 'website',
    locale: 'nl_NL',
    siteName: DEFAULT_SETTINGS.companyName,
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_SETTINGS.defaultSeo.title,
    description: DEFAULT_SETTINGS.defaultSeo.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: DEFAULT_SETTINGS.companyName,
    description: DEFAULT_SETTINGS.defaultSeo.description,
    telephone: DEFAULT_SETTINGS.phoneDisplay,
    email: DEFAULT_SETTINGS.emailGeneral,
    address: {
      '@type': 'PostalAddress',
      streetAddress: DEFAULT_SETTINGS.addressStreet,
      addressLocality: DEFAULT_SETTINGS.addressPostalCity,
      addressCountry: 'NL',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nederland',
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

  return (
    <html lang="nl" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-white text-atlas-ink antialiased selection:bg-atlas-orange selection:text-white"
      >
        <CmsProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCallButton />
        </CmsProvider>
      </body>
    </html>
  );
}
