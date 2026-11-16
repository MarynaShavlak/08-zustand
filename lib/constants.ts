import type { NoteTag } from '@/types/note';

// the backend has no endpoint for the list of tags, so it is kept here
export const NOTE_TAGS: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

// the filter route segment that shows notes with any tag
export const ALL_NOTES_FILTER = 'all';
