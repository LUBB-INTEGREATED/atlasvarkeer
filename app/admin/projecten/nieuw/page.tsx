'use client';

import React, { useMemo } from 'react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import { ProjectItem } from '@/cms/types';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProjectEditor } from '@/components/admin/ProjectEditor';

export default function AdminNewProjectPage() {
  const { projects, editLocale } = useCms();
  const { isEn } = useAdminT();
  const useEnDefaults = editLocale === 'en' || isEn;

  const blankProject: ProjectItem = useMemo(
    () => ({
      id: 'proj-new',
      slug: '',
      title: '',
      status: 'draft',
      featured: false,
      displayOrder: projects.length + 1,
      category: useEnDefaults ? 'Infrastructure & Roadworks' : 'Infra & wegenbouw',
      serviceSlugs: [
        useEnDefaults ? 'traffic-controllers' : 'verkeersregelaars',
      ],
      clientName: useEnDefaults ? 'On request' : 'Op aanvraag',
      location: '',
      period: '2026',
      deploymentSummary: useEnDefaults
        ? 'Certified traffic controllers · TVM'
        : 'Gecertificeerde verkeersregelaars · TVM',
      summary: '',
      challenge: '',
      approach: '',
      result: '',
      highlights: useEnDefaults
        ? [
            '100% CROW 96b-compliant execution and signage',
            '24/7 availability and dedicated project coordinator',
          ]
        : [
            '100% CROW 96b-conforme uitvoering en bebakening',
            '24/7 bereikbaarheid en vaste projectcoördinator',
          ],
      metrics: useEnDefaults
        ? [
            { value: '24/7', label: 'Continuous staffing & coordination' },
            { value: '0', label: 'Safety incidents' },
          ]
        : [
            { value: '24/7', label: 'Continue bezetting & regie' },
            { value: '0', label: 'Veiligheidsincidenten' },
          ],
      coverImage: {
        url: '/assets/images/atlas_hero_verkeersregelaars_1794215800416.jpg',
        alt: useEnDefaults
          ? 'New project Atlas Holland B.V.'
          : 'Nieuw project Atlas Holland B.V.',
      },
      gallery: [],
      quote: {
        text: '',
        author: '',
        role: '',
        organisation: '',
      },
      seo: {
        title: '',
        description: '',
      },
      publishedAt: '',
      createdAt: '',
      updatedAt: '',
    }),
    [projects.length, useEnDefaults]
  );

  return (
    <AdminShell>
      <ProjectEditor
        key={`new-${editLocale}`}
        initialProject={blankProject}
        isNew
      />
    </AdminShell>
  );
}
