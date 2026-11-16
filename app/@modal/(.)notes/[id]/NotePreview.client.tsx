'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Modal from '@/components/Modal/Modal';
import type { Note } from '@/types/note';
import css from './NotePreview.module.css';

interface NotePreviewClientProps {
  id: Note['id'];
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  // the modal is opened by navigation, so closing it returns to the page it was opened from
  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading, please wait...</p>}

      {!isLoading && (error || !note) && <p>Something went wrong.</p>}

      {note && (
        <div className={css.container}>
          <div className={css.item}>
            <button type="button" className={css.backBtn} onClick={handleClose}>
              ← Back
            </button>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>
              Created:{' '}
              <time dateTime={note.createdAt}>
                {formatDate(note.createdAt)}
              </time>
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
