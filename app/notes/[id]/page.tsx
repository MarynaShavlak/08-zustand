import type { Metadata } from 'next';
import { cache } from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';
import { getExcerpt } from '@/lib/utils';
import NoteDetailsClient from './NoteDetails.client';
import css from './NoteDetails.module.css';

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

// generateMetadata and the page need the same note: the request is made once per render
const getNote = cache(fetchNoteById);

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const url = `${SITE_URL}/notes/${id}`;

  try {
    const note = await getNote(id);
    const title = `${note.title} | NoteHub`;
    const description =
      getExcerpt(note.content) || `Note "${note.title}" in NoteHub.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: SITE_NAME,
        images: [OG_IMAGE],
        type: 'article',
      },
    };
  } catch {
    // the page itself shows the error, the metadata falls back to a general description
    const title = 'Note details | NoteHub';
    const description = 'Details of a note in NoteHub.';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: SITE_NAME,
        images: [OG_IMAGE],
        type: 'article',
      },
    };
  }
}

export default async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => getNote(id),
  });

  return (
    <main className={css.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </main>
  );
}
