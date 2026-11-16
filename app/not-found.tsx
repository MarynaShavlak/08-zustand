import type { Metadata } from 'next';
import { OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';
import css from './Home.module.css';

const title = '404 - Page not found | NoteHub';
const description =
  'Sorry, the page you are looking for does not exist in NoteHub.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/not-found`,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
    type: 'website',
  },
};

export default function NotFound() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>404 - Page not found</h1>
        <p className={css.description}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}
