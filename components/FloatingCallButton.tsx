'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import { useCms, formatPhoneHref } from '@/cms/CmsContext';

/**
 * Floating "Bel direct" button on mobile viewports (bottom-right, orange, phone icon).
 */
export function FloatingCallButton() {
  const pathname = usePathname();
  const { settings, locale } = useCms();

  if (pathname?.startsWith('/admin') || !settings.phoneDisplay) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 md:hidden">
      <a
        href={formatPhoneHref(settings.phoneDisplay)}
        aria-label={`${locale === 'en' ? 'Call now 24/7' : 'Bel direct 24/7'}: ${settings.phoneDisplay}`}
        className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm px-4 py-3 rounded-full shadow-lg border border-white/20 transition-transform active:scale-95"
      >
        <Phone className="w-4 h-4 shrink-0" strokeWidth={2} />
        <span>{settings.mobileCallLabel || (locale === 'en' ? 'Call now' : 'Bel direct')}</span>
      </a>
    </div>
  );
}
