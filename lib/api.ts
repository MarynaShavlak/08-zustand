import axios from 'axios';
import type { NewNote, Note, NoteTag } from '@/types/note';

const notehubApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const NOTES_PER_PAGE = 12;

export const fetchNotes = async ({
  page,
  perPage = NOTES_PER_PAGE,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await notehubApi.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search: search?.trim() || undefined,
      // without a tag the backend returns notes with any tag
      tag,
    },
  });

  return response.data;
};

export const fetchNoteById = async (noteId: Note['id']): Promise<Note> => {
  const response = await notehubApi.get<Note>(`/notes/${noteId}`);

  return response.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const response = await notehubApi.post<Note>('/notes', newNote);

  return response.data;
};

export const deleteNote = async (noteId: Note['id']): Promise<Note> => {
  const response = await notehubApi.delete<Note>(`/notes/${noteId}`);

  return response.data;
};
