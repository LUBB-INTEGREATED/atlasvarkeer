'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProjectEditor } from '@/components/admin/ProjectEditor';

export default function AdminEditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { projects, editLocale } = useCms();
  const { t } = useAdminT();

  const project = projects.find((p) => p.id === id || p.slug === id);

  return (
    <AdminShell>
      {!project ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-10 text-center space-y-4">
          <h1 className="text-xl font-extrabold text-atlas-black">
            {t.projects.notFoundTitle}
          </h1>
          <Link
            href="/admin/projecten"
            className="inline-flex items-center gap-2 text-sm font-bold text-atlas-orange hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.projects.backToOverview}</span>
          </Link>
        </div>
      ) : (
        <ProjectEditor
          key={`${project.id}-${editLocale}`}
          initialProject={project}
        />
      )}
    </AdminShell>
  );
}
