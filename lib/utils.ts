import type { NoteTag } from '@/types/note';
import { ALL_NOTES_FILTER, NOTE_TAGS } from './constants';

// a fixed time zone keeps the server and client markup identical during hydration
export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

const isNoteTag = (value: string): value is NoteTag =>
  NOTE_TAGS.includes(value as NoteTag);

// reads the tag from the /notes/filter/[...slug] segments:
// "all" gives undefined (the request is sent without a tag), an unknown filter gives null
export const getTagFromSlug = (slug: string[]): NoteTag | undefined | null => {
  const [filter] = slug;

  if (slug.length !== 1) {
    return null;
  }

  if (filter === ALL_NOTES_FILTER) {
    return undefined;
  }

  return isNoteTag(filter) ? filter : null;
};
