'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  FolderOpen,
  Link2,
  X,
  Check,
  Search,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { CmsImage } from '@/cms/types';

interface ImageFieldProps {
  label: string;
  value: CmsImage;
  onChange: (next: CmsImage) => void;
  aspectHint?: string;
  compact?: boolean;
}

export function ImageField({
  label,
  value,
  onChange,
  aspectHint,
  compact = false,
}: ImageFieldProps) {
  const { media, uploadMedia } = useCms();
  const { t } = useAdminT();
  const resolvedAspectHint = aspectHint ?? t.imageField.defaultAspectHint;

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrl, setCustomUrl] = useState(value?.url || '');
  const [customAlt, setCustomAlt] = useState(value?.alt || '');
  const [compressLarge, setCompressLarge] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const safeValue: CmsImage = {
    url: value?.url || '',
    alt: value?.alt || '',
  };

  const filteredMedia = media.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.filename.toLowerCase().includes(q) ||
      item.alt.toLowerCase().includes(q)
    );
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const asset = await uploadMedia(file, safeValue.alt || file.name, compressLarge);
      onChange({
        url: asset.url,
        alt: safeValue.alt || asset.alt,
      });
      setModalOpen(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-atlas-grey/60 rounded-xl p-4 border border-neutral-200/90 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm font-bold text-atlas-black">
          {label}
        </span>
        {resolvedAspectHint && (
          <span className="text-[11px] font-medium text-neutral-500 bg-white px-2.5 py-0.5 rounded-md border border-neutral-200">
            {resolvedAspectHint}
          </span>
        )}
      </div>

      <div
        className={`grid grid-cols-1 ${
          compact ? 'sm:grid-cols-12' : 'sm:grid-cols-12'
        } gap-4 items-start`}
      >
        {/* Thumbnail Preview */}
        <div className="sm:col-span-4 aspect-[16/10] rounded-lg overflow-hidden bg-neutral-200 border border-neutral-300 relative group">
          {safeValue.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={safeValue.url}
              alt={safeValue.alt || label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1" />
              <span className="text-[11px]">{t.imageField.noImage}</span>
            </div>
          )}
        </div>

        {/* Controls & Alt Text */}
        <div className="sm:col-span-8 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCustomUrl(safeValue.url);
                setCustomAlt(safeValue.alt);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-atlas-orange-soft text-atlas-black hover:text-atlas-orange border border-neutral-300 hover:border-atlas-orange text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-atlas-orange" />
              <span>{t.imageField.changeOrUpload}</span>
            </button>

            <label className="inline-flex items-center gap-1.5 bg-atlas-orange hover:bg-atlas-orange-dark text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>
                {isUploading
                  ? t.imageField.uploading
                  : t.imageField.directUpload}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              {t.imageField.altLabel}
            </label>
            <input
              type="text"
              value={safeValue.alt}
              onChange={(e) => onChange({ ...safeValue, alt: e.target.value })}
              placeholder={t.imageField.altPlaceholder}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs sm:text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* IMAGE PICKER MODAL */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.imageField.modalAria}
          className="fixed inset-0 z-50 bg-atlas-black/65 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-atlas-black">
                  {t.imageField.modalTitlePrefix} {label}
                </h3>
                <p className="text-xs text-neutral-500">{resolvedAspectHint}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-atlas-black hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 pt-3 border-b border-neutral-200 flex items-center gap-2 bg-atlas-grey/50">
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'library'
                    ? 'border-atlas-orange text-atlas-orange bg-white rounded-t-lg'
                    : 'border-transparent text-neutral-600 hover:text-atlas-black'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                <span>
                  {t.imageField.tabLibrary} ({media.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'upload'
                    ? 'border-atlas-orange text-atlas-orange bg-white rounded-t-lg'
                    : 'border-transparent text-neutral-600 hover:text-atlas-black'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>{t.imageField.tabUpload}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'url'
                    ? 'border-atlas-orange text-atlas-orange bg-white rounded-t-lg'
                    : 'border-transparent text-neutral-600 hover:text-atlas-black'
                }`}
              >
                <Link2 className="w-4 h-4" />
                <span>{t.imageField.tabUrl}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'library' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.imageField.searchPlaceholder}
                      className="w-full rounded-xl border border-neutral-300 pl-10 pr-4 py-2.5 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredMedia.map((asset) => {
                      const isSelected = safeValue.url === asset.url;
                      return (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => {
                            onChange({
                              url: asset.url,
                              alt: safeValue.alt || asset.alt,
                            });
                            setModalOpen(false);
                          }}
                          className={`group text-left rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-atlas-orange ring-2 ring-atlas-orange/25'
                              : 'border-neutral-200 hover:border-atlas-orange'
                          }`}
                        >
                          <div className="aspect-[16/10] bg-neutral-100 relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={asset.url}
                              alt={asset.alt || asset.filename}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {isSelected && (
                              <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-atlas-orange text-white flex items-center justify-center shadow">
                                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                              </span>
                            )}
                          </div>
                          <div className="p-2.5 bg-white">
                            <p className="text-xs font-bold text-atlas-black truncate">
                              {asset.filename}
                            </p>
                            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                              {asset.alt || t.imageField.noAlt}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-atlas-orange rounded-2xl p-10 bg-atlas-grey/40 cursor-pointer transition-colors text-center">
                    <Upload className="w-10 h-10 text-atlas-orange mb-3" />
                    <span className="text-base font-extrabold text-atlas-black">
                      {isUploading
                        ? t.imageField.processing
                        : t.imageField.dropzonePrompt}
                    </span>
                    <span className="text-xs text-neutral-500 mt-1">
                      {t.imageField.supportedFormats}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </label>

                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-atlas-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compressLarge}
                      onChange={(e) => setCompressLarge(e.target.checked)}
                      className="rounded border-neutral-300 text-atlas-orange focus:ring-atlas-orange"
                    />
                    <span>{t.imageField.compressLabel}</span>
                  </label>
                </div>
              )}

              {activeTab === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-atlas-black mb-1.5">
                      {t.imageField.urlLabel}
                    </label>
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-atlas-black mb-1.5">
                      {t.imageField.customAltLabel}
                    </label>
                    <input
                      type="text"
                      value={customAlt}
                      onChange={(e) => setCustomAlt(e.target.value)}
                      placeholder={t.imageField.customAltPlaceholder}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-atlas-black focus:border-atlas-orange focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrl.trim()) {
                          onChange({
                            url: customUrl.trim(),
                            alt: customAlt.trim(),
                          });
                          setModalOpen(false);
                        }
                      }}
                      className="bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      {t.imageField.applyUrl}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
