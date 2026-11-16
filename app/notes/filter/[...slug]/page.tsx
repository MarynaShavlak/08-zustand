import { notFound } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { ALL_NOTES_FILTER } from '@/lib/constants';
import { getTagFromSlug } from '@/lib/utils';
import NotesClient from './Notes.client';

interface FilteredNotesProps {
  params: Promise<{ slug: string[] }>;
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
