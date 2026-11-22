'use client';

import React, { useState } from 'react';
import {
  Download,
  Trash2,
  Eye,
  X,
  Mail,
  Phone,
  Calendar,
  Globe,
} from 'lucide-react';
import { useCms, formatMailHref, formatPhoneHref } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { FormSubmission, SubmissionStatus, SubmissionType } from '@/cms/types';
import { AdminShell } from '@/components/admin/AdminShell';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

const PAYLOAD_FIELD_TRANSLATIONS_EN: Record<string, string> = {
  organisatie: 'Organization',
  bedrijf: 'Company',
  locatie: 'Location',
  projectType: 'Project Type',
  diensten: 'Requested Services',
  startDatum: 'Start Date',
  startdatum: 'Start Date',
  duur: 'Duration',
  aantalVerkeersregelaars: 'Number of Traffic Controllers',
  spoed: 'Emergency Deployment',
  toelichting: 'Additional Notes',
  opmerkingen: 'Remarks',
  motivatie: 'Motivation',
  woonplaats: 'City / Residence',
  regio: 'Region',
  rijbewijs: 'Driving Licence',
  ervaring: 'Experience',
  beschikbaarheid: 'Availability',
  vacature: 'Vacancy',
  opleiding: 'Training Course',
  onderwerp: 'Subject',
  bericht: 'Message',
  taal: 'Language',
  language: 'Language',
};

export default function AdminInzendingenPage() {
  const {
    submissions,
    updateSubmissionStatus,
    deleteSubmission,
    showToast,
  } = useCms();
  const { t, isEn } = useAdminT();

  const [typeFilter, setTypeFilter] = useState<'all' | SubmissionType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | SubmissionStatus>(
    'all'
  );
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmission | null>(null);
  const [submissionToDelete, setSubmissionToDelete] =
    useState<FormSubmission | null>(null);

  const typeBadgeLabels: Record<SubmissionType, string> = {
    quote: t.submissions.badgeQuote,
    application: t.submissions.badgeApplication,
    course: t.submissions.badgeCourse,
    contact: t.submissions.badgeContact,
  };

  const statusLabels: Record<SubmissionStatus, string> = {
    new: t.submissions.statusNew,
    in_progress: t.submissions.statusInProgress,
    handled: t.submissions.statusHandled,
  };

  const filtered = submissions.filter((s) => {
    if (typeFilter !== 'all' && s.type !== typeFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  const getSubmissionLang = (sub: FormSubmission): 'NL' | 'EN' => {
    const raw =
      sub.payload?.language ||
      sub.payload?.taal ||
      sub.payload?.locale ||
      'nl';
    return String(raw).toLowerCase().startsWith('en') ? 'EN' : 'NL';
  };

  const formatPayloadKey = (key: string) => {
    if (isEn && PAYLOAD_FIELD_TRANSLATIONS_EN[key]) {
      return PAYLOAD_FIELD_TRANSLATIONS_EN[key];
    }
    return key.replace(/([A-Z])/g, ' $1');
  };

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      showToast(t.submissions.noExportToast, 'info');
      return;
    }

    const headers = isEn
      ? [
          'ID',
          'Date',
          'Type',
          'Status',
          'Language',
          'Name',
          'Email',
          'Phone',
          'Details (JSON)',
        ]
      : [
          'ID',
          'Datum',
          'Type',
          'Status',
          'Taal',
          'Naam',
          'Email',
          'Telefoon',
          'Details (JSON)',
        ];
    const rows = filtered.map((s) => [
      s.id,
      s.createdAt,
      typeBadgeLabels[s.type] || s.type,
      statusLabels[s.status] || s.status,
      getSubmissionLang(s),
      s.name,
      s.email,
      s.phone,
      JSON.stringify(s.payload),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
            .join(',')
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `atlas-holland-submissions-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(t.submissions.exportedToast);
  };

  const dateLocale = isEn ? 'en-GB' : 'nl-NL';

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
              {t.submissions.eyebrow}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-atlas-black">
              {t.submissions.title} ({submissions.length})
            </h1>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-atlas-black border border-neutral-300 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-atlas-orange" />
            <span>{t.submissions.exportCsv}</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { key: 'all', label: t.submissions.filterAllTypes },
                { key: 'quote', label: t.submissions.filterQuotes },
                { key: 'application', label: t.submissions.filterApplications },
                { key: 'course', label: t.submissions.filterCourses },
                { key: 'contact', label: t.submissions.filterContact },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTypeFilter(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  typeFilter === tab.key
                    ? 'bg-atlas-orange text-white'
                    : 'bg-atlas-grey text-neutral-600 hover:text-atlas-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-500">
              {t.submissions.statusLabel}
            </span>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | SubmissionStatus)
              }
              className="rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-atlas-black focus:border-atlas-orange focus:outline-none"
            >
              <option value="all">{t.submissions.filterAllStatuses}</option>
              <option value="new">{t.submissions.statusNew}</option>
              <option value="in_progress">{t.submissions.statusInProgress}</option>
              <option value="handled">{t.submissions.statusHandled}</option>
            </select>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-neutral-500">
              {t.submissions.emptyState}
            </div>
          ) : (
            filtered.map((sub) => {
              const subLang = getSubmissionLang(sub);
              return (
                <div
                  key={sub.id}
                  className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-atlas-grey/30 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase bg-atlas-orange-soft text-atlas-orange px-2.5 py-0.5 rounded">
                        {typeBadgeLabels[sub.type] || sub.type}
                      </span>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                          sub.status === 'new'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : sub.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {statusLabels[sub.status]}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                        <Globe className="w-3 h-3 text-atlas-orange" />
                        {subLang}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(sub.createdAt).toLocaleString(dateLocale, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-atlas-black">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-neutral-600">
                      {sub.email} {sub.phone ? `· ${sub.phone}` : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <select
                      value={sub.status}
                      onChange={(e) =>
                        updateSubmissionStatus(
                          sub.id,
                          e.target.value as SubmissionStatus
                        )
                      }
                      className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-bold text-atlas-black focus:border-atlas-orange focus:outline-none"
                    >
                      <option value="new">{t.submissions.statusNew}</option>
                      <option value="in_progress">
                        {t.submissions.statusInProgress}
                      </option>
                      <option value="handled">
                        {t.submissions.statusHandled}
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(sub)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-atlas-black hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-atlas-orange" />
                      <span>{t.submissions.viewDetails}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubmissionToDelete(sub)}
                      aria-label={t.common.delete}
                      className="p-2 rounded-lg border border-neutral-200 text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SLIDE-OVER DETAIL DRAWER */}
      {selectedSubmission && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-atlas-black/60 backdrop-blur-xs flex justify-end"
        >
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase bg-atlas-orange-soft text-atlas-orange px-2.5 py-0.5 rounded">
                    {typeBadgeLabels[selectedSubmission.type]}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                    <Globe className="w-3 h-3 text-atlas-orange" />
                    {getSubmissionLang(selectedSubmission)}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-atlas-black mt-1">
                  {selectedSubmission.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-atlas-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="bg-atlas-grey rounded-xl p-4 border border-neutral-200 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500">
                    {t.submissions.drawerReceivedOn}
                  </span>
                  <span className="font-semibold text-atlas-black">
                    {new Date(selectedSubmission.createdAt).toLocaleString(
                      dateLocale
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500">
                    {t.submissions.drawerEmail}
                  </span>
                  <a
                    href={formatMailHref(selectedSubmission.email)}
                    className="font-bold text-atlas-orange hover:underline inline-flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedSubmission.email}</span>
                  </a>
                </div>
                {selectedSubmission.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-500">
                      {t.submissions.drawerPhone}
                    </span>
                    <a
                      href={formatPhoneHref(selectedSubmission.phone)}
                      className="font-bold text-atlas-black hover:text-atlas-orange inline-flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-atlas-orange" />
                      <span>{selectedSubmission.phone}</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                  {t.submissions.drawerPayloadTitle}
                </h3>
                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                  {Object.entries(selectedSubmission.payload).map(
                    ([key, val]) => (
                      <div
                        key={key}
                        className="p-3.5 bg-white flex flex-col gap-1"
                      >
                        <span className="text-xs font-bold text-neutral-500 capitalize">
                          {formatPayloadKey(key)}
                        </span>
                        <span className="text-sm font-semibold text-atlas-black whitespace-pre-wrap">
                          {typeof val === 'object'
                            ? JSON.stringify(val, null, 2)
                            : String(val ?? '-')}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 bg-atlas-grey/50 flex items-center justify-between gap-3">
              <select
                value={selectedSubmission.status}
                onChange={(e) => {
                  const nextStatus = e.target.value as SubmissionStatus;
                  updateSubmissionStatus(selectedSubmission.id, nextStatus);
                  setSelectedSubmission({
                    ...selectedSubmission,
                    status: nextStatus,
                  });
                }}
                className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-atlas-black"
              >
                <option value="new">
                  {t.submissions.statusLabel} {t.submissions.statusNew}
                </option>
                <option value="in_progress">
                  {t.submissions.statusLabel} {t.submissions.statusInProgress}
                </option>
                <option value="handled">
                  {t.submissions.statusLabel} {t.submissions.statusHandled}
                </option>
              </select>

              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2.5 rounded-xl bg-atlas-black text-white text-xs font-bold cursor-pointer"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(submissionToDelete)}
        title={t.submissions.deleteTitle}
        description={`${t.submissions.deleteDescPrefix} "${submissionToDelete?.name}" ${t.submissions.deleteDescSuffix}`}
        onCancel={() => setSubmissionToDelete(null)}
        onConfirm={async () => {
          if (submissionToDelete) {
            await deleteSubmission(submissionToDelete.id);
            setSubmissionToDelete(null);
          }
        }}
      />
    </AdminShell>
  );
}
