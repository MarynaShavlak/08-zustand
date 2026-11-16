import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Roboto } from 'next/font/google';
import 'modern-normalize/modern-normalize.css';
import './globals.css';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';
import css from './Layout.module.css';

const roboto = Roboto({
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto',
  display: 'swap',
  subsets: ['latin', 'cyrillic'],
});

const title = 'NoteHub';
const description =
  'NoteHub is a simple and efficient application for managing personal notes: create, search and organize your notes by tags.';

export const metadata: Metadata = {
  // relative urls in the metadata of nested pages are resolved against it
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
    type: 'website',
  },
};

interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <TanStackProvider>
          <Header />
          <div className={css.content}>{children}</div>
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
