import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import { OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';
import css from './CreateNote.module.css';

const title = 'Create note | NoteHub';
const description =
  'Create a new note in NoteHub: add a title, write the content and choose a tag. The unsaved draft is kept until the note is created.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/notes/action/create`,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
    type: 'website',
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
