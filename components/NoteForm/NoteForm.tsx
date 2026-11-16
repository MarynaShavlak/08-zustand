'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createNote } from '@/lib/api';
import { NOTE_TAGS } from '@/lib/constants';
import { useNoteStore } from '@/lib/store/noteStore';
import type { NewNote, NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

type FormErrors = Partial<Record<keyof NewNote, string>>;

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const NoteFormSchema: Yup.ObjectSchema<NewNote> = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),
  content: Yup.string()
    .max(500, 'Content must be at most 500 characters')
    .defined(),
  tag: Yup.mixed<NoteTag>()
    .oneOf(NOTE_TAGS, 'Invalid tag')
    .required('Tag is required'),
});

const getFormErrors = (error: Yup.ValidationError): FormErrors =>
  error.inner.reduce<FormErrors>((errors, { path, message }) => {
    const field = path as keyof NewNote;

    return errors[field] ? errors : { ...errors, [field]: message };
  }, {});

const NOTES_PATH = '/notes/filter/all';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);
  const [errors, setErrors] = useState<FormErrors>({});

  // every visit of the page loads the saved draft (or the initial one) into the form
  useEffect(() => {
    void useNoteStore.persist.rehydrate();
  }, []);

  const goBack = () => {
    // the page can be opened directly by its url, then there is no previous page to return to
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(NOTES_PATH);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // the list the user returns to is inactive now, so it is refetched as well
      queryClient.invalidateQueries({
        queryKey: ['notes'],
        refetchType: 'all',
      });
      clearDraft();
      toast.success('Note created');
    },
    onError: () => {
      toast.error('Failed to create the note. Please try again.');
    },
  });

  const handleChange = (event: ChangeEvent<FieldElement>) => {
    const field = event.target.name as keyof NewNote;

    setDraft({ [field]: event.target.value });
    // the error of the edited field is hidden until the next submit
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
  };

  // React resets a form after its form action, but here every field is controlled by the draft:
  // the reset is cancelled, otherwise the select would show the first tag instead of the saved one
  const handleReset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleSubmit = (formData: FormData) => {
    const values = {
      title: String(formData.get('title') ?? ''),
      content: String(formData.get('content') ?? ''),
      tag: String(formData.get('tag') ?? ''),
    };

    try {
      const newNote = NoteFormSchema.validateSync(values, {
        abortEarly: false,
      });

      setErrors({});
      mutate(newNote, {
        // runs only while the form is still open: after Cancel during the request
        // the user has already returned and must not be sent back once more
        onSuccess: () => goBack(),
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors(getFormErrors(error));
      }
    }
  };

  return (
    <form className={css.form} onReset={handleReset}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          {NOTE_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        {/* the draft stays in the store, so the note can be finished later */}
        <button type="button" className={css.cancelButton} onClick={goBack}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          formAction={handleSubmit}
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
