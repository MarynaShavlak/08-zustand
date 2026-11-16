import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { NewNote } from '@/types/note';

export const initialDraft: NewNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteStore {
  draft: NewNote;
  setDraft: (note: Partial<NewNote>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'notehub-note-draft',
      storage: createJSONStorage(() => localStorage),
      // only the draft is saved, the functions are created with the store
      partialize: (state) => ({ draft: state.draft }),
      // localStorage exists only in the browser: the draft is restored in NoteForm
      // after hydration, so the server and the first client render show the same form
      skipHydration: true,
    },
  ),
);
