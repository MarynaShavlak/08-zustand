import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/notes';
import { ALL_NOTES_FILTER } from '@/lib/constants';
import { OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';
import { getTagFromSlug } from '@/lib/utils';
import NotesClient from './Notes.client';

interface FilteredNotesProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: FilteredNotesProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagFromSlug(slug);

  if (tag === null) {
    notFound();
  }

  const title = `Notes: ${tag ?? 'All'} | NoteHub`;
  const description = tag
    ? `Browse your NoteHub notes filtered by the "${tag}" tag.`
    : 'Browse all your NoteHub notes with any tag.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/notes/filter/${tag ?? ALL_NOTES_FILTER}`,
      siteName: SITE_NAME,
      images: [OG_IMAGE],
      type: 'website',
    },
  };
}

export default async function FilteredNotes({ params }: FilteredNotesProps) {
  const { slug } = await params;
  const tag = getTagFromSlug(slug);

  // unknown tags are already answered with 404 in proxy.ts, this keeps the page safe on its own
  if (tag === null) {
    notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag ?? ALL_NOTES_FILTER, 1, ''],
    queryFn: () => fetchNotes({ page: 1, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* the key resets the page and the search when another tag is selected */}
      <NotesClient key={tag ?? ALL_NOTES_FILTER} tag={tag} />
    </HydrationBoundary>
  );
}
