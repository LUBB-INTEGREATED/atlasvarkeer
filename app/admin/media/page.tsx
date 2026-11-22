'use client';

import React, { useState } from 'react';
import {
  Upload,
  Search,
  Copy,
  Trash2,
  Check,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { MediaAsset } from '@/cms/types';
import { AdminShell } from '@/components/admin/AdminShell';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export default function AdminMediaPage() {
  const { media, uploadMedia, updateMediaAlt, deleteMedia, showToast } = useCms();
  const { t } = useAdminT();

  const [searchQuery, setSearchQuery] = useState('');
  const [compressLarge, setCompressLarge] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);

  const filtered = media.filter((m) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      m.filename.toLowerCase().includes(q) || m.alt.toLowerCase().includes(q)
    );
  });

  const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadMedia(
          files[i],
          files[i].name.replace(/\.[^.]+$/, ''),
          compressLarge
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopiedId(asset.id);
      showToast(t.media.copiedToast, 'info');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast(t.media.copyFailedToast, 'error');
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-atlas-orange">
              {t.media.eyebrow}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-atlas-black">
              {t.media.title} ({media.length} {t.media.filesUnit})
            </h1>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-atlas-orange rounded-2xl p-8 bg-atlas-grey/40 cursor-pointer transition-colors text-center">
            <Upload className="w-8 h-8 text-atlas-orange mb-2" />
            <span className="text-base font-extrabold text-atlas-black">
              {isUploading ? t.media.uploadingText : t.media.uploadPrompt}
            </span>
            <span className="text-xs text-neutral-500 mt-1">
              {t.media.supportedFormats}
            </span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={handleMultiUpload}
              className="sr-only"
            />
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-xs sm:text-sm text-atlas-ink cursor-pointer">
              <input
                type="checkbox"
                checked={compressLarge}
                onChange={(e) => setCompressLarge(e.target.checked)}
                className="rounded text-atlas-orange"
              />
              <span>{t.media.compressLabel}</span>
            </label>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.media.searchPlaceholder}
                className="w-full rounded-xl border border-neutral-300 pl-9 pr-3 py-2 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-neutral-100 overflow-hidden relative border-b border-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.alt || asset.filename}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-atlas-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {asset.width}×{asset.height} ·{' '}
                    {Math.round(asset.sizeBytes / 1024)} KB
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs font-extrabold text-atlas-black truncate">
                    {asset.filename}
                  </p>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      {t.media.defaultAltLabel}
                    </label>
                    <input
                      type="text"
                      defaultValue={asset.alt}
                      onBlur={(e) => {
                        if (e.target.value !== asset.alt) {
                          updateMediaAlt(asset.id, e.target.value);
                        }
                      }}
                      placeholder={t.media.altPlaceholder}
                      className="w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs text-atlas-black focus:border-atlas-orange focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(asset)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-atlas-black hover:text-atlas-orange bg-atlas-grey px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.media.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-atlas-orange" />
                      <span>{t.media.copyUrl}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAssetToDelete(asset)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title={t.common.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(assetToDelete)}
        title={t.media.deleteTitle}
        description={`${t.media.deleteDescPrefix} "${assetToDelete?.filename}" ${t.media.deleteDescSuffix}`}
        onCancel={() => setAssetToDelete(null)}
        onConfirm={async () => {
          if (assetToDelete) {
            await deleteMedia(assetToDelete.id);
            setAssetToDelete(null);
          }
        }}
      />
    </AdminShell>
  );
}
