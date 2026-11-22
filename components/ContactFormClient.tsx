'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { getLocalizedPath } from '@/i18n/routes';

export function ContactFormClient() {
  const { pages, submitPublicForm, locale } = useCms();
  const contact = pages.contact;

  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [telefoon, setTelefoon] = useState('');
  const [bedrijf, setBedrijf] = useState('');
  const [bericht, setBericht] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!naam.trim())
      newErrors.naam = locale === 'en' ? 'Enter your name.' : 'Vul uw naam in.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email =
        locale === 'en'
          ? 'Enter a valid email address.'
          : 'Vul een geldig e-mailadres in.';
    }
    if (!bericht.trim()) {
      newErrors.bericht =
        locale === 'en'
          ? 'Enter your question or message.'
          : 'Vul uw vraag of bericht in.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await submitPublicForm({
      type: 'contact',
      name: naam.trim(),
      email: email.trim(),
      phone: telefoon.trim(),
      payload: {
        bedrijf: bedrijf.trim() || undefined,
        bericht: bericht.trim(),
      },
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-atlas-orange-soft border-2 border-atlas-orange rounded-[22px] p-8 sm:p-10 text-center space-y-4"
      >
        <div className="w-14 h-14 rounded-full bg-atlas-orange text-white flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" strokeWidth={2} />
        </div>
        <h3 className="text-2xl font-extrabold text-atlas-black">
          {contact.formSuccessTitle}
        </h3>
        <p className="text-base text-atlas-ink max-w-md mx-auto leading-relaxed">
          {contact.formSuccessMessage}
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setNaam('');
            setEmail('');
            setTelefoon('');
            setBedrijf('');
            setBericht('');
          }}
          className="inline-flex items-center gap-2 text-sm font-bold text-atlas-orange hover:underline pt-2"
        >
          {locale === 'en' ? 'Send another message' : 'Nieuw bericht versturen'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="contact-naam"
            className="block text-sm font-bold text-atlas-black mb-2"
          >
            {locale === 'en' ? 'Name' : 'Naam'} <span className="text-atlas-orange">*</span>
          </label>
          <input
            id="contact-naam"
            type="text"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            placeholder={
              locale === 'en' ? 'Your first and last name' : 'Uw voor- en achternaam'
            }
            className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm sm:text-base text-atlas-black focus:outline-none focus:ring-2 ${
              errors.naam
                ? 'border-red-600 focus:ring-red-600/20'
                : 'border-neutral-300 focus:border-atlas-orange focus:ring-atlas-orange/20'
            }`}
          />
          {errors.naam && (
            <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.naam}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-bold text-atlas-black mb-2"
          >
            {locale === 'en' ? 'E-mail address' : 'E-mailadres'}{' '}
            <span className="text-atlas-orange">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={locale === 'en' ? 'name@company.nl' : 'naam@bedrijf.nl'}
            className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm sm:text-base text-atlas-black focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-red-600 focus:ring-red-600/20'
                : 'border-neutral-300 focus:border-atlas-orange focus:ring-atlas-orange/20'
            }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="contact-telefoon"
            className="block text-sm font-bold text-atlas-black mb-2"
          >
            {locale === 'en' ? 'Phone number' : 'Telefoonnummer'}
          </label>
          <input
            id="contact-telefoon"
            type="tel"
            value={telefoon}
            onChange={(e) => setTelefoon(e.target.value)}
            placeholder="06 - 12345678"
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm sm:text-base text-atlas-black focus:border-atlas-orange focus:outline-none focus:ring-2 focus:ring-atlas-orange/20"
          />
        </div>

        <div>
          <label
            htmlFor="contact-bedrijf"
            className="block text-sm font-bold text-atlas-black mb-2"
          >
            {locale === 'en' ? 'Company / organisation' : 'Bedrijf / organisatie'}
          </label>
          <input
            id="contact-bedrijf"
            type="text"
            value={bedrijf}
            onChange={(e) => setBedrijf(e.target.value)}
            placeholder={locale === 'en' ? 'Your company name' : 'Uw bedrijfsnaam'}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm sm:text-base text-atlas-black focus:border-atlas-orange focus:outline-none focus:ring-2 focus:ring-atlas-orange/20"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-bericht"
          className="block text-sm font-bold text-atlas-black mb-2"
        >
          {locale === 'en' ? 'Your message or question' : 'Uw bericht of vraag'}{' '}
          <span className="text-atlas-orange">*</span>
        </label>
        <textarea
          id="contact-bericht"
          rows={5}
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          placeholder={
            locale === 'en' ? 'How can we help you?' : 'Waarmee kunnen wij u helpen?'
          }
          className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm sm:text-base text-atlas-black focus:outline-none focus:ring-2 ${
            errors.bericht
              ? 'border-red-600 focus:ring-red-600/20'
              : 'border-neutral-300 focus:border-atlas-orange focus:ring-atlas-orange/20'
          }`}
        />
        {errors.bericht && (
          <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.bericht}</span>
          </p>
        )}
      </div>

      <p className="text-xs text-neutral-500">
        {contact.formPrivacyNote}{' '}
        <Link
          href={getLocalizedPath('privacy', locale)}
          className="text-atlas-orange underline font-medium"
        >
          {locale === 'en' ? 'privacy policy' : 'privacyverklaring'}
        </Link>
        .
      </p>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-base px-8 py-4 rounded-full transition-colors shadow-md cursor-pointer"
      >
        <span>{locale === 'en' ? 'Send message' : 'Verstuur bericht'}</span>
        <ArrowUpRight className="w-5 h-5" strokeWidth={2} />
      </button>
    </form>
  );
}
